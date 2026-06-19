import { Link } from "@tanstack/react-router";

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

  const pageHref = (p: number) =>
    p === 1 ? undefined : { page: p };

  const navStyle = { background: "var(--paper)", border: "1px solid var(--stone-100)", color: "var(--ink-900)", borderRadius: 999 } as const;
  const navDisabled = { background: "var(--paper)", border: "1px solid var(--stone-100)", color: "var(--stone-300)", borderRadius: 999 } as const;
  return (
    <nav
      aria-label="ניווט עמודים"
      className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-8"
      style={{ borderTop: "1px solid var(--stone-100)" }}
    >
      <div style={{ fontSize: 11, color: "var(--ink-600)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
        עמוד {currentPage} מתוך {totalPages}
      </div>

      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {prev ? (
            <Link
              to="/category/$slug"
              params={{ slug: categorySlug }}
              search={pageHref(prev)}
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{ ...navStyle, fontSize: 12, fontWeight: 600 }}
              aria-label="עמוד קודם"
            >
              <span aria-hidden>→</span>
              הקודם
            </Link>
          ) : (
            <span
              aria-disabled
              className="inline-flex cursor-not-allowed items-center gap-2 px-4 py-2"
              style={{ ...navDisabled, fontSize: 12, fontWeight: 600 }}
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
                  style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 14 }}
                >
                  {p}
                </span>
              ) : (
                <Link
                  to="/category/$slug"
                  params={{ slug: categorySlug }}
                  search={pageHref(p)}
                  className="inline-flex h-10 w-10 items-center justify-center"
                  style={{ ...navStyle, fontSize: 14, fontWeight: 600 }}
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
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{ ...navStyle, fontSize: 12, fontWeight: 600 }}
              aria-label="עמוד הבא"
            >
              הבא
              <span aria-hidden>←</span>
            </Link>
          ) : (
            <span
              aria-disabled
              className="inline-flex cursor-not-allowed items-center gap-2 px-4 py-2"
              style={{ ...navDisabled, fontSize: 12, fontWeight: 600 }}
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