import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, GraduationCap, HeartPulse, ArrowLeft } from "lucide-react";
import inbarPortraitAsset from "@/assets/inbar-farchi.jpg.asset.json";
const inbarPortrait = inbarPortraitAsset.url;

const PILLARS = [
  {
    icon: Stethoscope,
    title: "גישה קלינית",
    desc: "אבחון מעמיק לפי פרוטוקולים של איכילוב, NHS ו-IWGDF. לא פדיקור אסתטי, אלא טיפול קליני.",
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
    <section id="about" dir="rtl" className="relative py-24 md:py-32" style={{ background: "var(--surface-warm)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div
                className="aspect-[4/5] w-full overflow-hidden rounded-2xl"
                style={{
                  background: "var(--background)",
                  boxShadow: "var(--shadow-elegant)",
                  border: "1px solid var(--border)",
                }}
              >
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
                <span className="h-px flex-1" style={{ background: "var(--border)" }} />
                <span
                  style={{
                    fontFamily: "'Rubik Variable', 'Rubik', system-ui, sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color: "var(--primary)",
                  }}
                >
                  ענבר פרחי
                </span>
                <span className="h-px flex-1" style={{ background: "var(--border)" }} />
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
            <span className="kicker">היכרות עם המומחית</span>
            <h2
              className="mt-5"
              style={{
                fontFamily: "'Rubik Variable', 'Rubik', system-ui, sans-serif",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                color: "var(--ink)",
                lineHeight: 1.0,
              }}
            >
              למה מטופלים מגיעים לקליניקה
              <br />
              <span style={{ color: "var(--primary)" }}>בבית אל.</span>
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              <p>
                במשך יותר מ-12 שנה אני מטפלת בכף הרגל בגישה הקלינית הקפדנית ביותר. הקליניקה שלי אינה מכון יופי, אלא סביבה קלינית סטרילית שבה כל החלטה מתבססת על ראיות, פרוטוקולים בינלאומיים והבנה עמוקה של הפיזיולוגיה של כף הרגל.
              </p>
              <p>
                אני מתמחה במקרים שאחרים מהססים לקבל: כף רגל סוכרתית, ציפורן חודרנית כרונית, פטרת עיקשת ושיקום ציפורניים בשיטת BIO. מטופלים מגיעים אליי מבית אל, עפרה, פסגות, כוכב יעקב, ירושלים והיישובים הסמוכים, בזכות הגישה הקלינית והתוצאה.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}
                  >
                    <Icon className="h-5 w-5" aria-hidden strokeWidth={1.8} />
                  </span>
                  <h3
                    className="mt-5 text-lg tracking-tight"
                    style={{ fontWeight: 500, color: "var(--ink)" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-base font-bold transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "0 8px 24px -8px color-mix(in oklab, var(--primary) 50%, transparent)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--primary-deep)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--primary)")}
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
