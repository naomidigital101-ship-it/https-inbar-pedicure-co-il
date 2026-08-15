import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Star } from "lucide-react";
import {
  adminDeleteReview,
  adminListReviews,
  adminListServices,
  adminSaveReview,
} from "@/lib/admin-cms.functions";
import type { ReviewRow } from "@/lib/cms-types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  PageHeader,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [{ title: "המלצות | ניהול" }] }),
  component: ReviewsAdmin,
});

const BLANK: ReviewRow = {
  id: "",
  author_name: "",
  author_area: null,
  rating: 5,
  body: "",
  service_slug: null,
  source: "manual",
  source_url: null,
  review_date: new Date().toISOString().slice(0, 10),
  is_published: true,
  is_featured: false,
  sort_order: 0,
};

function ReviewsAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListReviews);
  const servicesFn = useServerFn(adminListServices);
  const saveFn = useServerFn(adminSaveReview);
  const deleteFn = useServerFn(adminDeleteReview);

  const query = useQuery({ queryKey: ["admin", "reviews"], queryFn: () => listFn() });
  const services = useQuery({ queryKey: ["admin", "services"], queryFn: () => servicesFn() });

  const [editing, setEditing] = useState<ReviewRow | null>(null);

  const save = useMutation({
    mutationFn: (row: ReviewRow) => {
      const { id, ...rest } = row;
      return saveFn({ data: id ? { id, ...rest } : rest });
    },
    onSuccess: () => {
      toast.success("ההמלצה נשמרה");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "השמירה נכשלה"),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("ההמלצה נמחקה");
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "המחיקה נכשלה"),
  });

  const reviews = query.data?.reviews ?? [];
  const published = reviews.filter((r) => r.is_published);
  const average = published.length
    ? Math.round((published.reduce((n, r) => n + r.rating, 0) / published.length) * 10) / 10
    : null;

  return (
    <>
      <PageHeader
        title="המלצות"
        description="ההמלצות מופיעות באתר וגם נמסרות לגוגל כדירוג ממוצע, מה שיכול להוסיף כוכבים לתוצאת החיפוש."
        actions={
          <Button variant="primary" onClick={() => setEditing({ ...BLANK })}>
            <Plus className="h-4 w-4" aria-hidden />
            המלצה חדשה
          </Button>
        }
      />

      {average !== null && (
        <Card>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-[13px]" style={{ color: "var(--ink-600)" }}>
                דירוג ממוצע
              </p>
              <p
                className="text-[30px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "var(--ink-900)",
                }}
              >
                {average}
              </p>
            </div>
            <div>
              <p className="text-[13px]" style={{ color: "var(--ink-600)" }}>
                המלצות מפורסמות
              </p>
              <p
                className="text-[30px]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "var(--ink-900)",
                }}
              >
                {published.length}
              </p>
            </div>
          </div>
        </Card>
      )}

      {editing && (
        <ReviewForm
          value={editing}
          services={services.data?.services ?? []}
          saving={save.isPending}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={() => save.mutate(editing)}
        />
      )}

      {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}

      {!query.isLoading && reviews.length === 0 && !editing && (
        <EmptyState
          title="עדיין אין המלצות"
          hint="אפשר להעתיק לכאן המלצות שקיבלת בוואטסאפ או בגוגל. חשוב לבקש רשות מהמטופלת לפני פרסום שמה."
        />
      )}

      {reviews.map((r) => (
        <Card key={r.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-[240px] flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span style={{ fontWeight: 700, color: "var(--ink-900)" }}>{r.author_name}</span>
                <span aria-label={`${r.rating} מתוך 5`} className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5"
                      style={{ fill: "var(--accent-gold)", color: "var(--accent-gold)" }}
                      aria-hidden
                    />
                  ))}
                </span>
                {r.is_featured && <Badge tone="warn">מובלטת</Badge>}
                {!r.is_published && <Badge tone="muted">מוסתרת</Badge>}
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: "var(--ink-600)" }}>
                {r.body}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setEditing(r)}>עריכה</Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm(`למחוק את ההמלצה של ${r.author_name}?`)) del.mutate(r.id);
                }}
              >
                מחיקה
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

function ReviewForm({
  value,
  services,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  value: ReviewRow;
  services: { slug: string; nav_label: string }[];
  saving: boolean;
  onChange: (r: ReviewRow) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const set = (patch: Partial<ReviewRow>) => onChange({ ...value, ...patch });

  return (
    <Card title={value.id ? "עריכת המלצה" : "המלצה חדשה"}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="שם">
          <TextInput
            value={value.author_name}
            onChange={(e) => set({ author_name: e.target.value })}
          />
        </Field>
        <Field label="יישוב" hint="אופציונלי">
          <TextInput
            value={value.author_area ?? ""}
            onChange={(e) => set({ author_area: e.target.value || null })}
          />
        </Field>
      </div>

      <Field label="ההמלצה">
        <TextArea rows={4} value={value.body} onChange={(e) => set({ body: e.target.value })} />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="דירוג">
          <Select
            value={String(value.rating)}
            onChange={(e) => set({ rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} כוכבים
              </option>
            ))}
          </Select>
        </Field>
        <Field label="הטיפול שקיבלה" hint="אופציונלי">
          <Select
            value={value.service_slug ?? ""}
            onChange={(e) => set({ service_slug: e.target.value || null })}
          >
            <option value="">כללי</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.nav_label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="תאריך">
          <TextInput
            ltr
            type="date"
            value={value.review_date}
            onChange={(e) => set({ review_date: e.target.value })}
          />
        </Field>
      </div>

      <Toggle
        label="מפורסמת באתר"
        checked={value.is_published}
        onChange={(is_published) => set({ is_published })}
      />
      <Toggle
        label="מובלטת"
        hint="מופיעה ראשונה ברשימה"
        checked={value.is_featured}
        onChange={(is_featured) => set({ is_featured })}
      />

      <div className="mt-4 flex gap-2">
        <Button
          variant="primary"
          loading={saving}
          disabled={!value.author_name.trim() || !value.body.trim()}
          onClick={onSave}
        >
          שמירה
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          ביטול
        </Button>
      </div>
    </Card>
  );
}
