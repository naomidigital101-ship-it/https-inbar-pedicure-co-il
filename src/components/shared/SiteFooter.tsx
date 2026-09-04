import { useSite } from "@/lib/use-site";
import logoImage from "@/assets/inbar-logo-farhi.png";

/**
 * הפוטר של המותג — לבן, ממורכז, קווי hairline בלבד, לפי חבילת המיתוג.
 * כל פרטי הקשר נשלפים מהגדרות האתר, כך ששינוי טלפון או עיר באדמין
 * מתעדכן בכל עמוד בבת אחת.
 */

const SERVICE_LINKS = [
  { label: "יבלות", href: "/services/corns" },
  { label: "פטרת", href: "/services/fungus" },
  { label: "ציפורן חודרנית", href: "/services/ingrown-nails" },
  { label: "כף רגל סוכרתית", href: "/services/diabetic-feet" },
  { label: "הכשרות", href: "/#academy" },
  { label: "יצירת קשר", href: "/contact" },
];

/* חובה בישראל: הצהרת נגישות ומדיניות פרטיות נגישות מכל עמוד. */
const LEGAL_LINKS = [
  { label: "הצהרת נגישות", href: "/accessibility" },
  { label: "מדיניות פרטיות", href: "/privacy" },
  { label: "תנאי שימוש", href: "/terms" },
  { label: "מפת האתר", href: "/sitemap" },
];

const FOOTER_CSS = `
.bf { background:#FFFFFF; padding:80px 6% 40px; font-family:'Assistant',sans-serif; }
.bf a { color:#141414; text-decoration:none; transition:color 0.2s; }
.bf a:hover { color:#0E3B2E; }
.bf-inner { max-width:1150px; margin:0 auto; text-align:center; }
.bf-logo { display:flex; justify-content:center; margin-bottom:26px; }
.bf-logo img { height:76px; display:block; }
.bf-row { display:flex; justify-content:center; flex-wrap:wrap; }
.bf-services { gap:34px; font-size:13.5px; font-weight:300; letter-spacing:0.14em; margin-bottom:34px; }
.bf-services a { color:#4E4E4E; padding:12px 0; }
.bf-contact { gap:26px; font-size:13.5px; font-weight:300; letter-spacing:0.06em; margin-bottom:34px; color:#6B6B6B; }
.bf-contact a { padding:12px 0; }
.bf-legal { gap:24px; font-size:13px; font-weight:300; letter-spacing:0.08em; margin-bottom:28px; }
.bf-legal a { color:#4E4E4E; padding:8px 0; }
.bf-credit { border-top:1px solid #ECEAE6; padding-top:24px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; font-size:12px; color:#6B6B6B; font-weight:300; }
`;

export function SiteFooter() {
  const site = useSite();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_CSS }} />
      <footer className="bf">
        <div className="bf-inner">
          <div className="bf-logo">
            <img src={logoImage} alt={`${site.brand} — פדיקור טיפולי והכשרות מקצועיות`} />
          </div>

          <div className="bf-row bf-services">
            {SERVICE_LINKS.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="bf-row bf-contact">
            <a href={site.telUrl}>{site.phoneDisplay}</a>
            <span aria-hidden>·</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span aria-hidden>·</span>
            <span>
              {site.city}, {site.region}
            </span>
          </div>

          <div className="bf-row bf-legal">
            {LEGAL_LINKS.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="bf-credit">
            <span>
              © {new Date().getFullYear()} {site.brand} · כל הזכויות שמורות
            </span>
            <span>המידע באתר אינו תחליף לייעוץ רפואי מקצועי</span>
          </div>
        </div>
      </footer>
    </>
  );
}
