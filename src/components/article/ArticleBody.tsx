import { Fragment, type ReactNode } from "react";
import type { Article, ContextualLink, ListItem } from "@/lib/articles";
import { Callout } from "./Callout";
import { InArticleCTA } from "./InArticleCTA";
import { BODONI, C } from "./editorial";

/**
 * Whitelist קשיח של דומיינים סמכותיים שמקבלים DoFollow.
 * כל דומיין אחר נכפה ל-nofollow גם אם סומן אחרת.
 */
const DOFOLLOW_HOSTS = new Set<string>([
  // משרדי בריאות וגופים רגולטוריים
  "gov.il",
  "health.gov.il",
  "who.int",
  // קופות חולים
  "clalit.co.il",
  "maccabi4u.co.il",
  "leumit.co.il",
  "meuhedet.co.il",
  // מקורות מידע מובילים
  "mayoclinic.org",
  "nhs.uk",
  "nih.gov",
  "cdc.gov",
  // מחקר ופרסומים מקצועיים
  "pubmed.ncbi.nlm.nih.gov",
  "cochrane.org",
  "bmj.com",
  "nejm.org",
  // איגודים מקצועיים בתחום כף הרגל
  "apma.org",
  "fip-ifp.org",
  "thecollegeofpodiatry.com",
  "eyal.org.il",
  // ידע כללי
  "en.wikipedia.org",
  "he.wikipedia.org",
]);

