import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE } from "@/lib/site-config";
import logo01 from "@/assets/logo-sketches/logo-01-apothecary-seal.png";
import logo02 from "@/assets/logo-sketches/logo-02-wordmark-arc.png";
import logo03 from "@/assets/logo-sketches/logo-03-botanical-foot.png";
import logo04 from "@/assets/logo-sketches/logo-04-vertical-stamp.png";

type Sketch = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  bestFor: string;
  image: string;
  ratio: "square" | "wide" | "portrait";
  hebrewName?: boolean;
};

const SKETCHES: Sketch[] = [
  {
    id: "apothecary-seal",
    number: "01",
    title: "Apothecary Seal",
    subtitle: "חותם בית-מרקחת",
    description:
      "חותם עגול בסגנון בית-מרקחת צרפתי וינטג'. מונוגרם זהב במרכז, מיקרו-טייפ באנגלית סביב הטבעת. תחושה של חותמת ידנית, מסורתית ומדויקת.",
    bestFor: "חותמת על אריזות · דלת קליניקה · חתימת מייל",
    image: logo01,
    ratio: "square",
  },
  {
    id: "wordmark-arc",
    number: "02",
    title: "Wordmark + Organic Arc",
    subtitle: "לוגוטייפ אופקי עם קשת",
    description:
      "לוגוטייפ סריפי דק עם קשת אורגנית ירוקה — אותה שפה ויזואלית של ה-Hero באתר. מאופק, אדיטוריאלי, מתאים ככותרת ראשית.",
    bestFor: "הדר האתר · כרטיס ביקור · נייר מכתבים",
    image: logo02,
    ratio: "wide",
    hebrewName: true,
  },
  {
    id: "botanical-foot",
    number: "03",
    title: "Botanical Foot Mark",
    subtitle: "סמל בוטני",
    description:
      "מתאר אחיד שבו כף הרגל הופכת לענף זית. סמליות של ריפוי טבעי וטיפוח. עובד גם בגדלים קטנים מאוד וגם בגרסאות מונוכרום.",
    bestFor: "Favicon · App icon · ברנדינג מצומצם",
    image: logo03,
    ratio: "square",
    hebrewName: true,
  },
  {
    id: "vertical-stamp",
    number: "04",
    title: "Vertical Stamp",
    subtitle: "תווית אנכית",
    description:
      "תווית בסגנון מוצר בית-מרקחת. שם בסריף, מספר קטלוגי בזהב וטייגליין באותיות ריווחות. תחושה של מותג קוסמטיקה צרפתי מהשורה הראשונה.",
    bestFor: "אריזות מתנה · מדבקות · קבלות · תיוג",
    image: logo04,
    ratio: "portrait",
  },
];

export const Route = createFileRoute("/branding/logo-sketches")({
  head: () => ({
    meta: [
      { title: `סקיצות לוגו · כיווני עיצוב | ${SITE.brand}` },
      {
        name: "description",
        content:
          "ארבעה כיווני עיצוב ללוגו של הקליניקה — חותם בית-מרקחת, לוגוטייפ אופקי, סמל בוטני ותווית אנכית. עמוד פנימי לבחירת כיוון.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: SITE.url + "/branding/logo-sketches" }],
  }),
  component: LogoSketchesPage,
});

function HebrewName({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-1.5">
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
          letterSpacing: "-0.01em",
          color: tone === "paper" ? "var(--paper)" : "var(--green-800)",
          lineHeight: 1.1,
        }}
      >
        ענבר פרחי
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.28em",
          color: tone === "paper" ? "var(--green-300)" : "var(--accent-gold)",
          textTransform: "none",
        }}
      >
        פדיקוריסטית טיפולית
      </span>
    </div>
  );
}

function SketchCard({ sketch }: { sketch: Sketch }) {
  const aspect =
    sketch.ratio === "wide"
      ? "aspect-[3/2]"
      : sketch.ratio === "portrait"
        ? "aspect-[3/4]"
        : "aspect-square";

  return (
    <article
      className="group relative overflow-hidden rounded-[28px] border border-stone-100"
      style={{ background: "var(--paper)", boxShadow: "var(--shadow-elegant)" }}
    >
      {/* Catalogue tag */}
      <div className="flex items-center justify-between px-7 pt-6">
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.6rem",
            color: "var(--green-700)",
            lineHeight: 1,
          }}
        >
          {sketch.number}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.26em",
            color: "var(--accent-gold)",
          }}
        >
          SKETCH · {sketch.id.toUpperCase()}
        </span>
      </div>

      {/* Paper preview */}
      <div className="px-7 pt-4">
        <div
          className={`flex items-center justify-center overflow-hidden rounded-[18px] ${aspect}`}
          style={{ background: "var(--stone-50)", border: "1px solid var(--stone-100)" }}
        >
          <img
            src={sketch.image}
            alt={`סקיצת לוגו ${sketch.number} — ${sketch.subtitle}`}
            loading="lazy"
            className="h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
        {sketch.hebrewName ? <HebrewName /> : null}
      </div>

      {/* Dark on-brand preview */}
      <div
        className={`mx-7 mt-5 flex items-center justify-center overflow-hidden rounded-[18px] ${aspect === "aspect-[3/2]" ? "aspect-[3/1.4]" : "aspect-[2/1]"}`}
        style={{ background: "var(--green-950)" }}
      >
        <img
          src={sketch.image}
          alt=""
          aria-hidden
          loading="lazy"
          className="h-full w-full object-contain p-6"
          style={{ filter: "brightness(1.05) saturate(0.9)" }}
        />
      </div>

      {/* Description */}
      <div className="px-7 pb-7 pt-6">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "1.55rem",
            letterSpacing: "-0.01em",
            color: "var(--ink-900)",
            lineHeight: 1.15,
          }}
        >
          {sketch.subtitle}
        </h2>
        <p
          className="mt-1"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 13,
            letterSpacing: "0.04em",
            color: "var(--green-700)",
          }}
        >
          {sketch.title}
        </p>
        <p
          className="mt-4 text-[14.5px]"
          style={{ color: "var(--ink-600)", lineHeight: 1.7 }}
        >
          {sketch.description}
        </p>
        <div
          className="mt-5 flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--stone-50)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "var(--accent-gold)",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            BEST FOR
          </span>
          <span style={{ fontSize: 13.5, color: "var(--ink-900)", lineHeight: 1.55 }}>
            {sketch.bestFor}
          </span>
        </div>
      </div>
    </article>
  );
}

function LogoSketchesPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--paper)" }}>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 80% 0%, var(--green-100) 0%, transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-[1280px] px-6 pt-16 pb-12 md:pt-24 md:pb-16">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-px w-10"
                style={{ background: "var(--accent-gold)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.26em",
                  color: "var(--green-700)",
                }}
              >
                LOGO · SKETCHES · 2026
              </span>
            </div>
            <h1
              className="mt-5 max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "var(--ink-900)",
              }}
            >
              ארבעה כיוונים ללוגו של{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "var(--green-700)",
                }}
              >
                ענבר פרחי
              </span>
            </h1>
            <p
              className="mt-5 max-w-2xl text-[1.05rem]"
              style={{ color: "var(--ink-600)", lineHeight: 1.7 }}
            >
              כל סקיצה נאמנה לשפת המותג הקיימת — French Pharmacy, ירוק עמוק, נייר חם וזהב מאופק.
              הטקסט בסקיצות באנגלית כדי לשמור על דיוק טיפוגרפי; השם והכותרת בעברית מוצגים מתחת
              לסמל ברנדור React. בחרי כיוון ואני אהפוך אותו ל-SVG חד עם וריאציות מלאות.
            </p>

            {/* Palette strip */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { name: "Shadow Green", hex: "#4F8C7B", tone: "var(--green-700)" },
                { name: "Sage", hex: "#8DC2B3", tone: "var(--green-500)" },
                { name: "Paper", hex: "#FAFAF8", tone: "var(--paper)", border: true },
                { name: "Stone", hex: "#F5F4F1", tone: "var(--stone-50)", border: true },
                { name: "Muted Gold", hex: "#C9A24B", tone: "var(--accent-gold)" },
              ].map((c) => (
                <div
                  key={c.hex}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--stone-100)",
                  }}
                >
                  <span
                    aria-hidden
                    className="h-9 w-9 flex-shrink-0 rounded-full"
                    style={{
                      background: c.tone,
                      border: c.border ? "1px solid var(--stone-100)" : "none",
                    }}
                  />
                  <div className="min-w-0">
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ink-900)",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10.5,
                        letterSpacing: "0.18em",
                        color: "var(--ink-600)",
                      }}
                    >
                      {c.hex}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-[1280px] px-6 pb-24">
          <div className="grid gap-7 md:grid-cols-2">
            {SKETCHES.map((s) => (
              <SketchCard key={s.id} sketch={s} />
            ))}
          </div>

          {/* Decision strip */}
          <div
            className="mt-14 overflow-hidden rounded-[28px] px-8 py-10 md:px-14 md:py-12"
            style={{ background: "var(--green-950)" }}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: "0.26em",
                    color: "var(--green-300)",
                  }}
                >
                  השלב הבא
                </span>
                <h2
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    color: "var(--paper)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                  }}
                >
                  בוחרים כיוון, ואני בונה אותו כ-SVG חד עם כל הווריאציות
                </h2>
                <p
                  className="mt-3"
                  style={{ color: "var(--green-200)", lineHeight: 1.7, fontSize: "0.98rem" }}
                >
                  ברגע שתבחרי, אהפוך את הכיוון הנבחר ללוגו וקטורי, אפיק גרסאות (אופקי, מרובע,
                  favicon, מונוכרום, על רקע כהה) ואחליף את הלוגו בכל מקום באתר.
                </p>
              </div>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center self-start whitespace-nowrap px-7 py-3.5 text-[14px] font-medium transition-colors md:self-end"
                style={{
                  background: "var(--accent-gold)",
                  color: "var(--green-950)",
                  borderRadius: 999,
                  letterSpacing: "0.04em",
                }}
              >
                בחרתי כיוון · עדכני אותי
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}