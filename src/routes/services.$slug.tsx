import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { type ServicePage } from "@/lib/services-content";
import { getService, listServices, type ServiceCard } from "@/lib/cms.functions";
import { useSite } from "@/lib/use-site";
import { OnycholysisVisuals } from "@/components/services/OnycholysisVisuals";
import {
  Dash,
  DisplayEyebrow,
  SectionLabel,
  ServicesStyles,
} from "@/components/services/service-ui";
import {
  ALERT,
  BODONI,
  CREAM,
  FONTS_STYLESHEET,
  GOLD,
  GREEN,
  GREEN_DARK,
  HAIRLINE,
  INK,
  MUTED,
  ON_DARK_BODY,
  ON_DARK_LABEL,
  TAUPE,
  btnSolid,
  btnTextLink,
  headingStyle,
  subheadingStyle,
} from "@/components/services/service-tokens";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    // התוכן מגיע ממערכת הניהול; אם העמוד עדיין לא יובא לשם,
    // getService מחזיר את התוכן שבקוד כדי שהעמוד לא ייפגע.
    const [detail, all] = await Promise.all([
      getService({ data: { slug: params.slug } }),
      listServices().catch(() => ({ services: [] as ServiceCard[] })),
    ]);
    if (!detail) throw notFound();
    return { ...detail, related: all.services.filter((x) => x.slug !== params.slug).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    const seo = loaderData?.seo;
    if (!s || !seo) return {};
    const url = seo.canonical || `${SITE.url}/services/${s.slug}`;
    return {
      meta: [
        { title: seo.metaTitle },
        { name: "description", content: seo.metaDescription },
        { property: "og:title", content: seo.metaTitle },
        { property: "og:description", content: seo.metaDescription },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(seo.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
        ...(seo.noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "stylesheet", href: FONTS_STYLESHEET },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            inLanguage: "he-IL",
            url,
            name: s.title,
            description: seo.metaDescription,
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
            description: seo.metaDescription,
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
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <ServicesStyles />
      <SiteHeader />
      <main className="svc-scope flex-1" style={{ padding: "110px 6%", textAlign: "center" }}>
        <DisplayEyebrow size={14}>Not found</DisplayEyebrow>
        <h1 style={{ ...headingStyle("28px"), margin: "22px 0 28px" }}>השירות לא נמצא</h1>
        <Link to="/services" className="svc-text-link" style={btnTextLink}>
          חזרה לכל השירותים
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <ServicesStyles />
      <SiteHeader />
      <main className="svc-scope flex-1" style={{ padding: "110px 6%", textAlign: "center" }}>
        <DisplayEyebrow size={14}>Error</DisplayEyebrow>
        <h1 style={{ ...headingStyle("26px"), margin: "22px 0 12px" }}>אירעה שגיאה</h1>
        <p style={{ ...subheadingStyle("15px"), margin: "0 0 32px" }}>{error.message}</p>
        <button type="button" onClick={reset} className="svc-btn-solid" style={btnSolid}>
          נסה שוב
        </button>
      </main>
      <SiteFooter />
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const {
    service: s,
    related,
    priceText,
    priceVisible,
  } = Route.useLoaderData() as {
    service: ServicePage;
    related: ServiceCard[];
    priceText: string | null;
    priceVisible: boolean;
  };
  const site = useSite();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <ServicesStyles />
      <SiteHeader />
      <main id="main-content" className="svc-scope flex-1">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: "שירותים", href: "/services" },
            { label: s.navLabel },
          ]}
        />

        {/* Hero */}
        <section
          style={{
            background: "#FFFFFF",
            padding: "96px 6% 80px",
            textAlign: "center",
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ maxWidth: "780px", margin: "0 auto" }}>
            <DisplayEyebrow size={14} tracking={0.4}>
              Clinical treatment
            </DisplayEyebrow>
            <SectionLabel size={12} style={{ marginTop: "12px" }}>
              פדיקור טיפולי · {site.city}
            </SectionLabel>
            <h1
              style={{
                ...headingStyle("clamp(30px, 4.6vw, 42px)"),
                lineHeight: 1.35,
                margin: "20px 0 16px",
              }}
            >
              {s.title}
            </h1>
            <p style={{ ...subheadingStyle("19px"), lineHeight: 1.85, margin: "0 0 42px" }}>
              {s.subtitle}
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
                קביעת תור בוואטסאפ
              </a>
              <a className="svc-text-link" href={site.telUrl} style={btnTextLink}>
                {site.phoneDisplay} ←
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section style={{ background: "#FFFFFF", padding: "80px 6% 0" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            <div
              style={{
                background: CREAM,
                borderInlineStart: `1px solid ${GREEN}`,
                padding: "30px 34px",
                marginBottom: "44px",
              }}
            >
              <SectionLabel size={11}>בקצרה</SectionLabel>
              <p
                style={{
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: 2,
                  color: INK,
                  margin: "12px 0 0",
                }}
              >
                {s.tldr}
              </p>
            </div>

            <div
              className="svc-facts"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "1px",
                background: HAIRLINE,
                border: `1px solid ${HAIRLINE}`,
                marginBottom: "44px",
              }}
            >
              {/* מחיר מוצג רק אם ענבר הפעילה אותו לטיפול הזה */}
              {priceVisible && priceText && (
                <div style={{ background: CREAM, padding: "24px 16px", textAlign: "center" }}>
                  <SectionLabel size={10} color={GOLD}>
                    מחיר
                  </SectionLabel>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: INK,
                      margin: "10px 0 0",
                    }}
                  >
                    {priceText}
                  </p>
                </div>
              )}
              {s.quickFacts.map((f) => (
                <div
                  key={f.label}
                  style={{ background: "#FFFFFF", padding: "24px 16px", textAlign: "center" }}
                >
                  <SectionLabel size={10}>{f.label}</SectionLabel>
                  <p
                    style={{
                      fontSize: "14.5px",
                      fontWeight: 600,
                      color: INK,
                      margin: "10px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{ fontWeight: 300, fontSize: "17px", lineHeight: 2.05, color: INK, margin: 0 }}
            >
              {s.intro}
            </p>
          </div>
        </section>

        {/* Sections */}
        <section style={{ background: "#FFFFFF", padding: "60px 6% 20px" }}>
          {s.slug === "onycholysis" && <OnycholysisVisuals />}
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            {s.sections.map((sec, i) => (
              <article
                key={i}
                style={{
                  borderTop: `1px solid ${HAIRLINE}`,
                  padding: "48px 0 8px",
                }}
              >
                <h2 style={{ ...headingStyle("clamp(21px, 2.6vw, 26px)"), marginBottom: "20px" }}>
                  {sec.heading}
                </h2>
                {sec.body && (
                  <p
                    style={{
                      fontWeight: 300,
                      fontSize: "16px",
                      lineHeight: 2.05,
                      color: MUTED,
                      margin: "0 0 20px",
                    }}
                  >
                    {sec.body}
                  </p>
                )}
                {sec.bullets && (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {sec.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "14px",
                          fontWeight: 300,
                          fontSize: "16px",
                          lineHeight: 1.95,
                          color: MUTED,
                          padding: "6px 0",
                        }}
                      >
                        <Dash />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.table && (
                  <div style={{ marginTop: "26px", overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse", fontSize: "14.5px" }}
                    >
                      <thead>
                        <tr style={{ background: CREAM }}>
                          {sec.table.headers.map((h) => (
                            <th
                              key={h}
                              style={{
                                border: `1px solid ${HAIRLINE}`,
                                padding: "14px 16px",
                                textAlign: "right",
                                color: INK,
                                fontWeight: 600,
                                letterSpacing: "0.04em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri} style={{ background: "#FFFFFF" }}>
                            {row.map((c, ci) => (
                              <td
                                key={ci}
                                style={{
                                  border: `1px solid ${HAIRLINE}`,
                                  padding: "14px 16px",
                                  color: MUTED,
                                  fontWeight: 300,
                                  lineHeight: 1.8,
                                }}
                              >
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
                    style={{
                      marginTop: "28px",
                      background: CREAM,
                      borderInlineStart: `1px solid ${GOLD}`,
                      padding: "26px 30px",
                    }}
                  >
                    <SectionLabel size={11} color={GOLD}>
                      מהקליניקה שלי
                    </SectionLabel>
                    <p
                      style={{
                        fontWeight: 300,
                        fontSize: "15px",
                        lineHeight: 2,
                        color: INK,
                        margin: "12px 0 0",
                      }}
                    >
                      {sec.fromClinic}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Red flags */}
        <section
          style={{
            background: CREAM,
            padding: "90px 6%",
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
            <SectionLabel size={12} color={ALERT}>
              אזהרה
            </SectionLabel>
            <h2 style={{ ...headingStyle("clamp(22px, 2.8vw, 28px)"), margin: "18px 0 34px" }}>
              מתי לפנות מיידית לרופא
            </h2>
            <ul
              style={{
                margin: "0 auto",
                padding: 0,
                listStyle: "none",
                maxWidth: "620px",
                textAlign: "right",
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              {s.redFlags.map((r) => (
                <li
                  key={r}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    fontWeight: 300,
                    fontSize: "16px",
                    lineHeight: 1.95,
                    color: INK,
                    padding: "16px 2px",
                    borderBottom: `1px solid ${HAIRLINE}`,
                  }}
                >
                  <Dash color={ALERT} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: "#FFFFFF", padding: "110px 6%" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <DisplayEyebrow size={15}>FAQ</DisplayEyebrow>
              <h2 style={{ ...headingStyle("28px"), marginTop: "16px" }}>שאלות נפוצות</h2>
            </div>
            <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
              {s.faqs.map((f) => (
                <details
                  key={f.q}
                  style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "26px 4px" }}
                >
                  <summary
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      cursor: "pointer",
                      listStyle: "none",
                      fontWeight: 400,
                      fontSize: "17px",
                      letterSpacing: "0.03em",
                      color: INK,
                    }}
                  >
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      style={{
                        fontFamily: BODONI,
                        fontWeight: 400,
                        fontSize: "24px",
                        color: TAUPE,
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    style={{
                      fontWeight: 300,
                      fontSize: "15px",
                      lineHeight: 2.05,
                      color: "#6E6E6E",
                      margin: "18px 0 0",
                      maxWidth: "660px",
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ background: "#FFFFFF", padding: "0 6% 110px" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "44px" }}>
                <DisplayEyebrow size={14} color={TAUPE}>
                  More treatments
                </DisplayEyebrow>
                <h2 style={{ ...headingStyle("26px"), marginTop: "16px" }}>שירותים נוספים</h2>
              </div>
              <div
                className="svc-grid-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "1px",
                  background: HAIRLINE,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/services/$slug"
                    params={{ slug: r.slug }}
                    className="svc-card"
                    style={{
                      background: "#FFFFFF",
                      display: "block",
                      padding: "36px 30px",
                      transition: "background 0.25s",
                    }}
                  >
                    <h3 style={{ ...headingStyle("17px"), fontWeight: 600, marginBottom: "10px" }}>
                      {r.title}
                    </h3>
                    <p style={{ ...subheadingStyle("14.5px", "#6E6E6E"), lineHeight: 1.9 }}>
                      {r.subtitle}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA — הרגע הכהה היחיד בעמוד, כמו מקטע CONTACT בדף הבית */}
        <section style={{ background: GREEN_DARK, padding: "120px 6%" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
            <DisplayEyebrow size={14} tracking={0.4} color={ON_DARK_LABEL}>
              Contact
            </DisplayEyebrow>
            <h2
              style={{
                ...headingStyle("clamp(22px, 3vw, 28px)", "#FFFFFF"),
                margin: "24px 0 16px",
              }}
            >
              מוכנים לחזור ללכת בלי כאב?
            </h2>
            <p
              style={{
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 2.1,
                color: ON_DARK_BODY,
                margin: "0 0 50px",
              }}
            >
              {site.hoursDisplay} · {site.city}
            </p>
            <div style={{ display: "grid", gap: "24px", textAlign: "right" }}>
              <a
                className="svc-contact-link"
                href={site.telUrl}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "18px",
                  color: "#FFFFFF",
                  borderBottom: "1px solid rgba(255,255,255,0.34)",
                  paddingBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.3em",
                    color: ON_DARK_LABEL,
                    minWidth: "78px",
                  }}
                >
                  טלפון
                </span>
                <span style={{ fontWeight: 300, fontSize: "22px", letterSpacing: "0.06em" }}>
                  {site.phoneDisplay}
                </span>
              </a>
              <a
                className="svc-contact-link"
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener nofollow"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "18px",
                  color: "#FFFFFF",
                  borderBottom: "1px solid rgba(255,255,255,0.34)",
                  paddingBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.3em",
                    color: ON_DARK_LABEL,
                    minWidth: "78px",
                  }}
                >
                  וואטסאפ
                </span>
                <span style={{ fontWeight: 300, fontSize: "19px" }}>קביעת תור ישירות עם ענבר</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
