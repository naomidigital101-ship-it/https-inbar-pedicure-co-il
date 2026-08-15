/**
 * המלצות מטופלות — מנוהלות מהאדמין.
 * הסקשן נעלם לגמרי כשאין המלצות מפורסמות, כדי שלא ייווצר אזור ריק בדף.
 */

import { Star } from "lucide-react";
import type { PublicReview } from "@/lib/cms.functions";

export function ReviewsSection({
  reviews,
  average,
  count,
}: {
  reviews: PublicReview[];
  average: number | null;
  count: number;
}) {
  if (!reviews.length) return null;

  return (
    <section
      dir="rtl"
      aria-labelledby="reviews-heading"
      className="py-16 md:py-24"
      style={{ background: "var(--surface-soft)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-11 text-center">
          <h2
            id="reviews-heading"
            className="m-0 text-ink"
            style={{ fontSize: "clamp(1.75rem, 3.6vw, 2.375rem)" }}
          >
            מה מטופלות מספרות
          </h2>
          {average !== null && (
            <p
              className="mt-3 flex items-center justify-center gap-2 text-[16px]"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    style={{
                      fill: i < Math.round(average) ? "var(--accent-gold)" : "transparent",
                      color: "var(--accent-gold)",
                    }}
                  />
                ))}
              </span>
              <span>
                {average} מתוך 5 · {count} המלצות
              </span>
            </p>
          )}
        </div>

        <ul className="grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-col p-7"
              style={{
                background: "var(--paper)",
                border: "1px solid var(--stone-100)",
                borderRadius: 16,
              }}
            >
              <span className="mb-3 flex" aria-label={`${r.rating} מתוך 5`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    style={{ fill: "var(--accent-gold)", color: "var(--accent-gold)" }}
                    aria-hidden
                  />
                ))}
              </span>
              <blockquote
                className="m-0 flex-1 text-[15.5px] leading-relaxed"
                style={{ color: "var(--ink-600)" }}
              >
                {r.body}
              </blockquote>
              <cite
                className="mt-4 not-italic text-[14px]"
                style={{ fontWeight: 700, color: "var(--ink-900)" }}
              >
                {r.author_name}
                {r.author_area && (
                  <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>
                    {" "}
                    · {r.author_area}
                  </span>
                )}
              </cite>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
