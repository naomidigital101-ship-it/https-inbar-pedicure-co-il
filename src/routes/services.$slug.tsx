import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { SITE } from "@/lib/site-config";
import { SERVICES_BY_SLUG, SERVICES, type ServicePage } from "@/lib/services-content";
import { OnycholysisVisuals } from "@/components/services/OnycholysisVisuals";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES_BY_SLUG[params.slug];
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    if (!s) return {};
    const url = `${SITE.url}/services/${s.slug}`;
    return {
      meta: [
        { title: s.metaTitle },
        { name: "description", content: s.metaDescription },
        { property: "og:title", content: s.metaTitle },
        { property: "og:description", content: s.metaDescription },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            inLanguage: "he-IL",
            url,
            name: s.title,
            description: s.metaDescription,
            citation: s.sources.map((src) => ({ "@type": "CreativeWork", name: src.label, url: src.url })),
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: s.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: s.title,
            description: s.metaDescription,
            url,
            inLanguage: "he-IL",
            bodyLocation: "כף רגל",
            performer: {
              "@type": "MedicalBusiness",
              name: SITE.brand,
              url: SITE.url,
              telephone: SITE.phoneIntl,
              address: {
                "@type": "PostalAddress",
                addressLocality: SITE.city,
                addressRegion: SITE.region,
                addressCountry: "IL",
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "בית", item: SITE.url + "/" },
              { "@type": "ListItem", position: 2, name: "שירותים", item: SITE.url + "/services" },
              { "@type": "ListItem", position: 3, name: s.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-24 text-center">
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "2rem", color: "var(--green-700)" }}>השירות לא נמצא</h1>
        <Link to="/services" className="mt-6 inline-block underline" style={{ color: "var(--green-700)" }}>חזרה לכל השירותים</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-24 text-center">
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "1.6rem", color: "var(--ink-900)" }}>אירעה שגיאה</h1>
        <p className="mt-3" style={{ color: "var(--ink-600)", fontSize: 14 }}>{error.message}</p>
        <button onClick={reset} className="mt-6 inline-flex h-11 items-center px-6" style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700 }}>נסה שוב</button>
      </main>
      <SiteFooter />
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service: s } = Route.useLoaderData() as { service: ServicePage };
  const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);

  const heading = (size: string) => ({
    fontFamily: "var(--font-display)",
    fontWeight: 300,
    fontSize: size,
    letterSpacing: "-0.02em",
    color: "var(--ink-900)",
    lineHeight: 1.15,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: "שירותים", href: "/services" },
            { label: s.navLabel },
          ]}
        />

        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
        >
          <BrandHeroBackdrop label={`SERVICE · ${s.navLabel}`} />
          <div className="relative mx-auto max-w-[1100px] px-6 py-12 md:px-10 md:py-20">
            <BrandEyebrow withRule>פדיקור טיפולי · {SITE.city}</BrandEyebrow>
            <h1
              className="mt-5 mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                letterSpacing: "-0.03em",
                color: "var(--green-700)",
                lineHeight: 1.05,
              }}
            >
              {s.title}
            </h1>
            <p style={{ color: "var(--ink-600)", fontSize: "1.1rem", lineHeight: 1.7 }}>{s.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex h-12 items-center px-7"
                style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 15 }}
              >
                קביעת תור בוואטסאפ
              </a>
              <a
                href={SITE.telUrl}
                className="inline-flex h-12 items-center px-6"
                style={{
                  background: "transparent",
                  color: "var(--green-700)",
                  border: "1.5px solid var(--green-600)",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-14" style={{ background: "var(--paper)" }}>
          <div className="mx-auto max-w-[820px] px-6">
            <div
              className="mb-8 p-6"
              style={{ background: "var(--green-50)", borderInlineStart: "3px solid var(--green-600)", borderRadius: 16 }}
            >
              <BrandEyebrow style={{ fontSize: 11 }}>בקצרה</BrandEyebrow>
              <p className="mt-2" style={{ color: "var(--ink-900)", fontSize: 15.5, lineHeight: 1.7 }}>{s.tldr}</p>
            </div>
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {s.quickFacts.map((f) => (
                <div
                  key={f.label}
                  className="p-4 text-center"
                  style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 14 }}
                >
                  <BrandEyebrow style={{ fontSize: 10 }}>{f.label}</BrandEyebrow>
                  <p className="mt-1.5" style={{ color: "var(--ink-900)", fontSize: 14, fontWeight: 600 }}>{f.value}</p>
                </div>
              ))}
            </div>
            <p style={{ color: "var(--ink-900)", fontSize: 17, lineHeight: 1.75 }}>{s.intro}</p>
          </div>
        </section>

        {/* Sections */}
        <section className="pb-12" style={{ background: "var(--paper)" }}>
          {s.slug === "onycholysis" && <OnycholysisVisuals />}
          <div className="mx-auto max-w-[820px] px-6">
            {s.sections.map((sec, i) => (
              <article
                key={i}
                className="mb-10 pb-10 last:border-b-0 last:mb-0 last:pb-0"
                style={{ borderBottom: "1px solid var(--stone-100)" }}
              >
                <h2 className="mb-4" style={heading("clamp(1.4rem, 2.6vw, 1.9rem)")}>{sec.heading}</h2>
                {sec.body && (
                  <p className="mb-4" style={{ color: "var(--ink-600)", fontSize: 16, lineHeight: 1.75 }}>{sec.body}</p>
                )}
                {sec.bullets && (
                  <ul className="space-y-2.5">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3" style={{ color: "var(--ink-600)", fontSize: 16, lineHeight: 1.7 }}>
                        <span aria-hidden className="mt-2 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: "var(--green-600)" }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.table && (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full border-collapse" style={{ fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: "var(--green-50)" }}>
                          {sec.table.headers.map((h) => (
                            <th
                              key={h}
                              className="p-3 text-right"
                              style={{ border: "1px solid var(--stone-100)", color: "var(--ink-900)", fontWeight: 600 }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri} style={{ background: "var(--paper)" }}>
                            {row.map((c, ci) => (
                              <td key={ci} className="p-3" style={{ border: "1px solid var(--stone-100)", color: "var(--ink-600)" }}>
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {sec.fromClinic && (
                  <div
                    className="mt-5 p-5"
                    style={{
                      background: "color-mix(in oklab, var(--accent-gold) 10%, var(--paper))",
                      borderInlineStart: "3px solid var(--accent-gold)",
                      borderRadius: 16,
                    }}
                  >
                    <BrandEyebrow style={{ fontSize: 11, color: "var(--accent-gold)" }}>מהקליניקה שלי</BrandEyebrow>
                    <p className="mt-2" style={{ color: "var(--ink-900)", fontSize: 14.5, lineHeight: 1.7 }}>{sec.fromClinic}</p>
                  </div>
                )}
                {sec.cites && sec.cites.length > 0 && (
                  <p className="mt-4" style={{ color: "var(--ink-600)", fontSize: 12 }}>
                    מקורות:{" "}
                    {sec.cites.map((n, idx) => {
                      const src = s.sources[n - 1];
                      if (!src) return null;
                      return (
                        <span key={n}>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="underline"
                            style={{ color: "var(--green-700)" }}
                          >
                            [{n}] {src.label}
                          </a>
                          {idx < sec.cites!.length - 1 ? " · " : ""}
                        </span>
                      );
                    })}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Red flags */}
        <section className="py-12" style={{ background: "color-mix(in oklab, #C4634F 10%, var(--paper))", borderTop: "1px solid var(--stone-100)", borderBottom: "1px solid var(--stone-100)" }}>
          <div className="mx-auto max-w-[820px] px-6">
            <BrandEyebrow style={{ color: "#9B3A28" }}>אזהרה</BrandEyebrow>
            <h2 className="mt-3 mb-4" style={{ ...heading("clamp(1.5rem, 2.8vw, 2rem)"), color: "#7A2A1B" }}>
              מתי לפנות מיידית לרופא
            </h2>
            <ul className="space-y-2.5">
              {s.redFlags.map((r) => (
                <li key={r} className="flex items-start gap-3" style={{ color: "#5A2E22", fontSize: 16, lineHeight: 1.7 }}>
                  <span aria-hidden className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: "#C4634F" }} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14" style={{ background: "var(--paper)" }}>
          <div className="mx-auto max-w-[820px] px-6">
            <BrandEyebrow>FAQ</BrandEyebrow>
            <h2 className="mt-3 mb-6" style={heading("clamp(1.6rem, 3vw, 2.2rem)")}>שאלות נפוצות</h2>
            <div className="space-y-3">
              {s.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group p-5"
                  style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 16 }}
                >
                  <summary
                    className="cursor-pointer list-none marker:hidden"
                    style={{ color: "var(--ink-900)", fontSize: 16, fontWeight: 600 }}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span>{f.q}</span>
                      <span
                        aria-hidden
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center transition-transform group-open:rotate-45"
                        style={{ background: "var(--green-50)", color: "var(--green-700)", borderRadius: 999 }}
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3" style={{ color: "var(--ink-600)", fontSize: 14.5, lineHeight: 1.7 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="py-10" style={{ background: "var(--green-50)", borderTop: "1px solid var(--green-100)", borderBottom: "1px solid var(--green-100)" }}>
          <div className="mx-auto max-w-[820px] px-6">
            <BrandEyebrow>References</BrandEyebrow>
            <h2 className="mt-3 mb-4" style={{ ...heading("1.2rem"), fontWeight: 600 }}>מקורות חיצוניים סמכותיים</h2>
            <ol className="space-y-2" style={{ fontSize: 14, color: "var(--ink-600)" }}>
              {s.sources.map((src, i) => (
                <li key={src.url}>
                  <span style={{ color: "var(--green-700)", fontWeight: 700 }}>[{i + 1}]</span>{" "}
                  <a href={src.url} target="_blank" rel="noopener noreferrer nofollow" className="underline" style={{ color: "var(--ink-900)" }}>
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4" style={{ color: "var(--ink-600)", fontSize: 12 }}>
              התוכן בעמוד זה מבוסס על מקורות קליניים מוכרים (NHS, Mayo Clinic, AAD, APMA, אגודת אייל). הוא אינו תחליף לייעוץ מקצועי אישי.
            </p>
          </div>
        </section>

        {/* Related */}
        <section className="py-14" style={{ background: "var(--paper)" }}>
          <div className="mx-auto max-w-[1100px] px-6">
            <BrandEyebrow>גם אלה</BrandEyebrow>
            <h2 className="mt-3 mb-6" style={heading("clamp(1.5rem, 2.8vw, 2rem)")}>שירותים נוספים</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/services/$slug"
                  params={{ slug: r.slug }}
                  className="p-5 transition-colors"
                  style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 16 }}
                >
                  <h3 className="mb-2" style={{ ...heading("1.05rem"), fontWeight: 600 }}>{r.title}</h3>
                  <p style={{ color: "var(--ink-600)", fontSize: 14, lineHeight: 1.65 }}>{r.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16" style={{ background: "var(--paper)" }}>
          <div
            className="mx-auto max-w-[820px] px-6 py-12 text-center md:px-12"
            style={{ background: "var(--green-50)", border: "1px solid var(--green-100)", borderRadius: 24 }}
          >
            <BrandEyebrow>קביעת תור</BrandEyebrow>
            <h2 className="mt-3 mb-3" style={heading("clamp(1.6rem, 3vw, 2.2rem)")}>מוכנים לחזור ללכת בלי כאב?</h2>
            <p className="mb-6" style={{ color: "var(--ink-600)", fontSize: 15 }}>
              {SITE.hoursDisplay} · {SITE.city}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex h-12 items-center px-7"
                style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 15 }}
              >
                וואטסאפ
              </a>
              <a
                href={SITE.telUrl}
                className="inline-flex h-12 items-center px-6"
                style={{
                  background: "transparent",
                  color: "var(--green-700)",
                  border: "1.5px solid var(--green-600)",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}