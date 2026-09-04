import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/articles";
import { C, LatinEyebrow, TrackedLabel, READ_MORE_LINK } from "./editorial";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      style={{ background: C.paper, borderTop: `1px solid ${C.line}` }}
    >
      <div className="mx-auto max-w-[1150px] px-[6%] py-24 md:py-28">
        <div className="mb-16 text-center">
          <LatinEyebrow tracking="0.5em" fontSize={15} className="mb-4">
            Journal
          </LatinEyebrow>
          <h2
            id="related-heading"
            style={{ fontWeight: 700, fontSize: "1.75rem", color: C.ink, margin: 0 }}
          >
            מאמרים נוספים בנושא
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-[60px]">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/article/$slug"
              params={{ slug: a.slug }}
              className="flex flex-col items-center gap-3.5 text-center"
              aria-label={a.title}
            >
              <TrackedLabel>{a.category}</TrackedLabel>
              <h3 style={{ fontWeight: 600, fontSize: 18, lineHeight: 1.6, color: C.ink }}>
                {a.title}
              </h3>
              <span
                style={{ fontWeight: 300, fontSize: 14.5, lineHeight: 1.95, color: C.mutedSoft }}
              >
                {a.excerpt}
              </span>
              <span style={{ ...READ_MORE_LINK, marginTop: 8 }}>לקריאה</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
