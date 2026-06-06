export type ArticleCategory = "מכניקה" | "מסלולים" | "ביקורות" | "טכניקה";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  readingMinutes: number;
  publishedAt: string; // ISO
};

export const articles: Article[] = [
  {
    slug: "shemen-machne-oto-be-atzmecha",
    title: "החלפת שמן מנוע לאופנוע שטח - מדריך מלא בעצמך",
    excerpt:
      "כל מה שצריך לדעת על החלפת שמן באופנוע אנדורו: סוג השמן הנכון, מרווחי החלפה לפי שעות רכיבה וטעויות נפוצות שעולות אלפי שקלים.",
    category: "מכניקה",
    readingMinutes: 8,
    publishedAt: "2026-05-12",
  },
  {
    slug: "maslulei-shetach-tzafon",
    title: "5 מסלולי שטח מומלצים בצפון - מהגליל ועד הגולן",
    excerpt:
      "סקירה של חמשת המסלולים האהובים על קהילת הרוכבים הישראלית: רמת דרגה, נקודות גישה, תחנות דלק ומסעדות שווה לעצור בהן.",
    category: "מסלולים",
    readingMinutes: 12,
    publishedAt: "2026-05-08",
  },
  {
    slug: "ktm-300-exc-review",
    title: "ביקורת KTM 300 EXC 2026 - האם זה עדיין המלך?",
    excerpt:
      "אחרי 1,200 ק״מ במסלולי בזלת, חולות וטיפוסים טכניים - האם הדגם החדש מצדיק את התג שלו? פירוט מלא של היתרונות והחסרונות.",
    category: "ביקורות",
    readingMinutes: 10,
    publishedAt: "2026-05-03",
  },
  {
    slug: "technika-tipus-tlul",
    title: "טכניקת טיפוס תלול בלי לאבד אחיזה - 7 כללי ברזל",
    excerpt:
      "המפתח להגיע למעלה הוא לא כוח - זו טכניקה. עמדת גוף, מינון גז, בחירת קו נכון ומה לעשות אם איבדת אחיזה באמצע הטיפוס.",
    category: "טכניקה",
    readingMinutes: 7,
    publishedAt: "2026-04-27",
  },
  {
    slug: "bdika-shavuit",
    title: "בדיקה שבועית של 10 דקות שתחסוך לך תקלות בשטח",
    excerpt:
      "צ׳קליסט פשוט שכל רוכב חייב לבצע לפני סוף השבוע - מתח שרשרת, לחץ אוויר, מצב בלמים ועוד 7 בדיקות קצרות.",
    category: "מכניקה",
    readingMinutes: 5,
    publishedAt: "2026-04-20",
  },
  {
    slug: "kli-avoda-bsisi",
    title: "ערכת כלים בסיסית לרוכב שטח - מה חייב להיות בתיק",
    excerpt:
      "המדריך לרוכבים שרוצים להפסיק לקרוא לגרר. רשימה מדויקת של 14 כלים בסיסיים, איפה לקנות בארץ ומחירים מעודכנים.",
    category: "טכניקה",
    readingMinutes: 6,
    publishedAt: "2026-04-14",
  },
];

export const categories: ArticleCategory[] = [
  "מכניקה",
  "מסלולים",
  "ביקורות",
  "טכניקה",
];
