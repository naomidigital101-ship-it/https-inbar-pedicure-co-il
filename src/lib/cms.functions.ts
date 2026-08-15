/**
 * קריאות ציבוריות ממערכת ניהול התוכן — משמשות את ה-loaders של הראוטים (SSR).
 *
 * עיקרון: אף עמוד לא נשבר גם אם הדאטאבייס ריק. כל קריאה נופלת חזרה
 * לקבועים שבקוד (site-config.ts / services-content.ts), שהם התוכן שהיה
 * באתר לפני המעבר לניהול דינמי. כך המעבר בטוח: מה שענבר לא ערכה עדיין
 * ממשיך להופיע בדיוק כפי שהופיע.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildSiteValues, SITE_DEFAULTS } from "@/lib/site-values";
import { SERVICES, SERVICES_BY_SLUG } from "@/lib/services-content";
import { categories as CODE_CATEGORIES } from "@/lib/categories";
import { BLOCK_DEFS } from "@/lib/content-blocks";
import type { ContentBlockRow } from "@/lib/cms-types";
import {
  isServiceRowEmpty,
  rowToServicePage,
  type BeforeAfterRow,
  type ReviewRow,
  type ServicePage,
  type ServiceRow,
  type SiteValues,
} from "@/lib/cms-types";

export const getSiteValues = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteValues> => {
    try {
      const { data, error } = await supabaseAdmin.from("site_settings").select("key, value");
      if (error) throw error;
      return buildSiteValues(data ?? []);
    } catch (err) {
      // הגדרות הן תשתית של כל עמוד — אם ה-DB לא זמין, מגישים ברירות מחדל
      // ולא מפילים את האתר.
      console.error("[cms] getSiteValues failed, using defaults:", err);
      return SITE_DEFAULTS;
    }
  },
);

// ---------------------------------------------------------------------------
// טיפולים
// ---------------------------------------------------------------------------

/** כרטיס טיפול לרשימות ולניווט. */
export type ServiceCard = {
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  cardImage: string | null;
  cardAlt: string | null;
  priceText: string | null;
  priceVisible: boolean;
  isFlagship: boolean;
  flagshipTitle: string | null;
  flagshipTag: string | null;
  flagshipSub: string | null;
  flagshipIcon: string | null;
  flagshipAccent: string | null;
};

const FALLBACK_CARDS: ServiceCard[] = SERVICES.map((s) => ({
  slug: s.slug,
  navLabel: s.navLabel,
  title: s.title,
  subtitle: s.subtitle,
  cardImage: null,
  cardAlt: null,
  priceText: null,
  priceVisible: false,
  isFlagship: false,
  flagshipTitle: null,
  flagshipTag: null,
  flagshipSub: null,
  flagshipIcon: null,
  flagshipAccent: null,
}));

export const listServices = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ services: ServiceCard[] }> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("services")
        .select(
          "slug, nav_label, title, subtitle, card_image, card_alt, price_text, price_visible, is_flagship, flagship_title, flagship_tag, flagship_sub, flagship_icon, flagship_accent",
        )
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data?.length) return { services: FALLBACK_CARDS };
      return {
        services: data.map((r) => ({
          slug: r.slug,
          navLabel: r.nav_label,
          title: r.title,
          subtitle: r.subtitle ?? "",
          cardImage: r.card_image,
          cardAlt: r.card_alt,
          priceText: r.price_text,
          priceVisible: r.price_visible,
          isFlagship: r.is_flagship,
          flagshipTitle: r.flagship_title,
          flagshipTag: r.flagship_tag,
          flagshipSub: r.flagship_sub,
          flagshipIcon: r.flagship_icon,
          flagshipAccent: r.flagship_accent,
        })),
      };
    } catch (err) {
      console.error("[cms] listServices failed, using code fallback:", err);
      return { services: FALLBACK_CARDS };
    }
  },
);

const SlugInput = z.object({ slug: z.string().min(1).max(120) });

export type ServiceDetail = {
  service: ServicePage;
  seo: {
    metaTitle: string;
    metaDescription: string;
    h1: string | null;
    canonical: string | null;
    ogImage: string | null;
    noindex: boolean;
    schemaType: string;
  };
  heroImage: string | null;
  priceText: string | null;
  priceVisible: boolean;
};

function fallbackDetail(slug: string): ServiceDetail | null {
  const s = SERVICES_BY_SLUG[slug];
  if (!s) return null;
  return {
    service: s,
    seo: {
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      h1: null,
      canonical: null,
      ogImage: null,
      noindex: false,
      schemaType: "MedicalWebPage",
    },
    heroImage: null,
    priceText: null,
    priceVisible: false,
  };
}

export const getService = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => SlugInput.parse(d))
  .handler(async ({ data }): Promise<ServiceDetail | null> => {
    try {
      const { data: row, error } = await supabaseAdmin
        .from("services")
        .select("*")
        .eq("slug", data.slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!row) return fallbackDetail(data.slug);

      const r = row as unknown as ServiceRow;
      // שורה שנוצרה אך גופה טרם יובא — מגישים את התוכן מהקוד, אבל
      // שומרים על שדות ה-SEO והתמונות שכבר נערכו באדמין.
      const service = isServiceRowEmpty(r)
        ? (SERVICES_BY_SLUG[r.slug] ?? rowToServicePage(r))
        : rowToServicePage(r);

      return {
        service,
        seo: {
          metaTitle: r.meta_title ?? service.metaTitle,
          metaDescription: r.meta_description ?? service.metaDescription,
          h1: r.h1,
          canonical: r.canonical,
          ogImage: r.og_image,
          noindex: r.noindex,
          schemaType: r.schema_type,
        },
        heroImage: r.hero_image,
        priceText: r.price_text,
        priceVisible: r.price_visible,
      };
    } catch (err) {
      console.error("[cms] getService failed, using code fallback:", err);
      return fallbackDetail(data.slug);
    }
  });

