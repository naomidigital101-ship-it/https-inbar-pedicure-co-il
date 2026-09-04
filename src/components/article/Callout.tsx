import type { CalloutType } from "@/lib/articles";
import { BODONI, C } from "./editorial";

const styles: Record<CalloutType, { label: string; accent: string; bg: string; icon: string }> = {
  tip: { label: "לתשומת ליבכם", accent: C.green, bg: C.cream, icon: "·" },
  warning: { label: "אזהרה", accent: C.warn, bg: C.paper, icon: "!" },
  saving: { label: "חיסכון", accent: C.gold, bg: C.cream, icon: "₪" },
};

export function Callout({ type, title, body }: { type: CalloutType; title: string; body: string }) {
  const s = styles[type];
  return (
    <aside
      role="note"
      aria-label={s.label}
      className="my-10 flex gap-5 p-7"
      style={{
        background: s.bg,
        border: `1px solid ${C.line}`,
        borderInlineStart: `2px solid ${s.accent}`,
      }}
    >
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center"
        style={{
          color: s.accent,
          border: `1px solid ${s.accent}`,
          fontSize: 18,
          fontWeight: 400,
          fontFamily: BODONI,
        }}
      >
        {s.icon}
      </span>
      <div className="flex-1">
        <div
          className="mb-3"
          style={{
            fontSize: 11.5,
            letterSpacing: "0.28em",
            fontWeight: 400,
            color: s.accent,
          }}
        >
          {s.label}
        </div>
        <h4
          className="mb-2"
          style={{
            fontWeight: 600,
            fontSize: "1.05rem",
            color: C.ink,
            lineHeight: 1.55,
          }}
        >
          {title}
        </h4>
        <p style={{ color: C.muted, fontSize: 14.5, lineHeight: 1.9, fontWeight: 300 }}>{body}</p>
      </div>
    </aside>
  );
}
