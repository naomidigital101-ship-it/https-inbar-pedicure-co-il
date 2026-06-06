import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/articles";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-[#222] bg-[#0a0a0a]"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            [ MOD: NEXT // READ ]
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-[#222]" />
        </div>
        <h2
          id="related-heading"
          className="mb-10 text-3xl font-black text-[#f0f0f0] md:text-4xl"
        >
          מאמרים נוספים שיעניינו אותך
        </h2>

        <div className="grid grid-cols-1 gap-px bg-[#222] md:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/article/$slug"
              params={{ slug: a.slug }}
              className="group flex flex-col bg-[#0a0a0a] transition-colors hover:bg-[#111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63000]"
              aria-label={a.title}
            >
              <div className="aspect-video overflow-hidden border-b border-[#222]">
                <img
                  src={a.heroImage}
                  alt={a.heroAlt}
                  loading="lazy"
                  className="block h-full w-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
                  {a.category}
                </div>
                <h3 className="mb-3 text-xl font-black leading-tight text-[#f0f0f0] transition-colors group-hover:text-[#e63000]">
                  {a.title}
                </h3>
                <p className="mb-4 flex-1 text-sm font-bold leading-relaxed text-[#a0a0a0]">
                  {a.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-[#222] pt-4 text-[10px] font-bold uppercase tracking-wider text-[#909090]">
                  <span>{a.readingTime}</span>
                  <span aria-hidden="true" className="text-[#e63000]">
                    ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}