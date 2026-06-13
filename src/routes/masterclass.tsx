import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Microscope,
  HeartPulse,
  Scissors,
  ShieldCheck,
  BookOpen,
  Star,
  ArrowLeft,
  FlaskConical,
  Layers,
  Activity,
} from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE } from "@/lib/site-config";
import inbarPhoto from "@/assets/inbar-hero-clinic.png";

const REGISTER_TEXT = encodeURIComponent(
  "שלום ענבר, אני פדיקוריסטית ומתעניינת במאסטרקלאס. אשמח לפרטים על המחזור הקרוב."
);
const REGISTER_URL = `${SITE.whatsappUrl}?text=${REGISTER_TEXT}`;

const LOGISTICS = [
  { icon: Calendar, label: "פתיחת מחזור", value: "מרץ 2026" },
  { icon: Clock, label: "מבנה", value: "8 מפגשים × 5 שעות" },
  { icon: MapPin, label: "מיקום", value: `קליניקת ${SITE.brand}, ${SITE.city}` },
  { icon: Users, label: "כיתה אינטימית", value: "עד 8 משתתפות" },
] as const;

const FOR_WHO = [
  {
    icon: Sparkles,
    title: "פדיקוריסטית בתחילת הדרך",
    desc: "סיימת קורס בסיס ומרגישה שאת מטפלת בסימפטומים בלי להבין באמת מה קורה ברגל. כאן תקבלי את התשתית הקלינית שחסרה.",
  },
  {
    icon: HeartPulse,
    title: "ותיקה שהגיעה לתקרה",
    desc: "את עובדת שנים, אבל פטרת ציפורניים שחוזרת, סוכרת מורכבת וציפורן חודרנית עמוקה עדיין שולחים אותך לחפש תשובות. כאן תקבלי פרוטוקול ברור לכל אחד מהמקרים האלה.",
  },
  {
    icon: Award,
    title: "בעלת קליניקה שרוצה למצב את עצמה",
    desc: "את רוצה להפסיק להתחרות במחיר ולהתחיל למצב את עצמך כסמכות בתחום. נעבוד גם על הצד הקליני וגם על המיתוג המקצועי.",
  },
] as const;

const MODULES = [
  {
    n: "01",
    icon: Microscope,
    title: "פטרת ציפורניים — אבחנה, פרוטוקול ושיקום",
    bullets: [
      "אבחנה מבדלת מדויקת: DLSO, PSO, WSO וזיהומי Candida",
      "פרוטוקול טיפול שכבתי מותאם לעובי, מיקום ומידת מעורבות",
      "מתי לטפל בקליניקה ומתי להפנות לדרמטולוג לבדיקת תרבית",
      "שיקום ציפורן מנותקת בשיטת BIO עד תוצאה אסתטית יציבה",
    ],
  },
  {
    n: "02",
    icon: Stethoscope,
    title: "אנטומיה קלינית של כף הרגל",
    bullets: [
      "מבנה העור, הציפורן ומיטת הציפורן",
      "נקודות לחץ, גרמיות מקומיות והשפעה על הליכה",
      "סימני אזהרה שמחייבים הפניה לרופא",
    ],
  },
  {
    n: "03",
    icon: HeartPulse,
    title: "פרוטוקול IWGDF לחולי סוכרת",
    bullets: [
      "סיווג סיכון לפי שלוש קטגוריות בינלאומיות",
      "פרוטוקול עבודה בטוח: כלים, חומרים, מה אסור לעשות",
      "תיעוד והמשך מעקב מול הרופא המטפל",
    ],
  },
  {
    n: "04",
    icon: Scissors,
    title: "ציפורן חודרנית ואורטוניקסיה",
    bullets: [
      "אבחנה מבדלת: דלקת, התעבות, התלפפות",
      "התקנת ברייסים בשיטות שונות (BS, 3TO, COMBI)",
      "ליווי המטופל עד החלמה מלאה",
    ],
  },
  {
    n: "05",
    icon: ShieldCheck,
    title: "סטריליות וניהול קליניקה טיפולית",
    bullets: [
      "פרוטוקול ניקוי, חיטוי ועיקור באוטוקלאב",
      "ניהול ציוד חד־פעמי ותיעוד קליני",
      "מה לעשות כשמטופל מגיע עם פצע פתוח",
    ],
  },
  {
    n: "06",
    icon: BookOpen,
    title: "מיתוג מקצועי וקליניקת אוטוריטה",
    bullets: [
      "איך לבנות נוכחות דיגיטלית מקצועית-יוקרתית",
      "תמחור נכון: למה את שווה יותר ממה שאת לוקחת",
      "סינון לקוחות, הפניות מרופאים ושיתופי פעולה",
    ],
  },
] as const;

