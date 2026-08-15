import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const Route = createFileRoute("/admin/business")({
  head: () => ({ meta: [{ title: "פרטי העסק | ניהול" }] }),
  component: BusinessSettings,
});

function BusinessSettings() {
  return (
    <>
      <PageHeader
        title="פרטי העסק"
        description="כל מה שמופיע כאן מתעדכן בבת אחת בכל מקום באתר — בכותרת, בפוטר, בכפתורי הוואטסאפ והחיוג, ובנתונים שגוגל קורא."
      />
      <SettingsForm
        groups={[
          {
            key: "contact",
            title: "יצירת קשר",
            description:
              "שינוי הטלפון או הוואטסאפ כאן משנה אותם בכל כפתור באתר. אין צורך לחפש במקומות נוספים.",
          },
          {
            key: "business",
            title: "פרטי הקליניקה",
            description: "השם, שורת התיאור והמספרים שמופיעים לאורך האתר.",
          },
          {
            key: "banner",
            title: "הודעה זמנית",
            description:
              "פס שמופיע בראש כל עמוד. שימושי להודעה על חופשה, שינוי בשעות או תורים שהתפנו.",
          },
        ]}
      />
    </>
  );
}
