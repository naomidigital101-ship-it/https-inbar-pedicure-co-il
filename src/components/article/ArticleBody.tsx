import { Fragment, type ReactNode } from "react";
import type { Article, ContextualLink, ListItem } from "@/lib/articles";
import { Callout } from "./Callout";
import { InArticleCTA } from "./InArticleCTA";

/**
 * Whitelist קשיח של דומיינים סמכותיים שמקבלים DoFollow.
 * כל דומיין אחר נכפה ל-nofollow גם אם סומן אחרת.
 */
const DOFOLLOW_HOSTS = new Set<string>([
  // יצרני אופנועים רשמיים
  "ktm.com", "husqvarna-motorcycles.com", "betamotor.com",
  "honda.co.il", "powersports.honda.com", "yamaha-motor.eu",
  "sherco.com", "gasgas.com", "kawasaki.eu",
  // תקני בטיחות ורגולציה
  "mipsprotection.com", "unece.org", "nhtsa.gov",
  "snell.org", "fim-moto.com", "smf.org",
  // יצרני חלקים ושמנים
  "motul.com", "ngk.com", "brembo.com",
  "dunlop.eu", "michelin.com", "pirelli.com",
  "didchain.com", "rkexcelamerica.com", "motionpro.com",
  // ידע מוסמך
  "en.wikipedia.org", "he.wikipedia.org",
  // רגולציה ישראלית
  "gov.il", "parks.org.il", "npa.org.il", "kkl.org.il",
  // יצרני נוספים
  "ngkntk.com",
  // מחקר רפואי
  "pubmed.ncbi.nlm.nih.gov", "nih.gov", "bmj.com", "nejm.org",
]);

function isAllowedDofollow(href: string): boolean {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (DOFOLLOW_HOSTS.has(host)) return true;
    // התרת subdomains של gov.il / parks.org.il / nih.gov (שירותים ממשלתיים)
    return [...DOFOLLOW_HOSTS].some(
      (d) => host === d || host.endsWith("." + d),
    );
  } catch {
    return false;
  }
}

function buildExternalRel(
  href: string,
  rel: ContextualLink["rel"] | undefined,
): string {
  const base = "noopener noreferrer";
  const requested = rel ?? "dofollow";
  if (requested === "sponsored") return `${base} sponsored nofollow`;
  if (requested === "ugc") return `${base} ugc nofollow`;
  if (requested === "nofollow") return `${base} nofollow`;
  // dofollow — רק אם הדומיין ב-whitelist
  return isAllowedDofollow(href) ? base : `${base} nofollow`;
}

function getItemText(item: ListItem): string {
  return typeof item === "string" ? item : item.text;
}
function getItemImage(item: ListItem) {
  return typeof item === "string" ? undefined : item.inlineImage;
}

/**
 * מזריק את הקישור הראשון מבין הקישורים הלא-מנוצלים שמופיע בטקסט.
 * כל קישור מוזרק לכל היותר פעם אחת לכל המאמר (mutates `used`).
 */
function renderRich(
  text: string,
  links: ContextualLink[] | undefined,
  used: Set<number>,
): ReactNode {
  if (!links || links.length === 0) return text;
  // מוצאים את ההופעה הראשונה (האינדקס הנמוך ביותר) של קישור לא-מנוצל בטקסט
  let best: { idx: number; linkIdx: number; link: ContextualLink } | null = null;
  for (let i = 0; i < links.length; i++) {
    if (used.has(i)) continue;
    const idx = text.indexOf(links[i].match);
    if (idx === -1) continue;
    if (!best || idx < best.idx) best = { idx, linkIdx: i, link: links[i] };
  }
  if (!best) return text;
  used.add(best.linkIdx);

  const before = text.slice(0, best.idx);
  const matchText = best.link.match;
  const after = text.slice(best.idx + matchText.length);

  const linkNode = best.link.external ? (
    <a
      key={`ext-${best.linkIdx}`}
      href={best.link.href}
      target="_blank"
      rel={buildExternalRel(best.link.href, best.link.rel)}
      title={best.link.title}
      className="font-black text-[#f0f0f0] underline decoration-[#e63000] decoration-2 underline-offset-4 hover:text-[#e63000]"
    >
      {matchText}
      <span aria-hidden="true" className="ms-0.5 text-[10px] text-[#e63000]">↗</span>
    </a>
  ) : (
    <a
      key={`int-${best.linkIdx}`}
      href={best.link.href}
      title={best.link.title}
      className="font-black text-[#f0f0f0] underline decoration-[#e63000] decoration-2 underline-offset-4 hover:text-[#e63000]"
    >
      {matchText}
    </a>
  );

  return (
    <>
      {before}
      {linkNode}
      {renderRich(after, links, used)}
    </>
  );
}

