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
      style={{ background: "#F7F5F2" }}
    >
      {/* Clinical line background — vertical hairlines + arc */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="heroFade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#2F6657" stopOpacity="0" />
            <stop offset="0.5" stopColor="#2F6657" stopOpacity="0.18" />
            <stop offset="1" stopColor="#2F6657" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* fine vertical grid */}
        {Array.from({ length: 36 }).map((_, i) => (
          <line
            key={i}
            x1={i * 40}
            x2={i * 40}
            y1="0"
            y2="900"
            stroke="#2F6657"
            strokeOpacity={i % 6 === 0 ? 0.09 : 0.045}
            strokeWidth="1"
          />
        ))}
        {/* horizontal hairline */}
        <line x1="0" y1="720" x2="1440" y2="720" stroke="url(#heroFade)" strokeWidth="1" />
        {/* large arc on the right */}
        <circle cx="1180" cy="450" r="520" fill="none" stroke="#2F6657" strokeOpacity="0.16" strokeWidth="1" />
        <circle cx="1180" cy="450" r="380" fill="none" stroke="#2F6657" strokeOpacity="0.1" strokeWidth="1" />
        {/* tick markers */}
        <g fill="#2F6657" fillOpacity="0.35">
          <circle cx="120" cy="180" r="2.5" />
          <circle cx="120" cy="720" r="2.5" />
          <circle cx="1320" cy="180" r="2.5" />
        </g>
      </svg>
      <div className="relative">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 pt-10 pb-0 md:pt-24 md:pb-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 md:items-end">
          {/* TEXT — left column on desktop (RTL: order-2 lands left) */}
          <motion.div {...fadeProps} className="order-2 md:order-2 md:col-span-6 md:pb-24">
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
              className="mt-6 max-w-[54ch] md:mt-8"
              data-speakable
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)", lineHeight: 1.7, color: "var(--ink-600)" }}
            >
              <span className="md:hidden">
                קליניקה שקטה ומדויקת בבית אל. 12 שנות ניסיון בטיפול קליני בכף הרגל.
              </span>
              <span className="hidden md:inline">
                קליניקה שקטה ומדויקת בבית אל. שתים-עשרה שנות ניסיון בטיפול בכף הרגל הסוכרתית, אורתוניקסיה, פטרת ושיקום ציפורן — לפי פרוטוקולים של איכילוב, IWGDF ו-NHS.
              </span>
            </p>

            <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:mt-9 md:gap-y-3.5" aria-label="תחומי התמחות">
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
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
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
              className="mt-10 grid grid-cols-3 gap-px md:mt-12"
              style={{ background: "rgba(47, 102, 87, 0.18)" }}
              aria-label="נתוני הקליניקה"
            >
              {TRUST_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-1 px-4 py-5"
                  style={{ background: "#F7F5F2" }}
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
            className="order-1 md:order-1 md:col-span-6 md:self-end"
            aria-label="דיוקן ענבר פרחי"
          >
            <figure className="relative mx-auto" style={{ margin: 0, maxWidth: "440px" }}>
              {/* soft clinical halo behind subject */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-0"
                style={{
                  height: "85%",
                  background:
                    "radial-gradient(60% 55% at 50% 70%, rgba(47,102,87,0.12) 0%, rgba(47,102,87,0.04) 45%, transparent 75%)",
                }}
              />
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
                }}
              />
            </figure>
          </motion.aside>
        </div>
      </div>

      {/* Baseline rail — image and text both sit on this hairline */}
      <div className="relative">
        <div
          aria-hidden
          className="mx-auto max-w-[1320px] px-6 md:px-10"
        >
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(47,102,87,0.35) 12%, rgba(47,102,87,0.35) 88%, transparent 100%)",
            }}
          />
        </div>
        {/* tiny end caps to make the rail feel intentional */}
        <span
          aria-hidden
          className="absolute right-6 md:right-10"
          style={{
            top: -3,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--green-600, #2F6657)",
            opacity: 0.6,
          }}
        />
        <span
          aria-hidden
          className="absolute left-6 md:left-10"
          style={{
            top: -3,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "var(--green-600, #2F6657)",
            opacity: 0.6,
          }}
        />
      </div>
      </div>
    </section>
  );
}
