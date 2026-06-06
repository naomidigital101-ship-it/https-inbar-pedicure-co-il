# תוכנית שדרוג לפרודקשן — ענבר פרחי

המטרה: להפוך את האתר הקיים למותג סמכות רפואי־טיפולי פרימיום, RTL, עם SEO/GEO מלא. שומרים על כל הראוטינג, האדמין, מחולל התוכן, הטפסים והדאטה הקיימים — מחליפים אומנות, צפיפות, היררכיה, מטא־דאטה וארכיטקטורת תוכן.

## 1. דיזיין טוקנים (`src/styles.css`)
החלפת הפלטה לטוקנים שביקשת (oklch מקבילים):
- `--background` #FBF7F0, `--surface` #FFFFFF, `--surface-warm` #F4E9DF
- `--primary` (sage) #2F6F5E, `--primary-soft` #DCEBE4, `--primary-deep` כהה יותר
- `--blush` #E8C8BE, `--copper` #B87954
- `--ink` #102321, `--ink-soft` #5F6B67, `--border` rgba(16,35,33,.12)
- `--shadow-elegant` רך וחם, `--radius` 22px
שמירה על Heebo + Frank Ruhl Libre. לעדכן `kicker`, `display`, `display-italic`.

## 2. Header (`SiteHeader.tsx`)
- גובה 76px קומפקטי, max-width 1240, רקע `bg-surface/90` עם blur
- CTA קטן בוואטסאפ בנאב הדסקטופ
- מובייל: כפתור וואטסאפ דביק תחתון גלובלי (קומפוננטה חדשה `StickyWhatsApp`)

## 3. Hero חדש (`src/routes/index.tsx`)
Grid דו־טורי RTL, min-h 82vh, מרווחים מהודקים, בלי דד־זונים.
- Eyebrow: "פדיקור טיפולי | בית אל"
- H1: "ענבר פרחי — פדיקוריסטית טיפולית לכף הרגל"
- Subcopy + משפט אמון
- 2 CTA: וואטסאפ (sage מלא) + ניווט (outline)
- 4 פרוף־צ'יפס (12+ שנים, סוכרת, מרצה, סטריליות)
- תמונת ענבר עם פאנל sage-soft מוסט מאחור, radius 24, border חם, shadow רך
- caption מתחת
- mini-strip לוגי אמון/מקורות (משרד הבריאות, NHS, AAD, IDF) בתחתית ה־hero

## 4. Problem Navigation — "מה מטריד אותך בכף הרגל?"
סקשן מיד אחרי ה־hero, גריד 3×2 דסקטופ / 1×6 מובייל. 6 כרטיסים קומפקטיים עם אייקון Lucide עדין, כותרת, משפט הסבר, לינק "לפרטים →". hover sage עדין.

## 5. סקשנים חדשים בעמוד הבית
- **פרוטוקול הסטריליות של ענבר** — 4 שלבים עם אייקונים
- **מתי לפנות לרופא לפני טיפול** — רשימת דגלים אדומים בקופסת `surface-warm`
- **שאלות שמתביישים לשאול** — Accordion רגיש (5 שאלות שניתנו)
- **מרכז הידע** — 6 קטגוריות עם תצוגה מקדימה של מאמרים אחרונים
- **About teaser** + **ציטוט מטופלת** (placeholder לאישור ענבר)
- **CTA אחרון** עם וואטסאפ/Waze/שעות

## 6. עמודי שירות (`src/routes/services.$slug.tsx` + `src/lib/services-content.ts`)
לכל אחד מ־6 השירותים, מבנה אחיד:
1. Direct answer summary (קופסה sage-soft בראש)
2. מהי הבעיה
3. איך מזהים
4. איך ענבר מטפלת
5. מה קורה בביקור
6. מה לא לעשות בבית
7. מתי לפנות לרופא
8. FAQ (Accordion + FAQPage JSON-LD)
9. CTA וואטסאפ
10. לינקים פנימיים לשירותים/מאמרים קשורים

## 7. SEO/GEO
- `__root.tsx`: ודא `lang="he" dir="rtl"`, OG/Twitter דיפולטים, JSON-LD `MedicalBusiness` מורחב (address, geo, openingHours, areaServed, medicalSpecialty: Podiatry), `Person` לענבר
- כל ראוט: `head()` עם title/description/canonical/og ייחודיים
- `index.tsx`: Title "ענבר פרחי | פדיקוריסטית טיפולית בבית אל", description שניתן, JSON-LD `LocalBusiness` + `BreadcrumbList`
- עמודי שירות: `Service` + `FAQPage` + `BreadcrumbList`
- מאמרים: `Article` (קיים — לוודא)
- `robots.txt` קיים — תקין
- `sitemap.xml` קיים — מוודא שכולל את כל ה־services וה־articles
- `alt` בעברית לכל תמונה, היררכיית כותרות נקייה (H1 יחיד לעמוד)

## 8. אדמין / מחולל תוכן
שומרים את הקיים. מוסיפים שדות חדשים ל־`ai_articles` (או טבלת `ai_topics`):
- `content_type` enum: service / article / glossary / sensitive_faq / case_study / video_script / prevention_guide
- `foot_problem`, `target_audience`, `search_intent`, `medical_sensitivity_level`
- `when_to_refer_doctor` (text), `cta`, `internal_links` (jsonb)
- `review_status` enum: ai_draft / waiting_review / professionally_reviewed / published
- `reviewed_by_inbar` boolean, `last_updated` timestamp
מיגרציית Supabase + עדכון UI ב־`admin.content.tsx` (שדות + פילטרים + badge סטטוס).

## 9. מובייל
- Hero: H1 → subcopy → CTA → תמונה (סדר נכון)
- Sticky WhatsApp bar תחתון
- פונטים: H1 36–40px מובייל, 56–64 דסקטופ
- בלי overflow, גריד 1 טור עד 768

## 10. QA סופי
מעבר על דסקטופ + מובייל בכל עמוד שינוי, תיקון: דד־זונים, ניגודיות, alt, hierarchy, RTL, שבירת טקסט.

---

### קבצים שיתווספו/יעודכנו
- `src/styles.css` — טוקנים
- `src/components/shared/SiteHeader.tsx` — קומפקטי + CTA
- `src/components/shared/StickyWhatsApp.tsx` — חדש
- `src/components/home/*` — Hero, ProblemNav, Sterility, RedFlags, ShameFAQ, KnowledgeTeaser, ClosingCTA
- `src/routes/index.tsx` — הרכבה + מטא + JSON-LD
- `src/routes/__root.tsx` — JSON-LD מורחב
- `src/routes/services.$slug.tsx` + `src/lib/services-content.ts` — תוכן מלא ל־6 שירותים + FAQ JSON-LD
- `src/routes/services.index.tsx` — שיפור צפיפות
- `src/routes/admin.content.tsx` — שדות חדשים
- מיגרציית Supabase — עמודות חדשות ל־`ai_articles`

### הערות
- לא ממציאים ביקורות/תעודות/תוצאות — כל מקום שדורש ראיה יסומן כ־placeholder עם הערה "ממתין לאישור ענבר".
- שומרים את הראוטינג, האוטופיילוט, מערכת המאמרים והאימייל הקיימים.
