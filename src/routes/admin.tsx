/**
 * מעטפת אזור הניהול — שער הרשאות אחד וניווט צדדי לכל עמודי האדמין.
 * עמוד ההתחברות נשאר בלי המעטפת, אחרת היה נוצר לולאת הפניה.
 */

import { createFileRoute, Outlet, useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  CalendarDays,
  Wrench,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin.functions";
import { Toaster } from "@/components/ui/sonner";
import "@/components/admin/admin-theme.css";

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
  { to: "/admin/clinic", label: "ניהול הקליניקה", icon: CalendarDays },
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

  const [authState, setAuthState] = useState<"checking" | "ready" | "blocked">("checking");
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdminFn = useServerFn(checkIsAdmin);
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])") ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [menuOpen]);

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
  if (isLogin)
    return (
      <>
        <Outlet />
        <Toaster dir="rtl" position="top-center" />
      </>
    );

  if (authState !== "ready") {
    return (
      <div className="admin-theme admin-checking" dir="rtl">
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

  const groups = [
    { label: "", routes: ["/admin"] },
    { label: "עבודה שוטפת", routes: ["/admin/clinic", "/admin/leads"] },
    {
      label: "האתר והתוכן",
      routes: [
        "/admin/services",
        "/admin/homepage",
        "/admin/content",
        "/admin/categories",
        "/admin/reviews",
        "/admin/gallery",
        "/admin/media",
      ],
    },
    { label: "הגדרות", routes: ["/admin/business", "/admin/tools"] },
  ];
  const activeLabel = NAV.find((item) => isActive(item.to, item.exact))?.label ?? "ניהול האתר";

  return (
    <div className={`admin-theme admin-shell${menuOpen ? " is-menu-open" : ""}`} dir="rtl">
      <button
        className="admin-menu-shade"
        aria-label="סגירת תפריט הניהול"
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        ref={drawerRef}
        id="admin-navigation"
        className="admin-sidebar"
        role={menuOpen ? "dialog" : undefined}
        aria-modal={menuOpen || undefined}
        aria-label="ניווט ניהול"
      >
        <div className="admin-sidebar-brand">
          <img src="/performance/inbar-logo-600.webp" width={600} height={200} alt="ענבר פרחי" />
          <p>ניהול האתר והתוכן</p>
          <button
            className="admin-drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="סגירת התפריט"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="admin-navigation" aria-label="מסכי הניהול">
          {groups.map((group, index) => (
            <div key={index}>
              {group.label && <p className="admin-nav-group">{group.label}</p>}
              {group.routes.map((to) => {
                const item = NAV.find((entry) => entry.to === to)!;
                const Icon = item.icon;
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={to}
                    to={item.to as "/admin"}
                    onClick={() => setMenuOpen(false)}
                    className={`admin-nav-link${active ? " is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={19} strokeWidth={1.65} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a className="admin-nav-link" href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={18} aria-hidden />
            צפייה באתר
          </a>
          <button className="admin-nav-link" onClick={handleLogout}>
            <LogOut size={18} aria-hidden />
            יציאה מהמערכת
          </button>
          <div className="admin-account">
            <span className="admin-avatar" aria-hidden>
              ע
            </span>
            <div>
              ענבר פרחי<small>ניהול האתר</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="admin-workspace">
        <Toaster dir="rtl" position="top-center" />
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <button
              ref={menuButtonRef}
              className="admin-menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="פתיחת תפריט הניהול"
              aria-expanded={menuOpen}
              aria-controls="admin-navigation"
            >
              <Menu size={21} />
            </button>
            <span>סביבת ניהול</span>
            <span aria-hidden>/</span>
            <strong>{activeLabel}</strong>
          </div>
          <div className="admin-topbar-actions">
            <a href="/" target="_blank" rel="noopener noreferrer">
              פתיחת האתר
              <ExternalLink size={16} aria-hidden />
            </a>
            <span className="admin-avatar" aria-hidden>
              ע
            </span>
          </div>
        </header>
        <main data-admin id="main-content" className="admin-main" tabIndex={-1}>
          <div className="admin-page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
