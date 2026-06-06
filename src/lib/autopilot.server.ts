import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";
import { generateAndQA } from "@/lib/ai-content.functions";
import {
  enrichPublishedArticle,
  factCheckPublishedArticle,
  runArticleQA,
  sanitizePayload,
  suggestTopicsCore,
  type GeneratedArticlePayload,
  type QaResult,
} from "@/lib/ai-content.server";

const NOTIFY_EMAIL = "naomi.digital101@gmail.com";
const SENDER_DOMAIN = "notify.inbar-farchi.lovable.app";
const FROM = `ענבר פרחי <autopilot@${SENDER_DOMAIN}>`;
const SITE_BASE = "https://inbar-farchi.lovable.app";
const DAILY_TARGET = 5;
const STALE_RUN_MS = 45 * 60 * 1000;
const MAX_LOG_LINES = 30;
const MANUAL_STEP_BURST = 25;

type AutopilotRunsRow = Database["public"]["Tables"]["autopilot_runs"]["Row"];
type RunResultsJson = Database["public"]["Tables"]["autopilot_runs"]["Row"]["results"];
type ArticlePayloadJson = Database["public"]["Tables"]["ai_articles"]["Row"]["payload"];

export type AutopilotRunResult = {
  topicTitle: string;
  slug: string | null;
  passed: boolean;
  published: boolean;
  publishedAt: string | null;
  error?: string;
};

export type AutopilotProgress = {
  step: 1 | 2 | 3 | 4 | 5;
  label: string;
  detail: string;
  current: number;
  total: number;
};

type TargetTopic = {
  id: string;
  title: string;
  category_slug: string;
  keywords: string[];
};

type PersistedRunState = {
  version: 1;
  progress: AutopilotProgress;
  items: AutopilotRunResult[];
  log: string[];
  meta: {
    targetTopics: TargetTopic[];
    publishQueue: string[];
    factCheckQueue: string[];
    qaQueue: string[];
  };
};

export type AutopilotRunSnapshot = {
  runId: string;
  status: string;
  progress: AutopilotProgress;
  log: string[];
  suggested: number;
  generated: number;
  passed: number;
  published: number;
  emailStatus: string | null;
  error: string | null;
  alreadyRunning?: boolean;
};

const asRunResultsJson = (value: PersistedRunState): RunResultsJson => value as unknown as RunResultsJson;
const asArticlePayloadJson = (value: unknown): ArticlePayloadJson => value as ArticlePayloadJson;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function createInitialState(): PersistedRunState {
  return {
    version: 1,
    progress: {
      step: 1,
      label: "מציע נושאים חדשים",
      detail: "מכין את תור האוטופיילוט",
      current: 0,
      total: DAILY_TARGET,
    },
    items: [],
    log: [],
    meta: {
      targetTopics: [],
      publishQueue: [],
      factCheckQueue: [],
      qaQueue: [],
    },
  };
}

function normalizeState(raw: unknown): PersistedRunState {
  if (Array.isArray(raw)) {
    return {
      ...createInitialState(),
      progress: {
        step: 5,
        label: "הסתיים",
        detail: "ריצה ישנה ללא מידע מפורט על שלבים",
        current: raw.length,
        total: raw.length,
      },
      items: raw as AutopilotRunResult[],
    };
  }

  if (raw && typeof raw === "object") {
    const value = raw as Partial<PersistedRunState>;
    const base = createInitialState();
    return {
      version: 1,
      progress: value.progress ?? base.progress,
      items: Array.isArray(value.items) ? value.items : base.items,
      log: Array.isArray(value.log) ? value.log : base.log,
      meta: {
        targetTopics: Array.isArray(value.meta?.targetTopics) ? value.meta.targetTopics : [],
        publishQueue: Array.isArray(value.meta?.publishQueue) ? value.meta.publishQueue : [],
        factCheckQueue: Array.isArray(value.meta?.factCheckQueue) ? value.meta.factCheckQueue : [],
        qaQueue: Array.isArray(value.meta?.qaQueue) ? value.meta.qaQueue : [],
      },
    };
  }

  return createInitialState();
}

