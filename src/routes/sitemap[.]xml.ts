import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { categories } from "@/lib/categories";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SITE, SERVICES_NAV } from "@/lib/site-config";

const BASE = SITE.url;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data: ai } = await supabaseAdmin.from("ai_articles").select("slug,published_at,updated_at").eq("status", "published");
        const entries = [
          { path: "/", priority: "1.0" },
          { path: "/about", priority: "0.7" },
          { path: "/contact", priority: "0.7" },
          { path: "/services", priority: "0.9" },
          { path: "/knowledge", priority: "0.8" },
          { path: "/terms", priority: "0.3" },
          { path: "/privacy", priority: "0.3" },
          { path: "/accessibility", priority: "0.3" },
          ...SERVICES_NAV.map((s) => ({ path: `/services/${s.slug}`, priority: "0.8" })),
          ...categories.map((c) => ({ path: `/category/${c.slug}`, priority: "0.6" })),
          ...(ai ?? []).map((a) => ({ path: `/article/${a.slug}`, priority: "0.6", lastmod: (a.updated_at ?? a.published_at ?? "").slice(0, 10) || undefined })),
        ];
        const urls = entries.map((e) => `  <url><loc>${BASE}${e.path}</loc>${(e as { lastmod?: string }).lastmod ? `<lastmod>${(e as { lastmod?: string }).lastmod}</lastmod>` : ""}<priority>${e.priority}</priority></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
