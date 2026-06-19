import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGateway, getLovableApiKey } from "./ai-gateway.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { categories } from "./categories";
import { articles as staticArticles } from "./articles";

/* ---------- Zod schemas for AI structured output ---------- */

export const TopicSuggestionSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string().min(8).max(120),
        category_slug: z.enum([
          "foot-care",
          "conditions",
          "diabetic-foot",
          "footwear",
          "sports-feet",
          "treatments",
        ]),
        keywords: z.array(z.string()).min(2).max(8),
        reasoning: z.string().min(20).max(400),
        score: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(20),
});

export const ArticlePayloadSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(80),
  title: z.string().min(10).max(120),
  excerpt: z.string().min(40).max(220),
  metaDescription: z.string().min(80).max(160),
  category: z.string(),
  categorySlug: z.enum([
    "foot-care",
    "conditions",
    "diabetic-foot",
    "footwear",
    "sports-feet",
    "treatments",
  ]),
  author: z.string().default("ענבר פרחי"),
  heroAlt: z.string().min(8).max(160),
  heroImagePrompt: z.string().min(20).max(500),
  intro: z.array(z.string().min(20)).min(2).max(5),
  tldr: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(3)
    .max(8),
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        heading: z.string().min(4).max(120),
        level: z.union([z.literal(2), z.literal(3)]),
        paragraphs: z
          .preprocess(
            (v) =>
              Array.isArray(v)
                ? v.map((item) => {
                    if (typeof item === "string") return item;
                    if (item && typeof item === "object") {
                      const o = item as Record<string, unknown>;
                      const txt = o.text ?? o.content ?? o.paragraph ?? o.value;
                      if (typeof txt === "string") return txt;
                      return Object.values(o)
                        .filter((x) => typeof x === "string")
                        .join(" ");
                    }
                    return String(item ?? "");
                  })
                : v,
            z.array(z.string().min(20)),
          )
          .optional(),
        list: z.array(z.string()).optional(),
        ordered: z.boolean().optional(),
        callout: z
          .object({
            type: z.enum(["tip", "warning", "saving"]),
            title: z.string(),
            body: z.string(),
          })
          .optional(),
        inlineImagePrompt: z.string().min(20).max(500).optional(),
        inlineImageAlt: z.string().min(8).max(160).optional(),
        inlineImageCaption: z.string().max(200).optional(),
        asInfographic: z.boolean().optional(),
        youtubeId: z.string().min(5).max(20).optional(),
        youtubeTitle: z.string().max(160).optional(),
      }),
    )
    .min(4)
    .max(15),
  faqs: z
    .array(z.object({ q: z.string(), a: z.string() }))
    .min(3)
    .max(8),
  glossary: z
    .array(z.object({ term: z.string(), definition: z.string() }))
    .optional(),
  contextualLinks: z
    .array(
      z.object({
        match: z.string(),
        href: z.string(),
        external: z.boolean().optional(),
        rel: z.enum(["dofollow", "nofollow", "sponsored", "ugc"]).optional(),
        title: z.string().max(200).optional(),
      }),
    )
    .min(4)
    .max(14),
  specTable: z
    .object({
      title: z.string().max(120).optional(),
      caption: z.string().max(200).optional(),
      columns: z.array(z.string()).min(2).max(6),
      rows: z.array(z.array(z.string())).min(2).max(20),
    })
    .optional(),
  checklist: z
    .preprocess(
      (v) => (v === null ? undefined : v),
      z
        .object({
          title: z.string().max(120).optional(),
          items: z.array(z.string()).min(3).max(20),
        })
        .optional(),
    ),
  sources: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .max(10)
    .optional(),
  relatedSlugs: z.array(z.string()).min(2).max(6),
});

export type GeneratedArticlePayload = z.infer<typeof ArticlePayloadSchema>;

/* ---------- Helpers ---------- */

const HEBREW_DAYS = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"];
const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

export function formatHebrewDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ב${HEBREW_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function estimateReadingTime(payload: GeneratedArticlePayload): string {
  const text = [
    ...payload.intro,
    ...payload.sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.list ?? [])]),
    ...payload.faqs.map((f) => f.q + " " + f.a),
  ].join(" ");
  const words = text.split(/\s+/).length;
  const mins = Math.max(3, Math.round(words / 220));
  return `${mins} דקות`;
}

/** Sanitize Hebrew text — strip em-dash and AI tells. */
export function sanitizeHebrew(text: string): string {
  return text
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    // Strip leftover markdown that the renderer doesn't parse
    .replace(/\*{2,}/g, "")
    .replace(/^#{2,}\s+/gm, "")
    .replace(/__([^_]+)__/g, "$1")
    // Strip stray Arabic characters that leaked into Hebrew text
    .replace(/[\u0600-\u06FF]/g, "")
    // Replacement char
    .replace(/\uFFFD/g, "")
    .replace(/\s+/g, (m) => (m.includes("\n") ? m : " "))
    .trim();
}

export function sanitizePayload(p: GeneratedArticlePayload): GeneratedArticlePayload {
  const fix = (s: string) => sanitizeHebrew(s);
  return {
    ...p,
    title: fix(p.title),
    excerpt: fix(p.excerpt),
    metaDescription: fix(p.metaDescription),
    heroAlt: fix(p.heroAlt),
    intro: p.intro.map(fix),
    tldr: p.tldr.map((t) => ({ label: fix(t.label), value: fix(t.value) })),
    sections: p.sections.map((s) => ({
      ...s,
      heading: fix(s.heading),
      paragraphs: s.paragraphs?.map(fix),
      list: s.list?.map(fix),
      callout: s.callout
        ? { ...s.callout, title: fix(s.callout.title), body: fix(s.callout.body) }
        : undefined,
    })),
    faqs: p.faqs.map((f) => ({ q: fix(f.q), a: fix(f.a) })),
    glossary: p.glossary?.map((g) => ({ term: fix(g.term), definition: fix(g.definition) })),
  };
}

export type AiGatewayIssueCode = "PAYMENT_REQUIRED" | "RATE_LIMIT" | "SERVICE_UNAVAILABLE";

export type AiGatewayIssue = {
  code: AiGatewayIssueCode;
  message: string;
  retryable: boolean;
  userMessage: string;
};

export function getAiGatewayIssue(error: unknown): AiGatewayIssue | null {
  const message = error instanceof Error ? error.message : String(error ?? "");

  if (/payment required|\b402\b/i.test(message)) {
    return {
      code: "PAYMENT_REQUIRED",
      message,
      retryable: false,
      userMessage:
        "נגמרו הקרדיטים של Lovable AI. צריך להוסיף קרדיטים ב-Settings → Workspace → Usage כדי להמשיך.",
    };
  }

  if (/rate limit|too many requests|\b429\b/i.test(message)) {
    return {
      code: "RATE_LIMIT",
      message,
      retryable: true,
      userMessage: "המערכת עמוסה כרגע. נסה שוב בעוד כמה רגעים.",
    };
  }

  if (/fetch failed|timeout|timed out|\b502\b|\b503\b|\b504\b|service unavailable/i.test(message)) {
    return {
      code: "SERVICE_UNAVAILABLE",
      message,
      retryable: true,
      userMessage: "שירות ה-AI לא זמין כרגע. נסה שוב בעוד כמה רגעים.",
    };
  }

  return null;
}

/* ---------- AI calls ---------- */

async function callJSON<T extends z.ZodTypeAny>(
  model: string,
  system: string,
  prompt: string,
  schema: T,
): Promise<z.infer<T>> {
  const gateway = createLovableAiGateway(getLovableApiKey());
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await generateText({
        model: gateway(model),
        system,
        prompt,
        output: Output.object({ schema }),
        temperature: 0.7,
        maxOutputTokens: 16000,
      });
      return result.output;
    } catch (err) {
      lastErr = err;
      const msg = (err as Error)?.message ?? "";
      // Retry on transient upstream failures and structured-output mismatches.
      if (!/Invalid JSON|Unexpected end of JSON input|No object generated|response did not match|schema|structured|fetch failed|ECONNRESET|timeout|502|503|504|empty/i.test(msg)) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }

  let fallbackResult: Awaited<ReturnType<typeof generateText>>;
  try {
    fallbackResult = await generateText({
      model: gateway(model),
      system,
      prompt:
        prompt +
        "\n\nהשב אך ורק עם אובייקט JSON תקין שעומד בסכמה. אסור טקסט נוסף לפני או אחרי ה-JSON.",
      temperature: 0.7,
      maxOutputTokens: 16000,
    });
  } catch (error) {
    throw new Error(
      `AI gateway failed after retries: ${(error as Error)?.message ?? (lastErr as Error)?.message ?? "unknown"}`,
    );
  }

  const text = fallbackResult.text.trim();
  const jsonStr = extractJson(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    try {
      parsed = JSON.parse(repairJson(jsonStr));
    } catch {
      throw new Error(
        `AI returned invalid JSON: ${(e as Error).message}\n${text.slice(0, 400)}`,
      );
    }
  }
  try {
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; ");
      throw new Error(`AI returned unexpected structure: ${details}`);
    }
    throw error;
  }
}

