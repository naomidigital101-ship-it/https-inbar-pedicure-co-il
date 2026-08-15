/**
 * טיפוסים משותפים למערכת ניהול התוכן.
 * קובץ טיפוסים טהור — בלי ייבוא שרת — כדי שיהיה בטוח לייבא אותו
 * גם מקומפוננטות דפדפן וגם מפונקציות שרת.
 */

import type { ServicePage } from "@/lib/services-content";

export type { ServicePage };

/** ערכי ההגדרות כפי שהם מוגשים לקומפוננטות — אותה צורה כמו SITE. */
export type SiteValues = {
  brand: string;
  tagline: string;
  shortDescription: string;
  url: string;
  city: string;
  region: string;
  phoneDisplay: string;
  phoneIntl: string;
  whatsappNumber: string;
  whatsappUrl: string;
  whatsappDefaultMessage: string;
  telUrl: string;
  wazeUrl: string;
  email: string;
  hoursDisplay: string;
  yearsExperience: string;
  treatmentsCount: string;
  bannerEnabled: boolean;
  bannerText: string;
  bannerLink: string;
  homeHeroKicker: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHeroLede: string;
  homeHeroCtaPrimary: string;
  homeHeroCtaSecondary: string;
  homeHeroStats: { num: string; label: string }[];
  homeHeroImage: string;
  homeFlagshipKicker: string;
  homeFlagshipTitle: string;
  defaultOgImage: string;
};

/** שורה גולמית מטבלת site_settings, כפי שהאדמין עורך אותה. */
export type SettingRow = {
  key: string;
  value: string | null;
  group_key: string;
  label: string;
  input_type: string;
  help_text: string | null;
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  slug: string;
  nav_label: string;
  title: string;
  subtitle: string | null;
  meta_title: string | null;
  meta_description: string | null;
  h1: string | null;
  canonical: string | null;
  og_image: string | null;
  noindex: boolean;
  tldr: string | null;
  intro: string | null;
  quick_facts: { label: string; value: string }[];
  sections: ServicePage["sections"];
  red_flags: string[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  hero_image: string | null;
  card_image: string | null;
  card_alt: string | null;
  price_text: string | null;
  price_visible: boolean;
  is_flagship: boolean;
  flagship_title: string | null;
  flagship_tag: string | null;
  flagship_sub: string | null;
  flagship_icon: string | null;
  flagship_accent: string | null;
  schema_type: string;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  author_name: string;
  author_area: string | null;
  rating: number;
  body: string;
  service_slug: string | null;
  source: string;
  source_url: string | null;
  review_date: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type BeforeAfterRow = {
  id: string;
  service_slug: string | null;
  title: string;
  description: string | null;
  before_image: string;
  before_alt: string | null;
  after_image: string;
  after_alt: string | null;
  sessions_count: number | null;
  timeframe: string | null;
  consent_confirmed: boolean;
  is_published: boolean;
  sort_order: number;
};

export type CategoryRow = {
  id: string;
  slug: string;
  label: string;
  title: string | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  hero_image: string | null;
  is_published: boolean;
  sort_order: number;
};

export type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  service_slug: string | null;
  source_page: string | null;
  status: string;
  notes: string | null;
  handled_at: string | null;
  created_at: string;
};

export const LEAD_STATUSES = [
  { value: "new", label: "חדש" },
  { value: "contacted", label: "יצרתי קשר" },
  { value: "scheduled", label: "נקבע תור" },
  { value: "done", label: "טופל" },
  { value: "irrelevant", label: "לא רלוונטי" },
] as const;

/**
 * ממיר שורת DB לצורת ServicePage שהקומפוננטות הציבוריות כבר מכירות.
 * שומר על ממשק אחד — כך שמעבר ל-DB לא דורש שכתוב של עמודי התצוגה.
 */
export function rowToServicePage(row: ServiceRow): ServicePage {
  return {
    slug: row.slug,
    navLabel: row.nav_label,
    title: row.title,
    subtitle: row.subtitle ?? "",
    metaTitle: row.meta_title ?? row.title,
    metaDescription: row.meta_description ?? "",
    tldr: row.tldr ?? "",
    quickFacts: row.quick_facts ?? [],
    intro: row.intro ?? "",
    sections: row.sections ?? [],
    redFlags: row.red_flags ?? [],
    faqs: row.faqs ?? [],
    sources: row.sources ?? [],
  };
}

/** שורת DB נחשבת "ריקה" אם לא יובא אליה עדיין גוף התוכן. */
export function isServiceRowEmpty(row: ServiceRow): boolean {
  return !row.sections?.length && !row.intro;
}
