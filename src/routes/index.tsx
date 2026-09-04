import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
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

/*
 * דף הבית מיושם אחד לאחד מקובץ העיצוב "Inbar Homepage.dc.html":
 * הסגנונות האינליין שם הם מקור האמת לערכים (צבעים, גדלים, ריווח, hairlines),
 * ולכן הם נשמרים כאן כמות שהם ולא מתורגמים למחלקות Tailwind.
 */

const WA = "https://wa.me/972506668595";
const BODONI = "'Bodoni Moda',serif";

const HOME_CSS = `
.ip-page { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; -webkit-font-smoothing:antialiased; overflow-x:clip; padding-bottom:80px; }
/* clip ולא hidden: hidden מחשב overflow-y ל-auto, .ip-page הופך למכל גלילה
   וכל position:sticky בתוכו (הניווט, עמודת THE CLINIC) מפסיק לעבוד. */
.ip-page [id] { scroll-margin-top:124px; }
.ip-page ::placeholder { color:#6B6B6B; opacity:1; }
.ip-page .ip-circle-ring { max-width:180px; margin-inline:auto; }
.ip-sr { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }
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


@media (max-width: 1100px) {
  .ip-circles-grid { grid-template-columns:repeat(4,1fr) !important; }
  .ip-clinic-grid { grid-template-columns:1fr !important; gap:60px !important; }
  .ip-clinic-aside { position:static !important; }
  .ip-about-grid, .ip-contact-grid { grid-template-columns:1fr !important; gap:60px !important; }
}
@media (max-width: 1100px) and (min-width: 901px) {
  /* בטווח הזה גובה תמונת ההירו יורד ל-405-495px והטקסט ממלא 87% ממנה. */
  .ip-hero-h1 { font-size:36px !important; }
  .ip-hero-sub { font-size:18px !important; }
  .ip-hero-overlay > div { padding-inline:24px !important; }
}
@media (max-width: 900px) {
  .ip-page [id] { scroll-margin-top:100px; }
  /* מרווח תחתון כדי שכפתור הנגישות הצף לא ישב על שורת הדיסקליימר. */
  .ip-page { padding-bottom:88px; }
  .ip-academy-grid { grid-template-columns:1fr !important; }
  .ip-academy-img { min-height:260px !important; }
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
    links: [{ rel: "canonical", href: SITE.url + "/" }],
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

function HomePage() {
  const { articles, reviews, rating } = Route.useLoaderData();

  /*
   * כפתור "שליחה" בעיצוב היה קישור לוואטסאפ בלבד, כך שמי שנטש אחרי
   * שוואטסאפ נפתח פשוט נעלם. עכשיו הפנייה נשמרת קודם בטבלת leads —
   * כמו בטופס של עמוד יצירת הקשר — ורק אחר כך נפתח וואטסאפ עם
   * ההודעה המוכנה. כשל בשמירה לא חוסם את המבקר.
   */
  const [form, setForm] = useState({ name: "", phone: "", email: "", audience: "", concern: "" });
  const [sending, setSending] = useState(false);
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
  async function submitLead(e: FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    if (name.length < 2) {
      toast.error("נא למלא שם");
      return;
    }
    if (!phone && !email) {
      toast.error("צריך טלפון או אימייל כדי שאוכל לחזור אליכם");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("leads").insert({
      name,
      phone: phone || null,
      email: email ? email.toLowerCase() : null,
      message: [form.audience, form.concern].filter(Boolean).join(" · ") || null,
      source_page: typeof window !== "undefined" ? window.location.pathname : null,
      status: "new",
    });
    setSending(false);
    if (error) toast.error("השמירה נכשלה, ממשיכים לוואטסאפ");
    window.location.href = `${WA}?text=${encodeURIComponent(formMessage)}`;
  }

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
        <SiteHeader />

        <main id="main-content">
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
                color: "#6B6B6B",
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
                color: "#6B6B6B",
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
                gridTemplateColumns: "repeat(7,1fr)",
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
                      border: "1px solid #8F8474",
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
                style={{
                  fontWeight: 300,
                  fontSize: "24px",
                  color: "#B9C9C0",
                  marginBottom: "36px",
                }}
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
                יבלת שחוזרת, ציפורן שנכנסת שוב ושוב, עור שנסדק — אינם עומדים בפני עצמם. הם משקפים
                לחץ מכני, הנעלה, תבנית הליכה ומצב בריאותי. לכן האבחון אצל ענבר מתחיל תמיד בשאלה למה
                — לא רק במה.
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
                    style={{
                      padding: "48px 34px 0",
                      borderLeft: "1px solid rgba(255,255,255,0.14)",
                    }}
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
                    color: "#6B6B6B",
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
                        overflow: "hidden",
                        filter: "saturate(0.75)",
                      }}
                    >
                      <img
                        src={svc.img}
                        alt={svc.alt}
                        width={110}
                        height={110}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </span>
                    <span
                      style={{
                        fontFamily: BODONI,
                        fontWeight: 400,
                        fontSize: "22px",
                        color: "#726B5E",
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
                    <span
                      aria-hidden
                      style={{ fontWeight: 200, fontSize: "20px", color: "#726B5E" }}
                    >
                      ←
                    </span>
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
                /* עמודת הטקסט גבוהה כ-980px. בלי alignSelf העמודה הזאת
                   נמתחת איתה ומשאירה גוש בז' ריק בגובה מסך שלם. */
                position: "sticky",
                top: "124px",
                alignSelf: "start",
                minHeight: "520px",
                maxHeight: "calc(100vh - 148px)",
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
                    color: "#726B5E",
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
                    color: "#6B6B6B",
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
                style={{
                  fontWeight: 300,
                  fontSize: "22px",
                  color: "#0E3B2E",
                  marginBottom: "30px",
                }}
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
                ענבר מרצה ומכשירה פדיקוריסטיות שרוצות לעבוד ברמה קלינית — לא קוסמטית. ההכשרות
                מתקיימות בקליניקה של המשתלמת או בקבוצות אזוריות, בכל הארץ, ומבוססות על עבודה מעשית
                לצד תיאוריה.
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
                        color: "#726B5E",
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
                    color: "#6B6B6B",
                    fontWeight: 400,
                    marginBottom: "24px",
                    marginLeft: "-0.5em",
                  }}
                >
                  ABOUT
                </div>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "32px",
                    margin: "0 0 28px",
                    color: "#141414",
                  }}
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
                      color: "#726B5E",
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
                      color: "#6B6B6B",
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
                  color: "#6B6B6B",
                  fontWeight: 400,
                  marginLeft: "-0.5em",
                }}
              >
                GOOGLE REVIEWS
              </div>
              <h2 className="ip-sr">ביקורות גוגל על הקליניקה</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "22px",
                }}
              >
                <span style={{ color: "#947105", fontSize: "17px", letterSpacing: "0.2em" }}>
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
                    aria-hidden
                    style={{
                      fontFamily: BODONI,
                      fontSize: "40px",
                      color: "#726B5E",
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
                    <span
                      aria-hidden
                      style={{ color: "#947105", fontSize: "13px", letterSpacing: "0.2em" }}
                    >
                      ★★★★★
                    </span>
                    <span className="ip-sr">דירוג 5 מתוך 5 כוכבים</span>
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
                        color: "#6B6B6B",
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
                  color: "#6B6B6B",
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
                      color: "#6B6B6B",
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
                  color: "#6B6B6B",
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
                      aria-hidden
                      style={{
                        fontFamily: BODONI,
                        fontWeight: 400,
                        fontSize: "24px",
                        color: "#726B5E",
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
                      borderBottom: "1px solid rgba(255,255,255,0.34)",
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
                      borderBottom: "1px solid rgba(255,255,255,0.34)",
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
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "18px",
                      color: "#B9C9C0",
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
                    color: "#6B6B6B",
                    fontWeight: 400,
                    marginBottom: "12px",
                    marginLeft: "-0.4em",
                  }}
                >
                  GET IN TOUCH
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "22px",
                    margin: "0 0 34px",
                    color: "#141414",
                  }}
                >
                  השאירו פרטים ואחזור אליכם
                </h3>
                <form onSubmit={submitLead} style={{ display: "grid", gap: "24px" }}>
                  <input
                    className="ip-input"
                    type="text"
                    required
                    aria-label="שם מלא"
                    autoComplete="name"
                    placeholder="שם מלא"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #8F8474",
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
                      aria-label="טלפון"
                      autoComplete="tel"
                      placeholder="טלפון"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: "none",
                        borderBottom: "1px solid #8F8474",
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
                      aria-label="אימייל"
                      autoComplete="email"
                      placeholder="אימייל"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: "none",
                        borderBottom: "1px solid #8F8474",
                        padding: "12px 2px",
                        fontSize: "15.5px",
                        outline: "none",
                        fontWeight: 300,
                        background: "transparent",
                        textAlign: "right",
                      }}
                    />
                  </div>
                  <fieldset
                    style={{
                      border: "none",
                      margin: 0,
                      display: "flex",
                      gap: "32px",
                      padding: "4px 0",
                      justifyContent: "center",
                    }}
                  >
                    <legend className="ip-sr">סוג הפנייה</legend>
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
                  </fieldset>
                  <input
                    className="ip-input"
                    type="text"
                    aria-label="מה מטריד אתכם (לא חובה)"
                    placeholder="מה מטריד אתכם? (לא חובה)"
                    value={form.concern}
                    onChange={(e) => setForm({ ...form, concern: e.target.value })}
                    style={{
                      border: "none",
                      borderBottom: "1px solid #8F8474",
                      padding: "12px 2px",
                      fontSize: "15.5px",
                      outline: "none",
                      fontWeight: 300,
                      background: "transparent",
                      textAlign: "right",
                    }}
                  />
                  <button
                    className="ip-btn-solid"
                    type="submit"
                    disabled={sending}
                    style={{
                      background: "#0E3B2E",
                      color: "#FFFFFF",
                      padding: "17px",
                      fontWeight: 400,
                      fontSize: "14px",
                      textAlign: "center",
                      letterSpacing: "0.24em",
                      marginTop: "10px",
                      border: "none",
                      cursor: sending ? "wait" : "pointer",
                    }}
                  >
                    {sending ? "רגע…" : "שליחה"}
                  </button>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B6B6B",
                      fontWeight: 300,
                      letterSpacing: "0.06em",
                    }}
                  >
                    הפרטים נשמרים בדיסקרטיות מלאה
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
