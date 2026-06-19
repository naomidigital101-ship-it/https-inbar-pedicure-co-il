import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ScissorsLineDashed, Stethoscope, HeartPulse, Sparkles, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";
import inbarHero from "@/assets/inbar-cutout.png.asset.json";
import heroBgPattern from "@/assets/hero-bg-pattern.jpg";

const SPECIALTIES = [
  { icon: Stethoscope, label: "אבחון קליני מעמיק של כף הרגל" },
  { icon: HeartPulse, label: "כף רגל סוכרתית, פרוטוקול IWGDF" },
  { icon: ScissorsLineDashed, label: "ציפורן חודרנית ואורתוניקסיה" },
  { icon: Sparkles, label: "טיפול בפטרת ושיקום ציפורן BIO" },
  { icon: ShieldCheck, label: "סטריליות מלאה, כלים חד-פעמיים" },
] as const;

const TRUST_STATS = [
  { value: "12", label: "שנות ניסיון קליני" },
  { value: "IWGDF", label: "פרוטוקול בינלאומי" },
  { value: "1:1", label: "טיפול אישי בלבד" },
] as const;

const HERO_WA_HREF = `${SITE.whatsappUrl}?text=${encodeURIComponent("שלום ענבר, הגעתי דרך האתר ואשמח לתאם ייעוץ.")}`;

export function PremiumHero() {
  const reduced = useReducedMotion() ?? false;

  const fadeProps = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      dir="rtl"
      className="relative"
      aria-labelledby="hero-heading"
      style={{ background: "#F0E6DD" }}
    >
      {/* Decorative background pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${heroBgPattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.55,
          mixBlendMode: "multiply",
        }}
      />
      <div className="relative">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 pb-20 md:pt-24 md:pb-[128px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 md:items-center">
          {/* TEXT — left column on desktop (RTL: order-2 lands left) */}
          <motion.div {...fadeProps} className="md:col-span-7 md:order-2">
            <h1
              id="hero-heading"
              className="display"
              style={{
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: "var(--ink-900)",
              }}
            >
              ענבר פרחי
            </h1>

            <p
              className="mt-8 max-w-[54ch]"
              style={{ fontSize: "1.125rem", lineHeight: 1.75, color: "var(--ink-600)" }}
            >
              קליניקה שקטה ומדויקת בבית אל. שתים-עשרה שנות ניסיון בטיפול בכף הרגל הסוכרתית, אורתוניקסיה, פטרת ושיקום ציפורן — לפי פרוטוקולים של איכילוב, IWGDF ו-NHS.
            </p>

            <ul className="mt-9 grid gap-x-6 gap-y-3.5 sm:grid-cols-2" aria-label="תחומי התמחות">
              {SPECIALTIES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center"
                    style={{ color: "var(--green-600)" }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  </span>
                  <span style={{ fontSize: "0.95rem", lineHeight: 1.55, color: "var(--ink-900)" }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={HERO_WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פתחו שיחת ווצאפ עם ענבר"
                className="inline-flex h-12 items-center gap-2.5 px-7 text-[15px] font-medium transition-colors"
                style={{
                  background: "var(--green-600)",
                  color: "var(--paper)",
                  borderRadius: 999,
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-700, #2F6657)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--green-600)")}
              >
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
                תיאום ייעוץ בוואטסאפ
              </a>
              <a
                href={SITE.telUrl}
                aria-label={`התקשרו לקליניקה ${SITE.phoneDisplay}`}
                className="inline-flex h-12 items-center gap-2.5 px-6 text-[15px] font-medium transition-colors"
                style={{
                  background: "transparent",
                  color: "var(--ink-900)",
                  border: "1px solid var(--stone-200, #E7E5E0)",
                  borderRadius: 999,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--green-600)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--stone-200, #E7E5E0)")}
              >
                <Phone className="h-[16px] w-[16px]" strokeWidth={1.5} />
                <span dir="ltr">{SITE.phoneDisplay}</span>
              </a>
            </div>

            {/* Trust strip */}
            <dl
              className="mt-12 grid grid-cols-3 gap-px"
              style={{ background: "rgba(47, 102, 87, 0.18)" }}
              aria-label="נתוני הקליניקה"
            >
              {TRUST_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-1 px-4 py-5"
                  style={{ background: "#F0E6DD" }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-serif, 'Frank Ruhl Libre', serif)",
                      fontSize: "1.7rem",
                      lineHeight: 1,
                      color: "var(--ink-900)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.value}
                  </dt>
                  <dd
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      color: "var(--ink-600)",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* IMAGE — right column on desktop (RTL: order-1 lands right) */}
          <motion.aside
            {...fadeProps}
            transition={{ ...(fadeProps.transition ?? {}), delay: reduced ? 0 : 0.12 }}
            className="md:col-span-5 md:order-1"
            aria-label="דיוקן ענבר פרחי"
          >
            <figure className="relative" style={{ margin: 0 }}>
              <img
                src={inbarHero.url}
                alt="ענבר פרחי, פדיקוריסטית טיפולית"
                width={1240}
                height={1860}
                loading="eager"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  maxHeight: "780px",
                  objectFit: "contain",
                  objectPosition: "center",
                  transform: "scale(1.15)",
                  transformOrigin: "center bottom",
                }}
              />
            </figure>
          </motion.aside>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <hr style={{ border: 0, borderTop: "1px solid var(--stone-100)" }} />
      </div>
      </div>
    </section>
  );
}
