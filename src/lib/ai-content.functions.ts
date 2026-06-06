import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./ai-admin.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";
import {
  suggestTopicsCore,
  generateArticleCore,
  generateHeroImage,
  generateInlineImages,
  getAiGatewayIssue,
  runArticleQA,
  enrichPublishedArticle,
  repairArticleIssues,
  factCheckPublishedArticle,
  payloadToArticle,
  sanitizePayload,
  formatHebrewDate,
  estimateReadingTime,
  type GeneratedArticlePayload,
  type QaResult,
  type RepairResult,
} from "./ai-content.server";
import { categories } from "@/lib/categories";
import type { ArticleCard } from "@/lib/article-cards";
import { drainAutopilotRun, processAutopilotRun, startAutopilotRun } from "./autopilot.server";

function normalizeAiFailure(error: unknown): { error: string; aiIssue?: { code: string; retryable: boolean; userMessage: string } } {
  const aiIssue = getAiGatewayIssue(error);
  if (aiIssue) {
    return {
      error: aiIssue.userMessage,
      aiIssue: {
        code: aiIssue.code,
        retryable: aiIssue.retryable,
        userMessage: aiIssue.userMessage,
      },
    };
  }

  return {
    error: error instanceof Error ? error.message : "שגיאה לא ידועה",
  };
}

function createQaFailureReport(error: unknown): QaResult {
  const failure = normalizeAiFailure(error);
  return {
    passed: false,
    issues: [
      {
        severity: "error",
        category: "facts",
        message: failure.error,
      },
    ],
  };
}

type Json = Database["public"]["Tables"]["ai_articles"]["Row"]["payload"];
const asJson = (v: unknown): Json => v as Json;

/* ---------- Settings ---------- */

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

const SettingsUpdate = z.object({
  posts_per_week: z.number().int().min(1).max(50),
  publish_days: z.array(z.number().int().min(0).max(6)).min(1).max(7),
  publish_hour: z.number().int().min(0).max(23),
  auto_publish: z.boolean(),
  topic_model: z.string().min(3).max(100),
  article_model: z.string().min(3).max(100),
  qa_model: z.string().min(3).max(100),
  image_model: z.string().min(3).max(100),
});

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => SettingsUpdate.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("ai_generation_settings")
      .update(data)
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Topics ---------- */

export const listTopics = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("ai_topics")
      .select("*")
      .in("status", ["pending", "approved"])
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const suggestTopics = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ count: z.number().int().min(1).max(20).default(5) }).parse(input))
  .handler(async ({ data }) => {
    const settings = await supabaseAdmin
      .from("ai_generation_settings")
      .select("topic_model")
      .eq("id", 1)
      .single();
    const model = settings.data?.topic_model ?? "google/gemini-2.5-pro";
    let topics;
    try {
      topics = await suggestTopicsCore({ count: data.count, model });
    } catch (error) {
      return { inserted: 0, ...normalizeAiFailure(error) };
    }
    const rows = topics.map((t) => ({
      title: t.title,
      category_slug: t.category_slug,
      keywords: t.keywords,
      reasoning: t.reasoning,
      score: t.score,
      status: "pending" as const,
    }));
    const { error } = await supabaseAdmin.from("ai_topics").insert(rows);
    if (error) throw new Error(error.message);
    return { inserted: rows.length };
  });

export const setTopicStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "approved", "rejected", "used"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("ai_topics")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTopic = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("ai_topics")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Articles ---------- */

export const listAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("ai_articles")
      .select("id, slug, title, category_slug, status, qa_attempts, scheduled_for, published_at, created_at, updated_at, hero_image_url, fact_checked_at, fact_check_report, qa_report")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAdminArticle = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: article, error } = await supabaseAdmin
      .from("ai_articles")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    const { data: logs } = await supabaseAdmin
      .from("ai_qa_logs")
      .select("*")
      .eq("article_id", data.id)
      .order("attempt", { ascending: false });
    return { article, logs: logs ?? [] };
  });

/** Public — returns a published AI article by slug (or null). */
export const getPublishedAiArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("ai_articles")
      .select("slug, title, payload, hero_image_url, published_at, created_at, updated_at, status")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return payloadToArticle(row);
  });

