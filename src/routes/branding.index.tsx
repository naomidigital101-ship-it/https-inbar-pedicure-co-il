import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, ShieldCheck, Stethoscope, HeartPulse, ScissorsLineDashed, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";

export const Route = createFileRoute("/branding/")({
  head: () => ({
    meta: [
      { title: "מערכת המיתוג · ענבר פרחי" },
      {
        name: "description",
        content:
          "שפת המיתוג של הקליניקה — פלטה, טיפוגרפיה Ellinia CLM ו-Heebo, מרווחים, אלמנטים גרפיים וקומפוננטות.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: BrandingPage,
});

const PALETTE: Array<{ name: string; varName: string; hex: string; note?: string; dark?: boolean }> = [
  { name: "Paper", varName: "--paper", hex: "#FAFAF8", note: "רקע ראשי, כמעט-לבן חם" },
  { name: "Stone 50", varName: "--stone-50", hex: "#F5F4F1", note: "רקעי משנה" },
  { name: "Green 50", varName: "--green-50", hex: "#F4F9F7", note: "רקעי סקשן מנטה" },
  { name: "Green 400", varName: "--green-400", hex: "#8DC2B3", note: "קווי קשת, גוונים רכים", dark: false },
  { name: "Green 600", varName: "--green-600", hex: "#6FAE9C", note: "כפתורים ראשיים", dark: true },
  { name: "Green 700", varName: "--green-700", hex: "#4F8C7B", note: "כותרות, hover", dark: true },
  { name: "Ink 900", varName: "--ink-900", hex: "#1E2422", note: "טקסט כהה", dark: true },
  { name: "Ink 600", varName: "--ink-600", hex: "#5B5F5C", note: "טקסט משני" },
  { name: "Gold", varName: "--accent-gold", hex: "#C9A24B", note: "אקסנט בלבד", dark: true },
];

const SPECIALTIES = [
  { icon: Stethoscope, label: "אבחון קליני מעמיק של כף הרגל" },
  { icon: HeartPulse, label: "כף רגל סוכרתית · פרוטוקול אגודת אייל" },
  { icon: ScissorsLineDashed, label: "ציפורן חודרנית ואורתוניקסיה" },
  { icon: Sparkles, label: "טיפול בפטרת ושיקום ציפורן BIO" },
  { icon: ShieldCheck, label: "סטריליות מלאה, כלים חד-פעמיים" },
] as const;

const NAV_ITEMS: Array<[string, string]> = [
  ["#palette", "פלטה"],
  ["#type", "טיפוגרפיה"],
  ["#spacing", "מרווחים"],
  ["#radii", "רדיוסים וצללים"],
  ["#graphics", "אלמנטים גרפיים"],
  ["#buttons", "כפתורים"],
  ["#forms", "טפסים"],
  ["#components", "קומפוננטות"],
];

function BrandingPage() {
  return (
    <div dir="rtl" lang="he" className="min-h-screen" style={{ background: "var(--paper)" }}>
      <SiteHeader />
      <main id="main-content">
        <BrandingHero />
        <PaletteSection />
        <TypographySection />
        <SpacingSection />
        <RadiiSection />
        <GraphicsSection />
        <ButtonsSection />
        <FormsSection />
        <ComponentsSection />

        <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] tracking-[0.06em]"
            style={{ color: "var(--green-700)", fontWeight: 600 }}
          >
            ← חזרה לעמוד הבית
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function BrandingHero() {
  return (
    <section
      dir="rtl"
      className="relative"
      aria-labelledby="branding-hero"
      style={{ background: "var(--paper)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-y-0 right-0 h-full w-1/2"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M100 0 A 130 130 0 0 0 0 100"
            stroke="var(--green-400)"
            strokeOpacity="0.9"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: "1.4px" }}
            fill="none"
          />
        </svg>
        <span
          aria-hidden
          className="absolute hidden md:block"
          style={{ top: "14%", right: "6%", width: 1, height: 56, background: "rgba(30,36,34,0.12)" }}
        />
        <span
          aria-hidden
          className="absolute hidden md:block"
          style={{
            top: "12%",
            right: "5.2%",
            fontFamily: "var(--font-serif)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(30,36,34,0.32)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          BRAND · 00
        </span>
        <span
          aria-hidden
          className="absolute hidden md:block"
          style={{ bottom: "10%", left: "8%", width: 110, height: 1, background: "rgba(30,36,34,0.10)" }}
        />
        <Halftone className="absolute -bottom-10 -left-10 hidden sm:block" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10 pt-10 pb-14 md:pt-14 md:pb-20">
        <span
          className="inline-block mb-4 text-[12px] tracking-[0.18em]"
          style={{ color: "var(--green-700)", fontWeight: 600 }}
        >
          מערכת מיתוג · Living Style Guide
        </span>
        <h1
          id="branding-hero"
          className="display"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5.6vw, 4.4rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "var(--green-700)",
            maxWidth: 880,
          }}
        >
          השפה הוויזואלית של הקליניקה
        </h1>
        <p
          className="mt-5 max-w-[640px]"
          style={{ color: "var(--ink-600)", fontSize: "1.02rem", lineHeight: 1.65 }}
        >
          פלטת מנטה רגועה, טיפוגרפיה עברית מודרנית ופרטים שקטים שיוצרים תחושה של קליניקה מדויקת.
          כל קומפוננטה באתר נשענת על אותם טוקנים — שינוי כאן משתקף בכל מקום.
        </p>

        <nav
          aria-label="קיצורים בעמוד"
          className="mt-8 flex flex-wrap gap-2"
        >
          {NAV_ITEMS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="inline-flex h-9 items-center px-4 text-[13px] transition-colors"
              style={{
                background: "var(--paper)",
                color: "var(--ink-900)",
                border: "1px solid var(--stone-100)",
                borderRadius: 999,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--green-600)";
                e.currentTarget.style.background = "var(--green-50)";
                e.currentTarget.style.color = "var(--green-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--stone-100)";
                e.currentTarget.style.background = "var(--paper)";
                e.currentTarget.style.color = "var(--ink-900)";
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION SHELL ───────────────────────── */

function Section({
  id,
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="py-16 md:py-24"
      style={{ borderTop: "1px solid var(--stone-100)" }}
    >
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <header className="mb-10 grid gap-3 md:grid-cols-[140px_1fr] md:items-end md:gap-10">
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "2.2rem",
              color: "var(--green-700)",
              lineHeight: 1,
            }}
          >
            {number}
          </div>
          <div>
            <span
              className="block mb-2 text-[11px] tracking-[0.22em] uppercase"
              style={{ color: "var(--green-700)", fontWeight: 600 }}
            >
              {eyebrow}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
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
        {children}
      </div>
    </section>
  );
}

/* ───────────────────────── PALETTE ───────────────────────── */

function PaletteSection() {
  return (
    <Section
      id="palette"
      number="01"
      eyebrow="Palette"
      title="פלטה"
      description="מנטה רגועה על נייר חם. ירוקים עמוקים לכותרות וכפתורים, אפורים-דיו לטקסט, וזהב עדין בתפקיד אקסנט בלבד."
    >
      <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--stone-100)" }}>
        {PALETTE.map((c) => (
          <article
            key={c.varName}
            className="flex flex-col"
            style={{ background: "var(--paper)" }}
          >
            <div
              className="h-32"
              style={{
                background: c.hex,
                borderBottom: c.hex.toLowerCase() === "#fafaf8" ? "1px solid var(--stone-100)" : "none",
              }}
              aria-hidden
            />
            <div className="p-5">
              <div style={{ fontWeight: 700, color: "var(--ink-900)", fontSize: "0.95rem" }}>{c.name}</div>
              <div
                className="mt-1 flex items-center gap-2"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 12, color: "var(--ink-600)" }}
              >
                <span>{c.hex.toUpperCase()}</span>
                <span aria-hidden>·</span>
                <span>{c.varName}</span>
              </div>
              {c.note ? (
                <p className="mt-2" style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-600)" }}>
                  {c.note}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── TYPOGRAPHY ───────────────────────── */

function TypographySection() {
  return (
    <Section
      id="type"
      number="02"
      eyebrow="Typography"
      title="טיפוגרפיה"
      description="Ellinia CLM לכותרות תצוגה, Heebo לטקסט רץ. ספרות והדגשות עדינות ב-Frank Ruhl Libre."
    >
      <div className="grid gap-px" style={{ background: "var(--stone-100)" }}>
        <FontFamilyRow
          label="Display · Ellinia CLM"
          meta="600–800 · letter-spacing -0.03em"
          family="var(--font-display)"
        />
        <FontFamilyRow
          label="Body · Heebo"
          meta="400 · line-height 1.65"
          family='"Heebo Variable", "Heebo", system-ui, sans-serif'
        />
        <FontFamilyRow
          label="Serif accent · Frank Ruhl"
          meta="700 · ספרות וציטוטים בלבד"
          family="var(--font-serif)"
        />
      </div>

      <div className="mt-10 grid gap-px" style={{ background: "var(--stone-100)" }}>
        <TypeScaleRow
          label="Display H1"
          meta="clamp(2.4rem · 4.4rem) · 800"
          element={
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "var(--green-700)",
              }}
            >
              ענבר פרחי
            </h1>
          }
        />
        <TypeScaleRow
          label="H2"
          meta="2rem · 800"
          element={
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "2rem",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--ink-900)",
              }}
            >
              מומחית בכף הרגל הסוכרתית
            </h2>
          }
        />
        <TypeScaleRow
          label="H3"
          meta="1.5rem · 700"
          element={
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--ink-900)" }}>
              תקני אגודת אייל
            </h3>
          }
        />
        <TypeScaleRow
          label="Kicker"
          meta="12px · 600 · tracking 0.18em"
          element={
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "var(--green-700)",
                fontWeight: 600,
              }}
            >
              נעים להכיר, אני ענבר · פדיקוריסטית קלינית
            </span>
          }
        />
        <TypeScaleRow
          label="Body"
          meta="1rem · 400 · line-height 1.65"
          element={
            <p style={{ maxWidth: 640, fontSize: "1rem", lineHeight: 1.65, color: "var(--ink-900)" }}>
              קליניקה שקטה ומדויקת בבית אל. שתים-עשרה שנות ניסיון בטיפול קליני בכף הרגל,
              עבודה לפי פרוטוקולים בינלאומיים והקפדה על סטריליות מלאה.
            </p>
          }
        />
        <TypeScaleRow
          label="Numeric · Serif"
          meta="Frank Ruhl · 700"
          element={
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "2.4rem",
                color: "var(--ink-900)",
                letterSpacing: "-0.01em",
              }}
            >
              12
            </span>
          }
        />
        <TypeScaleRow
          label="Caption"
          meta="12px · 500 · tracking 0.06em"
          element={
            <span style={{ fontSize: 12, letterSpacing: "0.06em", color: "var(--ink-600)", fontWeight: 500 }}>
              שנות ניסיון קליני
            </span>
          }
        />
      </div>
    </Section>
  );
}

