/**
 * פס הודעה בראש האתר — נשלט מהאדמין (פרטי העסק → הודעה זמנית).
 * מיועד להודעות קצרות: חופשה, שינוי בשעות, תורים שהתפנו.
 */

import { useRouterState } from "@tanstack/react-router";
import { useSite } from "@/lib/use-site";

export function SiteBanner() {
  const site = useSite();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // ההודעה מיועדת למבקרים באתר, לא למסכי הניהול
  if (pathname.startsWith("/admin")) return null;
  if (!site.bannerEnabled || !site.bannerText.trim()) return null;

  const content = (
    <span
      className="block px-4 py-2.5 text-center text-[14px] leading-snug"
      style={{ fontWeight: 600 }}
    >
      {site.bannerText}
    </span>
  );

  return (
    <div
      dir="rtl"
      role="status"
      style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
    >
      {site.bannerLink ? (
        <a href={site.bannerLink} className="block underline-offset-4 hover:underline">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
