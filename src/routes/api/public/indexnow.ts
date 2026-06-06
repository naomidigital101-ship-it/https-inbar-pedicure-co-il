import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { articles } from "@/lib/articles";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";

const BASE_URL = "https://lazyrider.org";
const HOST = "lazyrider.org";
const KEY = "c4ecf7a2fbf37f34ba99965022da276f";
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

function buildAllUrls(): string[] {
  const staticPaths = [
    "/",
    "/about",
    "/contact",
    "/products",
    "/products/helmets",
    "/products/boots",
    "/products/body-armor",
    "/sitemap",
  ];
  const urls = [
    ...staticPaths,
    ...categories.map((c) => `/category/${c.slug}`),
    ...articles.map((a) => `/article/${a.slug}`),
    ...products.map((p) => `/product/${p.slug}`),
    ...HELMETS.map((h) => `/products/helmets/${h.id}`),
    ...BOOTS.map((b) => `/products/boots/${b.id}`),
    ...BODY_ARMOR.map((a) => `/products/body-armor/${a.id}`),
  ];
  return urls.map((p) => `${BASE_URL}${p}`);
}

/**
 * Pings IndexNow with all public URLs.
 * Usage: GET /api/public/indexnow → submits all URLs to api.indexnow.org.
 * Bing, Yandex, Seznam, Naver consume IndexNow. Google does not (yet) but doesn't penalize.
 */
export const Route = createFileRoute("/api/public/indexnow")({
  server: {
    handlers: {
      GET: async () => {
        const urlList = buildAllUrls();

        const res = await fetch("https://api.indexnow.org/IndexNow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: HOST,
            key: KEY,
            keyLocation: KEY_LOCATION,
            urlList,
          }),
        });

        const text = await res.text().catch(() => "");
        return Response.json(
          {
            ok: res.ok,
            status: res.status,
            submitted: urlList.length,
            keyLocation: KEY_LOCATION,
            response: text || "(empty body — IndexNow returns 200/202 with no body on success)",
          },
          { status: res.ok ? 200 : 502 },
        );
      },
    },
  },
});