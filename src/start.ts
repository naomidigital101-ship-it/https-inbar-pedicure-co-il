import { createStart, createMiddleware } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

import { renderErrorPage } from "./lib/error-page";
import { findLegacyRedirect } from "./lib/legacy-redirects";

const CSP_VALUE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const cspMiddleware = createMiddleware().server(async ({ next }) => {
  const response = await next();

  if (response instanceof Response) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Content-Security-Policy", CSP_VALUE);
    newHeaders.set("X-Frame-Options", "DENY");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return response;
});

/**
 * 301 redirects מנתיבי האתר הקודם (WordPress, inbar-pedicure.co.il).
 * רץ לפני שאר ה־middleware — כדי לא לבזבז עיבוד על נתיב שיופנה.
 */
const legacyRedirectMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const target = findLegacyRedirect(url.pathname);
  if (target) {
    const dest = new URL(target, url.origin);
    dest.search = url.search;
    return new Response(null, {
      status: 301,
      headers: { Location: dest.toString() },
    });
  }
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [legacyRedirectMiddleware, cspMiddleware, errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
