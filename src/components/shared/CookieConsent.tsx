import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "lr_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="הודעת קוקיז"
      dir="rtl"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl md:inset-x-auto md:right-6 md:left-6"
      style={{
        background: "color-mix(in oklab, var(--paper) 96%, transparent)",
        backdropFilter: "saturate(140%) blur(10px)",
        border: "1px solid var(--stone-100)",
        borderRadius: 18,
        boxShadow:
          "0 1px 0 rgb(255 255 255 / 0.6) inset, 0 24px 48px -20px rgb(30 36 34 / 0.28)",
      }}
    >
      {/* Gold hairline accent — מותג */}
      <div
        aria-hidden
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--accent-gold) 30%, var(--accent-gold) 70%, transparent 100%)",
          opacity: 0.6,
        }}
      />
      <button
        type="button"
        onClick={accept}
        aria-label="סגירה"
        className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors"
        style={{ color: "var(--ink-600)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--stone-50)";
          e.currentTarget.style.color = "var(--ink-900)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--ink-600)";
        }}
      >
        <X className="h-4 w-4" strokeWidth={1.6} aria-hidden />
      </button>
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-5 md:p-6">
        <span
          aria-hidden
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full md:flex"
          style={{
            background: "var(--green-100, #E6F0EC)",
            color: "var(--green-700)",
          }}
        >
          <Cookie className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <div className="flex-1">
          <p
            className="text-[11px] font-medium tracking-[0.18em]"
            style={{ color: "var(--green-700)" }}
          >
            פרטיות באתר ענבר פרחי
          </p>
          <p
            className="mt-1.5 text-[0.92rem] leading-relaxed"
            style={{ color: "var(--ink-900)" }}
          >
            האתר משתמש בקוקיז כדי לשפר את חוויית הגלישה ולנתח שימוש. בהמשך
            השימוש באתר, את/ה מסכים/ה ל
            <Link
              to="/privacy"
              className="mx-1 underline underline-offset-4 transition-colors"
              style={{ color: "var(--green-700)" }}
            >
              מדיניות הפרטיות
            </Link>
            שלנו.
          </p>
        </div>
        <button
          type="button"
          onClick={accept}
          className="group relative inline-flex h-11 shrink-0 items-center justify-center gap-2 px-6 text-[0.88rem] font-medium transition-all"
          style={{
            background: "var(--green-700)",
            color: "var(--paper)",
            borderRadius: 999,
            boxShadow:
              "0 1px 0 rgb(255 255 255 / 0.15) inset, 0 8px 20px -12px rgb(79 140 123 / 0.55)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--green-800)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--green-700)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          aria-label="אישור שימוש בקוקיז"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent-gold)" }}
          />
          הבנתי, תודה
        </button>
      </div>
    </div>
  );
}