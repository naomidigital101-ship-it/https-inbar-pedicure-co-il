import anatomyAsset from "@/assets/onycholysis/anatomy.webp.asset.json";
import clinicalAsset from "@/assets/onycholysis/clinical.webp.asset.json";
import { BrandEyebrow } from "@/components/brand/BrandPrimitives";
import { AlertTriangle, Droplet, Footprints, Sparkles, Activity, Pill, Check, X } from "lucide-react";

const heading = (size: string) => ({
  fontFamily: "var(--font-display)",
  fontWeight: 300,
  fontSize: size,
  letterSpacing: "-0.02em",
  color: "var(--ink-900)",
  lineHeight: 1.15,
});

const card: React.CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--stone-100)",
  borderRadius: 16,
};

export function OnycholysisAnatomy() {
  return (
    <figure className="my-8" aria-label="איור אנטומי המשווה ציפורן בריאה לציפורן עם אוניכוליזיס">
      <div className="overflow-hidden" style={{ ...card, padding: 16 }}>
        <img
          src={anatomyAsset.url}
          alt="חתך אנטומי של בוהן — מימין ציפורן בריאה צמודה למיטה, משמאל ציפורן עם אוניכוליזיס שמתרוממת ומתנתקת מהמיטה"
          width={1400}
          height={798}
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-xl"
        />
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="p-3" style={{ background: "var(--green-50)", borderRadius: 12 }}>
            <BrandEyebrow style={{ fontSize: 10, color: "var(--green-700)" }}>בריאה</BrandEyebrow>
            <p className="mt-1" style={{ color: "var(--ink-900)", fontSize: 13, fontWeight: 600 }}>
              לוחית צמודה לחלוטין למיטת הציפורן
            </p>
          </div>
          <div className="p-3" style={{ background: "color-mix(in oklab, #C4634F 10%, var(--paper))", borderRadius: 12 }}>
            <BrandEyebrow style={{ fontSize: 10, color: "#9B3A28" }}>אוניכוליזיס</BrandEyebrow>
            <p className="mt-1" style={{ color: "var(--ink-900)", fontSize: 13, fontWeight: 600 }}>
              קצה הלוחית מתרומם — נוצר חלל פגיע לזיהום
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center" style={{ color: "var(--ink-600)", fontSize: 12 }}>
        איור קליני: השוואה בין מבנה תקין למצב של אוניכוליזיס
      </figcaption>
    </figure>
  );
}

export function OnycholysisClinical() {
  return (
    <figure className="my-8" aria-label="תצלום קליני של בוהן עם אוניכוליזיס">
      <div className="overflow-hidden" style={card}>
        <img
          src={clinicalAsset.url}
          alt="תצלום קליני של ציפורן בוהן עם אוניכוליזיס — חצי הציפורן הקדמי לבן-צהבהב ומנותק, חצי הבסיס ורוד ובריא"
          width={1400}
          height={937}
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
        />
      </div>
      <figcaption className="mt-2 text-center" style={{ color: "var(--ink-600)", fontSize: 12 }}>
        מראה אופייני: גבול ברור בין החלק המנותק (לבן-אטום) לחלק הבריא (ורוד)
      </figcaption>
    </figure>
  );
}

const CAUSES = [
  { icon: AlertTriangle, label: "טראומה", note: "מכה, נעל לוחצת, ריצה" },
  { icon: Activity, label: "פטרת ציפורניים", note: "Onychomycosis" },
  { icon: Sparkles, label: "ג'ל ואקריל", note: "מסירים אגרסיביים" },
  { icon: Droplet, label: "מחלות סיסטמיות", note: "תריס, אנמיה, פסוריאזיס" },
  { icon: Pill, label: "תרופות", note: "טטרציקלינים + שמש" },
  { icon: Footprints, label: "נעליים לא מתאימות", note: "לחץ חוזר על הבוהן" },
];

