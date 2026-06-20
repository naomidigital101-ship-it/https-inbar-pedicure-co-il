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
  const inkColor = tone === "paper" ? "var(--paper)" : "#7DAEA0";
  const goldColor = "var(--accent-gold)";
  const isStacked = layout === "stacked";

  // Inline SVG of the custom "I" (serif I + ascending toe-dots + gold heel dot).
  // viewBox is sized so the I matches the cap height of the surrounding serif text.
  const IFoot = (
    <svg
      aria-hidden
      viewBox="0 0 70 110"
      style={{
        height: "1.05em",
        width: "auto",
        display: "inline-block",
        verticalAlign: "baseline",
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      {/* Ascending toe-dots above the I */}
      <circle cx="20" cy="24" r="7" fill={inkColor} />
      <circle cx="34" cy="19" r="6" fill={inkColor} />
      <circle cx="46" cy="15" r="5" fill={inkColor} />
      <circle cx="56" cy="12" r="4" fill={inkColor} />
      <circle cx="64" cy="10" r="3.2" fill={inkColor} />
      {/* Serif I */}
      <g fill={inkColor}>
        <rect x="6" y="38" width="28" height="6" rx="1" />
        <rect x="16" y="42" width="8" height="54" />
        <rect x="6" y="94" width="28" height="6" rx="1" />
      </g>
      {/* Gold heel pressure dot */}
      <circle cx="20" cy="97" r="2.6" fill={goldColor} />
    </svg>
  );

  return (
    <span
      className={isStacked ? "flex flex-col items-center" : "inline-flex items-center"}
      aria-label="INBAR"
    >
      <span
        dir="ltr"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: size * 0.95,
          letterSpacing: "0.06em",
          color: inkColor,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "baseline",
          gap: "0.04em",
        }}
      >
        {IFoot}
        <span>NBAR</span>
      </span>
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