import { useEffect, useState } from "react";
import { useSite } from "@/lib/use-site";
import logoImage from "@/assets/inbar-logo-farhi.png";

/**
 * ההדר של המותג — אותו ניווט שאושר בחבילת המיתוג של דף הבית: לוגו ממורכז
 * שפורץ את קו ההדר, קישורים חשופים לצידו וכפתור וואטסאפ מלבני. מתחת
 * ל-900px הקישורים מתחלפים בתפריט נפתח.
 *
 * הערכים כאן הם מקור האמת של המערכת: אפס radius, אפס צל, קווי hairline
 * של 1px #ECEAE6, Assistant לעברית.
 */

const NAV_LINKS = [
  { label: "טיפולים", href: "/services" },
  { label: "הכשרות", href: "/#academy" },
  { label: "השיטה", href: "/#method" },
  { label: "מאמרים", href: "/knowledge" },
  { label: "אודות", href: "/about" },
];

const HEADER_CSS = `
.bh-nav { background:#FFFFFF; border-bottom:1px solid #ECEAE6; position:sticky; top:0; z-index:60; font-family:'Assistant',sans-serif; }
.bh-nav a { color:#141414; text-decoration:none; transition:color 0.2s, background 0.2s, border-color 0.2s; }
.bh-nav a:hover { color:#0E3B2E; }
.bh-grid { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; padding:16px 4%; min-height:58px; }
.bh-links { display:flex; gap:30px; font-weight:300; font-size:14.5px; letter-spacing:0.12em; }
.bh-links a { padding:12px 0; }
.bh-logo { display:flex; align-items:center; justify-content:center; }
.bh-logo img { height:96px; display:block; margin:-10px 0; }
.bh-cta { display:flex; gap:22px; justify-content:left; align-items:center; }
.bh-wa { border:1px solid #141414; padding:10px 26px; letter-spacing:0.16em; font-size:13px; display:inline-flex; align-items:center; gap:9px; font-weight:300; }
.bh-wa:hover { background:#0E3B2E; border-color:#0E3B2E; color:#FFFFFF; }
.bh-burger { display:none; align-items:center; gap:10px; background:transparent; border:1px solid #8F8474; padding:12px 16px; cursor:pointer; font-size:13px; letter-spacing:0.14em; font-weight:300; color:#141414; font-family:'Assistant',sans-serif; }
.bh-panel { display:none; border-top:1px solid #ECEAE6; padding:6px 4% 18px; background:#FFFFFF; }
.bh-panel a { display:block; padding:14px 2px; border-bottom:1px solid #ECEAE6; font-weight:300; font-size:15px; letter-spacing:0.12em; }

@media (max-width: 900px) {
  .bh-links { display:none !important; }
  .bh-burger { display:inline-flex !important; }
  .bh-panel.is-open { display:block !important; }
  .bh-grid { padding:12px 5%; }
  .bh-logo img { height:64px; margin:-6px 0; }
  .bh-cta { display:none; }
}
@media (max-width: 560px) {
  .bh-grid { padding:10px 4%; }
  .bh-burger { padding:13px 12px; font-size:12px; }
  .bh-logo img { height:54px; margin:-4px 0; }
}
`;

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15.1L2 22l5-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

export function SiteHeader() {
  const site = useSite();
  const [open, setOpen] = useState(false);

  /*
   * קישורי העוגן הם "/#method": מעמוד פנימי הם ניווט מלא לדף הבית, ומדף
   * הבית עצמו הדפדפן רק גולל ולא מרנדר מחדש. סוגרים את התפריט בשני המקרים.
   */
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HEADER_CSS }} />
      <nav className="bh-nav" aria-label="ניווט ראשי">
        <div className="bh-grid">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="bh-links">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
            <button
              type="button"
              className="bh-burger"
              aria-label="תפריט ניווט"
              aria-expanded={open}
              aria-controls="bh-nav-panel"
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden style={{ display: "grid", gap: "4px" }}>
                <span
                  style={{ display: "block", width: "16px", height: "1px", background: "#141414" }}
                />
                <span
                  style={{ display: "block", width: "16px", height: "1px", background: "#141414" }}
                />
                <span
                  style={{ display: "block", width: "16px", height: "1px", background: "#141414" }}
                />
              </span>
              תפריט
            </button>
          </div>

          <a className="bh-logo" href="/" aria-label={`${site.brand} — לדף הבית`}>
            <img src={logoImage} alt="" />
          </a>

          <div className="bh-cta">
            <a className="bh-wa" href={site.whatsappUrl}>
              <WhatsAppIcon />
              דברו איתנו
            </a>
          </div>
        </div>

        <div id="bh-nav-panel" className={`bh-panel${open ? " is-open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href={site.whatsappUrl} onClick={() => setOpen(false)}>
            דברו איתנו בוואטסאפ
          </a>
        </div>
      </nav>
    </>
  );
}
