import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SlugOption = { value: string; label: string };

const CONCERN_OPTIONS: readonly SlugOption[] = [
  { value: "fungus", label: "פטרת ציפורן או עור" },
  { value: "ingrown-nails", label: "ציפורן חודרנית או כואבת" },
  { value: "corns", label: "יבלות וקאלוסים" },
  { value: "cracked-heels", label: "סדקים בעקבים" },
  { value: "onycholysis", label: "ציפורן מנותקת או פגועה" },
  { value: "diabetic-feet", label: "טיפול עדין לחולי סוכרת" },
];

const AUDIENCE_OPTIONS: readonly SlugOption[] = [
  { value: "diabetic-feet", label: "חולי סוכרת" },
  { value: "sports-feet", label: "ספורטאים וחיילים" },
  { value: "corns", label: "מבוגרים" },
  { value: "fungus", label: "כללי" },
];

const TREATMENT_OPTIONS: readonly SlugOption[] = [
  { value: "fungus", label: "טיפול בפטרת" },
  { value: "ingrown-nails", label: "אורטוניקסיה" },
  { value: "onycholysis", label: "שיקום ציפורן BIO" },
  { value: "diabetic-feet", label: "פרוטוקול אגודת אייל" },
  { value: "corns", label: "טיפול ביבלות" },
  { value: "cracked-heels", label: "טיפול בסדקים" },
];

export function TreatmentFinder() {
  const navigate = useNavigate();
  const [concern, setConcern] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [treatment, setTreatment] = useState<string>("");

  const handleSubmit = () => {
    const slug = treatment || concern || audience;
    if (slug) {
      void navigate({ to: "/services/$slug", params: { slug } });
    } else {
      void navigate({ to: "/services" });
    }
  };

  return (
    <section className="relative z-20 -mt-10 px-6 md:-mt-14" aria-label="מציאת טיפול לפי תחום">
      <div className="mx-auto max-w-[1180px]">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:gap-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-copper">
                מה מטריד אותך
              </label>
              <Select value={concern} onValueChange={setConcern}>
                <SelectTrigger className="h-12 w-full rounded-xl border-border bg-surface-warm text-right text-sm text-ink">
                  <SelectValue placeholder="בחרי תחום" />
                </SelectTrigger>
                <SelectContent>
                  {CONCERN_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-right">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-copper">
                סוג מטופל
              </label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="h-12 w-full rounded-xl border-border bg-surface-warm text-right text-sm text-ink">
                  <SelectValue placeholder="בחרי קהל" />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-right">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-copper">
                סוג טיפול
              </label>
              <Select value={treatment} onValueChange={setTreatment}>
                <SelectTrigger className="h-12 w-full rounded-xl border-border bg-surface-warm text-right text-sm text-ink">
                  <SelectValue placeholder="בחרי טיפול" />
                </SelectTrigger>
                <SelectContent>
                  {TREATMENT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-right">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-deep px-7 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-primary active:scale-[0.98] md:w-auto"
              >
                <Search className="h-4 w-4" aria-hidden />
                מצאי טיפול
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}