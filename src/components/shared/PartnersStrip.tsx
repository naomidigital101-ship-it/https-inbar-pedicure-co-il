import type { ComponentType } from "react";
import { PARTNERS } from "@/lib/site-config";
import { PharmFootLogo } from "./PartnerLogos";

const LOGO_MAP: Record<string, ComponentType<{ className?: string }>> = {
  "pharm-foot": PharmFootLogo,
};

export function PartnersStrip() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="border-y border-border/60 bg-surface-warm/60"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:gap-12 md:px-8 md:py-12">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="kicker" id="partners-heading">
            שיתופי פעולה מקצועיים
          </span>
          <p className="font-heading text-sm text-ink-soft md:text-base">
            מותגים שאני עובדת איתם בקליניקה
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-end">
          {PARTNERS.map((p) => {
            const Logo = LOGO_MAP[p.slug];
            if (!Logo) return null;
            return (
              <li key={p.slug}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`${p.name} — ${p.tagline}`}
                  className="inline-flex items-center text-ink-soft opacity-60 grayscale transition-all duration-300 hover:text-primary-deep hover:opacity-100 hover:grayscale-0"
                >
                  <Logo className="h-10 w-auto md:h-12" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}