import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { ClinicSnapshot } from "./clinic-types";

const db = supabaseAdmin as unknown as SupabaseClient;
async function guard(userId: string) {
  const { data, error } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("אין הרשאת ניהול");
}
const text = z.string().max(10000);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const localDate = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
const id = z.string().uuid();
const photo = z
  .string()
  .max(240)
  .regex(/^[a-f0-9-]+\/(before|after)-[a-f0-9-]+\.(jpeg|png|webp)$/)
  .or(z.literal(""));
const method = z.enum(["מזומן", "העברה", "אשראי", "ביט"]);
const input = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("client"),
    id: id.optional(),
    name: z.string().trim().min(1).max(160),
    phone: z.string().regex(/^\+?[0-9 -]{8,20}$/),
    email: z.string().email().or(z.literal("")),
    birthday: date.or(z.literal("")),
    notes: text,
    health_notes: text,
  }),
  z.object({ action: z.literal("lead"), lead_id: id }),
  z.object({
    action: z.literal("appointment"),
    id,
    client_id: id,
    start_local: localDate,
    duration: z.number().int().min(10).max(240),
    service: z.string().trim().min(1).max(160),
    notes: text,
  }),
  z.object({ action: z.literal("cancel"), id }),
  z.object({
    action: z.literal("visit"),
    id,
    client_id: id,
    appointment_id: id.or(z.literal("")),
    visit_local: localDate,
    service: z.string().trim().min(1).max(160),
    price_cents: z.number().int().min(0).max(10000000),
    paid_cents: z.number().int().min(0).max(10000000),
    method,
    notes: text,
    home_care: text,
    next_visit: date.or(z.literal("")),
    before_path: photo,
    after_path: photo,
  }),
  z.object({
    action: z.literal("payment"),
    id,
    visit_id: id,
    amount_cents: z.number().int().positive().max(10000000),
    method,
  }),
  z.object({ action: z.literal("followup"), id }),
]);
export type ClinicWriteInput = z.input<typeof input>;

export const clinicSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ClinicSnapshot> => {
    await guard(context.userId);
    const tables = [
      "clinic_clients",
      "clinic_appointments",
      "clinic_visits",
      "clinic_payments",
      "clinic_followups",
    ];
    const results = await Promise.all(
      tables.map((table) =>
        db
          .from(table)
          .select("*")
          .order(table === "clinic_appointments" ? "starts_at" : "created_at", { ascending: false })
          .limit(5000),
      ),
    );
    for (const result of results)
      if (result.error) throw new Error("לא ניתן לטעון את ניהול הקליניקה. נסי לרענן בעוד רגע.");
    // Never silently present truncated client balances/history as complete.
    if (results.some((result) => (result.data?.length ?? 0) >= 5000))
      throw new Error("יש נתונים רבים במערכת. נדרשת הרחבת החיפוש לפני הצגתם.");
    return Object.fromEntries(
      ["clients", "appointments", "visits", "payments", "followups"].map((key, i) => [
        key,
        results[i].data ?? [],
      ]),
    ) as ClinicSnapshot;
  });
export const clinicWrite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const parsed = input.safeParse(data);
    if (!parsed.success) throw new Error("בדקי שכל השדות מלאים ושהתאריך, הטלפון והסכומים תקינים.");
    return parsed.data;
  })
  .handler(async ({ context, data }) => {
    await guard(context.userId);
    const { action, ...payload } = data;
    const { data: result, error } = await db.rpc("clinic_write", {
      p_actor: context.userId,
      p_action: action,
      p_data: payload,
    });
    if (error) {
      if (error.code === "23505")
        throw new Error("כבר קיים כרטיס עם מספר הטלפון הזה, או שהפעולה כבר נשמרה.");
      if (error.code === "P0001") throw new Error(error.message);
      throw new Error("השמירה לא הושלמה. הפרטים נשארו בטופס כדי שתוכלי לנסות שוב.");
    }
    return result as { id: string };
  });

export const clinicUploadPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        visit_id: id,
        slot: z.enum(["before", "after"]),
        mime: z.enum(["image/jpeg", "image/png", "image/webp"]),
        base64: z.string().max(2800000),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    await guard(context.userId);
    const bytes = Buffer.from(data.base64, "base64");
    const magic =
      data.mime === "image/jpeg"
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : data.mime === "image/png"
          ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : bytes.subarray(0, 4).toString() === "RIFF" &&
            bytes.subarray(8, 12).toString() === "WEBP";
    if (!magic || bytes.length > 2097152 || bytes.length < 12)
      throw new Error("יש לבחור תמונת JPEG, PNG או WebP עד 2MB.");
    const path = `${data.visit_id}/${data.slot}-${crypto.randomUUID()}.${data.mime.split("/")[1]}`;
    const { error } = await db.storage
      .from("clinic-photos")
      .upload(path, bytes, { contentType: data.mime, upsert: false });
    if (error) throw new Error("התמונה לא הועלתה. נסי שוב.");
    return { path };
  });
export const clinicPhotoUrl = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ path: photo.refine((value) => value.length > 0) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await guard(context.userId);
    const { data: visit, error: lookupError } = await db
      .from("clinic_visits")
      .select("id")
      .or(`before_path.eq.${data.path},after_path.eq.${data.path}`)
      .maybeSingle();
    if (lookupError || !visit) throw new Error("התמונה לא נמצאה");
    const { data: link, error } = await db.storage
      .from("clinic-photos")
      .createSignedUrl(data.path, 600);
    if (error) throw new Error("לא ניתן לפתוח את התמונה");
    return { url: link.signedUrl };
  });
