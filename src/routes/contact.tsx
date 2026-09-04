import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { useSite } from "@/lib/use-site";
import { ContactForm } from "@/components/shared/ContactForm";

/*
 * העמוד בנוי על מערכת המיתוג של דף הבית (src/routes/index.tsx):
 * ללא רדיוס, ללא צל, קווי שיער בלבד, פס כהה אחד לרגע יצירת הקשר.
 */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const PAGE_URL = `${SITE.url}/contact`;
const TITLE = `צרו קשר | ${SITE.brand} — פדיקור טיפולי ב${SITE.city}`;
const DESCRIPTION = `תיאום אבחון וטיפול אצל ${SITE.brand}, פדיקוריסטית טיפולית ב${SITE.city}, אזור בנימין. טלפון ${SITE.phoneDisplay}, וואטסאפ או מייל. שעות פעילות: ${SITE.hoursDisplay}.`;

const CONTACT_CSS = `
.ipc { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
.ipc a { transition:color 0.2s, background 0.2s, border-color 0.2s; }
.ipc-btn-solid:hover { background:#141414; color:#FFFFFF; }
.ipc-link:hover { color:#FFFFFF; border-color:#FFFFFF; }
.ipc details summary::-webkit-details-marker { display:none; }
@media (max-width: 1000px) {
  .ipc-grid { grid-template-columns:1fr !important; gap:64px !important; }
}
@media (max-width: 900px) {
  .ipc-section { padding-top:80px !important; padding-bottom:80px !important; }
}
@media (max-width: 560px) {
  .ipc-display { font-size:30px !important; }
  .ipc-h1 { font-size:34px !important; }
  .ipc-card { padding:40px 24px !important; }
}
`;

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  inLanguage: "he-IL",
  url: PAGE_URL,
  name: TITLE,
  description: DESCRIPTION,
};

const FAQS = [
  {
    q: "כמה זמן לוקחת פגישה ראשונה?",
    a: "פגישת אבחון ראשונה נמשכת 45 עד 60 דקות. בזמן הזה אני בודקת את כפות הרגליים והציפורניים, מאבחנת, מסבירה לכם מה ראיתי ומציעה תוכנית טיפול. לרוב מבצעים גם את הטיפול הראשון באותה פגישה.",
  },
  {
    q: "האם הטיפול כואב?",
    a: "רוב הטיפולים אינם כואבים. בטיפולים פולשניים יותר, כמו אורתוניקסיה לציפורן חודרנית, אני עובדת בכלים עדינים ובהדרגה. אם עולה כאב — אני עוצרת.",
  },
  {
    q: "האם יש קבלה לקופת חולים או לביטוח משלים?",
    a: "אני מנפיקה קבלה רשמית בכל פגישה. חלק מהביטוחים המשלימים מחזירים על פדיקור טיפולי, בתנאים משתנים. כדאי לבדוק מול הביטוח שלכם לפני הפגישה.",
  },
  {
    q: "האם אפשר להגיע ללא תיאום מראש?",
    a: "לא. הקליניקה פועלת בתורים מתואמים בלבד, כדי להבטיח לכל מטופל זמן מלא ופרטיות. אפשר לתאם בוואטסאפ, בטלפון או בטופס בעמוד הזה.",
  },
  {
    q: "האם הקליניקה מתאימה לחולי סוכרת?",
    a: "כן. אני מטפלת בכף רגל סוכרתית לפי פרוטוקול אגודת אייל: בלי חתכים, בלי השרייה, עם ציוד חד-פעמי והערכת סיכון תקופתית, לצד הדרכה לבחירת הנעלה מתאימה. חשוב לציין את אבחנת הסוכרת כבר בתיאום התור.",
  },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "geo.placename", content: "עלי, אזור בנימין" },
      { name: "geo.region", content: "IL" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "stylesheet", href: FONTS_HREF },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(contactSchema) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
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
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "בית", item: SITE.url + "/" },
            { "@type": "ListItem", position: 2, name: "צור קשר", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function Eyebrow({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: BODONI,
        fontSize: "14px",
        letterSpacing: "0.5em",
        color: "#6B6B6B",
        fontWeight: 400,
        marginBottom: "22px",
        marginLeft: "-0.5em",
      }}
    >
      {children}
    </div>
  );
}

