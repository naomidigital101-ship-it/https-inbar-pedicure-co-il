import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { Pagination } from "@/components/category/Pagination";
import { getCategoryBySlug } from "@/lib/categories";
import { articles as staticArticles } from "@/lib/articles";
import {
  mergeArticleCards,
  staticArticleToCard,
  type ArticleCard,
} from "@/lib/article-cards";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";

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
      return { meta: [{ title: "קטגוריה לא נמצאה | הרוכב העצלן" }] };
    }
    const { category, pageArticles, currentPage, totalPages } = loaderData;
    const url = `/category/${params.slug}`;
    const SITE_URL = "https://lazyrider.org";
    const absUrl = `${SITE_URL}${url}`;
    const pageSuffix = currentPage > 1 ? ` - עמוד ${currentPage}` : "";
    const title = `${category.name}${pageSuffix} | הרוכב העצלן`;
    const description = category.description.slice(0, 155);

    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description,
      url,
      inLanguage: "he-IL",
      isPartOf: { "@type": "WebSite", name: "הרוכב העצלן", url: `${SITE_URL}/` },
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

    const canonicalHref =
      currentPage > 1 ? `${absUrl}?page=${currentPage}` : absUrl;

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
  const { category, pageArticles, totalArticles, currentPage, totalPages } =
    Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: category.name },
          ]}
        />
        <CategoryHero category={category} totalArticles={totalArticles} />

        <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
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