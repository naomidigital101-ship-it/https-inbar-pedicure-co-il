import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { articles } from "@/lib/articles";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://lazyrider.org";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data: aiArticles } = await supabaseAdmin
          .from("ai_articles")
          .select("slug,published_at,updated_at")
          .eq("status", "published");
        const aiEntries: SitemapEntry[] = (aiArticles ?? []).map((a) => ({
          path: `/article/${a.slug}`,
          lastmod: (a.updated_at ?? a.published_at ?? "").slice(0, 10) || undefined,
          changefreq: "monthly" as const,
          priority: "0.6",
        }));
        const staticSlugs = new Set(articles.map((a) => a.slug));
        const aiEntriesDeduped = aiEntries.filter(
          (e) => !staticSlugs.has(e.path.replace("/article/", "")),
        );
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
          { path: "/sitemap", changefreq: "weekly", priority: "0.4" },
          { path: "/products", changefreq: "weekly", priority: "0.8" },
          { path: "/products/helmets", changefreq: "weekly", priority: "0.8" },
          { path: "/products/boots", changefreq: "weekly", priority: "0.8" },
          { path: "/products/body-armor", changefreq: "weekly", priority: "0.8" },
          ...categories.map((c) => ({
            path: `/category/${c.slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...articles.map((a) => ({
            path: `/article/${a.slug}`,
            lastmod: a.date,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...products.map((p) => ({
            path: `/product/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...HELMETS.map((h) => ({
            path: `/products/helmets/${h.id}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...BOOTS.map((b) => ({
            path: `/products/boots/${b.id}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...BODY_ARMOR.map((a) => ({
            path: `/products/body-armor/${a.id}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...aiEntriesDeduped,
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});