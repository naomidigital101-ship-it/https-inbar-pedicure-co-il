import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Footprints, Sparkles, Scissors, ShieldCheck, Droplets, HeartPulse, Activity, ArrowLeft, Phone, MessageCircle, GraduationCap, Award, AlertTriangle, BookOpen, Package, Wind, Megaphone, Users } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { PartnersStrip } from "@/components/shared/PartnersStrip";
import { FlagshipCards } from "@/components/home/FlagshipCards";
import { TreatmentFinder } from "@/components/home/TreatmentFinder";
import { PremiumHero } from "@/components/home/PremiumHero";
import { TrustBand } from "@/components/home/TrustBand";
import { AboutExpert } from "@/components/home/AboutExpert";
import { ConsultationTab } from "@/components/shared/ConsultationTab";
import { SITE, KNOWLEDGE_CATEGORIES_NAV } from "@/lib/site-config";
import { listPublishedAiArticleCards } from "@/lib/ai-content.functions";
import type { ArticleCard } from "@/lib/article-cards";
import inbarPhoto from "@/assets/inbar-hero-editorial.jpg";
import baWarts from "@/assets/before-after/warts.png.asset.json";
import baCracked from "@/assets/before-after/cracked.png.asset.json";
import baIngrown from "@/assets/before-after/ingrown.png.asset.json";
import baOnycho from "@/assets/before-after/onycho.png.asset.json";

const SERVICES = [
  { slug: "corns", icon: Footprints, title: "יבלות וקאלוסים", desc: "הסרה בכלים סטריליים, איתור מקור הלחץ ומניעת הישנות." },
  { slug: "ingrown-nails", icon: Scissors, title: "ציפורן חודרנית", desc: "אורטוניקסיה ושיקום מבנה הציפורן ללא ניתוח, ללא כאב." },
  { slug: "fungus", icon: Droplets, title: "פטרת כף הרגל", desc: "טיפול יסודי בפטרת עור וציפורן עם הדרכה ביתית עד החלמה." },
  { slug: "onycholysis", icon: Sparkles, title: "ציפורן מנותקת", desc: "שיקום ציפורן שהתנתקה ממיטת הציפורן בשיטת BIO." },
  { slug: "cracked-heels", icon: Activity, title: "עור סדוק ועקבים", desc: "הסרה עדינה, איחוי סדקים והחזרת רכות לכף הרגל." },
  { slug: "diabetic-feet", icon: HeartPulse, title: "פדיקור לחולי סוכרת", desc: "פרוטוקול קליני מאושר, ציוד חד־פעמי וסטריליות מלאה." },
] as const;

const CONCERNS = [
  { slug: "corns", icon: Footprints, title: "יבלות בכף הרגל", desc: "כאב ממוקד בהליכה, עור מעובה מעל נקודות לחץ." },
  { slug: "fungus", icon: Droplets, title: "פטרת עור וציפורן", desc: "גרד, התקלפות, ציפורן שהצהיבה או התעבתה." },
  { slug: "ingrown-nails", icon: Scissors, title: "ציפורן חודרנית", desc: "כאב חד בצד הציפורן, אדמומיות או נפיחות חוזרת." },
  { slug: "cracked-heels", icon: Activity, title: "סדקים בעקב", desc: "עור יבש שמתפצל, לעיתים מדמם ומקשה על הליכה." },
  { slug: "onycholysis", icon: Sparkles, title: "ציפורן מנותקת", desc: "ציפורן שהתרוממה ממיטת הציפורן ודורשת שיקום BIO." },
  { slug: "diabetic-feet", icon: HeartPulse, title: "פדיקור לחולי סוכרת", desc: "טיפול בטוח לפי פרוטוקול IWGDF, בלי חתכים, בלי סיכונים." },
] as const;

const PROOF_CHIPS = [
  { icon: Award, label: "12+ שנות ניסיון" },
  { icon: HeartPulse, label: "התמחות בחולי סוכרת" },
  { icon: GraduationCap, label: "מרצה לפדיקוריסטיות" },
  { icon: ShieldCheck, label: "טיפול סטרילי ועדין" },
] as const;

