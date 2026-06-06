import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/terms`;
const TITLE = "תנאי שימוש | הרוכב העצלן";
const DESCRIPTION =
  "תנאי השימוש באתר הרוכב העצלן. הבהרות לגבי שימוש במידע, אחריות הרוכב, קישורי שותפים וזכויות יוצרים.";

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
      "ברוכים הבאים לאתר הרוכב העצלן (להלן: האתר). השימוש באתר ובכל התכנים המופיעים בו כפוף לתנאי השימוש המפורטים להלן. עצם הגלישה באתר מהווה הסכמה לתנאים אלה במלואם.",
      "האתר מספק מידע, מדריכים, ביקורות וטיפים בנושא רכיבת אופנועי שטח. המידע מיועד לרוכבים בישראל בלבד.",
    ],
  },
  {
    title: "2. הגבלת אחריות",
    body: [
      "התכנים באתר מבוססים על ניסיון אישי, מקורות פתוחים ומידע ציבורי. אין לראות בהם תחליף ליעוץ מקצועי של מכונאי מוסמך, מדריך רכיבה או יצרן האופנוע.",
      "רכיבה על אופנוע שטח כרוכה בסיכון פיזי ממשי. כל פעולת תחזוקה, בחירת ציוד או טכניקת רכיבה שמופיעה באתר נעשית על אחריותו הבלעדית של הרוכב.",
      "הרוכב העצלן לא ישא באחריות לכל נזק ישיר או עקיף, גופני או רכושי, שייגרם כתוצאה משימוש במידע באתר.",
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
      "כל התכנים באתר, לרבות טקסטים, תמונות, סרטונים ועיצוב, הם רכושו של הרוכב העצלן ומוגנים בזכויות יוצרים.",
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
        <article className="border-b border-[#222] bg-[#0a0a0a]">
          <div className="mx-auto max-w-[760px] px-4 py-14 md:px-8 md:py-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
                מסמכים משפטיים
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-[#222]" />
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight text-[#f0f0f0] md:text-5xl">
              תנאי שימוש
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