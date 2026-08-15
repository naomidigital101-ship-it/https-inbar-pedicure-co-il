/**
 * עורך מקטעי דף הבית.
 *
 * הטופס נבנה מ-item_schema שמגיע עם כל מקטע, ולכן אותו רכיב משרת את
 * כל תשעת המקטעים — ומקטע חדש לא דורש מסך חדש.
 */

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminListContentBlocks,
  adminListServices,
  adminSaveContentBlock,
} from "@/lib/admin-cms.functions";
import type { ContentBlockRow } from "@/lib/cms-types";
import {
  Badge,
  Button,
  Card,
  Field,
  RepeaterList,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { MediaPickerField } from "@/components/admin/MediaPicker";

type Item = Record<string, string>;

export function ContentBlocksEditor() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListContentBlocks);
  const servicesFn = useServerFn(adminListServices);
  const saveFn = useServerFn(adminSaveContentBlock);

  const query = useQuery({ queryKey: ["admin", "blocks"], queryFn: () => listFn() });
  const services = useQuery({ queryKey: ["admin", "services"], queryFn: () => servicesFn() });

  const blocks = useMemo(() => query.data?.blocks ?? [], [query.data]);
  const [drafts, setDrafts] = useState<Record<string, ContentBlockRow>>({});

  const save = useMutation({
    mutationFn: (b: ContentBlockRow) =>
      saveFn({
        data: {
          block_key: b.block_key,
          heading: b.heading,
          subheading: b.subheading,
          items: b.items,
          is_published: b.is_published,
        },
      }),
    onSuccess: (_r, b) => {
      toast.success("המקטע נשמר");
      setDrafts((d) => {
        const next = { ...d };
        delete next[b.block_key];
        return next;
      });
      qc.invalidateQueries({ queryKey: ["admin", "blocks"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "השמירה נכשלה"),
  });

  if (query.isLoading) return <p style={{ color: "var(--ink-600)" }}>טוענת...</p>;

  if (!blocks.length) {
    return (
      <Card title="מקטעי דף הבית">
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-600)" }}>
          המקטעים עדיין לא נטענו למערכת הניהול. הם מוצגים באתר כרגיל, אבל כדי לערוך אותם צריך להריץ
          פעם אחת "ייבוא תוכן" בעמוד הכלים המתקדמים.
        </p>
      </Card>
    );
  }

  return (
    <>
      {blocks.map((original) => {
        const value = drafts[original.block_key] ?? original;
        const dirty = JSON.stringify(value) !== JSON.stringify(original);
        const set = (patch: Partial<ContentBlockRow>) =>
          setDrafts({ ...drafts, [original.block_key]: { ...value, ...patch } });

        return (
          <Card
            key={original.block_key}
            title={original.label}
            description={original.description ?? undefined}
            actions={
              <>
                {!value.is_published && <Badge tone="muted">מוסתר</Badge>}
                <Button
                  variant="primary"
                  disabled={!dirty}
                  loading={save.isPending}
                  onClick={() => save.mutate(value)}
                >
                  שמירה
                </Button>
              </>
            }
          >
            <Field label="כותרת המקטע" hint="אפשר להשאיר ריק כדי לשמור על הכותרת הקיימת">
              <TextInput
                value={value.heading ?? ""}
                onChange={(e) => set({ heading: e.target.value || null })}
              />
            </Field>

            <RepeaterList<Item>
              items={value.items}
              max={40}
              addLabel="הוספת פריט"
              itemLabel={(item, i) => item[original.item_schema[0]?.key ?? ""] || `פריט ${i + 1}`}
              makeEmpty={() => Object.fromEntries(original.item_schema.map((f) => [f.key, ""]))}
              onChange={(items) => set({ items })}
              renderItem={(item, update) => (
                <>
                  {original.item_schema.map((f) => (
                    <ItemField
                      key={f.key}
                      field={f}
                      value={item[f.key] ?? ""}
                      services={services.data?.services ?? []}
                      onChange={(v) => update({ [f.key]: v } as Partial<Item>)}
                    />
                  ))}
                </>
              )}
            />

            <div className="mt-4">
              <Toggle
                label="המקטע מוצג באתר"
                checked={value.is_published}
                onChange={(is_published) => set({ is_published })}
              />
            </div>
          </Card>
        );
      })}
    </>
  );
}

function ItemField({
  field,
  value,
  onChange,
  services,
}: {
  field: ContentBlockRow["item_schema"][number];
  value: string;
  onChange: (v: string) => void;
  services: { slug: string; nav_label: string }[];
}) {
  if (field.type === "textarea") {
    return (
      <Field label={field.label} hint={field.hint}>
        <TextArea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  }

  if (field.type === "service") {
    return (
      <Field label={field.label} hint={field.hint}>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">ללא קישור</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.nav_label}
            </option>
          ))}
        </Select>
      </Field>
    );
  }

  if (field.type === "image") {
    return (
      <MediaPickerField
        label={field.label}
        hint={field.hint}
        folder="home"
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <Field label={field.label} hint={field.hint}>
      <div className={field.type === "short" ? "max-w-[140px]" : undefined}>
        <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}
