import type { Category } from "@/lib/categories";
import { C, LatinEyebrow } from "@/components/article/editorial";

/** ‎"[ MOD: 01 // CARE ]" → "CARE · 01" — קוד הקטגוריה בשפת התצוגה החדשה. */
function latinCode(modCode: string): string {
  const m = /(\d+)\s*\/\/\s*([A-Za-z]+)/.exec(modCode);
  return m ? `${m[2]} · ${m[1]}` : "Journal";
}

export function CategoryHero({
  category,
  totalArticles,
}: {
  category: Category;
  totalArticles: number;
}) {
  return (
    <header style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }}>
      <div className="mx-auto max-w-[900px] px-[6%] py-20 text-center md:py-28">
        <LatinEyebrow tracking="0.5em" fontSize={15} className="mb-5">
          {latinCode(category.modCode)}
        </LatinEyebrow>

        <h1
          style={{
            fontWeight: 700,
            fontSize: "clamp(2rem, 4.4vw, 3rem)",
            lineHeight: 1.3,
            color: C.ink,
            margin: "0 0 20px",
            textWrap: "balance",
          }}
        >
          {category.name}
        </h1>

        <p
          style={{
            fontWeight: 300,
            fontSize: "1.05rem",
            lineHeight: 2,
            color: C.muted,
            margin: "0 auto 32px",
            maxWidth: 620,
          }}
        >
          {category.description}
        </p>

        <div
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 22,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.3em",
            color: C.mutedSoft,
          }}
        >
          {totalArticles} מאמרים
        </div>
      </div>
    </header>
  );
}
