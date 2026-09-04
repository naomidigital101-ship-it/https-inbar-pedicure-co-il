/**
 * הרשמה לצ׳קליסט — כותבת ישירות לטבלת leads.
 *
 * העיצוב לפי מערכת המותג של דף הבית: פס כהה, ללא רדיוס וללא צל,
 * שדה עם קו תחתון וכפתור מלבני.
 */

import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BODONI = "'Bodoni Moda',serif";
const CHECKLIST_PDF_URL = "/downloads/checklist-47.pdf";

const LEAD_CSS = `
.iplm input:focus { border-bottom-color:#FFFFFF; }
.iplm-btn:hover:not(:disabled) { background:#FFFFFF; color:#0C2B23; }
`;

function triggerChecklistDownload() {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = CHECKLIST_PDF_URL;
  a.download = "madrich-pedicure-tipuli.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "נא להזין כתובת אימייל" })
  .max(255, { message: "כתובת המייל ארוכה מדי" })
  .email({ message: "כתובת אימייל לא תקינה" });

export function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "כתובת אימייל לא תקינה";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setStatus("loading");
    const sourcePage = typeof window !== "undefined" ? window.location.pathname : null;

    const { error } = await supabase
      .from("leads")
      .insert({ email: parsed.data.toLowerCase(), source_page: sourcePage });

    if (error) {
      // unique violation (already registered) - treat as success for the user
      if (error.code === "23505") {
        triggerChecklistDownload();
        toast.success("הצ׳קליסט יורד כעת");
        navigate({ to: "/thank-you" });
        return;
      }
      setStatus("error");
      const msg = "משהו השתבש, נסו שוב בעוד רגע";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    triggerChecklistDownload();
    toast.success("הצ׳קליסט יורד כעת");
    navigate({ to: "/thank-you" });
  }

  const isLoading = status === "loading";

  return (
    <section
      id="lead-magnet"
      dir="rtl"
      className="iplm flex flex-col items-start justify-between gap-12 md:flex-row md:items-center"
      style={{
        background: "#0C2B23",
        color: "#FFFFFF",
        padding: "90px 6%",
        fontFamily: "'Assistant',sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: LEAD_CSS }} />
      <div style={{ maxWidth: "560px" }}>
        <div
          style={{
            fontFamily: BODONI,
            fontSize: "13px",
            letterSpacing: "0.4em",
            color: "#7E9A8E",
            fontWeight: 400,
            marginBottom: "20px",
            marginLeft: "-0.4em",
          }}
        >
          FREE GUIDE
        </div>
        <h2
          style={{
            fontWeight: 700,
            fontSize: "30px",
            lineHeight: 1.4,
            margin: "0 0 16px",
            color: "#FFFFFF",
          }}
        >
          המדריך לבריאות כף הרגל
        </h2>
        <p
          style={{
            fontSize: "15.5px",
            lineHeight: 2,
            color: "#B9C9C0",
            fontWeight: 300,
            margin: 0,
          }}
        >
          שגרת טיפוח יומיומית, סימני אזהרה שכדאי להכיר, ומתי כדאי לפנות לבדיקה. חינם במייל.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full md:w-auto"
        aria-label="הרשמה לקבלת הצ׳קליסט"
        noValidate
      >
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-end">
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            disabled={isLoading}
            placeholder="your@email.com"
            aria-label="כתובת אימייל"
            aria-invalid={errorMsg ? true : undefined}
            aria-describedby={errorMsg ? "lead-magnet-error" : undefined}
            maxLength={255}
            className="w-full sm:w-80"
            style={{
              border: "none",
              borderBottom: "1px solid #7E9A8E",
              background: "transparent",
              color: "#FFFFFF",
              padding: "12px 2px",
              fontSize: "15.5px",
              fontWeight: 300,
              outline: "none",
              fontFamily: "'Assistant',sans-serif",
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="iplm-btn whitespace-nowrap"
            style={{
              background: "#0E3B2E",
              color: "#FFFFFF",
              border: "1px solid #FFFFFF",
              padding: "16px 40px",
              fontWeight: 400,
              fontSize: "14px",
              letterSpacing: "0.2em",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
              transition: "background 0.2s, color 0.2s",
              fontFamily: "'Assistant',sans-serif",
            }}
          >
            {isLoading ? "שולחת..." : "קבלת הצ׳קליסט"}
          </button>
        </div>
        {errorMsg && (
          <p
            id="lead-magnet-error"
            role="alert"
            style={{ marginTop: "14px", fontSize: "13px", color: "#FFFFFF", fontWeight: 400 }}
          >
            {errorMsg}
          </p>
        )}
      </form>
    </section>
  );
}