const AUDIENCES = [
  { title: "חולי סוכרת", desc: "טיפול עדין ובטוח לפי פרוטוקולים מאושרים, עם חומרים ייעודיים ורגישות מלאה. המטרה: שמירה על בריאות הרגל ומניעת סיבוכים." },
  { title: "מבוגרים", desc: "עם השנים העור נעשה דק ויבש יותר וההליכה עלולה להיות מכאיבה. אני מטפלת בעדינות, מסירה עומסים ומחזירה נוחות בכל צעד." },
  { title: "חיילים ומילואימניקים", desc: "נעליים צבאיות ולחות ממושכת גורמות לפצעים, יבלות ופטרת. טיפול יעיל ומהיר שמחזיר את כף הרגל למצב תקין." },
  { title: "ספורטאים", desc: "עומס פיזי, נעליים סגורות וזיעה גורמים לפגיעות. טיפול בציפורניים פגועות, יבלות מאמץ והדרכה לשמירה על הרגל באימונים." },
] as const;

const STATS = [
  { num: "200+", label: "טיפולים מוצלחים" },
  { num: "12+", label: "שנות ניסיון קליני" },
  { num: "150+", label: "שעות השתלמות בשנה" },
  { num: "20+", label: "פדיקוריסטיות שהוכשרו" },
] as const;

const PROCESS = [
  { n: "01", title: "אבחון מעמיק", desc: "בדיקה של כף הרגל, היסטוריה אישית, נעליים ותבנית הליכה." },
  { n: "02", title: "תכנית טיפול", desc: "פרוטוקול אישי המבוסס על הסטנדרטים של איכילוב, NHS ו-IWGDF." },
  { n: "03", title: "טיפול בקליניקה", desc: "סטריליות מלאה, כלים חד-פעמיים, בלי דם, בלי כאב מיותר." },
  { n: "04", title: "ליווי עד החלמה", desc: "הדרכה ביתית, מעקב WhatsApp ומפגשי המשך לפי הצורך." },
] as const;

const TRUST = [
  "השתלמויות באיכילוב",
  "פרוטוקול IWGDF לסוכרת",
  "ציוד סטרילי חד־פעמי",
  "מומלצת ע\"י רופאי משפחה ואורתופדים",
] as const;

