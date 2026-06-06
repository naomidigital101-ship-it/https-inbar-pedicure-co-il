import { Rss } from "lucide-react";
import { categories } from "@/lib/categories";

const productLinks = [
  { label: "קסדות שטח", href: "/products/helmets" },
  { label: "מגפי שטח", href: "/products/boots" },
  { label: "מגני גוף", href: "/products/body-armor" },
  { label: "כל המוצרים", href: "/products" },
];

const siteLinks = [
  { label: "מי אנחנו", href: "/about" },
  { label: "צור קשר", href: "/contact" },
  { label: "מפת אתר", href: "/sitemap" },
  { label: "RSS", href: "/rss.xml" },
];

const legalLinks = [
  { label: "תנאי שימוש", href: "/terms" },
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[#b8dcd4] bg-[#fdfbf7] text-[#2d4a44]"
      role="contentinfo"
      aria-label="פוטר האתר"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <section aria-labelledby="footer-brand" className="space-y-4">
            <h2 id="footer-brand" className="text-lg font-black text-[#1d3a35]">
              ענבר פרחי
            </h2>
            <p className="text-sm leading-relaxed text-[#6b5f55]">
              הפורטל המוביל לרוכבי אופנועי שטח בישראל. מדריכי תחזוקה, ביקורות
              אופנועים, מסלולי שטח, קטלוג ציוד הגנה וטכניקות רכיבה - הכל בעברית,
              הכל מהשטח.
            </p>
          </section>

          <nav aria-labelledby="footer-categories" className="space-y-4">
            <h2
              id="footer-categories"
              className="text-[11px] font-black uppercase tracking-widest text-[#1d3a35]"
            >
              קטגוריות תוכן
            </h2>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`/category/${c.slug}`}
                    className="text-[#4a3f38] transition-colors hover:text-[#5fa898]"
                    title={c.name}
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-products" className="space-y-4">
            <h2
              id="footer-products"
              className="text-[11px] font-black uppercase tracking-widest text-[#1d3a35]"
            >
              קטלוג ציוד
            </h2>
            <ul className="space-y-2 text-sm">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[#4a3f38] transition-colors hover:text-[#5fa898]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site" className="space-y-4">
            <h2
              id="footer-site"
              className="text-[11px] font-black uppercase tracking-widest text-[#1d3a35]"
            >
              האתר
            </h2>
            <ul className="space-y-2 text-sm">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-2 text-[#4a3f38] transition-colors hover:text-[#5fa898]"
                  >
                    {l.label === "RSS" ? (
                      <Rss className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : null}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#b8dcd4] pt-6 text-[11px] font-bold uppercase tracking-widest text-[#6b5f55] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>© {year} ענבר פרחי</span>
            <span>כל הזכויות שמורות</span>
          </div>
          <nav aria-label="קישורים משפטיים" className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-[#1d3a35]"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="text-[#5fa898]">בנוי בישראל</div>
        </div>
      </div>
    </footer>
  );
}