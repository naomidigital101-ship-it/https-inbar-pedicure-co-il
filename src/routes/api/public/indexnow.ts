import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { categories } from "@/lib/categories";
import { SITE, SERVICES_NAV } from "@/lib/site-config";

const BASE = SITE.url;
const HOST = SITE.domain;
const KEY = "c4ecf7a2fbf37f34ba99965022da276f";

export const Route = createFileRoute("/api/public/indexnow")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", "/about", "/contact", "/services", "/knowledge",
          ...SERVICES_NAV.map((s) => `/services/${s.slug}`),
          ...categories.map((c) => `/category/${c.slug}`)];
        const urlList = paths.map((p) => `${BASE}${p}`);
        const res = await fetch("https://api.indexnow.org/IndexNow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList }),
        });
        return Response.json({ ok: res.ok, submitted: urlList.length }, { status: res.ok ? 200 : 502 });
      },
    },
  },
});
