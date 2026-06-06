import { Wrench, Bike, MapPin, Shield, Activity, Cog } from "lucide-react";
import type { ArticleCard } from "@/lib/article-cards";

const CATEGORIES = [
  { slug: "mechanic", label: "מכניקה ותחזוקה", desc: "החלפת שמן, בלמים, מצמד, אבחון תקלות", Icon: Wrench },
  { slug: "bikes", label: "אופנועים וביקורות", desc: "KTM, Husqvarna, Honda, Beta - מה לקנות", Icon: Bike },
  { slug: "trails", label: "מסלולי שטח", desc: "גולן, יהודה, גליל - מסלולים מסומנים", Icon: MapPin },
  { slug: "gear", label: "ציוד מגן", desc: "קסדות, מגני גוף, מגפיים, knee braces", Icon: Shield },
  { slug: "technique", label: "טכניקת רכיבה", desc: "עמידה, טיפוס, ירידה, פניות", Icon: Activity },
  { slug: "parts", label: "חלקים באופנוע", desc: "קלאץ', תיבת הילוכים, הצתה - איך זה עובד", Icon: Cog },
] as const;

export function ArticleCategoriesSection({ cards }: { cards: ArticleCard[] }) {
  return (
    <section id="categories" className="border-b border-[#222] bg-[#0a0a0a]">
      <div className="border-b border-[#222] px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#e63000]">
          // SECTION 01 // CATEGORIES
        </div>
        <h2 className="mt-2 text-2xl font-black text-[#f0f0f0] md:text-3xl">
          קטגוריות מאמרים
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map(({ slug, label, desc, Icon }, idx) => {
          const count = cards.filter((a) => a.categorySlug === slug).length;
          return (
            <a
              key={slug}
              href={`/category/${slug}`}
              className={`group flex flex-col gap-4 border-[#222] bg-[#111] p-6 transition-colors hover:bg-[#181818] ${idx > 0 ? "border-r-0 lg:border-r" : ""} border-b lg:border-b-0`}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8 text-[#e63000]" aria-hidden />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#f0f0f0]">{label}</h3>
              <p className="text-sm font-bold text-[#909090]">{desc}</p>
              <div className="mt-auto flex items-center justify-between border-t border-[#222] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#909090]">
                  {count} מאמרים
                </span>
                <span className="text-xs font-black text-[#e63000] group-hover:translate-x-[-4px] transition-transform">
                  ←
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}