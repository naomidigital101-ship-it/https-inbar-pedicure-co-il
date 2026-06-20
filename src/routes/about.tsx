import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import {
  BrandHeroBackdrop,
  BrandEyebrow,
  SerifNumber,
} from "@/components/brand/BrandPrimitives";
import { SITE } from "@/lib/site-config";
import heroAsset from "@/assets/inbar-farchi.jpg.asset.json";

const PAGE_URL = `${SITE.url}/about`;
const HERO_ABS = `${SITE.url}${heroAsset.url}`;
const TITLE = `אודות ${SITE.brand} | פדיקוריסטית טיפולית`;
const DESCRIPTION =
  "ענבר פרחי, פדיקוריסטית טיפולית מבית אל עם 12+ שנות ניסיון. מתמחה בטיפול ביבלות, פטרת, ציפורן חודרנית וטיפול עדין לחולי סוכרת. השתלמויות באיכילוב, מרצה ומכשירה.";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  inLanguage: "he-IL",
  url: PAGE_URL,
  mainEntity: {
    "@type": "Person",
    name: SITE.brand,
    jobTitle: "פדיקוריסטית טיפולית",
    description: DESCRIPTION,
    image: HERO_ABS,
    address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: "IL" },
    knowsAbout: ["פדיקור טיפולי", "טיפול ביבלות", "פטרת כף הרגל", "ציפורן חודרנית", "אורטוניקסיה", "טיפול בחולי סוכרת", "שיטת BIO"],
  },
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: HERO_ABS },
      { name: "twitter:image", content: HERO_ABS },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
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

const paragraphs = [
  "נעים מאוד, אני ענבר פרחי – פדיקוריסטית טיפולית המתמחה בטיפול במחלות רגליים, יבלות, פטרת ושיקום ציפורניים בשיטת BIO.",
  "בעיניי טיפול בכף הרגל הוא הרבה מעבר לפינוק. הוא חלק בלתי נפרד מהבריאות הכללית ומאיכות החיים היומיומית. מגיע לכל אדם ללכת בלי כאב, להרגיש נוחות וביטחון בכל צעד.",
  "כל רגל מספרת סיפור אחר, והשליחות שלי היא להבין את מקור הבעיה ולטפל בה מהשורש – לא רק לשפר את המראה, אלא את איכות החיים. אני משלבת ידע קליני, דיוק ואמפתיה, מתוך משיכה אמיתית לעולם הטיפול ורצון לעזור לאנשים.",
  "אני עוברת השתלמויות קבועות בבית החולים איכילוב, מתמחה בטיפול בחולי סוכרת לפי פרוטוקולים קליניים מאושרים, ומרצה לפדיקוריסטיות טיפוליות ברחבי הארץ – להעלות מודעות לכאב שכל כך הרבה אנשים סובלים ממנו בשתיקה.",
  "המטרה שלי פשוטה – להחזיר לכם את הבריאות, הנוחות והקלות בכל צעד.",
];

const journey = [
  {
    age: "בת 14",
    title: "ההתאהבות הראשונה",
    body: "התאהבתי בציפורניים – בפרטים הקטנים, בדיוק, ביופי שנמצא בעבודת יד סבלנית. ידעתי כבר אז שזה העולם שלי.",
  },
  {
    age: "שנות העשרים",
    title: "התמחות בשיטת BIO",
    body: "עברתי דרך עולם הביוטי והתמקצעתי בשיטת BIO לשיקום ציפורניים. חשבתי ששם הסיפור שלי מסתיים – אבל הוא רק התחיל.",
  },
  {
    age: "נקודת המפנה",
    title: "פדיקור טיפולי",
    body: "כשגיליתי את הפדיקור הטיפולי הבנתי – אני לא עוסקת ביופי, אני עוזרת לאנשים ללכת בלי כאב. זה שינה לי את הכל.",
  },
  {
    age: "היום",
    title: "מרצה ומכשירה",
    body: "מעבירה השתלמויות באיכילוב, מרצה לפדיקוריסטיות בכל הארץ, ומלווה מטופלים מורכבים שעברו עשר קליניקות לפניי.",
  },
];

