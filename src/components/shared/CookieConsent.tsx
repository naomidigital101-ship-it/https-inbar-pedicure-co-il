import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

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
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl border-2 border-[#5fa898] bg-[#faf3eb] p-4 shadow-2xl md:inset-x-auto md:right-4 md:left-4"
      dir="rtl"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-bold leading-relaxed text-[#1d3a35]">
          האתר משתמש בקוקיז כדי לשפר את חוויית הגלישה ולנתח שימוש. בהמשך השימוש
          באתר, את/ה מסכים/ה ל
          <Link
            to="/privacy"
            className="mx-1 text-[#5fa898] underline underline-offset-2 hover:text-[#ff7a4d]"
          >
            מדיניות הפרטיות
          </Link>
          שלנו.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 select-none border-2 border-[#5fa898] bg-[#5fa898] px-5 py-2 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#c52800]"
          aria-label="אישור שימוש בקוקיז"
        >
          הבנתי
        </button>
      </div>
    </div>
  );
}