const INCLUDES = [
  "8 מפגשים פרונטליים אינטנסיביים בקליניקה",
  "ספר עבודה מודפס + סיכומים דיגיטליים לכל מודול",
  "ערכת התחלה של חומרים מקצועיים מ-Pharm Foot",
  "ספריית case studies של 12+ מקרי פטרת מורכבים מהקליניקה — לפני/אחרי, פרוטוקול ומעקב",
  "תרגול מעשי על מטופלים אמיתיים בליווי צמוד",
  "קבוצת WhatsApp פעילה לבוגרות לאורך כל השנה",
  "מפגש המשך אישי 1:1 חודש אחרי סיום הקורס",
  "תעודת סיום מאסטרקלאס בחתימת ענבר פרחי",
  "גישה לעדכוני פרוטוקולים חדשים גם אחרי סיום",
] as const;

const FAQ = [
  {
    q: "למה הקורס שם דגש כל כך גדול על פטרת ציפורניים?",
    a: "כי זה התחום שבו מטופלים מסתובבים בין קליניקות שנים בלי פתרון אמיתי. הפרוטוקול שנלמד בקורס פותח בקליניקה תוך עבודה על מאות מקרים, וכולל אבחנה מבדלת, טיפול שכבתי ושיקום BIO — שילוב שלא מלמדים ברוב הקורסים בארץ.",
  },
  {
    q: "האם צריך ניסיון קודם כדי להירשם?",
    a: "כן. הקורס מיועד לפדיקוריסטיות מוסמכות בלבד — לפחות שנת ניסיון בשטח. אם את עדיין בשלב לימודי בסיס, נשמח להמליץ על מסלול הכנה.",
  },
  {
    q: "כמה עולה הקורס?",
    a: "ההשקעה נמסרת בשיחת ייעוץ אישית, כי היא כוללת גם את ערכת ההתחלה וגם את הליווי השנתי. נדבר בוואטסאפ ונראה אם זה מתאים לך לפני שאת מתחייבת.",
  },
  {
    q: "האם יש אפשרות תשלומים?",
    a: "כן. אפשר לפרוס את ההשקעה עד 6 תשלומים ללא ריבית. פירוט מלא בשיחת הייעוץ.",
  },
  {
    q: "מה קורה אם אני מפספסת מפגש?",
    a: "כל מפגש מוקלט ונשאר זמין לבוגרות. עדיין, נוכחות פיזית היא הליבה — אנחנו עובדות על מטופלים אמיתיים, ואי אפשר להחליף את החוויה הזו.",
  },
  {
    q: "האם הקורס מוכר על ידי משרד הבריאות?",
    a: "פדיקור טיפולי בישראל אינו מקצוע מוסדר על ידי משרד הבריאות, ולכן אין הסמכה ממשלתית בתחום. תעודת הסיום שלנו היא הכרה מקצועית בקהילת הפדיקוריסטיות הקליניות.",
  },
  {
    q: "אני גרה רחוק מבית אל. שווה לי?",
    a: "המחזורים האחרונים כללו משתתפות מהצפון ומהדרום שלנו, וחלקן בחרו ללון במלון מקומי בימי המפגשים. תוכן הקורס מצדיק את הנסיעה, אבל כדאי לבדוק ביומן לפני שמתחייבים.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "הגעתי אחרי 8 שנים בתחום, חשבתי שאני יודעת הכל. תוך שבועיים גיליתי כמה מקרים טיפלתי בהם לא נכון. הקורס שינה לי את הקליניקה.",
    name: "מ׳ ל׳",
    role: "פדיקוריסטית, מרכז",
  },
  {
    quote:
      "ענבר היא לא מורה רגילה — היא מלמדת איך לחשוב קלינית. הפרוטוקול לסוכרת לבד שווה את ההשקעה.",
    name: "ש׳ כ׳",
    role: "בעלת קליניקה, צפון",
  },
  {
    quote:
      "המיתוג המקצועי שעבדנו עליו בקורס הכפיל לי את ההכנסות תוך חצי שנה. הפסקתי להתחרות במחיר.",
    name: "ר׳ א׳",
    role: "פדיקוריסטית, שרון",
  },
] as const;

