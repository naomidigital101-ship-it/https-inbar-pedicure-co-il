import { Check, ArrowLeft, Droplets, Repeat, Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  type BootProduct,
  TYPE_LABELS,
  LEVEL_LABELS,
  WIDTH_LABELS,
} from "@/lib/products/boots";

type Props = { product: BootProduct };

export function BootCard({ product }: Props) {
  const minPrice = product.retailers_israel.reduce<number | null>((acc, r) => {
    if (typeof r.price_ils !== "number") return acc;
    if (acc === null || r.price_ils < acc) return r.price_ils;
    return acc;
  }, null);

  const maxPrice = product.retailers_israel.reduce<number | null>((acc, r) => {
    if (typeof r.price_ils !== "number") return acc;
    if (acc === null || r.price_ils > acc) return r.price_ils;
    return acc;
  }, null);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.model}`,
    brand: { "@type": "Brand", name: product.brand },
    image: product.unsplash_image,
    description: product.short_desc_he,
    ...(minPrice !== null && maxPrice !== null
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "ILS",
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: product.retailers_israel.filter(
              (r) => typeof r.price_ils === "number",
            ).length,
          },
        }
      : {}),
  };

  return (
    <article className="flex flex-col border border-[#222] bg-[#0f0f0f]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Link
          to="/products/boots/$slug"
          params={{ slug: product.slug }}
          aria-label={`לעמוד המוצר של ${product.brand} ${product.model}`}
          className="block h-full w-full"
        >
          <img
            src={product.unsplash_image}
            alt={`${product.brand} ${product.model} - מגף שטח לאופנוע`}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <span className="absolute right-3 top-3 bg-[#e63000] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {LEVEL_LABELS[product.level]}
        </span>
        {product.women_version_available && (
          <span className="absolute left-3 top-3 bg-[#8b5cf6] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            גרסת נשים
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#888]">
            {product.brand} · {product.year} · {TYPE_LABELS[product.type]}
          </div>
          <h3 className="mt-1 font-['Frank_Ruhl_Libre'] text-xl font-bold text-[#f0f0f0]">
            <Link
              to="/products/boots/$slug"
              params={{ slug: product.slug }}
              className="transition-colors hover:text-[#e63000]"
            >
              {product.model}
            </Link>
          </h3>
        </header>

        <p className="text-sm leading-relaxed text-[#bbb]">{product.short_desc_he}</p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="border border-[#333] bg-[#080808] px-2 py-1 text-[#ccc]">
            <Shield className="ml-1 inline h-3 w-3 text-[#e63000]" />
            {WIDTH_LABELS[product.toe_box_width]}
          </span>
          {product.waterproof && (
            <span className="border border-[#333] bg-[#080808] px-2 py-1 text-[#ccc]">
              <Droplets className="ml-1 inline h-3 w-3 text-[#3b82f6]" />
              עמיד למים
            </span>
          )}
          {product.replaceable_sole && (
            <span className="border border-[#333] bg-[#080808] px-2 py-1 text-[#ccc]">
              <Repeat className="ml-1 inline h-3 w-3 text-[#7ac674]" />
              סוליה מתחלפת
            </span>
          )}
          <span className="border border-[#333] bg-[#080808] px-2 py-1 text-[#ccc]">
            {product.weight_grams_per_boot}g
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="border border-[#e63000]/30 bg-[#e63000]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
            {product.safety_standard}
          </span>
        </div>

        <ul className="space-y-1.5 text-sm text-[#ccc]">
          {product.pros_he.slice(0, 3).map((pro, i) => (
            <li key={i} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e63000]" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-3 border-t border-[#222] pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888]">
              מחיר משוער
            </span>
            <span className="font-['Frank_Ruhl_Libre'] text-2xl font-bold text-[#f0f0f0]">
              ₪{product.price_ils_approx.toLocaleString("he-IL")}
            </span>
          </div>

          <Link
            to="/products/boots/$slug"
            params={{ slug: product.slug }}
            className="flex items-center justify-between border border-[#e63000] bg-[#e63000] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#c45200]"
          >
            <span>לעמוד המוצר המלא</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}