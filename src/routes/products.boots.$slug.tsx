import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Check, X, ArrowRight, Info, Droplets, Repeat, Shield } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import {
  BOOTS,
  getBootBySlug,
  TYPE_LABELS,
  LEVEL_LABELS,
  WIDTH_LABELS,
  type BootProduct,
} from "@/lib/products/boots";

const SITE = "https://lazyrider.org";

export const Route = createFileRoute("/products/boots/$slug")({
  loader: ({ params }): { product: BootProduct } => {
    const product = getBootBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "מוצר לא נמצא" }] };
    const { product } = loaderData;
    const title = `${product.brand} ${product.model} ${product.year} - מחיר, תקני CE וחנויות בישראל | הרוכב העצלן`;
    const description = `${product.short_desc_he} מחיר משוער ₪${product.price_ils_approx.toLocaleString(
      "he-IL",
    )} · ${product.retailers_israel.length} חנויות בישראל.`;
    const url = `${SITE}/products/boots/${product.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: product.unsplash_image },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: product.unsplash_image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BootProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl" lang="he">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-frank text-4xl font-black">המוצר לא נמצא</h1>
        <p className="mt-4 text-[#999]">המגף שחיפשת אינו קיים במאגר.</p>
        <Link
          to="/products/boots"
          className="mt-8 inline-block border border-[#e63000] bg-[#e63000] px-6 py-3 text-sm font-bold uppercase tracking-widest"
        >
          חזרה לקטלוג
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl" lang="he">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-frank text-3xl font-black">שגיאה בטעינה</h1>
        <p className="mt-4 text-[#999]">{error.message}</p>
      </div>
      <SiteFooter />
    </div>
  ),
});

function BootProductPage() {
  const { product } = Route.useLoaderData() as { product: BootProduct };

  const related = BOOTS.filter(
    (b) => b.slug !== product.slug && (b.brand === product.brand || b.type === product.type),
  ).slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.model}`,
    image: product.unsplash_image,
    description: product.short_desc_he,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.id,
    category: `מגפי ${TYPE_LABELS[product.type]}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ILS",
      lowPrice: product.price_ils_approx,
      offerCount: product.retailers_israel.length,
      availability: "https://schema.org/InStock",
      offers: product.retailers_israel.map((r) => ({
        "@type": "Offer",
        url: r.url,
        priceCurrency: "ILS",
        price: r.price_ils ?? product.price_ils_approx,
        seller: { "@type": "Organization", name: r.store },
        availability: "https://schema.org/InStock",
      })),
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "סוג", value: TYPE_LABELS[product.type] },
      { "@type": "PropertyValue", name: "רמה", value: LEVEL_LABELS[product.level] },
      { "@type": "PropertyValue", name: "רוחב נעל", value: WIDTH_LABELS[product.toe_box_width] },
      { "@type": "PropertyValue", name: "תקן בטיחות", value: product.safety_standard },
      { "@type": "PropertyValue", name: "משקל לנעל", value: `${product.weight_grams_per_boot}g` },
      { "@type": "PropertyValue", name: "עמיד למים", value: product.waterproof ? "כן" : "לא" },
      { "@type": "PropertyValue", name: "סוליה מתחלפת", value: product.replaceable_sole ? "כן" : "לא" },
      { "@type": "PropertyValue", name: "תואם knee brace", value: product.knee_brace_compatible ? "כן" : "לא" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE },
      { "@type": "ListItem", position: 2, name: "מגפי שטח", item: `${SITE}/products/boots` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${product.brand} ${product.model}`,
        item: `${SITE}/products/boots/${product.slug}`,
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
            { label: "מגפי שטח", href: "/products/boots" },
            { label: `${product.brand} ${product.model}` },
          ]}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:gap-10">
          <figure className="mx-auto w-full max-w-[340px] overflow-hidden border border-[#222] bg-white lg:sticky lg:top-24 lg:mx-0">
            <img
              src={product.unsplash_image}
              alt={`${product.brand} ${product.model} - מגף שטח`}
              width={800}
              height={800}
              className="h-auto max-h-[320px] w-full object-contain p-4 sm:max-h-[380px] lg:max-h-[440px]"
            />
          </figure>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
              {product.brand} · {TYPE_LABELS[product.type]} · {LEVEL_LABELS[product.level]} · {product.year}
            </p>
            <h1 className="mt-3 font-frank text-4xl font-black leading-tight md:text-5xl">
              {product.brand} {product.model}
            </h1>

            {product.women_version_available && (
              <span className="mt-3 inline-block bg-[#8b5cf6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                גרסת נשים זמינה
              </span>
            )}

            <p className="mt-4 text-lg leading-relaxed text-[#ccc]">{product.short_desc_he}</p>

            <div className="mt-6 flex items-baseline gap-3 border-y border-[#222] py-5">
              <span className="text-5xl font-black text-[#f0f0f0]">
                ₪{product.price_ils_approx.toLocaleString("he-IL")}
              </span>
              <span className="text-sm text-[#888]">מחיר משוער · ${product.price_usd} ארה"ב</span>
            </div>

            <p className="mt-6 text-sm text-[#aaa]">
              <span className="font-bold text-[#ccc]">הכי מתאים ל:</span> {product.best_for_he}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <SpecBox label="סוג" value={TYPE_LABELS[product.type]} />
              <SpecBox label="רמה" value={LEVEL_LABELS[product.level]} />
              <SpecBox label="רוחב תיבת בוהן" value={WIDTH_LABELS[product.toe_box_width]} />
              <SpecBox label="משקל לנעל" value={`${product.weight_grams_per_boot}g`} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <FeatureBadge
                active={product.waterproof}
                icon={<Droplets className="h-3.5 w-3.5" />}
                label="עמיד למים"
                color="#3b82f6"
              />
              <FeatureBadge
                active={product.replaceable_sole}
                icon={<Repeat className="h-3.5 w-3.5" />}
                label="סוליה מתחלפת"
                color="#7ac674"
              />
              <FeatureBadge
                active={product.knee_brace_compatible}
                icon={<Shield className="h-3.5 w-3.5" />}
                label="תואם knee brace"
                color="#e63000"
              />
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">
                תקן בטיחות
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="border border-[#e63000]/40 bg-[#e63000]/10 px-2.5 py-1 text-[11px] font-bold text-[#e63000]">
                  {product.safety_standard}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">
                הגנת קרסול
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#ddd]">
                {product.ankle_protection}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12 border-r-4 border-[#e63000] bg-[#1a0f0a] p-6">
          <h2 className="font-frank text-2xl font-black text-[#f0a87a]">הערות התאמה</h2>
          <p className="mt-3 leading-relaxed text-[#ddd]">{product.fit_notes_he}</p>
        </section>

        {product.women_notes && (
          <section className="mt-6 border-r-4 border-[#8b5cf6] bg-[#0f0a1a] p-6">
            <h2 className="flex items-center gap-2 font-frank text-2xl font-black text-[#a78bfa]">
              <Info className="h-5 w-5" />
              הערה לרוכבות
            </h2>
            <p className="mt-3 leading-relaxed text-[#ddd]">{product.women_notes}</p>
          </section>
        )}

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="border border-[#1f3a1f] bg-[#0f1a0f] p-6">
            <h2 className="font-frank text-2xl font-black text-[#7ac674]">יתרונות</h2>
            <ul className="mt-4 space-y-3">
              {product.pros_he.map((pro) => (
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
              {product.cons_he.map((con) => (
                <li key={con} className="flex gap-3 text-[#e0e0e0]">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e67a7a]" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-frank text-3xl font-black">איפה לקנות בישראל</h2>
          <p className="mt-2 text-sm text-[#888]">
            {product.retailers_israel.length} חנויות מציעות את הדגם הזה. המחירים נכונים לעדכון אחרון
            ועשויים להשתנות.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {product.retailers_israel.map((r) => (
              <li key={r.url + r.store}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center justify-between border border-[#e63000]/60 bg-[#e63000]/10 px-5 py-4 transition-colors hover:bg-[#e63000]/20"
                >
                  <span>
                    <span className="block text-sm font-bold text-white">קנה ב{r.store}</span>
                    <span className="mt-1 block text-xs text-[#ccc]">
                      {typeof r.price_ils === "number"
                        ? `₪${r.price_ils.toLocaleString("he-IL")}`
                        : "בדוק באתר"}
                    </span>
                  </span>
                  <ExternalLink className="h-5 w-5 text-[#e63000]" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-16 border-t border-[#222] pt-12">
            <h2 className="font-frank text-3xl font-black">מגפים דומים לבדיקה</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/products/boots/$slug"
                  params={{ slug: r.slug }}
                  className="group border border-[#222] bg-[#111] transition-colors hover:border-[#e63000]"
                >
                  <figure className="aspect-[4/3] overflow-hidden bg-white">
                    <img
                      src={r.unsplash_image}
                      alt={`${r.brand} ${r.model}`}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-contain p-4"
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
            to="/products/boots"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#e63000] hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לקטלוג המגפיים
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

function FeatureBadge({
  active,
  icon,
  label,
  color,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <span
      className={
        active
          ? "flex items-center gap-1.5 border px-3 py-1.5 text-xs font-bold"
          : "flex items-center gap-1.5 border border-[#222] bg-[#0a0a0a] px-3 py-1.5 text-xs text-[#909090] line-through"
      }
      style={active ? { borderColor: `${color}66`, backgroundColor: `${color}1a`, color } : undefined}
    >
      {icon}
      {label}
    </span>
  );
}