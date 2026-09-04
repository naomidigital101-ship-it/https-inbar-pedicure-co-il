import { Link } from "@tanstack/react-router";
import type { ArticleCard } from "@/lib/article-cards";
import { C, TrackedLabel, READ_MORE_LINK } from "@/components/article/editorial";

export function CategoryGrid({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) {
    return (
      <div
        className="px-6 py-16 text-center"
        style={{ background: C.paper, border: `1px solid ${C.line}` }}
      >
        <p style={{ color: C.muted, fontSize: 15, fontWeight: 300, letterSpacing: "0.04em" }}>
          עדיין אין מאמרים בקטגוריה הזו. מאמרים חדשים נוספים כאן מדי חודש.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[60px]">
      {articles.map((a) => (
        <Link
          key={a.slug}
          to="/article/$slug"
          params={{ slug: a.slug }}
          aria-label={a.title}
          className="flex flex-col items-center gap-3.5 text-center"
        >
          <span
            className="mb-2 block w-full overflow-hidden"
            style={{ background: C.creamDeep, aspectRatio: "16 / 10", filter: "saturate(0.85)" }}
          >
            <img
              src={a.heroImage}
              alt={a.heroAlt}
              loading="lazy"
              className="block h-full w-full object-cover"
            />
          </span>

          <TrackedLabel>
            {a.category} · {a.dateLabel}
          </TrackedLabel>

          <h3 style={{ fontWeight: 600, fontSize: 18, lineHeight: 1.6, color: C.ink }}>
            {a.title}
          </h3>

          <p style={{ fontWeight: 300, fontSize: 14.5, lineHeight: 1.95, color: C.mutedSoft }}>
            {a.excerpt}
          </p>

          <span style={{ ...READ_MORE_LINK, marginTop: 8 }}>לקריאה</span>
        </Link>
      ))}
    </div>
  );
}
