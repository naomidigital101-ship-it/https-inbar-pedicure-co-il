import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { RelatedArticles } from "@/components/article/RelatedArticles";
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
        <section className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div className="mx-auto max-w-[1400px] px-4 py-20 text-center md:px-8 md:py-28">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
                [ SYS // OK ]
              </span>
            </div>
            <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-black leading-tight text-[#1d3a35] md:text-6xl">
              הצ׳קליסט שלך מוכן!{" "}
              <span className="text-[#5fa898]">לחץ להורדה</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base font-bold leading-relaxed text-[#5a4f48] md:text-lg">
              ההורדה אמורה להתחיל אוטומטית. אם לא, לחץ על הכפתור למטה כדי להוריד
              את ה-PDF המלא (48 פריטים, 4 עמודים).
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={CHECKLIST_PDF_URL}
                download="checklist-47-dirt-road-guide.pdf"
                className="inline-flex items-center gap-3 bg-[#5fa898] px-8 py-4 text-sm font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#ff3a00]"
              >
                <span aria-hidden="true">↓</span>
                הורד את הצ׳קליסט (PDF)
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-3 border border-[#c9b8a3] bg-transparent px-6 py-4 text-sm font-black uppercase tracking-wider text-[#5a4f48] transition-colors hover:border-[#7a6e65] hover:text-white"
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