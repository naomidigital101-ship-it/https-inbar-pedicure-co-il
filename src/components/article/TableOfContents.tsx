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
      className="sticky top-8 border border-[#d6c5ac] bg-[#fefaf6] p-6"
    >
      <h2 className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
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
                    ? "border-[#8b3a52] text-[#2a1f1a]"
                    : "border-transparent text-[#6b5f55] hover:text-[#2a1f1a]"
                }`}
              >
                <span
                  className={`text-[10px] font-black ${
                    isActive ? "text-[#8b3a52]" : "text-[#6b5f55]"
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