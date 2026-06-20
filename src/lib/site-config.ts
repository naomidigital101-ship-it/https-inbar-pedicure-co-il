/**
 * תצורת אתר ענבר פרחי — פדיקור טיפולי.
 * נקודת אמת יחידה לפרטי עסק, אנשי קשר ו-URL בסיס.
 */

export const SITE = {
  brand: "ענבר פרחי",
  tagline: "פדיקוריסטית טיפולית לטיפול בכף הרגל",
  shortDescription:
    "פדיקור טיפולי לטיפול ביבלות, פטרת, ציפורן חודרנית וסדקים בעקב. גישה סטרילית, עדינה ומבוססת ניסיון.",
  url: "https://inbar-farchi.lovable.app",
  domain: "inbar-farchi.lovable.app",
  city: "בית אל",
  region: "אזור בנימין",
  phoneDisplay: "050-666-8595",
  phoneIntl: "+972506668595",
  whatsappNumber: "972506668595",
  whatsappUrl: "https://wa.me/972506668595",
  telUrl: "tel:+972506668595",
  wazeUrl: "https://waze.com/ul?q=ענבר%20פרחי%20פדיקור%20טיפולי%20בית%20אל",
  email: "inbar.pedicure@gmail.com",
  hoursDisplay: "ראשון–חמישי, 09:00–20:00",
  hoursOpeningSpec: ["Su,Mo,Tu,We,Th 09:00-20:00"] as const,
  yearsExperience: 12,
  treatmentsCount: "200+",
} as const;

export const SERVICES_NAV = [
  { slug: "corns", label: "טיפול ביבלות" },
  { slug: "fungus", label: "טיפול בפטרת" },
  { slug: "ingrown-nails", label: "ציפורן חודרנית" },
  { slug: "onycholysis", label: "ציפורן מנותקת" },
  { slug: "cracked-heels", label: "עור קשה וסדקים" },
  { slug: "diabetic-feet", label: "פדיקור לחולי סוכרת" },
  { slug: "sports-feet", label: "פדיקור לספורטאים וחיילים" },
] as const;

export const KNOWLEDGE_CATEGORIES_NAV = [
  { slug: "foot-care", label: "טיפוח כף הרגל" },
  { slug: "conditions", label: "בעיות נפוצות" },
  { slug: "diabetic-foot", label: "כף רגל סוכרתית" },
  { slug: "treatments", label: "טיפולים ופרוצדורות" },
  { slug: "footwear", label: "נעליים ומדרסים" },
  { slug: "sports-feet", label: "ספורט וחיילים" },
] as const;

/**
 * שיתופי פעולה מקצועיים — מותגים שענבר עובדת איתם בקליניקה.
 * להוספת מותג: דחפי אובייקט חדש עם name, url, וקומפוננטת לוגו.
 */
export type PartnerBrand = {
  slug: string;
  name: string;
  url: string;
  tagline: string;
};

export const PARTNERS: readonly PartnerBrand[] = [
  {
    slug: "pharm-foot",
    name: "Pharm Foot",
    url: "https://christinabeauty.co.il/Pharm-FOOT",
    tagline: "פדיקור פודולוגי מקצועי",
  },
] as const;