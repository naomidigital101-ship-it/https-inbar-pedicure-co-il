import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { articles } from "@/lib/articles";

/* עיצוב לפי מערכת המותג של דף הבית: ללא רדיוס, ללא צל, קווי שיער בלבד. */

const BODONI = "'Bodoni Moda',serif";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Assistant:wght@200;300;400;600;700&display=swap";

const TITLE = "הצ׳קליסט מוכן להורדה | ענבר פרחי";
const CHECKLIST_PDF_URL = "/downloads/checklist-47.pdf";

const THANKS_CSS = `
.ipt { direction:rtl; font-family:'Assistant',sans-serif; color:#141414; background:#FFFFFF; }
.ipt a { transition:color 0.2s, background 0.2s, border-color 0.2s; }
.ipt-btn-solid:hover { background:#141414; color:#FFFFFF; }
.ipt-btn-outline:hover { background:#0E3B2E; border-color:#0E3B2E; color:#FFFFFF; }
@media (max-width: 560px) {
  .ipt-display { font-size:30px !important; }
  .ipt-h1 { font-size:32px !important; }
}
`;

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "תודה על ההרשמה." },
    ],
    links: [{ rel: "stylesheet", href: FONTS_HREF }],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  // שלושה מאמרים ראשונים שיש להם תוכן מלא.
  const popular = articles.filter((a) => a.sections.length > 0).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FFFFFF" }}>
      <style dangerouslySetInnerHTML={{ __html: THANKS_CSS }} />
      <SiteHeader />
      <main id="main-content" className="ipt flex-1">
        <section
          style={{
            background: "#FFFFFF",
            padding: "110px 6%",
            borderBottom: "1px solid #ECEAE6",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div
              className="ipt-display"
              style={{
                fontFamily: BODONI,
                fontSize: "38px",
                letterSpacing: "0.18em",
                color: "#726B5E",
                fontWeight: 400,
                marginBottom: "30px",
                marginLeft: "-0.18em",
                lineHeight: 1.15,
              }}
            >
              THANK YOU
            </div>
            <h1
              className="ipt-h1"
              style={{
                fontWeight: 700,
                fontSize: "38px",
                lineHeight: 1.35,
                margin: "0 0 22px",
                color: "#141414",
              }}
            >
              הצ׳קליסט שלכם מוכן להורדה
            </h1>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 2.05,
                color: "#4E4E4E",
                fontWeight: 300,
                margin: "0 0 46px",
              }}
            >
              ההורדה מתחילה אוטומטית. אם היא לא התחילה, לחצו על הכפתור והורידו את ה-PDF המלא — 48
              פריטים, ארבעה עמודים.
            </p>
            <div
              style={{
                display: "flex",
                gap: "26px",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <a
                className="ipt-btn-solid"
                href={CHECKLIST_PDF_URL}
                download="madrich-pedicure-tipuli.pdf"
                style={{
                  background: "#0E3B2E",
                  color: "#FFFFFF",
                  padding: "16px 44px",
                  fontWeight: 400,
                  fontSize: "14px",
                  letterSpacing: "0.2em",
                  display: "inline-block",
                }}
              >
                הורדת הצ׳קליסט (PDF)
              </a>
              <Link
                to="/"
                className="ipt-btn-outline"
                style={{
                  border: "1px solid #141414",
                  color: "#141414",
                  padding: "15px 40px",
                  fontWeight: 400,
                  fontSize: "13.5px",
                  letterSpacing: "0.2em",
                  display: "inline-block",
                }}
              >
                חזרה לדף הבית
              </Link>
            </div>
            <p
              style={{
                marginTop: "44px",
                paddingTop: "26px",
                borderTop: "1px solid #ECEAE6",
                fontSize: "13px",
                lineHeight: 1.95,
                color: "#6B6B6B",
                fontWeight: 300,
              }}
            >
              הצ׳קליסט הוא חומר הסברה כללי ואינו מחליף בדיקה אישית בקליניקה או ייעוץ רפואי.
            </p>
          </div>
        </section>

        <RelatedArticles articles={popular} />
      </main>
      <SiteFooter />
    </div>
  );
}
