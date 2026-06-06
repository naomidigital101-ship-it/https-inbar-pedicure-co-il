import { Link } from "@tanstack/react-router";
import type { ArticleCard } from "@/lib/article-cards";

export function CategoryGrid({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) {
    return (
      <div className="border border-[#222] bg-[#0a0a0a] p-12 text-center">
        <p className="text-base font-bold text-[#999]">
          עדיין אין מאמרים בקטגוריה הזו. בקרוב.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-[#222] sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a, idx) => (
        <Link
          key={a.slug}
          to="/article/$slug"
          params={{ slug: a.slug }}
          aria-label={a.title}
          className="group flex flex-col bg-[#0a0a0a] transition-colors hover:bg-[#111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63000]"
        >
          <div className="relative aspect-video overflow-hidden border-b border-[#222]">
            <div className="absolute left-4 top-4 z-10 text-[10px] font-bold tracking-tighter text-[#909090]">
              [ MOD: {String(idx + 1).padStart(2, "0")} ]
            </div>
            <img
              src={a.heroImage}
              alt={a.heroAlt}
              loading="lazy"
              className="block h-full w-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
                {a.category}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-[#222]" />
              <time
                dateTime={a.date}
                className="text-[10px] font-bold uppercase text-[#909090]"
              >
                {a.dateLabel}
              </time>
            </div>

            <h2 className="mb-3 text-xl font-black leading-tight text-[#f0f0f0] transition-colors group-hover:text-[#e63000]">
              {a.title}
            </h2>

            <p className="mb-5 flex-1 text-sm font-bold leading-relaxed text-[#a0a0a0]">
              {a.excerpt}
            </p>

            <div className="flex items-center justify-between border-t border-[#222] pt-4 text-[10px] font-bold uppercase tracking-wider text-[#909090]">
              <span>{a.readingTime}</span>
              <span aria-hidden="true" className="text-xl text-[#e63000]">
                ←
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}