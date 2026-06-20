import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";
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
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "שירותים" }]} />
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
        >
          <BrandHeroBackdrop label="SERVICES · 00" />
          <div className="relative mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
            <BrandEyebrow withRule>קליניקה לפדיקור טיפולי</BrandEyebrow>
            <h1
              className="mt-5 max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 5.6vw, 4.4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--green-700)",
              }}
            >
              שירותים לכל כף רגל
            </h1>
            <p className="mt-6 max-w-2xl" style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.7 }}>
              לכל טיפול יש עמוד ייעודי עם רקע קליני, פרוטוקול הטיפול בקליניקה, המלצות מניעה ומקורות חיצוניים סמכותיים — משרד הבריאות, NHS, CDC, Mayo Clinic, AAD, IDF ו-APMA.
            </p>
          </div>
        </section>
        <section className="pb-24 pt-16" style={{ background: "var(--paper)" }}>
          <div
            className="mx-auto grid max-w-[1320px] gap-px overflow-hidden md:grid-cols-2"
            style={{ background: "var(--stone-100)", border: "1px solid var(--stone-100)", borderRadius: 20, marginInline: "1.5rem" }}
          >
            {SERVICES.map((s, i) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative flex flex-col gap-4 p-10 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "2.4rem", color: "var(--green-700)", lineHeight: 1 }}>
                    0{i + 1}
                  </span>
                  <BrandEyebrow style={{ fontSize: 11 }}>טיפול</BrandEyebrow>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontSize: "1.6rem",
                    letterSpacing: "-0.01em",
                    color: "var(--ink-900)",
                  }}
                >
                  {s.title}
                </h2>
                <p style={{ color: "var(--ink-600)", fontSize: "0.98rem", lineHeight: 1.65 }}>{s.subtitle}</p>
                <span className="mt-2 inline-flex items-center gap-2" style={{ color: "var(--green-700)", fontSize: 13, fontWeight: 600 }}>
                  קראו עוד ←
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="py-20" style={{ background: "var(--green-50)", borderTop: "1px solid var(--green-100)" }}>
          <div className="mx-auto max-w-[900px] px-6 text-center">
            <BrandEyebrow>לא בטוחים?</BrandEyebrow>
            <h2
              className="mt-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                letterSpacing: "-0.02em",
                color: "var(--ink-900)",
              }}
            >
              נשמע יחד מה הכי מתאים לכם
            </h2>
            <p className="mx-auto mt-5 max-w-lg" style={{ color: "var(--ink-600)", lineHeight: 1.7 }}>
              תתקשרו או תשלחו וואטסאפ — אבחן את המצב ואסביר את האפשרויות.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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