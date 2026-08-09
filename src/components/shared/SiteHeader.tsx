import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Footprints,
  Droplets,
  Scissors,
  Sparkles,
  Activity,
  HeartPulse,
  Award,
} from "lucide-react";
import { SITE, SERVICES_NAV } from "@/lib/site-config";
import { BrandLogo } from "./BrandLogo";

const navLinks = [
  { label: "בית", href: "/" },
  { label: "שירותים", href: "/services" },
  { label: "מרכז הידע", href: "/knowledge" },
  { label: "אודות ענבר", href: "/about" },
  { label: "צור קשר", href: "/contact" },
];

const SERVICE_ICONS: Record<string, typeof Footprints> = {
  corns: Footprints,
  fungus: Droplets,
  "ingrown-nails": Scissors,
  onycholysis: Sparkles,
  "cracked-heels": Activity,
  "diabetic-feet": HeartPulse,
  "sports-feet": Award,
};

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  corns: "הסרת יבלות וקאלוסים בכלים סטריליים",
  fungus: "טיפול יסודי בפטרת עור וציפורן",
  "ingrown-nails": "אורתוניקסיה ללא ניתוח, ללא כאב",
  onycholysis: "שיקום ציפורן מנותקת בשיטת BIO",
  "cracked-heels": "איחוי סדקים והחזרת רכות לעקב",
  "diabetic-feet": "פרוטוקול אגודת אייל, ללא סכינים",
  "sports-feet": "פתרונות לחיילים וספורטאים",
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const current = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* פס עליון — שעות, טלפון, וואטסאפ */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 px-6 py-2 text-[13px] md:justify-between md:text-[14px]"
        style={{ background: "var(--primary)", color: "var(--green-200)" }}
      >
        <span className="font-semibold">
          הקליניקה ב{SITE.city} · {SITE.hoursDisplay} · הכשרות בכל הארץ
        </span>
        <div className="flex items-center gap-4">
          <a href={SITE.telUrl} className="font-bold text-white" dir="ltr">
            {SITE.phoneDisplay}
          </a>
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener nofollow"
            className="rounded-full px-3.5 py-1 font-bold text-white transition-colors"
            style={{ background: "var(--whatsapp)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--whatsapp-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--whatsapp)")}
          >
            וואטסאפ
          </a>
        </div>
      </div>

      <header
        style={{
          background: "var(--paper)",
          boxShadow: scrolled
            ? "0 2px 18px rgba(15,76,74,0.10)"
            : "0 1px 0 var(--border)",
          transition: "box-shadow 240ms ease",
        }}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-3">
          <a href="/" className="transition-opacity hover:opacity-80" aria-label={SITE.brand}>
            <BrandLogo tone="ink" layout="horizontal" size={44} />
          </a>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-[15.5px] font-semibold lg:flex"
            aria-label="ניווט ראשי"
          >
            {navLinks.map((l) => {
              const active = l.href === current || (l.href !== "/" && current.startsWith(l.href));
              const linkStyle = {
                color: active ? "var(--primary)" : "var(--ink)",
                background: active ? "var(--primary-soft)" : "transparent",
                borderRadius: 999,
                padding: "9px 16px",
              } as const;

              if (l.href === "/services") {
                return (
                  <div
                    key={l.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <a
                      href="/services"
                      className="inline-flex items-center gap-1 transition-colors"
                      style={linkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--primary-soft)";
                        e.currentTarget.style.color = "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = active ? "var(--primary-soft)" : "transparent";
                        e.currentTarget.style.color = active ? "var(--primary)" : "var(--ink)";
                      }}
                    >
                      {l.label}
                      <ChevronDown
                        className="h-3.5 w-3.5 transition-transform"
                        style={{ transform: servicesOpen ? "rotate(180deg)" : undefined }}
                        aria-hidden
                      />
                    </a>
                    {servicesOpen && (
                      <div
                        className="absolute right-1/2 top-full z-50 translate-x-1/2 pt-3"
                        role="menu"
                        aria-label="תפריט שירותים"
                      >
                        <div
                          className="grid w-[640px] grid-cols-2 gap-1 border border-border bg-surface p-3"
                          style={{ borderRadius: 22, boxShadow: "var(--shadow-lift)" }}
                        >
                          {SERVICES_NAV.map((s) => {
                            const Icon = SERVICE_ICONS[s.slug] ?? Footprints;
                            return (
                              <a
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                className="flex items-start gap-3 rounded-2xl p-3 transition-colors"
                                style={{ color: "var(--ink)" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "var(--primary-soft)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "transparent";
                                }}
                              >
                                <span
                                  aria-hidden
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                  style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                                >
                                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[15px] font-bold">{s.label}</span>
                                  <span
                                    className="mt-0.5 block text-[13px] font-normal leading-snug"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    {SERVICE_DESCRIPTIONS[s.slug]}
                                  </span>
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="transition-colors"
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--primary-soft)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = active ? "var(--primary-soft)" : "transparent";
                    e.currentTarget.style.color = active ? "var(--primary)" : "var(--ink)";
                  }}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <a
            href={`${SITE.whatsappUrl}?text=${encodeURIComponent("שלום ענבר, אשמח לתאם טיפול")}`}
            target="_blank"
            rel="noopener nofollow"
            className="hidden px-6 py-3 text-[16px] lg:inline-flex"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              borderRadius: 999,
              fontWeight: 700,
              boxShadow: "0 6px 18px rgba(226,114,91,0.35)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            בואי נדבר
          </a>

          <button
            type="button"
            className="p-2 transition-colors lg:hidden"
            aria-label="תפריט"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{
              color: "var(--primary)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              background: "var(--primary-soft)",
            }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav
            className="lg:hidden"
            aria-label="ניווט במובייל"
            style={{ background: "var(--paper)", borderTop: "1px solid var(--border)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block px-6 py-4 text-[15px] font-semibold"
                style={{ color: "var(--ink)", borderBottom: "1px solid var(--border)" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div
              className="px-6 py-3 text-[11px] font-bold uppercase"
              style={{ background: "var(--primary-soft)", color: "var(--primary)", letterSpacing: "0.22em" }}
            >
              שירותים
            </div>
            {SERVICES_NAV.map((s) => (
              <a
                key={s.slug}
                href={`/services/${s.slug}`}
                className="block px-8 py-3 text-[13.5px]"
                style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}
                onClick={() => setOpen(false)}
              >
                {s.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </div>
  );
}
