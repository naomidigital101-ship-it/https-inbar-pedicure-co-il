import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { articles } from "@/lib/articles";

const TITLE = "תודה! הצ׳קליסט שלך מוכן להורדה | Dirt Road Guide";
const CHECKLIST_PDF_URL = "/downloads/checklist-47.pdf";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "תודה על ההרשמה." },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  // Pick 3 "popular" articles - first 3 with full content
  const popular = articles.filter((a) => a.sections.length > 0).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
        >
          <BrandHeroBackdrop label="THANK YOU · 00" />
          <div className="relative mx-auto max-w-[1100px] px-6 py-20 text-center md:px-10 md:py-24">
            <div className="mb-5 flex justify-center">
              <BrandEyebrow>הצ׳קליסט מוכן</BrandEyebrow>
            </div>
            <h1
              className="mx-auto mb-6 max-w-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 5.6vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--green-700)",
              }}
            >
              הצ׳קליסט שלך מוכן להורדה
            </h1>
            <p className="mx-auto mb-10 max-w-2xl" style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.7 }}>
              ההורדה אמורה להתחיל אוטומטית. אם לא, לחצו על הכפתור למטה כדי להוריד את ה-PDF המלא (48 פריטים, 4 עמודים).
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={CHECKLIST_PDF_URL}
                download="checklist-47-dirt-road-guide.pdf"
                className="inline-flex h-12 items-center gap-2.5 px-7"
                style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 15 }}
              >
                <span aria-hidden>↓</span>
                הורדת הצ׳קליסט (PDF)
              </a>
              <Link
                to="/"
                className="inline-flex h-12 items-center px-6"
                style={{
                  background: "transparent",
                  color: "var(--green-700)",
                  border: "1.5px solid var(--green-600)",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        </section>

        <RelatedArticles articles={popular} />
      </main>
      <SiteFooter />
    </div>
  );
}