/** Public — returns lightweight cards for all published AI articles. */
export const listPublishedAiArticleCards = createServerFn({ method: "GET" })
  .handler(async (): Promise<ArticleCard[]> => {
    const { data, error } = await supabaseAdmin
      .from("ai_articles")
      .select("slug, title, payload, hero_image_url, published_at, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const p = row.payload as GeneratedArticlePayload;
      const date = row.published_at ?? row.created_at;
      const cat = categories.find((c) => c.slug === p.categorySlug);
      return {
        slug: row.slug,
        title: row.title ?? p.title,
        excerpt: p.excerpt,
        category: cat?.name ?? p.category ?? p.categorySlug,
        categorySlug: p.categorySlug,
        date,
        dateLabel: formatHebrewDate(date),
        readingTime: estimateReadingTime(p),
        heroImage: row.hero_image_url ?? "/placeholder.svg",
        heroAlt: p.heroAlt ?? row.title ?? p.title,
      };
    });
  });

/** Admin-only — returns any AI article by slug regardless of status (for preview). */
export const getAiArticleBySlugAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("ai_articles")
      .select("slug, title, payload, hero_image_url, published_at, created_at, updated_at, status")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return { ...payloadToArticle(row), status: row.status };
  });

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const { data } = await supabaseAdmin
      .from("ai_articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    i++;
    slug = `${base}-${i}`;
  }
}

export async function generateAndQA(opts: {
  topicId: string | null;
  topic: { title: string; category_slug: string; keywords: string[] };
  settings: {
    article_model: string;
    qa_model: string;
    image_model: string;
  };
}) {
  const MAX_ATTEMPTS = 3;
  let payload: GeneratedArticlePayload | null = null;
  let heroUrl: string | null = null;
  let lastQa: QaResult = { passed: false, issues: [] };

  payload = await generateArticleCore({
    topic: opts.topic,
    model: opts.settings.article_model,
  });

  const slug = await uniqueSlug(payload.slug);
  payload.slug = slug;

  // Insert draft row
  const { data: inserted, error: insErr } = await supabaseAdmin
    .from("ai_articles")
    .insert({
      topic_id: opts.topicId,
      slug,
      title: payload.title,
      category_slug: payload.categorySlug,
      payload: asJson(payload),
      status: "qa_pending",
    })
    .select()
    .single();
  if (insErr) throw new Error(insErr.message);
  const articleId = inserted.id;

  // הנושא יצא מהתור ברגע שנכתב מאמר (גם אם QA ייכשל)
  if (opts.topicId) {
    await supabaseAdmin.from("ai_topics").delete().eq("id", opts.topicId);
  }

  // Hero image
  try {
    heroUrl = await generateHeroImage({
      prompt: payload.heroImagePrompt + " — realistic photography, dirt bike off-road scene, no text, no watermark",
      slug,
      model: opts.settings.image_model,
    });
    await supabaseAdmin
      .from("ai_articles")
      .update({ hero_image_url: heroUrl })
      .eq("id", articleId);
  } catch (e) {
    console.error("Hero image generation failed:", e);
  }

  // Inline section images (up to 4) — מאויר ערך אמיתי לכל מושג/כלי
  try {
    await generateInlineImages({
      payload,
      slug,
      model: opts.settings.image_model,
      maxImages: 4,
    });
    await supabaseAdmin
      .from("ai_articles")
      .update({ payload: asJson(payload) })
      .eq("id", articleId);
  } catch (e) {
    console.error("Inline images generation failed:", e);
  }

  // QA loop
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    lastQa = await runArticleQA({
      payload,
      heroImageUrl: heroUrl,
      model: opts.settings.qa_model,
    });

    await supabaseAdmin.from("ai_qa_logs").insert({
      article_id: articleId,
      attempt,
      passed: lastQa.passed,
      issues: asJson(lastQa.issues),
      model: opts.settings.qa_model,
    });

    await supabaseAdmin
      .from("ai_articles")
      .update({ qa_attempts: attempt, qa_report: asJson(lastQa) })
      .eq("id", articleId);

    if (lastQa.passed) break;

    if (attempt < MAX_ATTEMPTS) {
      // Surgical repair: fix the specific issues QA flagged (intro, images,
      // links, FAQs) instead of regenerating the whole article from scratch.
      try {
        const repair = await repairArticleIssues({
          payload,
          issues: lastQa.issues,
          slug,
          qaModel: opts.settings.qa_model,
          imageModel: opts.settings.image_model,
        });
        if (repair.result.changed) {
          payload = repair.payload;
          await supabaseAdmin
            .from("ai_articles")
            .update({
              payload: asJson(payload),
              title: payload.title,
            })
            .eq("id", articleId);
        }
      } catch (e) {
        console.error("Repair failed:", e);
      }
    }
  }

  const finalStatus = lastQa.passed ? "qa_passed" : "qa_failed";
  await supabaseAdmin
    .from("ai_articles")
    .update({ status: finalStatus })
    .eq("id", articleId);

  if (opts.topicId) {
    await supabaseAdmin.from("ai_topics").delete().eq("id", opts.topicId);
  }

  return { articleId, slug, passed: lastQa.passed };
}

