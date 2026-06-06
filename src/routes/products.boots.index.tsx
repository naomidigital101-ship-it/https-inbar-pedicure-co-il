import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BootCard } from "@/components/boots/BootCard";
import {
  BOOTS,
  BOOT_TYPES,
  BOOT_LEVELS,
  BOOT_SIZING_GUIDE,
  getAllBootBrands,
  matchesBootBudget,
  type BootType,
  type BootLevel,
  type BootBudget,
} from "@/lib/products/boots";

export const Route = createFileRoute("/products/boots/")({
  head: () => ({
    meta: [
      { title: "מגפי שטח לאופנוע - מוטוקרוס, אנדורו ואדוונצ'ר | הרוכב העצלן" },
      {
        name: "description",
        content:
          "מדריך מקיף למגפי אופנועי שטח: Alpinestars, Sidi, Gaerne, Fox, Leatt ועוד. השוואת תקני CE, גמישות, מחירים בארץ ומדריך מידות.",
      },
      { property: "og:title", content: "מגפי שטח לאופנוע - קטלוג מלא" },
      {
        property: "og:description",
        content: "Tech 10, Crossfire 3, SG-22 ועוד - כל המגפים המובילים, עם מחירים בארץ.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lazyrider.org/products/boots" },
    ],
    links: [{ rel: "canonical", href: "https://lazyrider.org/products/boots" }],
  }),
  component: BootsIndexPage,
});

type TypeFilter = "all" | BootType;
type LevelFilter = "all" | BootLevel;

function BootsIndexPage() {
  const [type, setType] = useState<TypeFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [budget, setBudget] = useState<BootBudget>("all");
  const [brands, setBrands] = useState<string[]>([]);
  const [waterproofOnly, setWaterproofOnly] = useState(false);
  const [womenOnly, setWomenOnly] = useState(false);

  const allBrands = useMemo(() => getAllBootBrands(), []);

  const filtered = useMemo(() => {
    return BOOTS.filter((b) => {
      if (type !== "all" && b.type !== type) return false;
      if (level !== "all" && b.level !== level) return false;
      if (!matchesBootBudget(b.price_ils_approx, budget)) return false;
      if (brands.length > 0 && !brands.includes(b.brand)) return false;
      if (waterproofOnly && !b.waterproof) return false;
      if (womenOnly && !b.women_version_available) return false;
      return true;
    });
  }, [type, level, budget, brands, waterproofOnly, womenOnly]);

  const toggleBrand = (b: string) =>
    setBrands((curr) => (curr.includes(b) ? curr.filter((x) => x !== b) : [...curr, b]));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <SiteHeader />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <header className="mb-10">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
            מוצרים · מגפי שטח
          </div>
          <h1 className="font-['Frank_Ruhl_Libre'] text-3xl font-bold leading-tight text-[#f0f0f0] md:text-5xl">
            מגפי שטח לאופנוע - קטלוג מלא
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#bbb] md:text-lg">
            מוטוקרוס, אנדורו ואדוונצ'ר. השוואת מותגים, תקני CE, מחירים בארץ.
          </p>
        </header>

        <section
          aria-label="מדריך מידות"
          className="mb-10 border border-[#222] bg-[#0f0f0f] p-6"
        >
          <h2 className="font-['Frank_Ruhl_Libre'] text-xl font-bold text-[#f0f0f0] md:text-2xl">
            {BOOT_SIZING_GUIDE.title}
          </h2>
          <ol className="mt-4 grid list-decimal gap-2 pr-5 text-sm leading-relaxed text-[#ccc] md:grid-cols-2">
            {BOOT_SIZING_GUIDE.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="mt-4 border-r-2 border-[#8b5cf6] bg-[#0f0a1a] p-3 text-sm text-[#ddd]">
            <span className="font-bold text-[#a78bfa]">לנשים:</span>{" "}
            {BOOT_SIZING_GUIDE.women_note}
          </p>
        </section>

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
                <FilterButton active={type === "all"} onClick={() => setType("all")}>
                  הכל
                </FilterButton>
                {BOOT_TYPES.map((t) => (
                  <FilterButton key={t.id} active={type === t.id} onClick={() => setType(t.id)}>
                    {t.label_he}
                  </FilterButton>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                רמה
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterButton active={level === "all"} onClick={() => setLevel("all")}>
                  הכל
                </FilterButton>
                {BOOT_LEVELS.map((l) => (
                  <FilterButton
                    key={l.id}
                    active={level === l.id}
                    onClick={() => setLevel(l.id)}
                  >
                    {l.label_he}
                  </FilterButton>
                ))}
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
                  active={budget === "under_750"}
                  onClick={() => setBudget("under_750")}
                >
                  עד ₪750
                </FilterButton>
                <FilterButton
                  active={budget === "750_1200"}
                  onClick={() => setBudget("750_1200")}
                >
                  ₪750–1,200
                </FilterButton>
                <FilterButton
                  active={budget === "1200_2000"}
                  onClick={() => setBudget("1200_2000")}
                >
                  ₪1,200–2,000
                </FilterButton>
                <FilterButton
                  active={budget === "over_2000"}
                  onClick={() => setBudget("over_2000")}
                >
                  מעל ₪2,000
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

          <div className="mt-5 flex flex-wrap gap-3 border-t border-[#222] pt-4">
            <label className="flex cursor-pointer items-center gap-2 border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-[#ccc] transition-colors hover:border-[#3b82f6]">
              <input
                type="checkbox"
                checked={waterproofOnly}
                onChange={() => setWaterproofOnly((v) => !v)}
                className="h-3 w-3 accent-[#3b82f6]"
              />
              עמיד למים בלבד
            </label>
            <label className="flex cursor-pointer items-center gap-2 border border-[#333] bg-[#080808] px-3 py-1.5 text-xs text-[#ccc] transition-colors hover:border-[#8b5cf6]">
              <input
                type="checkbox"
                checked={womenOnly}
                onChange={() => setWomenOnly((v) => !v)}
                className="h-3 w-3 accent-[#8b5cf6]"
              />
              עם גרסת נשים בלבד
            </label>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <BootCard key={p.id} product={p} />
            ))}
          </div>
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