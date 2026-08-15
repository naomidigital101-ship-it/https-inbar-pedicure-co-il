import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { PartnersStrip } from "@/components/shared/PartnersStrip";
import { PremiumHero } from "@/components/home/PremiumHero";
import { TrustBand } from "@/components/home/TrustBand";
import { ContactSection } from "@/components/home/ContactSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ConsultationTab } from "@/components/shared/ConsultationTab";
import { SITE } from "@/lib/site-config";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";
import {
  listBeforeAfter,
  listContentBlocks,
  listReviews,
  listServices,
  type ServiceCard,
} from "@/lib/cms.functions";
import { useSite, waHref } from "@/lib/use-site";
import { HOME_BEFORE_AFTER } from "@/lib/home-content";
import type { ArticleCard } from "@/lib/article-cards";
import inbarPhotoAsset from "@/assets/inbar-hero-editorial.webp.asset.json";
import inbarPortraitAsset from "@/assets/inbar-farchi.jpg.asset.json";
import sterileTools from "@/assets/treatment-diabetic.jpg";

/* מודל שכבות העור שמור להירו בלבד — הוא cutout שקוף ונשבר בכרטיסים עם object-cover. */
const inbarPhoto = inbarPhotoAsset.url;
const inbarPortrait = inbarPortraitAsset.url;

/** שלוש ערכות הגוון של השפה: ירקרק, שמנת-זהב, ורדרד-טרקוטה. */
const TINTS = [
  { bg: "var(--primary-soft)", ring: "var(--green-300)", dot: "var(--primary)" },
  { bg: "var(--cream-100)", ring: "var(--gold-ring)", dot: "var(--accent-gold)" },
  { bg: "var(--accent-soft)", ring: "var(--blush-200)", dot: "var(--accent)" },
] as const;

// נשמר כמעטפת דקה כדי שכל קריאות ה-wa() בעמוד ימשיכו לעבוד כרגיל

