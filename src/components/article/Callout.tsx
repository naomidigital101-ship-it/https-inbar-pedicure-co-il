import type { CalloutType } from "@/lib/articles";

const styles: Record<
  CalloutType,
  { label: string; accent: string; bg: string; icon: string }
> = {
  tip: { label: "טיפ", accent: "var(--green-700)", bg: "var(--green-50)", icon: "★" },
  warning: { label: "אזהרה", accent: "#9B3A28", bg: "color-mix(in oklab, #C4634F 10%, var(--paper))", icon: "!" },
  saving: { label: "חיסכון", accent: "var(--accent-gold)", bg: "color-mix(in oklab, var(--accent-gold) 10%, var(--paper))", icon: "₪" },
};

export function Callout({
  type,
  title,
  body,
}: {
  type: CalloutType;
  title: string;
  body: string;
}) {
  const s = styles[type];
  return (
    <aside
      role="note"
      aria-label={s.label}
      className="my-8 flex gap-4 p-6"
      style={{ background: s.bg, borderInlineStart: `3px solid ${s.accent}`, borderRadius: 16 }}
    >
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center"
        style={{
          color: s.accent,
          border: `1px solid ${s.accent}`,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "var(--font-serif)",
          borderRadius: 999,
        }}
      >
        {s.icon}
      </span>
      <div className="flex-1">
        <div
          className="mb-2"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: s.accent,
          }}
        >
          {s.label}
        </div>
        <h4
          className="mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--ink-900)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h4>
        <p style={{ color: "var(--ink-600)", fontSize: 14.5, lineHeight: 1.7 }}>{body}</p>
      </div>
    </aside>
  );
}