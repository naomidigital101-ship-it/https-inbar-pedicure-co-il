/**
 * עורך עמוד טיפול.
 *
 * המבנה הסמנטי של העמוד (סקשנים, טבלאות, דגלים אדומים, מקורות) נשמר
 * ככלים ויזואליים ולא כ-JSON גולמי: ענבר בונה את העמוד בשדות רגילים,
 * והמבנה שגוגל ומנועי ה-AI קוראים נשאר תקין.
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, ExternalLink, Plus, Trash2 } from "lucide-react";
import { adminListServices, adminSaveService } from "@/lib/admin-cms.functions";
import type { ServiceRow } from "@/lib/cms-types";
import {
  Badge,
  Button,
  Card,
  Field,
  IconButton,
  PageHeader,
  RepeaterList,
  SaveBar,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { MediaPickerField } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/admin/services/$slug")({
  head: () => ({ meta: [{ title: "עריכת טיפול | ניהול" }] }),
  component: ServiceEditor,
});

type Section = ServiceRow["sections"][number];
type Draft = ServiceRow;

const TABS = [
  { key: "content", label: "תוכן העמוד" },
  { key: "sections", label: "פרקים" },
  { key: "faqs", label: "שאלות ותשובות" },
  { key: "safety", label: "דגלים ומקורות" },
  { key: "media", label: "תמונות ומחיר" },
  { key: "seo", label: "SEO ופרסום" },
] as const;

function ServiceEditor() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const listFn = useServerFn(adminListServices);
  const saveFn = useServerFn(adminSaveService);

  const query = useQuery({
    queryKey: ["admin", "services"],
    queryFn: () => listFn(),
  });

  const saved = useMemo(
    () => query.data?.services.find((s) => s.slug === slug) ?? null,
    [query.data, slug],
  );

  const [draft, setDraft] = useState<Draft | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("content");

  const value = draft ?? saved;
  const dirty = Boolean(draft && saved && JSON.stringify(draft) !== JSON.stringify(saved));

  const save = useMutation({
    mutationFn: async () => {
      if (!value) throw new Error("אין נתונים לשמירה");
      return saveFn({
        data: {
          slug: value.slug,
          nav_label: value.nav_label,
          title: value.title,
          subtitle: value.subtitle,
          meta_title: value.meta_title,
          meta_description: value.meta_description,
          h1: value.h1,
          canonical: value.canonical,
          og_image: value.og_image,
          noindex: value.noindex,
          tldr: value.tldr,
          intro: value.intro,
          quick_facts: value.quick_facts ?? [],
          sections: value.sections ?? [],
          red_flags: value.red_flags ?? [],
          faqs: value.faqs ?? [],
          sources: value.sources ?? [],
          hero_image: value.hero_image,
          card_image: value.card_image,
          card_alt: value.card_alt,
          price_text: value.price_text,
          price_visible: value.price_visible,
          is_flagship: value.is_flagship,
          flagship_title: value.flagship_title,
          flagship_tag: value.flagship_tag,
          flagship_sub: value.flagship_sub,
          flagship_icon: value.flagship_icon,
          flagship_accent: value.flagship_accent,
          schema_type: value.schema_type,
          is_published: value.is_published,
          sort_order: value.sort_order,
        },
      });
    },
    onSuccess: () => {
      toast.success("הטיפול נשמר והעמוד באתר מתעדכן");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "השמירה נכשלה"),
  });

  if (query.isLoading) return <p style={{ color: "var(--ink-600)" }}>טוענת...</p>;

  if (!value) {
    return (
      <>
        <PageHeader title="הטיפול לא נמצא" />
        <Button onClick={() => navigate({ to: "/admin/services" })}>חזרה לרשימת הטיפולים</Button>
      </>
    );
  }

  const set = (patch: Partial<Draft>) => setDraft({ ...value, ...patch });

  return (
    <>
      <Link
        to="/admin/services"
        className="mb-4 inline-flex items-center gap-1.5 text-[13.5px]"
        style={{ color: "var(--ink-600)", fontWeight: 600 }}
      >
        <ArrowRight className="h-4 w-4" aria-hidden />
        כל הטיפולים
      </Link>

      <PageHeader
        title={value.nav_label}
        description={value.title}
        actions={
          <>
            {!value.is_published && <Badge tone="muted">מוסתר מהאתר</Badge>}
            <a
              href={`/services/${value.slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px]"
              style={{
                border: "1px solid var(--stone-300)",
                borderRadius: 999,
                color: "var(--ink-600)",
                fontWeight: 600,
              }}
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              צפייה בעמוד
            </a>
          </>
        }
      />

      {/* לשוניות */}
      <div className="mb-6 flex flex-wrap gap-1.5 pb-1" role="tablist" aria-label="חלקי העמוד">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 text-[14px] transition-colors"
            style={{
              borderRadius: 999,
              fontWeight: 700,
              background: tab === t.key ? "var(--green-700)" : "#fff",
              color: tab === t.key ? "#fff" : "var(--ink-600)",
              border: `1px solid ${tab === t.key ? "var(--green-700)" : "var(--stone-300)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "content" && <ContentTab value={value} set={set} />}
      {tab === "sections" && <SectionsTab value={value} set={set} />}
      {tab === "faqs" && <FaqsTab value={value} set={set} />}
      {tab === "safety" && <SafetyTab value={value} set={set} />}
      {tab === "media" && <MediaTab value={value} set={set} />}
      {tab === "seo" && <SeoTab value={value} set={set} />}

      <SaveBar
        dirty={dirty}
        saving={save.isPending}
        onSave={() => save.mutate()}
        onReset={() => setDraft(null)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------

type TabProps = { value: Draft; set: (patch: Partial<Draft>) => void };

function ContentTab({ value, set }: TabProps) {
  return (
    <>
      <Card title="כותרות" description="מה שהמטופלת רואה בראש העמוד ובתפריט.">
        <Field label="שם בתפריט" hint="קצר — זה מה שמופיע ברשימת הטיפולים">
          <TextInput value={value.nav_label} onChange={(e) => set({ nav_label: e.target.value })} />
        </Field>
        <Field label="כותרת העמוד">
          <TextInput value={value.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="כותרת משנה">
          <TextInput
            value={value.subtitle ?? ""}
            onChange={(e) => set({ subtitle: e.target.value || null })}
          />
        </Field>
      </Card>

      <Card
        title="שורה תחתונה"
        description="התקציר שמופיע בראש העמוד. זה גם מה שמנועי AI נוטים לצטט, אז כדאי שיהיה תשובה שלמה בפני עצמה."
      >
        <Field label="תקציר">
          <TextArea
            rows={5}
            value={value.tldr ?? ""}
            onChange={(e) => set({ tldr: e.target.value || null })}
          />
        </Field>
      </Card>

      <Card
        title="עובדות מהירות"
        description="הטבלה הקטנה בראש העמוד — אורך טיפול, רמת כאב, תדירות."
      >
        <RepeaterList
          items={value.quick_facts ?? []}
          max={12}
          addLabel="הוספת עובדה"
          itemLabel={(f, i) => f.label || `עובדה ${i + 1}`}
          makeEmpty={() => ({ label: "", value: "" })}
          onChange={(quick_facts) => set({ quick_facts })}
          renderItem={(item, update) => (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="שם">
                <TextInput
                  value={item.label}
                  placeholder="אורך טיפול"
                  onChange={(e) => update({ label: e.target.value })}
                />
              </Field>
              <Field label="ערך">
                <TextInput
                  value={item.value}
                  placeholder="45–60 דקות"
                  onChange={(e) => update({ value: e.target.value })}
                />
              </Field>
            </div>
          )}
        />
      </Card>

      <Card title="פתיחה" description="הפסקה האישית שפותחת את העמוד, בגוף ראשון.">
        <Field label="טקסט הפתיחה">
          <TextArea
            rows={7}
            value={value.intro ?? ""}
            onChange={(e) => set({ intro: e.target.value || null })}
          />
        </Field>
      </Card>
    </>
  );
}

function SectionsTab({ value, set }: TabProps) {
  const sources = value.sources ?? [];

  return (
    <Card
      title="פרקי העמוד"
      description="כל פרק הוא כותרת ותוכן. אפשר להוסיף רשימת נקודות, טבלת השוואה, סיפור מהקליניקה, ולסמן על אילו מקורות הפרק נשען."
    >
      <RepeaterList<Section>
        items={value.sections ?? []}
        max={30}
        addLabel="הוספת פרק"
        itemLabel={(s, i) => s.heading || `פרק ${i + 1}`}
        makeEmpty={() => ({ heading: "", body: "" })}
        onChange={(sections) => set({ sections })}
        renderItem={(section, update) => (
          <SectionEditor section={section} update={update} sources={sources} />
        )}
      />
    </Card>
  );
}

function SectionEditor({
  section,
  update,
  sources,
}: {
  section: Section;
  update: (patch: Partial<Section>) => void;
  sources: { label: string; url: string }[];
}) {
  const bullets = section.bullets ?? [];
  const table = section.table;
  const cites = section.cites ?? [];

  return (
    <>
      <Field label="כותרת הפרק">
        <TextInput value={section.heading} onChange={(e) => update({ heading: e.target.value })} />
      </Field>

      <Field label="טקסט">
        <TextArea
          rows={5}
          value={section.body ?? ""}
          onChange={(e) => update({ body: e.target.value || undefined })}
        />
      </Field>

      {/* רשימת נקודות */}
      <Field label="רשימת נקודות" hint="אופציונלי — מופיעה מתחת לטקסט">
        {bullets.map((b, i) => (
          <div key={i} className="mb-2 flex items-start gap-2">
            <TextArea
              rows={2}
              value={b}
              onChange={(e) =>
                update({ bullets: bullets.map((x, j) => (j === i ? e.target.value : x)) })
              }
            />
            <IconButton
              label="מחיקת נקודה"
              danger
              onClick={() => update({ bullets: bullets.filter((_, j) => j !== i) })}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ))}
        <Button type="button" onClick={() => update({ bullets: [...bullets, ""] })}>
          <Plus className="h-4 w-4" aria-hidden />
          הוספת נקודה
        </Button>
      </Field>

      {/* סיפור מהקליניקה */}
      <Field
        label="מהקליניקה"
        hint="סיפור מקרה אמיתי. מופיע בעיצוב נפרד ומחזק אמון — גם אצל מטופלות וגם במנועי AI."
      >
        <TextArea
          rows={4}
          value={section.fromClinic ?? ""}
          onChange={(e) => update({ fromClinic: e.target.value || undefined })}
        />
      </Field>

      {/* טבלה */}
      <TableEditor table={table} onChange={(t) => update({ table: t })} />

      {/* מקורות */}
      {sources.length > 0 && (
        <Field
          label="על אילו מקורות הפרק נשען"
          hint="המספרים שמופיעים בסוף הפרק ומפנים לרשימת המקורות"
        >
          <div className="flex flex-wrap gap-2">
            {sources.map((src, i) => {
              const n = i + 1;
              const on = cites.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    update({
                      cites: on
                        ? cites.filter((c) => c !== n)
                        : [...cites, n].sort((a, b) => a - b),
                    })
                  }
                  className="px-3 py-1.5 text-[12.5px]"
                  style={{
                    borderRadius: 999,
                    fontWeight: 700,
                    background: on ? "var(--green-700)" : "#fff",
                    color: on ? "#fff" : "var(--ink-600)",
                    border: `1px solid ${on ? "var(--green-700)" : "var(--stone-300)"}`,
                  }}
                >
                  {n}. {src.label.slice(0, 40)}
                </button>
              );
            })}
          </div>
        </Field>
      )}
    </>
  );
}

function TableEditor({
  table,
  onChange,
}: {
  table: Section["table"];
  onChange: (t: Section["table"]) => void;
}) {
  if (!table) {
    return (
      <Field label="טבלת השוואה" hint="אופציונלי">
        <Button type="button" onClick={() => onChange({ headers: ["", ""], rows: [["", ""]] })}>
          <Plus className="h-4 w-4" aria-hidden />
          הוספת טבלה
        </Button>
      </Field>
    );
  }

  const cols = table.headers.length;

  const setCell = (r: number, c: number, v: string) =>
    onChange({
      ...table,
      rows: table.rows.map((row, ri) =>
        ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row,
      ),
    });

  return (
    <Field label="טבלת השוואה">
      <div className="mb-2 overflow-x-auto">
        <table className="w-full" style={{ minWidth: cols * 150 }}>
          <thead>
            <tr>
              {table.headers.map((h, c) => (
                <th key={c} className="p-1">
                  <TextInput
                    value={h}
                    placeholder={`עמודה ${c + 1}`}
                    onChange={(e) =>
                      onChange({
                        ...table,
                        headers: table.headers.map((x, i) => (i === c ? e.target.value : x)),
                      })
                    }
                  />
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="p-1">
                    <TextInput value={cell} onChange={(e) => setCell(r, c, e.target.value)} />
                  </td>
                ))}
                <td className="p-1">
                  <IconButton
                    label="מחיקת שורה"
                    danger
                    onClick={() =>
                      onChange({ ...table, rows: table.rows.filter((_, i) => i !== r) })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => onChange({ ...table, rows: [...table.rows, Array(cols).fill("")] })}
        >
          הוספת שורה
        </Button>
        <Button
          type="button"
          onClick={() =>
            onChange({
              headers: [...table.headers, ""],
              rows: table.rows.map((r) => [...r, ""]),
            })
          }
        >
          הוספת עמודה
        </Button>
        <Button
          type="button"
          onClick={() =>
            onChange({
              headers: table.headers.slice(0, -1),
              rows: table.rows.map((r) => r.slice(0, -1)),
            })
          }
          disabled={cols <= 1}
        >
          הסרת עמודה אחרונה
        </Button>
        <Button type="button" variant="danger" onClick={() => onChange(undefined)}>
          מחיקת הטבלה
        </Button>
      </div>
    </Field>
  );
}

function FaqsTab({ value, set }: TabProps) {
  return (
    <Card
      title="שאלות ותשובות"
      description="השאלות האלה מוזנות לגוגל כ-FAQ ומופיעות לעיתים ישירות בתוצאות החיפוש. כדאי לנסח כמו שמטופלת באמת שואלת."
    >
      <RepeaterList
        items={value.faqs ?? []}
        max={30}
        addLabel="הוספת שאלה"
        itemLabel={(f, i) => f.q || `שאלה ${i + 1}`}
        makeEmpty={() => ({ q: "", a: "" })}
        onChange={(faqs) => set({ faqs })}
        renderItem={(item, update) => (
          <>
            <Field label="השאלה">
              <TextInput value={item.q} onChange={(e) => update({ q: e.target.value })} />
            </Field>
            <Field label="התשובה">
              <TextArea rows={5} value={item.a} onChange={(e) => update({ a: e.target.value })} />
            </Field>
          </>
        )}
      />
    </Card>
  );
}

function SafetyTab({ value, set }: TabProps) {
  const flags = value.red_flags ?? [];

  return (
    <>
      <Card
        title="דגלים אדומים"
        description="מתי חייבים לפנות לרופא. תוכן רפואי בלי האזהרות האלה נחשב פחות אמין — גם על ידי גוגל."
      >
        {flags.map((f, i) => (
          <div key={i} className="mb-2 flex items-start gap-2">
            <TextArea
              rows={2}
              value={f}
              onChange={(e) =>
                set({ red_flags: flags.map((x, j) => (j === i ? e.target.value : x)) })
              }
            />
            <IconButton
              label="מחיקת דגל"
              danger
              onClick={() => set({ red_flags: flags.filter((_, j) => j !== i) })}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ))}
        <Button type="button" onClick={() => set({ red_flags: [...flags, ""] })}>
          <Plus className="h-4 w-4" aria-hidden />
          הוספת דגל אדום
        </Button>
      </Card>

      <Card
        title="מקורות"
        description="הסדר כאן קובע את המספור. שינוי הסדר משנה גם את המספרים שסימנת בפרקים — כדאי לבדוק אותם אחרי."
      >
        <RepeaterList
          items={value.sources ?? []}
          max={20}
          addLabel="הוספת מקור"
          itemLabel={(s, i) => `${i + 1}. ${s.label || "מקור"}`}
          makeEmpty={() => ({ label: "", url: "" })}
          onChange={(sources) => set({ sources })}
          renderItem={(item, update) => (
            <>
              <Field label="שם המקור">
                <TextInput
                  value={item.label}
                  placeholder="NHS — Corns and calluses"
                  onChange={(e) => update({ label: e.target.value })}
                />
              </Field>
              <Field label="כתובת">
                <TextInput
                  ltr
                  value={item.url}
                  placeholder="https://"
                  onChange={(e) => update({ url: e.target.value })}
                />
              </Field>
            </>
          )}
        />
      </Card>
    </>
  );
}

function MediaTab({ value, set }: TabProps) {
  return (
    <>
      <Card title="תמונות">
        <MediaPickerField
          label="תמונת ראש העמוד"
          folder="services"
          value={value.hero_image ?? ""}
          onChange={(v) => set({ hero_image: v || null })}
        />
        <MediaPickerField
          label="תמונת הכרטיס"
          hint="מופיעה ברשימת הטיפולים ובדף הבית"
          folder="services"
          value={value.card_image ?? ""}
          onChange={(v) => set({ card_image: v || null })}
        />
        <Field label="תיאור התמונה" hint="מה רואים בתמונה. חשוב לקוראות מסך ולגוגל.">
          <TextInput
            value={value.card_alt ?? ""}
            onChange={(e) => set({ card_alt: e.target.value || null })}
          />
        </Field>
      </Card>

      <Card
        title="מחיר"
        description="היום אין מחירים באתר. אם תרצי להציג מחיר לטיפול הזה — כתבי אותו והדליקי את התצוגה."
      >
        <Field label="מה יוצג" hint="לדוגמה: 280 ש״ח · או: החל מ-250 ש״ח">
          <TextInput
            value={value.price_text ?? ""}
            onChange={(e) => set({ price_text: e.target.value || null })}
          />
        </Field>
        <Toggle
          label="הצגת המחיר באתר"
          checked={value.price_visible}
          onChange={(price_visible) => set({ price_visible })}
        />
      </Card>

      <Card
        title="הצגה בדף הבית"
        description="שלושת הטיפולים המסומנים כאן מופיעים ככרטיסי 'תחומי הליבה'."
      >
        <Toggle
          label="מוצג בדף הבית"
          checked={value.is_flagship}
          onChange={(is_flagship) => set({ is_flagship })}
        />
        {value.is_flagship && (
          <>
            <Field label="כותרת בכרטיס" hint="לרוב קצרה יותר מכותרת העמוד">
              <TextInput
                value={value.flagship_title ?? ""}
                onChange={(e) => set({ flagship_title: e.target.value || null })}
              />
            </Field>
            <Field label="תווית קטנה">
              <TextInput
                value={value.flagship_tag ?? ""}
                placeholder="פטרת"
                onChange={(e) => set({ flagship_tag: e.target.value || null })}
              />
            </Field>
            <Field label="שורת הסבר">
              <TextInput
                value={value.flagship_sub ?? ""}
                onChange={(e) => set({ flagship_sub: e.target.value || null })}
              />
            </Field>
          </>
        )}
      </Card>
    </>
  );
}

function SeoTab({ value, set }: TabProps) {
  const metaLen = (value.meta_description ?? "").length;
  const metaOk = metaLen >= 120 && metaLen <= 158;

  return (
    <>
      <Card title="איך העמוד נראה בגוגל" description="זו התצוגה המקורבת של תוצאת החיפוש.">
        <div
          className="mb-5 px-4 py-3.5"
          style={{ background: "var(--stone-50)", borderRadius: 10 }}
        >
          <p className="text-[13px]" style={{ color: "var(--ink-600)" }} dir="ltr">
            inbar-pedicure.co.il › services › {value.slug}
          </p>
          <p
            className="mt-0.5 text-[18px]"
            style={{ color: "#1a0dab", fontWeight: 600, lineHeight: 1.3 }}
          >
            {value.meta_title || value.title}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: "var(--ink-600)" }}>
            {value.meta_description || "אין עדיין תיאור — גוגל יבחר קטע מהעמוד לבד."}
          </p>
        </div>

        <Field label="כותרת בגוגל">
          <TextInput
            value={value.meta_title ?? ""}
            onChange={(e) => set({ meta_title: e.target.value || null })}
          />
        </Field>
        <Field
          label="תיאור בגוגל"
          hint={`${metaLen} תווים${metaOk ? " — אורך טוב" : " — הטווח המומלץ הוא 120 עד 158"}`}
        >
          <TextArea
            rows={3}
            value={value.meta_description ?? ""}
            onChange={(e) => set({ meta_description: e.target.value || null })}
          />
        </Field>
        <MediaPickerField
          label="תמונת שיתוף"
          hint="מה שמופיע כששולחים את הקישור בוואטסאפ או בפייסבוק"
          folder="og"
          value={value.og_image ?? ""}
          onChange={(v) => set({ og_image: v || null })}
        />
      </Card>

      <Card title="פרסום">
        <Toggle
          label="העמוד מפורסם באתר"
          hint="כיבוי מסתיר את העמוד מהמבקרים ומהתפריט"
          checked={value.is_published}
          onChange={(is_published) => set({ is_published })}
        />
        <Toggle
          label="לבקש מגוגל לא להציג את העמוד בתוצאות"
          hint="להשאיר כבוי אלא אם יש סיבה ספציפית"
          checked={value.noindex}
          onChange={(noindex) => set({ noindex })}
        />
        <Field label="מיקום ברשימה" hint="מספר נמוך = מופיע קודם">
          <TextInput
            inputMode="numeric"
            value={String(value.sort_order)}
            onChange={(e) => set({ sort_order: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="סוג התוכן לגוגל">
          <Select value={value.schema_type} onChange={(e) => set({ schema_type: e.target.value })}>
            <option value="MedicalWebPage">עמוד מידע רפואי</option>
            <option value="MedicalProcedure">פרוצדורה רפואית</option>
            <option value="Service">שירות</option>
          </Select>
        </Field>
      </Card>
    </>
  );
}
