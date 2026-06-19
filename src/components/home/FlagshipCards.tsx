import { Link } from "@tanstack/react-router";
import { ArrowLeft, Droplets, Scissors, HeartPulse, type LucideIcon } from "lucide-react";
import treatmentFungus from "@/assets/treatment-fungus.jpg";
import treatmentIngrown from "@/assets/treatment-ingrown.jpg";
import treatmentDiabetic from "@/assets/treatment-diabetic.jpg";

const TEAL = "var(--green-500)";
const STAMP = "var(--accent-gold)";

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
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <span
            className="inline-block mb-4 text-[12px] font-medium uppercase"
            style={{ color: "var(--green-500)", letterSpacing: "0.24em" }}
          >
            תחומי הליבה
          </span>
          <h2
            id="flagship-heading"
            style={{
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--ink-900)",
            }}
          >
            שלושה תחומים שאני מתמחה בהם
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
              className="group relative block overflow-hidden border transition-colors"
              style={{ borderColor: "var(--stone-100)", background: "var(--paper)", borderRadius: 8 }}
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
                <span
                  aria-hidden
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center"
                  style={{ color: f.accent, background: "var(--paper)", borderRadius: 6, border: "1px solid var(--stone-100)" }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>

              <div className="p-7">
              <span
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: f.accent,
                  marginBottom: 8,
                }}
              >
                {f.tag}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.35rem",
                  letterSpacing: "-0.01em",
                  color: "var(--ink-900)",
                  lineHeight: 1.25,
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-600)", marginBottom: 18 }}>
                {f.sub}
              </p>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--green-700)",
                  }}
                >
                  לפרטים ולפרוטוקול
                </span>
                <span
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center transition-transform group-hover:-translate-x-1"
                  style={{ border: "1px solid var(--green-500)", color: "var(--green-600)", borderRadius: 6 }}
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