function pushLog(state: PersistedRunState, message: string) {
  state.log = [...state.log.slice(-(MAX_LOG_LINES - 1)), `${new Date().toLocaleTimeString("he-IL")} — ${message}`];
}

function buildSnapshot(run: AutopilotRunsRow): AutopilotRunSnapshot {
  const state = normalizeState(run.results);
  return {
    runId: run.id,
    status: run.status,
    progress: state.progress,
    log: state.log,
    suggested: run.suggested,
    generated: run.generated,
    passed: run.passed,
    published: run.published,
    emailStatus: run.email_status,
    error: run.error_message,
  };
}

async function updateRun(
  runId: string,
  state: PersistedRunState,
  patch: Partial<AutopilotRunsRow> = {},
): Promise<AutopilotRunsRow> {
  const { data, error } = await supabaseAdmin
    .from("autopilot_runs")
    .update({ ...patch, results: asRunResultsJson(state) })
    .eq("id", runId)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "failed to update run");
  return data;
}

function renderHtml(opts: {
  results: AutopilotRunResult[];
  suggested: number;
  generated: number;
  passed: number;
  published: number;
  startedAt: string;
}) {
  const items = opts.results
    .map((r) => {
      const url = r.slug ? `${SITE_BASE}/article/${r.slug}` : null;
      const statusEmoji = r.error ? "❌" : r.published ? "✅" : r.passed ? "🟡" : "⚠️";
      const statusText = r.error
        ? `שגיאה: ${r.error}`
        : r.published
          ? "פורסם ועבר את כל השלבים"
          : r.passed
            ? "עבר QA, ממתין לפרסום"
            : "QA נכשל";
      return `<li style="margin:12px 0;padding:12px;background:#f8f5f0;border-right:4px solid #c9a84c;border-radius:6px;">
        <div style="font-size:16px;font-weight:600;color:#ede2d4;">${statusEmoji} ${escapeHtml(r.topicTitle)}</div>
        <div style="font-size:14px;color:#7a6e65;margin-top:4px;">${statusText}</div>
        ${url ? `<div style="margin-top:6px;"><a href="${url}" style="color:#c9a84c;text-decoration:none;font-weight:500;">${url}</a></div>` : ""}
      </li>`;
    })
    .join("");

  return `<!doctype html>
<html dir="rtl" lang="he"><body style="margin:0;background:#ffffff;font-family:Heebo,Arial,sans-serif;color:#b8dcd4;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
  <h1 style="font-family:'Frank Ruhl Libre',serif;color:#ede2d4;font-size:28px;margin:0 0 8px;">דו"ח אוטופיילוט יומי</h1>
  <div style="color:#777;font-size:14px;margin-bottom:24px;">${escapeHtml(new Date(opts.startedAt).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }))}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
    <span style="background:#f0ebe3;padding:8px 14px;border-radius:20px;font-size:14px;">נושאים חדשים: <b>${opts.suggested}</b></span>
    <span style="background:#f0ebe3;padding:8px 14px;border-radius:20px;font-size:14px;">נוצרו: <b>${opts.generated}</b></span>
    <span style="background:#f0ebe3;padding:8px 14px;border-radius:20px;font-size:14px;">עברו QA: <b>${opts.passed}</b></span>
    <span style="background:#c9a84c;color:white;padding:8px 14px;border-radius:20px;font-size:14px;">פורסמו: <b>${opts.published}</b></span>
  </div>
  <h2 style="font-family:'Frank Ruhl Libre',serif;font-size:20px;margin:24px 0 12px;">מאמרים מהריצה</h2>
  <ul style="list-style:none;padding:0;margin:0;">${items || '<li style="color:#777;">לא נוצרו מאמרים בריצה הזאת.</li>'}</ul>
  <p style="margin-top:32px;color:#888;font-size:12px;text-align:center;">הודעה אוטומטית מהאוטופיילוט של ענבר פרחי</p>
</div>
</body></html>`;
}

