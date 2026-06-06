import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  listTopics,
  suggestTopics,
  setTopicStatus,
  listPublishedQaTargets,
  listAdminArticles,
  generateFromTopic,
  requeueQA,
  publishNow,
  archiveArticle,
  dashboardStats,
  getSettings,
  updateSettings,
  postPublishQA,
  publishAllPassed,
  generateAllPending,
  generateNextPending,
  deleteTopic,
  factCheckPublished,
  listAutopilotRuns,
  triggerAutopilotNow,
} from "@/lib/ai-content.functions";
import { getIndexationStatus, submitForIndexing, inspectArticleUrl } from "@/lib/gsc.functions";

export const Route = createFileRoute("/admin/content")({
  head: () => ({
    meta: [
      { title: "ניהול תוכן AI | הרוכב העצלן" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminContent,
});

function AdminContent() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const isAdminFn = useServerFn(checkIsAdmin);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const r = await isAdminFn();
        if (cancelled) return;
        if (!r.isAdmin) {
          toast.error("אין הרשאות מנהל");
          navigate({ to: "/" });
          return;
        }
        setReady(true);
      } catch {
        navigate({ to: "/admin/login" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdminFn, navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fefaf6]">
        <p className="text-sm font-bold text-[#6b5f55]">בודק הרשאות...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefaf6]" dir="rtl">
      <header className="border-b border-[#d6c5ac] bg-[#f5ede4]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
              [ AI // CONTENT ]
            </span>
            <h1 className="text-lg font-black text-[#2a1f1a]">ניהול תוכן AI</h1>
          </div>
          <Link
            to="/admin"
            className="text-xs font-bold uppercase tracking-wider text-[#5a4f48] hover:text-[#8b3a52]"
          >
            ← חזרה לפאנל ראשי
          </Link>
        </div>
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-2 px-4 py-4 md:px-8">
          <button
            onClick={() => scrollToSection("dashboard-section")}
            className="border border-[#d6c5ac] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#3a2f28] transition-colors hover:border-[#8b3a52] hover:text-[#2a1f1a]"
          >
            לוח בקרה
          </button>
          <button
            onClick={() => scrollToSection("topics-section")}
            className="border border-[#d6c5ac] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#3a2f28] transition-colors hover:border-[#8b3a52] hover:text-[#2a1f1a]"
          >
            נושאים
          </button>
          <button
            onClick={() => scrollToSection("articles-section")}
            className="border border-[#d6c5ac] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#3a2f28] transition-colors hover:border-[#8b3a52] hover:text-[#2a1f1a]"
          >
            מאמרים
          </button>
          <button
            onClick={() => scrollToSection("indexation-section")}
            className="border border-[#d6c5ac] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#3a2f28] transition-colors hover:border-[#8b3a52] hover:text-[#2a1f1a]"
          >
            אינדוקס Google
          </button>
          <button
            onClick={() => scrollToSection("settings-section")}
            className="border border-[#d6c5ac] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#3a2f28] transition-colors hover:border-[#8b3a52] hover:text-[#2a1f1a]"
          >
            הגדרות
          </button>
          <button
            onClick={() => scrollToSection("autopilot-history-section")}
            className="border border-[#d6c5ac] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#3a2f28] transition-colors hover:border-[#8b3a52] hover:text-[#2a1f1a]"
          >
            היסטוריית אוטופיילוט
          </button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 md:px-8">
        <AdminSection id="dashboard-section" title="לוח בקרה">
          <DashboardTab />
        </AdminSection>
        <AdminSection id="topics-section" title="נושאים">
          <TopicsTab onArticleCreated={() => scrollToSection("articles-section")} />
        </AdminSection>
        <AdminSection id="articles-section" title="מאמרים">
          <ArticlesTab />
        </AdminSection>
        <AdminSection id="indexation-section" title="אינדוקס Google (Search Console)">
          <IndexationTab />
        </AdminSection>
        <AdminSection id="settings-section" title="הגדרות">
          <SettingsTab />
        </AdminSection>
        <AdminSection id="autopilot-history-section" title="היסטוריית אוטופיילוט">
          <AutopilotHistoryTab />
        </AdminSection>
      </main>
    </div>
  );
}

function DashboardTab() {
  const fn = useServerFn(dashboardStats);
  const q = useQuery({ queryKey: ["ai", "stats"], queryFn: () => fn() });

  if (q.isLoading) return <p className="text-sm text-[#5a4f48]">טוען...</p>;
  const a = q.data?.articles ?? {};
  const t = q.data?.topics ?? {};
  const cards = [
    { label: "טיוטות", value: a.draft ?? 0 },
    { label: "בבדיקת QA", value: a.qa_pending ?? 0 },
    { label: "עברו QA", value: a.qa_passed ?? 0 },
    { label: "QA נכשל", value: a.qa_failed ?? 0 },
    { label: "מתוזמנים", value: a.scheduled ?? 0 },
    { label: "פורסמו", value: a.published ?? 0 },
    { label: "נושאים ממתינים", value: t.pending ?? 0 },
    { label: "נושאים מאושרים", value: t.approved ?? 0 },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="border border-[#d6c5ac] bg-[#f5ede4] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6b5f55]">
            {c.label}
          </p>
          <p className="mt-1 text-3xl font-black text-[#2a1f1a]">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function TopicsTab({ onArticleCreated }: { onArticleCreated?: () => void }) {
  const qc = useQueryClient();
  const listFn = useServerFn(listTopics);
  const suggestFn = useServerFn(suggestTopics);
  const setStatusFn = useServerFn(setTopicStatus);
  const genFn = useServerFn(generateFromTopic);
  const listPublishedQaTargetsFn = useServerFn(listPublishedQaTargets);
  const postQaFn = useServerFn(postPublishQA);
  const publishAllFn = useServerFn(publishAllPassed);
  const generateAllFn = useServerFn(generateAllPending);
  const generateNextFn = useServerFn(generateNextPending);
  const deleteTopicFn = useServerFn(deleteTopic);
  const factCheckFn = useServerFn(factCheckPublished);
  const [bulkSuggest, setBulkSuggest] = useState(5);
  type APProgress = {
    step: 1 | 2 | 3 | 4 | 5;
    label: string;
    detail: string;
    current: number;
    total: number;
    log: string[];
  };
  const [apProgress, setApProgress] = useState<APProgress | null>(null);
  type QAProgress = {
    current: number;
    total: number;
    currentSlug: string;
    scanned: number;
    passed: number;
    failed: number;
    fixed: number;
    log: string[];
  };
  const [qaProgress, setQaProgress] = useState<QAProgress | null>(null);
  const pushLog = (msg: string) =>
    setApProgress((p) =>
      p ? { ...p, log: [...p.log.slice(-30), `${new Date().toLocaleTimeString("he-IL")} — ${msg}`] } : p,
    );
  const q = useQuery({ queryKey: ["ai", "topics"], queryFn: () => listFn() });
  const runQaBatchWithRetry = async (
    ids: string[],
    batch: number,
    onRetry?: (attempt: number, message: string) => void,
  ) => {
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await postQaFn({ data: { ids, limit: batch, onlyUnchecked: false, repairPasses: 2 } });
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : "שגיאה לא ידועה";
        const isTimeout = /timeout|timed out/i.test(message);
        if (!isTimeout || attempt === 3) throw error;
        onRetry?.(attempt, message);
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("QA נכשל");
  };

  const suggest = useMutation({
    mutationFn: () => suggestFn({ data: { count: 5 } }),
    onSuccess: (r) => {
      if ("error" in r) {
        toast.error(r.error);
        return;
      }
      toast.success(`נוספו ${r.inserted} נושאים חדשים`);
      qc.invalidateQueries({ queryKey: ["ai", "topics"] });
    },
    onError: (e) => toast.error(`שגיאה: ${(e as Error).message}`),
  });

  const updateStatus = useMutation({
    mutationFn: (v: { id: string; status: "approved" | "rejected" }) =>
      setStatusFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai", "topics"] }),
  });

  const generate = useMutation({
    mutationFn: (topicId: string) => genFn({ data: { topicId } }),
    onSuccess: (r) => {
      toast.success(
        r.passed
          ? `מאמר נוצר ועבר QA: ${r.slug} — גולל לרשימת המאמרים`
          : `מאמר נוצר אבל QA נכשל: ${r.slug} — בדוק ברשימת המאמרים`,
      );
      qc.invalidateQueries({ queryKey: ["ai"] });
      onArticleCreated?.();
    },
    onError: (e) => toast.error(`שגיאה ביצירת מאמר: ${(e as Error).message}`),
  });

  const autopilot = useMutation({
    mutationFn: async () => {
      // Step 1: Suggest topics
      setApProgress({ step: 1, label: "מציע נושאים חדשים", detail: `מבקש ${bulkSuggest} נושאים`, current: 0, total: bulkSuggest, log: [] });
      pushLog("שלב 1/5 התחיל");
      let suggested = 0;
      try {
        const sug = await suggestFn({ data: { count: bulkSuggest } });
        if ("error" in sug) {
          pushLog(`שלב 1 נעצר: ${sug.error}`);
          setApProgress((p) =>
            p
              ? {
                  ...p,
                  current: 0,
                  total: 0,
                  detail: sug.error,
                }
              : p,
          );
          return {
            suggested: 0,
            generated: 0,
            passedQA: 0,
            failedQA: 0,
            published: 0,
            factChecked: 0,
            qa: { scanned: 0, fixed: 0, enriched: 0, passed: 0, failed: 0 },
            stoppedReason: sug.error,
          };
        }
        suggested = sug.inserted;
        pushLog(`נוספו ${suggested} נושאים`);
        setApProgress((p) => (p ? { ...p, current: suggested, detail: `נוספו ${suggested} נושאים` } : p));
        qc.invalidateQueries({ queryKey: ["ai", "topics"] });
      } catch (e) {
        console.error("[autopilot] step 1 failed:", e);
        pushLog(`שלב 1 נכשל: ${(e as Error).message} — ממשיך`);
      }

      // Step 2: Write all pending topics one-by-one
      setApProgress((p) => ({ step: 2, label: "כותב מאמרים", detail: "מתחיל לכתוב", current: 0, total: 0, log: p?.log ?? [] }));
      pushLog("שלב 2/5 התחיל");
      let generated = 0, passedQA = 0, failedQA = 0;
      for (let i = 0; i < 200; i++) {
        try {
          const r = await generateNextFn({ data: {} } as never);
          if (!r.processed) break;
          generated++;
          if (r.processed.passed) passedQA++;
          else failedQA++;
          const total = generated + (r.remaining ?? 0);
          setApProgress((p) => (p ? { ...p, current: generated, total, detail: `נכתב: ${r.processed!.slug} ${r.processed!.passed ? "✅" : "⚠️"} — נותרו ${r.remaining}` } : p));
          pushLog(`נכתב: ${r.processed.slug} ${r.processed.passed ? "✅" : "⚠️"}`);
          qc.invalidateQueries({ queryKey: ["ai"] });
          if (r.done) break;
        } catch (e) {
          console.error("[autopilot] generate iteration failed:", e);
          pushLog(`כתיבת מאמר נכשלה: ${(e as Error).message} — ממשיך`);
          // small pause to avoid hot-loop on persistent failure
          await new Promise((res) => setTimeout(res, 1500));
        }
      }
      pushLog(`נכתבו ${generated} מאמרים`);

      // Step 3: Publish all
      setApProgress((p) => ({ step: 3, label: "מפרסם מאמרים", detail: "שולח לפרסום", current: 0, total: generated, log: p?.log ?? [] }));
      pushLog("שלב 3/5 התחיל");
      let published = 0;
      try {
        const pub = await publishAllFn({ data: {} } as never);
        published = pub.published;
        setApProgress((p) => (p ? { ...p, current: published, total: Math.max(published, p.total), detail: `פורסמו ${published} מאמרים` } : p));
        pushLog(`פורסמו ${published} מאמרים`);
        qc.invalidateQueries({ queryKey: ["ai"] });
      } catch (e) {
        console.error("[autopilot] step 3 failed:", e);
        pushLog(`שלב 3 נכשל: ${(e as Error).message} — ממשיך`);
      }

      // Step 4: Fact-check
      setApProgress((p) => ({ step: 4, label: "מאמת עובדות", detail: "סורק מאמרים מול מקורות", current: 0, total: published, log: p?.log ?? [] }));
      pushLog("שלב 4/5 התחיל");
      const factBatch = 3;
      let fcScanned = 0, fcFixed = 0, fcCorr = 0, fcApplied = 0;
      for (let off = 0; off < 1000; off += factBatch) {
        try {
          const fc = await factCheckFn({ data: { limit: factBatch, offset: off, rerunQA: true } });
          if (fc.scanned === 0) break;
          fcScanned += fc.scanned;
          fcFixed += fc.fixed;
          fcCorr += fc.totalCorrections;
          fcApplied += fc.totalApplied;
          setApProgress((p) => (p ? { ...p, current: fcScanned, total: Math.max(fcScanned, p.total), detail: `נסרקו ${fcScanned} • תוקנו ${fcFixed} • תיקונים ${fcApplied}/${fcCorr}` } : p));
          pushLog(`אימות באטץ': נסרקו ${fc.scanned}, תוקנו ${fc.fixed}`);
          qc.invalidateQueries({ queryKey: ["ai"] });
          if (fc.scanned < factBatch) break;
        } catch (e) {
          console.error("[autopilot] fact-check batch failed:", e);
          pushLog(`באטץ' אימות נכשל: ${(e as Error).message} — ממשיך`);
        }
      }
      pushLog(`אימות הסתיים: סרק ${fcScanned}, תיקן ${fcFixed}`);

      // Step 5: Post-publish QA + enrichment
      setApProgress((p) => ({ step: 5, label: "QA והעשרה", detail: "סורק מפורסמים", current: 0, total: published, log: p?.log ?? [] }));
      pushLog("שלב 5/5 התחיל");
      const qaBatch = 1;
      const qaTargets = await listPublishedQaTargetsFn({ data: { onlyUnchecked: false } });
      let qaScanned = 0, qaFixed = 0, qaEnriched = 0, qaPassed = 0, qaFailed = 0;
      for (let index = 0; index < qaTargets.length; index += qaBatch) {
        try {
          const batchTargets = qaTargets.slice(index, index + qaBatch);
          const qa = await runQaBatchWithRetry(
            batchTargets.map((item) => item.id),
            qaBatch,
            (attempt, message) => pushLog(`QA timeout על ${batchTargets[0]?.slug ?? "מאמר"}, ניסיון ${attempt + 1}/3 — ${message}`),
          );
          if (qa.scanned === 0) break;
          qaScanned += qa.scanned;
          qaFixed += qa.fixed;
          qaEnriched += qa.enriched;
          qaPassed += qa.passed;
          qaFailed += qa.failed;
          setApProgress((p) => (p ? { ...p, current: qaScanned, total: Math.max(qaScanned, p.total), detail: `נסרקו ${qaScanned} • תוקנו ${qaFixed} • הועשרו ${qaEnriched} • עברו ${qaPassed} / נכשלו ${qaFailed}` } : p));
          pushLog(`QA באטץ': ${qa.scanned} נסרקו, ${qa.fixed} תוקנו`);
          qc.invalidateQueries({ queryKey: ["ai"] });
          if (qa.scanned < qaBatch) break;
        } catch (e) {
          console.error("[autopilot] qa batch failed:", e);
          pushLog(`באטץ' QA נכשל: ${(e as Error).message} — ממשיך`);
        }
      }
      const qa = { scanned: qaScanned, fixed: qaFixed, enriched: qaEnriched, passed: qaPassed, failed: qaFailed };

      return { suggested, generated, passedQA, failedQA, published, factChecked: fcFixed, qa };
    },
    onSuccess: (r) => {
      if ("stoppedReason" in r) {
        toast.error(`האוטופיילוט נעצר: ${r.stoppedReason}`, { duration: 12000 });
        setApProgress(null);
        return;
      }
      toast.success(
        `🚀 אוטופיילוט הסתיים: ${r.suggested} נושאים → ${r.generated} מאמרים → ${r.published} פורסמו → ${r.factChecked} עובדות תוקנו → QA: סרק ${r.qa.scanned}, תיקן ${r.qa.fixed}, העשיר ${r.qa.enriched}`,
        { duration: 12000 },
      );
      qc.invalidateQueries({ queryKey: ["ai"] });
      onArticleCreated?.();
      setApProgress(null);
    },
    onError: (e) => {
      toast.error(`אוטופיילוט נכשל: ${(e as Error).message}`);
      setApProgress(null);
    },
  });

  const postQa = useMutation({
    mutationFn: async () => {
      const batch = 1;
      let scanned = 0, fixed = 0, enriched = 0, passed = 0, failed = 0;
      const targets = await listPublishedQaTargetsFn({ data: { onlyUnchecked: false } });
      const total = targets.length;
      setQaProgress({ current: 0, total, currentSlug: "מתחיל...", scanned: 0, passed: 0, failed: 0, fixed: 0, log: [] });
      for (let index = 0; index < targets.length; index += batch) {
        try {
          const batchTargets = targets.slice(index, index + batch);
          const currentTarget = batchTargets[0];
          setQaProgress((p) => p ? { ...p, currentSlug: currentTarget ? `${currentTarget.slug} (${index + 1}${total ? ` מתוך ${total}` : ""})` : `סורק מאמר ${index + 1}${total ? ` מתוך ${total}` : ""}...` } : p);
          const r = await runQaBatchWithRetry(
            batchTargets.map((item) => item.id),
            batch,
            (attempt, message) => {
              const retryLine = `${new Date().toLocaleTimeString("he-IL")} — ⏳ timeout על ${currentTarget?.slug ?? "מאמר"}, ניסיון ${attempt + 1}/3`;
              setQaProgress((p) => p ? { ...p, log: [...p.log.slice(-50), retryLine, `${new Date().toLocaleTimeString("he-IL")} — ${message}`] } : p);
            },
          );
          if (r.scanned === 0) break;
          scanned += r.scanned;
          fixed += r.fixed;
          enriched += r.enriched;
          passed += r.passed;
          failed += r.failed;
          const last = r.results[r.results.length - 1] as QaBatchResult | undefined;
          const lastSlug = last?.slug ?? "—";
          const lastStatus = last?.passed ? "✅ עבר" : "⚠️ נכשל";
          const repairPassesUsed = last && "repairPassesUsed" in last ? last.repairPassesUsed : 0;
          const lastFixed = last?.fixed ? ` (תוקן${repairPassesUsed ? ` ב-${repairPassesUsed} סבבים` : ""})` : "";
          const lastError = !last?.passed && last?.error ? ` — ${last.error}` : "";
          const logLine = `${new Date().toLocaleTimeString("he-IL")} — ${lastSlug} ${lastStatus}${lastFixed}${lastError}`;
          setQaProgress((p) => p ? {
            ...p,
            current: scanned,
            currentSlug: `${lastSlug} ${lastStatus}${lastFixed}${lastError}`,
            scanned, passed, failed, fixed,
            log: [...p.log.slice(-50), logLine],
          } : p);
          qc.invalidateQueries({ queryKey: ["ai"] });
          if (r.scanned < batch) break;
        } catch (e) {
          console.error("[postQa] batch failed:", e);
          const errLine = `${new Date().toLocaleTimeString("he-IL")} — ❌ ${(e as Error).message}`;
          setQaProgress((p) => p ? { ...p, log: [...p.log.slice(-50), errLine] } : p);
        }
      }
      return { scanned, fixed, enriched, passed, failed };
    },
    onSuccess: (r) => {
      toast.success(
        `בוט QA: סרק ${r.scanned}, תיקן ${r.fixed}, העשיר ${r.enriched}, עברו ${r.passed}, נכשלו ${r.failed}`,
        { duration: 8000 },
      );
      qc.invalidateQueries({ queryKey: ["ai"] });
      setTimeout(() => setQaProgress(null), 10000);
    },
    onError: (e) => {
      toast.error(`בוט QA נכשל: ${(e as Error).message}`);
      setQaProgress(null);
    },
  });

  const publishAll = useMutation({
    mutationFn: () => publishAllFn(),
    onSuccess: (r) => {
      toast.success(`פורסמו ${r.published} מאמרים`);
      qc.invalidateQueries({ queryKey: ["ai"] });
    },
    onError: (e) => toast.error(`פרסום נכשל: ${(e as Error).message}`),
  });

  const generateAll = useMutation({
    mutationFn: async () => {
      let generated = 0;
      let passed = 0;
      let failed = 0;
      // Loop one-at-a-time to avoid serverless timeouts
      // Safety cap to prevent infinite loop
      for (let i = 0; i < 200; i++) {
        const r = await generateNextFn();
        if (!r.processed) break;
        generated++;
        if (r.processed.passed) passed++;
        else failed++;
        toast.message(`נכתב: ${r.processed.slug} ${r.processed.passed ? "✅" : "⚠️"} — נותרו ${r.remaining}`);
        qc.invalidateQueries({ queryKey: ["ai"] });
        if (r.done) break;
      }
      return { generated, passed, failed };
    },
    onSuccess: (r) => {
      toast.success(`הסתיים: נוצרו ${r.generated} מאמרים — ${r.passed} עברו QA, ${r.failed} נכשלו`, { duration: 8000 });
      qc.invalidateQueries({ queryKey: ["ai"] });
      onArticleCreated?.();
    },
    onError: (e) => toast.error(`יצירה נכשלה: ${(e as Error).message}`),
  });

  const deleteTopicM = useMutation({
    mutationFn: (id: string) => deleteTopicFn({ data: { id } }),
    onSuccess: () => {
      toast.success("הנושא נמחק");
      qc.invalidateQueries({ queryKey: ["ai", "topics"] });
    },
    onError: (e) => toast.error(`מחיקה נכשלה: ${(e as Error).message}`),
  });

  const factCheck = useMutation({
    mutationFn: () => factCheckFn({ data: { limit: 20, rerunQA: true } }),
    onSuccess: (r) => {
      const lines: string[] = [];
      for (const a of r.results) {
        if (a.proposed === 0) continue;
        lines.push(`\n📄 ${a.slug} — תוקנו ${a.applied}/${a.proposed}:`);
        for (const c of a.corrections.slice(0, 5)) {
          const mark = c.applied ? "✅" : "⚠️";
          lines.push(`  ${mark} "${c.original.slice(0, 60)}" → "${c.corrected.slice(0, 60)}"`);
          lines.push(`     מה היה לא בסדר: ${c.whatWasWrong} (מקור: ${c.source})`);
        }
      }
      const summary = `אימות עובדות: סרק ${r.scanned}, תיקן ${r.fixed} מאמרים, ${r.totalApplied}/${r.totalCorrections} תיקונים יושמו`;
      console.log(summary + lines.join("\n"));
      toast.success(summary + (r.totalCorrections > 0 ? " — פירוט מלא בקונסול" : " — לא נמצאו עובדות שגויות"), { duration: 10000 });
      qc.invalidateQueries({ queryKey: ["ai"] });
    },
    onError: (e) => toast.error(`אימות עובדות נכשל: ${(e as Error).message}`),
  });

  return (
    <div>
      {/* ===== AUTOPILOT — top, prominent ===== */}
      <div className="mb-6 border-2 border-[#8b3a52] bg-gradient-to-br from-[#1a0a06] to-[#fefaf6] p-6 shadow-[0_0_40px_rgba(230,48,0,0.15)]">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8b3a52]">
            🚀 [ AUTOPILOT — הפעלה אחת, כל התהליך ]
          </div>
        </div>
        <p className="mb-3 text-base font-bold leading-relaxed text-[#2a1f1a]">
          לחיצה אחת מריצה את כל השלבים אוטומטית, אחד אחרי השני:
        </p>
        <ol className="mb-4 grid grid-cols-1 gap-2 text-sm text-[#3a2f28] md:grid-cols-5">
          <li className="border border-[#c9b8a3] bg-[#fefaf6] px-3 py-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#8b3a52]">שלב 1</div>
            <div className="font-bold text-[#2a1f1a]">💡 הצעת נושאים</div>
            <div className="text-xs text-[#5a4f48]">AI מציע נושאים חדשים</div>
          </li>
          <li className="border border-[#c9b8a3] bg-[#fefaf6] px-3 py-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#8b3a52]">שלב 2</div>
            <div className="font-bold text-[#2a1f1a]">✍️ כתיבת מאמרים</div>
            <div className="text-xs text-[#5a4f48]">כל נושא בתור הופך למאמר מלא</div>
          </li>
          <li className="border border-[#c9b8a3] bg-[#fefaf6] px-3 py-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#8b3a52]">שלב 3</div>
            <div className="font-bold text-[#2a1f1a]">📢 פרסום</div>
            <div className="text-xs text-[#5a4f48]">כל המאמרים מתפרסמים מיד</div>
          </li>
          <li className="border border-[#c9b8a3] bg-[#fefaf6] px-3 py-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#8b3a52]">שלב 4</div>
            <div className="font-bold text-[#2a1f1a]">🔬 אימות עובדות</div>
            <div className="text-xs text-[#5a4f48]">בדיקה מול מקורות סמכותיים</div>
          </li>
          <li className="border border-[#c9b8a3] bg-[#fefaf6] px-3 py-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-[#8b3a52]">שלב 5</div>
            <div className="font-bold text-[#2a1f1a]">🔍 QA והעשרה</div>
            <div className="text-xs text-[#5a4f48]">תיקונים, תמונות, וידאו, FAQ</div>
          </li>
        </ol>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#3a2f28]">
          <label className="flex items-center gap-2">
            הצע
            <input
              type="number"
              min={0}
              max={20}
              value={bulkSuggest}
              onChange={(e) => setBulkSuggest(Number(e.target.value))}
              className="w-16 border border-[#c9b8a3] bg-[#fefaf6] px-2 py-1 text-center font-bold text-[#2a1f1a]"
            />
            נושאים חדשים
          </label>
          <span className="text-[#7a6e65]">→ ואז יכתוב את <strong className="text-[#2a1f1a]">כל</strong> הנושאים בתור</span>
        </div>
        <button
          onClick={() => {
            const inQueue = q.data?.filter((t) => t.status === "pending" || t.status === "approved").length ?? 0;
            const total = bulkSuggest + inQueue;
            if (!confirm(`להפעיל אוטופיילוט?\n\n• יציע ${bulkSuggest} נושאים חדשים\n• יכתוב ~${total} מאמרים\n• יפרסם הכל\n• יאמת עובדות\n• ירוץ QA והעשרה\n\nהתהליך עלול לקחת ${total * 2}-${total * 4} דקות. אל תסגור את הדף.`)) return;
            autopilot.mutate();
          }}
          disabled={autopilot.isPending}
          className="w-full bg-[#8b3a52] px-8 py-4 text-base font-black uppercase tracking-widest text-[#fefaf6] hover:bg-[#ff3a00] disabled:opacity-60"
        >
          {autopilot.isPending ? "⏳ מריץ אוטופיילוט... אל תסגור את הדף" : "🚀 הפעל אוטופיילוט מלא"}
        </button>
        {apProgress && (
          <div className="mt-4 border border-[#8b3a52] bg-[#fefaf6] p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
                שלב {apProgress.step}/5 — {apProgress.label}
              </div>
              <div className="text-xs font-bold text-[#2a1f1a]">
                {apProgress.current}{apProgress.total > 0 ? ` / ${apProgress.total}` : ""}
              </div>
            </div>
            <div className="mb-2 h-2 w-full overflow-hidden bg-[#d6c5ac]">
              <div
                className="h-full bg-[#8b3a52] transition-all duration-300"
                style={{
                  width: `${apProgress.total > 0 ? Math.min(100, Math.round((apProgress.current / apProgress.total) * 100)) : ((apProgress.step - 1) / 5) * 100}%`,
                }}
              />
            </div>
            <div className="mb-2 grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1 ${s < apProgress.step ? "bg-[#8b3a52]" : s === apProgress.step ? "bg-[#ff3a00]" : "bg-[#d6c5ac]"}`}
                />
              ))}
            </div>
            <div className="text-xs text-[#3a2f28]">{apProgress.detail}</div>
            {apProgress.log.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-[#5a4f48] hover:text-[#2a1f1a]">
                  יומן ריצה ({apProgress.log.length})
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto border border-[#d6c5ac] bg-[#000] p-2 font-mono text-[10px] text-[#5a4f48]">
                  {apProgress.log.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* ===== Manual controls — separate, secondary ===== */}
      <div className="mb-4 border border-[#d6c5ac] bg-[#fefaf6] p-4">
        <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#5a4f48]">
          [ שליטה ידנית — שלב בודד ]
        </div>
        <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            const count = q.data?.filter((t) => t.status === "pending" || t.status === "approved").length ?? 0;
            if (!confirm(`לכתוב מאמר מכל הנושאים בתור? (${count} נושאים)`)) return;
            generateAll.mutate();
          }}
          disabled={generateAll.isPending}
          className="bg-[#4a6fff] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#fefaf6] hover:bg-[#6a8fff] disabled:opacity-60"
        >
          {generateAll.isPending ? "כותב..." : "✍️ כתוב את כל הנושאים"}
        </button>
        <button
          onClick={() => {
            if (!confirm("לפרסם מיד את כל המאמרים שעברו QA או מתוזמנים?")) return;
            publishAll.mutate();
          }}
          disabled={publishAll.isPending}
          className="bg-[#0a8a3a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#fefaf6] hover:bg-[#0aa84a] disabled:opacity-60"
        >
          {publishAll.isPending ? "מפרסם..." : "📢 פרסם הכל מיד"}
        </button>
        <button
          onClick={() => {
            if (!confirm("לאמת עובדות במאמרים שפורסמו מול מקורות סמכותיים?")) return;
            factCheck.mutate();
          }}
          disabled={factCheck.isPending}
          className="bg-[#c98a00] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#fefaf6] hover:bg-[#e6a000] disabled:opacity-60"
        >
          {factCheck.isPending ? "מאמת..." : "🔬 אימות עובדות"}
        </button>
        <button
          onClick={() => {
            if (!confirm("להריץ בוט QA על המאמרים שפורסמו? יסרוק ויתקן אוטומטית.")) return;
            postQa.mutate();
          }}
          disabled={postQa.isPending}
          className="border border-[#8b3a52] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-wider text-[#8b3a52] hover:bg-[#8b3a52] hover:text-[#fefaf6] disabled:opacity-60"
        >
          {postQa.isPending ? "מריץ QA..." : "🔍 QA על מפורסמים"}
        </button>
        </div>
        {qaProgress && (
          <div className="mt-4 border border-[#8b3a52] bg-[#150505] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
                [ QA על מפורסמים — בתהליך ]
              </div>
              <div className="text-xs font-bold text-[#3a2f28]">
                {qaProgress.current}{qaProgress.total > 0 ? ` / ${qaProgress.total}` : ""}
              </div>
            </div>
            <div className="mb-2 h-2 w-full bg-[#d6c5ac]">
              <div
                className="h-full bg-[#8b3a52] transition-all"
                style={{ width: `${qaProgress.total > 0 ? Math.min(100, Math.round((qaProgress.current / qaProgress.total) * 100)) : 0}%` }}
              />
            </div>
            <div className="mb-2 truncate text-xs text-[#ffaa88]">
              ▶ {qaProgress.currentSlug}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#3a2f28]">
              <span>נסרקו: <b className="text-[#fff]">{qaProgress.scanned}</b></span>
              <span>עברו: <b className="text-[#0aa84a]">{qaProgress.passed}</b></span>
              <span>נכשלו: <b className="text-[#8b3a52]">{qaProgress.failed}</b></span>
              <span>תוקנו: <b className="text-[#c98a00]">{qaProgress.fixed}</b></span>
            </div>
            {qaProgress.log.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#888]">
                  יומן ({qaProgress.log.length})
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto bg-[#fefaf6] p-2 font-mono text-[10px] text-[#aaa]">
                  {qaProgress.log.slice().reverse().map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-[#3a2f28]">
          {q.data?.length ?? 0} נושאים בתור
        </p>
        <button
          onClick={() => suggest.mutate()}
          disabled={suggest.isPending}
          className="bg-[#8b3a52] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#fefaf6] hover:bg-[#ff3a00] disabled:opacity-60"
        >
          {suggest.isPending ? "מציע..." : "הצע 5 נושאים חדשים"}
        </button>
      </div>
      <div className="overflow-x-auto border border-[#d6c5ac]">
        <table className="w-full text-right">
          <thead className="bg-[#f5ede4] text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">
            <tr>
              <th className="px-3 py-2">כותרת</th>
              <th className="px-3 py-2">קטגוריה</th>
              <th className="px-3 py-2">ניקוד</th>
              <th className="px-3 py-2">סטטוס</th>
              <th className="px-3 py-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((t) => (
              <tr key={t.id} className="border-t border-[#d6c5ac] text-sm text-[#3a2f28]">
                <td className="px-3 py-2">{t.title}</td>
                <td className="px-3 py-2 text-[#6b5f55]">{t.category_slug}</td>
                <td className="px-3 py-2 text-[#6b5f55]">{t.score}</td>
                <td className="px-3 py-2 text-[#6b5f55]">{t.status}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {t.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus.mutate({ id: t.id, status: "approved" })
                          }
                          className="border border-[#0a8a3a] px-2 py-1 text-[10px] font-bold uppercase text-[#0a8a3a]"
                        >
                          אשר
                        </button>
                        <button
                          onClick={() =>
                            updateStatus.mutate({ id: t.id, status: "rejected" })
                          }
                          className="border border-[#444] px-2 py-1 text-[10px] font-bold uppercase text-[#5a4f48]"
                        >
                          דחה
                        </button>
                        <button
                          onClick={() => {
                            if (!confirm("למחוק את הנושא?")) return;
                            deleteTopicM.mutate(t.id);
                          }}
                          className="border border-[#7a1a1a] px-2 py-1 text-[10px] font-bold uppercase text-[#8b3a52]"
                        >
                          מחק
                        </button>
                      </>
                    )}
                    {(t.status === "approved" || t.status === "pending") && (
                      <button
                        onClick={() => generate.mutate(t.id)}
                        disabled={generate.isPending}
                        className="bg-[#8b3a52] px-2 py-1 text-[10px] font-bold uppercase text-[#fefaf6] disabled:opacity-60"
                      >
                        {generate.isPending ? "מייצר..." : "צור מאמר"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type FactCheckCorrection = {
  original: string;
  corrected: string;
  whatWasWrong: string;
  source: string;
  confidence?: "high" | "medium";
  applied?: boolean;
};
type FactCheckReport = {
  checked_at?: string;
  model?: string;
  claims_reviewed?: number;
  corrections_proposed?: number;
  corrections_applied?: number;
  corrections?: FactCheckCorrection[];
};
type QaIssueItem = {
  severity: "error" | "warn";
  category: string;
  message: string;
};
type QaReport = {
  passed: boolean;
  issues: QaIssueItem[];
};
type QaBatchResult = {
  slug: string;
  passed: boolean;
  fixed: boolean;
  enriched: boolean;
  images: number;
  videos: number;
  faqs: number;
  links: number;
  issues: number;
  repairs: number;
  repairPassesUsed: number;
  error?: string;
};
type DetailModal =
  | { kind: "fact"; title: string; report: FactCheckReport }
  | { kind: "qa"; title: string; report: QaReport; attempts: number }
  | null;

function DetailDialog({
  detail,
  onClose,
}: {
  detail: NonNullable<DetailModal>;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto border-2 border-[#8b3a52] bg-[#fefaf6] p-6"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#d6c5ac] pb-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
              {detail.kind === "fact" ? "[ אימות עובדות — פירוט מלא ]" : "[ דוח QA — פירוט מלא ]"}
            </div>
            <h3 className="mt-1 text-lg font-black text-[#2a1f1a]">{detail.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="border border-[#444] px-3 py-1 text-xs font-black uppercase text-[#3a2f28] hover:border-[#8b3a52] hover:text-[#8b3a52]"
            aria-label="סגור"
          >
            סגור ✕
          </button>
        </div>

        {detail.kind === "fact" ? (
          <FactDetail report={detail.report} />
        ) : (
          <QaDetail report={detail.report} attempts={detail.attempts} />
        )}
      </div>
    </div>
  );
}

function FactDetail({ report }: { report: FactCheckReport }) {
  const corrections = report.corrections ?? [];
  return (
    <div className="space-y-4 text-sm text-[#3a2f28]">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="טענות שנבדקו" value={report.claims_reviewed ?? 0} />
        <Stat label="תיקונים שהוצעו" value={report.corrections_proposed ?? 0} />
        <Stat label="תיקונים שיושמו" value={report.corrections_applied ?? 0} />
      </div>
      {report.checked_at && (
        <p className="text-xs text-[#5a4f48]">
          נבדק: {new Date(report.checked_at).toLocaleString("he-IL")}
          {report.model ? ` · מודל: ${report.model}` : ""}
        </p>
      )}
      {corrections.length === 0 ? (
        <div className="border border-[#0a8a3a] bg-[#08220f] p-4 text-sm font-bold text-[#a0e8b0]">
          ✓ לא נמצאו עובדות שגויות — כל הטענות אומתו מול מקורות סמכותיים.
        </div>
      ) : (
        <ul className="space-y-3">
          {corrections.map((c, i) => (
            <li
              key={i}
              className={`border-r-4 p-3 ${
                c.applied
                  ? "border-r-[#0a8a3a] bg-[#0a1a10]"
                  : "border-r-[#c98a00] bg-[#1a1408]"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                    c.applied ? "bg-[#0a8a3a] text-[#fefaf6]" : "bg-[#c98a00] text-[#fefaf6]"
                  }`}
                >
                  {c.applied ? "✓ תוקן" : "⚠️ הוצע ולא יושם"}
                </span>
                {c.confidence && (
                  <span className="text-[10px] text-[#5a4f48]">ביטחון: {c.confidence}</span>
                )}
              </div>
              <div className="space-y-1.5 text-xs leading-relaxed">
                <div>
                  <span className="font-black text-[#8b3a52]">לפני: </span>
                  <span className="text-[#f0a0a0] line-through">{c.original}</span>
                </div>
                <div>
                  <span className="font-black text-[#0a8a3a]">אחרי: </span>
                  <span className="text-[#a0e8b0]">{c.corrected}</span>
                </div>
                <div className="border-t border-[#d6c5ac] pt-1.5">
                  <span className="font-black text-[#3a2f28]">מה היה לא בסדר: </span>
                  <span className="text-[#5a4f48]">{c.whatWasWrong}</span>
                </div>
                <div>
                  <span className="font-black text-[#3a2f28]">מקור: </span>
                  <span className="text-[#5a4f48]" dir="ltr">{c.source}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QaDetail({ report, attempts }: { report: QaReport; attempts: number }) {
  const issues = report.issues ?? [];
  const errors = issues.filter((i) => i.severity === "error");
  const warns = issues.filter((i) => i.severity === "warn");
  return (
    <div className="space-y-4 text-sm text-[#3a2f28]">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="ניסיונות QA" value={attempts} />
        <Stat label="שגיאות" value={errors.length} />
        <Stat label="אזהרות" value={warns.length} />
      </div>
      <div
        className={`border p-3 text-sm font-bold ${
          report.passed ? "border-[#0a8a3a] bg-[#08220f] text-[#a0e8b0]" : "border-[#7a1a1a] bg-[#220a0a] text-[#f0a0a0]"
        }`}
      >
        {report.passed ? "✓ המאמר עבר את כל בדיקות ה-QA" : "✗ המאמר לא עבר את כל בדיקות ה-QA"}
      </div>
      {issues.length === 0 ? (
        <p className="text-xs text-[#5a4f48]">לא נמצאו בעיות.</p>
      ) : (
        <ul className="space-y-2">
          {issues.map((it, i) => (
            <li
              key={i}
              className={`border-r-4 p-3 ${
                it.severity === "error"
                  ? "border-r-[#8b3a52] bg-[#1a0806]"
                  : "border-r-[#c98a00] bg-[#1a1408]"
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                    it.severity === "error"
                      ? "bg-[#8b3a52] text-[#fefaf6]"
                      : "bg-[#c98a00] text-[#fefaf6]"
                  }`}
                >
                  {it.severity === "error" ? "שגיאה" : "אזהרה"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#5a4f48]">
                  {it.category}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#3a2f28]">{it.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[#d6c5ac] bg-[#f5ede4] p-3 text-center">
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#5a4f48]">{label}</div>
      <div className="mt-1 text-2xl font-black text-[#2a1f1a]">{value}</div>
    </div>
  );
}

function ArticlesTab() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const listFn = useServerFn(listAdminArticles);
  const requeueFn = useServerFn(requeueQA);
  const publishFn = useServerFn(publishNow);
  const archiveFn = useServerFn(archiveArticle);
  const q = useQuery({ queryKey: ["ai", "articles"], queryFn: () => listFn() });

  const [detail, setDetail] = useState<DetailModal>(null);

  const requeue = useMutation({
    mutationFn: (id: string) => requeueFn({ data: { articleId: id } }),
    onSuccess: (r) => {
      const blockingMessage = !r.passed ? r.issues.find((issue) => issue.severity === "error")?.message : null;
      toast[r.passed ? "success" : "error"](
        r.passed
          ? r.repaired
            ? `QA עבר אחרי תיקון אוטומטי (${r.issues.length} בעיות נסגרו)`
            : "QA עבר"
          : r.repaired
            ? `בוצע תיקון אוטומטי, אבל עדיין נשארו ${r.issues.length} בעיות`
            : `QA נכשל: ${blockingMessage ?? `${r.issues.length} בעיות`}`,
      );
      qc.invalidateQueries({ queryKey: ["ai", "articles"] });
    },
  });
  const pub = useMutation({
    mutationFn: (id: string) => publishFn({ data: { articleId: id } }),
    onSuccess: () => {
      toast.success("פורסם");
      qc.invalidateQueries({ queryKey: ["ai", "articles"] });
    },
  });
  const arch = useMutation({
    mutationFn: (id: string) => archiveFn({ data: { articleId: id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai", "articles"] }),
  });

  const openArticle = (slug: string, status: string) => {
    if (status === "published") {
      navigate({ to: "/article/$slug", params: { slug } });
      return;
    }

    navigate({ to: "/admin/preview/$slug", params: { slug } });
  };

  return (
    <div className="overflow-x-auto border border-[#d6c5ac]">
      <table className="w-full text-right">
        <thead className="bg-[#f5ede4] text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">
          <tr>
            <th className="px-3 py-2">כותרת</th>
            <th className="px-3 py-2">slug</th>
            <th className="px-3 py-2">סטטוס</th>
            <th className="px-3 py-2">QA</th>
            <th className="px-3 py-2">אימות עובדות</th>
            <th className="px-3 py-2">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {(q.data ?? []).map((a) => {
            const fc = a.fact_check_report as FactCheckReport | null;
            const fcAt = a.fact_checked_at ? new Date(a.fact_checked_at) : null;
            const fcDate = fcAt
              ? fcAt.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
              : null;
            const qaReport = a.qa_report as QaReport | null;
            const qaIssues = qaReport?.issues ?? [];
            const qaErrors = qaIssues.filter((i) => i.severity === "error").length;
            const qaWarns = qaIssues.filter((i) => i.severity === "warn").length;
            return (
            <tr key={a.id} className="border-t border-[#d6c5ac] text-sm text-[#3a2f28]">
              <td className="px-3 py-2">{a.title}</td>
              <td className="px-3 py-2 text-[#6b5f55]" dir="ltr">
                {a.slug}
              </td>
              <td className="px-3 py-2 text-[#6b5f55]">{a.status}</td>
              <td className="px-3 py-2">
                {qaReport ? (
                  <button
                    type="button"
                    onClick={() => setDetail({ kind: "qa", title: a.title, report: qaReport, attempts: a.qa_attempts })}
                    className="flex flex-col items-start gap-0.5 text-right text-[10px]"
                    title="לחצי לפירוט QA"
                  >
                    <span
                      className={`inline-block px-1.5 py-0.5 font-black uppercase ${
                        qaReport.passed
                          ? "bg-[#0a8a3a] text-[#fefaf6]"
                          : "bg-[#7a1a1a] text-[#2a1f1a]"
                      }`}
                    >
                      {qaReport.passed ? `✓ עבר QA` : `✗ QA נכשל`}
                    </span>
                    <span className="text-[9px] text-[#5a4f48]">
                      {a.qa_attempts} ניסיונות · {qaErrors} שגיאות · {qaWarns} אזהרות
                    </span>
                  </button>
                ) : (
                  <span className="text-[10px] text-[#7a6e65]">— {a.qa_attempts} ניסיונות</span>
                )}
              </td>
              <td className="px-3 py-2">
                {fc && fcDate ? (
                  <button
                    type="button"
                    onClick={() => setDetail({ kind: "fact", title: a.title, report: fc })}
                    className="flex flex-col items-start gap-0.5 text-right text-[10px]"
                    title="לחצי לפירוט אימות העובדות"
                  >
                    <span
                      className={`inline-block w-fit px-1.5 py-0.5 font-black uppercase ${
                        (fc.corrections_applied ?? 0) > 0
                          ? "bg-[#c98a00] text-[#fefaf6]"
                          : "bg-[#0a8a3a] text-[#fefaf6]"
                      }`}
                    >
                      {(fc.corrections_applied ?? 0) > 0
                        ? `✓ תוקנו ${fc.corrections_applied}`
                        : "✓ אומת"}
                    </span>
                    <span className="text-[9px] text-[#7a6e65]">{fcDate}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-[#7a6e65]">— לא אומת</span>
                )}
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => requeue.mutate(a.id)}
                    disabled={requeue.isPending}
                    className="border border-[#444] px-2 py-1 text-[10px] font-bold uppercase text-[#3a2f28]"
                  >
                    {requeue.isPending ? "מריץ QA..." : "QA חוזר"}
                  </button>
                  {a.status !== "published" && a.status !== "archived" && (
                    <button
                      onClick={() => pub.mutate(a.id)}
                      className="bg-[#0a8a3a] px-2 py-1 text-[10px] font-bold uppercase text-[#fefaf6]"
                    >
                      פרסם
                    </button>
                  )}
                  <button
                    onClick={() => openArticle(a.slug, a.status)}
                    className="border border-[#444] px-2 py-1 text-[10px] font-bold uppercase text-[#3a2f28]"
                  >
                    {a.status === "published" ? "תצוגה" : "תצוגה מקדימה"}
                  </button>
                  <button
                    onClick={() => arch.mutate(a.id)}
                    className="border border-[#444] px-2 py-1 text-[10px] font-bold uppercase text-[#5a4f48]"
                  >
                    ארכב
                  </button>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
      {detail && <DetailDialog detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function SettingsTab() {
  return <SettingsTabImpl />;
}

function IndexationTab() {
  const qc = useQueryClient();
  const statusFn = useServerFn(getIndexationStatus);
  const submitFn = useServerFn(submitForIndexing);
  const inspectFn = useServerFn(inspectArticleUrl);
  const q = useQuery({
    queryKey: ["gsc", "indexation"],
    queryFn: () => statusFn(),
    refetchOnWindowFocus: false,
  });
  const [filter, setFilter] = useState<"all" | "indexed" | "missing">("missing");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [inspecting, setInspecting] = useState<string | null>(null);
  const [inspectResults, setInspectResults] = useState<Record<string, { verdict: string; coverageState: string; lastCrawlTime?: string; indexingState?: string; pageFetchState?: string; robotsTxtState?: string; googleCanonical?: string; inspectionLink: string }>>({});
  const [submitResult, setSubmitResult] = useState<Awaited<ReturnType<typeof submitFn>> | null>(null);

  const submitOne = async (url: string) => {
    setSubmitting(url);
    try {
      const r = await submitFn({ data: { urls: [url] } });
      setSubmitResult(r);
      toast.success("הגשה הושלמה — ראה פרטים");
    } catch (e) {
      toast.error(`שגיאה: ${(e as Error).message}`);
    } finally {
      setSubmitting(null);
    }
  };

  const submitAllMissing = async () => {
    const missing = (q.data?.rows ?? []).filter((r) => !r.indexed).map((r) => r.url);
    if (!missing.length) {
      toast.info("אין URLs לא מאונדקסים");
      return;
    }
    if (!confirm(`להגיש ${missing.length} URLs לאינדוקס?`)) return;
    try {
      const r = await submitFn({ data: { urls: missing.slice(0, 100) } });
      setSubmitResult(r);
      toast.success(`הוגשו ${r.submitted} — ראה פרטים`);
    } catch (e) {
      toast.error(`שגיאה: ${(e as Error).message}`);
    }
  };

  const inspectOne = async (url: string) => {
    setInspecting(url);
    try {
      const r = await inspectFn({ data: { url } });
      setInspectResults((prev) => ({
        ...prev,
        [url]: {
          verdict: r.verdict,
          coverageState: r.coverageState,
          lastCrawlTime: r.lastCrawlTime,
          indexingState: r.indexingState,
          pageFetchState: r.pageFetchState,
          robotsTxtState: r.robotsTxtState,
          googleCanonical: r.googleCanonical,
          inspectionLink: r.inspectionLink,
        },
      }));
      const ok = r.verdict === "PASS";
      toast[ok ? "success" : "info"](`${r.verdict} · ${r.coverageState}`);
    } catch (e) {
      toast.error(`URL Inspection נכשל: ${(e as Error).message}`);
    } finally {
      setInspecting(null);
    }
  };

  const rows = (q.data?.rows ?? []).filter((r) => {
    if (filter === "indexed") return r.indexed;
    if (filter === "missing") return !r.indexed;
    return true;
  });
  const indexedCount = (q.data?.rows ?? []).filter((r) => r.indexed).length;
  const totalCount = q.data?.rows.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="border border-[#d6c5ac] bg-[#faf3eb] p-4 text-xs text-[#5a4f48]">
        <p>
          טבלה זו מציגה <b className="text-[#3a2f28]">פרוקסי</b> לאינדוקס: עמוד עם impressions בתוצאות חיפוש (90 ימים אחרונים) נחשב מאונדקס.
          זה לא מדויק — עמוד יכול להיות מאונדקס בלי שאף אחד חיפש אותו. כדי לקבל את הסטטוס <b className="text-[#3a2f28]">האמיתי</b> של Google ללא ספק, לחצי
          <b className="text-[#3a2f28]"> "בדוק במציאות"</b> בשורה הרלוונטית — זה קורא ל-URL Inspection API הרשמי.
        </p>
        <p className="mt-2 text-[10px] text-[#7a6e65]">
          הערה: Google אינו חושף Indexing API להגשה ישירה (רק Job Postings/Livestream). "הגש לאינדוקס" מבצע: (1) ping ל-IndexNow → מודיע ל-Bing/Yandex מיידית. (2) PUT ל-sitemap ב-Search Console → מאיץ את Googlebot.
        </p>
        {q.data?.error && (
          <p className="mt-2 border-r-2 border-[#7a1a1a] bg-[#1a0a0a] px-2 py-1 text-[10px] text-[#f0a0a0]">
            שגיאת GSC: {q.data.error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="text-xs text-[#3a2f28]">
          {q.isLoading ? "טוען..." : (
            <>
              <b className="text-[#0a8a3a]">{indexedCount}</b> מאונדקסים ·{" "}
              <b className="text-[#8b3a52]">{totalCount - indexedCount}</b> חסרים ·{" "}
              סה"כ <b>{totalCount}</b>
            </>
          )}
        </div>
        <div className="flex gap-1">
          {(["missing", "indexed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider ${
                filter === f
                  ? "bg-[#8b3a52] text-[#fefaf6]"
                  : "border border-[#c9b8a3] text-[#5a4f48]"
              }`}
            >
              {f === "missing" ? "חסרים" : f === "indexed" ? "מאונדקסים" : "הכל"}
            </button>
          ))}
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["gsc", "indexation"] })}
          className="border border-[#c9b8a3] px-2 py-1 text-[10px] font-bold uppercase text-[#3a2f28]"
        >
          🔄 רענן
        </button>
        <button
          onClick={submitAllMissing}
          className="bg-[#8b3a52] px-3 py-1 text-[10px] font-black uppercase text-[#fefaf6]"
        >
          הגש את כל החסרים לאינדוקס
        </button>
        <a
          href="https://search.google.com/search-console?resource_id=https%3A%2F%2Flazyrider.org%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#c9b8a3] px-2 py-1 text-[10px] font-bold uppercase text-[#3a2f28] hover:bg-[#ede2d4]"
        >
          🔗 פתח Search Console
        </a>
      </div>

      {submitResult && (
        <div className="border border-[#8b3a52] bg-[#faf3eb] p-4 text-xs text-[#3a2f28]">
          <div className="mb-2 flex items-center justify-between">
            <b className="text-[#8b3a52]">תוצאת הגשה</b>
            <button
              onClick={() => setSubmitResult(null)}
              className="text-[10px] text-[#7a6e65] hover:text-[#3a2f28]"
            >
              סגור ✕
            </button>
          </div>
          <ul className="space-y-1 text-[11px]">
            <li>
              URLs שהוגשו: <b>{submitResult.submitted}</b>
            </li>
            <li>
              IndexNow (Bing/Yandex):{" "}
              <b className={submitResult.indexNow.ok ? "text-[#0a8a3a]" : "text-[#8b3a52]"}>
                {submitResult.indexNow.ok ? "✓ הצליח" : "✗ נכשל"}
              </b>{" "}
              <span className="text-[#7a6e65]">HTTP {submitResult.indexNow.status}</span>
              {submitResult.indexNowError && (
                <span className="text-[#f0a0a0]"> — {submitResult.indexNowError}</span>
              )}
            </li>
            <li>
              Sitemap resubmit ל-Google:{" "}
              <b className={submitResult.sitemapResubmitted ? "text-[#0a8a3a]" : "text-[#8b3a52]"}>
                {submitResult.sitemapResubmitted ? "✓ הצליח" : "✗ נכשל"}
              </b>
              {submitResult.sitemapError && (
                <span className="text-[#f0a0a0]"> — {submitResult.sitemapError}</span>
              )}
              {" · "}
              <a
                href={submitResult.sitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6b5f55] underline"
              >
                צפה ב-sitemap
              </a>
            </li>
            <li className="text-[10px] text-[#7a6e65]">
              IndexNow key: <a href={submitResult.indexNowKeyLocation} target="_blank" rel="noopener noreferrer" className="underline">{submitResult.indexNowKeyLocation}</a>
            </li>
            <li className="text-[10px] text-[#7a6e65]">
              זמן: {submitResult.startedAt} → {submitResult.finishedAt}
            </li>
          </ul>
          {submitResult.inspectionLinks.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-[11px] font-bold text-[#3a2f28]">
                לינקים ישירים ל-Search Console ({submitResult.inspectionLinks.length})
              </summary>
              <ul className="mt-2 space-y-1 text-[10px]" dir="ltr">
                {submitResult.inspectionLinks.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7aa7e8] underline"
                    >
                      {l.url}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
          <p className="mt-3 text-[10px] text-[#7a6e65]">
            הערה: Googlebot עשוי לקחת מ-כמה דקות עד מספר ימים להגיע ולאנדקס בפועל. לחצי "בדוק במציאות" בשורה אחרי שעה-כמה ימים כדי לראות את הסטטוס הרשמי.
          </p>
        </div>
      )}

      <div className="overflow-x-auto border border-[#d6c5ac]">
        <table className="w-full text-right text-sm text-[#3a2f28]">
          <thead className="bg-[#f5ede4] text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">
            <tr>
              <th className="px-3 py-2">כותרת</th>
              <th className="px-3 py-2">URL</th>
              <th className="px-3 py-2">מקור</th>
              <th className="px-3 py-2">סטטוס (פרוקסי)</th>
              <th className="px-3 py-2">Google verdict</th>
              <th className="px-3 py-2">הופעות</th>
              <th className="px-3 py-2">קליקים</th>
              <th className="px-3 py-2">מיקום</th>
              <th className="px-3 py-2">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const ins = inspectResults[r.url];
              return (
              <tr key={r.url} className="border-t border-[#d6c5ac] align-top">
                <td className="px-3 py-2 max-w-[300px] truncate" title={r.title}>{r.title}</td>
                <td className="px-3 py-2 text-[10px] text-[#6b5f55]" dir="ltr">
                  /article/{r.slug}
                </td>
                <td className="px-3 py-2 text-[10px] text-[#7a6e65]">{r.source}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-1.5 py-0.5 text-[10px] font-black uppercase ${
                      r.indexed
                        ? "bg-[#0a8a3a] text-[#fefaf6]"
                        : "bg-[#7a1a1a] text-[#2a1f1a]"
                    }`}
                  >
                    {r.indexed ? "✓ יש impressions" : "✗ אין impressions"}
                  </span>
                </td>
                <td className="px-3 py-2 text-[10px]">
                  {ins ? (
                    <div className="space-y-0.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 font-black uppercase ${
                          ins.verdict === "PASS"
                            ? "bg-[#0a8a3a] text-[#fefaf6]"
                            : ins.verdict === "PARTIAL"
                            ? "bg-[#8a6a0a] text-[#fefaf6]"
                            : ins.verdict === "FAIL"
                            ? "bg-[#7a1a1a] text-[#2a1f1a]"
                            : "bg-[#c9b8a3] text-[#3a2f28]"
                        }`}
                      >
                        {ins.verdict}
                      </span>
                      <div className="text-[#5a4f48]">{ins.coverageState}</div>
                      {ins.lastCrawlTime && (
                        <div className="text-[#7a6e65]">crawl: {new Date(ins.lastCrawlTime).toLocaleDateString("he-IL")}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#7a6e65]">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-[11px]">{r.impressions}</td>
                <td className="px-3 py-2 text-[11px]">{r.clicks}</td>
                <td className="px-3 py-2 text-[11px] text-[#5a4f48]">
                  {r.position ?? "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => submitOne(r.url)}
                      disabled={submitting === r.url}
                      className="border border-[#444] px-2 py-1 text-[10px] font-bold uppercase text-[#3a2f28] disabled:opacity-50"
                    >
                      {submitting === r.url ? "שולח..." : "הגש לאינדוקס"}
                    </button>
                    <button
                      onClick={() => inspectOne(r.url)}
                      disabled={inspecting === r.url}
                      className="border border-[#2a4a6a] bg-[#0a1a2a] px-2 py-1 text-[10px] font-bold uppercase text-[#7aa7e8] disabled:opacity-50"
                    >
                      {inspecting === r.url ? "בודק..." : "🔍 בדוק במציאות"}
                    </button>
                    <a
                      href={r.inspectionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-[#c9b8a3] px-2 py-1 text-center text-[10px] font-bold uppercase text-[#5a4f48] hover:bg-[#ede2d4]"
                    >
                      פתח ב-GSC ↗
                    </a>
                  </div>
                </td>
              </tr>
              );
            })}
            {!q.isLoading && !rows.length && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-xs text-[#7a6e65]">
                  אין שורות לתצוגה
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTabImpl() {
  const qc = useQueryClient();
  const getFn = useServerFn(getSettings);
  const updateFn = useServerFn(updateSettings);
  const q = useQuery({ queryKey: ["ai", "settings"], queryFn: () => getFn() });
  const [form, setForm] = useState<{
    posts_per_week: number;
    publish_days: number[];
    publish_hour: number;
    auto_publish: boolean;
    topic_model: string;
    article_model: string;
    qa_model: string;
    image_model: string;
  } | null>(null);

  useEffect(() => {
    if (q.data && !form) {
      setForm({
        posts_per_week: q.data.posts_per_week,
        publish_days: q.data.publish_days,
        publish_hour: q.data.publish_hour,
        auto_publish: q.data.auto_publish,
        topic_model: q.data.topic_model,
        article_model: q.data.article_model,
        qa_model: q.data.qa_model,
        image_model: q.data.image_model,
      });
    }
  }, [q.data, form]);

  const save = useMutation({
    mutationFn: () => updateFn({ data: form! }),
    onSuccess: () => {
      toast.success("ההגדרות נשמרו");
      qc.invalidateQueries({ queryKey: ["ai", "settings"] });
    },
    onError: (e) => toast.error(`שגיאה: ${(e as Error).message}`),
  });

  if (!form) return <p className="text-sm text-[#5a4f48]">טוען...</p>;

  const days = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

  return (
    <div className="max-w-2xl space-y-4">
      <Field label="מאמרים בשבוע">
        <input
          type="number"
          min={1}
          max={50}
          value={form.posts_per_week}
          onChange={(e) => setForm({ ...form, posts_per_week: +e.target.value })}
          className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-3 py-2 text-[#2a1f1a]"
        />
      </Field>
      <Field label="ימי פרסום">
        <div className="flex gap-2">
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  publish_days: form.publish_days.includes(i)
                    ? form.publish_days.filter((x) => x !== i)
                    : [...form.publish_days, i].sort(),
                })
              }
              className={`flex h-10 w-10 items-center justify-center border text-sm font-bold ${
                form.publish_days.includes(i)
                  ? "border-[#8b3a52] bg-[#8b3a52] text-[#fefaf6]"
                  : "border-[#d6c5ac] text-[#5a4f48]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </Field>
      <Field label="שעת פרסום">
        <input
          type="number"
          min={0}
          max={23}
          value={form.publish_hour}
          onChange={(e) => setForm({ ...form, publish_hour: +e.target.value })}
          className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-3 py-2 text-[#2a1f1a]"
        />
      </Field>
      <Field label="פרסום אוטומטי (ללא אישור ידני)">
        <label className="flex items-center gap-2 text-sm text-[#3a2f28]">
          <input
            type="checkbox"
            checked={form.auto_publish}
            onChange={(e) => setForm({ ...form, auto_publish: e.target.checked })}
          />
          הפעל
        </label>
      </Field>
      <Field label="מודל הצעת נושאים">
        <input
          value={form.topic_model}
          onChange={(e) => setForm({ ...form, topic_model: e.target.value })}
          className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-3 py-2 text-[#2a1f1a]"
          dir="ltr"
        />
      </Field>
      <Field label="מודל יצירת מאמר">
        <input
          value={form.article_model}
          onChange={(e) => setForm({ ...form, article_model: e.target.value })}
          className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-3 py-2 text-[#2a1f1a]"
          dir="ltr"
        />
      </Field>
      <Field label="מודל QA">
        <input
          value={form.qa_model}
          onChange={(e) => setForm({ ...form, qa_model: e.target.value })}
          className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-3 py-2 text-[#2a1f1a]"
          dir="ltr"
        />
      </Field>
      <Field label="מודל תמונה">
        <input
          value={form.image_model}
          onChange={(e) => setForm({ ...form, image_model: e.target.value })}
          className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-3 py-2 text-[#2a1f1a]"
          dir="ltr"
        />
      </Field>
      <button
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="bg-[#8b3a52] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#fefaf6] disabled:opacity-60"
      >
        {save.isPending ? "שומר..." : "שמור הגדרות"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5a4f48]">
        {label}
      </label>
      {children}
    </div>
  );
}

function AdminSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 border border-[#d6c5ac] bg-[#f5ede4] p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-[#d6c5ac] pb-3">
        <h2 className="text-base font-black text-[#2a1f1a]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function AutopilotHistoryTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAutopilotRuns);
  const triggerFn = useServerFn(triggerAutopilotNow);
  const { data, isLoading } = useQuery({
    queryKey: ["autopilot-runs"],
    queryFn: () => listFn(),
    refetchInterval: 15000,
  });
  const trigger = useMutation({
    mutationFn: () => triggerFn(),
    onSuccess: (r) => {
      toast.success(r.alreadyRunning ? "יש כבר ריצת אוטופיילוט פעילה" : "האוטופיילוט התחיל. מייל יישלח בסיום כל השלבים.");
      qc.invalidateQueries({ queryKey: ["autopilot-runs"] });
    },
    onError: (e: Error) => toast.error(`שגיאה: ${e.message}`),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#d6c5ac] bg-[#fefaf6] p-3 text-sm text-[#3a2f28]">
        <div>
          <div className="font-semibold text-[#2a1f1a]">תזמון אוטומטי: כל יום ב-10:00 בבוקר</div>
          <div className="mt-1 text-xs text-[#888]">
            דו"ח נשלח אוטומטית אל <span className="text-[#c9a84c]">naomi.digital101@gmail.com</span> עם הלינקים והסטטוס של כל מאמר.
          </div>
        </div>
        <button
          onClick={() => {
            if (!confirm("להפעיל אוטופיילוט עכשיו? מייל יישלח אוטומטית אחרי שכל השלבים יסתיימו.")) return;
            trigger.mutate();
          }}
          disabled={trigger.isPending}
          className="border border-[#8b3a52] bg-[#8b3a52] px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#c52800] disabled:opacity-50"
        >
          {trigger.isPending ? "⏳ מפעיל..." : "▶ הפעל עכשיו"}
        </button>
      </div>

      {isLoading ? (
        <div className="p-4 text-sm text-[#888]">טוען היסטוריה...</div>
      ) : !data || data.length === 0 ? (
        <div className="p-4 text-sm text-[#888]">עדיין לא הייתה ריצה. הריצה הבאה תתרחש מחר בבוקר ב-10:00.</div>
      ) : (
        <div className="space-y-3">
          {data.map((run) => {
            const rawResults = run.results as
              | {
                  items?: Array<{ topicTitle: string; slug: string | null; passed: boolean; published: boolean; publishedAt: string | null; error?: string }>;
                  progress?: { step: number; label: string; detail: string; current: number; total: number };
                  log?: string[];
                }
              | Array<{ topicTitle: string; slug: string | null; passed: boolean; published: boolean; publishedAt: string | null; error?: string }>;
            const results = Array.isArray(rawResults) ? rawResults : (rawResults?.items ?? []);
            const progress = Array.isArray(rawResults) ? null : (rawResults?.progress ?? null);
            const log = Array.isArray(rawResults) ? [] : (rawResults?.log ?? []);
            return (
              <details key={run.id} className="rounded border border-[#d6c5ac] bg-[#fefaf6] p-3 text-sm">
                <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-[#2a1f1a]">
                  <span className="text-xs text-[#888]">
                    {new Date(run.started_at).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      run.status === "completed"
                        ? "bg-green-900/40 text-green-300"
                        : run.status === "failed"
                          ? "bg-red-900/40 text-red-300"
                          : "bg-yellow-900/40 text-yellow-300"
                    }`}
                  >
                    {run.status === "completed" ? "הסתיים" : run.status === "failed" ? "נכשל" : "רץ"}
                  </span>
                  <span className="text-xs text-[#5a4f48]">מקור: {run.trigger}</span>
                  <span className="ml-auto flex gap-2 text-xs">
                    <span className="text-[#888]">נושאים: <b className="text-[#3a2f28]">{run.suggested}</b></span>
                    <span className="text-[#888]">נוצרו: <b className="text-[#3a2f28]">{run.generated}</b></span>
                    <span className="text-[#888]">QA: <b className="text-[#3a2f28]">{run.passed}</b></span>
                    <span className="text-[#888]">פורסמו: <b className="text-green-400">{run.published}</b></span>
                    {run.email_status && (
                      <span className={run.email_status.startsWith("queued") ? "text-green-500" : "text-red-400"}>
                        ✉ {run.email_status.startsWith("queued") ? "נשלח" : "נכשל"}
                      </span>
                    )}
                  </span>
                </summary>
                <div className="mt-3 space-y-2 border-t border-[#d6c5ac] pt-3">
                  {run.error_message && (
                    <div className="rounded bg-red-900/30 p-2 text-xs text-red-300">שגיאה: {run.error_message}</div>
                  )}
                  {progress && run.status !== "completed" && run.status !== "failed" && (
                    <div className="rounded border border-[#d6c5ac] bg-[#f5ede4] p-3 text-xs text-[#3a2f28]">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="font-bold text-[#2a1f1a]">שלב {progress.step}/5 — {progress.label}</span>
                        <span>{progress.current}{progress.total > 0 ? ` / ${progress.total}` : ""}</span>
                      </div>
                      <div className="mb-2 h-2 overflow-hidden bg-[#d6c5ac]">
                        <div
                          className="h-full bg-[#8b3a52] transition-all duration-300"
                          style={{ width: `${progress.total > 0 ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : ((progress.step - 1) / 5) * 100}%` }}
                        />
                      </div>
                      <div>{progress.detail}</div>
                    </div>
                  )}
                  {results.length === 0 ? (
                    <div className="text-xs text-[#888]">לא נוצרו מאמרים.</div>
                  ) : (
                    <ul className="space-y-2">
                      {results.map((r, i) => (
                        <li key={i} className="flex flex-wrap items-center gap-2 rounded bg-[#f5ede4] p-2 text-xs">
                          <span>
                            {r.error ? "❌" : r.published ? "✅" : r.passed ? "🟡" : "⚠️"}
                          </span>
                          <span className="font-semibold text-[#2a1f1a]">{r.topicTitle}</span>
                          {r.slug && (
                            <a
                              href={`/article/${r.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#c9a84c] hover:underline"
                            >
                              /article/{r.slug}
                            </a>
                          )}
                          {r.error && <span className="text-red-400">{r.error}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {log.length > 0 && (
                    <details className="rounded border border-[#d6c5ac] bg-[#f5ede4] p-2 text-[10px] text-[#5a4f48]">
                      <summary className="cursor-pointer font-bold uppercase tracking-wider">יומן ריצה</summary>
                      <div className="mt-2 space-y-1 font-mono">
                        {log.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}