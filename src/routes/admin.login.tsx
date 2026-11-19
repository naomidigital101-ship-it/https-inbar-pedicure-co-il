import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink, Eye, EyeOff, LockKeyhole, Loader2 } from "lucide-react";
import { adminExists, bootstrapAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login | ענבר פרחי" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [checking, setChecking] = useState(true);

  const adminExistsFn = useServerFn(adminExists);
  const bootstrapFn = useServerFn(bootstrapAdmin);

  useEffect(() => {
    let cancelled = false;
    adminExistsFn()
      .then((res) => {
        if (!cancelled) setNeedsBootstrap(!res.exists);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [adminExistsFn]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("כדי להתחבר, מלאי אימייל וסיסמה.");
      return;
    }
    setLoading(true);

    if (needsBootstrap) {
      try {
        await bootstrapFn({ data: { email: email.trim().toLowerCase(), password } });
      } catch (err) {
        setLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "לא הצלחנו ליצור את חשבון המנהלת.");
        return;
      }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setErrorMessage(
          error.code === "invalid_credentials"
            ? "האימייל או הסיסמה אינם נכונים. בדקי את הפרטים ונסי שוב."
            : error.status === 429
              ? "בוצעו כמה ניסיונות התחברות. המתיני מעט ונסי שוב."
              : "לא הצלחנו להתחבר כרגע. נסי שוב בעוד רגע.",
        );
        return;
      }
      toast.success(needsBootstrap ? "המנהל נוצר והתחברת בהצלחה" : "התחברת בהצלחה");
      navigate({ to: "/admin" });
    } catch {
      setErrorMessage("לא הצלחנו ליצור קשר עם שירות ההתחברות. בדקי את החיבור ונסי שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-theme admin-login" dir="rtl">
      <main data-admin className="admin-login-form" id="main-content" tabIndex={-1}>
        <div className="admin-login-inner">
          <img
            className="admin-login-logo"
            src="/performance/inbar-logo-600.webp"
            width={600}
            height={200}
            alt="ענבר פרחי"
          />
          <p className="admin-eyebrow">מרחב הניהול של ענבר</p>
          <h1>{needsBootstrap ? "יצירת מנהלת ראשונה" : "טוב שחזרת."}</h1>
          <p className="admin-login-lede">היכנסי כדי לנהל את התוכן והפניות באתר.</p>
          {needsBootstrap && !checking && (
            <p className="admin-login-notice">
              עדיין אין מנהלת במערכת. בחרי אימייל וסיסמה עם לפחות שמונה תווים. החשבון הראשון יקבל
              הרשאת ניהול.
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={errorMessage ? "login-error" : undefined}
          >
            <div className="admin-login-field">
              <label htmlFor="email">אימייל</label>
              <input
                id="email"
                type="email"
                dir="ltr"
                required
                autoComplete="username"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
              />
            </div>
            <div className="admin-login-field">
              <label htmlFor="password">סיסמה</label>
              <div className="admin-password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  required
                  autoComplete="current-password"
                  placeholder="הסיסמה שלך"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "הסתרת הסיסמה" : "הצגת הסיסמה"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>
            {errorMessage && (
              <p id="login-error" role="alert" className="admin-login-error">
                {errorMessage}
              </p>
            )}
            <button type="submit" className="admin-login-submit" disabled={loading || checking}>
              {loading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : null}
              {checking
                ? "בודקת את שירות ההתחברות..."
                : loading
                  ? "מתחברת..."
                  : needsBootstrap
                    ? "יצירת חשבון וכניסה"
                    : "כניסה למערכת"}
              {!loading && !checking && <ArrowLeft size={18} aria-hidden />}
            </button>
          </form>
          <p className="admin-login-security">
            <LockKeyhole size={15} aria-hidden />
            כניסה לבעלות הרשאה בלבד
          </p>
        </div>
        <a className="admin-login-back" href="/">
          <ExternalLink size={16} aria-hidden />
          חזרה לאתר
        </a>
      </main>
      <section className="admin-login-brand" aria-label="ענבר פרחי">
        <div>
          <p className="admin-login-wordmark" dir="ltr">
            INBAR FARCHI
          </p>
          <h2>
            ניהול האתר של
            <br />
            ענבר פרחי.
          </h2>
          <p className="admin-login-brand-text">
            כל התוכן, התמונות והפניות נמצאים כאן, כדי שתוכלי לעדכן את האתר בצורה פשוטה וברורה.
          </p>
        </div>
        <div>
          <div className="admin-login-photo">
            <img
              src="/performance/inbar-hero-960-eyal.webp"
              alt="ענבר בקליניקה, מתוך תמונת האתר"
              width={960}
              height={432}
            />
          </div>
          <p className="admin-login-caption">פדיקור טיפולי · הכשרות מקצועיות</p>
        </div>
      </section>
    </div>
  );
}