const FAQS = [
  { q: "האם הטיפול מתאים גם לגברים?", a: "בהחלט. הטיפולים מתאימים לגברים ולנשים כאחד. גברים רבים סובלים מעור קשה, פטרת, סדקים ויבלות ויכולים ליהנות מטיפול מקצועי, סטרילי ולא פולשני שמחזיר את הנוחות וההקלה באופן מיידי." },
  { q: "איך אדע אם אני זקוק/ה לפדיקור טיפולי?", a: "אם את או אתה מרגישים כאב בהליכה, סובלים מעור קשה, ציפורניים עבות או מתפוררות, סדקים בכפות הרגליים, או פטרת שחוזרת, זה סימן שהגיע הזמן לפדיקוריסטית טיפולית. ככל שמטפלים מוקדם יותר, ניתן למנוע סיבוכים." },
  { q: "איך אוכל לדעת שהטיפול נעשה בסטריליות מלאה?", a: "בקליניקה כל כלי עובר חיטוי ועיקור מלא במכשור ייעודי (אוטוקלאב), וכל טיפול מתבצע בתנאים נקיים לחלוטין. הסטריליות היא חלק בלתי נפרד מהטיפול הקליני ומהבטיחות שלך." },
  { q: "האם זה בטוח לחולי סוכרת?", a: "בהחלט. אני מתמחה בטיפול בכף הרגל של חולי סוכרת לפי פרוטוקולים קליניים מאושרים, עם חומרים עדינים, סטריליות מלאה וציוד חד־פעמי. המטרה: טיפול בטוח, מדויק ורגוע, עם תשומת לב לכל פרט." },
  { q: "אני מתביישת מהיבלות שלי, לא בא לי להגיע", a: "אין שום סיבה להתבייש. אני רואה מדי יום מקרים מורכבים וזה בדיוק התחום שבו אני מתמחה. היבלות נובעות מעומס, חיכוך או טיפול לא נכון בעבר. הטיפול נעשה באווירה רגועה, בלי שיפוט, עם הקשבה ופתרון אמיתי שיחזיר לך הליכה קלה כבר מהפגישה הראשונה." },
  { q: "ניסיתי טיפולים בעבר ולא היה שיפור, איך אדע שהפעם זה יעזור?", a: "ההבדל הוא בגישה. אני לא מטפלת רק בסימפטום אלא במקור הבעיה. כל טיפול נבנה לפי מצב העור, הציפורניים וההיסטוריה האישית שלך, עם שילוב של ידע קליני, ניסיון, שיטות מתקדמות כמו BIO והדרכה ביתית." },
  { q: "כמה זמן לוקח לראות תוצאות?", a: "במקרים רבים כבר אחרי טיפול אחד מרגישים הקלה משמעותית. בטיפולים שיקומיים (פטרת, שיקום ציפורן) נדרש תהליך של מספר מפגשים, ואני מלווה אותך באופן צמוד עד שהתוצאה מושלמת." },
  { q: "מה קורה אם אני לא בטוחה מה יש לי?", a: "לא צריך לדעת מראש. תגיעי לפגישה, אבדוק את כף הרגל, אבצע אבחנה ואסביר מה הבעיה, מה גורם לה ואיך נכון לטפל בה. הרבה פעמים אנשים מופתעים לגלות שזה משהו פשוט שאפשר לפתור במהירות." },
] as const;

const BULLETS = [
  "טיפול ביבלות ופטריות בשיטה סטרילית המונעת זיהום",
  "התמחות בכף הרגל של חולי סוכרת לפי פרוטוקול IWGDF",
  "אורטוניקסיה ושיקום ציפורן ללא פגיעה במבנה",
  "ליווי אישי בוואטסאפ עד החלמה מלאה",
] as const;

