import type { Article } from "@/lib/articles";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <header className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
            {article.category}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-[#b8dcd4]" />
        </div>

        <h1 className="mb-6 text-3xl font-black leading-tight text-[#1d3a35] md:text-5xl lg:text-6xl">
          {article.title}
        </h1>

        <p className="mb-8 max-w-3xl text-base font-bold leading-relaxed text-[#5a4f48] md:text-lg">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-wider text-[#6b5f55]">
          <span>
            כותב: <span className="text-[#1d3a35]">{article.author}</span>
          </span>
          <span aria-hidden="true" className="text-[#c9b8a3]">|</span>
          <time dateTime={article.date} className="text-[#1d3a35]">
            {article.dateLabel}
          </time>
          {article.dateModified && article.dateModifiedLabel && (
            <>
              <span aria-hidden="true" className="text-[#c9b8a3]">|</span>
              <span>
                עודכן:{" "}
                <time dateTime={article.dateModified} className="text-[#1d3a35]">
                  {article.dateModifiedLabel}
                </time>
              </span>
            </>
          )}
          <span aria-hidden="true" className="text-[#c9b8a3]">|</span>
          <span className="text-[#5fa898]">{article.readingTime}</span>
        </div>
      </div>
    </header>
  );
}