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
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: isStacked ? "clamp(1.6rem, 2.6vw, 2rem)" : "1.5rem",
          letterSpacing: "0.32em",
          color: nameColor,
          lineHeight: 1,
          textTransform: "uppercase",
          paddingInlineStart: "0.32em",
        }}
      >
        INBAR
      </span>
    </span>
  );
}