/**
 * טופס פנייה — נכתב ישירות לטבלת leads תחת מדיניות RLS ציבורית.
 *
 * המדיניות בדאטאבייס דורשת אימייל תקין או טלפון, ולא מאפשרת להזריק
 * סטטוס או הערות מהדפדפן. כלומר הוולידציה כאן היא לנוחות המשתמשת,
 * והאכיפה האמיתית היא בשרת.
 *
 * העיצוב לפי מערכת המותג של דף הבית: שדות ללא מסגרת וללא רדיוס —
 * קו תחתון בלבד — וכפתור שליחה מלבני בירוק העמוק.
 */

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const BODONI = "'Bodoni Moda',serif";

const FORM_CSS = `
.ipf input:focus, .ipf textarea:focus { border-bottom-color:#0E3B2E; }
.ipf-submit:hover:not(:disabled) { background:#141414; }
`;

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
    message: "צריך טלפון או אימייל כדי שאוכל לחזור אליכם",
    path: ["phone"],
  });

export function ContactForm({
  serviceSlug,
  title = "השאירו פרטים ואחזור אליכם",
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
    toast.success("הפרטים התקבלו, אחזור אליכם בהקדם");
  }

  if (sent) {
    return (
      <div
        dir="rtl"
        className="ipf px-6 py-10 text-center"
        style={{ background: "#F7F5F1", border: "1px solid #ECEAE6" }}
      >
        <div
          style={{
            fontFamily: BODONI,
            fontSize: "13px",
            letterSpacing: "0.4em",
            marginLeft: "-0.4em",
            color: "#6B6B6B",
            marginBottom: "14px",
          }}
        >
          RECEIVED
        </div>
        <p style={{ fontWeight: 700, fontSize: "19px", color: "#141414", margin: 0 }}>
          תודה, קיבלתי את הפרטים
        </p>
        <p
          style={{
            marginTop: "10px",
            fontSize: "14.5px",
            fontWeight: 300,
            color: "#6B6B6B",
            lineHeight: 1.9,
          }}
        >
          אחזור אליכם בהקדם. אם זה דחוף — אפשר גם בוואטסאפ.
        </p>
      </div>
    );
  }

  const field: React.CSSProperties = {
    border: "none",
    borderBottom: "1px solid #8F8474",
    background: "transparent",
    color: "#141414",
    width: "100%",
    padding: "12px 2px",
    fontSize: "15.5px",
    fontWeight: 300,
    outline: "none",
    textAlign: "right",
    fontFamily: "'Assistant',sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "2px",
    fontSize: "12px",
    letterSpacing: "0.16em",
    fontWeight: 400,
    color: "#6B6B6B",
  };

  return (
    <form dir="rtl" onSubmit={handleSubmit} noValidate className="ipf text-right">
      <style dangerouslySetInnerHTML={{ __html: FORM_CSS }} />
      <div
        style={{
          fontFamily: BODONI,
          fontSize: "13px",
          letterSpacing: "0.4em",
          marginLeft: "-0.4em",
          color: "#6B6B6B",
          marginBottom: "12px",
        }}
      >
        GET IN TOUCH
      </div>
      <p style={{ fontWeight: 700, fontSize: "21px", color: "#141414", margin: "0 0 8px" }}>
        {title}
      </p>
      {note ? (
        <p
          style={{
            fontSize: "14px",
            fontWeight: 300,
            color: "#6B6B6B",
            lineHeight: 1.85,
            margin: "0 0 26px",
          }}
        >
          {note}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2" style={{ marginTop: note ? 0 : "26px" }}>
        <div>
          <label htmlFor="cf-name" style={labelStyle}>
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
          <label htmlFor="cf-phone" style={labelStyle}>
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

      <div style={{ marginTop: "24px" }}>
        <label htmlFor="cf-email" style={labelStyle}>
          אימייל (לא חובה)
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

      <div style={{ marginTop: "24px" }}>
        <label htmlFor="cf-message" style={labelStyle}>
          מה מטריד אתכם? (לא חובה)
        </label>
        <textarea
          id="cf-message"
          rows={3}
          style={{ ...field, resize: "vertical" }}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="ipf-submit mt-8 w-full md:w-auto"
        style={{
          background: "#0E3B2E",
          color: "#FFFFFF",
          border: "none",
          padding: "17px 48px",
          fontWeight: 400,
          fontSize: "14px",
          letterSpacing: "0.2em",
          cursor: sending ? "not-allowed" : "pointer",
          opacity: sending ? 0.6 : 1,
          transition: "background 0.2s",
        }}
      >
        {sending ? "שולחת..." : "שליחה"}
      </button>

      <p
        style={{
          marginTop: "18px",
          fontSize: "12.5px",
          fontWeight: 300,
          color: "#6B6B6B",
          letterSpacing: "0.04em",
        }}
      >
        הפרטים נשמרים אצלי בלבד ומשמשים ליצירת קשר איתכם.
      </p>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{ marginTop: "8px", fontSize: "12.5px", color: "#B4231C", fontWeight: 400 }}
      role="alert"
    >
      {children}
    </p>
  );
}
