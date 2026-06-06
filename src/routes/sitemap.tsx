import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { articles } from "@/lib/articles";
import { categories } from "@/lib/categories";
import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/sitemap`;
const TITLE = "מפת אתר | הרוכב העצלן";
const DESC =
  "מפת אתר מלאה: כל המאמרים, הקטגוריות והמוצרים של הרוכב העצלן במקום אחד.";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: SitemapPage,
});

type SectionProps = {
  title: string;
  items: { label: string; href: string }[];
};

function Section({ title, items }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="border-t border-[#222] py-8">
      <h2 className="mb-4 text-2xl font-bold text-[#f0f0f0]">{title}</h2>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="block rounded px-3 py-2 text-[#c0c0c0] transition-colors hover:bg-[#1a1a1a] hover:text-[#e63000]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SitemapPage() {
  const mainPages = [
    { label: "דף הבית", href: "/" },
    { label: "מי אנחנו", href: "/about" },
    { label: "צור קשר", href: "/contact" },
    { label: "תנאי שימוש", href: "/terms" },
    { label: "מדיניות פרטיות", href: "/privacy" },
    { label: "נגישות", href: "/accessibility" },
  ];

  const categoryPages = categories.map((c) => ({
    label: c.name,
    href: `/category/${c.slug}`,
  }));

  const productHubs = [
    { label: "כל המוצרים", href: "/products" },
    { label: "קסדות שטח", href: "/products/helmets" },
    { label: "מגפי שטח", href: "/products/boots" },
    { label: "מגני גוף", href: "/products/body-armor" },
  ];

  const articleLinks = [...articles]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((a) => ({
      label: a.title,
      href: `/article/${a.slug}`,
    }));

  const helmetLinks = HELMETS.map((h) => ({
    label: `${h.brand} ${h.model}`,
    href: `/products/helmets/${h.id}`,
  }));

  const bootLinks = BOOTS.map((b) => ({
    label: `${b.brand} ${b.model}`,
    href: `/products/boots/${b.id}`,
  }));

  const armorLinks = BODY_ARMOR.map((a) => ({
    label: `${a.brand} ${a.model}`,
    href: `/products/body-armor/${a.id}`,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-8 md:py-16">
          <header className="mb-8">
            <h1 className="mb-3 text-4xl font-black text-[#f0f0f0] md:text-5xl">
              מפת אתר
            </h1>
            <p className="max-w-2xl text-[#a0a0a0]">
              כל הדפים באתר במקום אחד — מאמרים, קטגוריות, מוצרים ודפי שירות.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a
                href="/sitemap.xml"
                className="rounded border border-[#333] px-3 py-1 text-[#c0c0c0] hover:border-[#e63000] hover:text-[#e63000]"
              >
                sitemap.xml (למנועי חיפוש)
              </a>
              <a
                href="/rss.xml"
                className="rounded border border-[#333] px-3 py-1 text-[#c0c0c0] hover:border-[#e63000] hover:text-[#e63000]"
              >
                RSS feed
              </a>
            </div>
          </header>

          <Section title="דפים ראשיים" items={mainPages} />
          <Section title="קטגוריות" items={categoryPages} />
          <Section title="מוצרים" items={productHubs} />
          <Section title={`מאמרים (${articleLinks.length})`} items={articleLinks} />
          <Section title={`קסדות (${helmetLinks.length})`} items={helmetLinks} />
          <Section title={`מגפיים (${bootLinks.length})`} items={bootLinks} />
          <Section title={`מגני גוף (${armorLinks.length})`} items={armorLinks} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}