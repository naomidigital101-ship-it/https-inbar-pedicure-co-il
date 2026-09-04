import { C, TrackedLabel, SOLID_BUTTON } from "./editorial";

export function InArticleCTA() {
  return (
    <aside
      className="my-14 px-8 py-12 text-center md:px-12"
      style={{ background: C.cream, border: `1px solid ${C.line}` }}
    >
      <TrackedLabel className="mb-5">מהקליניקה</TrackedLabel>
      <h3
        className="mb-4"
        style={{
          fontWeight: 700,
          fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)",
          color: C.ink,
          lineHeight: 1.5,
        }}
      >
        רוצים שנבדוק את כף הרגל שלכם לעומק?
      </h3>
      <p
        className="mx-auto mb-9 max-w-[560px]"
        style={{ color: C.muted, fontSize: 15.5, lineHeight: 2, fontWeight: 300 }}
      >
        כל מקרה מתחיל באבחון. בקליניקה בעלי אני בודקת את מבנה כף הרגל, ההנעלה ותבנית ההליכה, בונה
        תוכנית טיפול מותאמת ומעבירה הנחיות ביתיות מסודרות, עם ליווי בוואטסאפ לאורך הדרך.
      </p>
      <a href="#lead-magnet" className="transition-colors hover:bg-[#141414]" style={SOLID_BUTTON}>
        לתיאום אבחון
      </a>
    </aside>
  );
}
