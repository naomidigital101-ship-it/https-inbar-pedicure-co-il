import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";
import { listReviews } from "@/lib/cms.functions";
import type { ArticleCard } from "@/lib/article-cards";
import {
  DESIGN_ARTICLES,
  DESIGN_FAQS,
  DESIGN_PILLARS,
  DESIGN_SERVICES,
  DESIGN_TESTIMONIALS,
  DESIGN_TRACKS,
} from "@/lib/home-design";
import heroAsset from "@/assets/inbar-hero-clinical.webp.asset.json";

const heroImage = heroAsset.url;
import logoImage from "@/assets/inbar-logo-farhi.png";

/*
 * דף הבית מיושם אחד לאחד מקובץ העיצוב "Inbar Homepage.dc.html":
 * הסגנונות האינליין שם הם מקור האמת לערכים (צבעים, גדלים, ריווח, hairlines),
 * ולכן הם נשמרים כאן כמות שהם ולא מתורגמים למחלקות Tailwind.
 */

const WA = "https://wa.me/972506668595";
const BODONI = "'Bodoni Moda',serif";

const HOME_CSS = `
.ip-page { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
.ip-page a { color:#141414; text-decoration:none; transition:color 0.2s, background 0.2s, border-color 0.2s, opacity 0.2s; }
.ip-page a:hover { color:#0E3B2E; }
.ip-page input, .ip-page select, .ip-page button, .ip-page textarea { font-family:'Assistant',sans-serif; }
.ip-page details summary::-webkit-details-marker { display:none; }

/*
 * styles.css כופה על h1–h4 את פונט הכותרות של האתר עם important בתוך
 * שכבת base. הצהרה important בשכבה גוברת על הצהרה חסרת-שכבה, ולכן
 * העקיפה חייבת להיכתב לתוך אותה שכבה — שם מכריעה הספציפיות.
 */
@layer base {
  .ip-page :is(h1,h2,h3,h4) { font-family:'Assistant',sans-serif !important; }
}
.ip-page :is(h1,h2,h3,h4) { letter-spacing:normal; line-height:normal; font-weight:400; }
.ip-page p { font-family:'Assistant',sans-serif; }

.ip-hero-h1 { text-wrap:balance; }

.ip-wa-btn:hover { background:#0E3B2E; border-color:#0E3B2E; color:#FFFFFF; }
.ip-btn-solid:hover { background:#141414; color:#FFFFFF; }
.ip-btn-outline:hover { background:#0E3B2E; border-color:#0E3B2E; color:#FFFFFF; }
.ip-circle:hover .ip-circle-ring { border-color:#0E3B2E; background:#F5F7F4; }
.ip-contact-link:hover { color:#FFFFFF; border-color:#FFFFFF; }
.ip-input:focus { border-color:#0E3B2E; }

.ip-nav-burger { display:none; }
.ip-nav-panel { display:none; }

@media (max-width: 1100px) {
  .ip-circles-grid { grid-template-columns:repeat(3,1fr) !important; }
  .ip-clinic-grid { grid-template-columns:1fr !important; gap:60px !important; }
  .ip-clinic-aside { position:static !important; }
  .ip-about-grid, .ip-contact-grid { grid-template-columns:1fr !important; gap:60px !important; }
}
@media (max-width: 900px) {
  .ip-nav-links { display:none !important; }
  .ip-nav-burger { display:inline-flex !important; }
  .ip-nav-panel.is-open { display:block !important; }
  /* במובייל אין מקום לכפתור "דברו איתנו" לצד הלוגו והתפריט; הקשר נשאר
     דרך פריטי התפריט ועמוד צור קשר. */
  .ip-nav-cta { display:none !important; }
  .ip-nav-grid { padding:12px 5% !important; }
  .ip-nav-grid > a img { height:64px !important; margin:-6px 0 !important; }
  .ip-academy-grid { grid-template-columns:1fr !important; }
  .ip-academy-img { min-height:420px !important; }
  .ip-pillars-grid, .ip-testi-grid, .ip-journal-grid { grid-template-columns:1fr !important; }
  .ip-pillars-grid > div, .ip-testi-grid > div { border-left:none !important; padding-bottom:48px !important; }
  .ip-hero-overlay { position:static !important; display:block !important; padding:56px 6% !important; }
  .ip-hero-overlay > div { max-width:100% !important; }
}
@media (max-width: 700px) {
  .ip-svc-row { grid-template-columns:74px 1fr auto !important; }
  .ip-svc-row > span:first-child { width:74px !important; height:74px !important; }
  .ip-svc-row > span:nth-child(2) { display:none !important; }
}
@media (max-width: 560px) {
  .ip-nav-grid { padding:10px 4% !important; }
  .ip-nav-burger { padding:8px 11px !important; font-size:12px !important; }
  .ip-nav-grid > a img { height:54px !important; margin:-4px 0 !important; }
  .ip-hero-h1 { font-size:32px !important; }
  .ip-hero-sub { font-size:17px !important; }
  .ip-circles-grid { grid-template-columns:repeat(2,1fr) !important; gap:24px !important; }
  /* מילות התצוגה ב-Bodoni הן מילה אחת שאינה נשברת; בלעדי ההקטנה הן
     מרחיבות את הגריד מעבר לרוחב המסך והתוכן נחתך. */
  .ip-display-xl { font-size:34px !important; }
  .ip-display-lg { font-size:30px !important; }
  .ip-display-md { font-size:26px !important; }
  /* שני שדות זה לצד זה לא נכנסים ברוחב טלפון — הרוחב המינימלי של input
     דוחף את כרטיס הטופס אל מחוץ למסך. במסך צר הם נערמים. */
  .ip-form-card { padding:40px 24px !important; }
  .ip-field-row { flex-direction:column !important; gap:24px !important; }
}
`;

