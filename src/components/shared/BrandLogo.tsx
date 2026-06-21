import wordmarkAsset from "@/assets/inbar-logo-wordmark.webp.asset.json";
const wordmark = wordmarkAsset.url;

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
  const goldColor = "var(--accent-gold)";
  const isStacked = layout === "stacked";
  const paperFilter =
    tone === "paper"
      ? "brightness(0) saturate(100%) invert(100%)"
      : undefined;

  return (
    <span
      className={isStacked ? "flex flex-col items-center" : "inline-flex items-center"}
      aria-label="INBAR"
    >
      <img
        src={wordmark}
        alt="INBAR"
        loading="eager"
        decoding="async"
        style={{
          height: size,
          width: "auto",
          display: "block",
          filter: paperFilter,
        }}
      />
      {showTagline && isStacked ? (
        <span
          className="mt-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.3em",
            color: tone === "paper" ? "var(--green-300)" : goldColor,
            textTransform: "uppercase",
          }}
        >
          ענבר פרחי · פדיקוריסטית טיפולית
        </span>
      ) : null}
    </span>
  );
}