function extractJson(text: string): string {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.search(/[\[{]/);
  if (start === -1) return cleaned;

  const opening = cleaned[start];
  const closing = opening === "[" ? "]" : "}";
  const end = cleaned.lastIndexOf(closing);

  if (end === -1 || end < start) {
    return cleaned.slice(start);
  }

  return cleaned.slice(start, end + 1);
}

/** Best-effort repair for truncated JSON: closes open strings/arrays/objects. */
function repairJson(input: string): string {
  let s = input
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/,(\s*[}\]])/g, "$1");
  const stack: string[] = [];
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" || ch === "]") stack.pop();
  }
  if (inString) s += '"';
  s = s.replace(/,\s*$/, "");
  while (stack.length) {
    const open = stack.pop();
    s += open === "{" ? "}" : "]";
  }
  return s;
}

/* ---------- 1. Suggest topics ---------- */

export async function suggestTopicsCore(opts: {
  count: number;
  model: string;
}): Promise<z.infer<typeof TopicSuggestionSchema>["topics"]> {
  // Get existing topics + articles to avoid duplicates
  const { data: existingTopics } = await supabaseAdmin
    .from("ai_topics")
    .select("title")
    .in("status", ["pending", "approved", "used"])
    .limit(200);
  const { data: existingDbArticles } = await supabaseAdmin
    .from("ai_articles")
    .select("title, category_slug")
    .limit(500);

  const existingTitles = [
    ...staticArticles.map((a) => a.title),
    ...(existingTopics ?? []).map((t) => t.title),
    ...(existingDbArticles ?? []).map((a) => a.title),
  ];

  // Per-category coverage (static + DB articles)
  const coverage = new Map<string, number>();
  for (const c of categories) coverage.set(c.slug, 0);
  for (const a of staticArticles) {
    coverage.set(a.categorySlug, (coverage.get(a.categorySlug) ?? 0) + 1);
  }
  for (const a of existingDbArticles ?? []) {
    if (a.category_slug) {
      coverage.set(a.category_slug, (coverage.get(a.category_slug) ?? 0) + 1);
    }
  }
  const ranked = [...coverage.entries()].sort((a, b) => a[1] - b[1]);
  const minCount = ranked[0]?.[1] ?? 0;
  const underServed = ranked.filter(([, n]) => n <= minCount + 1).map(([s]) => s);

  const categoriesList = categories
    .map((c) => `- ${c.slug}: ${c.name} — ${c.shortName} (יש ${coverage.get(c.slug) ?? 0} מאמרים)`)
    .join("\n");

  const system = `את עורכת התוכן הראשית באתר של ענבר פרחי - פודיאטרית מוסמכת בישראל. האתר הוא מקור סמכות בעברית לבריאות כף הרגל: טיפוח, אבחון, מצבים נפוצים, רגל סוכרתית, נעליים ומדרסים, פציעות ספורט וטיפולים פודיאטריים.
כל התוכן בעברית RTL, פנייה לאישה אך מותאמת לקהל מעורב, טון של פודיאטרית מנוסה שמסבירה למטופלת בקליניקה - חמה, ברורה, מקצועית. בלי שיווק, בלי הבטחות, בלי טיפים מהאינטרנט.
אסור: מקף ארוך (—), אימוג'י, סימני AI, ביטויי מילוי ("בעולם של היום", "חשוב להבין", "לסיכום"), טענות רפואיות בלי בסיס מחקרי, אבחון מרחוק במקום הפניה לרופא.
הצע רק נושאים שניתן לכתוב עליהם מאמר עומק מאומת מול מקורות רפואיים סמכותיים בלבד: משרד הבריאות (health.gov.il), קופות החולים (clalit.co.il, maccabi4u.co.il, leumit.co.il, meuhedet.co.il), Mayo Clinic, NHS, CDC, WHO, NIH, PubMed, NICE, APMA (אגודת הפודיאטרים האמריקאית), IWGDF (קווים מנחים לרגל סוכרתית), Cochrane, BMJ, NEJM, JAMA, The Lancet, British Journal of Sports Medicine. פורומים, בלוגים אישיים ואתרי שיווק אינם מקור.
אם הנושא דורש מספרים/אחוזי הצלחה/פרוטוקולים שלא ניתן לאמת ממקור רפואי סמכותי - אל תציעי אותו.
העדיפי שאלות שאישה ישראלית מקלידה בגוגל ("למה העקב שלי כואב בבוקר?", "איך מטפלים בפטרת ציפורניים בבית?", "כמה זמן לוקח להחלים מציפורן חודרנית?") - long-tail בעברית, עם זווית קלינית של פודיאטרית.
ניקוד 1-100 לפי שילוב של ביקוש חיפוש משוער + עומק קליני אפשרי + יכולת אימות מקורי.
אזני את כיסוי הקטגוריות. עדיפות גבוהה לקטגוריות חלשות.`;

  const prompt = `הצע ${opts.count} נושאים חדשים למאמרים. קטגוריות (כולל ספירת מאמרים קיימת):
${categoriesList}

קטגוריות חלשות שדורשות מיקוד מיידי (תן להן עדיפות עליונה בבחירת הנושאים): ${underServed.join(", ")}.
נסה להציע לפחות נושא אחד לכל קטגוריה חלשה, ולא יותר משני נושאים לאותה קטגוריה אלא אם בלתי נמנע.

נושאים/מאמרים שכבר קיימים (אסור לחזור עליהם):
${existingTitles.slice(0, 100).join("\n")}

כל נושא: כותרת בעברית (8-120 תווים), קטגוריה (slug מהרשימה), 2-8 keywords, נימוק קצר, score 1-100.

סכמה:
{ "topics": [ { "title": "...", "category_slug": "...", "keywords": ["..."], "reasoning": "...", "score": 85 } ] }`;

  const result = await callJSON(opts.model, system, prompt, TopicSuggestionSchema);

  // Boost score for under-served categories so the autopilot queue picks them first.
  return result.topics.map((t) => {
    const cat = t.category_slug;
    const has = coverage.get(cat) ?? 0;
    const boost = underServed.includes(cat) ? 20 : Math.max(0, 10 - has);
    return { ...t, score: Math.min(100, t.score + boost) };
  });
}

/* ---------- 2. Generate full article ---------- */

