import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Pencil } from "lucide-react";
import { adminListServices } from "@/lib/admin-cms.functions";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/services/")({
  head: () => ({ meta: [{ title: "טיפולים | ניהול" }] }),
  component: ServicesList,
});

function ServicesList() {
  const listFn = useServerFn(adminListServices);
  const query = useQuery({
    queryKey: ["admin", "services"],
    queryFn: () => listFn(),
  });

  const services = query.data?.services ?? [];

  return (
    <>
      <PageHeader
        title="טיפולים"
        description="עמודי הטיפולים הם התוכן המרכזי של האתר. כל עמוד ניתן לעריכה מלאה — כותרות, פסקאות, טבלאות, שאלות ותשובות ומקורות."
      />

      {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}

      {!query.isLoading && services.length === 0 && (
        <EmptyState
          title="אין עדיין טיפולים"
          hint="אפשר לייבא את התוכן הקיים מהאתר דרך עמוד הכלים המתקדמים."
        />
      )}

      {services.length > 0 && (
        <Card>
          <ul className="divide-y" style={{ borderColor: "var(--stone-100)" }}>
            {services.map((s) => {
              const hasBody = Boolean(s.sections?.length);
              return (
                <li key={s.slug} className="flex flex-wrap items-center gap-3 py-4 first:pt-0">
                  <div className="min-w-[220px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[15.5px]"
                        style={{ fontWeight: 700, color: "var(--ink-900)" }}
                      >
                        {s.nav_label}
                      </span>
                      {!s.is_published && <Badge tone="muted">מוסתר</Badge>}
                      {s.is_flagship && <Badge tone="warn">בדף הבית</Badge>}
                      {!hasBody && <Badge tone="muted">תוכן טרם יובא</Badge>}
                    </div>
                    <p className="mt-0.5 text-[13px]" style={{ color: "var(--ink-600)" }}>
                      {s.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/services/${s.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[13.5px]"
                      style={{
                        border: "1px solid var(--stone-300)",
                        borderRadius: 999,
                        color: "var(--ink-600)",
                        fontWeight: 600,
                      }}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                      תצוגה
                    </a>
                    <Link
                      to="/admin/services/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px]"
                      style={{
                        background: "var(--accent)",
                        color: "#fff",
                        borderRadius: 999,
                        fontWeight: 700,
                      }}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      עריכה
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