export const generateFromTopic = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ topicId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: topic, error } = await supabaseAdmin
      .from("ai_topics")
      .select("*")
      .eq("id", data.topicId)
      .single();
    if (error) throw new Error(error.message);
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (!settings) throw new Error("Settings missing");
    return generateAndQA({
      topicId: topic.id,
      topic: {
        title: topic.title,
        category_slug: topic.category_slug,
        keywords: topic.keywords ?? [],
      },
      settings,
    });
  });

export const requeueQA = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ articleId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("ai_articles")
      .select("slug, title, payload, hero_image_url, qa_attempts")
      .eq("id", data.articleId)
      .single();
    if (error) throw new Error(error.message);
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("qa_model, image_model")
      .eq("id", 1)
      .single();
    const model = settings?.qa_model ?? "google/gemini-2.5-flash";
    const imageModel = settings?.image_model ?? "google/gemini-2.5-flash-image";
    const originalPayload = row.payload as GeneratedArticlePayload;
    let workingPayload = sanitizePayload(originalPayload);
    let changed = JSON.stringify(workingPayload) !== JSON.stringify(originalPayload);

    let qa: QaResult;
    try {
      qa = await runArticleQA({
        payload: workingPayload,
        heroImageUrl: row.hero_image_url,
        model,
      });
    } catch (error) {
      qa = createQaFailureReport(error);
    }

    let repairSummary = {
      changed: false,
      introRewritten: false,
      sectionsRewritten: 0,
      imagesAdded: 0,
      videosAdded: 0,
      faqsAdded: 0,
      linksAdded: 0,
    };

    if (!qa.passed && qa.issues.length > 0) {
      const repair = await repairArticleIssues({
        payload: workingPayload,
        issues: qa.issues,
        slug: row.slug,
        qaModel: model,
        imageModel,
      });

      repairSummary = repair.result;
      if (repair.result.changed) {
        workingPayload = repair.payload;
        changed = true;
        try {
          qa = await runArticleQA({
            payload: workingPayload,
            heroImageUrl: row.hero_image_url,
            model,
          });
        } catch (error) {
          qa = createQaFailureReport(error);
        }
      }
    }

    const nextAttempt = (row.qa_attempts ?? 0) + 1;
    await supabaseAdmin.from("ai_qa_logs").insert({
      article_id: data.articleId,
      attempt: nextAttempt,
      passed: qa.passed,
      issues: asJson(qa.issues),
      model,
    });
    await supabaseAdmin
      .from("ai_articles")
      .update({
        ...(changed
          ? {
              payload: asJson(workingPayload),
              title: workingPayload.title,
            }
          : {}),
        qa_attempts: nextAttempt,
        qa_report: asJson(qa),
        status: qa.passed ? "qa_passed" : "qa_failed",
      })
      .eq("id", data.articleId);
    return {
      ...qa,
      repaired: repairSummary.changed,
      repairSummary,
    };
  });

