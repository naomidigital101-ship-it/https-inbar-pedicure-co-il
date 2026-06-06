import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Breadcrumb } from "@/components/article/Breadcrumb";
import { HELMETS } from "@/lib/products/helmets";
import { BOOTS } from "@/lib/products/boots";
import { BODY_ARMOR } from "@/lib/products/body-armor";
import { getHelmetImage } from "@/lib/products/helmet-images";

const SITE = "https://lazyrider.org";
const PAGE_URL = `${SITE}/products`;
const PAGE_TITLE = "קטלוג ציוד מגן לרכיבת שטח | הרוכב העצלן";
const PAGE_DESC =
  "מפת ציוד הרוכב המלאה: קסדות, מגני גוף ומגפיים. מדריך תקני CE, MIPS, מידות ומתי להחליף ציוד אחרי תאונה. השוואה ומחירים מחנויות בישראל.";

type Category = {
  href: string;
  code: string;
  label: string;
  desc: string;
  count: number;
  image: string | undefined;
  highlights: string[];
};

const CATEGORIES: Category[] = [
  {
    href: "/products/helmets",
    code: "GEAR_01",
    label: "קסדות שטח",
    desc: "מוטוקרוס, אנדורו, פול־פייס. השוואת מותגים, MIPS, משקל, אמינות.",
    count: HELMETS.length,
    image: HELMETS[0] ? getHelmetImage(HELMETS[0].slug) : undefined,
    highlights: ["תקן ECE 22.06", "MIPS / SPIN / Turbine", "משקל 1200-1500g"],
  },
  {
    href: "/products/body-armor",
    code: "GEAR_02",
    label: "מגני גוף",
    desc: "Roost guards, חליפות לחץ, מגני חזה. כולל מדריך לנשים.",
    count: BODY_ARMOR.length,
    image: BODY_ARMOR[0]?.unsplash_image,
    highlights: ["CE EN1621-3 Level 2", "D3O / SAS-TEC", "גזרת נשים נפרדת"],
  },
  {
    href: "/products/boots",
    code: "GEAR_03",
    label: "מגפי שטח",
    desc: "מוטוקרוס, אנדורו, אדוונצ'ר. תאימות knee brace, רוחב, עמידות.",
    count: BOOTS.length,
    image: BOOTS[0]?.unsplash_image,
    highlights: ["סוליה קשיחה", "הגנת קרסול 360°", "אבזם מתכת מתחלף"],
  },
];

const TOTAL_PRODUCTS = HELMETS.length + BOOTS.length + BODY_ARMOR.length;

const ZONES = [
  { id: "head", label: "ראש", item: "קסדה", risk: "70% מפציעות החמורות", color: "#e63000" },
  { id: "chest", label: "חזה וגב", item: "מגן גוף / Roost", risk: "פגיעת לב, שברי צלעות", color: "#f59e0b" },
  { id: "spine", label: "עמוד שדרה", item: "מגן גב Level 2", risk: "שיתוק, נכות לכל החיים", color: "#dc2626" },
  { id: "elbows", label: "מרפקים", item: "מגני מרפק", risk: "שברי זרוע, גידים", color: "#f59e0b" },
  { id: "hands", label: "ידיים", item: "כפפות + מגני אצבע", risk: "שברי אצבעות, כפות", color: "#84cc16" },
  { id: "knees", label: "ברכיים", item: "Knee braces / pads", risk: "קרע ACL, פיקה", color: "#dc2626" },
  { id: "feet", label: "כפות רגליים וקרסול", item: "מגפי שטח", risk: "שברי קרסול, מעיכת אצבעות", color: "#e63000" },
];

