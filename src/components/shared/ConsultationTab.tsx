import { SITE } from "@/lib/site-config";

/**
 * לשונית CTA צפה לתיאום פגישת ייעוץ.
 * מוצגת רק במסכים גדולים, צמודה לצד שמאל למעלה.
 */
export function ConsultationTab() {
  const message = encodeURIComponent("שלום ענבר, אני מעוניינ/ת לתאם פגישת ייעוץ.");
  return (
    <a
      href={`${SITE.whatsappUrl}?text=${message}`}
      target="_blank"
      rel="noopener"
      aria-label="לתיאום פגישת ייעוץ בוואטסאפ"
      className="group fixed top-32 left-0 z-40 hidden items-center gap-2 rounded-l-none rounded-r-2xl bg-primary-deep px-4 py-5 text-center text-[12px] font-extrabold leading-tight tracking-wide text-primary-foreground shadow-[var(--shadow-lift)] transition-all duration-300 hover:bg-primary hover:px-5 lg:flex"
      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
    >
      <span className="whitespace-nowrap">לתיאום פגישת ייעוץ</span>
    </a>
  );
}