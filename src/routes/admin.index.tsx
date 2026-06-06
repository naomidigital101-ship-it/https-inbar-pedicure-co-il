import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getLeads, type LeadRow } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | הרוכב העצלן" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<
    "checking" | "unauthenticated" | "not-admin" | "ready"
  >("checking");

  const isAdminFn = useServerFn(checkIsAdmin);
  const getLeadsFn = useServerFn(getLeads);

  // Gate: check session client-side, then verify admin role via server fn.
  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (cancelled) return;
      if (error || !userData.user) {
        setAuthState("unauthenticated");
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const result = await isAdminFn();
        if (cancelled) return;
        if (!result.isAdmin) {
          setAuthState("not-admin");
          toast.error("אין לך הרשאות מנהל");
          await supabase.auth.signOut();
          navigate({ to: "/" });
          return;
        }
        setAuthState("ready");
      } catch {
        if (cancelled) return;
        setAuthState("unauthenticated");
        navigate({ to: "/admin/login" });
      }
    };

    verify();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        if (!session) navigate({ to: "/admin/login" });
      },
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [isAdminFn, navigate]);

  const leadsQuery = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: () => getLeadsFn(),
    enabled: authState === "ready",
  });

  if (authState !== "ready") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <p className="text-sm font-bold text-[#a0a0a0]">בודק הרשאות...</p>
      </div>
    );
  }

  const leads = leadsQuery.data?.leads ?? [];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const handleExportCSV = () => {
    const header = ["email", "source_page", "created_at"];
    const rows = leads.map((l: LeadRow) =>
      [
        escapeCSV(l.email),
        escapeCSV(l.source_page ?? ""),
        escapeCSV(l.created_at),
      ].join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]" dir="rtl">
      <header className="border-b border-[#222] bg-[#111]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
              [ SYS // ADMIN ]
            </span>
            <h1 className="text-lg font-black text-[#f0f0f0]">
              ניהול לידים
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="border border-[#222] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#999] transition-colors hover:border-[#e63000] hover:text-[#e63000]"
          >
            התנתק
          </button>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#909090]">
              סה״כ לידים
            </p>
            <p className="text-3xl font-black text-[#f0f0f0]">{leads.length}</p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={leads.length === 0}
            className="bg-[#e63000] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#0a0a0a] transition-colors hover:bg-[#ff3a00] disabled:cursor-not-allowed disabled:opacity-60"
          >
            ייצוא ל-CSV
          </button>
        </div>

        {leadsQuery.isLoading && (
          <p className="text-sm font-bold text-[#a0a0a0]">טוען...</p>
        )}
        {leadsQuery.isError && (
          <p className="text-sm font-bold text-[#e63000]">
            שגיאה בטעינת הלידים
          </p>
        )}

        {leadsQuery.data && (
          <div className="overflow-x-auto border border-[#222]">
            <table className="w-full text-right">
              <thead className="bg-[#111] text-[10px] font-black uppercase tracking-wider text-[#999]">
                <tr>
                  <th className="px-4 py-3">אימייל</th>
                  <th className="px-4 py-3">מקור</th>
                  <th className="px-4 py-3">תאריך</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm font-bold text-[#a0a0a0]"
                    >
                      עדיין אין לידים
                    </td>
                  </tr>
                ) : (
                  leads.map((l: LeadRow) => (
                    <tr
                      key={l.id}
                      className="border-t border-[#222] text-sm font-bold text-[#ccc]"
                    >
                      <td className="px-4 py-3" dir="ltr">
                        {l.email}
                      </td>
                      <td className="px-4 py-3 text-[#a0a0a0]">
                        {l.source_page ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-[#a0a0a0]">
                        {new Date(l.created_at).toLocaleString("he-IL")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function escapeCSV(value: string): string {
  // Prevent CSV formula injection (Excel/Sheets DDE) by prefixing risky leading chars.
  if (/^[=+\-@\t\r]/.test(value)) {
    value = "'" + value;
  }
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}