function ContactPage() {
  const site = useSite();
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: CONTACT_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ipc flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "צור קשר" }]} />

        <article>
          {/* Intro */}
          <section className="ipc-section" style={{ background: "#FFFFFF", padding: "90px 6%" }}>
            <div style={{ maxWidth: "820px", margin: "0 auto" }}>
              <Eyebrow>CONTACT</Eyebrow>
              <h1
                className="ipc-h1"
                style={{
                  fontWeight: 700,
                  fontSize: "44px",
                  lineHeight: 1.3,
                  margin: "0 0 24px",
                  color: "#141414",
                }}
              >
                דברו איתנו
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
                השאירו פרטים, שלחו וואטסאפ או התקשרו — ואחזור אליכם לתיאום פגישת אבחון. כל פנייה
                מטופלת באופן אישי, בלי שיפוט.
              </p>
            </div>
          </section>

          {/* Practical detail */}
          <section
            className="ipc-section"
            style={{ background: "#F7F5F1", padding: "110px 6%", borderTop: "1px solid #ECEAE6" }}
          >
            <div style={{ maxWidth: "820px", margin: "0 auto" }}>
              <Eyebrow>THE CLINIC</Eyebrow>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "28px",
                  margin: "0 0 34px",
                  color: "#141414",
                }}
              >
                לפני שאתם מגיעים
              </h2>
              <div
                style={{
                  fontSize: "15.5px",
                  lineHeight: 2.1,
                  color: "#4E4E4E",
                  fontWeight: 300,
                }}
              >
                <p style={{ margin: "0 0 20px" }}>
                  הקליניקה שלי נמצאת ב{site.city}, {site.region}, ומשרתת את היישובים בסביבה — אריאל,
                  שילה, עפרה, ירושלים ויישובי בנימין והשומרון. ההגעה נוחה ברכב, יש חניה חופשית
                  בסמוך, והכניסה מותאמת גם למטופלים עם ניידות מוגבלת. בכל פגישה אני מקדישה זמן מלא
                  לאבחון, להסבר ולטיפול — בלי תורים כפולים ובלי לחץ של זמן.
                </p>
                <p style={{ margin: "0 0 20px" }}>
                  אני מטפלת בילדים מגיל 6 ומעלה, בנשים בהיריון (בטיפולים מותאמים ובטוחים לעובר),
                  במבוגרים ובבני הגיל השלישי. אני מתמחה במצבים שדורשים תשומת לב מיוחדת: כף רגל
                  סוכרתית, חולי כליות, נטילת מדללי דם, החלמה מניתוחים אורתופדיים ומצבי סיכון לזיהום.
                  כל הציוד הרב-פעמי עובר חיטוי ועיקור באוטוקלאב לפי תקני משרד הבריאות, וחלק גדול
                  מהפריטים הוא חד-פעמי ונפתח מולכם.
                </p>
                <p style={{ margin: 0 }}>
                  לפני הפגישה הראשונה חשוב שאדע אם יש לכם רגישות לחומרים, אילו תרופות אתם נוטלים דרך
                  קבע ואילו מחלות רקע יש לכם. אפשר לשלוח את המידע מראש בוואטסאפ — זה חוסך זמן
                  בקליניקה ומאפשר לי להגיע מוכנה. לביטול תור, אנא הודיעו לפחות 24 שעות מראש כדי
                  שאוכל לפנות את המקום למטופל אחר שממתין.
                </p>
              </div>

              <div
                style={{
                  marginTop: "48px",
                  paddingTop: "34px",
                  borderTop: "1px solid #E2DFD8",
                }}
              >
                <div
                  style={{
                    fontFamily: BODONI,
                    fontSize: "13px",
                    letterSpacing: "0.4em",
                    color: "#726B5E",
                    marginLeft: "-0.4em",
                    marginBottom: "14px",
                  }}
                >
                  A PERSONAL NOTE
                </div>
                <p
                  style={{
                    fontSize: "15.5px",
                    lineHeight: 2.1,
                    color: "#4E4E4E",
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  מעבר להיותי פדיקוריסטית אני אמא לשלוש בנות — אגם, אביגיל ואודיה. לכן אני עובדת
                  בשעות קבועות, מתחייבת לזמן הטיפול שלכם בלי הפרעות, ועונה בוואטסאפ בין המטופלים. אם
                  אני לא עונה ברגע זה, זה משום שאני באמצע טיפול — ואחזור אליכם באותו יום.
                </p>
              </div>
            </div>
          </section>

          {/* Dark contact band + form */}
          <section style={{ background: "#0C2B23", padding: "120px 6%" }}>
            <div
              className="ipc-grid"
              style={{
                maxWidth: "1050px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "90px",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  className="ipc-display"
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
                  GET IN TOUCH
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
                    margin: "0 0 44px",
                  }}
                >
                  מטופלים — לתיאום אבחון בקליניקה ב{site.city}.
                  <br />
                  פדיקוריסטיות — לשיחת התאמה על ההכשרה הבאה.
                </p>
                <div style={{ display: "grid", gap: "22px" }}>
                  <DarkRow
                    label="וואטסאפ"
                    href={site.whatsappUrl}
                    external
                    value="שיחה ישירה עם ענבר"
                  />
                  <DarkRow label="טלפון" href={site.telUrl} value={site.phoneDisplay} big />
                  <DarkRow label="דוא״ל" href={`mailto:${site.email}`} value={site.email} />
                  <DarkRow
                    label="קליניקה"
                    href={site.wazeUrl}
                    external
                    value={`${site.city}, ${site.region} — ניווט ב-Waze ←`}
                  />
                  <DarkRow label="שעות" value={`${site.hoursDisplay} · שישי-שבת סגור`} />
                </div>
              </div>

              <div className="ipc-card" style={{ background: "#FFFFFF", padding: "56px 50px" }}>
                <ContactForm note="אפשר גם להתקשר או לשלוח וואטסאפ — מה שנוח לכם." />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="ipc-section" style={{ background: "#FFFFFF", padding: "110px 6%" }}>
            <div style={{ maxWidth: "780px", margin: "0 auto" }}>
              <Eyebrow>FAQ</Eyebrow>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: "28px",
                  margin: "0 0 44px",
                  color: "#141414",
                }}
              >
                שאלות נפוצות לפני תיאום תור
              </h2>
              <div style={{ borderTop: "1px solid #ECEAE6" }}>
                {FAQS.map((faq) => (
                  <details
                    key={faq.q}
                    style={{ borderBottom: "1px solid #ECEAE6", padding: "26px 4px" }}
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
              <p
                style={{
                  marginTop: "40px",
                  fontSize: "13px",
                  lineHeight: 1.95,
                  color: "#6B6B6B",
                  fontWeight: 300,
                }}
              >
                המידע בעמוד זה הסברתי בלבד ואינו מחליף בדיקה אישית או ייעוץ רפואי. בפצע פתוח, חשד
                לזיהום או סוכרת לא מאוזנת — פנו להערכה מקדימה לפני כל טיפול.
              </p>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function DarkRow({
  label,
  value,
  href,
  external,
  big,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  big?: boolean;
}) {
  const inner = (
    <>
      <span
        style={{
          fontSize: "12px",
          letterSpacing: "0.3em",
          color: "#7E9A8E",
          minWidth: "84px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: 300,
          fontSize: big ? "23px" : "16px",
          letterSpacing: big ? "0.06em" : "normal",
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </>
  );
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    gap: "18px",
    borderBottom: "1px solid rgba(255,255,255,0.34)",
    paddingBottom: "18px",
  };
  if (!href) {
    return <div style={{ ...style, color: "#B9C9C0" }}>{inner}</div>;
  }
  return (
    <a
      className="ipc-link"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener nofollow" : undefined}
      style={{ ...style, color: "#FFFFFF" }}
    >
      {inner}
    </a>
  );
}