export const scheduleArticle = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z
      .object({
        articleId: z.string().uuid(),
        scheduledFor: z.string().datetime().nullable(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("ai_articles")
      .update({
        status: "scheduled",
        scheduled_for: data.scheduledFor,
      })
      .eq("id", data.articleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const publishNow = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ articleId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("ai_articles")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", data.articleId)
      .select("topic_id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (row?.topic_id) {
      await supabaseAdmin.from("ai_topics").delete().eq("id", row.topic_id);
    }
    return { ok: true };
  });

export const archiveArticle = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ articleId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("ai_articles")
      .update({ status: "archived" })
      .eq("id", data.articleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data: counts } = await supabaseAdmin
      .from("ai_articles")
      .select("status");
    const { data: topicCounts } = await supabaseAdmin
      .from("ai_topics")
      .select("status");
    const tally = (rows: { status: string }[] | null) => {
      const out: Record<string, number> = {};
      for (const r of rows ?? []) out[r.status] = (out[r.status] ?? 0) + 1;
      return out;
    };
    return {
      articles: tally(counts),
      topics: tally(topicCounts),
    };
  });

/* ---------- Bulk autopilot: suggest → generate → QA → schedule ---------- */

/**
 * מחשב סלוט פרסום הבא לפי הגדרות (publish_days/publish_hour),
 * תוך דילוג על תאריכים שכבר תפוסים על ידי מאמרים מתוזמנים/פורסמו.
 */
export function computeUpcomingSlots(opts: {
  count: number;
  publishDays: number[];
  publishHour: number;
  taken: Set<string>; // ISO date strings (YYYY-MM-DD) של סלוטים תפוסים
}): string[] {
  const slots: string[] = [];
  const now = new Date();
  const cursor = new Date(now);
  cursor.setMinutes(0, 0, 0);
  cursor.setHours(opts.publishHour);
  // אם השעה היום כבר עברה, התחל ממחר
  if (cursor.getTime() <= now.getTime()) {
    cursor.setDate(cursor.getDate() + 1);
  }
  let safety = 0;
  while (slots.length < opts.count && safety < 365) {
    const dow = cursor.getDay();
    if (opts.publishDays.includes(dow)) {
      const key = cursor.toISOString().slice(0, 10);
      if (!opts.taken.has(key)) {
        slots.push(cursor.toISOString());
        opts.taken.add(key);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
    safety++;
  }
  return slots;
}

export const bulkAutopilot = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z
      .object({
        suggestCount: z.number().int().min(0).max(20).default(5),
        generateCount: z.number().int().min(1).max(10).default(5),
        autoSchedule: z.boolean().default(true),
        publishImmediately: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (!settings) throw new Error("Settings missing");

    // 1. הצע נושאים חדשים אם ביקשו
    let suggested = 0;
    if (data.suggestCount > 0) {
      try {
        const topics = await suggestTopicsCore({
          count: data.suggestCount,
          model: settings.topic_model,
        });
        const rows = topics.map((t) => ({
          title: t.title,
          category_slug: t.category_slug,
          keywords: t.keywords,
          reasoning: t.reasoning,
          score: t.score,
          status: "approved" as const,
        }));
        await supabaseAdmin.from("ai_topics").insert(rows);
        suggested = rows.length;
      } catch (e) {
        console.error("Topic suggestion failed:", e);
      }
    }

    // 2. שלוף את הנושאים העדיפים בתור (pending/approved) לפי ניקוד
    const { data: topics, error: topicsErr } = await supabaseAdmin
      .from("ai_topics")
      .select("*")
      .in("status", ["pending", "approved"])
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(data.generateCount);
    if (topicsErr) throw new Error(topicsErr.message);
    if (!topics || topics.length === 0) {
      return { suggested, generated: 0, passed: 0, scheduled: 0, results: [] as Array<{ slug: string; passed: boolean; scheduledFor: string | null; error?: string }> };
    }

    // 3. צור מאמר + QA לכל אחד (סדרתית כדי לא להעמיס על ה-gateway)
    const results: Array<{
      topicTitle: string;
      articleId: string | null;
      slug: string | null;
      passed: boolean;
      scheduledFor: string | null;
      error?: string;
    }> = [];
    for (const topic of topics) {
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
        results.push({
          topicTitle: topic.title,
          articleId: r.articleId,
          slug: r.slug,
          passed: r.passed,
          scheduledFor: null,
        });
      } catch (e) {
        results.push({
          topicTitle: topic.title,
          articleId: null,
          slug: null,
          passed: false,
          scheduledFor: null,
          error: (e as Error).message,
        });
      }
    }

    // 4. תזמן אוטומטית מאמרים שעברו QA
    let scheduledCount = 0;
    let publishedCount = 0;
    if (data.publishImmediately) {
      const toPublish = results.filter((r) => r.passed && r.articleId);
      for (const item of toPublish) {
        const nowIso = new Date().toISOString();
        await supabaseAdmin
          .from("ai_articles")
          .update({ status: "published", published_at: nowIso })
          .eq("id", item.articleId!);
        item.scheduledFor = nowIso;
        publishedCount++;
      }
    } else if (data.autoSchedule) {
      const toSchedule = results.filter((r) => r.passed && r.articleId);
      if (toSchedule.length > 0) {
        // אסוף סלוטים תפוסים (scheduled או published)
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
          const item = toSchedule[i];
          await supabaseAdmin
            .from("ai_articles")
            .update({ status: "scheduled", scheduled_for: slot })
            .eq("id", item.articleId!);
          item.scheduledFor = slot;
          scheduledCount++;
        }
      }
    }

    return {
      suggested,
      generated: results.length,
      passed: results.filter((r) => r.passed).length,
      scheduled: scheduledCount,
      published: publishedCount,
      results: results.map((r) => ({
        slug: r.slug ?? r.topicTitle,
        passed: r.passed,
        scheduledFor: r.scheduledFor,
        error: r.error,
      })),
    };
  });

