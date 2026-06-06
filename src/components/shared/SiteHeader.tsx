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
    <header className="sticky top-0 z-50 border-b border-[#b8dcd4] bg-[#fdfbf7]">
      <div className="flex items-center justify-between px-6 py-4">
        <a href="/" className="text-lg font-black text-[#1d3a35]">
          <span>{SITE.brand}</span>
          <span className="mr-2 text-[11px] font-bold text-[#5fa898]">פדיקור טיפולי</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-bold text-[#2d4a44] lg:flex" aria-label="ניווט ראשי">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[#5fa898]">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="hidden bg-[#25d366] px-4 py-2 text-xs font-bold text-white md:inline-block">וואטסאפ</a>
          <button type="button" className="lg:hidden p-2" aria-label="תפריט" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-[#b8dcd4] bg-[#fdfbf7] lg:hidden" aria-label="ניווט במובייל">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="block border-b border-[#ede2d4] px-6 py-4 text-sm font-bold text-[#2d4a44]" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          {SERVICES_NAV.map((s) => (
            <a key={s.slug} href={`/services/${s.slug}`} className="block border-b border-[#ede2d4] px-8 py-3 text-xs text-[#5a4f48]" onClick={() => setOpen(false)}>{s.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
