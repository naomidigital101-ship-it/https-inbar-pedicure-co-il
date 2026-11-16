/**
 * GA4 conversion events (shared names across all client sites):
 * whatsapp_click, phone_click, email_click, generate_lead.
 *
 * Events go only through the gtag that GoogleAnalytics.tsx loads, and only while
 * the visitor's cookie consent is "accepted" - the same rule as the page views.
 * If GA was not loaded, nothing is sent. No personal data and no query strings
 * go into the params.
 */
export const MEASUREMENT_ID = "G-44F1N7VL3V";
export const CONSENT_KEY = "lr_cookie_consent_v1";
export const ANALYTICS_HOSTS = ["inbar-pedicure.co.il", "www.inbar-pedicure.co.il"];
export const ANALYTICS_EXCLUDED_PATH = /^\/(admin|auth|api|lovable)(\/|$)/;

type ContactMethod = "phone" | "whatsapp" | "email";
export type LeadForm = "contact_form" | "home_lead_form";
type AnalyticsWindow = Window & { gtag?: (...args: unknown[]) => void };

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function loadedGtag() {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return null;
  if (!ANALYTICS_HOSTS.includes(location.hostname)) return null;
  if (ANALYTICS_EXCLUDED_PATH.test(location.pathname)) return null;
  return (window as AnalyticsWindow).gtag ?? null;
}

function sendEvent(name: string, params: Record<string, unknown>) {
  try {
    loadedGtag()?.("event", name, {
      send_to: MEASUREMENT_ID,
      transport_type: "beacon",
      page_location: location.origin + location.pathname,
      page_title: document.title,
      ...params,
    });
  } catch {
    // Measurement must never interrupt a form submit or a contact link.
  }
}

/** Call only after the lead row was saved (insert returned no error). */
export function trackLead(formId: LeadForm) {
  sendEvent("generate_lead", { form_id: formId, contact_method: "form" });
}

export function contactMethod(href: string): ContactMethod | null {
  try {
    const url = new URL(href, location.origin);
    if (url.protocol === "tel:") return "phone";
    if (url.protocol === "mailto:") return "email";
    if (url.protocol === "whatsapp:") return "whatsapp";
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.hostname === "wa.me") return "whatsapp";
    if (["api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname) && url.pathname === "/send") return "whatsapp";
    return null;
  } catch {
    return null;
  }
}

const CLICK_EVENT: Record<ContactMethod, string> = {
  phone: "phone_click",
  whatsapp: "whatsapp_click",
  email: "email_click",
};

function onContactClick(event: MouseEvent) {
  try {
    if (!event.isTrusted || (event.button !== 0 && event.button !== 1)) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    const method = anchor ? contactMethod(anchor.getAttribute("href") || "") : null;
    if (method) sendEvent(CLICK_EVENT[method], { contact_method: method });
  } catch {
    // Never break the click.
  }
}

let listening = false;
/** Registers one document-level (capture phase) listener for tel / mailto / WhatsApp links. */
export function startContactClickTracking() {
  if (listening || typeof document === "undefined") return;
  listening = true;
  document.addEventListener("click", onContactClick, true);
}
