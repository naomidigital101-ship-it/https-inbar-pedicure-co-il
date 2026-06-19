import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";

export type LegalSection = { title: string; body: string[] };

export function LegalArticle({
  title,
  eyebrow,
  label,
  updated,
  sections,
}: {
  title: string;
  eyebrow: string;
  label: string;
  updated?: string;
  sections: ReadonlyArray<LegalSection>;
}) {
  return (
    <article className="relative overflow-hidden" style={{ background: "var(--paper)" }}>
      <BrandHeroBackdrop label={label} showHalftone={false} />
      <div className="relative mx-auto max-w-[820px] px-6 py-14 md:px-10 md:py-20">
        <div className="mb-6 flex items-center gap-3">
          <BrandEyebrow>{eyebrow}</BrandEyebrow>
          <span aria-hidden className="h-px w-12" style={{ background: "var(--green-400)" }} />
        </div>
        <h1
          className="mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--green-700)",
          }}
        >
          {title}
        </h1>
        {updated ? (
          <p className="mb-10" style={{ color: "var(--ink-600)", fontSize: 13 }}>
            {updated}
          </p>
        ) : null}
        <div className="space-y-10" style={{ color: "var(--ink-900)", fontSize: "1rem", lineHeight: 1.85 }}>
          {sections.map((s) => (
            <section key={s.title}>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  color: "var(--ink-900)",
                  letterSpacing: "-0.01em",
                }}
              >
                {s.title}
              </h2>
              {s.body.map((p, i) => (
                <p key={i} className="mb-3" style={{ color: "var(--ink-600)" }}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}