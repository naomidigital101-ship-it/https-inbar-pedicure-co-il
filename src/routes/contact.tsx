import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { BrandHeroBackdrop, BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { SITE } from "@/lib/site-config";

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

            <p className="mb-12 max-w-2xl" style={{ color: "var(--ink-600)", fontSize: "1.05rem", lineHeight: 1.7 }}>
              מלאו פרטים בוואטסאפ או התקשרו, ואחזור אליכם בהקדם לתיאום פגישת אבחון.
              כל פנייה מטופלת באופן אישי, ללא שיפוטיות.
            </p>

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
                המטופלים. אם אני לא עונה ברגע זה – זה כי אני באמצע טיפול, ואחזור אליכם תוך שעות ספורות.
              </p>
              <span
                aria-hidden
                className="hidden md:block h-16 w-px"
                style={{ background: "var(--green-100)" }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ContactCard href={SITE.whatsappUrl} external eyebrow="וואטסאפ" title={SITE.phoneDisplay} sub="הדרך המהירה ביותר לקבוע תור" icon={<MessageCircle className="h-6 w-6" strokeWidth={1.5} aria-hidden />} />
              <ContactCard href={SITE.telUrl} eyebrow="טלפון" title={SITE.phoneDisplay} sub="חיוג ישיר" icon={<Phone className="h-6 w-6" strokeWidth={1.5} aria-hidden />} />
              <ContactCard href={`mailto:${SITE.email}`} eyebrow="דוא״ל" title={SITE.email} sub="לפניות שאינן דחופות" icon={<Mail className="h-6 w-6" strokeWidth={1.5} aria-hidden />} />
              <ContactCard eyebrow="מיקום" title={`${SITE.city}, ${SITE.region}`} sub="ניווט ב-Waze ←" subHref={SITE.wazeUrl} icon={<MapPin className="h-6 w-6" strokeWidth={1.5} aria-hidden />} />
              <div className="md:col-span-2">
                <ContactCard eyebrow="שעות פעילות" title={SITE.hoursDisplay} sub="בשישי-שבת לא זמינה" icon={<Clock className="h-6 w-6" strokeWidth={1.5} aria-hidden />} />
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
              <p className="mx-auto mb-6 max-w-xl" style={{ color: "var(--ink-600)", lineHeight: 1.7 }}>
                לא צריך לדעת מראש. הגיעו לפגישה, אבדוק את כף הרגל, אבצע אבחנה ואסביר מה הבעיה ואיך לטפל בה.
              </p>
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener"
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
              rel="noopener"
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
