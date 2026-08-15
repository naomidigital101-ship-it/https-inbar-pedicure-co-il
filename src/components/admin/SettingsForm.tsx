/**
 * טופס הגדרות מונחה-נתונים.
 *
 * הטופס נבנה מתוך טבלת site_settings עצמה — כל שורה נושאת תווית עברית
 * וסוג שדה. המשמעות: הוספת שדה חדש לאתר היא שורה אחת ב-DB, בלי שינוי
 * בקוד הזה ובלי פריסה מחדש.
 */

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminListSettings, adminSaveSettings } from "@/lib/admin-cms.functions";
import type { SettingRow } from "@/lib/cms-types";
import {
  Card,
  Field,
  RepeaterList,
  SaveBar,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/AdminUI";
import { MediaPickerField } from "@/components/admin/MediaPicker";

type Stat = { num: string; label: string };

export function SettingsForm({
  groups,
  emptyText,
}: {
  /** קבוצות מתוך site_settings, לפי הסדר שבו יוצגו. עם כותרת בעברית. */
  groups: { key: string; title: string; description?: string }[];
  emptyText?: string;
}) {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListSettings);
  const saveFn = useServerFn(adminSaveSettings);

  const query = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => listFn(),
  });

  const [draft, setDraft] = useState<Record<string, string> | null>(null);

  const rows = useMemo(
    () => (query.data?.settings ?? []).filter((r) => groups.some((g) => g.key === r.group_key)),
    [query.data, groups],
  );

  const saved = useMemo(() => {
    const m: Record<string, string> = {};
    for (const r of rows) m[r.key] = r.value ?? "";
    return m;
  }, [rows]);

  const values = draft ?? saved;
  const dirty = Object.keys(values).some((k) => values[k] !== saved[k]);

  const save = useMutation({
    mutationFn: async () => {
      const changed: Record<string, string> = {};
      for (const k of Object.keys(values)) {
        if (values[k] !== saved[k]) changed[k] = values[k];
      }
      return saveFn({ data: { values: changed } });
    },
    onSuccess: () => {
      toast.success("השינויים נשמרו והאתר מתעדכן");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "השמירה נכשלה"),
  });

  const set = (key: string, value: string) => setDraft({ ...values, [key]: value });

  if (query.isLoading) {
    return <p style={{ color: "var(--ink-600)" }}>טוענת...</p>;
  }
  if (query.isError) {
    return (
      <p style={{ color: "#B4231C", fontWeight: 600 }}>
        לא הצלחתי לטעון את ההגדרות. רענני את העמוד.
      </p>
    );
  }
  if (!rows.length) {
    return <p style={{ color: "var(--ink-600)" }}>{emptyText ?? "אין הגדרות להצגה."}</p>;
  }

  return (
    <>
      {groups.map((g) => {
        const groupRows = rows.filter((r) => r.group_key === g.key);
        if (!groupRows.length) return null;
        return (
          <Card key={g.key} title={g.title} description={g.description}>
            {groupRows.map((row) => (
              <SettingField
                key={row.key}
                row={row}
                value={values[row.key] ?? ""}
                onChange={(v) => set(row.key, v)}
              />
            ))}
          </Card>
        );
      })}

      <SaveBar
        dirty={dirty}
        saving={save.isPending}
        onSave={() => save.mutate()}
        onReset={() => setDraft(null)}
      />
    </>
  );
}

function SettingField({
  row,
  value,
  onChange,
}: {
  row: SettingRow;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `setting-${row.key}`;

  if (row.input_type === "boolean") {
    return (
      <Toggle
        label={row.label}
        hint={row.help_text ?? undefined}
        checked={value === "true"}
        onChange={(v) => onChange(v ? "true" : "false")}
      />
    );
  }

  if (row.input_type === "textarea") {
    return (
      <Field label={row.label} hint={row.help_text} htmlFor={id}>
        <TextArea id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  }

  if (row.input_type === "image") {
    return (
      <MediaPickerField label={row.label} hint={row.help_text} value={value} onChange={onChange} />
    );
  }

  if (row.input_type === "repeater") {
    return <StatsRepeater row={row} value={value} onChange={onChange} />;
  }

  const ltr =
    row.input_type === "url" ||
    row.input_type === "email" ||
    row.input_type === "tel" ||
    row.key === "whatsapp_number";

  return (
    <Field label={row.label} hint={row.help_text} htmlFor={id}>
      <TextInput
        id={id}
        ltr={ltr}
        inputMode={row.input_type === "number" ? "numeric" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

/**
 * עורך ארבעת המספרים שבראש דף הבית. מאוחסן כ-JSON בשדה יחיד,
 * אבל ענבר רואה שדות רגילים — לא טקסט JSON.
 */
function StatsRepeater({
  row,
  value,
  onChange,
}: {
  row: SettingRow;
  value: string;
  onChange: (v: string) => void;
}) {
  let stats: Stat[] = [];
  try {
    const parsed = JSON.parse(value || "[]");
    if (Array.isArray(parsed)) {
      stats = parsed.filter(
        (s): s is Stat => s && typeof s.num === "string" && typeof s.label === "string",
      );
    }
  } catch {
    stats = [];
  }

  return (
    <Field label={row.label} hint={row.help_text}>
      <RepeaterList<Stat>
        items={stats}
        max={6}
        addLabel="הוספת מספר"
        itemLabel={(s, i) => s.num || `מספר ${i + 1}`}
        makeEmpty={() => ({ num: "", label: "" })}
        onChange={(next) => onChange(JSON.stringify(next))}
        renderItem={(item, update) => (
          <div className="grid gap-3 md:grid-cols-[140px_1fr]">
            <Field label="המספר">
              <TextInput
                value={item.num}
                placeholder="12+"
                onChange={(e) => update({ num: e.target.value })}
              />
            </Field>
            <Field label="מה הוא מתאר">
              <TextInput
                value={item.label}
                placeholder="שנות ניסיון קליני"
                onChange={(e) => update({ label: e.target.value })}
              />
            </Field>
          </div>
        )}
      />
    </Field>
  );
}

export { Select };
