import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";

/* עיצוב לפי מערכת המותג של דף הבית: ללא רדיוס, ללא צל, קווי שיער בלבד. */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const SITE_URL = "https://inbar-pedicure.co.il";
const PAGE_URL = `${SITE_URL}/privacy`;
const TITLE = "מדיניות פרטיות | ענבר פרחי";
const DESCRIPTION =
  "מדיניות הפרטיות של אתר ענבר פרחי. איזה מידע נאסף, למה הוא משמש, ואיך אפשר לבקש לעיין בו, לתקן אותו או למחוק אותו.";

const LEGAL_CSS = `
.ipl { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
@media (max-width: 900px) {
  .ipl-section { padding-top:70px !important; padding-bottom:70px !important; }
}
@media (max-width: 560px) {
  .ipl-h1 { font-size:32px !important; }
}
`;

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. מבוא",
    body: [
      "אנו באתר ענבר פרחי מכבדים את פרטיות המשתמשים. מסמך זה מסביר איזה מידע נאסף, איך אנו משתמשים בו, ואילו זכויות עומדות לכם בנוגע למידע שלכם.",
      "המדיניות נכתבה בהתאם לחוק הגנת הפרטיות, התשמ״א-1981 ולתקנותיו.",
    ],
  },
  {
    title: "2. איזה מידע אנו אוספים",
    body: [
      "כתובת דואר אלקטרוני: כאשר אתם נרשמים לקבלת הצ׳קליסט או לרשימת התפוצה, אנו שומרים את כתובת המייל שלכם.",
      "פרטי יצירת קשר: שם, טלפון, אימייל ותוכן ההודעה שאתם בוחרים לשלוח בטופס יצירת הקשר או במייל.",
      "נתוני שימוש אנונימיים: דפדפן, מערכת הפעלה, עמודים שנצפו, זמני שהייה ומקור ההגעה לאתר. נתונים אלה אינם מזהים אתכם אישית.",
      "מידע רפואי שנמסר בקליניקה נשמר בנפרד מהאתר, לצורכי טיפול ומעקב בלבד, ואינו נאסף דרך האתר.",
    ],
  },
  {
    title: "3. למה המידע משמש",
    body: [
      "שליחת תכנים שביקשתם, כגון הצ׳קליסט וניוזלטר.",
      "מענה לפניות שלכם ותיאום פגישות.",
      "שיפור האתר, התכנים וחוויית הגלישה.",
      "עמידה בדרישות החוק.",
    ],
  },
  {
    title: "4. Cookies (עוגיות)",
    body: [
      "האתר משתמש בעוגיות טכניות הנדרשות לתפעולו התקין, ובעוגיות אנליטיקס המאפשרות להבין איך משתמשים באתר. ניתן לחסום עוגיות בהגדרות הדפדפן, אך הדבר עלול לפגוע בחוויית השימוש.",
    ],
  },
  {
    title: "5. שירותי צד שלישי",
    body: [
      "האתר מתארח בתשתית ענן (Lovable Cloud / Supabase) שמאחסנת את המידע באופן מאובטח.",
      "האתר טוען גופנים משירות Google Fonts, אשר עשוי לאסוף נתונים סטטיסטיים על הטעינה.",
      "איננו מוכרים ואיננו מעבירים את פרטיכם לצדדים שלישיים לצורכי שיווק.",
    ],
  },
  {
    title: "6. אבטחת מידע",
    body: [
      "אנו נוקטים באמצעי אבטחה סבירים להגנה על המידע, לרבות הצפנת תעבורה (HTTPS) וגישה מוגבלת. עם זאת, אין מערכת מוגנת באופן מוחלט, ולא ניתן להבטיח אבטחה מושלמת.",
    ],
  },
  {
    title: "7. הזכויות שלכם",
    body: [
      "בכל עת תוכלו לפנות אלינו ולבקש לעיין במידע השמור עליכם, לתקן אותו או למחוק אותו.",
      "בכל מייל שאנו שולחים יש קישור להסרה מרשימת התפוצה.",
      "לפניות בנושא פרטיות, מימוש זכויות או הסרת מידע: inbar.pedicure@gmail.com או בטלפון 050-666-8595.",
    ],
  },
  {
    title: "8. שינויים במדיניות",
    body: [
      "אנו רשאים לעדכן את מדיניות הפרטיות מעת לעת. עדכונים מהותיים יפורסמו באתר וייכנסו לתוקף עם פרסומם.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: LEGAL_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ipl flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "מדיניות פרטיות" }]} />
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
              PRIVACY
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
              מדיניות פרטיות
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
