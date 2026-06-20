import { BrandEyebrow } from "@/components/brand/BrandPrimitives";

export function InArticleCTA() {
  return (
    <aside
      className="my-12 p-8 md:p-10"
      style={{
        background: "var(--green-50)",
        border: "1px solid var(--green-100)",
        borderRadius: 20,
      }}
    >
      <BrandEyebrow>שווה לדעת</BrandEyebrow>
      <h3
        className="mt-3 mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
          color: "var(--green-700)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
        }}
      >
        רוצה ליווי אישי בתהליך טיפוח כף הרגל?
      </h3>
      <p className="mb-6 max-w-2xl" style={{ color: "var(--ink-600)", fontSize: 15, lineHeight: 1.7 }}>
        כל מקרה הוא תהליך אישי. אצלי תקבלי בדיקה יסודית, התאמה של תוכנית טיפוח לאורח החיים שלך והנחיות ביתיות מסודרות. ליווי בוואטסאפ לאורך הדרך, בלי הבטחות שווא ובלי קיצורי דרך.
      </p>
      <a
        href="#lead-magnet"
        className="inline-flex h-12 items-center gap-2 px-7"
        style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 15 }}
      >
        לקביעת פגישת ייעוץ
        <span aria-hidden>←</span>
      </a>
    </aside>
  );
}