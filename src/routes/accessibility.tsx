import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/accessibility`;
const TITLE = "הצהרת נגישות | הרוכב העצלן";
const DESCRIPTION =
  "הצהרת הנגישות של אתר הרוכב העצלן. אמצעי הנגישות שיושמו, רמת ההתאמה לתקן ת״י 5568, ופרטי קשר לדיווח על תקלות נגישות.";

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
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: AccessibilityPage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. המחויבות שלנו לנגישות",
    body: [
      "אתר הרוכב העצלן רואה בנגישות ערך מרכזי, ומחויב להנגיש את שירותיו ותכניו לכלל המשתמשים, לרבות אנשים עם מוגבלויות.",
      "האתר נבנה בהתאם לתקן הישראלי ת״י 5568 ברמת AA, המבוסס על הנחיות הנגישות הבינלאומיות WCAG 2.1.",
    ],
  },
  {
    title: "2. אמצעי הנגישות באתר",
    body: [
      "מבנה אתר סמנטי עם היררכיית כותרות תקינה (H1, H2, H3) המאפשרת ניווט בעזרת קוראי מסך.",
      "כיוון כתיבה מימין לשמאל (RTL) ותמיכה מלאה בעברית.",
      "ניגודיות צבעים גבוהה בין הטקסט לרקע בהתאם לדרישות התקן.",
      "אפשרות לניווט מלא בעזרת מקלדת בלבד, כולל סמני פוקוס ברורים.",
      "תיאורי alt לכל התמונות באתר, בשפה העברית.",
      "תוויות aria-label לכל הכפתורים והקישורים שאינם מילוליים.",
      "טפסים נגישים עם תוויות מקושרות (label) לכל שדה.",
      "טקסט הניתן להגדלה עד 200 אחוז ללא פגיעה בשימושיות.",
      "מבנה רספונסיבי המתאים לכל גודל מסך ולשימוש בנייד.",
    ],
  },
  {
    title: "3. תכנים שעדיין משופרים",
    body: [
      "אנו פועלים באופן שוטף לשיפור הנגישות באתר. ייתכן כי תכנים מסוימים (כגון תמונות ישנות, מסמכים מצורפים או הטמעות חיצוניות) עדיין אינם נגישים במלואם.",
      "במידה ונתקלתם בבעיית נגישות באתר, נשמח לדעת על כך כדי שנוכל לטפל בה.",
    ],
  },
  {
    title: "4. דפדפנים נתמכים",
    body: [
      "האתר נבדק והוא תומך בגרסאות עדכניות של דפדפנים מובילים: Chrome, Firefox, Safari ו-Edge, הן במחשב והן במכשירים ניידים.",
    ],
  },
  {
    title: "5. דיווח על בעיות נגישות",
    body: [
      "אם נתקלתם בבעיית נגישות באתר, או אם יש לכם הצעה לשיפור, אנא פנו אלינו ונשתדל לטפל בכך בהקדם:",
      "רכזת נגישות: נעמי",
      "דואר אלקטרוני: accessibility@dirt-road-guide.lovable.app",
      "זמן תגובה ממוצע: עד 7 ימי עסקים.",
    ],
  },
  {
    title: "6. עדכון ההצהרה",
    body: [
      "הצהרת נגישות זו עודכנה לאחרונה במאי 2026. אנו בוחנים ומעדכנים אותה מעת לעת בהתאם לשינויים באתר ובתקני הנגישות.",
    ],
  },
];

function AccessibilityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "הצהרת נגישות" }]} />
        <article className="border-b border-[#222] bg-[#0a0a0a]">
          <div className="mx-auto max-w-[760px] px-4 py-14 md:px-8 md:py-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
                נגישות
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-[#222]" />
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight text-[#f0f0f0] md:text-5xl">
              הצהרת נגישות
            </h1>
            <p className="mb-10 text-sm text-[#888]">עודכן לאחרונה: מאי 2026</p>
            <div className="space-y-10 text-base leading-loose text-[#d8d8d8]">
              {sections.map((s) => (
                <section key={s.title}>
                  <h2 className="mb-4 text-xl font-bold text-[#f0f0f0]">{s.title}</h2>
                  {s.body.map((p, i) => (
                    <p key={i} className="mb-3">
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