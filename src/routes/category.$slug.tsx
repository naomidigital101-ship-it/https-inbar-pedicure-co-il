import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { Pagination } from "@/components/category/Pagination";
import { C, LatinEyebrow } from "@/components/article/editorial";
import { getCategoryBySlug } from "@/lib/categories";
import { articles as staticArticles } from "@/lib/articles";
import { mergeArticleCards, staticArticleToCard, type ArticleCard } from "@/lib/article-cards";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";
import { CATEGORY_LONG_CONTENT } from "@/lib/category-content";

const PER_PAGE = 40;

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
});

export const Route = createFileRoute("/category/$slug")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();

    const staticCards: ArticleCard[] = staticArticles
      .filter((a) => a.categorySlug === category.slug)
      .map(staticArticleToCard);
    const aiCards = await listPublishedAiArticleCards();
    const all = mergeArticleCards(
      staticCards,
      aiCards.filter((c) => c.categorySlug === category.slug),
    );
    const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    const currentPage = Math.min(deps.page, totalPages);
    const start = (currentPage - 1) * PER_PAGE;
    const pageArticles = all.slice(start, start + PER_PAGE);

    return {
      category,
      pageArticles,
      totalArticles: all.length,
      currentPage,
      totalPages,
    };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "קטגוריה לא נמצאה | ענבר פרחי" }] };
    }
    const { category, pageArticles, currentPage, totalPages } = loaderData;
    const url = `/category/${params.slug}`;
    const SITE_URL = "https://inbar-pedicure.co.il";
    const absUrl = `${SITE_URL}${url}`;
    const pageSuffix = currentPage > 1 ? ` - עמוד ${currentPage}` : "";
    const title = `${category.name}${pageSuffix} | ענבר פרחי`;
    const description = category.description.slice(0, 155);

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description,
      url,
      inLanguage: "he-IL",
      isPartOf: { "@type": "WebSite", name: "ענבר פרחי", url: `${SITE_URL}/` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: pageArticles.length,
        itemListElement: pageArticles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/article/${a.slug}`,
          name: a.title,
        })),
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בית", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: category.name, item: absUrl },
      ],
    };

    const canonicalHref = currentPage > 1 ? `${absUrl}?page=${currentPage}` : absUrl;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalHref },
        { property: "og:type", content: "website" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(currentPage === 1 && totalPages > 1
          ? [{ name: "robots", content: "index, follow" }]
          : []),
      ],
      links: [{ rel: "canonical", href: canonicalHref }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(collectionSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, pageArticles, totalArticles, currentPage, totalPages } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: C.paper }}>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: category.name }]} />
        <CategoryHero category={category} totalArticles={totalArticles} />

        <CategoryLongContent slug={category.slug} />

        <section className="mx-auto max-w-[1150px] px-[6%] py-24 md:py-28">
          <CategoryGrid articles={pageArticles} />
          <Pagination
            categorySlug={category.slug}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </section>

        <LeadMagnet />
      </main>
      <SiteFooter />
    </div>
  );
}

function CategoryLongContent({ slug }: { slug: string }) {
  const content = CATEGORY_LONG_CONTENT[slug as keyof typeof CATEGORY_LONG_CONTENT];
  if (!content) return null;
  return (
    <section className="mx-auto max-w-[820px] px-[6%] pt-24 pb-4">
      <div
        className="space-y-5"
        style={{ color: C.muted, fontSize: "1.02rem", lineHeight: 2, fontWeight: 300 }}
      >
        {content.intro.map((p, i) => (
          <p key={`ci-${i}`}>{p}</p>
        ))}
      </div>

      {content.topics.length > 0 && (
        <div className="mt-14" style={{ borderTop: `1px solid ${C.line}` }}>
          {content.topics.map((t, i) => (
            <div key={`ct-${i}`} className="py-8" style={{ borderBottom: `1px solid ${C.line}` }}>
              <h2
                className="mb-3"
                style={{ fontWeight: 600, fontSize: "1.2rem", color: C.ink, lineHeight: 1.6 }}
              >
                {t.heading}
              </h2>
              <p style={{ color: C.muted, lineHeight: 2, fontSize: "0.98rem", fontWeight: 300 }}>
                {t.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {content.faqs.length > 0 && (
        <div className="mt-16">
          <div className="mb-10 text-center">
            <LatinEyebrow tracking="0.5em" fontSize={14} className="mb-4">
              FAQ
            </LatinEyebrow>
            <h2 style={{ fontWeight: 700, fontSize: "1.6rem", color: C.ink, margin: 0 }}>
              שאלות נפוצות
            </h2>
          </div>
          <dl style={{ borderTop: `1px solid ${C.line}` }}>
            {content.faqs.map((f, i) => (
              <div key={`cf-${i}`} className="py-7" style={{ borderBottom: `1px solid ${C.line}` }}>
                <dt className="mb-2" style={{ color: C.ink, fontWeight: 600, fontSize: "1.02rem" }}>
                  {f.q}
                </dt>
                <dd style={{ color: C.muted, lineHeight: 2, fontSize: "0.96rem", fontWeight: 300 }}>
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
