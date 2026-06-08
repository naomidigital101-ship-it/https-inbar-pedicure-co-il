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
      className="relative isolate overflow-hidden bg-[var(--surface,#F5F4F0)] min-h-[calc(100svh-5rem)] flex items-center"
    >
      {/* Soft brand auras */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] right-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-[color-mix(in_oklab,var(--copper,#B8894A)_18%,transparent)] blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-14">
        {/* Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1 lg:col-span-7"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--primary)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-deep,var(--primary))]">
              קליניקה רפואית לבריאות כף הרגל
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{ fontFamily: "var(--font-heading)" }}
            className="font-heading font-bold tracking-tight text-[var(--ink,#1d3a35)] leading-[1.05] text-[clamp(2.25rem,5.6vw,4.75rem)]"
          >
            הסמכות המובילה
            <br />
            בישראל לטיפול
            <br />
            <span className="text-[var(--copper,#B8894A)] italic">בכף הרגל.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-soft,#4a5e5a)] md:text-lg"
          >
            ענבר פרחי — קליניקה בוטיקית לטיפול קליני בכף הרגל. גישה רפואית מדויקת, פרוטוקולים בינלאומיים וליווי אישי שמחזיר אתכם להליכה נטולת כאב.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--primary)] px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-deep,var(--primary))]"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              לתיאום ייעוץ אישי
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-base font-semibold text-[var(--ink,#1d3a35)] transition-colors hover:text-[var(--copper,#B8894A)]"
            >
              היכרות עם ענבר
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[color-mix(in_oklab,var(--ink,#1d3a35)_12%,transparent)] pt-5"
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
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[440px]">
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
              className="absolute bottom-4 right-0 z-20 max-w-[230px] rounded-2xl bg-white/90 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <ShieldCheck className="h-5 w-5" aria-hidden strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary-deep,var(--primary))]">סטנדרט קליני</div>
                  <div className="text-sm font-semibold text-[var(--ink,#1d3a35)]">איכילוב · NHS · IWGDF</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
