import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { BODONI, C, LatinEyebrow, READ_MORE_LINK } from "@/components/article/editorial";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { useSite } from "@/lib/use-site";
import { SITE, KNOWLEDGE_CATEGORIES_NAV } from "@/lib/site-config";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";

const PAGE_URL = `${SITE.url}/knowledge`;
const TITLE = `מרכז הידע — מדריכים מקצועיים בפדיקור טיפולי | ${SITE.brand}`;
const DESCRIPTION =
  "מרכז הידע של ענבר פרחי: מאמרים ומדריכים על יבלות, פטרת, ציפורן חודרנית, סוכרת, סדקים בעקב, מניעה ותחזוקה — בשפה ברורה ומבוססת ניסיון קליני.";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "foot-care":
    "שגרת טיפוח יומית, גזירת ציפורניים נכונה, סדקים בעקב ועור יבש — מה עובד ומה רק נשמע טוב.",
  conditions:
    "פטרת ציפורן, יבלות ויראליות, ציפורן חודרנית, דורבן וכאבי עקב — זיהוי מבדל ופרוטוקולי טיפול.",
  "diabetic-foot": "פדיקור בטוח לחולי סוכרת — סטריליות, בדיקה יומית וזיהוי סימני אזהרה בזמן.",
  treatments:
    "אורטוניקסיה, שיקום ציפורן BIO, הסרת יבלות והביקור הראשון בקליניקה — מה באמת קורה בטיפול.",
  footwear: "איך לבחור נעליים, מתי צריך מדרסים, נעלי ריצה ונעליים לעבודה ממושכת — בלי שיווק.",
  "sports-feet":
    "ספורטאים, רצים, חיילים ומילואימניקים — שלפוחיות, שין ספלינטס וטיפול בכף רגל בעומס.",
};

export const Route = createFileRoute("/knowledge")({
  loader: async () => {
    const articles = await listPublishedAiArticleCards();
    return { articles };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "בית", item: SITE.url + "/" },
            { "@type": "ListItem", position: 2, name: "מרכז הידע", item: PAGE_URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "מרכז הידע",
          description: DESCRIPTION,
          url: PAGE_URL,
          isPartOf: { "@type": "WebSite", name: SITE.brand, url: SITE.url },
        }),
      },
    ],
  }),
  component: KnowledgeIndex,
});

function KnowledgeIndex() {
  const site = useSite();
  const { articles } = Route.useLoaderData();
  return (
    <div style={{ background: C.paper }}>
      <SiteHeader />
      <main id="main-content">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "מרכז הידע" }]} />

        <section style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }}>
          <div className="mx-auto max-w-[900px] px-[6%] py-20 text-center md:py-28">
            <LatinEyebrow tracking="0.5em" fontSize={15} className="mb-5">
              Knowledge
            </LatinEyebrow>
            <h1
              style={{
                fontWeight: 700,
                fontSize: "clamp(2rem, 4.4vw, 3rem)",
                lineHeight: 1.3,
                color: C.ink,
                margin: "0 0 20px",
                textWrap: "balance",
              }}
            >
              ידע מקצועי על בריאות כף הרגל,
              <br />
              בשפה שכולם מבינים
            </h1>
            <p
              style={{
                fontWeight: 300,
                fontSize: "1.05rem",
                lineHeight: 2,
                color: C.muted,
                margin: "0 auto",
                maxWidth: 640,
              }}
            >
              מאמרים, מדריכים ותשובות בנושאי כף הרגל. בחרו קטגוריה כדי להתחיל.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1150px] px-[6%] py-24 md:py-28">
          <div className="mb-16 text-center">
            <LatinEyebrow tracking="0.5em" fontSize={15} className="mb-4">
              Topics
            </LatinEyebrow>
            <h2 style={{ fontWeight: 700, fontSize: "1.75rem", color: C.ink, margin: 0 }}>
              קטגוריות מרכז הידע
            </h2>
          </div>

          <div
            className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: C.line, border: `1px solid ${C.line}` }}
          >
            {KNOWLEDGE_CATEGORIES_NAV.map((c, idx) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                aria-label={`לקטגוריית ${c.label}`}
                className="flex flex-col items-center gap-4 px-8 py-12 text-center transition-colors hover:bg-[#F7F5F1]"
                style={{ background: C.paper }}
              >
                <span style={{ fontFamily: BODONI, fontSize: "1.6rem", color: C.taupe }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 style={{ fontWeight: 600, fontSize: 18, color: C.ink, lineHeight: 1.6 }}>
                  {c.label}
                </h3>
                <p
                  style={{ color: C.mutedSoft, fontSize: 14.5, lineHeight: 1.95, fontWeight: 300 }}
                >
                  {CATEGORY_DESCRIPTIONS[c.slug] ?? "מאמרים ומדריכים בנושא."}
                </p>
                <span style={{ ...READ_MORE_LINK, marginTop: 8 }}>לקטגוריה</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1150px] px-[6%] pb-24">
          <LeadMagnet />
        </section>

        {articles.length > 0 ? (
          <section className="mx-auto max-w-[1150px] px-[6%] pb-28">
            <div className="mb-16 text-center">
              <LatinEyebrow tracking="0.5em" fontSize={15} className="mb-4">
                Journal
              </LatinEyebrow>
              <h2 style={{ fontWeight: 700, fontSize: "1.75rem", color: C.ink, margin: 0 }}>
                כל המאמרים ב{site.brand}
              </h2>
            </div>
            <CategoryGrid articles={articles} />
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
