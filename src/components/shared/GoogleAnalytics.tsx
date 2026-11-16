import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { startClarity, stopClarity } from "@/lib/clarity";
import {
  ANALYTICS_EXCLUDED_PATH,
  ANALYTICS_HOSTS,
  CONSENT_KEY,
  MEASUREMENT_ID,
  startContactClickTracking,
} from "@/lib/analytics";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function GoogleAnalytics() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [consented, setConsented] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const readConsent = () => {
      try {
        setConsented(localStorage.getItem(CONSENT_KEY) === "accepted");
      } catch {
        setConsented(false);
      }
    };
    readConsent();
    // GA4 contact-link clicks; each click re-checks consent and that GA is loaded.
    startContactClickTracking();
    window.addEventListener("analytics-consent", readConsent);
    window.addEventListener("storage", readConsent);
    return () => {
      window.removeEventListener("analytics-consent", readConsent);
      window.removeEventListener("storage", readConsent);
    };
  }, []);

  useEffect(() => {
    if (consented) startClarity();
    else stopClarity();
  }, [consented]);

  useEffect(() => {
    if (!consented || !ANALYTICS_HOSTS.includes(location.hostname)) return;
    if (ANALYTICS_EXCLUDED_PATH.test(pathname)) {
      lastPage.current = null;
      return;
    }
    if (lastPage.current === pathname) return;
    const analytics = window as AnalyticsWindow;
    if (!analytics.gtag) {
      analytics.dataLayer = analytics.dataLayer || [];
      analytics.gtag = function () { analytics.dataLayer!.push(arguments); };
      analytics.gtag("js", new Date());
      analytics.gtag("config", MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
      document.head.appendChild(script);
    }
    analytics.gtag("event", "page_view", {
      send_to: MEASUREMENT_ID,
      page_location: location.origin + pathname,
      page_title: document.title,
      page_referrer: lastPage.current ? location.origin + lastPage.current : document.referrer.split(/[?#]/)[0],
    });
    lastPage.current = pathname;
  }, [consented, pathname]);

  return null;
}
