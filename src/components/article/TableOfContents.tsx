import { useEffect, useState } from "react";
import type { ArticleSection } from "@/lib/articles";

export function TableOfContents({ sections }: { sections: ArticleSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="תוכן עניינים"
      className="sticky top-8 p-6"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--stone-100)",
        borderRadius: 16,
      }}
    >
      <h2
        className="mb-4"
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--green-700)",
          fontWeight: 600,
        }}
      >
        תוכן עניינים
      </h2>
      <ol className="space-y-3">
        {sections.map((s, idx) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-start gap-3 pr-3 transition-colors"
                style={{
                  borderInlineEnd: `2px solid ${isActive ? "var(--green-600)" : "transparent"}`,
                  color: isActive ? "var(--ink-900)" : "var(--ink-600)",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 700,
                    fontSize: 12,
                    color: isActive ? "var(--green-700)" : "var(--ink-600)",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{s.heading}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}