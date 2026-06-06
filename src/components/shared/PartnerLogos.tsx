/**
 * לוגואים וקטוריים נקיים של שותפי מותגים מקצועיים.
 * מבוססים על השם הטיפוגרפי בלבד — לא עותקים מצולמים — כדי לכבד זכויות
 * ולהציג רענון נקי. ניתן להחליף ב-SVG הרשמי כשיסופק.
 */

type LogoProps = {
  className?: string;
  title?: string;
};

export function PharmFootLogo({ className, title = "Pharm Foot" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 220 56"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Footprint mark */}
      <g transform="translate(6 8)">
        <ellipse cx="14" cy="22" rx="11" ry="16" fill="currentColor" />
        <circle cx="6" cy="6" r="3" fill="currentColor" />
        <circle cx="13" cy="2.5" r="2.5" fill="currentColor" />
        <circle cx="20" cy="3" r="2.7" fill="currentColor" />
        <circle cx="26" cy="6" r="2.3" fill="currentColor" />
      </g>
      {/* Wordmark */}
      <text
        x="48"
        y="28"
        fontFamily="'Frank Ruhl Libre', Georgia, serif"
        fontSize="22"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="0.5"
      >
        Pharm Foot
      </text>
      <text
        x="48"
        y="44"
        fontFamily="'Heebo', sans-serif"
        fontSize="8.5"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="2.8"
        opacity="0.7"
      >
        PROFESSIONAL PEDICURE
      </text>
    </svg>
  );
}