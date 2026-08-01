# ענבר פדיקור

# PROJECT KNOWLEDGE — הרוכב העצלן

> הדבק את זה תחת: Project Settings → Knowledge

---

## מה האתר הזה

**הרוכב העצלן** הוא פורטל תוכן מוביל בנושא אופנועי שטח ומכניקה עצמית בישראל.

**מטרה כפולה:**

1. ערך ידע — מדריכים, ביקורות, טיפים מכאניים לרוכבי שטח

2. המרה — איסוף לידים (אימייל), הפניה למכונאים, מכירת מדריכים/קורסים

**קהל יעד:** רוכבי אוף-רוד ישראלים, מתחילים עד מתקדמים, גילאי 18–45

---

## ארכיטקטורת תוכן SEO

### Pillar Pages (עמודים מרכזיים — ~3,000 מילה כל אחד)

1. `/mechanic` — מדריך מכניקה לאופנועי שטח

2. `/trails` — מסלולי שטח בישראל

3. `/bikes` — ביקורות אופנועי שטח

4. `/gear` — ציוד, קסדות והגנה

5. `/technique` — טכניקת רכיבה

### Cluster Pages (מאמרים תומכים — ~800–1,500 מילה)

כל Pillar מחובר ל-8–12 מאמרי Cluster דרך internal links.

---

## מבנה עמודים

### `/` — דף הבית

- Hero עם H1 + keyword ראשי

- 3 מאמרים מובלטים (Pillar featured)

- Lead Magnet — PDF חינמי תמורת אימייל

- רשת קטגוריות

- Social proof (מספרים, ציטוטים)

### `/article/[slug]` — עמוד מאמר

- Hero image + breadcrumb

- TOC (Table of Contents) סטיקי בצד ימין

- גוף המאמר עם Schema Article markup

- CTA box בתוך המאמר (מכונאי קרוב / PDF)

- Related articles בתחתית

- תגובות (אופציונלי — Supabase)

### `/category/[slug]` — עמוד קטגוריה

- H1 עם תיאור הקטגוריה

- רשת מאמרים עם פילטר

- Schema: CollectionPage

---

## מיתוג ועיצוב

### פלטת צבעים

```

--dirt:        #1a0e00   /* רקע כהה — header, footer */

--mud:         #3d2200   /* hero background */

--clay:        #7a4a1e   /* accents */

--sand:        #c8893a   /* borders, hover */

--dust:        #f0c070   /* טקסט על רקע כהה */

--orange:      #e8650a   /* CTA ראשי, links, tags */

--orange-dark: #b34d05   /* hover states */

--green:       #2d5a1b   /* Lead Magnet, success */

--bg:          #faf7f2   /* רקע הדף */

--white:       #ffffff   /* כרטיסים */

--border:      #e8dcc8   /* גבולות */

--text:        #1a0e00   /* טקסט ראשי */

--text-muted:  #6b4c2a   /* טקסט משני */

```

### פונטים

- **כותרות:** `Frank Ruhl Libre` — weights 400, 700, 900

- **גוף:** `Heebo` — weights 300, 400, 500, 700, 800, 900

- שניהם מ-Google Fonts

### עיצוב כללי

- border-radius: 8px (אלמנטים קטנים), 14px (כרטיסים)

- border: 1px solid var(--border)

- hover: translateY(-3px) + shadow על כרטיסים

- sticky header עם border-bottom כתומה 3px

---

## Lead Magnet — לוגיקת המרה

**ההצעה:** "צ'קליסט 47 בדיקות לפני יציאה לשטח" — PDF להורדה

**Flow:**

1. משתמש מכניס אימייל בטופס Lead Magnet

2. שמירה ב-Supabase טבלת `leads` (email, source_page, timestamp)

3. שליחת מייל אוטומטית עם PDF (Resend / EmailJS)

4. redirect לעמוד תודה עם מאמרים מומלצים

**טבלת Supabase:**

```sql

leads (

  id uuid primary key,

  email text unique not null,

  source_page text,

  created_at timestamptz default now()

)

```

---

## קומפוננטות קבועות שאסור לשנות ללא אישור

- `components/shared/SiteHeader.tsx` — ניווט ולוגו

- `components/shared/SiteFooter.tsx` — footer מלא

- `components/shared/LeadMagnet.tsx` — טופס לידים

- `components/seo/MetaTags.tsx` — SEO head tags

- `lib/supabase.ts` — חיבור לדאטאבייס

---

## מה לא לגעת בו

- אל תשנה את פלטת הצבעים ב-`tailwind.config.ts`

- אל תחליף את הפונטים

- אל תמחק Schema markup מעמודי מאמרים

- אל תגע ב-`/shared/Layout.tsx` ללא בקשה מפורשת

---

## SEO — דרישות טכניות

- sitemap.xml דינמי — מתעדכן עם כל מאמר חדש

- robots.txt עם הכוונה נכונה

- canonical URL על כל עמוד

- breadcrumb Schema על עמודי מאמר וקטגוריה

- meta description 120–158 תווים בדיוק

- title format: `[שם מאמר] | הרוכב העצלן`

---

## ביצועים

- תמונות: WebP בלבד, lazy loading, max 800px רוחב

- LCP < 2.5s — hero image preload

- אסור Google Fonts synchronous — תמיד `display=swap`

- code splitting אוטומטי של React

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://https-inbar-pedicure-co-il.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44f03f9f-543f-4ee7-a088-faeb76d97532).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
