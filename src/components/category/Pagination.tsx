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

  return (
    <nav
      aria-label="ניווט עמודים"
      className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#222] pt-8"
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#909090]">
        עמוד {currentPage} מתוך {totalPages}
      </div>

      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {prev ? (
            <Link
              to="/category/$slug"
              params={{ slug: categorySlug }}
              search={pageHref(prev)}
              className="inline-flex items-center gap-2 border border-[#222] bg-[#0a0a0a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#f0f0f0] transition-colors hover:border-[#e63000] hover:text-[#e63000]"
              aria-label="עמוד קודם"
            >
              <span aria-hidden="true">→</span>
              הקודם
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#333]"
            >
              <span aria-hidden="true">→</span>
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
                  className="inline-flex h-10 w-10 items-center justify-center bg-[#e63000] text-sm font-black text-[#0a0a0a]"
                >
                  {p}
                </span>
              ) : (
                <Link
                  to="/category/$slug"
                  params={{ slug: categorySlug }}
                  search={pageHref(p)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#222] bg-[#0a0a0a] text-sm font-black text-[#999] transition-colors hover:border-[#e63000] hover:text-[#e63000]"
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
              className="inline-flex items-center gap-2 border border-[#222] bg-[#0a0a0a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#f0f0f0] transition-colors hover:border-[#e63000] hover:text-[#e63000]"
              aria-label="עמוד הבא"
            >
              הבא
              <span aria-hidden="true">←</span>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#333]"
            >
              הבא
              <span aria-hidden="true">←</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}