const FUNGAL_OUTCOMES = [
  "לזהות סוג הזיהום (DLSO, PSO, WSO, Candida) לפי סימנים ויזואליים",
  "לבנות תכנית טיפול שכבתית מותאמת לעובי ולמיקום",
  "לדעת מתי לטפל לבד ומתי להפנות לדרמטולוג",
  "לשקם ציפורן מנותקת בשיטת BIO עד תוצאה אסתטית",
  "לבנות לוח מעקב של 12 חודשים למניעת חזרת הזיהום",
] as const;

const FUNGAL_KPIS = [
  { label: "מפגשים ייעודיים לפטרת", value: "2 מתוך 8" },
  { label: "Case studies מהקליניקה", value: "12+" },
  { label: "פרוטוקול חזרתיות", value: "12 חודשי מעקב" },
] as const;

const HERO_TRUST = [
  { icon: Microscope, label: "מאות מקרי פטרת בשנה" },
  { icon: FlaskConical, label: "פרוטוקול ייחודי לקליניקה" },
  { icon: Activity, label: "ליווי עד החלמה מלאה" },
] as const;

export const Route = createFileRoute("/masterclass")({
  head: () => ({
    meta: [
      { title: `מאסטרקלאס לפדיקוריסטיות | ${SITE.brand}` },
      {
        name: "description",
        content:
          "מאסטרקלאס לפדיקוריסטיות מקצועיות בהנחיית ענבר פרחי. דגש מיוחד על פטרת ציפורניים — אבחנה, פרוטוקול שכבתי ושיקום BIO. בנוסף: IWGDF לסוכרת, אורטוניקסיה ומיתוג קליני. מחזור 2026.",
      },
      {
        property: "og:title",
        content: `מאסטרקלאס לפדיקוריסטיות | ${SITE.brand}`,
      },
      {
        property: "og:description",
        content:
          "8 מפגשים אינטנסיביים שמשדרגים פדיקוריסטית למומחית קלינית, עם דגש מיוחד על פטרת ציפורניים. בהנחיית ענבר פרחי.",
      },
      { property: "og:url", content: SITE.url + "/masterclass" },
      { property: "og:image", content: SITE.url + inbarPhoto },
      { name: "twitter:image", content: SITE.url + inbarPhoto },
    ],
    links: [{ rel: "canonical", href: SITE.url + "/masterclass" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "מאסטרקלאס לפדיקוריסטיות מקצועיות",
          description:
            "8 מפגשים אינטנסיביים בפדיקור טיפולי קליני: פטרת ציפורניים — אבחנה, פרוטוקול ושיקום BIO, פרוטוקול IWGDF לסוכרת, אורטוניקסיה, סטריליות ומיתוג מקצועי.",
          provider: {
            "@type": "Organization",
            name: SITE.brand,
            sameAs: SITE.url,
          },
          inLanguage: "he",
          educationalLevel: "Professional",
        }),
      },
    ],
  }),
  component: MasterclassPage,
});

function MasterclassPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">
        {/* HERO */}
        <section className="relative overflow-hidden bg-background pt-8 pb-14 md:pt-14 md:pb-20">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 md:gap-14 md:px-8 lg:grid-cols-12">
            <div className="order-2 space-y-7 lg:order-1 lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-copper" aria-hidden />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-copper">
                  מאסטרקלאס לפדיקוריסטיות · מחזור 2026
                </span>
              </div>

              <h1 className="display text-[2.4rem] leading-[0.98] text-ink sm:text-[3rem] md:text-[3.8rem] lg:text-[4.4rem]">
                המאסטרקלאס שמשדרג
                <span className="display-italic mt-2 block bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
                  פדיקוריסטית למומחית קלינית
                </span>
              </h1>

              <p className="max-w-2xl text-[1.05rem] leading-[1.75] text-ink-soft md:text-[1.18rem]">
                פטרת ציפורניים, אורטוניקסיה, פרוטוקול IWGDF לסוכרת ושיקום BIO.
                8 מפגשים אינטנסיביים שמלמדים אותך לטפל במקרים שרוב הקליניקות בארץ שולחות הלאה.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={REGISTER_URL}
                  target="_blank"
                  rel="noopener"
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary-deep px-9 py-4 text-[0.98rem] font-bold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <GraduationCap className="h-4 w-4" aria-hidden />
                  הרשמה למחזור הקרוב
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-500 group-hover:translate-y-0"
                  />
                </a>
                <a
                  href="#syllabus"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-surface px-8 py-4 text-[0.98rem] font-bold text-primary-deep transition-colors duration-300 hover:border-primary-deep/30 hover:bg-surface-warm"
                >
                  <BookOpen className="h-4 w-4" aria-hidden />
                  צפייה בסילבוס המלא
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                {HERO_TRUST.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[0.86rem] font-semibold text-ink-soft">
                    <Icon className="h-3.5 w-3.5 text-copper" aria-hidden strokeWidth={1.8} />
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border pt-6 md:grid-cols-4 md:gap-4">
                {LOGISTICS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-copper" aria-hidden />
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                        {label}
                      </div>
                      <div className="font-heading text-sm font-bold text-ink">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div aria-hidden className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10 overflow-hidden rounded-[2.25rem] border-[10px] border-surface bg-surface-warm shadow-[var(--shadow-lift)] md:border-[12px]">
                  <img
                    src={inbarPhoto}
                    alt="ענבר פרחי מנחה מאסטרקלאס לפדיקוריסטיות מקצועיות"
                    width={600}
                    height={750}
                    loading="eager"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-copper px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white shadow-lg md:top-6 md:left-6 md:text-[11px]">
                    <Award className="h-3 w-3" aria-hidden />
                    מחזור 3 · 20+ בוגרות
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOR WHO */}
        <section className="bg-surface-warm/50 py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="mb-12 max-w-2xl">
              <p className="kicker mb-3">למי המאסטרקלאס מיועד</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                את כאן <span className="display-italic text-primary-deep">כי הגיע הזמן</span>
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {FOR_WHO.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-border bg-surface p-7 transition-all hover:border-copper/40 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft/70 text-primary-deep">
                    <Icon className="h-5 w-5" aria-hidden strokeWidth={1.6} />
                  </div>
                  <h3 className="display text-xl text-ink">{title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-[1.75] text-ink-soft">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SYLLABUS */}
        <section id="syllabus" className="bg-background py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="mb-12 max-w-2xl">
              <p className="kicker mb-3">תוכנית הלימוד</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                6 מודולים. <span className="display-italic text-primary-deep">8 מפגשים.</span> מומחיות אמיתית.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                כל מודול נבנה סביב פרוטוקול קליני אחד, עם תרגול מעשי על מטופלים אמיתיים בקליניקה.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {MODULES.map(({ n, icon: Icon, title, bullets }) => (
                <article
                  key={n}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-all hover:border-primary-deep/30 hover:shadow-[var(--shadow-elegant)]"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-deep text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden strokeWidth={1.6} />
                    </div>
                    <span className="font-heading text-3xl font-light text-copper/70">{n}</span>
                  </div>
                  <h3 className="display text-xl text-ink">{title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[0.92rem] leading-[1.7] text-ink-soft">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden strokeWidth={1.8} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FUNGAL DEEP DIVE */}
        <section className="bg-surface-warm py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="space-y-6 lg:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="h-px w-12 bg-copper" aria-hidden />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-copper">
                    תחום הליבה של הקליניקה
                  </span>
                </div>
                <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                  פטרת ציפורניים —{" "}
                  <span className="display-italic text-primary-deep">
                    איפה שרוב הקליניקות נכשלות
                  </span>
                </h2>
                <p className="text-[1.05rem] leading-[1.85] text-ink-soft">
                  אונכומיקוזיס הוא לא טיפול אחד. זו אבחנה מבדלת בין ארבעה סוגי זיהום,
                  התמודדות עם עמידות לחומרים, ניהול עומק החדירה לתוך מיטת הציפורן,
                  וטיפול בחזרתיות שמתרחשת אצל יותר משליש מהמטופלים. רוב הפדיקוריסטיות
                  והרופאים מציעים פתרונות חלקיים — חומר מקומי, גרידה, או מרשם שלא
                  מותאם לסוג הזיהום.
                </p>
                <p className="text-[1.05rem] leading-[1.85] text-ink-soft">
                  כאן תלמדי את מה שגרם למאות מטופלים להגיע לקליניקה אחרי שניסו הכל:
                  פרוטוקול שכבתי, אבחנה מדויקת, ושיקום BIO שהופך ציפורן מנותקת
                  לתוצאה אסתטית יציבה.
                </p>

                <div className="grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
                  {FUNGAL_KPIS.map(({ label, value }) => (
                    <div key={label}>
                      <div className="font-heading text-2xl font-bold text-primary-deep">
                        {value}
                      </div>
                      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-5">
                <div className="rounded-[1.75rem] border border-border bg-surface p-7 shadow-[var(--shadow-elegant)] md:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-deep text-primary-foreground">
                      <Layers className="h-5 w-5" aria-hidden strokeWidth={1.6} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-copper">
                        תוצאות לימוד
                      </p>
                      <h3 className="font-heading text-lg font-bold text-ink">
                        מה תדעי לעשות בסוף המודול
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {FUNGAL_OUTCOMES.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[0.95rem] leading-[1.7] text-ink"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-deep"
                          aria-hidden
                          strokeWidth={1.8}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* INCLUDES */}
        <section className="bg-primary-deep py-20 text-primary-foreground md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-copper-soft">
                  מה כלול בערכה
                </p>
                <h2 className="display mt-3 text-3xl text-primary-foreground md:text-[2.5rem]">
                  כל מה שצריך כדי
                  <span className="display-italic block text-copper-soft">להתחיל אחרת.</span>
                </h2>
                <p className="mt-5 text-[1rem] leading-[1.75] opacity-85">
                  ההרשמה כוללת לא רק את הקורס עצמו, אלא ערכת חומרים מקצועית של Pharm Foot,
                  ספרי עבודה, וליווי שנתי בקבוצת בוגרות שלא נסגרת אחרי המפגש האחרון.
                </p>
              </div>

              <ul className="grid gap-3 lg:col-span-7 sm:grid-cols-2">
                {INCLUDES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-copper-soft" aria-hidden strokeWidth={1.8} />
                    <span className="text-[0.95rem] leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* INSTRUCTOR */}
        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-5 md:px-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-[2rem] border-[10px] border-surface bg-surface-warm shadow-[var(--shadow-lift)]">
                <img
                  src={inbarPhoto}
                  alt="ענבר פרחי, מנחת המאסטרקלאס"
                  width={500}
                  height={625}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-5 lg:col-span-7">
              <p className="kicker">המנחה</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                ענבר פרחי <span className="display-italic text-primary-deep">מנחת הקורס</span>
              </h2>
              <p className="text-[1.02rem] leading-[1.85] text-ink-soft">
                12+ שנות ניסיון קליני בפדיקור טיפולי, התמחות מובהקת בכף הרגל הסוכרתית
                והשתלמויות באיכילוב. בעלת קליניקה פעילה ב{SITE.city} שמקבלת מטופלים
                בהפניית רופאי משפחה ואורתופדים.
              </p>
              <p className="text-[1.02rem] leading-[1.85] text-ink-soft">
                לאורך השנים האחרונות הכשירה מעל 20 פדיקוריסטיות מקצועיות במסלולי
                ליווי אישיים. המאסטרקלאס הוא התשובה שלה לבקשה החוזרת: לקחת את כל
                מה שנלמד בעשור של עבודה ולמסור אותו בצורה מסודרת.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["IWGDF", "אורטוניקסיה", "שיקום BIO", "סטריליות קלינית"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-border bg-surface-warm px-4 py-1.5 text-xs font-bold text-primary-deep"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-surface-warm/50 py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-5 md:px-8">
            <div className="mb-12 max-w-2xl">
              <p className="kicker mb-3">בוגרות מספרות</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                לא תיאוריה. <span className="display-italic text-primary-deep">תוצאות בקליניקה.</span>
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map(({ quote, name, role }) => (
                <figure
                  key={name}
                  className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7 shadow-sm"
                >
                  <div className="mb-4 flex gap-1 text-copper">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-[0.98rem] leading-[1.75] text-ink">
                    “{quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border pt-4">
                    <div className="font-heading text-sm font-bold text-ink">{name}</div>
                    <div className="text-xs text-text-muted">{role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background py-20 md:py-24">
          <div className="mx-auto max-w-[860px] px-5 md:px-8">
            <div className="mb-10 text-center">
              <p className="kicker mb-3">שאלות נפוצות</p>
              <h2 className="display text-3xl text-ink md:text-[2.5rem]">
                כל מה שרצית <span className="display-italic text-primary-deep">לשאול</span>
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-border bg-surface p-5 transition-colors open:border-primary-deep/30 open:bg-surface-warm/40"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-4 font-heading text-base font-bold text-ink md:text-lg">
                    <span>{q}</span>
                    <ArrowLeft className="h-4 w-4 flex-shrink-0 text-copper transition-transform group-open:-rotate-90" aria-hidden />
                  </summary>
                  <p className="mt-3 text-[0.95rem] leading-[1.8] text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-background pb-24">
          <div className="mx-auto max-w-[1100px] px-5 md:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-deep to-primary p-10 text-center text-primary-foreground shadow-[var(--shadow-lift)] md:p-16">
              <div aria-hidden className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-copper/20 blur-3xl" />
              <div aria-hidden className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-copper/15 blur-3xl" />
              <div className="relative">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-copper-soft">
                  מקומות מוגבלים · עד 8 משתתפות
                </p>
                <h2 className="display mt-4 text-3xl md:text-[2.8rem]">
                  המחזור הבא נפתח <span className="display-italic text-copper-soft">במרץ 2026</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-[1rem] leading-[1.75] opacity-90">
                  שיחת ייעוץ ראשונית בוואטסאפ ללא התחייבות. נדבר על איפה את היום
                  ואם זה הזמן הנכון בשבילך.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={REGISTER_URL}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-surface px-9 py-4 text-[0.98rem] font-bold text-primary-deep shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    שריון מקום בוואטסאפ
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