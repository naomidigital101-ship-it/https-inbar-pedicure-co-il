import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/contact`;
const TITLE = "צור קשר | הרוכב העצלן";
const DESCRIPTION =
  "יצירת קשר עם הרוכב העצלן. שאלות על תחזוקה, ציוד, מסלולים או שיתופי פעולה - נשמח לשמוע.";

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
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(contactSchema) },
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
        <article className="border-b border-[#d6c5ac] bg-[#fefaf6]">
          <div className="mx-auto max-w-[760px] px-4 py-14 md:px-8 md:py-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
                יצירת קשר
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-[#d6c5ac]" />
            </div>

            <h1 className="mb-6 text-4xl font-black leading-tight text-[#2a1f1a] md:text-5xl">
              צור קשר
            </h1>

            <div className="mb-12 space-y-4 text-lg leading-loose text-[#3a2f28]">
              <p>
                שאלה על תחזוקה, ציוד או מסלול? מצאתם טעות במאמר? רוצים להציע נושא לכתבה הבאה או לשתף איתנו פעולה? נשמח לשמוע.
              </p>
              <p>אני קוראת כל הודעה ועונה אישית, בדרך כלל תוך מספר ימים.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="mailto:hello@dirt-road-guide.lovable.app"
                className="group flex items-start gap-4 border border-[#d6c5ac] bg-[#f5ede4] p-6 transition-colors hover:border-[#8b3a52]"
                aria-label="שליחת מייל לכתובת hello@dirt-road-guide.lovable.app"
              >
                <Mail className="h-6 w-6 flex-shrink-0 text-[#8b3a52]" aria-hidden="true" />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#888]">
                    דואר אלקטרוני
                  </div>
                  <div className="text-sm font-bold text-[#2a1f1a] group-hover:text-[#8b3a52]">
                    hello@dirt-road-guide.lovable.app
                  </div>
                  <p className="mt-2 text-xs text-[#888]">הדרך המהירה ביותר ליצור קשר</p>
                </div>
              </a>

              <div className="flex items-start gap-4 border border-[#d6c5ac] bg-[#f5ede4] p-6">
                <MessageCircle className="h-6 w-6 flex-shrink-0 text-[#8b3a52]" aria-hidden="true" />
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#888]">
                    זמן תגובה
                  </div>
                  <div className="text-sm font-bold text-[#2a1f1a]">עד 5 ימי עסקים</div>
                  <p className="mt-2 text-xs text-[#888]">בסופי שבוע אנחנו על האופנוע</p>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-[#d6c5ac] pt-10">
              <h2 className="mb-4 text-xl font-bold text-[#2a1f1a]">לפני שכותבים</h2>
              <ul className="space-y-3 text-base leading-relaxed text-[#3a2f28]">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[#8b3a52]" />
                  <span>אם השאלה נוגעת לתחזוקה ספציפית, צרפו את הדגם והשנה של האופנוע.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[#8b3a52]" />
                  <span>תקלה או טעות במאמר? צרפו לינק למאמר ותיאור קצר של מה שנראה לא נכון.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[#8b3a52]" />
                  <span>פנייה לנושאי נגישות: hello@dirt-road-guide.lovable.app.</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}