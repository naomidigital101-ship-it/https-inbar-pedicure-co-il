/**
 * מייצר SQL לייבוא התוכן מקבצי המקור לדאטאבייס.
 *
 * הסקריפט קורא את המודולים עצמם, ולכן אין תמלול ידני של תוכן קליני.
 * הרצה: bun scripts/emit-seed.ts <blocks|categories|service:SLUG|gallery>
 */

import { SERVICES } from "../src/lib/services-content";
import { categories as CATS } from "../src/lib/categories";
import { BLOCK_DEFS, HOME_GALLERY_SEED } from "../src/lib/content-blocks";

const lit = (v: string | null | undefined) =>
  v === null || v === undefined ? "NULL" : `'${v.replace(/'/g, "''")}'`;
const j = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const arg = process.argv[2] ?? "";
const out: string[] = [];

if (arg === "blocks") {
  BLOCK_DEFS.forEach((b, i) => {
    out.push(`insert into public.content_blocks
  (block_key, label, description, items, item_schema, sort_order)
values (${lit(b.blockKey)}, ${lit(b.label)}, ${lit(b.description)}, ${j(b.items)}, ${j(b.itemSchema)}, ${(i + 1) * 10})
on conflict (block_key) do update set
  label = excluded.label,
  description = excluded.description,
  item_schema = excluded.item_schema,
  sort_order = excluded.sort_order,
  items = case when jsonb_array_length(public.content_blocks.items) = 0
               then excluded.items else public.content_blocks.items end;`);
  });
} else if (arg === "categories") {
  for (const c of CATS) {
    out.push(`update public.knowledge_categories set
  title = ${lit(c.name)}, short_name = ${lit(c.shortName)},
  mod_code = ${lit(c.modCode)}, description = ${lit(c.description)}
where slug = ${lit(c.slug)} and description is null;`);
  }
} else if (arg === "gallery") {
  const rows = HOME_GALLERY_SEED.map(
    (g) =>
      `(${lit(g.title)}, ${lit(g.description)}, ${lit(g.service_slug)}, ${lit(g.before_image)}, ${lit(g.before_alt)}, ${g.sort_order}, true, true)`,
  );
  out.push(`insert into public.before_after
  (title, description, service_slug, before_image, before_alt, sort_order, consent_confirmed, is_published)
select * from (values
${rows.join(",\n")}
) as v(title, description, service_slug, before_image, before_alt, sort_order, consent_confirmed, is_published)
where not exists (select 1 from public.before_after);`);
} else if (arg.startsWith("service:")) {
  const slug = arg.slice("service:".length);
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) throw new Error(`no such service: ${slug}`);
  out.push(`update public.services set
  tldr = ${lit(s.tldr)},
  intro = ${lit(s.intro)},
  quick_facts = ${j(s.quickFacts)},
  sections = ${j(s.sections)},
  red_flags = ${j(s.redFlags)},
  faqs = ${j(s.faqs)},
  sources = ${j(s.sources)}
where slug = ${lit(s.slug)} and jsonb_array_length(sections) = 0;`);
} else {
  throw new Error("usage: blocks | categories | gallery | service:SLUG");
}

process.stdout.write(out.join("\n\n") + "\n");
