// קטלוג מגני גוף - מקור נתונים יחיד לעמוד /products/body-armor
// לינקי חנויות אומתו ידנית מול חיפושי web. כאשר לא נמצא דף מוצר אמיתי בארץ
// - נשתמש בקישור חיפוש Google ממוקד (לא בדף קולקציה כללי).

import img_fox_airframe_pro from "@/assets/body-armor/fox-airframe-pro.webp";
import img_fox_raceframe_women from "@/assets/body-armor/fox-raceframe-women.webp";
import img_fox_raptor_pro from "@/assets/body-armor/fox-raptor-pro.webp";
import img_alpinestars_bionic_action from "@/assets/body-armor/alpinestars-bionic-action.webp";

export const WOMEN_BUYING_GUIDE = {
  title: "מגני גוף לנשים - מה באמת חשוב לדעת",
  intro:
    "רוב מגני הגוף עוצבו לגוף גברי. זה לא אומר שנשים לא יכולות להשתמש בהם, אבל יש כמה דברים שצריך לדעת לפני שקונים.",
  issues: [
    {
      title: "חזה - הבעיה הכי נפוצה",
      body:
        'מגן חזה גברי שטוח לוחץ בצורה לא נוחה ועלול להגביל נשימה. לנשים עם חזה גדול זה יכול גם לגרום לכך שהמגן יזוז ולא ישמור על המקום הנכון בנפילה. הפתרונות: (א) מגן ייעודי לנשים עם עיצוב 3D לחזה, (ב) חליפת לחץ רכה שמתגמשת, (ג) מגן חזה גברי במידה XL שיש בו יותר מקום.',
    },
    {
      title: "כתפיים - פחות זה יותר",
      body:
        "מגני כתפיים גדולים מרחיבים את השכמות ויכולים לתת מראה מסורבל. מגני כתפיים רכים (soft armor) כמו D3O או 3DF AirFit נותנים הגנה טובה בלי להוסיף נפח. אם נראות חשובה לכן, בחרו חליפת לחץ עם מגנים מובנים ולא צבי־צב עם כתפיות גדולות.",
    },
    {
      title: "גזרה - המפתח לנוחות",
      body:
        "מגן שרחב בכתפיים אבל צר במותניים עלול לעלות כלפי מעלה ברכיבה. חפשו מגנים עם: סרטי כתפיות מתכווננים, סגירה צידית מתכווננת, גזרה מחוטבת (tapered waist). Leatt Jacki ו־Fox Raceframe הן שתי הדוגמאות הטובות בשוק.",
    },
    {
      title: "חום ישראלי - אוורור קריטי",
      body:
        "בקיץ ישראלי, מגן לא מאוורר הוא עינוי. עדיפו: רשת במקום פלסטיק מלא, פתחי אוורור בחזה ובגב, בד בסיס נושם. חליפות לחץ רכות (soft shell) נוחות יותר בחום מחליפות קשיחות.",
    },
  ],
  recommendation_by_size: [
    {
      size: "חזה קטן־בינוני (A–C)",
      rec: "כמעט כל מגן גברי יעבוד. Leatt 3.5 או Fox Airframe Pro מתחת לג'רזי, נוח ולא מפריע.",
    },
    {
      size: "חזה גדול (D+)",
      rec: "Leatt 4.5 Jacki בלבד, עוצב ספציפית לפיזיולוגיה נשית עם 3D pre-curved design. Fox Raceframe כחלופה. מגן גברי לא מומלץ.",
    },
    {
      size: "גוף קטן / כתפיים צרות",
      rec: "חליפת לחץ רכה (soft shell) כמו Leatt 5.5 תשב צמוד ולא תזוז. מגן חזה נפרד עלול להיות רחב מדי.",
    },
  ],
} as const;

export type ArmorCategory = "roost_guard" | "chest_protector" | "body_armor";
export type ArmorGender = "unisex" | "women" | "men";
export type ArmorShell = "hard" | "soft" | "hybrid";
export type ArmorWearPosition = "under_jersey" | "over_jersey" | "both";

export interface ArmorRetailer {
  store: string;
  url: string;
  price_ils?: number;
}

