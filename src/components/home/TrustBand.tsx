import { ShieldCheck, HeartPulse, GraduationCap, UserCheck } from "lucide-react";

/**
 * פס אמון דק מתחת להירו.
 * אין כאן שמות של גופים חיצוניים כמקור לתוכן — רק מה שנעשה בפועל בקליניקה.
 */
const SIGNALS = [
  { icon: ShieldCheck, label: "סטריליות מלאה וכלים חד־פעמיים" },
  { icon: HeartPulse, label: "התמחות בכף רגל סוכרתית" },
  { icon: UserCheck, label: "טיפול אישי 1:1, בלי שיפוט" },
  { icon: GraduationCap, label: "מרצה ומכשירה פדיקוריסטיות" },
] as const;

export function TrustBand() {
  return (
    <section
      dir="rtl"
      aria-label="אותות אמון מהקליניקה"
      className="border-b border-border bg-background py-7"
    >
      <ul className="mx-auto m-0 grid max-w-[1140px] list-none grid-cols-2 gap-x-6 gap-y-4 px-6 p-0 md:flex md:items-center md:justify-between md:gap-8">
        {SIGNALS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span
              className="text-[13px] font-bold leading-tight md:text-[14px]"
              style={{ color: "var(--ink)" }}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
