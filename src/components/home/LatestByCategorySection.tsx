import type { ArticleCard } from "@/lib/article-cards";

const CATEGORIES = [
  { slug: "mechanic", label: "מכניקה ותחזוקה" },
  { slug: "bikes", label: "אופנועים וביקורות" },
  { slug: "parts", label: "חלקים באופנוע" },
  { slug: "gear", label: "ציוד מגן" },
  { slug: "trails", label: "מסלולי שטח" },
  { slug: "technique", label: "טכניקת רכיבה" },
] as const;

export function LatestByCategorySection({ cards }: { cards: ArticleCard[] }) {
  return (
    <section id="articles" className="border-b border-[#222] bg-[#0a0a0a]">
      <div className="border-b border-[#222] px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
          // SECTION 02 // LATEST
        </div>
        <h2 className="mt-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
          מאמרים אחרונים לפי קטגוריה
        </h2>
      </div>

      {CATEGORIES.map((cat) => {
        const items = cards
          .filter((a) => a.categorySlug === cat.slug)
          .slice()
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .slice(0, 3);
        if (items.length === 0) return null;
        return (
          <div key={cat.slug} className="border-b border-[#222] last:border-b-0">
            <div className="flex items-center justify-between border-b border-[#222] bg-[#111] px-8 py-4">
              <h3 className="text-lg font-black text-[#f0f0f0]">{cat.label}</h3>
              <a
                href={`/category/${cat.slug}`}
                className="text-[10px] font-bold uppercase tracking-widest text-[#e63000] hover:text-[#f0f0f0]"
              >
                כל המאמרים בקטגוריה ←
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {items.map((a, idx) => (
                <a
                  key={a.slug}
                  href={`/article/${a.slug}`}
                  className={`group flex flex-col bg-[#111] transition-colors hover:bg-[#181818] ${idx > 0 ? "md:border-r md:border-[#222]" : ""}`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                    <img
                      src={a.heroImage}
                      alt={a.heroAlt}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                      {a.dateLabel} // {a.readingTime}
                    </span>
                    <h4 className="text-lg font-black leading-tight text-[#f0f0f0] group-hover:text-[#e63000]">
                      {a.title}
                    </h4>
                    <p className="text-sm font-bold leading-relaxed text-[#909090] line-clamp-3">
                      {a.excerpt}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}