import { Link } from "@tanstack/react-router";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="ניווט פירורי לחם"
      className="border-b border-[#b8dcd4] bg-[#fdfbf7]"
    >
      <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-4 text-xs font-bold text-[#6b5f55] md:px-8">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-[#5fa898]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-[#1d3a35]" : ""}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-[#6b5f55]">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}