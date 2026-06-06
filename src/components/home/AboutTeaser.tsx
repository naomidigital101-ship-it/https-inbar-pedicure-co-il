import heroImage from "@/assets/about-naomi-hero.webp";

export function AboutTeaser() {
  return (
    <section id="about" className="grid grid-cols-1 border-b border-[#222] bg-[#0a0a0a] md:grid-cols-12">
      <div className="order-2 col-span-12 flex flex-col justify-center gap-6 border-[#222] bg-[#111] p-8 md:order-1 md:col-span-7 md:p-12 md:border-l">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
          // SECTION 05 // ABOUT
        </div>
        <h2 className="text-3xl font-black leading-tight text-[#f0f0f0] md:text-4xl">
          נעמי, רוכבת KTM 250 2T <span className="text-[#e63000]">מבנימין.</span>
        </h2>
        <p className="text-base font-bold leading-relaxed text-[#999] md:text-lg">
          אני מתרגמת ידע טכני על אופנועי שטח לעברית פשוטה. לא מהרצאות,
          מתחת לאופנוע. כל מדריך כאן עבר אצלי בידיים, וכל מוצר עבר שימוש
          אמיתי בשטח. בלי שיווק, בלי קישורי שותפים מטעים, רק מה שעובד.
        </p>
        <div className="grid grid-cols-3 gap-4 border-t border-[#222] pt-6">
          <div>
            <div className="text-2xl font-black text-[#e63000]">12+</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              שנות רכיבה
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#e63000]">17</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              מדריכים מפורטים
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#e63000]">100%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
              עברית, חינם
            </div>
          </div>
        </div>
        <div>
          <a
            href="/about"
            className="inline-block bg-[#e63000] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#f0f0f0] transition-transform hover:bg-[#cc2a00] active:scale-95"
          >
            הסיפור המלא ←
          </a>
        </div>
      </div>
      <div className="order-1 col-span-12 md:order-2 md:col-span-5">
        <img
          src={heroImage}
          alt="נעמי על KTM 250 2T בשטח בבנימין"
          loading="lazy"
          className="h-full w-full object-cover grayscale"
        />
      </div>
    </section>
  );
}