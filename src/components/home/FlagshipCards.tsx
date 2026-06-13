import { Link } from "@tanstack/react-router";
import { ArrowLeft, Droplets, Scissors, HeartPulse, type LucideIcon } from "lucide-react";
import treatmentFungus from "@/assets/treatment-fungus.jpg";
import treatmentIngrown from "@/assets/treatment-ingrown.jpg";
import treatmentDiabetic from "@/assets/treatment-diabetic.jpg";

const TEAL = "#0F6B6E";
const STAMP = "#E89C82";

type Flagship = {
  slug: "fungus" | "ingrown-nails" | "diabetic-feet";
  title: string;
  sub: string;
  icon: LucideIcon;
  tag: string;
  accent: string;
  image: string;
  alt: string;
};

const FLAGSHIPS: readonly Flagship[] = [
  {
    slug: "fungus",
    title: "פטרת ציפורניים",
    sub: "פרוטוקול מלא: אבחנה, טיפול ושיקום BIO",
    icon: Droplets,
    tag: "פטרת",
    accent: TEAL,
    image: treatmentFungus,
    alt: "ערכת טיפול בפטרת ציפורניים בקליניקה של ענבר פרחי",
  },
  {
    slug: "ingrown-nails",
    title: "ציפורן חודרנית · אורטוניקסיה",
    sub: "תיקון מבני ללא ניתוח, ללא כאב",
    icon: Scissors,
    tag: "אורטוניקסיה",
    accent: TEAL,
    image: treatmentIngrown,
    alt: "טיפול אורטוניקסיה לציפורן חודרנית בכף הרגל",
  },
  {
    slug: "diabetic-feet",
    title: "פדיקור לחולי סוכרת",
    sub: "פרוטוקול IWGDF, סטריליות מלאה",
    icon: HeartPulse,
    tag: "סוכרת",
    accent: STAMP,
    image: treatmentDiabetic,
    alt: "מגש כלים סטריליים חד־פעמיים לטיפול בכף הרגל הסוכרתית",
  },
];

export function FlagshipCards() {
  return (
    <section
      dir="rtl"
      className="relative bg-background pb-20 pt-10 md:pb-28 md:pt-16"
      aria-labelledby="flagship-heading"
      style={{ fontFamily: "'Assistant', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full mb-4"
            style={{ background: `${TEAL}14`, color: TEAL, fontSize: 12, fontWeight: 600, letterSpacing: "0.01em" }}
          >
            תחומי הליבה
          </span>
          <h2
            id="flagship-heading"
            style={{
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            שלושה תחומים<br />
            <span style={{ position: "relative", display: "inline-block" }}>
              שאני
              <span aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: `${TEAL}33`, borderRadius: 999 }} />
            </span>{" "}
            מתמחה בהם
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {FLAGSHIPS.map((f) => {
            const Icon = f.icon;
            return (
            <Link
              key={f.slug}
              to="/services/$slug"
              params={{ slug: f.slug }}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={f.image}
                  alt={f.alt}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(180deg, transparent 55%, color-mix(in oklab, ${f.accent} 25%, transparent) 100%)` }}
                />
                <span
                  aria-hidden
                  className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-[var(--shadow-soft)]"
                  style={{ color: f.accent }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
              </div>

              <div className="p-7">
              <span
                style={{
                  display: "inline-block",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: f.accent,
                  marginBottom: 8,
                }}
              >
                {f.tag}
              </span>
              <h3
                style={{
                  fontFamily: "'Assistant', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  lineHeight: 1.15,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)", marginBottom: 18 }}>
                {f.sub}
              </p>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TEAL,
                  }}
                >
                  לפרטים ולפרוטוקול
                </span>
                <span
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all group-hover:-translate-x-1"
                  style={{ border: `1.5px solid ${TEAL}`, color: TEAL }}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </span>
              </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}