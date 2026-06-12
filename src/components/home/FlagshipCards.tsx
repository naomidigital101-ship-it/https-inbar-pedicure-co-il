import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import fungusImg from "@/assets/flagship-fungus.jpg";
import ingrownImg from "@/assets/flagship-ingrown.jpg";
import diabeticImg from "@/assets/flagship-diabetic.jpg";

type Flagship = {
  slug: "fungus" | "ingrown-nails" | "diabetic-feet";
  title: string;
  sub: string;
  image: string;
  alt: string;
  band: string;
  bandHover: string;
};

const FLAGSHIPS: readonly Flagship[] = [
  {
    slug: "fungus",
    title: "פטרת ציפורניים",
    sub: "פרוטוקול מלא: אבחנה, טיפול ושיקום BIO",
    image: fungusImg,
    alt: "ציפורן רגל בריאה אחרי טיפול בפטרת בקליניקה של ענבר פרחי",
    band: "bg-primary-deep",
    bandHover: "group-hover:bg-[oklch(0.26_0.05_180)]",
  },
  {
    slug: "ingrown-nails",
    title: "ציפורן חודרנית · אורטוניקסיה",
    sub: "תיקון מבני ללא ניתוח, ללא כאב",
    image: ingrownImg,
    alt: "התקנת אורטוניקסיה לטיפול בציפורן חודרנית",
    band: "bg-primary",
    bandHover: "group-hover:bg-primary-deep",
  },
  {
    slug: "diabetic-feet",
    title: "פדיקור לחולי סוכרת",
    sub: "פרוטוקול IWGDF, סטריליות מלאה",
    image: diabeticImg,
    alt: "טיפול עדין בכף רגל של מבוגר לפי פרוטוקול IWGDF",
    band: "bg-copper",
    bandHover: "group-hover:bg-[var(--primary-deep)]",
  },
];

export function FlagshipCards() {
  return (
    <section className="relative bg-background pb-20 pt-4 md:pb-28" aria-labelledby="flagship-heading">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 id="flagship-heading" className="sr-only">תחומי הליבה של הקליניקה</h2>
        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {FLAGSHIPS.map((f) => (
            <Link
              key={f.slug}
              to="/services/$slug"
              params={{ slug: f.slug }}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className={`${f.band} ${f.bandHover} px-5 py-4 text-center transition-colors duration-500`}>
                <h3
                  className="text-white"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: "1.35rem" }}
                >
                  {f.title}
                </h3>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.alt}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-5">
                <p className="text-sm leading-relaxed text-ink-soft">{f.sub}</p>
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] transition-all group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)]">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}