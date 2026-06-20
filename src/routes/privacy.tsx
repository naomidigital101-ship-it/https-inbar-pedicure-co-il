import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { LegalArticle } from "@/components/brand/LegalArticle";

const SITE = "https://inbar-pedicure.co.il";
const PAGE_URL = `${SITE}/privacy`;
const TITLE = "מדיניות פרטיות | ענבר פרחי";
const DESCRIPTION =
  "מדיניות הפרטיות של ענבר פרחי. איזה מידע נאסף עליכם, מה אנחנו עושים איתו, ואיך אתם יכולים לבקש את הסרתו.";

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
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: PrivacyPage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. מבוא",
    body: [
      "אנו באתר ענבר פרחי מכבדים את פרטיות המשתמשים שלנו. מסמך זה מסביר איזה מידע אנו אוספים, איך אנו משתמשים בו, ואיזה זכויות יש לכם בנוגע למידע שלכם.",
      "המדיניות נכתבה בהתאם לחוק הגנת הפרטיות, התשמא 1981 ולתקנותיו.",
    ],
  },
  {
    title: "2. איזה מידע אנו אוספים",
    body: [
      "כתובת דואר אלקטרוני: כאשר אתם נרשמים לקבלת הצקליסט החינמי או לרשימת התפוצה שלנו, אנו שומרים את כתובת המייל שלכם.",
      "נתוני שימוש אנונימיים: דפדפן, מערכת הפעלה, עמודים שנצפו, זמני שהייה ומקור הגעה לאתר. נתונים אלה אינם מזהים אתכם אישית.",
      "מידע שאתם בוחרים לשלוח אלינו: שם, תוכן הודעה ודרכי יצירת קשר כאשר אתם פונים אלינו דרך טופס יצירת קשר או במייל.",
    ],
  },
  {
    title: "3. למה אנו משתמשים במידע",
    body: [
      "שליחת תכנים שביקשתם, כגון הצקליסט והניוזלטר.",
      "שיפור האתר, התכנים והחוויה של הגולשים.",
      "מענה לפניות שלכם.",
      "עמידה בדרישות החוק.",
    ],
  },
  {
    title: "4. Cookies (עוגיות)",
    body: [
      "האתר משתמש בעוגיות טכניות הנדרשות לתפעולו התקין, ובעוגיות אנליטיקס המאפשרות לנו להבין איך משתמשים באתר. ניתן לחסום עוגיות בהגדרות הדפדפן, אך הדבר עלול לפגוע בחוויית השימוש.",
    ],
  },
  {
    title: "5. שירותי צד שלישי",
    body: [
      "האתר מתארח בתשתית ענן (Lovable Cloud / Supabase) שמאחסנת את המידע באופן מאובטח.",
      "האתר טוען גופנים משירות Google Fonts, אשר עשוי לאסוף נתונים סטטיסטיים על הטעינה.",
      "אנו לא מוכרים ולא מעבירים את המייל שלכם לצדדים שלישיים לצרכי שיווק.",
    ],
  },
  {
    title: "6. אבטחת מידע",
    body: [
      "אנו נוקטים באמצעי אבטחה סבירים להגנה על המידע שלכם, לרבות הצפנת תעבורה (HTTPS) וגישה מוגבלת למידע. עם זאת, אין מערכת המוגנת באופן מוחלט, ואיננו יכולים להבטיח אבטחה מושלמת.",
    ],
  },
  {
    title: "7. הזכויות שלכם",
    body: [
      "בכל עת תוכלו לפנות אלינו ולבקש לעיין במידע השמור עליכם, לתקן אותו או למחוק אותו.",
      "בכל מייל שאנו שולחים יש קישור להסרה מרשימת התפוצה.",
      "לפניות בנושא פרטיות, מימוש זכויות, או הסרת מידע: inbar.pedicure@gmail.com או טלפון 050-666-8595.",
    ],
  },
  {
    title: "8. שינויים במדיניות",
    body: [
      "אנו רשאים לעדכן את מדיניות הפרטיות מעת לעת. עדכונים מהותיים יפורסמו באתר ויכנסו לתוקף עם פרסומם.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "מדיניות פרטיות" }]} />
        <LegalArticle title="מדיניות פרטיות" eyebrow="מסמכים משפטיים" label="LEGAL · 00" updated="עודכן לאחרונה: מאי 2026" sections={sections} />
      </main>
      <SiteFooter />
    </div>
  );
}