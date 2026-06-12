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
  { label: "צור קשר", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const current = typeof window !== "undefined" ? window.location.pathname : "/";
  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 rounded-full border border-border/50 bg-background/80 px-6 py-3 shadow-[0_10px_40px_-12px_rgba(15,27,61,0.18)] backdrop-blur-2xl ring-1 ring-white/40">
        <a href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label={SITE.brand}>
          <img
            src={logoAsset.url}
            alt={`${SITE.brand} — קליניקה לבריאות כף הרגל`}
            className="h-12 w-auto md:h-14"
            loading="eager"
            decoding="async"
          />
          <span
            aria-hidden
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: "0.22em",
              fontSize: "17px",
              fontWeight: 300,
              color: "var(--primary-deep)",
              borderRight: "1px solid var(--border)",
              paddingRight: "12px",
              marginRight: "4px",
            }}
          >
            INBAR
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-[0.92rem] font-normal text-ink lg:flex" aria-label="ניווט ראשי">
          {navLinks.map((l) => {
            const active = l.href === current || (l.href !== "/" && current.startsWith(l.href));
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative pb-1 transition-colors hover:text-primary-deep ${active ? "text-ink after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-full after:bg-copper" : ""}`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[0.85rem] font-bold text-primary-foreground shadow-[0_8px_20px_-6px_rgba(15,27,61,0.25)] transition-all hover:bg-primary-deep hover:shadow-[0_10px_24px_-6px_rgba(15,27,61,0.35)]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            וואטסאפ
          </a>
        </nav>
        <button type="button" className="lg:hidden p-2 text-ink" aria-label="תפריט" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="mx-auto mt-2 max-w-[1280px] overflow-hidden rounded-3xl border border-border/50 bg-background/95 shadow-[0_20px_50px_-12px_rgba(15,27,61,0.25)] backdrop-blur-xl lg:hidden" aria-label="ניווט במובייל">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="block border-b border-border/60 px-6 py-4 text-sm font-bold text-ink" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="bg-surface-warm px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-copper">שירותים</div>
          {SERVICES_NAV.map((s) => (
            <a key={s.slug} href={`/services/${s.slug}`} className="block border-b border-border/40 px-8 py-3 text-xs text-ink-soft" onClick={() => setOpen(false)}>{s.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
