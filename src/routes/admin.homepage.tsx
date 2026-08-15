import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ContentBlocksEditor } from "@/components/admin/ContentBlocksEditor";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({ meta: [{ title: "דף הבית | ניהול" }] }),
  component: HomepageSettings,
});

const TABS = [
  { key: "top", label: "ראש הדף" },
  { key: "sections", label: "מקטעי הדף" },
] as const;

function HomepageSettings() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("top");

  return (
    <>
      <PageHeader title="דף הבית" description="כל מה שמופיע בכניסה לאתר." />

      <div className="mb-6 flex flex-wrap gap-1.5" role="tablist" aria-label="חלקי דף הבית">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 text-[14px] transition-colors"
            style={{
              borderRadius: 999,
              fontWeight: 700,
              background: tab === t.key ? "var(--green-700)" : "#fff",
              color: tab === t.key ? "#fff" : "var(--ink-600)",
              border: `1px solid ${tab === t.key ? "var(--green-700)" : "var(--stone-300)"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "top" && (
        <>
          <Card title="שלושת כרטיסי תחומי הליבה">
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-600)" }}>
              הכרטיסים בדף הבית נשלפים מהטיפולים עצמם, כדי שלא יהיו שני מקומות עם אותו מידע. כדי
              להחליף איזה טיפול מופיע שם, היכנסי ל
              <Link
                to="/admin/services"
                className="underline"
                style={{ color: "var(--green-700)", fontWeight: 700 }}
              >
                {" "}
                טיפולים{" "}
              </Link>
              וסמני "מוצג בדף הבית" בטיפול הרצוי.
            </p>
          </Card>

          <SettingsForm
            groups={[
              {
                key: "homepage",
                title: "ראש הדף",
                description: "הכותרות, פסקת הפתיחה, הכפתורים וארבעת המספרים.",
              },
              {
                key: "seo",
                title: "הגדרות SEO",
                description: "תמונת השיתוף שמופיעה כששולחים את כתובת האתר.",
              },
            ]}
          />
        </>
      )}

      {tab === "sections" && <ContentBlocksEditor />}
    </>
  );
}
