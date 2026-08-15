/**
 * גישה לערכי האתר שמנוהלים באדמין.
 *
 * הערכים נטענים פעם אחת ב-loader של ה-root ומסופקים לכל העץ, כדי שכל
 * קומפוננטה תקרא מאותו מקור. כך שינוי טלפון באדמין משנה אותו בכל מקום
 * באתר בבת אחת — ואין ערך מנוהל שנשאר קשיח בקומפוננטה.
 *
 * ה-fallback הוא הקבועים שהיו בקוד לפני המעבר, כדי שגם רינדור מחוץ
 * לעץ (או כשל בטעינה) יציג את הערכים הנכונים ולא ריק.
 */

import { createContext, useContext, type ReactNode } from "react";
import { SITE_DEFAULTS } from "@/lib/site-values";
import type { SiteValues } from "@/lib/cms-types";

const SiteContext = createContext<SiteValues>(SITE_DEFAULTS);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteValues;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteValues {
  return useContext(SiteContext);
}

/** קישור וואטסאפ עם ההודעה המוכנה מההגדרות. */
export function waHref(site: SiteValues, message?: string): string {
  const text = message ?? site.whatsappDefaultMessage;
  return text
    ? `${site.whatsappUrl}?text=${encodeURIComponent(text)}`
    : site.whatsappUrl;
}
