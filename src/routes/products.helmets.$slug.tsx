import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Check, X, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { HELMETS, getHelmetBySlug, type HelmLevel, type HelmProduct } from "@/lib/products/helmets";
import { getHelmetImage } from "@/lib/products/helmet-images";

const SITE = "https://lazyrider.org";

const LEVEL_LABELS: Record<HelmLevel, string> = {
  entry: "כניסה",
  mid: "ביניים",
  pro: "מקצועי",
  elite: "אליטה",
};

const SHELL_LABELS: Record<string, string> = {
  polycarbonate: "פוליקרבונט",
  fiberglass: "פיברגלס",
  carbon: "סיב פחמן",
};

export const Route = createFileRoute("/products/helmets/$slug")({
  loader: ({ params }): { helmet: HelmProduct } => {
    const helmet = getHelmetBySlug(params.slug);
    if (!helmet) throw notFound();
    return { helmet };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "קסדה לא נמצאה" }] };
    const { helmet } = loaderData;
    const title = `${helmet.brand} ${helmet.model} ${helmet.year} - מחיר, תקנים וחנויות בישראל | הרוכב העצלן`;
    const description = `${helmet.short_desc_he} מחיר משוער ₪${helmet.price_ils_approx.toLocaleString(
      "he-IL",
    )} · ${helmet.retailers_israel.length} חנויות בישראל.`;
    const url = `${SITE}/products/helmets/${helmet.slug}`;
    const image = `${SITE}${getHelmetImage(helmet.slug)}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: HelmetProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-frank text-4xl font-black">הקסדה לא נמצאה</h1>
        <p className="mt-4 text-[#999]">המוצר שחיפשת אינו קיים במאגר.</p>
        <Link
          to="/products/helmets"
          className="mt-8 inline-block border border-[#e63000] bg-[#e63000] px-6 py-3 text-sm font-bold uppercase tracking-widest"
        >
          חזרה לקטלוג
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-frank text-3xl font-black">שגיאה בטעינה</h1>
        <p className="mt-4 text-[#999]">{error.message}</p>
      </div>
      <SiteFooter />
    </div>
  ),
});

function HelmetProductPage() {
  const data = Route.useLoaderData() as { helmet: HelmProduct };
  const helmet = data.helmet;
  const imageSrc = getHelmetImage(helmet.slug);

  const related = HELMETS.filter(
    (h) => h.slug !== helmet.slug && (h.brand === helmet.brand || h.level === helmet.level),
  ).slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${helmet.brand} ${helmet.model}`,
    image: `${SITE}${imageSrc}`,
    description: helmet.short_desc_he,
    brand: { "@type": "Brand", name: helmet.brand },
    sku: helmet.id,
    mpn: helmet.id,
    category: "קסדות שטח",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      lowPrice: helmet.price_ils_approx,
      offerCount: helmet.retailers_israel.length,
      availability: "https://schema.org/InStock",
      offers: helmet.retailers_israel.map((r) => ({
        "@type": "Offer",
        url: r.url,
        priceCurrency: "ILS",
        price: r.price_ils ?? helmet.price_ils_approx,
        seller: { "@type": "Organization", name: r.store },
        availability: "https://schema.org/InStock",
      })),
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "תקן בטיחות", value: helmet.safety_standard },
      { "@type": "PropertyValue", name: "הגנה סיבובית", value: helmet.rotation_protection },
      { "@type": "PropertyValue", name: "משקל", value: `${helmet.weight_grams} גרם` },
      { "@type": "PropertyValue", name: "חומר קליפה", value: SHELL_LABELS[helmet.shell] ?? helmet.shell },
      { "@type": "PropertyValue", name: "שנה", value: String(helmet.year) },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE },
      { "@type": "ListItem", position: 2, name: "קסדות", item: `${SITE}/products/helmets` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${helmet.brand} ${helmet.model}`,
        item: `${SITE}/products/helmets/${helmet.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl" lang="he">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <SiteHeader />

      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: "קסדות", href: "/products/helmets" },
            { label: `${helmet.brand} ${helmet.model}` },
          ]}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
          {/* תמונה */}
          <figure className="mx-auto w-full max-w-[320px] overflow-hidden border border-[#222] bg-white lg:sticky lg:top-24 lg:mx-0 xl:max-w-[340px]">
            <img
              src={imageSrc}
              alt={`קסדת ${helmet.brand} ${helmet.model} ${helmet.year}`}
              width={800}
              height={800}
               className="h-auto max-h-[320px] w-full object-contain sm:max-h-[360px] lg:max-h-[420px]"
            />
          </figure>

          {/* פרטים */}
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
              {helmet.brand} · רמת {LEVEL_LABELS[helmet.level]} · {helmet.year}
            </p>
            <h1 className="mt-3 font-frank text-4xl font-black leading-tight md:text-5xl">
              {helmet.brand} {helmet.model}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#ccc]">{helmet.short_desc_he}</p>

            <div className="mt-6 flex items-baseline gap-3 border-y border-[#222] py-5">
              <span className="text-5xl font-black text-[#f0f0f0]">
                ₪{helmet.price_ils_approx.toLocaleString("he-IL")}
              </span>
              <span className="text-sm text-[#888]">מחיר משוער · ${helmet.price_usd} ארה"ב</span>
            </div>

            {helmet.includes_goggles && (
              <p className="mt-4 inline-block border border-[#1f3a1f] bg-[#0f1a0f] px-3 py-1.5 text-xs font-bold text-[#7ac674]">
                ✓ כולל גוגל במתנה
              </p>
            )}

            <p className="mt-6 text-sm text-[#aaa]">
              <span className="font-bold text-[#ccc]">הכי מתאים ל:</span> {helmet.best_for_he}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <SpecBox label="תקן בטיחות" value={helmet.safety_standard} />
              <SpecBox label="הגנה סיבובית" value={helmet.rotation_protection} />
              <SpecBox label="משקל" value={`${helmet.weight_grams} גרם`} />
              <SpecBox label="חומר קליפה" value={SHELL_LABELS[helmet.shell] ?? helmet.shell} />
            </div>
          </div>
        </div>

        {/* יתרונות/חסרונות */}
        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="border border-[#1f3a1f] bg-[#0f1a0f] p-6">
            <h2 className="font-frank text-2xl font-black text-[#7ac674]">יתרונות</h2>
            <ul className="mt-4 space-y-3">
              {helmet.pros_he.map((pro) => (
                <li key={pro} className="flex gap-3 text-[#e0e0e0]">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#7ac674]" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#3a1f1f] bg-[#1a0f0f] p-6">
            <h2 className="font-frank text-2xl font-black text-[#e67a7a]">חסרונות</h2>
            <ul className="mt-4 space-y-3">
              {helmet.cons_he.map((con) => (
                <li key={con} className="flex gap-3 text-[#e0e0e0]">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e67a7a]" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* חנויות */}
        <section className="mt-14">
          <h2 className="font-frank text-3xl font-black">איפה לקנות בישראל</h2>
          <p className="mt-2 text-sm text-[#888]">
            {helmet.retailers_israel.length} חנויות מציעות את הדגם הזה. המחירים נכונים לעדכון אחרון
            ועשויים להשתנות.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {helmet.retailers_israel.map((r) => (
              <li key={r.url + r.store}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center justify-between border border-[#e63000]/60 bg-[#e63000]/10 px-5 py-4 transition-colors hover:bg-[#e63000]/20"
                >
                  <span>
                    <span className="block text-sm font-bold text-white">קנה ב{r.store}</span>
                    {r.price_ils && (
                      <span className="mt-1 block text-xs text-[#ccc]">
                        ₪{r.price_ils.toLocaleString("he-IL")}
                      </span>
                    )}
                  </span>
                  <ExternalLink className="h-5 w-5 text-[#e63000]" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* קסדות קשורות */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-[#222] pt-12">
            <h2 className="font-frank text-3xl font-black">קסדות דומות לבדיקה</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/products/helmets/$slug"
                  params={{ slug: r.slug }}
                  className="group border border-[#222] bg-[#111] transition-colors hover:border-[#e63000]"
                >
                  <figure className="aspect-[4/3] overflow-hidden bg-white">
                    <img
                      src={getHelmetImage(r.slug)}
                      alt={`קסדת ${r.brand} ${r.model}`}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-contain"
                    />
                  </figure>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                      {r.brand}
                    </p>
                    <h3 className="mt-1 font-frank text-lg font-black">{r.model}</h3>
                    <p className="mt-2 text-sm font-bold text-[#f0f0f0]">
                      ₪{r.price_ils_approx.toLocaleString("he-IL")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 border-t border-[#222] pt-8">
          <Link
            to="/products/helmets"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#e63000] hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לקטלוג הקסדות המלא
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#222] bg-[#111] p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#f0f0f0]">{value}</p>
    </div>
  );
}