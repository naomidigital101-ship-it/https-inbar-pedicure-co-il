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

        <article className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div className="mx-auto max-w-[820px] px-4 py-14 md:px-8 md:py-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">אודות</span>
              <span aria-hidden className="h-px w-12 bg-[#b8dcd4]" />
            </div>

            <h1 className="mb-8 text-4xl font-black leading-tight text-[#1d3a35] md:text-5xl">
              היי, אני ענבר
            </h1>

            <figure className="mb-12 overflow-hidden rounded-3xl border border-[#b8dcd4] shadow-xl">
              <img
                src={heroAsset.url}
                alt={`${SITE.brand} – פדיקוריסטית טיפולית בקליניקה`}
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
              />
            </figure>

            <div className="space-y-5 text-lg leading-loose text-[#2d4a44]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <section className="mt-14 rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-black text-[#1d3a35]">הכשרה וניסיון</h2>
              <ul className="space-y-3">
                {credentials.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-base text-[#2d4a44]">
                    <span aria-hidden className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#5fa898]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 flex flex-wrap gap-3 border-t border-[#b8dcd4] pt-10">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
              >
                <Phone className="h-4 w-4" aria-hidden /> וואטסאפ
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#5fa898] px-6 py-3 text-sm font-bold text-[#5fa898] transition-colors hover:bg-[#5fa898] hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden /> שלחו לי מייל
              </a>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
