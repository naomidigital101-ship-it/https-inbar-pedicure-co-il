import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "./ai-admin.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  brainstormIdeas,
  generateCaption,
  generateInstagramImage,
  uploadToBucket,
  refreshSignedUrl,
  publishToInstagram,
  isInstagramConfigured,
  IdeaSchema,
  type Idea,
} from "./instagram.server";

export type InstagramPostRow = {
  id: string;
  idea: Idea | null;
  post_type: string;
  caption: string;
  hashtags: string;
  image_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  scheduled_at: string | null;
  published_at: string | null;
  ig_media_id: string | null;
  publish_error: string | null;
  created_at: string;
};

/* ---------- Status / config ---------- */

export const getInstagramStatus = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => ({ configured: isInstagramConfigured() }));

/* ---------- Ideas ---------- */

const BrainstormInput = z.object({
  freeform: z.string().max(500).optional(),
  count: z.number().int().min(4).max(12).optional(),
});

export const brainstormIdeasFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => BrainstormInput.parse(data))
  .handler(async ({ data }) => {
    const ideas = await brainstormIdeas({ freeform: data.freeform, count: data.count });
    return { ideas };
  });

/* ---------- Caption ---------- */

const CaptionInput = z.object({
  idea: IdeaSchema.nullable().optional(),
  post_type: z.string().min(2),
  topic: z.string().max(300).optional(),
});

export const generateCaptionFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => CaptionInput.parse(data))
  .handler(async ({ data }) => {
    const out = await generateCaption({
      idea: data.idea ?? null,
      post_type: data.post_type,
      topic: data.topic,
    });
    return out;
  });

/* ---------- Image ---------- */

const ImageInput = z.object({
  prompt: z.string().min(10).max(1000),
});

export const generateImageFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => ImageInput.parse(data))
  .handler(async ({ data }) => {
    const { signedUrl } = await generateInstagramImage({ prompt: data.prompt });
    return { url: signedUrl };
  });

/* ---------- Upload (base64 from browser) ---------- */

const UploadInput = z.object({
  base64: z.string().min(20),
  contentType: z.string().min(5).max(60),
  kind: z.enum(["before", "after", "single"]).default("single"),
});

export const uploadImageFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => UploadInput.parse(data))
  .handler(async ({ data }) => {
    const b64 = data.base64.includes(",") ? data.base64.split(",")[1] : data.base64;
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const { signedUrl } = await uploadToBucket(bytes, data.contentType, data.kind);
    return { url: signedUrl };
  });

/* ---------- Compose before/after ---------- */

const ComposeInput = z.object({
  beforeUrl: z.string().url(),
  afterUrl: z.string().url(),
});

export const composeBeforeAfterFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => ComposeInput.parse(data))
  .handler(async ({ data }) => {
    // Server-side compose without canvas: we just return both URLs;
    // the client renders side-by-side preview, and we store both for posting.
    // For an actual single composite image, we'd use sharp — not available on Workers.
    // Strategy: pick the "after" image as the published image, with caption noting it's after.
    return { beforeUrl: data.beforeUrl, afterUrl: data.afterUrl };
  });

/* ---------- CRUD posts ---------- */

const SavePostInput = z.object({
  id: z.string().uuid().optional(),
  idea: IdeaSchema.nullable().optional(),
  post_type: z.string().min(2),
  caption: z.string().default(""),
  hashtags: z.string().default(""),
  image_url: z.string().url().nullable().optional(),
  before_image_url: z.string().url().nullable().optional(),
  after_image_url: z.string().url().nullable().optional(),
  status: z.enum(["draft", "scheduled", "published", "failed"]).default("draft"),
  scheduled_at: z.string().nullable().optional(),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => SavePostInput.parse(data))
  .handler(async ({ data, context }) => {
    const payload = {
      idea: data.idea ?? null,
      post_type: data.post_type,
      caption: data.caption,
      hashtags: data.hashtags,
      image_url: data.image_url ?? null,
      before_image_url: data.before_image_url ?? null,
      after_image_url: data.after_image_url ?? null,
      status: data.status,
      scheduled_at: data.scheduled_at ?? null,
      created_by: context.userId,
    };
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("instagram_posts")
        .update(payload)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: row.id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("instagram_posts")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<{ posts: InstagramPostRow[] }> => {
    const { data, error } = await supabaseAdmin
      .from("instagram_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { posts: (data ?? []) as unknown as InstagramPostRow[] };
  });

const DeleteInput = z.object({ id: z.string().uuid() });
export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => DeleteInput.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("instagram_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Publish ---------- */

const PublishInput = z.object({ id: z.string().uuid() });

export const publishPostFn = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: unknown) => PublishInput.parse(data))
  .handler(async ({ data }) => {
    const { data: post, error } = await supabaseAdmin
      .from("instagram_posts")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    if (!post.image_url) throw new Error("חסרה תמונה לפוסט");

    // If image_url is a Supabase signed URL that may have expired, regenerate from path stored in URL.
    // Best-effort: try to extract the path and refresh. If extraction fails, use as-is.
    let imageUrl = post.image_url;
    const match = /instagram-posts\/([^?]+)/.exec(imageUrl);
    if (match) {
      try {
        imageUrl = await refreshSignedUrl(decodeURIComponent(match[1]));
      } catch {
        // keep original
      }
    }

    const fullCaption = `${post.caption}\n\n${post.hashtags}`.trim();
    const result = await publishToInstagram({ imageUrl, caption: fullCaption });

    if (result.ok) {
      await supabaseAdmin
        .from("instagram_posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          ig_media_id: result.ig_media_id,
          publish_error: null,
        })
        .eq("id", data.id);
      return { ok: true as const, ig_media_id: result.ig_media_id };
    }

    if (result.reason === "not_configured") {
      return { ok: false as const, reason: "not_configured" as const, message: result.message };
    }

    await supabaseAdmin
      .from("instagram_posts")
      .update({ status: "failed", publish_error: result.message })
      .eq("id", data.id);
    return { ok: false as const, reason: "error" as const, message: result.message };
  });