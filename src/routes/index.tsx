import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Footprints, Sparkles, Scissors, ShieldCheck, Droplets, HeartPulse, Activity, ArrowLeft, Phone, MessageCircle, MapPin, ChevronDown, GraduationCap, Award, Check } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE } from "@/lib/site-config";
import inbarPhoto from "@/assets/inbar-farchi.jpg.asset.json";

const SERVICES = [
  { slug: "corns", icon: Footprints, title: "יבלות וקאלוסים", desc: "הסרה בכלים סטריליים, איתור מקור הלחץ ומניעת הישנות." },
  { slug: "ingrown-nails", icon: Scissors, title: "ציפורן חודרנית", desc: "אורטוניקסיה ושיקום מבנה הציפורן ללא ניתוח, ללא כאב." },
  { slug: "fungus", icon: Droplets, title: "פטרת כף הרגל", desc: "טיפול יסודי בפטרת עור וציפורן עם הדרכה ביתית עד החלמה." },
  { slug: "onycholysis", icon: Sparkles, title: "ציפורן מנותקת", desc: "שיקום ציפורן שהתנתקה ממיטת הציפורן בשיטת BIO." },
  { slug: "cracked-heels", icon: Activity, title: "עור סדוק ועקבים", desc: "הסרה עדינה, איחוי סדקים והחזרת רכות לכף הרגל." },
  { slug: "diabetic-feet", icon: HeartPulse, title: "פדיקור לחולי סוכרת", desc: "פרוטוקול רפואי מאושר, ציוד חד־פעמי וסטריליות מלאה." },
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
  { n: "01", title: "אבחון מעמיק", desc: "בדיקה של כף הרגל, היסטוריה רפואית, נעליים ותבנית הליכה." },
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
  { q: "איך אדע אם אני זקוק/ה לפדיקור טיפולי?", a: "אם את או אתה מרגישים כאב בהליכה, סובלים מעור קשה, ציפורניים עבות או מתפוררות, סדקים בכפות הרגליים, או פטרת שחוזרת – זה סימן שהגיע הזמן לפדיקוריסטית טיפולית. ככל שמטפלים מוקדם יותר, ניתן למנוע סיבוכים." },
  { q: "איך אוכל לדעת שהטיפול נעשה בסטריליות מלאה?", a: "בקליניקה כל כלי עובר חיטוי ועיקור מלא במכשור ייעודי (אוטוקלאב), וכל טיפול מתבצע בתנאים נקיים לחלוטין. הסטריליות היא חלק בלתי נפרד מהטיפול הרפואי ומהבטיחות שלך." },
  { q: "האם זה בטוח לחולי סוכרת?", a: "בהחלט. אני מתמחה בטיפול בכף הרגל של חולי סוכרת לפי פרוטוקולים רפואיים מאושרים, עם חומרים עדינים, סטריליות מלאה וציוד חד־פעמי. המטרה: טיפול בטוח, מדויק ורגוע, עם תשומת לב לכל פרט." },
  { q: "אני מתביישת מהיבלות שלי, לא בא לי להגיע", a: "אין שום סיבה להתבייש – אני רואה מדי יום מקרים מורכבים וזה בדיוק התחום שבו אני מתמחה. היבלות נובעות מעומס, חיכוך או טיפול לא נכון בעבר. הטיפול נעשה באווירה רגועה, בלי שיפוט, עם הקשבה ופתרון אמיתי שיחזיר לך הליכה קלה כבר מהפגישה הראשונה." },
  { q: "ניסיתי טיפולים בעבר ולא היה שיפור, איך אדע שהפעם זה יעזור?", a: "ההבדל הוא בגישה. אני לא מטפלת רק בסימפטום אלא במקור הבעיה. כל טיפול נבנה לפי מצב העור, הציפורניים וההיסטוריה הרפואית שלך, עם שילוב של ידע רפואי, ניסיון, שיטות מתקדמות כמו BIO והדרכה ביתית." },
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
  head: () => ({
    meta: [
      { title: `${SITE.brand} | ${SITE.tagline}` },
      { name: "description", content: SITE.shortDescription },
      { property: "og:title", content: `${SITE.brand} | ${SITE.tagline}` },
      { property: "og:description", content: SITE.shortDescription },
      { property: "og:url", content: SITE.url + "/" },
      { property: "og:image", content: SITE.url + inbarPhoto.url },
      { name: "twitter:image", content: SITE.url + inbarPhoto.url },
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
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* HERO — boutique therapeutic */}
        <section className="relative overflow-hidden">
          {/* Warm ivory base + soft radial light */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_85%_10%,var(--copper-soft)_0%,transparent_55%),radial-gradient(ellipse_90%_70%_at_10%_90%,var(--primary-soft)_0%,transparent_60%),linear-gradient(180deg,var(--surface-warm)_0%,var(--background)_100%)] opacity-90" />
          {/* Subtle grain */}
          <div aria-hidden className="absolute inset-0 opacity-[0.18] mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18 0 0 0 0 0.18 0 0 0 0 0.16 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />

          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pb-24 md:pt-20 lg:gap-20">
            {/* TEXT — right side in RTL (order-1 on md) */}
            <div className="order-2 md:order-1">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-copper/25 bg-surface/70 px-4 py-1.5 backdrop-blur-sm">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-copper" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-copper">פדיקור טיפולי · {SITE.city}</span>
              </div>

              <h1 className="display text-[2.4rem] leading-[1.08] text-ink sm:text-5xl md:text-[3.4rem] lg:text-[3.75rem]">
                ענבר פרחי <span className="text-copper">·</span>
                <br />
                <span className="display-italic text-primary-deep">פדיקוריסטית טיפולית</span>
                <br />
                <span className="text-ink">לכף הרגל</span>
              </h1>

              <p className="mt-6 max-w-[34rem] text-[1.05rem] leading-[1.7] text-ink-soft md:text-lg">
                טיפול עדין, סטרילי ומקצועי ביבלות, פטרת, ציפורן חודרנית, סדקים וטיפול מותאם לחולי סוכרת.
              </p>

              <p className="mt-5 max-w-[34rem] border-r-2 border-copper/60 pr-4 text-[0.97rem] leading-relaxed text-ink/85">
                כאן מטפלים בכאב, בבושה ובחוסר הנוחות, בלי שיפוטיות ועם ניסיון של מעל 12 שנה.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-primary-deep px-7 py-3.5 text-[0.95rem] font-bold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-primary hover:shadow-[var(--shadow-lift)]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  קביעת טיפול בוואטסאפ
                </a>
                <a
                  href={SITE.wazeUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 bg-surface/80 px-6 py-3.5 text-[0.95rem] font-bold text-ink backdrop-blur-sm transition-all duration-300 hover:border-copper hover:bg-surface hover:text-primary-deep"
                >
                  <MapPin className="h-4 w-4 text-copper" aria-hidden />
                  ניווט לקליניקה
                </a>
              </div>

              {/* Proof chips */}
              <ul className="mt-9 flex flex-wrap gap-x-2.5 gap-y-2.5">
                {PROOF_CHIPS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-[0.78rem] font-semibold text-ink-soft backdrop-blur-sm transition-colors hover:border-copper/50 hover:text-ink"
                  >
                    <Icon className="h-3.5 w-3.5 text-copper" aria-hidden strokeWidth={1.8} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* IMAGE — left side in RTL (order-2 on md) */}
            <div className="relative order-1 md:order-2">
              <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2.25rem] bg-gradient-to-br from-primary-soft/70 via-surface/40 to-copper-soft/60 blur-[2px]" />
              <div aria-hidden className="absolute -bottom-4 -left-4 -z-10 hidden h-32 w-32 rounded-full border border-copper/30 md:block" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface shadow-[0_30px_60px_-30px_rgb(29_58_53/0.28),0_8px_24px_-12px_rgb(29_58_53/0.12)]">
                <img
                  src={inbarPhoto.url}
                  alt={`${SITE.brand} — פדיקוריסטית טיפולית ב${SITE.city}, טיפול בכף הרגל בקליניקה סטרילית`}
                  width={720}
                  height={820}
                  loading="eager"
                  className="aspect-[5/6] w-full object-cover"
                />
              </div>
              <p className="mt-3 px-2 text-[0.78rem] leading-relaxed text-text-muted">
                קליניקה טיפולית ב{SITE.city} · יחס אישי, סטריליות והכוונה להמשך
              </p>
            </div>
          </div>

          {/* Scroll cue */}
          <a
            href="#concerns"
            aria-label="המשך לסקשן הבא"
            className="relative mx-auto mb-8 hidden h-10 w-10 items-center justify-center rounded-full border border-copper/30 bg-surface/70 text-copper backdrop-blur-sm transition-colors hover:border-copper hover:text-primary-deep md:flex"
          >
            <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
          </a>
        </section>

        {/* CONCERNS — מה מטריד אותך בכף הרגל */}
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

        {/* TRUST STRIP */}
        <section className="border-y border-border bg-surface-warm py-6">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
            <span>איכילוב</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper" />
            <span>משרד הבריאות</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper" />
            <span>IWGDF · סוכרת</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper" />
            <span>NHS guidelines</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-copper" />
            <span>IDF · רפואה צבאית</span>
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
                  כל טיפול מבוסס על פרוטוקול רפואי מתועד. כל עמוד שירות כולל הסבר מעמיק, מקורות חיצוניים, וניסיון אישי מהקליניקה.
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

        {/* PULL QUOTE */}
        <section className="bg-surface-warm py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              <div className="flex-shrink-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-surface shadow-[var(--shadow-elegant)] md:h-40 md:w-40">
                  <img src={inbarPhoto.url} alt="ענבר פרחי" width={160} height={160} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
              <div>
                <span aria-hidden className="display-italic text-7xl leading-none text-copper">״</span>
                <blockquote className="display-italic mt-2 text-2xl leading-snug text-ink md:text-3xl">
                  אני לא מטפלת רק בסימפטום אלא במקור הבעיה. כל רגל מספרת סיפור אחר, והשליחות שלי היא להבין אותו ולהחזיר לך הליכה שקטה.
                </blockquote>
                <p className="mt-6 text-sm font-bold uppercase tracking-widest text-copper">ענבר פרחי · פדיקוריסטית טיפולית</p>
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
                <article key={a.title} className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="display text-4xl text-copper">0{i + 1}</span>
                    <span aria-hidden className="h-px flex-1 bg-border" />
                  </div>
                  <h3 className="display mb-3 text-xl text-ink">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{a.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-primary-deep py-24 text-white">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="mb-14 max-w-2xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-copper-soft">איך זה עובד</p>
              <h2 className="display text-4xl text-white md:text-5xl">
                התהליך, <span className="display-italic text-copper-soft">צעד אחר צעד</span>
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p) => (
                <div key={p.n} className="relative">
                  <p className="display text-6xl text-copper-soft/80">{p.n}</p>
                  <h3 className="display mt-3 text-2xl text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT TEASER */}
        <section className="bg-background py-24">
          <div className="mx-auto grid max-w-[1180px] gap-14 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-copper-soft opacity-50" />
              <img src={inbarPhoto.url} alt="ענבר פרחי בקליניקה" width={560} height={680} loading="lazy" className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[var(--shadow-elegant)]" />
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

        {/* STATS — editorial */}
        <section className="bg-surface-warm py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid gap-8 border-y border-border py-12 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center md:border-l md:border-border md:first:border-l-0">
                  <div className="display text-6xl text-primary-deep md:text-7xl">{s.num}</div>
                  <div className="mt-3 text-xs font-bold uppercase tracking-widest text-copper">{s.label}</div>
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
