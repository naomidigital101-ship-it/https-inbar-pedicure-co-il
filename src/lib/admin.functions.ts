import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const BootstrapInput = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("user_id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  return { exists: (count ?? 0) > 0 };
});

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => BootstrapInput.parse(data))
  .handler(async ({ data }) => {
    // Only allowed if no admin exists yet
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      throw new Error("כבר קיים מנהל במערכת. ההרשמה הראשונית נסגרה.");
    }

    const email = data.email.trim().toLowerCase();

    // Try to create user (auto-confirmed). If user exists, fetch by listing.
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
    });

    let userId: string | undefined = created?.user?.id;
    if (createErr || !userId) {
      // user might already exist in auth.users — find it
      const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      if (listErr) throw new Error(createErr?.message ?? listErr.message);
      const found = list.users.find((u) => u.email?.toLowerCase() === email);
      if (!found) throw new Error(createErr?.message ?? "Failed to create user");
      userId = found.id;
    }

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr && !roleErr.message.includes("duplicate")) {
      throw new Error(roleErr.message);
    }

    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: Boolean(data) };
  });

export type LeadRow = {
  id: string;
  // ליד יכול להגיע מטופס טלפוני בלי אימייל
  email: string | null;
  source_page: string | null;
  created_at: string;
};

export const getLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ leads: LeadRow[] }> => {
    const { userId } = context;
    const { data: adminRole, error: adminError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (adminError) throw new Error(adminError.message);
    if (!adminRole) throw new Error("Forbidden: admin role required");

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("id, email, source_page, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { leads: data ?? [] };
  });
