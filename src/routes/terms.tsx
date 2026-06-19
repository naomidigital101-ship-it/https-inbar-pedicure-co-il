import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";

const SITE = "https://inbar-farchi.lovable.app";
const PAGE_URL = `${SITE}/terms`;
const TITLE = "תנאי שימוש | ענבר פרחי";
const DESCRIPTION =
  "תנאי השימוש באתר ענבר פרחי. הבהרות לגבי שימוש במידע, אחריות הרוכב, קישורי שותפים וזכויות יוצרים.";

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
      "ברוכים הבאים לאתר ענבר פרחי (להלן: האתר). השימוש באתר ובכל התכנים המופיעים בו כפוף לתנאי השימוש המפורטים להלן. עצם הגלישה באתר מהווה הסכמה לתנאים אלה במלואם.",
      "האתר מספק מידע, מדריכים, ביקורות וטיפים בנושא רכיבת אופנועי שטח. המידע מיועד לרוכבים בישראל בלבד.",
    ],
  },
  {
    title: "2. הגבלת אחריות",
    body: [
      "התכנים באתר מבוססים על ניסיון אישי, מקורות פתוחים ומידע ציבורי. אין לראות בהם תחליף ליעוץ מקצועי של מכונאי מוסמך, מדריך רכיבה או יצרן האופנוע.",
      "רכיבה על אופנוע שטח כרוכה בסיכון פיזי ממשי. כל פעולת תחזוקה, בחירת ציוד או טכניקת רכיבה שמופיעה באתר נעשית על אחריותו הבלעדית של הרוכב.",
      "ענבר פרחי לא ישא באחריות לכל נזק ישיר או עקיף, גופני או רכושי, שייגרם כתוצאה משימוש במידע באתר.",
    ],
  },
  {
    title: "3. קישורי שותפים",
    body: [
      "חלק מהקישורים באתר הם קישורי שותפים (affiliate links). כאשר רוכשים מוצר דרך קישור כזה, האתר עשוי לקבל עמלה מהמוכר ללא עלות נוספת לקונה.",
      "ההמלצות באתר אינן מושפעות מהעמלות, ואנו ממליצים רק על מוצרים שאנו מאמינים בהם.",
    ],
  },
  {
    title: "4. קניין רוחני",
    body: [
      "כל התכנים באתר, לרבות טקסטים, תמונות, סרטונים ועיצוב, הם רכושו של ענבר פרחי ומוגנים בזכויות יוצרים.",
      "אין להעתיק, לשכפל, להפיץ או לפרסם תוכן מהאתר ללא אישור מראש ובכתב.",
    ],
  },
  {
    title: "5. שינויים בתנאים",
    body: [
      "האתר רשאי לשנות את תנאי השימוש בכל עת. השינויים יכנסו לתוקף עם פרסומם באתר. המשך השימוש באתר לאחר השינוי מהווה הסכמה לתנאים המעודכנים.",
    ],
  },
  {
    title: "6. דין ושיפוט",
    body: [
      "על תנאי שימוש אלה יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל מחלוקת תהיה לבתי המשפט המוסמכים במחוז ירושלים.",
    ],
  },
  {
    title: "7. יצירת קשר",
    body: [
      "לכל שאלה בנוגע לתנאי השימוש ניתן לפנות אלינו בכתובת hello@dirt-road-guide.lovable.app.",
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