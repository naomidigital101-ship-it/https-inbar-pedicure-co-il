import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SITE } from "@/lib/site-config";
import inbarPhoto from "@/assets/inbar-farchi.jpg.asset.json";

const SERVICES = [
  { title: "יבלות", desc: "טיפול בכל סוגי היבלות בשיטה סטרילית המונעת זיהום והישנות." },
  { title: "אורטוניקסיה / ציפורן חודרנית", desc: "שיקום מבנה הציפורן והכוונתה מחדש – ללא ניתוח, ללא כאב." },
  { title: "פטרת כף הרגל", desc: "טיפול יסודי בפטרת עור וציפורן בליווי הדרכה ביתית עד החלמה מלאה." },
  { title: "אוניכוליזיס – ציפורן מנותקת", desc: "טיפול מקצועי לשיקום ציפורן שהתנתקה ממיטת הציפורן." },
  { title: "עור סדוק ועקבים קשים", desc: "הסרה עדינה של עור קשה, איחוי סדקים והחזרת רכות וגמישות." },
  { title: "פדיקור לחולי סוכרת", desc: "פרוטוקול רפואי מאושר, ציוד חד־פעמי וסטריליות מלאה." },
] as const;

const AUDIENCES = [
  { title: "חולי סוכרת", desc: "טיפול עדין ובטוח לפי פרוטוקולים מאושרים, עם חומרים ייעודיים ורגישות מלאה. המטרה: שמירה על בריאות הרגל ומניעת סיבוכים." },
  { title: "מבוגרים", desc: "עם השנים העור נעשה דק ויבש יותר וההליכה עלולה להיות מכאיבה. אני מטפלת בעדינות, מסירה עומסים ומחזירה נוחות בכל צעד." },
  { title: "חיילים ומילואימניקים", desc: "נעליים צבאיות ולחות ממושכת גורמות לפצעים, יבלות ופטרת. טיפול יעיל ומהיר שמחזיר את כף הרגל למצב תקין." },
  { title: "ספורטאים", desc: "עומס פיזי, נעליים סגורות וזיעה גורמים לפגיעות. טיפול בציפורניים פגועות, יבלות מאמץ והדרכה לשמירה על הרגל באימונים." },
] as const;

const STATS = [
  { num: "+200", label: "טיפולים מוצלחים מסוגים שונים" },
  { num: "+12", label: "שנות ניסיון בטיפול רפואי בכף הרגל" },
  { num: "+150", label: "שעות השתלמות ולימוד בשנה" },
  { num: "+20", label: "פדיקוריסטיות שהוכשרו והודרכו על ידי" },
] as const;

const FAQS = [
  { q: "האם הטיפול מתאים גם לגברים?", a: "בהחלט. הטיפולים מתאימים לגברים ולנשים כאחד. גברים רבים סובלים מעור קשה, פטרת, סדקים ויבלות ויכולים ליהנות מטיפול מקצועי, סטרילי ולא פולשני שמחזיר את הנוחות וההקלה באופן מיידי." },
  { q: "איך אדע אם אני זקוק/ה לפדיקור טיפולי?", a: "אם את או אתה מרגישים כאב בהליכה, סובלים מעור קשה, ציפורניים עבות או מתפוררות, סדקים בכפות הרגליים, או פטרת שחוזרת – זה סימן שהגיע הזמן לפדיקוריסטית טיפולית. ככל שמטפלים מוקדם יותר, ניתן למנוע סיבוכים." },
  { q: "איך אוכל לדעת שהטיפול נעשה בסטריליות מלאה?", a: "בקליניקה כל כלי עובר חיטוי ועיקור מלא במכשור ייעודי (אוטוקלאב), וכל טיפול מתבצע בתנאים נקיים לחלוטין. הסטריליות היא חלק בלתי נפרד מהטיפול הרפואי ומהבטיחות שלך." },
  { q: "האם זה בטוח לחולי סוכרת?", a: "בהחלט. אני מתמחה בטיפול בכף הרגל של חולי סוכרת לפי פרוטוקולים רפואיים מאושרים, עם חומרים עדינים, סטריליות מלאה וציוד חד־פעמי. המטרה: טיפול בטוח, מדויק ורגוע, עם תשומת לב לכל פרט." },
  { q: "אני מתביישת מהיבלות שלי, לא בא לי להגיע", a: "אין שום סיבה להתבייש – אני רואה מדי יום מקרים מורכבים וזה בדיוק התחום שבו אני מתמחה. היבלות נובעות מעומס, חיכוך או טיפול לא נכון בעבר. הטיפול נעשה באווירה רגועה, בלי שיפוט, עם הקשבה ופתרון אמיתי שיחזיר לך הליכה קלה כבר מהפגישה הראשונה." },
  { q: "ניסיתי טיפולים בעבר ולא היה שיפור, איך אדע שהפעם זה יעזור?", a: "ההבדל הוא בגישה. אני לא מטפלת רק בסימפטום אלא במקור הבעיה. כל טיפול נבנה לפי מצב העור, הציפורניים וההיסטוריה הרפואית שלך, עם שילוב של ידע רפואי, ניסיון, שיטות מתקדמות כמו BIO והדרכה ביתית." },
  { q: "כמה זמן לוקח לראות תוצאות?", a: "במקרים רבים כבר אחרי טיפול אחד מרגישים הקלה משמעותית. בטיפולים שיקומיים (פטרת, שיקום ציפורן) נדרש תהליך של מספר מפגשים, ואני מלווה אותך באופן צמוד עד שהתוצאה מושלמת." },
  { q: "מה קורה אם אני לא בטוחה מה יש לי?", a: "לא צריך לדעת מראש. תגיעי לפגישה, אבדוק את כף הרגל, אבצע אבחנה ואסביר מה הבעיה, מה גורם לה ואיך נכון לטפל בה. הרבה פעמים אנשים מופתעים לגלות שזה משהו פשוט שאפשר לפתור במהירות." },
] as const;

