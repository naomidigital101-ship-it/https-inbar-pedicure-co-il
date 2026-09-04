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

.svc-btn-solid:hover { background:#141414; color:#FFFFFF; }
.svc-btn-outline:hover { background:#0E3B2E; border-color:#0E3B2E; color:#FFFFFF; }
.svc-text-link:hover { color:#0E3B2E; border-color:#0E3B2E; }
.svc-card:hover { background:#F7F5F1; }
.svc-contact-link:hover { color:#FFFFFF; border-color:#FFFFFF; }

@media (max-width: 900px) {
  .svc-grid-2 { grid-template-columns:1fr !important; }
  .svc-grid-3 { grid-template-columns:1fr !important; }
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
