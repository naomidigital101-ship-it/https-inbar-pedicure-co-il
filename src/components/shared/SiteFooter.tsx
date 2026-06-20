import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE, SERVICES_NAV } from "@/lib/site-config";
import { BrandLogo } from "./BrandLogo";

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
      className="text-[var(--paper)]"
      role="contentinfo"
      aria-label="פוטר האתר"
      style={{ background: "var(--green-950)", color: "#D6E0DC" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <section aria-labelledby="footer-brand" className="space-y-5 md:col-span-5">
            <h2 id="footer-brand" className="sr-only">{SITE.brand}</h2>
            <BrandLogo tone="paper" layout="horizontal" size={64} />
            <p className="max-w-md text-sm leading-relaxed" style={{ color: "#B5C8C2" }}>
              קליניקה לפדיקור טיפולי המתמחה בטיפול ביבלות, פטרת, ציפורן חודרנית ובכף הרגל של חולי סוכרת. סטריליות מלאה, פרוטוקולים קליניים וליווי אישי עד החלמה.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={SITE.telUrl} className="inline-flex items-center gap-2 transition-colors" style={{ color: "#FAFAF8" }}>
                <Phone className="h-4 w-4" style={{ color: "var(--green-300)" }} aria-hidden /> {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 transition-colors" style={{ color: "#FAFAF8" }}>
                <Mail className="h-4 w-4" style={{ color: "var(--green-300)" }} aria-hidden /> {SITE.email}
              </a>
              <span className="inline-flex items-center gap-2" style={{ color: "#D6E0DC" }}>
                <MapPin className="h-4 w-4" style={{ color: "var(--green-300)" }} aria-hidden /> {SITE.city}, {SITE.region}
              </span>
              <span className="inline-flex items-center gap-2" style={{ color: "#D6E0DC" }}>
                <Clock className="h-4 w-4" style={{ color: "var(--green-300)" }} aria-hidden /> {SITE.hoursDisplay}
              </span>
            </div>
          </section>

          <nav aria-labelledby="footer-services" className="space-y-4 md:col-span-4">
            <h2 id="footer-services" className="text-[12px] font-medium uppercase" style={{ letterSpacing: "0.24em", color: "var(--green-300)" }}>שירותים</h2>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_NAV.map((s) => (
                <li key={s.slug}>
                  <a href={`/services/${s.slug}`} className="transition-colors" style={{ color: "#D6E0DC" }}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-site" className="space-y-4 md:col-span-3">
            <h2 id="footer-site" className="text-[12px] font-medium uppercase" style={{ letterSpacing: "0.24em", color: "var(--green-300)" }}>האתר</h2>
            <ul className="space-y-2.5 text-sm">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors" style={{ color: "#D6E0DC" }}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 pt-6 text-[11px] font-medium tracking-wide md:flex-row md:items-center md:justify-between" style={{ borderTop: "1px solid #28443E", color: "#9DB3AC" }}>
          <div>© {year} {SITE.brand} · כל הזכויות שמורות</div>
          <nav aria-label="קישורים משפטיים" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors" style={{ color: "#9DB3AC" }}>
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ color: "var(--accent-gold)" }}>המידע באתר אינו תחליף לייעוץ מקצועי</div>
        </div>
      </div>
    </footer>
  );
}