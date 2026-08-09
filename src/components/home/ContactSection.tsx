import { useState } from "react";
import { SITE } from "@/lib/site-config";

type Audience = "patient" | "pedicurist";

/**
 * סקשן יצירת קשר — הטופס מרכיב הודעת וואטסאפ מהפרטים שהוזנו ופותח שיחה.
 * אין שמירת נתונים בשרת, ולכן אין כאן מסלול דליפה של פרטים אישיים.
 */
export function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState<Audience>("patient");
  const [note, setNote] = useState("");

  const message = [
    "שלום ענבר,",
    audience === "patient"
      ? "אני מטופל/ת ואשמח לתאם אבחון."
      : "אני פדיקוריסטית ואשמח לשמוע על ההכשרות.",
    name ? `שם: ${name}` : "",
    phone ? `טלפון: ${phone}` : "",
    email ? `אימייל: ${email}` : "",
    note ? `פרטים: ${note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const waHref = `${SITE.whatsappUrl}?text=${encodeURIComponent(message)}`;

  const fieldStyle = {
    border: "1.5px solid var(--green-200)",
    borderRadius: 12,
    padding: "14px 18px",
    fontSize: 16,
    outline: "none",
    background: "var(--paper)",
    color: "var(--ink)",
  } as const;

  return (
    <section
      id="contact"
      dir="rtl"
      className="px-6 py-20 md:py-[90px]"
      style={{ background: "linear-gradient(135deg, var(--green-900), var(--green-700))" }}
      aria-labelledby="contact-heading"
    >
      {/* min-w-0 על פריטי הגריד — בלעדיו ה-min-content של שדות ה-input מרחיב את העמודה מעבר למסך */}
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 md:grid-cols-2 md:gap-14 [&>*]:min-w-0">
        <div>
          <h2
            id="contact-heading"
            className="m-0 text-white"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.5rem)", lineHeight: 1.25 }}
          >
            מוכנים לחזור ללכת בלי כאב?
          </h2>
          <p className="mb-8 mt-4 text-[17px] leading-relaxed text-white/80 md:text-[18.5px]">
            השאירו פרטים ואחזור אליכם עוד היום — או שפשוט תתקשרו. מטופלים לקביעת אבחון,
            פדיקוריסטיות לשיחת התאמה על ההכשרה.
          </p>
          <div className="grid gap-3.5">
            <a
              href={SITE.telUrl}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-4 text-white transition-colors hover:bg-white/15"
            >
              <span
                dir="ltr"
                className="text-[20px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                {SITE.phoneDisplay}
              </span>
              <span className="text-[15px] text-white/65">· מעדיפים לדבר בטלפון?</span>
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener nofollow"
              className="flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4 text-white transition-colors"
              style={{ background: "var(--whatsapp)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--whatsapp-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--whatsapp)")}
            >
              <span
                className="text-[18px]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
              >
                וואטסאפ ישיר לענבר
              </span>
              <span className="text-[15px] text-white/85">· מענה מהיר</span>
            </a>
            <p className="m-0 text-[15px] text-white/60">
              הקליניקה: {SITE.city}, {SITE.region} · {SITE.hoursDisplay}
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl bg-surface p-7 md:p-9"
          style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
        >
          <h3 className="m-0 mb-5 text-[21px] text-ink md:text-[23px]">
            השאירו פרטים ואחזור אליכם
          </h3>
          <div className="grid gap-3.5">
            <label className="sr-only" htmlFor="contact-name">שם מלא</label>
            <input
              id="contact-name"
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size={1}
              className="w-full min-w-0"
              style={fieldStyle}
            />
            <div className="flex gap-2.5">
              <label className="sr-only" htmlFor="contact-phone">טלפון</label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="טלפון"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size={1}
                className="min-w-0 flex-1"
                style={fieldStyle}
              />
              <label className="sr-only" htmlFor="contact-email">אימייל</label>
              <input
                id="contact-email"
                type="email"
                placeholder="אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size={1}
                className="min-w-0 flex-1"
                style={fieldStyle}
              />
            </div>
            <fieldset className="m-0 flex flex-wrap gap-2.5 border-0 p-0">
              <legend className="sr-only">מי אני</legend>
              {(
                [
                  { value: "patient", label: "אני מטופל/ת" },
                  { value: "pedicurist", label: "אני פדיקוריסטית" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold transition-colors"
                  style={{
                    border: `1.5px solid ${audience === opt.value ? "var(--primary)" : "var(--green-200)"}`,
                    background: audience === opt.value ? "var(--primary-soft)" : "transparent",
                    color: "var(--ink)",
                  }}
                >
                  <input
                    type="radio"
                    name="audience"
                    value={opt.value}
                    checked={audience === opt.value}
                    onChange={() => setAudience(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </fieldset>
            <label className="sr-only" htmlFor="contact-note">מה מטריד אותך</label>
            <input
              id="contact-note"
              type="text"
              placeholder="מה מטריד אותך? (לא חובה)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              size={1}
              className="w-full min-w-0"
              style={fieldStyle}
            />
            <a
              href={waHref}
              target="_blank"
              rel="noopener nofollow"
              className="btn-cta w-full py-4 text-[17px]"
            >
              שליחה בוואטסאפ ←
            </a>
            <p className="m-0 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
              הפרטים נשלחים ישירות לוואטסאפ של ענבר ואינם נשמרים באתר
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
