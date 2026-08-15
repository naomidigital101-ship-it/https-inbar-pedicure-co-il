import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminListCategories, adminSaveCategory } from "@/lib/admin-cms.functions";
import type { CategoryRow } from "@/lib/cms-types";
import {
  Badge,
  Button,
  Card,
  Field,
  PageHeader,
  SaveBar,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "קטגוריות ידע | ניהול" }] }),
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCategories);
  const saveFn = useServerFn(adminSaveCategory);

  const query = useQuery({ queryKey: ["admin", "categories"], queryFn: () => listFn() });
  const [drafts, setDrafts] = useState<Record<string, CategoryRow>>({});

  const saved = useMemo(() => query.data?.categories ?? [], [query.data]);
  const dirtySlugs = Object.keys(drafts).filter((slug) => {
    const original = saved.find((c) => c.slug === slug);
    return original && JSON.stringify(original) !== JSON.stringify(drafts[slug]);
  });

  const save = useMutation({
    mutationFn: async () => {
      for (const slug of dirtySlugs) {
        const c = drafts[slug];
        await saveFn({
          data: {
            id: c.id,
            slug: c.slug,
            label: c.label,
            title: c.title,
            short_name: c.short_name,
            mod_code: c.mod_code,
            description: c.description,
            meta_title: c.meta_title,
            meta_description: c.meta_description,
            hero_image: c.hero_image,
            is_published: c.is_published,
            sort_order: c.sort_order,
          },
        });
      }
    },
    onSuccess: () => {
      toast.success("הקטגוריות נשמרו");
      setDrafts({});
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "השמירה נכשלה"),
  });

  return (
    <>
      <PageHeader
        title="קטגוריות ידע"
        description="הקטגוריות שמסדרות את המאמרים באתר. התיאור מופיע בראש עמוד הקטגוריה ומשפיע על הדירוג בגוגל."
      />

      {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}

      {saved.map((original) => {
        const value = drafts[original.slug] ?? original;
        const set = (patch: Partial<CategoryRow>) =>
          setDrafts({ ...drafts, [original.slug]: { ...value, ...patch } });

        return (
          <Card
            key={original.slug}
            title={value.label}
            actions={!value.is_published ? <Badge tone="muted">מוסתרת</Badge> : undefined}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="שם בתפריט">
                <TextInput value={value.label} onChange={(e) => set({ label: e.target.value })} />
              </Field>
              <Field label="כותרת מלאה">
                <TextInput
                  value={value.title ?? ""}
                  onChange={(e) => set({ title: e.target.value || null })}
                />
              </Field>
            </div>

            <Field
              label="תיאור הקטגוריה"
              hint="הפסקה שנפתחת את עמוד הקטגוריה. כדאי שתסביר בדיוק מה יש כאן ולמי זה מתאים."
            >
              <TextArea
                rows={5}
                value={value.description ?? ""}
                onChange={(e) => set({ description: e.target.value || null })}
              />
            </Field>

            <Toggle
              label="מוצגת באתר"
              checked={value.is_published}
              onChange={(is_published) => set({ is_published })}
            />
          </Card>
        );
      })}

      <SaveBar
        dirty={dirtySlugs.length > 0}
        saving={save.isPending}
        onSave={() => save.mutate()}
        onReset={() => setDrafts({})}
      />
    </>
  );
}
