import { Link } from "@tanstack/react-router";

/** The guide CTA is paused until an approved, downloadable file is supplied. */
export function LeadMagnet() {
  return (
    <section
      id="lead-magnet"
      dir="rtl"
      className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
      style={{
        background: "#0C2B23",
        color: "#FFFFFF",
        padding: "90px 6%",
        fontFamily: "'Assistant',sans-serif",
      }}
    >
      <div>
        <h2 style={{ fontWeight: 700, fontSize: "30px", margin: "0 0 16px", color: "#FFFFFF" }}>
          לתיאום ולשאלות
        </h2>
        <p style={{ fontSize: "16px", lineHeight: 2, margin: 0 }}>
          אפשר ליצור קשר עם ענבר דרך עמוד יצירת הקשר.
        </p>
      </div>
      <Link
        to="/contact"
        className="inline-block border border-white px-10 py-4 text-white transition-colors hover:bg-white hover:text-[#0C2B23]"
      >
        יצירת קשר עם ענבר
      </Link>
    </section>
  );
}
