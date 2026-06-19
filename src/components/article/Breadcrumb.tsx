import { Link } from "@tanstack/react-router";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="ניווט פירורי לחם"
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
    >
      <ol
        className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-2 px-6 py-3 md:px-10"
        style={{ fontSize: 12, color: "var(--ink-600)" }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  style={{ color: "var(--ink-600)" }}
                  className="transition-colors hover:text-[var(--green-700)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  style={{ color: isLast ? "var(--ink-900)" : "var(--ink-600)", fontWeight: isLast ? 600 : 400 }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden style={{ color: "var(--stone-300)" }}>
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