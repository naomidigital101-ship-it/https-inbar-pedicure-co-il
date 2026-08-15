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
import { SITE } from "@/lib/site-config";
import { SERVICES, SERVICES_BY_SLUG } from "@/lib/services-content";
import { categories as CODE_CATEGORIES } from "@/lib/categories";
import {
  isServiceRowEmpty,
  rowToServicePage,
  type BeforeAfterRow,
  type ReviewRow,
  type ServicePage,
  type ServiceRow,
  type SettingRow,
  type SiteValues,
} from "@/lib/cms-types";

// ---------------------------------------------------------------------------
// הגדרות אתר
// ---------------------------------------------------------------------------

/** ערכי ברירת המחדל — בדיוק מה שהיה קשיח בקוד לפני המעבר. */
export const SITE_DEFAULTS: SiteValues = {
  brand: SITE.brand,
  tagline: SITE.tagline,
  shortDescription: SITE.shortDescription,
  url: SITE.url,
  city: SITE.city,
  region: SITE.region,
  phoneDisplay: SITE.phoneDisplay,
  phoneIntl: SITE.phoneIntl,
  whatsappNumber: SITE.whatsappNumber,
  whatsappUrl: SITE.whatsappUrl,
  whatsappDefaultMessage: "שלום ענבר, אשמח לתאם טיפול",
  telUrl: SITE.telUrl,
  wazeUrl: SITE.wazeUrl,
  email: SITE.email,
  hoursDisplay: SITE.hoursDisplay,
  yearsExperience: String(SITE.yearsExperience),
  treatmentsCount: SITE.treatmentsCount,
  bannerEnabled: false,
  bannerText: "",
  bannerLink: "",
  homeHeroKicker: "מטפלת · מרצה · מכשירה פדיקוריסטיות",
  homeHeroTitle: "הליכה בלי כאב מתחילה כאן",
  homeHeroSubtitle:
    "הקליניקה של ענבר פרחי לפדיקור טיפולי — מרצה ומכשירה פדיקוריסטיות בכל הארץ",
  homeHeroLede:
    "12+ שנות ניסיון קליני, אבחון מדויק וטיפול סטרילי — ומאות מטופלים שחזרו ללכת בלי כאב.",
  homeHeroCtaPrimary: "לתיאום טיפול בקליניקה",
  homeHeroCtaSecondary: "אני פדיקוריסטית — להכשרות",
  homeHeroStats: [
    { num: "12+", label: "שנות ניסיון קליני" },
    { num: "200+", label: "מטופלים בשנה" },
    { num: "20+", label: "פדיקוריסטיות הוכשרו" },
    { num: "150+", label: "שעות השתלמות בשנה" },
  ],
  homeHeroImage: "",
  homeFlagshipKicker: "תחומי הליבה",
  homeFlagshipTitle: "שלושה תחומים שאני מתמחה בהם",
  defaultOgImage: "",
};

function parseStats(raw: string | undefined): { num: string; label: string }[] {
  if (!raw) return SITE_DEFAULTS.homeHeroStats;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SITE_DEFAULTS.homeHeroStats;
    const clean = parsed
      .filter((s) => s && typeof s.num === "string" && typeof s.label === "string")
      .map((s) => ({ num: s.num, label: s.label }));
    return clean.length ? clean : SITE_DEFAULTS.homeHeroStats;
  } catch {
    return SITE_DEFAULTS.homeHeroStats;
  }
}

/** בונה את אובייקט הערכים מהשורות, עם נפילה לברירת מחדל לכל שדה בנפרד. */
export function buildSiteValues(rows: Pick<SettingRow, "key" | "value">[]): SiteValues {
  const m = new Map(rows.map((r) => [r.key, r.value ?? ""]));
  const get = (key: string, fallback: string) => {
    const v = m.get(key);
    return v !== undefined && v !== "" ? v : fallback;
  };

  const whatsappNumber = get("whatsapp_number", SITE_DEFAULTS.whatsappNumber);
  const phoneIntl = get("phone_intl", SITE_DEFAULTS.phoneIntl);

  return {
    brand: get("brand", SITE_DEFAULTS.brand),
    tagline: get("tagline", SITE_DEFAULTS.tagline),
    shortDescription: get("short_description", SITE_DEFAULTS.shortDescription),
    url: get("site_url", SITE_DEFAULTS.url).replace(/\/+$/, ""),
    city: get("city", SITE_DEFAULTS.city),
    region: get("region", SITE_DEFAULTS.region),
    phoneDisplay: get("phone_display", SITE_DEFAULTS.phoneDisplay),
    phoneIntl,
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    whatsappDefaultMessage: get(
      "whatsapp_default_message",
      SITE_DEFAULTS.whatsappDefaultMessage,
    ),
    telUrl: `tel:${phoneIntl}`,
    wazeUrl: get("waze_url", SITE_DEFAULTS.wazeUrl),
    email: get("email", SITE_DEFAULTS.email),
    hoursDisplay: get("hours_display", SITE_DEFAULTS.hoursDisplay),
    yearsExperience: get("years_experience", SITE_DEFAULTS.yearsExperience),
    treatmentsCount: get("treatments_count", SITE_DEFAULTS.treatmentsCount),
    bannerEnabled: m.get("banner_enabled") === "true",
    bannerText: m.get("banner_text") ?? "",
    bannerLink: m.get("banner_link") ?? "",
    homeHeroKicker: get("home_hero_kicker", SITE_DEFAULTS.homeHeroKicker),
    homeHeroTitle: get("home_hero_title", SITE_DEFAULTS.homeHeroTitle),
    homeHeroSubtitle: get("home_hero_subtitle", SITE_DEFAULTS.homeHeroSubtitle),
    homeHeroLede: get("home_hero_lede", SITE_DEFAULTS.homeHeroLede),
    homeHeroCtaPrimary: get("home_hero_cta_primary", SITE_DEFAULTS.homeHeroCtaPrimary),
    homeHeroCtaSecondary: get(
      "home_hero_cta_secondary",
      SITE_DEFAULTS.homeHeroCtaSecondary,
    ),
    homeHeroStats: parseStats(m.get("home_hero_stats")),
    homeHeroImage: m.get("home_hero_image") ?? "",
    homeFlagshipKicker: get("home_flagship_kicker", SITE_DEFAULTS.homeFlagshipKicker),
    homeFlagshipTitle: get("home_flagship_title", SITE_DEFAULTS.homeFlagshipTitle),
    defaultOgImage: m.get("default_og_image") ?? "",
  };
}

export const getSiteValues = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteValues> => {
    try {
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("key, value");
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
  "id" | "author_name" | "author_area" | "rating" | "body" | "service_slug" | "review_date" | "is_featured"
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