/* ---------- Post-publish QA bot: scan + auto-fix published articles ---------- */

export const publishAllPassed = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    const nowIso = new Date().toISOString();
    const { data: rows, error } = await supabaseAdmin
      .from("ai_articles")
      .select("id, topic_id")
      .in("status", ["draft", "qa_pending", "qa_passed", "qa_failed", "scheduled"]);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) return { published: 0 };
    const { error: updErr } = await supabaseAdmin
      .from("ai_articles")
      .update({ status: "published", published_at: nowIso })
      .in("id", rows.map((r) => r.id));
    if (updErr) throw new Error(updErr.message);
    const topicIds = rows.map((r) => r.topic_id).filter((x): x is string => !!x);
    if (topicIds.length > 0) {
      await supabaseAdmin.from("ai_topics").delete().in("id", topicIds);
    }
    return { published: rows.length };
  });

/* ---------- Generate ALL pending/approved topics ---------- */

export const generateAllPending = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (!settings) throw new Error("Settings missing");

    const { data: topics, error } = await supabaseAdmin
      .from("ai_topics")
      .select("*")
      .in("status", ["pending", "approved"])
      .order("score", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    if (!topics || topics.length === 0) {
      return { generated: 0, passed: 0, failed: 0, results: [] as Array<{ slug: string; passed: boolean; error?: string }> };
    }

    const results: Array<{ slug: string; passed: boolean; error?: string }> = [];
    let passed = 0;
    let failed = 0;
    for (const topic of topics) {
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
        if (r.passed) passed++;
        else failed++;
        results.push({ slug: r.slug, passed: r.passed });
      } catch (e) {
        const failure = normalizeAiFailure(e);
        failed++;
        results.push({ slug: topic.title, passed: false, error: failure.error });
        if (failure.aiIssue?.code === "PAYMENT_REQUIRED") break;
      }
    }
    return { generated: results.length, passed, failed, results };
  });

/* ---------- Generate ONE next pending topic (for client-side loop) ---------- */

export const generateNextPending = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (!settings) throw new Error("Settings missing");

    const { data: topics, error } = await supabaseAdmin
      .from("ai_topics")
      .select("*")
      .in("status", ["pending", "approved"])
      .order("score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error(error.message);

    const { count: remainingBefore } = await supabaseAdmin
      .from("ai_topics")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "approved"]);

    if (!topics || topics.length === 0) {
      return { done: true as const, remaining: 0, processed: null as null | { slug: string; passed: boolean; error?: string } };
    }

    const topic = topics[0];
    let processed: { slug: string; passed: boolean; error?: string };
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
      processed = { slug: r.slug, passed: r.passed };
    } catch (e) {
      const failure = normalizeAiFailure(e);
      processed = { slug: topic.title, passed: false, error: failure.error };
      // Mark as rejected so it doesn't block the loop forever
      await supabaseAdmin.from("ai_topics").update({ status: "rejected" }).eq("id", topic.id);
    }

    const remaining = Math.max(0, (remainingBefore ?? 1) - 1);
    return { done: remaining === 0, remaining, processed };
  });

