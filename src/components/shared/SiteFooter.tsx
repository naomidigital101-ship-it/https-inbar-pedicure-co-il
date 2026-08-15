import { SERVICES_NAV } from "@/lib/site-config";
import { useSite } from "@/lib/use-site";
import { BrandLogo } from "./BrandLogo";

const academyLinks = [
  { label: "יסודות הפדיקור הטיפולי", href: "/#academy" },
  { label: "התמחויות מתקדמות", href: "/#academy" },
  { label: "ליווי אישי בקליניקה", href: "/#academy" },
  { label: "הזמנת הרצאה", href: "/#academy" },
];

const siteLinks = [
  { label: "אודות ענבר", href: "/about" },
  { label: "מרכז הידע", href: "/knowledge" },
  { label: "צור קשר", href: "/contact" },
  { label: "מפת אתר", href: "/sitemap" },
];

const legalLinks = [
  { label: "תנאי שימוש", href: "/terms" },
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "הצהרת נגישות", href: "/accessibility" },
];

const MUTED = "var(--text-dim)";

export function SiteFooter() {
  const site = useSite();
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="פוטר האתר"
      style={{ background: "var(--footer-bg)", color: MUTED }}
    >
      {/* pb מוגדל בדסקטופ כדי שכפתור הוואטסאפ הצף לא יכסה את שורת הדיסקליימר */}
      <div className="mx-auto max-w-[1280px] px-6 pb-14 pt-14 md:pb-24 md:pt-16">
        <div className="grid gap-11 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <section aria-labelledby="footer-brand" className="space-y-4">
            <h2 id="footer-brand" className="sr-only">
              {site.brand}
            </h2>
            <BrandLogo tone="paper" wordSize={65} />
            <p className="m-0 max-w-md text-[15px] leading-[1.7]">
              פדיקור טיפולי ב{site.city} ו{site.region}, והכשרות מקצועיות לפדיקוריסטיות בכל הארץ.
              סטריליות מלאה, פרוטוקולים קליניים וליווי אישי עד החלמה.
            </p>
          </section>

          <nav aria-labelledby="footer-services" className="space-y-3.5">
            <h2
              id="footer-services"
              className="m-0 text-[16px] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              טיפולים
            </h2>
            <ul className="m-0 grid list-none gap-2.5 p-0 text-[15px]">
              {SERVICES_NAV.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/services/${s.slug}`}
                    className="transition-colors hover:text-white"
                    style={{ color: MUTED }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-academy" className="space-y-3.5">
            <h2
              id="footer-academy"
              className="m-0 text-[16px] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              הכשרות
            </h2>
            <ul className="m-0 grid list-none gap-2.5 p-0 text-[15px]">
              {academyLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="transition-colors hover:text-white"
                    style={{ color: MUTED }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-contact" className="space-y-3.5">
            <h2
              id="footer-contact"
              className="m-0 text-[16px] text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              יצירת קשר
            </h2>
            <ul className="m-0 grid list-none gap-2.5 p-0 text-[15px]">
              <li>
                <a
                  href={site.telUrl}
                  className="transition-colors hover:text-white"
                  style={{ color: MUTED }}
                  dir="ltr"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-white"
                  style={{ color: MUTED }}
                >
                  {site.email}
                </a>
              </li>
              <li>
                {site.city}, {site.region}
              </li>
              <li>{site.hoursDisplay}</li>
            </ul>
            <ul className="m-0 grid list-none gap-2.5 p-0 pt-2 text-[14px]">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="transition-colors hover:text-white"
                    style={{ color: MUTED }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="mt-9 flex flex-col gap-3 pt-5 text-[13px] md:flex-row md:items-center md:justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span>
            © {year} {site.brand} · כל הזכויות שמורות
          </span>
          <nav aria-label="קישורים משפטיים" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-white"
                style={{ color: MUTED }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span>המידע באתר אינו תחליף לייעוץ רפואי מקצועי</span>
        </div>
      </div>
    </footer>
  );
}
