import type { CSSProperties, ReactNode } from "react";
import { BODONI, SOFT, TAUPE } from "@/components/services/service-tokens";

/**
 * הרכיבים הוויזואליים המשותפים לעמודי הטיפולים.
 * הערכים עצמם יושבים ב-service-tokens.ts.
 */

const SERVICES_CSS = `
.svc-scope { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; -webkit-font-smoothing:antialiased; }
.svc-scope a { color:#141414; text-decoration:none; }
/*
 * styles.css כופה על h1-h4 גופן עם important בתוך שכבת base. הצהרה
 * important בשכבה גוברת על הצהרה חסרת-שכבה, ולכן העקיפה נכתבת לאותה שכבה.
 */
@layer base {
  .svc-scope :is(h1,h2,h3) { font-family:'Assistant',sans-serif !important; }
}
.svc-scope :is(h1,h2,h3) { letter-spacing:normal; line-height:normal; font-weight:400; }
.svc-scope details summary::-webkit-details-marker { display:none; }
/* הניווט הדביק גבוה 109px; בלי זה קפיצה לעוגן מסתירה את הכותרת מתחתיו. */
.svc-scope [id] { scroll-margin-top:128px; }

.svc-btn-solid:hover { background:#141414; color:#FFFFFF; }
.svc-btn-outline:hover { background:#0E3B2E; border-color:#0E3B2E; color:#FFFFFF; }
.svc-text-link:hover { color:#0E3B2E; border-color:#0E3B2E; }
.svc-card:hover { background:#F7F5F1; }
.svc-contact-link:hover { color:#FFFFFF; border-color:#FFFFFF; }

/* ---- תבנית עמוד הטיפול ---- */

/* פס התקדמות קריאה — מסמן כמה נשאר בעמוד ארוך. */
.svc-progress { position:fixed; top:0; right:0; height:2px; background:#0E3B2E; z-index:70; }

/* הירו: קלוז-אפ קליני מצד אחד, טקסט עריכתי מהשני. */
.svc-hero { display:grid; grid-template-columns:1fr 1fr; align-items:stretch; border-bottom:1px solid #ECEAE6; }
.svc-hero-media { position:relative; min-height:540px; background:#F7F5F1; overflow:hidden; }
.svc-hero-media img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(0.85); }
.svc-hero-text { display:flex; flex-direction:column; justify-content:center; padding:90px 7%; }

/* גוף העמוד: תוכן + ריל דביק עם ניווט פנימי וכרטיס תיאום. */
.svc-body-grid { display:grid; grid-template-columns:1fr 250px; gap:70px; align-items:start; max-width:1150px; margin:0 auto; }
.svc-rail { position:sticky; top:128px; }
.svc-rail-link { display:block; padding:11px 12px 11px 0; border-bottom:1px solid #ECEAE6; border-right:2px solid transparent; font-size:12.5px; font-weight:300; line-height:1.65; letter-spacing:0.04em; color:#6B6B6B; transition:color 0.2s, border-color 0.2s; }
.svc-rail-link:hover { color:#0E3B2E; }
.svc-rail-link.is-active { color:#141414; border-right-color:#0E3B2E; }

/* סרגל תיאום קבוע במובייל — משאיר מקום לכפתור הנגישות שיושב משמאל. */
.svc-mobile-cta { display:none; position:fixed; inset-inline:0; bottom:0; z-index:50; background:#FFFFFF; border-top:1px solid #ECEAE6; padding:10px 4% 10px 84px; gap:14px; align-items:center; }

.svc-table { width:100%; border-collapse:collapse; font-size:14.5px; }
.svc-table th { text-align:right; font-weight:600; font-size:12px; letter-spacing:0.14em; color:#6B6B6B; padding:14px 12px; border-bottom:1px solid #ECEAE6; }
.svc-table td { text-align:right; font-weight:300; color:#4E4E4E; padding:16px 12px; border-bottom:1px solid #ECEAE6; line-height:1.7; }
.svc-table tr:last-child td { border-bottom:none; }

@media (max-width: 1100px) {
  .svc-body-grid { grid-template-columns:1fr !important; gap:0 !important; }
  .svc-rail { display:none !important; }
}
@media (max-width: 900px) {
  .svc-grid-2 { grid-template-columns:1fr !important; }
  .svc-grid-3 { grid-template-columns:1fr !important; }
  .svc-hero { grid-template-columns:1fr !important; }
  .svc-hero-media { min-height:300px !important; }
  .svc-hero-text { padding:56px 6% !important; }
  .svc-mobile-cta { display:flex !important; }
  /* הפוטר יושב מחוץ ל-main, אז הוא צריך את המרווח בעצמו כדי שהסרגל
     הקבוע לא יכסה את שורת הדיסקליימר. */
  .svc-scope ~ .bf { padding-bottom:104px; }
}
@media (max-width: 700px) {
  .svc-facts { grid-template-columns:repeat(2,1fr) !important; }
  .svc-causes { grid-template-columns:repeat(2,1fr) !important; }
}
`;

/** מזריק את חוקי ה-hover והרספונסיביות של עמודי הטיפולים. */
export function ServicesStyles() {
  return <style dangerouslySetInnerHTML={{ __html: SERVICES_CSS }} />;
}

/**
 * Eyebrow לטיני ב-Bodoni, כמו כותרות המקטעים בדף הבית.
 * ה-marginLeft השלילי מקזז את ה-tracking כדי שהטקסט יישאר ממורכז באמת.
 */
export function DisplayEyebrow({
  children,
  size = 14,
  tracking = 0.5,
  color = SOFT,
  style,
}: {
  children: ReactNode;
  size?: number;
  tracking?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: BODONI,
        fontSize: size,
        fontWeight: 400,
        letterSpacing: `${tracking}em`,
        marginLeft: `-${tracking}em`,
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** תווית עברית קטנה — Assistant, לא Bodoni (ל-Bodoni אין גליפים עבריים). */
export function SectionLabel({
  children,
  size = 12,
  color = SOFT,
  style,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 400,
        letterSpacing: "0.3em",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** תבליט רשימה — קו דק במקום עיגול (אין צורות מעוגלות בשפה הזאת). */
export function Dash({ color = TAUPE }: { color?: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width: 14,
        height: 1,
        background: color,
        flexShrink: 0,
        marginTop: 13,
      }}
    />
  );
}
