import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  generateAndQA,
  computeUpcomingSlots,
} from "@/lib/ai-content.functions";
import { suggestTopicsCore } from "@/lib/ai-content.server";

const NOTIFY_EMAIL = "naomi.digital101@gmail.com";
const SENDER_DOMAIN = "notify.inbar-pedicure.co.il";
const FROM = `ענבר פרחי <autopilot@${SENDER_DOMAIN}>`;
const SITE_BASE = "https://inbar-pedicure.co.il";

type RunResult = {
  topicTitle: string;
  slug: string | null;
  passed: boolean;
  published: boolean;
  publishedAt: string | null;
  error?: string;
};

function renderHtml(opts: {
  results: RunResult[];
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

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function enqueueReportEmail(args: {
  runId: string;
  html: string;
  subject: string;
}): Promise<{ ok: boolean; error?: string }> {
  const messageId = `autopilot-${args.runId}`;
  const payload = {
    to: NOTIFY_EMAIL,
    from: FROM,
    sender_domain: SENDER_DOMAIN,
    subject: args.subject,
    html: args.html,
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

export const Route = createFileRoute("/api/public/hooks/autopilot-daily")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Light auth: require anon apikey header
        const apikey = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!apikey || !expected || apikey !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Create run row
        const { data: run, error: runErr } = await supabaseAdmin
          .from("autopilot_runs")
          .insert({ trigger: "cron", status: "running" })
          .select()
          .single();
        if (runErr || !run) {
          return new Response(JSON.stringify({ error: runErr?.message || "failed to create run" }), { status: 500 });
        }

        const startedAt = run.started_at;
        const results: RunResult[] = [];
        let suggested = 0;
        let generated = 0;
        let passed = 0;
        let publishedCount = 0;
        let scheduledCount = 0;
        let runError: string | null = null;

        try {
          const { data: settings } = await supabaseAdmin
            .from("ai_generation_settings")
            .select("*")
            .eq("id", 1)
            .single();
          if (!settings) throw new Error("Settings missing");

          // Suggest a couple of fresh topics
          try {
            const topics = await suggestTopicsCore({ count: 3, model: settings.topic_model });
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
              suggested = topics.length;
            }
          } catch (e) {
            console.error("Topic suggestion failed:", e);
          }

          // Pull next batch (use posts_per_week / 7 as daily target, min 1, max 5)
          const dailyTarget = Math.min(5, Math.max(1, Math.round(settings.posts_per_week / 7)));
          const { data: queue } = await supabaseAdmin
            .from("ai_topics")
            .select("*")
            .in("status", ["pending", "approved"])
            .order("score", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(dailyTarget);

          for (const topic of queue ?? []) {
            try {
              const r = await generateAndQA({
                topicId: topic.id,
                topic: {
                  title: topic.title,
                  category_slug: topic.category_slug,
                  keywords: topic.keywords ?? [],
                },
                settings,
              });
              generated++;
              if (r.passed) passed++;
              results.push({
                topicTitle: topic.title,
                slug: r.slug,
                passed: r.passed,
                published: false,
                publishedAt: null,
              });
            } catch (e) {
              results.push({
                topicTitle: topic.title,
                slug: null,
                passed: false,
                published: false,
                publishedAt: null,
                error: e instanceof Error ? e.message : String(e),
              });
            }
          }

          // Auto-publish passing articles (user asked for "פורסם ועבר את כל השלבים")
          if (settings.auto_publish) {
            const nowIso = new Date().toISOString();
            for (const r of results) {
              if (r.passed && r.slug) {
                const { error: upErr } = await supabaseAdmin
                  .from("ai_articles")
                  .update({ status: "published", published_at: nowIso })
                  .eq("slug", r.slug);
                if (!upErr) {
                  r.published = true;
                  r.publishedAt = nowIso;
                  publishedCount++;
                }
              }
            }
          } else {
            // Schedule per settings
            const toSchedule = results.filter((r) => r.passed && r.slug);
            if (toSchedule.length > 0) {
              const { data: existing } = await supabaseAdmin
                .from("ai_articles")
                .select("scheduled_for, published_at, status")
                .in("status", ["scheduled", "published"]);
              const taken = new Set<string>();
              for (const row of existing ?? []) {
                const iso = row.scheduled_for ?? row.published_at;
                if (iso) taken.add(iso.slice(0, 10));
              }
              const slots = computeUpcomingSlots({
                count: toSchedule.length,
                publishDays: settings.publish_days,
                publishHour: settings.publish_hour,
                taken,
              });
              for (let i = 0; i < toSchedule.length; i++) {
                const slot = slots[i];
                if (!slot) break;
                await supabaseAdmin
                  .from("ai_articles")
                  .update({ status: "scheduled", scheduled_for: slot })
                  .eq("slug", toSchedule[i].slug!);
                scheduledCount++;
              }
            }
          }
        } catch (e) {
          runError = e instanceof Error ? e.message : String(e);
        }

        // Send report email
        const subject = runError
          ? `⚠️ אוטופיילוט נכשל`
          : publishedCount > 0
            ? `✅ פורסמו ${publishedCount} מאמרים חדשים`
            : `אוטופיילוט הסתיים — ${generated} מאמרים נוצרו`;
        const html = renderHtml({ results, suggested, generated, passed, published: publishedCount, startedAt });
        const email = await enqueueReportEmail({ runId: run.id, html, subject });

        // Finalize run row
        await supabaseAdmin
          .from("autopilot_runs")
          .update({
            finished_at: new Date().toISOString(),
            status: runError ? "failed" : "completed",
            suggested,
            generated,
            passed,
            scheduled: scheduledCount,
            published: publishedCount,
            results: results as never,
            error_message: runError,
            email_status: email.ok ? "queued" : `failed: ${email.error}`,
          })
          .eq("id", run.id);

        return new Response(
          JSON.stringify({
            ok: !runError,
            runId: run.id,
            suggested,
            generated,
            passed,
            scheduled: scheduledCount,
            published: publishedCount,
            email: email.ok,
            error: runError,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});