function isAllowedDofollow(href: string): boolean {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (DOFOLLOW_HOSTS.has(host)) return true;
    // התרת subdomains של gov.il / parks.org.il / nih.gov (שירותים ממשלתיים)
    return [...DOFOLLOW_HOSTS].some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

function buildExternalRel(href: string, rel: ContextualLink["rel"] | undefined): string {
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
      className="font-medium text-[#141414] underline decoration-[#0E3B2E] decoration-1 underline-offset-4 transition-colors hover:text-[#0E3B2E]"
    >
      {matchText}
      <span aria-hidden="true" className="ms-0.5 text-[10px] text-[#0E3B2E]">
        ↗
      </span>
    </a>
  ) : (
    <a
      key={`int-${best.linkIdx}`}
      href={best.link.href}
      title={best.link.title}
      className="font-medium text-[#141414] underline decoration-[#0E3B2E] decoration-1 underline-offset-4 transition-colors hover:text-[#0E3B2E]"
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
    <article
      className="article-prose max-w-[68ch]"
      style={{ fontFamily: "'Assistant',sans-serif" }}
    >
      {article.tldr && article.tldr.length > 0 && (
        <aside
          aria-label="תקציר מהיר"
          className="mb-10 border border-[#ECEAE6] bg-[#F7F5F1] p-7"
          data-speakable="true"
        >
          <div className="mb-5 text-[12px] font-normal tracking-[0.3em] text-[#6B6B6B]">
            תקציר מהיר
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {article.tldr.map((row, i) => (
              <div
                key={`tldr-${i}`}
                className="flex flex-col border-b border-[#ECEAE6] pb-2 last:border-b-0"
              >
                <dt className="text-[11.5px] font-normal tracking-[0.16em] text-[#6B6B6B]">
                  {row.label}
                </dt>
                <dd className="text-sm font-semibold text-[#141414]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}

      {article.intro.map((p, i) => (
        <p
          key={`intro-${i}`}
          className="mb-5 text-[1.05rem] font-light leading-[1.95] text-[#141414] md:text-[1.12rem]"
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
                fontWeight: 700,
                fontSize: "clamp(1.35rem, 2.6vw, 1.7rem)",
                lineHeight: 1.5,
                color: "#141414",
              }}
            >
              {article.specTable.title}
            </h2>
          )}
          <div className="overflow-x-auto border border-[#ECEAE6]">
            <table className="w-full border-collapse text-right text-sm">
              <thead>
                <tr className="bg-[#F7F5F1]">
                  {article.specTable.columns.map((col, i) => (
                    <th
                      key={`col-${i}`}
                      scope="col"
                      className="border-b border-[#ECEAE6] px-4 py-3 text-[11.5px] font-normal tracking-[0.2em] text-[#6B6B6B]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {article.specTable.rows.map((row, r) => (
                  <tr key={`row-${r}`}>
                    {row.map((cell, c) => (
                      <td
                        key={`cell-${r}-${c}`}
                        className="border-b border-[#ECEAE6] px-4 py-3 font-light text-[#141414]"
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
            <p className="mt-3 text-[12px] font-normal tracking-[0.04em] text-[#6B6B6B]">
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
                fontWeight: 700,
                fontSize: "clamp(1.45rem, 3vw, 1.9rem)",
                lineHeight: 1.45,
                color: "#141414",
              }}
            >
              {section.heading}
            </h2>
          ) : (
            <h3
              id={section.id}
              className="mt-10 mb-3 scroll-mt-24"
              style={{
                fontWeight: 600,
                fontSize: "clamp(1.12rem, 2.2vw, 1.35rem)",
                lineHeight: 1.55,
                color: "#141414",
              }}
            >
              {section.heading}
            </h3>
          )}

          {section.paragraphs?.map((p, i) => (
            <p
              key={`${section.id}-p-${i}`}
              className="mb-4 text-[1rem] font-light leading-[1.95] text-[#141414]"
            >
              {renderRich(p, links, usedLinks)}
            </p>
          ))}

          {section.list &&
            (section.ordered ? (
              <ol className="mb-5 space-y-2.5 pr-0">
                {section.list.map((item, i) => {
                  const img = getItemImage(item);
                  return (
                    <li
                      key={`${section.id}-li-${i}`}
                      className="text-[1rem] font-light leading-[1.95] text-[#141414]"
                    >
                      <div className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="min-w-[1.75rem] font-normal text-[#726B5E]"
                          style={{ fontFamily: BODONI }}
                        >
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
                      className="text-[1rem] font-light leading-[1.95] text-[#141414]"
                    >
                      <div className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-3.5 inline-block h-px w-3 flex-shrink-0 bg-[#726B5E]"
                        />
                        <span>{renderRich(getItemText(item), links, usedLinks)}</span>
                      </div>
                      {img && <InlineItemImage image={img} />}
                    </li>
                  );
                })}
              </ul>
            ))}

          {section.image && (
            <figure className="my-8 max-w-md">
              <img
                src={section.image.src}
                alt={section.image.alt}
                loading="lazy"
                className="block w-full border border-[#ECEAE6]"
              />
              {section.image.caption && (
                <figcaption className="mt-3 text-[12px] font-normal tracking-[0.04em] text-[#6B6B6B]">
                  {section.image.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.infographic && (
            <figure className="my-8 max-w-sm border border-[#ECEAE6] bg-[#F7F5F1] p-5">
              <div className="mb-4 inline-block bg-[#0E3B2E] px-3 py-1.5 text-[11px] font-normal tracking-[0.2em] text-white">
                אינפוגרפיקה
              </div>
              <img
                src={section.infographic.src}
                alt={section.infographic.alt}
                loading="lazy"
                className="block w-full"
              />
              {section.infographic.caption && (
                <figcaption className="mt-4 text-[12px] font-normal tracking-[0.04em] text-[#6B6B6B]">
                  {section.infographic.caption}
                </figcaption>
              )}
            </figure>
          )}

          {section.video && (
            <figure className="my-6 max-w-xl">
              <div
                className="relative w-full overflow-hidden border border-[#ECEAE6] bg-black"
                style={{ aspectRatio: "16 / 9" }}
              >
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
                <figcaption className="mt-3 text-[12px] font-normal tracking-[0.04em] text-[#6B6B6B]">
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
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              lineHeight: 1.4,
              color: "#141414",
            }}
          >
            שאלות נפוצות
          </h2>
          <dl style={{ borderTop: `1px solid ${C.line}` }}>
            {article.faqs.map((f, i) => (
              <div
                key={`faq-${i}`}
                className="py-7"
                style={{ borderBottom: `1px solid ${C.line}` }}
              >
                <dt className="mb-2 text-[1.05rem] font-semibold text-[#141414]">{f.q}</dt>
                <dd className="text-[0.98rem] font-light leading-[1.95] text-[#4E4E4E]">{f.a}</dd>
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
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              lineHeight: 1.4,
              color: "#141414",
            }}
          >
            מילון מונחים
          </h2>
          <p className="mb-8 text-sm font-light leading-[1.9] text-[#4E4E4E]">
            כל המושגים שעשויים להיות לא ברורים, בהסבר פשוט.
          </p>
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {article.glossary.map((g, i) => (
              <div key={`gl-${i}`} className="border-r border-[#726B5E] bg-[#F7F5F1] p-5">
                <dt className="mb-1 text-base font-semibold text-[#141414]">{g.term}</dt>
                <dd className="text-sm font-light leading-[1.9] text-[#4E4E4E]">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {article.authorBio && (
        <section className="mt-20 border border-[#ECEAE6] bg-[#F7F5F1] p-9">
          <div className="mb-4 text-[12px] font-normal tracking-[0.3em] text-[#6B6B6B]">
            על הכותבת
          </div>
          <h2
            className="mb-3"
            style={{
              fontWeight: 700,
              fontSize: "1.4rem",
              lineHeight: 1.5,
              color: "#141414",
            }}
          >
            {article.author}
          </h2>
          <p className="text-[0.95rem] font-light leading-[1.95] text-[#4E4E4E]">
            {article.authorBio}
          </p>
        </section>
      )}

      {article.checklist && article.checklist.items.length > 0 && (
        <section className="mt-14 border border-[#ECEAE6] bg-[#FFFFFF] p-8 print:border-black">
          <div className="mb-3 flex items-center justify-between">
            <h2
              style={{
                fontWeight: 700,
                fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)",
                lineHeight: 1.5,
                color: "#141414",
              }}
            >
              {article.checklist.title ?? "צ'קליסט"}
            </h2>
            <span className="text-[11.5px] font-normal tracking-[0.28em] text-[#6B6B6B]">
              ניתן להדפסה
            </span>
          </div>
          <ul className="space-y-2">
            {article.checklist.items.map((item, i) => (
              <li
                key={`chk-${i}`}
                className="flex items-start gap-3 text-sm font-light leading-[1.9] text-[#141414]"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-4 w-4 flex-shrink-0 border border-[#8F8474]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <figure className="mt-20 max-w-md border border-[#ECEAE6]">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            className="block h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <figcaption className="border-t border-[#ECEAE6] bg-[#F7F5F1] px-4 py-3 text-[11.5px] font-normal tracking-[0.04em] text-[#6B6B6B]">
          {article.heroAlt}
        </figcaption>
      </figure>
    </article>
  );
}

function InlineItemImage({ image }: { image: { src: string; alt: string; caption?: string } }) {
  return (
    <figure className="mt-3 mr-7 max-w-[260px]">
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="block w-full border border-[#ECEAE6] bg-[#FFFFFF]"
      />
      {image.caption && (
        <figcaption className="mt-2 text-[11.5px] font-normal leading-snug text-[#6B6B6B]">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}
