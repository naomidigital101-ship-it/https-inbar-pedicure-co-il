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

        <CategoryLongContent slug={category.slug} />

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

function CategoryLongContent({ slug }: { slug: string }) {
  const content = CATEGORY_LONG_CONTENT[slug as keyof typeof CATEGORY_LONG_CONTENT];
  if (!content) return null;
  return (
    <section className="mx-auto max-w-[900px] px-6 pt-12 pb-4 md:px-10">
      <div className="space-y-4" style={{ color: "var(--ink-900)", fontSize: "1.02rem", lineHeight: 1.85 }}>
        {content.intro.map((p, i) => (
          <p key={`ci-${i}`}>{p}</p>
        ))}
      </div>
      {content.topics.length > 0 && (
        <div className="mt-10 grid gap-6">
          {content.topics.map((t, i) => (
            <div key={`ct-${i}`} className="rounded-xl border border-[var(--green-100)] bg-[var(--green-50)] p-6">
              <h2
                className="mb-2"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                  color: "var(--ink-900)",
                }}
              >
                {t.heading}
              </h2>
              <p style={{ color: "var(--ink-900)", lineHeight: 1.85, fontSize: "0.98rem" }}>{t.body}</p>
            </div>
          ))}
        </div>
      )}
      {content.faqs.length > 0 && (
        <div className="mt-10">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
              letterSpacing: "-0.02em",
              color: "var(--green-700)",
            }}
          >
            שאלות נפוצות
          </h2>
          <dl className="space-y-4">
            {content.faqs.map((f, i) => (
              <div key={`cf-${i}`} className="rounded-lg border border-[var(--stone-100)] bg-[var(--paper)] p-5">
                <dt className="mb-1 font-semibold" style={{ color: "var(--ink-900)" }}>{f.q}</dt>
                <dd style={{ color: "var(--ink-900)", lineHeight: 1.85, fontSize: "0.96rem" }}>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}