const daughters = [
  { name: "אגם", role: "הבכורה" },
  { name: "אביגיל", role: "האמצעית" },
  { name: "אודיה", role: "הצעירה" },
];

const credentials = [
  "12+ שנות ניסיון בטיפול קליני בכף הרגל",
  "השתלמויות קבועות בבית החולים איכילוב",
  "התמחות בטיפול בחולי סוכרת לפי פרוטוקולים קליניים",
  "התמחות בשיטת BIO לשיקום ציפורניים",
  "מרצה ומכשירה פדיקוריסטיות טיפוליות",
  "200+ טיפולים מוצלחים מסוגים שונים",
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "אודות" }]} />

        <article className="bg-background">
          <section
            className="relative overflow-hidden"
            style={{ background: "var(--paper)" }}
          >
            <BrandHeroBackdrop label="ABOUT · 00" />
            <div className="relative mx-auto grid max-w-[1320px] gap-14 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:items-center md:px-10 md:py-24">
              <div className="order-2 md:order-1">
                <img
                  src={heroAsset.url}
                  alt={`${SITE.brand} – פדיקוריסטית טיפולית בקליניקה`}
                  width={720}
                  height={900}
                  className="relative aspect-[4/5] w-full object-cover"
                  style={{
                    borderRadius: 20,
                    border: "1px solid var(--stone-100)",
                    boxShadow: "0 2px 6px rgba(30,36,34,0.06), 0 18px 40px -24px rgba(30,36,34,0.18)",
                  }}
                />
              </div>
              <div className="order-1 md:order-2">
                <BrandEyebrow withRule>אודות</BrandEyebrow>
                <h1
                  className="mt-5 mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontSize: "clamp(2.4rem, 5.6vw, 4.4rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "var(--green-700)",
                  }}
                >
                  היי, אני ענבר
                </h1>
                <p style={{ color: "var(--ink-600)", fontSize: "1.15rem", lineHeight: 1.7 }}>
                  {paragraphs[0]}
                </p>
              </div>
            </div>
          </section>

          <section style={{ background: "var(--stone-50)", borderTop: "1px solid var(--stone-100)" }} className="py-20">
            <div className="mx-auto max-w-[760px] space-y-6 px-6" style={{ color: "var(--ink-900)", fontSize: "1.05rem", lineHeight: 1.85 }}>
              {paragraphs.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="py-20" style={{ background: "var(--paper)", borderTop: "1px solid var(--stone-100)" }}>
            <div className="mx-auto max-w-[1320px] px-6 md:px-10">
              <header className="mb-12 grid gap-3 md:grid-cols-[110px_1fr] md:items-end md:gap-10">
                <SerifNumber>01</SerifNumber>
                <div>
                  <BrandEyebrow className="mb-3 block">הכשרה וניסיון</BrandEyebrow>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 300,
                      fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: "var(--ink-900)",
                    }}
                  >
                    הרקע המקצועי
                  </h2>
                </div>
              </header>
              <ul
                className="grid gap-px overflow-hidden md:grid-cols-2"
                style={{ background: "var(--stone-100)", borderRadius: 20, border: "1px solid var(--stone-100)" }}
              >
                {credentials.map((c, i) => (
                  <li
                    key={c}
                    className="flex items-start gap-4 p-7"
                    style={{ background: "var(--paper)" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontWeight: 700,
                        fontSize: "1.6rem",
                        color: "var(--green-700)",
                        lineHeight: 1,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span style={{ color: "var(--ink-900)", fontSize: "0.98rem", lineHeight: 1.6 }}>{c}</span>
                  </li>
                ))}
              </ul>

              <div
                className="mt-14 flex flex-wrap justify-center gap-4 pt-12"
                style={{ borderTop: "1px solid var(--stone-100)" }}
              >
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-12 items-center gap-2.5 px-7"
                  style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 15 }}
                >
                  <Phone className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden /> קביעת תור בוואטסאפ
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex h-12 items-center gap-2.5 px-6"
                  style={{
                    background: "transparent",
                    color: "var(--green-700)",
                    border: "1.5px solid var(--green-600)",
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  <Mail className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden /> שלחו לי מייל
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