const NAV_LINKS = [
  { label: "טיפולים", href: "/services" },
  { label: "הכשרות", href: "#academy" },
  { label: "השיטה", href: "#method" },
  { label: "מאמרים", href: "/knowledge" },
  { label: "אודות", href: "/about" },
];

const FOOTER_LINKS = [
  { label: "יבלות", href: "/services/corns" },
  { label: "פטרת", href: "/services/fungus" },
  { label: "ציפורן חודרנית", href: "/services/ingrown-nails" },
  { label: "כף רגל סוכרתית", href: "/services/diabetic-feet" },
  { label: "הכשרות", href: "#academy" },
  { label: "יצירת קשר", href: "/contact" },
];

export const Route = createFileRoute("/")({
  loader: async () => {
    const [articles, reviews] = await Promise.all([
      listPublishedAiArticleCards().catch(() => [] as ArticleCard[]),
      listReviews().catch(() => ({ reviews: [], average: null, count: 0 })),
    ]);
    return {
      articles: articles.slice(0, 3),
      reviews: reviews.reviews.slice(0, 3),
      rating: { average: reviews.average, count: reviews.count },
    };
  },
  head: () => ({
    meta: [
      { title: "ענבר פרחי | פדיקור טיפולי בעלי · הכשרות לפדיקוריסטיות" },
      {
        name: "description",
        content:
          "ענבר פרחי — פדיקוריסטית טיפולית ומרצה מובילה לבריאות כף הרגל. קליניקה בעלי לטיפול ביבלות, פטרת, ציפורן חודרנית וכף רגל סוכרתית, והכשרות מקצועיות לפדיקוריסטיות בכל הארץ.",
      },
      {
        name: "keywords",
        content:
          "פדיקור טיפולי עלי, פדיקור טיפולי בנימין, פדיקור טיפולי אריאל, קורס פדיקור רפואי, הכשרת פדיקוריסטיות, ציפורן חודרנית, פטרת ציפורניים, פדיקור לחולי סוכרת, ענבר פרחי",
      },
      { name: "geo.placename", content: "עלי, אזור בנימין" },
      { name: "geo.region", content: "IL" },
      { property: "og:title", content: "ענבר פרחי | פדיקור טיפולי בעלי · הכשרות לפדיקוריסטיות" },
      {
        property: "og:description",
        content:
          "קליניקה טיפולית לכף הרגל בעלי, והכשרות לפדיקוריסטיות בכל הארץ. טיפול ביבלות, פטרת, ציפורן חודרנית וכף רגל סוכרתית.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "he_IL" },
      { property: "og:url", content: SITE.url + "/" },
      { property: "og:image", content: SITE.url + heroImage },
      { name: "twitter:image", content: SITE.url + heroImage },
    ],
    links: [
      { rel: "canonical", href: SITE.url + "/" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: DESIGN_FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
          name: SITE.brand,
          description:
            "קליניקה לפדיקור טיפולי בגישה קלינית בעלי, אזור בנימין, והכשרות מקצועיות לפדיקוריסטיות בכל הארץ.",
          url: SITE.url,
          telephone: SITE.phoneIntl,
          email: SITE.email,
          image: SITE.url + heroImage,
          priceRange: "₪₪",
          address: {
            "@type": "PostalAddress",
            addressLocality: "עלי",
            addressRegion: "אזור בנימין",
            addressCountry: "IL",
          },
          areaServed: [
            { "@type": "City", name: "עלי" },
            { "@type": "City", name: "אריאל" },
            { "@type": "City", name: "שילה" },
            { "@type": "City", name: "עפרה" },
            { "@type": "City", name: "ירושלים" },
            { "@type": "AdministrativeArea", name: "אזור בנימין" },
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "09:00",
              closes: "20:00",
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15.1L2 22l5-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

function HomePage() {
  const { articles, reviews, rating } = Route.useLoaderData();
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * כפתור "שליחה" בעיצוב הוא קישור לוואטסאפ. כדי שמה שהמבקר הקליד
   * לא ילך לאיבוד, הערכים נארזים לתוך גוף ההודעה.
   */
  const [form, setForm] = useState({ name: "", phone: "", email: "", audience: "", concern: "" });
  const formMessage = [
    "שלום, נשמח שתחזרו אלינו",
    form.name && `שם: ${form.name}`,
    form.phone && `טלפון: ${form.phone}`,
    form.email && `אימייל: ${form.email}`,
    form.audience && `סוג הפנייה: ${form.audience}`,
    form.concern && `מה מטריד: ${form.concern}`,
  ]
    .filter(Boolean)
    .join("\n");

  // מאמרים וביקורות מגיעים מהמערכת; תוכן העיצוב משמש כברירת מחדל כשאין נתונים.
  const journal = articles.length
    ? articles.map((a) => ({
        cat: a.category,
        title: a.title,
        desc: a.excerpt,
        href: `/article/${a.slug}`,
      }))
    : DESIGN_ARTICLES.map((a) => ({ ...a }));

  const testimonials = reviews.length
    ? reviews.map((r) => ({ quote: r.body, name: r.author_name }))
    : DESIGN_TESTIMONIALS.map((t) => ({ ...t }));

  const ratingLabel = rating.average ? rating.average.toFixed(1) : "5.0";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS }} />
      <div className="ip-page" style={{ minHeight: "100vh", background: "#FFFFFF" }}>
        {/* Nav — לוגו ממורכז שפורץ את קו ההדר */}
        <nav
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #ECEAE6",
            position: "sticky",
            top: 0,
            zIndex: 60,
          }}
        >
          <div
            className="ip-nav-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              padding: "16px 4%",
              minHeight: "58px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="ip-nav-links"
                style={{
                  display: "flex",
                  gap: "30px",
                  fontWeight: 300,
                  fontSize: "14.5px",
                  letterSpacing: "0.12em",
                }}
              >
                {NAV_LINKS.map((l) => (
                  <a key={l.label} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </div>
              <button
                type="button"
                className="ip-nav-burger"
                aria-label="פתיחת תפריט הניווט"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  alignItems: "center",
                  gap: "10px",
                  background: "transparent",
                  border: "1px solid #ECEAE6",
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontSize: "13px",
                  letterSpacing: "0.14em",
                  fontWeight: 300,
                  color: "#141414",
                }}
              >
                <span aria-hidden style={{ display: "grid", gap: "4px" }}>
                  <span
                    style={{
                      display: "block",
                      width: "16px",
                      height: "1px",
                      background: "#141414",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      width: "16px",
                      height: "1px",
                      background: "#141414",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      width: "16px",
                      height: "1px",
                      background: "#141414",
                    }}
                  />
                </span>
                תפריט
              </button>
            </div>
            <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={logoImage}
                alt="INBAR FARHI — פדיקור טיפולי · הכשרות מקצועיות"
                style={{ height: "96px", display: "block", margin: "-10px 0" }}
              />
            </a>
            <div
              className="ip-nav-cta"
              style={{
                display: "flex",
                gap: "22px",
                justifyContent: "left",
                alignItems: "center",
                fontWeight: 300,
                fontSize: "14.5px",
                letterSpacing: "0.1em",
              }}
            >
              <a
                className="ip-wa-btn"
                href={WA}
                style={{
                  border: "1px solid #141414",
                  padding: "10px 26px",
                  letterSpacing: "0.16em",
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                }}
              >
                <WhatsAppIcon />
                דברו איתנו
              </a>
            </div>
          </div>
          <div
            className={`ip-nav-panel${menuOpen ? " is-open" : ""}`}
            style={{ borderTop: "1px solid #ECEAE6", padding: "6px 4% 18px" }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 2px",
                  borderBottom: "1px solid #ECEAE6",
                  fontWeight: 300,
                  fontSize: "15px",
                  letterSpacing: "0.12em",
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero — התמונה כרקע מלא, גלויה במלואה */}
        <header style={{ position: "relative", background: "#FFFFFF" }}>
          <img
            src={heroImage}
            alt="ענבר פרחי בקליניקה עם מודל אנטומי של כף הרגל"
            width={1870}
            height={841}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div
            className="ip-hero-overlay"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              alignItems: "center",
              direction: "ltr",
            }}
          >
            <div
              style={{
                direction: "rtl",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                width: "100%",
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  fontFamily: BODONI,
                  fontSize: "14px",
                  letterSpacing: "0.4em",
                  color: "#6E6E6E",
                  fontWeight: 400,
                  marginBottom: "26px",
                  marginLeft: "-0.4em",
                }}
              >
                INBAR FARCHI · THE CLINICAL APPROACH
              </div>
              <h1
                className="ip-hero-h1"
                style={{
                  fontWeight: 700,
                  fontSize: "46px",
                  lineHeight: 1.35,
                  margin: "0 0 18px",
                  color: "#141414",
                }}
              >
                הבסיס לבריאות — כף הרגל
              </h1>
              <div
                className="ip-hero-sub"
                style={{
                  fontWeight: 300,
                  fontSize: "20px",
                  color: "#333333",
                  letterSpacing: "0.04em",
                  marginBottom: "40px",
                  lineHeight: 1.75,
                }}
              >
                פדיקור טיפולי בגישה קלינית,
                <br />
                לטיפול נכון בכף הרגל ובמחלותיה
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "26px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <a
                  className="ip-btn-solid"
                  href="#method"
                  style={{
                    background: "#0E3B2E",
                    color: "#FFFFFF",
                    padding: "16px 46px",
                    fontWeight: 400,
                    fontSize: "14.5px",
                    letterSpacing: "0.2em",
                  }}
                >
                  קראו על השיטה
                </a>
                <a
                  href="#academy"
                  style={{
                    fontWeight: 400,
                    fontSize: "14.5px",
                    letterSpacing: "0.14em",
                    borderBottom: "1px solid #141414",
                    paddingBottom: "4px",
                  }}
                >
                  אני פדיקוריסטית ←
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Conditions — עיגולים */}
        <section id="clinic" style={{ padding: "110px 6% 90px", textAlign: "center" }}>
          <div
            style={{
              fontFamily: BODONI,
              fontSize: "15px",
              letterSpacing: "0.5em",
              color: "#8C8C8C",
              fontWeight: 400,
              margin: "0 0 14px",
              marginLeft: "-0.5em",
            }}
          >
            FOOT CONCERNS
          </div>
          <h2 style={{ fontWeight: 700, fontSize: "28px", color: "#141414", margin: "0 0 10px" }}>
            טיפול לפי מצב כף הרגל
          </h2>
          <p
            style={{
              fontSize: "15px",
              letterSpacing: "0.1em",
              color: "#8C8C8C",
              fontWeight: 300,
              margin: "0 0 64px",
            }}
          >
            בחרו את מה שמטריד — ותגיעו לפרוטוקול הטיפול המלא
          </p>
          <div
            className="ip-circles-grid"
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: "34px",
              alignItems: "start",
            }}
          >
            {DESIGN_SERVICES.map((svc) => (
              <a
                key={svc.num}
                className="ip-circle"
                href={svc.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <span
                  className="ip-circle-ring"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    border: "1px solid #DDD9D2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.25s, background 0.25s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: BODONI,
                      fontWeight: 400,
                      fontSize: "28px",
                      color: "#0E3B2E",
                    }}
                  >
                    {svc.num}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "14.5px",
                    letterSpacing: "0.12em",
                    fontWeight: 400,
                    color: "#141414",
                    lineHeight: 1.6,
                  }}
                >
                  {svc.title}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Method — פס ירוק עמוק */}
        <section id="method" style={{ background: "#0C2B23", padding: "130px 6%" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <div
              className="ip-display-xl"
              style={{
                fontFamily: BODONI,
                fontSize: "52px",
                letterSpacing: "0.18em",
                color: "#FFFFFF",
                fontWeight: 400,
                marginBottom: "36px",
                marginLeft: "-0.18em",
                lineHeight: 1.1,
              }}
            >
              THE METHOD
            </div>
            <h2
              style={{
                fontWeight: 700,
                fontSize: "30px",
                lineHeight: 1.5,
                margin: "0 0 8px",
                color: "#FFFFFF",
              }}
            >
              כף הרגל אינה סימפטום מקומי:
            </h2>
            <div
              style={{ fontWeight: 300, fontSize: "24px", color: "#B9C9C0", marginBottom: "36px" }}
            >
              היא מערכת ביולוגית שלמה
            </div>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 2.15,
                color: "#B9C9C0",
                fontWeight: 300,
                maxWidth: "640px",
                margin: "0 auto 80px",
              }}
            >
              יבלת שחוזרת, ציפורן שנכנסת שוב ושוב, עור שנסדק — אינם עומדים בפני עצמם. הם משקפים לחץ
              מכני, הנעלה, תבנית הליכה ומצב בריאותי. לכן האבחון אצל ענבר מתחיל תמיד בשאלה למה — לא
              רק במה.
            </p>
            <div
              className="ip-pillars-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                borderTop: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              {DESIGN_PILLARS.map((p) => (
                <div
                  key={p.num}
                  style={{ padding: "48px 34px 0", borderLeft: "1px solid rgba(255,255,255,0.14)" }}
                >
                  <div
                    style={{
                      fontFamily: BODONI,
                      fontWeight: 400,
                      fontSize: "32px",
                      color: "#7E9A8E",
                      marginBottom: "18px",
                    }}
                  >
                    {p.num}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "16.5px",
                      color: "#FFFFFF",
                      marginBottom: "14px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {p.title}
                  </div>
                  <p
                    style={{
                      fontWeight: 300,
                      fontSize: "14.5px",
                      lineHeight: 2,
                      color: "#B9C9C0",
                      margin: 0,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services list — עריכתי */}
        <section style={{ padding: "110px 6%", maxWidth: "1150px", margin: "0 auto" }}>
          <div
            className="ip-clinic-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "0.8fr 1.2fr",
              gap: "90px",
              alignItems: "start",
            }}
          >
            <div
              className="ip-clinic-aside"
              style={{ position: "sticky", top: "130px", textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: BODONI,
                  fontSize: "14px",
                  letterSpacing: "0.5em",
                  color: "#8C8C8C",
                  fontWeight: 400,
                  marginBottom: "24px",
                  marginLeft: "-0.5em",
                }}
              >
                THE CLINIC
              </div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "32px",
                  lineHeight: 1.45,
                  margin: "0 0 8px",
                  color: "#141414",
                }}
              >
                טיפול קליני,
              </h2>
              <div
                style={{
                  fontWeight: 300,
                  fontSize: "26px",
                  color: "#4E4E4E",
                  marginBottom: "28px",
                }}
              >
                לא קוסמטי
              </div>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 2.1,
                  color: "#4E4E4E",
                  fontWeight: 300,
                  margin: "0 0 40px",
                }}
              >
                כל טיפול מבוסס פרוטוקול מתועד — איכילוב, משרד הבריאות, אגודת אייל. כלים חד־פעמיים
                נפתחים מול המטופל, אוטוקלאב לכל כלי רב־פעמי.
              </p>
              <a
                className="ip-btn-outline"
                href={`${WA}?text=${encodeURIComponent("שלום, נשמח לתאם אבחון")}`}
                style={{
                  border: "1px solid #141414",
                  padding: "14px 40px",
                  fontWeight: 400,
                  fontSize: "13.5px",
                  letterSpacing: "0.2em",
                  display: "inline-block",
                }}
              >
                לתיאום אבחון
              </a>
            </div>
            <div style={{ borderTop: "1px solid #ECEAE6" }}>
              {DESIGN_SERVICES.map((svc) => (
                <a
                  key={svc.num}
                  href={svc.href}
                  className="ip-svc-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 64px 1fr auto",
                    gap: "26px",
                    alignItems: "center",
                    padding: "22px 4px",
                    borderBottom: "1px solid #ECEAE6",
                  }}
                >
                  <span
                    style={{
                      width: "110px",
                      height: "110px",
                      background: "#F2F0EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: "saturate(0.75)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: BODONI,
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        color: "#B9B4AA",
                      }}
                    >
                      {svc.num}
                    </span>
                  </span>
                  <span
                    style={{
                      fontFamily: BODONI,
                      fontWeight: 400,
                      fontSize: "22px",
                      color: "#B9B4AA",
                    }}
                  >
                    {svc.num}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "18px",
                        letterSpacing: "0.04em",
                        color: "#141414",
                      }}
                    >
                      {svc.title}
                    </span>
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: "15px",
                        lineHeight: 1.95,
                        color: "#6E6E6E",
                      }}
                    >
                      {svc.desc}
                    </span>
                  </span>
                  <span style={{ fontWeight: 200, fontSize: "20px", color: "#B9B4AA" }}>←</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Academy — split */}
        <section
          id="academy"
          className="ip-academy-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "stretch",
            borderTop: "1px solid #ECEAE6",
          }}
        >
          <div
            className="ip-academy-img"
            style={{
              position: "relative",
              minHeight: "680px",
              background: "#F7F5F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div
                style={{
                  fontFamily: BODONI,
                  fontSize: "15px",
                  letterSpacing: "0.5em",
                  color: "#B9B4AA",
                  marginLeft: "-0.5em",
                  marginBottom: "18px",
                }}
              >
                INBAR FARHI
              </div>
              <div
                style={{
                  fontWeight: 300,
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  color: "#8C8C8C",
                }}
              >
                כאן ישולב וידאו מההרצאות של ענבר
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "100px 7%",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <div
              className="ip-display-lg"
              style={{
                fontFamily: BODONI,
                fontSize: "44px",
                letterSpacing: "0.16em",
                color: "#141414",
                fontWeight: 400,
                marginBottom: "30px",
                marginLeft: "-0.16em",
                lineHeight: 1.1,
              }}
            >
              EDUCATION
            </div>
            <h2
              style={{
                fontWeight: 700,
                fontSize: "30px",
                lineHeight: 1.4,
                margin: "0 0 6px",
                color: "#141414",
              }}
            >
              מרצה ומכשירה
            </h2>
            <div
              style={{ fontWeight: 300, fontSize: "22px", color: "#0E3B2E", marginBottom: "30px" }}
            >
              את הדור הבא של המקצוע
            </div>
            <p
              style={{
                fontSize: "15.5px",
                lineHeight: 2.1,
                color: "#4E4E4E",
                fontWeight: 300,
                margin: "0 0 46px",
                maxWidth: "460px",
              }}
            >
              ענבר מרצה ומכשירה פדיקוריסטיות שרוצות לעבוד ברמה קלינית — לא קוסמטית. ההכשרות מתקיימות
              בקליניקה של המשתלמת או בקבוצות אזוריות, בכל הארץ, ומבוססות על עבודה מעשית לצד תיאוריה.
            </p>
            <div
              style={{
                width: "100%",
                maxWidth: "460px",
                borderTop: "1px solid #ECEAE6",
                marginBottom: "46px",
              }}
            >
              {DESIGN_TRACKS.map((t) => (
                <div
                  key={t.num}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr",
                    gap: "22px",
                    padding: "26px 2px",
                    borderBottom: "1px solid #ECEAE6",
                    textAlign: "right",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: BODONI,
                      fontWeight: 400,
                      fontSize: "20px",
                      color: "#B9B4AA",
                    }}
                  >
                    {t.num}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "16.5px",
                        letterSpacing: "0.04em",
                        color: "#141414",
                      }}
                    >
                      {t.title}
                    </span>
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: "14.5px",
                        lineHeight: 1.9,
                        color: "#6E6E6E",
                      }}
                    >
                      {t.desc}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "26px",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <a
                className="ip-btn-solid"
                href={`${WA}?text=${encodeURIComponent("שלום, אנחנו מתעניינים בהכשרה מקצועית")}`}
                style={{
                  background: "#0E3B2E",
                  color: "#FFFFFF",
                  padding: "15px 44px",
                  fontWeight: 400,
                  fontSize: "14px",
                  letterSpacing: "0.2em",
                }}
              >
                לבדיקת התאמה
              </a>
              <a
                href={`${WA}?text=${encodeURIComponent("שלום, נשמח להזמין הרצאה")}`}
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  letterSpacing: "0.14em",
                  borderBottom: "1px solid #141414",
                  paddingBottom: "4px",
                }}
              >
                להזמנת הרצאה ←
              </a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" style={{ background: "#F7F5F1", padding: "120px 6%" }}>
          <div
            className="ip-about-grid"
            style={{
              maxWidth: "1150px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 0.8fr",
              gap: "90px",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: BODONI,
                  fontSize: "14px",
                  letterSpacing: "0.5em",
                  color: "#8C8C8C",
                  fontWeight: 400,
                  marginBottom: "24px",
                  marginLeft: "-0.5em",
                }}
              >
                ABOUT
              </div>
              <h2
                style={{ fontWeight: 700, fontSize: "32px", margin: "0 0 28px", color: "#141414" }}
              >
                ענבר פרחי
              </h2>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 2.1,
                  color: "#4E4E4E",
                  fontWeight: 300,
                  margin: "0 0 16px",
                  textAlign: "right",
                }}
              >
                יותר מ-12 שנה אני מטפלת בכף הרגל בגישה הקלינית הקפדנית ביותר — ובשנים האחרונות גם
                מלמדת אותה. הקליניקה שלי אינה מכון יופי: כל החלטה מתבססת על ראיות, פרוטוקולים
                בינלאומיים והבנה עמוקה של הפיזיולוגיה.
              </p>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 2.1,
                  color: "#4E4E4E",
                  fontWeight: 300,
                  margin: "0 0 44px",
                  textAlign: "right",
                }}
              >
                אני מתמחה במקרים שאחרים מהססים לקבל — כף רגל סוכרתית, ציפורן חודרנית כרונית, פטרת
                עיקשת — ומכשירה פדיקוריסטיות לעבוד באותו סטנדרט. מטופלים מגיעים אליי מעלי, אריאל,
                שילה, עפרה וירושלים.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  borderTop: "1px solid #E2DFD8",
                }}
              >
                <span
                  style={{
                    padding: "18px 26px 0",
                    fontSize: "13.5px",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    borderLeft: "1px solid #E2DFD8",
                  }}
                >
                  בוגרת קורסים בינלאומיים
                </span>
                <span
                  style={{
                    padding: "18px 26px 0",
                    fontSize: "13.5px",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    borderLeft: "1px solid #E2DFD8",
                  }}
                >
                  פרוטוקול אגודת אייל
                </span>
                <span
                  style={{
                    padding: "18px 26px 0",
                    fontSize: "13.5px",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                  }}
                >
                  150+ שעות השתלמות בשנה
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                aspectRatio: "4/5",
                background: "#EFEDE8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div
                  style={{
                    fontFamily: BODONI,
                    fontSize: "15px",
                    letterSpacing: "0.5em",
                    color: "#B9B4AA",
                    marginLeft: "-0.5em",
                    marginBottom: "18px",
                  }}
                >
                  PORTRAIT
                </div>
                <div
                  style={{
                    fontWeight: 300,
                    fontSize: "14px",
                    letterSpacing: "0.1em",
                    color: "#8C8C8C",
                  }}
                >
                  כאן תשולב תמונה אישית של ענבר
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: "120px 6%", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "70px" }}>
            <div
              style={{
                fontFamily: BODONI,
                fontSize: "15px",
                letterSpacing: "0.5em",
                color: "#8C8C8C",
                fontWeight: 400,
                marginLeft: "-0.5em",
              }}
            >
              GOOGLE REVIEWS
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "22px",
              }}
            >
              <span style={{ color: "#E7B008", fontSize: "17px", letterSpacing: "0.2em" }}>
                ★★★★★
              </span>
              <span style={{ fontWeight: 300, fontSize: "14px", color: "#4E4E4E" }}>
                {ratingLabel} · ביקורות מאומתות מגוגל
              </span>
            </div>
          </div>
          <div
            className="ip-testi-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              borderTop: "1px solid #ECEAE6",
              borderBottom: "1px solid #ECEAE6",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                style={{
                  padding: "52px 40px",
                  borderLeft: "1px solid #ECEAE6",
                  display: "flex",
                  flexDirection: "column",
                  gap: "26px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: BODONI,
                    fontSize: "40px",
                    color: "#B9B4AA",
                    lineHeight: 0.5,
                    height: "20px",
                  }}
                >
                  &quot;
                </span>
                <p
                  style={{
                    fontWeight: 300,
                    fontSize: "15.5px",
                    lineHeight: 2.05,
                    color: "#4E4E4E",
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {t.quote}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#E7B008", fontSize: "13px", letterSpacing: "0.2em" }}>
                    ★★★★★
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "14.5px",
                      color: "#141414",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontWeight: 300,
                      fontSize: "12.5px",
                      color: "#8C8C8C",
                      letterSpacing: "0.06em",
                    }}
                  >
                    ביקורת גוגל מאומתת
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Knowledge */}
        <section
          id="knowledge"
          style={{ padding: "0 6% 120px", maxWidth: "1150px", margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div
              style={{
                fontFamily: BODONI,
                fontSize: "15px",
                letterSpacing: "0.5em",
                color: "#8C8C8C",
                fontWeight: 400,
                marginBottom: "14px",
                marginLeft: "-0.5em",
              }}
            >
              JOURNAL
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "28px", margin: 0, color: "#141414" }}>
              מאמרים מקצועיים
            </h2>
          </div>
          <div
            className="ip-journal-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "60px" }}
          >
            {journal.map((art) => (
              <a
                key={art.href}
                href={art.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.3em",
                    color: "#8C8C8C",
                    fontWeight: 400,
                  }}
                >
                  {art.cat}
                </span>
                <span
                  style={{ fontWeight: 600, fontSize: "18px", lineHeight: 1.6, color: "#141414" }}
                >
                  {art.title}
                </span>
                <span
                  style={{
                    fontWeight: 300,
                    fontSize: "14.5px",
                    lineHeight: 1.95,
                    color: "#6E6E6E",
                  }}
                >
                  {art.desc}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    color: "#0E3B2E",
                    borderBottom: "1px solid #0E3B2E",
                    paddingBottom: "3px",
                    marginTop: "8px",
                  }}
                >
                  לקריאה
                </span>
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "64px" }}>
            <a
              className="ip-btn-outline"
              href="/knowledge"
              style={{
                border: "1px solid #141414",
                padding: "14px 44px",
                fontWeight: 400,
                fontSize: "13.5px",
                letterSpacing: "0.2em",
                display: "inline-block",
              }}
            >
              לכל המאמרים
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 6% 120px", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div
              style={{
                fontFamily: BODONI,
                fontSize: "15px",
                letterSpacing: "0.5em",
                color: "#8C8C8C",
                fontWeight: 400,
                marginBottom: "14px",
                marginLeft: "-0.5em",
              }}
            >
              FAQ
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "28px", margin: 0, color: "#141414" }}>
              לשאלות שמתביישים לשאול
            </h2>
          </div>
          <div style={{ borderTop: "1px solid #ECEAE6" }}>
            {DESIGN_FAQS.map((faq) => (
              <details
                key={faq.q}
                style={{ borderBottom: "1px solid #ECEAE6", padding: "28px 4px" }}
              >
                <summary
                  style={{
                    fontWeight: 400,
                    fontSize: "17px",
                    cursor: "pointer",
                    listStyle: "none",
                    color: "#141414",
                    letterSpacing: "0.03em",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  {faq.q}
                  <span
                    style={{
                      fontFamily: BODONI,
                      fontWeight: 400,
                      fontSize: "24px",
                      color: "#B9B4AA",
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </summary>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 2.05,
                    color: "#6E6E6E",
                    margin: "18px 0 0",
                    fontWeight: 300,
                    maxWidth: "640px",
                  }}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" style={{ background: "#0C2B23", padding: "130px 6%" }}>
          <div
            className="ip-contact-grid"
            style={{
              maxWidth: "1050px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "100px",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                className="ip-display-md"
                style={{
                  fontFamily: BODONI,
                  fontSize: "40px",
                  letterSpacing: "0.16em",
                  color: "#FFFFFF",
                  fontWeight: 400,
                  marginBottom: "28px",
                  marginLeft: "-0.16em",
                  lineHeight: 1.15,
                }}
              >
                CONTACT
              </div>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "26px",
                  lineHeight: 1.5,
                  margin: "0 0 24px",
                  color: "#FFFFFF",
                }}
              >
                נתחיל בשיחה
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 2.1,
                  color: "#B9C9C0",
                  fontWeight: 300,
                  margin: "0 0 50px",
                }}
              >
                מטופלים — לתיאום אבחון בקליניקה בעלי.
                <br />
                פדיקוריסטיות — לשיחת התאמה על ההכשרה הבאה.
              </p>
              <div style={{ display: "grid", gap: "24px", textAlign: "right" }}>
                <a
                  className="ip-contact-link"
                  href="tel:+972506668595"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "18px",
                    color: "#FFFFFF",
                    borderBottom: "1px solid rgba(255,255,255,0.22)",
                    paddingBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.3em",
                      color: "#7E9A8E",
                      minWidth: "78px",
                    }}
                  >
                    טלפון
                  </span>
                  <span style={{ fontWeight: 300, fontSize: "23px", letterSpacing: "0.06em" }}>
                    050-666-8595
                  </span>
                </a>
                <a
                  className="ip-contact-link"
                  href={WA}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "18px",
                    color: "#FFFFFF",
                    borderBottom: "1px solid rgba(255,255,255,0.22)",
                    paddingBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.3em",
                      color: "#7E9A8E",
                      minWidth: "78px",
                    }}
                  >
                    וואטסאפ
                  </span>
                  <span style={{ fontWeight: 300, fontSize: "19px" }}>שיחה ישירה עם ענבר</span>
                </a>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: "18px", color: "#B9C9C0" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.3em",
                      color: "#7E9A8E",
                      minWidth: "78px",
                    }}
                  >
                    קליניקה
                  </span>
                  <span style={{ fontWeight: 300, fontSize: "16px" }}>
                    עלי, אזור בנימין · ראשון–חמישי 09:00–20:00
                  </span>
                </div>
              </div>
            </div>
            <div
              className="ip-form-card"
              style={{ background: "#FFFFFF", padding: "56px 50px", textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: BODONI,
                  fontSize: "13px",
                  letterSpacing: "0.4em",
                  color: "#8C8C8C",
                  fontWeight: 400,
                  marginBottom: "12px",
                  marginLeft: "-0.4em",
                }}
              >
                GET IN TOUCH
              </div>
              <h3
                style={{ fontWeight: 700, fontSize: "22px", margin: "0 0 34px", color: "#141414" }}
              >
                השאירו פרטים ואחזור אליכם
              </h3>
              <div style={{ display: "grid", gap: "24px" }}>
                <input
                  className="ip-input"
                  type="text"
                  placeholder="שם מלא"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #D8D4CB",
                    padding: "12px 2px",
                    fontSize: "15.5px",
                    outline: "none",
                    fontWeight: 300,
                    background: "transparent",
                    textAlign: "right",
                  }}
                />
                <div className="ip-field-row" style={{ display: "flex", gap: "28px" }}>
                  <input
                    className="ip-input"
                    type="tel"
                    placeholder="טלפון"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: "none",
                      borderBottom: "1px solid #D8D4CB",
                      padding: "12px 2px",
                      fontSize: "15.5px",
                      outline: "none",
                      fontWeight: 300,
                      background: "transparent",
                      textAlign: "right",
                    }}
                  />
                  <input
                    className="ip-input"
                    type="email"
                    placeholder="אימייל"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: "none",
                      borderBottom: "1px solid #D8D4CB",
                      padding: "12px 2px",
                      fontSize: "15.5px",
                      outline: "none",
                      fontWeight: 300,
                      background: "transparent",
                      textAlign: "right",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "32px",
                    padding: "4px 0",
                    justifyContent: "center",
                  }}
                >
                  {["אני מטופל/ת", "אני פדיקוריסטית"].map((label) => (
                    <label
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        fontSize: "14.5px",
                        fontWeight: 300,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="aud"
                        checked={form.audience === label}
                        onChange={() => setForm({ ...form, audience: label })}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <input
                  className="ip-input"
                  type="text"
                  placeholder="מה מטריד אתכם? (לא חובה)"
                  value={form.concern}
                  onChange={(e) => setForm({ ...form, concern: e.target.value })}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #D8D4CB",
                    padding: "12px 2px",
                    fontSize: "15.5px",
                    outline: "none",
                    fontWeight: 300,
                    background: "transparent",
                    textAlign: "right",
                  }}
                />
                <a
                  className="ip-btn-solid"
                  href={`${WA}?text=${encodeURIComponent(formMessage)}`}
                  style={{
                    background: "#0E3B2E",
                    color: "#FFFFFF",
                    padding: "17px",
                    fontWeight: 400,
                    fontSize: "14px",
                    textAlign: "center",
                    letterSpacing: "0.24em",
                    marginTop: "10px",
                  }}
                >
                  שליחה
                </a>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8C8C8C",
                    fontWeight: 300,
                    letterSpacing: "0.06em",
                  }}
                >
                  הפרטים נשמרים בדיסקרטיות מלאה
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#FFFFFF", padding: "80px 6% 40px" }}>
          <div style={{ maxWidth: "1150px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "26px" }}>
              <img
                src={logoImage}
                alt="INBAR FARHI — פדיקור טיפולי · הכשרות מקצועיות"
                style={{ height: "76px", display: "block" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "34px",
                justifyContent: "center",
                flexWrap: "wrap",
                fontSize: "13.5px",
                fontWeight: 300,
                letterSpacing: "0.14em",
                marginBottom: "34px",
              }}
            >
              {FOOTER_LINKS.map((l) => (
                <a key={l.label} href={l.href} style={{ color: "#4E4E4E" }}>
                  {l.label}
                </a>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "26px",
                justifyContent: "center",
                fontSize: "13.5px",
                fontWeight: 300,
                letterSpacing: "0.06em",
                marginBottom: "44px",
                color: "#6E6E6E",
                flexWrap: "wrap",
              }}
            >
              <a href="tel:+972506668595" style={{ color: "#141414" }}>
                050-666-8595
              </a>
              <span>·</span>
              <a href="mailto:inbar.pedicure@gmail.com" style={{ color: "#141414" }}>
                inbar.pedicure@gmail.com
              </a>
              <span>·</span>
              <span>עלי, אזור בנימין</span>
            </div>
            <div
              style={{
                borderTop: "1px solid #ECEAE6",
                paddingTop: "24px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#8C8C8C",
                fontWeight: 300,
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <span>© 2026 ענבר פרחי · כל הזכויות שמורות</span>
              <span>המידע באתר אינו תחליף לייעוץ רפואי מקצועי</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