export function OnycholysisCauses() {
  return (
    <section className="my-10" aria-labelledby="onycho-causes-h">
      <BrandEyebrow>אינפוגרפיקה</BrandEyebrow>
      <h3 id="onycho-causes-h" className="mt-2 mb-5" style={heading("1.4rem")}>
        6 הגורמים השכיחים לאוניכוליזיס
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {CAUSES.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="p-4" style={card}>
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center"
                style={{ background: "var(--green-50)", color: "var(--green-700)", borderRadius: 999 }}
              >
                <Icon size={18} strokeWidth={1.6} aria-hidden />
              </div>
              <p style={{ color: "var(--ink-900)", fontSize: 14.5, fontWeight: 600 }}>{c.label}</p>
              <p className="mt-1" style={{ color: "var(--ink-600)", fontSize: 12.5, lineHeight: 1.55 }}>{c.note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const TIMELINE = [
  { when: "שבוע 0", title: "אבחון בקליניקה", note: "זיהוי הסיבה, קיצור החלק המנותק, חיטוי" },
  { when: "חודש 1–2", title: "ייצוב", note: "הגנה על המיטה, טיפול ממוקד בגורם" },
  { when: "חודש 3", title: "צמיחה נראית", note: "ציפורן שקופה ובריאה מבצבצת מהבסיס" },
  { when: "חודש 6", title: "כשליש מוחלף", note: "החלק הפגוע מתקדם לקצה" },
  { when: "חודש 12", title: "החלפה כמעט מלאה", note: "ציפורן יד: סיום מלא · בוהן: בשלבים אחרונים" },
  { when: "חודש 18", title: "ציפורן חדשה לחלוטין", note: "בוהן בריאה לגמרי, בתנאי שהגורם טופל" },
];

export function OnycholysisTimeline() {
  return (
    <section className="my-10" aria-labelledby="onycho-timeline-h">
      <BrandEyebrow>ציר זמן</BrandEyebrow>
      <h3 id="onycho-timeline-h" className="mt-2 mb-5" style={heading("1.4rem")}>
        כמה זמן לוקח לציפורן חדשה לצמוח?
      </h3>
      <ol className="relative space-y-4">
        {TIMELINE.map((s, i) => (
          <li key={s.when} className="flex gap-4 p-4" style={card}>
            <div className="flex flex-col items-center" aria-hidden>
              <div
                className="flex h-9 w-9 items-center justify-center"
                style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999, fontWeight: 700, fontSize: 13 }}
              >
                {i + 1}
              </div>
            </div>
            <div className="flex-1">
              <p style={{ color: "var(--green-700)", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" }}>{s.when}</p>
              <p className="mt-0.5" style={{ color: "var(--ink-900)", fontSize: 15, fontWeight: 600 }}>{s.title}</p>
              <p className="mt-1" style={{ color: "var(--ink-600)", fontSize: 13.5, lineHeight: 1.65 }}>{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3" style={{ color: "var(--ink-600)", fontSize: 12 }}>
        * זמני צמיחה אופייניים על פי Mayo Clinic. הקצב משתנה בין אנשים, גיל ועונת השנה.
      </p>
    </section>
  );
}

const DO_LIST = [
  "לקצר את החלק המנותק עד קו ההצמדה",
  "לחטא את המיטה החשופה יומית",
  "להשתמש בתכשיר אנטי-פטרייתי לפי הנחיה",
  "לייבש היטב בין הבהונות אחרי מקלחת",
  "לנעול נעליים רחבות בקדמה",
];
const DONT_LIST = [
  "לכפות הצמדה חזרה — היא לא תידבק",
  "למרוח לק קוסמטי, ג'ל או אקריל",
  "להשתמש באצטון או במסירי ג'ל",
  "לחתוך עד יסוד — להשאיר מעבר לקו ההצמדה",
  "להשרות ידיים או רגליים זמן ממושך",
];

export function OnycholysisDoDont() {
  return (
    <section className="my-10" aria-labelledby="onycho-dodont-h">
      <BrandEyebrow>מותר ואסור</BrandEyebrow>
      <h3 id="onycho-dodont-h" className="mt-2 mb-5" style={heading("1.4rem")}>
        מה לעשות ומה להימנע בבית
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="p-5" style={{ ...card, background: "var(--green-50)", borderColor: "var(--green-100)" }}>
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center"
              style={{ background: "var(--green-600)", color: "var(--paper)", borderRadius: 999 }}
              aria-hidden
            >
              <Check size={15} strokeWidth={2.4} />
            </span>
            <p style={{ color: "var(--green-700)", fontWeight: 700, fontSize: 14 }}>כן לעשות</p>
          </div>
          <ul className="space-y-2">
            {DO_LIST.map((t) => (
              <li key={t} className="flex items-start gap-2" style={{ color: "var(--ink-900)", fontSize: 14, lineHeight: 1.65 }}>
                <span aria-hidden style={{ color: "var(--green-700)", fontWeight: 700 }}>✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="p-5"
          style={{ ...card, background: "color-mix(in oklab, #C4634F 8%, var(--paper))", borderColor: "color-mix(in oklab, #C4634F 25%, var(--paper))" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center"
              style={{ background: "#C4634F", color: "var(--paper)", borderRadius: 999 }}
              aria-hidden
            >
              <X size={15} strokeWidth={2.4} />
            </span>
            <p style={{ color: "#9B3A28", fontWeight: 700, fontSize: 14 }}>להימנע</p>
          </div>
          <ul className="space-y-2">
            {DONT_LIST.map((t) => (
              <li key={t} className="flex items-start gap-2" style={{ color: "var(--ink-900)", fontSize: 14, lineHeight: 1.65 }}>
                <span aria-hidden style={{ color: "#9B3A28", fontWeight: 700 }}>✕</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function OnycholysisVisuals() {
  return (
    <div className="mx-auto max-w-[820px] px-6">
      <OnycholysisClinical />
      <OnycholysisAnatomy />
      <OnycholysisCauses />
      <OnycholysisTimeline />
      <OnycholysisDoDont />
    </div>
  );
}