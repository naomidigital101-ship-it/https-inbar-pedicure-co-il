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
      className="relative flex flex-col"
      aria-labelledby="hero-heading"
      style={{ background: "#FFFFFF", minHeight: "calc(100svh - 72px)" }}
    >
      {/* Clean white canvas with organic accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Stone-50 soft pillar behind the portrait — warm light touch */}
        <div
          aria-hidden
          className="absolute hidden md:block"
          style={{
            right: "6%",
            bottom: 0,
            width: "38%",
            height: "82%",
            background: "var(--stone-50)",
            borderTopLeftRadius: "260px",
            borderTopRightRadius: "260px",
          }}
        />
        {/* Stone-50 hairline strip along the bottom of the text side */}
        <div
          aria-hidden
          className="absolute left-0 hidden md:block"
          style={{
            bottom: 0,
            width: "52%",
            height: 88,
            background: "linear-gradient(180deg, transparent 0%, var(--stone-50) 100%)",
          }}
        />
        {/* Organic arc — confined to the image side (right half in RTL) */}
        <svg
          className="absolute inset-y-0 right-0 h-full w-1/2"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M100 0 A 130 130 0 0 0 0 100"
            stroke="#8DC2B3"
            strokeOpacity="0.9"
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: "1.4px" }}
            fill="none"
          />
        </svg>
        {/* Light gray brand accents — subtle designed touches */}
        <span
          aria-hidden
          className="absolute hidden md:block"
          style={{
            top: "14%",
            right: "6%",
            width: 1,
            height: 56,
            background: "rgba(30,36,34,0.12)",
          }}
        />
        <span
          aria-hidden
          className="absolute hidden md:block"
          style={{
            top: "12%",
            right: "5.2%",
            fontFamily: "var(--font-serif)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "rgba(30,36,34,0.32)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          INBAR · 01
        </span>
        {/* hairline rule across image side bottom */}
        <span
          aria-hidden
          className="absolute hidden md:block"
          style={{
            bottom: "10%",
            left: "8%",
            width: 110,
            height: 1,
            background: "rgba(30,36,34,0.10)",
          }}
        />
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
      <div className="relative flex-1 flex flex-col">
      <div className="mx-auto w-full max-w-[1320px] px-6 md:px-10 pt-3 pb-0 md:pt-6 md:pb-0 flex-1 flex flex-col">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-8 md:items-end flex-1">
          {/* TEXT — left column on desktop (RTL: order-2 lands left) */}
          <motion.div {...fadeProps} className="order-2 md:order-2 md:col-span-6 md:self-center md:pb-8">
            <span
              className="inline-block mb-2 text-[11px] tracking-[0.18em] md:mb-3"
              style={{ color: "var(--green-700, #234C42)", fontWeight: 600 }}
            >
              נעים להכיר, אני ענבר · פדיקוריסטית קלינית
            </span>
            <h1
              id="hero-heading"
              className="display"
              style={{
                fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "var(--green-700, #234C42)",
              }}
            >
              ענבר פרחי
            </h1>

            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 md:mt-4 md:gap-y-2" aria-label="תחומי התמחות">
              {SPECIALTIES.map(({ icon: Icon, label }, idx) => (
                <li
                  key={label}
                  className={`flex items-start gap-3 ${idx >= 3 ? "hidden md:flex" : ""}`}
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center"
                    style={{ color: "var(--green-600)" }}
                  >
                    <Icon className="h-[16px] w-[16px]" strokeWidth={1.5} />
                  </span>
                  <span style={{ fontSize: "0.88rem", lineHeight: 1.45, color: "var(--ink-900)" }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-5">
              <a
                href={HERO_WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פתחו שיחת ווצאפ עם ענבר"
                className="inline-flex h-11 items-center gap-2.5 px-6 text-[14px] transition-colors"
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
                className="inline-flex h-11 items-center gap-2.5 px-5 text-[14px] transition-colors"
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
              className="mt-5 grid grid-cols-3 gap-px md:mt-6"
              style={{ background: "rgba(141, 194, 179, 0.45)" }}
              aria-label="נתוני הקליניקה"
            >
              {TRUST_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-0.5 px-3 py-3 md:py-3.5"
                  style={{ background: "#FFFFFF" }}
                >
                  <dt
                    style={{
                      fontFamily: "var(--font-serif, 'Frank Ruhl Libre', serif)",
                      fontWeight: 700,
                      fontSize: "1.45rem",
                      lineHeight: 1,
                      color: "var(--ink-900)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.value}
                  </dt>
                  <dd
                    style={{
                      fontSize: 11,
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
            className="order-1 md:order-1 md:col-span-6 md:self-end relative flex items-end justify-center"
            aria-label="דיוקן ענבר פרחי"
          >
            <figure className="relative mx-auto flex items-end justify-center" style={{ margin: 0, maxWidth: "760px" }}>
              <img
                src={inbarHero.url}
                alt="ענבר פרחי מחזיקה מודל אנטומי של כף רגל"
                width={1240}
                height={1700}
                loading="eager"
                className="relative mx-auto"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  maxWidth: "720px",
                  maxHeight: "calc(100svh - 96px)",
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
