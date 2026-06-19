import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ScissorsLineDashed, Stethoscope, HeartPulse, Sparkles, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

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
      style={{ background: "var(--paper, #FAFAF8)" }}
    >
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 pt-12 pb-20 md:pt-24 md:pb-[128px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 md:items-center">
          {/* TEXT — left column on desktop (RTL: order-2 lands left) */}
          <motion.div {...fadeProps} className="md:col-span-7 md:order-2">
            <div className="flex items-center gap-3" aria-hidden>
              <span style={{ width: 28, height: 1, background: "var(--green-600)" }} />
              <span
                style={{
                  fontFamily: "var(--font-display, 'Heebo', sans-serif)",
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--green-600)",
                }}
              >
                Clinique Podologique · Beit El
              </span>
            </div>

            <h1
              id="hero-heading"
              className="display mt-6"
              style={{
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                color: "var(--ink-900)",
              }}
            >
              ענבר פרחי
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-serif, 'Frank Ruhl Libre', serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                  color: "var(--green-700, #2F6657)",
                  marginTop: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                רפואה של כף הרגל, בידיים מדויקות.
              </span>
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
              style={{ background: "var(--stone-200, #E7E5E0)" }}
              aria-label="נתוני הקליניקה"
            >
              {TRUST_STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-1 px-4 py-5"
                  style={{ background: "var(--paper)" }}
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
            <figure className="relative" style={{ margin: 0, paddingTop: "28px", paddingInlineStart: "40px" }}>
              {/* Editorial catalogue number */}
              <span
                aria-hidden
                className="absolute"
                style={{
                  top: 0,
                  insetInlineStart: 0,
                  fontFamily: "var(--font-serif, 'Frank Ruhl Libre', serif)",
                  fontWeight: 400,
                  fontSize: "52px",
                  lineHeight: 1,
                  color: "var(--green-600)",
                  letterSpacing: "-0.02em",
                }}
              >
                01
              </span>

              {/* Vertical rail with rotated label */}
              <span
                aria-hidden
                className="absolute"
                style={{
                  top: "70px",
                  bottom: "70px",
                  insetInlineStart: "16px",
                  width: "1px",
                  background: "var(--stone-200, #E7E5E0)",
                }}
              />
              <span
                aria-hidden
                className="absolute"
                style={{
                  insetInlineStart: "8px",
                  bottom: "72px",
                  transform: "rotate(-90deg)",
                  transformOrigin: "left bottom",
                  fontFamily: "var(--font-display, 'Heebo', sans-serif)",
                  fontWeight: 300,
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  color: "var(--green-600)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                INBAR FARCHI · EST. 2013
              </span>

              {/* Hairline horizontal rules that extend past the image edges */}
              <span
                aria-hidden
                className="absolute"
                style={{
                  insetInlineStart: 0,
                  insetInlineEnd: "-24px",
                  top: "calc(28px + 28%)",
                  height: "1px",
                  background: "var(--stone-200, #E7E5E0)",
                }}
              />
              <span
                aria-hidden
                className="absolute"
                style={{
                  insetInlineStart: "-12px",
                  insetInlineEnd: "32px",
                  top: "calc(28px + 70%)",
                  height: "1px",
                  background: "var(--stone-200, #E7E5E0)",
                }}
              />

              <img
                src={inbarPortrait}
                alt="ענבר פרחי אוחזת מודל אנטומי של כף הרגל בקליניקה הטיפולית בבית אל"
                width={1024}
                height={1536}
                loading="eager"
                className="relative"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  maxHeight: "640px",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />

              <figcaption
                className="relative mt-5 flex items-center gap-3"
                style={{ paddingInlineStart: "0" }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "32px",
                    height: "1px",
                    background: "var(--green-600)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Heebo', sans-serif)",
                    fontWeight: 400,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    color: "var(--ink-600)",
                    lineHeight: 1.5,
                  }}
                >
                  מודל אנטומי · הדגמה לטיפול בכף רגל סוכרתית
                </span>
              </figcaption>
            </figure>
          </motion.aside>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <hr style={{ border: 0, borderTop: "1px solid var(--stone-100)" }} />
      </div>
    </section>
  );
}
