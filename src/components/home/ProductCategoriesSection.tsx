import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";
import { getHelmetImage } from "@/lib/products/helmet-images";

const CATS = [
  {
    href: "/products/helmets",
    label: "קסדות שטח",
    desc: "מוטוקרוס, אנדורו, פול־פייס. השוואת מותגים, MIPS, משקל, אמינות.",
    count: HELMETS.length,
    image: HELMETS[0] ? getHelmetImage(HELMETS[0].slug) : undefined,
    code: "GEAR_01",
  },
  {
    href: "/products/body-armor",
    label: "מגני גוף",
    desc: "Roost guards, חליפות לחץ, מגני חזה. כולל מדריך לנשים.",
    count: BODY_ARMOR.length,
    image: BODY_ARMOR[0]?.unsplash_image,
    code: "GEAR_02",
  },
  {
    href: "/products/boots",
    label: "מגפי שטח",
    desc: "מוטוקרוס, אנדורו, אדוונצ'ר. תאימות knee brace, רוחב, עמידות.",
    count: BOOTS.length,
    image: BOOTS[0]?.unsplash_image,
    code: "GEAR_03",
  },
];

export function ProductCategoriesSection() {
  return (
    <section id="products" className="border-b border-[#222] bg-[#0a0a0a]">
      <div className="border-b border-[#222] px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
          // SECTION 03 // CATALOG
        </div>
        <h2 className="mt-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
          קטגוריות מוצרים
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-bold text-[#909090]">
          קטלוג ציוד מגן עם בדיקות, השוואות מחירים מחנויות ישראליות, ומדריכי מידות.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {CATS.map((c, idx) => (
          <a
            key={c.href}
            href={c.href}
            className={`group relative flex flex-col overflow-hidden bg-[#111] transition-colors hover:bg-[#181818] ${idx > 0 ? "md:border-r md:border-[#222]" : ""} border-b border-[#222] md:border-b-0`}
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#0a0a0a]">
              {c.image && (
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                  [ {c.code} ]
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
                  {c.count} מוצרים
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#f0f0f0] group-hover:text-[#e63000]">
                {c.label}
              </h3>
              <p className="text-sm font-bold leading-relaxed text-[#909090]">
                {c.desc}
              </p>
              <span className="mt-auto pt-4 text-xs font-black uppercase tracking-widest text-[#f0f0f0]">
                לכל המוצרים ←
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}