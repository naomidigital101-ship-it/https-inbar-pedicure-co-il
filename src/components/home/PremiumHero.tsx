import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ScissorsLineDashed, Stethoscope, HeartPulse, Sparkles, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";
import inbarHero from "@/assets/inbar-foot-model.png.asset.json";

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
      style={{ background: "#FFFFFF" }}
    >
      {/* Clean white canvas with organic accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Organic arc — top right (RTL: behind image side) */}
        <svg
          className="absolute -top-24 -right-24 md:-top-32 md:-right-28"
          width="520"
          height="520"
          viewBox="0 0 520 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M520 0 A520 520 0 0 0 0 520 L120 520 A400 400 0 0 1 520 120 Z"
            fill="#8DC2B3"
            fillOpacity="0.85"
          />
        </svg>
        {/* Halftone dots — bottom left */}
        <svg
          className="absolute -bottom-10 -left-10 hidden sm:block"
          width="260"
          height="260"
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <radialGradient id="halftoneFade" cx="30%" cy="70%" r="70%">
              <stop offset="0%" stopColor="#1E2422" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#1E2422" stopOpacity="0" />
            </radialGradient>
            <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.6" fill="#1E2422" />
            </pattern>
            <mask id="dotsMask">
              <rect width="260" height="260" fill="url(#halftoneFade)" />
            </mask>
          </defs>
          <rect width="260" height="260" fill="url(#dots)" mask="url(#dotsMask)" />
        </svg>
      </div>
      <div className="relative">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 pt-8 pb-6 md:pt-14 md:pb-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 md:items-center">
          {/* TEXT — left column on desktop (RTL: order-2 lands left) */}
          <motion.div {...fadeProps} className="order-2 md:order-2 md:col-span-6">
            <span
              className="inline-block mb-4 text-[12px] tracking-[0.18em]"
              style={{ color: "var(--green-700, #234C42)", fontWeight: 600 }}
            >
              קליניקה מוסמכת · בית אל
            </span>
            <h1
              id="hero-heading"
              className="display"
              style={{
                fontWeight: 800,
                fontSize: "clamp(2.6rem, 6.4vw, 4.8rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "var(--green-700, #234C42)",
              }}
            >
              ענבר פרחי
            </h1>

            <p
              className="mt-5 max-w-[54ch] md:mt-6"
              data-speakable
              style={{
                fontSize: "clamp(1rem, 2.4vw, 1.125rem)",
                lineHeight: 1.7,
                color: "var(--ink-600)",
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              <span className="md:hidden">
                קליניקה שקטה ומדויקת בבית אל. 12 שנות ניסיון בטיפול קליני בכף הרגל.
              </span>
              <span className="hidden md:inline">
                קליניקה שקטה ומדויקת בבית אל. שתים-עשרה שנות ניסיון בטיפול בכף הרגל הסוכרתית, אורתוניקסיה, פטרת ושיקום ציפורן — לפי פרוטוקולים של איכילוב, IWGDF ו-NHS.
              </span>
            </p>

            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:mt-7 md:gap-y-3" aria-label="תחומי התמחות">
              {SPECIALTIES.map(({ icon: Icon, label }, idx) => (
                <li
                  key={label}
                  className={`flex items-start gap-3 ${idx >= 3 ? "hidden md:flex" : ""}`}
                >
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
            <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-8">
              <a
                href={HERO_WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פתחו שיחת ווצאפ עם ענבר"
                className="inline-flex h-12 items-center gap-2.5 px-7 text-[15px] transition-colors"
                style={{
                  background: "var(--green-600)",
                  color: "var(--paper)",
                  borderRadius: 999,
                  letterSpacing: "0.02em",
                  fontWeight: 700,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-700, #2F6657)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--green-600)")}
              >
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
                תיאום תור בוואטסאפ
              </a>
              <a
                href={SITE.telUrl}
                aria-label={`התקשרו לקליניקה ${SITE.phoneDisplay}`}
                className="inline-flex h-12 items-center gap-2.5 px-6 text-[15px] transition-colors"
                style={{
                  background: "transparent",
                  color: "var(--green-700, #234C42)",
                  border: "1.5px solid var(--green-600, #2F6657)",
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                <Phone className="h-[16px] w-[16px]" strokeWidth={1.5} />
                <span dir="ltr">{SITE.phoneDisplay}</span>
              </a>
            </div>

            {/* Trust strip */}
            <dl
              className="mt-8 grid grid-cols-3 gap-px md:mt-10"
              style={{ background: "rgba(47, 102, 87, 0.18)" }}
              aria-label="נתוני הקליניקה"
            >
              {TRUST_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-1 px-4 py-4 md:py-5"
                  style={{ background: "#F7F5F2" }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-serif, 'Frank Ruhl Libre', serif)",
                      fontWeight: 700,
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
                      fontWeight: 500,
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
            className="order-1 md:order-1 md:col-span-6 md:self-end relative"
            aria-label="דיוקן ענבר פרחי"
          >
            <figure className="relative mx-auto" style={{ margin: 0, maxWidth: "640px" }}>
              <img
                src={inbarHero.url}
                alt="ענבר פרחי מחזיקה מודל אנטומי של כף רגל"
                width={1240}
                height={1700}
                loading="eager"
                className="relative mx-auto"
                style={{
                  display: "block",
                  width: "92%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  maxWidth: "640px",
                }}
              />
            </figure>
          </motion.aside>
        </div>
      </div>

      </div>
    </section>
  );
}
