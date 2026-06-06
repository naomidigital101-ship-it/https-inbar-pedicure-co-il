import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
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
    scripts: [{ type: "application/ld+json", children: JSON.stringify(contactSchema) }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "צור קשר" }]} />
        <article className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div className="mx-auto max-w-[900px] px-4 py-14 md:px-8 md:py-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">יצירת קשר</span>
              <span aria-hidden className="h-px w-12 bg-[#b8dcd4]" />
            </div>

            <h1 className="mb-6 text-4xl font-black leading-tight text-[#1d3a35] md:text-5xl">
              נשמח לשמוע מכם
            </h1>

            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-[#2d4a44]">
              מלאו פרטים בוואטסאפ או התקשרו, ואחזור אליכם בהקדם לתיאום פגישת אבחון.
              כל פנייה מטופלת באופן אישי, ללא שיפוטיות.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noopener"
                className="group flex items-start gap-4 rounded-2xl border border-[#b8dcd4] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#5fa898] hover:shadow-md"
              >
                <MessageCircle className="h-7 w-7 flex-shrink-0 text-[#25d366]" aria-hidden />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#6b7f7a]">וואטסאפ</div>
                  <div className="text-base font-bold text-[#1d3a35] group-hover:text-[#5fa898]">{SITE.phoneDisplay}</div>
                  <p className="mt-1 text-xs text-[#6b7f7a]">הדרך המהירה ביותר לקבוע תור</p>
                </div>
              </a>

              <a
                href={SITE.telUrl}
                className="group flex items-start gap-4 rounded-2xl border border-[#b8dcd4] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#5fa898] hover:shadow-md"
              >
                <Phone className="h-7 w-7 flex-shrink-0 text-[#5fa898]" aria-hidden />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#6b7f7a]">טלפון</div>
                  <div className="text-base font-bold text-[#1d3a35] group-hover:text-[#5fa898]">{SITE.phoneDisplay}</div>
                  <p className="mt-1 text-xs text-[#6b7f7a]">חיוג ישיר</p>
                </div>
              </a>

              <a
                href={`mailto:${SITE.email}`}
                className="group flex items-start gap-4 rounded-2xl border border-[#b8dcd4] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#5fa898] hover:shadow-md"
              >
                <Mail className="h-7 w-7 flex-shrink-0 text-[#5fa898]" aria-hidden />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#6b7f7a]">דוא״ל</div>
                  <div className="text-base font-bold text-[#1d3a35] group-hover:text-[#5fa898] break-all">{SITE.email}</div>
                  <p className="mt-1 text-xs text-[#6b7f7a]">לפניות שאינן דחופות</p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-[#b8dcd4] bg-white p-6">
                <MapPin className="h-7 w-7 flex-shrink-0 text-[#5fa898]" aria-hidden />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#6b7f7a]">מיקום</div>
                  <div className="text-base font-bold text-[#1d3a35]">{SITE.city}, {SITE.region}</div>
                  <a href={SITE.wazeUrl} target="_blank" rel="noopener" className="mt-1 inline-block text-xs font-bold text-[#5fa898] hover:underline">ניווט ב-Waze ←</a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-[#b8dcd4] bg-white p-6 md:col-span-2">
                <Clock className="h-7 w-7 flex-shrink-0 text-[#5fa898]" aria-hidden />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#6b7f7a]">שעות פעילות</div>
                  <div className="text-base font-bold text-[#1d3a35]">{SITE.hoursDisplay}</div>
                  <p className="mt-1 text-xs text-[#6b7f7a]">בשישי-שבת לא זמינה</p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-3xl bg-gradient-to-br from-[#e9f4f1] to-[#fdfbf7] p-8 text-center">
              <h2 className="mb-3 text-2xl font-black text-[#1d3a35]">לא בטוחים מה יש לכם?</h2>
              <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-[#2d4a44]">
                לא צריך לדעת מראש. הגיעו לפגישה, אבדוק את כף הרגל, אבצע אבחנה ואסביר מה הבעיה ואיך לטפל בה.
              </p>
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="inline-block rounded-full bg-[#25d366] px-8 py-3.5 font-bold text-white shadow-md transition-transform hover:scale-105">
                שלחו הודעה בוואטסאפ
              </a>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
