import { Check, X as XIcon, Info, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { YouTubeEmbed } from "@/components/product/YouTubeEmbed";
import type { BodyArmorProduct } from "@/lib/products/body-armor";

type Props = { product: BodyArmorProduct };

const zones: { key: keyof BodyArmorProduct; label: string }[] = [
  { key: "has_back_protection", label: "גב" },
  { key: "has_shoulder_protection", label: "כתפיים" },
  { key: "has_elbow_protection", label: "מרפקים" },
  { key: "has_kidney_belt", label: "כליות" },
];

export function ArmorCard({ product }: Props) {
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
          to="/products/body-armor/$slug"
          params={{ slug: product.slug }}
          aria-label={`לעמוד המוצר של ${product.brand} ${product.model}`}
          className="block h-full w-full"
        >
          <img
            src={product.unsplash_image}
            alt={`${product.brand} ${product.model} - מגן גוף לאופנוע שטח`}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
          />
        </Link>
        {product.gender === "women" && (
          <span className="absolute right-3 top-3 bg-[#8b5cf6] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            ייעודי לנשים
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <header>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#888]">
            {product.brand} · {product.year}
          </div>
          <h3 className="mt-1 font-['Frank_Ruhl_Libre'] text-xl font-bold text-[#f0f0f0]">
            <Link
              to="/products/body-armor/$slug"
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
            <Check className="ml-1 inline h-3 w-3 text-[#e63000]" />
            חזה
          </span>
          {zones.map((z) => {
            const has = Boolean(product[z.key]);
            return (
              <span
                key={z.label}
                className={
                  has
                    ? "border border-[#333] bg-[#080808] px-2 py-1 text-[#ccc]"
                    : "border border-[#222] bg-[#080808] px-2 py-1 text-[#909090] line-through"
                }
              >
                {has ? (
                  <Check className="ml-1 inline h-3 w-3 text-[#e63000]" />
                ) : (
                  <XIcon className="ml-1 inline h-3 w-3" />
                )}
                {z.label}
              </span>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.safety_certifications.map((cert, i) => (
            <span
              key={i}
              className="border border-[#e63000]/30 bg-[#e63000]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e63000]"
            >
              {cert}
            </span>
          ))}
        </div>

        <ul className="space-y-1.5 text-sm text-[#ccc]">
          {product.pros_he.slice(0, 3).map((pro, i) => (
            <li key={i} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#e63000]" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>

        {product.women_notes && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-fit items-center gap-2 border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-3 py-2 text-xs font-bold text-[#a78bfa] transition-colors hover:bg-[#8b5cf6]/20"
              >
                <Info className="h-3.5 w-3.5" />
                הערה לנשים
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className="w-80 border-[#333] bg-[#0a0a0a] text-right text-sm leading-relaxed text-[#ddd]"
            >
              {product.women_notes}
            </PopoverContent>
          </Popover>
        )}

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
            to="/products/body-armor/$slug"
            params={{ slug: product.slug }}
            className="flex items-center justify-between border border-[#e63000] bg-[#e63000] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#c45200]"
          >
            <span>לעמוד המוצר המלא</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="space-y-2">
            {product.retailers_israel.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center justify-between border border-[#333] bg-[#080808] px-3 py-2 text-sm transition-colors hover:border-[#e63000] hover:text-[#f0f0f0]"
              >
                <span className="text-[#ddd]">{r.store}</span>
                <span className="text-xs text-[#888]">
                  {typeof r.price_ils === "number"
                    ? `₪${r.price_ils.toLocaleString("he-IL")}`
                    : "בדוק באתר"}
                </span>
              </a>
            ))}
          </div>
        </div>

        {product.video_youtube_id && (
          <div className="border-t border-[#222] pt-4">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">
              סקירה מצולמת
            </div>
            <YouTubeEmbed
              youtubeId={product.video_youtube_id}
              title={product.video_title ?? `${product.brand} ${product.model} review`}
            />
          </div>
        )}
      </div>
    </article>
  );
}
