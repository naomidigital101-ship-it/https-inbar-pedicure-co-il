import type { Category } from "@/lib/categories";

export function CategoryHero({
  category,
  totalArticles,
}: {
  category: Category;
  totalArticles: number;
}) {
  return (
    <header className="border-b border-[#222] bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            {category.modCode}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-[#222]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#909090]">
            {totalArticles} מאמרים
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-black leading-tight text-[#f0f0f0] md:text-6xl lg:text-7xl">
          {category.name}
        </h1>

        <p className="max-w-4xl text-base font-bold leading-relaxed text-[#999] md:text-lg">
          {category.description}
        </p>
      </div>
    </header>
  );
}