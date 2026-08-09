import type { CSSProperties, ReactNode } from "react";

/**
 * אלמנטים גרפיים ומחזיקי-עיצוב המשותפים לכל האתר.
 * נגזרים מעמוד /branding — שינוי כאן משתקף בכל מקום.
 */

/** קשת אורגנית רכה ברקע. ממוקמת absolute בתוך hero/container relative. */
export function OrganicArc({
  className = "",
  side = "right",
  opacity = 0.9,
  stroke = "var(--green-400)",
  strokeWidth = 1.4,
}: {
  className?: string;
  side?: "left" | "right";
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  const positionClass = side === "right" ? "right-0" : "left-0";
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 ${positionClass} h-full w-1/2 ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d={side === "right" ? "M100 0 A 130 130 0 0 0 0 100" : "M0 0 A 130 130 0 0 1 100 100"}
        stroke={stroke}
        strokeOpacity={opacity}
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: `${strokeWidth}px` }}
        fill="none"
      />
    </svg>
  );
}

/** Halftone — נקודות דהויות לפינה דקורטיבית. */
export function Halftone({ className = "", size = 220 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 260 260"
      fill="none"
    >
      <defs>
        <radialGradient id="brandHalftoneFade" cx="30%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#15302E" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#15302E" stopOpacity="0" />
        </radialGradient>
        <pattern id="brandDots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#15302E" />
        </pattern>
        <mask id="brandDotsMask">
          <rect width="260" height="260" fill="url(#brandHalftoneFade)" />
        </mask>
      </defs>
      <rect width="260" height="260" fill="url(#brandDots)" mask="url(#brandDotsMask)" />
    </svg>
  );
}

/** תווית eyebrow אחידה בעמודים — text-[12px], letter-spacing 0.22em, ירוק עמוק. */
export function BrandEyebrow({
  children,
  withRule = false,
  className = "",
  style,
}: {
  children: ReactNode;
  withRule?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  if (withRule) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span aria-hidden className="h-px w-10" style={{ background: "var(--green-400)" }} />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--green-700)",
            ...style,
          }}
        >
          {children}
        </span>
      </div>
    );
  }
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--green-700)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** תווית סריף אנכית בקצה ה-hero — מספר/קוד מותג. */
export function VerticalSerifLabel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`absolute hidden md:block ${className}`}
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: 11,
        letterSpacing: "0.22em",
        color: "rgba(30,36,34,0.32)",
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** מספר סריף גדול (Frank Ruhl) לקטגוריזציית סקשנים. */
export function SerifNumber({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 700,
        fontSize: "2.2rem",
        color: "var(--green-700)",
        lineHeight: 1,
        letterSpacing: "-0.01em",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** רקע hero מותגי — קשת + halftone + label אנכי. */
export function BrandHeroBackdrop({
  label,
  showHalftone = true,
  showArc = true,
}: {
  label?: string;
  showHalftone?: boolean;
  showArc?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {showArc ? <OrganicArc /> : null}
      {label ? (
        <>
          <span
            aria-hidden
            className="absolute hidden md:block"
            style={{ top: "14%", right: "5%", width: 1, height: 56, background: "rgba(30,36,34,0.12)" }}
          />
          <VerticalSerifLabel style={{ top: "12%", right: "4.2%" }}>{label}</VerticalSerifLabel>
        </>
      ) : null}
      <span
        aria-hidden
        className="absolute hidden md:block"
        style={{ bottom: "12%", left: "8%", width: 110, height: 1, background: "rgba(30,36,34,0.10)" }}
      />
      {showHalftone ? <Halftone className="absolute -bottom-12 -left-12 hidden sm:block" /> : null}
    </div>
  );
}

/** כותרת סקשן דו-עמודתית: מספר סריף + eyebrow + h2 + תיאור. */
export function BrandSectionHeader({
  number,
  eyebrow,
  title,
  description,
  className = "",
}: {
  number?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`mb-10 grid gap-3 md:grid-cols-[110px_1fr] md:items-end md:gap-10 ${className}`}
    >
      {number ? <SerifNumber>{number}</SerifNumber> : <span aria-hidden />}
      <div>
        <BrandEyebrow className="mb-3 block">{eyebrow}</BrandEyebrow>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--ink-900)",
          }}
        >
          {title}
        </h2>
        {description ? (
          <p
            className="mt-3 max-w-[640px]"
            style={{ color: "var(--ink-600)", fontSize: "0.98rem", lineHeight: 1.65 }}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}