const PILLARS = [
  {
    num: "01",
    title: "תקנים זה לא קישוט",
    body: "קסדה בלי ECE 22.06 או DOT - לא קסדה, זה כובע. מגן גוף בלי CE EN1621 - גימיק. מגף בלי תקן CE - לא מספיק קשיח. תקן הוא בדיקת מעבדה אובייקטיבית, לא מילה שיווקית. אם המוצר לא מציין תקן בבירור, אל תקנה.",
  },
  {
    num: "02",
    title: "MIPS חוסך חיים, לא רק כסף",
    body: "מערכת החלקה פנימית בקסדה שמפחיתה כוחות סיבוב על המוח ב-30-40%. עלות תוספת 200-400 שקל. מחקרים של אוניברסיטת לונד מ-2023 מראים ירידה משמעותית בפציעות מוח. אם התקציב מאפשר - תמיד MIPS (או SPIN של 6D / Turbine של Leatt).",
  },
  {
    num: "03",
    title: "מידה מדויקת > מותג יוקרתי",
    body: "קסדה אחת מידה גדולה מדי = הגנה אפסית בנפילה. מגף שלא יושב נכון = שבר קרסול במקום הגנה. מדידה היקפית של הראש, מדידה של כף הרגל בערב (כי מתנפחת), נשיאה של 10 דקות בחנות לפני קנייה. רוכב על Bell ב-S שלא יושב יקבל פציעה יותר חמורה מרוכב על HJC ב-M מתאימה.",
  },
  {
    num: "04",
    title: "אחרי נפילה - להחליף",
    body: "קסדה אחרי מכה - גם אם לא רואים שריט - להחליף. ספיגת האנרגיה חד פעמית. EPS (קצף פנימי) מתפרק במכה ראשונה. יצרנים כמו Bell ו-Arai מציעים החלפה בהנחה אחרי תאונה. אותו דבר למגני גב Level 2 - בודקים סדקים בקליפה הקשיחה.",
  },
  {
    num: "05",
    title: "חום ישראלי משנה הכל",
    body: "ציוד שמיועד לאירופה הקרה לא מתאים לקיץ ישראלי. מגף Adventure גבוה בקיץ = רגליים שורפות. מגן גוף בלי אוורור = פריחת חום ב-30 דקות. בקיץ - חליפת לחץ רכה (Soft Cell) על Roost קל. בחורף - מגן גב קשיח עם בידוד.",
  },
  {
    num: "06",
    title: "Knee Braces - הקפיצה הכי משתלמת",
    body: "מגני ברכיים רכים (pads) מגינים מבעיטות. מגני בריס (braces כמו Asterisk Cell, Mobius X8) מגינים מקרע ACL - הפציעה הכי שכיחה ויקרה ברכיבת שטח. עלות 1500-3500 שקל - פחות מהשתל ניתוחי. רוכב שיורד מעל פעמיים בחודש - חובה.",
  },
];

const SHOPPING_FLOW = [
  { step: "01", title: "התחל מקסדה", body: "ההגנה הקריטית. תקציב 800 ש\"ח לפחות. ECE 22.06 + MIPS." },
  { step: "02", title: "מגפים", body: "השנייה בחשיבות. 1500-3000 ש\"ח. סוליה קשיחה, אבזמי מתכת." },
  { step: "03", title: "מגן גב / חזה", body: "EN1621-2 Level 2. רך לאנדורו, קשיח למוטוקרוס." },
  { step: "04", title: "Knee Braces", body: "אחרי שיש לך 30 שעות רכיבה. ACL שווה את ההשקעה." },
  { step: "05", title: "כפפות + משקפיים", body: "תוסיף תוך כדי. כפפות 100-300 ש\"ח, משקפיים 200-700." },
];

const FAQS = [
  {
    q: "כמה צריך להוציא על ציוד מגן בסיסי?",
    a: "תקציב מינימלי הגיוני: 800 ש\"ח קסדה + 1500 ש\"ח מגפיים + 600 ש\"ח מגן חזה + 200 ש\"ח כפפות + 250 ש\"ח משקפיים = 3350 ש\"ח. זה עיקר ההגנה. אפשר להוסיף Knee braces (1500-3500) ומגן גב נפרד (400-800) בהמשך.",
  },
  {
    q: "האם ציוד יד שנייה זה אופציה?",
    a: "מגפיים וכפפות - כן, בתנאי שהסוליה לא שחוקה ואין סדקים בפלסטיק. קסדה - אף פעם לא, אי אפשר לדעת אם נפלה ואת ההיסטוריה שלה. מגני גב קשיחים - רק אם המוכר מאשר שלא נפלה, ובדיקה ויזואלית מקרוב. רפידות D3O מתיישנות אחרי 3-4 שנים.",
  },
  {
    q: "אופנוע אנדורו מול מוטוקרוס - הציוד שונה?",
    a: "כן. מוטוקרוס: קסדה מאווררת מקסימום, מגפיים נוקשים, מגן חזה + כתפיים קשיח. אנדורו: קסדה עם משקפי שמש קלים, מגפיים גמישים יותר להליכה, חליפת לחץ רכה. אדוונצ'ר: קסדה מודולרית, מגפיים אטומים למים, מגן גב נפרד מתחת לג'קט.",
  },
  {
    q: "מה ההבדל בין CE Level 1 ל-Level 2 במגני גוף?",
    a: "תקן EN1621-2 (גב) ו-EN1621-3 (חזה) בודקים ספיגת אנרגיית מכה. Level 1 - מותר עד 18 kN מועברים לגוף. Level 2 - מותר עד 9 kN בלבד. Level 2 = כפול הגנה. לרכיבת שטח - תמיד Level 2 על הגב. החזה אפשר Level 1 אם משלימים עם Roost guard.",
  },
  {
    q: "כל כמה זמן להחליף קסדה גם בלי תאונה?",
    a: "Snell ו-ECE ממליצים החלפה כל 5 שנים מתאריך הייצור (מודבק על הקסדה מבפנים). פוליסטירן ה-EPS מתיישן, רפידות הזיעה והדבק נחלשים. רוכב פעיל (פעם בשבוע) - 3-4 שנים. רוכב מזדמן - 5 שנים. בכל מקרה - לפני 10 שנים מתאריך הייצור.",
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "קטלוג ציוד מגן",
  url: PAGE_URL,
  inLanguage: "he-IL",
  description: PAGE_DESC,
  hasPart: CATEGORIES.map((c) => ({
    "@type": "WebPage",
    name: c.label,
    url: `${SITE}${c.href}`,
    description: c.desc,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ראשי", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: "ציוד מגן", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(itemListSchema) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbSchema) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema) },
    ],
  }),
  component: ProductsHub,
});

