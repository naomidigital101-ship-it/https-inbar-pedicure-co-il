import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/articles";
import { BrandEyebrow } from "@/components/brand/BrandPrimitives";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      style={{ background: "var(--paper)", borderTop: "1px solid var(--stone-100)" }}
    >
      <div className="mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
        <div className="mb-8 flex items-center gap-3">
          <BrandEyebrow>READ NEXT</BrandEyebrow>
          <span aria-hidden className="h-px flex-1" style={{ background: "var(--stone-100)" }} />
        </div>
        <h2
          id="related-heading"
          className="mb-10"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)",
            letterSpacing: "-0.02em",
            color: "var(--ink-900)",
            lineHeight: 1.1,
          }}
        >
          מאמרים נוספים שיעניינו אותך
        </h2>

        <div
          className="grid grid-cols-1 gap-px overflow-hidden md:grid-cols-3"
          style={{ background: "var(--stone-100)", border: "1px solid var(--stone-100)", borderRadius: 20 }}
        >
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/article/$slug"
              params={{ slug: a.slug }}
              className="group flex flex-col transition-colors"
              style={{ background: "var(--paper)" }}
              aria-label={a.title}
            >
              <div className="aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--stone-100)" }}>
                <img
                  src={a.heroImage}
                  alt={a.heroAlt}
                  loading="lazy"
                  className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <BrandEyebrow style={{ fontSize: 11 }}>{a.category}</BrandEyebrow>
                <h3
                  className="mt-3 mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontSize: "1.2rem",
                    color: "var(--ink-900)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                  }}
                >
                  {a.title}
                </h3>
                <p className="mb-4 flex-1" style={{ color: "var(--ink-600)", fontSize: 14, lineHeight: 1.65 }}>
                  {a.excerpt}
                </p>
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid var(--stone-100)", fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.06em" }}
                >
                  <span>{a.readingTime}</span>
                  <span aria-hidden style={{ color: "var(--green-700)" }}>←</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}