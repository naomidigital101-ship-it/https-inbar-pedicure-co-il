import { useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";
import { getHelmetImage } from "@/lib/products/helmet-images";
import { SiteSearch } from "./SiteSearch";

const navLinks = [
  { label: "מכניקה", href: "/category/mechanic" },
  { label: "אופנועים", href: "/category/bikes" },
  { label: "מסלולים", href: "/category/trails" },
  { label: "ציוד", href: "/category/gear" },
  { label: "טכניקה", href: "/category/technique" },
  { label: "אודות", href: "/about" },
];

const productCats = [
  {
    href: "/products/helmets",
    label: "קסדות שטח",
    desc: "מוטוקרוס, אנדורו, פול־פייס",
    count: HELMETS.length,
    image: HELMETS[0] ? getHelmetImage(HELMETS[0].slug) : undefined,
    code: "GEAR_01",
  },
  {
    href: "/products/body-armor",
    label: "מגני גוף",
    desc: "Roost guards, חליפות לחץ, מגני חזה",
    count: BODY_ARMOR.length,
    image: BODY_ARMOR[0]?.unsplash_image,
    code: "GEAR_02",
  },
  {
    href: "/products/boots",
    label: "מגפי שטח",
    desc: "מוטוקרוס, אנדורו, אדוונצ'ר",
    count: BOOTS.length,
    image: BOOTS[0]?.unsplash_image,
    code: "GEAR_03",
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d6c5ac] bg-[#fefaf6]">
      <div className="flex items-center justify-between px-8 py-4 text-[11px] uppercase tracking-widest">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 text-lg lg:text-xl font-black text-[#2a1f1a]">
            <span>הרוכב</span>
            <span className="text-[#8b3a52]">העצלן</span>
          </a>
          <nav className="hidden items-center gap-6 font-bold text-[#6b5f55] lg:flex" aria-label="ניווט ראשי">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-[#2a1f1a]"
              >
                {l.label}
              </a>
            ))}
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
            >
              <button
                type="button"
                className="flex items-center gap-1 transition-colors hover:text-[#2a1f1a]"
                aria-haspopup="true"
                aria-expanded={megaOpen}
                onClick={() => setMegaOpen((v) => !v)}
              >
                מוצרים
                <ChevronDown className="h-3 w-3" />
              </button>
              {megaOpen && (
                <div
                  className="absolute right-0 top-full z-50 w-[680px] pt-3"
                  role="menu"
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleCloseMega}
                >
                  <div className="border border-[#d6c5ac] bg-[#fefaf6] p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between border-b border-[#d6c5ac] pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b3a52]">
                      // CATALOG
                    </span>
                    <a
                      href="/products"
                      className="text-[10px] font-bold uppercase tracking-widest text-[#2a1f1a] hover:text-[#8b3a52]"
                    >
                      לכל הקטגוריות ←
                    </a>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {productCats.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        className="group flex flex-col gap-2 border border-[#d6c5ac] bg-[#f5ede4] p-3 transition-colors hover:border-[#8b3a52] hover:bg-[#e8dccc]"
                        role="menuitem"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-[#fefaf6]">
                          {c.image && (
                            <img
                              src={c.image}
                              alt={c.label}
                              loading="lazy"
                              className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#8b3a52]">
                            [ {c.code} ]
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#6b5f55]">
                            {c.count} פריטים
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-[#2a1f1a] group-hover:text-[#8b3a52]">
                          {c.label}
                        </h3>
                        <p className="text-[11px] font-bold leading-relaxed text-[#6b5f55]">
                          {c.desc}
                        </p>
                      </a>
                    ))}
                  </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <SiteSearch variant="desktop" />
          </div>
          <button
            type="button"
            className="lg:hidden p-2"
            aria-label={open ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5 text-[#2a1f1a]" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 text-[#2a1f1a]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-[#d6c5ac] bg-[#fefaf6] lg:hidden"
          aria-label="ניווט במובייל"
        >
          <div className="border-b border-[#ede2d4] px-4 py-3">
            <SiteSearch variant="mobile" />
          </div>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-[#ede2d4] px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[#6b5f55]"
            >
              {l.label}
            </a>
          ))}
          <div className="border-b border-[#ede2d4] px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-[#8b3a52]">
            // מוצרים
          </div>
          {productCats.map((c) => (
            <a
              key={c.href}
              href={c.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b border-[#ede2d4] px-8 py-3"
            >
              {c.image && (
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="h-12 w-16 object-cover grayscale"
                />
              )}
              <div className="flex flex-col">
                <span className="text-[12px] font-black uppercase tracking-widest text-[#2a1f1a]">
                  {c.label}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b5f55]">
                  {c.count} פריטים
                </span>
              </div>
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}