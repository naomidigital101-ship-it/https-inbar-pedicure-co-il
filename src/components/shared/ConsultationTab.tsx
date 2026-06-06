import { Calendar } from "lucide-react";
import { SITE } from "@/lib/site-config";

/**
 * לשונית CTA צפה — תיאום פגישת ייעוץ.
 * עיגול קבוע בצד שמאל למעלה במסכים גדולים בלבד.
 */
export function ConsultationTab() {
  const message = encodeURIComponent("שלום ענבר, אני מעוניינ/ת לתאם פגישת ייעוץ.");
  return (
    <a
      href={`${SITE.whatsappUrl}?text=${message}`}
      target="_blank"
      rel="noopener"
      aria-label="לתיאום פגישת ייעוץ בוואטסאפ"
      className="group fixed left-5 top-28 z-40 hidden h-20 w-20 flex-col items-center justify-center gap-1 rounded-full bg-primary-deep text-primary-foreground shadow-[var(--shadow-lift)] ring-4 ring-background transition-all duration-300 hover:scale-105 hover:bg-primary lg:flex"
    >
      <Calendar className="h-4 w-4" aria-hidden />
      <span className="text-[10px] font-extrabold leading-tight tracking-wide">לתיאום<br />פגישת<br />ייעוץ</span>
    </a>
  );
}