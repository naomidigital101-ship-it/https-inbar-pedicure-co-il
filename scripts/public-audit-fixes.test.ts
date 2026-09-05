import assert from "node:assert/strict";
import { test } from "node:test";
import { publicContentHref, sanitizePublicLinks } from "../src/lib/public-content-links.ts";
import { publicService, publicCategoryDescription } from "../src/lib/public-business-claims.ts";
import { SERVICES } from "../src/lib/services-content.ts";

test("incorrect medical sources are absent from visible links and serialized sources", () => {
  const wrongUrls = [
    "https://medlineplus.gov/druginfo/meds/a695031.html",
    "https://www.eyal.org.il/",
    "http://eyal.org.il/http_new/index.asp",
    "https://en.wikipedia.org/wiki/Cracked_heels",
  ];
  const original = {
    intro: ["Terbinafine — טקסט קליני לבדיקה מול החוברת"],
    contextualLinks: wrongUrls.map((href) => ({ match: "טקסט", href })),
    sources: wrongUrls.map((url) => ({ label: "מקור", url })),
  };
  const clean = sanitizePublicLinks(original);
  assert.deepEqual(clean.contextualLinks, []);
  assert.deepEqual(clean.sources, []);
  assert.deepEqual(clean.intro, original.intro);
  for (const url of wrongUrls) assert.ok(!JSON.stringify(clean).includes(url));
  assert.equal(original.contextualLinks.length, 4);
});

test("missing article URLs become direct links to existing treatments", () => {
  assert.equal(publicContentHref("/article/corns-and-calluses-treatment"), "/services/corns");
  assert.equal(
    publicContentHref(
      "https://inbar-pedicure.co.il/article/foot-fungus-prevention-and-care?from=article#faq",
    ),
    "/services/fungus?from=article#faq",
  );
  assert.equal(publicContentHref("/article/corns-and-calluses-treatment/"), "/services/corns");
  const clean = sanitizePublicLinks({
    contextualLinks: [
      { href: "https://inbar-pedicure.co.il/article/corns-and-calluses-treatment", external: true },
    ],
  });
  assert.equal(clean.contextualLinks[0].external, false);
});

test("unaffected destinations and content remain unchanged", () => {
  assert.equal(
    publicContentHref("https://en.wikipedia.org/wiki/Psoriasis"),
    "https://en.wikipedia.org/wiki/Psoriasis",
  );
  assert.equal(
    publicContentHref("https://wa.me/972500000000?text=hello"),
    "https://wa.me/972500000000?text=hello",
  );
  assert.equal(publicContentHref("/about#inbar-farchi"), "/about#inbar-farchi");
  assert.equal(publicContentHref("javascript:alert(1)"), null);
});

test("audited success figures are withheld in both CMS-shaped data and fallbacks", () => {
  for (const service of SERVICES) {
    const snapshot = structuredClone(service);
    const clean = publicService(service);
    assert.ok(!JSON.stringify(clean).includes("כ-85% ללא צורך בניתוח"));
    assert.ok(!JSON.stringify(clean).includes("אצלי הסטטיסטיקה האישית: כ-80%"));
    assert.equal(clean.slug, service.slug);
    assert.deepEqual(service, snapshot);
    const cmsClone = structuredClone(service);
    assert.deepEqual(publicService(cmsClone), clean);
    if (!["corns", "ingrown-nails"].includes(service.slug)) assert.deepEqual(clean, service);
  }
});

test("old CMS category copy cannot restore the audited experience claim", () => {
  assert.equal(
    publicCategoryDescription(
      "התחלה. המדריכים נכתבו על ידי ענבר פרחי, פדיקוריסטית טיפולית, על בסיס 12+ שנות ניסיון בקליניקה. סוף.",
    ),
    "התחלה. סוף.",
  );
});
