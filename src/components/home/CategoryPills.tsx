import { categories, type ArticleCategory } from "@/lib/placeholder-articles";

export type CategoryFilter = ArticleCategory | "הכל";

const all: CategoryFilter[] = ["הכל", ...categories];

export function CategoryPills({
  active,
  onChange,
}: {
  active: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="סינון לפי קטגוריה"
      className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-3"
    >
      {all.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={
              "relative pb-1 text-sm font-medium transition-colors " +
              (isActive
                ? "text-foreground after:absolute after:inset-x-0 after:-bottom-[13px] after:h-px after:bg-foreground"
                : "text-ink-soft hover:text-foreground")
            }
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
