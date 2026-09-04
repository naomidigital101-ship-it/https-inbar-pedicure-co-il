import anatomyAsset from "@/assets/onycholysis/anatomy.webp.asset.json";
import clinicalAsset from "@/assets/onycholysis/clinical.webp.asset.json";
import { AlertTriangle, Droplet, Footprints, Sparkles, Activity, Pill } from "lucide-react";
import { Dash, DisplayEyebrow, SectionLabel } from "@/components/services/service-ui";
import {
  ALERT,
  BODONI,
  CREAM,
  GREEN,
  HAIRLINE,
  INK,
  MUTED,
  TAUPE,
  headingStyle,
} from "@/components/services/service-tokens";

/*
 * החומרים הוויזואליים של עמוד האוניכוליזיס, בשפת דף הבית:
 * מלבנים עם מסגרת hairline, בלי עיגול פינות ובלי צל.
 */

const box: React.CSSProperties = {
  background: "#FFFFFF",
  border: `1px solid ${HAIRLINE}`,
};

const caption: React.CSSProperties = {
  fontWeight: 300,
  fontSize: "13px",
  lineHeight: 1.8,
  color: "#6B6B6B",
  textAlign: "center",
  marginTop: "12px",
};

export function OnycholysisAnatomy() {
  return (
    <figure
      aria-label="איור אנטומי המשווה ציפורן בריאה לציפורן עם אוניכוליזיס"
      style={{ margin: "40px 0" }}
    >
      <div style={{ ...box, padding: "18px" }}>
        <img
          src={anatomyAsset.url}
          alt="חתך אנטומי של בוהן — מימין ציפורן בריאה צמודה למיטה, משמאל ציפורן עם אוניכוליזיס שמתרוממת ומתנתקת מהמיטה"
          width={1400}
          height={798}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "1px",
            background: HAIRLINE,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ background: CREAM, padding: "18px 16px", textAlign: "center" }}>
            <SectionLabel size={10} color={GREEN}>
              בריאה
            </SectionLabel>
            <p style={{ margin: "10px 0 0", fontSize: "13.5px", fontWeight: 600, color: INK }}>
              לוחית צמודה לחלוטין למיטת הציפורן
            </p>
          </div>
          <div style={{ background: "#FFFFFF", padding: "18px 16px", textAlign: "center" }}>
            <SectionLabel size={10} color={ALERT}>
              אוניכוליזיס
            </SectionLabel>
            <p style={{ margin: "10px 0 0", fontSize: "13.5px", fontWeight: 600, color: INK }}>
              קצה הלוחית מתרומם — נוצר חלל פגיע לזיהום
            </p>
          </div>
        </div>
      </div>
      <figcaption style={caption}>איור קליני: השוואה בין מבנה תקין למצב של אוניכוליזיס</figcaption>
    </figure>
  );
}

export function OnycholysisClinical() {
  return (
    <figure aria-label="תצלום קליני של בוהן עם אוניכוליזיס" style={{ margin: "40px 0" }}>
      <div style={box}>
        <img
          src={clinicalAsset.url}
          alt="תצלום קליני של ציפורן בוהן עם אוניכוליזיס — חצי הציפורן הקדמי לבן-צהבהב ומנותק, חצי הבסיס ורוד ובריא"
          width={1400}
          height={937}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      <figcaption style={caption}>
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
    <section aria-labelledby="onycho-causes-h" style={{ margin: "56px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <DisplayEyebrow size={13} tracking={0.4}>
          Causes
        </DisplayEyebrow>
        <h3 id="onycho-causes-h" style={{ ...headingStyle("22px"), marginTop: "14px" }}>
          6 הגורמים השכיחים לאוניכוליזיס
        </h3>
      </div>
      <div
        className="svc-causes"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1px",
          background: HAIRLINE,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        {CAUSES.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} style={{ background: "#FFFFFF", padding: "28px 24px" }}>
              <span
                aria-hidden
                style={{
                  display: "flex",
                  width: "38px",
                  height: "38px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${TAUPE}`,
                  color: GREEN,
                  marginBottom: "18px",
                }}
              >
                <Icon size={18} strokeWidth={1.4} />
              </span>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: INK }}>{c.label}</p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontWeight: 300,
                  fontSize: "13.5px",
                  lineHeight: 1.8,
                  color: "#6E6E6E",
                }}
              >
                {c.note}
              </p>
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
    <section aria-labelledby="onycho-timeline-h" style={{ margin: "56px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <DisplayEyebrow size={13} tracking={0.4}>
          Timeline
        </DisplayEyebrow>
        <h3 id="onycho-timeline-h" style={{ ...headingStyle("22px"), marginTop: "14px" }}>
          כמה זמן לוקח לציפורן חדשה לצמוח?
        </h3>
      </div>
      <ol
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        {TIMELINE.map((step, i) => (
          <li
            key={step.when}
            style={{
              display: "grid",
              gridTemplateColumns: "52px 1fr",
              gap: "22px",
              padding: "26px 4px",
              borderBottom: `1px solid ${HAIRLINE}`,
              alignItems: "baseline",
            }}
          >
            <span
              aria-hidden
              style={{ fontFamily: BODONI, fontWeight: 400, fontSize: "22px", color: TAUPE }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <SectionLabel size={11}>{step.when}</SectionLabel>
              <span style={{ fontSize: "16px", fontWeight: 600, color: INK }}>{step.title}</span>
              <span
                style={{
                  fontWeight: 300,
                  fontSize: "14.5px",
                  lineHeight: 1.9,
                  color: "#6E6E6E",
                }}
              >
                {step.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p
        style={{
          marginTop: "16px",
          fontWeight: 300,
          fontSize: "13px",
          lineHeight: 1.8,
          color: "#6B6B6B",
        }}
      >
        * זמני צמיחה אופייניים. הקצב משתנה בין אנשים, לפי גיל ולפי עונת השנה.
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

function AdviceList({
  label,
  items,
  accent,
  background,
}: {
  label: string;
  items: string[];
  accent: string;
  background: string;
}) {
  return (
    <div style={{ background, padding: "34px 30px" }}>
      <SectionLabel size={11} color={accent}>
        {label}
      </SectionLabel>
      <ul
        style={{
          margin: "20px 0 0",
          padding: 0,
          listStyle: "none",
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        {items.map((t) => (
          <li
            key={t}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              fontWeight: 300,
              fontSize: "15px",
              lineHeight: 1.85,
              color: MUTED,
              padding: "14px 0",
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <Dash color={accent} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OnycholysisDoDont() {
  return (
    <section aria-labelledby="onycho-dodont-h" style={{ margin: "56px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <DisplayEyebrow size={13} tracking={0.4}>
          Do &amp; don&apos;t
        </DisplayEyebrow>
        <h3 id="onycho-dodont-h" style={{ ...headingStyle("22px"), marginTop: "14px" }}>
          מה לעשות ומה להימנע בבית
        </h3>
      </div>
      <div
        className="svc-grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "1px",
          background: HAIRLINE,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        <AdviceList label="כן לעשות" items={DO_LIST} accent={GREEN} background={CREAM} />
        <AdviceList label="להימנע" items={DONT_LIST} accent={ALERT} background="#FFFFFF" />
      </div>
    </section>
  );
}

export function OnycholysisVisuals() {
  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 0 20px" }}>
      <OnycholysisClinical />
      <OnycholysisAnatomy />
      <OnycholysisCauses />
      <OnycholysisTimeline />
      <OnycholysisDoDont />
    </div>
  );
}
