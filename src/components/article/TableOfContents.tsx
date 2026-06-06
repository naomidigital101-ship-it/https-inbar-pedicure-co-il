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
      className="sticky top-8 border border-[#222] bg-[#0a0a0a] p-6"
    >
      <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
        תוכן עניינים
      </h2>
      <ol className="space-y-3">
        {sections.map((s, idx) => {
          const isActive = activeId === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`flex items-start gap-3 border-r-2 pr-3 text-sm font-bold leading-snug transition-colors ${
                  isActive
                    ? "border-[#e63000] text-[#f0f0f0]"
                    : "border-transparent text-[#a0a0a0] hover:text-[#f0f0f0]"
                }`}
              >
                <span
                  className={`text-[10px] font-black ${
                    isActive ? "text-[#e63000]" : "text-[#909090]"
                  }`}
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