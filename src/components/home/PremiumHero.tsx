import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, ScissorsLineDashed, Stethoscope, HeartPulse, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site-config";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

const SPECIALTIES = [
  { icon: Stethoscope, label: "אבחון קליני מעמיק של כף הרגל" },
  { icon: HeartPulse, label: "כף רגל סוכרתית, פרוטוקול IWGDF" },
  { icon: ScissorsLineDashed, label: "ציפורן חודרנית ואורתוניקסיה" },
  { icon: Sparkles, label: "טיפול בפטרת ושיקום ציפורן BIO" },
  { icon: ShieldCheck, label: "סטריליות מלאה, כלים חד-פעמיים" },
] as const;

function buildWhatsAppHref(name: string, phone: string, message: string): string {
  const lines = [
    "שלום ענבר, הגעתי דרך האתר.",
    name && `שם: ${name}`,
    phone && `טלפון: ${phone}`,
    message && `הודעה: ${message}`,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `${SITE.whatsappUrl}?text=${text}`;
}

export function PremiumHero() {
  const reduced = useReducedMotion() ?? false;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const href = buildWhatsAppHref(name.trim(), phone.trim(), message.trim());
    window.open(href, "_blank", "noopener,noreferrer");
  };

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
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 pt-10 pb-16 md:pt-20 md:pb-[120px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 md:items-start">
          <motion.div {...fadeProps} className="md:col-span-7 md:order-2">
            <h1
              id="hero-heading"
              className="display"
              style={{
                fontWeight: 300,
                fontSize: "clamp(2.6rem, 5.2vw, 3.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--ink-900)",
              }}
            >
              ענבר פרחי
            </h1>
            <h2
              className="mt-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1.2rem, 2.4vw, 1.6rem)",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                color: "var(--ink-600)",
              }}
            >
              פדיקוריסטית טיפולית למחלות כף הרגל ויבלות
            </h2>

            <p
              className="mt-8 max-w-[52ch]"
              style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--ink-600)" }}
            >
              קליניקה קלינית ושקטה בבית אל, עם 12 שנות ניסיון בטיפול בכף הרגל הסוכרתית, אורתוניקסיה, פטרת ושיקום ציפורן. כל טיפול מבוסס על פרוטוקולים של איכילוב, IWGDF ו-NHS.
            </p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="תחומי התמחות">
              {SPECIALTIES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center"
                    style={{ color: "var(--green-600)" }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span style={{ fontSize: "0.95rem", lineHeight: 1.55, color: "var(--ink-900)" }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

          </motion.div>

          <motion.aside
            {...fadeProps}
            transition={{ ...(fadeProps.transition ?? {}), delay: reduced ? 0 : 0.12 }}
            className="md:col-span-5 md:order-1 grid gap-8"
            aria-labelledby="hero-form-title"
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
                  fontSize: "44px",
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
                  top: "60px",
                  bottom: "60px",
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
                  top: "calc(28px + 33%)",
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
                  top: "calc(28px + 66%)",
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
                  maxHeight: "520px",
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
            <div
              className="p-7 md:p-9"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--stone-100)",
                borderRadius: "8px",
              }}
            >
              <p
                className="text-[12px] font-medium uppercase"
                style={{ letterSpacing: "0.24em", color: "var(--green-500)" }}
              >
                02 — תיאום ייעוץ
              </p>
              <h3
                id="hero-form-title"
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "1.6rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  color: "var(--ink-900)",
                }}
              >
                מלאי את הפרטים — אחזור אלייך בשעה הקרובה.
              </h3>
              <p
                className="mt-3"
                style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--ink-600)" }}
              >
                שליחת הטופס תעביר את הפרטים ישירות לוואטסאפ של הקליניקה. בלי ספאם, בלי טלמרקטינג.
              </p>

              <form onSubmit={onSubmit} className="mt-7 grid gap-4">
                <label className="grid gap-2">
                  <span
                    className="text-[12px] font-medium"
                    style={{ letterSpacing: "0.08em", color: "var(--ink-600)" }}
                  >
                    שם מלא
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ישראלה ישראלי"
                    className="h-11 px-4 text-[15px]"
                    style={{
                      background: "var(--stone-50)",
                      border: "1px solid var(--stone-100)",
                      borderRadius: "4px",
                      color: "var(--ink-900)",
                      outline: "none",
                    }}
                  />
                </label>
                <label className="grid gap-2">
                  <span
                    className="text-[12px] font-medium"
                    style={{ letterSpacing: "0.08em", color: "var(--ink-600)" }}
                  >
                    טלפון
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="050-0000000"
                    dir="ltr"
                    className="h-11 px-4 text-[15px] text-right"
                    style={{
                      background: "var(--stone-50)",
                      border: "1px solid var(--stone-100)",
                      borderRadius: "4px",
                      color: "var(--ink-900)",
                      outline: "none",
                    }}
                  />
                </label>
                <label className="grid gap-2">
                  <span
                    className="text-[12px] font-medium"
                    style={{ letterSpacing: "0.08em", color: "var(--ink-600)" }}
                  >
                    מה הסיבה לפנייה? (לא חובה)
                  </span>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="לדוגמה: סובלת מציפורן חודרנית ברגל ימין"
                    className="px-4 py-3 text-[15px]"
                    style={{
                      background: "var(--stone-50)",
                      border: "1px solid var(--stone-100)",
                      borderRadius: "4px",
                      color: "var(--ink-900)",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex h-12 items-center justify-center px-7 text-[15px] font-medium transition-colors"
                  style={{
                    background: "var(--green-500)",
                    color: "var(--paper)",
                    borderRadius: "8px",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-600)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--green-500)")}
                >
                  קבעו תור עכשיו
                </button>

                <p className="text-[12px]" style={{ color: "var(--ink-600)", lineHeight: 1.6 }}>
                  מעדיפה דיבור ישיר?{" "}
                  <a
                    href={SITE.telUrl}
                    style={{ color: "var(--green-700)", textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    {SITE.phoneDisplay}
                  </a>
                </p>
              </form>
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <hr style={{ border: 0, borderTop: "1px solid var(--stone-100)" }} />
      </div>
    </section>
  );
}
