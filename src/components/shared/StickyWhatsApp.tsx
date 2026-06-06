import { MessageCircle, MapPin } from "lucide-react";
import { SITE } from "@/lib/site-config";

/**
 * Sticky mobile bar — בית CTA כפול (וואטסאפ + ניווט). מוסתר ב-md ומעלה.
 */
export function StickyWhatsApp() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 py-2.5 shadow-[0_-8px_24px_-12px_rgb(29_58_53_/_0.18)] backdrop-blur md:hidden"
      role="region"
      aria-label="קביעת תור מהיר"
    >
      <div className="flex items-center gap-2">
        <a
          href={SITE.whatsappUrl}
          target="_blank"
          rel="noopener"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          וואטסאפ לקביעת טיפול
        </a>
        <a
          href={SITE.wazeUrl}
          target="_blank"
          rel="noopener"
          aria-label="ניווט לקליניקה"
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-ink/15 bg-surface text-copper"
        >
          <MapPin className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </div>
  );
}