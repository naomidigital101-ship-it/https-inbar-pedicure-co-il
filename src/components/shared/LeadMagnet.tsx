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
  a.download = "checklist-47-dirt-road-guide.pdf";
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
      className="flex flex-col items-start justify-between gap-8 border-t border-[#fefaf6] bg-[#8b3a52] p-8 md:flex-row md:items-center md:p-12"
    >
      <div>
        <h2 className="mb-2 text-3xl font-black leading-tight text-white md:text-5xl">
          47 בדיקות לפני יציאה לשטח
        </h2>
        <p className="text-base font-bold text-white/80 md:text-lg">
          הצ׳קליסט שכל מכונאי שומר לעצמו. חינם במייל.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 md:w-auto"
        aria-label="הרשמה לקבלת הצ׳קליסט"
        noValidate
      >
        <div className="flex w-full">
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
            className="w-full border-2 border-transparent bg-[#fefaf6] px-6 py-4 font-bold text-white placeholder:text-[#6b5f55] focus:outline-none focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60 md:w-80"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="whitespace-nowrap bg-white px-8 py-4 font-black uppercase text-[#8b3a52] transition-colors hover:bg-[#2a1f1a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "שולח..." : "קבל צ׳קליסט"}
          </button>
        </div>
        {errorMsg && (
          <p
            id="lead-magnet-error"
            role="alert"
            className="text-xs font-bold text-white"
          >
            {errorMsg}
          </p>
        )}
      </form>
    </section>
  );
}