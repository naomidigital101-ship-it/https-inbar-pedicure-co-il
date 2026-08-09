import { SITE } from "@/lib/site-config";

type Tone = "ink" | "paper";
type Tagline = "full" | "short" | "none";

type BrandLogoProps = {
  tone?: Tone;
  /** גודל הגופן של INBAR בפיקסלים. כל שאר המידות נגזרות ממנו. */
  wordSize?: number;
  tagline?: Tagline;
};

const TAGLINE_START = "THERAPEUTIC PEDICURE";
const TAGLINE_END = "PROFESSIONAL TRAINING";

/**
 * לוגו המותג — wordmark סריפי, קו מפריד, ושורת תיאור באותיות מרווחות.
 *
 * בנוי מטיפוגרפיה ולא מקובץ תמונה, כדי שיירש את צבעי המותג (ירוק על רקע
 * בהיר, לבן על הפוטר הכהה) במקום להסתמך על filter:invert על PNG שחור.
 * הנקודה המפרידה בזהב היא החוליה לשפה העיצובית של האתר.
 *
 * האותיות של INBAR מפוזרות ב-space-between כך שהמילה תופסת בדיוק את רוחב
 * שורת התיאור — הפרופורציה של הלוגו המקורי.
 *
 * חשוב: רוחב השורה הוא שקובע כמה האותיות מתפזרות. אם הגופן של INBAR קטן
 * מדי ביחס לשורה, האותיות נמתחות ונוצרים פערים ענקיים. היחסים ב-RATIO
 * מכוילים כך שהפער בין אות לאות יישאר בערך רבע מרוחב אות — לכן אסור
 * לשנות גודל של אחד מהם בלי השני.
 */
const RATIO: Record<Exclude<Tagline, "none">, number> = {
  full: 8.1,
  short: 3.9,
};

export function BrandLogo({
  tone = "ink",
  wordSize = 32,
  tagline = "full",
}: BrandLogoProps) {
  const color = tone === "paper" ? "#FFFFFF" : "var(--primary)";
  const ruleColor =
    tone === "paper"
      ? "rgba(255,255,255,0.55)"
      : "color-mix(in oklab, var(--primary) 60%, transparent)";

  const withTagline = tagline !== "none";
  const taglineSize = withTagline
    ? Math.max(8, wordSize / RATIO[tagline])
    : 0;

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
              marginTop: wordSize * 0.26,
              marginBottom: wordSize * 0.22,
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
