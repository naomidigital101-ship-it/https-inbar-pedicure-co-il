import { useSite, waHref } from "@/lib/use-site";
import footModelAsset from "@/assets/inbar-foot-model.webp.asset.json";

/**
 * הירו הראשי — דיוקן ענבר עם מודל שכבות העור של כף הרגל.
 * התמונה היא cutout על רקע שקוף, ולכן היא מורכבת על גרדיאנט הירוק הכהה
 * ולא משמשת כתמונת רקע full-bleed.
 *
 * סדר במובייל: טקסט → דיוקן → מספרים.
 * הדיוקן הוא האלמנט שבונה אמון, ולכן הוא עולה מעל המספרים כדי שייראה
 * בלי גלילה. בדסקטופ הפריסה נשארת שתי עמודות: הטקסט והמספרים מימין,
 * הדיוקן משמאל לאורך שתי השורות.
 */
export function PremiumHero() {
  const site = useSite();
  const heroStats = site.homeHeroStats;
  // תמונת הירו ניתנת להחלפה מהאדמין; בהיעדר בחירה נשארת התמונה שבקוד.
  const heroImage = site.homeHeroImage || footModelAsset.url;

  return (
    <section
      dir="rtl"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--green-900) 0%, var(--green-700) 55%, var(--green-800) 100%)",
      }}
    >
      {/* הילה רכה מאחורי הדיוקן כדי שה-cutout לא ירחף */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 22% 78%, rgba(123,216,160,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-5 px-5 pt-6 md:grid md:min-h-[calc(100svh-200px)] md:grid-cols-[1.05fr_0.95fr] md:grid-rows-[auto_auto] md:items-end md:gap-x-10 md:gap-y-8 md:px-6 md:pt-8">
        {/* טקסט */}
        <div className="fade-up text-center md:col-start-1 md:row-start-1 md:self-end md:text-right">
          <div className="mb-3.5 flex items-center justify-center gap-3 md:mb-5 md:justify-start md:gap-4">
            <span aria-hidden className="h-px w-6 flex-shrink-0 bg-white/55 md:w-11" />
            <span
              className="text-[11.5px] font-semibold text-white md:text-[15px]"
              /* מרווח אותיות מצומצם במובייל — ב-0.2em השורה נשברה לשתיים */
              style={{ letterSpacing: "0.1em" }}
            >
              {site.homeHeroKicker}
            </span>
            <span aria-hidden className="h-px w-6 flex-shrink-0 bg-white/55 md:hidden" />
          </div>

          <h1
            id="hero-heading"
            className="m-0 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              lineHeight: 1.12,
              textWrap: "balance",
            }}
          >
            {site.homeHeroTitle}
          </h1>

          <p
            className="mt-2.5 text-white md:mt-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
              lineHeight: 1.45,
            }}
          >
            {site.homeHeroSubtitle}
          </p>

          <p className="mx-auto mt-2.5 max-w-[560px] text-[15.5px] leading-relaxed text-white/85 md:mx-0 md:mt-3.5 md:text-[18px]">
            {site.homeHeroLede}
          </p>

          {/* במובייל כפתורים ברוחב מלא — שטח נגיעה גדול ועמודה אחת נקייה */}
          <div className="mt-5 flex flex-col gap-2.5 md:mt-7 md:flex-row md:flex-wrap md:justify-start md:gap-3.5">
            <a
              href={waHref(site)}
              target="_blank"
              rel="noopener nofollow"
              className="btn-cta w-full text-[16px] md:w-auto md:text-[17px]"
            >
              {site.homeHeroCtaPrimary}
            </a>
            <a href="#academy" className="btn-glass w-full text-[16px] md:w-auto md:text-[17px]">
              {site.homeHeroCtaSecondary}
            </a>
          </div>
        </div>

        {/* דיוקן — cutout, מיושר לתחתית הסקשן */}
        <figure className="fade-up-delayed relative m-0 flex items-end justify-center md:col-start-2 md:row-start-1 md:row-span-2 md:self-end">
          <img
            src={heroImage}
            alt={`${site.brand} מחזיקה מודל אנטומי של שכבות העור וכף הרגל`}
            width={896}
            height={1200}
            loading="eager"
            fetchPriority="high"
            className="block h-auto w-auto max-h-[34svh] max-w-full object-contain md:max-h-[calc(100svh-260px)]"
            style={{
              filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.35))",
            }}
          />
        </figure>

        <dl
          /* justify-self-start — הפס הוא כעת ילד ישיר של הגריד, ובלעדיו
             היה נמתח לרוחב העמודה אם ענבר תשאיר פחות מארבעה מספרים */
          className="mb-6 grid grid-cols-2 overflow-hidden md:col-start-1 md:row-start-2 md:mb-10 md:inline-grid md:grid-cols-4 md:justify-self-start md:self-start"
          aria-label="נתוני הקליניקה"
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 20,
          }}
        >
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "border-white/20 px-3 py-2.5 text-center md:px-6 md:py-3.5 md:text-right",
                i % 2 === 1 ? "border-s" : "",
                i >= 2 ? "border-t" : "",
                i === 0 ? "md:border-s-0" : "md:border-s",
                "md:border-t-0",
              ].join(" ")}
            >
              <dt
                className="text-[19px] text-white md:text-[25px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                {s.num}
              </dt>
              <dd className="text-[11.5px] font-semibold leading-tight text-white/75 md:text-[13px]">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
