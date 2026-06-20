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

  // Render INBAR with the "I" replaced by a serif I + ascending toe-dots above it.
  // The whole wordmark is one SVG so the custom I aligns perfectly with NBAR.
  return (
    <span
      className={isStacked ? "flex flex-col items-center" : "inline-flex items-center"}
      aria-label="INBAR"
    >
      <svg
        role="img"
        aria-hidden
        viewBox="0 0 360 110"
        width={size * 3.4}
        height={size}
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Five ascending toe-dots above the I */}
        {[
          { cx: 16, cy: 22, r: 7 },
          { cx: 30, cy: 17, r: 6 },
          { cx: 42, cy: 13, r: 5 },
          { cx: 52, cy: 10, r: 4 },
          { cx: 60, cy: 8, r: 3.2 },
        ].map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={inkColor} />
        ))}

        {/* Serif capital I — top serif, stem, bottom serif */}
        <g fill={inkColor}>
          {/* top serif */}
          <rect x="6" y="36" width="28" height="6" rx="1" />
          {/* stem */}
          <rect x="16" y="40" width="8" height="56" />
          {/* bottom serif */}
          <rect x="6" y="94" width="28" height="6" rx="1" />
        </g>

        {/* Gold accent dot at the heel pressure point */}
        <circle cx="20" cy="97.5" r="2.6" fill={goldColor} />

        {/* "NBAR" in matching serif typography */}
        <text
          x="58"
          y="98"
          fill={inkColor}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: 86,
            letterSpacing: "0.06em",
          }}
        >
          NBAR
        </text>
      </svg>
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