import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
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
    scripts: [{ type: "application/ld+json", children: JSON.stringify(personSchema) }],
  }),
  component: AboutPage,
});

const paragraphs = [
  "נעים מאוד, אני ענבר פרחי – פדיקוריסטית טיפולית המתמחה בטיפול במחלות רגליים, יבלות, פטרת ושיקום ציפורניים בשיטת BIO.",
  "בעיניי טיפול בכף הרגל הוא הרבה מעבר לפינוק. הוא חלק בלתי נפרד מהבריאות הכללית ומאיכות החיים היומיומית. מגיע לכל אדם ללכת בלי כאב, להרגיש נוחות וביטחון בכל צעד.",
  "כל רגל מספרת סיפור אחר, והשליחות שלי היא להבין את מקור הבעיה ולטפל בה מהשורש – לא רק לשפר את המראה, אלא את איכות החיים. אני משלבת ידע רפואי, דיוק ואמפתיה, מתוך משיכה אמיתית לעולם הרפואה ורצון לעזור לאנשים.",
  "אני עוברת השתלמויות קבועות בבית החולים איכילוב, מתמחה בטיפול בחולי סוכרת לפי פרוטוקולים רפואיים מאושרים, ומרצה לפדיקוריסטיות טיפוליות ברחבי הארץ – להעלות מודעות לכאב שכל כך הרבה אנשים סובלים ממנו בשתיקה.",
  "המטרה שלי פשוטה – להחזיר לכם את הבריאות, הנוחות והקלות בכל צעד.",
];

const credentials = [
  "12+ שנות ניסיון בטיפול רפואי בכף הרגל",
  "השתלמויות קבועות בבית החולים איכילוב",
  "התמחות בטיפול בחולי סוכרת לפי פרוטוקולים רפואיים",
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
          <div className="mx-auto grid max-w-[1180px] gap-14 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:items-center md:py-28">
            <div className="relative order-2 md:order-1">
              <div aria-hidden className="absolute -inset-5 rounded-[2.5rem] bg-copper-soft opacity-50" />
              <img
                src={heroAsset.url}
                alt={`${SITE.brand} – פדיקוריסטית טיפולית בקליניקה`}
                width={720}
                height={900}
                className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[var(--shadow-elegant)]"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-copper" />
                <span className="kicker">אודות</span>
              </div>
              <h1 className="display mb-6 text-5xl text-ink md:text-6xl">
                היי, אני <span className="display-italic text-primary-deep">ענבר</span>
              </h1>
              <p className="text-xl leading-relaxed text-ink-soft">
                {paragraphs[0]}
              </p>
            </div>
          </div>

          <div className="bg-surface-warm py-20">
            <div className="mx-auto max-w-[760px] space-y-7 px-6 text-lg leading-loose text-ink-soft">
              {paragraphs.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <section className="bg-background py-20">
            <div className="mx-auto max-w-[1180px] px-6">
              <div className="mb-12 flex items-end justify-between gap-6">
                <div>
                  <p className="kicker mb-3">הכשרה וניסיון</p>
                  <h2 className="display text-4xl text-ink md:text-5xl">
                    הרקע <span className="display-italic text-primary-deep">המקצועי</span>
                  </h2>
                </div>
              </div>
              <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2">
                {credentials.map((c, i) => (
                  <li key={c} className="flex items-start gap-4 bg-surface p-7">
                    <span className="display text-3xl text-copper">0{i + 1}</span>
                    <span className="pt-2 text-base leading-relaxed text-ink">{c}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-14 flex flex-wrap justify-center gap-4 border-t border-border pt-12">
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all hover:bg-primary-deep"
                >
                  <Phone className="h-4 w-4" aria-hidden /> קביעת תור בוואטסאפ
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-7 py-4 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-copper" aria-hidden /> שלחו לי מייל
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
