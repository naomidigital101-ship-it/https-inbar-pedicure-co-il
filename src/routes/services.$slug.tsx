import { useEffect, useMemo, useState } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { type ServicePage } from "@/lib/services-content";
import { getService, listServices, type ServiceCard } from "@/lib/cms.functions";
import { useSite } from "@/lib/use-site";
import { OnycholysisVisuals } from "@/components/services/OnycholysisVisuals";
import { SERVICE_HERO } from "@/components/services/service-images";
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
  SOFT,
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
  const hero = SERVICE_HERO[s.slug];

  /*
   * ניווט פנימי דביק: עמודי הטיפול ארוכים, והריל מראה איפה נמצאים
   * ומה עוד נשאר. הפס העליון מוסיף את אותה תחושה גם במובייל, שם
   * הריל מוסתר.
   */
  const railItems = useMemo(
    () => [
      ...s.sections.map((sec, i) => ({ id: `svc-sec-${i}`, label: sec.heading })),
      ...(s.redFlags.length ? [{ id: "svc-red-flags", label: "מתי לפנות מיד" }] : []),
      ...(s.faqs.length ? [{ id: "svc-faq", label: "שאלות נפוצות" }] : []),
    ],
    [s],
  );

  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");

  /*
   * גם פס ההתקדמות וגם סימון המקטע הפעיל מחושבים מאותו מאזין גלילה.
   * חישוב לפי מיקום עדיף כאן על IntersectionObserver: הוא דטרמיניסטי,
   * לא תלוי בסף חשיפה, והמקטע ה"פעיל" הוא תמיד האחרון שעבר את קו
   * הניווט הדביק — גם כשמקטע ארוך ממלא את כל המסך.
   */
  useEffect(() => {
    const NAV_OFFSET = 160;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);

      let current = "";
      for (const item of railItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= NAV_OFFSET) current = item.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [railItems]);

  const facts = [
    ...(priceVisible && priceText ? [{ label: "מחיר", value: priceText, gold: true }] : []),
    ...s.quickFacts.map((f) => ({ ...f, gold: false })),
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <ServicesStyles />
      <div
        className="svc-progress"
        style={{ width: `${Math.round(progress * 100)}%` }}
        aria-hidden
      />
      <SiteHeader />
      <main id="main-content" className="svc-scope flex-1">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: "שירותים", href: "/services" },
            { label: s.navLabel },
          ]}
        />

        {/* Hero — הקלוז-אפ הקליני של המצב לצד הטקסט */}
        <header className="svc-hero">
          <div className="svc-hero-text">
            <DisplayEyebrow size={13} tracking={0.4}>
              Clinical treatment
            </DisplayEyebrow>
            <SectionLabel size={11.5} style={{ marginTop: "12px" }}>
              פדיקור טיפולי · {site.city}
            </SectionLabel>
            <h1
              style={{
                ...headingStyle("clamp(28px, 3.6vw, 40px)"),
                lineHeight: 1.35,
                margin: "20px 0 16px",
              }}
            >
              {s.title}
            </h1>
            <p style={{ ...subheadingStyle("18.5px"), lineHeight: 1.9, margin: "0 0 38px" }}>
              {s.subtitle}
            </p>
            <div style={{ display: "flex", gap: "26px", flexWrap: "wrap", alignItems: "center" }}>
              <a
                className="svc-btn-solid"
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener nofollow"
                style={btnSolid}
              >
                לתיאום אבחון
              </a>
              <a className="svc-text-link" href={site.telUrl} style={btnTextLink}>
                {site.phoneDisplay} ←
              </a>
            </div>
          </div>
          <div className="svc-hero-media">
            {hero ? (
              <img src={hero.src} alt={hero.alt} width={1000} height={1000} loading="eager" />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DisplayEyebrow size={13} color={TAUPE}>
                  Inbar Farhi
                </DisplayEyebrow>
              </div>
            )}
          </div>
        </header>

        {/* עובדות מהירות — פס אחד לרוחב, מתחת לקיפול הראשון */}
        {facts.length > 0 && (
          <section
            className="svc-facts"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(facts.length, 5)},1fr)`,
              gap: "1px",
              background: HAIRLINE,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {facts.map((f) => (
              <div
                key={f.label}
                style={{
                  background: f.gold ? CREAM : "#FFFFFF",
                  padding: "30px 20px",
                  textAlign: "center",
                }}
              >
                <SectionLabel size={10} color={f.gold ? GOLD : SOFT}>
                  {f.label}
                </SectionLabel>
                <p
                  style={{
                    fontSize: "14.5px",
                    fontWeight: 600,
                    color: INK,
                    margin: "10px 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  {f.value}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* בקצרה — התשובה בשלוש שורות, לפני שנכנסים לעומק */}
        <section style={{ background: CREAM, padding: "70px 6%" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
            <DisplayEyebrow size={13} color={TAUPE}>
              In short
            </DisplayEyebrow>
            <p
              style={{
                fontWeight: 300,
                fontSize: "clamp(17px, 2vw, 20px)",
                lineHeight: 1.95,
                color: INK,
                margin: "24px 0 0",
                textAlign: "right",
              }}
            >
              {s.tldr}
            </p>
          </div>
        </section>

        {/* גוף העמוד: תוכן + ריל דביק */}
        <section style={{ background: "#FFFFFF", padding: "80px 6% 40px" }}>
          <div className="svc-body-grid">
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 300,
                  fontSize: "17.5px",
                  lineHeight: 2.05,
                  color: INK,
                  margin: "0 0 20px",
                }}
              >
                {s.intro}
              </p>

              {s.slug === "onycholysis" && <OnycholysisVisuals />}

              {s.sections.map((sec, i) => (
                <article
                  key={i}
                  id={`svc-sec-${i}`}
                  style={{ borderTop: `1px solid ${HAIRLINE}`, padding: "52px 0 8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "20px",
                      marginBottom: "18px",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontFamily: BODONI,
                        fontSize: "22px",
                        fontWeight: 400,
                        color: TAUPE,
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 style={{ ...headingStyle("clamp(20px, 2.4vw, 24px)"), lineHeight: 1.5 }}>
                      {sec.heading}
                    </h2>
                  </div>

                  {sec.body && (
                    <p
                      style={{
                        fontWeight: 300,
                        fontSize: "16.5px",
                        lineHeight: 2.05,
                        color: MUTED,
                        margin: "0 0 22px",
                      }}
                    >
                      {sec.body}
                    </p>
                  )}

                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul style={{ listStyle: "none", margin: "0 0 22px", padding: 0 }}>
                      {sec.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "14px 1fr",
                            gap: "16px",
                            alignItems: "baseline",
                            padding: "13px 0",
                            borderBottom: `1px solid ${HAIRLINE}`,
                          }}
                        >
                          <Dash />
                          <span
                            style={{
                              fontWeight: 300,
                              fontSize: "16px",
                              lineHeight: 1.95,
                              color: MUTED,
                            }}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.table && (
                    <div style={{ overflowX: "auto", margin: "0 0 22px" }}>
                      <table className="svc-table">
                        <thead>
                          <tr>
                            {sec.table.headers.map((h) => (
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((row, ri) => (
                            <tr key={ri}>
                              {row.map((cell, ci) => (
                                <td
                                  key={ci}
                                  style={ci === 0 ? { color: INK, fontWeight: 400 } : undefined}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {sec.fromClinic && (
                    <figure
                      style={{
                        background: CREAM,
                        borderInlineStart: `2px solid ${GREEN}`,
                        padding: "28px 32px",
                        margin: "8px 0 0",
                      }}
                    >
                      <SectionLabel size={10.5} color={GREEN}>
                        מהקליניקה שלי
                      </SectionLabel>
                      <blockquote
                        style={{
                          fontWeight: 300,
                          fontSize: "16px",
                          lineHeight: 2,
                          color: INK,
                          margin: "12px 0 0",
                        }}
                      >
                        {sec.fromClinic}
                      </blockquote>
                    </figure>
                  )}
                </article>
              ))}
            </div>

            <aside className="svc-rail" aria-label="ניווט בתוך העמוד">
              <DisplayEyebrow size={11} color={TAUPE}>
                On this page
              </DisplayEyebrow>
              <nav style={{ margin: "18px 0 32px", borderTop: `1px solid ${HAIRLINE}` }}>
                {railItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`svc-rail-link${activeId === item.id ? " is-active" : ""}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div style={{ border: `1px solid ${HAIRLINE}`, padding: "26px 22px" }}>
                <SectionLabel size={10.5} color={GREEN}>
                  לתיאום אבחון
                </SectionLabel>
                <p
                  style={{
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: 1.9,
                    color: MUTED,
                    margin: "12px 0 20px",
                  }}
                >
                  {site.city}, {site.region}
                  <br />
                  {site.hoursDisplay}
                </p>
                <a
                  className="svc-btn-solid"
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener nofollow"
                  style={{ ...btnSolid, display: "block", padding: "14px 10px", fontSize: 13 }}
                >
                  וואטסאפ
                </a>
                <a
                  className="svc-text-link"
                  href={site.telUrl}
                  style={{ ...btnTextLink, marginTop: 18, fontSize: 13.5 }}
                >
                  {site.phoneDisplay} ←
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* מתי לפנות מיד */}
        {s.redFlags.length > 0 && (
          <section
            id="svc-red-flags"
            style={{
              background: CREAM,
              padding: "80px 6%",
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <div style={{ maxWidth: "820px", margin: "0 auto" }}>
              <DisplayEyebrow size={13} color={ALERT}>
                Red flags
              </DisplayEyebrow>
              <h2 style={{ ...headingStyle("24px"), margin: "16px 0 8px" }}>מתי לפנות מיד לרופא</h2>
              <p style={{ ...subheadingStyle("15.5px"), margin: "0 0 30px" }}>
                המצבים האלה לא ממתינים לתור לפדיקור טיפולי.
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {s.redFlags.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "14px 1fr",
                      gap: "16px",
                      alignItems: "baseline",
                      padding: "16px 0",
                      borderTop: `1px solid ${HAIRLINE}`,
                    }}
                  >
                    <Dash color={ALERT} />
                    <span
                      style={{ fontWeight: 300, fontSize: "16px", lineHeight: 1.95, color: INK }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* שאלות נפוצות */}
        {s.faqs.length > 0 && (
          <section id="svc-faq" style={{ background: "#FFFFFF", padding: "100px 6%" }}>
            <div style={{ maxWidth: "780px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <DisplayEyebrow size={13} color={TAUPE}>
                  FAQ
                </DisplayEyebrow>
                <h2 style={{ ...headingStyle("26px"), marginTop: "16px" }}>שאלות נפוצות</h2>
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
                        fontSize: "17px",
                        fontWeight: 400,
                        color: INK,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {f.q}
                      <span
                        aria-hidden
                        style={{
                          fontFamily: BODONI,
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
                        fontSize: "15.5px",
                        lineHeight: 2.05,
                        color: MUTED,
                        margin: "18px 0 0",
                        maxWidth: "640px",
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

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

      {/* במובייל הריל הדביק מוסתר, אז ה-CTA עובר לסרגל תחתון קבוע */}
      <div className="svc-mobile-cta">
        <a
          className="svc-btn-solid"
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener nofollow"
          style={{ ...btnSolid, flex: 1, padding: "14px 10px", fontSize: 13 }}
        >
          לתיאום אבחון
        </a>
        <a
          className="svc-text-link"
          href={site.telUrl}
          aria-label={`חיוג ל${site.phoneDisplay}`}
          style={{ ...btnTextLink, fontSize: 13, whiteSpace: "nowrap" }}
        >
          חיוג
        </a>
      </div>

      <SiteFooter />
    </div>
  );
}
