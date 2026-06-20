import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { SITE, SERVICES_NAV } from "@/lib/site-config";
import { BrandLogo } from "./BrandLogo";

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
  const [scrolled, setScrolled] = useState(false);
  const current = typeof window !== "undefined" ? window.location.pathname : "/";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "color-mix(in oklab, var(--paper) 92%, transparent)",
        backdropFilter: "saturate(140%) blur(10px)",
        boxShadow: scrolled
          ? "0 1px 0 var(--stone-100), 0 8px 24px -16px rgb(30 36 34 / 0.18)"
          : "0 1px 0 var(--stone-100)",
        transition: "box-shadow 240ms ease, background 240ms ease",
      }}
    >
      {/* Gold hairline accent — מותג */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent-gold) 22%, var(--accent-gold) 78%, transparent 100%)",
          opacity: 0.55,
        }}
      />
      {/* Organic green arc — נגיעה אורגנית בקצה */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-px left-0 hidden h-10 w-[260px] md:block"
        viewBox="0 0 260 40"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 40 Q 60 0 130 18 T 260 40"
          stroke="var(--green-300)"
          strokeOpacity="0.45"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-1">
        <a href="/" className="transition-opacity hover:opacity-80" aria-label={SITE.brand}>
          <BrandLogo tone="ink" layout="horizontal" size={44} />
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
                className="group relative pb-1 transition-colors hover:text-[var(--green-700)]"
                style={{
                  color: active ? "var(--green-700)" : "var(--ink-900)",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {l.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
                    transform: active ? "scaleX(1)" : undefined,
                  }}
                />
              </a>
            );
          })}
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-[0.85rem] font-medium transition-all"
            style={{
              background: "var(--green-700)",
              color: "var(--paper)",
              borderRadius: 999,
              boxShadow:
                "0 1px 0 rgb(255 255 255 / 0.15) inset, 0 8px 20px -12px rgb(79 140 123 / 0.55)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--green-800)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--green-700)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent-gold)" }}
            />
            <MessageCircle className="h-4 w-4" aria-hidden />
            קבעו תור עכשיו
          </a>
        </nav>
        <button
          type="button"
          className="lg:hidden p-2 transition-colors"
          aria-label="תפריט"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            color: "var(--green-700)",
            border: "1px solid var(--stone-100)",
            borderRadius: 999,
            background: "var(--stone-50)",
          }}
        >
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