export const Route = createFileRoute("/")({
  loader: async () => {
    const articles = await listPublishedAiArticleCards();
    return { latestArticles: articles.slice(0, 6) };
  },
  head: () => ({
    meta: [
      { title: `פדיקור טיפולי בבית אל ובאזור בנימין | ${SITE.brand}` },
      { name: "description", content: `קליניקה טיפולית לכף הרגל בבית אל. ${SITE.brand}, פדיקוריסטית טיפולית עם 12+ שנות ניסיון. טיפול ביבלות, פטרת, ציפורן חודרנית, סדקים וסוכרת. שירות לכל אזור בנימין, ירושלים והיישובים הסמוכים.` },
      { name: "keywords", content: "פדיקור טיפולי בית אל, פדיקור טיפולי אזור בנימין, פדיקור ירושלים, יבלות, פטרת בציפורן, ציפורן חודרנית, פדיקור לחולי סוכרת, ענבר פרחי" },
      { name: "geo.region", content: "IL" },
      { name: "geo.placename", content: "בית אל, אזור בנימין" },
      { property: "og:title", content: `פדיקור טיפולי בבית אל ובאזור בנימין | ${SITE.brand}` },
      { property: "og:description", content: `קליניקה טיפולית לכף הרגל בבית אל. טיפול ביבלות, פטרת, ציפורן חודרנית וסוכרת. שירות לכל אזור בנימין וירושלים.` },
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
          mainEntity: FAQS.map((f) => ({
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
          "@type": ["LocalBusiness", "LocalBusiness"],
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
          knowsAbout: ["פדיקור טיפולי", "טיפול ביבלות", "פטרת ציפורן", "ציפורן חודרנית", "אורטוניקסיה", "שיקום ציפורן BIO", "כף הרגל הסוכרתית"],
          areaServed: "בית אל, אזור בנימין, ירושלים",
          description:
            "פדיקוריסטית טיפולית עם 12+ שנות ניסיון קליני, מרצה ארצית להכשרת פדיקוריסטיות, מתמחה בכף הרגל הסוכרתית, אורטוניקסיה ושיקום ציפורן BIO. מבוססת פרוטוקולים של איכילוב, NHS ו-IWGDF.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": SITE.url + "/#webpage",
          url: SITE.url + "/",
          name: `פדיקור טיפולי בבית אל ובאזור בנימין | ${SITE.brand}`,
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
          itemListElement: SERVICES.map((s, i) => ({
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

function Home() {
  const { latestArticles } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <ConsultationTab />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        <PremiumHero />
        <TrustBand />
        <AboutExpert />

        {/* FLAGSHIP CARDS — 3 ה־טיפולים הדגל */}
        <FlagshipCards />

        {/* TREATMENT FINDER — סרגל סינון צף */}
        <TreatmentFinder />

        <section id="concerns" className="relative bg-background py-20 md:py-24">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="kicker mb-3">לאבחון מהיר</p>
                <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                  מה מטריד אותך <span className="display-italic text-primary-deep">בכף הרגל?</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">
                  בחרו את הבעיה הקרובה ביותר למה שאתם מרגישים, ואקח אתכם להסבר מלא, סימני אזהרה ופרוטוקול טיפול.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CONCERNS.map(({ slug, icon: Icon, title, desc }) => (
                <Link
                  key={slug}
                  to="/services/$slug"
                  params={{ slug }}
                  className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-copper/40 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-soft/70 text-primary-deep transition-colors group-hover:bg-primary-deep group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden strokeWidth={1.6} />
                  </div>
                  <div className="flex-1">
                    <h3 className="display text-lg text-ink">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-deep group-hover:text-copper">
                      לפרטים <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AUTHORITY STRIP */}
        <section className="border-y border-border bg-surface-warm py-8">
          <div className="mx-auto flex max-w-[1100px] items-center gap-5 px-6">
            <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-copper/40 text-copper sm:flex">
              <ShieldCheck className="h-5 w-5" aria-hidden strokeWidth={1.6} />
            </div>
            <p className="text-center text-[0.95rem] leading-relaxed text-ink-soft sm:text-right">
              ענבר משלבת ניסיון טיפולי, הדרכת פדיקוריסטיות ופרוטוקול סטריליות מוקפד כדי לתת מענה <span className="font-bold text-ink">בטוח, רגיש ומקצועי</span>.
            </p>
          </div>
        </section>

        {/* MEDICAL AUTHORITY LOGOS */}
        <section className="bg-background py-6">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em] text-text-muted">
            <span>מבוסס פרוטוקולים של</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper/60" />
            <span>איכילוב</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper/60" />
            <span>משרד הבריאות</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper/60" />
            <span>IWGDF</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper/60" />
            <span>NHS</span>
          </div>
        </section>

        {/* SERVICES */}
        <section className="bg-background py-24">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="kicker mb-4">מה מטפלים כאן</p>
                <h2 className="display text-4xl text-ink md:text-5xl">
                  שירותי <span className="display-italic text-primary-deep">פדיקור טיפולי</span>
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
                  כל טיפול מבוסס על פרוטוקול קליני מתועד. כל עמוד שירות כולל הסבר מעמיק, מקורות חיצוניים, וניסיון אישי מהקליניקה.
                </p>
              </div>
              <Link to="/services" className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-deep">
                כל השירותים <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group relative flex flex-col gap-4 bg-surface p-8 transition-colors hover:bg-surface-warm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-deep transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" aria-hidden strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-copper">טיפול</span>
                    </div>
                    <h3 className="display text-2xl text-ink">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-deep">
                      קראו עוד <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* STERILITY PROTOCOL */}
        <section className="bg-surface-warm py-20 md:py-24">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="mb-12 max-w-2xl">
              <p className="kicker mb-3">פרוטוקול הסטריליות של ענבר</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                סטריליות זה לא <span className="display-italic text-primary-deep">בונוס, זו חובה</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                כל טיפול מתחיל בפרוטוקול קבוע, גם כשנראה מהקליניקה החוצה שהכול רגוע. ככה אני מבטיחה שלא תיקחו מכאן כלום חוץ מהקלה.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Package, title: "כלים חד־פעמיים", desc: "סכינים, להבים ופצירות נפתחים מולך מאריזה סטרילית סגורה." },
                { icon: ShieldCheck, title: "עיקור אוטוקלאב", desc: "כל כלי רב־פעמי עובר ניקוי אולטרה־סוני ועיקור בלחץ ואדים." },
                { icon: HeartPulse, title: "פרוטוקול סוכרת", desc: "לחולי סוכרת: בלי חתכים, בלי השרייה, ובדיקה לפי IWGDF." },
                { icon: Wind, title: "סביבה נקייה", desc: "משטח עבודה מחוטא בין מטופל למטופל, מסכה וכפפות בכל טיפול." },
              ].map(({ icon: Icon, title, desc }) => (
                <article key={title} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-deep">
                    <Icon className="h-5 w-5" aria-hidden strokeWidth={1.6} />
                  </div>
                  <h3 className="display text-lg text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RED FLAGS */}
        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-start">
              <div>
                <p className="kicker mb-3">חשוב לדעת</p>
                <h2 className="display text-3xl text-ink md:text-[2.3rem]">
                  מתי נכון לפנות <span className="display-italic text-primary-deep">לרופא לפני טיפול</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">
                  פדיקור טיפולי הוא כלי חזק, אבל יש סימנים שמחייבים בדיקה קלינית מקדימה. אם את/ה מזהה אחד מאלה, אשמח להפנות לרופא המתאים לפני שנמשיך.
                </p>
              </div>
              <div className="rounded-2xl border border-destructive/25 bg-surface-warm p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5" aria-hidden strokeWidth={1.8} />
                  </div>
                  <h3 className="display text-xl text-ink">דגלים אדומים</h3>
                </div>
                <ul className="grid gap-3 text-sm leading-relaxed text-ink-soft sm:grid-cols-2">
                  {[
                    "פצע פתוח, דימום או הפרשה מכף הרגל",
                    "כאב חד שלא מתפוגג גם במנוחה",
                    "נפיחות משמעותית או חום מקומי",
                    "חשד לזיהום (אדמומיות מתפשטת, ריח חזק)",
                    "פצע ברגל אצל חולה סוכרת (דחוף)",
                    "תחושת נימול או חוסר תחושה ברגל",
                    "שינוי צבע חד של ציפורן או עור",
                    "שטף דם תת־צפורני אחרי חבלה",
                  ].map((flag) => (
                    <li key={flag} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
                  בכל ספק, אשמח לבחון, להגיד מה אני רואה ולהפנות אם צריך. אין דבר כזה "שאלה מיותרת".
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KNOWLEDGE HUB TEASER */}
        <section className="bg-surface-warm py-20 md:py-24">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="kicker mb-3">מרכז הידע לבריאות כף הרגל</p>
                <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                  ידע מבוסס, <span className="display-italic text-primary-deep">בעברית פשוטה</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">
                  עשרות מאמרים על יבלות, פטרת, ציפורניים, סוכרת ומניעה, כתובים על בסיס פרוטוקולים של משרד הבריאות, NHS, AAD ו-IWGDF.
                </p>
              </div>
              <Link to="/knowledge" className="group inline-flex items-center gap-2 text-sm font-bold text-primary-deep hover:text-copper">
                כל המאמרים <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {KNOWLEDGE_CATEGORIES_NAV.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-deep group-hover:bg-primary-deep group-hover:text-primary-foreground">
                      <BookOpen className="h-4 w-4" aria-hidden strokeWidth={1.8} />
                    </div>
                    <span className="display text-base text-ink">{cat.label}</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-copper transition-transform group-hover:-translate-x-1" aria-hidden />
                </Link>
              ))}
            </div>

            {latestArticles.length > 0 ? (
              <div className="mt-12">
                <p className="kicker mb-5">מאמרים אחרונים</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {latestArticles.map((a: ArticleCard) => (
                    <Link
                      key={a.slug}
                      to="/article/$slug"
                      params={{ slug: a.slug }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                      aria-label={a.title}
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-surface-warm">
                        <img
                          src={a.heroImage}
                          alt={a.heroAlt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-bold text-primary-deep">
                          {a.category} · {a.dateLabel}
                        </p>
                        <h3 className="display mt-3 text-lg leading-snug text-ink">{a.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a.excerpt}</p>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-bold text-copper">
                          קריאה <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* PULL QUOTE / CTA BAND */}
        <section dir="rtl" className="py-24 md:py-[120px]" style={{ background: "var(--green-950)", fontFamily: "var(--font-body)" }}>
          <div className="mx-auto max-w-[1000px] px-6">
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              <div className="flex-shrink-0">
                <div
                  className="relative h-32 w-32 overflow-hidden md:h-40 md:w-40"
                  style={{
                    borderRadius: "60% 40% 50% 50% / 55% 45% 55% 45%",
                    border: "3px solid var(--primary)",
                    boxShadow: "0 12px 32px rgb(15 107 110 / 0.35)",
                  }}
                >
                  <img src={inbarPhoto} alt="ענבר פרחי" width={160} height={160} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
              <div>
                <span
                  aria-hidden
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 800,
                    fontSize: "5rem",
                    lineHeight: 0.7,
                    display: "block",
                    color: "var(--primary)",
                    opacity: 0.85,
                  }}
                >
                  ״
                </span>
                <blockquote
                  className="mt-3 text-2xl leading-snug md:text-[2rem]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 400,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.45,
                    color: "#FAFAF8",
                  }}
                >
                  אני לא מטפלת רק בסימפטום אלא במקור הבעיה. כל רגל מספרת סיפור אחר, והשליחות שלי היא להבין אותו ולהחזיר לך הליכה שקטה.
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <span className="h-px w-10" style={{ background: "var(--green-300)" }} />
                  <p
                    className="text-[12px] uppercase"
                    style={{ color: "var(--green-300)", fontWeight: 500, letterSpacing: "0.24em" }}
                  >
                    ענבר פרחי · פדיקוריסטית טיפולית
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCES */}
        <section className="bg-background py-24">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-14 max-w-2xl">
              <p className="kicker mb-4">למי אני מטפלת</p>
              <h2 className="display text-4xl text-ink md:text-5xl">
                מטופלים שונים, <span className="display-italic text-primary-deep">צורך אחד</span>
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {AUDIENCES.map((a, i) => (
                <article key={a.title} className="group relative overflow-hidden rounded-lg border border-border bg-surface p-7 transition-colors hover:bg-stone-50">
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="serif-accent"
                      style={{ fontSize: "2.4rem", lineHeight: 1, color: "var(--green-300)" }}
                    >
                      0{i + 1}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="display mb-3 text-xl text-ink">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{a.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS — French catalogue */}
        <section className="py-24 md:py-[120px]" style={{ background: "var(--stone-50)" }}>
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-14 max-w-2xl">
              <p
                className="mb-4 text-[12px] font-medium uppercase"
                style={{ letterSpacing: "0.24em", color: "var(--green-500)" }}
              >
                תהליך הטיפול
              </p>
              <h2 className="display" style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", color: "var(--ink-900)", fontWeight: 300 }}>
                איך נראה טיפול בקליניקה — צעד אחר צעד
              </h2>
            </div>
            <div className="grid gap-10 md:grid-cols-4 md:gap-px md:bg-[var(--stone-100)]">
              {PROCESS.map((p) => (
                <div key={p.n} className="relative md:p-7" style={{ background: "var(--stone-50)" }}>
                  <span
                    className="serif-accent block"
                    style={{ fontSize: "3.2rem", lineHeight: 1, color: "var(--green-300)" }}
                  >
                    {p.n}
                  </span>
                  <span aria-hidden className="mt-5 mb-5 block h-px w-10" style={{ background: "var(--green-500)" }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.25rem", color: "var(--ink-900)", letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p className="mt-3 text-[15px]" style={{ lineHeight: 1.7, color: "var(--ink-600)" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEFORE & AFTER */}
        <section className="bg-background py-24">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-14 max-w-2xl">
              <p className="kicker mb-4">תוצאות מהקליניקה</p>
              <h2 className="display text-4xl text-ink md:text-5xl">
                לפני ואחרי — <span className="display-italic text-primary-deep">תיעוד אמיתי</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                מקרים אמיתיים של מטופלים בקליניקה — מציפורן חודרנית כרונית, דרך פטרת עיקשת, יבלות עמוקות וסדקים בעקב, ועד שיקום ציפורן בשיטת BIO.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "ציפורן חודרנית", desc: "אורתוניקסיה ושיקום מבנה הציפורן ללא ניתוח, ללא כאב.", slug: "ingrown-nails", img: baIngrown.url, alt: "תמונת לפני ואחרי טיפול בציפורן חודרנית בכף הרגל" },
                { title: "יבלה עמוקה", desc: "הסרה בכלים סטריליים, איתור מקור הלחץ ומניעת הישנות.", slug: "corns", img: baWarts.url, alt: "תמונת לפני ואחרי טיפול ביבלות בכף הרגל" },
                { title: "עור סדוק בעקב", desc: "הסרה עדינה, איחוי סדקים והחזרת רכות לכף הרגל.", slug: "cracked-heels", img: baCracked.url, alt: "תמונת לפני ואחרי טיפול בעור סדוק בעקב" },
                { title: "שיקום ציפורן BIO", desc: "מילוי וטיפוח ציפורן שהתנתקה ממיטת הציפורן.", slug: "onycholysis", img: baOnycho.url, alt: "תמונת לפני ואחרי שיקום ציפורן מנותקת אונכילוזיס" },
              ].map((c, i) => (
                <Link
                  key={c.title}
                  to="/services/$slug"
                  params={{ slug: c.slug }}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-surface-warm">
                    <img
                      src={c.img}
                      alt={c.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="kicker mb-2">מקרה {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="display text-lg text-ink">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-deep group-hover:text-copper">
                      לפרטים <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-text-muted">
              * כל המקרים מוצגים באישור המטופלים. תמונות מלאות נמסרות בייעוץ אישי בקליניקה.
            </p>
          </div>
        </section>

        {/* ABOUT TEASER */}
        <section className="bg-background py-24">
          <div className="mx-auto grid max-w-[1180px] gap-14 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-copper-soft opacity-50" />
              <img src={inbarPhoto} alt="ענבר פרחי בקליניקה" width={560} height={680} loading="lazy" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[var(--shadow-elegant)]" />
            </div>
            <div>
              <p className="kicker mb-4">נעים מאוד</p>
              <h2 className="display mb-6 text-4xl text-ink md:text-5xl">
                אני <span className="display-italic text-primary-deep">ענבר פרחי</span>
              </h2>
              <p className="mb-5 text-lg leading-relaxed text-ink-soft">
                פדיקוריסטית טיפולית עם 12+ שנות ניסיון, המתמחה בטיפול במחלות רגליים, יבלות, פטרת ושיקום ציפורניים בשיטת BIO. בעיניי טיפול בכף הרגל הוא חלק בלתי נפרד מהבריאות הכללית.
              </p>
              <p className="mb-8 display-italic text-2xl leading-snug text-primary-deep">
                מגיע לכל אדם ללכת בלי כאב, להרגיש נוחות וביטחון בכל צעד.
              </p>
              <a href="/about" className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary">
                הסיפור המלא <ArrowLeft className="h-4 w-4 text-copper" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section dir="rtl" className="py-20" style={{ background: "var(--ink)" }}>
          <div className="mx-auto max-w-[1280px] px-6">
            <div
              className="grid gap-0 border-y py-14 md:grid-cols-4"
              style={{ borderColor: "oklch(0.28 0.04 192)" }}
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center py-6 text-center md:border-l md:py-0 md:first:border-l-0"
                  style={{ borderColor: "oklch(0.28 0.04 192)" }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      fontSize: "clamp(3rem, 6vw, 4.5rem)",
                      lineHeight: 1,
                      color: "var(--primary-soft)",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "oklch(0.60 0.07 185)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background py-24">
          <div className="mx-auto max-w-[860px] px-6">
            <div className="mb-12">
              <p className="kicker mb-4">תשובות כנות</p>
              <h2 className="display text-4xl text-ink md:text-5xl">
                לשאלות שמתביישים <span className="display-italic text-primary-deep">לשאול</span>
              </h2>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium text-ink marker:hidden">
                    <span>{f.q}</span>
                    <span aria-hidden className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border text-primary transition-all group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-primary-foreground">+</span>
                  </summary>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-background pb-24">
          {/* PEDICURIST EMPOWERMENT */}
          <div className="mx-auto mb-16 max-w-[1180px] px-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-copper/30 bg-surface-warm p-8 md:p-12">
              <div aria-hidden className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-copper-soft/30 blur-3xl" />
              <div className="relative grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-center">
                <div>
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/15 text-copper">
                    <Megaphone className="h-6 w-6" aria-hidden strokeWidth={1.6} />
                  </div>
                  <p className="kicker mb-3">פדיקוריסטית? הצטרפי למאבק</p>
                  <h2 className="display text-3xl text-ink md:text-[2.3rem]">
                    הגיע הזמן להכיר <span className="display-italic text-primary-deep">בערך המקצועי שלנו</span>
                  </h2>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-ink-soft">
                    הפדיקור הטיפולי עדיין לא מוכר רשמית כמקצוע פרא־רפואי בישראל, למרות הניסיון, ההשתלמויות ופרוטוקולי הסטריליות שאנחנו מקפידות עליהם בכל יום. אני מובילה מסלול הכשרה והסברה לפדיקוריסטיות שרוצות להעלות את הסטנדרט המקצועי, להגן על המטופלים שלהן ולהילחם להכרה רשמית.
                  </p>
                  <ul className="mt-5 grid gap-2.5 text-sm text-ink-soft sm:grid-cols-2">
                    {[
                      "השתלמויות מקצועיות מתקדמות",
                      "פרוטוקולי סטריליות מאושרים",
                      "ליווי קליני אישי",
                      "קהילה מקצועית פעילה",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-copper" aria-hidden strokeWidth={1.8} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      to="/masterclass"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-deep"
                    >
                      להצטרפות למאסטרקלאס <ArrowLeft className="h-4 w-4" aria-hidden />
                    </Link>
                    <a
                      href={SITE.whatsappUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden /> ליצירת קשר
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PartnersStrip />
          <div className="mx-auto max-w-[1100px] px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-deep via-primary to-primary-deep px-8 py-16 text-center md:px-16 md:py-20">
              <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-copper-soft/20 blur-3xl" />
              <div aria-hidden className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-copper-soft/20 blur-3xl" />
              <div className="relative">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--copper-soft)" }}>קביעת תור</p>
                <h2 className="display text-4xl text-white md:text-5xl lg:text-6xl">
                  מוכנים לחזור <span className="display-italic">ללכת בלי כאב?</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85">
                  אשמח לקבל אתכם לפגישת אבחון בקליניקה ב{SITE.city}. {SITE.hoursDisplay}.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-surface px-8 py-4 text-sm font-bold text-primary-deep shadow-[var(--shadow-elegant)] transition-transform hover:scale-105">
                    <MessageCircle className="h-4 w-4" aria-hidden /> וואטסאפ
                  </a>
                  <a href={SITE.telUrl} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10">
                    <Phone className="h-4 w-4" aria-hidden /> {SITE.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
