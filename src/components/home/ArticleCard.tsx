import { Link } from "@tanstack/react-router";

export type WorkshopArticle = {
  modCode: string; // e.g. "[ MOD: 01 // MECH ]"
  category: string;
  title: string;
  excerpt: string;
  duration: string; // e.g. "08:00"
  image: string;
  imageAlt: string;
  slug?: string;
  noLeftBorder?: boolean;
};

export function ArticleCard({ article }: { article: WorkshopArticle }) {
  return (
    <article
      className={`group relative flex flex-col bg-[#0a0a0a] transition-colors hover:bg-[#111] ${
        article.noLeftBorder ? "" : "border-l border-[#222]"
      }`}
    >
      <Link
        to={article.slug ? "/article/$slug" : "/"}
        params={article.slug ? { slug: article.slug } : undefined}
        aria-label={article.title}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63000]"
      >
        <div className="absolute left-4 top-4 z-10 text-[10px] font-bold tracking-tighter text-[#909090]">
          {article.modCode}
        </div>

        <div className="aspect-video overflow-hidden border-b border-[#222]">
          <img
            src={article.image}
            alt={article.imageAlt}
            loading="lazy"
            className="block h-full w-full object-cover brightness-75"
          />
        </div>

        <div className="flex flex-1 flex-col p-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
              {article.category}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-[#222]" />
          </div>

          <h3 className="mb-4 text-2xl font-black leading-tight text-[#f0f0f0] transition-colors group-hover:text-[#e63000]">
            {article.title}
          </h3>

          <p className="mb-6 flex-1 text-sm font-bold leading-relaxed text-[#909090]">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-[#222] pt-6">
            <span className="text-[10px] font-bold uppercase text-[#909090]">
              DURATION: {article.duration}
            </span>
            <span
              aria-hidden="true"
              className="text-xl font-black text-[#e63000]"
            >
              ←
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}