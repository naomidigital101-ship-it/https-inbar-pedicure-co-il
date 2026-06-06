import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | הרוכב העצלן" },
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("נא למלא אימייל וסיסמה");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) {
      toast.error("פרטי התחברות שגויים");
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#fefaf6] px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md border border-[#d6c5ac] bg-[#f5ede4] p-8">
        <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-[#8b3a52]">
          [ SYS // ADMIN ]
        </div>
        <h1 className="mb-6 text-3xl font-black text-[#2a1f1a]">
          כניסת מנהל
        </h1>
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
              className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-4 py-3 font-bold text-[#2a1f1a] focus:border-[#8b3a52] focus:outline-none disabled:opacity-60"
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
              className="w-full border border-[#d6c5ac] bg-[#fefaf6] px-4 py-3 font-bold text-[#2a1f1a] focus:border-[#8b3a52] focus:outline-none disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b3a52] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#fefaf6] transition-colors hover:bg-[#ff3a00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>
      </div>
    </div>
  );
}