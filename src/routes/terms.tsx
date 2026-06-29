import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { SITE } from "@/lib/site-config";

const PAGE_URL = `${SITE.url}/terms`;
const TITLE = `תנאי שימוש ותקנון האתר | ${SITE.brand}`;
const DESCRIPTION =
  "תנאי השימוש באתר ענבר פרחי. הבהרות לגבי טיפולים, מדיניות ביטולים, אחריות, פרטיות וזכויות יוצרים בקליניקת הפדיקור הטיפולי.";

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
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: TermsPage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. כללי",
    body: [
      "ברוכים הבאים לאתר ענבר פרחי, פדיקור טיפולי (להלן: האתר). השימוש באתר ובכל התכנים המופיעים בו כפוף לתנאי השימוש המפורטים להלן. עצם הגלישה באתר או קביעת תור מהווים הסכמה לתנאים אלה במלואם.",
      "האתר מספק מידע על הקליניקה, שירותי הפדיקור הטיפולי, מדריכים וכלי תיאום פגישות. המידע מבוסס על ניסיון קליני של 12+ שנים בקליניקה לטיפוח כף הרגל ומיועד לציבור הרחב בישראל.",
    ],
  },
  {
    title: "2. אופי הטיפול והגבלת אחריות",
    body: [
      "פדיקור טיפולי הוא תחום מקצועי מובהק לטיפול בכף הרגל. במקרים מורכבים (פצע פתוח, חשד לזיהום, סוכרת לא מאוזנת, מחלות כלי דם או כל סימן אזהרה אחר) יש לתאם הערכה מקדימה בקליניקה לפני הטיפול.",
      "התכנים, המאמרים והמדריכים באתר נכתבים על בסיס ניסיון קליני ופרוטוקולים מקצועיים (איכילוב, אגודת אייל), והם בעלי אופי הסברתי, מבלי להחליף בדיקה אישית בקליניקה.",
      "המטופל/ת מתחייב/ת ליידע את המטפלת על מצבים רפואיים רלוונטיים (סוכרת, נטילת מדלילי דם, מחלות עור, אלרגיות וכד׳) טרם תחילת הטיפול.",
      "ענבר פרחי לא תישא באחריות לנזק שייגרם כתוצאה ממידע שלא נמסר, מהפרת הנחיות לטיפול ביתי, או משימוש במידע מהאתר ללא בדיקה אישית.",
    ],
  },
  {
    title: "3. תיאום, ביטול והעברת פגישות",
    body: [
      "תיאום תור נעשה דרך וואטסאפ, טלפון או טופס יצירת הקשר באתר. תור נחשב מאושר רק לאחר אישור מצד הקליניקה.",
      "ניתן לבטל או להעביר תור ללא עלות עד 24 שעות לפני המועד. ביטול בטווח קצר מ־24 שעות או אי־הגעה עשויים לחייב בתשלום מלא של הטיפול.",
      "במקרה של חולי, חום או חשד למחלה מדבקת — אנא יידעו אותי בהקדם, ונקבע מועד חלופי בלי חיוב.",
    ],
  },
  {
    title: "4. תשלום ותעריפים",
    body: [
      "התעריפים בקליניקה מתעדכנים מעת לעת ומפורסמים בשיחת התיאום. התשלום מתבצע בסיום הטיפול במזומן, בהעברה בנקאית או בביט.",
      "חשבונית מס/קבלה כדין תונפק לכל תשלום ותישלח לפי בקשה.",
    ],
  },
  {
    title: "5. פרטיות וצילומי תיעוד",
    body: [
      "פרטי המטופלים, ההיסטוריה הרפואית הרלוונטית והתמונות שצולמו בקליניקה נשמרים בסודיות מלאה ומשמשים לצורכי טיפול והמשך מעקב בלבד.",
      "תמונות לפני/אחרי מתפרסמות באתר וברשתות החברתיות אך ורק לאחר קבלת אישור מפורש מהמטופל/ת. ניתן לבטל את ההסכמה בכל עת.",
      "מדיניות איסוף המידע המלאה מפורטת בעמוד מדיניות הפרטיות.",
    ],
  },
  {
    title: "6. קניין רוחני",
    body: [
      "כל התכנים באתר, לרבות טקסטים, תמונות, סרטונים ועיצוב, הם רכושו של ענבר פרחי ומוגנים בזכויות יוצרים.",
      "אין להעתיק, לשכפל, להפיץ או לפרסם תוכן מהאתר ללא אישור מראש ובכתב. ציטוט קצר עם קישור למקור מותר.",
    ],
  },
  {
    title: "7. שינויים בתנאים",
    body: [
      "האתר רשאי לשנות את תנאי השימוש בכל עת. השינויים יכנסו לתוקף עם פרסומם באתר. המשך השימוש באתר לאחר השינוי מהווה הסכמה לתנאים המעודכנים.",
    ],
  },
  {
    title: "8. דין ושיפוט",
    body: [
      "על תנאי שימוש אלה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל מחלוקת תהיה לבתי המשפט המוסמכים במחוז ירושלים.",
    ],
  },
  {
    title: "9. יצירת קשר",
    body: [
      `לכל שאלה בנוגע לתנאי השימוש ניתן לפנות בטלפון ${SITE.phoneDisplay} או בדוא"ל ${SITE.email}.`,
    ],
  },
];

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "תנאי שימוש" }]} />
        <article
          className="relative overflow-hidden"
          style={{ background: "var(--paper)" }}
        >
          <BrandHeroBackdrop label="LEGAL · 00" showHalftone={false} />
          <div className="relative mx-auto max-w-[820px] px-6 py-14 md:px-10 md:py-20">
            <div className="mb-6 flex items-center gap-3">
              <BrandEyebrow>מסמכים משפטיים</BrandEyebrow>
              <span aria-hidden className="h-px w-12" style={{ background: "var(--green-400)" }} />
            </div>
            <h1
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--green-700)",
              }}
            >
              תנאי שימוש
            </h1>
            <p className="mb-10" style={{ color: "var(--ink-600)", fontSize: 13 }}>
              עודכן לאחרונה: מאי 2026
            </p>
            <div className="space-y-10" style={{ color: "var(--ink-900)", fontSize: "1rem", lineHeight: 1.85 }}>
              {sections.map((s) => (
                <section key={s.title}>
                  <h2
                    className="mb-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                      color: "var(--ink-900)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.title}
                  </h2>
                  {s.body.map((p, i) => (
                    <p key={i} className="mb-3" style={{ color: "var(--ink-600)" }}>
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