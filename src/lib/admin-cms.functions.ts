/**
 * פונקציות הכתיבה של מערכת ניהול התוכן.
 * כל פונקציה כאן דורשת התחברות ותפקיד admin — הבדיקה נעשית בשרת,
 * לא ב-UI, כך שגם קריאה ישירה ל-endpoint לא עוקפת אותה.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SERVICES } from "@/lib/services-content";
import { categories as CODE_CATEGORIES } from "@/lib/categories";
import type {
  BeforeAfterRow,
  CategoryRow,
  LeadRow,
  ReviewRow,
  ServiceRow,
  SettingRow,
} from "@/lib/cms-types";

/** שער הרשאות יחיד לכל פעולות הכתיבה. */
async function requireAdmin(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

// ===========================================================================
// הגדרות אתר
// ===========================================================================

export const adminListSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ settings: SettingRow[] }> => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value, group_key, label, input_type, help_text, sort_order")
      .order("group_key", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { settings: (data ?? []) as SettingRow[] };
  });

const SettingsInput = z.object({
  values: z.record(z.string().min(1).max(80), z.string().max(20000)),
});

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SettingsInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    // עדכון בלבד — המפתחות מוגדרים מראש בסכימה, כך שהאדמין לא יכול
    // להזריק מפתחות חדשים שאף קומפוננטה לא קוראת.
    const entries = Object.entries(data.values);
    for (const [key, value] of entries) {
      const { error } = await supabaseAdmin.from("site_settings").update({ value }).eq("key", key);
      if (error) throw new Error(`${key}: ${error.message}`);
    }
    return { ok: true, updated: entries.length };
  });

// ===========================================================================
// טיפולים
// ===========================================================================

export const adminListServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ services: ServiceRow[] }> => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    // jsonb מגיע כ-Json גנרי; הצורה נאכפת ב-ServiceInput בשמירה.
    return { services: (data ?? []) as unknown as ServiceRow[] };
  });

const QuickFact = z.object({ label: z.string().max(200), value: z.string().max(400) });
const SectionTable = z.object({
  headers: z.array(z.string().max(300)).max(10),
  rows: z.array(z.array(z.string().max(2000)).max(10)).max(60),
});
const Section = z.object({
  heading: z.string().max(400),
  body: z.string().max(20000).optional(),
  bullets: z.array(z.string().max(2000)).max(40).optional(),
  cites: z.array(z.number().int()).max(20).optional(),
  table: SectionTable.optional(),
  fromClinic: z.string().max(6000).optional(),
});
const Faq = z.object({ q: z.string().max(600), a: z.string().max(8000) });
const Source = z.object({ label: z.string().max(400), url: z.string().max(1000) });

const ServiceInput = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "מזהה כתובת יכול להכיל אותיות אנגליות קטנות, ספרות ומקפים בלבד"),
  nav_label: z.string().min(1).max(120),
  title: z.string().min(1).max(300),
  subtitle: z.string().max(500).nullable(),
  meta_title: z.string().max(300).nullable(),
  meta_description: z.string().max(500).nullable(),
  h1: z.string().max(300).nullable(),
  canonical: z.string().max(1000).nullable(),
  og_image: z.string().max(1000).nullable(),
  noindex: z.boolean(),
  tldr: z.string().max(4000).nullable(),
  intro: z.string().max(8000).nullable(),
  quick_facts: z.array(QuickFact).max(12),
  sections: z.array(Section).max(30),
  red_flags: z.array(z.string().max(1000)).max(20),
  faqs: z.array(Faq).max(30),
  sources: z.array(Source).max(20),
  hero_image: z.string().max(1000).nullable(),
  card_image: z.string().max(1000).nullable(),
  card_alt: z.string().max(500).nullable(),
  price_text: z.string().max(300).nullable(),
  price_visible: z.boolean(),
  is_flagship: z.boolean(),
  flagship_title: z.string().max(200).nullable(),
  flagship_tag: z.string().max(100).nullable(),
  flagship_sub: z.string().max(300).nullable(),
  flagship_icon: z.string().max(60).nullable(),
  flagship_accent: z.string().max(60).nullable(),
  schema_type: z.string().max(80),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const adminSaveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ServiceInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("services").upsert(data, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true, slug: data.slug };
  });

const SlugOnly = z.object({ slug: z.string().min(1).max(120) });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SlugOnly.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("services").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===========================================================================
// ייבוא חד-פעמי של התוכן מהקוד לדאטאבייס
// ===========================================================================

/**
 * מעתיק את גוף עמודי הטיפולים (ואת תיאורי הקטגוריות) מקבצי המקור
 * שבקוד אל הדאטאבייס. התוכן נלקח ישירות מהמודול המיובא, ולכן ההעתקה
 * מדויקת — אין תמלול ידני של תוכן קליני.
 *
 * ברירת המחדל היא לא לדרוס: שורה שכבר יש בה גוף תוכן נשארת כפי שהיא,
 * כדי שהרצה חוזרת לא תמחק עריכות של ענבר. overwrite=true מאלץ דריסה.
 */
const ImportInput = z.object({ overwrite: z.boolean().default(false) });

