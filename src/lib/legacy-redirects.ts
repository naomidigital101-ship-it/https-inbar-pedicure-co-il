/**
 * מיפוי 301 מ־WordPress הישן (inbar-pedicure.co.il) ל־URL־ים החדשים.
 * המיפוי מקבל path מקודד (כפי שמגיע מבקשת HTTP — `pathname` של URL).
 *
 * המפתחות מנורמלים: ללא trailing slash, lowercase לחלקים שאינם עברית.
 */

/** מפת redirects: מפתח = path ישן (decoded), ערך = path חדש. */
const RAW_MAP: Record<string, string> = {
  // עמודי מערכת
  "/אודותיי": "/about",
  "/מדיניות-פרטיות": "/privacy",
  "/תנאי-שימוש-ותקנון-האתר": "/terms",
  "/הצהרת-נגישות": "/accessibility",

  // טיפולים — /pedicure-treatments/<slug>/
  "/pedicure-treatments": "/services",
  "/pedicure-treatments/יבלות": "/services/corns",
  "/pedicure-treatments/athletesfoot": "/services/fungus",
  "/pedicure-treatments/אורטוניקסיה-ציפורן-חודרנית-בכף-הרגל": "/services/ingrown-nails",
  "/pedicure-treatments/detached-nail-treatment": "/services/onycholysis",
  "/pedicure-treatments/cracked-dry-heels-treatment": "/services/cracked-heels",

  // מאמרים (פוסטים מה־WordPress)
  "/טיפול-ביבלות-לחולי-סכרת": "/article/warts-treatment-for-diabetics",
  "/רגל-של-לוחם-המדריך-המלא-לשמירה-על-כפות": "/article/combat-soldier-foot-care-guide",
  "/מה-זה-פדיקור-רפואי": "/article/medical-pedicure-explained",
  "/יבלת-ויראלית": "/article/viral-plantar-wart",
  "/יבלת-קשה": "/article/hard-callus-vs-wart",
  "/פטרת-ציפורניים-טראומה-או-פסוריאזיס-המ": "/article/nail-fungus-vs-trauma-vs-psoriasis",
  "/האם-פטרת-ציפורניים-מדבקת": "/article/is-nail-fungus-contagious",

  // Broken /article/* slugs מסריקת Screaming Frog (פנו ליעד הקרוב ביותר)
  "/services/medical-pedicure-explained": "/article/medical-pedicure-explained",
  "/article/cracked-heels-and-dry-skin": "/article/dry-skin-cracked-heels-care-guide",
  "/article/dry-cracked-heels-treatment": "/article/dry-skin-cracked-heels-care-guide",
  "/article/treating-dry-cracked-heels": "/article/dry-skin-cracked-heels-care-guide",
  "/article/how-to-cut-toenails-correctly": "/article/how-to-cut-toenails-correctly-prevent-ingrown-toenail",
  "/article/fungus-on-toes": "/article/nail-fungus-causes-and-treatment",
  "/article/piteret-tsipornayim-beragliim": "/article/nail-fungus-causes-and-treatment",
  "/article/peteret-tsipornaim": "/article/nail-fungus-causes-and-treatment",
  "/article/tipul-be-piteret-kef-regel": "/article/nail-fungus-causes-and-treatment",
  "/article/foot-fungus-prevention": "/article/is-nail-fungus-contagious",
  "/article/how-to-choose-running-shoes": "/article/eich-livchor-naalei-ritza",
  "/article/how-to-choose-the-right-shoes": "/article/eich-livchor-naalei-ritza",
  "/article/choosing-comfortable-shoes": "/article/eich-livchor-naalei-ritza",
  "/article/foot-types-and-pronation": "/article/eich-livchor-naalei-ritza",
  "/article/yabalot-viraliyot-ve-lachatz-bakaf-haregel": "/article/viral-plantar-wart",
  "/article/tsiporen-choderanit": "/article/orthonyxia-nail-bracing-for-ingrown-toenail",
  "/article/tsiporen-khodranit": "/article/orthonyxia-nail-bracing-for-ingrown-toenail",
  "/article/diabetic-foot-care": "/article/diabetic-foot-daily-self-check-guide",
  "/article/callus-and-corns": "/article/hard-callus-vs-wart",
  "/article/foot-stretches-and-exercises": "/article/shin-splints-causes-prevention-guide",
  "/article/custom-orthotics-guide": "/article/kavim-ba-akev-boker-dorban",
  "/article/midrasim-le-keev-raglayim": "/article/kavim-ba-akev-boker-dorban",
};

/** מנרמל path: מסיר trailing slash, מפענח אחוזים, lowercase לאותיות ASCII. */
function normalize(pathname: string): string {
  let p = pathname;
  try {
    p = decodeURIComponent(p);
  } catch {
    // path לא תקין — נשאיר כפי שהוא
  }
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  // נשמור את האותיות העבריות; ASCII בלבד הופך ל-lowercase
  return p.replace(/[A-Z]+/g, (m) => m.toLowerCase());
}

const NORMALIZED_MAP: Map<string, string> = new Map(
  Object.entries(RAW_MAP).map(([k, v]) => [normalize(k), v]),
);

/**
 * מחזיר את היעד ל־redirect 301, או null אם אין התאמה.
 */
export function findLegacyRedirect(pathname: string): string | null {
  const key = normalize(pathname);
  return NORMALIZED_MAP.get(key) ?? null;
}