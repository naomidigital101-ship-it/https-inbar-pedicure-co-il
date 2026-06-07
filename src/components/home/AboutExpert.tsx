import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, GraduationCap, HeartPulse, ArrowLeft } from "lucide-react";
import inbarPortrait from "@/assets/inbar-premium-portrait.jpg";

const PILLARS = [
  {
    icon: Stethoscope,
    title: "גישה רפואית",
    desc: "אבחון מעמיק לפי פרוטוקולים של איכילוב, NHS ו-IWGDF — לא פדיקור אסתטי, אלא טיפול קליני.",
  },
  {
    icon: ShieldCheck,
    title: "סטריליות מוחלטת",
    desc: "כלים חד-פעמיים, אוטוקלאב לחיטוי מלא ופרוטוקול מניעת זיהומים בכל טיפול.",
  },
  {
    icon: HeartPulse,
    title: "התמחות בסוכרת",
    desc: "ליווי בטוח לכף הרגל הסוכרתית, מניעת סיבוכים ושמירה על ההליכה לאורך שנים.",
  },
  {
    icon: GraduationCap,
    title: "השכלה מתמשכת",
    desc: "מעל 150 שעות השתלמות בשנה, מרצה לפדיקוריסטיות ובוגרת קורסים בינלאומיים.",
  },
] as const;

export function AboutExpert() {
  return (
    <section id="about" dir="rtl" className="relative bg-slate-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Sticky portrait + caption */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                <img
                  src={inbarPortrait}
                  alt="ענבר פרחי בקליניקה"
                  width={896}
                  height={1120}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-slate-300" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-teal-700">ענבר פרחי</span>
                <span className="h-px flex-1 bg-slate-300" />
              </div>
            </div>
          </motion.div>

          {/* Editorial body */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-7"
          >
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-teal-700">היכרות עם המומחית</span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.05]">
              למה מטופלים נוסעים אליי
              <br />
              <span className="text-teal-700">מכל הארץ.</span>
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                במשך יותר מ-12 שנה אני מטפלת בכף הרגל בגישה הרפואית הקפדנית ביותר. הקליניקה שלי אינה מכון יופי — זו סביבה קלינית סטרילית שבה כל החלטה מתבססת על ראיות, פרוטוקולים בינלאומיים והבנה עמוקה של הפיזיולוגיה של כף הרגל.
              </p>
              <p>
                אני מתמחה במקרים שאחרים מהססים לקבל: כף רגל סוכרתית, ציפורן חודרנית כרונית, פטרת עיקשת ושיקום ציפורניים בשיטת BIO. מטופלים מגיעים אליי מירושלים, גוש דן והשפלה — לא בגלל המיקום, אלא בגלל התוצאה.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" aria-hidden strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full bg-teal-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-teal-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30"
              >
                לתיאום ייעוץ אישי
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
