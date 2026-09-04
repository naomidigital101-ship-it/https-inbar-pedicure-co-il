import type { Article } from "@/lib/articles";
import { C, TrackedLabel } from "./editorial";

export function ArticleHero({ article }: { article: Article }) {
  return (
    <header style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }}>
      <div className="mx-auto max-w-[900px] px-[6%] py-16 text-center md:py-24">
        <TrackedLabel className="mb-6">{article.category}</TrackedLabel>

        <h1
          style={{
            fontWeight: 700,
            fontSize: "clamp(1.9rem, 4.2vw, 2.9rem)",
            lineHeight: 1.35,
            color: C.ink,
            margin: "0 0 20px",
            textWrap: "balance",
          }}
        >
          {article.title}
        </h1>

        <p
          style={{
            fontWeight: 300,
            fontSize: "1.125rem",
            lineHeight: 1.85,
            color: C.muted,
            margin: "0 auto 40px",
            maxWidth: 640,
          }}
        >
          {article.excerpt}
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 24,
            fontSize: 12.5,
            fontWeight: 300,
            letterSpacing: "0.08em",
            color: C.mutedSoft,
          }}
        >
          <span>
            מאת <span style={{ color: C.ink, fontWeight: 400 }}>{article.author}</span>
          </span>
          <span aria-hidden style={{ color: C.edge }}>
            ·
          </span>
          <time dateTime={article.date} style={{ color: C.ink }}>
            {article.dateLabel}
          </time>
          {article.dateModified && article.dateModifiedLabel && (
            <>
              <span aria-hidden style={{ color: C.edge }}>
                ·
              </span>
              <span>
                עודכן{" "}
                <time dateTime={article.dateModified} style={{ color: C.ink }}>
                  {article.dateModifiedLabel}
                </time>
              </span>
            </>
          )}
          <span aria-hidden style={{ color: C.edge }}>
            ·
          </span>
          <span style={{ color: C.green }}>{article.readingTime}</span>
        </div>
      </div>
    </header>
  );
}
