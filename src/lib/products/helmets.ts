// helmets-database.ts
// הדבק את זה ב: src/lib/products/helmets.ts
// לובאבל יבנה ממנו את קטלוג הקסדות

export type HelmLevel = "entry" | "mid" | "pro" | "elite";
export type HelmType = "motocross" | "enduro" | "full-face";
export type ShellMaterial = "polycarbonate" | "fiberglass" | "carbon";

export interface HelmRetailerIsrael {
  name: string;
  url: string;
  type: "official" | "parallel" | "multi-brand";
  ships_nationwide: boolean;
}

export interface HelmProduct {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: HelmType;
  level: HelmLevel;
  shell: ShellMaterial;
  safety_standard: string;
  rotation_protection: string;
  weight_grams: number;
  price_usd: number;
  price_ils_approx: number;
  includes_goggles: boolean;
  slug: string;
  short_desc_he: string;
  pros_he: string[];
  cons_he: string[];
  best_for_he: string;
  retailers_israel: {
    store: string;
    url: string;
    price_ils?: number;
  }[];
  unsplash_image: string;
}

// ============================================================
// חנויות ישראל - רשימה מלאה לשימוש חוזר
// ============================================================
export const ISRAEL_RETAILERS: HelmRetailerIsrael[] = [
  {
    name: "מוטוליין",
    url: "https://www.motoline.co.il/121086-%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "Fox Racing ישראל (יבואן רשמי)",
    url: "https://www.foxhead.co.il",
    type: "official",
    ships_nationwide: true,
  },
  {
    name: "Fist Racing Shop",
    url: "https://fistracingshop.co.il",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "EFM Sports",
    url: "https://efmsports.co.il/product-category/%D7%90%D7%95%D7%A4%D7%A0%D7%95%D7%A2/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "KTM Israel (אופרוד)",
    url: "https://ktmisrael.co.il/product-category/%D7%90%D7%91%D7%99%D7%96%D7%A8%D7%99%D7%9D-%D7%9C%D7%A8%D7%95%D7%9B%D7%91/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "ירימי Racing",
    url: "https://www.yracing.co.il/267996-%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "דור אופנועים",
    url: "https://dormotor.co.il/product-category/%D7%9B%D7%9C-%D7%94%D7%A7%D7%A1%D7%93%D7%95%D7%AA/%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "Alpinestars ישראל",
    url: "https://alpinestars.co.il",
    type: "parallel",
    ships_nationwide: true,
  },
  {
    name: "MotoJbore",
    url: "https://www.motojbore.co.il/256737-%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97",
    type: "multi-brand",
    ships_nationwide: true,
  },
  {
    name: "Fox Racing ישראל (foxracing.co.il)",
    url: "https://www.foxracing.co.il",
    type: "parallel",
    ships_nationwide: true,
  },
];

