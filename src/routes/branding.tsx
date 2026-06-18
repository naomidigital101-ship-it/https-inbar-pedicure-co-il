import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/branding")({
  head: () => ({
    meta: [
      { title: "מיתוג — מערכת העיצוב | ענבר פרחי" },
      {
        name: "description",
        content:
          "Living Style Guide — צבעים, טיפוגרפיה, מרווחים, רדיוסים, כפתורים, טפסים וכרטיסים של מערכת המיתוג.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: BrandingPage,
});

const COLORS: Array<{ name: string; var: string; hex: string; note?: string }> = [
  { name: "Primary (Sage)", var: "--primary", hex: "#8FB89A", note: "כפתורים ראשיים, אקסנטים" },
  { name: "Primary Hover", var: "--primary-hover", hex: "#7CA888" },
  { name: "Primary Deep", var: "--primary-deep", hex: "#5E8A6B" },
  { name: "Primary Soft", var: "--primary-soft", hex: "#EAF2EC", note: "רקעי badge ואזורים רכים" },
  { name: "Ink", var: "--ink", hex: "#3E5447", note: "כותרות וטקסט כהה" },
  { name: "Text Muted", var: "--text-muted", hex: "#6E7E73" },
  { name: "Background", var: "--background", hex: "#FFFFFF" },
  { name: "Surface Soft", var: "--surface-soft", hex: "#F2F7F3", note: "רקע לסקשנים מתחלפים" },
  { name: "Border", var: "--border", hex: "#D5E3D8" },
];

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <div className="kicker mb-3">{eyebrow}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Swatch({ name, hex, varName, note }: { name: string; hex: string; varName: string; note?: string }) {
  const isLight = hex.toLowerCase() === "#ffffff" || hex.toLowerCase() === "#f2f7f3" || hex.toLowerCase() === "#eaf2ec" || hex.toLowerCase() === "#d5e3d8";
  return (
    <Card className="overflow-hidden rounded-[22px] border-border/60 p-0 shadow-[var(--shadow-soft)]">
      <div
        className="h-28 w-full"
        style={{ background: hex, borderBottom: isLight ? "1px solid var(--border)" : "none" }}
        aria-hidden
      />
      <div className="space-y-1 p-5">
        <div className="text-sm font-bold text-ink">{name}</div>
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span>{hex}</span>
          <span aria-hidden>·</span>
          <span>{varName}</span>
        </div>
        {note ? <div className="pt-1 text-xs text-text-muted">{note}</div> : null}
      </div>
    </Card>
  );
}

function BrandingPage() {
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
  const radii = [
    { name: "sm", value: "8px" },
    { name: "md", value: "14px" },
    { name: "lg", value: "22px" },
    { name: "pill", value: "999px" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-soft py-20 md:py-28">
          <Swoosh className="pointer-events-none absolute -top-10 -left-10 h-72 w-72 text-primary/30" />
          <Dots className="pointer-events-none absolute bottom-6 right-10 h-24 w-40 text-primary/40" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="kicker mb-4">מיתוג · Living Style Guide</div>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] text-ink">
              מערכת המיתוג של <span className="text-primary-deep">ענבר פרחי</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
              שפה ויזואלית ירוק-מנטה רכה ונקייה, בנויה על טוקנים מרכזיים. כל הקומפוננטות
              באתר יונקות מאותם משתנים — שינוי במקור משתקף אוטומטית בכל מקום.
            </p>
            <nav aria-label="קיצורים בעמוד" className="mt-8 flex flex-wrap gap-2">
              {[
                ["#colors", "צבעים"],
                ["#type", "טיפוגרפיה"],
                ["#spacing", "מרווחים"],
                ["#radii", "רדיוסים וצללים"],
                ["#buttons", "כפתורים"],
                ["#forms", "טפסים"],
                ["#cards", "כרטיסים"],
                ["#decor", "אלמנטים דקורטיביים"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:bg-primary-soft"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Colors */}
        <Section id="colors" eyebrow="01 · Palette" title="צבעים">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <Swatch key={c.var} name={c.name} hex={c.hex} varName={c.var} note={c.note} />
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section id="type" eyebrow="02 · Typography" title="טיפוגרפיה">
          <div className="space-y-8">
            <TypeRow label="Eyebrow / Kicker" meta="11px · Bold · tracking-wide">
              <span className="kicker">קליניקה רפואית · 12+ שנות ניסיון</span>
            </TypeRow>
            <TypeRow label="H1 — Display" meta="clamp(2.5rem · 4rem) · 800">
              <h1 className="text-5xl md:text-6xl font-bold text-ink">בריאות כף הרגל ברמה אחרת</h1>
            </TypeRow>
            <TypeRow label="H2" meta="2.25rem · 800">
              <h2 className="text-4xl font-bold text-ink">מומחית בכף הרגל הסוכרתית</h2>
            </TypeRow>
            <TypeRow label="H3" meta="1.5rem · 700">
              <h3 className="text-2xl font-bold text-ink">תקני IWGDF / NHS</h3>
            </TypeRow>
            <TypeRow label="Body" meta="1rem–1.125rem · 400 · line-height 1.65">
              <p className="max-w-2xl text-base md:text-lg leading-[1.65] text-ink-soft">
                טקסט רץ קריא, מעוצב לקריאה ארוכה של תוכן רפואי. שמירה על ניגודיות AA ועל
                ריווח שורות נדיב כדי להפחית עומס קוגניטיבי.
              </p>
            </TypeRow>
            <TypeRow label="Small / Caption" meta="0.875rem · 500">
              <span className="text-sm font-medium text-text-muted">הערות, מטא-מידע ופרטים משניים.</span>
            </TypeRow>
          </div>
        </Section>

        {/* Spacing */}
        <Section id="spacing" eyebrow="03 · Spacing" title="סקאלת מרווחים">
          <div className="space-y-3">
            {spacings.map((s) => (
              <div key={s.token} className="flex items-center gap-4">
                <div className="w-16 font-mono text-sm text-text-muted">space-{s.token}</div>
                <div
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `${s.px}px` }}
                  aria-hidden
                />
                <div className="font-mono text-sm text-ink">{s.px}px</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Radii & Shadows */}
        <Section id="radii" eyebrow="04 · Surfaces" title="רדיוסים וצללים">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {radii.map((r) => (
              <div key={r.name} className="space-y-3">
                <div
                  className="flex h-28 items-center justify-center bg-primary-soft text-sm font-bold text-primary-deep"
                  style={{ borderRadius: r.value }}
                >
                  {r.name}
                </div>
                <div className="text-center font-mono text-xs text-text-muted">{r.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: "shadow-soft", style: "var(--shadow-soft)" },
              { name: "shadow-elegant", style: "var(--shadow-elegant)" },
              { name: "shadow-clinical", style: "var(--shadow-clinical)" },
            ].map((s) => (
              <div
                key={s.name}
                className="flex h-32 items-center justify-center rounded-[22px] bg-background text-sm font-bold text-ink"
                style={{ boxShadow: s.style }}
              >
                {s.name}
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section id="buttons" eyebrow="05 · Buttons" title="כפתורים">
          <div className="space-y-10">
            <ButtonRow label="Primary">
              <Button className="rounded-full px-7 py-6 text-base">קביעת תור</Button>
              <Button className="rounded-full px-7 py-6 text-base hover:bg-primary-hover">Hover</Button>
              <Button className="rounded-full px-7 py-6 text-base" disabled>
                Disabled
              </Button>
            </ButtonRow>
            <ButtonRow label="Outline">
              <Button variant="outline" className="rounded-full border-primary px-7 py-6 text-base text-primary-deep hover:bg-primary-soft">
                לפרטים נוספים
              </Button>
              <Button variant="outline" className="rounded-full border-primary bg-primary-soft px-7 py-6 text-base text-primary-deep">
                Hover
              </Button>
              <Button variant="outline" className="rounded-full px-7 py-6 text-base" disabled>
                Disabled
              </Button>
            </ButtonRow>
            <ButtonRow label="Ghost">
              <Button variant="ghost" className="rounded-full px-6 text-base text-ink hover:bg-primary-soft hover:text-primary-deep">
                Ghost
              </Button>
              <Button variant="ghost" className="rounded-full bg-primary-soft px-6 text-base text-primary-deep">
                Hover
              </Button>
              <Button variant="ghost" className="rounded-full px-6 text-base" disabled>
                Disabled
              </Button>
            </ButtonRow>
            <ButtonRow label="Sizes">
              <Button className="rounded-full" size="sm">Small</Button>
              <Button className="rounded-full">Default</Button>
              <Button className="rounded-full px-8 py-6 text-base">Large</Button>
            </ButtonRow>
          </div>
        </Section>

        {/* Forms */}
        <Section id="forms" eyebrow="06 · Forms" title="טפסים">
          <Card className="mx-auto max-w-xl rounded-[22px] border-border/60 bg-card p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-ink">קביעת תור</h3>
              <p className="mt-2 text-sm text-text-muted">נחזור אליך תוך 24 שעות</p>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label htmlFor="bg-name" className="mb-2 block text-sm font-medium text-ink">
                  שם מלא
                </Label>
                <Input
                  id="bg-name"
                  placeholder="ישראלה ישראלי"
                  className="h-12 rounded-2xl border-border bg-background px-4 text-base"
                />
              </div>
              <div>
                <Label htmlFor="bg-service" className="mb-2 block text-sm font-medium text-ink">
                  סוג טיפול
                </Label>
                <Select>
                  <SelectTrigger id="bg-service" className="h-12 rounded-2xl border-border bg-background px-4 text-base">
                    <SelectValue placeholder="בחרי טיפול" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diabetic">פדיקור סוכרתי</SelectItem>
                    <SelectItem value="ingrown">ציפורן חודרנית</SelectItem>
                    <SelectItem value="callus">יבלות וסדקים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bg-msg" className="mb-2 block text-sm font-medium text-ink">
                  הודעה
                </Label>
                <Textarea
                  id="bg-msg"
                  rows={4}
                  placeholder="ספרי לנו על הצורך שלך…"
                  className="rounded-2xl border-border bg-background px-4 py-3 text-base"
                />
              </div>
              <label className="flex items-center gap-3 text-sm text-ink">
                <Checkbox className="h-5 w-5 rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                אני מאשרת קבלת תזכורת בוואטסאפ
              </label>
              <Button
                type="submit"
                className="h-14 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-[var(--shadow-elegant)] hover:bg-primary-hover"
              >
                שליחת בקשה
              </Button>
            </form>
          </Card>
        </Section>

        {/* Cards & Badges */}
        <Section id="cards" eyebrow="07 · Cards & Badges" title="כרטיסים ותגיות">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-[22px] border-border/60 bg-card p-7 shadow-[var(--shadow-soft)]">
              <Badge className="rounded-full bg-primary-soft px-3 py-1 text-primary-deep hover:bg-primary-soft">
                חדש
              </Badge>
              <h4 className="mt-4 text-xl font-bold text-ink">פדיקור סוכרתי</h4>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                טיפול קליני לרגל סוכרתית לפי תקני IWGDF, מבוסס פרוטוקול NHS.
              </p>
            </Card>
            <Card className="rounded-[22px] border-primary/40 bg-primary-soft p-7 shadow-[var(--shadow-soft)]">
              <Badge className="rounded-full bg-background px-3 py-1 text-primary-deep hover:bg-background">
                מומלץ
              </Badge>
              <h4 className="mt-4 text-xl font-bold text-ink">ציפורן חודרנית</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                פתרון עדין ומדויק להחזרת ציפורן לכיוון הצמיחה הנכון.
              </p>
            </Card>
            <Card className="rounded-[22px] border-border/60 bg-card p-7 shadow-[var(--shadow-clinical)]">
              <Badge variant="outline" className="rounded-full border-primary px-3 py-1 text-primary-deep">
                Trust
              </Badge>
              <h4 className="mt-4 text-xl font-bold text-ink">מרצה ארצית</h4>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                מרצה למאות פדיקוריסטיות בישראל, בכירה בתחום הקליני.
              </p>
            </Card>
          </div>
        </Section>

        {/* Decorative */}
        <Section id="decor" eyebrow="08 · Decorative" title="אלמנטים דקורטיביים">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative h-56 overflow-hidden rounded-[22px] bg-surface-soft">
              <Swoosh className="absolute -bottom-4 -right-4 h-48 w-72 text-primary/40" />
              <div className="relative p-6 text-sm font-medium text-ink">Swoosh</div>
            </div>
            <div className="relative h-56 overflow-hidden rounded-[22px] bg-surface-soft">
              <Dots className="absolute bottom-6 left-8 h-24 w-44 text-primary/50" />
              <div className="relative p-6 text-sm font-medium text-ink">Dots</div>
            </div>
          </div>
        </Section>

        <div className="mx-auto max-w-6xl px-6 py-12">
          <Link to="/" className="text-sm font-medium text-primary-deep underline-offset-4 hover:underline">
            ← חזרה לעמוד הבית
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TypeRow({
  label,
  meta,
  children,
}: {
  label: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-border/50 pb-6 md:grid-cols-[200px_1fr] md:gap-8">
      <div>
        <div className="text-sm font-bold text-ink">{label}</div>
        <div className="font-mono text-xs text-text-muted">{meta}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ButtonRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-[140px_1fr] md:items-center md:gap-6">
      <div className="text-sm font-bold text-ink">{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Swoosh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M10 150 C 80 40, 220 40, 390 150"
        stroke="currentColor"
        strokeWidth="32"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Dots({ className }: { className?: string }) {
  const cells = Array.from({ length: 6 * 3 });
  return (
    <svg viewBox="0 0 240 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {cells.map((_, i) => {
        const x = (i % 6) * 40 + 16;
        const y = Math.floor(i / 6) * 40 + 16;
        return <circle key={i} cx={x} cy={y} r={5} fill="currentColor" />;
      })}
    </svg>
  );
}