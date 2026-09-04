import type { CSSProperties, ReactNode } from "react";

/**
 * שפת העיצוב העריכתית-קלינית של האתר, כפי שהיא מיושמת בדף הבית (src/routes/index.tsx).
 * הערכים כאן הם מקור אמת יחיד לעמודי מרכז הידע, המאמר והקטגוריה:
 * לבן/שמנת, ירוק עמוק, hairline של 1px, אפס פינות מעוגלות ואפס צללים.
 */

export const BODONI = "'Bodoni Moda',serif";

export const C = {
  paper: "#FFFFFF",
  cream: "#F7F5F1",
  creamDeep: "#EFEDE8",
  line: "#ECEAE6",
  edge: "#8F8474",
  ink: "#141414",
  muted: "#4E4E4E",
  mutedSoft: "#6B6B6B",
  taupe: "#726B5E",
  green: "#0E3B2E",
  greenDeep: "#0C2B23",
  onDark: "#B9C9C0",
  onDarkLabel: "#7E9A8E",
  warn: "#9B3A28",
  gold: "#947105",
} as const;

/**
 * Eyebrow לטיני בבודוני, רווח אותיות רחב.
 * ה-marginLeft השלילי מקזז את הרווח שנוסף אחרי האות האחרונה,
 * כדי שהטקסט יישאר ממורכז באמת.
 */
export function LatinEyebrow({
  children,
  tracking = "0.4em",
  color = C.mutedSoft,
  fontSize = 13,
  className = "",
  style,
}: {
  children: ReactNode;
  tracking?: string;
  color?: string;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontFamily: BODONI,
        fontSize,
        fontWeight: 400,
        letterSpacing: tracking,
        marginLeft: `-${tracking}`,
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** תווית עברית קטנה ומרוּוחת — התחליף ל-eyebrow בעברית (בודוני הוא פונט לטיני בלבד). */
export function TrackedLabel({
  children,
  color = C.mutedSoft,
  fontSize = 12,
  className = "",
  style,
}: {
  children: ReactNode;
  color?: string;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontSize,
        fontWeight: 400,
        letterSpacing: "0.3em",
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** כפתור ראשי — מלבן חד, ירוק עמוק, מעבר לשחור ב-hover. */
export const SOLID_BUTTON = {
  background: C.green,
  color: C.paper,
  padding: "15px 44px",
  fontWeight: 400,
  fontSize: 14,
  letterSpacing: "0.2em",
  display: "inline-block",
} as const;

/** קישור "לקריאה" — קו ירוק תחתון. */
export const READ_MORE_LINK = {
  fontSize: 13,
  fontWeight: 400,
  letterSpacing: "0.2em",
  color: C.green,
  borderBottom: `1px solid ${C.green}`,
  paddingBottom: 3,
} as const;
