import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { BrandHeroBackdrop, BrandEyebrow, SerifNumber } from "@/components/brand/BrandPrimitives";
import { SITE, KNOWLEDGE_CATEGORIES_NAV } from "@/lib/site-config";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";

const PAGE_URL = `${SITE.url}/knowledge`;
const TITLE = `מרכז הידע — מדריכים מקצועיים בפדיקור טיפולי | ${SITE.brand}`;
const DESCRIPTION =
  "מרכז הידע של ענבר פרחי: מאמרים ומדריכים על יבלות, פטרת, ציפורן חודרנית, סוכרת, סדקים בעקב, מניעה ותחזוקה — בשפה ברורה ומבוססת ניסיון קליני.";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "foot-care": "שגרת טיפוח יומית, גזירת ציפורניים נכונה, סדקים בעקב ועור יבש — מבוסס משרד הבריאות, NHS ו-Mayo Clinic.",
  conditions: "פטרת ציפורן, יבלות ויראליות, ציפורן חודרנית, דורבן וכאבי עקב — זיהוי מבדל ופרוטוקולי טיפול.",
  "diabetic-foot": "פדיקור בטוח לחולי סוכרת לפי IWGDF — סטריליות, בדיקה יומית וזיהוי סימני אזהרה.",
  treatments: "אורטוניקסיה, שיקום ציפורן BIO, הסרת יבלות והביקור הראשון בקליניקה — מה באמת קורה בטיפול.",
  footwear: "איך לבחור נעליים, מתי צריך מדרסים, נעלי ריצה ונעליים לעבודה ממושכת — בלי שיווק.",
  "sports-feet": "ספורטאים, רצים, חיילים ומילואימניקים — שלפוחיות, שין ספלינטס וטיפול בכף רגל בעומס.",
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
  return (
    <div style={{ background: "var(--paper)" }}>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden" style={{ background: "var(--stone-50)" }}>
          <BrandHeroBackdrop />
          <div className="relative mx-auto max-w-[1200px] px-6 pt-10 pb-16 md:pt-14 md:pb-24">
            <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "מרכז הידע" }]} />
            <div className="mt-8 max-w-3xl">
              <BrandEyebrow>מרכז הידע · {SITE.brand}</BrandEyebrow>
              <h1
                className="mt-4 text-balance"
                style={{
                  fontFamily: "'Frank Ruhl Libre', serif",
                  fontSize: "clamp(2rem, 4.4vw, 3.4rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  color: "var(--ink-900)",
                }}
              >
                ידע מקצועי על בריאות כף הרגל,
                <br />
                בשפה שכולם מבינים.
              </h1>
              <p
                className="mt-6 max-w-2xl"
                style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.75 }}
              >
                מאמרים, מדריכים ותשובות לשאלות הנפוצות שמטופלים שואלים אותי בקליניקה — מבוסס {SITE.yearsExperience} שנות
                ניסיון, פרוטוקולים סטריליים ומקורות קליניים. בחרו קטגוריה כדי להתחיל.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <BrandEyebrow>נושאים מרכזיים</BrandEyebrow>
              <h2
                className="mt-3"
                style={{
                  fontFamily: "'Frank Ruhl Libre', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 500,
                  color: "var(--ink-900)",
                }}
              >
                קטגוריות מרכז הידע
              </h2>
            </div>
          </div>

          <div
            className="grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: "var(--stone-100)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
          >
            {KNOWLEDGE_CATEGORIES_NAV.map((c, idx) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                aria-label={`לקטגוריית ${c.label}`}
                className="group flex flex-col gap-4 p-8 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <div className="flex items-center justify-between">
                  <SerifNumber style={{ fontSize: "1.6rem", color: "var(--green-700)" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </SerifNumber>
                  <span
                    aria-hidden
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      border: "1px solid var(--stone-100)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--green-700)",
                      fontSize: 18,
                    }}
                  >
                    ←
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Frank Ruhl Libre', serif",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    color: "var(--ink-900)",
                  }}
                >
                  {c.label}
                </h3>
                <p style={{ color: "var(--ink-600)", fontSize: 14, lineHeight: 1.7 }}>
                  {CATEGORY_DESCRIPTIONS[c.slug] ?? "מאמרים ומדריכים בנושא."}
                </p>
                <span
                  className="mt-auto inline-flex items-center gap-2 pt-4 text-sm"
                  style={{ color: "var(--green-700)", fontWeight: 500, borderTop: "1px solid var(--stone-100)" }}
                >
                  כל המאמרים בקטגוריה
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-20">
          <LeadMagnet />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}