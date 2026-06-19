import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BrandEyebrow } from "@/components/brand/BrandPrimitives";
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
      <main id="main-content" className="mx-auto max-w-[1100px] flex-1 px-6 py-16 md:px-10 md:py-20">
        <BrandEyebrow>SITEMAP · 00</BrandEyebrow>
        <h1
          className="mt-4 mb-10"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--green-700)",
          }}
        >
          מפת אתר
        </h1>
        <h2
          className="mt-6 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          דפים ראשיים
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {pages.map((p) => (
            <li key={p.href}>
              <Link to={p.href} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <h2
          className="mt-10 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          שירותים
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {SERVICES_NAV.map((s) => (
            <li key={s.slug}>
              <a href={`/services/${s.slug}`} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
