import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./ai-admin.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  fetchPageStats,
  pingIndexNow,
  resubmitSitemap,
  inspectUrl,
  searchConsoleInspectLink,
  type UrlInspectionResult,
} from "./gsc.server";

const BASE_URL = "https://lazyrider.org";

export interface IndexationRow {
  slug: string;
  title: string;
  url: string;
  source: "ai" | "static";
  publishedAt: string | null;
  indexed: boolean;
  clicks: number;
  impressions: number;
  position: number | null;
  inspectionLink: string;
}

export const getIndexationStatus = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<{ rows: IndexationRow[]; fetchedAt: string; error?: string }> => {
    const { data: aiArticles, error: aiErr } = await supabaseAdmin
      .from("ai_articles")
      .select("slug,title,published_at,status")
      .eq("status", "published");
    if (aiErr) throw new Error(aiErr.message);

    const { articles: staticArticles } = await import("@/lib/articles");
    const staticRows = staticArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      publishedAt: a.date ?? null,
      source: "static" as const,
    }));
    const aiRows = (aiArticles ?? []).map((a) => ({
      slug: a.slug,
      title: a.title,
      publishedAt: a.published_at,
      source: "ai" as const,
    }));

    const allArticles = [...aiRows, ...staticRows];

    let pageStats: Awaited<ReturnType<typeof fetchPageStats>> = [];
    let error: string | undefined;
    try {
      pageStats = await fetchPageStats();
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    const statsByPage = new Map(pageStats.map((s) => [s.page.replace(/\/$/, ""), s]));

    const rows: IndexationRow[] = allArticles.map((a) => {
      const url = `${BASE_URL}/article/${a.slug}`;
      const stat = statsByPage.get(url.replace(/\/$/, ""));
      return {
        slug: a.slug,
        title: a.title,
        url,
        source: a.source,
        publishedAt: a.publishedAt,
        indexed: !!stat && stat.impressions > 0,
        clicks: stat?.clicks ?? 0,
        impressions: stat?.impressions ?? 0,
        position: stat ? Math.round(stat.position * 10) / 10 : null,
        inspectionLink: searchConsoleInspectLink(url),
      };
    });

    rows.sort((a, b) => {
      if (a.indexed !== b.indexed) return a.indexed ? 1 : -1;
      return b.impressions - a.impressions;
    });

    return { rows, fetchedAt: new Date().toISOString(), error };
  });

export const submitForIndexing = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z.object({ urls: z.array(z.string().url()).min(1).max(100) }).parse(input),
  )
  .handler(async ({ data }) => {
    const startedAt = new Date().toISOString();
    let ping: { ok: boolean; status: number } = { ok: false, status: 0 };
    let indexNowError: string | null = null;
    try {
      ping = await pingIndexNow(data.urls);
    } catch (e) {
      indexNowError = e instanceof Error ? e.message : String(e);
    }
    let sitemapOk = true;
    let sitemapError: string | null = null;
    try {
      await resubmitSitemap(`${BASE_URL}/sitemap.xml`);
    } catch (e) {
      sitemapOk = false;
      sitemapError = e instanceof Error ? e.message : String(e);
    }
    return {
      submitted: data.urls.length,
      startedAt,
      finishedAt: new Date().toISOString(),
      indexNow: ping,
      indexNowError,
      indexNowKeyLocation: "https://lazyrider.org/c4ecf7a2fbf37f34ba99965022da276f.txt",
      sitemapResubmitted: sitemapOk,
      sitemapError,
      sitemapUrl: `${BASE_URL}/sitemap.xml`,
      inspectionLinks: data.urls.map((u) => ({ url: u, link: searchConsoleInspectLink(u) })),
      note: "Google מגלה עמודים חדשים דרך ה-sitemap. IndexNow מודיע ל-Bing/Yandex מיידית. Google אינו חושף API פומבי להגשת URL בודד לאינדוקס.",
    };
  });

export const inspectArticleUrl = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z.object({ url: z.string().url() }).parse(input),
  )
  .handler(async ({ data }): Promise<UrlInspectionResult> => {
    return inspectUrl(data.url);
  });