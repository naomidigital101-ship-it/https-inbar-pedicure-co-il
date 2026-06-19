import { Link } from "@tanstack/react-router";
import type { ArticleCard } from "@/lib/article-cards";
import { BrandEyebrow, SerifNumber } from "@/components/brand/BrandPrimitives";

export function CategoryGrid({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) {
    return (
      <div
        className="p-12 text-center"
        style={{ background: "var(--paper)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
      >
        <p style={{ color: "var(--ink-600)", fontSize: 15 }}>עדיין אין מאמרים בקטגוריה הזו. בקרוב.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3"
      style={{ background: "var(--stone-100)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
    >
      {articles.map((a, idx) => (
        <Link
          key={a.slug}
          to="/article/$slug"
          params={{ slug: a.slug }}
          aria-label={a.title}
          className="group flex flex-col transition-colors"
          style={{ background: "var(--paper)" }}
        >
          <div className="relative aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--stone-100)" }}>
            <SerifNumber
              className="absolute left-4 top-4 z-10"
              style={{ fontSize: "1.4rem", color: "var(--paper)", textShadow: "0 1px 2px rgba(0,0,0,.4)" }}
            >
              {String(idx + 1).padStart(2, "0")}
            </SerifNumber>
            <img
              src={a.heroImage}
              alt={a.heroAlt}
              loading="lazy"
              className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-3 flex items-center gap-2">
              <BrandEyebrow style={{ fontSize: 11 }}>{a.category}</BrandEyebrow>
              <span aria-hidden className="h-px w-8" style={{ background: "var(--green-400)" }} />
              <time
                dateTime={a.date}
                style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.06em" }}
              >
                {a.dateLabel}
              </time>
            </div>

            <h2
              className="mb-3 transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "1.25rem",
                color: "var(--ink-900)",
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              {a.title}
            </h2>

            <p className="mb-5 flex-1" style={{ color: "var(--ink-600)", fontSize: 14, lineHeight: 1.65 }}>
              {a.excerpt}
            </p>

            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: "1px solid var(--stone-100)", fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.06em" }}
            >
              <span>{a.readingTime}</span>
              <span aria-hidden style={{ color: "var(--green-700)", fontSize: 18 }}>←</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}