export interface BodyArmorProduct {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: ArmorCategory;
  gender: ArmorGender;
  protection_zones: string[];
  safety_certifications: string[];
  wear_position: ArmorWearPosition;
  shell_type: ArmorShell;
  has_back_protection: boolean;
  has_shoulder_protection: boolean;
  has_elbow_protection: boolean;
  has_kidney_belt: boolean;
  women_notes: string | null;
  price_usd: number;
  price_ils_approx: number;
  slug: string;
  short_desc_he: string;
  pros_he: string[];
  cons_he: string[];
  best_for_he: string;
  retailers_israel: ArmorRetailer[];
  unsplash_image: string;
  video_youtube_id?: string;
  video_title?: string;
}

const googleSearch = (q: string): string =>
  `https://www.google.com/search?q=${encodeURIComponent(q)}`;

export const BODY_ARMOR: BodyArmorProduct[] = [
  {
    id: "leatt-45-jacki-women",
    brand: "Leatt",
    model: "Chest Protector 4.5 Jacki",
    year: 2025,
    category: "chest_protector",
    gender: "women",
    protection_zones: ["חזה", "גב", "צלעות"],
    safety_certifications: ["CE EN1621-3 Level 2 (חזה)", "CE EN1621-2 Level 2 (גב)"],
    wear_position: "both",
    shell_type: "hybrid",
    has_back_protection: true,
    has_shoulder_protection: false,
    has_elbow_protection: false,
    has_kidney_belt: false,
    women_notes:
      "עיצוב 3D pre-curved ספציפי לחזה נשי. גזרה קצרה יותר בגב. כתפיות מתכווננות. תואם neck brace של Leatt. הבחירה הטובה ביותר לנשים עם חזה גדול.",
    price_usd: 180,
    price_ils_approx: 670,
    slug: "leatt-45-jacki-women",
    short_desc_he:
      "המגן הנשי הטוב בשוק. עיצוב 3D לחזה נשי, CE Level 2 חזה וגב, כתפיות מתכווננות. תואם neck brace.",
    pros_he: [
      "עיצוב 3D ספציפי לנשים - לא לוחץ ולא מגביל",
      "CE Level 2 חזה + גב",
      "ניתן ללבישה מעל ומתחת לג'רזי",
      "תואם Leatt neck brace",
      "הגנת צלעות בצדדים",
    ],
    cons_he: [
      "אין הגנת כתפיים",
      'מגיע במידה אחת, מתאים 55–95 ק"ג',
      "צריך לקנות מגני ברכיים ומרפקים בנפרד",
    ],
    best_for_he: "נשים רוכבות שטח שמחפשות מגן חזה וגב ייעודי לגוף נשי",
    retailers_israel: [
      {
        store: "Leatt USA (יבוא אישי)",
        url: "https://us.leatt.com/products/chest-protector-4-5-jacki-women-sale",
        price_ils: 670,
      },
      {
        store: 'חיפוש בארץ',
        url: googleSearch("Leatt 4.5 Jacki women chest protector ישראל"),
      },
    ],
    unsplash_image:
      "https://bikerswarehouse.co.za/wp-content/uploads/2024/04/leatt-chest-protector-4-5-jacki_fuel.webp",
  },
  {
    id: "leatt-35-chest",
    brand: "Leatt",
    model: "Chest Protector 3.5",
    year: 2025,
    category: "roost_guard",
    gender: "unisex",
    protection_zones: ["חזה", "גב"],
    safety_certifications: ["CE EN1621-3 Level 1 (חזה)", "CE EN1621-2 Level 1 (גב)"],
    wear_position: "under_jersey",
    shell_type: "hybrid",
    has_back_protection: true,
    has_shoulder_protection: false,
    has_elbow_protection: false,
    has_kidney_belt: false,
    women_notes:
      "הכי קטן בסדרת Leatt, מתאים לנשים עם גוף קטן. לנשים עם חזה גדול עדיפו את Jacki 4.5.",
    price_usd: 120,
    price_ils_approx: 450,
    slug: "leatt-35-chest",
    short_desc_he:
      "המגן הדק של Leatt - נכנס מתחת לכל ג'רזי. הגנת חזה וגב בפרופיל מינימלי.",
    pros_he: [
      "דק ונוח לרכיבה - כמעט לא מורגש",
      "נכנס מתחת לכל ג'רזי",
      "קל מאוד",
      "מחיר נגיש",
    ],
    cons_he: [
      "CE Level 1 בלבד - פחות הגנה מ־4.5",
      "אין הגנת כתפיים או מרפקים",
      "לא מתאים לנשים עם חזה גדול",
    ],
    best_for_he: "רוכבים שרוצים מינימום ומרגישים לא נוח עם מגן גדול",
    retailers_israel: [
      {
        store: "מוטוליין",
        url: "https://www.motoline.co.il/items/6805583-%D7%9E%D7%92%D7%9F-%D7%97%D7%96%D7%94-%D7%95%D7%92%D7%91-%D7%9C%D7%99%D7%98-%D7%A9%D7%97%D7%95%D7%A8-LEATT-CHEST-PROTECTOR-REALFLEX-V24",
      },
      {
        store: 'חיפוש נוסף',
        url: googleSearch("Leatt 3.5 chest protector ישראל"),
      },
    ],
    unsplash_image:
      "https://d3m9l0v76dty0.cloudfront.net/system/photos/14302563/large/e0e2c100f6592fd2b186879be3e93988.jpg",
  },
  {
    id: "leatt-55-body-protector",
    brand: "Leatt",
    model: "Body Protector 5.5",
    year: 2025,
    category: "body_armor",
    gender: "unisex",
    protection_zones: ["חזה", "גב", "כתפיים", "מרפקים", "צלעות", "כליות"],
    safety_certifications: [
      "CE EN1621-3 Level 2 (חזה)",
      "CE EN1621-2 Level 2 (גב)",
      "CE EN1621-1 Level 1 (כתפיים)",
    ],
    wear_position: "under_jersey",
    shell_type: "soft",
    has_back_protection: true,
    has_shoulder_protection: true,
    has_elbow_protection: true,
    has_kidney_belt: true,
    women_notes:
      "גזרה יחסית נוחה לנשים - soft shell נותן גמישות. לנשים עם חזה גדול מומלץ לנסות לפני קנייה - החלק העליון עלול ללחוץ. כתפיות מתכווננות עוזרות.",
    price_usd: 380,
    price_ils_approx: 1400,
    slug: "leatt-55-body-protector",
    short_desc_he:
      "חליפת לחץ רכה (soft shell) מלאה - חזה, גב, כתפיים, מרפקים, כליות. ללבישה מתחת לג'רזי. מתאימה לאקלים ישראלי.",
    pros_he: [
      "כיסוי מלא - כל האזורים החשובים",
      "Soft shell - נוח בחום ישראלי",
      "ללבישה מתחת לג'רזי - נראות נקייה",
      "חגורת כליות מתכווננת",
      "CE Level 2 חזה + גב",
    ],
    cons_he: [
      "פחות הגנה קשיחה מ־6.5",
      "לא מתאים ל־Hard Enduro קשוח",
      "לנשים עם חזה גדול - לנסות לפני קנייה",
    ],
    best_for_he: "רוכבים שרוצים כיסוי מלא בלי להרגיש כבד - אנדורו ושטח בינוני",
    retailers_israel: [
      {
        store: "Motocenter",
        url: "https://motocenter.co.il/product/leatt-body-protector-5-5/",
        price_ils: 1205,
      },
      {
        store: "Motorave",
        url: "https://motorave.co.il/product/%d7%97%d7%9c%d7%99%d7%a4%d7%aa-%d7%9c%d7%97%d7%a5-leatt-5-5-black/",
        price_ils: 750,
      },
    ],
    unsplash_image:
      "https://motocenter.co.il/wp-content/uploads/2021/10/333.jpg",
  },
  {
    id: "leatt-65-body-protector-hd",
    brand: "Leatt",
    model: "Body Protector 6.5 HD",
    year: 2025,
    category: "body_armor",
    gender: "unisex",
    protection_zones: ["חזה", "גב", "כתפיים", "מרפקים", "צלעות", "כליות"],
    safety_certifications: [
      "CE EN1621-3 Level 2 (חזה)",
      "CE EN1621-2 Level 2 (גב)",
      "CE EN1621-1 Level 1 (כתפיים)",
    ],
    wear_position: "under_jersey",
    shell_type: "hard",
    has_back_protection: true,
    has_shoulder_protection: true,
    has_elbow_protection: true,
    has_kidney_belt: true,
    women_notes:
      "Hard shell - פחות מתאים לנשים עם חזה גדול. לנשים קטנות־בינוניות עובד טוב. כתפיות קשיחות מרחיבות שכמות - לקחת בחשבון אם נראות חשובה.",
    price_usd: 480,
    price_ils_approx: 1800,
    slug: "leatt-65-body-protector-hd",
    short_desc_he:
      "חליפת לחץ קשיחה מלאה - ההגנה המקסימלית שאפשר. Hard Enduro, שטח טכני, מי שלא מתפשר.",
    pros_he: [
      "הגנה מקסימלית - hard shell + 3DF AirFit",
      "כיסוי 360° - חזה, גב, כתפיים, מרפקים, צלעות, כליות",
      "ניתן לפירוק - אפשר לחבוש חזה בלבד",
      "CE Level 2 בכל האזורים",
    ],
    cons_he: [
      "כבד וחם יחסית",
      "כתפיות קשיחות מרחיבות שכמות",
      "לא מתאים לנשים עם חזה גדול",
      "יקר",
    ],
    best_for_he: "Hard Enduro, שטח טכני קשוח, מי שנופל הרבה",
    retailers_israel: [
      {
        store: "Motocenter",
        url: "https://motocenter.co.il/product/%d7%9e%d7%92%d7%9f-%d7%97%d7%96%d7%94-%d7%a6%d7%91%d7%99-%d7%a6%d7%91-%d7%9c%d7%99%d7%98-6-5-%d7%9c%d7%91%d7%9f-leatt-chest-protector-6-5-pro/",
        price_ils: 1205,
      },
    ],
    unsplash_image:
      "https://motocenter.co.il/wp-content/uploads/2023/08/Leatt_ChestProtector_6.5_Pro_White_frontLeft_5021400180.jpg",
  },
  {
    id: "fox-airframe-pro",
    brand: "Fox Racing",
    model: "Airframe Pro",
    year: 2025,
    category: "chest_protector",
    gender: "unisex",
    protection_zones: ["חזה", "גב", "כתפיים"],
    safety_certifications: ["CE EN1621-3 Level 1 (חזה)", "CE EN1621-2 Level 1 (גב)"],
    wear_position: "over_jersey",
    shell_type: "hybrid",
    has_back_protection: true,
    has_shoulder_protection: true,
    has_elbow_protection: false,
    has_kidney_belt: false,
    women_notes:
      "Fox Raceframe (גרסת הנשים) מומלצת יותר לנשים. ה־Airframe Pro הגברי עובד לנשים עם גוף בינוני - אבל לנשים עם חזה גדול Raceframe או Leatt Jacki.",
    price_usd: 200,
    price_ils_approx: 750,
    slug: "fox-airframe-pro",
    short_desc_he:
      "צבי־צב קלאסי של Fox. כיסוי חזה, גב וכתפיים, ללבישה מעל הג'רזי. קל ומאוורר.",
    pros_he: [
      "כתפיות נשלפות - מתאים לפי הצורך",
      "קל ומאוורר מאוד",
      "תואם neck brace",
      "מחיר סביר",
    ],
    cons_he: [
      "CE Level 1 בלבד",
      "ללבישה מעל הג'רזי - פחות אסתטי",
      "לנשים עם חזה גדול - Fox Raceframe עדיף",
    ],
    best_for_he: "רוכבים שרוצים הגנה סבירה בחום, מעל הג'רזי",
    retailers_israel: [
      {
        store: "Fox Racing ישראל",
        url: "https://www.foxhead.co.il/items/5239287-%D7%9E%D7%92%D7%9F-%D7%92%D7%95%D7%A3-%D7%9B%D7%97%D7%95%D7%9C-%D7%9B%D7%AA%D7%95%D7%9D-AIRFRAME-PRO-JACKET-FOX",
      },
    ],
    unsplash_image: img_fox_airframe_pro,
  },
  {
    id: "fox-raceframe-women",
    brand: "Fox Racing",
    model: "Raceframe Impact",
    year: 2025,
    category: "chest_protector",
    gender: "women",
    protection_zones: ["חזה", "גב", "כתפיים"],
    safety_certifications: ["CE EN1621-3 Level 1 (חזה)", "CE EN1621-2 Level 1 (גב)"],
    wear_position: "over_jersey",
    shell_type: "hybrid",
    has_back_protection: true,
    has_shoulder_protection: true,
    has_elbow_protection: false,
    has_kidney_belt: false,
    women_notes:
      "גזרה נשית עם יותר מקום באזור החזה העליון - מתאים גם לנשים עם חזה גדול. קיבל המלצות חיוביות מנשים בפורומים. הבחירה הנשית של Fox.",
    price_usd: 200,
    price_ils_approx: 750,
    slug: "fox-raceframe-women",
    short_desc_he:
      "הגרסה עם גזרה מותאמת יותר לגוף נשי - Raceframe Impact עם רפידות D3O. מגן חזה, גב וכתפיים.",
    pros_he: [
      "יותר מקום בחזה",
      "קל ומאוורר",
      "כתפיות נשלפות",
      "רפידות D3O ברמת CE Level 1",
    ],
    cons_he: [
      "CE Level 1 בלבד",
      "קשה למצוא גרסה נשית רשמית בארץ - לרוב מהזמנה",
      "ללבישה מעל הג'רזי",
    ],
    best_for_he: "נשים שרוצות מגן חזה ספציפי בגזרה נשית, Fox",
    retailers_israel: [
      {
        store: "Fox Racing ישראל",
        url: "https://www.foxhead.co.il/items/7435962-%D7%9E%D7%92%D7%9F-%D7%97%D7%96%D7%94-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A9%D7%97%D7%95%D7%A8-FOX-RACEFRAME-IMPACT-SOFTBACK-D3O",
      },
      {
        store: "Fox Racing USA - גרסת נשים",
        url: "https://www.foxracing.com/product/womens-baseframe-pro-chest-guard/28961.html",
      },
    ],
    unsplash_image: img_fox_raceframe_women,
    video_youtube_id: "IA9hgk_rcgM",
    video_title: "Fox Racing Raceframe Protection Overview - RevZilla",
  },
  {
    id: "fox-raptor-pro",
    brand: "Fox Racing",
    model: "Raptor Vest",
    year: 2025,
    category: "body_armor",
    gender: "unisex",
    protection_zones: ["חזה", "גב", "כתפיים", "ידיים עליונות"],
    safety_certifications: ["CE EN1621-3 Level 2 (חזה)", "CE EN1621-2 Level 2 (גב)"],
    wear_position: "over_jersey",
    shell_type: "hard",
    has_back_protection: true,
    has_shoulder_protection: true,
    has_elbow_protection: false,
    has_kidney_belt: false,
    women_notes:
      "כתפיות גדולות ונשלפות - לנשים שרוצות פחות נפח, ניתן להסיר. מגיע בגדלים - בחרו S לגוף קטן. לנשים עם חזה גדול - לנסות לפני קנייה.",
    price_usd: 320,
    price_ils_approx: 1200,
    slug: "fox-raptor-pro",
    short_desc_he:
      "צבי־צב מלא של Fox - כיסוי חזה, גב וכתפיים. CE Level 2. כתפיות נשלפות לכיוונון אישי.",
    pros_he: [
      "כתפיות נשלפות - גמישות מלאה",
      "CE Level 2 חזה + גב",
      "כיסוי מלא לפלג עליון",
      "עיצוב Fox מוכר",
    ],
    cons_he: [
      "ללבישה מעל הג'רזי",
      "כתפיות גדולות מרחיבות שכמות",
      "לנשים עם חזה גדול - לנסות לפני קנייה",
    ],
    best_for_he: "רוכבים שרוצים צבי־צב מלא עם אפשרות התאמה אישית",
    retailers_israel: [
      {
        store: "Fox Racing ישראל",
        url: "https://www.foxhead.co.il/items/5188208-%D7%9E%D7%92%D7%9F-%D7%92%D7%95%D7%A3-%D7%A9%D7%97%D7%95%D7%A8-%D7%9C%D7%91%D7%9F-RAPTOR-VEST-FOX",
        price_ils: 1200,
      },
      {
        store: "Fox Racing ישראל - V23",
        url: "https://www.foxhead.co.il/items/5460495-%D7%9E%D7%92%D7%9F-%D7%97%D7%96%D7%94-%D7%A4%D7%95%D7%A7%D7%A1-%D7%A8%D7%A4%D7%98%D7%95%D7%A8-%D7%9B%D7%AA%D7%95%D7%9D-%D7%9B%D7%97%D7%95%D7%9C-FOX-RAPTOR-VEST-V23",
      },
    ],
    unsplash_image: img_fox_raptor_pro,
  },
  {
    id: "alpinestars-bionic-action",
    brand: "Alpinestars",
    model: "Bionic Action Chest Protector",
    year: 2025,
    category: "chest_protector",
    gender: "unisex",
    protection_zones: ["חזה", "גב"],
    safety_certifications: ["CE EN1621-3 Level 1 (חזה)", "CE EN1621-2 Level 1 (גב)"],
    wear_position: "both",
    shell_type: "soft",
    has_back_protection: true,
    has_shoulder_protection: false,
    has_elbow_protection: false,
    has_kidney_belt: false,
    women_notes:
      "Soft foam - גמיש ונוח לנשים. מקבל המלצות חיוביות מנשים רוכבות. עובד גם לנשים עם חזה גדול כי הוא מתגמש ולא לוחץ.",
    price_usd: 160,
    price_ils_approx: 600,
    slug: "alpinestars-bionic-action",
    short_desc_he:
      "מגן חזה וגב רך של Alpinestars. Cell Technology - קצף שסופג ומתאוורר. נוח גם לנשים.",
    pros_he: [
      "Soft Cell Technology - נוח וגמיש",
      "עובד לנשים גם עם חזה גדול",
      "ללבישה מתחת או מעל הג'רזי",
      "קל מאוד",
      "אוורור מעולה",
    ],
    cons_he: [
      "CE Level 1 בלבד",
      "אין הגנת כתפיים",
      "פחות הגנה קשיחה",
    ],
    best_for_he: "נשים ורוכבים שרוצים נוחות ואוורור, לא Hard Enduro",
    retailers_israel: [
      {
        store: "Alpinestars (חנות רשמית)",
        url: "https://www.alpinestars.com/products/bionic-action-v2-protection-jacket",
      },
      {
        store: 'חיפוש בארץ',
        url: googleSearch("Alpinestars Bionic Action chest protector ישראל"),
      },
    ],
    unsplash_image: img_alpinestars_bionic_action,
  },
];

