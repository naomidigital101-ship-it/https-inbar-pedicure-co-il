import foxHelmet from "@/assets/product-fox-v3rs.jpg";
import twinAir from "@/assets/product-twin-air.jpg";
import leattBraces from "@/assets/product-leatt-braces.jpg";
import motorexOil from "@/assets/product-motorex-oil.jpg";

export type ProductCategory = "helmet" | "filter" | "protection" | "oil" | "parts";

export type ProductVideo = {
  youtubeId: string;
  title: string;
  channel: string;
  lang: "he" | "en";
};

export type CommunityPost = {
  source: "facebook" | "forum";
  url: string;
  author: string;
  date: string;
  quote: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  priceILS: number;
  image: string;
  imageAlt: string;
  shortDescription: string;
  longDescription: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  buyLinks: { label: string; url: string }[];
  videos: ProductVideo[];
  community: CommunityPost[];
  updatedAt: string;
  updatedAtLabel: string;
};

export const products: Product[] = [
  {
    slug: "fox-v3-rs",
    name: "Fox V3 RS",
    brand: "Fox Racing",
    category: "helmet",
    categoryLabel: "קסדה",
    priceILS: 2890,
    image: foxHelmet,
    imageAlt: "קסדת Fox V3 RS אנדורו לבן אדום",
    shortDescription:
      "קסדת אנדורו פרימיום עם MIPS ו-MVRS. אחת הקסדות הכי נחקרות בקטגוריה.",
    longDescription: [
      "הקסדה קלה (1,260 גרם במידה M), האוורור עובד היטב גם בקיץ הישראלי, ומערכת MVRS (שחרור מגיני לחיים בחירום) הוכיחה את עצמה בשטח.",
      "המחיר גבוה, אבל ההיגיון פשוט: למי שרוכב שלוש פעמים בחודש או יותר, הקסדה הזו תחזיק כחמש שנים ותספק הגנה אמיתית. קסדות זולות יותר יחזיקו כשנתיים ויספקו הגנה חלקית בלבד.",
    ],
    pros: [
      "MIPS + MVRS - תקני בטיחות מהגבוהים בשוק",
      "משקל 1,260 גרם בלבד (M)",
      "אוורור מעולה לקיץ ישראלי",
      "ריפוד נשלף וניתן לכביסה",
    ],
    cons: [
      "מחיר גבוה",
      "מידות רצות קטן - כדאי למדוד פיזית",
      "המגן קדמי רחב ועלול להפריע ברוח חזקה",
    ],
    bestFor: "רוכבי אנדורו וקרוס שרוכבים לפחות פעמיים בחודש ומחפשים קסדה לטווח ארוך.",
    buyLinks: [
      { label: "RevZilla", url: "https://www.revzilla.com/dirt-bike-helmets/fox-racing-v3-rs-helmet" },
      { label: "Fox Racing", url: "https://www.foxracing.com/en-us/moto/helmets/v3-rs/V3RS-OPTICAL.html" },
    ],
    videos: [
      { youtubeId: "qfp_HF8r17E", title: "Fox V3 RS Helmet Review", channel: "RevZilla", lang: "en" },
      { youtubeId: "8s3y4SjA_eM", title: "Fox V3 RS - First Look", channel: "Motocross Action", lang: "en" },
    ],
    community: [
      {
        source: "facebook",
        url: "https://www.facebook.com/groups/israeliendurogroup",
        author: "אנדורו ישראל",
        date: "אפריל 2026",
        quote:
          "רוכב איתה שנתיים, נפלתי פעמיים, היא הצילה לי את הראש. שווה כל שקל אם אתה לוקח את הרכיבה ברצינות.",
      },
      {
        source: "facebook",
        url: "https://www.facebook.com/groups/israeliendurogroup",
        author: "קבוצת רוכבי שטח ישראל",
        date: "מרץ 2026",
        quote:
          "האוורור באמת עובד. רכבתי בעמק יזרעאל ב-38 מעלות, הראש נשאר יבש יחסית. לא משווים לקסדות הזולות.",
      },
    ],
    updatedAt: "2026-05-15",
    updatedAtLabel: "15 במאי 2026",
  },
  {
    slug: "twin-air-filter",
    name: "Twin Air Pre-Oiled Filter",
    brand: "Twin Air",
    category: "filter",
    categoryLabel: "מסנן אוויר",
    priceILS: 165,
    image: twinAir,
    imageAlt: "מסנן אוויר Twin Air ספוג כחול אדום",
    shortDescription:
      "מסנן ספוג עם שמן מותאם מראש. הסטנדרט של רוב הרוכבים בארץ.",
    longDescription: [
      "מסנן Twin Air הוא המסנן הנפוץ ביותר בקרב רוכבי הקרוס בישראל, ומסיבה טובה. הוא מגיע משומן מראש בכמות הנכונה, מה שחוסך את כל הסיפור של שימון ביתי שלרוב לא נמרח באופן אחיד.",
      "בארץ, עם האבק והאוויר היבש, מסנן איכותי מאריך את חיי המנוע בעשרות אחוזים. ההמלצה המקובלת היא להחליף כל 4–5 נסיעות שטח, ולשטוף ולשמן באמצע אם הנסיעה הייתה אבקנית במיוחד.",
    ],
    pros: [
      "משומן מראש - חוסך זמן וטעויות",
      "סינון מצוין בתנאי אבק קיצוניים",
      "ניתן לשטיפה וחזרה לשימוש 5-7 פעמים",
      "מתאים לרוב דגמי האנדורו והקרוס",
    ],
    cons: [
      "יקר ב-30% ממתחרים גנריים",
      "השמן הנמרח עלול להתייבש אם המסנן מאוחסן זמן רב",
    ],
    bestFor: "רוכבים שרוצים פתרון 'לפתוח ולהרכיב' בלי להתעסק עם שמן וסחיטה.",
    buyLinks: [
      { label: "Rocky Mountain ATV", url: "https://www.rockymountainatvmc.com/search?searchTerm=twin+air+pre-oiled+filter" },
      { label: "Twin Air רשמי", url: "https://www.twinair.com/en/products/air-filters" },
    ],
    videos: [
      { youtubeId: "vYIyfgkVrA0", title: "Twin Air Filter Install Guide", channel: "Twin Air USA", lang: "en" },
    ],
    community: [
      {
        source: "facebook",
        url: "https://www.facebook.com/groups/israeliendurogroup",
        author: "פורום אנדורו ישראל",
        date: "פברואר 2026",
        quote:
          "אני מזמין 5 בכל פעם מ-RMA, יוצא לי 100 שקל למסנן עם משלוח. שווה את הטרחה.",
      },
    ],
    updatedAt: "2026-05-10",
    updatedAtLabel: "10 במאי 2026",
  },
  {
    slug: "leatt-dual-axis",
    name: "Leatt Dual Axis Knee Brace",
    brand: "Leatt",
    category: "protection",
    categoryLabel: "מגן ברך",
    priceILS: 1450,
    image: leattBraces,
    imageAlt: "מגיני ברך Leatt Dual Axis שחורים עם ציר",
    shortDescription:
      "ברייסים עם ציר כפול - הגנה אמיתית למפרק, לא רק לעצם.",
    longDescription: [
      "ההבדל בין מגן ברך לברייס הוא הציר. מגן רגיל סופג מכה ישירה, בעוד שברייס מונע מהמפרק להתפתל לכיוונים שאינו אמור להתפתל אליהם - וזה בדיוק מה ששובר רצועות צולבות.",
      "ה-Dual Axis של Leatt הוא נקודת הכניסה הטובה לעולם הברייסים. לא הכי מקצועי שיש, אבל מספיק טוב לרוב המוחלט של הרוכבים שלא מעוניינים להוציא 4,000 ש\"ח על דגמי C5 או X-Frame.",
    ],
    pros: [
      "ציר כפול מונע סיבוב צידי של הברך",
      "נוח יחסית - אפשר לרכוב איתו 4 שעות",
      "מתאים לרוב גודלי הרגליים",
      "מחיר סביר לקטגוריה",
    ],
    cons: [
      "כבד מהמגנים הרגילים",
      "דורש מידה מדויקת - לא לקנות בלי למדוד",
      "החלפת חלקי החלפה בארץ קשה",
    ],
    bestFor: "רוכבי אנדורו שרוצים הגנה אמיתית למפרק, ולא רק לעצם.",
    buyLinks: [
      { label: "Leatt רשמי", url: "https://www.leatt.com/shop/protectives/braces/knee-brace-dual-axis-pro.html" },
      { label: "RevZilla", url: "https://www.revzilla.com/dirt-bike-knee-shin-guards/leatt-dual-axis-knee-brace" },
    ],
    videos: [
      { youtubeId: "rzVxmLDLgxg", title: "Leatt Knee Braces Comparison", channel: "FortNine", lang: "en" },
    ],
    community: [
      {
        source: "facebook",
        url: "https://www.facebook.com/groups/israeliendurogroup",
        author: "קבוצת אנדורו ישראל",
        date: "ינואר 2026",
        quote:
          "נפלתי בלי הברייסים ונקרעה לי הצולבת. שנה אחרי שהחלמתי קניתי Leatt Dual Axis ואני לא יורד איתם מהאופנוע. שווה כל שקל.",
      },
    ],
    updatedAt: "2026-04-22",
    updatedAtLabel: "22 באפריל 2026",
  },
  {
    slug: "motorex-cross-power-4t",
    name: "Motorex Cross Power 4T 10W-50",
    brand: "Motorex",
    category: "oil",
    categoryLabel: "שמן מנוע",
    priceILS: 220,
    image: motorexOil,
    imageAlt: "בקבוק שמן מנוע Motorex Cross Power 4T 10W-50",
    shortDescription:
      "שמן מנוע סינתטי לאופנועי 4 פעימות. השמן הרשמי של KTM Factory Racing.",
    longDescription: [
      "Motorex הוא השמן שיוצא מהמפעל באופנועי KTM. לא מדובר בקשקוש שיווקי: Motorex היא השותפה הטכנית של KTM כבר עשרות שנים. השמן עומד בתקני JASO MA2 ו-API SL ומותאם במיוחד לקופלינג רטוב, כפי שמותקן ברוב אופנועי האנדורו.",
      "בארץ, עם הטמפרטורות הגבוהות, ה-10W-50 הוא בחירה טובה יותר מ-10W-40 הסטנדרטי, מאחר שהוא שומר על צמיגות יציבה גם כשהמנוע חם מאוד.",
    ],
    pros: [
      "מאושר רשמית על ידי KTM",
      "צמיגות יציבה בטמפ' גבוהות",
      "מתאים לקופלינג רטוב",
      "ביצועים יציבים עד 15 שעות מנוע",
    ],
    cons: [
      "מחיר כפול ממתחרים גנריים",
      "זמינות לא תמיד טובה בחנויות קטנות",
    ],
    bestFor: "בעלי אופנועי KTM/Husqvarna 4T שרוצים להישאר בתוך תקני היצרן.",
    buyLinks: [
      { label: "Motorex רשמי", url: "https://www.motorex.com/en-ww/products/motorcycle/cross-power-4t-10w-50/" },
      { label: "Rocky Mountain ATV", url: "https://www.rockymountainatvmc.com/search?searchTerm=motorex+cross+power+4t+10w-50" },
    ],
    videos: [
      { youtubeId: "8Y0o0vK7jHk", title: "Motorex Cross Power 4T Test", channel: "MX Tech", lang: "en" },
    ],
    community: [
      {
        source: "facebook",
        url: "https://www.facebook.com/groups/israeliendurogroup",
        author: "פורום KTM ישראל",
        date: "מרץ 2026",
        quote:
          "החלפתי משמן זול ל-Motorex והקופלינג עובד הרבה יותר חלק. אני לא יודע אם זה פסיכולוגי או אמיתי, אבל המנוע נשמע אחרת.",
      },
    ],
    updatedAt: "2026-04-30",
    updatedAtLabel: "30 באפריל 2026",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return [...products].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}