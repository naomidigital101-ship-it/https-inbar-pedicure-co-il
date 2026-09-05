import type { ServicePage } from "./services-content";

/** Audit 2026-09-05: withhold these exact, undocumented business figures.
 * This applies to CMS responses as well as code fallbacks; originals stay in the CMS
 * for editorial review. It does not validate or rewrite clinical instructions.
 */
export function publicService(service: ServicePage): ServicePage {
  return {
    ...service,
    quickFacts: service.quickFacts.filter((fact) => fact.value !== "כ-85% ללא צורך בניתוח"),
    sections: service.sections.map((section) => ({
      ...section,
      ...(section.body
        ? {
            body: section.body.replace(
              " אצלי הסטטיסטיקה האישית: כ-80% מהמטופלות לא חוזרות לאותה יבלה אחרי טיפול אחד עם תיקון הגורם. השאר זקוקות ל-2–3 ביקורים עד יציבות.",
              "",
            ),
          }
        : {}),
    })),
  };
}

export function publicCategoryDescription(description: string): string {
  return description.replace(
    "המדריכים נכתבו על ידי ענבר פרחי, פדיקוריסטית טיפולית, על בסיס 12+ שנות ניסיון בקליניקה. ",
    "",
  );
}
