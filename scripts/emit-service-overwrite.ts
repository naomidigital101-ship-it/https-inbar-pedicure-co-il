/**
 * מייצר SQL שדורס את תוכן עמודי הטיפולים בדאטאבייס בתוכן שבקוד.
 *
 * שונה מ-emit-seed.ts בשתי נקודות: אין כאן התנאי "רק אם השורה ריקה",
 * והוא כולל גם את שדות המטא — שם יושבת הכתובת שמופיעה בתוצאות גוגל.
 *
 * הרצה: npx tsx scripts/emit-service-overwrite.ts <outDir>
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { SERVICES } from "../src/lib/services-content";

const lit = (v: string | null | undefined) =>
  v === null || v === undefined ? "NULL" : `'${v.replace(/'/g, "''")}'`;
const j = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const outDir = process.argv[2] ?? ".";

for (const s of SERVICES) {
  const sql = `update public.services set
  nav_label = ${lit(s.navLabel)},
  title = ${lit(s.title)},
  subtitle = ${lit(s.subtitle)},
  meta_title = ${lit(s.metaTitle)},
  meta_description = ${lit(s.metaDescription)},
  tldr = ${lit(s.tldr)},
  intro = ${lit(s.intro)},
  quick_facts = ${j(s.quickFacts)},
  sections = ${j(s.sections)},
  red_flags = ${j(s.redFlags)},
  faqs = ${j(s.faqs)},
  sources = '[]'::jsonb
where slug = ${lit(s.slug)};`;
  writeFileSync(join(outDir, `${s.slug}.sql`), sql, "utf8");
  console.log(`${s.slug}\t${sql.length} chars`);
}