export const Route = createFileRoute("/")({
  loader: async () => {
    // סקשן המדריכים הוא תוספת — כשל בשליפה לא אמור להפיל את כל דף הבית.
    const articles = await listPublishedAiArticleCards().catch(() => [] as ArticleCard[]);
    // כרטיסי "תחומי הליבה" וההמלצות מגיעים ממערכת הניהול.
    const [services, reviews, blocks, gallery] = await Promise.all([
      listServices().catch(() => ({ services: [] as ServiceCard[] })),
      listReviews().catch(() => ({ reviews: [], average: null, count: 0 })),
      listContentBlocks(),
      listBeforeAfter().catch(() => ({ items: [] })),
    ]);
    return {
      latestArticles: articles.slice(0, 6),
      flagships: services.services.filter((x) => x.isFlagship).slice(0, 3),
      reviews: reviews.reviews.slice(0, 6),
      rating: { average: reviews.average, count: reviews.count },
      blocks: blocks.blocks,
      gallery: gallery.items,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${SITE.brand} | פדיקור טיפולי בבית אל · הכשרות לפדיקוריסטיות` },
      {
        name: "description",
        content: `${SITE.brand} — פדיקוריסטית טיפולית ומרצה לבריאות כף הרגל. קליניקה בבית אל לטיפול ביבלות, פטרת, ציפורן חודרנית וכף רגל סוכרתית, והכשרות מקצועיות לפדיקוריסטיות בכל הארץ.`,
      },
      {
        name: "keywords",
        content:
          "פדיקור טיפולי בית אל, פדיקור טיפולי אזור בנימין, פדיקור ירושלים, הכשרת פדיקוריסטיות, יבלות, פטרת בציפורן, ציפורן חודרנית, פדיקור לחולי סוכרת, ענבר פרחי",
      },
      { name: "geo.region", content: "IL" },
      { name: "geo.placename", content: "בית אל, אזור בנימין" },
      {
        property: "og:title",
        content: `${SITE.brand} | פדיקור טיפולי בבית אל · הכשרות לפדיקוריסטיות`,
      },
      {
        property: "og:description",
        content: `קליניקה טיפולית לכף הרגל בבית אל, והכשרות לפדיקוריסטיות בכל הארץ. טיפול ביבלות, פטרת, ציפורן חודרנית וסוכרת.`,
      },
      { property: "og:locale", content: "he_IL" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE.url + "/" },
      { property: "og:image", content: SITE.url + inbarPhoto },
      { name: "twitter:image", content: SITE.url + inbarPhoto },
    ],
    links: [{ rel: "canonical", href: SITE.url + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.blocks?.home_faqs?.items ?? []).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
          name: SITE.brand,
          description: `קליניקה טיפולית לפדיקור טיפולי בבית אל, אזור בנימין. ${SITE.shortDescription}`,
          url: SITE.url,
          telephone: SITE.phoneIntl,
          email: SITE.email,
          image: SITE.url + inbarPhoto,
          priceRange: "₪₪",
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.city,
            addressRegion: SITE.region,
            addressCountry: "IL",
          },
          areaServed: [
            { "@type": "City", name: "בית אל" },
            { "@type": "City", name: "ירושלים" },
            { "@type": "AdministrativeArea", name: "אזור בנימין" },
            { "@type": "City", name: "עפרה" },
            { "@type": "City", name: "פסגות" },
            { "@type": "City", name: "כוכב יעקב" },
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: "09:00",
              closes: "20:00",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: SITE.brand,
          jobTitle: "פדיקוריסטית טיפולית, מרצה ארצית",
          image: SITE.url + inbarPhoto,
          url: SITE.url,
          worksFor: { "@type": "LocalBusiness", name: SITE.brand },
          knowsAbout: [
            "פדיקור טיפולי",
            "טיפול ביבלות",
            "פטרת ציפורן",
            "ציפורן חודרנית",
            "אורטוניקסיה",
            "שיקום ציפורן BIO",
            "כף הרגל הסוכרתית",
          ],
          areaServed: "בית אל, אזור בנימין, ירושלים",
          description:
            "פדיקוריסטית טיפולית עם 12+ שנות ניסיון קליני, מרצה ארצית להכשרת פדיקוריסטיות, מתמחה בכף הרגל הסוכרתית, אורטוניקסיה ושיקום ציפורן BIO.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": SITE.url + "/#webpage",
          url: SITE.url + "/",
          name: `${SITE.brand} | פדיקור טיפולי בבית אל · הכשרות לפדיקוריסטיות`,
          inLanguage: "he-IL",
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", "[data-speakable]"],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "שירותי פדיקור טיפולי",
          itemListElement: (loaderData?.blocks?.home_services?.items ?? []).map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.title,
              description: s.desc,
              url: `${SITE.url}/services/${s.slug}`,
              serviceType: s.title,
              areaServed: { "@type": "AdministrativeArea", name: "אזור בנימין, ירושלים" },
              provider: {
                "@type": "MedicalBusiness",
                name: SITE.brand,
                url: SITE.url,
                telephone: SITE.phoneIntl,
              },
            },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function SectionHead({
  title,
  sub,
  align = "center",
}: {
  title: ReactNode;
  sub?: string;
  align?: "center" | "start";
}) {
  return (
    <div className={align === "center" ? "mb-11 text-center" : "mb-11"}>
      <h2 className="m-0 text-ink" style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.375rem)" }}>
        {title}
      </h2>
      {sub ? (
        <p
          className={`mt-3 text-[17px] leading-relaxed md:text-[18px] ${align === "center" ? "mx-auto max-w-[640px]" : "max-w-[640px]"}`}
          style={{ color: "var(--text-muted)" }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function Home() {
  const { latestArticles, reviews, rating, blocks, gallery } = Route.useLoaderData();
  const site = useSite();
  const wa = (text: string) => waHref(site, text);

  // המקטעים מגיעים ממערכת הניהול; הצורות זהות לאלה שהיו קשיחות בקוד,
  // כך שהרינדור למטה לא השתנה.
  const items = (key: string) => blocks[key]?.items ?? [];
  const texts = (key: string) =>
    items(key)
      .map((i) => i.text)
      .filter(Boolean);

  const SERVICES = items("home_services");
  const CHIPS = items("home_chips");
  const PROCESS = items("home_process");
  const ACADEMY_TRACKS = items("home_academy");
  const WHY_ITEMS = texts("home_why");
  const CREDENTIALS = texts("home_credentials");
  const RED_FLAGS = texts("home_red_flags");
  const FAQS = items("home_faqs");
  // כל עוד הגלריה טרם יובאה לטבלה, מוצגים הפריטים שבקוד — אותם ארבעה
  // שמופיעים באתר היום. כך הייבוא לא משנה את מה שהמבקרים רואים.
  const BEFORE_AFTER = gallery.length
    ? gallery.map((g) => ({
        title: g.title,
        desc: g.description ?? "",
        slug: g.service_slug ?? "",
        img: g.before_image,
        alt: g.before_alt ?? g.title,
      }))
    : HOME_BEFORE_AFTER.map((b) => ({
        title: b.title,
        desc: b.desc,
        slug: b.slug,
        img: b.img,
        alt: b.alt,
      }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <ConsultationTab />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        <PremiumHero />
        <TrustBand />

        {/* בועות מצבים — אבחון מהיר */}
        <section
          className="bg-background px-6 pb-8 pt-14 md:pt-16"
          aria-labelledby="concerns-heading"
        >
          <div className="mx-auto max-w-[1100px]">
            <h2
              id="concerns-heading"
              className="m-0 mb-9 text-center text-ink"
              style={{ fontSize: "clamp(1.6rem, 3.2vw, 2rem)" }}
            >
              מה מטריד אותך בכף הרגל?
            </h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-[26px]">
              {CHIPS.map((chip, i) => {
                const tint = TINTS[i % TINTS.length];
                return (
                  <Link
                    key={chip.slug}
                    to="/services/$slug"
                    params={{ slug: chip.slug }}
                    className="group flex w-[104px] flex-col items-center gap-3 text-ink md:w-[118px]"
                  >
                    <span
                      aria-hidden
                      className="flex h-[84px] w-[84px] items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-[1.08] md:h-24 md:w-24"
                      style={{
                        background: tint.bg,
                        color: "var(--primary)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: 24,
                        border: "3px solid var(--paper)",
                        outline: `2px solid ${tint.ring}`,
                        boxShadow: "0 8px 22px rgba(15,76,74,0.12)",
                      }}
                    >
                      {chip.glyph}
                    </span>
                    <span className="text-center text-[14px] font-bold leading-tight md:text-[15px]">
                      {chip.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* שני קהלים */}
        <section
          className="mx-auto max-w-[1200px] px-6 py-14 md:py-20"
          aria-labelledby="audiences-heading"
        >
          <SectionHead
            title={<span id="audiences-heading">במה אפשר לעזור לך?</span>}
            sub="קליניקה למטופלים, הכשרות מקצועיות לפדיקוריסטיות — סטנדרט אחד לשניהם"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                href: "#clinic",
                img: inbarPhoto,
                alt: "ענבר פרחי בקליניקה בבית אל",
                badge: "למטופלים",
                badgeBg: "var(--green-400)",
                title: "כואב לך ללכת? יש פתרון.",
                desc: "יבלות, פטרת, ציפורן חודרנית, סדקים וכף רגל סוכרתית — אבחון וטיפול קליני בקליניקה בבית אל.",
                cta: "לכל הטיפולים ←",
                underline: "var(--accent)",
              },
              {
                href: "#academy",
                img: sterileTools,
                alt: "מגש כלים סטריליים חד־פעמיים לעבודה בסטנדרט קליני",
                badge: "לפדיקוריסטיות",
                badgeBg: "var(--gold-bright)",
                title: "רוצה לעבוד ברמה קלינית?",
                desc: "הכשרות מעשיות, סדנאות והרצאות — ענבר מגיעה אלייך לקליניקה או מרכזת קבוצה אזורית.",
                cta: "לתוכניות ההכשרה ←",
                underline: "var(--gold-bright)",
              },
            ].map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group relative block min-h-[340px] overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 md:min-h-[380px]"
                style={{ boxShadow: "0 14px 40px rgba(15,76,74,0.14)" }}
              >
                <img
                  src={card.img}
                  alt={card.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(10,40,38,0.92) 0%, rgba(10,40,38,0.25) 55%, transparent 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-[30px]">
                  <span
                    className="inline-block rounded-full px-3.5 py-1 text-[13.5px] font-bold"
                    style={{ background: card.badgeBg, color: "var(--green-900)" }}
                  >
                    {card.badge}
                  </span>
                  <h3 className="mb-2 mt-3.5 text-[23px] text-white md:text-[27px]">
                    {card.title}
                  </h3>
                  <p className="mb-3.5 text-[16px] leading-relaxed text-white/85 md:text-[16.5px]">
                    {card.desc}
                  </p>
                  <span
                    className="text-[16px] font-bold text-white"
                    style={{ borderBottom: `2px solid ${card.underline}`, paddingBottom: 2 }}
                  >
                    {card.cta}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* טיפולים */}
        <section
          id="clinic"
          className="mx-auto max-w-[1200px] px-6 py-14 md:py-[70px]"
          aria-labelledby="clinic-heading"
        >
          <SectionHead
            title={<span id="clinic-heading">הטיפולים בקליניקה</span>}
            sub="כל טיפול מבוסס פרוטוקול קליני מתועד, סטריליות מלאה וכלים חד־פעמיים. אבחון מדויק, טיפול עדין, בלי כאב מיותר."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((svc, i) => {
              const tint = TINTS[i % TINTS.length];
              return (
                <Link
                  key={svc.slug}
                  to="/services/$slug"
                  params={{ slug: svc.slug }}
                  className="group block rounded-3xl border border-border bg-surface p-7 transition-all duration-200 hover:-translate-y-1.5"
                  style={{ boxShadow: "var(--shadow-elegant)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-lift)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-elegant)")}
                >
                  <span
                    aria-hidden
                    className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-2xl"
                    style={{ background: tint.bg }}
                  >
                    <span
                      className="block h-[18px] w-[18px] rounded-full"
                      style={{ background: tint.dot }}
                    />
                  </span>
                  <h3 className="m-0 mb-2 text-[20px] text-ink md:text-[21px]">{svc.title}</h3>
                  <p
                    className="m-0 mb-3.5 text-[15.5px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {svc.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-[15.5px] font-bold"
                    style={{ color: "var(--accent-ink)" }}
                  >
                    לפרטים ולפרוטוקול
                    <ArrowLeft
                      className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl px-7 py-7 md:px-[34px]"
            style={{
              background: "linear-gradient(135deg, var(--green-700), var(--green-600))",
              boxShadow: "0 14px 36px rgba(15,76,74,0.25)",
            }}
          >
            <div>
              <p
                className="m-0 mb-1 text-[19px] text-white md:text-[21px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                סטריליות זה לא בונוס — זו חובה
              </p>
              <p className="m-0 text-[15.5px] text-white/80 md:text-[16px]">
                כלים חד־פעמיים נפתחים מולך · אוטוקלאב לכל כלי · פרוטוקול סוכרת ללא סכינים
              </p>
            </div>
            <a
              href={wa("שלום ענבר, אשמח לתאם אבחון")}
              target="_blank"
              rel="noopener nofollow"
              className="whitespace-nowrap rounded-full bg-surface px-7 py-3.5 text-[16px] font-bold transition-colors"
              style={{ color: "var(--primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--gold-bright)";
                e.currentTarget.style.color = "var(--green-900)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.color = "var(--primary)";
              }}
            >
              לתיאום אבחון ←
            </a>
          </div>
        </section>

        {/* אקדמיה */}
        <section
          id="academy"
          className="mt-10 px-6 py-16 md:py-[90px]"
          style={{ background: "linear-gradient(180deg, var(--green-900), var(--green-700))" }}
          aria-labelledby="academy-heading"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <span
                className="inline-block rounded-full px-4 py-1.5 text-[14px] font-bold"
                style={{ background: "var(--gold-bright)", color: "var(--green-900)" }}
              >
                מרצה ומכשירה · הכשרות בכל הארץ
              </span>
              <h2
                id="academy-heading"
                className="mb-4 mt-5 text-white"
                style={{ fontSize: "clamp(1.9rem, 4vw, 2.5rem)", lineHeight: 1.22 }}
              >
                מהקליניקה — אל הדור הבא של המקצוע
              </h2>
              <p className="mb-7 text-[17px] leading-[1.7] text-white/80 md:text-[18px]">
                אחרי יותר מעשור בקליניקה ומעל 150 שעות השתלמות בשנה, ענבר מעבירה את הידע הלאה:
                הכשרות מעשיות, סדנאות והרצאות לפדיקוריסטיות שרוצות לעבוד ברמה קלינית. ההכשרות
                מתקיימות אצלך בקליניקה או בקבוצות אזוריות.
              </p>
              <ol className="m-0 mb-8 grid list-none gap-3.5 p-0">
                {ACADEMY_TRACKS.map((t) => (
                  <li
                    key={t.num}
                    className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-4"
                  >
                    <span
                      aria-hidden
                      className="min-w-9 text-[22px]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        color: "var(--gold-bright)",
                      }}
                    >
                      {t.num}
                    </span>
                    <span>
                      <span className="block text-[17px] font-bold text-white">{t.title}</span>
                      <span className="block text-[15px] text-white/70">{t.desc}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-3.5">
                <a
                  href={wa("שלום ענבר, אני פדיקוריסטית ומתעניינת בהכשרה")}
                  target="_blank"
                  rel="noopener nofollow"
                  className="rounded-full px-7 py-3.5 text-[17px] font-bold transition-colors"
                  style={{ background: "var(--gold-bright)", color: "var(--green-900)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--gold-bright)")}
                >
                  לבדיקת התאמה להכשרה
                </a>
                <a
                  href={wa("שלום ענבר, אשמח להזמין הרצאה")}
                  target="_blank"
                  rel="noopener nofollow"
                  className="rounded-full border-[1.5px] border-white/50 px-7 py-3.5 text-[17px] font-bold text-white transition-colors hover:bg-white/10"
                >
                  להזמנת הרצאה
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src={inbarPortrait}
                alt="ענבר פרחי בקליניקה"
                loading="lazy"
                className="block aspect-square w-full rounded-[26px] object-cover"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
              />
              <div
                className="animate-floaty absolute -bottom-4 -right-3 rounded-2xl bg-surface px-6 py-4"
                style={{ boxShadow: "0 14px 36px rgba(0,0,0,0.25)" }}
              >
                <p
                  className="m-0 text-[22px] md:text-[24px]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "var(--primary)",
                  }}
                >
                  20+ בוגרות
                </p>
                <p className="m-0 text-[14px] font-semibold" style={{ color: "var(--text-muted)" }}>
                  כבר עובדות בסטנדרט קליני
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* תהליך */}
        <section
          id="process"
          className="mx-auto max-w-[1200px] px-6 py-16 md:py-[90px]"
          aria-labelledby="process-heading"
        >
          <SectionHead
            title={<span id="process-heading">איך נראה טיפול אצל ענבר?</span>}
            sub="מהשיחה הראשונה ועד הליכה בלי כאב — צעד אחר צעד"
          />
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            <span
              aria-hidden
              className="absolute right-[10%] left-[10%] top-11 hidden h-0.5 lg:block"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--green-300) 0 10px, transparent 10px 20px)",
              }}
            />
            {PROCESS.map((step) => (
              <div key={step.num} className="relative flex flex-col items-center px-4 text-center">
                <span
                  aria-hidden
                  className="relative z-[1] mb-5 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-surface"
                  style={{
                    border: "2px solid var(--green-300)",
                    fontFamily: "var(--font-display)",
                    fontSize: 30,
                    fontWeight: 900,
                    color: "var(--primary)",
                    boxShadow: "0 8px 22px rgba(15,76,74,0.10)",
                  }}
                >
                  {step.num}
                </span>
                <h3 className="m-0 mb-2 text-[19px] text-ink">{step.title}</h3>
                <p
                  className="m-0 text-[15px] leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-11 text-center">
            <a
              href={wa("שלום ענבר, אשמח לתאם אבחון")}
              target="_blank"
              rel="noopener nofollow"
              className="btn-cta text-[17px]"
            >
              בואו נתחיל — צרו קשר לתיאום אבחון
            </a>
          </div>
        </section>

        {/* למה ענבר */}
        <section
          className="px-6 py-16 md:py-[84px]"
          style={{ background: "var(--primary)" }}
          aria-labelledby="why-heading"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2
              id="why-heading"
              className="m-0 mb-11 text-center text-white"
              style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.25rem)" }}
            >
              למה דווקא ענבר?
            </h2>
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_ITEMS.map((item) => (
                <li
                  key={item}
                  className="rounded-3xl border border-white/15 bg-white/[0.06] px-5 py-6 text-center"
                >
                  <span
                    aria-hidden
                    className="mb-3 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full text-[17px] font-extrabold"
                    style={{ background: "var(--gold-bright)", color: "var(--green-900)" }}
                  >
                    ✓
                  </span>
                  <p
                    className="m-0 text-[17px] leading-snug text-white"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* לפני ואחרי */}
        <section
          className="mx-auto max-w-[1200px] px-6 py-16 md:py-20"
          aria-labelledby="ba-heading"
        >
          <SectionHead
            title={<span id="ba-heading">לפני ואחרי — תיעוד אמיתי</span>}
            sub="מקרים אמיתיים מהקליניקה: מציפורן חודרנית כרונית, דרך פטרת עיקשת ויבלות עמוקות, ועד שיקום ציפורן בשיטת BIO."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BEFORE_AFTER.map((c, i) => (
              <Link
                key={c.title}
                to="/services/$slug"
                params={{ slug: c.slug }}
                className="group overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1.5"
                style={{ boxShadow: "var(--shadow-soft)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-lift)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-soft)")}
              >
                <div
                  className="relative aspect-[3/2] overflow-hidden"
                  style={{ background: "var(--surface-soft)" }}
                >
                  <img
                    src={c.img}
                    alt={c.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="kicker m-0 mb-2">מקרה {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="m-0 text-[18px] text-ink">{c.title}</h3>
                  <p
                    className="m-0 mt-2 text-[14.5px] leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {c.desc}
                  </p>
                  <span
                    className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold"
                    style={{ color: "var(--accent-ink)" }}
                  >
                    לפרטים
                    <ArrowLeft
                      className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-[13px]" style={{ color: "var(--text-muted)" }}>
            * כל המקרים מוצגים באישור המטופלים. תמונות מלאות נמסרות בייעוץ אישי בקליניקה.
          </p>
        </section>

        {/* אודות */}
        <section
          id="about"
          className="mx-auto max-w-[1200px] px-6 pb-16 pt-6 md:pb-[90px]"
          aria-labelledby="about-heading"
        >
          <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <div className="relative">
              <img
                src={inbarPortrait}
                alt="ענבר פרחי בקליניקה"
                loading="lazy"
                className="block w-full rounded-[26px]"
                style={{ boxShadow: "0 18px 48px rgba(15,76,74,0.18)" }}
              />
              <span
                className="absolute right-5 top-5 rounded-full px-4 py-2 text-[14.5px] font-bold"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "var(--primary)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                }}
              >
                מרצה ומכשירה מקצועית
              </span>
            </div>
            <div>
              <p className="kicker kicker-rule m-0">נעים מאוד</p>
              <h2
                id="about-heading"
                className="mb-4 mt-4 text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.375rem)" }}
              >
                אני {site.brand}
              </h2>
              <p
                className="mb-3.5 text-[17px] leading-[1.75] md:text-[18px]"
                style={{ color: "var(--ink-soft)" }}
              >
                במשך יותר מ-12 שנה אני מטפלת בכף הרגל בגישה הקלינית הקפדנית ביותר — ובשנים האחרונות
                גם מלמדת אותה. הקליניקה שלי אינה מכון יופי: כל החלטה מתבססת על ראיות, פרוטוקולים
                בינלאומיים והבנה עמוקה של הפיזיולוגיה של כף הרגל.
              </p>
              <p
                className="mb-7 text-[17px] leading-[1.75] md:text-[18px]"
                style={{ color: "var(--ink-soft)" }}
              >
                אני מתמחה במקרים שאחרים מהססים לקבל — כף רגל סוכרתית, ציפורן חודרנית כרונית, פטרת
                עיקשת — ומכשירה פדיקוריסטיות לעבוד באותו סטנדרט בדיוק. מטופלים מגיעים אליי מבית אל,
                עפרה, פסגות, כוכב יעקב וירושלים.
              </p>
              <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                {CREDENTIALS.map((c) => (
                  <li
                    key={c}
                    className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-ink"
                    style={{ background: "var(--cream-50)" }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <a
                href="/about"
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-[15px] font-bold text-ink transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                הסיפור המלא
                <ArrowLeft
                  className="h-4 w-4"
                  style={{ color: "var(--accent-gold)" }}
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </section>

        {/* דגלים אדומים */}
        <section
          className="px-6 py-16 md:py-20"
          style={{ background: "var(--surface-warm)" }}
          aria-labelledby="flags-heading"
        >
          <div className="mx-auto grid max-w-[1100px] items-start gap-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="kicker m-0 mb-3">חשוב לדעת</p>
              <h2
                id="flags-heading"
                className="m-0 text-ink"
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.125rem)" }}
              >
                מתי נכון לפנות לרופא לפני טיפול
              </h2>
              <p
                className="mt-4 text-[16px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                פדיקור טיפולי הוא כלי חזק, אבל יש סימנים שמחייבים בדיקה קלינית מקדימה. אם את/ה מזהה
                אחד מאלה, אשמח להפנות לרופא המתאים לפני שנמשיך.
              </p>
            </div>
            <div
              className="rounded-3xl border bg-surface p-6 md:p-8"
              style={{ borderColor: "color-mix(in oklab, var(--destructive) 25%, transparent)" }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: "color-mix(in oklab, var(--destructive) 10%, transparent)",
                    color: "var(--destructive)",
                  }}
                >
                  <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="m-0 text-[19px] text-ink">דגלים אדומים</h3>
              </div>
              <ul
                className="m-0 grid list-none gap-3 p-0 text-[15px] leading-relaxed sm:grid-cols-2"
                style={{ color: "var(--ink-soft)" }}
              >
                {RED_FLAGS.map((flag) => (
                  <li key={flag} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: "var(--destructive)" }}
                    />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                בכל ספק, אשמח לבחון, להגיד מה אני רואה ולהפנות אם צריך. אין דבר כזה "שאלה מיותרת".
              </p>
            </div>
          </div>
        </section>

        {/* מדריכים */}
        {latestArticles.length > 0 ? (
          <section
            id="knowledge"
            className="px-6 py-16 md:py-20"
            style={{ background: "var(--stone-50)" }}
            aria-labelledby="knowledge-heading"
          >
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    id="knowledge-heading"
                    className="m-0 mb-2.5 text-ink"
                    style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.25rem)" }}
                  >
                    מדריכים לבריאות כף הרגל
                  </h2>
                  <p className="m-0 text-[17px]" style={{ color: "var(--text-muted)" }}>
                    כל מה שכדאי לדעת על בריאות כף הרגל, בעברית פשוטה
                  </p>
                </div>
                <Link
                  to="/knowledge"
                  className="rounded-full px-6 py-3 text-[15.5px] font-bold transition-colors"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
                >
                  לכל המאמרים ←
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.slice(0, 3).map((a: ArticleCard) => (
                  <Link
                    key={a.slug}
                    to="/article/$slug"
                    params={{ slug: a.slug }}
                    className="group block rounded-[20px] bg-surface p-6 transition-all duration-200 hover:-translate-y-1"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-lift)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-soft)")}
                  >
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[13px] font-bold"
                      style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                    >
                      {a.category}
                    </span>
                    <h3 className="mb-2 mt-3.5 text-[18px] leading-snug text-ink md:text-[19px]">
                      {a.title}
                    </h3>
                    <p
                      className="m-0 mb-3 text-[15px] leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {a.excerpt}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-[15px] font-bold"
                      style={{ color: "var(--accent-ink)" }}
                    >
                      לקריאה
                      <ArrowLeft
                        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* שאלות נפוצות */}
        <section
          className="mx-auto max-w-[840px] px-6 py-16 md:py-20"
          aria-labelledby="faq-heading"
        >
          <SectionHead
            title={<span id="faq-heading">לשאלות שמתביישים לשאול</span>}
            sub="תשובות כנות, בלי שיפוט"
          />
          <div className="grid gap-3.5">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-[18px] border border-border bg-surface px-6 py-5"
                style={{ boxShadow: "0 4px 16px rgba(15,76,74,0.06)" }}
              >
                <summary
                  className="flex cursor-pointer list-none items-start justify-between gap-5 text-[17px] text-ink marker:hidden"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  <span>{f.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border transition-all group-open:rotate-45"
                    style={{ color: "var(--accent-ink)" }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="mb-0 mt-3.5 text-[16px] leading-[1.7]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <ReviewsSection reviews={reviews} average={rating.average} count={rating.count} />

        <ContactSection />

        <div className="bg-background pb-10 pt-6">
          <PartnersStrip />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
