import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { SITE, SERVICES_NAV } from "@/lib/site-config";
import logoAsset from "@/assets/inbar-logo.png.asset.json";

const navLinks = [
  { label: "בית", href: "/" },
  { label: "שירותים", href: "/services" },
  { label: "מאסטרקלאס", href: "/masterclass" },
  { label: "מרכז הידע", href: "/knowledge" },
  { label: "אודות ענבר", href: "/about" },
  { label: "מיתוג", href: "/branding" },
  { label: "צור קשר", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const current = typeof window !== "undefined" ? window.location.pathname : "/";
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--stone-100)" }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4">
        <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label={SITE.brand}>
          <img
            src={logoAsset.url}
            alt={`${SITE.brand} — קליניקה לבריאות כף הרגל`}
            className="h-12 w-auto md:h-14"
            loading="eager"
            decoding="async"
          />
        </a>
        <nav
          className="hidden items-center gap-7 text-[0.92rem] lg:flex"
          aria-label="ניווט ראשי"
          style={{ color: "var(--ink-900)" }}
        >
          {navLinks.map((l) => {
            const active = l.href === current || (l.href !== "/" && current.startsWith(l.href));
            return (
              <a
                key={l.href}
                href={l.href}
                className="relative pb-1 transition-colors"
                style={{
                  color: active ? "var(--green-700)" : "var(--ink-900)",
                  fontWeight: active ? 500 : 400,
                  borderBottom: active ? "1px solid var(--green-500)" : "1px solid transparent",
                }}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[0.85rem] font-medium transition-colors"
            style={{ background: "var(--green-500)", color: "var(--paper)", borderRadius: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-600)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--green-500)")}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            קבעו תור עכשיו
          </a>
        </nav>
        <button type="button" className="lg:hidden p-2" aria-label="תפריט" aria-expanded={open} onClick={() => setOpen((v) => !v)} style={{ color: "var(--ink-900)" }}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav
          className="lg:hidden"
          aria-label="ניווט במובייל"
          style={{ background: "var(--paper)", borderTop: "1px solid var(--stone-100)" }}
        >
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="block px-6 py-4 text-sm" style={{ color: "var(--ink-900)", borderBottom: "1px solid var(--stone-100)" }} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="px-6 py-3 text-[11px] font-medium uppercase" style={{ background: "var(--stone-50)", color: "var(--green-700)", letterSpacing: "0.22em" }}>שירותים</div>
          {SERVICES_NAV.map((s) => (
            <a key={s.slug} href={`/services/${s.slug}`} className="block px-8 py-3 text-xs" style={{ color: "var(--ink-600)", borderBottom: "1px solid var(--stone-100)" }} onClick={() => setOpen(false)}>{s.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
