import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Footprints, Sparkles, Scissors, ShieldCheck, Droplets, HeartPulse, Activity, ArrowLeft, Phone, MessageCircle, MapPin, GraduationCap, Award, AlertTriangle, BookOpen, Package, Wind } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { PartnersStrip } from "@/components/shared/PartnersStrip";
import { FlagshipCards } from "@/components/home/FlagshipCards";
import { TreatmentFinder } from "@/components/home/TreatmentFinder";
import { ConsultationTab } from "@/components/shared/ConsultationTab";
import { SITE, KNOWLEDGE_CATEGORIES_NAV } from "@/lib/site-config";
import inbarPhoto from "@/assets/inbar-hero-clinic.png";

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
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <ConsultationTab />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        {/* HERO — Cinematic Authority */}
        <section className="relative isolate overflow-hidden bg-background">
          {/* Background image — fills right side (RTL), fades to background on left */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <img
              src={inbarPhoto}
              alt=""
              width={1200}
              height={1400}
              loading="eager"
              className="absolute inset-y-0 right-0 h-full w-full object-cover object-[70%_center] opacity-95 md:w-[62%] md:object-center"
            />
            {/* Cream fade overlay — left to right on desktop, full on mobile */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/30 to-background md:via-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
          </div>

          <div className="grain absolute inset-0 -z-10 opacity-30" aria-hidden />

          <div className="mx-auto flex min-h-[82vh] max-w-[1280px] flex-col justify-center px-6 py-20 md:py-28 lg:px-10">
            <div className="max-w-2xl space-y-7">
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-copper" aria-hidden />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-copper">
                  קליניקה לבריאות כף הרגל · בית אל
                </span>
              </div>

              <h1 className="display text-[2.8rem] leading-[0.95] text-ink sm:text-[3.6rem] md:text-[5rem] lg:text-[5.5rem]">
                ענבר פרחי
                <span className="display-italic mt-3 block text-primary-deep">
                  סמכות קלינית
                  <br />
                  לבריאות כף הרגל
                </span>
              </h1>

              <p className="max-w-xl text-[1.05rem] leading-[1.75] text-ink-soft md:text-[1.15rem]">
                פדיקור טיפולי המבוסס על פרוטוקולים רפואיים — פטרת ציפורניים, אורטוניקסיה, סוכרת ושיקום BIO. בקליניקה אישית עם סטריליות מלאה וליווי עד החלמה.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-deep px-9 py-4 text-[0.98rem] font-bold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02] hover:bg-primary active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  לתיאום טיפול בקליניקה
                </a>
                <a
                  href="/masterclass"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-copper/50 bg-surface/80 px-8 py-4 text-[0.98rem] font-bold text-primary-deep backdrop-blur-sm transition-colors duration-300 hover:border-copper hover:bg-surface"
                >
                  <GraduationCap className="h-4 w-4 text-copper" aria-hidden />
                  מאסטרקלאס לפדיקוריסטיות
                </a>
              </div>

              {/* Inline stats */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
                {[
                  { n: "12+", l: "שנות ניסיון קליני" },
                  { n: "IWGDF", l: "פרוטוקול סוכרת" },
                  { n: "150+", l: "שעות השתלמות בשנה" },
                ].map((s) => (
                  <div key={s.l} className="flex items-baseline gap-2">
                    <span className="font-heading text-xl font-bold text-primary-deep md:text-2xl">{s.n}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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

        {/* STERILITY PROTOCOL */}
        <section className="bg-surface-warm py-20 md:py-24">
          <div className="mx-auto max-w-[1180px] px-6">
            <div className="mb-12 max-w-2xl">
              <p className="kicker mb-3">פרוטוקול הסטריליות של ענבר</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                סטריליות זה לא <span className="display-italic text-primary-deep">בונוס — זו חובה</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                כל טיפול מתחיל בפרוטוקול קבוע, גם כשנראה מהקליניקה החוצה שהכול רגוע. ככה אני מבטיחה שלא תיקחו מכאן כלום חוץ מהקלה.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Package, title: "כלים חד־פעמיים", desc: "סכינים, להבים ופצירות נפתחים מולך מאריזה סטרילית סגורה." },
                { icon: ShieldCheck, title: "עיקור אוטוקלאב", desc: "כל כלי רב־פעמי עובר ניקוי אולטרה־סוני ועיקור בלחץ ואדים." },
                { icon: HeartPulse, title: "פרוטוקול סוכרת", desc: "לחולי סוכרת — בלי חתכים, בלי השרייה, ובדיקה לפי IWGDF." },
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
                  פדיקור טיפולי הוא כלי חזק, אבל יש סימנים שמחייבים בדיקה רפואית מקדימה. אם את/ה מזהה אחד מאלה — אני אשמח להפנות לרופא המתאים לפני שנמשיך.
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
                    "פצע ברגל אצל חולה סוכרת — דחוף",
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
                  בכל ספק — אני אשמח לבחון, להגיד מה אני רואה ולהפנות אם צריך. אין דבר כזה "שאלה מיותרת".
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
                  עשרות מאמרים על יבלות, פטרת, ציפורניים, סוכרת ומניעה — כתובים על בסיס פרוטוקולים של משרד הבריאות, NHS, AAD ו-IWGDF.
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
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className="bg-surface-warm py-24">
          <div className="mx-auto max-w-[1000px] px-6">
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              <div className="flex-shrink-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-surface shadow-[var(--shadow-elegant)] md:h-40 md:w-40">
                  <img src={inbarPhoto} alt="ענבר פרחי" width={160} height={160} loading="lazy" className="h-full w-full object-cover" />
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