export function ArticleBody({ article }: { article: Article }) {
  // CTA placement: after the first third of sections
  const ctaIndex = Math.max(1, Math.floor(article.sections.length / 3));
  // מצב משותף — כל קישור contextual מוזרק לכל היותר פעם אחת במאמר
  const usedLinks = new Set<number>();
  const links = article.contextualLinks;

  return (
    <article className="article-prose max-w-[68ch]">
      {article.tldr && article.tldr.length > 0 && (
        <aside
          aria-label="תקציר מהיר"
          className="mb-8 border-r-4 border-[#e63000] bg-[#0d0d0d] p-5"
          data-speakable="true"
        >
          <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            תקציר מהיר
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {article.tldr.map((row, i) => (
              <div key={`tldr-${i}`} className="flex flex-col border-b border-[#1a1a1a] pb-2 last:border-b-0">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[#a0a0a0]">
                  {row.label}
                </dt>
                <dd className="text-sm font-black text-[#f0f0f0]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}

      {article.intro.map((p, i) => (
        <p
          key={`intro-${i}`}
          className="mb-5 text-base font-bold leading-relaxed text-[#ccc] md:text-lg"
        >
          {renderRich(p, links, usedLinks)}
        </p>
      ))}

      {article.specTable && (
        <section aria-label={article.specTable.title ?? "טבלת מפרט"} className="my-8">
          {article.specTable.title && (
            <h2 className="mb-3 text-xl font-black text-[#f0f0f0] md:text-2xl">
              {article.specTable.title}
            </h2>
          )}
          <div className="overflow-x-auto border border-[#222]">
            <table className="w-full border-collapse text-right text-sm">
              <thead>
                <tr className="bg-[#0d0d0d]">
                  {article.specTable.columns.map((col, i) => (
                    <th
                      key={`col-${i}`}
                      scope="col"
                      className="border-b border-[#222] px-3 py-2 text-xs font-black uppercase tracking-wider text-[#e63000]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {article.specTable.rows.map((row, r) => (
                  <tr key={`row-${r}`} className="even:bg-[#0a0a0a]">
                    {row.map((cell, c) => (
                      <td
                        key={`cell-${r}-${c}`}
                        className="border-b border-[#1a1a1a] px-3 py-2 font-bold text-[#ccc]"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {article.specTable.caption && (
            <p className="mt-2 text-xs font-bold text-[#a0a0a0]">
              {article.specTable.caption}
            </p>
          )}
        </section>
      )}

      {article.sections.map((section, idx) => (
        <Fragment key={section.id}>
          {section.level === 2 ? (
            <h2
              id={section.id}
              className="mt-12 mb-4 scroll-mt-24 text-2xl font-black leading-tight text-[#f0f0f0] md:text-3xl"
            >
              {section.heading}
            </h2>
          ) : (
            <h3
              id={section.id}
              className="mt-8 mb-3 scroll-mt-24 text-xl font-black leading-tight text-[#f0f0f0] md:text-2xl"
            >
              {section.heading}
            </h3>
          )}

          {section.paragraphs?.map((p, i) => (
            <p
              key={`${section.id}-p-${i}`}
              className="mb-4 text-base font-bold leading-relaxed text-[#ccc]"
            >
              {renderRich(p, links, usedLinks)}
            </p>
          ))}

          {section.list && (
            section.ordered ? (
              <ol className="mb-4 space-y-2 pr-0">
                {section.list.map((item, i) => {
                  const img = getItemImage(item);
                  return (
                    <li
                      key={`${section.id}-li-${i}`}
                      className="text-base font-bold leading-relaxed text-[#ccc]"
                    >
                      <div className="flex gap-3">
                        <span aria-hidden="true" className="min-w-[1.75rem] text-[#e63000]">
                          {i + 1}.
                        </span>
                        <span>{renderRich(getItemText(item), links, usedLinks)}</span>
                      </div>
                      {img && <InlineItemImage image={img} />}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <ul className="mb-4 space-y-2 pr-0">
                {section.list.map((item, i) => {
                  const img = getItemImage(item);
                  return (
                    <li
                      key={`${section.id}-li-${i}`}
                      className="text-base font-bold leading-relaxed text-[#ccc]"
                    >
                      <div className="flex gap-3">
                        <span aria-hidden="true" className="text-[#e63000]">←</span>
                        <span>{renderRich(getItemText(item), links, usedLinks)}</span>
                      </div>
                      {img && <InlineItemImage image={img} />}
                    </li>
                  );
                })}
              </ul>
            )
          )}

          {section.image && (
            <figure className="my-6 max-w-sm">
              <img
                src={section.image.src}
                alt={section.image.alt}
                loading="lazy"
                className="block w-full border border-[#222]"
              />
              {section.image.caption && (
                <figcaption className="mt-3 text-xs font-bold text-[#a0a0a0]">
                  {section.image.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.infographic && (
            <figure className="my-6 max-w-sm border border-[#e63000]/40 bg-black p-4">
              <div className="mb-2 inline-block bg-[#e63000] px-2 py-1 text-xs font-black text-white">
                אינפוגרפיקה
              </div>
              <img
                src={section.infographic.src}
                alt={section.infographic.alt}
                loading="lazy"
                className="block w-full"
              />
              {section.infographic.caption && (
                <figcaption className="mt-3 text-sm font-bold text-[#ccc]">
                  {section.infographic.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.video && (
            <figure className="my-6 max-w-xl">
              <div className="relative w-full overflow-hidden border border-[#222] bg-black" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${section.video.youtubeId}?rel=0`}
                  title={section.video.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              {section.video.caption && (
                <figcaption className="mt-3 text-xs font-bold text-[#a0a0a0]">
                  {section.video.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.callout && (
            <Callout
              type={section.callout.type}
              title={section.callout.title}
              body={section.callout.body}
            />
          )}

          {idx === ctaIndex - 1 && <InArticleCTA />}
        </Fragment>
      ))}

      {article.faqs && article.faqs.length > 0 && (
        <section className="mt-16">
          <h2
            id="faq"
            className="mt-12 mb-4 scroll-mt-24 text-2xl font-black leading-tight text-[#f0f0f0] md:text-3xl"
          >
            שאלות נפוצות
          </h2>
          <dl className="space-y-6">
            {article.faqs.map((f, i) => (
              <div
                key={`faq-${i}`}
                className="border border-[#222] bg-[#0d0d0d] p-5"
              >
                <dt className="mb-2 text-lg font-black text-[#f0f0f0]">
                  {f.q}
                </dt>
                <dd className="text-base font-bold leading-relaxed text-[#ccc]">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {article.glossary && article.glossary.length > 0 && (
        <section className="mt-16">
          <h2
            id="glossary"
            className="mt-12 mb-2 scroll-mt-24 text-2xl font-black leading-tight text-[#f0f0f0] md:text-3xl"
          >
            מילון מונחים
          </h2>
          <p className="mb-6 text-sm font-bold text-[#a0a0a0]">
            כל המושגים שעשויים להיות לא ברורים, בהסבר פשוט.
          </p>
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {article.glossary.map((g, i) => (
              <div
                key={`gl-${i}`}
                className="border-r-2 border-[#e63000] bg-[#0d0d0d] p-4"
              >
                <dt className="mb-1 text-base font-black text-[#f0f0f0]">
                  {g.term}
                </dt>
                <dd className="text-sm font-bold leading-relaxed text-[#bbb]">
                  {g.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {article.authorBio && (
        <section className="mt-16 border border-[#222] bg-[#0d0d0d] p-6">
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#e63000]">
            על הכותב
          </div>
          <h2 className="mb-2 text-xl font-black text-[#f0f0f0]">
            {article.author}
          </h2>
          <p className="text-sm font-bold leading-relaxed text-[#bbb]">
            {article.authorBio}
          </p>
        </section>
      )}

      {article.checklist && article.checklist.items.length > 0 && (
        <section className="mt-12 border-2 border-dashed border-[#e63000]/60 bg-[#0a0a0a] p-6 print:border-black">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-[#f0f0f0] md:text-2xl">
              {article.checklist.title ?? "צ'קליסט"}
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e63000]">
              ניתן להדפסה
            </span>
          </div>
          <ul className="space-y-2">
            {article.checklist.items.map((item, i) => (
              <li
                key={`chk-${i}`}
                className="flex items-start gap-3 text-sm font-bold leading-relaxed text-[#ccc]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-block h-4 w-4 flex-shrink-0 border border-[#666]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {article.sources && article.sources.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-black text-[#f0f0f0] md:text-2xl">
            מקורות וקריאה נוספת
          </h2>
          <ul className="space-y-2">
            {article.sources.map((s, i) => (
              <li key={`src-${i}`} className="text-sm font-bold text-[#ccc]">
                <span aria-hidden="true" className="text-[#e63000]">←</span>{" "}
                <a
                  href={s.url}
                  target="_blank"
                  rel={buildExternalRel(s.url, "dofollow")}
                  className="text-[#f0f0f0] underline decoration-[#e63000] underline-offset-4 hover:text-[#e63000]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <figure className="mt-16 max-w-md overflow-hidden border border-[#222]">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            className="block h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <figcaption className="border-t border-[#222] bg-[#0d0d0d] px-4 py-2 text-[11px] font-bold text-[#a0a0a0]">
          {article.heroAlt}
        </figcaption>
      </figure>
    </article>
  );
}

function InlineItemImage({
  image,
}: {
  image: { src: string; alt: string; caption?: string };
}) {
  return (
    <figure className="mt-3 mr-7 max-w-[260px]">
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="block w-full border border-[#222] bg-[#0a0a0a]"
      />
      {image.caption && (
        <figcaption className="mt-2 text-[11px] font-bold leading-snug text-[#a0a0a0]">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}