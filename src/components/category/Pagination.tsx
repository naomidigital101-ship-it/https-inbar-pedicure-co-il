import { Link } from "@tanstack/react-router";
import { C } from "@/components/article/editorial";

export function Pagination({
  categorySlug,
  currentPage,
  totalPages,
}: {
  categorySlug: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  const pageHref = (p: number) => (p === 1 ? undefined : { page: p });

  const stepStyle = {
    border: `1px solid ${C.ink}`,
    color: C.ink,
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: "0.14em",
  } as const;
  const stepDisabled = {
    border: `1px solid ${C.line}`,
    color: C.edge,
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: "0.14em",
  } as const;
  const numStyle = {
    border: `1px solid ${C.line}`,
    color: C.ink,
    fontSize: 14,
    fontWeight: 300,
  } as const;

  return (
    <nav
      aria-label="ניווט עמודים"
      className="mt-16 flex flex-wrap items-center justify-between gap-4 pt-8"
      style={{ borderTop: `1px solid ${C.line}` }}
    >
      <div style={{ fontSize: 12, color: C.mutedSoft, letterSpacing: "0.24em", fontWeight: 400 }}>
        עמוד {currentPage} מתוך {totalPages}
      </div>

      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {prev ? (
            <Link
              to="/category/$slug"
              params={{ slug: categorySlug }}
              search={pageHref(prev)}
              className="inline-flex items-center gap-2 px-5 py-2.5 transition-colors hover:bg-[#0E3B2E] hover:text-white"
              style={stepStyle}
              aria-label="עמוד קודם"
            >
              <span aria-hidden>→</span>
              הקודם
            </Link>
          ) : (
            <span
              aria-disabled
              className="inline-flex cursor-not-allowed items-center gap-2 px-5 py-2.5"
              style={stepDisabled}
            >
              <span aria-hidden>→</span>
              הקודם
            </span>
          )}
        </li>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <li key={p}>
              {isActive ? (
                <span
                  aria-current="page"
                  className="inline-flex h-10 w-10 items-center justify-center"
                  style={{ background: C.green, color: C.paper, fontSize: 14, fontWeight: 400 }}
                >
                  {p}
                </span>
              ) : (
                <Link
                  to="/category/$slug"
                  params={{ slug: categorySlug }}
                  search={pageHref(p)}
                  className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:border-[#141414]"
                  style={numStyle}
                  aria-label={`עמוד ${p}`}
                >
                  {p}
                </Link>
              )}
            </li>
          );
        })}

        <li>
          {next ? (
            <Link
              to="/category/$slug"
              params={{ slug: categorySlug }}
              search={pageHref(next)}
              className="inline-flex items-center gap-2 px-5 py-2.5 transition-colors hover:bg-[#0E3B2E] hover:text-white"
              style={stepStyle}
              aria-label="עמוד הבא"
            >
              הבא
              <span aria-hidden>←</span>
            </Link>
          ) : (
            <span
              aria-disabled
              className="inline-flex cursor-not-allowed items-center gap-2 px-5 py-2.5"
              style={stepDisabled}
            >
              הבא
              <span aria-hidden>←</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
