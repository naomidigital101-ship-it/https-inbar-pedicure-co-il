import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE, SERVICES_NAV } from "@/lib/site-config";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [{ title: `מפת אתר | ${SITE.brand}` }],
    links: [{ rel: "canonical", href: `${SITE.url}/sitemap` }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  const pages = [
    { label: "דף הבית", href: "/" },
    { label: "אודות ענבר", href: "/about" },
    { label: "שירותים", href: "/services" },
    { label: "מרכז הידע", href: "/knowledge" },
    { label: "צור קשר", href: "/contact" },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-[1100px] flex-1 px-6 py-16">
        <h1 className="mb-8 text-4xl font-black text-[#1d3a35]">מפת אתר</h1>
        <h2 className="mt-6 mb-3 text-xl font-bold text-[#1d3a35]">דפים ראשיים</h2>
        <ul className="grid gap-2 md:grid-cols-2">{pages.map((p) => (<li key={p.href}><Link to={p.href} className="text-[#2d4a44] hover:text-[#5fa898]">{p.label}</Link></li>))}</ul>
        <h2 className="mt-10 mb-3 text-xl font-bold text-[#1d3a35]">שירותים</h2>
        <ul className="grid gap-2 md:grid-cols-2">{SERVICES_NAV.map((s) => (<li key={s.slug}><a href={`/services/${s.slug}`} className="text-[#2d4a44] hover:text-[#5fa898]">{s.label}</a></li>))}</ul>
      </main>
      <SiteFooter />
    </div>
  );
}
