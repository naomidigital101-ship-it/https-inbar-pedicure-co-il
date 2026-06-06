import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <a href="/" className="flex items-baseline gap-2.5 transition-opacity hover:opacity-80">
          <span className="display text-2xl text-ink">{SITE.brand}</span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-copper sm:inline">פדיקור טיפולי</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft lg:flex" aria-label="ניווט ראשי">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="relative transition-colors hover:text-primary after:absolute after:bottom-[-6px] after:right-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="hidden rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:bg-primary-deep hover:shadow-[var(--shadow-elegant)] md:inline-block">קביעת תור</a>
          <button type="button" className="lg:hidden p-2 text-ink" aria-label="תפריט" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