const BULLETS = [
  "טיפול בכל סוגי היבלות והפטריות בשיטה המונעת זיהום",
  "התמחות בטיפול בחולי סוכרת לפי הסטנדרטים הרפואיים הגבוהים",
  "שיטות עדינות וללא התאכזרות לציפורן",
  "השתלמויות קבועות בבית החולים איכילוב",
  "מרצה ומכשירה פדיקוריסטיות טיפוליות",
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.brand} | ${SITE.tagline}` },
      { name: "description", content: SITE.shortDescription },
      { property: "og:title", content: `${SITE.brand} | ${SITE.tagline}` },
      { property: "og:description", content: SITE.shortDescription },
      { property: "og:url", content: SITE.url + "/" },
      { property: "og:image", content: SITE.url + inbarPhoto.url },
      { name: "twitter:image", content: SITE.url + inbarPhoto.url },
    ],
    links: [{ rel: "canonical", href: SITE.url + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#b8dcd4] bg-[#fdfbf7]">
          <div aria-hidden className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#e9f4f1] opacity-70" />
          <div aria-hidden className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#e9f4f1] opacity-50" />
          <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:py-24">
            <div>
              <p className="mb-4 inline-block rounded-full bg-[#e9f4f1] px-4 py-1.5 text-xs font-bold text-[#5fa898]">
                מומחית בטיפול בכף הרגל · {SITE.city}
              </p>
              <h1 className="mb-6 text-4xl font-black leading-tight text-[#1d3a35] md:text-5xl lg:text-6xl">
                {SITE.brand}
                <span className="mt-2 block text-2xl font-bold text-[#2d4a44] md:text-3xl">
                  פדיקוריסטית לטיפול במחלות רגליים ויבלות
                </span>
              </h1>
              <ul className="mb-8 space-y-2.5">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-base leading-relaxed text-[#2d4a44]">
                    <span aria-hidden className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#5fa898]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#25d366] px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">קביעת תור בוואטסאפ</a>
                <a href={SITE.telUrl} className="rounded-full bg-[#5fa898] px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-105">{SITE.phoneDisplay}</a>
              </div>
            </div>
            <div className="relative">
              <div aria-hidden className="absolute -right-4 -top-4 h-full w-full rounded-3xl bg-[#5fa898] opacity-20" />
              <img
                src={inbarPhoto.url}
                alt={`${SITE.brand} — פדיקוריסטית טיפולית ב${SITE.city}`}
                width={640}
                height={640}
                loading="eager"
                className="relative aspect-square w-full rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="border-b border-[#b8dcd4] bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5fa898]">השירותים שלי</p>
              <h2 className="text-3xl font-black text-[#1d3a35] md:text-4xl">מאיזו בעיית רגליים תרצו להיפטר?</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <article key={s.title} className="group rounded-2xl border border-[#b8dcd4] bg-[#fdfbf7] p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div aria-hidden className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f4f1] text-2xl">🦶</div>
                  <h3 className="mb-2 text-lg font-bold text-[#1d3a35]">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[#2d4a44]">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Audiences */}
        <section className="border-b border-[#b8dcd4] bg-[#fdfbf7] py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5fa898]">מטופלים שונים, צורך אחד</p>
              <h2 className="mb-2 text-3xl font-black text-[#1d3a35] md:text-4xl">להחזיר לכם נוחות ובריאות בכף הרגל</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {AUDIENCES.map((a) => (
                <article key={a.title} className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-lg font-bold text-[#5fa898]">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-[#2d4a44]">{a.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* About teaser */}
        <section className="border-b border-[#b8dcd4] bg-white py-20">
          <div className="mx-auto grid max-w-[1100px] gap-10 px-6 md:grid-cols-[1fr_1.4fr] md:items-center">
            <img src={inbarPhoto.url} alt="ענבר פרחי בקליניקה" width={520} height={520} loading="lazy" className="aspect-square w-full rounded-3xl object-cover shadow-xl" />
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5fa898]">נעים מאוד</p>
              <h2 className="mb-5 text-3xl font-black text-[#1d3a35] md:text-4xl">אני ענבר פרחי</h2>
              <p className="mb-4 text-base leading-relaxed text-[#2d4a44]">
                פדיקוריסטית טיפולית המתמחה בטיפול במחלות רגליים, יבלות, פטרת ושיקום ציפורניים בשיטת BIO. בעיניי טיפול בכף הרגל הוא הרבה מעבר לפינוק, אלא חלק מהבריאות הכללית והאיכות היומיומית.
              </p>
              <p className="mb-4 text-base font-bold leading-relaxed text-[#1d3a35]">
                מגיע לכל אדם ללכת בלי כאב, להרגיש נוחות וביטחון בכל צעד.
              </p>
              <p className="mb-6 text-base leading-relaxed text-[#2d4a44]">
                אני עוברת השתלמויות קבועות בבית החולים איכילוב, מתמחה בטיפול בחולי סוכרת ומרצה לפדיקוריסטיות טיפוליות ברחבי הארץ.
              </p>
              <a href="/about" className="inline-block rounded-full border-2 border-[#5fa898] px-6 py-3 text-sm font-bold text-[#5fa898] transition-colors hover:bg-[#5fa898] hover:text-white">קראו עוד עליי ←</a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[#b8dcd4] bg-[#5fa898] py-16 text-white">
          <div className="mx-auto grid max-w-[1100px] gap-8 px-6 sm:grid-cols-2 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mb-2 text-5xl font-black md:text-6xl">{s.num}</div>
                <div className="text-sm leading-relaxed text-white/90">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-[#b8dcd4] bg-[#fdfbf7] py-20">
          <div className="mx-auto max-w-[820px] px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5fa898]">תשובות כנות</p>
              <h2 className="text-3xl font-black text-[#1d3a35] md:text-4xl">לשאלות שמתביישים לשאול</h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-[#b8dcd4] bg-white p-5 transition-shadow open:shadow-md">
                  <summary className="cursor-pointer list-none text-base font-bold text-[#1d3a35] marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      <span>{f.q}</span>
                      <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#e9f4f1] text-[#5fa898] transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#2d4a44]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[900px] rounded-3xl bg-gradient-to-br from-[#e9f4f1] to-[#fdfbf7] px-6 py-14 text-center md:px-12">
            <h2 className="mb-4 text-3xl font-black text-[#1d3a35] md:text-4xl">מוכנים לחזור ללכת בלי כאב?</h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[#2d4a44]">
              אשמח לקבל אתכם לפגישת אבחון. שעות פעילות: {SITE.hoursDisplay}.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener" className="rounded-full bg-[#25d366] px-8 py-3.5 font-bold text-white shadow-md transition-transform hover:scale-105">קביעת תור בוואטסאפ</a>
              <a href={SITE.telUrl} className="rounded-full bg-[#5fa898] px-8 py-3.5 font-bold text-white shadow-md transition-transform hover:scale-105">חיוג ישיר</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
