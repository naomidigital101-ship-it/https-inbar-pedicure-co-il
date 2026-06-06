import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { LeadMagnet } from "@/components/shared/LeadMagnet";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import heroAsset from "@/assets/inbar-farchi.jpg.asset.json";
const heroImage = heroAsset.url;

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/about`;
const HERO_ABS = `${SITE}${heroImage}`;
const TITLE = "אודות נעמי | הרוכב העצלן";
const DESCRIPTION =
  "הסיפור מאחורי הרוכב העצלן. נעמי, רוכבת KTM 250 2T EXC מבנימין, מתרגמת ידע טכני באופנועי שטח לעברית פשוטה שחוסכת כסף וטעויות.";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  inLanguage: "he-IL",
  url: PAGE_URL,
  mainEntity: {
    "@type": "Person",
    name: "נעמי",
    jobTitle: "כותבת ורוכבת אופנועי שטח",
    description:
      "רוכבת KTM 250 2T EXC מבנימין. מתרגמת ידע טכני באופנועי שטח לעברית פשוטה.",
    image: HERO_ABS,
    knowsAbout: [
      "אופנועי שטח",
      "תחזוקת אופנועים",
      "KTM",
      "אנדורו",
      "טכניקת רכיבה",
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "בית", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: "אודות", item: PAGE_URL },
  ],
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: HERO_ABS },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: HERO_ABS },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      { type: "application/ld+json", children: JSON.stringify(personSchema) },
    ],
  }),
  component: AboutPage,
});

const paragraphs: string[] = [
  "קוראים לי נעמי, אני בת 22 ומתיישבת בבנימין, ולפני קצת יותר משנה עליתי בפעם הראשונה על אופנוע של חברה בלי באמת לדעת איך רוכבים. הרעד של המנוע, הפחד, האדרנלין, הכל קרה ביחד באותו רגע, וידעתי כבר אז שאני לא יורדת מזה. לפני זה היו שנים של עבודות משרד, ישיבות ומסכים ולוחות זמנים של מישהו אחר, וכשמצאתי את עצמי לראשונה על KTM 250 2T EXC בשטח של סוף השבוע, הבנתי שזה המקום היחיד שבו הראש שלי מצליח להשתתק לגמרי.",
  "מהר מאוד גיליתי שהפער בין לרכוב לבין להבין באמת איך האופנוע עובד הוא ענק, ושהפער הזה עולה הרבה כסף. שילמתי למכונאים על דברים שהבנתי אחר כך שיכולתי לעשות לבד בחצי שעה בבית, עשיתי בשטח טעויות בסיסיות שאפשר היה למנוע בקלות אם רק היה לי איפה לקרוא עליהן בעברית, ופגשתי לא מעט אנשים שחשבו שאפשר לדפוק לי מחיר כי אני אישה שלא אמורה להבין במה מדובר. בכל פעם שניסיתי לחפש תשובה רצינית, מצאתי או פורומים ישנים, או סרטונים באנגלית שמדברים על אופנועים אחרים, או יעוץ מתנשא. כמעט שום דבר לא היה כתוב פשוט, מסודר ובעברית.",
  "אז התחלתי לכתוב לעצמי. כל פעם שלמדתי משהו חדש על האופנוע, על תחזוקה, על טכניקת רכיבה או על ציוד, תיעדתי אותו בשפה שאני הייתי רוצה לקרוא בה כשהתחלתי. בלי להניח שאת או אתה כבר יודעים מה זה שים, איך מנקים מסנן אוויר נכון או למה רוכבים בעמידה, ובלי לזלזל באף שאלה. האתר הזה הוא בעצם אוסף של כל מה שהייתי רוצה שמישהו היה נותן לי ביד בשנה הראשונה שלי, ערוך כמו שצריך, מבוסס על ניסיון אמיתי ולא על תרגום של ויקיפדיה, ובנוי כדי לחסוך לכם את הכסף ואת הטעויות שאני כבר שילמתי עליהם.",
  "אני לא רוכבת חמישים שנה, לא מכונאית מוסמכת ולא אלופת עולם. אני לומדת על ידי עשייה ומשתפת את כל מה שאני מגלה בדרך. אני קוראת, חוקרת, מתנסה, נופלת לפעמים, ומתרגמת את מה שיוצא לי מזה לשפה שאפשר באמת לעבוד איתה בבית, בסוף שבוע, לפני שיוצאים לשטח. במקום אחד תמצאו כאן מדריכי תחזוקה, השוואות בין דגמים, מדריכי ציוד, וטכניקת רכיבה, הכל מכוון לרוכבים ולרוכבות, מתחילים ומתקדמים, שרוצים פשוט להפסיק להיות תלויים בכל אחד על כל שטות. יום אחד אני רוצה להגיע גם לתחרויות. עד אז, אני כותבת. אם מצאתם טעות, יש לכם שאלה או משהו שהייתם רוצים שיהיה כאן, כתבו לי, אני קוראת כל הודעה ועונה אישית.",
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Breadcrumb
          items={[{ label: "בית", href: "/" }, { label: "אודות" }]}
        />

        <article className="border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div className="mx-auto max-w-[760px] px-4 py-14 md:px-8 md:py-20">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5fa898]">
                אודות
              </span>
              <span aria-hidden="true" className="h-px w-12 bg-[#b8dcd4]" />
            </div>

            <h1 className="mb-10 text-4xl font-black leading-tight text-[#1d3a35] md:text-5xl">
              היי, אני נעמי
            </h1>

            <figure className="mb-12 overflow-hidden border border-[#b8dcd4]">
              <img
                src={heroImage}
                alt="נעמי על אופנוע KTM 250 EXC כתום בשטח סלעי בשעת שקיעה"
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
              />
            </figure>

            <div className="space-y-6 text-lg leading-loose text-[#2d4a44]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-12 border-t border-[#b8dcd4] pt-10">
              <a
                href="mailto:hello@dirt-road-guide.lovable.app"
                className="inline-flex items-center gap-3 border-2 border-[#5fa898] bg-[#5fa898] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#fdfbf7] transition-colors hover:bg-transparent hover:text-[#5fa898] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5fa898]"
                aria-label="שליחת מייל לנעמי"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                כתבו לי
              </a>
            </div>
          </div>
        </article>

        <LeadMagnet />
      </main>
      <SiteFooter />
    </div>
  );
}