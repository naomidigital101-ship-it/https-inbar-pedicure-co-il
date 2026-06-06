const stats = [
  {
    value: "+240",
    metric: "METRIC: INSTRUCTORS",
    label: "מדריכים וטכנאים מוסמכים",
    bar: "w-3/4",
  },
  {
    value: "₪300",
    metric: "AVG: SAVINGS",
    label: "ממוצע חיסכון בטיפול עצמי",
    bar: "w-1/2",
    italic: true,
  },
  {
    value: "18K",
    metric: "USERS: ACTIVE",
    label: "רוכבים ורוכבות פעילים בקהילה",
    bar: "w-full",
  },
];

export function Hero() {
  return (
    <section className="relative grid grid-cols-12 border-b border-[#222]">
      <div className="order-2 col-span-12 flex flex-col justify-center gap-12 border-l border-[#222] bg-[#111] p-8 md:order-1 md:col-span-4">
        {stats.map((s) => (
          <div key={s.metric} className="space-y-2">
            <div className="flex items-end justify-between">
              <span
                className={`text-5xl font-black leading-none text-[#e63000] ${s.italic ? "italic" : ""}`}
              >
                {s.value}
              </span>
              <span className="text-[10px] font-bold uppercase text-[#909090]">
                {s.metric}
              </span>
            </div>
            <p className="text-sm font-bold text-[#909090]">{s.label}</p>
            <div className="h-1 w-full bg-[#222]">
              <div className={`h-full bg-[#e63000] ${s.bar}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="order-1 col-span-12 flex flex-col justify-center p-8 md:order-2 md:col-span-8 md:p-12">
        <div className="mb-6 w-fit border-r-2 border-[#e63000] pr-3 text-xs font-black uppercase tracking-widest text-[#e63000]">
          Technical Bulletin // Vol. 01 // Israel
        </div>
        <h1 className="mb-8 flex flex-col text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-[#f0f0f0]">תחזוקת אופנוע שטח -</span>
          <span className="text-[#e63000]">תלמד, תתקן, תחסוך.</span>
        </h1>
        <p className="mb-10 max-w-xl text-lg font-bold leading-relaxed text-[#909090] md:text-xl">
          מדריכים מעשיים למכוניקת שטח, ביקורות KTM, Husqvarna ו-Honda, ומסלולי אוף-רוד - הכל בעברית, הכל בחינם.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#articles"
            className="bg-[#e63000] px-8 py-4 text-lg font-black text-[#f0f0f0] transition-transform hover:bg-[#cc2a00] active:scale-95"
          >
            קרא את המדריך
          </a>
          <a
            href="#articles"
            className="border-2 border-[#222] px-8 py-4 text-lg font-black text-[#f0f0f0] transition-colors hover:border-[#f0f0f0]"
          >
            כל המאמרים
          </a>
        </div>
      </div>
    </section>
  );
}