## מטרה
התאמה מלאה של **דף הבית בלבד** (`src/routes/index.tsx` + הקומפוננטות שלו) ל-Brand & Design System Brief של INBAR — אסתטיקה של בית מרקחת צרפתי קליני, רגוע ומעודן. ללא נגיעה בעמודי מאמרים/קטגוריות/שירותים.

## 1. טוקני עיצוב גלובליים (`src/styles.css`)
מוסיף את כל סקאלת ה-Shadow Green והנייטרלים החמים כ-CSS variables, וממפה ל-`@theme inline` כדי לקבל קלאסים `bg-green-500`, `text-ink-900`, `bg-paper` וכו':

- `--paper: #FAFAF8` (רקע ראשי, לא לבן טהור)
- `--stone-50: #F5F4F1`, `--stone-100: #ECEAE5`, `--stone-300: #C9C6BF`
- `--ink-600: #5B5F5C`, `--ink-900: #1E2422`
- `--brand-green-50…950` עם הערכים המדויקים מהבריף
- `--accent-gold: #C9A24B` (שימוש מינימלי)
- מיפוי `--background → paper`, `--foreground → ink-900`, `--primary → green-500`, `--primary-foreground → paper`, `--border → stone-100`, `--muted-foreground → ink-600`
- `--radius: 0.5rem` (8px)

## 2. פונטים — Heebo + Frank Ruhl Libre + Assistant
לפי החלטת המשתמש, עוקפים את memory והמשתמש אישר במפורש.

- `bun add @fontsource-variable/heebo @fontsource/frank-ruhl-libre` (Assistant כבר מותקן)
- מייבא ב-`src/styles.css`: weights 300/400/500/600 ל-Heebo, 400/500 ל-Frank Ruhl
- טוקנים:
  - `--font-display: "Heebo Variable", system-ui, sans-serif`
  - `--font-heading: "Heebo Variable", system-ui, sans-serif`
  - `--font-body: "Assistant", system-ui, sans-serif`
  - `--font-serif: "Frank Ruhl Libre", serif` — רק ל-pull-quotes ולמספרי קטלוג 01/02/03
- כותרות גדולות במשקל **300** (light = הצרפתי), H3 ב-600, גוף 18px / line-height 1.7
- מסיר את הוספת ה-800 לכותרות שהוכנסה קודם

## 3. דף הבית — שכתוב חזותי בלבד (`src/routes/index.tsx` + sub-components)

### 3.1 PremiumHero
- ימין (RTL): label זעיר ממורווח ירוק `מומחית בטיפול בכף הרגל`, H1 `ענבר פרחי` במשקל 300 בגודל 56px עם letter-spacing -0.02em, sub-headline `פדיקוריסטית לטיפול במחלות רגליים ויבלות`, רשימת bullets עם אייקוני Lucide stroke 1.5 בירוק, ותמונה רכה ברקע stone-50
- שמאל: כרטיס "מלאי פרטים — אחזור אלייך בשעה הקרובה" עם input שם + טלפון + textarea קצר. כפתור ראשי `קבעו תור עכשיו` שפותח **WhatsApp** (`https://wa.me/...?text=...` עם הפרטים שמולאו, ללא DB, ללא backend)
- ללא gradients, ללא shadows צפים, רק hairline 1px stone-100

### 3.2 Concerns Grid — "מאיזו בעיית רגליים תרצו להיפטר?"
- אסימטריה עריכותית: 6 כרטיסים, רשת 2×3 בדסקטופ, hairline borders, אייקון Lucide thin בפינה, כותרת H3 24/600, תיאור קליני קצר
- ללא צבע רקע — רק paper עם border stone-100, hover → bg-stone-50

### 3.3 AboutExpert
- שתי עמודות: דיוקן בצד אחד (ללא border-radius עגול מלא, אלא 8px), בצד השני credentials כרשימה עם labels זעירים ממורווחים. ציטוט קצר ב-Frank Ruhl Libre

### 3.4 Process — תהליך הטיפול
- מספרים בסגנון קטלוג 01 — 02 — 03 — 04 ב-Frank Ruhl Libre בגודל גדול ובצבע green-200 (דקורטיבי), כותרת ותיאור ב-Heebo/Assistant
- פריסה אופקית עם hairlines אנכיים בין השלבים

### 3.5 Testimonials
- שקט וטקסטואלי: pull-quote יחיד גדול ב-Frank Ruhl Libre, חתימה קטנה. carousel עדין או 2-3 ציטוטים במצולב

### 3.6 CTA Band
- רקע `bg-brand-green-950 (#11221F)`, טקסט paper, כפתור ראשי לבן עם hover
- כותרת קצרה + כפתור WhatsApp יחיד

### 3.7 Header (`SiteHeader`) — התאמה קלה
- מעבר ל-`bg-paper` עם hairline תחתון `border-stone-100`
- לוגו ימין, ניווט מרכז, אייקוני Instagram/WhatsApp + כפתור ראשי שמאל
- ללא shadows, sticky

### 3.8 Footer (`SiteFooter`)
- רקע `bg-brand-green-950`, טקסט paper/stone-300, hairlines

## 4. כללי anti-AI
- מסיר כל gradient/blur/shadow-lg/glassmorphism מהקומפוננטות של דף הבית
- כל ה-icons → Lucide stroke 1.5, צבע green-600
- spacing אנכי בין סקשנים: `py-[120px]` בדסקטופ, `py-16` במובייל
- max-width container 1200px, gutters 32px

## 5. נגישות
- focus ring 2px green-600, גוף 18px, line-height 1.7
- alt בעברית בכל התמונות, kontrast AA, `lang="he"` `dir="rtl"` כבר קיימים

## 6. מה לא משתנה
- backend, DB, autopilot, מאמרים, קטגוריות, services, branding
- AccessibilityMenu, CookieConsent, StickyWhatsApp נשארים
- SEO meta של דף הבית נשמר כפי שהוא (כבר ייחודי ועברי)

## קבצים שיתעדכנו
- `src/styles.css` — טוקנים + פונטים
- `package.json` — שתי הוספות @fontsource
- `src/routes/index.tsx` — סדר הסקשנים, צבעים, classes
- `src/components/home/PremiumHero.tsx` — שכתוב מלא + טופס WhatsApp
- `src/components/home/AboutExpert.tsx`, `FlagshipCards.tsx`, `TrustBand.tsx`, `TreatmentFinder.tsx` — התאמה לטוקנים החדשים
- `src/components/shared/SiteHeader.tsx`, `SiteFooter.tsx` — paper bg / green-950 footer

## QA
- בנייה נקייה ללא שגיאות, קונסול נקי
- בדיקה ידנית של דף `/` בדסקטופ ומובייל, וידוא שדף `/branding` והעמודים האחרים לא נשברו
