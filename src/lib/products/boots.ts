import img_alpinestars_tech10_2025 from "@/assets/boots/alpinestars-tech10-2025.jpg";
import img_alpinestars_tech10_enduro_2025 from "@/assets/boots/alpinestars-tech10-enduro-2025.jpg";
import img_alpinestars_tech7_2025 from "@/assets/boots/alpinestars-tech7-2025.jpg";
import img_alpinestars_tech7_enduro_drystar_2026 from "@/assets/boots/alpinestars-tech7-enduro-drystar-2026.jpg";
import img_alpinestars_tech5_2025 from "@/assets/boots/alpinestars-tech5-2025.jpg";
import img_alpinestars_tech3_2025 from "@/assets/boots/alpinestars-tech3-2025.jpg";
import img_sidi_crossfire3_srs_2025 from "@/assets/boots/sidi-crossfire3-srs-2025.jpg";
import img_sidi_crossfire3_ta_2025 from "@/assets/boots/sidi-crossfire3-ta-2025.jpg";
import img_gaerne_sg22_2025 from "@/assets/boots/gaerne-sg22-2025.jpg";
import img_gaerne_sg12_2025 from "@/assets/boots/gaerne-sg12-2025.jpg";
import img_fox_instinct_2025 from "@/assets/boots/fox-instinct-2025.jpg";
import img_fox_motion_2025 from "@/assets/boots/fox-motion-2025.jpg";
import img_fox_comp_x_2025 from "@/assets/boots/fox-comp-x-2025.jpg";
import img_leatt_55_flexlock_2026 from "@/assets/boots/leatt-55-flexlock-2026.jpg";
import img_leatt_45_hydradry_2025 from "@/assets/boots/leatt-45-hydradry-2025.jpg";
import img_leatt_35_2025 from "@/assets/boots/leatt-35-2025.jpg";
import img_forma_terra_evo_2025 from "@/assets/boots/forma-terra-evo-2025.jpg";
import img_acerbis_x_move_2025 from "@/assets/boots/acerbis-x-move-2025.jpg";

// קטלוג מגפי שטח - מקור נתונים יחיד לעמוד /products/boots

export type BootLevel = "entry" | "mid" | "pro" | "elite";
export type BootType = "motocross" | "enduro" | "adventure";
export type BootWidth = "narrow" | "standard" | "wide";

export interface BootRetailer {
  store: string;
  url: string;
  price_ils?: number;
}

export interface BootProduct {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: BootType;
  level: BootLevel;
  safety_standard: string;
  waterproof: boolean;
  replaceable_sole: boolean;
  knee_brace_compatible: boolean;
  toe_box_width: BootWidth;
  ankle_protection: string;
  weight_grams_per_boot: number;
  price_usd: number;
  price_ils_approx: number;
  women_version_available: boolean;
  women_notes: string | null;
  slug: string;
  short_desc_he: string;
  pros_he: string[];
  cons_he: string[];
  best_for_he: string;
  fit_notes_he: string;
  retailers_israel: BootRetailer[];
  unsplash_image: string;
}

export const BOOT_SIZING_GUIDE = {
  title: "איך למדוד מידת מגף - חובה לפני קנייה",
  steps: [
    "מדוד את אורך כף הרגל ב-cm (מקצה הבוהן עד עקב)",
    "השווה לטבלת המידות של היצרן הספציפי - כל מותג שונה",
    "Sidi - חתך צר, מתאים לרגל צרה. לרגל רחבה - קחו גדול יותר או בחרו Fox/Gaerne",
    "Alpinestars - בינוני-צר, בדרך כלל אמת למידה",
    "Gaerne - רחב יותר, מתאים לרגל עגולה",
    "Fox - בינוני, נוטה להיות גבוה יותר בקרסול",
    "Leatt - בינוני-רחב, נוח להרכבה עם knee brace",
    "אם בין שתי מידות - קחו את הגדולה: כף הרגל מתנפחת ברכיבה ארוכה",
  ],
  women_note:
    "לנשים - רוב המגפים הם unisex. Sidi Crossfire 3 מגיע בגרסת נשים רשמית (SRS Women). Alpinestars Tech 7 ו-Tech 3 - הזמינו מידה קטנה יותר מהנעל הרגילה.",
} as const;

export const BOOT_TYPES: { id: BootType; label_he: string; desc_he: string }[] = [
  { id: "motocross", label_he: "מוטוקרוס", desc_he: "הגנה מקסימלית, סוליה חלקה" },
  { id: "enduro", label_he: "אנדורו", desc_he: "גמיש, סוליה עם אחיזה, נוח ללכת" },
  { id: "adventure", label_he: "אדוונצ'ר", desc_he: "כביש + שטח, נוחות כל היום" },
];

