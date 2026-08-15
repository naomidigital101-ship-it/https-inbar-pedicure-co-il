import { Calendar } from "lucide-react";
import { useSite, waHref } from "@/lib/use-site";

/**
 * לשונית CTA צפה — תיאום פגישת ייעוץ.
 * עיגול קבוע בצד שמאל למעלה במסכים גדולים בלבד.
 */
export function ConsultationTab() {
  const site = useSite();
  return (
    <a
      href={waHref(site, "שלום ענבר, אני מעוניינ/ת לתאם פגישת ייעוץ.")}
      target="_blank"
      rel="noopener nofollow"
      aria-label="לתיאום פגישת ייעוץ בוואטסאפ"
      /* top-44 ולא top-28 — ההדר גבוה יותר מאז שנוסף פס המידע העליון */
      className="group fixed left-5 top-44 z-40 hidden h-20 w-20 flex-col items-center justify-center gap-1 rounded-full bg-primary-deep text-primary-foreground shadow-[var(--shadow-lift)] ring-4 ring-background transition-all duration-300 hover:scale-105 hover:bg-primary lg:flex"
    >
      <Calendar className="h-4 w-4" aria-hidden />
      <span className="text-[10px] font-extrabold leading-tight tracking-wide">
        לתיאום
        <br />
        פגישת
        <br />
        ייעוץ
      </span>
    </a>
  );
}
