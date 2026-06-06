import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE } from "@/lib/site-config";
import inbarPhoto from "@/assets/inbar-farchi.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.brand} | ${SITE.tagline}` },
      { name: "description", content: SITE.shortDescription },
    ],
    links: [{ rel: "canonical", href: SITE.url + "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <section className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:py-28">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#5fa898]">
                פדיקור טיפולי | {SITE.city}
              </p>
              <h1 className="mb-6 text-4xl font-black leading-tight text-[#1d3a35] md:text-6xl">
                {SITE.brand} — {SITE.tagline}
              </h1>
              <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[#2d4a44]">
                {SITE.yearsExperience}+ שנות ניסיון בטיפול ביבלות, פטרת, ציפורן חודרנית, סדקים וטיפול עדין לחולי סוכרת.
                גישה סטרילית, מקצועית, בלי שיפוטיות.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="bg-[#25d366] px-6 py-3 font-bold text-white">וואטסאפ</a>
                <a href={SITE.telUrl} className="bg-[#5fa898] px-6 py-3 font-bold text-white">חיוג {SITE.phoneDisplay}</a>
                <a href={SITE.wazeUrl} target="_blank" rel="noopener" className="border-2 border-[#5fa898] px-6 py-3 font-bold text-[#5fa898]">ניווט ב-Waze</a>
              </div>
            </div>
            <div className="relative">
              <img
                src={inbarPhoto.url}
                alt={`${SITE.brand} — פדיקוריסטית טיפולית ב${SITE.city}`}
                width={640}
                height={640}
                loading="eager"
                className="aspect-square w-full rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
