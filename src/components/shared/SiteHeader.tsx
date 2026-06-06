import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { SITE, SERVICES_NAV } from "@/lib/site-config";

const navLinks = [
  { label: "בית", href: "/" },
  { label: "שירותים", href: "/services" },
  { label: "מרכז הידע", href: "/knowledge" },
  { label: "אודות ענבר", href: "/about" },
  { label: "צור קשר", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const current = typeof window !== "undefined" ? window.location.pathname : "/";
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="display text-2xl text-primary-deep">{SITE.brand}</span>
          <span aria-hidden className="text-copper">🌾</span>
        </a>
        <nav className="hidden items-center gap-9 text-[0.95rem] font-normal text-ink lg:flex" aria-label="ניווט ראשי">
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
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[0.85rem] font-bold text-primary-foreground transition-colors hover:bg-primary-deep"
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
        <nav className="border-t border-border bg-surface lg:hidden" aria-label="ניווט במובייל">
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