async function enqueueReportEmail(args: { runId: string; html: string; subject: string }): Promise<{ ok: boolean; error?: string }> {
  const messageId = `autopilot-${args.runId}`;
  const text = [
    args.subject,
    `דוח אוטופיילוט זמין גם באתר: ${SITE_BASE}/admin/content`,
    "האימייל כולל פירוט מלא בגרסת HTML.",
  ].join("\n");
  const payload = {
    to: NOTIFY_EMAIL,
    from: FROM,
    sender_domain: SENDER_DOMAIN,
    subject: args.subject,
    html: args.html,
    text,
    label: "autopilot_daily_report",
    purpose: "transactional",
    message_id: messageId,
    idempotency_key: messageId,
    queued_at: new Date().toISOString(),
  };
  const { error } = await supabaseAdmin.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: payload as never,
  });
  if (error) return { ok: false, error: error.message };
  await supabaseAdmin.from("email_send_log").insert({
    message_id: messageId,
    template_name: "autopilot_daily_report",
    recipient_email: NOTIFY_EMAIL,
    status: "pending",
  });
  return { ok: true };
}

async function finalizeRun(run: AutopilotRunsRow, state: PersistedRunState, runError: string | null) {
  const subject = runError
    ? "⚠️ אוטופיילוט נכשל"
    : run.published > 0
      ? `✅ פורסמו ${run.published} מאמרים חדשים`
      : `אוטופיילוט הסתיים — ${run.generated} מאמרים נוצרו`;
  const html = renderHtml({
    results: state.items,
    suggested: run.suggested,
    generated: run.generated,
    passed: run.passed,
    published: run.published,
    startedAt: run.started_at,
  });
  const email = await enqueueReportEmail({ runId: run.id, html, subject });

  return updateRun(run.id, state, {
    finished_at: new Date().toISOString(),
    status: runError ? "failed" : "completed",
    error_message: runError,
    email_status: email.ok ? "queued" : `failed: ${email.error}`,
  });
}

async function processFactCheckBySlug(slug: string, model: string) {
  const { data: row, error } = await supabaseAdmin
    .from("ai_articles")
    .select("id, slug, payload, hero_image_url, qa_attempts")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) return;

  const original = row.payload as GeneratedArticlePayload;
  const fc = await factCheckPublishedArticle({ payload: original, slug: row.slug, model });

  let updatedPayload = fc.payload;
  let qaReport: QaResult | null = null;
  if (fc.result.changed) {
    qaReport = await runArticleQA({
      payload: updatedPayload,
      heroImageUrl: row.hero_image_url,
      model,
    });
    updatedPayload = sanitizePayload(updatedPayload);
  }

  const factReport = {
    checked_at: new Date().toISOString(),
    model,
    claims_reviewed: fc.result.claimsReviewed,
    corrections_proposed: fc.result.correctionsProposed,
    corrections_applied: fc.result.correctionsApplied,
    corrections: fc.result.corrections,
  };

  if (fc.result.changed) {
    const nextAttempt = (row.qa_attempts ?? 0) + 1;
    await supabaseAdmin
      .from("ai_articles")
      .update({
        payload: asArticlePayloadJson(updatedPayload),
        fact_checked_at: factReport.checked_at,
        fact_check_report: asArticlePayloadJson(factReport),
        ...(qaReport ? { qa_report: asArticlePayloadJson(qaReport), qa_attempts: nextAttempt } : {}),
      })
      .eq("id", row.id);

    if (qaReport) {
      await supabaseAdmin.from("ai_qa_logs").insert({
        article_id: row.id,
        attempt: nextAttempt,
        passed: qaReport.passed,
        issues: asArticlePayloadJson({ issues: qaReport.issues }),
        model,
      });
    }
    return fc.result.correctionsApplied;
  }

  await supabaseAdmin
    .from("ai_articles")
    .update({
      fact_checked_at: factReport.checked_at,
      fact_check_report: asArticlePayloadJson(factReport),
    })
    .eq("id", row.id);

  return 0;
}

