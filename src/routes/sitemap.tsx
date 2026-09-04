import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE, SERVICES_NAV } from "@/lib/site-config";
import { useSite } from "@/lib/use-site";
import { categories } from "@/lib/categories";
import { articles } from "@/lib/articles";

/* עיצוב לפי מערכת המותג של דף הבית: ללא רדיוס, ללא צל, קווי שיער בלבד. */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const SITEMAP_CSS = `
.ips { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
.ips a { color:#4E4E4E; transition:color 0.2s; display:inline-block; padding:8px 0; }
.ips a:hover { color:#0E3B2E; }
@media (max-width: 700px) {
  .ips-list { grid-template-columns:1fr !important; }
}
@media (max-width: 560px) {
  .ips-h1 { font-size:32px !important; }
}
`;

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: `מפת אתר | ${SITE.brand}` },
      {
        name: "description",
        content: `כל העמודים באתר ${SITE.brand} — פדיקור טיפולי ב${SITE.city}: טיפולים, מרכז ידע, אודות ויצירת קשר.`,
      },
    ],
    links: [
      { rel: "canonical", href: `${SITE.url}/sitemap` },
      { rel: "stylesheet", href: FONTS_HREF },
    ],
  }),
  component: SitemapPage,
});

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      style={{
        fontWeight: 600,
        fontSize: "19px",
        letterSpacing: "0.04em",
        color: "#141414",
        margin: "56px 0 12px",
        paddingBottom: "14px",
        borderBottom: "1px solid #ECEAE6",
      }}
    >
      {children}
    </h2>
  );
}

function LinkList({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className="ips-list"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: "0 40px",
      }}
    >
      {children}
    </ul>
  );
}

function SitemapPage() {
  const site = useSite();
  const pages = [
    { label: "דף הבית", href: "/" },
    { label: "אודות ענבר", href: "/about" },
    { label: "טיפולים", href: "/services" },
    { label: "מרכז הידע", href: "/knowledge" },
    { label: "יצירת קשר", href: "/contact" },
  ];
  const legalPages = [
    { label: "הצהרת נגישות", href: "/accessibility" },
    { label: "מדיניות פרטיות", href: "/privacy" },
    { label: "תנאי שימוש", href: "/terms" },
  ];
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: SITEMAP_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ips flex-1" style={{ padding: "90px 6%" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: BODONI,
              fontSize: "14px",
              letterSpacing: "0.5em",
              color: "#6B6B6B",
              fontWeight: 400,
              marginBottom: "22px",
              marginLeft: "-0.5em",
            }}
          >
            SITEMAP
          </div>
          <h1
            className="ips-h1"
            style={{
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: 1.3,
              margin: "0 0 24px",
              color: "#141414",
            }}
          >
            מפת אתר
          </h1>
          <p
            style={{
              fontSize: "15.5px",
              lineHeight: 2.05,
              color: "#4E4E4E",
              fontWeight: 300,
              margin: 0,
              maxWidth: "700px",
            }}
          >
            כל העמודים הציבוריים באתר {site.brand} — פדיקור טיפולי ב{site.city}. האתר בנוי משלושה
            אזורי תוכן: עמודי הטיפולים, המסבירים כל טיפול שאני מבצעת בקליניקה (כף רגל סוכרתית,
            ציפורן חודרנית, יבלות, פטרת, עקבים סדוקים ועוד); מרכז ידע מקצועי עם מאמרים מבוססי מקורות
            רפואיים; ועמודי המידע — אודות, יצירת קשר ונגישות.
          </p>

          <SectionHeading>עמודים ראשיים</SectionHeading>
          <LinkList>
            {pages.map((p) => (
              <li key={p.href}>
                <Link to={p.href}>{p.label}</Link>
              </li>
            ))}
          </LinkList>

          <SectionHeading>טיפולים</SectionHeading>
          <LinkList>
            {SERVICES_NAV.map((s) => (
              <li key={s.slug}>
                <a href={`/services/${s.slug}`}>{s.label}</a>
              </li>
            ))}
          </LinkList>

          <SectionHeading>קטגוריות במרכז הידע</SectionHeading>
          <LinkList>
            {categories.map((c) => (
              <li key={c.slug}>
                <a href={`/category/${c.slug}`}>{c.name}</a>
              </li>
            ))}
          </LinkList>

          <SectionHeading>מאמרים</SectionHeading>
          <LinkList>
            {articles.map((a) => (
              <li key={a.slug}>
                <a href={`/article/${a.slug}`}>{a.title}</a>
              </li>
            ))}
          </LinkList>

          <SectionHeading>מידע משפטי ונגישות</SectionHeading>
          <LinkList>
            {legalPages.map((p) => (
              <li key={p.href}>
                <a href={p.href}>{p.label}</a>
              </li>
            ))}
          </LinkList>

          <p
            style={{
              marginTop: "64px",
              paddingTop: "28px",
              borderTop: "1px solid #ECEAE6",
              fontSize: "14.5px",
              lineHeight: 2,
              color: "#6B6B6B",
              fontWeight: 300,
              maxWidth: "700px",
            }}
          >
            לא מצאתם את מה שחיפשתם? דברו איתנו בוואטסאפ או בטלפון {site.phoneDisplay}, ואפנה אתכם
            לתוכן הנכון או נתאם פגישת אבחון. המידע באתר נכתב על בסיס ניסיון קליני ואינו מחליף ייעוץ
            רפואי פרטני.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
