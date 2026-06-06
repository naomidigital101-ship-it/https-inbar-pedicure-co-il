import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Filter } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import {
  HELMETS,
  BRANDS,
  PRICE_RANGES,
  type HelmLevel,
  type HelmProduct,
} from "@/lib/products/helmets";
import { getHelmetImage } from "@/lib/products/helmet-images";

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/products/helmets`;

const LEVEL_LABELS: Record<HelmLevel, string> = {
  entry: "כניסה",
  mid: "ביניים",
  pro: "מקצועי",
  elite: "אליטה",
};

const LEVELS: HelmLevel[] = ["entry", "mid", "pro", "elite"];

export const Route = createFileRoute("/products/helmets/")({
  head: () => {
    const title = "קסדות שטח 2025 - השוואה מלאה למחירים בישראל | הרוכב העצלן";
    const description =
      "מאגר קסדות אנדורו וקרוס: Fox, Bell, Leatt, Alpinestars, Shoei. סינון לפי מותג, רמה ותקציב, עם מחירים וקישורי קנייה ישירים לחנויות בישראל.";

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "קסדות שטח - מאגר השוואה",
      itemListElement: HELMETS.map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `${h.brand} ${h.model}`,
          brand: { "@type": "Brand", name: h.brand },
          description: h.short_desc_he,
          image: `${SITE}${getHelmetImage(h.slug)}`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "ILS",
            lowPrice: h.price_ils_approx,
            offerCount: h.retailers_israel.length,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בית", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "מוצרים", item: SITE + "/products" },
        { "@type": "ListItem", position: 3, name: "קסדות", item: PAGE_URL },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: PAGE_URL },
      ],
      links: [{ rel: "canonical", href: PAGE_URL }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(itemListSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  component: HelmetsCatalogPage,
});

function HelmetsCatalogPage() {
  const [brand, setBrand] = useState<string>("all");
  const [level, setLevel] = useState<HelmLevel | "all">("all");
  const [budgetIdx, setBudgetIdx] = useState<number>(-1);

  const filtered = useMemo(() => {
    return HELMETS.filter((h) => {
      if (brand !== "all" && h.brand !== brand) return false;
      if (level !== "all" && h.level !== level) return false;
      if (budgetIdx >= 0) {
        const range = PRICE_RANGES[budgetIdx];
        const min = "min" in range && typeof range.min === "number" ? range.min : 0;
        const max = "max" in range && typeof range.max === "number" ? range.max : Infinity;
        if (h.price_ils_approx < min || h.price_ils_approx > max) return false;
      }
      return true;
    }).sort((a, b) => a.price_ils_approx - b.price_ils_approx);
  }, [brand, level, budgetIdx]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]" dir="rtl">
      <SiteHeader />

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: "מוצרים", href: "/products" },
            { label: "קסדות" },
          ]}
        />

        <header className="mt-8 border-b border-[#222] pb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e63000]">
            קטלוג · קסדות שטח
          </p>
          <h1 className="mt-3 font-frank text-4xl font-black leading-tight md:text-5xl">
            קסדות אנדורו וקרוס - השוואה מלאה
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-loose text-[#ccc]">
            {HELMETS.length} קסדות מהמותגים המובילים, עם מחירים מעודכנים וקישורי קנייה ישירים לחנויות בישראל. סננו לפי מותג, רמת רכיבה ותקציב.
          </p>
        </header>

        {/* Filters */}
        <section
          aria-label="סינון קסדות"
          className="mt-10 border border-[#222] bg-[#111] p-6"
        >
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e63000]">
            <Filter className="h-4 w-4" />
            סינון
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Brand */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">
                מותג
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={brand === "all"} onClick={() => setBrand("all")}>
                  הכל
                </FilterChip>
                {BRANDS.map((b) => (
                  <FilterChip key={b} active={brand === b} onClick={() => setBrand(b)}>
                    {b}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">
                רמה
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={level === "all"} onClick={() => setLevel("all")}>
                  הכל
                </FilterChip>
                {LEVELS.map((l) => (
                  <FilterChip key={l} active={level === l} onClick={() => setLevel(l)}>
                    {LEVEL_LABELS[l]}
                  </FilterChip>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">
                תקציב
              </p>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={budgetIdx === -1} onClick={() => setBudgetIdx(-1)}>
                  הכל
                </FilterChip>
                {PRICE_RANGES.map((r, i) => (
                  <FilterChip
                    key={r.label}
                    active={budgetIdx === i}
                    onClick={() => setBudgetIdx(i)}
                  >
                    {r.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#a0a0a0]">
            מציג {filtered.length} מתוך {HELMETS.length} קסדות
          </p>
        </section>

        {/* Results */}
        <section className="mt-10 grid gap-8 md:grid-cols-2">
          {filtered.map((h) => (
            <HelmetCard key={h.id} helmet={h} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full border border-[#222] bg-[#111] p-10 text-center text-[#888]">
              לא נמצאו קסדות שמתאימות לסינון. נסו לשחרר את הפילטרים.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
        active
          ? "border-[#e63000] bg-[#e63000]/15 text-[#f0f0f0]"
          : "border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-[#ccc]"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function HelmetCard({ helmet }: { helmet: HelmProduct }) {
  const imageSrc = getHelmetImage(helmet.slug);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${helmet.brand} ${helmet.model}`,
    image: `${SITE}${imageSrc}`,
    description: helmet.short_desc_he,
    brand: { "@type": "Brand", name: helmet.brand },
    sku: helmet.id,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      lowPrice: helmet.price_ils_approx,
      offerCount: helmet.retailers_israel.length,
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "תקן בטיחות", value: helmet.safety_standard },
      { "@type": "PropertyValue", name: "הגנה סיבובית", value: helmet.rotation_protection },
      { "@type": "PropertyValue", name: "משקל", value: `${helmet.weight_grams} גרם` },
      { "@type": "PropertyValue", name: "חומר קליפה", value: helmet.shell },
    ],
  };

  return (
    <article className="flex flex-col border border-[#222] bg-[#111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Link
        to="/products/helmets/$slug"
        params={{ slug: helmet.slug }}
        className="block"
      >
        <figure className="aspect-[4/3] overflow-hidden bg-white">
          <img
            src={imageSrc}
            alt={`קסדת ${helmet.brand} ${helmet.model}`}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
          />
        </figure>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
          {helmet.brand} · {LEVEL_LABELS[helmet.level]} · {helmet.year}
        </p>
        <h2 className="mt-2 font-frank text-2xl font-black leading-tight">
          <Link
            to="/products/helmets/$slug"
            params={{ slug: helmet.slug }}
            className="hover:text-[#e63000] transition-colors"
          >
            {helmet.brand} {helmet.model}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#ccc]">{helmet.short_desc_he}</p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#888]">
          <div>
            <dt className="font-bold text-[#a0a0a0]">תקן</dt>
            <dd className="text-[#ccc]">{helmet.safety_standard}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#a0a0a0]">הגנה סיבובית</dt>
            <dd className="text-[#ccc]">{helmet.rotation_protection}</dd>
          </div>
          <div>
            <dt className="font-bold text-[#a0a0a0]">משקל</dt>
            <dd className="text-[#ccc]">{helmet.weight_grams} גרם</dd>
          </div>
          <div>
            <dt className="font-bold text-[#a0a0a0]">קליפה</dt>
            <dd className="text-[#ccc]">{helmet.shell}</dd>
          </div>
        </dl>

        {helmet.includes_goggles && (
          <p className="mt-4 inline-block border border-[#1f3a1f] bg-[#0f1a0f] px-3 py-1 text-xs font-bold text-[#7ac674]">
            כולל גוגל במתנה
          </p>
        )}

        <div className="mt-5 flex items-baseline gap-2 border-t border-[#222] pt-4">
          <span className="text-3xl font-black text-[#f0f0f0]">
            ₪{helmet.price_ils_approx.toLocaleString("he-IL")}
          </span>
          <span className="text-xs text-[#a0a0a0]">מחיר משוער</span>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#888]">
              קנייה בישראל
            </p>
            <Link
              to="/products/helmets/$slug"
              params={{ slug: helmet.slug }}
              className="text-[11px] font-bold uppercase tracking-widest text-[#e63000] hover:underline"
            >
              סקירה מלאה ←
            </Link>
          </div>
          <ul className="space-y-2">
            {helmet.retailers_israel.map((r) => (
              <li key={r.url + r.store}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center justify-between border border-[#e63000]/60 bg-[#e63000]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#f0f0f0] transition-colors hover:bg-[#e63000]/20"
                >
                  <span className="flex items-center gap-2">
                    קנה ב{r.store}
                    {r.price_ils ? (
                      <span className="font-normal text-[#ccc]">
                        · ₪{r.price_ils.toLocaleString("he-IL")}
                      </span>
                    ) : null}
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}