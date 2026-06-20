## מטרה
להתקין את ערכת ה-Hebrew SEO & GEO Toolkit כסקיל בפרויקט, להריץ ביקורת מלאה על האתר, ולתקן את כל הפערים שיתגלו ב-SEO ו-GEO (חיפוש AI).

## שלב 1 — התקנת הסקיל
- העתקת התיקייה `/tmp/hebrew-seo/hebrew-seo-geo-toolkit/` (SKILL.md, SKILL_HE.md, references/, scripts/, metadata.json) אל `.agents/skills/hebrew-seo-geo-toolkit/`.
- אימות שאין `.git` בארכיון, התעלמות מ-`evidence.json` אם לא רלוונטי.
- קריאה ל-`skills--apply_draft` עם הנתיב, כך שהסקיל יהיה זמין בשיחות עתידיות (טריגרים: SEO, GEO, מילות מפתח, .co.il, schema).

## שלב 2 — ביקורת SEO+GEO על האתר החי
הרצת `python3 scripts/seo_audit.py "https://inbar-pedicure.co.il"` מהסקיל, בנוסף לבדיקה ידנית של:
- `<title>`, meta description, canonical, og:* על כל ראוט.
- robots.txt + sitemap.xml.
- כל ה-JSON-LD (Organization, LocalBusiness, FAQPage, Article, Person, BreadcrumbList).
- hreflang.

## שלב 3 — תיקונים ידועים שכבר אותרו בקוד
1. **`src/routes/__root.tsx` שורה 115** — `"@type": ["LocalBusiness", "HealthAndBeautyBusiness", "LocalBusiness"]` עם כפילות. תיקון ל-`["LocalBusiness", "HealthAndBeautyBusiness"]`.
2. **`src/routes/index.tsx` שורה 131** — אותה כפילות ב-`["LocalBusiness", "LocalBusiness"]`. תיקון ל-`"LocalBusiness"` יחיד או הוספת `HealthAndBeautyBusiness`.
3. **`public/robots.txt` שורה 45** — `Sitemap: https://inbar-farchi.lovable.app/sitemap.xml` מצביע על דומיין ישן. עדכון ל-`https://inbar-pedicure.co.il/sitemap.xml`.
4. **hreflang חסר לחלוטין** — הוספה ב-`__root.tsx` של `<link rel="alternate" hreflang="he-IL" href="..." />` ו-`hreflang="x-default"` עבור הדומיין הראשי.
5. **שעות שבת ב-LocalBusiness** — לוודא ש-`openingHoursSpecification` מציין סגירה ביום שבת (`Sa` עם `closes: "00:00"` או הסרת השבת מהרשימה — כיום מוגדר `Su,Mo,Tu,We,Th 09:00-20:00` מה שתקין כי שבת לא נכללת, אבל אפשר להוסיף Sa/Fr explicit closed לאיתות חזק יותר ל-Google ו-AI).

## שלב 4 — שיפורי GEO (חיפוש AI) לפי הסקיל
1. **תוכן בפורמט שאלה-תשובה ב-FAQ Schema** — עבור על כל עמודי שירותים ו-Knowledge ולוודא ש-FAQPage קיים, עם תשובות 40-80 מילים (פורמט מועדף ל-AI).
2. **EEAT על עמוד About** — להוסיף `Person` schema עם `hasCredential`, `alumniOf`, `knowsAbout`, ושדה `description` מפורט. כיום קיים Person בסיסי.
3. **`Article` schema על כל מאמר** — לוודא `author`, `datePublished`, `dateModified`, `image`, `publisher` ב-`article.$slug.tsx`.
4. **`BreadcrumbList`** — לוודא קיום על עמודי category/services/articles.
5. **`speakable` schema** (Voice / AI assistants) — להוסיף ב-Article ו-FAQPage את `speakable: { "@type": "SpeakableSpecification", xpath: [...] }` עבור כותרות ותשובות מרכזיות.

## שלב 5 — אופטימיזציות מורפולוגיה עברית
- מעבר על מטא-דאטה של 7 עמודי השירותים (`services.$slug.tsx`) ועל המאמרים: לוודא שחיפושים בצורות תחילית (ב-, מ-, ה-, ל-) מכוסים ב-title/description (לדוגמה: "טיפול בפטרת" + "פטרת ברגליים" + "להיפטר מפטרת").
- וידוא ש-`<h1>` מכיל את מילת המפתח הראשית בצורה הנפוצה ביותר.

## שלב 6 — IndexNow + Sitemap refresh
- וידוא ש-`/sitemap.xml` מחזיר את כל הראוטים הסטטיים + מאמרים פורסמו.
- שליחת IndexNow לכל URL שהשתנה (יש כבר `api/public/indexnow.ts`).

## שלב 7 — דיווח
סיכום קצר של מה שתוקן, רשימת פערים שלא תוקנו (אם נשארו), והפניה ל-`<presentation-open-seo-review>` לסקירה החיה.

## טכני
- אין צורך בחבילות חדשות; הסקיל הוא סטטי + סקריפטים שייקראו לפי דרישה.
- כל השינויים בקוד הם בקבצי ראוט קיימים + `__root.tsx` + `robots.txt`. אין מיגרציות DB ואין שינוי בערכת העיצוב.
- לא נוגעים ב-`routeTree.gen.ts` (auto-generated).