import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { useSite } from "@/lib/use-site";
import heroAsset from "@/assets/inbar-farchi.jpg.asset.json";

/*
 * העמוד בנוי על מערכת המיתוג של דף הבית (src/routes/index.tsx):
 * ללא רדיוס, ללא צל, הפרדה בקווי שיער בלבד, Assistant לעברית
 * ו-Bodoni Moda לתוויות הלטיניות. הערכים נשמרים אינליין כמו שם.
 */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const PAGE_URL = `${SITE.url}/about`;
const HERO_ABS = `${SITE.url}${heroAsset.url}`;
const TITLE = `אודות ${SITE.brand} | פדיקוריסטית טיפולית בעלי`;
const DESCRIPTION =
  "ענבר פרחי, פדיקוריסטית טיפולית בעלי, אזור בנימין. טיפול קליני ביבלות, פטרת, ציפורן חודרנית וכף רגל סוכרתית. מרצה ומכשירה פדיקוריסטיות בכל הארץ.";

const ABOUT_CSS = `
.ipa { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
.ipa a { transition:color 0.2s, background 0.2s, border-color 0.2s; }
.ipa-btn-solid:hover { background:#141414; color:#FFFFFF; }
.ipa-btn-ghost:hover { color:#FFFFFF; border-color:#FFFFFF; }
@media (max-width: 900px) {
  .ipa-hero-grid { grid-template-columns:1fr !important; gap:48px !important; }
  .ipa-cred-grid { grid-template-columns:1fr !important; }
  .ipa-daughters { grid-template-columns:1fr !important; }
  .ipa-daughters > div { border-left:none !important; border-top:1px solid #E2DFD8; }
  .ipa-section { padding-top:80px !important; padding-bottom:80px !important; }
}
@media (max-width: 560px) {
  .ipa-display { font-size:30px !important; }
  .ipa-h1 { font-size:34px !important; }
  .ipa-row { grid-template-columns:1fr !important; gap:10px !important; }
}
`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  inLanguage: "he-IL",
  url: PAGE_URL,
  mainEntity: {
    "@type": "Person",
    "@id": PAGE_URL + "#inbar-farchi",
    url: PAGE_URL,
    name: SITE.brand,
    jobTitle: "פדיקוריסטית טיפולית",
    description: DESCRIPTION,
    image: HERO_ABS,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: "IL",
    },
    knowsAbout: [
      "פדיקור טיפולי",
      "טיפול ביבלות",
      "פטרת כף הרגל",
      "ציפורן חודרנית",
      "אורטוניקסיה",
      "טיפול בחולי סוכרת",
      "שיטת BIO",
    ],
  },
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "geo.placename", content: "עלי, אזור בנימין" },
      { name: "geo.region", content: "IL" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: HERO_ABS },
      { name: "twitter:image", content: HERO_ABS },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "stylesheet", href: FONTS_HREF },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(personSchema) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "בית", item: SITE.url + "/" },
            { "@type": "ListItem", position: 2, name: "אודות", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
  component: AboutPage,
});

const lead =
  "אני ענבר פרחי, פדיקוריסטית טיפולית. אני מטפלת בכף הרגל בגישה קלינית — אבחון לפני טיפול, סטריליות מוחלטת וליווי עד החלמה.";

const paragraphs = [
  "בעיניי כף הרגל אינה עניין קוסמטי. היא מערכת נושאת משקל שמושפעת מהנעלה, מתבנית הליכה וממצב בריאותי, וכל שינוי בה מספר משהו על הגוף כולו. לכן כל פגישה אצלי מתחילה בשאלה למה — ולא רק במה.",
  "כל רגל מספרת סיפור אחר. התפקיד שלי הוא לאתר את מקור הבעיה ולטפל בו, לא רק לשפר את המראה. אני משלבת ידע קליני, דיוק וקשב, ומסבירה כל שלב לפני שאני מבצעת אותו.",
  "אני עוברת השתלמויות קבועות בבית החולים איכילוב, מטפלת בכף רגל סוכרתית לפי פרוטוקול אגודת אייל, ומרצה לפדיקוריסטיות טיפוליות בכל הארץ. מטופלים מגיעים אליי מעלי, אריאל, שילה, עפרה וירושלים.",
  "המטרה שלי מדודה וברורה: להחזיר לכם הליכה בלי כאב, ולתת לכם את הידע לשמור עליה.",
];

