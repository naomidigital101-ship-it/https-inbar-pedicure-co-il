import type { Article } from "@/lib/articles";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <header className="border-b border-[#222] bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            {article.category}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-[#222]" />
        </div>

        <h1 className="mb-6 text-3xl font-black leading-tight text-[#f0f0f0] md:text-5xl lg:text-6xl">
          {article.title}
        </h1>

        <p className="mb-8 max-w-3xl text-base font-bold leading-relaxed text-[#999] md:text-lg">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-wider text-[#a0a0a0]">
          <span>
            כותב: <span className="text-[#f0f0f0]">{article.author}</span>
          </span>
          <span aria-hidden="true" className="text-[#333]">|</span>
          <time dateTime={article.date} className="text-[#f0f0f0]">
            {article.dateLabel}
          </time>
          {article.dateModified && article.dateModifiedLabel && (
            <>
              <span aria-hidden="true" className="text-[#333]">|</span>
              <span>
                עודכן:{" "}
                <time dateTime={article.dateModified} className="text-[#f0f0f0]">
                  {article.dateModifiedLabel}
                </time>
              </span>
            </>
          )}
          <span aria-hidden="true" className="text-[#333]">|</span>
          <span className="text-[#e63000]">{article.readingTime}</span>
        </div>
      </div>
    </header>
  );
}