function ProductsHub() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-[#f0f0f0]">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="border-b border-[#222] px-6 py-12 md:px-10 md:py-16">
          <Breadcrumb items={[{ label: "ראשי", href: "/" }, { label: "ציוד מגן" }]} />
          <div className="mt-6 grid gap-10 md:grid-cols-[1.4fr,1fr]">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                // CATALOG_HUB // GEAR_INDEX
              </div>
              <h1 className="mt-3 text-4xl font-black leading-tight text-[#f0f0f0] md:text-5xl">
                ציוד מגן לרכיבת שטח -<br />
                <span className="text-[#e63000]">כל מה שצריך לדעת</span> במקום אחד
              </h1>
              <p className="mt-5 max-w-2xl text-base font-bold leading-relaxed text-[#b0b0b0]">
                {TOTAL_PRODUCTS} מוצרים פעילים בקטלוג, מסוננים לפי תקני CE, ECE 22.06 ו-DOT.
                מחירים מאומתים מול {HELMETS.length + BOOTS.length + BODY_ARMOR.length}+ חנויות
                בישראל. בלי תכסיסי שיווק, בלי "המומלץ של החודש" - רק מה שעובד באמת בשטח.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {CATEGORIES.map((c) => (
                  <a
                    key={c.href}
                    href={`#${c.code.toLowerCase()}`}
                    className="border border-[#333] bg-[#111] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f0f0f0] transition-colors hover:border-[#e63000] hover:text-[#e63000]"
                  >
                    {c.label} ({c.count})
                  </a>
                ))}
              </div>
            </div>
            <div className="border border-[#222] bg-[#0d0d0d] p-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
                // STATS
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Stat value={TOTAL_PRODUCTS.toString()} label="מוצרים" />
                <Stat value="3" label="קטגוריות" />
                <Stat value="12+" label="מותגים" />
                <Stat value="100%" label="תקני CE / ECE" />
              </div>
            </div>
          </div>
        </section>

        {/* Gear map */}
        <section className="border-b border-[#222] bg-[#0d0d0d] px-6 py-14 md:px-10 md:py-20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
            // MAP_01 // RIDER_PROTECTION
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">מפת ציוד הרוכב</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-relaxed text-[#b0b0b0]">
            מה כל אזור בגוף צריך להגנה, ולמה. לפי נתוני בית החולים Royal North Shore באוסטרליה ומחקר NHTSA האמריקאי
            על פציעות אופנוע שטח 2019-2023.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden border border-[#222] bg-[#222] md:grid-cols-2 lg:grid-cols-3">
            {ZONES.map((z) => (
              <div key={z.id} className="bg-[#0d0d0d] p-6">
                <div
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: z.color }}
                >
                  ZONE / {z.id.toUpperCase()}
                </div>
                <div className="mt-2 text-xl font-black text-[#f0f0f0]">{z.label}</div>
                <div className="mt-3 text-sm font-bold text-[#e63000]">{z.item}</div>
                <div className="mt-2 text-xs font-bold leading-relaxed text-[#909090]">
                  סיכון: {z.risk}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="border-b border-[#222] px-6 py-14 md:px-10 md:py-20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
            // INDEX_02 // CATEGORIES
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">שלוש קטגוריות, מאות החלטות</h2>
          <div className="mt-8 grid gap-px overflow-hidden border border-[#222] bg-[#222] md:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                to={c.href}
                id={c.code.toLowerCase()}
                className="group flex flex-col bg-[#0d0d0d] transition-colors hover:bg-[#111]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#080808]">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.label}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                      [ {c.code} ]
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
                      {c.count} מוצרים
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#f0f0f0] group-hover:text-[#e63000]">
                    {c.label}
                  </h3>
                  <p className="text-sm font-bold leading-relaxed text-[#909090]">{c.desc}</p>
                  <ul className="mt-2 space-y-1.5 border-t border-[#222] pt-3">
                    {c.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs font-bold text-[#b0b0b0]">
                        <span className="text-[#e63000]">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-4 text-xs font-black uppercase tracking-widest text-[#f0f0f0] group-hover:text-[#e63000]">
                    לכל המוצרים ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6 Pillars - the "מטורף" guide */}
        <section className="border-b border-[#222] bg-[#0d0d0d] px-6 py-14 md:px-10 md:py-20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
            // GUIDE_03 // CORE_PRINCIPLES
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            6 העקרונות שחייבים להבין לפני שקונים
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-relaxed text-[#b0b0b0]">
            אחרי 12 שנים בענף ראיתי הכל. אלה ההחלטות שמשנות לך את החיים - הן בקבלת הציוד הנכון
            והן במניעת פציעה. אם תקרא רק חלק אחד באתר, שיהיה זה.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden border border-[#222] bg-[#222] md:grid-cols-2">
            {PILLARS.map((p) => (
              <article key={p.num} className="flex gap-5 bg-[#0d0d0d] p-6 md:p-8">
                <div className="shrink-0 text-5xl font-black leading-none text-[#e63000] md:text-6xl">
                  {p.num}
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#f0f0f0] md:text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-[#b0b0b0]">
                    {p.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Shopping order */}
        <section className="border-b border-[#222] px-6 py-14 md:px-10 md:py-20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
            // FLOW_04 // ORDER_OF_PURCHASE
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">סדר קנייה מומלץ למתחיל</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-relaxed text-[#b0b0b0]">
            ההמלצה לרוכבים שמתחילים, או למחליפים ציוד אחרי תקופה. סדר עדיפויות לפי ROI של הגנה.
          </p>
          <ol className="mt-8 grid gap-3 md:grid-cols-5">
            {SHOPPING_FLOW.map((s, i) => (
              <li
                key={s.step}
                className="relative border border-[#222] bg-[#0d0d0d] p-5"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
                  STEP {s.step}
                </div>
                <div className="mt-2 text-base font-black text-[#f0f0f0]">{s.title}</div>
                <div className="mt-2 text-xs font-bold leading-relaxed text-[#909090]">{s.body}</div>
                {i < SHOPPING_FLOW.length - 1 && (
                  <span className="absolute left-2 top-1/2 hidden -translate-y-1/2 text-2xl font-black text-[#333] md:block">
                    ←
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="border-b border-[#222] bg-[#0d0d0d] px-6 py-14 md:px-10 md:py-20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
            // FAQ_05 // COMMON_QUESTIONS
          </div>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">שאלות שחוזרות אצלי במוסך</h2>
          <div className="mt-8 divide-y divide-[#222] border border-[#222] bg-[#0a0a0a]">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" open={i === 0}>
                <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 text-base font-black text-[#f0f0f0] hover:text-[#e63000] md:p-6 md:text-lg">
                  <span>{f.q}</span>
                  <span className="shrink-0 text-2xl text-[#e63000] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-6 text-sm font-bold leading-relaxed text-[#b0b0b0] md:px-6 md:text-base">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-14 md:px-10 md:py-20">
          <div className="border border-[#e63000] bg-[#0d0d0d] p-8 md:p-12">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
              // NEXT_STEP
            </div>
            <h2 className="mt-2 text-3xl font-black text-[#f0f0f0] md:text-4xl">
              מוכן לבחור? התחל מהקסדה.
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-relaxed text-[#b0b0b0]">
              קסדה היא ההגנה היחידה שאי אפשר לפצות עליה. בכל הקטגוריות יש סינון לפי תקציב,
              מותג ורמה - תוך 3 לחיצות אתה רואה רק את מה שמתאים לך באמת.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products/helmets"
                className="inline-block bg-[#e63000] px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-[#c52800]"
              >
                לקטלוג הקסדות ←
              </Link>
              <Link
                to="/article/helmet-buyers-guide-2026"
                className="inline-block border border-[#333] bg-[#111] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#f0f0f0] transition-colors hover:border-[#e63000] hover:text-[#e63000]"
              >
                מדריך קנייה מלא
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-[#222] bg-[#0a0a0a] p-4">
      <div className="text-3xl font-black text-[#e63000]">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#909090]">
        {label}
      </div>
    </div>
  );
}