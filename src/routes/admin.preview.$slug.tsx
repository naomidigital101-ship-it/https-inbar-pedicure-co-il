import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { ArticleHero } from "@/components/article/ArticleHero";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ArticleBody } from "@/components/article/ArticleBody";
import { getAiArticleBySlugAdmin } from "@/lib/ai-content.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/preview/$slug")({
  head: () => ({ meta: [{ title: "תצוגה מקדימה | ענבר פרחי" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PreviewPage,
});

function PreviewPage() {
  const { slug } = Route.useParams();
  const fetchFn = useServerFn(getAiArticleBySlugAdmin);
  type Article = NonNullable<Awaited<ReturnType<typeof fetchFn>>>;
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setError("יש להתחבר כמנהל");
        return;
      }
      try {
        const r = await fetchFn({ data: { slug } });
        if (cancelled) return;
        if (!r) {
          setError("המאמר לא נמצא");
          return;
        }
        setArticle(r);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchFn, slug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
        <p className="text-sm font-bold">{error}</p>
      </div>
    );
  }
  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
        <p className="text-sm">טוען תצוגה מקדימה...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <SiteHeader />
      <div className="bg-yellow-500/15 border-y border-yellow-500/40 py-2 text-center text-xs font-bold text-yellow-700">
        תצוגה מקדימה — סטטוס: {article.status}
      </div>
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: article.category }, { label: article.title }]} />
        <ArticleHero article={article} />
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[28%_72%]">
            <aside className="order-2 lg:order-1">
              <TableOfContents sections={article.sections} />
            </aside>
            <div className="order-1 lg:order-2">
              <ArticleBody article={article} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}