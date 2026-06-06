import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { Hero } from "@/components/home/Hero";
import { TickerBar } from "@/components/home/TickerBar";
import { ArticleCategoriesSection } from "@/components/home/ArticleCategoriesSection";
import { LatestByCategorySection } from "@/components/home/LatestByCategorySection";
import { ProductCategoriesSection } from "@/components/home/ProductCategoriesSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { articles as staticArticles } from "@/lib/articles";
import {
  mergeArticleCards,
  staticArticleToCard,
} from "@/lib/article-cards";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";

const PAGE_TITLE =
  "הרוכב העצלן | פורטל אופנועי שטח בישראל";
const PAGE_DESCRIPTION =
  "כל מה שרוכב שטח בישראל צריך במקום אחד: מדריכי תחזוקה, ביקורות KTM/Husqvarna/Honda, מסלולי שטח, קטלוג קסדות, מגני גוף ומגפיים, וטכניקות רכיבה.";

const SITE_URL = "https://lazyrider.org";
const PAGE_URL = `${SITE_URL}/`;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "הרוכב העצלן",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  inLanguage: "he-IL",
  hasPart: [
    { "@type": "WebPage", name: "מכניקה ותחזוקה", url: `${SITE_URL}/category/mechanic` },
    { "@type": "WebPage", name: "אופנועים וביקורות", url: `${SITE_URL}/category/bikes` },
    { "@type": "WebPage", name: "מסלולי שטח", url: `${SITE_URL}/category/trails` },
    { "@type": "WebPage", name: "ציוד מגן", url: `${SITE_URL}/category/gear` },
    { "@type": "WebPage", name: "טכניקת רכיבה", url: `${SITE_URL}/category/technique` },
    { "@type": "WebPage", name: "קסדות שטח", url: `${SITE_URL}/products/helmets` },
    { "@type": "WebPage", name: "מגני גוף", url: `${SITE_URL}/products/body-armor` },
    { "@type": "WebPage", name: "מגפי שטח", url: `${SITE_URL}/products/boots` },
  ],
};

export const Route = createFileRoute("/")({
  loader: async () => {
    const aiCards = await listPublishedAiArticleCards();
    const staticCards = staticArticles.map(staticArticleToCard);
    const allCards = mergeArticleCards(staticCards, aiCards);
    return { allCards };
  },
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteSchema),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { allCards } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Hero />
        <TickerBar />
        <ArticleCategoriesSection cards={allCards} />
        <LatestByCategorySection cards={allCards} />
        <ProductCategoriesSection />
        <FeaturedProductsSection />
        <AboutTeaser />
        <LeadMagnet />
      </main>
      <SiteFooter />
    </div>
  );
}
