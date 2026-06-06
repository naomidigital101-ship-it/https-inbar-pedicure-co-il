export function InArticleCTA() {
  return (
    <aside className="my-12 border border-[#b8dcd4] bg-[#fdfbf7] p-8 md:p-10">
      <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
        [ MOD: PRO // GARAGE ]
      </div>
      <h3 className="mb-3 text-2xl font-black leading-tight text-[#1d3a35] md:text-3xl">
        קבל את ארגז הכלים הדיגיטלי - בחינם
      </h3>
      <p className="mb-6 max-w-2xl text-sm font-bold leading-relaxed text-[#5a4f48] md:text-base">
        רשימת תחזוקה שבועית, טבלת ספציפיקציות לכל דגם, ולוח זמנים לתחזוקה מונעת.
        הכל בעברית, הכל מהשטח.
      </p>
      <a
        href="#lead-magnet"
        className="inline-flex items-center gap-3 bg-[#5fa898] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#ff3a00]"
      >
        הורד עכשיו
        <span aria-hidden="true">←</span>
      </a>
    </aside>
  );
}