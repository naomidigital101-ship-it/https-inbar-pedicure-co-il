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
  // מחקר קליני
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
      className="font-black text-[var(--ink-900)] underline decoration-[var(--green-700)] decoration-2 underline-offset-4 hover:text-[var(--green-700)]"
    >
      {matchText}
      <span aria-hidden="true" className="ms-0.5 text-[10px] text-[var(--green-700)]">↗</span>
    </a>
  ) : (
    <a
      key={`int-${best.linkIdx}`}
      href={best.link.href}
      title={best.link.title}
      className="font-black text-[var(--ink-900)] underline decoration-[var(--green-700)] decoration-2 underline-offset-4 hover:text-[var(--green-700)]"
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
    <article className="article-prose max-w-[68ch]" style={{ fontFamily: "var(--font-body)" }}>
      {article.tldr && article.tldr.length > 0 && (
        <aside
          aria-label="תקציר מהיר"
          className="mb-10 rounded-xl border border-[var(--green-100)] bg-[var(--green-50)] p-6"
          data-speakable="true"
        >
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--green-700)]">
            תקציר מהיר
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {article.tldr.map((row, i) => (
              <div key={`tldr-${i}`} className="flex flex-col border-b border-[var(--green-100)] pb-2 last:border-b-0">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-[var(--ink-600)]">
                  {row.label}
                </dt>
                <dd className="text-sm font-semibold text-[var(--ink-900)]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}

      {article.intro.map((p, i) => (
        <p
          key={`intro-${i}`}
          className="mb-5 text-[1.05rem] font-normal leading-[1.85] text-[var(--ink-900)] md:text-[1.15rem]"
        >
          {renderRich(p, links, usedLinks)}
        </p>
      ))}

      {article.specTable && (
        <section aria-label={article.specTable.title ?? "טבלת מפרט"} className="my-8">
          {article.specTable.title && (
            <h2
              className="mb-3"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                letterSpacing: "-0.02em",
                color: "var(--ink-900)",
              }}
            >
              {article.specTable.title}
            </h2>
          )}
          <div className="overflow-x-auto rounded-lg border border-[var(--green-100)]">
            <table className="w-full border-collapse text-right text-sm">
              <thead>
                <tr className="bg-[var(--green-50)]">
                  {article.specTable.columns.map((col, i) => (
                    <th
                      key={`col-${i}`}
                      scope="col"
                      className="border-b border-[var(--green-100)] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--green-700)]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {article.specTable.rows.map((row, r) => (
                  <tr key={`row-${r}`} className="even:bg-[var(--paper)]">
                    {row.map((cell, c) => (
                      <td
                        key={`cell-${r}-${c}`}
                        className="border-b border-[var(--green-100)] px-3 py-2.5 font-normal text-[var(--ink-900)]"
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
            <p className="mt-2 text-xs font-normal text-[var(--ink-600)]">
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
              className="mt-14 mb-5 scroll-mt-24"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1.65rem, 3.4vw, 2.4rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "var(--ink-900)",
              }}
            >
              {section.heading}
            </h2>
          ) : (
            <h3
              id={section.id}
              className="mt-10 mb-3 scroll-mt-24"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                color: "var(--ink-900)",
              }}
            >
              {section.heading}
            </h3>
          )}

          {section.paragraphs?.map((p, i) => (
            <p
              key={`${section.id}-p-${i}`}
              className="mb-4 text-[1rem] font-normal leading-[1.85] text-[var(--ink-900)]"
            >
              {renderRich(p, links, usedLinks)}
            </p>
          ))}

          {section.list && (
            section.ordered ? (
              <ol className="mb-5 space-y-2.5 pr-0">
                {section.list.map((item, i) => {
                  const img = getItemImage(item);
                  return (
                    <li
                      key={`${section.id}-li-${i}`}
                      className="text-[1rem] font-normal leading-[1.85] text-[var(--ink-900)]"
                    >
                      <div className="flex gap-3">
                        <span aria-hidden="true" className="min-w-[1.75rem] font-semibold text-[var(--green-700)]">
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
              <ul className="mb-5 space-y-2.5 pr-0">
                {section.list.map((item, i) => {
                  const img = getItemImage(item);
                  return (
                    <li
                      key={`${section.id}-li-${i}`}
                      className="text-[1rem] font-normal leading-[1.85] text-[var(--ink-900)]"
                    >
                      <div className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--green-600)]" />
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
            <figure className="my-8 max-w-md">
              <img
                src={section.image.src}
                alt={section.image.alt}
                loading="lazy"
                className="block w-full rounded-lg border border-[var(--green-100)]"
              />
              {section.image.caption && (
                <figcaption className="mt-3 text-xs font-normal italic text-[var(--ink-600)]">
                  {section.image.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.infographic && (
            <figure className="my-6 max-w-sm border border-[var(--green-700)]/40 bg-black p-4">
              <div className="mb-2 inline-block bg-[var(--green-700)] px-2 py-1 text-xs font-black text-white">
                אינפוגרפיקה
              </div>
              <img
                src={section.infographic.src}
                alt={section.infographic.alt}
                loading="lazy"
                className="block w-full"
              />
              {section.infographic.caption && (
                <figcaption className="mt-3 text-sm font-bold text-[var(--ink-900)]">
                  {section.infographic.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.video && (
            <figure className="my-6 max-w-xl">
              <div className="relative w-full overflow-hidden border border-[var(--stone-100)] bg-black" style={{ aspectRatio: "16 / 9" }}>
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
                <figcaption className="mt-3 text-xs font-bold text-[var(--ink-600)]">
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
            className="mt-12 mb-6 scroll-mt-24"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)",
              letterSpacing: "-0.025em",
              color: "var(--ink-900)",
            }}
          >
            שאלות נפוצות
          </h2>
          <dl className="space-y-6">
            {article.faqs.map((f, i) => (
              <div
                key={`faq-${i}`}
                className="rounded-xl border border-[var(--green-100)] bg-[var(--green-50)] p-6"
              >
                <dt className="mb-2 text-lg font-semibold text-[var(--ink-900)]" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {f.q}
                </dt>
                <dd className="text-[0.98rem] font-normal leading-[1.85] text-[var(--ink-900)]">
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
            className="mt-12 mb-2 scroll-mt-24"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)",
              letterSpacing: "-0.025em",
              color: "var(--ink-900)",
            }}
          >
            מילון מונחים
          </h2>
          <p className="mb-6 text-sm font-normal text-[var(--ink-600)]">
            כל המושגים שעשויים להיות לא ברורים, בהסבר פשוט.
          </p>
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {article.glossary.map((g, i) => (
              <div
                key={`gl-${i}`}
                className="rounded-lg border-r-2 border-[var(--green-600)] bg-[var(--green-50)] p-4"
              >
                <dt className="mb-1 text-base font-semibold text-[var(--ink-900)]">
                  {g.term}
                </dt>
                <dd className="text-sm font-normal leading-[1.8] text-[var(--ink-900)]">
                  {g.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {article.authorBio && (
        <section className="mt-16 rounded-xl border border-[var(--green-100)] bg-[var(--green-50)] p-7">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--green-700)]">
            על הכותב
          </div>
          <h2
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "1.6rem",
              letterSpacing: "-0.02em",
              color: "var(--ink-900)",
            }}
          >
            {article.author}
          </h2>
          <p className="text-[0.95rem] font-normal leading-[1.85] text-[var(--ink-900)]">
            {article.authorBio}
          </p>
        </section>
      )}

      {article.checklist && article.checklist.items.length > 0 && (
        <section className="mt-12 rounded-xl border border-dashed border-[var(--green-600)]/60 bg-[var(--paper)] p-7 print:border-black">
          <div className="mb-3 flex items-center justify-between">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)",
                letterSpacing: "-0.02em",
                color: "var(--ink-900)",
              }}
            >
              {article.checklist.title ?? "צ'קליסט"}
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--green-700)]">
              ניתן להדפסה
            </span>
          </div>
          <ul className="space-y-2">
            {article.checklist.items.map((item, i) => (
              <li
                key={`chk-${i}`}
                className="flex items-start gap-3 text-sm font-normal leading-[1.8] text-[var(--ink-900)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-block h-4 w-4 flex-shrink-0 rounded-sm border border-[var(--green-600)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {article.sources && article.sources.length > 0 && (
        <section className="mt-12">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 2.8vw, 1.9rem)",
              letterSpacing: "-0.02em",
              color: "var(--ink-900)",
            }}
          >
            מקורות וקריאה נוספת
          </h2>
          <ul className="space-y-2.5">
            {article.sources.map((s, i) => (
              <li key={`src-${i}`} className="text-sm font-normal text-[var(--ink-900)]">
                <span aria-hidden="true" className="text-[var(--green-700)]">←</span>{" "}
                <a
                  href={s.url}
                  target="_blank"
                  rel={buildExternalRel(s.url, "dofollow")}
                  className="text-[var(--ink-900)] underline decoration-[var(--green-700)] underline-offset-4 hover:text-[var(--green-700)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <figure className="mt-16 max-w-md overflow-hidden rounded-xl border border-[var(--green-100)]">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            className="block h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <figcaption className="border-t border-[var(--green-100)] bg-[var(--green-50)] px-4 py-2.5 text-[11px] font-normal italic text-[var(--ink-600)]">
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
        className="block w-full border border-[var(--stone-100)] bg-[var(--paper)]"
      />
      {image.caption && (
        <figcaption className="mt-2 text-[11px] font-bold leading-snug text-[var(--ink-600)]">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}