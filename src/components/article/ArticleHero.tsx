import type { Article } from "@/lib/articles";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <header
      className="relative overflow-hidden"
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
    >
      <BrandHeroBackdrop label="ARTICLE · 00" />
      <div className="relative mx-auto max-w-[1320px] px-6 py-12 md:px-10 md:py-16">
        <div className="mb-6 flex items-center gap-3">
          <BrandEyebrow>{article.category}</BrandEyebrow>
          <span aria-hidden className="h-px w-12" style={{ background: "var(--green-400)" }} />
        </div>

        <h1
          className="mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--ink-900)",
            maxWidth: 920,
          }}
        >
          {article.title}
        </h1>

        <p
          className="mb-8 max-w-3xl"
          style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.7 }}
        >
          {article.excerpt}
        </p>

        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
          style={{ fontSize: 12.5, color: "var(--ink-600)", letterSpacing: "0.04em" }}
        >
          <span>
            כותב: <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{article.author}</span>
          </span>
          <span aria-hidden style={{ color: "var(--stone-300)" }}>·</span>
          <time dateTime={article.date} style={{ color: "var(--ink-900)" }}>
            {article.dateLabel}
          </time>
          {article.dateModified && article.dateModifiedLabel && (
            <>
              <span aria-hidden style={{ color: "var(--stone-300)" }}>·</span>
              <span>
                עודכן:{" "}
                <time dateTime={article.dateModified} style={{ color: "var(--ink-900)" }}>
                  {article.dateModifiedLabel}
                </time>
              </span>
            </>
          )}
          <span aria-hidden style={{ color: "var(--stone-300)" }}>·</span>
          <span style={{ color: "var(--green-700)", fontWeight: 600 }}>{article.readingTime}</span>
        </div>
      </div>
    </header>
  );
}