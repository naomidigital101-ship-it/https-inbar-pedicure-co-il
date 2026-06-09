import { motion, type Variants } from "framer-motion";
import { CalendarCheck, ShieldCheck, Award, GraduationCap, ArrowLeft } from "lucide-react";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const TRUST = [
  { icon: Award, label: "12+ שנות ניסיון קליני" },
  { icon: ShieldCheck, label: "פרוטוקול IWGDF לסוכרת" },
  { icon: GraduationCap, label: "מרצה לפדיקוריסטיות" },
] as const;

export function PremiumHero() {
  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden bg-white h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)] flex items-center"
    >
      {/* Soft brand auras — turquoise + light grey */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 -z-10 h-[560px] w-[560px] rounded-full bg-[color-mix(in_oklab,var(--primary)_28%,transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] -z-10 h-[460px] w-[460px] rounded-full bg-[color-mix(in_oklab,var(--primary-deep)_14%,transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[var(--surface-warm)] to-transparent"
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-4 px-5 py-4 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-14">
        {/* Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1 lg:col-span-7"
        >
          <motion.div variants={fadeUp} className="mb-2 sm:mb-6 inline-flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--primary)]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--primary-deep,var(--primary))]">
              קליניקה רפואית לכף הרגל בבית אל
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{ fontFamily: "'Assistant', system-ui, sans-serif", fontWeight: 700 }}
            className="font-heading tracking-tight text-[var(--ink,#1d3a35)] leading-[1.05] text-[clamp(1.6rem,5.6vw,4.75rem)]"
          >
            פדיקור טיפולי
            <br />
            בבית אל ובאזור
            <br />
            <span className="text-[var(--copper,#B8894A)]">בנימין.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-3 sm:mt-6 max-w-xl text-[13px] leading-snug text-[var(--ink-soft,#4a5e5a)] sm:text-base sm:leading-relaxed md:text-lg"
          >
            <span className="sm:hidden">קליניקה בוטיקית בבית אל לטיפול קליני בכף הרגל. שירות לכל אזור בנימין וירושלים.</span>
            <span className="hidden sm:inline">הקליניקה של ענבר פרחי בבית אל מתמחה בטיפול קליני בכף הרגל: יבלות, פטרת, ציפורן חודרנית, סדקים בעקב ופדיקור לחולי סוכרת. שירות למטופלים מכל אזור בנימין, ירושלים והיישובים הסמוכים.</span>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4 sm:mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <a
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-deep,var(--primary))] sm:px-8 sm:py-3.5 sm:text-base"
            >
              <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
              לתיאום ייעוץ אישי
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--ink,#1d3a35)] transition-colors hover:text-[var(--copper,#B8894A)] sm:px-5 sm:py-3.5 sm:text-base"
            >
              היכרות עם ענבר
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-4 hidden flex-wrap items-center gap-x-8 gap-y-3 border-t border-[color-mix(in_oklab,var(--ink,#1d3a35)_12%,transparent)] pt-4 sm:mt-8 sm:flex sm:pt-5"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-[var(--ink-soft,#4a5e5a)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-[var(--primary-deep,var(--primary))]">
                  <Icon className="h-4 w-4" aria-hidden strokeWidth={1.8} />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Portrait column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative order-1 lg:order-2 lg:col-span-5"
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[170px] sm:max-w-[320px] lg:max-w-[440px]">
            {/* Decorative sage disc behind portrait */}
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-0 top-10 rounded-full bg-gradient-to-b from-[color-mix(in_oklab,var(--primary)_32%,transparent)] to-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
            />
            <div
              aria-hidden
              className="absolute -right-3 top-6 hidden h-24 w-px bg-[var(--copper,#B8894A)]/60 lg:block"
            />

            <img
              src={inbarPortrait}
              alt="ענבר פרחי, פדיקוריסטית טיפולית"
              width={896}
              height={1120}
              loading="eager"
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_30px_40px_rgba(29,58,53,0.18)]"
            />

            {/* Floating credential chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-4 right-0 z-20 hidden max-w-[230px] rounded-2xl bg-white/90 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur-md sm:block"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <ShieldCheck className="h-5 w-5" aria-hidden strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary-deep,var(--primary))]">סטנדרט קליני</div>
                  <div className="text-sm font-semibold text-[var(--ink,#1d3a35)]">איכילוב, NHS, IWGDF</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
