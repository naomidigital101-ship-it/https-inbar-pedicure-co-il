import symbolImg from "@/assets/inbar-symbol.png";

type Tone = "ink" | "paper";
type Layout = "horizontal" | "stacked";

type BrandLogoProps = {
  tone?: Tone;
  layout?: Layout;
  size?: number;
  showTagline?: boolean;
};

export function BrandLogo({
  tone = "ink",
  layout = "horizontal",
  size = 56,
  showTagline = true,
}: BrandLogoProps) {
  const nameColor = tone === "paper" ? "var(--paper)" : "var(--green-800)";
  const taglineColor = tone === "paper" ? "var(--green-300)" : "var(--accent-gold)";
  const symbolFilter =
    tone === "paper"
      ? "brightness(0) saturate(100%) invert(100%)"
      : undefined;

  const isStacked = layout === "stacked";

  return (
    <span
      className={
        isStacked
          ? "flex flex-col items-center gap-3"
          : "flex items-center gap-3"
      }
    >
      <img
        src={symbolImg}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        style={{
          height: size,
          width: "auto",
          filter: symbolFilter,
        }}
      />
      <span
        className={
          isStacked
            ? "flex flex-col items-center gap-1"
            : "flex flex-col items-start gap-0.5"
        }
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: isStacked ? "clamp(1.4rem, 2.4vw, 1.85rem)" : "1.35rem",
            letterSpacing: "-0.01em",
            color: nameColor,
            lineHeight: 1.05,
          }}
        >
          ענבר פרחי
        </span>
        {showTagline ? (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.26em",
              color: taglineColor,
              lineHeight: 1.2,
            }}
          >
            פדיקוריסטית טיפולית
          </span>
        ) : null}
      </span>
    </span>
  );
}