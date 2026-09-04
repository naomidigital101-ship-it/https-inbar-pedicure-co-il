import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { listServices, type ServiceCard } from "@/lib/cms.functions";
import { useSite } from "@/lib/use-site";
import { DisplayEyebrow, SectionLabel, ServicesStyles } from "@/components/services/service-ui";
import {
  BODONI,
  CREAM,
  FONTS_STYLESHEET,
  GREEN,
  HAIRLINE,
  MUTED,
  TAUPE,
  btnOutline,
  btnSolid,
  headingStyle,
  subheadingStyle,
} from "@/components/services/service-tokens";

const PAGE_URL = `${SITE.url}/services`;
const TITLE = `שירותי פדיקור טיפולי | ${SITE.brand}`;
const DESCRIPTION =
  "כל שירותי הפדיקור הטיפולי של ענבר פרחי — יבלות, פטרת, ציפורן חודרנית, אוניכוליזיס, סדקים, סוכרת וספורטאים.";

export const Route = createFileRoute("/services/")({
  loader: async () => {
    const { services } = await listServices();
    return { services };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "stylesheet", href: FONTS_STYLESHEET },
    ],
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
          itemListElement: (loaderData?.services ?? []).map((s, i) => ({
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
  const { services } = Route.useLoaderData() as { services: ServiceCard[] };
  const site = useSite();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <ServicesStyles />
      <SiteHeader />
      <main id="main-content" className="svc-scope flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "שירותים" }]} />

        {/* Hero — כותרת מקטע בסגנון דף הבית */}
        <section style={{ background: "#FFFFFF", padding: "100px 6% 76px", textAlign: "center" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <DisplayEyebrow size={15}>Services</DisplayEyebrow>
            <h1
              style={{
                ...headingStyle("clamp(30px, 4.4vw, 40px)"),
                margin: "22px 0 14px",
              }}
            >
              שירותים לכל כף רגל
            </h1>
            <p style={{ ...subheadingStyle("19px"), lineHeight: 1.85 }}>
              לכל טיפול יש עמוד ייעודי עם רקע קליני, פרוטוקול הטיפול בקליניקה, המלצות מניעה ותשובות
              לשאלות שחוזרות אצל מטופלים.
            </p>
          </div>
        </section>

        {/* רשימת הטיפולים — מלבנים המופרדים ב-hairline בלבד */}
        <section style={{ background: "#FFFFFF", padding: "0 6% 110px" }}>
          <div
            className="svc-grid-2"
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "1px",
              background: HAIRLINE,
              border: `1px solid ${HAIRLINE}`,
            }}
          >
            {services.map((s, i) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="svc-card"
                style={{
                  background: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  padding: "46px 40px",
                  transition: "background 0.25s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: BODONI,
                      fontWeight: 400,
                      fontSize: "26px",
                      color: TAUPE,
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <SectionLabel size={11}>טיפול</SectionLabel>
                </div>
                <h2 style={headingStyle("20px")}>{s.title}</h2>
                <p style={{ ...subheadingStyle("15px", "#6E6E6E"), lineHeight: 1.95, flex: 1 }}>
                  {s.subtitle}
                </p>
                <span
                  style={{
                    alignSelf: "flex-start",
                    marginTop: "8px",
                    fontSize: "13px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    color: GREEN,
                    borderBottom: `1px solid ${GREEN}`,
                    paddingBottom: "3px",
                  }}
                >
                  קראו עוד ←
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            background: CREAM,
            padding: "110px 6%",
            textAlign: "center",
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <DisplayEyebrow size={14} color={TAUPE}>
              Get in touch
            </DisplayEyebrow>
            <h2 style={{ ...headingStyle("28px"), margin: "22px 0 10px" }}>
              נשמע יחד מה הכי מתאים לכם
            </h2>
            <p
              style={{
                ...subheadingStyle("16px", MUTED),
                lineHeight: 2.1,
                margin: "0 auto 46px",
                maxWidth: "520px",
              }}
            >
              תתקשרו או תשלחו וואטסאפ — אבחן את המצב ואסביר את האפשרויות.
            </p>
            <div
              style={{
                display: "flex",
                gap: "26px",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <a
                className="svc-btn-solid"
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener nofollow"
                style={btnSolid}
              >
                וואטסאפ
              </a>
              <a className="svc-btn-outline" href={site.telUrl} style={btnOutline}>
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
