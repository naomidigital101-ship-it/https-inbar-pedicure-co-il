import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";

/* עיצוב לפי מערכת המותג של דף הבית: ללא רדיוס, ללא צל, קווי שיער בלבד. */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const PAGE_URL = `${SITE.url}/terms`;
const TITLE = `תנאי שימוש ותקנון האתר | ${SITE.brand}`;
const DESCRIPTION =
  "תנאי השימוש באתר ענבר פרחי, פדיקור טיפולי בעלי. הבהרות לגבי אופי הטיפול, תיאום וביטול תורים, תשלום, פרטיות וזכויות יוצרים.";

const LEGAL_CSS = `
.ipl { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
@media (max-width: 900px) {
  .ipl-section { padding-top:70px !important; padding-bottom:70px !important; }
}
@media (max-width: 560px) {
  .ipl-h1 { font-size:32px !important; }
}
`;

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "stylesheet", href: FONTS_HREF },
    ],
  }),
  component: TermsPage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. כללי",
    body: [
      "ברוכים הבאים לאתר ענבר פרחי, פדיקור טיפולי (להלן: האתר). השימוש באתר ובכל התכנים המופיעים בו כפוף לתנאי השימוש המפורטים להלן. עצם הגלישה באתר או תיאום תור מהווים הסכמה לתנאים אלה במלואם.",
      "האתר מספק מידע על הקליניקה בעלי, אזור בנימין, על שירותי הפדיקור הטיפולי, מדריכים מקצועיים וכלי תיאום פגישות. המידע מבוסס על 12+ שנות ניסיון קליני בטיפול בכף הרגל ומיועד לציבור הרחב בישראל.",
    ],
  },
  {
    title: "2. אופי הטיפול והגבלת אחריות",
    body: [
      "פדיקור טיפולי הוא תחום מקצועי לטיפול בכף הרגל, ואינו טיפול רפואי ואינו מחליף אבחון או ייעוץ של רופא. במקרים מורכבים — פצע פתוח, חשד לזיהום, סוכרת לא מאוזנת, מחלות כלי דם או כל סימן אזהרה אחר — יש לתאם הערכה מקדימה בקליניקה לפני הטיפול, ובמידת הצורך לפנות לרופא מטפל.",
      "התכנים, המאמרים והמדריכים באתר נכתבים על בסיס ניסיון קליני ופרוטוקולים מקצועיים (איכילוב, אגודת אייל). הם הסברתיים באופיים ואינם מחליפים בדיקה אישית בקליניקה.",
      "המטופל/ת מתחייב/ת ליידע את המטפלת על מצבים רפואיים רלוונטיים — סוכרת, נטילת מדללי דם, מחלות עור, אלרגיות וכדומה — לפני תחילת הטיפול.",
      "ענבר פרחי לא תישא באחריות לנזק שנגרם כתוצאה ממידע שלא נמסר, מהפרת הנחיות לטיפול ביתי, או משימוש במידע מהאתר ללא בדיקה אישית.",
    ],
  },
  {
    title: "3. תיאום, ביטול והעברת פגישות",
    body: [
      "תיאום תור נעשה בוואטסאפ, בטלפון או בטופס יצירת הקשר באתר. תור נחשב מאושר רק לאחר אישור מצד הקליניקה.",
      "ניתן לבטל או להעביר תור ללא עלות עד 24 שעות לפני המועד. ביטול בטווח קצר מ-24 שעות או אי-הגעה עשויים לחייב בתשלום מלא של הטיפול.",
      "במקרה של חולי, חום או חשד למחלה מדבקת — אנא הודיעו בהקדם, ונקבע מועד חלופי בלי חיוב.",
    ],
  },
  {
    title: "4. תשלום ותעריפים",
    body: [
      "התעריפים בקליניקה מתעדכנים מעת לעת ונמסרים בשיחת התיאום. התשלום מתבצע בסיום הטיפול במזומן, בהעברה בנקאית או בביט.",
      "חשבונית מס או קבלה כדין מונפקת לכל תשלום ונשלחת לפי בקשה.",
    ],
  },
  {
    title: "5. פרטיות וצילומי תיעוד",
    body: [
      "פרטי המטופלים, ההיסטוריה הרפואית הרלוונטית והתמונות שצולמו בקליניקה נשמרים בסודיות ומשמשים לצורכי טיפול ומעקב בלבד.",
      "תמונות לפני ואחרי מתפרסמות באתר וברשתות החברתיות רק לאחר קבלת אישור מפורש מהמטופל/ת. ניתן לבטל את ההסכמה בכל עת.",
      "מדיניות איסוף המידע המלאה מפורטת בעמוד מדיניות הפרטיות.",
    ],
  },
  {
    title: "6. קניין רוחני",
    body: [
      "כל התכנים באתר, לרבות טקסטים, תמונות, סרטונים ועיצוב, הם רכושה של ענבר פרחי ומוגנים בזכויות יוצרים.",
      "אין להעתיק, לשכפל, להפיץ או לפרסם תוכן מהאתר ללא אישור מראש ובכתב. ציטוט קצר עם קישור למקור מותר.",
    ],
  },
  {
    title: "7. שינויים בתנאים",
    body: [
      "האתר רשאי לשנות את תנאי השימוש בכל עת. השינויים ייכנסו לתוקף עם פרסומם באתר. המשך השימוש באתר לאחר השינוי מהווה הסכמה לתנאים המעודכנים.",
    ],
  },
  {
    title: "8. דין ושיפוט",
    body: [
      "על תנאי שימוש אלה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל מחלוקת תהיה נתונה לבתי המשפט המוסמכים במחוז ירושלים.",
    ],
  },
  {
    title: "9. יצירת קשר",
    body: [
      `לכל שאלה בנוגע לתנאי השימוש ניתן לפנות בטלפון ${SITE.phoneDisplay} או בדוא״ל ${SITE.email}.`,
    ],
  },
];

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: LEGAL_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ipl flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "תנאי שימוש" }]} />
        <article className="ipl-section" style={{ background: "#FFFFFF", padding: "90px 6%" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
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
              LEGAL
            </div>
            <h1
              className="ipl-h1"
              style={{
                fontWeight: 700,
                fontSize: "40px",
                lineHeight: 1.3,
                margin: "0 0 14px",
                color: "#141414",
              }}
            >
              תנאי שימוש
            </h1>
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "0.08em",
                color: "#6B6B6B",
                fontWeight: 300,
                margin: "0 0 56px",
              }}
            >
              עודכן לאחרונה: ספטמבר 2026
            </p>
            <div style={{ borderTop: "1px solid #ECEAE6" }}>
              {sections.map((s) => (
                <section
                  key={s.title}
                  style={{ borderBottom: "1px solid #ECEAE6", padding: "40px 0" }}
                >
                  <h2
                    style={{
                      fontWeight: 600,
                      fontSize: "19px",
                      letterSpacing: "0.04em",
                      color: "#141414",
                      margin: "0 0 18px",
                    }}
                  >
                    {s.title}
                  </h2>
                  {s.body.map((p) => (
                    <p
                      key={p.slice(0, 24)}
                      style={{
                        fontSize: "15.5px",
                        lineHeight: 2.05,
                        color: "#4E4E4E",
                        fontWeight: 300,
                        margin: "0 0 14px",
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
