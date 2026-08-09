import { SITE } from "@/lib/site-config";

type Tone = "ink" | "paper";
type Layout = "horizontal" | "stacked";

type BrandLogoProps = {
  tone?: Tone;
  /** נשמר לתאימות עם נקודות השימוש הקיימות; הלוקאפ תמיד מרוכז אנכית. */
  layout?: Layout;
  /** גובה הלוקאפ כולו בפיקסלים. שאר המידות נגזרות ממנו. */
  size?: number;
  /**
   * רוחב הלוקאפ נקבע על ידי שורת התיאור, ולכן "short" הוא הדרך לצמצם אותו
   * במסכים צרים — הקטנת גופן לבדה לא עוזרת בגלל רצפת הקריאוּת של 8px.
   */
  tagline?: "full" | "short" | "none";
};

const TAGLINE_START = "THERAPEUTIC PEDICURE";
const TAGLINE_END = "PROFESSIONAL TRAINING";

/**
 * לוגו המותג — wordmark סריפי, קו מפריד, ושורת תיאור באותיות מרווחות.
 *
 * בנוי מטיפוגרפיה ולא מקובץ תמונה, כדי שיירש את צבעי המותג (ירוק על רקע
 * בהיר, לבן על הפוטר הכהה) במקום להסתמך על filter:invert על PNG שחור.
 *
 * האותיות של INBAR מפוזרות ב-space-between כדי שהמילה תתפוס בדיוק את רוחב
 * שורת התיאור — זו הפרופורציה של הלוגו המקורי, והיא נשמרת בכל גודל.
 * הנקודה המפרידה בזהב היא החוליה לשפה העיצובית של האתר.
 */
export function BrandLogo({
  tone = "ink",
  size = 56,
  tagline = "full",
}: BrandLogoProps) {
  const color = tone === "paper" ? "#FFFFFF" : "var(--primary)";
  const ruleColor =
    tone === "paper"
      ? "rgba(255,255,255,0.55)"
      : "color-mix(in oklab, var(--primary) 60%, transparent)";

  /*
   * בלוגו המקורי שורת התיאור זעירה ביחס ל-INBAR (יחס ~5.6:1), אבל הוא מיועד
   * לשכפול בגדלים גדולים. בגובה הדר של ~50px זה יוצא 4px ולא קריא, ולכן
   * השורה הוגדלה ליחס ~3:1 — עדיין משנית בבירור, אבל נקראת.
   */
  const taglineSize = Math.max(8, size * 0.17);
  const withTagline = tagline !== "none";
  const wordSize = withTagline ? size * 0.52 : size * 0.8;

  return (
    <span
      className="inline-flex flex-col"
      aria-label={SITE.brand}
      role="img"
      style={{ color, lineHeight: 1 }}
    >
      <span
        aria-hidden
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-serif)",
          // 500 מתקרב למשקל הסריף הגבוה-ניגודיות של הלוגו המקורי
          fontWeight: 500,
          fontSize: wordSize,
          direction: "ltr",
        }}
      >
        {"INBAR".split("").map((ch, i) => (
          <span key={`${ch}-${i}`}>{ch}</span>
        ))}
      </span>

      {withTagline ? (
        <>
          <span
            aria-hidden
            style={{
              display: "block",
              height: 1,
              background: ruleColor,
              marginTop: size * 0.14,
              marginBottom: size * 0.12,
            }}
          />
          <span
            aria-hidden
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: taglineSize,
              letterSpacing: "0.18em",
              whiteSpace: "nowrap",
              direction: "ltr",
              opacity: tone === "paper" ? 0.85 : 0.72,
            }}
          >
            {TAGLINE_START}
            {tagline === "full" ? (
              <>
                <span style={{ color: "var(--accent-gold)", opacity: 1 }}> • </span>
                {TAGLINE_END}
              </>
            ) : null}
          </span>
        </>
      ) : null}
    </span>
  );
}
