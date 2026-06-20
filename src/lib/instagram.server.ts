import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGateway, getLovableApiKey } from "./ai-gateway.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/* ---------- Types ---------- */

export const IdeaSchema = z.object({
  hook: z.string().min(8).max(200),
  angle: z.string().min(8).max(200),
  post_type: z.enum(["product", "tip", "before-after", "myth", "story"]),
  audience: z.string().min(4).max(120),
  uniqueness_rationale: z.string().min(20).max(400),
  originality_score: z.number().int().min(1).max(10),
});
export type Idea = z.infer<typeof IdeaSchema>;

const IdeasOutput = z.object({
  ideas: z.array(IdeaSchema).min(6).max(12),
});

const BRAND_CONTEXT = `
ענבר פרחי — פדיקוריסטית טיפולית בבית אל (אזור בנימין/ירושלים, ישראל).
תחומי טיפול: כף רגל סוכרתית, ציפורן חודרנית/אורתוניקסיה (גשר ציפורן), יבלות ויבלות ויראליות,
פטרת ציפורניים ועור, עור סדוק/עקבים סדוקים, שיקום ציפורן BIO, רגליים לחיילים/ספורטאים.
טון: מקצועי-טיפולי, חם, נגיש, אנושי, אמין. אסור "רפואי", "קליני", "מטפלת רפואית" — היא לא רופאה.
אסור: השריית רגליים, מקפים ארוכים (—), קלישאות AI, אימוג'ים מוגזמים.
טלפון/וואטסאפ: 050-666-8595.
`;

const IDEAS_SYSTEM = `
את/ה אסטרטג/ית תוכן לאינסטגרם של עסק טיפולי בישראל. המשימה: לייצר רעיונות פוסט יוצאי דופן
שאף אחד אחר בנישת הפדיקור הטיפולי בישראל לא כותב עליהם.

חוקי ייחודיות (קריטי):
- אסור קלישאות גנריות מסוג "5 טיפים", "דברים שחשוב לדעת", "המדריך השלם".
- אסור פתיחות גנריות ("רגליים בריאות זה חשוב!").
- חובה זוויות שמפתיעות: מיתוסים שמנפצים ("כולם חושבים ש... אבל האמת היא"),
  תובנות פנים-מקצועיות ("מה שלא יספרו לך אצל הרופא"), פרסונות ספציפיות
  (אמא צעירה אחרי לידה, חייל אחרי מסע, סבתא סוכרתית, רוצה מרתון, איש משרד עם נעלי עקב 10 שעות),
  הקשר ישראלי (סוף עונת סנדלים, חזרה ממילואים, חופש גדול עם הילדים בים, חמסין, מודעות לסוכרת),
  מיקרו-נישות (פטרת אחרי בריכה, יבלת על אצבע 4 דווקא, ציפורן חודרנית בילדים).
- חובה נקודות כאב אמיתיות, לא תיאורטיות.

לכל רעיון תני ציון מקוריות 1-10. רעיונות עם ציון מתחת ל-7 — אל תחזירי בכלל.
החזירי בעברית בלבד. ללא מקפים ארוכים (—), ללא אימוג'ים בכותרת.
`.trim();

export async function brainstormIdeas(opts: { freeform?: string; count?: number }): Promise<Idea[]> {
  const apiKey = getLovableApiKey();
  const gateway = createLovableAiGateway(apiKey);
  const count = opts.count ?? 8;

  const userPrompt =
    `${BRAND_CONTEXT}\n\nייצר ${count} רעיונות פוסט אינסטגרם.\n` +
    (opts.freeform?.trim()
      ? `כיוון/נושא נדרש: ${opts.freeform.trim()}\n`
      : `ייצר מגוון: לפחות אחד לכל אחד מהתחומים: סוכרת, ציפורן חודרנית, יבלות, פטרת, עקבים סדוקים, ספורטאים/חיילים.\n`);

  const result = await generateText({
    model: gateway("google/gemini-2.5-flash"),
    system: IDEAS_SYSTEM,
    prompt: userPrompt,
    experimental_output: Output.object({ schema: IdeasOutput }),
  });

  const parsed = (result as unknown as { experimental_output?: z.infer<typeof IdeasOutput> }).experimental_output
    ?? IdeasOutput.parse(JSON.parse(result.text));
  return parsed.ideas.filter((i) => i.originality_score >= 7);
}

/* ---------- Caption ---------- */

const CaptionOutput = z.object({
  caption: z.string().min(40).max(2000),
  hashtags: z.string().min(10).max(500),
});