const journey = [
  {
    num: "01",
    age: "גיל 14",
    title: "ההתחלה",
    body: "התחלתי לעבוד על ציפורניים בגיל 14. מה שמשך אותי היה הדיוק — עבודת יד סבלנית שבה כל פרט קטן משנה את התוצאה.",
  },
  {
    num: "02",
    age: "שנות העשרים",
    title: "התמחות בשיטת BIO",
    body: "עברתי דרך עולם הביוטי והתמקצעתי בשיקום ציפורניים בשיטת BIO — עבודה על לוחית פגומה בלי לפגוע במיטת הציפורן שמתחתיה.",
  },
  {
    num: "03",
    age: "נקודת המפנה",
    title: "פדיקור טיפולי",
    body: "כשהגעתי לפדיקור הטיפולי הבנתי שהעיסוק שלי אינו יופי אלא תפקוד: לאפשר לאנשים ללכת בלי כאב. משם הכיוון היה ברור.",
  },
  {
    num: "04",
    age: "היום",
    title: "מרצה ומכשירה",
    body: "אני משתלמת באיכילוב, מרצה לפדיקוריסטיות בכל הארץ, ומלווה מקרים מורכבים שעברו כמה קליניקות לפניי.",
  },
];

const daughters = [
  { name: "אגם", role: "הבכורה" },
  { name: "אביגיל", role: "האמצעית" },
  { name: "אודיה", role: "הצעירה" },
];

const credentials = [
  "השתלמויות קבועות בבית החולים איכילוב",
  "כף רגל סוכרתית לפי פרוטוקול אגודת אייל",
  "התמחות בשיטת BIO לשיקום ציפורניים",
  "מרצה ומכשירה פדיקוריסטיות טיפוליות",
];

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div
      style={{
        fontFamily: BODONI,
        fontSize: "14px",
        letterSpacing: "0.5em",
        color: dark ? "#7E9A8E" : "#6B6B6B",
        fontWeight: 400,
        marginBottom: "22px",
        marginLeft: "-0.5em",
      }}
    >
      {children}
    </div>
  );
}