async function processQaBySlug(slug: string, qaModel: string, imageModel: string) {
  const { data: row, error } = await supabaseAdmin
    .from("ai_articles")
    .select("id, slug, payload, hero_image_url, qa_attempts, qa_report")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) return;

  const original = row.payload as GeneratedArticlePayload;
  let working = sanitizePayload(original);
  let changed = JSON.stringify(working) !== JSON.stringify(original);

  const enrichment = await enrichPublishedArticle({
    payload: working,
    slug: row.slug,
    qaModel,
    imageModel,
  });
  working = enrichment.payload;
  if (enrichment.result.changed) changed = true;

  const qa = await runArticleQA({
    payload: working,
    heroImageUrl: row.hero_image_url,
    model: qaModel,
  });

  const nextAttempt = (row.qa_attempts ?? 0) + 1;
  await supabaseAdmin
    .from("ai_articles")
    .update({
      qa_attempts: nextAttempt,
      qa_report: asArticlePayloadJson(qa),
      ...(changed ? { payload: asArticlePayloadJson(working) } : {}),
    })
    .eq("id", row.id);

  await supabaseAdmin.from("ai_qa_logs").insert({
    article_id: row.id,
    attempt: nextAttempt,
    passed: qa.passed,
    issues: asArticlePayloadJson({ issues: qa.issues }),
    model: qaModel,
  });
}

export async function startAutopilotRun(trigger: "manual" | "cron" = "manual"): Promise<AutopilotRunSnapshot> {
  const staleThreshold = new Date(Date.now() - STALE_RUN_MS).toISOString();
  const { data: existing } = await supabaseAdmin
    .from("autopilot_runs")
    .select("*")
    .eq("trigger", trigger)
    .in("status", ["pending", "running"])
    .gte("started_at", staleThreshold)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { ...buildSnapshot(existing), alreadyRunning: true } satisfies AutopilotRunSnapshot;
  }

  const { data: run, error } = await supabaseAdmin
    .from("autopilot_runs")
    .insert({
      trigger,
      status: "pending",
      results: asRunResultsJson(createInitialState()),
    })
    .select("*")
    .single();
  if (error || !run) throw new Error(error?.message || "failed to queue run");

  return { ...buildSnapshot(run), alreadyRunning: false } satisfies AutopilotRunSnapshot;
}

