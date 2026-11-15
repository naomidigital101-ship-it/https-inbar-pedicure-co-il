import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { LucideIcon } from "lucide-react";
import { Inbox, Stethoscope, Star, Images, ArrowLeft, Newspaper, Home, Upload } from "lucide-react";
import {
  adminListBeforeAfter,
  adminListLeads,
  adminListReviews,
  adminListServices,
} from "@/lib/admin-cms.functions";
import { Badge, Card, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "לוח בקרה | ניהול" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const leadsFn = useServerFn(adminListLeads);
  const servicesFn = useServerFn(adminListServices);
  const reviewsFn = useServerFn(adminListReviews);
  const galleryFn = useServerFn(adminListBeforeAfter);

  const leads = useQuery({ queryKey: ["admin", "leads"], queryFn: () => leadsFn() });
  const services = useQuery({ queryKey: ["admin", "services"], queryFn: () => servicesFn() });
  const reviews = useQuery({ queryKey: ["admin", "reviews"], queryFn: () => reviewsFn() });
  const gallery = useQuery({ queryKey: ["admin", "before-after"], queryFn: () => galleryFn() });

  const allLeads = leads.data?.leads ?? [];
  const newLeads = allLeads.filter((l) => l.status === "new");
  const allServices = services.data?.services ?? [];
  const publishedServices = allServices.filter((s) => s.is_published);
  const missingBody = allServices.filter((s) => !s.sections?.length);
  const publishedReviews = (reviews.data?.reviews ?? []).filter((r) => r.is_published);
  const publishedGallery = (gallery.data?.items ?? []).filter((i) => i.is_published);

  const hasError = [leads, services, reviews, gallery].some((query) => query.isError);
  return (
    <>
      <PageHeader
        title="שלום, ענבר"
        description="כל מה שחשוב באתר שלך, במבט אחד."
        actions={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-button inline-flex items-center gap-2 border border-[var(--stone-300)] bg-white px-4 py-2"
          >
            <ArrowLeft size={17} aria-hidden />
            צפייה באתר
          </a>
        }
      />
      <section className="admin-welcome">
        <div>
          <h2>מה תרצי לעדכן היום?</h2>
          <p>הוסיפי תוכן, עדכני תמונות וטפלי בפניות שמגיעות דרך האתר.</p>
        </div>
      </section>
      {hasError && (
        <Card>
          <p role="alert">לא הצלחנו לטעון חלק מהנתונים. אפשר לנסות שוב.</p>
          <button
            className="mt-3 underline"
            onClick={() => {
              leads.refetch();
              services.refetch();
              reviews.refetch();
              gallery.refetch();
            }}
          >
            טעינה מחדש
          </button>
        </Card>
      )}
      {missingBody.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p style={{ fontWeight: 700 }}>יש להשלים ייבוא תוכן</p>
              <p className="mt-1 text-[14px]" style={{ color: "var(--ink-600)" }}>
                {missingBody.length} עמודי טיפול עדיין לא נטענו למערכת הניהול. העמודים מוצגים באתר
                כרגיל, אבל אי אפשר לערוך אותם עד שמריצים ייבוא.
              </p>
            </div>
            <Link
              to="/admin/tools"
              className="admin-button inline-flex items-center gap-2 px-4 py-2.5"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              לייבוא התוכן
              <ArrowLeft size={16} aria-hidden />
            </Link>
          </div>
        </Card>
      )}
      <div className="admin-stats">
        <Stat
          to="/admin/leads"
          icon={Inbox}
          label="פניות חדשות"
          value={leads.data ? newLeads.length : undefined}
          note={leads.data ? allLeads.length + " בסך הכל" : "טוענת נתונים"}
        />
        <Stat
          to="/admin/services"
          icon={Stethoscope}
          label="טיפולים באתר"
          value={services.data ? publishedServices.length : undefined}
          note={services.data ? allServices.length + " בסך הכל" : "טוענת נתונים"}
        />
        <Stat
          to="/admin/reviews"
          icon={Star}
          label="המלצות באתר"
          value={reviews.data ? publishedReviews.length : undefined}
        />
        <Stat
          to="/admin/gallery"
          icon={Images}
          label="לפני / אחרי"
          value={gallery.data ? publishedGallery.length : undefined}
        />
      </div>
      {newLeads.length > 0 && (
        <Card title="פניות שממתינות לך" actions={<Badge tone="warn">{newLeads.length}</Badge>}>
          <ul className="divide-y" style={{ borderColor: "var(--stone-100)" }}>
            {newLeads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0">
                <span className="flex-1" style={{ fontWeight: 700 }}>
                  {lead.name || "ללא שם"}
                </span>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    dir="ltr"
                    className="text-[14px]"
                    style={{ color: "var(--green-700)" }}
                  >
                    {lead.phone}
                  </a>
                )}
                <span className="text-[13px]" style={{ color: "var(--ink-600)" }}>
                  {new Date(lead.created_at).toLocaleDateString("he-IL")}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/admin/leads" className="mt-3 inline-block underline">
            לכל הפניות
          </Link>
        </Card>
      )}
      <div className="admin-dashboard-grid">
        <Card title="מתחילים מכאן" description="פעולות שימושיות לניהול היומיומי">
          <div className="admin-quick-actions">
            <Link to="/admin/content">
              <Newspaper size={24} strokeWidth={1.6} aria-hidden />
              <strong>ניהול מאמרים</strong>
              <small>כתיבה ופרסום במרכז הידע</small>
            </Link>
            <Link to="/admin/homepage">
              <Home size={24} strokeWidth={1.6} aria-hidden />
              <strong>עריכת דף הבית</strong>
              <small>תמונות, כותרות ומקטעים</small>
            </Link>
            <Link to="/admin/media">
              <Upload size={24} strokeWidth={1.6} aria-hidden />
              <strong>העלאת תמונה</strong>
              <small>הוספה לספריית המדיה</small>
            </Link>
          </div>
        </Card>
        <Card title="ניהול התוכן" description="קיצורים למסכים המרכזיים">
          <div className="admin-dashboard-links">
            <Link to="/admin/services">
              <span>עמודי טיפול</span>
              <ArrowLeft size={17} aria-hidden />
            </Link>
            <Link to="/admin/reviews">
              <span>המלצות מטופלים</span>
              <ArrowLeft size={17} aria-hidden />
            </Link>
            <Link to="/admin/business">
              <span>פרטי הקליניקה</span>
              <ArrowLeft size={17} aria-hidden />
            </Link>
          </div>
        </Card>
      </div>
      {allServices.length > 0 && (
        <div className="admin-dashboard-section">
          <Card
            title="עמודי הטיפולים"
            actions={
              <Link to="/admin/services" className="inline-flex items-center gap-2 text-sm">
                לכל הטיפולים
                <ArrowLeft size={16} aria-hidden />
              </Link>
            }
          >
            <ul className="divide-y" style={{ borderColor: "var(--stone-100)" }}>
              {allServices.slice(0, 3).map((service) => (
                <li
                  key={service.slug}
                  className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <strong>{service.nav_label}</strong>
                    <p className="mt-1 text-sm" style={{ color: "var(--ink-600)" }}>
                      {service.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <Badge tone={service.is_published ? "success" : "muted"}>
                      {service.is_published ? "מפורסם" : "מוסתר"}
                    </Badge>
                    <Link
                      to="/admin/services/$slug"
                      params={{ slug: service.slug }}
                      className="inline-flex items-center gap-2 font-bold"
                    >
                      עריכה
                      <ArrowLeft size={16} aria-hidden />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}
function Stat({
  to,
  icon: Icon,
  label,
  value,
  note,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  value?: number;
  note?: string;
}) {
  return (
    <Link to={to as "/admin"} className="admin-stat">
      <div className="admin-stat-top">
        <span>{label}</span>
        <Icon size={19} strokeWidth={1.65} aria-hidden />
      </div>
      <p className="admin-stat-value">{value ?? "—"}</p>
      {note && <p className="admin-stat-note">{note}</p>}
    </Link>
  );
}
