import { createFileRoute, notFound } from "@tanstack/react-router";
import { Check, X, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { YouTubeEmbed } from "@/components/product/YouTubeEmbed";
import { FacebookPost } from "@/components/product/FacebookPost";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "מוצר לא נמצא | הרוכב העצלן" }] };
    }
    const { product } = loaderData;
    const SITE = "https://lazyrider.org";
    const url = `${SITE}/product/${params.slug}`;
    const title = `${product.name} - סקירה מאומתת | הרוכב העצלן`;
    const description = product.shortDescription.slice(0, 155);
    const imageAbs = product.image.startsWith("http") ? product.image : `${SITE}${product.image}`;

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: imageAbs,
      description: product.shortDescription,
      brand: { "@type": "Brand", name: product.brand },
      offers: {
        "@type": "Offer",
        priceCurrency: "ILS",
        price: product.priceILS,
        availability: "https://schema.org/InStock",
        url,
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בית", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "מוצרים", item: SITE + "/products" },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: imageAbs },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: imageAbs },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productSchema) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-8 py-24 text-center">
        <h1 className="font-frank text-4xl font-black">המוצר לא נמצא</h1>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-[#0a0a0a] p-8 text-[#f0f0f0]">
      <p>שגיאה בטעינת המוצר: {error.message}</p>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]" dir="rtl">
      <SiteHeader />

      <main id="main-content" className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
        <Breadcrumb
          items={[
            { label: "בית", href: "/" },
            { label: "מוצרים", href: "/products" },
            { label: product.name },
          ]}
        />

        {/* Hero */}
        <section className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
          <figure className="border border-[#222] bg-[#111]">
            <img
              src={product.image}
              alt={product.imageAlt}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </figure>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#e63000]">
              {product.categoryLabel} · {product.brand}
            </p>
            <h1 className="mt-3 font-frank text-4xl font-black leading-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-loose text-[#ccc]">
              {product.shortDescription}
            </p>
            <p className="mt-6 text-3xl font-black text-[#f0f0f0]">
              ₪{product.priceILS.toLocaleString("he-IL")}
              <span className="ms-2 text-xs font-normal text-[#a0a0a0]">מחיר משוער</span>
            </p>
            <div className="mt-6 space-y-2">
              {product.buyLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center justify-between border border-[#e63000] bg-[#e63000]/10 px-5 py-3 text-sm font-bold uppercase tracking-widest text-[#f0f0f0] transition-colors hover:bg-[#e63000]/20"
                >
                  <span>קנה ב-{link.label}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#a0a0a0]">
              עודכן: {product.updatedAtLabel}
            </p>
          </div>
        </section>

        {/* Long description */}
        <section className="mt-16 border-t border-[#222] pt-12">
          <h2 className="font-frank text-3xl font-black">הסקירה שלי</h2>
          <div className="mt-6 space-y-6 text-lg leading-loose text-[#ccc]">
            {product.longDescription.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Pros / Cons */}
        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="border border-[#1f3a1f] bg-[#0f1a0f] p-6">
            <h3 className="mb-4 font-frank text-xl font-black text-[#7ac674]">יתרונות</h3>
            <ul className="space-y-3">
              {product.pros.map((p) => (
                <li key={p} className="flex gap-3 text-[#ccc]">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[#7ac674]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#3a1f1f] bg-[#1a0f0f] p-6">
            <h3 className="mb-4 font-frank text-xl font-black text-[#e88a8a]">חסרונות</h3>
            <ul className="space-y-3">
              {product.cons.map((c) => (
                <li key={c} className="flex gap-3 text-[#ccc]">
                  <X className="mt-1 h-4 w-4 flex-shrink-0 text-[#e88a8a]" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Best for */}
        <section className="mt-8 border-r-4 border-[#e63000] bg-[#1a0a05] p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e63000]">
            למי זה מתאים
          </p>
          <p className="mt-2 text-lg text-[#f0f0f0]">{product.bestFor}</p>
        </section>

        {/* Video reviews */}
        {product.videos.length > 0 && (
          <section className="mt-16 border-t border-[#222] pt-12">
            <h2 className="font-frank text-3xl font-black">סקירות וידאו</h2>
            <p className="mt-2 text-sm text-[#a0a0a0]">
              סקירות שאספתי מ-YouTube של רוכבים וערוצי מקצוע
            </p>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {product.videos.map((v) => (
                <div key={v.youtubeId}>
                  <YouTubeEmbed youtubeId={v.youtubeId} title={v.title} />
                  <p className="mt-3 text-sm font-bold text-[#f0f0f0]">{v.title}</p>
                  <p className="text-xs text-[#a0a0a0]">
                    {v.channel} · {v.lang === "he" ? "עברית" : "אנגלית"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community posts */}
        {product.community.length > 0 && (
          <section className="mt-16 border-t border-[#222] pt-12">
            <h2 className="font-frank text-3xl font-black">מה אומרים בקהילה</h2>
            <p className="mt-2 text-sm text-[#a0a0a0]">
              ציטוטים מקבוצות פייסבוק ופורומים ישראליים של רוכבי שטח
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {product.community.map((post, i) => (
                <FacebookPost key={i} post={post} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}