export async function processAutopilotRun(runId: string): Promise<AutopilotRunSnapshot> {
  const { data: run, error } = await supabaseAdmin
    .from("autopilot_runs")
    .select("*")
    .eq("id", runId)
    .single();
  if (error || !run) throw new Error(error?.message || "run not found");
  if (run.status === "completed" || run.status === "failed") return buildSnapshot(run);

  const state = normalizeState(run.results);
  const { data: settings } = await supabaseAdmin
    .from("ai_generation_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (!settings) throw new Error("Settings missing");

  try {
    let currentRun = run;

    while (true) {
      if (state.progress.step === 1) {
        const { count: queuedCount } = await supabaseAdmin
          .from("ai_topics")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "approved"]);

        const needed = Math.max(0, DAILY_TARGET - (queuedCount ?? 0));
        if (needed > 0 && currentRun.suggested === 0) {
          const topics = await suggestTopicsCore({ count: needed, model: settings.topic_model });
          if (topics.length) {
            await supabaseAdmin.from("ai_topics").insert(
              topics.map((t) => ({
                title: t.title,
                category_slug: t.category_slug,
                keywords: t.keywords,
                reasoning: t.reasoning,
                score: t.score,
                status: "approved" as const,
              })),
            );
            currentRun.suggested = topics.length;
            pushLog(state, `נוספו ${topics.length} נושאים חדשים`);
          }
        }

        const { data: queue } = await supabaseAdmin
          .from("ai_topics")
          .select("id, title, category_slug, keywords")
          .in("status", ["pending", "approved"])
          .order("score", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(DAILY_TARGET);

        state.meta.targetTopics = (queue ?? []).map((topic) => ({
          id: topic.id,
          title: topic.title,
          category_slug: topic.category_slug,
          keywords: Array.isArray(topic.keywords) ? (topic.keywords as string[]) : [],
        }));
        state.progress = {
          step: 2,
          label: "כותב מאמרים",
          detail: state.meta.targetTopics.length > 0 ? `מוכן לכתוב ${state.meta.targetTopics.length} מאמרים` : "אין נושאים זמינים לכתיבה",
          current: 0,
          total: state.meta.targetTopics.length,
        };
        currentRun = await updateRun(runId, state, {
          status: "running",
          suggested: currentRun.suggested,
        });
        if (state.meta.targetTopics.length === 0) continue;
        return buildSnapshot(currentRun);
      }

      if (state.progress.step === 2) {
        const nextTopic = state.meta.targetTopics[state.items.length];
        if (!nextTopic) {
          state.meta.publishQueue = state.items.filter((item) => item.passed && item.slug).map((item) => item.slug!) ;
          state.progress = {
            step: 3,
            label: "מפרסם מאמרים",
            detail: state.meta.publishQueue.length > 0 ? `מוכן לפרסם ${state.meta.publishQueue.length} מאמרים` : "אין מאמרים שעברו QA לפרסום",
            current: 0,
            total: state.meta.publishQueue.length,
          };
          currentRun = await updateRun(runId, state, {
            generated: state.items.length,
            passed: state.items.filter((item) => item.passed).length,
          });
          continue;
        }

        const { data: topicRow } = await supabaseAdmin
          .from("ai_topics")
          .select("id")
          .eq("id", nextTopic.id)
          .maybeSingle();

        let nextResult: AutopilotRunResult;
        if (!topicRow) {
          nextResult = {
            topicTitle: nextTopic.title,
            slug: null,
            passed: false,
            published: false,
            publishedAt: null,
            error: "הנושא כבר טופל או הוסר מהתור",
          };
        } else {
          try {
            const generatedArticle = await generateAndQA({
              topicId: nextTopic.id,
              topic: nextTopic,
              settings,
            });
            nextResult = {
              topicTitle: nextTopic.title,
              slug: generatedArticle.slug,
              passed: generatedArticle.passed,
              published: false,
              publishedAt: null,
            };
          } catch (stepError) {
            nextResult = {
              topicTitle: nextTopic.title,
              slug: null,
              passed: false,
              published: false,
              publishedAt: null,
              error: stepError instanceof Error ? stepError.message : String(stepError),
            };
          }
        }

        state.items.push(nextResult);
        state.progress = {
          step: 2,
          label: "כותב מאמרים",
          detail: `נכתב ${state.items.length} מתוך ${state.meta.targetTopics.length}`,
          current: state.items.length,
          total: state.meta.targetTopics.length,
        };
        pushLog(state, `${nextTopic.title} ${nextResult.error ? "❌" : nextResult.passed ? "✅" : "⚠️"}`);
        currentRun = await updateRun(runId, state, {
          status: "running",
          generated: state.items.length,
          passed: state.items.filter((item) => item.passed).length,
        });
        return buildSnapshot(currentRun);
      }

      if (state.progress.step === 3) {
        if (state.meta.publishQueue.length === 0) {
          state.meta.factCheckQueue = state.items.filter((item) => item.published && item.slug).map((item) => item.slug!);
          state.progress = {
            step: 4,
            label: "מאמת עובדות",
            detail: state.meta.factCheckQueue.length > 0 ? `מוכן לאמת ${state.meta.factCheckQueue.length} מאמרים` : "אין מאמרים לפרסום ואימות",
            current: 0,
            total: state.meta.factCheckQueue.length,
          };
          currentRun = await updateRun(runId, state, { published: state.items.filter((item) => item.published).length });
          continue;
        }

        const publishIndex = state.progress.current;
        const slug = state.meta.publishQueue[publishIndex];
        if (!slug) {
          state.meta.publishQueue = [];
          continue;
        }

        const nowIso = new Date().toISOString();
        await supabaseAdmin
          .from("ai_articles")
          .update({ status: "published", published_at: nowIso })
          .eq("slug", slug);

        state.items = state.items.map((item) =>
          item.slug === slug ? { ...item, published: true, publishedAt: nowIso } : item,
        );
        state.progress = {
          step: 3,
          label: "מפרסם מאמרים",
          detail: `פורסמו ${publishIndex + 1} מתוך ${state.meta.publishQueue.length}`,
          current: publishIndex + 1,
          total: state.meta.publishQueue.length,
        };
        pushLog(state, `פורסם ${slug}`);
        currentRun = await updateRun(runId, state, {
          published: state.items.filter((item) => item.published).length,
        });
        if (publishIndex + 1 >= state.meta.publishQueue.length) {
          state.meta.publishQueue = [];
        }
        return buildSnapshot(currentRun);
      }

      if (state.progress.step === 4) {
        if (state.meta.factCheckQueue.length === 0) {
          state.meta.qaQueue = state.items.filter((item) => item.published && item.slug).map((item) => item.slug!);
          state.progress = {
            step: 5,
            label: "QA והעשרה",
            detail: state.meta.qaQueue.length > 0 ? `מוכן לעבור QA על ${state.meta.qaQueue.length} מאמרים` : "אין מאמרים לבדיקה סופית",
            current: 0,
            total: state.meta.qaQueue.length,
          };
          currentRun = await updateRun(runId, state);
          continue;
        }

        const factIndex = state.progress.current;
        const slug = state.meta.factCheckQueue[factIndex];
        if (!slug) {
          state.meta.factCheckQueue = [];
          continue;
        }

        await processFactCheckBySlug(slug, settings.qa_model);
        state.progress = {
          step: 4,
          label: "מאמת עובדות",
          detail: `אומת ${factIndex + 1} מתוך ${state.meta.factCheckQueue.length}`,
          current: factIndex + 1,
          total: state.meta.factCheckQueue.length,
        };
        pushLog(state, `אימות עובדות הושלם עבור ${slug}`);
        currentRun = await updateRun(runId, state);
        if (factIndex + 1 >= state.meta.factCheckQueue.length) {
          state.meta.factCheckQueue = [];
        }
        return buildSnapshot(currentRun);
      }

      if (state.meta.qaQueue.length === 0) {
        const finalized = await finalizeRun(currentRun, state, null);
        return buildSnapshot(finalized);
      }

      const qaIndex = state.progress.current;
      const slug = state.meta.qaQueue[qaIndex];
      if (!slug) {
        state.meta.qaQueue = [];
        continue;
      }

      await processQaBySlug(slug, settings.qa_model, settings.image_model);
      state.progress = {
        step: 5,
        label: "QA והעשרה",
        detail: `QA הושלם עבור ${qaIndex + 1} מתוך ${state.meta.qaQueue.length}`,
        current: qaIndex + 1,
        total: state.meta.qaQueue.length,
      };
      pushLog(state, `QA והעשרה הושלמו עבור ${slug}`);
      currentRun = await updateRun(runId, state);
      if (qaIndex + 1 >= state.meta.qaQueue.length) {
        state.meta.qaQueue = [];
      }
      return buildSnapshot(currentRun);
    }
  } catch (processError) {
    pushLog(state, `שגיאה: ${processError instanceof Error ? processError.message : String(processError)}`);
    const failed = await finalizeRun(run, state, processError instanceof Error ? processError.message : String(processError));
    return buildSnapshot(failed);
  }
}

export async function runAutopilotOnce(trigger: "cron" | "manual" = "manual") {
  const queued = await startAutopilotRun(trigger);
  let snapshot = queued;

  while (snapshot.status !== "completed" && snapshot.status !== "failed") {
    snapshot = await processAutopilotRun(snapshot.runId);
  }

  return {
    ok: snapshot.status === "completed",
    runId: snapshot.runId,
    suggested: snapshot.suggested,
    generated: snapshot.generated,
    passed: snapshot.passed,
    scheduled: 0,
    published: snapshot.published,
    email: snapshot.emailStatus?.startsWith("queued") ?? false,
    error: snapshot.error,
  };
}

export async function drainAutopilotRun(runId: string, maxSteps = MANUAL_STEP_BURST): Promise<AutopilotRunSnapshot> {
  let snapshot = await processAutopilotRun(runId);
  let steps = 1;

  while (snapshot.status !== "completed" && snapshot.status !== "failed" && steps < maxSteps) {
    snapshot = await processAutopilotRun(runId);
    steps += 1;
  }

  return snapshot;
}