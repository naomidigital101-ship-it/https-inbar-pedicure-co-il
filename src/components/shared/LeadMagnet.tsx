import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHECKLIST_PDF_URL = "/downloads/checklist-47.pdf";

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
    const sourcePage =
      typeof window !== "undefined" ? window.location.pathname : null;

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
      const msg = "משהו השתבש, נסה שוב בעוד רגע";
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
      className="flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center md:p-12"
      style={{ background: "var(--green-700)", color: "var(--paper)" }}
    >
      <div>
        <span
          className="block mb-3"
          style={{ fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--green-200)", fontWeight: 600 }}
        >
          הצ׳קליסט החינמי
        </span>
        <h2
          className="mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "var(--paper)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          המדריך לבריאות כף הרגל
        </h2>
        <p style={{ color: "color-mix(in oklab, var(--paper) 80%, transparent)", fontSize: 15.5, lineHeight: 1.65 }}>
          טיפים יומיומיים, סימני אזהרה ושגרת טיפוח שכל פדיקוריסטית טיפולית ממליצה. חינם במייל.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 md:w-auto"
        aria-label="הרשמה לקבלת הצ׳קליסט"
        noValidate
      >
        <div className="flex w-full overflow-hidden" style={{ borderRadius: 999 }}>
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
            className="w-full px-6 py-4 focus:outline-none disabled:opacity-60 md:w-80"
            style={{ background: "var(--paper)", color: "var(--ink-900)", fontSize: 15 }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="whitespace-nowrap px-8 py-4 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--ink-900)", color: "var(--paper)", fontWeight: 700, fontSize: 14 }}
          >
            {isLoading ? "שולח..." : "קבלת הצ׳קליסט"}
          </button>
        </div>
        {errorMsg && (
          <p
            id="lead-magnet-error"
            role="alert"
            style={{ fontSize: 12, color: "var(--paper)", fontWeight: 600 }}
          >
            {errorMsg}
          </p>
        )}
      </form>
    </section>
  );
}