import type { Category } from "@/lib/categories";

export function CategoryHero({
  category,
  totalArticles,
}: {
  category: Category;
  totalArticles: number;
}) {
  return (
    <header className="border-b border-[#d6c5ac] bg-[#fefaf6]">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
            {category.modCode}
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-[#d6c5ac]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b5f55]">
            {totalArticles} מאמרים
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-black leading-tight text-[#2a1f1a] md:text-6xl lg:text-7xl">
          {category.name}
        </h1>

        <p className="max-w-4xl text-base font-bold leading-relaxed text-[#5a4f48] md:text-lg">
          {category.description}
        </p>
      </div>
    </header>
  );
}