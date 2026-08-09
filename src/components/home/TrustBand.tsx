const STANDARDS = ["איכילוב", "משרד הבריאות", "אגודת אייל", "NHS", "AAD"] as const;

/**
 * פס תקנים דק מתחת להירו. הנתונים המספריים מוצגים בפס הזכוכית שבתוך ההירו.
 */
export function TrustBand() {
  return (
    <section
      dir="rtl"
      aria-label="תקנים ופרוטוקולים מקצועיים"
      className="border-b border-border bg-background py-6"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-3 px-6 md:flex-row md:justify-center md:gap-6">
        <span
          className="text-[10.5px] font-bold uppercase"
          style={{ letterSpacing: "0.22em", color: "var(--text-muted)" }}
        >
          פרוטוקולים מבוססים על
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-x-4">
          {STANDARDS.map((s, i) => (
            <span key={s} className="flex items-center gap-3 md:gap-4">
              <span className="text-[12.5px] font-bold" style={{ color: "var(--ink)" }}>
                {s}
              </span>
              {i < STANDARDS.length - 1 && (
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full"
                  style={{ background: "var(--accent-gold)" }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
