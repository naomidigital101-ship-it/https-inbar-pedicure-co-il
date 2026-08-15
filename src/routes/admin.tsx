/**
 * מעטפת אזור הניהול — שער הרשאות אחד וניווט צדדי לכל עמודי האדמין.
 * עמוד ההתחברות נשאר בלי המעטפת, אחרת היה נוצר לולאת הפניה.
 */

import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Stethoscope,
  Home,
  Building2,
  Star,
  Images,
  Newspaper,
  FolderTree,
  Image,
  Inbox,
  Wrench,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "לוח בקרה", icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "טיפולים", icon: Stethoscope },
  { to: "/admin/homepage", label: "דף הבית", icon: Home },
  { to: "/admin/business", label: "פרטי העסק", icon: Building2 },
  { to: "/admin/reviews", label: "המלצות", icon: Star },
  { to: "/admin/gallery", label: "לפני / אחרי", icon: Images },
  { to: "/admin/leads", label: "פניות", icon: Inbox },
  { to: "/admin/content", label: "מאמרים", icon: Newspaper },
  { to: "/admin/categories", label: "קטגוריות ידע", icon: FolderTree },
  { to: "/admin/media", label: "תמונות", icon: Image },
  { to: "/admin/tools", label: "כלים מתקדמים", icon: Wrench },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname.startsWith("/admin/login");

  const [authState, setAuthState] = useState<"checking" | "ready" | "blocked">(
    "checking",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdminFn = useServerFn(checkIsAdmin);

  useEffect(() => {
    if (isLogin) return;
    let cancelled = false;

    const verify = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (cancelled) return;
      if (error || !data.user) {
        setAuthState("blocked");
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const res = await isAdminFn();
        if (cancelled) return;
        if (!res.isAdmin) {
          setAuthState("blocked");
          toast.error("אין לך הרשאות ניהול");
          await supabase.auth.signOut();
          navigate({ to: "/" });
          return;
        }
        setAuthState("ready");
      } catch {
        if (cancelled) return;
        setAuthState("blocked");
        navigate({ to: "/admin/login" });
      }
    };

    verify();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/admin/login" });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [isAdminFn, navigate, isLogin]);

  // ההתחברות מוצגת כמו שהיא — בלי סרגל צד ובלי בדיקת הרשאות
  if (isLogin) return <Outlet />;

  if (authState !== "ready") {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--surface-warm)" }}
        dir="rtl"
      >
        <p className="text-[14px]" style={{ color: "var(--ink-600)" }}>
          בודקת הרשאות...
        </p>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="ניווט ניהול">
      <div className="px-5 py-6">
        <p
          className="text-[11px]"
          style={{ color: "var(--green-400)", letterSpacing: "0.18em", fontWeight: 700 }}
        >
          ניהול האתר
        </p>
        <p
          className="mt-1 text-[19px] text-white"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
        >
          ענבר פרחי
        </p>
      </div>

      <ul className="flex-1 space-y-0.5 px-3 pb-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, item.exact);
          return (
            <li key={item.to}>
              <Link
                // הניווט מוגדר כטבלת נתונים; הנתיבים עצמם מאומתים ע"י
                // routeTree.gen.ts בזמן הבנייה.
                to={item.to as "/admin"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-[14.5px] transition-colors"
                style={{
                  borderRadius: 10,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : "rgba(255,255,255,0.72)",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                }}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.75} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-1 px-3 pb-5">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 px-3 py-2.5 text-[14px]"
          style={{ borderRadius: 10, color: "rgba(255,255,255,0.72)", fontWeight: 500 }}
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          צפייה באתר
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-[14px]"
          style={{ borderRadius: 10, color: "rgba(255,255,255,0.72)", fontWeight: 500 }}
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          יציאה
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-warm)" }} dir="rtl">
      {/* סרגל עליון — מובייל בלבד */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden"
        style={{ background: "var(--green-900)" }}
      >
        <span
          className="text-[16px] text-white"
          style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
        >
          ניהול האתר
        </span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "סגירת התפריט" : "פתיחת התפריט"}
          aria-expanded={menuOpen}
          className="inline-flex h-9 w-9 items-center justify-center text-white"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {menuOpen && (
        <div className="md:hidden" style={{ background: "var(--green-900)" }}>
          {sidebar}
        </div>
      )}

      <div className="flex">
        <aside
          className="sticky top-0 hidden h-screen w-[248px] flex-shrink-0 md:block"
          style={{ background: "var(--green-900)" }}
        >
          {sidebar}
        </aside>

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
          <div className="mx-auto max-w-[1120px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
