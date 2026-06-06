import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { WomenGuideBanner } from "@/components/body-armor/WomenGuideBanner";
import { ArmorCard } from "@/components/body-armor/ArmorCard";
import {
  BODY_ARMOR,
  ARMOR_CATEGORIES,
  getAllArmorBrands,
  matchesBudget,
  type ArmorCategory,
  type BudgetBucket,
} from "@/lib/products/body-armor";

export const Route = createFileRoute("/products/body-armor/")({
  head: () => ({
    meta: [
      { title: "מגני גוף לאופנוע שטח - צבי־צב וחליפות לחץ | הרוכב העצלן" },
      {
        name: "description",
        content:
          "מדריך מקיף למגני גוף לאנדורו וקרוס: מגני חזה, צבי־צב וחליפות לחץ. השוואת מותגים, תקני CE, מחירים בארץ ומדריך ייעודי לנשים.",
      },
      { property: "og:title", content: "מגני גוף לאופנוע שטח - צבי־צב וחליפות לחץ" },
      {
        property: "og:description",
        content: "מגן חזה, גב וכתפיים - מה מתאים לך ולאיזה שטח. כולל מדריך לרוכבות.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lazyrider.org/products/body-armor" },
    ],
    links: [{ rel: "canonical", href: "https://lazyrider.org/products/body-armor" }],
  }),
  component: BodyArmorIndexPage,
});

type CategoryFilter = "all" | ArmorCategory;
type GenderFilter = "all" | "women";

function BodyArmorIndexPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [gender, setGender] = useState<GenderFilter>("all");
  const [budget, setBudget] = useState<BudgetBucket>("all");
  const [brands, setBrands] = useState<string[]>([]);

  const allBrands = useMemo(() => getAllArmorBrands(), []);

  const filtered = useMemo(() => {
    return BODY_ARMOR.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (gender === "women" && a.gender !== "women" && a.women_notes === null)
        return false;
      if (!matchesBudget(a.price_ils_approx, budget)) return false;
      if (brands.length > 0 && !brands.includes(a.brand)) return false;
      return true;
    });
  }, [category, gender, budget, brands]);

  const toggleBrand = (b: string) =>
    setBrands((curr) => (curr.includes(b) ? curr.filter((x) => x !== b) : [...curr, b]));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <SiteHeader />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <header className="mb-10">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
            מוצרים · מגני גוף
          </div>
          <h1 className="font-['Frank_Ruhl_Libre'] text-3xl font-bold leading-tight text-[#f0f0f0] md:text-5xl">
            מגני גוף לאופנוע שטח - צבי־צב וחליפות לחץ
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#bbb] md:text-lg">
            מגן חזה, גב וכתפיים - מה מתאים לך ולאיזה שטח
          </p>
        </header>

        <div className="mb-10">
          <WomenGuideBanner />
        </div>

        <section
          aria-label="פילטרים"
          className="mb-8 border border-[#222] bg-[#0f0f0f] p-5"
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                סוג
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={category === "all"}
                  onClick={() => setCategory("all")}
                >
                  הכל
                </FilterButton>
                {ARMOR_CATEGORIES.map((c) => (
                  <FilterButton
                    key={c.id}
                    active={category === c.id}
                    onClick={() => setCategory(c.id)}
                  >
                    {c.label_he}
                  </FilterButton>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                מגדר
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterButton active={gender === "all"} onClick={() => setGender("all")}>
                  הכל
                </FilterButton>
                <FilterButton
                  active={gender === "women"}
                  onClick={() => setGender("women")}
                >
                  מתאים לנשים
                </FilterButton>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                תקציב
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterButton active={budget === "all"} onClick={() => setBudget("all")}>
                  הכל
                </FilterButton>
                <FilterButton
                  active={budget === "under_500"}
                  onClick={() => setBudget("under_500")}
                >
                  עד ₪500
                </FilterButton>
                <FilterButton
                  active={budget === "500_1000"}
                  onClick={() => setBudget("500_1000")}
                >
                  ₪500–1,000
                </FilterButton>
                <FilterButton
                  active={budget === "1000_2000"}
                  onClick={() => setBudget("1000_2000")}
                >
                  ₪1,000–2,000
                </FilterButton>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                מותג
              </div>
              <div className="flex flex-wrap gap-2">
                {allBrands.map((b) => (
                  <label
                    key={b}
                    className="flex cursor-pointer items-center gap-2 border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-[#ccc] transition-colors hover:border-[#e63000]"
                  >
                    <input
                      type="checkbox"
                      checked={brands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="h-3 w-3 accent-[#e63000]"
                      aria-label={`סינון לפי ${b}`}
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#888]">
          {filtered.length} מוצרים
        </div>

        {filtered.length === 0 ? (
          <div className="border border-[#222] bg-[#0f0f0f] p-10 text-center text-[#888]">
            לא נמצאו מוצרים התואמים לסינון. נסו לשחרר חלק מהפילטרים.
          </div>
        ) : (
          <>
            {(() => {
              const women = filtered.filter((p) => p.gender === "women");
              const others = filtered.filter((p) => p.gender !== "women");
              return (
                <div className="space-y-14">
                  {women.length > 0 && (
                    <section aria-labelledby="women-section">
                      <div className="mb-5 flex items-end justify-between border-b border-[#222] pb-3">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-widest text-[#8b5cf6]">
                            ייעודי לנשים
                          </div>
                          <h2
                            id="women-section"
                            className="font-['Frank_Ruhl_Libre'] text-2xl font-bold text-[#f0f0f0] md:text-3xl"
                          >
                            מגנים בגזרה נשית
                          </h2>
                        </div>
                        <div className="text-xs text-[#888]">{women.length} מוצרים</div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {women.map((p) => (
                          <ArmorCard key={p.id} product={p} />
                        ))}
                      </div>
                    </section>
                  )}

                  {others.length > 0 && (
                    <section aria-labelledby="men-section">
                      <div className="mb-5 flex items-end justify-between border-b border-[#222] pb-3">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
                            לגברים / יוניסקס
                          </div>
                          <h2
                            id="men-section"
                            className="font-['Frank_Ruhl_Libre'] text-2xl font-bold text-[#f0f0f0] md:text-3xl"
                          >
                            מגנים לגברים ויוניסקס
                          </h2>
                        </div>
                        <div className="text-xs text-[#888]">{others.length} מוצרים</div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {others.map((p) => (
                          <ArmorCard key={p.id} product={p} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "border border-[#e63000] bg-[#e63000] px-3 py-1.5 text-xs font-bold text-white"
          : "border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-[#ccc] transition-colors hover:border-[#e63000] hover:text-[#f0f0f0]"
      }
    >
      {children}
    </button>
  );
}
