
## מטרה
להחליף בכל האתר את המונח **"פדיקוריסטית קלינית"** (וגזירותיו) במונח **"פדיקוריסטית טיפולית"**, בלי לפגוע במילה "קליניקה" (המקום הפיזי).

## מיפוי החלפות
- `פדיקוריסטית קלינית` → `פדיקוריסטית טיפולית`
- `פדיקוריסט קליני` → `פדיקוריסט טיפולי`
- `פדיקור קליני` → `פדיקור טיפולי`
- `פדיקור קלינית` → `פדיקור טיפולי`
- `טיפול קליני` (בהקשר פדיקור) → `טיפול טיפולי` ❌ — לא נחליף, נשאיר "טיפול קליני" אם מופיע, אלא אם הוא חלק מהביטוי "פדיקור קליני"
- **לא משתנה:** `קליניקה`, `הקליניקה`, `בקליניקה` (המקום).

## היקף השינוי

### 1. קבצי קוד (src/)
החלפה ב-13 הקבצים שאותרו:
- Routes: `terms.tsx`, `services.index.tsx`, `services.$slug.tsx`, `sitemap.tsx`, `rss[.]xml.ts`, `knowledge.tsx`, `index.tsx`, `contact.tsx`, `branding.logo-sketches.tsx`, `branding.index.tsx`, `about.tsx`
- Lib: `diabetes-canon.ts`, `site-config.ts`, `services-content.ts`, `instagram.server.ts`, `ai-content.server.ts`, `categories.ts`, `category-content.ts`
- Components: `PartnersStrip.tsx`, `TrustBand.tsx`, `StickyWhatsApp.tsx`, `SiteFooter.tsx`, `FlagshipCards.tsx`, `AboutExpert.tsx`, `PremiumHero.tsx`, `OnycholysisVisuals.tsx`

### 2. מנוע ה-AI
ב-`src/lib/ai-content.server.ts` — לעדכן גם את ההנחיות למודל כך שייצור תמיד "פדיקוריסטית טיפולית" ולא "קלינית".

### 3. בסיס הנתונים (ai_articles)
מאמר אחד מכיל את הביטוי בתוך ה-payload. הרצת `UPDATE` עם `REPLACE` על השדות הרלוונטיים (title, payload::text → jsonb).

### 4. מטא־דאטה ו-SEO
לוודא שכותרות, תיאורי meta, OG, canonical, Schema.org ו-sitemap משקפים את המונח החדש.

## מה לא נוגעים
- המילה "קליניקה" וכל הטיותיה (המקום הפיזי).
- מבנה הקוד, העיצוב, הצבעים, הפונטים.
- שום לוגיקה עסקית מעבר להחלפת מחרוזות.

## אימות
לאחר ההחלפה: `rg "פדיקוריסטית קלינית|פדיקור קליני"` חייב להחזיר 0 תוצאות גם בקוד וגם ב-DB.