export async function generateArticleCore(opts: {
  topic: { title: string; category_slug: string; keywords: string[] };
  model: string;
}): Promise<GeneratedArticlePayload> {
  // Build internal links candidate list
  const internalLinkCandidates = [
    ...staticArticles.map((a) => ({ title: a.title, slug: a.slug })),
  ];

  const cat = categories.find((c) => c.slug === opts.topic.category_slug);

  const system = `את כותבת תוכן בכירה באתר של ענבר פרחי, פודיאטרית מוסמכת. את כותבת בטון של פודיאטרית מנוסה שמסבירה למטופלת בקליניקה: חמה, מקצועית, מבוססת מחקר, בלי לזלזל ובלי לפחד.

אימות עובדות (קריטי - תחום רפואי):
- כל הצהרה רפואית, כל מספר, כל אחוז הצלחה, כל פרוטוקול טיפול, כל תרופה, כל מינון - חייב להיות מאומת מול מקור רפואי סמכותי לפחות אחד: משרד הבריאות הישראלי (health.gov.il), קופות חולים (clalit.co.il, maccabi4u.co.il, leumit.co.il, meuhedet.co.il), Mayo Clinic, NHS, CDC, WHO, NIH, PubMed, NICE, AAOS, APMA, IWGDF (לרגל סוכרתית), Cochrane Library, BMJ, NEJM, JAMA, The Lancet, British Journal of Sports Medicine.
- אם אין לך אימות מחקרי ודאי - אל תכתבי את הנתון. כתבי טווח שמרני או "התייעצי עם הפודיאטרית שלך".
- אסור להמציא מחקרים, אחוזי הצלחה, סטטיסטיקות, מינונים או פרוטוקולים. אסור להציג בלוגים אישיים, פורומים או אתרי שיווק כמקור.
- חובה דיסקליימר רפואי: המאמר הוא חינוכי בלבד ואינו מחליף ייעוץ רפואי אישי. בכל בעיה - יש לפנות לפודיאטרית או לרופא.
- בכל מאמר חייבים 3-7 קישורי sources ישירים למקור רפואי סמכותי שמגבה את העובדות.

כללי כתיבה מחייבים:
- עברית RTL, פשוטה, ברורה, לקהל ישראלי שאינו רפואי. כל מונח רפואי חייב הסבר בעברית בסוגריים בפעם הראשונה (לדוגמה: "פלנטר פאשיאטיס - דלקת רצועת כף הרגל").
- אסור מקף ארוך (—). אסור אימוג'י או סימני AI. אסור ביטויי מילוי ("בעולם של היום", "חשוב לזכור", "כדאי לשים לב", "ההמלצה היא", "לסיכום"). השתמשי במקף רגיל (-).
- טון של פודיאטרית: "במרפאה אני רואה הרבה מטופלות עם", "לפני שאת מנסה טיפול ביתי, חשוב שתביני", "הסימן שאת חייבת לבוא לבדיקה הוא". לא גנרי, לא מתנשא.
- מספרים בספרות (3 חודשים, לא "שלושה חודשים"). יחידות מטריות. שמות תרופות/חומרים פעילים באנגלית בסוגריים (לדוגמה: ציקלופירוקס - Ciclopirox).
- title עד 60 תווים, מילת מפתח בהתחלה. metaDescription 140-160 תווים עם נתון קונקרטי. excerpt שונה ממטא.
- TL;DR בראש: 3-8 שורות שעונות על השאלה המרכזית באופן עצמאי (כדי שמנוע AI יוכל לצטט).
- כותרות H2/H3 כשאלה שמטופלת מקלידה בגוגל ("למה כואב לי העקב כשאני קמה בבוקר?", "מתי ציפורן חודרנית מחייבת ניתוח?"). תשובה ישירה בפסקה הראשונה אחרי כל כותרת.
- מינימום 5 sections H2. מאמר רפואי מלא: 1500-2500 מילים.
- callouts: tip לטיפים שגרתיים, warning לסימני אזהרה שמחייבים פנייה לרופא, saving לחיסכון בזמן/כסף בטיפול ביתי בטוח.
- FAQs: 4-8 שאלות-תשובות שמטופלות באמת שואלות (FAQPage schema).
- glossary למונחים רפואיים.
- checklist לכל מדריך טיפול ביתי או הכנה לפרוצדורה.
- contextualLinks: 4-10 קישורים, מתוכם **לפחות 3 פנימיים** למאמרים קיימים מהרשימה למטה (href = "/article/<slug>"). הטקסט ב-"match" חייב להופיע מילה במילה בגוף המאמר. בנה רשת קישורים חזקה - כל קישור צריך להיות רלוונטי באמת לטקסט שעוטף אותו, לא דחוס בכוח.
- קישורים חיצוניים (external: true): מותר ורצוי כשמוסיף ערך אמיתי - מקור סמכותי (ויקיפדיה, אתר יצרן רשמי, רגולציה ממשלתית, מחקר). השתמש ב-rel: "nofollow" כברירת מחדל לחיצוניים, או "dofollow" רק לדומיינים סמכותיים (ktm.com, gov.il, wikipedia.org, יצרני אופנועים/חלקים/שמנים רשמיים). לכל חיצוני הוסף title קצר.
- ויזואליזציה חובה: כל מושג/כלי/חלק/פעולה שמוזכר חייב להיות מומחש. לפחות 3 sections עם inlineImagePrompt (אנגלית, צילום ריאליסטי או דיאגרמה נקייה) + inlineImageAlt בעברית. מומחש = "מפתח אלן 8 מ"מ" -> תמונה של מפתח אלן, "פלאג ניקוז" -> תמונה ממוקדת. אינפוגרפיקה אחת לפחות (asInfographic: true). תמונות AI עם טקסט עברי - רק אם הכתיב מושלם, אחרת בלי טקסט.
- sources חובה: 3-7 קישורים ישירים למקור רשמי (PDF של manual, דף יצרן רשמי, מסמך תקן, מחקר). לכל מקור label תיאורי בעברית + URL מלא.

כל החזרת JSON חייבת לעמוד בסכמה במדויק.`;

  const linksList = internalLinkCandidates
    .slice(0, 40)
    .map((a) => `- ${a.title} (/article/${a.slug})`)
    .join("\n");

  const prompt = `כתוב מאמר מלא בנושא: "${opts.topic.title}"
קטגוריה: ${cat?.name ?? opts.topic.category_slug}
מילות מפתח לטרגוט: ${opts.topic.keywords.join(", ")}

מאמרים קיימים לקישור פנימי (בחר 2-6 רלוונטיים):
${linksList}

החזר אובייקט JSON שעומד בסכמה הבאה (כל השדות חובה אלא אם צוין אחרת):
{
  "slug": "kebab-case-english-slug",
  "title": "כותרת בעברית",
  "excerpt": "תקציר 40-220 תווים",
  "metaDescription": "מטה תיאור 80-160 תווים",
  "category": "${cat?.name ?? ""}",
  "categorySlug": "${opts.topic.category_slug}",
  "author": "ענבר פרחי",
  "heroAlt": "תיאור תמונה ראשית בעברית",
  "heroImagePrompt": "english prompt for AI image generator describing the hero image realistic photography style",
  "intro": ["פסקה 1", "פסקה 2"],
  "tldr": [{"label": "כותרת", "value": "תוכן"}],
  "sections": [
    {"id": "section-1", "heading": "...", "level": 2, "paragraphs": ["..."], "inlineImagePrompt": "english photo description of the tool/part being explained, realistic photography", "inlineImageAlt": "תיאור התמונה בעברית"},
    {"id": "section-2", "heading": "...", "level": 2, "list": ["..."], "ordered": false, "inlineImagePrompt": "english description of a comparison diagram, clean infographic style, white background", "inlineImageAlt": "...", "asInfographic": true}
  ],
  "faqs": [{"q": "...", "a": "..."}],
  "glossary": [{"term": "...", "definition": "..."}],
  "contextualLinks": [
    {"match": "טקסט פנימי במאמר", "href": "/article/slug-קיים", "title": "תיאור הקישור"},
    {"match": "מותג או מושג", "href": "https://en.wikipedia.org/wiki/...", "external": true, "rel": "nofollow", "title": "ויקיפדיה"}
  ],
  "specTable": {"title": "...", "columns": ["...", "..."], "rows": [["...", "..."]]},
  "checklist": {"title": "צ'קליסט מעשי", "items": ["...", "..."]},
  "sources": [{"label": "שם המקור", "url": "https://..."}],
  "relatedSlugs": ["slug1", "slug2"]
}`;

  const raw = await callJSON(opts.model, system, prompt, ArticlePayloadSchema);
  return sanitizePayload(raw);
}

/* ---------- 3. Hero image generation ---------- */

