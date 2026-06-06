import { ArticleCard, type WorkshopArticle } from "./ArticleCard";

const articles: WorkshopArticle[] = [
  {
    modCode: "[ MOD: 01 // MECH ]",
    category: "תחזוקה שוטפת",
    title: "החלפת שמן KTM EXC 250, שלב אחר שלב",
    excerpt:
      "300 ש\"ח למכונאי או 20 דקות בבית. אנחנו נלמד אותך איך, פעם אחת, לתמיד.",
    duration: "08:00",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    imageAlt: "אופנוע שטח KTM בשטח פתוח",
    slug: "ktm-exc-250-oil-change",
  },
  {
    modCode: "[ MOD: 02 // DIAG ]",
    category: "דיאגנוסטיקה",
    title: "5 סימנים שהשרשרת שלך תישבר היום",
    excerpt:
      "רוב הרוכבים והרוכבות מגלים את זה כשהם כבר תקועים. 3 דקות לפני שיוצאים, חוסכות את כל הצרות.",
    duration: "04:00",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80",
    imageAlt: "רוכבת אופנוע שטח עם קסדה סגורה וציוד מלא בפעולה",
    slug: "chain-failure-signs",
  },
  {
    modCode: "[ MOD: 03 // SPEC ]",
    category: "השוואה",
    title: "KTM לעומת Husqvarna, מה שווה את הכסף?",
    excerpt:
      "עלויות תחזוקה, אמינות, מחיר אמיתי. בלי שיווק, רק מה שרוכבים ורוכבות שיודעים אומרים.",
    duration: "15:00",
    image:
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&q=80",
    imageAlt: "אופנוע שטח בפעולה על מסלול עפר",
    slug: "ktm-vs-husqvarna",
    noLeftBorder: true,
  },
];

export function ArticleGrid() {
  return (
    <section id="articles" className="grid grid-cols-1 md:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.modCode} article={a} />
      ))}
    </section>
  );
}