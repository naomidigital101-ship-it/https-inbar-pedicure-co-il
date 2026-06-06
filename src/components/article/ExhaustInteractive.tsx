import { useEffect, useMemo, useRef, useState } from "react";
import type { Article } from "@/lib/articles";
import { InArticleCTA } from "./InArticleCTA";
import diagramImg from "@/assets/article-exhaust-diagram.jpg";
import packingImg from "@/assets/article-exhaust-packing.jpg";
import dentImg from "@/assets/article-exhaust-dent.jpg";

/**
 * חוויה אינטראקטיבית למאמר "אגזוז למתחילים".
 * מחליפה את ArticleBody עבור slug=exhaust-explained-beginners.
 */
export function ExhaustInteractive({ article }: { article: Article }) {
  return (
    <article className="max-w-[72ch] space-y-16">
      {/* HOOK */}
      <section className="border-r-4 border-[#e63000] bg-[#0d0d0d] p-6">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
          4 דקות, אפס ז'רגון
        </div>
        <h2 className="mb-3 text-2xl font-black leading-tight text-[#f0f0f0] md:text-3xl">
          האגזוז זה לא רק "צינור עשן".
        </h2>
        <p className="text-base font-bold leading-relaxed text-[#ccc]">
          המנוע נושם דרך האגזוז כמו שאתה נושם דרך הפה. אם החור קטן מדי, ארוך
          מדי, או יש בו שקיעה — המנוע נחנק ומפסיד כוח. תלחץ, תזיז, תאבחן. תבין
          למה אגזוז של KTM 300 נראה כמו שהוא נראה.
        </p>
      </section>

      <BreathingSimulator />
      <AnatomyExplorer />
      <TwoStrokeFourStrokeToggle />
      <DentImpactDemo />
      <PackingHealthQuiz />
      <UpgradeCompare />
      <CostCalculator />

      <InArticleCTA />

      {article.faqs && article.faqs.length > 0 && (
        <FaqAccordion items={article.faqs} />
      )}

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
   1. BREATHING SIMULATOR — המנוע נושם
   ============================================================ */
function BreathingSimulator() {
  const [rpm, setRpm] = useState(3000);
  // duration of one cycle in ms — faster RPM = faster puffs
  const duration = Math.max(60, 30000 / rpm);
  const litersPerMin = Math.round((rpm / 9000) * 900);
  const tempC = 450 + Math.round((rpm / 9000) * 350);

  return (
    <section className="rounded-none border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>סימולטור</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        המנוע נושף — וכמה הוא נושף?
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        תזיז את הסליידר. ככל שהסיבובים עולים — גזי השריפה יוצאים מהר יותר, חמים
        יותר, ובכמויות שיותר קשה לתפוס. זה למה האגזוז הוא לא "אביזר".
      </p>

      <div className="bg-black p-4">
        <svg viewBox="0 0 360 140" className="mx-auto block w-full max-w-md" aria-label="גזי שריפה יוצאים מהמנוע דרך האגזוז">
          {/* engine block (right) */}
          <rect x="290" y="40" width="60" height="70" fill="#1a1a1a" stroke="#444" strokeWidth="2" />
          <text x="320" y="32" fill="#888" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">מנוע</text>
          {/* exhaust pipe */}
          <rect x="40" y="65" width="250" height="20" fill="#2a2a2a" stroke="#444" strokeWidth="1.5" />
          {/* silencer */}
          <rect x="10" y="58" width="40" height="34" fill="#1a1a1a" stroke="#666" strokeWidth="2" />
          <text x="30" y="108" fill="#888" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">סיילנסר</text>

          {/* gas puffs animation */}
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              r="6"
              fill="#e63000"
              opacity="0.7"
            >
              <animate
                attributeName="cx"
                from="285"
                to="0"
                dur={`${duration * 4}ms`}
                begin={`${i * duration}ms`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="75;75"
                dur={`${duration * 4}ms`}
                begin={`${i * duration}ms`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0.8;0"
                dur={`${duration * 4}ms`}
                begin={`${i * duration}ms`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="4;9;14"
                dur={`${duration * 4}ms`}
                begin={`${i * duration}ms`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <InfoTile label="סיבובי מנוע" value={`${rpm.toLocaleString()} RPM`} accent />
        <InfoTile label="גזים בדקה" value={`${litersPerMin} ליטר`} />
        <InfoTile label="טמפרטורה" value={`${tempC}°C`} />
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={1000}
          max={9000}
          step={100}
          value={rpm}
          onChange={(e) => setRpm(Number(e.target.value))}
          className="w-full accent-[#e63000]"
          aria-label="סיבובי מנוע"
        />
        <div className="mt-1 flex justify-between text-[10px] font-black uppercase tracking-wider text-[#888]">
          <span>סרק</span>
          <span>רכיבה</span>
          <span>פול גז</span>
        </div>
      </div>

      <p className="mt-6 border-r-2 border-[#e63000] bg-[#0d0d0d] p-3 text-sm font-bold text-[#ccc]">
        <strong className="text-[#f0f0f0]">הפואנטה:</strong> מנוע 4 פעימות 250
        סמ"ק בפול גז מעביר סדר גודל של 900 ליטר אוויר וגזי שריפה בדקה
        בטמפרטורה של 500-700°C (במנוע 2 פעימות באותו נפח, הכמות כפולה). צינור
        צר מדי, סדק קטן, או פאקינג סתום — והמנוע מאבד יכולת לפנות את הגזים
        האלה במהירות.
      </p>
    </section>
  );
}

function InfoTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border p-3 ${accent ? "border-[#e63000] bg-[#1a0a05]" : "border-[#222] bg-[#0d0d0d]"}`}>
      <div className="text-[10px] font-black uppercase tracking-widest text-[#888]">{label}</div>
      <div className={`mt-1 text-base font-black ${accent ? "text-[#e63000]" : "text-[#f0f0f0]"}`}>{value}</div>
    </div>
  );
}

/* ============================================================
   2. ANATOMY EXPLORER — 3 חלקים
   ============================================================ */
const ANATOMY = [
  {
    id: "header",
    name: "Header — צינור הראש",
    short: "הראשון, הכי חם, הכי חשוף",
    long: "צינור פלדה דק שיוצא ישר מהראש של המנוע. הכי קרוב לחום (עד 800°C) והכי קרוב לקרקע — מקבל את רוב המכות מאבנים. קובע באיזה קצב הגזים מתחילים לצאת.",
    color: "#e63000",
  },
  {
    id: "mid",
    name: "Mid Pipe — צינור האמצע",
    short: "ב-2T זה תא ההתפשטות",
    long: "במנוע 4 פעימות זה פשוט צינור מעבר. במנוע 2 פעימות זו ה'בטן' הבולטת — Expansion Chamber. הצורה הזו יוצרת גל לחץ שמדחס דלק טרי בחזרה לתא הבעור. שקיעה כאן = נפילה ישירה בהספק.",
    color: "#f5a623",
  },
  {
    id: "silencer",
    name: "Silencer — הסיילנסר",
    short: "מוריד רעש לרמת תקן (94 דציבל)",
    long: "החלק האחורי השמן. בתוכו צינור מנוקב עטוף בצמר זכוכית (פאקינג) שסופג את גלי הקול. הפאקינג הוא החלק היחיד שמתבלה ושצריך להחליף בקביעות.",
    color: "#3b9eff",
  },
];

function AnatomyExplorer() {
  const [active, setActive] = useState(0);
  return (
    <section>
      <SectionLabel>אנטומיה</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        3 חלקים. זה כל האגזוז.
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        כל אגזוז של אופנוע שטח בנוי משלושה חלקים שמתחברים בקליפסים. אפשר להחליף
        כל אחד בנפרד. לחץ על כל חלק.
      </p>

      <figure className="mb-6 overflow-hidden border border-[#222] bg-white">
        <img
          src={diagramImg}
          alt="שרטוט פיצוץ של אגזוז אופנוע שטח: צינור ראש, תא התפשטות וסיילנסר עם פאקינג בחתך"
          loading="lazy"
          width={1024}
          height={1024}
          className="mx-auto block w-full max-w-[680px]"
        />
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] p-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#888]">
          שלושת החלקים על ציר אחד — Header, Mid Pipe, Silencer
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-stretch gap-2 bg-black p-6">
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
                style={{ backgroundColor: part.color }}
                aria-pressed={isActive}
              >
                <span className="text-[10px] font-black opacity-70">{i + 1}</span>
                <span className="mr-2 text-sm">{part.name}</span>
              </button>
            );
          })}
        </div>

        <div className="border border-[#222] bg-[#0d0d0d] p-6">
          <div
            className="mb-3 inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: ANATOMY[active].color }}
          >
            חלק {active + 1} מ-3
          </div>
          <h3 className="mb-2 text-xl font-black text-[#f0f0f0]">{ANATOMY[active].name}</h3>
          <p className="mb-4 text-base font-black text-[#e63000]">{ANATOMY[active].short}</p>
          <p className="text-base font-bold leading-relaxed text-[#ccc]">{ANATOMY[active].long}</p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. 2T vs 4T TOGGLE
   ============================================================ */
function TwoStrokeFourStrokeToggle() {
  const [side, setSide] = useState<"4t" | "2t">("4t");

  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>2 פעימות מול 4 פעימות</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        למה לאגזוז של 2 פעימות יש "בטן"?
      </h2>
      <p className="mb-5 text-base font-bold text-[#bbb]">
        זה לא אסטטיקה. זו פיזיקה. לחץ כדי לראות את ההבדל.
      </p>

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

      <div className="mb-5 bg-black p-4">
        <PipeShapeDiagram twoStroke={side === "2t"} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="border-r-2 border-[#888] bg-[#0d0d0d] p-4">
          <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#888]">4 פעימות</div>
          <div className="mb-2 text-sm font-black text-[#f0f0f0]">KTM EXC-F, Husqvarna FE, Honda CRF-F</div>
          <p className="text-sm font-bold leading-relaxed text-[#bbb]">
            יש שסתום פליטה שנסגר אחרי שהגזים יצאו. הזרימה בכיוון אחד.
            הצינור פשוט — ארוך וצר עם הסיילנסר בקצה.
          </p>
        </div>
        <div className="border-r-2 border-[#e63000] bg-[#0d0d0d] p-4">
          <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#e63000]">2 פעימות</div>
          <div className="mb-2 text-sm font-black text-[#f0f0f0]">KTM EXC, Husqvarna TE, Beta RR 2T</div>
          <p className="text-sm font-bold leading-relaxed text-[#bbb]">
            אין שסתום פליטה — החור פתוח. דלק חדש כמעט בורח החוצה עם
            הגזים. ה<strong className="text-white">בטן</strong> יוצרת גל לחץ
            שמנתר אחורה ודוחף את הדלק חזרה לתוך תא הבעור. בלי הבטן הזו —
            מנוע 2T לא היה עובד בכלל.
          </p>
        </div>
      </div>
    </section>
  );
}

function PipeShapeDiagram({ twoStroke }: { twoStroke: boolean }) {
  return (
    <svg viewBox="0 0 360 140" className="mx-auto block w-full max-w-md" aria-label={twoStroke ? "אגזוז 2 פעימות עם תא התפשטות בולט" : "אגזוז 4 פעימות עם צינור ישר"}>
      {/* engine */}
      <rect x="300" y="45" width="50" height="60" fill="#1a1a1a" stroke="#444" strokeWidth="2" />
      <text x="325" y="38" fill="#888" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">מנוע</text>
      {/* header */}
      <rect x="220" y="68" width="80" height="14" fill="#e63000" />
      {/* mid pipe — varies */}
      {twoStroke ? (
        <path
          d="M 80 75 L 120 75 Q 140 75 145 60 L 175 30 Q 180 25 185 30 L 210 60 Q 215 75 220 75 Z"
          fill="#f5a623"
          stroke="#b87a18"
          strokeWidth="1"
          style={{ transition: "all 300ms" }}
        />
      ) : (
        <rect x="80" y="68" width="140" height="14" fill="#f5a623" style={{ transition: "all 300ms" }} />
      )}
      {/* silencer */}
      <rect x="20" y="58" width="60" height="34" fill="#3b9eff" stroke="#1d6ba8" strokeWidth="1" />
      {/* labels */}
      <text x="50" y="108" fill="#888" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">Silencer</text>
      <text x="150" y="108" fill="#888" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">{twoStroke ? "Expansion Chamber" : "Mid Pipe"}</text>
      <text x="260" y="108" fill="#888" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">Header</text>

      {/* wave indicator for 2T */}
      {twoStroke && (
        <>
          <path d="M 100 20 Q 120 10 140 20 T 180 20 T 220 20" fill="none" stroke="#0fdc7c" strokeWidth="2" strokeDasharray="3 3">
            <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
          </path>
          <text x="160" y="14" fill="#0fdc7c" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">גל לחץ חוזר</text>
        </>
      )}
    </svg>
  );
}

/* ============================================================
   4. DENT IMPACT — איך שקיעה הורגת הספק (2T)
   ============================================================ */
function DentImpactDemo() {
  const [dent, setDent] = useState(0); // 0-20mm
  // power loss curve: heavier impact on 2T expansion chamber
  // לפי בדיקות דינו של MXA: שקיעה של 13 מ"מ ≈ 1.5%, 19 מ"מ ≈ 3.8%.
  // קרוב יותר לפיזיקה האמיתית מאשר עקומה ליניארית תלולה.
  const loss = Math.min(12, Math.round(dent * 0.6));
  const baseHp = 50;
  const remaining = Math.max(0, baseHp - (baseHp * loss) / 100);

  const verdict =
    dent < 5
      ? { color: "#0fdc7c", text: "תקין — מכה קוסמטית בלבד, אובדן זניח" }
      : dent < 12
      ? { color: "#f5a623", text: "מורגש בקצה הסקאלה — שווה תיקון אוויר חם" }
      : dent < 18
      ? { color: "#e63000", text: "פגיעה משמעותית — שווה החלפה או תיקון מקצועי" }
      : { color: "#e63000", text: "פגיעה ניכרת — להחליף את החלק" };

  return (
    <section>
      <SectionLabel>מכת אבן בבטן</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        כמה כוח אתה מפסיד משקיעה בתא ההתפשטות?
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        תזיז את הסליידר. ככל שהשקיעה עמוקה יותר — גל הלחץ מתפזר ופחות דלק חוזר
        לתא הבעור. רלוונטי בעיקר ל-2 פעימות.
      </p>

      <figure className="mb-6 overflow-hidden border border-[#222]">
        <img
          src={dentImg}
          alt="צינור ראש פגוע ומחורר מימין לעומת צינור ראש חדש מבריק משמאל על שולחן עבודה במוסך"
          loading="lazy"
          width={1024}
          height={1024}
          className="block w-full"
        />
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] p-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#888]">
          מימין: אגזוז אחרי 3 שנות שטח. משמאל: חדש.
        </figcaption>
      </figure>

      <div className="bg-black p-4">
        <svg viewBox="0 0 360 100" className="mx-auto block w-full max-w-md" aria-label="שרטוט תא התפשטות עם שקיעה משתנה">
          <path
            d={`M 60 50 L 100 50 Q 120 50 125 ${40 + dent} L 175 ${15 + dent} Q 180 ${10 + dent} 185 ${15 + dent} L 235 ${40 + dent} Q 240 50 260 50 L 300 50`}
            fill="none"
            stroke="#f5a623"
            strokeWidth="3"
            style={{ transition: "d 200ms" }}
          />
          <path
            d={`M 60 50 L 100 50 Q 120 50 125 60 L 175 85 Q 180 90 185 85 L 235 60 Q 240 50 260 50 L 300 50`}
            fill="none"
            stroke="#f5a623"
            strokeWidth="3"
          />
          {dent > 0 && (
            <text x="180" y={10 + dent - 4} fill="#e63000" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="Heebo, sans-serif">
              שקיעה {dent} מ"מ
            </text>
          )}
        </svg>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs font-black text-[#bbb]">
          <span>עומק שקיעה</span>
          <span className="text-[#e63000]">{dent} מ"מ</span>
        </div>
        <input
          type="range"
          min={0}
          max={20}
          value={dent}
          onChange={(e) => setDent(Number(e.target.value))}
          className="w-full accent-[#e63000]"
          aria-label="עומק שקיעה"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoTile label="הספק נותר" value={`${remaining.toFixed(1)} HP`} accent />
        <InfoTile label="אובדן" value={`${loss}%`} />
      </div>

      <div className="mt-4 border-r-4 p-4" style={{ borderColor: verdict.color, backgroundColor: "#0d0d0d" }}>
        <div className="mb-1 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: verdict.color }}>
          אבחנה
        </div>
        <p className="text-sm font-bold text-[#ccc]">{verdict.text}</p>
      </div>
    </section>
  );
}

/* ============================================================
   5. PACKING HEALTH QUIZ
   ============================================================ */
const PACKING_QUESTIONS = [
  "הצליל נשמע יותר 'חד' וגבוה מאשר לפני חודשיים?",
  "כשאתה דופק על הסיילנסר עם האצבעות — אתה שומע 'טינג' מתכתי במקום 'בום'?",
  "פיח שחור שמני יוצא מהקצה האחורי בכמות חריגה?",
  "עברו יותר מ-25 שעות (2T) או 60 שעות (4T) מאז ההחלפה האחרונה?",
];

function PackingHealthQuiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(PACKING_QUESTIONS.length).fill(null));
  const score = answers.filter((a) => a === true).length;
  const answered = answers.every((a) => a !== null);

  const verdict = useMemo(() => {
    if (!answered) return null;
    if (score === 0)
      return { color: "#0fdc7c", title: "הפאקינג בסדר", text: "כל הסימנים מצביעים על פאקינג חי. תמשיך לבדוק כל 20 שעות." };
    if (score <= 2)
      return { color: "#f5a623", title: "מתחיל להישחק", text: "סימן אחד-שניים זה אזהרה מוקדמת. תזמין גליל פאקינג חדש (80-180 ₪) ותחליף בחודש הקרוב." };
    return { color: "#e63000", title: "להחליף עכשיו", text: "כל הסימנים מצביעים על פאקינג גמור. עוד קצת והאופנוע יישמע כמו טרקטור. החלפה: 30 דקות עבודה או 250-400 ₪ במוסך." };
  }, [answered, score]);

  function setAnswer(i: number, val: boolean) {
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }
  function reset() {
    setAnswers(Array(PACKING_QUESTIONS.length).fill(null));
  }

  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>אבחון פאקינג</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        הפאקינג שלך גמור?
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        4 שאלות. 20 שניות. כן/לא.
      </p>

      <figure className="mb-6 overflow-hidden border border-[#222]">
        <img
          src={packingImg}
          alt="פאקינג שרוף שחור לעומת פאקינג חדש לבן על שולחן עבודה"
          loading="lazy"
          width={1024}
          height={1024}
          className="block w-full"
        />
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] p-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#888]">
          פאקינג שחור שרוף לעומת חדש — הצבע הוא האינדיקטור הראשון
        </figcaption>
      </figure>

      <ol className="space-y-3">
        {PACKING_QUESTIONS.map((q, i) => (
          <li key={i} className="border border-[#222] bg-[#0d0d0d] p-4">
            <div className="mb-3 flex gap-3 text-base font-bold text-[#ccc]">
              <span className="text-[#e63000]">{i + 1}.</span>
              <span>{q}</span>
            </div>
            <div className="flex gap-2">
              <QuizButton active={answers[i] === true} onClick={() => setAnswer(i, true)} variant="yes">כן</QuizButton>
              <QuizButton active={answers[i] === false} onClick={() => setAnswer(i, false)} variant="no">לא</QuizButton>
            </div>
          </li>
        ))}
      </ol>

      {verdict && (
        <div className="mt-6 border-r-4 bg-[#0d0d0d] p-5" style={{ borderColor: verdict.color }}>
          <div className="mb-2 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: verdict.color }}>
            {score}/4 סימנים
          </div>
          <h3 className="mb-2 text-xl font-black text-[#f0f0f0]">{verdict.title}</h3>
          <p className="mb-3 text-sm font-bold leading-relaxed text-[#ccc]">{verdict.text}</p>
          <button type="button" onClick={reset} className="text-xs font-black uppercase tracking-wider text-[#e63000] underline">איפוס</button>
        </div>
      )}
    </section>
  );
}

function QuizButton({ active, onClick, variant, children }: { active: boolean; onClick: () => void; variant: "yes" | "no"; children: React.ReactNode }) {
  const activeColor = variant === "yes" ? "bg-[#e63000] border-[#e63000] text-white" : "bg-[#0fdc7c] border-[#0fdc7c] text-black";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border-2 px-4 py-2 text-sm font-black uppercase tracking-wider transition ${active ? activeColor : "border-[#333] bg-transparent text-[#ccc] hover:border-[#666]"}`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   6. UPGRADE COMPARE — Slip-on vs Full system
   ============================================================ */
const UPGRADES = [
  { id: "stock", name: "מקורי", hp: 0, weight: 0, price: 0, sound: 35, color: "#666" },
  { id: "slipon", name: "Slip-on (סיילנסר בלבד)", hp: 1.5, weight: -1.5, price: 1700, sound: 60, color: "#f5a623" },
  { id: "full", name: "מערכת מלאה", hp: 4, weight: -2.5, price: 4000, sound: 85, color: "#e63000" },
];

function UpgradeCompare() {
  const [selected, setSelected] = useState("stock");
  const current = UPGRADES.find((u) => u.id === selected)!;

  return (
    <section>
      <SectionLabel>שדרוג</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        שווה לי להחליף אגזוז?
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        לחץ על כל אופציה ותראה את הטרייד-אוף האמיתי — בלי הבטחות שיווקיות.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-3">
        {UPGRADES.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => setSelected(u.id)}
            className={`border-2 p-4 text-right transition ${
              selected === u.id
                ? "border-[#e63000] bg-[#1a0a05]"
                : "border-[#222] bg-[#0d0d0d] hover:border-[#444]"
            }`}
          >
            <div className={`text-sm font-black ${selected === u.id ? "text-[#e63000]" : "text-[#f0f0f0]"}`}>{u.name}</div>
            <div className="mt-1 text-[11px] font-bold text-[#888]">
              {u.price === 0 ? "ללא עלות" : `כ-${u.price.toLocaleString()} ₪`}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4 border-2 border-[#e63000] bg-[#0a0a0a] p-5">
        <MeterRow label="הספק נוסף" value={`+${current.hp} HP`} percent={(current.hp / 5) * 100} color="#0fdc7c" />
        <MeterRow label="הורדת משקל" value={current.weight === 0 ? "—" : `${current.weight} ק"ג`} percent={(Math.abs(current.weight) / 3) * 100} color="#3b9eff" />
        <MeterRow label="עוצמת צליל" value={current.sound === 35 ? "תקן" : "ספורטיבי"} percent={current.sound} color="#f5a623" />
        <MeterRow label="פגיעה בכיס" value={current.price === 0 ? "—" : `${current.price.toLocaleString()} ₪`} percent={(current.price / 5000) * 100} color="#e63000" />
      </div>

      <p className="mt-4 border-r-2 border-[#e63000] bg-[#0d0d0d] p-3 text-sm font-bold text-[#ccc]">
        <strong className="text-[#f0f0f0]">המסקנה:</strong> רוכב טיולים? Slip-on
        מספיק לחלוטין. מתחרה או רוכב טכני? מערכת מלאה משתלמת. אגזוז שמבטיח
        "פלוס 10 כוחות סוס בלי טרייד-אוף" — שיווק.
      </p>
    </section>
  );
}

function MeterRow({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = window.setTimeout(() => setWidth(Math.min(100, percent)), 50);
    return () => window.clearTimeout(id);
  }, [percent]);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">{label}</span>
        <span className="text-sm font-black text-[#f0f0f0]">{value}</span>
      </div>
      <div ref={ref} className="relative h-3 overflow-hidden bg-[#1a1a1a]">
        <div
          className="h-full"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transition: "width 800ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   7. COST CALCULATOR — packing vs full vs slip-on
   ============================================================ */
function CostCalculator() {
  const [scope, setScope] = useState<"packing" | "silencer" | "full">("packing");
  const [where, setWhere] = useState<"diy" | "shop">("diy");

  const prices = {
    packing: { parts: [80, 180], labor: [150, 250] },
    silencer: { parts: [900, 2500], labor: [100, 200] },
    full: { parts: [2500, 5500], labor: [200, 400] },
  };
  const p = prices[scope];

  const canDiy = scope !== "full";
  const effectiveWhere = canDiy ? where : "shop";

  const total =
    effectiveWhere === "diy"
      ? p.parts
      : ([p.parts[0] + p.labor[0], p.parts[1] + p.labor[1]] as [number, number]);

  const savings = effectiveWhere === "diy" ? [p.labor[0], p.labor[1]] : null;

  return (
    <section className="border border-[#222] bg-[#0a0a0a] p-6 md:p-8">
      <SectionLabel>כמה זה יעלה</SectionLabel>
      <h2 className="mb-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
        מחשבון אגזוז
      </h2>
      <p className="mb-6 text-base font-bold text-[#bbb]">
        בחר מה אתה צריך ואיפה — ותראה את הטווח האמיתי.
      </p>

      <div className="mb-4">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#888]">מה מחליפים</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <ToggleCard active={scope === "packing"} onClick={() => setScope("packing")} title="פאקינג בלבד" sub="תחזוקה רגילה" />
          <ToggleCard active={scope === "silencer"} onClick={() => setScope("silencer")} title="Slip-on" sub="סיילנסר חדש" />
          <ToggleCard active={scope === "full"} onClick={() => setScope("full")} title="מערכת מלאה" sub="Header + Mid + סיילנסר" />
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#888]">איפה</div>
        <div className="grid grid-cols-2 gap-2">
          <ToggleCard active={effectiveWhere === "diy"} onClick={() => canDiy && setWhere("diy")} title="עושה בבית" sub={canDiy ? "מתאים לפאקינג/Slip-on" : "מערכת מלאה — לא מומלץ"} disabled={!canDiy} />
          <ToggleCard active={effectiveWhere === "shop"} onClick={() => setWhere("shop")} title="במוסך" sub="ללא טרחה" />
        </div>
      </div>

      <div className="border-2 border-[#e63000] bg-black p-6 text-center">
        <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#e63000]">סך הכל</div>
        <div className="text-4xl font-black text-[#f0f0f0] md:text-5xl">
          {total[0].toLocaleString()}–{total[1].toLocaleString()} ₪
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
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border-2 p-4 text-right transition ${
        disabled
          ? "cursor-not-allowed border-[#1a1a1a] bg-[#0a0a0a] opacity-40"
          : active
          ? "border-[#e63000] bg-[#1a0a05]"
          : "border-[#222] bg-[#0d0d0d] hover:border-[#444]"
      }`}
    >
      <div className={`text-sm font-black ${active ? "text-[#e63000]" : "text-[#f0f0f0]"}`}>{title}</div>
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
        עוד שאלות?
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
                  <span aria-hidden className={`text-[#e63000] transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
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