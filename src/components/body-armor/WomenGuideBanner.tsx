import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WOMEN_BUYING_GUIDE } from "@/lib/products/body-armor";

const STORAGE_KEY = "body-armor-women-guide-dismissed";

export function WomenGuideBanner() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) === "1") {
      setOpen(false);
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (!open) return null;

  return (
    <section
      aria-label="מדריך לרוכבות"
      className="relative border border-[#222] border-r-4 border-r-[#e63000] bg-[#0f0f0f] p-6 md:p-8"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="סגור מדריך לרוכבות"
        className="absolute left-4 top-4 text-[#909090] transition-colors hover:text-[#f0f0f0]"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#e63000]">
        לקריאה לפני רכישה
      </div>
      <h2 className="mb-3 font-['Frank_Ruhl_Libre'] text-2xl font-bold text-[#f0f0f0] md:text-3xl">
        רוכבות - קראו לפני שקונות
      </h2>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-[#bbb] md:text-base">
        {WOMEN_BUYING_GUIDE.intro}
      </p>

      <Accordion type="multiple" className="mb-6">
        {WOMEN_BUYING_GUIDE.issues.map((issue, i) => (
          <AccordionItem
            key={i}
            value={`issue-${i}`}
            className="border-[#222]"
          >
            <AccordionTrigger className="text-right text-[#f0f0f0] hover:no-underline">
              {issue.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-[#bbb]">
              {issue.body}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="rounded-none border border-[#222] bg-[#080808]">
        <div className="border-b border-[#222] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#888]">
          המלצות לפי גודל חזה
        </div>
        <div className="divide-y divide-[#222]">
          {WOMEN_BUYING_GUIDE.recommendation_by_size.map((row, i) => (
            <div
              key={i}
              className="grid gap-2 px-4 py-3 md:grid-cols-[200px_1fr]"
            >
              <div className="text-sm font-bold text-[#e63000]">{row.size}</div>
              <div className="text-sm leading-relaxed text-[#ccc]">{row.rec}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