function AboutPage() {
  const site = useSite();
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: ABOUT_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ipa flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "אודות" }]} />

        <article>
          {/* Hero */}
          <section className="ipa-section" style={{ background: "#FFFFFF", padding: "90px 6%" }}>
            <div
              className="ipa-hero-grid"
              style={{
                maxWidth: "1150px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "0.85fr 1.15fr",
                gap: "80px",
                alignItems: "center",
              }}
            >
              <div>
                <img
                  src={heroAsset.url}
                  alt={`${site.brand} — פדיקוריסטית טיפולית בקליניקה בעלי`}
                  width={720}
                  height={900}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    display: "block",
                    border: "1px solid #ECEAE6",
                  }}
                />
              </div>
              <div>
                <Eyebrow>ABOUT</Eyebrow>
                <h1
                  className="ipa-h1"
                  style={{
                    fontWeight: 700,
                    fontSize: "44px",
                    lineHeight: 1.3,
                    margin: "0 0 24px",
                    color: "#141414",
                  }}
                >
                  היי, אני ענבר
                </h1>
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: 2,
                    color: "#4E4E4E",
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  {lead}
                </p>
              </div>
            </div>
          </section>

          {/* Manifesto */}
          <section
            className="ipa-section"
            style={{ background: "#F7F5F1", padding: "110px 6%", borderTop: "1px solid #ECEAE6" }}
          >
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              <Eyebrow>THE APPROACH</Eyebrow>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "30px",
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
                  fontSize: "24px",
                  color: "#4E4E4E",
                  marginBottom: "36px",
                }}
              >
                לא קוסמטי
              </div>
              {paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  style={{
                    fontSize: "15.5px",
                    lineHeight: 2.1,
                    color: "#4E4E4E",
                    fontWeight: 300,
                    margin: "0 0 20px",
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* Journey */}
          <section
            className="ipa-section"
            style={{ background: "#FFFFFF", padding: "110px 6%", borderTop: "1px solid #ECEAE6" }}
          >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <Eyebrow>THE PATH</Eyebrow>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "28px",
                  margin: "0 0 48px",
                  color: "#141414",
                }}
              >
                איך הגעתי לכאן
              </h2>
              <ol
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  borderTop: "1px solid #ECEAE6",
                }}
              >
                {journey.map((j) => (
                  <li
                    key={j.title}
                    className="ipa-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 160px 1fr",
                      gap: "26px",
                      padding: "30px 2px",
                      borderBottom: "1px solid #ECEAE6",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontFamily: BODONI,
                        fontWeight: 400,
                        fontSize: "22px",
                        color: "#726B5E",
                      }}
                    >
                      {j.num}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.24em",
                          color: "#726B5E",
                          fontWeight: 400,
                        }}
                      >
                        {j.age}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "17px",
                          letterSpacing: "0.04em",
                          color: "#141414",
                        }}
                      >
                        {j.title}
                      </span>
                    </span>
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: "15px",
                        lineHeight: 2,
                        color: "#6E6E6E",
                      }}
                    >
                      {j.body}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Behind the clinic */}
          <section
            className="ipa-section"
            style={{ background: "#F7F5F1", padding: "110px 6%", borderTop: "1px solid #ECEAE6" }}
          >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <Eyebrow>OFF THE CHAIR</Eyebrow>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "28px",
                  margin: "0 0 26px",
                  color: "#141414",
                }}
              >
                אמא של שלוש בנות
              </h2>
              <p
                style={{
                  fontSize: "15.5px",
                  lineHeight: 2.1,
                  color: "#4E4E4E",
                  fontWeight: 300,
                  margin: "0 0 44px",
                  maxWidth: "640px",
                }}
              >
                מעבר לקליניקה אני קודם כול אמא לשלוש בנות — אגם, אביגיל ואודיה. מהן אני לומדת סבלנות
                וקשב, ואת אלה אני מביאה גם לכיסא הטיפול: להקשיב עד הסוף, להסביר לאט, וללוות עד שהכאב
                נגמר.
              </p>
              <div
                className="ipa-daughters"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  borderTop: "1px solid #E2DFD8",
                }}
              >
                {daughters.map((d, i) => (
                  <div
                    key={d.name}
                    style={{
                      padding: "30px 26px",
                      borderLeft: i === daughters.length - 1 ? "none" : "1px solid #E2DFD8",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontFamily: BODONI,
                        fontWeight: 400,
                        fontSize: "18px",
                        color: "#726B5E",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "19px", color: "#141414" }}>
                      {d.name}
                    </span>
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: "13.5px",
                        letterSpacing: "0.08em",
                        color: "#6B6B6B",
                      }}
                    >
                      {d.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Credentials */}
          <section
            className="ipa-section"
            style={{ background: "#FFFFFF", padding: "110px 6%", borderTop: "1px solid #ECEAE6" }}
          >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <Eyebrow>CREDENTIALS</Eyebrow>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "28px",
                  margin: "0 0 48px",
                  color: "#141414",
                }}
              >
                הרקע המקצועי
              </h2>
              <ul
                className="ipa-cred-grid"
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  borderTop: "1px solid #ECEAE6",
                }}
              >
                {credentials.map((c, i) => (
                  <li
                    key={c}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "20px",
                      padding: "26px 4px",
                      borderBottom: "1px solid #ECEAE6",
                      borderLeft: i % 2 === 0 ? "1px solid #ECEAE6" : "none",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        fontFamily: BODONI,
                        fontWeight: 400,
                        fontSize: "20px",
                        color: "#726B5E",
                        flexShrink: 0,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontSize: "15.5px",
                        lineHeight: 1.9,
                        color: "#141414",
                        fontWeight: 300,
                      }}
                    >
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Contact band */}
          <section style={{ background: "#0C2B23", padding: "120px 6%" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
              <div
                className="ipa-display"
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
                  margin: "0 0 20px",
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
                  margin: "0 0 46px",
                }}
              >
                מטופלים — לתיאום אבחון בקליניקה בעלי.
                <br />
                פדיקוריסטיות — לשיחת התאמה על ההכשרה הבאה.
              </p>
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
                  className="ipa-btn-solid"
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener nofollow"
                  style={{
                    background: "#0E3B2E",
                    color: "#FFFFFF",
                    border: "1px solid #FFFFFF",
                    padding: "16px 44px",
                    fontWeight: 400,
                    fontSize: "14px",
                    letterSpacing: "0.2em",
                  }}
                >
                  לתיאום אבחון
                </a>
                <a
                  className="ipa-btn-ghost"
                  href={`mailto:${site.email}`}
                  style={{
                    color: "#B9C9C0",
                    fontWeight: 400,
                    fontSize: "14px",
                    letterSpacing: "0.14em",
                    borderBottom: "1px solid #B9C9C0",
                    paddingBottom: "4px",
                  }}
                >
                  שלחו לי מייל ←
                </a>
              </div>
              <p
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.9,
                  color: "#7E9A8E",
                  fontWeight: 300,
                  margin: "48px 0 0",
                  paddingTop: "26px",
                  borderTop: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                המידע בעמוד זה הסברתי בלבד ואינו מחליף בדיקה אישית בקליניקה או ייעוץ רפואי. אם יש
                פצע פתוח, חשד לזיהום או סוכרת לא מאוזנת — פנו להערכה לפני כל טיפול.
              </p>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