// ---------------------------------------------------------------------------
// קטגוריות ידע
// ---------------------------------------------------------------------------

export type PublicCategory = {
  slug: string;
  label: string;
  name: string;
  shortName: string;
  description: string;
  modCode: string;
  heroImage: string | null;
};

const FALLBACK_CATEGORIES: PublicCategory[] = CODE_CATEGORIES.map((c) => ({
  slug: c.slug,
  label: c.shortName,
  name: c.name,
  shortName: c.shortName,
  description: c.description,
  modCode: c.modCode,
  heroImage: null,
}));

export const listCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categories: PublicCategory[] }> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("knowledge_categories")
        .select("slug, label, title, short_name, description, mod_code, hero_image")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data?.length) throw new Error("empty");

      const byCodeSlug = new Map(CODE_CATEGORIES.map((c) => [c.slug, c]));
      return {
        categories: data.map((r) => {
          const code = byCodeSlug.get(r.slug as (typeof CODE_CATEGORIES)[number]["slug"]);
          return {
            slug: r.slug,
            label: r.label,
            name: r.title ?? code?.name ?? r.label,
            shortName: r.short_name ?? code?.shortName ?? r.label,
            // התיאורים מיובאים מהקוד בפעולת הייבוא החד-פעמית; עד אז נופלים אליו.
            description: r.description ?? code?.description ?? "",
            modCode: r.mod_code ?? code?.modCode ?? "",
            heroImage: r.hero_image,
          };
        }),
      };
    } catch (err) {
      console.error("[cms] listCategories failed, using code fallback:", err);
      return { categories: FALLBACK_CATEGORIES };
    }
  },
);

// ---------------------------------------------------------------------------
// המלצות
// ---------------------------------------------------------------------------

export type PublicReview = Pick<
  ReviewRow,
  | "id"
  | "author_name"
  | "author_area"
  | "rating"
  | "body"
  | "service_slug"
  | "review_date"
  | "is_featured"
>;

export const listReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ reviews: PublicReview[]; average: number | null; count: number }> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .select(
          "id, author_name, author_area, rating, body, service_slug, review_date, is_featured",
        )
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("review_date", { ascending: false });
      if (error) throw error;
      const reviews = data ?? [];
      const count = reviews.length;
      const average = count
        ? Math.round((reviews.reduce((n, r) => n + r.rating, 0) / count) * 10) / 10
        : null;
      return { reviews, average, count };
    } catch (err) {
      console.error("[cms] listReviews failed:", err);
      return { reviews: [], average: null, count: 0 };
    }
  },
);

// ---------------------------------------------------------------------------
// גלריית לפני / אחרי
// ---------------------------------------------------------------------------

export type PublicBeforeAfter = Omit<
  BeforeAfterRow,
  "consent_confirmed" | "is_published" | "sort_order"
>;

export const listBeforeAfter = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: PublicBeforeAfter[] }> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("before_after")
        .select(
          "id, service_slug, title, description, before_image, before_alt, after_image, after_alt, sessions_count, timeframe",
        )
        .eq("is_published", true)
        .eq("consent_confirmed", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return { items: data ?? [] };
    } catch (err) {
      console.error("[cms] listBeforeAfter failed:", err);
      return { items: [] };
    }
  },
);

// ---------------------------------------------------------------------------
// מקטעי דף הבית
// ---------------------------------------------------------------------------

const FALLBACK_BLOCKS: ContentBlockRow[] = BLOCK_DEFS.map((b, i) => ({
  block_key: b.blockKey,
  label: b.label,
  description: b.description,
  heading: null,
  subheading: null,
  items: b.items,
  item_schema: b.itemSchema,
  is_published: true,
  sort_order: (i + 1) * 10,
}));

export const listContentBlocks = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ blocks: Record<string, ContentBlockRow> }> => {
    const toMap = (rows: ContentBlockRow[]) =>
      Object.fromEntries(rows.map((b) => [b.block_key, b]));
    try {
      const { data, error } = await supabaseAdmin
        .from("content_blocks")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data?.length) return { blocks: toMap(FALLBACK_BLOCKS) };

      // מקטע שקיים ב-DB גובר; מקטע שטרם יובא מוגש מהקוד, כדי שלא
      // ייווצר אזור ריק בדף הבית.
      const merged = new Map(FALLBACK_BLOCKS.map((b) => [b.block_key, b]));
      for (const row of data as unknown as ContentBlockRow[]) {
        if (row.items?.length) merged.set(row.block_key, row);
      }
      return { blocks: toMap([...merged.values()]) };
    } catch (err) {
      console.error("[cms] listContentBlocks failed, using code fallback:", err);
      return { blocks: toMap(FALLBACK_BLOCKS) };
    }
  },
);
