## הבעיה

הכותרות בעמוד הבית (PremiumHero, AboutExpert) משתמשות במחלקה `font-extrabold` (משקל 800), אבל ה-URL של Google Fonts ב-`src/routes/__root.tsx` טוען רק את המשקלים `400;500;700;900` של Frank Ruhl Libre — **בלי 800**. התוצאה: הדפדפן מסנת'ז משקל מזויף או נופל לגופן ברירת מחדל, ולכן הכותרות נראות "לא נטענות" / לא בסריף האלגנטי שתוכנן.

בנוסף, ב-`@layer base` של `src/styles.css` מוגדר ש-h1–h4 מקבלים `font-family: var(--font-display)` (Frank Ruhl Libre). זה תקין — אבל בלי משקל 800 הוא לא ייראה כראוי.

## התיקון

### 1. הוספת משקל 800 ל-Google Fonts URL
ב-`src/routes/__root.tsx` (שורה 111), לעדכן את ה-href לכלול גם 800:

```
family=Frank+Ruhl+Libre:wght@400;500;700;800;900&family=Heebo:wght@300;400;500;700;800;900
```

### 2. אכיפת font-family מפורש בכותרות הראשיות
כדי שלא נסתמך רק על `@layer base` (שיכול להידחק ע"י utilities אחרים), להוסיף `font-heading` (קיים כבר כ-Tailwind token דרך `--font-heading`) על ה-h1/h2 ב:
- `src/components/home/PremiumHero.tsx` — ה-h1
- `src/components/home/AboutExpert.tsx` — ה-h2

(לא נוגעים בלוגיקה, רק במחלקות.)

### 3. וידוא טעינה
לאחר התיקון לבדוק ב-preview שהכותרות מופיעות בסריף Frank Ruhl Libre בעובי הנכון. אם עדיין יש בעיה — לבדוק ב-network tab שהגופן נטען ולוודא ש-CSP (`font-src https://fonts.gstatic.com`) לא חוסם (כרגע מוגדר תקין).

## קבצים שישתנו
- `src/routes/__root.tsx` — הוספת `800` ל-URL של Google Fonts
- `src/components/home/PremiumHero.tsx` — `font-heading` על ה-h1
- `src/components/home/AboutExpert.tsx` — `font-heading` על ה-h2

לא נדרשים שינויי backend, migrations או חבילות חדשות.