import { useSite, waHref } from "@/lib/use-site";
import footModelAsset from "@/assets/inbar-foot-model.webp.asset.json";

/**
 * הירו הראשי — דיוקן ענבר עם מודל שכבות העור של כף הרגל.
 * התמונה היא cutout על רקע שקוף, ולכן היא מורכבת על גרדיאנט הירוק הכהה
 * ולא משמשת כתמונת רקע full-bleed.
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

      <div className="relative mx-auto grid max-w-[1280px] items-end gap-8 px-6 pt-10 md:min-h-[calc(100svh-200px)] md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:pt-8">
        {/* טקסט */}
        <div className="fade-up pb-4 text-center md:pb-10 md:text-right">
          <div className="mb-5 flex items-center justify-center gap-4 md:justify-start">
            <span aria-hidden className="h-px w-8 bg-white/55 md:w-11" />
            <span
              className="text-[12.5px] font-semibold text-white md:text-[15px]"
              style={{ letterSpacing: "0.2em" }}
            >
              {site.homeHeroKicker}
            </span>
            <span aria-hidden className="h-px w-8 bg-white/55 md:hidden" />
          </div>

          <h1
            id="hero-heading"
            className="m-0 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(2.1rem, 5vw, 3.6rem)",
              lineHeight: 1.14,
              textWrap: "balance",
            }}
          >
            {site.homeHeroTitle}
          </h1>

          <p
            className="mt-3 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)",
              lineHeight: 1.5,
            }}
          >
            {site.homeHeroSubtitle}
          </p>

          <p className="mx-auto mt-3.5 max-w-[560px] text-[16px] leading-relaxed text-white/85 md:mx-0 md:text-[18px]">
            {site.homeHeroLede}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3.5 md:justify-start">
            <a
              href={waHref(site)}
              target="_blank"
              rel="noopener nofollow"
              className="btn-cta text-[16px] md:text-[17px]"
            >
              {site.homeHeroCtaPrimary}
            </a>
            <a href="#academy" className="btn-glass text-[16px] md:text-[17px]">
              {site.homeHeroCtaSecondary}
            </a>
          </div>

          <dl
            className="mt-9 grid grid-cols-2 overflow-hidden md:inline-grid md:grid-cols-4"
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
                  "border-white/20 px-4 py-3.5 text-center md:px-6 md:text-right",
                  i % 2 === 1 ? "border-s" : "",
                  i >= 2 ? "border-t" : "",
                  i === 0 ? "md:border-s-0" : "md:border-s",
                  "md:border-t-0",
                ].join(" ")}
              >
                <dt
                  className="text-[21px] text-white md:text-[25px]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {s.num}
                </dt>
                <dd className="text-[12px] font-semibold text-white/75 md:text-[13px]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* דיוקן — cutout, מיושר לתחתית הסקשן */}
        <figure className="fade-up-delayed relative m-0 flex items-end justify-center self-end">
          <img
            src={heroImage}
            alt={`${site.brand} מחזיקה מודל אנטומי של שכבות העור וכף הרגל`}
            width={896}
            height={1200}
            loading="eager"
            fetchPriority="high"
            className="block h-auto w-auto max-h-[46svh] max-w-full object-contain md:max-h-[calc(100svh-260px)]"
            style={{
              filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.35))",
            }}
          />
        </figure>
      </div>
    </section>
  );
}
