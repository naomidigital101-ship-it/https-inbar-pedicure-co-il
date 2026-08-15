import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { SITE } from "@/lib/site-config";
import { useSite } from "@/lib/use-site";
import { ContactForm } from "@/components/shared/ContactForm";

const PAGE_URL = `${SITE.url}/contact`;
const TITLE = `צרו קשר | ${SITE.brand} – פדיקור טיפולי ב${SITE.city}`;
const DESCRIPTION = `קביעת תור לטיפול פדיקור טיפולי אצל ${SITE.brand} ב${SITE.city}. טלפון ${SITE.phoneDisplay}, וואטסאפ או מייל. שעות פעילות: ${SITE.hoursDisplay}.`;

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  inLanguage: "he-IL",
  url: PAGE_URL,
  name: TITLE,
  description: DESCRIPTION,
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(contactSchema) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "בית", item: SITE.url + "/" },
            { "@type": "ListItem", position: 2, name: "צור קשר", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const site = useSite();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "צור קשר" }]} />
        <article
          className="relative overflow-hidden"
          style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
        >
          <BrandHeroBackdrop label="CONTACT · 00" />
          <div className="relative mx-auto max-w-[1100px] px-6 py-14 md:px-10 md:py-20">
            <div className="mb-6 flex items-center gap-3">
              <BrandEyebrow>יצירת קשר</BrandEyebrow>
              <span aria-hidden className="h-px w-12" style={{ background: "var(--green-400)" }} />
            </div>

            <h1
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 5.6vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--green-700)",
              }}
            >
              נשמח לשמוע מכם
            </h1>

            <p
              className="mb-12 max-w-2xl"
              style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.7 }}
            >
              מלאו פרטים בוואטסאפ או התקשרו, ואחזור אליכם בהקדם לתיאום פגישת אבחון. כל פנייה מטופלת
              באופן אישי, ללא שיפוטיות.
            </p>

            <div
              className="mb-12 max-w-3xl space-y-4"
              style={{ color: "var(--ink-900)", fontSize: "1rem", lineHeight: 1.85 }}
            >
              <p>
                הקליניקה של {site.brand} ממוקמת ב{site.city} שב{site.region} ומשרתת את כל היישובים
                בסביבה – בית אל, עפרה, פסגות, כוכב יעקב, גבעת אסף, רימונים, ירושלים וגוש בנימין
                כולו. לקליניקה הגעה נוחה ברכב, חניה חופשית בסמוך, וגישה למבוגרים ולמטופלים עם ניידות
                מוגבלת. בכל פגישה אני מקדישה זמן מלא לאבחון, להסבר ולטיפול – בלי תורים כפולים ובלי
                לחץ של זמן.
              </p>
              <p>
                מטפלת בילדים מגיל 6 ומעלה, בנשים בהריון (כולל טיפולים מותאמים בטוחים לעיבור),
                במבוגרים ובאנשי גיל הזהב. מתמחה במצבים הדורשים תשומת לב מיוחדת: כף רגל סוכרתית, חולי
                כליות, נטילת מדללי דם, לאחר ניתוחים אורתופדיים, מצבי סיכון לזיהום ועוד. כל הציוד
                עובר חיטוי ועיקור באוטוקלאב לפי תקני משרד הבריאות, וחלק גדול מהפריטים הוא חד-פעמי.
              </p>
              <p>
                לפני הפגישה הראשונה ארצה לדעת אם יש לכם רגישות לחומרים, אם אתם נוטלים תרופות קבועות,
                ואם יש לכם מחלות רקע. אפשר לשלוח את המידע מראש בוואטסאפ – זה חוסך זמן בקליניקה
                ומאפשר לי להגיע מוכנה. ביטול תור: אנא הודיעו לפחות 24 שעות מראש כדי שאוכל לפנות את
                המקום למטופל אחר שמחכה.
              </p>
            </div>

            <div
              className="mb-12 grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center md:gap-10"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--green-100)",
                borderRadius: 20,
              }}
            >
              <p style={{ color: "var(--ink-900)", lineHeight: 1.8, fontSize: "1rem" }}>
                <strong style={{ color: "var(--green-700)" }}>מילה אישית ממני –</strong> מעבר להיותי
                פדיקוריסטית, אני אמא לשלוש בנות: אגם, אביגיל ואודיה. לכן אני מקפידה על שעות קבועות
                בקליניקה, מתחייבת לזמן הטיפול שלכם בלי הפרעות, וזמינה בוואטסאפ למענה אישי גם בין
                המטופלים. אם אני לא עונה ברגע זה – זה כי אני באמצע טיפול, ואחזור אליכם תוך שעות
                ספורות.
              </p>
              <span
                aria-hidden
                className="hidden md:block h-16 w-px"
                style={{ background: "var(--green-100)" }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ContactCard
                href={site.whatsappUrl}
                external
                eyebrow="וואטסאפ"
                title={site.phoneDisplay}
                sub="הדרך המהירה ביותר לקבוע תור"
                icon={<MessageCircle className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
              />
              <ContactCard
                href={site.telUrl}
                eyebrow="טלפון"
                title={site.phoneDisplay}
                sub="חיוג ישיר"
                icon={<Phone className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
              />
              <ContactCard
                href={`mailto:${site.email}`}
                eyebrow="דוא״ל"
                title={site.email}
                sub="לפניות שאינן דחופות"
                icon={<Mail className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
              />
              <ContactCard
                eyebrow="מיקום"
                title={`${site.city}, ${site.region}`}
                sub="ניווט ב-Waze ←"
                subHref={site.wazeUrl}
                icon={<MapPin className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
              />
              <div className="md:col-span-2">
                <ContactCard
                  eyebrow="שעות פעילות"
                  title={site.hoursDisplay}
                  sub="בשישי-שבת לא זמינה"
                  icon={<Clock className="h-6 w-6" strokeWidth={1.5} aria-hidden />}
                />
              </div>
            </div>

            <div
              className="mt-12 p-10 text-center"
              style={{
                background: "var(--green-50)",
                border: "1px solid var(--green-100)",
                borderRadius: 20,
              }}
            >
              <BrandEyebrow>לא בטוחים מה יש לכם?</BrandEyebrow>
              <h2
                className="mt-3 mb-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--ink-900)",
                }}
              >
                בואו נבדוק יחד
              </h2>
              <p
                className="mx-auto mb-6 max-w-xl"
                style={{ color: "var(--ink-600)", lineHeight: 1.7 }}
              >
                לא צריך לדעת מראש. הגיעו לפגישה, אבדוק את כף הרגל, אבצע אבחנה ואסביר מה הבעיה ואיך
                לטפל בה.
              </p>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex h-12 items-center gap-2.5 px-7"
                style={{
                  background: "var(--green-600)",
                  color: "var(--paper)",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
                שליחת הודעה בוואטסאפ
              </a>
            </div>

            <section className="mt-16 max-w-3xl">
              <div
                className="mb-14 p-7 md:p-9"
                style={{ background: "var(--surface-soft)", borderRadius: 18 }}
              >
                <ContactForm note="אפשר גם להתקשר או לשלוח וואטסאפ — מה שנוח לך." />
              </div>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--green-700)",
                }}
              >
                שאלות נפוצות לפני קביעת תור
              </h2>
              <dl className="space-y-5">
                {[
                  {
                    q: "כמה זמן לוקחת פגישה ראשונה?",
                    a: "פגישת אבחון ראשונה נמשכת בין 45 ל-60 דקות. בזמן הזה אני בודקת את כפות הרגליים והציפורניים, מאבחנת את הבעיה, מסבירה לכם מה ראיתי ומציעה תוכנית טיפול. לרוב מבצעים גם את הטיפול הראשון באותה פגישה.",
                  },
                  {
                    q: "האם הטיפול כואב?",
                    a: "רוב הטיפולים שלנו אינם כואבים. בטיפולים פולשניים יותר (כמו אורתוניקסיה לציפורן חודרנית) משתמשים בכלים עדינים ובהדרגתיות, ובמידת הצורך משלבים חומרי הרדמה מקומיים. אם יש כאב חזק – אנחנו עוצרים.",
                  },
                  {
                    q: "האם יש קבלה לקופת חולים או לביטוח משלים?",
                    a: "אנו מנפיקים קבלה רשמית בכל פגישה. חלק גדול מהביטוחים המשלימים (מכבי זהב, כללית מושלם, לאומית זהב, מאוחדת עדיף) מחזירים על טיפולי פדיקור טיפולי. כדאי לבדוק מול הביטוח שלכם לפני הפגישה.",
                  },
                  {
                    q: "האם אפשר להגיע ללא קביעת תור מראש?",
                    a: "לא. הקליניקה פועלת בתורים מתואמים בלבד כדי להבטיח לכל מטופל זמן מלא ופרטיות. תוכלו לקבוע תור בוואטסאפ, בטלפון או דרך טופס יצירת הקשר.",
                  },
                  {
                    q: "האם הקליניקה מתאימה לחולי סוכרת?",
                    a: "כן, ודאי. אני מתמחה בכף רגל סוכרתית לפי קנון אגודת אייל, כולל בדיקת מוניטרינג סיכון שנתית, טיפול במניעת פצעים, וייעוץ לבחירת נעליים מתאימות. חשוב להזכיר את אבחנת הסוכרת בעת קביעת התור.",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--green-100)] bg-[var(--green-50)] p-5"
                  >
                    <dt
                      className="mb-2 text-base font-semibold"
                      style={{ color: "var(--ink-900)" }}
                    >
                      {f.q}
                    </dt>
                    <dd className="text-sm" style={{ color: "var(--ink-900)", lineHeight: 1.85 }}>
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function ContactCard({
  href,
  external,
  eyebrow,
  title,
  sub,
  subHref,
  icon,
}: {
  href?: string;
  external?: boolean;
  eyebrow: string;
  title: string;
  sub?: string;
  subHref?: string;
  icon: React.ReactNode;
}) {
  const inner = (
    <>
      <span
        aria-hidden
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center"
        style={{ background: "var(--green-50)", color: "var(--green-700)", borderRadius: 12 }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="mb-1">
          <BrandEyebrow style={{ fontSize: 11 }}>{eyebrow}</BrandEyebrow>
        </div>
        <div
          className="break-all"
          style={{ color: "var(--ink-900)", fontWeight: 600, fontSize: 15 }}
        >
          {title}
        </div>
        {sub ? (
          subHref ? (
            <a
              href={subHref}
              target="_blank"
              rel="noopener nofollow"
              className="mt-1 inline-block"
              style={{ color: "var(--green-700)", fontSize: 12, fontWeight: 600 }}
            >
              {sub}
            </a>
          ) : (
            <p className="mt-1" style={{ color: "var(--ink-600)", fontSize: 12 }}>
              {sub}
            </p>
          )
        ) : null}
      </div>
    </>
  );
  const cls = "group flex items-start gap-4 p-6 transition-colors";
  const baseStyle = {
    background: "var(--paper)",
    border: "1px solid var(--stone-100)",
    borderRadius: 20,
  } as const;
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener" : undefined}
        className={cls}
        style={baseStyle}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={cls} style={baseStyle}>
      {inner}
    </div>
  );
}
