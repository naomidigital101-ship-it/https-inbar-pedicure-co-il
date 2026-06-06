import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { SERVICES_BY_SLUG, SERVICES } from "@/lib/services-content";

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
            "@type": "MedicalWebPage",
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
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-24 text-center">
        <h1 className="text-3xl font-black text-[#1d3a35]">השירות לא נמצא</h1>
        <Link to="/services" className="mt-6 inline-block text-[#5fa898] underline">חזרה לכל השירותים</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-24 text-center">
        <h1 className="text-2xl font-black text-[#1d3a35]">אירעה שגיאה</h1>
        <p className="mt-3 text-sm text-[#2d4a44]">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-full bg-[#5fa898] px-6 py-3 font-bold text-white">נסה שוב</button>
      </main>
      <SiteFooter />
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service: s } = Route.useLoaderData();
  const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div className="mx-auto max-w-[1100px] px-6">
            <Breadcrumb
              items={[
                { label: "בית", href: "/" },
                { label: "שירותים", href: "/services" },
                { label: s.navLabel },
              ]}
            />
          </div>
          <div className="mx-auto max-w-[900px] px-6 py-12 md:py-16">
            <p className="mb-3 inline-block rounded-full bg-[#e9f4f1] px-4 py-1.5 text-xs font-bold text-[#5fa898]">
              פדיקור טיפולי · {SITE.city}
            </p>
            <h1 className="mb-4 text-3xl font-black leading-tight text-[#1d3a35] md:text-5xl">{s.title}</h1>
            <p className="text-lg leading-relaxed text-[#2d4a44]">{s.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#25d366] px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">קביעת תור בוואטסאפ</a>
              <a href={SITE.telUrl} className="rounded-full bg-[#5fa898] px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">{SITE.phoneDisplay}</a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-[820px] px-6">
            <p className="text-lg leading-relaxed text-[#1d3a35]">{s.intro}</p>
          </div>
        </section>

        {/* Sections */}
        <section className="bg-white pb-12">
          <div className="mx-auto max-w-[820px] px-6">
            {s.sections.map((sec, i) => (
              <article key={i} className="mb-10 border-b border-[#e9f4f1] pb-10 last:border-b-0">
                <h2 className="mb-4 text-2xl font-black text-[#1d3a35] md:text-3xl">{sec.heading}</h2>
                {sec.body && (
                  <p className="mb-4 text-base leading-relaxed text-[#2d4a44]">{sec.body}</p>
                )}
                {sec.bullets && (
                  <ul className="space-y-2.5">
                    {sec.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-base leading-relaxed text-[#2d4a44]">
                        <span aria-hidden className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#5fa898]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.cites && sec.cites.length > 0 && (
                  <p className="mt-4 text-xs text-[#6b5f55]">
                    מקורות:{" "}
                    {sec.cites.map((n, idx) => {
                      const src = s.sources[n - 1];
                      if (!src) return null;
                      return (
                        <span key={n}>
                          <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[#5fa898] underline">
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
        <section className="bg-[#fdf6f3] py-12">
          <div className="mx-auto max-w-[820px] px-6">
            <h2 className="mb-4 text-2xl font-black text-[#8a3a2a] md:text-3xl">מתי לפנות מיידית לרופא</h2>
            <ul className="space-y-2.5">
              {s.redFlags.map((r) => (
                <li key={r} className="flex items-start gap-3 text-base leading-relaxed text-[#5a2e22]">
                  <span aria-hidden className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#c4634f]" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-[820px] px-6">
            <h2 className="mb-6 text-2xl font-black text-[#1d3a35] md:text-3xl">שאלות נפוצות</h2>
            <div className="space-y-3">
              {s.faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-[#b8dcd4] bg-[#fdfbf7] p-5 open:shadow-md">
                  <summary className="cursor-pointer list-none text-base font-bold text-[#1d3a35] marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      <span>{f.q}</span>
                      <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#e9f4f1] text-[#5fa898] transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#2d4a44]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Sources */}
        <section className="border-y border-[#b8dcd4] bg-[#e9f4f1] py-10">
          <div className="mx-auto max-w-[820px] px-6">
            <h2 className="mb-4 text-lg font-black text-[#1d3a35]">מקורות חיצוניים סמכותיים</h2>
            <ol className="space-y-2 text-sm text-[#2d4a44]">
              {s.sources.map((src, i) => (
                <li key={src.url}>
                  <span className="font-bold text-[#5fa898]">[{i + 1}]</span>{" "}
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#5fa898]">
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-[#6b5f55]">
              התוכן בעמוד זה מבוסס על מקורות רפואיים מוכרים (NHS, CDC, Mayo Clinic, AAD, IDF, APMA, IWGDF). הוא אינו תחליף לייעוץ רפואי אישי.
            </p>
          </div>
        </section>

        {/* Related */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-[1100px] px-6">
            <h2 className="mb-6 text-2xl font-black text-[#1d3a35]">שירותים נוספים</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/services/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-2xl border border-[#b8dcd4] bg-[#fdfbf7] p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="mb-2 text-base font-bold text-[#1d3a35]">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-[#2d4a44]">{r.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#fdfbf7] py-16">
          <div className="mx-auto max-w-[820px] rounded-3xl bg-gradient-to-br from-[#e9f4f1] to-white px-6 py-12 text-center md:px-12">
            <h2 className="mb-3 text-2xl font-black text-[#1d3a35] md:text-3xl">מוכנים לחזור ללכת בלי כאב?</h2>
            <p className="mb-6 text-base text-[#2d4a44]">{SITE.hoursDisplay} · {SITE.city}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#25d366] px-6 py-3 font-bold text-white shadow-md">וואטסאפ</a>
              <a href={SITE.telUrl} className="rounded-full bg-[#5fa898] px-6 py-3 font-bold text-white shadow-md">{SITE.phoneDisplay}</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}