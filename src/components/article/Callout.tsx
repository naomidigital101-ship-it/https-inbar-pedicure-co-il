import type { CalloutType } from "@/lib/articles";

const styles: Record<
  CalloutType,
  { label: string; border: string; accent: string; icon: string }
> = {
  tip: {
    label: "טיפ",
    border: "border-r-4 border-[#e63000]",
    accent: "text-[#e63000]",
    icon: "★",
  },
  warning: {
    label: "אזהרה",
    border: "border-r-4 border-[#f0f0f0]",
    accent: "text-[#f0f0f0]",
    icon: "!",
  },
  saving: {
    label: "חיסכון",
    border: "border-r-4 border-[#3ad17d]",
    accent: "text-[#3ad17d]",
    icon: "₪",
  },
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
      className={`my-8 flex gap-4 bg-[#111] p-6 ${s.border}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center border border-current text-lg font-black ${s.accent}`}
      >
        {s.icon}
      </span>
      <div className="flex-1">
        <div
          className={`mb-2 text-[10px] font-black uppercase tracking-widest ${s.accent}`}
        >
          {s.label}
        </div>
        <h4 className="mb-2 text-base font-black text-[#f0f0f0]">{title}</h4>
        <p className="text-sm font-bold leading-relaxed text-[#999]">{body}</p>
      </div>
    </aside>
  );
}