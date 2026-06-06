import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { articles } from "@/lib/articles";

const BASE_URL = "https://inbar-farchi.lovable.app";
const SITE_TITLE = "ענבר פרחי";
const SITE_DESC =
  "פורטל אופנועי שטח בישראל: מדריכי תחזוקה, ביקורות, מסלולים וטכניקת רכיבה.";

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
        const sorted = [...articles].sort((a, b) =>
          a.date < b.date ? 1 : -1,
        );

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
            `      <author>noreply@inbar-farchi.lovable.app (${escapeXml(a.author)})</author>`,
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