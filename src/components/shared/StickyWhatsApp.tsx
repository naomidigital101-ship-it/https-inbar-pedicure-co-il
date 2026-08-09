import { MessageCircle, MapPin } from "lucide-react";
import { SITE } from "@/lib/site-config";

/**
 * וואטסאפ קבוע: סרגל תחתון במובייל, ו-pill ירוק צף בפינה שמאל-תחתונה בדסקטופ.
 */
export function StickyWhatsApp() {
  return (
    <>
      {/* מובייל — סרגל תחתון */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 py-2.5 backdrop-blur md:hidden"
        style={{ boxShadow: "0 -8px 24px -12px rgba(15,76,74,0.18)" }}
        role="region"
        aria-label="קביעת תור מהיר"
      >
        <div className="flex items-center gap-2">
          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener nofollow"
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white"
            style={{ background: "var(--whatsapp)" }}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            וואטסאפ לקביעת טיפול
          </a>
          <a
            href={SITE.wazeUrl}
            target="_blank"
            rel="noopener nofollow"
            aria-label="ניווט לקליניקה"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-border bg-surface"
            style={{ color: "var(--primary)" }}
          >
            <MapPin className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </div>

      {/* דסקטופ — pill צף */}
      <a
        href={SITE.whatsappUrl}
        target="_blank"
        rel="noopener nofollow"
        className="fixed bottom-6 left-6 z-[100] hidden items-center gap-2 rounded-full px-6 py-3.5 text-[16.5px] font-bold text-white transition-colors md:inline-flex"
        style={{
          background: "var(--whatsapp)",
          fontFamily: "var(--font-display)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--whatsapp-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--whatsapp)")}
      >
        <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
        וואטסאפ לתיאום
      </a>
    </>
  );
}
