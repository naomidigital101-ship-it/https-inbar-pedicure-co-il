import type { CSSProperties } from "react";

/**
 * אסימוני העיצוב של עמודי הטיפולים — נגזרים אחד לאחד מדף הבית
 * (src/routes/index.tsx): לבן וקרם, ירוק עמוק, הפרדה ב-hairline של 1px
 * ובחלל בלבד. אפס border-radius ואפס box-shadow.
 *
 * Bodoni Moda משמש אך ורק לתצוגה לטינית ולמספרים דקורטיביים;
 * כל טקסט עברי הוא Assistant.
 */

export const BODONI = "'Bodoni Moda',serif";

/* לצבעים האלה יש גם tokens ב-styles.css, אבל כאן הם מפורשים
   כדי שהעמודים ייקראו מול מקור האמת בלי הפניה נוספת. */
export const INK = "#141414";
export const MUTED = "#4E4E4E";
export const SOFT = "#6B6B6B";
export const TAUPE = "#726B5E";
export const GREEN = "#0E3B2E";
export const GREEN_DARK = "#0C2B23";
export const HAIRLINE = "#ECEAE6";
export const CREAM = "#F7F5F1";
export const ON_DARK_BODY = "#B9C9C0";
export const ON_DARK_LABEL = "#7E9A8E";
export const GOLD = "#947105";
export const ALERT = "#9B3A28";

/** Bodoni נטען כ-webfont רק דרך Google Fonts; הקישור נוסף ב-head של כל עמוד. */
export const FONTS_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

/** כותרת מקטע — Assistant 700, כמו h2 בדף הבית. */
export function headingStyle(size: string, color: string = INK): CSSProperties {
  return { fontWeight: 700, fontSize: size, lineHeight: 1.4, color, margin: 0 };
}

/** תת-כותרת / פסקת פתיחה — Assistant 300. */
export function subheadingStyle(size: string, color: string = MUTED): CSSProperties {
  return { fontWeight: 300, fontSize: size, lineHeight: 1.6, color, margin: 0 };
}

/** כפתור ראשי: מלבן חד, ירוק עמוק. hover נצבע ל-#141414 דרך .svc-btn-solid. */
export const btnSolid: CSSProperties = {
  display: "inline-block",
  background: GREEN,
  color: "#FFFFFF",
  padding: "16px 46px",
  fontWeight: 400,
  fontSize: 14.5,
  letterSpacing: "0.2em",
  textAlign: "center",
};

/** כפתור מסגרת: 1px, מתמלא בירוק ב-hover דרך .svc-btn-outline. */
export const btnOutline: CSSProperties = {
  display: "inline-block",
  background: "transparent",
  color: INK,
  border: `1px solid ${INK}`,
  padding: "15px 44px",
  fontWeight: 400,
  fontSize: 13.5,
  letterSpacing: "0.2em",
  textAlign: "center",
};

/** קישור טקסט עם קו תחתון בעובי hairline. */
export const btnTextLink: CSSProperties = {
  display: "inline-block",
  color: INK,
  fontWeight: 400,
  fontSize: 14.5,
  letterSpacing: "0.14em",
  borderBottom: `1px solid ${INK}`,
  paddingBottom: 4,
};
