import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { ArticleHero } from "@/components/article/ArticleHero";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ArticleBody } from "@/components/article/ArticleBody";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { getPublishedAiArticleBySlug } from "@/lib/ai-content.functions";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ params }) => {
    const staticArticle = getArticleBySlug(params.slug);
    if (staticArticle) {
      return { article: staticArticle, related: getRelatedArticles(staticArticle.relatedSlugs) };
    }
    const aiArticle = await getPublishedAiArticleBySlug({ data: { slug: params.slug } });
    if (!aiArticle) throw notFound();
    const article = aiArticle as unknown as NonNullable<ReturnType<typeof getArticleBySlug>>;
    return { article, related: getRelatedArticles(article.relatedSlugs) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "מאמר לא נמצא | ענבר פרחי" }],
      };
    }
    const { article } = loaderData;
    const title = `${article.title} | ענבר פרחי`;
    const description = article.metaDescription ?? article.excerpt;
    const SITE = "https://inbar-pedicure.co.il";
    const path = `/article/${params.slug}`;
    const url = `${SITE}${path}`;
    const heroImageAbs = article.heroImage.startsWith("http")
      ? article.heroImage
      : `${SITE}${article.heroImage}`;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בית", item: SITE + "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: article.category,
          item: `${SITE}/category/${article.categorySlug}`,
        },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description,
      image: heroImageAbs,
      datePublished: article.date,
      dateModified: article.dateModified ?? article.date,
      author: {
        "@type": "Person",
        name: article.author,
        ...(article.authorBio ? { description: article.authorBio } : {}),
        jobTitle: "פדיקוריסטית טיפולית",
        knowsAbout: [
          "טיפוח כף הרגל",
          "טיפול בציפורניים",
          "יבלות ועור מעובה",
          "כף רגל סוכרתית",
          "התאמת נעליים",
          "אורתופדיה שיקומית",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "ענבר פרחי",
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: "he-IL",
      ...(article.mentions && article.mentions.length > 0
        ? {
            mentions: article.mentions.map((m) => ({
              "@type": "Thing",
              name: m,
            })),
          }
        : {}),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["[data-speakable=\"true\"]", "h1", "h2"],
      },
    };

    const faqSchema = article.faqs && article.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["dt", "dd"],
          },
          mainEntity: article.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

    const howToSchema = article.howTo
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: article.howTo.name,
          description: article.howTo.description,
          inLanguage: "he-IL",
          image: heroImageAbs,
          ...(article.howTo.totalTime ? { totalTime: article.howTo.totalTime } : {}),
          ...(article.howTo.performTime ? { performTime: article.howTo.performTime } : {}),
          ...(article.howTo.yield ? { yield: article.howTo.yield } : {}),
          ...(article.howTo.estimatedCostILS
            ? {
                estimatedCost: {
                  "@type": "MonetaryAmount",
                  currency: "ILS",
                  value: String(article.howTo.estimatedCostILS),
                },
              }
            : {}),
          ...(article.howTo.supplies
            ? {
                supply: article.howTo.supplies.map((s) => ({
                  "@type": "HowToSupply",
                  name: s,
                })),
              }
            : {}),
          ...(article.howTo.tools
            ? {
                tool: article.howTo.tools.map((t) => ({
                  "@type": "HowToTool",
                  name: t,
                })),
              }
            : {}),
          step: article.howTo.steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }
      : null;

    const videoSchema = article.videoEmbed
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: article.videoEmbed.name,
          description: article.videoEmbed.description,
          thumbnailUrl: article.videoEmbed.thumbnailUrl,
          uploadDate: article.videoEmbed.uploadDate,
          duration: article.videoEmbed.duration,
          embedUrl: `https://www.youtube-nocookie.com/embed/${article.videoEmbed.youtubeId}`,
          contentUrl: `https://www.youtube.com/watch?v=${article.videoEmbed.youtubeId}`,
          inLanguage: "he-IL",
        }
      : null;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: heroImageAbs },
        { property: "article:author", content: article.author },
        { property: "article:published_time", content: article.date },
        { property: "article:modified_time", content: article.dateModified ?? article.date },
        { property: "article:section", content: article.category },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: heroImageAbs },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(articleSchema),
        },
        ...(faqSchema
          ? [{
              type: "application/ld+json",
              children: JSON.stringify(faqSchema),
            }]
          : []),
        ...(howToSchema
          ? [{
              type: "application/ld+json",
              children: JSON.stringify(howToSchema),
            }]
          : []),
        ...(videoSchema
          ? [{
              type: "application/ld+json",
              children: JSON.stringify(videoSchema),
            }]
          : []),
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article, related } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: article.category },
            { label: article.title },
          ]}
        />
        <ArticleHero article={article} />

        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[28%_72%]">
            <aside className="order-2 lg:order-1">
              <TableOfContents sections={article.sections} />
            </aside>
            <div className="order-1 lg:order-2">
              <ArticleBody article={article} />
            </div>
          </div>
        </div>

        <RelatedArticles articles={related} />
        <LeadMagnet />
      </main>
      <SiteFooter />
    </div>
  );
}