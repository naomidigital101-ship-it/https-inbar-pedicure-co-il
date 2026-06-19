import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { adminExists, bootstrapAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | ענבר פרחי" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!email || !password) {
      toast.error("נא למלא אימייל וסיסמה");
      return;
    }
    setLoading(true);

    if (needsBootstrap) {
      try {
        await bootstrapFn({ data: { email: email.trim().toLowerCase(), password } });
      } catch (err) {
        setLoading(false);
        toast.error(err instanceof Error ? err.message : "שגיאה ביצירת המנהל");
        return;
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error("פרטי התחברות שגויים");
      return;
    }
    toast.success(needsBootstrap ? "המנהל נוצר והתחברת בהצלחה" : "התחברת בהצלחה");
    navigate({ to: "/admin" });
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md border border-[#b8dcd4] bg-[#e9f4f1] p-8">
        <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
          [ SYS // ADMIN ]
        </div>
        <h1 className="mb-6 text-3xl font-black text-[#1d3a35]">
          {needsBootstrap ? "יצירת מנהל ראשון" : "כניסת מנהל"}
        </h1>
        {needsBootstrap && !checking && (
          <p className="mb-4 text-sm text-[#5a4f48]">
            עדיין אין מנהל במערכת. בחר אימייל וסיסמה (לפחות 8 תווים) — המשתמש הראשון שירשם יהפוך אוטומטית למנהל.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5a4f48]"
            >
              אימייל
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full border border-[#b8dcd4] bg-[#fdfbf7] px-4 py-3 font-bold text-[#1d3a35] focus:border-[#5fa898] focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#5a4f48]"
            >
              סיסמה
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full border border-[#b8dcd4] bg-[#fdfbf7] px-4 py-3 font-bold text-[#1d3a35] focus:border-[#5fa898] focus:outline-none disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={loading || checking}
            className="w-full bg-[#5fa898] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#fdfbf7] transition-colors hover:bg-[#ff3a00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "מתחבר..." : needsBootstrap ? "צור מנהל והתחבר" : "התחבר"}
          </button>
        </form>
      </div>
    </div>
  );
}