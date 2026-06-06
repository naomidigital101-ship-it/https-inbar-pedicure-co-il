# פאנל ניהול ליצירת מאמרים אוטומטית

## מטרה
מערכת end-to-end שמייצרת **10 מאמרים בשבוע** אוטומטית: AI מציע נושאים → מייצר מאמר מלא + תמונת hero → מבצע QA חוזר → מתזמן ומפרסם.

## ארכיטקטורה

### 1. מסד נתונים (Lovable Cloud)
טבלאות חדשות:
- `ai_topics` — תור נושאים שה-AI מציע (status: pending/approved/rejected/used, category, keywords, score)
- `ai_articles` — מאמרים שנוצרו (כל שדות `Article` כ-JSONB, status: draft/qa_pending/qa_failed/scheduled/published, qa_attempts, qa_report JSONB, scheduled_for, published_at, slug unique)
- `ai_qa_logs` — היסטוריית הרצות QA (article_id, attempt, issues JSONB, passed, model_used)
- `ai_generation_settings` — שורה יחידה: posts_per_week, publish_days, publish_hour, auto_publish (bool), preferred_models

הרשאות: admin בלבד (`has_role(auth.uid(), 'admin')`).

### 2. שכבת AI (Server Functions + Lovable AI Gateway)
קובץ `src/lib/ai-content.functions.ts`:
- `suggestTopics(count)` — סורק קטגוריות + מאמרים קיימים, מבקש מ-Gemini Pro להציע נושאים חדשים שלא כוסו, מחזיר מובנה (Output.object/Zod).
- `generateArticle(topicId)` — מקבל נושא, מייצר Article מלא לפי הסכמה הקיימת (intro, sections, FAQ, glossary, sources, contextualLinks, schema-friendly). System prompt עם החוקים מהזיכרון: עברית RTL, אסור מקף ארוך, H1 יחיד, alt בעברית, המחשה לכל כלי.
- `generateHeroImage(article)` — Lovable AI image (`google/gemini-3.1-flash-image-preview`) → מעלה ל-Supabase Storage bucket `article-images` → מחזיר URL.
- `runQA(articleId)` — הרצת QA מרובת-קריטריונים:
  1. אורך/מבנה (H1 יחיד, sections ≥4, FAQ ≥3)
  2. עברית — אסור מקפים ארוכים/em-dash/סימני AI
  3. עובדות — קריאה ל-Gemini Pro עם web search לאמת הצהרות קריטיות
  4. SEO — title<60, description<160, canonical, schema
  5. קישורים פנימיים — לפחות 2 contextualLinks למאמרים קיימים
  6. תמונה — קיימת + alt
  
  אם נכשל → תיקון אוטומטי (עד 3 ניסיונות) → אם עדיין נכשל → status=`qa_failed` (התראה).

### 3. רינדור מאמרים מה-DB
`src/lib/articles.ts` הופך לפונקציה אסינכרונית: 
- `getArticleBySlug` קודם בודק TS קיימים (backward compat), אח"כ DB.
- `getAllPublishedArticles()` — server fn לקריאת DB + מיזוג עם המאמרים הסטטיים הקיימים.
- `article.$slug.tsx` loader + sitemap + RSS משתמשים בפונקציה החדשה.

### 4. תזמון אוטומטי (pg_cron)
- Cron יומי 08:00: בודק `ai_generation_settings` → אם היום בין `publish_days` → מפרסם את המאמר הבא ב-`scheduled` (status→published).
- Cron יומי 02:00: מייצר נושאים חדשים אם תור pending<10.
- Cron יומי 03:00: מייצר עד 2 מאמרים מ-approved topics → QA → אם עבר → scheduled.
- Endpoint: `src/routes/api/public/cron/*.ts` עם `apikey` header (anon key).

### 5. פאנל ניהול (`/admin/content`)
טאבים:
- **לוח בקרה** — סטטיסטיקות, ניסיונות QA, יומן הרצות, כפתור "הרץ עכשיו".
- **נושאים** — טבלת `ai_topics` עם approve/reject/edit, כפתור "הצע 5 חדשים".
- **מאמרים בתהליך** — drafts/qa_failed/scheduled, preview, edit ידני, "הרץ QA שוב", "פרסם עכשיו".
- **הגדרות** — posts_per_week (10), publish_days (mon/tue/wed/thu/sun), publish_hour, auto_publish on/off.

קישור מ-`/admin` (לוח לידים קיים).

## פרטים טכניים

```text
DB
├── ai_topics (id, title, category_slug, keywords[], reasoning, score, status, created_at)
├── ai_articles (id, slug, topic_id, payload JSONB (Article), status, qa_attempts, qa_report JSONB, scheduled_for, published_at, hero_image_url)
├── ai_qa_logs (id, article_id, attempt, passed, issues JSONB, model, created_at)
└── ai_generation_settings (id=1, posts_per_week=10, publish_days[], publish_hour=9, auto_publish=false)

Storage
└── article-images (public bucket)

Server fns (admin-only via requireSupabaseAuth + has_role check)
├── suggestTopics, approveTopic, rejectTopic
├── generateArticle, regenerateArticle, runQA, publishArticle, schedulePending
├── getAdminArticles, getAdminTopics, getSettings, updateSettings

Cron (pg_cron → /api/public/cron/*)
├── 02:00 daily — refill-topics
├── 03:00 daily — generate-batch (up to 2/day = ~10/week on selected days)
└── 08:00 daily — publish-scheduled

Rendering layer
└── src/lib/articles.ts → loadArticles() merges static + DB published
```

## אבטחה
- `auto_publish=false` כברירת מחדל — מאמרים מחכים לאישור אנושי לפני פרסום ראשון.
- QA חייב לעבור לפני שמופיע ב-scheduled.
- Cron endpoints מאומתים ב-anon key + בדיקת `service_role` ב-handler.
- כל ה-admin server fns בודקים `has_role(userId, 'admin')`.

## היקף הבנייה
~15 קבצים חדשים, מיגרציית DB אחת גדולה, רפקטור קל ל-`articles.ts`/`article.$slug.tsx`/`sitemap.xml.ts`/`rss.xml.ts`. עלות AI: ~10×4 קריאות ליצירה+QA = ~40 קריאות/שבוע (gemini-flash זול).

## מה לא נכלל בגרסה ראשונה
- עריכת WYSIWYG מלאה (יש textarea ל-JSONB ועריכת שדות בסיסיים).
- A/B testing על כותרות.
- אנליטיקה אוטומטית לאיכות (CTR/dwell time).

מאשרת להתחיל בבנייה?