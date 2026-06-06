const items = [
  "החלפת שמן KTM 250",
  "כיוון מתלים ENDURO",
  "מסלולי צפון ישראל",
  "KTM VS HUSQVARNA",
  "בדיקת שרשרת",
  "תחזוקה שנתית",
];

export function TickerBar() {
  return (
    <div
      className="overflow-hidden whitespace-nowrap border-y border-[#e63000] bg-[#e63000] py-2 text-white"
      role="marquee"
      aria-label="נושאים פופולריים באתר"
    >
      <div className="flex gap-12 px-8 text-xs font-black uppercase tracking-tighter">
        <span>{">>>"} SYSTEM CHECK: OPTIMAL</span>
        {items.map((it, i) => (
          <span key={it} className="flex items-center gap-12">
            <span aria-hidden="true">▪</span>
            <span>{it}</span>
            {i === items.length - 1 ? null : null}
          </span>
        ))}
      </div>
    </div>
  );
}