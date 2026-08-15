import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AccessibilityMenu } from "@/components/shared/AccessibilityMenu";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { StickyWhatsApp } from "@/components/shared/StickyWhatsApp";
import { SiteBanner } from "@/components/shared/SiteBanner";
import { SITE } from "@/lib/site-config";
import { getSiteValues, listReviews } from "@/lib/cms.functions";
import { SITE_DEFAULTS } from "@/lib/site-values";
import { SiteProvider } from "@/lib/use-site";

function NotFoundComponent() {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">העמוד לא נמצא</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          העמוד שחיפשת לא קיים או הועבר. אפשר לחזור לעמוד הבית או ליצור איתי קשר.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            חזרה לעמוד הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          העמוד לא נטען כראוי
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          משהו השתבש אצלנו. אפשר לנסות לרענן או לחזור לעמוד הבית.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            נסו שוב
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            חזרה לעמוד הבית
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // ערכי האתר נטענים פעם אחת כאן ומשמשים גם את תגיות ה-head וגם את כל
  // הקומפוננטות דרך SiteProvider — מקור אמת אחד לכל האתר.
  loader: async () => {
    const [site, reviews] = await Promise.all([
      getSiteValues(),
      listReviews().catch(() => ({ reviews: [], average: null, count: 0 })),
    ]);
    return { site, rating: { average: reviews.average, count: reviews.count } };
  },
  head: ({ loaderData }) => {
    const site = loaderData?.site ?? SITE_DEFAULTS;
    const rating = loaderData?.rating;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: site.brand },
        {
          name: "google-site-verification",
          content: "qrCeqz9Z18M-JRIpuVm-5R53R53QUDUpuGPFt0h3mq8",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: site.brand },
        { property: "og:locale", content: "he_IL" },
        { name: "twitter:card", content: "summary_large_image" },
        { title: `${site.brand} | ${site.tagline}` },
        { property: "og:title", content: `${site.brand} | ${site.tagline}` },
        { name: "twitter:title", content: `${site.brand} | ${site.tagline}` },
        { name: "description", content: site.shortDescription },
        { property: "og:description", content: site.shortDescription },
        { name: "twitter:description", content: site.shortDescription },
        ...(site.defaultOgImage
          ? [
              { property: "og:image", content: site.defaultOgImage },
              { name: "twitter:image", content: site.defaultOgImage },
            ]
          : []),
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: `${site.brand} — מאמרים חדשים (RSS)`,
          href: "/rss.xml",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
            "@id": site.url + "/#business",
            name: site.brand,
            url: site.url,
            description: site.shortDescription,
            telephone: site.phoneIntl,
            email: site.email,
            priceRange: "₪₪",
            image: site.defaultOgImage || site.url + "/apple-touch-icon.png",
            address: {
              "@type": "PostalAddress",
              addressLocality: site.city,
              addressRegion: site.region,
              addressCountry: "IL",
            },
            areaServed: [
              { "@type": "City", name: site.city },
              { "@type": "AdministrativeArea", name: site.region },
              { "@type": "City", name: "ירושלים" },
              { "@type": "City", name: "רמאללה" },
            ],
            openingHoursSpecification: SITE.hoursOpeningSpec,
            knowsAbout: [
              "פדיקור טיפולי",
              "טיפול ביבלות",
              "טיפול בפטרת",
              "ציפורן חודרנית",
              "סדקים בעקב",
              "פדיקור לחולי סוכרת",
              "אורטוניקסיה",
              "שיקום ציפורן BIO",
            ],
            ...(rating?.average && rating.count
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: rating.average,
                    reviewCount: rating.count,
                    bestRating: 5,
                    worstRating: 1,
                  },
                }
              : {}),
            founder: {
              "@type": "Person",
              name: site.brand,
              jobTitle: "פדיקוריסטית טיפולית",
              description: `פדיקוריסטית טיפולית עם מעל ${site.yearsExperience} שנות ניסיון, מרצה לפדיקוריסטיות, מתמחה בטיפול בכף הרגל של חולי סוכרת.`,
            },
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const data = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider value={data?.site ?? SITE_DEFAULTS}>
        <a href="#main-content" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <SiteBanner />
        <Outlet />
        <AccessibilityMenu />
        <CookieConsent />
        <StickyWhatsApp />
      </SiteProvider>
    </QueryClientProvider>
  );
}