function FontFamilyRow({ label, meta, family }: { label: string; meta: string; family: string }) {
  return (
    <div
      className="grid gap-4 p-6 md:grid-cols-[260px_1fr] md:items-center md:gap-10"
      style={{ background: "var(--paper)" }}
    >
      <div>
        <div style={{ fontWeight: 700, color: "var(--ink-900)", fontSize: "0.95rem" }}>{label}</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 12, color: "var(--ink-600)" }}>
          {meta}
        </div>
      </div>
      <div
        style={{
          fontFamily: family,
          fontSize: "1.6rem",
          lineHeight: 1.3,
          color: "var(--ink-900)",
        }}
      >
        אבגד הוזח טיכל מנסעפ צקרש ת · 0123
      </div>
    </div>
  );
}

function TypeScaleRow({ label, meta, element }: { label: string; meta: string; element: React.ReactNode }) {
  return (
    <div
      className="grid gap-4 p-6 md:grid-cols-[200px_1fr] md:items-center md:gap-10"
      style={{ background: "var(--paper)" }}
    >
      <div>
        <div style={{ fontWeight: 700, color: "var(--ink-900)", fontSize: "0.9rem" }}>{label}</div>
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 12, color: "var(--ink-600)" }}>
          {meta}
        </div>
      </div>
      <div>{element}</div>
    </div>
  );
}