export const listPublishedQaTargets = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) => z.object({ onlyUnchecked: z.boolean().default(false) }).parse(input))
  .handler(async ({ data }) => {
    let query = supabaseAdmin
      .from("ai_articles")
      .select("id, slug")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .order("id", { ascending: false });
    if (data.onlyUnchecked) query = query.is("qa_report", null);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const postPublishQA = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z
      .object({
        ids: z.array(z.string().uuid()).min(1).max(50).optional(),
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
        onlyUnchecked: z.boolean().default(false),
        enrich: z.boolean().default(true),
        repairPasses: z.number().int().min(1).max(5).default(2),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("qa_model, image_model")
      .eq("id", 1)
      .single();
    const model = settings?.qa_model ?? "google/gemini-2.5-flash";
    const imageModel = settings?.image_model ?? "google/gemini-3.1-flash-image-preview";

    const selectFields = "id, slug, title, payload, hero_image_url, qa_attempts, qa_report";
    let rows:
      | Array<{
          id: string;
          slug: string;
          title: string;
          payload: Json;
          hero_image_url: string | null;
          qa_attempts: number | null;
          qa_report: Json | null;
        }>
      | null = null;

    if (data.ids?.length) {
      let idsQuery = supabaseAdmin
        .from("ai_articles")
        .select(selectFields)
        .in("id", data.ids)
        .eq("status", "published");
      if (data.onlyUnchecked) idsQuery = idsQuery.is("qa_report", null);
      const { data: fetchedRows, error } = await idsQuery;
      if (error) throw new Error(error.message);
      const byId = new Map((fetchedRows ?? []).map((row) => [row.id, row]));
      rows = data.ids
        .filter((id) => byId.has(id))
        .map((id) => byId.get(id)!)
        .filter((row) => Boolean(row));
    } else {
      let query = supabaseAdmin
        .from("ai_articles")
        .select(selectFields)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .order("id", { ascending: false })
        .range(data.offset, data.offset + data.limit - 1);
      if (data.onlyUnchecked) query = query.is("qa_report", null);
      const { data: fetchedRows, error } = await query;
      if (error) throw new Error(error.message);
      rows = fetchedRows;
    }
    if (!rows || rows.length === 0) {
      return { scanned: 0, fixed: 0, enriched: 0, passed: 0, failed: 0, results: [] as Array<{ slug: string; passed: boolean; fixed: boolean; enriched: boolean; images: number; videos: number; faqs: number; links: number; issues: number; repairs: number; repairPassesUsed: number; error?: string }> };
    }

    const results: Array<{ slug: string; passed: boolean; fixed: boolean; enriched: boolean; images: number; videos: number; faqs: number; links: number; issues: number; repairs: number; repairPassesUsed: number; error?: string }> = [];
    let fixedCount = 0;
    let enrichedCount = 0;
    let passedCount = 0;
    let failedCount = 0;

    for (const row of rows) {
      try {
        const original = row.payload as GeneratedArticlePayload;
        let working = sanitizePayload(original);
        let changed = JSON.stringify(working) !== JSON.stringify(original);
        let qa: QaResult;
        try {
          qa = await runArticleQA({
            payload: working,
            heroImageUrl: row.hero_image_url,
            model,
          });
        } catch (error) {
          qa = createQaFailureReport(error);
        }
        let totalRepairs = 0;
        let repairPassesUsed = 0;
        let enrichSummary = { changed: false, imagesGenerated: 0, videosAdded: 0, faqsAdded: 0, linksAdded: 0 };

        for (let attempt = 0; attempt < data.repairPasses && !qa.passed; attempt++) {
          let passChanged = false;

          const repair = await repairArticleIssues({
            payload: working,
            issues: qa.issues,
            slug: row.slug,
            qaModel: model,
            imageModel,
          });

          const repairSummary: RepairResult = repair.result;
          if (repairSummary.changed) {
            working = repair.payload;
            passChanged = true;
            totalRepairs++;
          }

          if (data.enrich) {
            const needsExtraEnrichment = qa.issues.some(
              (issue) =>
                issue.category === "image" ||
                issue.category === "links" ||
                (issue.category === "structure" && issue.message.includes("FAQ")),
            );

            if (needsExtraEnrichment && !repairSummary.changed) {
              const extraEnrichment = await enrichPublishedArticle({
                payload: working,
                slug: row.slug,
                qaModel: model,
                imageModel,
              });
              working = extraEnrichment.payload;
              enrichSummary = {
                changed: enrichSummary.changed || extraEnrichment.result.changed,
                imagesGenerated: enrichSummary.imagesGenerated + extraEnrichment.result.imagesGenerated,
                videosAdded: enrichSummary.videosAdded + extraEnrichment.result.videosAdded,
                faqsAdded: enrichSummary.faqsAdded + extraEnrichment.result.faqsAdded,
                linksAdded: enrichSummary.linksAdded + extraEnrichment.result.linksAdded,
              };
              if (extraEnrichment.result.changed) passChanged = true;
            } else {
              enrichSummary = {
                changed: enrichSummary.changed || repairSummary.imagesAdded > 0 || repairSummary.videosAdded > 0 || repairSummary.faqsAdded > 0 || repairSummary.linksAdded > 0,
                imagesGenerated: enrichSummary.imagesGenerated + repairSummary.imagesAdded,
                videosAdded: enrichSummary.videosAdded + repairSummary.videosAdded,
                faqsAdded: enrichSummary.faqsAdded + repairSummary.faqsAdded,
                linksAdded: enrichSummary.linksAdded + repairSummary.linksAdded,
              };
            }
          }

          if (!passChanged) break;
          changed = true;
          repairPassesUsed = attempt + 1;
          try {
            qa = await runArticleQA({
              payload: working,
              heroImageUrl: row.hero_image_url,
              model,
            });
          } catch (error) {
            qa = createQaFailureReport(error);
          }
        }

        const nextAttempt = (row.qa_attempts ?? 0) + 1;
        await supabaseAdmin
          .from("ai_articles")
          .update({
            qa_attempts: nextAttempt,
            qa_report: asJson(qa),
            ...(changed ? { payload: asJson(working), title: working.title } : {}),
          })
          .eq("id", row.id);

        await supabaseAdmin.from("ai_qa_logs").insert({
          article_id: row.id,
          attempt: nextAttempt,
          passed: qa.passed,
          issues: asJson(qa.issues),
          model,
        });

        if (changed) fixedCount++;
        if (enrichSummary.changed) enrichedCount++;
        if (qa.passed) passedCount++;
        else failedCount++;

        results.push({
          slug: row.slug,
          passed: qa.passed,
          fixed: changed,
          enriched: enrichSummary.changed,
          images: enrichSummary.imagesGenerated,
          videos: enrichSummary.videosAdded,
          faqs: enrichSummary.faqsAdded,
          links: enrichSummary.linksAdded,
          issues: qa.issues.length,
          repairs: totalRepairs,
          repairPassesUsed,
        });
      } catch (e) {
        console.error(`Post-publish QA failed for ${row.slug}:`, e);
        const qaFailure = createQaFailureReport(e);
        const nextAttempt = (row.qa_attempts ?? 0) + 1;
        await supabaseAdmin
          .from("ai_articles")
          .update({
            qa_attempts: nextAttempt,
            qa_report: asJson(qaFailure),
          })
          .eq("id", row.id);
        await supabaseAdmin.from("ai_qa_logs").insert({
          article_id: row.id,
          attempt: nextAttempt,
          passed: false,
          issues: asJson(qaFailure.issues),
          model,
        });
        results.push({ slug: row.slug, passed: false, fixed: false, enriched: false, images: 0, videos: 0, faqs: 0, links: 0, issues: qaFailure.issues.length, repairs: 0, repairPassesUsed: 0, error: qaFailure.issues[0]?.message ?? "שגיאת QA" });
        failedCount++;
      }
    }

    return { scanned: rows.length, fixed: fixedCount, enriched: enrichedCount, passed: passedCount, failed: failedCount, results };
  });

export const factCheckPublished = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((input) =>
    z
      .object({
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
        rerunQA: z.boolean().default(true),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { data: settings } = await supabaseAdmin
      .from("ai_generation_settings")
      .select("qa_model")
      .eq("id", 1)
      .single();
    const model = settings?.qa_model ?? "google/gemini-2.5-pro";

    const { data: rows, error } = await supabaseAdmin
      .from("ai_articles")
      .select("id, slug, title, payload, hero_image_url, qa_attempts")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) {
      return { scanned: 0, fixed: 0, totalCorrections: 0, totalApplied: 0, results: [] as Array<{ slug: string; changed: boolean; proposed: number; applied: number; corrections: Array<{ original: string; corrected: string; whatWasWrong: string; source: string; confidence: "high" | "medium"; applied: boolean }> }> };
    }

    const results: Array<{ slug: string; changed: boolean; proposed: number; applied: number; corrections: Array<{ original: string; corrected: string; whatWasWrong: string; source: string; confidence: "high" | "medium"; applied: boolean }> }> = [];
    let fixedCount = 0;
    let totalCorrections = 0;
    let totalApplied = 0;

    for (const row of rows) {
      try {
        const original = row.payload as GeneratedArticlePayload;
        const fc = await factCheckPublishedArticle({
          payload: original,
          slug: row.slug,
          model,
        });

        let updatedPayload = fc.payload;
        let qaReport: QaResult | null = null;
        if (fc.result.changed && data.rerunQA) {
          qaReport = await runArticleQA({
            payload: updatedPayload,
            heroImageUrl: row.hero_image_url,
            model,
          });
          updatedPayload = sanitizePayload(updatedPayload);
        }

        // Persist fact-check report on EVERY article we scanned (even if unchanged)
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
              payload: asJson(updatedPayload),
              fact_checked_at: factReport.checked_at,
              fact_check_report: asJson(factReport),
              ...(qaReport ? { qa_report: asJson(qaReport), qa_attempts: nextAttempt } : {}),
            })
            .eq("id", row.id);

          if (qaReport) {
            await supabaseAdmin.from("ai_qa_logs").insert({
              article_id: row.id,
              attempt: nextAttempt,
              passed: qaReport.passed,
              issues: asJson(qaReport.issues),
              model,
            });
          }
          fixedCount++;
        } else {
          await supabaseAdmin
            .from("ai_articles")
            .update({
              fact_checked_at: factReport.checked_at,
              fact_check_report: asJson(factReport),
            })
            .eq("id", row.id);
        }

        totalCorrections += fc.result.correctionsProposed;
        totalApplied += fc.result.correctionsApplied;
        results.push({
          slug: row.slug,
          changed: fc.result.changed,
          proposed: fc.result.correctionsProposed,
          applied: fc.result.correctionsApplied,
          corrections: fc.result.corrections,
        });
      } catch (e) {
        console.error(`Fact-check failed for ${row.slug}:`, e);
        results.push({ slug: row.slug, changed: false, proposed: 0, applied: 0, corrections: [] });
      }
    }

    return { scanned: rows.length, fixed: fixedCount, totalCorrections, totalApplied, results };
  });

/* ---------- Autopilot run history ---------- */

export const listAutopilotRuns = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const staleThreshold = new Date(Date.now() - 45 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from("autopilot_runs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error_message: "הריצה הידנית נעצרה לפני סיום. אפשר להפעיל שוב מהאוטופיילוט הראשי בעמוד.",
      })
      .eq("status", "running")
      .is("finished_at", null)
      .lt("started_at", staleThreshold);

    const { data: activeRun } = await supabaseAdmin
      .from("autopilot_runs")
      .select("id, status, started_at")
      .in("status", ["pending", "running"])
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeRun) {
      await processAutopilotRun(activeRun.id);
    }

    const { data, error } = await supabaseAdmin
      .from("autopilot_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const triggerAutopilotNow = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    const queued = await startAutopilotRun("manual");
    if (queued.alreadyRunning) {
      return queued;
    }
    return drainAutopilotRun(queued.runId);
  });