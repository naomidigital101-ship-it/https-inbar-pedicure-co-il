import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { SITE, SERVICES_NAV } from "@/lib/site-config";
import { categories } from "@/lib/categories";
import { articles } from "@/lib/articles";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [{ title: `מפת אתר | ${SITE.brand}` }],
    links: [{ rel: "canonical", href: `${SITE.url}/sitemap` }],
  }),
  component: SitemapPage,
});

function SitemapPage() {
  const pages = [
    { label: "דף הבית", href: "/" },
    { label: "אודות ענבר", href: "/about" },
    { label: "שירותים", href: "/services" },
    { label: "מרכז הידע", href: "/knowledge" },
    { label: "צור קשר", href: "/contact" },
  ];
  const legalPages = [
    { label: "הצהרת נגישות", href: "/accessibility" },
    { label: "מדיניות פרטיות", href: "/privacy" },
    { label: "תנאי שימוש", href: "/terms" },
  ];
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-[1100px] flex-1 px-6 py-16 md:px-10 md:py-20">
        <BrandEyebrow>SITEMAP · 00</BrandEyebrow>
        <h1
          className="mt-4 mb-10"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--green-700)",
          }}
        >
          מפת אתר
        </h1>
        <p className="mb-10 max-w-3xl" style={{ color: "var(--ink-600)", lineHeight: 1.85, fontSize: "1.02rem" }}>
          מפת האתר ריכוז של כל הדפים הציבוריים ב{SITE.brand} – פדיקור טיפולי ב{SITE.city}.
          האתר בנוי משלושה אזורי תוכן עיקריים: דפי שירותים המסבירים על כל טיפול שאנחנו מבצעים בקליניקה
          (כף רגל סוכרתית, ציפורן חודרנית, יבלות, פטרת, עקבים סדוקים ועוד), מרכז ידע מקצועי הכולל מאמרים
          מבוססי מקורות רפואיים סמכותיים, ועמודי מידע (אודות, יצירת קשר, נגישות). השתמשו במפה כדי
          לנווט במהירות לתוכן הרלוונטי, או הקלידו במנוע החיפוש שבראש הדף את המונח שמעניין אתכם.
        </p>
        <h2
          className="mt-6 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          דפים ראשיים
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {pages.map((p) => (
            <li key={p.href}>
              <Link to={p.href} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <h2
          className="mt-10 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          שירותים
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {SERVICES_NAV.map((s) => (
            <li key={s.slug}>
              <a href={`/services/${s.slug}`} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <h2
          className="mt-10 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          קטגוריות במרכז הידע
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <a href={`/category/${c.slug}`} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
        <h2
          className="mt-10 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          מאמרים נבחרים
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <a href={`/article/${a.slug}`} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {a.title}
              </a>
            </li>
          ))}
        </ul>
        <h2
          className="mt-10 mb-3"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.2rem", color: "var(--ink-900)" }}
        >
          מידע משפטי ונגישות
        </h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {legalPages.map((p) => (
            <li key={p.href}>
              <a href={p.href} style={{ color: "var(--ink-600)" }} className="hover:text-[var(--green-700)]">
                {p.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-3xl" style={{ color: "var(--ink-600)", lineHeight: 1.85, fontSize: "0.98rem" }}>
          אם לא הצלחתם למצוא את מה שחיפשתם, אתם מוזמנים לפנות אלינו ישירות בוואטסאפ או בטלפון{" "}
          {SITE.phoneDisplay}. ענבר פרחי, פדיקוריסטית טיפולית מוסמכת ב{SITE.city}, תשמח להפנות אתכם לתוכן
          הנכון או לקבוע פגישת אבחון אישית. המידע באתר נכתב על בסיס ניסיון קליני ואינו מחליף ייעוץ
          רפואי פרטני.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
