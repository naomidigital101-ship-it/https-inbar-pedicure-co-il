const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE_URL = "https://lazyrider.org/";
const SITE_URL_ENCODED = encodeURIComponent(SITE_URL);

function authHeaders() {
  const lov = process.env.LOVABLE_API_KEY;
  const gsc = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lov) throw new Error("LOVABLE_API_KEY חסר");
  if (!gsc) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY חסר - חבר את Google Search Console");
  return {
    Authorization: `Bearer ${lov}`,
    "X-Connection-Api-Key": gsc,
    "Content-Type": "application/json",
  };
}

export interface PageStats {
  page: string;
  clicks: number;
  impressions: number;
  position: number;
}

/**
 * Fetch per-page Search Analytics for the last 90 days.
 * Pages with impressions > 0 are considered indexed by Google.
 */
export async function fetchPageStats(): Promise<PageStats[]> {
  const endDate = new Date().toISOString().slice(0, 10);
  const start = new Date();
  start.setDate(start.getDate() - 90);
  const startDate = start.toISOString().slice(0, 10);

  const res = await fetch(
    `${GATEWAY}/webmasters/v3/sites/${SITE_URL_ENCODED}/searchAnalytics/query`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 5000,
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GSC searchAnalytics ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    rows?: Array<{ keys: string[]; clicks: number; impressions: number; position: number }>;
  };
  return (json.rows ?? []).map((r) => ({
    page: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    position: r.position,
  }));
}

/**
 * Resubmit a sitemap to Google. This is the only programmatic way to nudge
 * indexing through the Search Console API (URL Inspection / Indexing API are
 * not exposed through the connector gateway).
 */
export async function resubmitSitemap(sitemapUrl: string): Promise<void> {
  const res = await fetch(
    `${GATEWAY}/webmasters/v3/sites/${SITE_URL_ENCODED}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    { method: "PUT", headers: authHeaders() },
  );
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(`GSC sitemap submit ${res.status}: ${text.slice(0, 300)}`);
  }
}

/**
 * Ping IndexNow (Bing/Yandex) for a list of URLs. Google ignores IndexNow but
 * doesn't penalize it; it's the best per-URL signal we can send without the
 * Google Indexing API.
 */
export async function pingIndexNow(urls: string[]): Promise<{ ok: boolean; status: number }> {
  const KEY = "c4ecf7a2fbf37f34ba99965022da276f";
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "lazyrider.org",
      key: KEY,
      keyLocation: `https://lazyrider.org/${KEY}.txt`,
      urlList: urls,
    }),
  });
  return { ok: res.ok, status: res.status };
}

export interface UrlInspectionResult {
  verdict: string; // PASS | PARTIAL | FAIL | NEUTRAL | VERDICT_UNSPECIFIED
  coverageState: string; // human-readable, e.g. "Submitted and indexed"
  indexingState?: string; // INDEXING_ALLOWED | BLOCKED_BY_ROBOTS_TXT | ...
  lastCrawlTime?: string;
  pageFetchState?: string;
  robotsTxtState?: string;
  googleCanonical?: string;
  userCanonical?: string;
  sitemap?: string[];
  referringUrls?: string[];
  inspectionLink: string;
}

/**
 * Real indexation status from Google via URL Inspection API.
 * This is the authoritative source — `impressions > 0` is only a proxy.
 */
export async function inspectUrl(url: string): Promise<UrlInspectionResult> {
  const res = await fetch(
    `${GATEWAY}/v1/urlInspection/index:inspect`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: SITE_URL,
        languageCode: "he",
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`URL Inspection ${res.status}: ${text.slice(0, 400)}`);
  }
  const json = (await res.json()) as {
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        indexingState?: string;
        lastCrawlTime?: string;
        pageFetchState?: string;
        robotsTxtState?: string;
        googleCanonical?: string;
        userCanonical?: string;
        sitemap?: string[];
        referringUrls?: string[];
      };
      inspectionResultLink?: string;
    };
  };
  const r = json.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: r.verdict ?? "VERDICT_UNSPECIFIED",
    coverageState: r.coverageState ?? "—",
    indexingState: r.indexingState,
    lastCrawlTime: r.lastCrawlTime,
    pageFetchState: r.pageFetchState,
    robotsTxtState: r.robotsTxtState,
    googleCanonical: r.googleCanonical,
    userCanonical: r.userCanonical,
    sitemap: r.sitemap,
    referringUrls: r.referringUrls,
    inspectionLink:
      json.inspectionResult?.inspectionResultLink ??
      `https://search.google.com/search-console/inspect?resource_id=${SITE_URL_ENCODED}&id=${encodeURIComponent(url)}`,
  };
}

export function searchConsoleInspectLink(url: string): string {
  return `https://search.google.com/search-console/inspect?resource_id=${SITE_URL_ENCODED}&id=${encodeURIComponent(url)}`;
}