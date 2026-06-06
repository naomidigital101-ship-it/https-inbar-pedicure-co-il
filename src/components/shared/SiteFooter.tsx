import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE, SERVICES_NAV } from "@/lib/site-config";

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

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-surface-warm text-ink-soft"
      role="contentinfo"
      aria-label="פוטר האתר"
    >
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <section aria-labelledby="footer-brand" className="space-y-5 md:col-span-5">
            <div>
              <h2 id="footer-brand" className="display text-3xl text-ink">
                {SITE.brand}
              </h2>
              <p className="kicker mt-1">פדיקור טיפולי · {SITE.city}</p>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-text-muted">
              קליניקה לפדיקור טיפולי המתמחה בטיפול ביבלות, פטרת, ציפורן חודרנית ובכף הרגל של חולי סוכרת. סטריליות מלאה, פרוטוקולים רפואיים וליווי אישי עד החלמה.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={SITE.telUrl} className="inline-flex items-center gap-2 text-ink transition-colors hover:text-primary">
                <Phone className="h-4 w-4 text-copper" aria-hidden /> {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-ink transition-colors hover:text-primary">
                <Mail className="h-4 w-4 text-copper" aria-hidden /> {SITE.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-copper" aria-hidden /> {SITE.city}, {SITE.region}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-copper" aria-hidden /> {SITE.hoursDisplay}
              </span>
            </div>
          </section>

          <nav aria-labelledby="footer-services" className="space-y-4 md:col-span-4">
            <h2 id="footer-services" className="kicker">שירותים</h2>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_NAV.map((s) => (
                <li key={s.slug}>
                  <a href={`/services/${s.slug}`} className="text-ink-soft transition-colors hover:text-primary">{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site" className="space-y-4 md:col-span-3">
            <h2 id="footer-site" className="kicker">האתר</h2>
            <ul className="space-y-2.5 text-sm">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-ink-soft transition-colors hover:text-primary">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-[11px] font-medium tracking-wide text-text-muted md:flex-row md:items-center md:justify-between">
          <div>© {year} {SITE.brand} · כל הזכויות שמורות</div>
          <nav aria-label="קישורים משפטיים" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="text-copper">המידע באתר אינו תחליף לייעוץ רפואי</div>
        </div>
      </div>
    </footer>
  );
}