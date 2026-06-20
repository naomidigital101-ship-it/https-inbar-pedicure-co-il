import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import {
  brainstormIdeasFn,
  generateCaptionFn,
  generateImageFn,
  uploadImageFn,
  savePost,
  listPosts,
  deletePost,
  publishPostFn,
  getInstagramStatus,
  type InstagramPostRow,
} from "@/lib/instagram.functions";
import type { Idea } from "@/lib/instagram.server";

export const Route = createFileRoute("/admin/instagram")({
  head: () => ({
    meta: [
      { title: "מנוע תוכן אינסטגרם | ענבר פרחי" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminInstagram,
});

type Tab = "ideas" | "compose" | "manage";
type PostType = "tip" | "product" | "before-after";

type Composition = {
  id?: string;
  idea: Idea | null;
  post_type: PostType;
  caption: string;
  hashtags: string;
  image_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
};

const blankCompose: Composition = {
  idea: null,
  post_type: "tip",
  caption: "",
  hashtags: "",
  image_url: null,
  before_image_url: null,
  after_image_url: null,
};

function AdminInstagram() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authState, setAuthState] = useState<"checking" | "ready">("checking");
  const [tab, setTab] = useState<Tab>("ideas");

  const isAdminFn = useServerFn(checkIsAdmin);
  const brainstormFn = useServerFn(brainstormIdeasFn);
  const captionFn = useServerFn(generateCaptionFn);
  const imageFn = useServerFn(generateImageFn);
  const uploadFn = useServerFn(uploadImageFn);
  const saveFn = useServerFn(savePost);
  const listFn = useServerFn(listPosts);
  const deleteFn = useServerFn(deletePost);
  const publishFn = useServerFn(publishPostFn);
  const statusFn = useServerFn(getInstagramStatus);

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (cancelled) return;
      if (error || !data.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const r = await isAdminFn();
        if (!cancelled && r.isAdmin) setAuthState("ready");
        else if (!cancelled) {
          toast.error("אין הרשאות");
          navigate({ to: "/" });
        }
      } catch {
        if (!cancelled) navigate({ to: "/admin/login" });
      }
    };
    verify();
    return () => {
      cancelled = true;
    };
  }, [isAdminFn, navigate]);

  const statusQ = useQuery({
    queryKey: ["ig-status"],
    queryFn: () => statusFn(),
    enabled: authState === "ready",
  });

  const postsQ = useQuery({
    queryKey: ["ig-posts"],
    queryFn: () => listFn(),
    enabled: authState === "ready",
  });

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [freeform, setFreeform] = useState("");

  const [compose, setCompose] = useState<Composition>(blankCompose);
  const [busy, setBusy] = useState<string | null>(null);

  const handleBrainstorm = async () => {
    setIdeasLoading(true);
    try {
      const r = await brainstormFn({ data: { freeform: freeform.trim() || undefined, count: 8 } });
      setIdeas(r.ideas);
      if (r.ideas.length === 0) toast.info("לא נוצרו רעיונות באיכות מספקת. נסה כיוון אחר.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה ביצירת רעיונות");
    } finally {
      setIdeasLoading(false);
    }
  };

  const startFromIdea = (idea: Idea) => {
    const pt: PostType = idea.post_type === "before-after" ? "before-after" : idea.post_type === "product" ? "product" : "tip";
    setCompose({ ...blankCompose, idea, post_type: pt });
    setTab("compose");
  };

  const handleGenCaption = async () => {
    setBusy("caption");
    try {
      const r = await captionFn({
        data: { idea: compose.idea, post_type: compose.post_type, topic: compose.idea?.hook },
      });
      setCompose((c) => ({ ...c, caption: r.caption, hashtags: r.hashtags }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה ביצירת כיתוב");
    } finally {
      setBusy(null);
    }
  };

  const handleGenImage = async () => {
    if (compose.post_type === "before-after") {
      toast.error("פוסט לפני/אחרי דורש העלאת תמונות אמיתיות, לא יצירה ב-AI.");
      return;
    }
    setBusy("image");
    try {
      const idea = compose.idea;
      const prompt = idea
        ? `${idea.hook}. ${idea.angle}. סוג פוסט: ${compose.post_type}.`
        : `אילוסטרציה לפוסט אינסטגרם בנושא טיפול בכף הרגל. סוג: ${compose.post_type}.`;
      const r = await imageFn({ data: { prompt } });
      setCompose((c) => ({ ...c, image_url: r.url }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה ביצירת תמונה");
    } finally {
      setBusy(null);
    }
  };

  const handleUpload = async (file: File, kind: "before" | "after" | "single") => {
    setBusy(`upload-${kind}`);
    try {
      const base64 = await fileToBase64(file);
      const r = await uploadFn({ data: { base64, contentType: file.type || "image/jpeg", kind } });
      setCompose((c) => ({
        ...c,
        ...(kind === "before"
          ? { before_image_url: r.url }
          : kind === "after"
            ? { after_image_url: r.url, image_url: r.url }
            : { image_url: r.url }),
      }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה בהעלאה");
    } finally {
      setBusy(null);
    }
  };

  const handleSave = async (status: "draft" | "scheduled") => {
    setBusy("save");
    try {
      const r = await saveFn({
        data: {
          id: compose.id,
          idea: compose.idea,
          post_type: compose.post_type,
          caption: compose.caption,
          hashtags: compose.hashtags,
          image_url: compose.image_url ?? null,
          before_image_url: compose.before_image_url ?? null,
          after_image_url: compose.after_image_url ?? null,
          status,
        },
      });
      setCompose((c) => ({ ...c, id: r.id }));
      toast.success(status === "draft" ? "נשמר כטיוטה" : "נשמר ונקבע לתזמון");
      qc.invalidateQueries({ queryKey: ["ig-posts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שמירה נכשלה");
    } finally {
      setBusy(null);
    }
  };

  const handlePublish = async (id: string) => {
    setBusy(`publish-${id}`);
    try {
      const r = await publishFn({ data: { id } });
      if (r.ok) toast.success("פורסם לאינסטגרם!");
      else if (r.reason === "not_configured") toast.error("חיבור אינסטגרם לא מוגדר");
      else toast.error(r.message);
      qc.invalidateQueries({ queryKey: ["ig-posts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "פרסום נכשל");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את הפוסט?")) return;
    try {
      await deleteFn({ data: { id } });
      toast.success("נמחק");
      qc.invalidateQueries({ queryKey: ["ig-posts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "שגיאה");
    }
  };

  const editPost = (p: InstagramPostRow) => {
    setCompose({
      id: p.id,
      idea: p.idea,
      post_type: (p.post_type as PostType) ?? "tip",
      caption: p.caption ?? "",
      hashtags: p.hashtags ?? "",
      image_url: p.image_url,
      before_image_url: p.before_image_url,
      after_image_url: p.after_image_url,
    });
    setTab("compose");
  };

  if (authState !== "ready") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7]" dir="rtl">
        <p className="text-sm font-bold text-[#6b5f55]">בודק הרשאות...</p>
      </div>
    );
  }

  const igConfigured = statusQ.data?.configured ?? false;

  return (
    <div className="min-h-screen bg-[#fdfbf7]" dir="rtl">
      <header className="border-b border-[#b8dcd4] bg-[#e9f4f1]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
              [ SYS // INSTAGRAM ]
            </span>
            <h1 className="text-lg font-black text-[#1d3a35]">מנוע תוכן אינסטגרם</h1>
          </div>
          <button
            onClick={() => navigate({ to: "/admin" })}
            className="border border-[#b8dcd4] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#5a4f48] transition-colors hover:border-[#5fa898] hover:text-[#5fa898]"
          >
            ← חזרה לאדמין
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        {!igConfigured && (
          <div className="mb-6 border border-[#5fa898] bg-[#e9f4f1] p-4">
            <p className="text-sm font-black text-[#1d3a35]">חיבור אינסטגרם לא מוגדר</p>
            <p className="mt-1 text-xs text-[#5a4f48]">
              ניתן ליצור, לערוך ולשמור פוסטים. כדי לפרסם ישירות לאינסטגרם, יש להוסיף שני סודות בהגדרות הפרויקט →
              Secrets: <strong>INSTAGRAM_ACCESS_TOKEN</strong> ו-<strong>IG_BUSINESS_ACCOUNT_ID</strong>.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-[#b8dcd4]">
          {(
            [
              ["ideas", "רעיונות"],
              ["compose", "יצירת פוסט"],
              ["manage", `ניהול (${postsQ.data?.posts.length ?? 0})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                tab === key
                  ? "border-b-2 border-[#5fa898] text-[#1d3a35]"
                  : "text-[#6b5f55] hover:text-[#5fa898]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "ideas" && (
          <IdeasTab
            ideas={ideas}
            loading={ideasLoading}
            freeform={freeform}
            setFreeform={setFreeform}
            onBrainstorm={handleBrainstorm}
            onPick={startFromIdea}
          />
        )}

        {tab === "compose" && (
          <ComposeTab
            compose={compose}
            setCompose={setCompose}
            busy={busy}
            onGenCaption={handleGenCaption}
            onGenImage={handleGenImage}
            onUpload={handleUpload}
            onSave={handleSave}
          />
        )}

        {tab === "manage" && (
          <ManageTab
            posts={postsQ.data?.posts ?? []}
            loading={postsQ.isLoading}
            onEdit={editPost}
            onPublish={handlePublish}
            onDelete={handleDelete}
            busy={busy}
            igConfigured={igConfigured}
          />
        )}
      </main>
    </div>
  );
}

/* ---------- Ideas Tab ---------- */

function IdeasTab({
  ideas,
  loading,
  freeform,
  setFreeform,
  onBrainstorm,
  onPick,
}: {
  ideas: Idea[];
  loading: boolean;
  freeform: string;
  setFreeform: (v: string) => void;
  onBrainstorm: () => void;
  onPick: (i: Idea) => void;
}) {
  return (
    <div>
      <div className="mb-6 border border-[#b8dcd4] bg-white p-4">
        <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">
          כיוון או נושא (אופציונלי)
        </label>
        <textarea
          value={freeform}
          onChange={(e) => setFreeform(e.target.value)}
          placeholder="לדוגמה: רגליים של חיילים אחרי מסע / ציפורן חודרנית בילדים / הכנה לטיול בים..."
          className="w-full resize-y border border-[#b8dcd4] bg-[#fdfbf7] p-3 text-sm text-[#1d3a35] focus:border-[#5fa898] focus:outline-none"
          rows={2}
        />
        <button
          onClick={onBrainstorm}
          disabled={loading}
          className="mt-3 bg-[#5fa898] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#1d3a35] disabled:opacity-60"
        >
          {loading ? "מייצרת רעיונות..." : "ייצרי רעיונות"}
        </button>
      </div>

      {ideas.length === 0 ? (
        <p className="text-sm text-[#6b5f55]">לחצי על "ייצרי רעיונות" כדי להתחיל. התוצאות יופיעו ככרטיסים.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((i, idx) => (
            <div key={idx} className="flex flex-col border border-[#b8dcd4] bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="rounded bg-[#e9f4f1] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#1d3a35]">
                  {labelForType(i.post_type)}
                </span>
                <span className="text-[10px] font-black text-[#5fa898]">
                  ייחודיות {i.originality_score}/10
                </span>
              </div>
              <h3 className="mb-2 text-base font-black leading-tight text-[#1d3a35]">{i.hook}</h3>
              <p className="mb-2 text-sm text-[#5a4f48]">{i.angle}</p>
              <p className="mb-2 text-xs text-[#6b5f55]">
                <strong>קהל:</strong> {i.audience}
              </p>
              <p className="mb-4 flex-1 text-xs italic text-[#6b5f55]">{i.uniqueness_rationale}</p>
              <button
                onClick={() => onPick(i)}
                className="mt-auto bg-[#1d3a35] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#5fa898]"
              >
                צרי פוסט מהרעיון →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function labelForType(t: string): string {
  return (
    {
      tip: "טיפ",
      product: "מוצר",
      "before-after": "לפני/אחרי",
      myth: "מיתוס",
      story: "סיפור",
    } as Record<string, string>
  )[t] ?? t;
}

/* ---------- Compose Tab ---------- */

function ComposeTab({
  compose,
  setCompose,
  busy,
  onGenCaption,
  onGenImage,
  onUpload,
  onSave,
}: {
  compose: Composition;
  setCompose: React.Dispatch<React.SetStateAction<Composition>>;
  busy: string | null;
  onGenCaption: () => void;
  onGenImage: () => void;
  onUpload: (f: File, kind: "before" | "after" | "single") => void;
  onSave: (s: "draft" | "scheduled") => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
      <div className="space-y-4">
        <div className="border border-[#b8dcd4] bg-white p-4">
          <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">
            סוג פוסט
          </label>
          <div className="flex gap-2">
            {(["tip", "product", "before-after"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCompose((c) => ({ ...c, post_type: t }))}
                className={`flex-1 border px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                  compose.post_type === t
                    ? "border-[#5fa898] bg-[#5fa898] text-[#fdfbf7]"
                    : "border-[#b8dcd4] bg-white text-[#5a4f48]"
                }`}
              >
                {labelForType(t)}
              </button>
            ))}
          </div>
        </div>

        {compose.idea && (
          <div className="border border-[#b8dcd4] bg-[#e9f4f1] p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#5fa898]">בסיס הרעיון</p>
            <p className="mt-1 text-sm font-black text-[#1d3a35]">{compose.idea.hook}</p>
            <p className="mt-1 text-xs text-[#5a4f48]">{compose.idea.angle}</p>
          </div>
        )}

        {/* Caption editor */}
        <div className="border border-[#b8dcd4] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">כיתוב</label>
            <button
              onClick={onGenCaption}
              disabled={busy === "caption"}
              className="text-xs font-black text-[#5fa898] hover:text-[#1d3a35] disabled:opacity-60"
            >
              {busy === "caption" ? "..." : compose.caption ? "↻ חדשי" : "✨ ייצרי"}
            </button>
          </div>
          <textarea
            value={compose.caption}
            onChange={(e) => setCompose((c) => ({ ...c, caption: e.target.value }))}
            placeholder="הכיתוב יופיע כאן. ניתן לערוך ידנית."
            rows={8}
            className="w-full resize-y border border-[#b8dcd4] bg-[#fdfbf7] p-3 text-sm text-[#1d3a35] focus:border-[#5fa898] focus:outline-none"
          />
          <label className="mt-3 mb-1 block text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">
            האשטגים
          </label>
          <textarea
            value={compose.hashtags}
            onChange={(e) => setCompose((c) => ({ ...c, hashtags: e.target.value }))}
            placeholder="#פדיקור_טיפולי #בית_אל ..."
            rows={2}
            className="w-full resize-y border border-[#b8dcd4] bg-[#fdfbf7] p-3 text-sm text-[#1d3a35] focus:border-[#5fa898] focus:outline-none"
          />
        </div>

        {/* Image */}
        <div className="border border-[#b8dcd4] bg-white p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">תמונה</p>
          {compose.post_type === "before-after" ? (
            <div className="grid grid-cols-2 gap-3">
              <UploadSlot
                label="לפני"
                url={compose.before_image_url}
                busy={busy === "upload-before"}
                onPick={(f) => onUpload(f, "before")}
              />
              <UploadSlot
                label="אחרי"
                url={compose.after_image_url}
                busy={busy === "upload-after"}
                onPick={(f) => onUpload(f, "after")}
              />
              <p className="col-span-2 text-[11px] text-[#6b5f55]">
                לפוסטים לפני/אחרי: יש להעלות תמונות אמיתיות. תמונת "אחרי" תפורסם כתמונה הראשית; תמונת "לפני" נשמרת לצורך הצגה משולבת בפוסטים מרובי-תמונות בעתיד.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onGenImage}
                  disabled={busy === "image"}
                  className="bg-[#5fa898] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#1d3a35] disabled:opacity-60"
                >
                  {busy === "image" ? "מייצרת תמונה..." : "✨ ייצרי תמונה"}
                </button>
                <UploadInline busy={busy === "upload-single"} onPick={(f) => onUpload(f, "single")} />
              </div>
              {compose.image_url && (
                <div className="aspect-square w-full max-w-md overflow-hidden border border-[#b8dcd4] bg-[#fdfbf7]">
                  <img src={compose.image_url} alt="תצוגה מקדימה" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onSave("draft")}
            disabled={busy === "save"}
            className="bg-[#1d3a35] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#5fa898] disabled:opacity-60"
          >
            שמרי כטיוטה
          </button>
          <button
            onClick={() => onSave("scheduled")}
            disabled={busy === "save" || !compose.image_url}
            className="border border-[#5fa898] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#5fa898] transition-colors hover:bg-[#5fa898] hover:text-[#fdfbf7] disabled:opacity-60"
          >
            שמרי + סמני לפרסום
          </button>
        </div>
      </div>

      {/* IG-style preview */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#5a4f48]">תצוגה מקדימה</p>
        <InstagramPreview compose={compose} />
      </div>
    </div>
  );
}

function UploadSlot({
  label,
  url,
  busy,
  onPick,
}: {
  label: string;
  url: string | null;
  busy: boolean;
  onPick: (f: File) => void;
}) {
  return (
    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#b8dcd4] bg-[#fdfbf7] text-center transition-colors hover:border-[#5fa898]">
      {url ? (
        <img src={url} alt={label} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-black uppercase tracking-wider text-[#6b5f55]">
          {busy ? "מעלה..." : `+ ${label}`}
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
    </label>
  );
}

function UploadInline({ busy, onPick }: { busy: boolean; onPick: (f: File) => void }) {
  return (
    <label className="cursor-pointer border border-[#b8dcd4] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#5a4f48] transition-colors hover:border-[#5fa898] hover:text-[#5fa898]">
      {busy ? "מעלה..." : "↑ העלי תמונה"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
    </label>
  );
}

function InstagramPreview({ compose }: { compose: Composition }) {
  const previewUrl = compose.image_url ?? compose.after_image_url ?? compose.before_image_url;
  return (
    <div className="border border-[#b8dcd4] bg-white">
      <div className="flex items-center gap-2 p-3">
        <div className="h-8 w-8 rounded-full bg-[#5fa898]" />
        <span className="text-xs font-black text-[#1d3a35]">inbar_pedicure</span>
      </div>
      <div className="aspect-square w-full bg-[#fdfbf7]">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[#6b5f55]">
            תצוגה מקדימה תופיע כאן
          </div>
        )}
      </div>
      <div className="max-h-72 overflow-y-auto p-3">
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-[#1d3a35]">
          {compose.caption || "(הכיתוב יופיע כאן)"}
        </p>
        {compose.hashtags && (
          <p className="mt-2 whitespace-pre-wrap text-xs text-[#5fa898]">{compose.hashtags}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Manage Tab ---------- */

function ManageTab({
  posts,
  loading,
  onEdit,
  onPublish,
  onDelete,
  busy,
  igConfigured,
}: {
  posts: InstagramPostRow[];
  loading: boolean;
  onEdit: (p: InstagramPostRow) => void;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  busy: string | null;
  igConfigured: boolean;
}) {
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "published" | "failed">("all");
  const filtered = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.status === filter)),
    [posts, filter],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "draft", "scheduled", "published", "failed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
              filter === s ? "bg-[#5fa898] text-[#fdfbf7]" : "border border-[#b8dcd4] text-[#5a4f48]"
            }`}
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-sm text-[#6b5f55]">טוען...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[#6b5f55]">אין פוסטים בקטגוריה זו.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col border border-[#b8dcd4] bg-white">
              <div className="aspect-square w-full bg-[#fdfbf7]">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6b5f55]">
                    ללא תמונה
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <span
                  className={`mb-2 inline-block w-fit rounded px-2 py-1 text-[9px] font-black uppercase tracking-wider ${badgeClass(p.status)}`}
                >
                  {statusLabel(p.status)}
                </span>
                <p className="line-clamp-3 flex-1 text-xs text-[#1d3a35]">{p.caption || "(ללא כיתוב)"}</p>
                {p.publish_error && (
                  <p className="mt-2 text-[10px] text-red-600">שגיאה: {p.publish_error}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="border border-[#b8dcd4] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#5a4f48] hover:border-[#5fa898] hover:text-[#5fa898]"
                  >
                    ערכי
                  </button>
                  {p.status !== "published" && (
                    <button
                      onClick={() => onPublish(p.id)}
                      disabled={!p.image_url || busy === `publish-${p.id}` || !igConfigured}
                      title={!igConfigured ? "חיבור אינסטגרם לא מוגדר" : ""}
                      className="bg-[#5fa898] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#1d3a35] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy === `publish-${p.id}` ? "מפרסמת..." : "פרסמי"}
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(p.id)}
                    className="border border-red-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50"
                  >
                    מחקי
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusLabel(s: string): string {
  return (
    {
      all: "הכל",
      draft: "טיוטות",
      scheduled: "מתוזמנים",
      published: "פורסמו",
      failed: "נכשלו",
    } as Record<string, string>
  )[s] ?? s;
}

function badgeClass(s: string): string {
  return (
    {
      draft: "bg-[#e9f4f1] text-[#5a4f48]",
      scheduled: "bg-[#fff3cd] text-[#856404]",
      published: "bg-[#5fa898] text-[#fdfbf7]",
      failed: "bg-red-100 text-red-700",
    } as Record<string, string>
  )[s] ?? "bg-gray-100 text-gray-700";
}

/* ---------- helpers ---------- */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}