import { motion } from "framer-motion";
import { Award, GraduationCap, ShieldCheck, HeartPulse } from "lucide-react";

const STATS = [
  { icon: Award, num: "12+", label: "שנות ניסיון קליני" },
  { icon: GraduationCap, num: "150+", label: "שעות השתלמות בשנה" },
  { icon: HeartPulse, num: "200+", label: "מטופלים בשנה" },
  { icon: ShieldCheck, num: "20+", label: "פדיקוריסטיות הוכשרו" },
] as const;

const STANDARDS = ["איכילוב", "משרד הבריאות", "אגודת אייל", "NHS", "AAD"] as const;

export function TrustBand() {
  return (
    <section
      dir="rtl"
      aria-label="אותות אמון, סמכות מקצועית ותקנים"
      className="relative bg-background pb-16 pt-4 md:pb-24 md:pt-8"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Stats grid — clinical, white surface with subtle ring */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
          style={{ boxShadow: "var(--shadow-clinical)" }}
        >
          {STATS.map(({ icon: Icon, num, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 bg-background px-6 py-9 text-center md:px-8 md:py-12"
            >
              <span
                aria-hidden
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: "var(--primary-soft)", color: "var(--primary-deep)" }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div
                style={{
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(2.4rem, 4.2vw, 3.25rem)",
                  lineHeight: 1,
                  color: "var(--ink)",
                }}
              >
                {num}
              </div>
              <div
                className="text-[11px] font-bold uppercase"
                style={{ letterSpacing: "0.18em", color: "var(--text-muted)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Standards strip — credibility badges */}
        <div className="mt-10 flex flex-col items-center gap-4 md:mt-12 md:flex-row md:justify-center md:gap-6">
          <span
            className="text-[10.5px] font-bold uppercase"
            style={{ letterSpacing: "0.22em", color: "var(--text-muted)" }}
          >
            פרוטוקולים מבוססים על
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-4">
            {STANDARDS.map((s, i) => (
              <span key={s} className="flex items-center gap-3 md:gap-4">
                <span
                  className="text-[12px] font-bold tracking-wide"
                  style={{ color: "var(--ink)" }}
                >
                  {s}
                </span>
                {i < STANDARDS.length - 1 && (
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full"
                    style={{ background: "var(--copper)" }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}