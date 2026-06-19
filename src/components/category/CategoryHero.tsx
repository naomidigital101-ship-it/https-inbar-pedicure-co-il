import type { Category } from "@/lib/categories";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";

export function CategoryHero({
  category,
  totalArticles,
}: {
  category: Category;
  totalArticles: number;
}) {
  return (
    <header
      className="relative overflow-hidden"
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
    >
      <BrandHeroBackdrop label={`CATEGORY · ${category.modCode}`} />
      <div className="relative mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
        <div className="mb-6 flex items-center gap-3">
          <BrandEyebrow>{category.modCode}</BrandEyebrow>
          <span aria-hidden className="h-px w-12" style={{ background: "var(--green-400)" }} />
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 500,
              fontSize: 13,
              color: "var(--ink-600)",
            }}
          >
            {totalArticles} מאמרים
          </span>
        </div>

        <h1
          className="mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(2.4rem, 5.6vw, 4.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--green-700)",
            maxWidth: 880,
          }}
        >
          {category.name}
        </h1>

        <p
          className="max-w-4xl"
          style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.7 }}
        >
          {category.description}
        </p>
      </div>
    </header>
  );
}