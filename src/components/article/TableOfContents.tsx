import { useEffect, useState } from "react";
import type { ArticleSection } from "@/lib/articles";
import { BODONI, C } from "./editorial";

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
      className="sticky top-8"
      style={{ borderTop: `1px solid ${C.line}`, paddingTop: 22 }}
    >
      <h2
        className="mb-4"
        style={{
          fontSize: 12,
          letterSpacing: "0.3em",
          color: C.mutedSoft,
          fontWeight: 400,
        }}
      >
        תוכן עניינים
      </h2>
      <ol>
        {sections.map((s, idx) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id} style={{ borderBottom: `1px solid ${C.line}` }}>
              <a
                href={`#${s.id}`}
                className="flex items-start gap-3 py-3 transition-colors"
                style={{
                  borderInlineEnd: `1px solid ${isActive ? C.green : "transparent"}`,
                  paddingInlineEnd: 12,
                  color: isActive ? C.ink : C.muted,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 300,
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    fontFamily: BODONI,
                    fontWeight: 400,
                    fontSize: 13,
                    color: isActive ? C.green : C.taupe,
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
