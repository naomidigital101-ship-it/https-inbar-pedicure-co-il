import { Link } from "@tanstack/react-router";
import { C } from "./editorial";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="ניווט פירורי לחם"
      style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }}
    >
      <ol
        className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-2 px-[6%] py-4"
        style={{ fontSize: 12, fontWeight: 300, letterSpacing: "0.06em", color: C.mutedSoft }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  style={{ color: C.mutedSoft }}
                  className="transition-colors hover:text-[#0E3B2E]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  style={{
                    color: isLast ? C.ink : C.mutedSoft,
                    fontWeight: isLast ? 400 : 300,
                  }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden style={{ color: C.edge }}>
                  ·
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
