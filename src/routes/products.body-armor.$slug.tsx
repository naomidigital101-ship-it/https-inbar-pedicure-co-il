import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Check, X, ArrowRight, Info } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { YouTubeEmbed } from "@/components/product/YouTubeEmbed";
import {
  BODY_ARMOR,
  getArmorBySlug,
  type BodyArmorProduct,
} from "@/lib/products/body-armor";

const SITE = "https://lazyrider.org";

const CATEGORY_LABELS: Record<BodyArmorProduct["category"], string> = {
  roost_guard: "מגן חזה (Roost Guard)",
  chest_protector: "צבי־צב",
  body_armor: "חליפת לחץ",
};

const SHELL_LABELS: Record<BodyArmorProduct["shell_type"], string> = {
  hard: "קליפה קשיחה",
  soft: "קצף רך",
  hybrid: "היברידי",
};

const WEAR_LABELS: Record<BodyArmorProduct["wear_position"], string> = {
  under_jersey: "מתחת לג'רזי",
  over_jersey: "מעל הג'רזי",
  both: "מתחת או מעל",
};

const GENDER_LABELS: Record<BodyArmorProduct["gender"], string> = {
  unisex: "יוניסקס",
  women: "ייעודי לנשים",
  men: "לגברים",
};

export const Route = createFileRoute("/products/body-armor/$slug")({
  loader: ({ params }): { product: BodyArmorProduct } => {
    const product = getArmorBySlug(params.slug);
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
    const url = `${SITE}/products/body-armor/${product.slug}`;
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
  component: BodyArmorProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl" lang="he">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-frank text-4xl font-black">המוצר לא נמצא</h1>
        <p className="mt-4 text-[#999]">המגן שחיפשת אינו קיים במאגר.</p>
        <Link
          to="/products/body-armor"
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

function BodyArmorProductPage() {
  const { product } = Route.useLoaderData() as { product: BodyArmorProduct };

  const related = BODY_ARMOR.filter(
    (a) =>
      a.slug !== product.slug &&
      (a.brand === product.brand || a.category === product.category),
  ).slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.model}`,
    image: product.unsplash_image,
    description: product.short_desc_he,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.id,
    category: CATEGORY_LABELS[product.category],
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
      { "@type": "PropertyValue", name: "קטגוריה", value: CATEGORY_LABELS[product.category] },
      { "@type": "PropertyValue", name: "סוג קליפה", value: SHELL_LABELS[product.shell_type] },
      { "@type": "PropertyValue", name: "מיקום לבישה", value: WEAR_LABELS[product.wear_position] },
      { "@type": "PropertyValue", name: "תקנים", value: product.safety_certifications.join(" · ") },
      { "@type": "PropertyValue", name: "שנה", value: String(product.year) },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "בית", item: SITE },
      { "@type": "ListItem", position: 2, name: "מגני גוף", item: `${SITE}/products/body-armor` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${product.brand} ${product.model}`,
        item: `${SITE}/products/body-armor/${product.slug}`,
      },
    ],
  };

  const zones: { label: string; has: boolean }[] = [
    { label: "חזה", has: true },
    { label: "גב", has: product.has_back_protection },
    { label: "כתפיים", has: product.has_shoulder_protection },
    { label: "מרפקים", has: product.has_elbow_protection },
    { label: "כליות", has: product.has_kidney_belt },
  ];

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
            { label: "מגני גוף", href: "/products/body-armor" },
            { label: `${product.brand} ${product.model}` },
          ]}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:gap-10">
          <figure className="mx-auto w-full max-w-[340px] overflow-hidden border border-[#222] bg-white lg:sticky lg:top-24 lg:mx-0">
            <img
              src={product.unsplash_image}
              alt={`${product.brand} ${product.model} - מגן גוף לאופנוע שטח`}
              width={800}
              height={800}
              className="h-auto max-h-[320px] w-full object-contain p-4 sm:max-h-[380px] lg:max-h-[440px]"
            />
          </figure>

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
              {product.brand} · {CATEGORY_LABELS[product.category]} · {product.year}
            </p>
            <h1 className="mt-3 font-frank text-4xl font-black leading-tight md:text-5xl">
              {product.brand} {product.model}
            </h1>

            {product.gender === "women" && (
              <span className="mt-3 inline-block bg-[#8b5cf6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                {GENDER_LABELS.women}
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
              <SpecBox label="קטגוריה" value={CATEGORY_LABELS[product.category]} />
              <SpecBox label="סוג קליפה" value={SHELL_LABELS[product.shell_type]} />
              <SpecBox label="לבישה" value={WEAR_LABELS[product.wear_position]} />
              <SpecBox label="מגדר" value={GENDER_LABELS[product.gender]} />
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">
                אזורי הגנה
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {zones.map((z) => (
                  <span
                    key={z.label}
                    className={
                      z.has
                        ? "border border-[#333] bg-[#111] px-3 py-1.5 text-xs text-[#ddd]"
                        : "border border-[#222] bg-[#0a0a0a] px-3 py-1.5 text-xs text-[#909090] line-through"
                    }
                  >
                    {z.has ? (
                      <Check className="ml-1 inline h-3 w-3 text-[#e63000]" />
                    ) : (
                      <X className="ml-1 inline h-3 w-3" />
                    )}
                    {z.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">
                תקני בטיחות
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.safety_certifications.map((cert) => (
                  <span
                    key={cert}
                    className="border border-[#e63000]/40 bg-[#e63000]/10 px-2.5 py-1 text-[11px] font-bold text-[#e63000]"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {product.women_notes && (
          <section className="mt-12 border-r-4 border-[#8b5cf6] bg-[#0f0a1a] p-6">
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

        {product.video_youtube_id && (
          <section className="mt-14">
            <h2 className="font-frank text-3xl font-black">סקירה מצולמת</h2>
            <div className="mt-6 max-w-3xl">
              <YouTubeEmbed
                youtubeId={product.video_youtube_id}
                title={product.video_title ?? `${product.brand} ${product.model} review`}
              />
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16 border-t border-[#222] pt-12">
            <h2 className="font-frank text-3xl font-black">מגנים דומים לבדיקה</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/products/body-armor/$slug"
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
            to="/products/body-armor"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#e63000] hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לקטלוג מגני הגוף
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