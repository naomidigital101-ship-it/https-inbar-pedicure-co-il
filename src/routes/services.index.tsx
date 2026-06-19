import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { SERVICES } from "@/lib/services-content";

const PAGE_URL = `${SITE.url}/services`;
const TITLE = `שירותי פדיקור טיפולי | ${SITE.brand}`;
const DESCRIPTION =
  "כל שירותי הפדיקור הטיפולי של ענבר פרחי — יבלות, פטרת, ציפורן חודרנית, אוניכוליזיס, סדקים, סוכרת וספורטאים. תוכן מבוסס מקורות קליניים סמכותיים.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "בית", item: SITE.url + "/" },
            { "@type": "ListItem", position: 2, name: "שירותים", item: PAGE_URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "שירותי פדיקור טיפולי",
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE.url}/services/${s.slug}`,
            name: s.title,
          })),
        }),
      },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="bg-background pb-8 pt-4">
          <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "שירותים" }]} />
          <div className="mx-auto max-w-[1180px] px-6 py-16">
            <p className="kicker mb-4">קליניקה לפדיקור טיפולי</p>
            <h1 className="display max-w-3xl text-5xl text-ink md:text-6xl lg:text-7xl">
              שירותים <span className="display-italic text-primary-deep">לכל כף רגל</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              לכל טיפול יש עמוד ייעודי עם רקע קליני, פרוטוקול הטיפול בקליניקה, המלצות מניעה ומקורות חיצוניים סמכותיים — משרד הבריאות, NHS, CDC, Mayo Clinic, AAD, IDF ו-APMA.
            </p>
          </div>
        </section>
        <section className="bg-background pb-24">
          <div className="mx-auto grid max-w-[1180px] gap-px overflow-hidden rounded-3xl border border-border bg-border px-0 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative flex flex-col gap-4 bg-surface p-10 transition-colors hover:bg-surface-warm"
              >
                <div className="flex items-center justify-between">
                  <span className="display text-5xl text-copper">0{i + 1}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">טיפול</span>
                </div>
                <h2 className="display text-3xl text-ink">{s.title}</h2>
                <p className="text-base leading-relaxed text-ink-soft">{s.subtitle}</p>
                <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary-deep">קראו עוד ←</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="bg-surface-warm py-20">
          <div className="mx-auto max-w-[900px] px-6 text-center">
            <p className="kicker mb-4">לא בטוחים?</p>
            <h2 className="display text-4xl text-ink md:text-5xl">
              נשמע יחד מה <span className="display-italic text-primary-deep">הכי מתאים לכם</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-ink-soft">תתקשרו או תשלחו וואטסאפ — אבחן את המצב ואסביר את האפשרויות.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-elegant)] hover:bg-primary-deep">וואטסאפ</a>
              <a href={SITE.telUrl} className="rounded-full border border-ink/15 bg-surface px-7 py-4 text-sm font-bold text-ink hover:border-primary hover:text-primary">{SITE.phoneDisplay}</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}