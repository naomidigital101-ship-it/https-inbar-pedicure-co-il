import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { categories } from "@/lib/categories";
import { articles } from "@/lib/articles";
import { staticArticleToCard } from "@/lib/article-cards";
import type { ArticleCard } from "@/lib/article-cards";
import type { GeneratedArticlePayload } from "@/lib/ai-content.server";
import { SITE } from "@/lib/site-config";

const BASE_URL = SITE.url;
const SITE_TITLE = SITE.brand;
const SITE_DESC =
  "מאמרים בנושא פדיקור טיפולי: יבלות, פטרת, ציפורן חודרנית, סדקים בעקב, פדיקור לחולי סוכרת והדרכות מבוססות פרוטוקולים קליניים.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        /*
         * המאמרים חיים בדאטאבייס, לא בקובץ. הפיד קרא ממערך הסטטי הריק
         * ולכן שידר 0 פריטים בזמן שהאתר מצהיר עליו בכל עמוד. כאן הוא
         * שולף מאותו מקור שממנו נבנה הסייטמאפ, ומוסיף את הסטטיים אם יש.
         */
        const { data: rows } = await supabaseAdmin
          .from("ai_articles")
          .select("slug, title, payload, published_at, created_at")
          .eq("status", "published")
          .order("published_at", { ascending: false, nullsFirst: false });

        const fromDb: ArticleCard[] = (rows ?? []).map((row) => {
          const p = row.payload as GeneratedArticlePayload;
          const date = row.published_at ?? row.created_at;
          const cat = categories.find((c) => c.slug === p.categorySlug);
          return {
            slug: row.slug,
            title: row.title ?? p.title,
            excerpt: p.excerpt ?? "",
            category: cat?.name ?? p.category ?? p.categorySlug,
            categorySlug: p.categorySlug,
            date,
            dateLabel: "",
            readingTime: "",
            heroImage: "",
            heroAlt: "",
          };
        });

        const bySlug = new Map<string, ArticleCard>();
        for (const a of articles.map(staticArticleToCard)) bySlug.set(a.slug, a);
        for (const a of fromDb) if (!bySlug.has(a.slug)) bySlug.set(a.slug, a);
        const sorted = [...bySlug.values()].sort((a, b) => (a.date < b.date ? 1 : -1));

        const items = sorted.map((a) => {
          const url = `${BASE_URL}/article/${a.slug}`;
          const pubDate = new Date(a.date).toUTCString();
          return [
            `    <item>`,
            `      <title>${escapeXml(a.title)}</title>`,
            `      <link>${url}</link>`,
            `      <guid isPermaLink="true">${url}</guid>`,
            `      <pubDate>${pubDate}</pubDate>`,
            `      <description>${escapeXml(a.excerpt)}</description>`,
            `      <category>${escapeXml(a.category)}</category>`,
            `    </item>`,
          ].join("\n");
        });

        const lastBuild = new Date().toUTCString();

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
          `  <channel>`,
          `    <title>${escapeXml(SITE_TITLE)}</title>`,
          `    <link>${BASE_URL}</link>`,
          `    <description>${escapeXml(SITE_DESC)}</description>`,
          `    <language>he-IL</language>`,
          `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
          `    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
          ...items,
          `  </channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