export const adminImportContentFromSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ImportInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    const { data: existing, error: readErr } = await supabaseAdmin
      .from("services")
      .select("slug, sections, intro");
    if (readErr) throw new Error(readErr.message);

    const hasBody = new Map(
      (existing ?? []).map((r) => [
        r.slug,
        Boolean((r.sections as unknown[])?.length) || Boolean(r.intro),
      ]),
    );

    const imported: string[] = [];
    const skipped: string[] = [];

    for (const s of SERVICES) {
      if (!data.overwrite && hasBody.get(s.slug)) {
        skipped.push(s.slug);
        continue;
      }
      const { error } = await supabaseAdmin.from("services").upsert(
        {
          slug: s.slug,
          nav_label: s.navLabel,
          title: s.title,
          subtitle: s.subtitle,
          meta_title: s.metaTitle,
          meta_description: s.metaDescription,
          tldr: s.tldr,
          intro: s.intro,
          quick_facts: s.quickFacts,
          sections: s.sections,
          red_flags: s.redFlags,
          faqs: s.faqs,
          sources: s.sources,
        },
        { onConflict: "slug" },
      );
      if (error) throw new Error(`${s.slug}: ${error.message}`);
      imported.push(s.slug);
    }

    // תיאורי הקטגוריות — אותו כלל: לא דורסים תיאור שכבר קיים.
    for (const c of CODE_CATEGORIES) {
      const query = supabaseAdmin
        .from("knowledge_categories")
        .update({
          title: c.name,
          short_name: c.shortName,
          mod_code: c.modCode,
          description: c.description,
        })
        .eq("slug", c.slug);
      const { error } = data.overwrite ? await query : await query.is("description", null);
      if (error) throw new Error(`category ${c.slug}: ${error.message}`);
    }

    return { ok: true, imported, skipped };
  });

// ===========================================================================
// המלצות
// ===========================================================================

export const adminListReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ reviews: ReviewRow[] }> => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("review_date", { ascending: false });
    if (error) throw new Error(error.message);
    return { reviews: (data ?? []) as ReviewRow[] };
  });

const ReviewInput = z.object({
  id: z.string().uuid().optional(),
  author_name: z.string().min(1).max(120),
  author_area: z.string().max(120).nullable(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(1).max(4000),
  service_slug: z.string().max(120).nullable(),
  source: z.enum(["manual", "google", "facebook"]),
  source_url: z.string().max(1000).nullable(),
  review_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const adminSaveReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ReviewInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("reviews").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const IdOnly = z.object({ id: z.string().uuid() });

export const adminDeleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdOnly.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===========================================================================
// גלריית לפני / אחרי
// ===========================================================================

export const adminListBeforeAfter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ items: BeforeAfterRow[] }> => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("before_after")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { items: (data ?? []) as BeforeAfterRow[] };
  });

const BeforeAfterInput = z
  .object({
    id: z.string().uuid().optional(),
    service_slug: z.string().max(120).nullable(),
    title: z.string().min(1).max(200),
    description: z.string().max(2000).nullable(),
    before_image: z.string().min(1).max(1000),
    before_alt: z.string().max(500).nullable(),
    after_image: z.string().min(1).max(1000),
    after_alt: z.string().max(500).nullable(),
    sessions_count: z.number().int().min(0).max(200).nullable(),
    timeframe: z.string().max(120).nullable(),
    consent_confirmed: z.boolean(),
    is_published: z.boolean(),
    sort_order: z.number().int().min(0).max(9999),
  })
  .refine((v) => !v.is_published || v.consent_confirmed, {
    message: "אי אפשר לפרסם תמונות של מטופלת בלי לאשר שהתקבלה הסכמה",
    path: ["consent_confirmed"],
  });

export const adminSaveBeforeAfter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BeforeAfterInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("before_after").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteBeforeAfter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => IdOnly.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("before_after").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===========================================================================
// קטגוריות ידע
// ===========================================================================

export const adminListCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ categories: CategoryRow[] }> => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("knowledge_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { categories: (data ?? []) as CategoryRow[] };
  });

const CategoryInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "מזהה כתובת יכול להכיל אותיות אנגליות קטנות, ספרות ומקפים בלבד"),
  label: z.string().min(1).max(120),
  title: z.string().max(300).nullable(),
  short_name: z.string().max(120).nullable(),
  mod_code: z.string().max(60).nullable(),
  description: z.string().max(8000).nullable(),
  meta_title: z.string().max(300).nullable(),
  meta_description: z.string().max(500).nullable(),
  hero_image: z.string().max(1000).nullable(),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const adminSaveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CategoryInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("knowledge_categories")
      .upsert(data, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===========================================================================
// לידים
// ===========================================================================

export const adminListLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ leads: LeadRow[] }> => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select(
        "id, name, email, phone, message, service_slug, source_page, status, notes, handled_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);
    return { leads: (data ?? []) as LeadRow[] };
  });

const LeadUpdateInput = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "scheduled", "done", "irrelevant"]),
  notes: z.string().max(4000).nullable(),
});

export const adminUpdateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => LeadUpdateInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("leads")
      .update({
        status: data.status,
        notes: data.notes,
        handled_at: data.status === "new" ? null : new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ===========================================================================
// תמונות
// ===========================================================================

export const adminListMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("media")
      .select("id, path, url, alt, title, mime_type, size_bytes, folder, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { media: data ?? [] };
  });

const MediaInput = z.object({
  path: z.string().min(1).max(500),
  url: z.string().min(1).max(1000),
  alt: z.string().max(500).nullable(),
  title: z.string().max(300).nullable(),
  mime_type: z.string().max(120).nullable(),
  size_bytes: z.number().int().min(0).nullable(),
  folder: z.string().max(80),
});

export const adminRegisterMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => MediaInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("media").upsert(data, { onConflict: "path" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const MediaDeleteInput = z.object({ id: z.string().uuid(), path: z.string().max(500) });

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => MediaDeleteInput.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    // מוחקים קודם מהאחסון; אם זה נכשל, השורה נשארת ואפשר לנסות שוב
    // במקום להישאר עם קובץ יתום שאף אחד לא רואה.
    const { error: storageErr } = await supabaseAdmin.storage
      .from("site-media")
      .remove([data.path]);
    if (storageErr) throw new Error(storageErr.message);
    const { error } = await supabaseAdmin.from("media").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
