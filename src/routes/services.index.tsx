import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { SITE } from "@/lib/site-config";
import { SERVICES } from "@/lib/services-content";

const PAGE_URL = `${SITE.url}/services`;
const TITLE = `שירותי פדיקור טיפולי | ${SITE.brand}`;
const DESCRIPTION =
  "כל שירותי הפדיקור הטיפולי של ענבר פרחי — יבלות, פטרת, ציפורן חודרנית, אוניכוליזיס, סדקים, סוכרת וספורטאים. תוכן מבוסס מקורות רפואיים סמכותיים.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="border-b border-[#b8dcd4] bg-[#fdfbf7] py-12">
          <div className="mx-auto max-w-[1100px] px-6">
            <Breadcrumb items={[{ label: "בית", href: "/" }, { label: "שירותים" }]} />
            <h1 className="mt-4 text-4xl font-black text-[#1d3a35] md:text-5xl">השירותים שלי</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#2d4a44]">
              לכל אחד מהשירותים יש עמוד ייעודי עם רקע רפואי, פרוטוקול הטיפול בקליניקה, המלצות מניעה ומקורות חיצוניים סמכותיים — משרד הבריאות, NHS, CDC, Mayo Clinic, AAD, IDF ו-APMA.
            </p>
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto grid max-w-[1100px] gap-5 px-6 md:grid-cols-2">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl border border-[#b8dcd4] bg-[#fdfbf7] p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div aria-hidden className="mb-3 text-2xl">🦶</div>
                <h2 className="mb-2 text-xl font-bold text-[#1d3a35] group-hover:text-[#5fa898]">{s.title}</h2>
                <p className="text-sm leading-relaxed text-[#2d4a44]">{s.subtitle}</p>
                <span className="mt-4 inline-block text-xs font-bold text-[#5fa898]">קראו עוד ←</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="bg-[#fdfbf7] py-16">
          <div className="mx-auto max-w-[820px] rounded-3xl bg-gradient-to-br from-[#e9f4f1] to-white px-6 py-12 text-center md:px-12">
            <h2 className="mb-3 text-2xl font-black text-[#1d3a35] md:text-3xl">לא בטוחים איזה טיפול מתאים?</h2>
            <p className="mb-6 text-base text-[#2d4a44]">תתקשרו או תשלחו וואטסאפ — אני אבחן ואסביר.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#25d366] px-6 py-3 font-bold text-white shadow-md">וואטסאפ</a>
              <a href={SITE.telUrl} className="rounded-full bg-[#5fa898] px-6 py-3 font-bold text-white shadow-md">{SITE.phoneDisplay}</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}