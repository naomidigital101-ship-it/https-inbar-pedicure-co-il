/**
 * הגדרות מקטעי דף הבית.
 *
 * כל מקטע מתאר את עצמו: תווית עברית, כותרות, ומפרט השדות של פריט
 * בודד (item_schema). טופס העריכה באדמין נבנה מהמפרט הזה, ולכן הוספת
 * מקטע חדש היא רשומה אחת — לא מסך חדש.
 *
 * מודול טהור: מיובא גם מהשרת (ייבוא לדאטאבייס) וגם מהדפדפן (ברירת מחדל).
 */

import {
  HOME_ACADEMY_TRACKS,
  HOME_BEFORE_AFTER,
  HOME_CHIPS,
  HOME_CREDENTIALS,
  HOME_FAQS,
  HOME_PROCESS,
  HOME_RED_FLAGS,
  HOME_SERVICES,
  HOME_WHY_ITEMS,
} from "@/lib/home-content";

export type FieldType = "text" | "textarea" | "service" | "image" | "short";

export type ItemField = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
};

export type BlockDef = {
  blockKey: string;
  label: string;
  description: string;
  /** האם למקטע יש כותרת סקשן שניתנת לעריכה */
  hasHeading: boolean;
  itemSchema: ItemField[];
  /** מפתח השדה שמשמש ככותרת הפריט ברשימת העריכה */
  titleKey: string;
  items: Record<string, string>[];
  maxItems: number;
};

/** מקטע שבנוי מרשימת מחרוזות פשוטה מיוצג כפריטים עם שדה text יחיד. */
const toTextItems = (arr: readonly string[]) => arr.map((text) => ({ text }));

export const BLOCK_DEFS: BlockDef[] = [
  {
    blockKey: "home_services",
    label: "כרטיסי הטיפולים",
    description: "רשת הטיפולים בדף הבית. כל כרטיס מקשר לעמוד הטיפול המלא.",
    hasHeading: true,
    titleKey: "title",
    maxItems: 12,
    itemSchema: [
      { key: "title", label: "כותרת", type: "text" },
      { key: "desc", label: "תיאור קצר", type: "textarea" },
      { key: "slug", label: "מקשר לטיפול", type: "service" },
    ],
    items: HOME_SERVICES.map((s) => ({ ...s })),
  },
  {
    blockKey: "home_chips",
    label: "בועות אבחון מהיר",
    description: "השורה של הבועות הקטנות בראש הדף — כניסה מהירה לפי בעיה.",
    hasHeading: false,
    titleKey: "label",
    maxItems: 12,
    itemSchema: [
      { key: "label", label: "כיתוב", type: "text" },
      { key: "glyph", label: "קיצור", type: "short", hint: "שתי אותיות שמופיעות בתוך העיגול" },
      { key: "slug", label: "מקשר לטיפול", type: "service" },
    ],
    items: HOME_CHIPS.map((c) => ({ ...c })),
  },
  {
    blockKey: "home_process",
    label: "שלבי התהליך",
    description: "איך נראה תהליך הטיפול, משיחת ההיכרות ועד הליווי.",
    hasHeading: true,
    titleKey: "title",
    maxItems: 10,
    itemSchema: [
      { key: "num", label: "מספר השלב", type: "short" },
      { key: "title", label: "כותרת", type: "text" },
      { key: "desc", label: "תיאור", type: "textarea" },
    ],
    items: HOME_PROCESS.map((p) => ({ ...p })),
  },
  {
    blockKey: "home_academy",
    label: "מסלולי האקדמיה",
    description: "ההכשרות לפדיקוריסטיות.",
    hasHeading: true,
    titleKey: "title",
    maxItems: 10,
    itemSchema: [
      { key: "num", label: "מספר", type: "short" },
      { key: "title", label: "שם המסלול", type: "text" },
      { key: "desc", label: "מה כולל", type: "textarea" },
    ],
    items: HOME_ACADEMY_TRACKS.map((a) => ({ ...a })),
  },
  {
    blockKey: "home_why",
    label: "למה אצלי",
    description: "רשימת הנקודות שמבדלות את הקליניקה.",
    hasHeading: true,
    titleKey: "text",
    maxItems: 16,
    itemSchema: [{ key: "text", label: "הנקודה", type: "text" }],
    items: toTextItems(HOME_WHY_ITEMS),
  },
  {
    blockKey: "home_credentials",
    label: "הסמכות",
    description: "התעודות וההכשרות שמופיעות ליד הפורטרט.",
    hasHeading: false,
    titleKey: "text",
    maxItems: 12,
    itemSchema: [{ key: "text", label: "ההסמכה", type: "text" }],
    items: toTextItems(HOME_CREDENTIALS),
  },
  {
    blockKey: "home_red_flags",
    label: "מתי לפנות מיד",
    description:
      "הדגלים האדומים בדף הבית. תוכן רפואי בלי האזהרות האלה נחשב פחות אמין, גם על ידי גוגל.",
    hasHeading: true,
    titleKey: "text",
    maxItems: 16,
    itemSchema: [{ key: "text", label: "הסימן", type: "text" }],
    items: toTextItems(HOME_RED_FLAGS),
  },
  {
    blockKey: "home_faqs",
    label: "שאלות נפוצות",
    description: "השאלות בדף הבית. הן נמסרות לגוגל כ-FAQ ולעיתים מופיעות ישירות בתוצאות החיפוש.",
    hasHeading: true,
    titleKey: "q",
    maxItems: 24,
    itemSchema: [
      { key: "q", label: "השאלה", type: "text" },
      { key: "a", label: "התשובה", type: "textarea" },
    ],
    items: HOME_FAQS.map((f) => ({ ...f })),
  },
];

export const BLOCK_DEFS_BY_KEY = new Map(BLOCK_DEFS.map((b) => [b.blockKey, b]));

/**
 * גלריית הלפני/אחרי של דף הבית אינה מקטע גנרי אלא נשענת על טבלת
 * before_after, כדי שלא יהיו שתי מערכות לאותו דבר. הפריטים הקיימים
 * הם תמונה אחת משולבת, ולכן after_image נשאר ריק.
 */
export const HOME_GALLERY_SEED = HOME_BEFORE_AFTER.map((b, i) => ({
  title: b.title,
  description: b.desc,
  service_slug: b.slug,
  before_image: b.img,
  before_alt: b.alt,
  after_image: null,
  after_alt: null,
  sort_order: (i + 1) * 10,
}));
