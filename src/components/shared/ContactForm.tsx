/**
 * טופס פנייה — נכתב ישירות לטבלת leads תחת מדיניות RLS ציבורית.
 *
 * המדיניות בדאטאבייס דורשת אימייל תקין או טלפון, ולא מאפשרת להזריק
 * סטטוס או הערות מהדפדפן. כלומר הוולידציה כאן היא לנוחות המשתמשת,
 * והאכיפה האמיתית היא בשרת.
 */

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const Schema = z
  .object({
    name: z.string().trim().min(2, "נא למלא שם").max(120),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{9,20}$/, "מספר טלפון לא תקין")
      .or(z.literal("")),
    email: z.string().trim().email("כתובת אימייל לא תקינה").or(z.literal("")),
    message: z.string().trim().max(2000).optional(),
  })
  .refine((v) => v.phone !== "" || v.email !== "", {
    message: "צריך טלפון או אימייל כדי שאוכל לחזור אליך",
    path: ["phone"],
  });

export function ContactForm({
  serviceSlug,
  title = "השאירי פרטים ואחזור אלייך",
  note,
}: {
  serviceSlug?: string;
  title?: string;
  note?: string;
}) {
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values, v: string) => setValues({ ...values, [k]: v });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = Schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSending(true);

    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email ? parsed.data.email.toLowerCase() : null,
      message: parsed.data.message || null,
      service_slug: serviceSlug ?? null,
      source_page: typeof window !== "undefined" ? window.location.pathname : null,
      status: "new",
    });

    setSending(false);
    if (error) {
      toast.error("השליחה נכשלה. אפשר לנסות שוב או לפנות בוואטסאפ.");
      return;
    }
    setSent(true);
    toast.success("הפרטים התקבלו, אחזור אלייך בהקדם");
  }

  if (sent) {
    return (
      <div
        dir="rtl"
        className="px-6 py-8 text-center"
        style={{ background: "var(--surface-soft)", borderRadius: 16 }}
      >
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink-900)" }}>
          תודה, קיבלתי את הפרטים
        </p>
        <p className="mt-1.5 text-[14.5px]" style={{ color: "var(--text-muted)" }}>
          אחזור אלייך בהקדם. אם זה דחוף — אפשר גם בוואטסאפ.
        </p>
      </div>
    );
  }

  const field: React.CSSProperties = {
    border: "1px solid var(--stone-300)",
    borderRadius: 10,
    background: "var(--paper)",
    color: "var(--ink-900)",
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    textAlign: "right",
  };

  return (
    <form dir="rtl" onSubmit={handleSubmit} noValidate className="text-right">
      <p
        className="mb-1.5 text-[19px]"
        style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink-900)" }}
      >
        {title}
      </p>
      {note && (
        <p className="mb-4 text-[14px]" style={{ color: "var(--text-muted)" }}>
          {note}
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1 block text-[13.5px]" style={{ fontWeight: 600 }}>
            שם
          </label>
          <input
            id="cf-name"
            style={field}
            value={values.name}
            autoComplete="name"
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1 block text-[13.5px]" style={{ fontWeight: 600 }}>
            טלפון
          </label>
          <input
            id="cf-phone"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            style={{ ...field, textAlign: "left" }}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="cf-email" className="mb-1 block text-[13.5px]" style={{ fontWeight: 600 }}>
          אימייל <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(לא חובה)</span>
        </label>
        <input
          id="cf-email"
          type="email"
          dir="ltr"
          autoComplete="email"
          style={{ ...field, textAlign: "left" }}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </div>

      <div className="mt-3">
        <label htmlFor="cf-message" className="mb-1 block text-[13.5px]" style={{ fontWeight: 600 }}>
          מה מטריד אותך? <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(לא חובה)</span>
        </label>
        <textarea
          id="cf-message"
          rows={3}
          style={{ ...field, resize: "vertical" }}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      <button type="submit" disabled={sending} className="btn-cta mt-4 w-full md:w-auto">
        {sending ? "שולחת..." : "שליחה"}
      </button>

      <p className="mt-3 text-[12.5px]" style={{ color: "var(--text-muted)" }}>
        הפרטים נשמרים אצלי בלבד ומשמשים ליצירת קשר איתך.
      </p>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[12.5px]" style={{ color: "#B4231C", fontWeight: 600 }} role="alert">
      {children}
    </p>
  );
}
