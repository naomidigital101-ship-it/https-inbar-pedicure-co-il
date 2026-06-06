import { useEffect, useState } from "react";
import {
  Accessibility,
  X,
  ZoomIn,
  ZoomOut,
  Contrast,
  Link2,
  Heading,
  Type,
  PauseOctagon,
  MousePointer2,
  Eye,
  Palette,
  RotateCcw,
} from "lucide-react";

type State = {
  fontStep: 0 | 1 | 2 | 3 | 4;
  contrast: boolean;
  invert: boolean;
  grayscale: boolean;
  links: boolean;
  headings: boolean;
  readable: boolean;
  noMotion: boolean;
  cursor: boolean;
};

const DEFAULT: State = {
  fontStep: 0,
  contrast: false,
  invert: false,
  grayscale: false,
  links: false,
  headings: false,
  readable: false,
  noMotion: false,
  cursor: false,
};

const FONT_CLASSES = ["", "a11y-font-110", "a11y-font-120", "a11y-font-135", "a11y-font-150"];
const STORAGE_KEY = "a11y-prefs";

function applyToHtml(s: State) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  FONT_CLASSES.forEach((c) => c && html.classList.remove(c));
  if (FONT_CLASSES[s.fontStep]) html.classList.add(FONT_CLASSES[s.fontStep]);
  html.classList.toggle("a11y-contrast", s.contrast);
  html.classList.toggle("a11y-invert", s.invert);
  html.classList.toggle("a11y-grayscale", s.grayscale);
  html.classList.toggle("a11y-links", s.links);
  html.classList.toggle("a11y-headings", s.headings);
  html.classList.toggle("a11y-readable", s.readable);
  html.classList.toggle("a11y-no-motion", s.noMotion);
  html.classList.toggle("a11y-cursor", s.cursor);
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULT, ...JSON.parse(raw) } as State;
        setState(parsed);
        applyToHtml(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyToHtml(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (k: keyof State) =>
    setState((s) => ({ ...s, [k]: !s[k] } as State));

  const fontUp = () =>
    setState((s) => ({ ...s, fontStep: Math.min(4, s.fontStep + 1) as State["fontStep"] }));
  const fontDown = () =>
    setState((s) => ({ ...s, fontStep: Math.max(0, s.fontStep - 1) as State["fontStep"] }));

  const reset = () => setState(DEFAULT);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "סגור תפריט נגישות" : "פתח תפריט נגישות"}
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="fixed bottom-4 right-4 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#0066cc] text-white shadow-lg ring-2 ring-white hover:bg-[#0052a3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc]"
        style={{ fontFamily: "Heebo, sans-serif" }}
      >
        <Accessibility className="h-7 w-7" aria-hidden="true" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="a11y-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
            dir="rtl"
            className="fixed bottom-20 right-4 z-[9999] max-h-[80vh] w-[min(360px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-foreground/20 bg-white text-black shadow-2xl"
            style={{ fontFamily: "Heebo, sans-serif" }}
          >
            <div className="flex items-center justify-between border-b border-black/10 bg-[#0066cc] px-4 py-3 text-white">
              <h2 id="a11y-title" className="text-base font-bold">
                תפריט נגישות
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="סגור תפריט נגישות"
                className="rounded p-1 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-3">
              <div className="mb-3 rounded-lg border border-black/10 p-2">
                <p className="mb-2 text-xs font-bold text-black/70">גודל טקסט</p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={fontDown}
                    disabled={state.fontStep === 0}
                    aria-label="הקטן גודל טקסט"
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border-2 border-black/20 bg-white px-3 py-2 text-sm font-bold hover:bg-black/5 disabled:opacity-40"
                  >
                    <ZoomOut className="h-4 w-4" aria-hidden="true" /> הקטן
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-bold" aria-live="polite">
                    {[100, 110, 120, 135, 150][state.fontStep]}%
                  </span>
                  <button
                    type="button"
                    onClick={fontUp}
                    disabled={state.fontStep === 4}
                    aria-label="הגדל גודל טקסט"
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border-2 border-black/20 bg-white px-3 py-2 text-sm font-bold hover:bg-black/5 disabled:opacity-40"
                  >
                    <ZoomIn className="h-4 w-4" aria-hidden="true" /> הגדל
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ToggleBtn
                  active={state.contrast}
                  onClick={() => toggle("contrast")}
                  icon={<Contrast className="h-5 w-5" aria-hidden="true" />}
                  label="ניגודיות גבוהה"
                />
                <ToggleBtn
                  active={state.invert}
                  onClick={() => toggle("invert")}
                  icon={<Eye className="h-5 w-5" aria-hidden="true" />}
                  label="היפוך צבעים"
                />
                <ToggleBtn
                  active={state.grayscale}
                  onClick={() => toggle("grayscale")}
                  icon={<Palette className="h-5 w-5" aria-hidden="true" />}
                  label="גווני אפור"
                />
                <ToggleBtn
                  active={state.links}
                  onClick={() => toggle("links")}
                  icon={<Link2 className="h-5 w-5" aria-hidden="true" />}
                  label="הדגשת קישורים"
                />
                <ToggleBtn
                  active={state.headings}
                  onClick={() => toggle("headings")}
                  icon={<Heading className="h-5 w-5" aria-hidden="true" />}
                  label="הדגשת כותרות"
                />
                <ToggleBtn
                  active={state.readable}
                  onClick={() => toggle("readable")}
                  icon={<Type className="h-5 w-5" aria-hidden="true" />}
                  label="גופן קריא"
                />
                <ToggleBtn
                  active={state.noMotion}
                  onClick={() => toggle("noMotion")}
                  icon={<PauseOctagon className="h-5 w-5" aria-hidden="true" />}
                  label="עצירת אנימציות"
                />
                <ToggleBtn
                  active={state.cursor}
                  onClick={() => toggle("cursor")}
                  icon={<MousePointer2 className="h-5 w-5" aria-hidden="true" />}
                  label="סמן גדול"
                />
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border-2 border-black/30 bg-black/5 px-3 py-2 text-sm font-bold hover:bg-black/10"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                איפוס הגדרות
              </button>

              <a
                href="/accessibility"
                className="mt-3 block text-center text-sm font-bold text-[#0066cc] underline hover:text-[#004080]"
              >
                הצהרת נגישות
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "flex flex-col items-center justify-center gap-1 rounded-md border-2 px-2 py-3 text-center text-xs font-bold transition-colors",
        active
          ? "border-[#0066cc] bg-[#0066cc] text-white"
          : "border-black/20 bg-white text-black hover:bg-black/5",
      ].join(" ")}
    >
      {icon}
      <span className="leading-tight">{label}</span>
    </button>
  );
}