export const BOOT_LEVELS: { id: BootLevel; label_he: string }[] = [
  { id: "entry", label_he: "כניסה" },
  { id: "mid", label_he: "בינוני" },
  { id: "pro", label_he: "מקצועי" },
  { id: "elite", label_he: "עלית" },
];

export type BootBudget = "all" | "under_750" | "750_1200" | "1200_2000" | "over_2000";

export const matchesBootBudget = (price: number, bucket: BootBudget): boolean => {
  switch (bucket) {
    case "all":
      return true;
    case "under_750":
      return price < 750;
    case "750_1200":
      return price >= 750 && price < 1200;
    case "1200_2000":
      return price >= 1200 && price < 2000;
    case "over_2000":
      return price >= 2000;
  }
};

export const BOOTS: BootProduct[] = [
  {
    id: "alpinestars-tech10-2025",
    brand: "Alpinestars",
    model: "X-Move 2.0",
    year: 2025,
    type: "motocross",
    level: "elite",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection:
      "Frontal Flex Frame + Dynamic Heel Compression Protector + inner ankle brace",
    weight_grams_per_boot: 1650,
    price_usd: 300,
    price_ils_approx: 1110,
    women_version_available: false,
    women_notes:
      "Unisex. גרסת SUPERVENTED - מאוורר במיוחד למזג אוויר ישראלי. מחיר גבוה אבל ה-go-to של רוב הרוכבים המקצועיים.",
    slug: "alpinestars-tech10-2025",
    short_desc_he:
      "המגף הנמכר ביותר בעולם למוטוקרוס. Frontal Flex Frame, inner ankle brace, DHCP. מעל עשור על הפודיום.",
    pros_he: [
      "ההגנה הגבוהה ביותר בקטגוריה",
      "Frontal Flex Frame - שולט בגמישות ומונע hyperextension",
      "Dynamic Heel Compression Protector - פטנט Alpinestars",
      "סוליה ניתנת להחלפה",
      "גרסת SUPERVENTED - מאוורר, מתאים לישראל",
    ],
    cons_he: ["יקר", "קשוח בתחילה - דורש שבירה", "לא עמיד למים", "כבד יחסית"],
    best_for_he: "מוטוקרוס, Supercross, רוכבים שרוצים הגנה מקסימלית בלי פשרות",
    fit_notes_he: "חתך סטנדרטי. אמת למידה. לרגל רחבה - קחו מידה גדולה יותר.",
    retailers_israel: [
      {
        store: "Alpinestars ישראל",
        url: "https://alpinestars.co.il/category/%D7%A7%D7%A1%D7%93%D7%95%D7%AA+%D7%95%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94/%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94+%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2%D7%99+%D7%A9%D7%98%D7%97+/%D7%9E%D7%92%D7%A4%D7%99+%D7%A9%D7%98%D7%97",
        price_ils: 2600,
      },
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187582-ALPINESTARS",
        price_ils: 2580,
      },
      { store: "אבזריון", url: "https://avzrion.co.il/%D7%9E%D7%92%D7%A4%D7%99-%D7%A9%D7%98%D7%97", price_ils: 2620 },
      { store: "EFM Sports", url: "https://efmsports.co.il/brand/alpinestars" },
    ],
    unsplash_image: img_alpinestars_tech10_2025,
  },
  {
    id: "alpinestars-tech10-enduro-2025",
    brand: "Alpinestars",
    model: "Tech 10 Enduro",
    year: 2025,
    type: "enduro",
    level: "elite",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "Frontal Flex Frame מותאם Enduro + DHCP",
    weight_grams_per_boot: 1580,
    price_usd: 740,
    price_ils_approx: 2750,
    women_version_available: false,
    women_notes:
      "Unisex. סוליה חיצונית בלאקית יותר מ-Tech 10 הרגיל - מתאים לנסיעה על סלעים.",
    slug: "alpinestars-tech10-enduro-2025",
    short_desc_he:
      "Tech 10 עם סוליה ייעודית לאנדורו ואחיזה על סלעים. גמישות רבה יותר בקרסול. הדגם החדש ביותר של Alpinestars.",
    pros_he: [
      "הגנת Tech 10 עם סוליה אנדורו",
      "גמיש יותר מ-Tech 10 הרגיל - נוח ביערות",
      "אחיזה מצוינת על סלעים ועפר",
      "סוליה ניתנת להחלפה",
    ],
    cons_he: ["הכי יקר בקטגוריה", "חדש - פחות ביקורות בשטח", "לא עמיד למים"],
    best_for_he:
      "Hard Enduro, שטח טכני, אבנים וסלעים, מי שרוצה הגנת Tech 10 עם תחושת אנדורו",
    fit_notes_he: "זהה ל-Tech 10 הרגיל. אמת למידה.",
    retailers_israel: [
      {
        store: "Alpinestars ישראל",
        url: "https://alpinestars.co.il/category/%D7%A7%D7%A1%D7%93%D7%95%D7%AA+%D7%95%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94/%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94+%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2%D7%99+%D7%A9%D7%98%D7%97+/%D7%9E%D7%92%D7%A4%D7%99+%D7%A9%D7%98%D7%97",
        price_ils: 2750,
      },
      { store: "אבזריון", url: "https://avzrion.co.il/%D7%9E%D7%92%D7%A4%D7%99-%D7%A9%D7%98%D7%97" },
      { store: "EFM Sports", url: "https://efmsports.co.il/brand/alpinestars" },
    ],
    unsplash_image: img_alpinestars_tech10_enduro_2025,
  },
  {
    id: "alpinestars-tech7-2025",
    brand: "Alpinestars",
    model: "Tech 7",
    year: 2025,
    type: "motocross",
    level: "pro",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU medial + lateral torsion control",
    weight_grams_per_boot: 1520,
    price_usd: 380,
    price_ils_approx: 1400,
    women_version_available: false,
    women_notes:
      "Unisex. ה-sweet spot של Alpinestars - מומלץ גם לנשים. חתך בינוני, אמת למידה.",
    slug: "alpinestars-tech7-2025",
    short_desc_he:
      "ה-sweet spot של Alpinestars. הגנה מקצועית, נוח מהיום הראשון, סוליה ניתנת להחלפה. ה-Tech 7 מוכר יותר מהדגל.",
    pros_he: [
      "נוח מהיום הראשון - כמעט ללא שבירה",
      "סוליה ניתנת להחלפה - חוסך כסף לאורך זמן",
      "קל יותר מ-Tech 10",
      "תואם knee brace",
      "CE certified",
    ],
    cons_he: [
      "פחות הגנת קרסול מ-Tech 10",
      "לא עמיד למים",
      "חתך גבוה בקרסול - לא לכל כף רגל",
    ],
    best_for_he:
      "רוכבי סוף שבוע, Enduro בינוני, מי שרוצה Tech 10 level בלי המחיר",
    fit_notes_he: "חתך סטנדרטי-גבוה. פתח עליון רחב - מתאים לברך. אמת למידה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187582-ALPINESTARS",
        price_ils: 1400,
      },
      {
        store: "Alpinestars ישראל",
        url: "https://alpinestars.co.il/category/%D7%A7%D7%A1%D7%93%D7%95%D7%AA+%D7%95%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94/%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94+%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2%D7%99+%D7%A9%D7%98%D7%97+/%D7%9E%D7%92%D7%A4%D7%99+%D7%A9%D7%98%D7%97",
        price_ils: 1420,
      },
      { store: "אבזריון", url: "https://avzrion.co.il/%D7%9E%D7%92%D7%A4%D7%99-%D7%A9%D7%98%D7%97", price_ils: 1440 },
      { store: "EFM Sports", url: "https://efmsports.co.il/brand/alpinestars" },
    ],
    unsplash_image: img_alpinestars_tech7_2025,
  },
  {
    id: "alpinestars-tech7-enduro-drystar-2026",
    brand: "Alpinestars",
    model: "Tech 7 Enduro Drystar",
    year: 2026,
    type: "enduro",
    level: "pro",
    safety_standard: "CE EN 13634:2017",
    waterproof: true,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU medial + lateral torsion control",
    weight_grams_per_boot: 1560,
    price_usd: 500,
    price_ils_approx: 1850,
    women_version_available: false,
    women_notes: "Unisex. Drystar = עמיד למים. מתאים לחורף ישראלי ולשטח בוצי.",
    slug: "alpinestars-tech7-enduro-drystar-2026",
    short_desc_he:
      "Tech 7 עם Drystar - עמיד למים מלא. החידוש של 2026. מתאים לשטח בוצי וחורפי.",
    pros_he: [
      "Drystar - עמיד למים מלא",
      "סוליה אנדורו - אחיזה בשטח",
      "כל היתרונות של Tech 7",
      "חדש 2026",
    ],
    cons_he: ["יקר יחסית ל-Tech 7 הרגיל", "פחות מאוורר בקיץ"],
    best_for_he: "חורף ישראלי, שטח בוצי, נחלים, אנדורו בתנאי מזג אוויר משתנים",
    fit_notes_he: "זהה ל-Tech 7. אמת למידה.",
    retailers_israel: [
      { store: "אבזריון", url: "https://avzrion.co.il/%D7%9E%D7%92%D7%A4%D7%99-%D7%A9%D7%98%D7%97", price_ils: 1850 },
      {
        store: "Alpinestars ישראל",
        url: "https://alpinestars.co.il/category/%D7%A7%D7%A1%D7%93%D7%95%D7%AA+%D7%95%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94/%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94+%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2%D7%99+%D7%A9%D7%98%D7%97+/%D7%9E%D7%92%D7%A4%D7%99+%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_alpinestars_tech7_enduro_drystar_2026,
  },
  {
    id: "alpinestars-tech5-2025",
    brand: "Alpinestars",
    model: "Tech 5",
    year: 2025,
    type: "motocross",
    level: "mid",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU shin plate + medial protector",
    weight_grams_per_boot: 1450,
    price_usd: 260,
    price_ils_approx: 960,
    women_version_available: false,
    women_notes:
      "Unisex. ה-entry point האמיתי של Alpinestars - נוח, אמין, מחיר סביר.",
    slug: "alpinestars-tech5-2025",
    short_desc_he:
      "ה-entry point של Alpinestars. הגנה סבירה, נוחות מהיום הראשון, מחיר נגיש.",
    pros_he: [
      "נוח מהיום הראשון",
      "CE certified",
      "תואם knee brace",
      "מחיר נגיש לאלפינסטארס",
    ],
    cons_he: [
      "סוליה לא ניתנת להחלפה",
      "פחות הגנת קרסול מ-Tech 7",
      "לא עמיד למים",
    ],
    best_for_he: "מתחילים שרוצים Alpinestars בתקציב סביר",
    fit_notes_he: "חתך סטנדרטי. אמת למידה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187582-ALPINESTARS",
        price_ils: 960,
      },
      {
        store: "Alpinestars ישראל",
        url: "https://alpinestars.co.il/category/%D7%A7%D7%A1%D7%93%D7%95%D7%AA+%D7%95%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94/%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94+%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2%D7%99+%D7%A9%D7%98%D7%97+/%D7%9E%D7%92%D7%A4%D7%99+%D7%A9%D7%98%D7%97",
      },
      { store: "EFM Sports", url: "https://efmsports.co.il/brand/alpinestars" },
    ],
    unsplash_image: img_alpinestars_tech5_2025,
  },
  {
    id: "alpinestars-tech3-2025",
    brand: "Alpinestars",
    model: "Tech 3",
    year: 2025,
    type: "motocross",
    level: "entry",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU shin plate בסיסי",
    weight_grams_per_boot: 1380,
    price_usd: 180,
    price_ils_approx: 670,
    women_version_available: false,
    women_notes:
      "Unisex. הכי קל וגמיש בסדרת Tech - מתאים גם לנשים עם כף רגל קטנה.",
    slug: "alpinestars-tech3-2025",
    short_desc_he:
      "הכניסה לסדרת Tech של Alpinestars. קל, גמיש, CE certified. מתאים למתחילים ולשטח קל.",
    pros_he: [
      "הכי קל בסדרת Tech",
      "גמיש מהיום הראשון",
      "CE certified",
      "מחיר entry level",
    ],
    cons_he: ["הגנה מינימלית", "לא מתאים לשטח טכני", "סוליה לא ניתנת להחלפה"],
    best_for_he: "מתחילים מוחלטים, ילדים ונוער, שטח קל ומסלולים",
    fit_notes_he: "חתך סטנדרטי. מגיע גם במידות קטנות - מתאים לנשים ונוער.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187582-ALPINESTARS",
        price_ils: 670,
      },
      {
        store: "Alpinestars ישראל",
        url: "https://alpinestars.co.il/category/%D7%A7%D7%A1%D7%93%D7%95%D7%AA+%D7%95%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94/%D7%A6%D7%99%D7%95%D7%93+%D7%A8%D7%9B%D7%99%D7%91%D7%94+%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2%D7%99+%D7%A9%D7%98%D7%97+/%D7%9E%D7%92%D7%A4%D7%99+%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_alpinestars_tech3_2025,
  },
  {
    id: "sidi-crossfire3-srs-2025",
    brand: "Sidi",
    model: "Crossfire 3 SRS",
    year: 2025,
    type: "motocross",
    level: "elite",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "narrow",
    ankle_protection: "Dual Flex ankle - מגביל תנועה מחוץ לטווח אנטומי",
    weight_grams_per_boot: 1580,
    price_usd: 580,
    price_ils_approx: 2150,
    women_version_available: true,
    women_notes:
      "קיימת גרסת נשים רשמית (SRS Women). חתך צר - מצוין לרגל צרה. לרגל רחבה - בחרו Crossfire 3 TA שיש לו תיבת בוהן רחבה יותר.",
    slug: "sidi-crossfire3-srs-2025",
    short_desc_he:
      "המגף הכי עמיד בשוק. רכיבים ניתנים להחלפה - סוליה, אבזמים, מגיני קרסול. חיי מוצר של 10+ שנים.",
    pros_he: [
      "רכיבים ניתנים להחלפה - הכי עמיד בשוק",
      "Dual Flex ankle - הגנה מצוינת",
      "אבזמי Cam-Lock - הנוחים ביותר בשוק",
      "גרסת נשים זמינה",
      "עמידות 10+ שנים עם תחזוקה נכונה",
    ],
    cons_he: ["חתך צר - לא לרגל רחבה", "יקר", "מורכב יחסית להחלפת חלקים"],
    best_for_he:
      "רוכבים שרוצים מגף לחיים. רגל צרה. מי שמחשב עלות לשנה ולא מחיר ראשוני",
    fit_notes_he: "חתך צר. לרגל צרה - אמת למידה. לרגל רחבה - בחרו TA או מותג אחר.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-",
        price_ils: 2150,
      },
      {
        store: "EFM Sports",
        url: "https://efmsports.co.il/product-category/%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2/%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2-%D7%A9%D7%98%D7%97",
      },
      {
        store: "KTM Israel",
        url: "https://ktmisrael.co.il/product-category/%D7%90%D7%91%D7%99%D7%96%D7%A8%D7%99%D7%9D-%D7%9C%D7%A8%D7%95%D7%9B%D7%91/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%90%D7%91%D7%99%D7%96%D7%A8%D7%99%D7%9D-%D7%9C%D7%A8%D7%95%D7%9B%D7%91/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_sidi_crossfire3_srs_2025,
  },
  {
    id: "sidi-crossfire3-ta-2025",
    brand: "Sidi",
    model: "Crossfire 3 TA",
    year: 2025,
    type: "motocross",
    level: "elite",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "wide",
    ankle_protection: "Dual Flex ankle",
    weight_grams_per_boot: 1590,
    price_usd: 580,
    price_ils_approx: 2150,
    women_version_available: false,
    women_notes:
      "TA = Tenax Alu - תיבת בוהן רחבה. המלצה לנשים עם רגל רחבה שרוצות Sidi.",
    slug: "sidi-crossfire3-ta-2025",
    short_desc_he:
      "Crossfire 3 עם תיבת בוהן רחבה (TA). כל יתרונות ה-SRS לרגל רחבה.",
    pros_he: [
      "תיבת בוהן רחבה - לרגל רחבה",
      "כל יתרונות ה-Crossfire 3 SRS",
      "רכיבים ניתנים להחלפה",
    ],
    cons_he: ["יקר", "קשה למצוא בישראל - לרוב הזמנה"],
    best_for_he: "רגל רחבה שרוצה Sidi. כולל נשים עם רגל רחבה",
    fit_notes_he: "רחב יותר מ-SRS. לרגל רחבה - אמת למידה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-",
      },
      {
        store: "EFM Sports",
        url: "https://efmsports.co.il/product-category/%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2/%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2-%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_sidi_crossfire3_ta_2025,
  },
  {
    id: "gaerne-sg22-2025",
    brand: "Gaerne",
    model: "SG-22",
    year: 2025,
    type: "motocross",
    level: "elite",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "wide",
    ankle_protection: "מערכת תמיכה מתקדמת + ריפוד זיכרון",
    weight_grams_per_boot: 1720,
    price_usd: 550,
    price_ils_approx: 2050,
    women_version_available: false,
    women_notes:
      "Unisex. חתך רחב - טוב לנשים עם רגל עגולה. כבד יחסית. ייצור ידני באיטליה.",
    slug: "gaerne-sg22-2025",
    short_desc_he:
      "הדגם החדיש של Gaerne. ייצור ידני באיטליה, ריפוד זיכרון, חתך רחב. כבד אבל הגנה ללא פשרות.",
    pros_he: [
      "ייצור ידני באיטליה - גמר יוצא דופן",
      "ריפוד זיכרון - נוח ביותר",
      "חתך רחב - לרגל עגולה",
      "סוליה ניתנת להחלפה",
    ],
    cons_he: [
      "הכי כבד בקטגוריה - מרגישים אחרי שעות רכיבה",
      "קשוח - שבירה ארוכה",
      "לא מתאים לשטח שידרוש הליכה",
    ],
    best_for_he: "רגל רחבה ועגולה. מי שרוצה ייצור אירופאי מהשורה הראשונה",
    fit_notes_he: "רחב מ-Sidi ו-Alpinestars. לרגל רחבה - אמת למידה. לרגל צרה - קטן יותר.",
    retailers_israel: [
      { store: "EFM Sports", url: "https://efmsports.co.il/brand/gaerne", price_ils: 2050 },
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-",
      },
    ],
    unsplash_image: img_gaerne_sg22_2025,
  },
  {
    id: "gaerne-sg12-2025",
    brand: "Gaerne",
    model: "SG-12",
    year: 2025,
    type: "enduro",
    level: "pro",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "wide",
    ankle_protection: "shin protection חזק + instep guard",
    weight_grams_per_boot: 1680,
    price_usd: 420,
    price_ils_approx: 1550,
    women_version_available: false,
    women_notes:
      "Unisex. חתך רחב - טוב לנשים עם רגל עגולה. כבד - לרכיבות ארוכות עדיפו Leatt 5.5.",
    slug: "gaerne-sg12-2025",
    short_desc_he:
      "הקלאסיק של Gaerne. Shin + instep protection חזקים במיוחד. הרבה רוכבי אנדורו נשבעים בו.",
    pros_he: [
      "הגנת שוק ו-instep - הטובה ביותר בקטגוריה",
      "ריפוד plush - נוח לרכיבות ארוכות",
      "עמיד מאוד",
      "סוליה ניתנת להחלפה",
    ],
    cons_he: ["כבד וקשוח - מתיש ברכיבה ארוכה", "שבירה ארוכה", "כבד ברטיבות"],
    best_for_he: "אנדורו, שטח בינוני, מי שהכניסות לשוק מטרידות אותו",
    fit_notes_he: "רחב יחסית. ריפוד plush שנדחס עם הזמן. קחו מידה אמת.",
    retailers_israel: [
      { store: "EFM Sports", url: "https://efmsports.co.il/brand/gaerne", price_ils: 1550 },
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-",
      },
    ],
    unsplash_image: img_gaerne_sg12_2025,
  },
  {
    id: "fox-instinct-2025",
    brand: "Fox Racing",
    model: "Instinct",
    year: 2025,
    type: "motocross",
    level: "pro",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "Dual-compound rubber + internal ankle support",
    weight_grams_per_boot: 1490,
    price_usd: 350,
    price_ils_approx: 1300,
    women_version_available: false,
    women_notes: "Unisex. חתך סטנדרטי. נוח מהיום הראשון. מתאים גם לנשים.",
    slug: "fox-instinct-2025",
    short_desc_he:
      "המגף הכי נמכר של Fox. נוח מהיום הראשון, חתך סטנדרטי, CE certified. ה-go-to של רוכבי סוף שבוע.",
    pros_he: [
      "נוח מהיום הראשון - ללא שבירה",
      "חתך סטנדרטי - מתאים לרוב כפות הרגליים",
      "CE certified",
      "מחיר סביר לרמה",
    ],
    cons_he: ["סוליה לא ניתנת להחלפה", "פחות הגנת קרסול מ-Tech 7", "לא עמיד למים"],
    best_for_he: "רוכבי סוף שבוע, אנדורו בינוני, מי שלא רוצה לשבור מגפיים",
    fit_notes_he: "חתך סטנדרטי. אמת למידה. לרגל רחבה - נוח יחסית.",
    retailers_israel: [
      { store: "Fox Racing ישראל", url: "https://www.foxhead.co.il", price_ils: 1300 },
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187578-FOX",
        price_ils: 1280,
      },
      {
        store: "Fist Racing Shop",
        url: "https://fistracingshop.co.il/he/collections/fox-%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_fox_instinct_2025,
  },
  {
    id: "fox-motion-2025",
    brand: "Fox Racing",
    model: "Motion",
    year: 2025,
    type: "enduro",
    level: "mid",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU shin + ankle support",
    weight_grams_per_boot: 1420,
    price_usd: 280,
    price_ils_approx: 1040,
    women_version_available: false,
    women_notes: "Unisex. קל וגמיש - נוח גם לנשים. חתך בינוני.",
    slug: "fox-motion-2025",
    short_desc_he:
      "מגף אנדורו של Fox - קל, גמיש, נוח ללכת עליו גם מחוץ לאופנוע. שימושי לאנדורו ישראלי.",
    pros_he: [
      "קל וגמיש - נוח ללכת",
      "מתאים לאנדורו ישראלי שיש בו הליכה",
      "CE certified",
      "נוח מהיום הראשון",
    ],
    cons_he: ["פחות הגנה מ-Instinct", "סוליה לא ניתנת להחלפה"],
    best_for_he: "אנדורו ישראלי, שטחים שדורשים הליכה, מתחילים שרוצים נוחות",
    fit_notes_he: "חתך סטנדרטי. אמת למידה.",
    retailers_israel: [
      { store: "Fox Racing ישראל", url: "https://www.foxhead.co.il", price_ils: 1040 },
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187578-FOX",
        price_ils: 1020,
      },
      {
        store: "Fist Racing Shop",
        url: "https://fistracingshop.co.il/he/collections/fox-%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_fox_motion_2025,
  },
  {
    id: "fox-comp-x-2025",
    brand: "Fox Racing",
    model: "Comp X",
    year: 2025,
    type: "enduro",
    level: "entry",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU shin בסיסי",
    weight_grams_per_boot: 1350,
    price_usd: 200,
    price_ils_approx: 740,
    women_version_available: false,
    women_notes: "Unisex. הכי קל של Fox - מתאים למתחילים ולנשים.",
    slug: "fox-comp-x-2025",
    short_desc_he:
      "הכניסה של Fox. קל, נוח, CE certified. למתחילים ולרוכבים שלא צריכים elite protection.",
    pros_he: [
      "הכי קל בסדרת Fox",
      "נוח מהיום הראשון",
      "CE certified",
      "מחיר entry level",
    ],
    cons_he: ["הגנה בסיסית בלבד", "סוליה לא ניתנת להחלפה"],
    best_for_he: "מתחילים, שטח קל, רוכבים שרוצים Fox בתקציב מינימלי",
    fit_notes_he: "חתך סטנדרטי. אמת למידה.",
    retailers_israel: [
      { store: "Fox Racing ישראל", url: "https://www.foxhead.co.il", price_ils: 740 },
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/187578-FOX",
      },
    ],
    unsplash_image: img_fox_comp_x_2025,
  },
  {
    id: "leatt-55-flexlock-2026",
    brand: "Leatt",
    model: "5.5 Flexlock",
    year: 2026,
    type: "enduro",
    level: "pro",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "FlexLock - מתכוונן, מפחית כוח על קרסול עד 37%",
    weight_grams_per_boot: 1480,
    price_usd: 380,
    price_ils_approx: 1400,
    women_version_available: false,
    women_notes:
      "Unisex. FlexLock מתכוונן - ניתן לכוונן לגמישות רגל נשית. תאימות מצוינת ל-neck brace + knee brace של Leatt.",
    slug: "leatt-55-flexlock-2026",
    short_desc_he:
      "FlexLock - מערכת גמישות מתכווננת ייחודית. מפחית עומס על הקרסול עד 37%. הדגם החדש של 2026.",
    pros_he: [
      "FlexLock - גמישות מתכווננת, הפחתת עומס 37% על קרסול",
      "DualZone sole - אחיזה + תמיכה",
      "SlideLock Velcro סגירה עליונה",
      "סוליה ניתנת להחלפה",
      "6 colorways",
    ],
    cons_he: ["חדש - פחות ביקורות שטח", "מחיר בינוני-גבוה"],
    best_for_he:
      "אנדורו, Hard Enduro, מי שיש לו בעיות קרסול, רוכבי Leatt ecosystem",
    fit_notes_he: "חתך סטנדרטי-רחב. מתאים לרגל בינונית ורחבה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/186797-LEATT-",
        price_ils: 1400,
      },
      {
        store: "Fist Racing Shop",
        url: "https://fistracingshop.co.il/collections/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97-leatt",
      },
      {
        store: "KTM Israel",
        url: "https://ktmisrael.co.il/product-category/%D7%9E%D7%95%D7%AA%D7%92%D7%99%D7%9D/leatt",
      },
      {
        store: "EFM Sports",
        url: "https://efmsports.co.il/product-category/%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2/%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2-%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_leatt_55_flexlock_2026,
  },
  {
    id: "leatt-45-hydradry-2025",
    brand: "Leatt",
    model: "4.5 HydraDry",
    year: 2025,
    type: "enduro",
    level: "mid",
    safety_standard: "CE EN 13634:2017",
    waterproof: true,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "3DF AirFit impact foam סביב הקרסול",
    weight_grams_per_boot: 1430,
    price_usd: 300,
    price_ils_approx: 1100,
    women_version_available: true,
    women_notes:
      "קיימת גרסת ADV נשים. HydraDry = עמיד למים. מתאים לחורף ישראלי. חתך בינוני - נוח לנשים.",
    slug: "leatt-45-hydradry-2025",
    short_desc_he:
      "מגף אנדורו עמיד למים של Leatt. HydraDry, סוליה ניתנת להחלפה, CE certified. Sweet spot לחורף ישראלי.",
    pros_he: [
      "HydraDry - עמיד למים מלא",
      "סוליה ניתנת להחלפה",
      "נוח מהיום הראשון",
      "CE certified",
      "גרסת נשים זמינה",
    ],
    cons_he: ["פחות מאוורר בקיץ", "פחות הגנה מ-5.5"],
    best_for_he: "חורף ישראלי, שטח בוצי, אנדורו במזג אוויר משתנה",
    fit_notes_he: "חתך בינוני-רחב. אמת למידה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/186797-LEATT-",
        price_ils: 1100,
      },
      {
        store: "KTM Israel",
        url: "https://ktmisrael.co.il/product-category/%D7%9E%D7%95%D7%AA%D7%92%D7%99%D7%9D/leatt",
      },
      {
        store: "EFM Sports",
        url: "https://efmsports.co.il/product-category/%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2/%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2-%D7%A9%D7%98%D7%97",
      },
    ],
    unsplash_image: img_leatt_45_hydradry_2025,
  },
  {
    id: "leatt-35-2025",
    brand: "Leatt",
    model: "3.5",
    year: 2025,
    type: "motocross",
    level: "entry",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "3DF AirFit foam בסיסי",
    weight_grams_per_boot: 1350,
    price_usd: 200,
    price_ils_approx: 740,
    women_version_available: false,
    women_notes: "Unisex. הכי קל וגמיש של Leatt - מתאים למתחילים ולנשים.",
    slug: "leatt-35-2025",
    short_desc_he:
      "הכניסה של Leatt. קל, גמיש, CE certified. למתחילים ולרכיבה קלה.",
    pros_he: ["קל וגמיש", "CE certified", "נוח מהיום הראשון", "מחיר entry"],
    cons_he: ["הגנה בסיסית", "סוליה לא ניתנת להחלפה"],
    best_for_he: "מתחילים, שטח קל, נשים שמחפשות מגף קל",
    fit_notes_he: "חתך בינוני. אמת למידה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-/186797-LEATT-",
        price_ils: 740,
      },
      {
        store: "Fist Racing Shop",
        url: "https://fistracingshop.co.il/collections/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97-leatt",
      },
    ],
    unsplash_image: img_leatt_35_2025,
  },
  {
    id: "forma-terra-evo-2025",
    brand: "Forma",
    model: "Terra Evo",
    year: 2025,
    type: "enduro",
    level: "mid",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: true,
    knee_brace_compatible: true,
    toe_box_width: "standard",
    ankle_protection: "TPU shin + ankle support",
    weight_grams_per_boot: 1440,
    price_usd: 260,
    price_ils_approx: 960,
    women_version_available: false,
    women_notes:
      "Unisex. Forma - מותג איטלקי. ערך מצוין למחיר. חתך סטנדרטי.",
    slug: "forma-terra-evo-2025",
    short_desc_he:
      "מגף אנדורו איטלקי ב-mid range. ערך מצוין למחיר, סוליה ניתנת להחלפה, CE certified.",
    pros_he: [
      "ייצור איטלקי - גמר טוב",
      "סוליה ניתנת להחלפה",
      "ערך מצוין למחיר",
      "CE certified",
    ],
    cons_he: ["פחות מוכר בישראל", "פחות נפוץ מ-Alpinestars/Fox"],
    best_for_he: "רוכבים שרוצים איכות איטלקית בתקציב mid-range",
    fit_notes_he: "חתך סטנדרטי. אמת למידה.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-",
        price_ils: 960,
      },
    ],
    unsplash_image: img_forma_terra_evo_2025,
  },
  {
    id: "acerbis-x-move-2025",
    brand: "Acerbis",
    model: "X-Move",
    year: 2025,
    type: "motocross",
    level: "entry",
    safety_standard: "CE EN 13634:2017",
    waterproof: false,
    replaceable_sole: false,
    knee_brace_compatible: true,
    toe_box_width: "wide",
    ankle_protection: "TPU בסיסי",
    weight_grams_per_boot: 1320,
    price_usd: 160,
    price_ils_approx: 590,
    women_version_available: false,
    women_notes:
      "Unisex. חתך רחב - נוח לנשים עם רגל רחבה. הכי זול בשוק עם CE certification.",
    slug: "acerbis-x-move-2025",
    short_desc_he:
      "הזול ביותר עם CE certification. Acerbis - מותג אירופאי. חתך רחב, קל, נוח.",
    pros_he: [
      "הכי זול עם CE certification",
      "חתך רחב - לרגל רחבה",
      "קל מאוד",
      "נוח מהיום הראשון",
    ],
    cons_he: ["הגנה מינימלית", "עמידות נמוכה יחסית", "לא ל-Hard Enduro"],
    best_for_he: "מתחילים מוחלטים עם תקציב מוגבל, ילדים, שטח קל",
    fit_notes_he: "חתך רחב. לרגל צרה - קחו קטן יותר.",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/121092-%D7%9E%D7%92%D7%A4%D7%99%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%99%D7%91%D7%AA-%D7%A9%D7%98%D7%97-",
        price_ils: 590,
      },
    ],
    unsplash_image: img_acerbis_x_move_2025,
  },
];

export const getBootBySlug = (slug: string): BootProduct | undefined =>
  BOOTS.find((b) => b.slug === slug);

export const getAllBootBrands = (): string[] => [
  ...new Set(BOOTS.map((b) => b.brand)),
];

export const WIDTH_LABELS: Record<BootWidth, string> = {
  narrow: "צר",
  standard: "סטנדרטי",
  wide: "רחב",
};

export const LEVEL_LABELS: Record<BootLevel, string> = {
  entry: "כניסה",
  mid: "בינוני",
  pro: "מקצועי",
  elite: "עלית",
};

export const TYPE_LABELS: Record<BootType, string> = {
  motocross: "מוטוקרוס",
  enduro: "אנדורו",
  adventure: "אדוונצ'ר",
};