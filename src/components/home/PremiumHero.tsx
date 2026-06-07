import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck, Award, GraduationCap, ArrowLeft } from "lucide-react";
import inbarPortrait from "@/assets/inbar-premium-portrait.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const container = {
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
    <section dir="rtl" className="relative isolate overflow-hidden bg-white">
      {/* Subtle teal aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-teal-100/40 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:py-32">
        {/* Text column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1 lg:col-span-7"
        >
          <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-3">
            <span className="h-px w-10 bg-teal-600" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">
              קליניקה רפואית לבריאות כף הרגל
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-extrabold tracking-tight text-slate-900 text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
          >
            הסמכות המובילה
            <br />
            בישראל לטיפול
            <br />
            <span className="text-teal-700">בכף הרגל.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl"
          >
            ענבר פרחי — קליניקה בוטיקית לטיפול קליני בכף הרגל. גישה רפואית מדויקת, פרוטוקולים בינלאומיים וליווי אישי שמחזיר אתכם להליכה נטולת כאב.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-teal-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              לתיאום ייעוץ אישי
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold text-slate-900 transition-colors hover:text-teal-700"
            >
              היכרות עם ענבר
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-slate-200/80 pt-8"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
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
          <div className="relative">
            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 hidden h-2/3 w-2/3 rounded-3xl border border-teal-200 lg:block"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-50 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
              <img
                src={inbarPortrait}
                alt="ענבר פרחי, פדיקוריסטית טיפולית — דיוקן בקליניקה"
                width={896}
                height={1120}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating credential card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-8 right-6 max-w-[260px] rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-900/5 lg:-right-10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
                  <ShieldCheck className="h-5 w-5" aria-hidden strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-teal-700">סטנדרט קליני</div>
                  <div className="text-sm font-semibold text-slate-900">איכילוב · NHS · IWGDF</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