/* ───────────────────────── SPACING ───────────────────────── */

function SpacingSection() {
  const spacings = [
    { token: "1", px: 4 },
    { token: "2", px: 8 },
    { token: "3", px: 12 },
    { token: "4", px: 16 },
    { token: "6", px: 24 },
    { token: "8", px: 32 },
    { token: "12", px: 48 },
    { token: "16", px: 64 },
    { token: "24", px: 96 },
  ];
  return (
    <Section
      id="spacing"
      number="03"
      eyebrow="Spacing"
      title="סקאלת מרווחים"
      description="סקאלה של 4px. רווחים נדיבים בין סקשנים, רווחים שקטים בתוך קומפוננטות."
    >
      <div className="space-y-3">
        {spacings.map((s) => (
          <div key={s.token} className="flex items-center gap-4">
            <div
              className="w-20"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 12, color: "var(--ink-600)" }}
            >
              space-{s.token}
            </div>
            <div
              className="h-2.5"
              style={{ width: `${s.px}px`, background: "var(--green-600)", borderRadius: 999 }}
              aria-hidden
            />
            <div style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 12, color: "var(--ink-900)" }}>
              {s.px}px
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── RADII & SHADOWS ───────────────────────── */

function RadiiSection() {
  const radii = [
    { name: "sm", value: "6px" },
    { name: "md", value: "12px" },
    { name: "lg", value: "20px" },
    { name: "pill", value: "999px" },
  ];
  return (
    <Section
      id="radii"
      number="04"
      eyebrow="Surfaces"
      title="רדיוסים וצללים"
      description="קצוות עדינים, צללים שקטים. הכפתורים והתגיות תמיד pill מלא."
    >
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {radii.map((r) => (
          <div key={r.name} className="space-y-3">
            <div
              className="flex h-28 items-center justify-center text-sm"
              style={{
                background: "var(--green-50)",
                color: "var(--green-700)",
                borderRadius: r.value,
                fontWeight: 700,
                border: "1px solid var(--green-100)",
              }}
            >
              {r.name}
            </div>
            <div
              className="text-center"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace", fontSize: 12, color: "var(--ink-600)" }}
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { name: "shadow / quiet", style: "0 1px 2px rgba(30,36,34,0.04), 0 8px 24px -16px rgba(30,36,34,0.10)" },
          { name: "shadow / soft", style: "0 2px 6px rgba(30,36,34,0.06), 0 18px 40px -24px rgba(30,36,34,0.18)" },
          { name: "shadow / clinical", style: "0 4px 12px rgba(79,140,123,0.10), 0 28px 60px -30px rgba(79,140,123,0.25)" },
        ].map((s) => (
          <div
            key={s.name}
            className="flex h-32 items-center justify-center text-sm"
            style={{
              background: "var(--paper)",
              color: "var(--ink-900)",
              borderRadius: 20,
              fontWeight: 600,
              boxShadow: s.style,
            }}
          >
            {s.name}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── GRAPHICS ───────────────────────── */

function GraphicsSection() {
  return (
    <Section
      id="graphics"
      number="05"
      eyebrow="Graphic Language"
      title="אלמנטים גרפיים"
      description="קשת אורגנית, מסך חצי-טון, קווי שיער וטיפוגרפיה אנכית עדינה — שכבות שקטות שיוצרות עומק."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <DemoTile label="Organic arc">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path
              d="M100 0 A 130 130 0 0 0 0 100"
              stroke="var(--green-400)"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: "1.6px" }}
              fill="none"
            />
          </svg>
        </DemoTile>

        <DemoTile label="Halftone fade">
          <Halftone className="absolute -bottom-10 -left-10" />
        </DemoTile>

        <DemoTile label="Hairline rules">
          <span
            className="absolute"
            style={{ top: "20%", right: "12%", width: 1, height: 64, background: "rgba(30,36,34,0.18)" }}
          />
          <span
            className="absolute"
            style={{ bottom: "20%", left: "12%", width: 140, height: 1, background: "rgba(30,36,34,0.18)" }}
          />
        </DemoTile>

        <DemoTile label="Vertical serif label">
          <span
            className="absolute"
            style={{
              top: "20%",
              right: "12%",
              fontFamily: "var(--font-serif)",
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "rgba(30,36,34,0.45)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            INBAR · 01
          </span>
        </DemoTile>
      </div>
    </Section>
  );
}

function DemoTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="relative h-56 overflow-hidden"
      style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
    >
      {children}
      <div
        className="relative p-5"
        style={{ fontSize: 12, letterSpacing: "0.18em", color: "var(--ink-600)", fontWeight: 600, textTransform: "uppercase" }}
      >
        {label}
      </div>
    </div>
  );
}

function Halftone({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="260"
      height="260"
      viewBox="0 0 260 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="brandHalftoneFade" cx="30%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#1E2422" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1E2422" stopOpacity="0" />
        </radialGradient>
        <pattern id="brandDots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#1E2422" />
        </pattern>
        <mask id="brandDotsMask">
          <rect width="260" height="260" fill="url(#brandHalftoneFade)" />
        </mask>
      </defs>
      <rect width="260" height="260" fill="url(#brandDots)" mask="url(#brandDotsMask)" />
    </svg>
  );
}

/* ───────────────────────── BUTTONS ───────────────────────── */

function ButtonsSection() {
  return (
    <Section
      id="buttons"
      number="06"
      eyebrow="Buttons"
      title="כפתורים"
      description="Pill מלא. ראשי בירוק עמוק, משני עם מתאר ירוק על נייר, שלישי שקוף — כולם בגובה 44–48px."
    >
      <div className="space-y-10">
        <ButtonRow label="Primary">
          <PrimaryButton />
          <PrimaryButton hover />
          <PrimaryButton disabled />
        </ButtonRow>
        <ButtonRow label="Outline">
          <OutlineButton />
          <OutlineButton hover />
          <OutlineButton disabled />
        </ButtonRow>
        <ButtonRow label="Ghost">
          <GhostButton />
          <GhostButton hover />
          <GhostButton disabled />
        </ButtonRow>
      </div>
    </Section>
  );
}

function PrimaryButton({ hover, disabled }: { hover?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-12 items-center gap-2.5 px-7 text-[15px]"
      style={{
        background: hover ? "var(--green-700)" : "var(--green-600)",
        color: "var(--paper)",
        borderRadius: 999,
        fontWeight: 700,
        letterSpacing: "0.02em",
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
      תיאום תור בוואטסאפ
    </button>
  );
}

function OutlineButton({ hover, disabled }: { hover?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-12 items-center gap-2.5 px-6 text-[15px]"
      style={{
        background: hover ? "var(--green-50)" : "transparent",
        color: "var(--green-700)",
        border: "1.5px solid var(--green-600)",
        borderRadius: 999,
        fontWeight: 600,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Phone className="h-[16px] w-[16px]" strokeWidth={1.5} />
      התקשרו אלינו
    </button>
  );
}

function GhostButton({ hover, disabled }: { hover?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-11 items-center gap-2 px-5 text-[14px]"
      style={{
        background: hover ? "var(--green-50)" : "transparent",
        color: hover ? "var(--green-700)" : "var(--ink-900)",
        borderRadius: 999,
        fontWeight: 600,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      קרא עוד
    </button>
  );
}

function ButtonRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-center md:gap-8">
      <div style={{ fontWeight: 700, color: "var(--ink-900)", fontSize: "0.9rem" }}>{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/* ───────────────────────── FORMS ───────────────────────── */

function FormsSection() {
  return (
    <Section
      id="forms"
      number="07"
      eyebrow="Forms"
      title="טפסים"
      description="שדות גבוהים ונקיים על נייר, קצוות עדינים וטקסט קריא. תוויות מעל השדה תמיד."
    >
      <div
        className="mx-auto max-w-xl p-8"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--stone-100)",
          borderRadius: 20,
          boxShadow: "0 2px 6px rgba(30,36,34,0.06), 0 18px 40px -24px rgba(30,36,34,0.18)",
        }}
      >
        <div className="mb-6 text-center">
          <span
            className="block mb-2 text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--green-700)", fontWeight: 600 }}
          >
            תיאום תור
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.75rem",
              color: "var(--ink-900)",
              letterSpacing: "-0.01em",
            }}
          >
            נחזור אליך תוך 24 שעות
          </h3>
        </div>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="bg-name" className="mb-2 block text-sm" style={{ color: "var(--ink-900)", fontWeight: 600 }}>
              שם מלא
            </Label>
            <Input
              id="bg-name"
              placeholder="ישראלה ישראלי"
              className="h-12 px-4 text-base"
              style={{ borderRadius: 14, background: "var(--paper)", border: "1px solid var(--stone-100)" }}
            />
          </div>
          <div>
            <Label htmlFor="bg-service" className="mb-2 block text-sm" style={{ color: "var(--ink-900)", fontWeight: 600 }}>
              סוג טיפול
            </Label>
            <Select>
              <SelectTrigger
                id="bg-service"
                className="h-12 px-4 text-base"
                style={{ borderRadius: 14, background: "var(--paper)", border: "1px solid var(--stone-100)" }}
              >
                <SelectValue placeholder="בחרי טיפול" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diabetic">פדיקור סוכרתי</SelectItem>
                <SelectItem value="ingrown">ציפורן חודרנית</SelectItem>
                <SelectItem value="orthonyxia">אורתוניקסיה</SelectItem>
                <SelectItem value="fungus">טיפול בפטרת</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bg-msg" className="mb-2 block text-sm" style={{ color: "var(--ink-900)", fontWeight: 600 }}>
              הודעה
            </Label>
            <Textarea
              id="bg-msg"
              rows={4}
              placeholder="ספרי לנו על הצורך שלך…"
              className="px-4 py-3 text-base"
              style={{ borderRadius: 14, background: "var(--paper)", border: "1px solid var(--stone-100)" }}
            />
          </div>
          <label className="flex items-center gap-3 text-sm" style={{ color: "var(--ink-900)" }}>
            <Checkbox className="h-5 w-5 data-[state=checked]:bg-[var(--green-600)] data-[state=checked]:text-white" />
            אני מאשרת קבלת תזכורת בוואטסאפ
          </label>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 text-[15px]"
            style={{
              background: "var(--green-600)",
              color: "var(--paper)",
              borderRadius: 999,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
            שליחת בקשה
          </button>
        </form>
      </div>
    </Section>
  );
}

/* ───────────────────────── COMPONENTS ───────────────────────── */

function ComponentsSection() {
  return (
    <Section
      id="components"
      number="08"
      eyebrow="Components"
      title="קומפוננטות"
      description="לבני בניין החוזרות בקליניקה: רשימת התמחויות, רצועת מספרים, ותגיות אמון."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <article
          className="p-8"
          style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
        >
          <span
            className="block mb-4 text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--green-700)", fontWeight: 600 }}
          >
            Specialties list
          </span>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2" aria-label="תחומי התמחות">
            {SPECIALTIES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center"
                  style={{ color: "var(--green-600)" }}
                >
                  <Icon className="h-[16px] w-[16px]" strokeWidth={1.5} />
                </span>
                <span style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ink-900)" }}>{label}</span>
              </li>
            ))}
          </ul>
        </article>

        <article
          className="p-8"
          style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
        >
          <span
            className="block mb-4 text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--green-700)", fontWeight: 600 }}
          >
            Trust strip
          </span>
          <dl className="grid grid-cols-3 gap-px" style={{ background: "rgba(141, 194, 179, 0.45)" }}>
            {[
              { value: "12", label: "שנות ניסיון קליני" },
              { value: "אגודת אייל", label: "פרוטוקול בינלאומי" },
              { value: "1:1", label: "טיפול אישי בלבד" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5 px-3 py-4" style={{ background: "var(--paper)" }}>
                <dt
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    color: "var(--ink-900)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.value}
                </dt>
                <dd style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--ink-600)", lineHeight: 1.5, fontWeight: 500 }}>
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article
          className="p-8 md:col-span-2"
          style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
        >
          <span
            className="block mb-4 text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--green-700)", fontWeight: 600 }}
          >
            Trust pills
          </span>
          <div className="flex flex-wrap gap-2">
            {["אגודת אייל", "NHS", "איכילוב", "סטריליות מלאה", "כלים חד-פעמיים", "1:1"].map((t) => (
              <span
                key={t}
                className="inline-flex h-8 items-center px-3 text-[12px]"
                style={{
                  background: "var(--green-50)",
                  color: "var(--green-700)",
                  border: "1px solid var(--green-100)",
                  borderRadius: 999,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </article>
      </div>
    </Section>
  );
}