import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/articles";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-[#b8dcd4] bg-[#fdfbf7]"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
            [ MOD: NEXT // READ ]
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-[#b8dcd4]" />
        </div>
        <h2
          id="related-heading"
          className="mb-10 text-3xl font-black text-[#1d3a35] md:text-4xl"
        >
          מאמרים נוספים שיעניינו אותך
        </h2>

        <div className="grid grid-cols-1 gap-px bg-[#b8dcd4] md:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/article/$slug"
              params={{ slug: a.slug }}
              className="group flex flex-col bg-[#fdfbf7] transition-colors hover:bg-[#e9f4f1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5fa898]"
              aria-label={a.title}
            >
              <div className="aspect-video overflow-hidden border-b border-[#b8dcd4]">
                <img
                  src={a.heroImage}
                  alt={a.heroAlt}
                  loading="lazy"
                  className="block h-full w-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
                  {a.category}
                </div>
                <h3 className="mb-3 text-xl font-black leading-tight text-[#1d3a35] transition-colors group-hover:text-[#5fa898]">
                  {a.title}
                </h3>
                <p className="mb-4 flex-1 text-sm font-bold leading-relaxed text-[#6b5f55]">
                  {a.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-[#b8dcd4] pt-4 text-[10px] font-bold uppercase tracking-wider text-[#6b5f55]">
                  <span>{a.readingTime}</span>
                  <span aria-hidden="true" className="text-[#5fa898]">
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