export const ARMOR_CATEGORIES: { id: ArmorCategory; label_he: string; desc_he: string }[] = [
  { id: "roost_guard", label_he: "מגן חזה (Roost Guard)", desc_he: "קל, דק, מתחת לג'רזי" },
  { id: "chest_protector", label_he: "צבי־צב", desc_he: "חזה + גב + כתפיים" },
  { id: "body_armor", label_he: "חליפת לחץ", desc_he: "כיסוי מלא לפלג עליון" },
];

export const getArmorForWomen = (): BodyArmorProduct[] =>
  BODY_ARMOR.filter((a) => a.gender === "women" || a.women_notes !== null);

export const getAllArmorBrands = (): string[] =>
  Array.from(new Set(BODY_ARMOR.map((a) => a.brand)));

export const getArmorBySlug = (slug: string): BodyArmorProduct | undefined =>
  BODY_ARMOR.find((a) => a.slug === slug);

export const WOMEN_FILTER_TAG = "מתאים לנשים";

export type BudgetBucket = "all" | "under_500" | "500_1000" | "1000_2000";

export const matchesBudget = (price: number, bucket: BudgetBucket): boolean => {
  if (bucket === "all") return true;
  if (bucket === "under_500") return price <= 500;
  if (bucket === "500_1000") return price > 500 && price <= 1000;
  if (bucket === "1000_2000") return price > 1000 && price <= 2000;
  return true;
};
