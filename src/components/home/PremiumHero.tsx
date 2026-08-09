import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/site-config";
import heroAsset from "@/assets/inbar-hero-editorial.webp.asset.json";

const HERO_STATS = [
  { num: "12+", label: "שנות ניסיון קליני" },
  { num: "200+", label: "מטופלים בשנה" },
  { num: "20+", label: "פדיקוריסטיות הוכשרו" },
  { num: "150+", label: "שעות השתלמות בשנה" },
] as const;

const HERO_WA_HREF = `${SITE.whatsappUrl}?text=${encodeURIComponent("שלום ענבר, אשמח לתאם טיפול")}`;

/**
 * הירו הראשי — תמונה full-bleed עם overlay ירוק כהה ותוכן ממורכז.
 * פס הסטטיסטיקות בזכוכית הוא חלק מההירו (ולכן TrustBand מציג רק תקנים).
 */
export function PremiumHero() {
  const reduced = useReducedMotion() ?? false;

  const fade = reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      dir="rtl"
      aria-labelledby="hero-heading"
      className="relative flex items-center justify-center overflow-hidden text-center"
      style={{ minHeight: "calc(100svh - 130px)" }}
    >
      <img
        src={heroAsset.url}
        alt="ענבר פרחי — פדיקוריסטית טיפולית ומרצה"
        width={1920}
        height={1280}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 18%" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,30,28,0.55) 0%, rgba(7,30,28,0.35) 40%, rgba(7,30,28,0.82) 100%)",
        }}
      />

      <motion.div
        {...fade}
        className="relative flex max-w-[860px] flex-col items-center px-6 py-20 md:px-8 md:py-24"
      >
        <div className="mb-6 flex items-center gap-4">
          <span aria-hidden className="h-px w-8 bg-white/55 md:w-11" />
          <span
            className="text-[13px] font-semibold text-white md:text-[15.5px]"
            style={{ letterSpacing: "0.22em", textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
          >
            מטפלת · מרצה · מכשירה פדיקוריסטיות
          </span>
          <span aria-hidden className="h-px w-8 bg-white/55 md:w-11" />
        </div>

        <h1
          id="hero-heading"
          className="m-0 text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 6vw, 3.875rem)",
            lineHeight: 1.14,
            textWrap: "balance",
            textShadow: "0 2px 24px rgba(0,0,0,0.35)",
          }}
        >
          הליכה בלי כאב מתחילה כאן
        </h1>

        <p
          className="mt-3 text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.1rem, 2.6vw, 1.5625rem)",
            lineHeight: 1.5,
            textShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}
        >
          הקליניקה של {SITE.brand} לפדיקור טיפולי — מרצה ומכשירה פדיקוריסטיות בכל הארץ
        </p>

        <p className="mt-3.5 max-w-[600px] text-[16px] leading-relaxed text-white/85 md:text-[19px]">
          12+ שנות ניסיון קליני, פרוטוקולים של איכילוב ואגודת אייל, ומאות מטופלים שחזרו ללכת בלי כאב.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <a
            href={HERO_WA_HREF}
            target="_blank"
            rel="noopener nofollow"
            className="btn-cta text-[16px] md:text-[18px]"
          >
            לתיאום טיפול בקליניקה
          </a>
          <a href="#academy" className="btn-glass text-[16px] md:text-[18px]">
            אני פדיקוריסטית — להכשרות
          </a>
        </div>

        <dl
          className="mt-11 grid w-full grid-cols-2 overflow-hidden md:flex md:w-auto"
          aria-label="נתוני הקליניקה"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 20,
          }}
        >
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                "border-white/20 px-5 py-4 md:px-[30px]",
                i % 2 === 1 ? "border-s" : "",
                i >= 2 ? "border-t" : "",
                i === 0 ? "md:border-s-0" : "md:border-s",
                "md:border-t-0",
              ].join(" ")}
            >
              <dt
                className="text-[22px] text-white md:text-[26px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                {s.num}
              </dt>
              <dd className="text-[12.5px] font-semibold text-white/75 md:text-[13.5px]">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
