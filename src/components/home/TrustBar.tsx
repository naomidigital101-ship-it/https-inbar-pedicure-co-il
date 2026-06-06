export function TrustBar() {
  return (
    <section className="border-b border-border bg-background" aria-label="עקרונות העריכה">
      <div className="container mx-auto px-6 py-10 sm:py-14">
        <p className="mx-auto max-w-3xl text-center font-heading text-2xl font-normal italic leading-relaxed text-foreground sm:text-3xl">
          ”אין כאן רשימות AI ולא הבטחות שיווקיות. כל מדריך נכתב בידי מכונאי,
          נבדק בשטח, ומתעדכן כשהמציאות משתנה.“
        </p>
        <div className="mt-8 grid grid-cols-2 gap-y-4 border-t border-border pt-6 text-center sm:grid-cols-4">
          {[
            { n: "146", l: "מדריכים פעילים" },
            { n: "12", l: "מכונאים בצוות" },
            { n: "9,400+", l: "רוכבים בקהילה" },
            { n: "שבועי", l: "תדירות עדכון" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center gap-1">
              <div className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {s.n}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-ink-soft">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
