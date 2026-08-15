import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import {
  MediaDeleteButton,
  useMediaLibrary,
  useUploadMedia,
  type MediaItem,
} from "@/components/admin/MediaPicker";
import { Button, Card, EmptyState, PageHeader } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "תמונות | ניהול" }] }),
  component: MediaAdmin,
});

function MediaAdmin() {
  const query = useMediaLibrary();
  const upload = useUploadMedia("general");
  const inputRef = useRef<HTMLInputElement>(null);
  const items = (query.data?.media ?? []) as MediaItem[];

  return (
    <>
      <PageHeader
        title="תמונות"
        description="כל התמונות שהעלית. אפשר להעלות כאן מראש ואז לבחור אותן בכל מקום באתר."
        actions={
          <Button
            variant="primary"
            loading={upload.isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" aria-hidden />
            העלאת תמונה
          </Button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          for (const file of files) {
            try {
              await upload.mutateAsync(file);
            } catch (err) {
              toast.error(`${file.name}: ${err instanceof Error ? err.message : "ההעלאה נכשלה"}`);
            }
          }
          if (files.length) toast.success("ההעלאה הסתיימה");
        }}
      />

      {query.isLoading && <p style={{ color: "var(--ink-600)" }}>טוענת...</p>}

      {!query.isLoading && items.length === 0 && (
        <EmptyState title="הספרייה ריקה" hint="תמונות שיועלו מתוך עמודי העריכה יופיעו גם כאן." />
      )}

      {items.length > 0 && (
        <Card>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {items.map((m) => (
              <figure
                key={m.id}
                className="m-0 overflow-hidden"
                style={{ border: "1px solid var(--stone-100)", borderRadius: 10 }}
              >
                <img
                  src={m.url}
                  alt={m.alt ?? ""}
                  loading="lazy"
                  className="h-[120px] w-full object-cover"
                />
                <figcaption className="flex items-center justify-between gap-2 px-2 py-2">
                  <span
                    className="min-w-0 flex-1 truncate text-[12px]"
                    style={{ color: "var(--ink-600)" }}
                    title={m.title ?? m.path}
                  >
                    {m.title ?? m.path}
                  </span>
                  <MediaDeleteButton item={m} />
                </figcaption>
              </figure>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
