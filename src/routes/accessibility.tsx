import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";

/* עיצוב לפי מערכת המותג של דף הבית: ללא רדיוס, ללא צל, קווי שיער בלבד. */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const SITE_URL = "https://inbar-pedicure.co.il";
const PAGE_URL = `${SITE_URL}/accessibility`;
const TITLE = "הצהרת נגישות | ענבר פרחי";
const DESCRIPTION =
  "הצהרת הנגישות של אתר ענבר פרחי. אמצעי הנגישות שיושמו, רמת ההתאמה לתקן ת״י 5568, ופרטי קשר לדיווח על תקלות נגישות.";

const LEGAL_CSS = `
.ipl { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
@media (max-width: 900px) {
  .ipl-section { padding-top:70px !important; padding-bottom:70px !important; }
}
@media (max-width: 560px) {
  .ipl-h1 { font-size:32px !important; }
}
`;

export const Route = createFileRoute("/accessibility")({
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
  component: AccessibilityPage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. המחויבות שלנו לנגישות",
    body: [
      "אתר ענבר פרחי רואה בנגישות ערך מרכזי, ומחויב להנגיש את שירותיו ותכניו לכלל המשתמשים, לרבות אנשים עם מוגבלות.",
      "האתר נבנה בהתאם לתקן הישראלי ת״י 5568 ברמת AA, המבוסס על הנחיות הנגישות הבינלאומיות WCAG 2.1.",
    ],
  },
  {
    title: "2. אמצעי הנגישות באתר",
    body: [
      "מבנה אתר סמנטי עם היררכיית כותרות תקינה (H1, H2, H3) המאפשרת ניווט בעזרת קוראי מסך.",
      "כיוון כתיבה מימין לשמאל (RTL) ותמיכה מלאה בעברית.",
      "ניגודיות צבעים גבוהה בין הטקסט לרקע בהתאם לדרישות התקן.",
      "ניווט מלא באמצעות מקלדת בלבד, כולל סמני פוקוס ברורים.",
      "תיאורי alt בעברית לכל התמונות באתר.",
      "תוויות aria-label לכל הכפתורים והקישורים שאינם מילוליים.",
      "טפסים נגישים עם תוויות (label) מקושרות לכל שדה.",
      "טקסט הניתן להגדלה עד 200 אחוז ללא פגיעה בשימושיות.",
      "מבנה רספונסיבי המתאים לכל גודל מסך ולשימוש בנייד.",
    ],
  },
  {
    title: "3. נגישות הקליניקה",
    body: [
      "הקליניקה בעלי, אזור בנימין, נגישה בהגעה ברכב ובחניה חופשית בסמוך. הכניסה מותאמת גם למטופלים עם ניידות מוגבלת.",
      "אם יש לכם צורך נגישות מיוחד לקראת הפגישה, אנא ציינו זאת בתיאום התור כדי שנוכל להיערך מראש.",
    ],
  },
  {
    title: "4. תכנים שעדיין משופרים",
    body: [
      "אנו פועלים באופן שוטף לשיפור הנגישות באתר. ייתכן שתכנים מסוימים — תמונות ישנות, מסמכים מצורפים או הטמעות חיצוניות — עדיין אינם נגישים במלואם.",
      "אם נתקלתם בבעיית נגישות באתר, נשמח לדעת על כך כדי שנוכל לטפל בה.",
    ],
  },
  {
    title: "5. דפדפנים נתמכים",
    body: [
      "האתר נבדק ותומך בגרסאות עדכניות של הדפדפנים המובילים: Chrome, Firefox, Safari ו-Edge, במחשב ובמכשירים ניידים.",
    ],
  },
  {
    title: "6. דיווח על בעיות נגישות",
    body: [
      "אם נתקלתם בבעיית נגישות באתר, או אם יש לכם הצעה לשיפור, אנא פנו אליי ואטפל בכך בהקדם:",
      "רכזת הנגישות: ענבר פרחי, בעלת הקליניקה",
      "טלפון: 050-666-8595",
      "דואר אלקטרוני: inbar.pedicure@gmail.com",
      "זמן תגובה ממוצע: עד 7 ימי עסקים.",
    ],
  },
  {
    title: "7. עדכון ההצהרה",
    body: [
      "הצהרת נגישות זו עודכנה לאחרונה בספטמבר 2026. אנו בוחנים ומעדכנים אותה מעת לעת בהתאם לשינויים באתר ובתקני הנגישות.",
    ],
  },
];

function AccessibilityPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: LEGAL_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ipl flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "הצהרת נגישות" }]} />
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
              ACCESSIBILITY
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
              הצהרת נגישות
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
