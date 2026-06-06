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
      className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#b8dcd4] pt-8"
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b5f55]">
        עמוד {currentPage} מתוך {totalPages}
      </div>

      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {prev ? (
            <Link
              to="/category/$slug"
              params={{ slug: categorySlug }}
              search={pageHref(prev)}
              className="inline-flex items-center gap-2 border border-[#b8dcd4] bg-[#fdfbf7] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1d3a35] transition-colors hover:border-[#5fa898] hover:text-[#5fa898]"
              aria-label="עמוד קודם"
            >
              <span aria-hidden="true">→</span>
              הקודם
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 border border-[#ede2d4] bg-[#fdfbf7] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#c9b8a3]"
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
                  className="inline-flex h-10 w-10 items-center justify-center bg-[#5fa898] text-sm font-black text-[#fdfbf7]"
                >
                  {p}
                </span>
              ) : (
                <Link
                  to="/category/$slug"
                  params={{ slug: categorySlug }}
                  search={pageHref(p)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#b8dcd4] bg-[#fdfbf7] text-sm font-black text-[#5a4f48] transition-colors hover:border-[#5fa898] hover:text-[#5fa898]"
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
              className="inline-flex items-center gap-2 border border-[#b8dcd4] bg-[#fdfbf7] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1d3a35] transition-colors hover:border-[#5fa898] hover:text-[#5fa898]"
              aria-label="עמוד הבא"
            >
              הבא
              <span aria-hidden="true">←</span>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 border border-[#ede2d4] bg-[#fdfbf7] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#c9b8a3]"
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