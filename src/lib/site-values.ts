/**
 * ערכי האתר וברירות המחדל שלהם — מודול טהור.
 *
 * מופרד מ-cms.functions.ts בכוונה: הקובץ ההוא מייבא את קליינט השרת של
 * Supabase, וקומפוננטות דפדפן שהיו מייבאות ממנו היו גוררות קוד שרת
 * לתוך באנדל הלקוח.
 *
 * ברירות המחדל הן בדיוק התוכן שהיה קשיח בקוד לפני המעבר לניהול דינמי,
 * כך שכל שדה שענבר עוד לא ערכה ממשיך להופיע כפי שהופיע.
 */

import { SITE } from "@/lib/site-config";
import type { SettingRow, SiteValues } from "@/lib/cms-types";

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
      .map((s) => ({ num: s.num as string, label: s.label as string }));
    return clean.length ? clean : SITE_DEFAULTS.homeHeroStats;
  } catch {
    return SITE_DEFAULTS.homeHeroStats;
  }
}

/** בונה את ערכי האתר מהשורות, עם נפילה לברירת מחדל לכל שדה בנפרד. */
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
