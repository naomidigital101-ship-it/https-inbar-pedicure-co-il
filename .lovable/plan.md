## מטרה
להחליף את כל הפונטים באתר ל-**Assistant** בלבד (כותרות + גוף), ולהסיר את Secular One.

## שינויים

### 1. `src/styles.css`
- להסיר את ה-imports של `@fontsource/secular-one/*`.
- לעדכן את הטוקנים:
  - `--font-heading: "Assistant", system-ui, sans-serif`
  - `--font-display: "Assistant", system-ui, sans-serif`
  - `--font-body: "Assistant", system-ui, sans-serif`
  (בשני המקומות שבהם מוגדרים הטוקנים).
- להחזיר את משקלי הכותרות למשקל מודגש מתאים ל-Assistant:
  - `h1-h4 / .font-heading / .display / .display-italic / .heading` → `font-weight: 700` (Assistant תומך 700, נראה דומיננטי בלי faux-bold).
- להוסיף import למשקל 800 של Assistant (`@fontsource/assistant/800.css` + `hebrew-800.css`) כדי שתהיה אופציה לכותרות גדולות במידת הצורך.

### 2. הסרת תלות
- `bun remove @fontsource/secular-one`.

### 3. עמוד `/branding`
- ימשיך לעבוד אוטומטית כי הוא יונק מהטוקנים.

## מה לא משתנה
- צבעי המנטה הרפואי, ה-spacing, ה-radii, ה-shadows.
- שום פונקציונליות.
- RTL ועברית.

## אימות
- לוודא שאין `Rubik` או `Secular One` שנשארו בקוד.
- לוודא שהדף `/branding` ודף הבית מציגים Assistant בכל המקומות, ללא שגיאות קונסול.
