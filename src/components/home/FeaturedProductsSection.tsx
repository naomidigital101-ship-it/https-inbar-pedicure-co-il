import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";
import { getHelmetImage } from "@/lib/products/helmet-images";

type FeatItem = {
  href: string;
  brand: string;
  model: string;
  badge: string;
  desc: string;
  price: number;
  image: string;
};

const helmetPick = HELMETS.filter((h) => h.level === "pro" || h.level === "elite").slice(0, 2);
const bootPick = BOOTS.filter((b) => b.level === "pro" || b.level === "elite").slice(0, 2);
const armorPick = BODY_ARMOR.slice(0, 2);

const ITEMS: FeatItem[] = [
  ...helmetPick.map((h) => ({
    href: `/products/helmets/${h.slug}`,
    brand: h.brand,
    model: h.model,
    badge: "קסדה",
    desc: h.short_desc_he,
    price: h.price_ils_approx,
    image: getHelmetImage(h.slug),
  })),
  ...armorPick.map((a) => ({
    href: `/products/body-armor/${a.slug}`,
    brand: a.brand,
    model: a.model,
    badge: "מגן גוף",
    desc: a.short_desc_he,
    price: a.price_ils_approx,
    image: a.unsplash_image,
  })),
  ...bootPick.map((b) => ({
    href: `/products/boots/${b.slug}`,
    brand: b.brand,
    model: b.model,
    badge: "מגף",
    desc: b.short_desc_he,
    price: b.price_ils_approx,
    image: b.unsplash_image,
  })),
];

export function FeaturedProductsSection() {
  return (
    <section className="border-b border-[#222] bg-[#0a0a0a]">
      <div className="border-b border-[#222] px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
          // SECTION 04 // PICKS
        </div>
        <h2 className="mt-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
          מוצרים מומלצים
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-bold text-[#909090]">
          המבחר שלנו ל-2025. עבר בדיקה מעשית, לא רק שיווק.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((p, idx) => (
          <a
            key={p.href}
            href={p.href}
            className={`group flex flex-col bg-[#111] transition-colors hover:bg-[#181818] border-[#222] ${idx % 3 !== 0 ? "lg:border-r" : ""} ${idx % 2 !== 0 ? "sm:border-r" : ""} border-b`}
          >
            <div className="aspect-square overflow-hidden bg-[#0a0a0a]">
              <img
                src={p.image}
                alt={`${p.brand} ${p.model}`}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <span className="border border-[#222] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                  {p.badge}
                </span>
                <span className="text-xs font-black text-[#f0f0f0]">
                  ₪{p.price.toLocaleString("he-IL")}
                </span>
              </div>
              <h3 className="text-lg font-black leading-tight text-[#f0f0f0] group-hover:text-[#e63000]">
                {p.brand} {p.model}
              </h3>
              <p className="text-sm font-bold leading-relaxed text-[#909090] line-clamp-2">
                {p.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}