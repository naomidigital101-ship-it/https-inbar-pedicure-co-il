import type { Article } from "@/lib/articles";
import { categories } from "@/lib/categories";

/**
 * Lightweight article card used in listings (category pages, home sections).
 * Same shape for static (file-based) articles and AI-generated articles.
 */
export type ArticleCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string;
  dateLabel: string;
  readingTime: string;
  heroImage: string;
  heroAlt: string;
};

export function staticArticleToCard(a: Article): ArticleCard {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    categorySlug: a.categorySlug,
    date: a.date,
    dateLabel: a.dateLabel,
    readingTime: a.readingTime,
    heroImage: a.heroImage,
    heroAlt: a.heroAlt,
  };
}

/** Merge static + AI cards, dedupe by slug (static wins), sort newest-first. */
export function mergeArticleCards(
  staticCards: ArticleCard[],
  aiCards: ArticleCard[],
): ArticleCard[] {
  const seen = new Set(staticCards.map((c) => c.slug));
  const merged = [...staticCards, ...aiCards.filter((c) => !seen.has(c.slug))];
  return merged.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}