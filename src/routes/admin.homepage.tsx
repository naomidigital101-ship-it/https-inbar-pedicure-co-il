import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({ meta: [{ title: "דף הבית | ניהול" }] }),
  component: HomepageSettings,
});

function HomepageSettings() {
  return (
    <>
      <PageHeader title="דף הבית" description="הטקסטים והמספרים שרואים בכניסה לאתר." />

      <Card title="שלושת כרטיסי תחומי הליבה">
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--ink-600)" }}>
          הכרטיסים בדף הבית נשלפים מהטיפולים עצמם, כדי שלא יהיו שני מקומות עם אותו מידע. כדי להחליף
          איזה טיפול מופיע שם, היכנסי ל
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
            title: "תוכן דף הבית",
            description: "הכותרות, פסקת הפתיחה, הכפתורים וארבעת המספרים.",
          },
          {
            key: "seo",
            title: "הגדרות SEO",
            description:
              "כתובת האתר משמשת כמקור יחיד לכל הקישורים שגוגל קורא. לשנות רק במעבר דומיין.",
          },
        ]}
      />
    </>
  );
}
