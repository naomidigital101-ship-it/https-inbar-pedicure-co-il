import { findLegacyRedirect } from "./legacy-redirects.ts";

const SITE_ORIGIN = "https://inbar-pedicure.co.il";

/** Audit 2026-09-05: these destinations do not support the linked subject.
 * Remove the link, preserving the clinical prose pending review against Inbar's books.
 */
export function publicContentHref(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href, SITE_ORIGIN);
  } catch {
    return null;
  }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "eyal.org.il") return null;
  if (host === "medlineplus.gov" && url.pathname === "/druginfo/meds/a695031.html") {
    return null;
  }
  if (host === "en.wikipedia.org" && url.pathname === "/wiki/Cracked_heels") {
    return null;
  }
  if (host === "inbar-pedicure.co.il") {
    const path = findLegacyRedirect(url.pathname) ?? url.pathname;
    return `${path}${url.search}${url.hash}`;
  }
  return url.href;
}

/** Clean both visible links and serialized source references at the data boundary. */
export function sanitizePublicLinks<
  T extends {
    contextualLinks?: { href: string; external?: boolean }[];
    sources?: { url: string }[];
  },
>(content: T): T {
  return {
    ...content,
    contextualLinks: content.contextualLinks?.flatMap((link) => {
      const href = publicContentHref(link.href);
      return href ? [{ ...link, href, external: !href.startsWith("/") }] : [];
    }),
    sources: content.sources?.flatMap((source) => {
      const url = publicContentHref(source.url);
      return url ? [{ ...source, url }] : [];
    }),
  };
}
