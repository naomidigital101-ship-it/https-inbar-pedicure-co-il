/**
 * בורר ומעלה תמונות.
 *
 * ההעלאה נעשית מהדפדפן ישירות ל-Supabase Storage תחת הסשן של המנהלת,
 * ולכן מדיניות ה-RLS על הבאקט היא מה שמאשר אותה — לא בדיקה ב-UI.
 * אחרי ההעלאה נרשמת שורה בטבלת media כדי שהתמונה תופיע בספרייה.
 */

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Upload, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminListMedia, adminRegisterMedia, adminDeleteMedia } from "@/lib/admin-cms.functions";
import { Button, Field, IconButton, TextInput } from "@/components/admin/AdminUI";

const BUCKET = "site-media";
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];

export type MediaItem = {
  id: string;
  path: string;
  url: string;
  alt: string | null;
  title: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  folder: string;
  created_at: string;
};

export function useMediaLibrary() {
  const listFn = useServerFn(adminListMedia);
  return useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => listFn(),
  });
}

/** מנקה שם קובץ לנתיב בטוח: עברית ורווחים לא שורדים ב-Storage. */
function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext =
    dot > -1
      ? name
          .slice(dot + 1)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      : "jpg";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${rand}.${ext}`;
}

export function useUploadMedia(folder = "general") {
  const qc = useQueryClient();
  const registerFn = useServerFn(adminRegisterMedia);

  return useMutation({
    mutationFn: async (file: File): Promise<MediaItem> => {
      if (!ALLOWED.includes(file.type)) {
        throw new Error("אפשר להעלות תמונות בלבד (JPG, PNG, WEBP, AVIF, SVG)");
      }
      if (file.size > MAX_BYTES) {
        throw new Error("הקובץ גדול מ-8MB. כדאי להקטין אותו לפני ההעלאה.");
      }

      const path = `${folder}/${safeName(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw new Error(upErr.message);

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const url = pub.publicUrl;

      await registerFn({
        data: {
          path,
          url,
          alt: null,
          title: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          folder,
        },
      });

      return {
        id: path,
        path,
        url,
        alt: null,
        title: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        folder,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "media"] }),
  });
}

/** שדה תמונה יחיד: תצוגה מקדימה, העלאה, בחירה מהספרייה או ניקוי. */
export function MediaPickerField({
  label,
  hint,
  value,
  onChange,
  folder = "general",
}: {
  label: string;
  hint?: string | null;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia(folder);

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="flex h-[104px] w-[148px] flex-shrink-0 items-center justify-center overflow-hidden"
          style={{
            border: "1px solid var(--stone-300)",
            borderRadius: 10,
            background: "var(--stone-50)",
          }}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[12.5px]" style={{ color: "var(--ink-600)" }}>
              אין תמונה
            </span>
          )}
        </div>

        <div className="flex min-w-[220px] flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              loading={upload.isPending}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4" aria-hidden />
              העלאת תמונה
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              בחירה מהספרייה
            </Button>
            {value && (
              <Button type="button" variant="ghost" onClick={() => onChange("")}>
                הסרה
              </Button>
            )}
          </div>

          <TextInput
            ltr
            value={value}
            placeholder="או הדבקת כתובת תמונה"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            const item = await upload.mutateAsync(file);
            onChange(item.url);
            toast.success("התמונה הועלתה");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "ההעלאה נכשלה");
          }
        }}
      />

      {open && (
        <MediaLibraryDialog
          onClose={() => setOpen(false)}
          onPick={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </Field>
  );
}

export function MediaLibraryDialog({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const query = useMediaLibrary();
  const items = (query.data?.media ?? []) as MediaItem[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,40,38,0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-label="ספריית תמונות"
      onClick={onClose}
    >
      <div
        className="max-h-[82vh] w-full max-w-3xl overflow-auto bg-white p-5"
        style={{ borderRadius: 14 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-[18px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink-900)" }}
          >
            ספריית התמונות
          </h2>
          <IconButton label="סגירה" onClick={onClose}>
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}
        {!query.isLoading && items.length === 0 && (
          <p style={{ color: "var(--ink-600)" }}>
            עדיין אין תמונות בספרייה. אפשר להעלות תמונה חדשה מהשדה עצמו.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.url)}
              className="group overflow-hidden text-right"
              style={{ border: "1px solid var(--stone-100)", borderRadius: 10 }}
            >
              <img
                src={m.url}
                alt={m.alt ?? ""}
                loading="lazy"
                className="h-[104px] w-full object-cover"
              />
              <span
                className="block truncate px-2 py-1.5 text-[12px]"
                style={{ color: "var(--ink-600)" }}
              >
                {m.title ?? m.path}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** כרטיס מחיקה לשימוש בעמוד ספריית התמונות. */
export function MediaDeleteButton({ item }: { item: MediaItem }) {
  const qc = useQueryClient();
  const deleteFn = useServerFn(adminDeleteMedia);
  const del = useMutation({
    mutationFn: () => deleteFn({ data: { id: item.id, path: item.path } }),
    onSuccess: () => {
      toast.success("התמונה נמחקה");
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "המחיקה נכשלה"),
  });

  return (
    <IconButton
      label="מחיקת תמונה"
      danger
      onClick={() => {
        if (confirm("למחוק את התמונה? אם היא מוצגת באתר, המקום שלה יישאר ריק.")) {
          del.mutate();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </IconButton>
  );
}
