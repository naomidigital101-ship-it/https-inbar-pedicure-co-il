import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Pencil, Search } from "lucide-react";
import { adminListServices } from "@/lib/admin-cms.functions";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/services/")({
  head: () => ({ meta: [{ title: "טיפולים | ניהול" }] }),
  component: ServicesList,
});

function ServicesList() {
  const listFn = useServerFn(adminListServices);
  const query = useQuery({ queryKey: ["admin", "services"], queryFn: () => listFn() });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const services = useMemo(() => query.data?.services ?? [], [query.data?.services]);
  const filtered = useMemo(
    () =>
      services.filter(
        (service) =>
          (service.nav_label + " " + service.title).includes(search.trim()) &&
          (status === "all" ||
            (status === "published" ? service.is_published : !service.is_published)),
      ),
    [services, search, status],
  );
  return (
    <>
      <PageHeader title="טיפולים" description="עריכת עמודי הטיפולים והצגתם באתר." />
      {query.isLoading && (
        <p role="status" style={{ color: "var(--ink-600)" }}>
          טוענת את הטיפולים...
        </p>
      )}
      {query.isError && (
        <p role="alert">
          לא הצלחנו לטעון את הטיפולים.{" "}
          <button className="underline" onClick={() => query.refetch()}>
            נסי שוב
          </button>
        </p>
      )}
      {!query.isLoading && !query.isError && services.length === 0 && (
        <EmptyState
          title="אין עדיין טיפולים"
          hint="אפשר לייבא את התוכן הקיים מהאתר דרך עמוד הכלים המתקדמים."
        />
      )}
      {services.length > 0 && (
        <>
          <div className="admin-services-toolbar">
            <label className="admin-search">
              <Search size={18} aria-hidden />
              <input
                aria-label="חיפוש טיפול"
                placeholder="חיפוש טיפול..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <select
              className="admin-services-filter"
              aria-label="סינון לפי מצב פרסום"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">כל הטיפולים</option>
              <option value="published">מפורסמים</option>
              <option value="hidden">מוסתרים</option>
            </select>
          </div>
          <Card>
            <div className="admin-table-wrap">
              <table className="admin-services-table">
                <thead>
                  <tr>
                    <th scope="col">שם הטיפול</th>
                    <th scope="col">פרסום</th>
                    <th scope="col">דף הבית</th>
                    <th scope="col">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((service) => (
                    <tr key={service.slug}>
                      <td>
                        <div className="admin-table-title">{service.nav_label}</div>
                        <p className="admin-table-subtitle">{service.title}</p>
                        {!service.sections?.length && <Badge tone="muted">תוכן טרם יובא</Badge>}
                      </td>
                      <td>
                        <Badge tone={service.is_published ? "success" : "muted"}>
                          {service.is_published ? "מפורסם" : "מוסתר"}
                        </Badge>
                      </td>
                      <td>
                        {service.is_flagship ? <Badge tone="warn">מוצג בדף הבית</Badge> : "—"}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <a
                            href={`/services/${service.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm"
                            aria-label={`צפייה בעמוד ${service.nav_label}`}
                          >
                            <ExternalLink size={16} aria-hidden />
                            תצוגה
                          </a>
                          <Link
                            to="/admin/services/$slug"
                            params={{ slug: service.slug }}
                            className="admin-button inline-flex items-center gap-2 px-4 py-2"
                            style={{ background: "var(--accent)", color: "#fff" }}
                          >
                            <Pencil size={15} aria-hidden />
                            עריכה
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <EmptyState title="לא נמצאו טיפולים" hint="נסי לשנות את החיפוש או את מסנן הפרסום." />
            )}
          </Card>
        </>
      )}
    </>
  );
}
