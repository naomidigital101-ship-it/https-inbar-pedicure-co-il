import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { MessageCircle, Phone } from "lucide-react";
import { adminListLeads, adminUpdateLead } from "@/lib/admin-cms.functions";
import { LEAD_STATUSES, type LeadRow } from "@/lib/cms-types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Select,
  TextArea,
} from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "פניות | ניהול" }] }),
  component: LeadsAdmin,
});

function LeadsAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListLeads);
  const updateFn = useServerFn(adminUpdateLead);

  const query = useQuery({ queryKey: ["admin", "leads"], queryFn: () => listFn() });
  const [filter, setFilter] = useState("all");

  const update = useMutation({
    mutationFn: (v: { id: string; status: LeadRow["status"]; notes: string | null }) =>
      updateFn({
        data: {
          id: v.id,
          status: v.status as "new" | "contacted" | "scheduled" | "done" | "irrelevant",
          notes: v.notes,
        },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "leads"] }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "העדכון נכשל"),
  });

  const all = query.data?.leads ?? [];
  const leads = filter === "all" ? all : all.filter((l) => l.status === filter);
  const newCount = all.filter((l) => l.status === "new").length;

  const exportCsv = () => {
    const header = ["שם", "טלפון", "אימייל", "הודעה", "עמוד מקור", "סטטוס", "תאריך"];
    const esc = (v: string) => {
      const s = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = all.map((l) =>
      [
        l.name ?? "",
        l.phone ?? "",
        l.email ?? "",
        l.message ?? "",
        l.source_page ?? "",
        LEAD_STATUSES.find((s) => s.value === l.status)?.label ?? l.status,
        new Date(l.created_at).toLocaleString("he-IL"),
      ]
        .map(esc)
        .join(","),
    );
    const blob = new Blob(["﻿" + [header.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `פניות-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="פניות"
        description="כל מי שהשאיר פרטים באתר. אפשר לסמן מה כבר טופל ולכתוב הערה לעצמך."
        actions={
          <Button onClick={exportCsv} disabled={!all.length}>
            ייצוא לאקסל
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-[13.5px]" style={{ color: "var(--ink-600)" }}>
          סה״כ {all.length} פניות
          {newCount > 0 && <> · {newCount} חדשות</>}
        </span>
        <div className="w-[180px]">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">הכל</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}

      {!query.isLoading && leads.length === 0 && (
        <EmptyState
          title={all.length ? "אין פניות בסינון הזה" : "עדיין אין פניות"}
          hint={
            all.length
              ? undefined
              : "כשמישהי תשאיר פרטים בטופס באתר, הפנייה תופיע כאן."
          }
        />
      )}

      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          saving={update.isPending}
          onUpdate={(status, notes) => update.mutate({ id: lead.id, status, notes })}
        />
      ))}
    </>
  );
}

function LeadCard({
  lead,
  saving,
  onUpdate,
}: {
  lead: LeadRow;
  saving: boolean;
  onUpdate: (status: string, notes: string | null) => void;
}) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  const notesDirty = notes !== (lead.notes ?? "");

  const waHref = lead.phone
    ? `https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^0/, "972")}`
    : null;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-[240px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15.5px]" style={{ fontWeight: 700, color: "var(--ink-900)" }}>
              {lead.name || "ללא שם"}
            </span>
            {lead.status === "new" && <Badge tone="warn">חדשה</Badge>}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13.5px]">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                dir="ltr"
                className="inline-flex items-center gap-1.5"
                style={{ color: "var(--green-700)", fontWeight: 600 }}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {lead.phone}
              </a>
            )}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5"
                style={{ color: "var(--green-700)", fontWeight: 600 }}
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                וואטסאפ
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                dir="ltr"
                style={{ color: "var(--green-700)", fontWeight: 600 }}
              >
                {lead.email}
              </a>
            )}
          </div>

          {lead.message && (
            <p
              className="mt-2 px-3 py-2 text-[14px] leading-relaxed"
              style={{ background: "var(--stone-50)", borderRadius: 8, color: "var(--ink-600)" }}
            >
              {lead.message}
            </p>
          )}

          <p className="mt-2 text-[12.5px]" style={{ color: "var(--ink-600)" }}>
            {new Date(lead.created_at).toLocaleString("he-IL")}
            {lead.source_page && ` · הגיעה מ${lead.source_page}`}
          </p>
        </div>

        <div className="w-full md:w-[220px]">
          <Select
            value={lead.status}
            disabled={saving}
            onChange={(e) => onUpdate(e.target.value, lead.notes)}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>

          <div className="mt-2">
            <TextArea
              rows={2}
              placeholder="הערה לעצמך"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {notesDirty && (
              <Button
                className="mt-2 w-full"
                loading={saving}
                onClick={() => onUpdate(lead.status, notes || null)}
              >
                שמירת ההערה
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
