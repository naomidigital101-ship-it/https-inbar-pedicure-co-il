import { Link } from "@tanstack/react-router";
import { ArrowLeft, Droplets, Scissors, HeartPulse, type LucideIcon } from "lucide-react";

const TEAL = "#0F6B6E";
const STAMP = "#E89C82";
const BLOB_RADIUS = "60% 40% 50% 50% / 55% 45% 55% 45%";

type Flagship = {
  slug: "fungus" | "ingrown-nails" | "diabetic-feet";
  title: string;
  sub: string;
  icon: LucideIcon;
  tag: string;
  accent: string;
};

const FLAGSHIPS: readonly Flagship[] = [
  {
    slug: "fungus",
    title: "פטרת ציפורניים",
    sub: "פרוטוקול מלא: אבחנה, טיפול ושיקום BIO",
    icon: Droplets,
    tag: "פטרת",
    accent: TEAL,
  },
  {
    slug: "ingrown-nails",
    title: "ציפורן חודרנית · אורטוניקסיה",
    sub: "תיקון מבני ללא ניתוח, ללא כאב",
    icon: Scissors,
    tag: "אורטוניקסיה",
    accent: TEAL,
  },
  {
    slug: "diabetic-feet",
    title: "פדיקור לחולי סוכרת",
    sub: "פרוטוקול IWGDF, סטריליות מלאה",
    icon: HeartPulse,
    tag: "סוכרת",
    accent: STAMP,
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
              className="group relative block overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="relative mb-6 h-32 flex items-center justify-center">
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "10% 18%",
                    background: `${f.accent}1F`,
                    borderRadius: BLOB_RADIUS,
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "18% 26%",
                    background: `${f.accent}33`,
                    borderRadius: BLOB_RADIUS,
                    transform: "translate(8px, -6px)",
                  }}
                />
                <Icon
                  className="relative"
                  style={{ color: f.accent, width: 44, height: 44 }}
                  strokeWidth={1.6}
                  aria-hidden
                />
              </div>

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
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}