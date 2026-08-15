import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Bot, Instagram, Download } from "lucide-react";
import { adminImportContentFromSource } from "@/lib/admin-cms.functions";
import { Button, Card, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/tools")({
  head: () => ({ meta: [{ title: "כלים מתקדמים | ניהול" }] }),
  component: ToolsAdmin,
});

function ToolsAdmin() {
  const importFn = useServerFn(adminImportContentFromSource);

  const runImport = useMutation({
    mutationFn: (overwrite: boolean) => importFn({ data: { overwrite } }),
    onSuccess: (res) => {
      const imported = res.imported.length;
      const skipped = res.skipped.length;
      toast.success(
        skipped
          ? `יובאו ${imported} טיפולים. ${skipped} דולגו כי כבר יש בהם תוכן.`
          : `יובאו ${imported} טיפולים.`,
      );
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "הייבוא נכשל"),
  });

  return (
    <>
      <PageHeader title="כלים מתקדמים" description="פעולות שנעשות פעם אחת או לעיתים רחוקות." />

      <Card
        title="ייבוא תוכן הטיפולים"
        description="מעתיק את התוכן של שבעת עמודי הטיפולים מהאתר הקיים אל מערכת הניהול, כדי שאפשר יהיה לערוך אותו."
      >
        <p className="mb-4 text-[14px] leading-relaxed" style={{ color: "var(--ink-600)" }}>
          זו פעולה שמריצים פעם אחת, בהתקנה. עמוד שכבר יש בו תוכן במערכת לא ייגע — כך שאם כבר ערכת
          משהו, הייבוא לא ידרוס אותו.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            loading={runImport.isPending}
            onClick={() => runImport.mutate(false)}
          >
            <Download className="h-4 w-4" aria-hidden />
            ייבוא תוכן
          </Button>
          <Button
            variant="danger"
            loading={runImport.isPending}
            onClick={() => {
              if (
                confirm(
                  "שחזור מלא ידרוס את כל העריכות שביצעת בעמודי הטיפולים ויחזיר את התוכן המקורי. להמשיך?",
                )
              ) {
                runImport.mutate(true);
              }
            }}
          >
            שחזור לתוכן המקורי
          </Button>
        </div>
      </Card>

      <Card title="מנוע התוכן" description="כתיבה אוטומטית של מאמרים, בדיקת עובדות ותזמון פרסום.">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px]"
            style={{
              border: "1px solid var(--stone-300)",
              borderRadius: 999,
              color: "var(--green-700)",
              fontWeight: 700,
            }}
          >
            <Bot className="h-4 w-4" aria-hidden />
            מנוע תוכן AI
          </Link>
          <Link
            to="/admin/instagram"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px]"
            style={{
              border: "1px solid var(--stone-300)",
              borderRadius: 999,
              color: "var(--green-700)",
              fontWeight: 700,
            }}
          >
            <Instagram className="h-4 w-4" aria-hidden />
            מנוע אינסטגרם
          </Link>
        </div>
      </Card>
    </>
  );
}
