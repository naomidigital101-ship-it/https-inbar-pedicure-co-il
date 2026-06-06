import { useMemo, useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { articles } from "@/lib/articles";
import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";
import { products as generalProducts } from "@/lib/products";
import { categories as articleCategories } from "@/lib/categories";

type SearchHit = {
  kind: "article" | "product" | "category" | "page";
  href: string;
  title: string;
  subtitle: string;
  keywords?: string;
};

function buildIndex(): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const a of articles) {
    hits.push({
      kind: "article",
      href: `/article/${a.slug}`,
      title: a.title,
      subtitle: `מאמר · ${a.category}`,
      keywords: a.excerpt,
    });
  }
  for (const c of articleCategories) {
    hits.push({
      kind: "category",
      href: `/category/${c.slug}`,
      title: c.name,
      subtitle: "קטגוריית מאמרים",
      keywords: `${c.shortName} ${c.description}`,
    });
  }
  const productCats: { href: string; title: string }[] = [
    { href: "/products", title: "כל המוצרים" },
    { href: "/products/helmets", title: "קסדות שטח" },
    { href: "/products/boots", title: "מגפי שטח" },
    { href: "/products/body-armor", title: "מגני גוף" },
  ];
  for (const pc of productCats) {
    hits.push({
      kind: "category",
      href: pc.href,
      title: pc.title,
      subtitle: "קטגוריית מוצרים",
    });
  }
  for (const h of HELMETS) {
    hits.push({
      kind: "product",
      href: `/products/helmets/${h.slug}`,
      title: `${h.brand} ${h.model}`,
      subtitle: "קסדת שטח",
    });
  }
  for (const b of BOOTS) {
    hits.push({
      kind: "product",
      href: `/products/boots/${b.slug}`,
      title: `${b.brand} ${b.model}`,
      subtitle: "מגף שטח",
    });
  }
  for (const p of BODY_ARMOR) {
    hits.push({
      kind: "product",
      href: `/products/body-armor/${p.slug}`,
      title: `${p.brand} ${p.model}`,
      subtitle: "מגן גוף",
    });
  }
  for (const p of generalProducts) {
    hits.push({
      kind: "product",
      href: `/product/${p.slug}`,
      title: p.name,
      subtitle: `מוצר · ${p.categoryLabel}`,
      keywords: `${p.brand} ${p.shortDescription}`,
    });
  }
  const pages: { href: string; title: string }[] = [
    { href: "/about", title: "אודות" },
    { href: "/contact", title: "צור קשר" },
    { href: "/sitemap", title: "מפת אתר" },
    { href: "/privacy", title: "מדיניות פרטיות" },
    { href: "/terms", title: "תנאי שימוש" },
    { href: "/accessibility", title: "הצהרת נגישות" },
  ];
  for (const pg of pages) {
    hits.push({ kind: "page", href: pg.href, title: pg.title, subtitle: "עמוד" });
  }
  return hits;
}

export function SiteSearch({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return index
      .filter((h) => {
        const hay = `${h.title} ${h.subtitle} ${h.keywords ?? ""}`.toLowerCase();
        return hay.includes(term);
      })
      .slice(0, 10);
  }, [q, index]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const widthClass = variant === "desktop" ? "w-64" : "w-full";

  return (
    <div ref={wrapRef} className={`relative ${widthClass}`}>
      <div className="flex items-center gap-2 border border-[#222] bg-[#111] px-3 py-2 focus-within:border-[#e63000]">
        <Search className="h-4 w-4 text-[#909090]" aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="חיפוש מאמרים או מוצרים..."
          aria-label="חיפוש באתר"
          className="flex-1 bg-transparent text-xs font-bold text-[#f0f0f0] placeholder:text-[#666] focus:outline-none"
        />
        {q && (
          <button
            type="button"
            aria-label="נקה חיפוש"
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            className="text-[#909090] hover:text-[#f0f0f0]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && q.trim().length >= 2 && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full min-w-[280px] border border-[#222] bg-[#0a0a0a] shadow-2xl">
          {results.length === 0 ? (
            <div className="px-3 py-4 text-xs font-bold text-[#888]">
              לא נמצאו תוצאות עבור "{q}"
            </div>
          ) : (
            <ul role="listbox">
              {results.map((r) => (
                <li key={`${r.kind}-${r.href}`}>
                  <a
                    href={r.href}
                    className="flex flex-col gap-1 border-b border-[#1a1a1a] px-3 py-2.5 transition-colors hover:bg-[#181818]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                      {r.subtitle}
                    </span>
                    <span className="text-sm font-black text-[#f0f0f0]">
                      {r.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}