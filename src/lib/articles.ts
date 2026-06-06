export type CalloutType = "tip" | "warning" | "saving";

export type ListItem =
  | string
  | {
      text: string;
      inlineImage?: { src: string; alt: string; caption?: string };
    };

export type ContextualLink = {
  /** הטקסט המדויק שיומר לקישור (הופעה ראשונה בלבד בגוף המאמר). */
  match: string;
  /** יעד הקישור — נתיב פנימי (כגון "/article/foo") או URL חיצוני מלא. */
  href: string;
  /** true עבור קישור חיצוני — יקבל target=_blank ו-rel מתאים. */
  external?: boolean;
  /**
   * ברירת מחדל לחיצוני: "dofollow" (אם הדומיין ב-whitelist; אחרת נכפה nofollow).
   * "nofollow" לקישורי תוכן לא מאומת. "sponsored"/"ugc" לפי הצורך.
   */
  rel?: "dofollow" | "nofollow" | "sponsored" | "ugc";
  /** title/aria-label אופציונלי. */
  title?: string;
};

export type ArticleSection = {
  id: string;
  heading: string;
  level: 2 | 3;
  paragraphs?: string[];
  list?: ListItem[];
  ordered?: boolean;
  callout?: { type: CalloutType; title: string; body: string };
  image?: { src: string; alt: string; caption?: string };
  video?: { youtubeId: string; title: string; caption?: string };
  infographic?: { src: string; alt: string; caption?: string };
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription?: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string; // ISO
  dateLabel: string;
  dateModified?: string; // ISO
  dateModifiedLabel?: string;
  readingTime: string; // e.g. "8 דקות"
  heroImage: string;
  heroAlt: string;
  intro: string[];
  tldr?: { label: string; value: string }[];
  specTable?: {
    title?: string;
    caption?: string;
    columns: string[];
    rows: string[][];
  };
  checklist?: { title?: string; items: string[] };
  sources?: { label: string; url: string }[];
  mentions?: string[];
  sections: ArticleSection[];
  relatedSlugs: string[];
  faqs?: { q: string; a: string }[];
  glossary?: { term: string; definition: string }[];
  /** קישורים contextual שיוזרקו אוטומטית לגוף המאמר (פנימיים לבניית רשת + חיצוניים לסמכות). */
  contextualLinks?: ContextualLink[];
  howTo?: {
    name: string;
    description: string;
    totalTime?: string; // ISO 8601 duration e.g. PT25M
    performTime?: string;
    yield?: string;
    estimatedCostILS?: number;
    supplies?: string[];
    tools?: string[];
    steps: { name: string; text: string }[];
  };
  videoEmbed?: {
    youtubeId: string;
    name: string;
    description: string;
    thumbnailUrl?: string;
    uploadDate?: string;
    duration?: string;
  };
  authorBio?: string;
};

/**
 * אין יותר מאמרים סטטיים. כל המאמרים מגיעים מ-Lovable Cloud
 * דרך getPublishedAiArticleBySlug / listPublishedAiArticleCards.
 * הטיפוסים נשמרים כדי לשמור על תאימות עם רכיבי הצגת המאמר.
 */
export const articles: Article[] = [];

export function getArticleBySlug(_slug: string): Article | undefined {
  return undefined;
}

export function getRelatedArticles(slugs: string[]): Article[] {
  return slugs
    .map((s) => articles.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a));
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles
    .filter((a) => a.categorySlug === categorySlug)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}