import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  adminDeleteBeforeAfter,
  adminListBeforeAfter,
  adminListServices,
  adminSaveBeforeAfter,
} from "@/lib/admin-cms.functions";
import type { BeforeAfterRow } from "@/lib/cms-types";
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
import { MediaPickerField } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({ meta: [{ title: "לפני ואחרי | ניהול" }] }),
  component: GalleryAdmin,
});

const BLANK: BeforeAfterRow = {
  id: "",
  service_slug: null,
  title: "",
  description: null,
  before_image: "",
  before_alt: null,
  after_image: "",
  after_alt: null,
  sessions_count: null,
  timeframe: null,
  consent_confirmed: false,
  is_published: false,
  sort_order: 0,
};

function GalleryAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListBeforeAfter);
  const servicesFn = useServerFn(adminListServices);
  const saveFn = useServerFn(adminSaveBeforeAfter);
  const deleteFn = useServerFn(adminDeleteBeforeAfter);

  const query = useQuery({ queryKey: ["admin", "before-after"], queryFn: () => listFn() });
  const services = useQuery({ queryKey: ["admin", "services"], queryFn: () => servicesFn() });

  const [editing, setEditing] = useState<BeforeAfterRow | null>(null);

  const save = useMutation({
    mutationFn: (row: BeforeAfterRow) => {
      const { id, ...rest } = row;
      return saveFn({ data: id ? { id, ...rest } : rest });
    },
    onSuccess: () => {
      toast.success("הפריט נשמר");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "before-after"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "השמירה נכשלה"),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("הפריט נמחק");
      qc.invalidateQueries({ queryKey: ["admin", "before-after"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "המחיקה נכשלה"),
  });

  const items = query.data?.items ?? [];

  return (
    <>
      <PageHeader
        title="לפני / אחרי"
        description="תוצאות טיפול הן ההוכחה החזקה ביותר שיש. בגלל שאלה תמונות של מטופלות אמיתיות, פריט מתפרסם רק אחרי אישור שקיבלת רשות."
        actions={
          <Button variant="primary" onClick={() => setEditing({ ...BLANK })}>
            <Plus className="h-4 w-4" aria-hidden />
            פריט חדש
          </Button>
        }
      />

      {editing && (
        <GalleryForm
          value={editing}
          services={services.data?.services ?? []}
          saving={save.isPending}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={() => save.mutate(editing)}
        />
      )}

      {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}

      {!query.isLoading && items.length === 0 && !editing && (
        <EmptyState
          title="עדיין אין תמונות לפני/אחרי"
          hint="שני צילומים של אותו טיפול — לפני ואחרי — באותה זווית ובאותה תאורה עובדים הכי טוב."
        />
      )}

      {items.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {/* פריט עם תמונה אחת משולבת מציג רק אותה */}
              <Thumb src={item.before_image} caption={item.after_image ? "לפני" : "לפני ואחרי"} />
              {item.after_image && <Thumb src={item.after_image} caption="אחרי" />}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span style={{ fontWeight: 700, color: "var(--ink-900)" }}>{item.title}</span>
                  {item.is_published ? (
                    <Badge tone="success">מפורסם</Badge>
                  ) : (
                    <Badge tone="muted">טיוטה</Badge>
                  )}
                  {!item.consent_confirmed && <Badge tone="warn">אין אישור מטופלת</Badge>}
                </div>
                {item.timeframe && (
                  <p className="mt-1 text-[13px]" style={{ color: "var(--ink-600)" }}>
                    {item.timeframe}
                    {item.sessions_count ? ` · ${item.sessions_count} טיפולים` : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setEditing(item)}>עריכה</Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm(`למחוק את "${item.title}"?`)) del.mutate(item.id);
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

function Thumb({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="m-0">
      <img
        src={src}
        alt=""
        className="h-[76px] w-[100px] object-cover"
        style={{ borderRadius: 8, border: "1px solid var(--stone-100)" }}
      />
      <figcaption className="mt-1 text-center text-[12px]" style={{ color: "var(--ink-600)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}

function GalleryForm({
  value,
  services,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  value: BeforeAfterRow;
  services: { slug: string; nav_label: string }[];
  saving: boolean;
  onChange: (v: BeforeAfterRow) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const set = (patch: Partial<BeforeAfterRow>) => onChange({ ...value, ...patch });
  const ready = Boolean(value.title.trim() && value.before_image);

  return (
    <Card title={value.id ? "עריכת פריט" : "פריט חדש"}>
      <Field label="כותרת" hint="מה רואים כאן — לדוגמה: ציפורן חודרנית, בוהן ימין">
        <TextInput value={value.title} onChange={(e) => set({ title: e.target.value })} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <MediaPickerField
          label={value.after_image === null ? "התמונה" : "תמונת לפני"}
          hint={value.after_image === null ? "תמונה אחת שמראה גם לפני וגם אחרי" : undefined}
          folder="before-after"
          value={value.before_image}
          onChange={(before_image) => set({ before_image })}
        />
        <MediaPickerField
          label="תמונת אחרי"
          hint="אפשר להשאיר ריק אם התמונה הראשונה כבר מראה לפני ואחרי"
          folder="before-after"
          value={value.after_image ?? ""}
          onChange={(after_image) => set({ after_image: after_image || null })}
        />
      </div>

      <Field label="תיאור" hint="אופציונלי — מה נעשה בטיפול">
        <TextArea
          rows={3}
          value={value.description ?? ""}
          onChange={(e) => set({ description: e.target.value || null })}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="הטיפול">
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
        <Field label="מספר טיפולים">
          <TextInput
            inputMode="numeric"
            value={value.sessions_count === null ? "" : String(value.sessions_count)}
            onChange={(e) =>
              set({ sessions_count: e.target.value ? Number(e.target.value) : null })
            }
          />
        </Field>
        <Field label="לאורך כמה זמן" hint="לדוגמה: 4 חודשים">
          <TextInput
            value={value.timeframe ?? ""}
            onChange={(e) => set({ timeframe: e.target.value || null })}
          />
        </Field>
      </div>

      <div
        className="mb-4 px-4 py-3"
        style={{
          background: "var(--cream-50)",
          borderRadius: 10,
          border: "1px solid var(--gold-ring)",
        }}
      >
        <Toggle
          label="קיבלתי מהמטופלת אישור לפרסם את התמונות"
          hint="בלי האישור הזה אי אפשר לפרסם. זו דרישה חוקית ואתית, לא רק הגדרה באתר."
          checked={value.consent_confirmed}
          onChange={(consent_confirmed) =>
            set({
              consent_confirmed,
              is_published: consent_confirmed ? value.is_published : false,
            })
          }
        />
      </div>

      <Toggle
        label="מפורסם באתר"
        disabled={!value.consent_confirmed}
        hint={value.consent_confirmed ? undefined : "צריך לאשר קודם שהתקבלה רשות מהמטופלת"}
        checked={value.is_published}
        onChange={(is_published) => set({ is_published })}
      />

      <div className="mt-4 flex gap-2">
        <Button variant="primary" loading={saving} disabled={!ready} onClick={onSave}>
          שמירה
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          ביטול
        </Button>
      </div>
      {!ready && (
        <p className="mt-2 text-[13px]" style={{ color: "var(--ink-600)" }}>
          צריך כותרת ולפחות תמונה אחת כדי לשמור.
        </p>
      )}
    </Card>
  );
}
