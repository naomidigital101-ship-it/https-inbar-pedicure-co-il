import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { LucideIcon } from "lucide-react";
import { Inbox, Stethoscope, Star, Images, ArrowLeft } from "lucide-react";
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

  return (
    <>
      <PageHeader
        title="שלום ענבר"
        description="כאן את מנהלת את כל מה שמופיע באתר — בלי לגעת בקוד ובלי לחכות לאף אחד."
      />

      {missingBody.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p style={{ fontWeight: 700, color: "var(--ink-900)" }}>יש להשלים ייבוא תוכן</p>
              <p className="mt-1 text-[14px]" style={{ color: "var(--ink-600)" }}>
                {missingBody.length} עמודי טיפול עדיין לא נטענו למערכת הניהול. העמודים מוצגים באתר
                כרגיל, אבל אי אפשר לערוך אותם עד שמריצים ייבוא.
              </p>
            </div>
            <Link
              to="/admin/tools"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px]"
              style={{
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              לייבוא התוכן
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Card>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          to="/admin/leads"
          icon={Inbox}
          label="פניות חדשות"
          value={newLeads.length}
          note={`${allLeads.length} בסך הכל`}
          highlight={newLeads.length > 0}
        />
        <Stat
          to="/admin/services"
          icon={Stethoscope}
          label="טיפולים מפורסמים"
          value={publishedServices.length}
          note={`${allServices.length} בסך הכל`}
        />
        <Stat to="/admin/reviews" icon={Star} label="המלצות באתר" value={publishedReviews.length} />
        <Stat
          to="/admin/gallery"
          icon={Images}
          label="לפני / אחרי"
          value={publishedGallery.length}
        />
      </div>

      {newLeads.length > 0 && (
        <Card title="פניות שממתינות לך" actions={<Badge tone="warn">{newLeads.length}</Badge>}>
          <ul className="divide-y" style={{ borderColor: "var(--stone-100)" }}>
            {newLeads.slice(0, 5).map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0">
                <span className="flex-1" style={{ fontWeight: 700, color: "var(--ink-900)" }}>
                  {l.name || "ללא שם"}
                </span>
                {l.phone && (
                  <a
                    href={`tel:${l.phone}`}
                    dir="ltr"
                    className="text-[14px]"
                    style={{ color: "var(--green-700)", fontWeight: 600 }}
                  >
                    {l.phone}
                  </a>
                )}
                <span className="text-[13px]" style={{ color: "var(--ink-600)" }}>
                  {new Date(l.created_at).toLocaleDateString("he-IL")}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/admin/leads"
            className="mt-3 inline-block text-[14px] underline"
            style={{ color: "var(--green-700)", fontWeight: 700 }}
          >
            לכל הפניות
          </Link>
        </Card>
      )}

      <Card title="מה אפשר לעשות כאן">
        <ul
          className="space-y-2.5 text-[14.5px] leading-relaxed"
          style={{ color: "var(--ink-600)" }}
        >
          <li>
            <strong style={{ color: "var(--ink-900)" }}>טיפולים</strong> — לערוך כל עמוד טיפול:
            פרקים, טבלאות, שאלות ותשובות, דגלים אדומים ומקורות.
          </li>
          <li>
            <strong style={{ color: "var(--ink-900)" }}>פרטי העסק</strong> — טלפון, וואטסאפ, שעות
            פעילות. שינוי אחד מתעדכן בכל האתר.
          </li>
          <li>
            <strong style={{ color: "var(--ink-900)" }}>הודעה זמנית</strong> — פס עליון להודעה על
            חופשה או תורים שהתפנו. נמצא תחת פרטי העסק.
          </li>
          <li>
            <strong style={{ color: "var(--ink-900)" }}>המלצות ולפני/אחרי</strong> — ההוכחה שהכי
            משכנעת מטופלות חדשות.
          </li>
        </ul>
      </Card>
    </>
  );
}

function Stat({
  to,
  icon: Icon,
  label,
  value,
  note,
  highlight,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  value: number;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <Link
      to={to as "/admin"}
      className="block bg-white px-5 py-4 transition-shadow hover:shadow-sm"
      style={{
        border: `1px solid ${highlight ? "var(--accent)" : "var(--stone-100)"}`,
        borderRadius: 14,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon
          className="h-4 w-4"
          strokeWidth={1.75}
          style={{ color: highlight ? "var(--accent)" : "var(--green-600)" }}
          aria-hidden
        />
        <span className="text-[13px]" style={{ color: "var(--ink-600)", fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <p
        className="text-[30px] leading-none"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          color: highlight ? "var(--accent)" : "var(--ink-900)",
        }}
      >
        {value}
      </p>
      {note && (
        <p className="mt-1 text-[12.5px]" style={{ color: "var(--ink-600)" }}>
          {note}
        </p>
      )}
    </Link>
  );
}
