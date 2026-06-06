import { useEffect, useMemo, useRef, useState } from "react";
import type { Article } from "@/lib/articles";
import { InArticleCTA } from "./InArticleCTA";
import clutchDiagram from "@/assets/article-clutch-diagram.jpg";
import clutchPlates from "@/assets/article-clutch-plates.jpg";
import clutchCableVsHydraulic from "@/assets/article-clutch-cable-vs-hydraulic.jpg";

/**
 * חוויה אינטראקטיבית למאמר "קלאץ' לחלוטין מתחילים".
 * מחליפה את ArticleBody עבור slug=clutch-explained-beginners.
 */
export function ClutchInteractive({ article }: { article: Article }) {
  return (
    <article className="max-w-[72ch] space-y-16">
      {/* HOOK */}
      <section className="border-r-4 border-[#e63000] bg-[#0d0d0d] p-6">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
          3 דקות, אפס ז'רגון
        </div>
        <h2 className="mb-3 text-2xl font-black leading-tight text-[#f0f0f0] md:text-3xl">
          תפסיק לקרוא. תתחיל ללחוץ.
        </h2>
        <p className="text-base font-bold leading-relaxed text-[#ccc]">
          הקלאץ' זה החלק היחיד באופנוע שאתה מרגיש פיזית בכל שנייה של רכיבה.
          במקום להסביר לך אותו במילים — תן לי להראות לך אותו. תלחץ, תסובב,
          תאבחן. בסוף תדע יותר מ-90% מהרוכבים.
        </p>
      </section>

      <ClutchSimulator />
      <AnatomyExplorer />
      <BitePointDemo />
      <SystemToggle />
      <TwoStrokeNote />
      <DiagnosisQuiz />
      <KillerHabits />
      <CostCalculator />

      {/* CTA */}
      <InArticleCTA />

      {/* FAQ */}
      {article.faqs && article.faqs.length > 0 && (
        <FaqAccordion items={article.faqs} />
      )}

      {/* GLOSSARY (compact) */}
      {article.glossary && article.glossary.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-black text-[#f0f0f0] md:text-3xl">
            מילון בזק
          </h2>
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {article.glossary.map((g, i) => (
              <div key={i} className="border-r-2 border-[#e63000] bg-[#0d0d0d] p-4">
                <dt className="mb-1 text-base font-black text-[#f0f0f0]">{g.term}</dt>
                <dd className="text-sm font-bold leading-relaxed text-[#bbb]">
                  {g.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}

/* ============================================================
   1. SIMULATOR — לחץ והרגש את הקלאץ'
   ============================================================ */
function ClutchSimulator() {
  const [pressed, setPressed] = useState(false);
  const [rpm, setRpm] = useState(1500);

  // המנוע תמיד מסתובב. הגלגל מסתובב רק כשהקלאץ' משוחרר.
  const wheelRpm = pressed ? 0 : rpm;

  return (
    <section className="rounded-none border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>סימולטור</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        איך הקלאץ' עובד? תלחץ עליו עכשיו
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        החזק את הכפתור = ידית הקלאץ' לחוצה (מנותק). תשחרר = הקלאץ' תופס (מחובר).
        תזוז את הסליידר כדי לשנות סיבובי מנוע.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
        {/* Discs */}
        <div className="flex flex-col items-center justify-center bg-black p-6">
          <div className="relative h-64 w-64">
            {/* Top disc — connected to engine */}
            <Disc
              rpm={rpm}
              label="מנוע"
              colorClass="bg-[#e63000]"
              style={{
                top: pressed ? "0" : "70px",
                transition: "top 400ms cubic-bezier(0.4,0,0.2,1)",
              }}
            />
            {/* Bottom disc — connected to wheel */}
            <Disc
              rpm={wheelRpm}
              label="גלגל"
              colorClass="bg-[#1a1a1a] border-2 border-[#444]"
              style={{ top: "120px" }}
            />
            {/* Gap indicator when pressed */}
            {pressed && (
              <div className="absolute right-1/2 top-[60px] translate-x-1/2 text-[10px] font-black text-[#e63000]">
                ← מנותק →
              </div>
            )}
          </div>

          <div
            className={`mt-6 inline-block px-4 py-2 text-sm font-black uppercase tracking-wider ${
              pressed
                ? "bg-[#e63000] text-white"
                : "bg-[#1a1a1a] text-[#0fdc7c] border border-[#0fdc7c]"
            }`}
          >
            {pressed ? "מנותק — הגלגל חופשי" : "מחובר — הכוח עובר"}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-stretch justify-center gap-4 md:w-56">
          <button
            type="button"
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              setPressed(true);
            }}
            onTouchEnd={() => setPressed(false)}
            className={`select-none border-2 px-6 py-8 text-center font-black uppercase tracking-wider transition ${
              pressed
                ? "scale-95 border-[#e63000] bg-[#e63000] text-white"
                : "border-[#444] bg-[#0d0d0d] text-[#f0f0f0] hover:border-[#e63000]"
            }`}
          >
            {pressed ? "מחזיק" : "החזק — לחיצת קלאץ'"}
          </button>

          <div>
            <div className="mb-2 flex justify-between text-xs font-black text-[#bbb]">
              <span>סיבובי מנוע</span>
              <span className="text-[#e63000]">{rpm.toLocaleString()} RPM</span>
            </div>
            <input
              type="range"
              min={800}
              max={8000}
              step={100}
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full accent-[#e63000]"
              aria-label="סיבובי מנוע"
            />
          </div>
        </div>
      </div>

      <p className="mt-6 border-r-2 border-[#e63000] bg-[#0d0d0d] p-3 text-sm font-bold text-[#ccc]">
        <strong className="text-[#f0f0f0]">שים לב:</strong> המנוע ממשיך להסתובב
        תמיד. הקלאץ' פשוט מחליט אם הסיבוב הזה מועבר לגלגל או לא. זה כל הקסם.
      </p>
    </section>
  );
}

function Disc({
  rpm,
  label,
  colorClass,
  style,
}: {
  rpm: number;
  label: string;
  colorClass: string;
  style?: React.CSSProperties;
}) {
  // duration in seconds for one rotation
  const duration = rpm > 0 ? 60 / rpm : 0;
  const animation =
    rpm > 0 ? `clutch-spin ${duration.toFixed(3)}s linear infinite` : "none";

  return (
    <div
      className="absolute right-1/2 translate-x-1/2"
      style={style}
    >
      <div
        className={`flex h-16 w-56 items-center justify-center ${colorClass}`}
        style={{ animation }}
      >
        <span className="text-xs font-black uppercase tracking-widest text-white">
          {label}
        </span>
      </div>
      <style>{`@keyframes clutch-spin { from { transform: rotateX(0deg);} to { transform: rotateX(360deg);} }`}</style>
    </div>
  );
}

/* ============================================================
   2. ANATOMY — לחץ על כל חלק כדי ללמוד
   ============================================================ */
const ANATOMY = [
  {
    id: "basket",
    name: "סל הקלאץ'",
    short: "מסתובב עם המנוע. תמיד.",
    long: "גלגל מתכת גדול שמחובר ישירות לארכובת המנוע. הוא הסיבוב שמגיע מהבעירה. בכל פעם שאתה ב-Neutral והמנוע עובד — הסל מסתובב.",
    color: "#e63000",
  },
  {
    id: "friction",
    name: "דיסקיות חיכוך",
    short: "החלק היחיד שמתבלה",
    long: "6-9 דיסקים חומים עם חומר חיכוך כמו של רפידות בלם. הם נכנסים לתוך השיניים של הסל וזזים יחד איתו. אלה הדיסקים שצריך להחליף.",
    color: "#cc8844",
  },
  {
    id: "steel",
    name: "דיסקיות מתכת",
    short: "מתחלפות עם החיכוך",
    long: "5-8 דיסקים מתכתיים חלקים, שזורים בין דיסקיות החיכוך. הם מחוברים לציר היציאה (זה שמוביל לגלגל). בלאי נמוך.",
    color: "#888",
  },
  {
    id: "pressure",
    name: "צלחת לחץ",
    short: "סוגרת את כל הערימה",
    long: "דיסק עבה שיושב למעלה ולוחץ את כל ערימת הדיסקיות יחד. כשאתה מושך את הידית — הצלחת הזו מורמת, והדיסקיות משתחררות.",
    color: "#666",
  },
  {
    id: "springs",
    name: "קפיצים",
    short: "הכוח שמחזיק הכל",
    long: "5-6 קפיצים שדוחפים את צלחת הלחץ כלפי מטה. הם מה שיוצר את 'החיבור'. אם הם חלשו — הקלאץ' יחליק גם אחרי החלפת דיסקיות.",
    color: "#0fdc7c",
  },
];

function AnatomyExplorer() {
  const [active, setActive] = useState(0);
  return (
    <section>
      <SectionLabel>אנטומיה</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        5 חלקים. זה הכל.
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        לחץ על כל שכבה כדי לראות מה היא עושה. מי שאומר לך שזה מסובך — מנסה לקחת ממך כסף.
      </p>

      <figure className="mb-6 overflow-hidden border border-[#222] bg-white">
        <img
          src={clutchDiagram}
          alt="שרטוט פיצוץ של מערכת קלאץ' אופנוע — סל, דיסקיות חיכוך, דיסקיות מתכת, צלחת לחץ וקפיצים על אותו ציר"
          loading="lazy"
          width={1024}
          height={1024}
          className="mx-auto block w-full max-w-[680px]"
        />
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] p-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#888]">
          ככה זה נראה מבפנים — חמש שכבות על ציר אחד
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        {/* Stack */}
        <div className="flex flex-col items-center gap-2 bg-black p-6">
          {ANATOMY.map((part, i) => {
            const isActive = active === i;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => setActive(i)}
                className={`w-full border-2 px-4 py-3 text-right font-black transition ${
                  isActive
                    ? "scale-105 border-white text-white shadow-[0_0_20px_rgba(230,48,0,0.5)]"
                    : "border-transparent text-white/90 hover:scale-[1.02]"
                }`}
                style={{
                  backgroundColor: part.color,
                  marginInline: `${i * 6}px`,
                }}
                aria-pressed={isActive}
              >
                <span className="text-[10px] font-black opacity-70">{i + 1}</span>
                <span className="mr-2 text-sm">{part.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detail card */}
        <div className="border border-[#222] bg-[#0d0d0d] p-6">
          <div
            className="mb-3 inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: ANATOMY[active].color }}
          >
            חלק {active + 1} מ-5
          </div>
          <h3 className="mb-2 text-xl font-black text-[#f0f0f0]">
            {ANATOMY[active].name}
          </h3>
          <p className="mb-4 text-base font-black text-[#e63000]">
            {ANATOMY[active].short}
          </p>
          <p className="text-base font-bold leading-relaxed text-[#ccc]">
            {ANATOMY[active].long}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. BITE POINT — נקודת ההתפסה
   ============================================================ */
function BitePointDemo() {
  const [pull, setPull] = useState(0); // 0=released, 100=fully pulled
  // bite point in mid range
  const state =
    pull < 35 ? "engaged" : pull < 65 ? "biting" : "disengaged";

  const stateInfo = {
    engaged: {
      label: "מחובר — נוסעים",
      color: "#0fdc7c",
      desc: "ידית משוחררת לגמרי. הדיסקיות נצמדות, כל הכוח עובר. זה המצב בנסיעה רגילה.",
    },
    biting: {
      label: "אזור הביניים — שורף!",
      color: "#e63000",
      desc: "כאן זה החלקה חלקית. שימוש קצר במקום (התנעה בעלייה) זה בסדר. החזקה ארוכה כאן = הקלאץ' שלך מת.",
    },
    disengaged: {
      label: "מנותק — חופשי",
      color: "#3b9eff",
      desc: "ידית לחוצה עד הסוף. הדיסקיות רחוקות אחת מהשנייה. אפס חיכוך, אפס בלאי.",
    },
  };

  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>נקודת ההתפסה</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        איפה הקלאץ' "תופס"?
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        תזוז את הסליידר כמו שאתה מושך את הידית. שים לב לאזור הכתום באמצע — שם הקלאץ' שורף.
      </p>

      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={100}
          value={pull}
          onChange={(e) => setPull(Number(e.target.value))}
          className="w-full accent-[#e63000]"
          aria-label="מצב ידית הקלאץ'"
        />
        <div className="mt-2 flex justify-between text-[10px] font-black uppercase tracking-wider text-[#888]">
          <span>משוחרר</span>
          <span>אזור שריפה</span>
          <span>לחוץ</span>
        </div>
      </div>

      {/* Visual bar */}
      <div className="relative mb-4 h-12 overflow-hidden border border-[#222]">
        <div className="absolute inset-y-0 right-0 w-[35%] bg-[#0fdc7c]/30" />
        <div className="absolute inset-y-0 right-[35%] w-[30%] bg-[#e63000]/40" />
        <div className="absolute inset-y-0 right-[65%] w-[35%] bg-[#3b9eff]/30" />
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-[0_0_10px_white]"
          style={{ right: `calc(${pull}% - 2px)`, transition: "right 50ms linear" }}
        />
      </div>

      <div
        className="border-r-4 p-4"
        style={{ borderColor: stateInfo[state].color, backgroundColor: "#0d0d0d" }}
      >
        <div
          className="mb-2 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white"
          style={{ backgroundColor: stateInfo[state].color }}
        >
          {stateInfo[state].label}
        </div>
        <p className="text-sm font-bold leading-relaxed text-[#ccc]">
          {stateInfo[state].desc}
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   4. SYSTEM TOGGLE — כבל מול הידראולי
   ============================================================ */
function SystemToggle() {
  const [pressed, setPressed] = useState(false);
  return (
    <section>
      <SectionLabel>סוג המערכת באופנוע שלך</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        רגע — איך היד שלך בכלל מגיעה לקלאץ'?
      </h2>

      <div className="mb-5 border-r-4 border-[#e63000] bg-[#0d0d0d] p-4">
        <p className="mb-2 text-base font-bold leading-relaxed text-[#ccc]">
          עד עכשיו ראית מה קורה <strong className="text-white">בתוך המנוע</strong> —
          הדיסקיות נצמדות ומתרחקות. אבל היד שלך נמצאת על הכידון, חצי מטר משם.
        </p>
        <p className="text-base font-bold leading-relaxed text-[#ccc]">
          איך הלחיצה שלך מגיעה עד לשם? זה תפקיד <strong className="text-[#e63000]">המנגנון
          המעביר</strong>, והוא מגיע באחד משני סוגים בלבד — לכל אופנוע יש את אחד מהם
          מהמפעל.
        </p>
      </div>

      <p className="mb-4 text-sm font-bold text-[#888]">
        מצא את הדגם שלך בטבלה כדי לדעת מה יש לך. לחץ על הכפתור כדי לראות איך
        כל מערכת מעבירה פיזית את הלחיצה שלך מהיד עד לדיסקיות.
      </p>

      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            setPressed(true);
          }}
          onTouchEnd={() => setPressed(false)}
          className={`select-none border-2 px-6 py-3 text-sm font-black uppercase tracking-wider transition ${
            pressed
              ? "scale-95 border-[#e63000] bg-[#e63000] text-white"
              : "border-[#444] bg-[#0d0d0d] text-[#f0f0f0] hover:border-[#e63000]"
          }`}
        >
          {pressed ? "ידית לחוצה — צפה במנגנון" : "החזק כדי לראות איך זה עובד"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SystemCard
          accent="#f5a623"
          title="כבל פיזי"
          subtitle="הכוח עובר בכבל פלדה"
          diagram={<CableDiagram pressed={pressed} />}
          examples="Yamaha YZ/WR, Honda CRF, Kawasaki KX"
          feel="כבדה, פיזית — מרגישים את הקפיצים"
          maintenance="שימון כל 20 שעות, כיוון כל 10"
          breaks="כבל נקרע באמצע רכיבה"
          field="אפשר לתקן בשטח אם יש חלקי חילוף"
          cost="120–250 ₪"
          pro="אמין, פשוט, זול"
          con="דורש תחזוקה שוטפת"
        />
        <SystemCard
          accent="#3b9eff"
          title="הידראולי (שמן)"
          subtitle="הכוח עובר בנוזל בצינור"
          diagram={<HydraulicDiagram pressed={pressed} />}
          examples="KTM EXC/SX, Husqvarna FE/TE, GasGas, Beta"
          feel="קלה, חלקה, אחידה"
          maintenance="בדיקת שמן פעם בשנה"
          breaks="אטמים דולפים, אוויר במערכת"
          field="כמעט בלתי אפשרי בשטח"
          cost="400–900 ₪"
          pro="אפס תחזוקה, הרגשה מצוינת"
          con="תקלה = סוף הרכיבה"
        />
      </div>

      <figure className="mt-6 overflow-hidden border border-[#222]">
        <img
          src={clutchCableVsHydraulic}
          alt="השוואה ויזואלית בין קלאץ' כבל (כבל פלדה עם מכוון) לבין קלאץ' הידראולי (משאבה ראשית עם מכל שמן וצינור)"
          loading="lazy"
          width={1536}
          height={896}
          className="block w-full"
        />
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] p-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#888]">
          משמאל: כבל פלדה ומכוון · מימין: משאבה הידראולית וצינור שמן
        </figcaption>
      </figure>
    </section>
  );
}

/* ============================================================
   4b. TWO-STROKE NOTE — האם לאופנוע 2 פעימות יש קלאץ' שונה?
   ============================================================ */
function TwoStrokeNote() {
  const [side, setSide] = useState<"4t" | "2t">("4t");
  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>2 פעימות מול 4 פעימות</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        יש לי 2 פעימות — הקלאץ' שלי שונה?
      </h2>
      <p className="mb-5 text-base font-bold text-[#bbb]">
        שאלה נפוצה. התשובה הקצרה: <strong className="text-white">לא</strong>.
        אותם 5 חלקים, אותו עיקרון, גם רטוב בשמן. ההבדל היחיד הוא{" "}
        <strong className="text-[#e63000]">מאיפה מגיע השמן שמקרר את הקלאץ'</strong>.
      </p>

      {/* Toggle */}
      <div className="mb-5 inline-flex border-2 border-[#333]">
        {(["4t", "2t"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSide(k)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
              side === k
                ? "bg-[#e63000] text-white"
                : "bg-[#0d0d0d] text-[#888] hover:text-white"
            }`}
          >
            {k === "4t" ? "4 פעימות" : "2 פעימות"}
          </button>
        ))}
      </div>

      {/* Diagram */}
      <div className="mb-5 bg-black p-4">
        <OilFlowDiagram twoStroke={side === "2t"} />
      </div>

      {/* Comparison rows */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="border-r-2 border-[#888] bg-[#0d0d0d] p-4">
          <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#888]">
            4 פעימות
          </div>
          <div className="mb-2 text-sm font-black text-[#f0f0f0]">
            Honda CRF, Yamaha WR/YZF, KTM EXC-F
          </div>
          <p className="text-sm font-bold leading-relaxed text-[#bbb]">
            יש <strong className="text-white">סוג שמן אחד בלבד</strong> באופנוע —
            שמן המנוע. הוא משמן ומקרר גם את המנוע, גם את תיבת ההילוכים וגם את
            הקלאץ'. החלפת שמן מנוע = גם הקלאץ' קיבל שמן חדש. בדרך כלל כל 15–30 שעות.
          </p>
        </div>
        <div className="border-r-2 border-[#e63000] bg-[#0d0d0d] p-4">
          <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            2 פעימות
          </div>
          <div className="mb-2 text-sm font-black text-[#f0f0f0]">
            KTM 250/300 EXC, Husqvarna TE, Beta RR 2T
          </div>
          <p className="text-sm font-bold leading-relaxed text-[#bbb]">
            יש <strong className="text-white">שני סוגי שמן שונים</strong>: המנוע
            עצמו משומן בתערובת דלק-שמן (שמן 2T שמתערבב בדלק ונשרף בבעירה), ובנפרד
            יש <strong className="text-white">שמן תיבת הילוכים</strong> ייעודי
            (Gear Oil) שיושב במאגר קטן ומקרר את הקלאץ'. זה לא שמן מנוע — זה שמן
            אחר לגמרי, וקונים אותו בבקבוק נפרד.
          </p>
        </div>
      </div>

      {/* Bottom callout */}
      <div className="mt-5 border-r-4 border-[#e63000] bg-[#0d0d0d] p-4">
        <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
          המסקנה המעשית
        </div>
        <p className="text-base font-bold leading-relaxed text-[#f0f0f0]">
          ב-2 פעימות אתה חייב להחליף את{" "}
          <strong className="text-[#e63000]">שמן תיבת ההילוכים כל 15–20 שעות</strong>.
          זה לא המלצה — זו חובה. שמן שרוף = קלאץ' שמחליק = החלפת חבילה ב-1,500 ₪.
        </p>
      </div>
    </section>
  );
}

function OilFlowDiagram({ twoStroke }: { twoStroke: boolean }) {
  // RTL canvas — engine on the right, gearbox on the left
  return (
    <svg
      viewBox="0 0 360 180"
      className="mx-auto block w-full max-w-md"
      role="img"
      aria-label={
        twoStroke
          ? "באופנוע 2 פעימות, תיבת ההילוכים והקלאץ' משתמשים בשמן נפרד מהמנוע"
          : "באופנוע 4 פעימות, המנוע ותיבת ההילוכים חולקים את אותו השמן"
      }
    >
      {/* Engine block (right) */}
      <rect x="230" y="25" width="100" height="100" fill="#1a1a1a" stroke="#444" strokeWidth="2" />
      <text x="280" y="17" fill="#888" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">
        מנוע
      </text>
      {/* Engine oil */}
      <rect
        x="234"
        y={twoStroke ? 90 : 70}
        width="92"
        height={twoStroke ? 31 : 51}
        fill={twoStroke ? "#7a5a1a" : "#f5a623"}
        opacity={twoStroke ? 0.6 : 1}
      />
      {twoStroke && (
        <text x="280" y="110" fill="#fff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">
          תערובת
        </text>
      )}

      {/* Gearbox + clutch (left) */}
      <rect x="30" y="25" width="160" height="100" fill="#1a1a1a" stroke="#444" strokeWidth="2" />
      <text x="110" y="17" fill="#888" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">
        תיבת הילוכים + קלאץ'
      </text>
      {/* Gearbox oil */}
      <rect x="34" y="70" width="152" height="51" fill={twoStroke ? "#e63000" : "#f5a623"} />
      <text x="110" y="100" fill="#fff" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">
        {twoStroke ? "שמן נפרד" : "אותו שמן"}
      </text>

      {/* Connector between blocks */}
      {twoStroke ? (
        <line x1="190" y1="75" x2="230" y2="75" stroke="#444" strokeWidth="3" strokeDasharray="4 4" />
      ) : (
        <rect x="190" y="70" width="40" height="51" fill="#f5a623" />
      )}

      {/* Legend dot */}
      <circle cx="20" cy="160" r="5" fill="#e63000" />
      <text x="32" y="164" fill="#bbb" fontSize="10" fontWeight="700" fontFamily="Heebo, sans-serif">
        {twoStroke ? "שמן תיבת הילוכים נפרד" : "שמן משותף למנוע ולקלאץ'"}
      </text>
    </svg>
  );
}

function SystemCard({
  accent,
  title,
  subtitle,
  diagram,
  examples,
  feel,
  maintenance,
  breaks,
  field,
  cost,
  pro,
  con,
}: {
  accent: string;
  title: string;
  subtitle: string;
  diagram: React.ReactNode;
  examples: string;
  feel: string;
  maintenance: string;
  breaks: string;
  field: string;
  cost: string;
  pro: string;
  con: string;
}) {
  return (
    <div
      className="flex flex-col border-2 bg-[#0a0a0a]"
      style={{ borderColor: accent }}
    >
      <div className="border-b border-[#222] p-4">
        <div
          className="mb-2 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black"
          style={{ backgroundColor: accent }}
        >
          {title}
        </div>
        <div className="text-sm font-bold text-[#ccc]">{subtitle}</div>
      </div>

      <div className="border-b border-[#222] bg-black p-4">{diagram}</div>

      <dl className="divide-y divide-[#1a1a1a]">
        <CardRow label="דגמים נפוצים" value={examples} />
        <CardRow label="הרגשה ביד" value={feel} />
        <CardRow label="תחזוקה" value={maintenance} />
        <CardRow label="מה נשבר" value={breaks} />
        <CardRow label="תיקון בשטח" value={field} />
        <CardRow label="עלות החלפה" value={cost} accent={accent} />
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-px bg-[#1a1a1a]">
        <div className="bg-[#0d0d0d] p-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#0fdc7c]">
            יתרון
          </div>
          <div className="mt-1 text-xs font-bold text-[#ccc]">{pro}</div>
        </div>
        <div className="bg-[#0d0d0d] p-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            חיסרון
          </div>
          <div className="mt-1 text-xs font-bold text-[#ccc]">{con}</div>
        </div>
      </div>
    </div>
  );
}

function CardRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 p-3">
      <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-[#888]">
        {label}
      </span>
      <span
        className="text-right text-xs font-black"
        style={{ color: accent ?? "#f0f0f0" }}
      >
        {value}
      </span>
    </div>
  );
}

/* SVG mechanism diagrams — same canvas size, RTL-friendly */
function CableDiagram({ pressed }: { pressed: boolean }) {
  // RTL: lever on the right, clutch on the left. Pressing the lever pulls the cable toward the right hand, releasing the rod on the left.
  const leverAngle = pressed ? -28 : 0;
  const cablePull = pressed ? 16 : 0;
  const rodPull = pressed ? 14 : 0;
  return (
    <svg viewBox="0 0 320 130" className="w-full" aria-label="דיאגרמה: ידית מושכת כבל פלדה שמושך מוט בקלאץ'">
      {/* clutch housing on the left */}
      <rect x="10" y="50" width="50" height="40" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
      <text x="35" y="105" fill="#888" fontSize="9" textAnchor="middle" fontWeight="700">קלאץ'</text>
      {/* push rod */}
      <rect x={60 - rodPull} y="65" width="40" height="10" fill="#f5a623" />
      {/* cable */}
      <line
        x1={100 - rodPull}
        y1="70"
        x2={260 - cablePull}
        y2="70"
        stroke="#bbb"
        strokeWidth="3"
      />
      {/* cable adjuster barrel */}
      <rect x="160" y="64" width="20" height="12" fill="#888" stroke="#444" />
      {/* lever pivot */}
      <circle cx="270" cy="70" r="5" fill="#444" stroke="#666" />
      {/* lever */}
      <g transform={`rotate(${leverAngle} 270 70)`} style={{ transition: "transform 200ms" }}>
        <rect x="270" y="66" width="40" height="8" fill="#f5a623" rx="2" />
      </g>
      <text x="290" y="105" fill="#888" fontSize="9" textAnchor="middle" fontWeight="700">ידית</text>
      {/* arrow showing direction */}
      {pressed && (
        <>
          <text x="160" y="55" fill="#f5a623" fontSize="9" textAnchor="middle" fontWeight="900">
            ← הכבל נמשך
          </text>
        </>
      )}
    </svg>
  );
}

function HydraulicDiagram({ pressed }: { pressed: boolean }) {
  const leverAngle = pressed ? -28 : 0;
  const masterPiston = pressed ? 8 : 0;
  const slavePush = pressed ? 14 : 0;
  return (
    <svg viewBox="0 0 320 130" className="w-full" aria-label="דיאגרמה: ידית דוחפת בוכנה במשאבה, השמן בצינור מעביר את הלחץ לבוכנה בקלאץ'">
      {/* slave cylinder + clutch on the left */}
      <rect x="10" y="50" width="50" height="40" fill="#1a1a1a" stroke="#444" strokeWidth="1.5" />
      <text x="35" y="105" fill="#888" fontSize="9" textAnchor="middle" fontWeight="700">קלאץ'</text>
      {/* slave piston */}
      <rect x={60 - slavePush} y="62" width="14" height="16" fill="#3b9eff" />
      {/* hose with fluid */}
      <path
        d="M 74 70 Q 130 50 180 70 T 250 70"
        fill="none"
        stroke="#3b9eff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 74 70 Q 130 50 180 70 T 250 70"
        fill="none"
        stroke="#1a3a5a"
        strokeWidth="2"
        strokeDasharray="4 3"
        style={{
          strokeDashoffset: pressed ? -20 : 0,
          transition: "stroke-dashoffset 300ms linear",
        }}
      />
      {/* master cylinder + reservoir */}
      <rect x="240" y="58" width="22" height="24" fill="#2a2a2a" stroke="#444" />
      <rect x="244" y="42" width="14" height="16" fill="#2a2a2a" stroke="#444" />
      <rect x={250 - masterPiston} y="63" width="10" height="14" fill="#3b9eff" />
      {/* lever pivot */}
      <circle cx="270" cy="70" r="5" fill="#444" stroke="#666" />
      <g transform={`rotate(${leverAngle} 270 70)`} style={{ transition: "transform 200ms" }}>
        <rect x="270" y="66" width="40" height="8" fill="#3b9eff" rx="2" />
      </g>
      <text x="290" y="105" fill="#888" fontSize="9" textAnchor="middle" fontWeight="700">ידית</text>
      {pressed && (
        <text x="160" y="40" fill="#3b9eff" fontSize="9" textAnchor="middle" fontWeight="900">
          ← השמן זורם בלחץ
        </text>
      )}
    </svg>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border p-3 ${
        highlight
          ? "border-[#e63000] bg-[#1a0a05]"
          : "border-[#222] bg-[#0d0d0d]"
      }`}
    >
      <div className="text-[10px] font-black uppercase tracking-widest text-[#888]">
        {label}
      </div>
      <div
        className={`mt-1 text-sm font-black ${
          highlight ? "text-[#e63000]" : "text-[#f0f0f0]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* ============================================================
   5. DIAGNOSIS QUIZ — הקלאץ' שלך בריא?
   ============================================================ */
const QUESTIONS = [
  "בעלייה תלולה, הסיבובים עולים אבל המהירות לא מדביקה?",
  "נקודת ההתפסה זזה לקצה השחרור (היה באמצע, עכשיו בסוף)?",
  "ריח שרוף עדין אחרי 20–30 דק' רכיבה טכנית?",
  "כשאתה לוחץ קלאץ' מלא בהילוך — האופנוע 'קופץ' או זז?",
  "ידית הקלאץ' מרגישה רכה / ספוגית / חזרה איטית?",
];

function DiagnosisQuiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const score = answers.filter((a) => a === true).length;
  const answered = answers.every((a) => a !== null);

  const verdict = useMemo(() => {
    if (!answered) return null;
    if (score === 0)
      return {
        color: "#0fdc7c",
        title: "הקלאץ' שלך בריא",
        text: "אין סימני שחיקה. תמשיך עם החלפות שמן בזמן, ואל תחזיק את הידית באזור הביניים.",
      };
    if (score <= 2)
      return {
        color: "#f5a623",
        title: "תקשיב אליו — מתחיל להישחק",
        text: "סימן ראשון. עוד אין סכנה אבל הגיע הזמן להזמין דיסקיות חיכוך (280–650 ₪) ולקבוע במוסך לעוד חודש-חודשיים.",
      };
    return {
      color: "#e63000",
      title: "החלף עכשיו",
      text: "מספר סימנים בו-זמנית = הקלאץ' עומד לעזוב. אל תיתקע בשטח. קבע החלפת דיסקיות השבוע (700–1,400 ₪ לסט מלא במוסך).",
    };
  }, [answered, score]);

  function setAnswer(i: number, val: boolean) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  function reset() {
    setAnswers(Array(QUESTIONS.length).fill(null));
  }

  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>אבחון עצמי</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        הקלאץ' שלך עומד למות?
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        5 שאלות, 30 שניות. כן/לא. אל תשקר לעצמך.
      </p>

      <ol className="space-y-3">
        {QUESTIONS.map((q, i) => (
          <li key={i} className="border border-[#222] bg-[#0d0d0d] p-4">
            <div className="mb-3 flex gap-3 text-base font-bold text-[#ccc]">
              <span className="text-[#e63000]">{i + 1}.</span>
              <span>{q}</span>
            </div>
            <div className="flex gap-2">
              <QuizButton
                active={answers[i] === true}
                onClick={() => setAnswer(i, true)}
                variant="yes"
              >
                כן
              </QuizButton>
              <QuizButton
                active={answers[i] === false}
                onClick={() => setAnswer(i, false)}
                variant="no"
              >
                לא
              </QuizButton>
            </div>
          </li>
        ))}
      </ol>

      {verdict && (
        <div
          className="mt-6 border-r-4 bg-[#0d0d0d] p-5"
          style={{ borderColor: verdict.color }}
        >
          <div
            className="mb-2 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: verdict.color }}
          >
            {score}/5 סימנים
          </div>
          <h3 className="mb-2 text-xl font-black text-[#f0f0f0]">
            {verdict.title}
          </h3>
          <p className="mb-3 text-sm font-bold leading-relaxed text-[#ccc]">
            {verdict.text}
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-black uppercase tracking-wider text-[#e63000] underline"
          >
            איפוס
          </button>
        </div>
      )}
    </section>
  );
}

function QuizButton({
  active,
  onClick,
  variant,
  children,
}: {
  active: boolean;
  onClick: () => void;
  variant: "yes" | "no";
  children: React.ReactNode;
}) {
  const activeColor =
    variant === "yes"
      ? "bg-[#e63000] border-[#e63000] text-white"
      : "bg-[#0fdc7c] border-[#0fdc7c] text-black";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border-2 px-4 py-2 text-sm font-black uppercase tracking-wider transition ${
        active
          ? activeColor
          : "border-[#333] bg-transparent text-[#ccc] hover:border-[#666]"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   6. KILLER HABITS — עם heat meter אנימטיבי
   ============================================================ */
const HABITS = [
  {
    icon: "🖐️",
    title: "Riding the clutch",
    desc: "להחזיק את הידית לחוצה חלקית במשך שניות. כל שנייה באזור הביניים = חום שמכלה את החיכוך.",
    heat: 95,
  },
  {
    icon: "⛰️",
    title: "להתחיל עליות בהילוך גבוה",
    desc: "במקום להחליף לשני ולתת למנוע לעבוד — משחררים את הקלאץ' לאט בשלישי. החלקה רצופה.",
    heat: 80,
  },
  {
    icon: "🦶",
    title: "להישען על דוושת ההילוכים",
    desc: "הדוושה לוחצת על הסליל, הסליל לוחץ קלות על הקלאץ'. בלאי שקט שאתה לא מרגיש.",
    heat: 50,
  },
  {
    icon: "🛢️",
    title: "לדלג על החלפת שמן",
    desc: "השמן הוא הקירור היחיד. אנדורו = החלפה כל 15–20 שעות מנוע. אחרת הקלאץ' מתבלה פי 2.",
    heat: 90,
  },
];

function KillerHabits() {
  return (
    <section>
      <SectionLabel>טעויות</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        4 הרגלים שהורגים קלאץ' פי 2
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        אם תפסיק לעשות אותם — הקלאץ' שלך יחיה פי 2 לפחות. בלי הגזמה.
      </p>

      <figure className="mb-6 overflow-hidden border border-[#222]">
        <img
          src={clutchPlates}
          alt="ערימת דיסקיות חיכוך ודיסקיות מתכת של קלאץ' אופנוע שהוצאו מהמנוע, מונחות על שולחן עבודה עם שמן מנוע נוטף"
          loading="lazy"
          width={1024}
          height={1024}
          className="block w-full"
        />
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] p-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#888]">
          ככה נראית ערימת הדיסקיות אחרי שהוציאו אותה מהמנוע
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {HABITS.map((h) => (
          <div
            key={h.title}
            className="group border border-[#222] bg-[#0d0d0d] p-5 transition hover:border-[#e63000]"
          >
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-2xl" aria-hidden>
                {h.icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">
                רמת נזק
              </span>
            </div>
            <h3 className="mb-2 text-lg font-black text-[#f0f0f0]">
              {h.title}
            </h3>
            <p className="mb-4 text-sm font-bold leading-relaxed text-[#bbb]">
              {h.desc}
            </p>
            <HeatBar value={h.heat} />
          </div>
        ))}
      </div>
    </section>
  );
}

function HeatBar({ value }: { value: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setWidth(value);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="relative h-3 overflow-hidden bg-[#1a1a1a]">
      <div
        className="h-full bg-gradient-to-l from-[#e63000] via-[#f5a623] to-[#0fdc7c]"
        style={{
          width: `${width}%`,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

/* ============================================================
   7. COST CALCULATOR — DIY מול מוסך
   ============================================================ */
function CostCalculator() {
  const [scope, setScope] = useState<"discs" | "full">("discs");
  const [where, setWhere] = useState<"diy" | "shop">("shop");

  const prices = {
    discs: { parts: [280, 650], labor: [350, 600] },
    full: { parts: [700, 1400], labor: [500, 900] },
  };
  const p = prices[scope];

  const total =
    where === "diy"
      ? p.parts
      : ([p.parts[0] + p.labor[0], p.parts[1] + p.labor[1]] as [number, number]);

  const savings =
    where === "diy"
      ? [p.labor[0], p.labor[1]]
      : null;

  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>כמה זה יעלה</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        מחשבון החלפת קלאץ'
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        בחר מה אתה מחליף ואיפה, ותראה את הטווח המדויק.
      </p>

      <div className="mb-4">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#888]">
          מה מחליפים
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ToggleCard
            active={scope === "discs"}
            onClick={() => setScope("discs")}
            title="דיסקיות חיכוך בלבד"
            sub="90% מהמקרים"
          />
          <ToggleCard
            active={scope === "full"}
            onClick={() => setScope("full")}
            title="סט מלא"
            sub="חיכוך + מתכת + קפיצים"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#888]">
          איפה
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ToggleCard
            active={where === "diy"}
            onClick={() => setWhere("diy")}
            title="עושה בבית"
            sub="90 דק' עבודה"
          />
          <ToggleCard
            active={where === "shop"}
            onClick={() => setWhere("shop")}
            title="במוסך"
            sub="ללא טרחה"
          />
        </div>
      </div>

      <div className="border-2 border-[#e63000] bg-black p-6 text-center">
        <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
          סך הכל
        </div>
        <div className="text-4xl font-black text-[#f0f0f0] md:text-5xl">
          {total[0]}–{total[1]} ₪
        </div>
        {savings && (
          <div className="mt-3 inline-block bg-[#0fdc7c] px-3 py-1 text-xs font-black uppercase tracking-wider text-black">
            חוסך {savings[0]}–{savings[1]} ₪ על עבודה
          </div>
        )}
      </div>
    </section>
  );
}

function ToggleCard({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 p-4 text-right transition ${
        active
          ? "border-[#e63000] bg-[#1a0a05]"
          : "border-[#222] bg-[#0d0d0d] hover:border-[#444]"
      }`}
    >
      <div
        className={`text-sm font-black ${
          active ? "text-[#e63000]" : "text-[#f0f0f0]"
        }`}
      >
        {title}
      </div>
      <div className="mt-1 text-[11px] font-bold text-[#888]">{sub}</div>
    </button>
  );
}

/* ============================================================
   FAQ Accordion
   ============================================================ */
function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section>
      <SectionLabel>שאלות נפוצות</SectionLabel>
      <h2 id="faq" className="mb-4 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        עוד שאלות שעלו לך?
      </h2>
      <dl className="space-y-2">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border border-[#222] bg-[#0d0d0d]">
              <dt>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-right text-base font-black text-[#f0f0f0] hover:bg-[#111]"
                  aria-expanded={isOpen}
                >
                  <span>{f.q}</span>
                  <span
                    aria-hidden
                    className={`text-[#e63000] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </dt>
              {isOpen && (
                <dd className="border-t border-[#222] p-4 text-base font-bold leading-relaxed text-[#ccc]">
                  {f.a}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
      {children}
    </div>
  );
}