export async function generateCaption(opts: {
  idea?: Idea | null;
  post_type: string;
  topic?: string;
}): Promise<{ caption: string; hashtags: string }> {
  const apiKey = getLovableApiKey();
  const gateway = createLovableAiGateway(apiKey);

  const ideaBlock = opts.idea
    ? `Hook: ${opts.idea.hook}\nזווית: ${opts.idea.angle}\nקהל: ${opts.idea.audience}\n`
    : `נושא: ${opts.topic ?? ""}\n`;

  const system = `
את/ה כותב/ת קופי לאינסטגרם בעברית. ${BRAND_CONTEXT}
מבנה הכיתוב חובה:
1) שורה ראשונה: hook חזק שעוצר גלילה (שאלה מפתיעה / טענה נועזת / סטטיסטיקה).
2) גוף קצר 3-6 שורות עם ערך אמיתי (לא קלישאה). כל שורה חדשה = שורה ריקה ביניהן.
3) CTA ברור: "לקביעת תור בוואטסאפ 050-666-8595" או "שלחו לי הודעה לייעוץ".
4) ללא מקפים ארוכים, ללא אימוג'ים מוגזמים (מקסימום 2 רלוונטיים).

האשטגים: 8-15 תגיות מעורבב עברית+אנגלית. רלוונטיות לישראל ולנושא. ללא # מיותרים גנריים.
החזירי JSON בלבד.
`.trim();

  const result = await generateText({
    model: gateway("google/gemini-2.5-flash"),
    system,
    prompt: `סוג פוסט: ${opts.post_type}\n${ideaBlock}\nכתבי כיתוב + האשטגים.`,
    experimental_output: Output.object({ schema: CaptionOutput }),
  });

  const parsed = (result as unknown as { experimental_output?: z.infer<typeof CaptionOutput> }).experimental_output
    ?? CaptionOutput.parse(JSON.parse(result.text));
  return parsed;
}

/* ---------- Image ---------- */

export async function generateInstagramImage(opts: { prompt: string }): Promise<{ path: string; signedUrl: string }> {
  const apiKey = getLovableApiKey();
  const fullPrompt =
    `${opts.prompt}\n\nסגנון: אילוסטרציה נקייה ומקצועית בפלטת מנטה רכה (#b8dcd4, #5fa898) על רקע קרם (#fdfbf7). מינימליסטי, אסתטי לאינסטגרם, ריבוע 1:1. ללא טקסט בתמונה. ללא דם, ללא תמונות מטרידות.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: {
      "Lovable-API-Key": apiKey,
      "Content-Type": "application/json",
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: fullPrompt }],
      modalities: ["image", "text"],
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Image generation failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const json = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const first = json.data?.[0];
  if (!first) throw new Error("Image generation returned no data");

  let bytes: Uint8Array;
  if (first.b64_json) {
    const bin = atob(first.b64_json);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } else if (first.url) {
    const imgRes = await fetch(first.url);
    bytes = new Uint8Array(await imgRes.arrayBuffer());
  } else {
    throw new Error("Image generation returned no b64_json or url");
  }

  return uploadToBucket(bytes, "image/png", "ig");
}

export async function uploadToBucket(
  bytes: Uint8Array,
  contentType: string,
  prefix: string,
): Promise<{ path: string; signedUrl: string }> {
  const ext = contentType.includes("jpeg") ? "jpg" : contentType.includes("webp") ? "webp" : "png";
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabaseAdmin.storage
    .from("instagram-posts")
    .upload(path, bytes, { contentType, upsert: false });
  if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

  const signed = await supabaseAdmin.storage
    .from("instagram-posts")
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
  if (signed.error || !signed.data) throw new Error(signed.error?.message ?? "Failed to sign URL");
  return { path, signedUrl: signed.data.signedUrl };
}

export async function refreshSignedUrl(path: string): Promise<string> {
  const signed = await supabaseAdmin.storage
    .from("instagram-posts")
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  if (signed.error || !signed.data) throw new Error(signed.error?.message ?? "Failed to sign URL");
  return signed.data.signedUrl;
}

/* ---------- Instagram Graph API publish ---------- */

export type PublishResult =
  | { ok: true; ig_media_id: string }
  | { ok: false; reason: "not_configured" | "error"; message: string };

export async function publishToInstagram(opts: {
  imageUrl: string;
  caption: string;
}): Promise<PublishResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  if (!token || !igAccountId) {
    return { ok: false, reason: "not_configured", message: "חיבור אינסטגרם לא מוגדר" };
  }

  // Step 1: create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v21.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: opts.imageUrl,
        caption: opts.caption,
        access_token: token,
      }),
    },
  );
  if (!containerRes.ok) {
    return { ok: false, reason: "error", message: `Container failed: ${(await containerRes.text()).slice(0, 300)}` };
  }
  const containerJson = (await containerRes.json()) as { id?: string };
  if (!containerJson.id) return { ok: false, reason: "error", message: "No container id" };

  // Step 2: publish
  const pubRes = await fetch(
    `https://graph.facebook.com/v21.0/${igAccountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: containerJson.id, access_token: token }),
    },
  );
  if (!pubRes.ok) {
    return { ok: false, reason: "error", message: `Publish failed: ${(await pubRes.text()).slice(0, 300)}` };
  }
  const pubJson = (await pubRes.json()) as { id?: string };
  if (!pubJson.id) return { ok: false, reason: "error", message: "No media id from publish" };
  return { ok: true, ig_media_id: pubJson.id };
}

export function isInstagramConfigured(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.IG_BUSINESS_ACCOUNT_ID);
}