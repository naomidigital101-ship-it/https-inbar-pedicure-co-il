import heroCorns from "@/assets/treatments/hero/corns.webp";
import heroIngrown from "@/assets/treatments/hero/ingrown-nails.webp";
import heroFungus from "@/assets/treatments/hero/fungus.webp";
import heroDiabetic from "@/assets/treatments/hero/diabetic-feet.webp";
import heroCracked from "@/assets/treatments/hero/cracked-heels.webp";
import heroOnycho from "@/assets/treatments/hero/onycholysis.webp";
import heroSports from "@/assets/treatments/hero/sports-feet.webp";

/**
 * תמונת ההירו של כל עמוד טיפול — קלוז-אפ קליני של המצב עצמו, כדי
 * שמבקר יזהה את הבעיה שלו כבר בקיפול הראשון.
 *
 * ה-alt מתאר את הממצא הקליני ולא את הכלי, כי זה מה שמחפשים בגוגל
 * תמונות ומה שקורא מסך צריך לשמוע.
 */
export type ServiceHero = { src: string; alt: string };

export const SERVICE_HERO: Record<string, ServiceHero> = {
  corns: {
    src: heroCorns,
    alt: "קלוז-אפ של יבלת וקאלוס מעובה בכרית כף הרגל",
  },
  "ingrown-nails": {
    src: heroIngrown,
    alt: "ציפורן חודרנית בבוהן: קצה הציפורן נכנס לקפל עור אדום ונפוח",
  },
  fungus: {
    src: heroFungus,
    alt: "ציפורניים עם פטרת: לוחיות מעובות בגוון צהוב-חום ומתפוררות",
  },
  "diabetic-feet": {
    src: heroDiabetic,
    alt: "בדיקת כף רגל סוכרתית בידיים בכפפות: עור יבש ומתקלף בכרית כף הרגל",
  },
  "cracked-heels": {
    src: heroCracked,
    alt: "עקב עם סדקים עמוקים ועור קשה ויבש מסביב",
  },
  onycholysis: {
    src: heroOnycho,
    alt: "שיקום ציפורן BIO: ג'ל שקוף נמרח במכחול על ציפורן פגומה",
  },
  "sports-feet": {
    src: heroSports,
    alt: "שלפוחית חיכוך וקאלוס בכף רגל של ספורטאי אחרי מאמץ ממושך",
  },
};