export async function generateHeroImage(opts: {
  prompt: string;
  slug: string;
  model: string;
}): Promise<string> {
  const apiKey = getLovableApiKey();
  const body = opts.model.startsWith("openai/")
    ? { model: opts.model, prompt: opts.prompt }
    : {
        model: opts.model,
        messages: [{ role: "user", content: opts.prompt }],
        modalities: ["image", "text"],
      };

  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: {
      "Lovable-API-Key": apiKey,
      "Content-Type": "application/json",
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({ ...body, stream: false }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Image generation failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const json = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const first = json.data?.[0];
  if (!first) throw new Error("Image generation returned no data");

  let bytes: Uint8Array;
  if (first.b64_json) {
    const bin = atob(first.b64_json);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } else if (first.url) {
    const imgRes = await fetch(first.url);
    bytes = new Uint8Array(await imgRes.arrayBuffer());
  } else {
    throw new Error("Image generation returned no b64_json or url");
  }

  const path = `${opts.slug}-${Date.now()}.png`;
  const { error: upErr } = await supabaseAdmin.storage
    .from("article-images")
    .upload(path, bytes, {
      contentType: "image/png",
      upsert: false,
    });
  if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

  const { data: pub } = supabaseAdmin.storage.from("article-images").getPublicUrl(path);
  return pub.publicUrl;
}

/* ---------- 4. QA ---------- */

export type QaIssue = {
  severity: "error" | "warn";
  category: "structure" | "language" | "seo" | "links" | "image" | "facts";
  message: string;
};

export type QaResult = {
  passed: boolean;
  issues: QaIssue[];
};

export async function runArticleQA(opts: {
  payload: GeneratedArticlePayload;
  heroImageUrl: string | null;
  model: string;
}): Promise<QaResult> {
  const issues: QaIssue[] = [];
  const p = opts.payload;

  // Structure
  if (p.sections.length < 4)
    issues.push({ severity: "error", category: "structure", message: "פחות מ-4 sections" });
  if (p.faqs.length < 3)
    issues.push({ severity: "error", category: "structure", message: "פחות מ-3 FAQs" });
  if (p.intro.length < 2)
    issues.push({ severity: "error", category: "structure", message: "intro קצר מדי" });

  // Language
  const allText = JSON.stringify(p);
  if (/[—–]/.test(allText))
    issues.push({
      severity: "error",
      category: "language",
      message: "נמצא מקף ארוך (em/en dash) בטקסט",
    });
  // Gibberish / placeholder markers in body text
  const gibberishPatterns: Array<{ re: RegExp; msg: string }> = [
    { re: /\*{2,}/, msg: "סימני ** או יותר בטקסט (Markdown לא מעובד)" },
    { re: /#{2,}\s/, msg: "סימני ## (Markdown לא מעובד)" },
    { re: /\[\s*(TBD|TODO|XXX|PLACEHOLDER|FILL[_ ]?IN)\s*\]/i, msg: "מציין placeholder בטקסט" },
    { re: /\b(lorem ipsum|dolor sit amet)\b/i, msg: "טקסט Lorem Ipsum" },
    { re: /\{\{[^}]+\}\}/, msg: "תבנית {{...}} לא הוחלפה" },
    { re: /undefined|\bNaN\b|\[object Object\]/, msg: "ערך JS שדלף לטקסט (undefined/NaN/[object Object])" },
    { re: /\?{3,}|!{4,}/, msg: "רצף של ??? או !!!! בטקסט" },
    { re: /(.)\1{6,}/, msg: "תו חוזר 7+ פעמים (גיבריש)" },
    { re: /[\u0600-\u06FF]/, msg: "אותיות ערביות בטקסט עברי" },
    { re: /[\uFFFD]/, msg: "תו � פגום בטקסט" },
  ];
  for (const { re, msg } of gibberishPatterns) {
    if (re.test(allText)) {
      issues.push({ severity: "error", category: "language", message: msg });
    }
  }
  // Long stretches of Latin in a Hebrew article (excluding code/brand names is fine — 40+ chars in a row is suspicious)
  const longLatinRuns = allText.match(/[A-Za-z]{40,}/g);
  if (longLatinRuns && longLatinRuns.length > 0) {
    issues.push({
      severity: "warn",
      category: "language",
      message: `רצף ארוך של אותיות לטיניות (${longLatinRuns[0].slice(0, 30)}...) — ייתכן תוכן שלא תורגם`,
    });
  }
  const aiTells = ["בעידן הדיגיטלי", "צלילה לעומק", "במאמר זה נצלול", "ראוי לציין כי"];
  for (const tell of aiTells) {
    if (allText.includes(tell))
      issues.push({
        severity: "warn",
        category: "language",
        message: `סימן מזהה AI: "${tell}"`,
      });
  }

  // SEO
  if (p.title.length > 60)
    issues.push({
      severity: "warn",
      category: "seo",
      message: `כותרת ארוכה מ-60 תווים (${p.title.length})`,
    });
  if (p.metaDescription.length < 80 || p.metaDescription.length > 160)
    issues.push({
      severity: "error",
      category: "seo",
      message: `meta description באורך לא תקין (${p.metaDescription.length})`,
    });

  // Links
  if (p.contextualLinks.length < 4)
    issues.push({ severity: "error", category: "links", message: "פחות מ-4 קישורים contextual" });
  const internalCount = p.contextualLinks.filter(
    (l) => !l.external && l.href.startsWith("/article/"),
  ).length;
  if (internalCount < 4)
    issues.push({ severity: "error", category: "links", message: `פחות מ-4 קישורים פנימיים (${internalCount})` });
  const validSlugs = new Set(staticArticles.map((a) => a.slug));
  for (const l of p.contextualLinks) {
    if (l.href.startsWith("/article/")) {
      const slug = l.href.replace("/article/", "");
      if (!validSlugs.has(slug) && !l.external) {
        issues.push({
          severity: "error",
          category: "links",
          message: `קישור פנימי שבור: ${l.href} (לא קיים)`,
        });
      }
    }
  }

  // External link safety + relevance whitelist (topic = podiatry / foot health)
  const SAFE_EXTERNAL_HOSTS = new Set<string>([
    // Israeli health authorities & HMOs
    "health.gov.il", "gov.il", "clalit.co.il", "maccabi4u.co.il", "leumit.co.il",
    "meuhedet.co.il", "hadassah.org.il", "sheba.co.il", "rambam.org.il",
    "tasmc.org.il", "telavivsourasky.org.il", "assuta.co.il",
    // International health authorities
    "who.int", "cdc.gov", "nih.gov", "nhs.uk", "fda.gov", "europa.eu",
    "ema.europa.eu",
    // Medical research databases
    "pubmed.ncbi.nlm.nih.gov", "ncbi.nlm.nih.gov", "cochranelibrary.com",
    "cochrane.org", "uptodate.com", "medscape.com",
    // Top medical journals
    "bmj.com", "nejm.org", "jamanetwork.com", "thelancet.com", "nature.com",
    "sciencedirect.com", "springer.com", "wiley.com", "bjsm.bmj.com",
    // Clinical guidelines
    "nice.org.uk", "aaos.org", "apma.org", "iwgdfguidelines.org", "iwgdf.org",
    "diabetes.org", "diabetes.org.uk", "idf.org",
    // Renowned clinics & medical references
    "mayoclinic.org", "clevelandclinic.org", "hopkinsmedicine.org",
    "health.harvard.edu", "medlineplus.gov", "merckmanuals.com",
    "msdmanuals.com", "kp.org",
    // Sports medicine
    "acsm.org", "sportsmedicineaustralia.com.au",
    // General reference
    "en.wikipedia.org", "he.wikipedia.org",
    "youtube.com", "youtu.be", "youtube-nocookie.com",
  ]);
  const isSafeHost = (host: string) =>
    SAFE_EXTERNAL_HOSTS.has(host) ||
    [...SAFE_EXTERNAL_HOSTS].some((d) => host === d || host.endsWith("." + d));

  for (const l of p.contextualLinks) {
    if (!l.external) continue;
    try {
      const u = new URL(l.href);
      if (u.protocol !== "https:") {
        issues.push({
          severity: "error",
          category: "links",
          message: `קישור חיצוני לא בטוח (לא HTTPS): ${l.href}`,
        });
        continue;
      }
      const host = u.hostname.replace(/^www\./, "");
      if (!isSafeHost(host)) {
        issues.push({
          severity: "warn",
          category: "links",
          message: `קישור חיצוני לא ברשימת האמון: ${host} — בדוק רלוונטיות ובטיחות`,
        });
      }
      // Suspicious TLDs / URL shorteners
      if (/\.(zip|mov|country|click|loan|work|gq|tk|ml|cf)$/i.test(host)) {
        issues.push({
          severity: "error",
          category: "links",
          message: `קישור חיצוני עם TLD חשוד: ${host}`,
        });
      }
      if (/^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly)$/i.test(host)) {
        issues.push({
          severity: "warn",
          category: "links",
          message: `קישור מקוצר (${host}) — יעד לא ידוע`,
        });
      }
    } catch {
      issues.push({
        severity: "error",
        category: "links",
        message: `קישור חיצוני לא תקין: ${l.href}`,
      });
    }
  }

  // Sources whitelist
  if (p.sources) {
    for (const s of p.sources) {
      try {
        const u = new URL(s.url);
        const host = u.hostname.replace(/^www\./, "");
        if (u.protocol !== "https:") {
          issues.push({ severity: "error", category: "links", message: `מקור לא HTTPS: ${s.url}` });
        } else if (!isSafeHost(host)) {
          issues.push({
            severity: "warn",
            category: "links",
            message: `מקור לא ברשימת האמון: ${host}`,
          });
        }
      } catch {
        issues.push({ severity: "error", category: "links", message: `מקור עם URL פגום: ${s.url}` });
      }
    }
  }

  // Visual richness — at least one inline image/infographic prompt requested
  const visualSections = p.sections.filter(
    (s) => s.inlineImagePrompt || (s as unknown as { image?: unknown }).image,
  ).length;
  if (visualSections < 3)
    issues.push({
      severity: "warn",
      category: "image",
      message: `פחות מ-3 sections עם המחשה ויזואלית (${visualSections})`,
    });

  // Interactivity richness — video, infographic, callouts, tables, checklist
  const hasVideo = p.sections.some(
    (s) => Boolean(s.youtubeId) || Boolean((s as unknown as { video?: unknown }).video),
  );
  const hasInfographic = p.sections.some(
    (s) => Boolean((s as unknown as { infographic?: unknown }).infographic),
  );
  const calloutCount = p.sections.filter(
    (s) => Boolean((s as unknown as { callout?: unknown }).callout),
  ).length;
  const hasSpecTable = Boolean((p as unknown as { specTable?: unknown }).specTable);
  const hasChecklist = Boolean((p as unknown as { checklist?: { items?: unknown[] } }).checklist?.items?.length);
  const hasGlossary = Array.isArray((p as unknown as { glossary?: unknown[] }).glossary) &&
    ((p as unknown as { glossary?: unknown[] }).glossary?.length ?? 0) >= 3;
  const hasTldr = Array.isArray((p as unknown as { tldr?: unknown[] }).tldr) &&
    ((p as unknown as { tldr?: unknown[] }).tldr?.length ?? 0) >= 2;

  const interactiveScore =
    (hasVideo ? 1 : 0) +
    (hasInfographic ? 1 : 0) +
    (calloutCount >= 1 ? 1 : 0) +
    (hasSpecTable ? 1 : 0) +
    (hasChecklist ? 1 : 0) +
    (hasGlossary ? 1 : 0) +
    (hasTldr ? 1 : 0);
  if (interactiveScore < 3) {
    issues.push({
      severity: "warn",
      category: "structure",
      message: `אינטראקטיביות נמוכה (${interactiveScore}/7) — חסרים: ${[
        !hasVideo && "וידאו",
        !hasInfographic && "אינפוגרפיקה",
        calloutCount < 1 && "callout",
        !hasSpecTable && "טבלת מפרט",
        !hasChecklist && "צ'קליסט",
        !hasGlossary && "מילון מונחים",
        !hasTldr && "TL;DR",
      ].filter(Boolean).join(", ")}`,
    });
  }
  if (calloutCount < 1) {
    issues.push({
      severity: "warn",
      category: "structure",
      message: "אין אף callout (טיפ/אזהרה) במאמר",
    });
  }

  // Image
  if (!opts.heroImageUrl)
    issues.push({ severity: "error", category: "image", message: "חסרה תמונת hero" });
  if (!p.heroAlt || p.heroAlt.length < 8)
    issues.push({ severity: "error", category: "image", message: "alt לא תקין" });

  // Engagement & directness (deterministic checks)
  const introLen = p.intro.join(" ").length;
  if (introLen > 900)
    issues.push({
      severity: "warn",
      category: "structure",
      message: `intro ארוך מדי (${introLen} תווים) — לא מגיע מהר לעניין`,
    });
  const fillerPhrases = [
    "בעולם של היום",
    "מאז ומתמיד",
    "כידוע לכולנו",
    "אין ספק ש",
    "חשוב להבין ש",
    "כפי שכולנו יודעים",
    "במהלך השנים האחרונות",
  ];
  for (const phrase of fillerPhrases) {
    if (p.intro.some((par) => par.includes(phrase))) {
      issues.push({
        severity: "warn",
        category: "language",
        message: `מילוי שיווקי ב-intro: "${phrase}"`,
      });
      break;
    }
  }

  // Concept-without-image: sections that mention a tool/part keyword but have no visual
  const VISUAL_KEYWORDS = [
    "מפתח אלן", "מפתח רגעים", "טורקיומטר", "פלאג", "פילטר", "מצת",
    "ברגים", "בורג", "שרשרת", "גלגל שיניים", "בלמים", "רפידות",
    "מצמד", "פיסטון", "שסתום", "קרבורטור", "כובע",
  ];
  let missingConceptVisuals = 0;
  for (const s of p.sections) {
    const text = (s.paragraphs?.join(" ") ?? "") + " " + (s.list?.map((it) => (typeof it === "string" ? it : (it as { text: string }).text)).join(" ") ?? "");
    const hasVisual =
      Boolean(s.inlineImagePrompt) ||
      Boolean((s as unknown as { image?: unknown }).image) ||
      Boolean((s as unknown as { infographic?: unknown }).infographic) ||
      Boolean(s.youtubeId);
    const mentionsConcept = VISUAL_KEYWORDS.some((k) => text.includes(k));
    if (mentionsConcept && !hasVisual) missingConceptVisuals++;
  }
  if (missingConceptVisuals > 0)
    issues.push({
      severity: "warn",
      category: "image",
      message: `${missingConceptVisuals} סעיפים מזכירים כלי/חלק בלי המחשה ויזואלית`,
    });

  // Facts — ask AI to flag suspicious factual claims
  try {
    const langCheck = await callJSON(
      opts.model,
      `אתה עורך לשון עברי קפדן. תפקידך לזהות טעויות כתיב, מילים שאינן קיימות בעברית תקנית, טעויות הקלדה (כמו ת-ק-ל-א-ת במקום ת-ק-ל-ו-ת), אותיות לא במקום (ערבית/לטינית בתוך מילה עברית), ניסוחים שבורים או חסרי משמעות. אל תעיר על סגנון או טעם — רק טעויות לשון ברורות.`,
      `בדוק את הטקסטים הבאים ממאמר עברי. החזר רק טעויות לשון/כתיב/מילים לא קיימות. JSON: { "errors": [ { "text": "המילה או המשפט הבעייתי", "fix": "ההצעה התקנית", "reason": "סיבה קצרה" } ] }

כותרת: ${p.title}
תקציר: ${p.excerpt}
meta: ${p.metaDescription}
כותרות סעיפים:
${p.sections.map((s) => "- " + s.heading).join("\n")}
שאלות FAQ:
${p.faqs.map((f) => "- " + f.q).join("\n")}
פסקאות intro:
${p.intro.join("\n")}`,
      z.object({
        errors: z
          .array(
            z.object({
              text: z.string(),
              fix: z.string().optional(),
              reason: z.string(),
            }),
          )
          .max(20),
      }),
    );
    for (const e of langCheck.errors.slice(0, 10)) {
      issues.push({
        severity: "error",
        category: "language",
        message: `טעות לשון: "${e.text}"${e.fix ? ` → "${e.fix}"` : ""} (${e.reason})`,
      });
    }
  } catch (e) {
    issues.push({
      severity: "warn",
      category: "language",
      message: `בדיקת לשון נכשלה: ${(e as Error).message}`,
    });
  }

  try {
    const factCheck = await callJSON(
      opts.model,
      `אתה עורך עובדות שמרני. תפקידך לזהות הצהרות עובדתיות חשודות במאמר על אופנועי שטח. החזר רק הצהרות שאתה לא בטוח שהן נכונות (כגון מחירים מומצאים, מספרי דגם לא קיימים, תאריכים).`,
      `בדוק את המאמר הבא לעובדות חשודות. החזר JSON: { "suspicious": [ { "claim": "...", "reason": "..." } ] }

כותרת: ${p.title}
תקציר: ${p.excerpt}
סעיפים: ${p.sections.map((s) => s.heading + ": " + (s.paragraphs?.join(" ") ?? s.list?.join(", ") ?? "")).join("\n").slice(0, 4000)}`,
      z.object({
        suspicious: z.array(z.object({ claim: z.string(), reason: z.string() })).max(20),
      }),
    );
    for (const s of factCheck.suspicious.slice(0, 5)) {
      issues.push({
        severity: "warn",
        category: "facts",
        message: `${s.claim} — ${s.reason}`,
      });
    }
  } catch (e) {
    issues.push({
      severity: "warn",
      category: "facts",
      message: `בדיקת עובדות נכשלה: ${(e as Error).message}`,
    });
  }

  const passed = !issues.some((i) => i.severity === "error");
  return { passed, issues };
}

/* ---------- 4b. Inline section images ---------- */

/* ---------- 4a. QA-driven repair (fix detected issues) ---------- */

const RepairSchema = z.object({
  newIntro: z.array(z.string().min(20)).min(2).max(4).optional(),
  sectionRewrites: z
    .array(
      z.object({
        sectionId: z.string(),
        newParagraphs: z.array(z.string().min(20)).min(1).max(5),
      }),
    )
    .max(6)
    .default([]),
});

export type RepairResult = {
  changed: boolean;
  introRewritten: boolean;
  sectionsRewritten: number;
  imagesAdded: number;
  videosAdded: number;
  faqsAdded: number;
  linksAdded: number;
};

/**
 * Surgical fix for detected QA issues:
 * - Rewrites verbose/non-direct intro and weak sections.
 * - Adds missing inline images for sections mentioning tools/parts.
 * - Adds missing internal links and FAQs via enrichment.
 * Mutates payload in place when possible; returns the (sanitized) result.
 */
export async function repairArticleIssues(opts: {
  payload: GeneratedArticlePayload;
  issues: QaIssue[];
  slug: string;
  qaModel: string;
  imageModel: string;
}): Promise<{ payload: GeneratedArticlePayload; result: RepairResult }> {
  const result: RepairResult = {
    changed: false,
    introRewritten: false,
    sectionsRewritten: 0,
    imagesAdded: 0,
    videosAdded: 0,
    faqsAdded: 0,
    linksAdded: 0,
  };

  let p: GeneratedArticlePayload = JSON.parse(JSON.stringify(opts.payload));

  const issueMessages = opts.issues.map((i) => `[${i.severity}] ${i.category}: ${i.message}`);

  // 0. Language fixes — find/replace typos and misspellings flagged by the language check.
  // The langCheck message format is: `טעות לשון: "BAD" → "GOOD" (reason)`.
  const langIssues = opts.issues.filter(
    (i) => i.category === "language" && i.message.startsWith("טעות לשון:"),
  );
  if (langIssues.length > 0) {
    const pairs: Array<{ bad: string; good: string }> = [];
    for (const i of langIssues) {
      const m = i.message.match(/"([^"]+)"\s*→\s*"([^"]+)"/);
      if (m && m[1] && m[2] && m[1] !== m[2]) pairs.push({ bad: m[1], good: m[2] });
    }
    if (pairs.length > 0) {
      const replaceAll = (text: string): string => {
        let out = text;
        for (const { bad, good } of pairs) {
          if (out.includes(bad)) out = out.split(bad).join(good);
        }
        return out;
      };
      const before = JSON.stringify(p);
      p.title = replaceAll(p.title);
      p.excerpt = replaceAll(p.excerpt);
      p.metaDescription = replaceAll(p.metaDescription);
      p.heroAlt = replaceAll(p.heroAlt);
      p.intro = p.intro.map(replaceAll);
      p.tldr = p.tldr.map((t) => ({ label: replaceAll(t.label), value: replaceAll(t.value) }));
      p.sections = p.sections.map((s) => ({
        ...s,
        heading: replaceAll(s.heading),
        paragraphs: s.paragraphs?.map(replaceAll),
        list: s.list?.map(replaceAll),
        callout: s.callout
          ? { ...s.callout, title: replaceAll(s.callout.title), body: replaceAll(s.callout.body) }
          : undefined,
      }));
      p.faqs = p.faqs.map((f) => ({ q: replaceAll(f.q), a: replaceAll(f.a) }));
      p.glossary = p.glossary?.map((g) => ({
        term: replaceAll(g.term),
        definition: replaceAll(g.definition),
      }));
      if (JSON.stringify(p) !== before) result.changed = true;
    }
  }

  // 1. Textual repair (intro + weak sections) — only when language/structure issues exist
  const needsTextFix = opts.issues.some(
    (i) =>
      (i.category === "language" || i.category === "structure") &&
      (i.message.includes("intro") ||
        i.message.includes("מילוי") ||
        i.message.includes("AI") ||
        i.message.includes("גיבריש") ||
        i.message.includes("ערבית") ||
        i.message.includes("Markdown")),
  );

  if (needsTextFix) {
    try {
      const sectionsBrief = p.sections
        .map((s) => `- id="${s.id}" | ${s.heading}\n  ${(s.paragraphs?.join(" ") ?? "").slice(0, 300)}`)
        .join("\n");

      const repairSystem = `אתה עורך תוכן בכיר באתר אופנועי שטח בעברית. אסור מקף ארוך, אסור ביטויי מילוי שיווקיים, אסור סימני AI. כתיבה ישירה, פרקטית, מגיעה לעניין במשפט הראשון. כל פסקה — עובדה אחת או פעולה אחת. אסור "בעולם של היום", "חשוב להבין ש", "כידוע לכולנו".`;

      const repairPrompt = `בעיות שזוהו במאמר:
${issueMessages.join("\n")}

כותרת המאמר: ${p.title}

ה-intro הנוכחי:
${p.intro.map((par, i) => `${i + 1}. ${par}`).join("\n")}

הסעיפים הקיימים (תמצית):
${sectionsBrief}

משימה:
1. אם ה-intro ארוך, מילוי, או לא מגיע לעניין — החזר newIntro: מערך של 2-3 פסקאות קצרות וישירות. פסקה ראשונה: המסקנה המרכזית במשפט אחד. פסקה שנייה: למה זה חשוב לרוכב. אופציונלי שלישית: מה הקורא יקבל מהמאמר. אם ה-intro תקין, אל תחזיר newIntro.
2. אם יש sections עם פסקאות מילוי או חזרות — החזר sectionRewrites עם newParagraphs קצרות וענייניות. רק לסעיפים שבאמת צריך לשפר. מקסימום 3 סעיפים.

החזר JSON: { "newIntro": [...], "sectionRewrites": [{ "sectionId": "...", "newParagraphs": [...] }] }

אם אין מה לתקן, החזר אובייקט ריק עם sectionRewrites: [].`;

      const repair = await callJSON(opts.qaModel, repairSystem, repairPrompt, RepairSchema);

      if (repair.newIntro && repair.newIntro.length >= 2) {
        p.intro = repair.newIntro;
        result.introRewritten = true;
        result.changed = true;
      }

      const byId = new Map(p.sections.map((s) => [s.id, s] as const));
      for (const rw of repair.sectionRewrites) {
        const s = byId.get(rw.sectionId);
        if (!s) continue;
        s.paragraphs = rw.newParagraphs;
        result.sectionsRewritten++;
        result.changed = true;
      }
    } catch (e) {
      console.error(`Text repair failed for ${opts.slug}:`, e);
    }
  }

  // 2. Visual/links/FAQ repair via enrichment — fixes "missing images", "missing links", "missing FAQs"
  const needsEnrichment = opts.issues.some(
    (i) =>
      i.category === "image" ||
      i.category === "links" ||
      (i.category === "structure" && i.message.includes("FAQ")),
  );

  if (needsEnrichment) {
    try {
      const enr = await enrichPublishedArticle({
        payload: p,
        slug: opts.slug,
        qaModel: opts.qaModel,
        imageModel: opts.imageModel,
      });
      p = enr.payload;
      result.imagesAdded = enr.result.imagesGenerated;
      result.videosAdded = enr.result.videosAdded;
      result.faqsAdded = enr.result.faqsAdded;
      result.linksAdded = enr.result.linksAdded;
      if (enr.result.changed) result.changed = true;
    } catch (e) {
      console.error(`Enrichment repair failed for ${opts.slug}:`, e);
    }
  }

  return { payload: result.changed ? sanitizePayload(p) : p, result };
}



/**
 * עובר על sections עם inlineImagePrompt ומייצר תמונות אינליין.
 * משנה את ה-payload במקום (mutates).
 */
export async function generateInlineImages(opts: {
  payload: GeneratedArticlePayload;
  slug: string;
  model: string;
  maxImages?: number;
}): Promise<void> {
  const max = opts.maxImages ?? 4;
  let generated = 0;
  for (const section of opts.payload.sections) {
    if (generated >= max) break;
    if (!section.inlineImagePrompt || !section.inlineImageAlt) continue;
    try {
      const suffix = section.asInfographic
        ? " - clean infographic diagram, minimalist, light background, labeled illustration, no text in foreign language"
        : " - realistic close-up photography, dirt bike/off-road context, natural light, no text, no watermark";
      const url = await generateHeroImage({
        prompt: section.inlineImagePrompt + suffix,
        slug: `${opts.slug}-${section.id}`,
        model: opts.model,
      });
      // Inject as image or infographic into the section
      const target = section as unknown as Record<string, unknown>;
      const imgObj = {
        src: url,
        alt: section.inlineImageAlt,
        caption: section.inlineImageCaption,
      };
      if (section.asInfographic) target.infographic = imgObj;
      else target.image = imgObj;
      generated++;
    } catch (e) {
      console.error(`Inline image failed for section ${section.id}:`, e);
    }
  }
}

/* ---------- 4c. Enrichment: find opportunities and apply them ---------- */

const EnrichmentSchema = z.object({
  sectionImages: z
    .array(
      z.object({
        sectionId: z.string(),
        inlineImagePrompt: z.string().min(20).max(500),
        inlineImageAlt: z.string().min(8).max(160),
        inlineImageCaption: z.string().max(200).optional(),
        asInfographic: z.boolean().optional(),
      }),
    )
    .max(6)
    .default([]),
  sectionVideos: z
    .array(
      z.object({
        sectionId: z.string(),
        youtubeId: z.string().min(5).max(20),
        youtubeTitle: z.string().max(160),
        reason: z.string().max(200).optional(),
      }),
    )
    .max(4)
    .default([]),
  newFaqs: z
    .array(
      z.preprocess(
        (value) => {
          if (!value || typeof value !== "object") return value;
          const item = value as Record<string, unknown>;
          return {
            q: item.q ?? item.question ?? item.title,
            a: item.a ?? item.answer ?? item.body,
          };
        },
        z.object({ q: z.string().min(5).max(200), a: z.string().min(10).max(800) }),
      ),
    )
    .max(5)
    .default([]),
  newContextualLinks: z
    .array(
      z.object({
        match: z.string().min(2).max(120),
        href: z.string(),
        external: z.boolean().optional(),
        rel: z.enum(["dofollow", "nofollow", "sponsored", "ugc"]).optional(),
        title: z.string().max(200).optional(),
      }),
    )
    .max(6)
    .default([]),
});

export type EnrichmentResult = {
  changed: boolean;
  imagesGenerated: number;
  videosAdded: number;
  faqsAdded: number;
  linksAdded: number;
};

/* ---------- 6. Fact-check against authoritative sources ---------- */

const FactCheckSchema = z.object({
  corrections: z
    .array(
      z.object({
        original: z.string().min(3).max(1000).describe("הטקסט המדויק שמופיע במאמר, כפי שהוא, כדי שנוכל למצוא ולהחליף"),
        corrected: z.string().min(3).max(1000).describe("הטקסט המתוקן, באותה שפה ובאותו סגנון, בלי מקף ארוך"),
        whatWasWrong: z.string().min(5).max(400).describe("הסבר קצר בעברית מה היה לא נכון"),
        source: z.string().min(3).max(300).describe("המקור הסמכותי שעליו ההתבסס התיקון (שם דומיין/יצרן/תקן)"),
        confidence: z.enum(["high", "medium"]).describe("גבוה רק אם זה ידוע ומאומת מול מקור סמכותי"),
      }),
    )
    .max(30)
    .default([]),
  verifiedNotes: z
    .array(z.string().min(3).max(300))
    .max(10)
    .default([])
    .describe("הערות קצרות על עובדות שנבדקו ונמצאו נכונות"),
});

export type FactCheckCorrection = {
  original: string;
  corrected: string;
  whatWasWrong: string;
  source: string;
  confidence: "high" | "medium";
  applied: boolean;
};

export type FactCheckResult = {
  changed: boolean;
  claimsReviewed: number;
  correctionsProposed: number;
  correctionsApplied: number;
  corrections: FactCheckCorrection[];
};

const AUTHORITATIVE_SOURCES = [
  "יצרני אופנועים רשמיים: ktm.com, husqvarna-motorcycles.com, betamotor.com, honda.co.il, powersports.honda.com, yamaha-motor.eu, sherco.com, gasgas.com, kawasaki.eu",
  "תקני בטיחות: mipsprotection.com, unece.org (ECE 22.06), snell.org, fim-moto.com, smf.org",
  "יצרני חלקים/שמנים: motul.com, ngk.com, brembo.com, dunlop.eu, michelin.com, pirelli.com, didchain.com, motionpro.com",
  "רגולציה ישראלית: gov.il, parks.org.il, npa.org.il, kkl.org.il",
  "ידע מוסמך: en.wikipedia.org, he.wikipedia.org",
  "מחקר: pubmed.ncbi.nlm.nih.gov, nih.gov",
];

function collectArticleTexts(p: GeneratedArticlePayload): string[] {
  const out: string[] = [];
  out.push(p.title, p.excerpt, p.metaDescription, ...p.intro);
  for (const s of p.sections) {
    out.push(s.heading);
    if (s.paragraphs) out.push(...s.paragraphs);
    if (s.list) {
      for (const it of s.list) out.push(typeof it === "string" ? it : (it as { text: string }).text);
    }
    if (s.callout) out.push(s.callout.title, s.callout.body);
  }
  for (const f of p.faqs) out.push(f.q, f.a);
  if (p.tldr) for (const t of p.tldr) out.push(t.label, t.value);
  return out;
}

function replaceInPayload(p: GeneratedArticlePayload, original: string, corrected: string): boolean {
  let did = false;
  const fix = (s: string): string => {
    if (s.includes(original)) {
      did = true;
      return s.split(original).join(corrected);
    }
    return s;
  };
  p.title = fix(p.title);
  p.excerpt = fix(p.excerpt);
  p.metaDescription = fix(p.metaDescription);
  p.intro = p.intro.map(fix);
  for (const s of p.sections) {
    s.heading = fix(s.heading);
    if (s.paragraphs) s.paragraphs = s.paragraphs.map(fix);
    if (s.list) {
      s.list = s.list.map((it) =>
        typeof it === "string"
          ? fix(it)
          : { ...(it as object), text: fix((it as { text: string }).text) },
      ) as typeof s.list;
    }
    if (s.callout) {
      s.callout.title = fix(s.callout.title);
      s.callout.body = fix(s.callout.body);
    }
  }
  p.faqs = p.faqs.map((f) => ({ q: fix(f.q), a: fix(f.a) }));
  if (p.tldr) p.tldr = p.tldr.map((t) => ({ label: fix(t.label), value: fix(t.value) }));
  return did;
}

export async function factCheckPublishedArticle(opts: {
  payload: GeneratedArticlePayload;
  slug: string;
  model: string;
}): Promise<{ payload: GeneratedArticlePayload; result: FactCheckResult }> {
  const p: GeneratedArticlePayload = JSON.parse(JSON.stringify(opts.payload));
  const texts = collectArticleTexts(p);
  const corpus = texts.join("\n").slice(0, 12000);

  const system = `אתה בודק עובדות מקצועי לאתר אופנועי שטח בעברית. אתה מאמת כל הצהרה עובדתית רק מול מקורות סמכותיים. אם אתה לא בטוח במאה אחוז שמקור סמכותי תומך בהצהרה, אל תציע תיקון. אסור להמציא מקורות. אסור מקף ארוך. אם הטקסט המקורי נכון, אל תכלול אותו ברשימת התיקונים.`;

  const prompt = `מקורות סמכותיים מותרים בלבד:
${AUTHORITATIVE_SOURCES.map((s) => "- " + s).join("\n")}

המאמר (בלוקים מופרדים בשורות):
${corpus}

משימה:
1. עבור על כל הצהרה עובדתית במאמר (מספרים, מפרטים טכניים, תאריכים, שמות דגמים, נהלים, חוקים, מחירים, מידות, מומנטי הידוק, פערי שסתומים, נפחי שמן, ערכי NGK, תקני ECE/Snell וכדומה).
2. עבור כל הצהרה — בדוק אותה מול הידע שלך שמבוסס על המקורות הסמכותיים בלבד.
3. אם מצאת שגיאה ויש לך מקור סמכותי שתומך בתיקון — הוסף ל-corrections. ה-"original" חייב להיות מחרוזת שמופיעה ממש בטקסט המקורי (העתק מדויק, כולל ניקוד). ה-"corrected" חייב להיות תיקון מדויק וקצר באותה שפה.
4. אם אינך בטוח — אל תכלול. עדיף לפספס תיקון מאשר להזיק.
5. ב-verifiedNotes ציין עד 5 עובדות מרכזיות שבדקת ונמצאו נכונות (לתיעוד בלבד).

החזר JSON: { "corrections": [...], "verifiedNotes": [...] }`;

  let res: z.infer<typeof FactCheckSchema>;
  try {
    res = await callJSON(opts.model, system, prompt, FactCheckSchema);
  } catch (e) {
    console.error(`Fact-check AI call failed for ${opts.slug}:`, e);
    return {
      payload: opts.payload,
      result: { changed: false, claimsReviewed: 0, correctionsProposed: 0, correctionsApplied: 0, corrections: [] },
    };
  }

  const applied: FactCheckCorrection[] = [];
  let changed = false;
  for (const c of res.corrections) {
    if (c.confidence !== "high") {
      applied.push({ ...c, applied: false });
      continue;
    }
    const did = replaceInPayload(p, c.original, c.corrected);
    if (did) changed = true;
    applied.push({ ...c, applied: did });
  }

  return {
    payload: changed ? sanitizePayload(p) : opts.payload,
    result: {
      changed,
      claimsReviewed: res.corrections.length + res.verifiedNotes.length,
      correctionsProposed: res.corrections.length,
      correctionsApplied: applied.filter((a) => a.applied).length,
      corrections: applied,
    },
  };
}

export async function enrichPublishedArticle(opts: {
  payload: GeneratedArticlePayload;
  slug: string;
  qaModel: string;
  imageModel: string;
}): Promise<{ payload: GeneratedArticlePayload; result: EnrichmentResult }> {
  const p = opts.payload;

  const sectionsList = p.sections
    .map((s) => {
      const hasImage =
        Boolean(s.inlineImagePrompt) ||
        Boolean((s as unknown as { image?: unknown }).image) ||
        Boolean((s as unknown as { infographic?: unknown }).infographic);
      const hasVideo = Boolean(s.youtubeId);
      const body = (s.paragraphs?.join(" ") ?? s.list?.join(", ") ?? "").slice(0, 400);
      return `- id="${s.id}" | heading="${s.heading}" | hasImage=${hasImage} | hasVideo=${hasVideo}\n  ${body}`;
    })
    .join("\n");

  const internalLinkCandidates = staticArticles
    .slice(0, 40)
    .map((a) => `- ${a.title} (/article/${a.slug})`)
    .join("\n");

  const existingFaqs = p.faqs.map((f) => `- ${f.q}`).join("\n");

  const system = `אתה עורך תוכן בכיר באתר "ענבר פרחי". המאמר כבר פורסם. תפקידך לאתר הזדמנויות שיכולות להעלות משמעותית את הערך, החוויה והדירוג. אסור מקף ארוך, אסור סימני AI. עברית טבעית.`;

  const prompt = `המאמר הקיים:
כותרת: ${p.title}
תקציר: ${p.excerpt}

סעיפים קיימים:
${sectionsList}

FAQs קיימים:
${existingFaqs || "(אין)"}

מאמרים פנימיים זמינים לקישור:
${internalLinkCandidates}

החזר JSON עם הזדמנויות שיפור בלבד (בלי לחזור על מה שכבר קיים):

1. "sectionImages": לאיזה sectionId שאין לו תמונה/אינפוגרפיקה — הוסף inlineImagePrompt באנגלית (תיאור מציאותי של כלי/חלק/פעולה), inlineImageAlt בעברית. אם זו טבלת השוואה/דיאגרמה/סיכום — asInfographic: true. בחר רק סעיפים שתמונה תוסיף להם ערך מוחשי (כלים, חלקים, טכניקות, מיקומים). מקסימום 4.

2. "sectionVideos": אם יש סעיף שסרטון יוטיוב יוסיף לו ערך עצום (טכניקת רכיבה, הדגמת תיקון), החזר youtubeId אמיתי שאתה בטוח שקיים ביוטיוב ורלוונטי בדיוק לנושא. אם אינך בטוח ש-ID קיים — אל תכלול. עדיף ריק על שגוי. מקסימום 2.

3. "newFaqs": שאלות נפוצות שחסרות במאמר ושהקהל באמת שואל. רק שאלות חדשות שלא קיימות. מקסימום 3.

4. "newContextualLinks": קישורים פנימיים חדשים (href="/article/slug" מהרשימה למעלה) למאמרים רלוונטיים שעדיין לא מקושרים. ה-"match" חייב להיות טקסט שמופיע ממש בגוף המאמר. מקסימום 4.

סכמה:
{ "sectionImages": [...], "sectionVideos": [...], "newFaqs": [...], "newContextualLinks": [...] }

החזר אובייקטים ריקים [] אם אין הזדמנות אמיתית. אל תמציא.`;

  let enrichment: z.infer<typeof EnrichmentSchema>;
  try {
    enrichment = await callJSON(opts.qaModel, system, prompt, EnrichmentSchema);
  } catch (e) {
    console.error(`Enrichment AI call failed for ${opts.slug}:`, e);
    return { payload: p, result: { changed: false, imagesGenerated: 0, videosAdded: 0, faqsAdded: 0, linksAdded: 0 } };
  }

  let changed = false;
  const next: GeneratedArticlePayload = {
    ...p,
    sections: p.sections.map((s) => ({ ...s })),
    faqs: [...p.faqs],
    contextualLinks: [...p.contextualLinks],
  };

  // Apply section image prompts (only to sections lacking visuals)
  const sectionsById = new Map(next.sections.map((s) => [s.id, s] as const));
  let imagePromptsQueued = 0;
  for (const item of enrichment.sectionImages) {
    const s = sectionsById.get(item.sectionId);
    if (!s) continue;
    const hasImage =
      Boolean(s.inlineImagePrompt) ||
      Boolean((s as unknown as { image?: unknown }).image) ||
      Boolean((s as unknown as { infographic?: unknown }).infographic);
    if (hasImage) continue;
    s.inlineImagePrompt = item.inlineImagePrompt;
    s.inlineImageAlt = item.inlineImageAlt;
    s.inlineImageCaption = item.inlineImageCaption;
    s.asInfographic = item.asInfographic;
    imagePromptsQueued++;
    changed = true;
  }

  // Apply videos (only to sections without one)
  let videosAdded = 0;
  for (const v of enrichment.sectionVideos) {
    const s = sectionsById.get(v.sectionId);
    if (!s || s.youtubeId) continue;
    s.youtubeId = v.youtubeId;
    s.youtubeTitle = v.youtubeTitle;
    videosAdded++;
    changed = true;
  }

  // Append new FAQs (dedupe by question)
  const existingQ = new Set(next.faqs.map((f) => f.q.trim()));
  let faqsAdded = 0;
  for (const f of enrichment.newFaqs) {
    if (existingQ.has(f.q.trim())) continue;
    next.faqs.push({ q: f.q, a: f.a });
    faqsAdded++;
    changed = true;
    if (next.faqs.length >= 8) break;
  }

  // Append new internal links (dedupe by href)
  const existingHref = new Set(next.contextualLinks.map((l) => l.href));
  const validSlugs = new Set(staticArticles.map((a) => a.slug));
  let linksAdded = 0;
  for (const l of enrichment.newContextualLinks) {
    if (existingHref.has(l.href)) continue;
    if (l.href.startsWith("/article/")) {
      const slug = l.href.replace("/article/", "");
      if (!validSlugs.has(slug)) continue;
    }
    next.contextualLinks.push(l);
    linksAdded++;
    changed = true;
    if (next.contextualLinks.length >= 14) break;
  }

  // Generate the queued inline images
  let imagesGenerated = 0;
  if (imagePromptsQueued > 0) {
    const before = next.sections.filter(
      (s) =>
        (s as unknown as { image?: unknown }).image ||
        (s as unknown as { infographic?: unknown }).infographic,
    ).length;
    await generateInlineImages({
      payload: next,
      slug: opts.slug,
      model: opts.imageModel,
      maxImages: imagePromptsQueued,
    });
    const after = next.sections.filter(
      (s) =>
        (s as unknown as { image?: unknown }).image ||
        (s as unknown as { infographic?: unknown }).infographic,
    ).length;
    imagesGenerated = Math.max(0, after - before);
  }

  return {
    payload: sanitizePayload(next),
    result: { changed, imagesGenerated, videosAdded, faqsAdded, linksAdded },
  };
}

/* ---------- 5. Build Article object from DB row ---------- */

export function payloadToArticle(
  row: {
    slug: string;
    title: string;
    payload: unknown;
    hero_image_url: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  },
) {
  const p = row.payload as GeneratedArticlePayload;
  const date = row.published_at ?? row.created_at;
  const dateModified = row.updated_at;
  const cat = categories.find((c) => c.slug === p.categorySlug);
  return {
    slug: row.slug,
    title: p.title,
    excerpt: p.excerpt,
    metaDescription: p.metaDescription,
    category: cat?.name ?? p.category,
    categorySlug: p.categorySlug,
    author: p.author,
    date,
    dateLabel: formatHebrewDate(date),
    dateModified,
    dateModifiedLabel: formatHebrewDate(dateModified),
    readingTime: estimateReadingTime(p),
    heroImage: row.hero_image_url ?? "/placeholder.svg",
    heroAlt: p.heroAlt,
    intro: p.intro,
    tldr: p.tldr,
    specTable: p.specTable,
    checklist: p.checklist,
    sources: p.sources,
    sections: p.sections.map((s) => ({
      id: s.id,
      heading: s.heading,
      level: s.level,
      paragraphs: s.paragraphs,
      list: s.list,
      ordered: s.ordered,
      callout: s.callout,
      image: (s as unknown as { image?: { src: string; alt: string; caption?: string } }).image,
      infographic: (s as unknown as { infographic?: { src: string; alt: string; caption?: string } }).infographic,
      video: s.youtubeId
        ? { youtubeId: s.youtubeId, title: s.youtubeTitle ?? s.heading }
        : undefined,
    })),
    relatedSlugs: p.relatedSlugs,
    faqs: p.faqs,
    glossary: p.glossary,
    contextualLinks: p.contextualLinks,
  };
}