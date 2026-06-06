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

import { twoStrokeGearboxArticle } from "./articles-content/two-stroke-gearbox";
import { chainFailureSignsArticle } from "./articles-content/chain-failure-signs";
import { valveClearanceCheckArticle } from "./articles-content/valve-clearance-check";
import { airFilterCleaningArticle } from "./articles-content/air-filter-cleaning";
import { helmetBuyersGuideArticle } from "./articles-content/helmet-buyers-guide";
import { ktmVsHusqvarnaArticle } from "./articles-content/ktm-vs-husqvarna";
import { standingPositionArticle } from "./articles-content/standing-position";
import { sparkPlugReadingArticle } from "./articles-content/spark-plug-reading";
import { brakePadReplacementArticle } from "./articles-content/brake-pad-replacement";
import { coolantFlushArticle } from "./articles-content/coolant-flush";
import { throttleCableAdjustArticle } from "./articles-content/throttle-cable-adjust";
import { hondaCrf300lReviewArticle } from "./articles-content/honda-crf300l-review";
import { betaRr3002026Article } from "./articles-content/beta-rr-300-2026";
import { golanLoopArticle } from "./articles-content/golan-loop";
import { judeanDesertTrailArticle } from "./articles-content/judean-desert-trail";
import { kneeBracesVsPadsArticle } from "./articles-content/knee-braces-vs-pads";
import { hillClimbTechniqueArticle } from "./articles-content/hill-climb-technique";
import { clutchExplainedArticle } from "./articles-content/clutch-explained";
import { exhaustExplainedArticle } from "./articles-content/exhaust-explained";

export const articles: Article[] = [
  twoStrokeGearboxArticle,
  chainFailureSignsArticle,
  ktmVsHusqvarnaArticle,
  valveClearanceCheckArticle,
  airFilterCleaningArticle,
  helmetBuyersGuideArticle,
  standingPositionArticle,
  sparkPlugReadingArticle,
  brakePadReplacementArticle,
  coolantFlushArticle,
  throttleCableAdjustArticle,
  hondaCrf300lReviewArticle,
  betaRr3002026Article,
  golanLoopArticle,
  judeanDesertTrailArticle,
  kneeBracesVsPadsArticle,
  hillClimbTechniqueArticle,
  clutchExplainedArticle,
  exhaustExplainedArticle,
];

export function getArticleBySlug(slug: string): Article | undefined {
  const aliases: Record<string, string> = {
    "ktm-exc-250-oil-change": "two-stroke-gearbox-oil-change",
  };
  const target = aliases[slug] ?? slug;
  return articles.find((a) => a.slug === target);
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