// ============================================================
// מוצרים - מסד נתונים מלא
// ============================================================
export const HELMETS: HelmProduct[] = [

  // ─── FOX RACING ───────────────────────────────────────────

  {
    id: "fox-v1-mips-2025",
    brand: "Fox Racing",
    model: "V1 MIPS",
    year: 2025,
    type: "motocross",
    level: "entry",
    shell: "polycarbonate",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "MIPS",
    weight_grams: 1450,
    price_usd: 210,
    price_ils_approx: 780,
    includes_goggles: false,
    slug: "fox-v1-mips-2025",
    short_desc_he: "קסדת הכניסה של Fox - הגנה מעולה למחיר שפוי. MIPS, ECE 22.06, 9 כניסות אוויר.",
    pros_he: [
      "MIPS - הגנה סיבובית במחיר entry level",
      "ECE 22.06 - תקן אירופאי מחמיר",
      "9 כניסות אוויר + 4 יציאות",
      "מגוון גדול של צביעות",
      "כולל כיס אחסון",
    ],
    cons_he: [
      "פוליקרבונט - כבד יחסית לקרבון",
      "לא כולל גוגל",
      "חיי מדף קצרים יחסית (3–5 שנים)",
    ],
    best_for_he: "מתחילים ורוכבים מזדמנים שרוצים בטיחות טובה בלי לבזבז",
    retailers_israel: [
      { store: "מוטוליין (V1 Kairos V26)", url: "https://www.motoline.co.il/items/8483488-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A9%D7%97%D7%95%D7%A8-%D7%9B%D7%AA%D7%95%D7%9D-FOX-V1-KAIROS-V26", price_ils: 790 },
      { store: "Fox Racing ישראל (V1 Kairos V26)", url: "https://www.foxhead.co.il/items/8483484-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%9C%D7%91%D7%9F-%D7%90%D7%93%D7%95%D7%9D-FOX-V1-KAIROS-V26", price_ils: 810 },
      { store: "מוטוליין (V1 Shield V26)", url: "https://www.motoline.co.il/items/8483370-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%90%D7%93%D7%95%D7%9D-FOX-V1-SHIELD-V26" },
      { store: "Fox Racing ישראל (V1 Solid V24)", url: "https://www.foxhead.co.il/items/6613181-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A9%D7%97%D7%95%D7%A8-%D7%9E%D7%91%D7%A8%D7%99%D7%A7-FOX-V1-SOLID-" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },

  {
    id: "fox-v3-mips-2025",
    brand: "Fox Racing",
    model: "V3 MIPS",
    year: 2025,
    type: "motocross",
    level: "mid",
    shell: "fiberglass",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "MIPS",
    weight_grams: 1320,
    price_usd: 380,
    price_ils_approx: 1400,
    includes_goggles: false,
    slug: "fox-v3-mips-2025",
    short_desc_he: "קסדת הדגל של Fox בחומר פיברגלס. קלה, מאווררת, MIPS. ה-sweet spot של הסדרה.",
    pros_he: [
      "פיברגלס - קל משמעותית מ-V1",
      "MIPS מדור מתקדם יותר",
      "אוורור מצוין - מצחייה עם 3 נקודות שבירה",
      "כולל ריפוד חלופי",
      "כולל תיק אחסון",
    ],
    cons_he: [
      "לא כולל גוגל",
      "יקר מה-V1 בכ-₪600",
    ],
    best_for_he: "רוכבי סוף שבוע שיוצאים באופן קבוע ורוצים קסדה שתחזיק לשנים",
    retailers_israel: [
      { store: "מוטוליין (V3 Drip V26 שחור/סגול)", url: "https://www.motoline.co.il/items/8427956-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A9%D7%97%D7%95%D7%A8-%D7%A1%D7%92%D7%95%D7%9C-FOX-V3-DRIP-V26", price_ils: 1380 },
      { store: "מוטוליין (V3 Drip V26 טורקיז)", url: "https://www.motoline.co.il/items/8428320-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%98%D7%95%D7%A8%D7%A7%D7%99%D7%96-FOX-V3-DRIP-V26", price_ils: 1420 },
      { store: "מוטוליין (V3 Throttle V25)", url: "https://www.motoline.co.il/items/7290769-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A6%D7%91%D7%A2%D7%95%D7%A0%D7%99-FOX-V3-THROTTLE-V25" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },

  {
    id: "fox-v3rs-carbon-2025",
    brand: "Fox Racing",
    model: "V3 RS Carbon",
    year: 2025,
    type: "motocross",
    level: "pro",
    shell: "carbon",
    safety_standard: "ECE 22.06 / DOT / Snell",
    rotation_protection: "MIPS Integra Split",
    weight_grams: 1315,
    price_usd: 600,
    price_ils_approx: 2200,
    includes_goggles: false,
    slug: "fox-v3rs-carbon-2025",
    short_desc_he: "קסדת הדגל של Fox. קרבון 4K, MIPS Integra Split, ECE 22.06. רוכב מני לטנביכלר - אלוף עולם Hard Enduro - רוכב עם הקסדה הזאת.",
    pros_he: [
      "קרבון 4K - קל וחזק",
      "MIPS Integra Split - הדור הבא של הגנה סיבובית",
      "תמורה יוצאת דופן - מתחרה בקסדות ב-₪2,800+",
      "מגיע עם ריפודים חלופיים",
      "אוורור ברמת top-tier",
    ],
    cons_he: [
      "כבד יחסית לקרבון מתחרה (Leatt 9.5)",
      "לא כולל גוגל",
    ],
    best_for_he: "רוכבים רציניים, Enduro, Hard Enduro - מי שרוצה pro level בלי לשלם elite",
    retailers_israel: [
      { store: "Fox Racing ישראל (V3 RS Carbon Solid שחור)", url: "https://www.foxhead.co.il/items/7286965-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A7%D7%A8%D7%91%D7%95%D7%9F-%D7%A9%D7%97%D7%95%D7%A8-FOX-V3-RS-CARBON-SOLID-V25", price_ils: 2200 },
      { store: "Fox Racing ישראל (V3 RS Carbon Solid לבן)", url: "https://www.foxhead.co.il/items/7286979-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A7%D7%A8%D7%91%D7%95%D7%9F-%D7%9C%D7%91%D7%9F-FOX-V3-RS-CARBON-SOLID-V25", price_ils: 2200 },
      { store: "Fox Racing ישראל (V3 RS Carbon Solid ירוק)", url: "https://www.foxhead.co.il/items/7286999-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A7%D7%A8%D7%91%D7%95%D7%9F-%D7%99%D7%A8%D7%95%D7%A7-FOX-V3-RS-CARBON-SOLID-V25", price_ils: 2200 },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },

  // ─── BELL ─────────────────────────────────────────────────

  {
    id: "bell-mx9-mips-2025",
    brand: "Bell",
    model: "MX-9 MIPS",
    year: 2025,
    type: "motocross",
    level: "entry",
    shell: "polycarbonate",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "MIPS",
    weight_grams: 1500,
    price_usd: 180,
    price_ils_approx: 670,
    includes_goggles: false,
    slug: "bell-mx9-mips-2025",
    short_desc_he: "הקסדה הכי מאווררת בקטגוריית entry. מתאימה לכמעט כל גוגל. ECE 22.06 ו-MIPS במחיר שפוי.",
    pros_he: [
      "אוורור מהטובים בקטגוריה - נשמת גם בקיץ ישראלי",
      "מתאים לכמעט כל גוגל בשוק",
      "MIPS + ECE 22.06",
      "Bell - 100 שנות ניסיון",
    ],
    cons_he: [
      "פוליקרבונט - כבד",
      "קצת רועשת בשטח מהיר",
      "לא כולל גוגל",
    ],
    best_for_he: "מתחילים שרוצים בטיחות + אוורור מקסימלי בתקציב סביר",
    retailers_israel: [
      { store: "מוטוליין (MX-9 ADV MIPS אפור/כחול)", url: "https://www.motoline.co.il/items/7963986-%D7%A7%D7%A1%D7%93%D7%94-%D7%93%D7%95-%D7%A9%D7%99%D7%9E%D7%95%D7%A9%D7%99%D7%AA-%D7%91%D7%9C-%D7%90%D7%A4%D7%95%D7%A8-%D7%9B%D7%97%D7%95%D7%9C-BELL-MX-9-ADV-MIPS-", price_ils: 680 },
      { store: "מוטוליין (MX-9 ADV MIPS Dash שחור מט)", url: "https://www.motoline.co.il/items/3884928-%D7%A7%D7%A1%D7%93%D7%94-%D7%93%D7%95-%D7%A9%D7%99%D7%9E%D7%95%D7%A9%D7%99%D7%AA-%D7%91%D7%9C-%D7%A9%D7%97%D7%95%D7%A8-%D7%9E%D7%98-BELL-MX-9-ADV-MIPS-DASH" },
      { store: "מוטוליין (כל קסדות Bell)", url: "https://www.motoline.co.il/251821-%D7%A6%D7%99%D7%95%D7%93-%D7%9C%D7%A8%D7%95%D7%9B%D7%91-%D7%9B%D7%91%D7%99%D7%A9/278520-BELL" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
  },

  {
    id: "bell-moto10-spherical-2025",
    brand: "Bell",
    model: "Moto-10 Spherical",
    year: 2025,
    type: "motocross",
    level: "elite",
    shell: "carbon",
    safety_standard: "ECE 22.06 / DOT / Snell",
    rotation_protection: "MIPS Spherical",
    weight_grams: 1250,
    price_usd: 850,
    price_ils_approx: 3100,
    includes_goggles: false,
    slug: "bell-moto10-spherical-2025",
    short_desc_he: "קסדת הדגל של Bell. קרבון 3K, MIPS Spherical - הטכנולוגיה המתקדמת ביותר. ללא פשרות.",
    pros_he: [
      "MIPS Spherical - רמת ההגנה הגבוהה ביותר",
      "קרבון 3K - קל מאוד",
      "אוורור פנומנלי",
      "Bell - ממציאת הקסדה full-face",
    ],
    cons_he: [
      "הכי יקר בקטגוריה",
      "קשה למצוא במלאי בישראל",
    ],
    best_for_he: "מתחרים ורוכבי Hard Enduro מקצועיים שלא מתפשרים",
    retailers_israel: [
      { store: "Y-Racing (Moto-10 Spherical Slayco Amber)", url: "https://www.yracing.co.il/items/8878466-%D7%A7%D7%A1%D7%93%D7%AA-%D7%A9%D7%98%D7%97-%D7%91%D7%9C-BELL-Moto-10-Spherical-slayco-amber-%D7%A6%D7%91%D7%A2-%D7%A9%D7%97%D7%95%D7%A8", price_ils: 3100 },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
  },

  // ─── LEATT ────────────────────────────────────────────────

  {
    id: "leatt-35-v25",
    brand: "Leatt",
    model: "Moto 3.5 V25",
    year: 2025,
    type: "motocross",
    level: "entry",
    shell: "polycarbonate",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "Turbine 360°",
    weight_grams: 1390,
    price_usd: 220,
    price_ils_approx: 820,
    includes_goggles: true,
    slug: "leatt-35-v25",
    short_desc_he: "קסדת הכניסה של Leatt - כוללת גוגל Velocity 4.5 במתנה. Turbine 360° במחיר entry.",
    pros_he: [
      "כוללת גוגל Leatt Velocity 4.5 בחינם - חיסכון של ₪300–400",
      "Turbine 360° - הגנה סיבובית של Leatt",
      "ECE 22.06",
      "תאימות מושלמת ל-neck brace של Leatt",
    ],
    cons_he: [
      "פוליקרבונט",
      "כבד יחסית",
    ],
    best_for_he: "מתחילים שרוצים חבילה מלאה (קסדה + גוגל) בתקציב סביר",
    retailers_israel: [
      { store: "מוטוליין (Moto 3.5 JR V26 - לרוכבים קלים)", url: "https://www.motoline.co.il/items/8762755-%D7%A7%D7%A1%D7%93%D7%AA-%D7%99%D7%9C%D7%93%D7%99%D7%9D-%D7%9C%D7%99%D7%98-%D7%A6%D7%94%D7%95%D7%91-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-%D7%9E%D7%AA%D7%A0%D7%94-LEATT-MOTO-3-5-JR-V26", price_ils: 830 },
      { store: "מוטוליין (כל קסדות Leatt)", url: "https://www.motoline.co.il/121086-%D7%A7%D7%A1%D7%93%D7%95%D7%AA-%D7%A9%D7%98%D7%97/186797-LEATT-" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80",
  },

  {
    id: "leatt-75-v25",
    brand: "Leatt",
    model: "Moto 7.5 V25",
    year: 2025,
    type: "motocross",
    level: "mid",
    shell: "fiberglass",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "Turbine 360°",
    weight_grams: 1280,
    price_usd: 420,
    price_ils_approx: 1550,
    includes_goggles: true,
    slug: "leatt-75-v25",
    short_desc_he: "פיברגלס קל, Turbine 360°, כולל גוגל Velocity 4.5. ה-sweet spot של Leatt.",
    pros_he: [
      "כוללת גוגל Velocity 4.5 - חיסכון אמיתי",
      "פיברגלס - קל ואיכותי",
      "Turbine 360° מדור מתקדם",
      "תאימות מושלמת ל-neck brace",
    ],
    cons_he: [
      "כבד מ-9.5",
      "הגוגל המצורף דורש התרגלות",
    ],
    best_for_he: "רוכבים שיוצאים כל שבוע ורוצים חבילת Leatt מלאה",
    retailers_israel: [
      { store: "מוטוליין (Moto 7.5 V26 אדום)", url: "https://www.motoline.co.il/items/8762653-%D7%A7%D7%A1%D7%93%D7%AA-%D7%9C%D7%99%D7%98-7-5-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-%D7%9B%D7%97-%D7%A6%D7%94-LEATT-MOTO-7-5-HELMET-V26", price_ils: 1550 },
      { store: "מוטוליין (Moto 7.5 Royal V22)", url: "https://www.motoline.co.il/items/4173399-%D7%A7%D7%A1%D7%93%D7%AA-%D7%9C%D7%99%D7%98-7-5-%D7%9B%D7%97%D7%95%D7%9C-%D7%90%D7%93%D7%95%D7%9D-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-LEATT-MOTO-7-5-ROYAL-V22", price_ils: 1520 },
      { store: "מוטוליין (Moto 7.5 Lime V22)", url: "https://www.motoline.co.il/items/4173385-%D7%A7%D7%A1%D7%93%D7%AA-%D7%9C%D7%99%D7%98-7-5-%D7%A6%D7%94%D7%95%D7%91-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-LEATT-MOTO-7-5-LIME-V22" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80",
  },

  {
    id: "leatt-95-carbon-v25",
    brand: "Leatt",
    model: "Moto 9.5 Carbon V25",
    year: 2025,
    type: "motocross",
    level: "elite",
    shell: "carbon",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "Turbine 360° Carbon",
    weight_grams: 1100,
    price_usd: 750,
    price_ils_approx: 2800,
    includes_goggles: true,
    slug: "leatt-95-carbon-v25",
    short_desc_he: "הקסדה הכי קלה בשוק. קרבון, Turbine 360°, כוללת גוגל Velocity 5.5. הבחירה של רוכבי Hard Enduro מקצועיים.",
    pros_he: [
      "1100 גרם - הכי קל בקטגוריה",
      "כוללת גוגל Velocity 5.5 פרימיום",
      "תאימות מושלמת ל-neck brace Leatt",
      "אוורור מצוין",
      "Turbine 360° Carbon",
    ],
    cons_he: [
      "יקר",
      "קרבון - לא יסלח על נפילה",
      "יש להחליף אחרי נפילה משמעותית",
    ],
    best_for_he: "רוכבים מתקדמים, Hard Enduro, מתחרים. מי שרוכב עם neck brace.",
    retailers_israel: [
      { store: "מוטוליין (Moto 9.5 Carbon V26)", url: "https://www.motoline.co.il/items/8378813-%D7%A7%D7%A1%D7%93%D7%AA-%D7%9C%D7%99%D7%98-%D7%A7%D7%A8%D7%91%D7%95%D7%9F-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-LEATT-MOTO-9-5-HELMET-CARBON-V26", price_ils: 2800 },
      { store: "מוטוליין (Moto 9.5 Carbon V26 לבן)", url: "https://www.motoline.co.il/items/8378793-%D7%A7%D7%A1%D7%93%D7%AA-%D7%9C%D7%99%D7%98-%D7%A7%D7%A8%D7%91%D7%95%D7%9F-%D7%9C%D7%91%D7%9F-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-LEATT-MOTO-9-5-HELMET-CARBON-V26" },
      { store: "מוטוליין (Moto 9.5 Carbon V22)", url: "https://www.motoline.co.il/items/4173354-%D7%A7%D7%A1%D7%93%D7%AA-%D7%9C%D7%99%D7%98-%D7%A7%D7%A8%D7%91%D7%95%D7%9F-%D7%9B%D7%95%D7%9C%D7%9C-%D7%9E%D7%A9%D7%A7%D7%A4%D7%99-%D7%90%D7%91%D7%A7-LEATT-MOTO-9-5-HELMET-CARBON-V22" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80",
  },

  // ─── ALPINESTARS ──────────────────────────────────────────

  {
    id: "alpinestars-sm5-2025",
    brand: "Alpinestars",
    model: "Supertech SM5",
    year: 2025,
    type: "motocross",
    level: "entry",
    shell: "polycarbonate",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "MIPS",
    weight_grams: 1420,
    price_usd: 250,
    price_ils_approx: 920,
    includes_goggles: false,
    slug: "alpinestars-sm5-2025",
    short_desc_he: "קסדת הכניסה של Alpinestars. MIPS, ECE 22.06, חיתוך רחב שמתאים לראשים עגולים.",
    pros_he: [
      "חיתוך נוח לראשים עגולים",
      "MIPS + ECE 22.06",
      "עיצוב אגרסיבי",
    ],
    cons_he: [
      "חיתוך לא מתאים לכל ראש - חובה למדוד לפני קנייה",
      "פוליקרבונט",
    ],
    best_for_he: "מתחילים שיש להם ראש עגול וחיתוך Fox לא מתאים להם",
    retailers_israel: [
      { store: "Alpinestars ישראל (יבואן רשמי)", url: "https://alpinestars.co.il", price_ils: 920 },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },

  {
    id: "alpinestars-sm10-carbon-2025",
    brand: "Alpinestars",
    model: "Supertech M10 Carbon",
    year: 2025,
    type: "motocross",
    level: "elite",
    shell: "carbon",
    safety_standard: "ECE 22.06 / DOT / Snell",
    rotation_protection: "MIPS",
    weight_grams: 1200,
    price_usd: 900,
    price_ils_approx: 3300,
    includes_goggles: false,
    slug: "alpinestars-sm10-carbon-2025",
    short_desc_he: "קסדת הדגל של Alpinestars. קרבון, MIPS multi-density EPS, חוויית לבישה פרימיום.",
    pros_he: [
      "קרבון קל במיוחד",
      "MIPS עם multi-density EPS",
      "גמר ואיכות build פרימיום",
    ],
    cons_he: [
      "הכי יקרה בקטגוריה",
      "חיתוך צר - חובה למדוד",
    ],
    best_for_he: "רוכבים מתחרים שאוהבים את מותג Alpinestars ורוצים top of the line",
    retailers_israel: [
      { store: "Alpinestars ישראל (יבואן רשמי)", url: "https://alpinestars.co.il" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },

  // ─── SHOEI ────────────────────────────────────────────────

  {
    id: "shoei-vfx-wr-2025",
    brand: "Shoei",
    model: "VFX-WR",
    year: 2025,
    type: "enduro",
    level: "elite",
    shell: "fiberglass",
    safety_standard: "ECE 22.06 / DOT",
    rotation_protection: "ללא (אין MIPS בסטנדרט)",
    weight_grams: 1350,
    price_usd: 650,
    price_ils_approx: 2400,
    includes_goggles: false,
    slug: "shoei-vfx-wr-2025",
    short_desc_he: "Handmade ביפן. גמר ואיכות שלא מתחרה. מתאים לרוכבי Enduro שרוצים קסדה שתחזיק 10 שנים.",
    pros_he: [
      "ייצור ידני ביפן - גמר ללא פשרות",
      "פיברגלס - קל ועמיד",
      "חיתוך מצוין לראשים אובליים",
      "עמידות לאורך שנים",
    ],
    cons_he: [
      "אין MIPS בסטנדרט - פחות הגנה סיבובית",
      "חיתוך צר - לא לכולם",
      "קשה למצוא בישראל",
    ],
    best_for_he: "רוכבים שמחפשים קסדה פרימיום עם גמר יפני - ולא אכפת להם מ-MIPS",
    retailers_israel: [
      { store: "אבזריון (VFX-WR 06 שחור)", url: "https://avzrion.co.il/shoei-vfx-wr-06-black", price_ils: 2400 },
      { store: "אבזריון (VFX-WR 06 לבן)", url: "https://avzrion.co.il/%D7%A7%D7%A1%D7%93%D7%AA-vfx-wr-06-%D7%9C%D7%91%D7%9F", price_ils: 2400 },
      { store: "אבזריון (VFX-WR TC-8 Allegiant)", url: "https://avzrion.co.il/tc-8-allegiant-vfx-wr" },
      { store: "אבזריון (VFX-WR 06 Jammer TC-5)", url: "https://avzrion.co.il/shoei-vfx-wr-06-jammer-tc-5", price_ils: 3116 },
      { store: "MD Moto (VFX-WR שחור)", url: "https://mdmoto.co.il/catalog.asp?page=newshowprod.asp&prodid=2652922" },
    ],
    unsplash_image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
  },

];

// ============================================================
// פונקציות עזר לשימוש ב-UI
// ============================================================

export const getHelmetsByLevel = (level: HelmLevel) =>
  HELMETS.filter((h) => h.level === level);

export const getHelmetsByBrand = (brand: string) =>
  HELMETS.filter((h) => h.brand === brand);

export const getHelmetsByBudget = (maxILS: number) =>
  HELMETS.filter((h) => h.price_ils_approx <= maxILS);

export const getHelmetBySlug = (slug: string) =>
  HELMETS.find((h) => h.slug === slug);

export const BRANDS = [...new Set(HELMETS.map((h) => h.brand))];

export const PRICE_RANGES = [
  { label: "עד ₪900", max: 900 },
  { label: "₪900–₪1,500", min: 900, max: 1500 },
  { label: "₪1,500–₪2,500", min: 1500, max: 2500 },
  { label: "מעל ₪2,500", min: 2500 },
];
