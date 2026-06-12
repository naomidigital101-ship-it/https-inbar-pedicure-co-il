import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck, ArrowLeft } from "lucide-react";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

const STATS = [
  { n: "12+", l: "שנות ניסיון" },
  { n: "200+", l: "טיפולים" },
  { n: "IWGDF", l: "פרוטוקול" },
] as const;

export function PremiumHero() {
  return (
    <section dir="rtl" className="relative overflow-hidden bg-white" style={{ height: "calc(100svh - 5rem)", minHeight: 600 }}>

      {/* Desktop: split layout */}
      <div className="hidden lg:grid lg:grid-cols-2 h-full">

        {/* LEFT PANEL — dark ink */}
        <motion.div
          initial={{ opacity: 1, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between px-12 py-14"
          style={{ background: "oklch(0.12 0.03 192)" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ width: 28, height: 2, background: "var(--primary)", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary)" }}>
              קליניקה רפואית · בית אל
            </span>
          </div>

          <motion.div
            initial={{ opacity: 1, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 style={{ fontWeight: 800, fontSize: "clamp(3.2rem, 5.2vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.035em", color: "#ffffff", opacity: 1 }}>
              פדיקור<br />
              טיפולי<br />
              <span style={{ color: "var(--primary)" }}>ברמה</span><br />
              אחרת.
            </h1>

            <p className="mt-8" style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 340, color: "rgba(255,255,255,0.55)" }}>
              הקליניקה של ענבר פרחי בבית אל מתמחה בטיפול קליני בכף הרגל — יבלות, פטרת, ציפורן חודרנית וסוכרת.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <a
                href="/contact"
                style={{
                  background: "var(--primary)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "13px 28px",
                  borderRadius: "var(--radius-md)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--primary-deep)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--primary)")}
              >
                <CalendarCheck size={16} aria-hidden />
                קביעת תור
              </a>
              <a
                href="#about"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                היכרות עם ענבר
                <ArrowLeft size={14} aria-hidden />
              </a>
            </div>
          </motion.div>

          <div style={{ display: "flex", gap: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
            {STATS.map(s => (
              <div key={s.n}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>{s.n}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT PANEL — white with portrait */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="relative hidden lg:block overflow-hidden bg-white"
        >
          <div aria-hidden style={{ position: "absolute", bottom: "-15%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "color-mix(in oklab, var(--primary) 10%, transparent)", zIndex: 0 }} />

          <img
            src={inbarPortrait}
            alt="ענבר פרחי, פדיקוריסטית טיפולית"
            width={896}
            height={1120}
            loading="eager"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: "drop-shadow(0 24px 48px rgba(15,43,46,0.14))",
            }}
          />

          <motion.div
            initial={{ opacity: 1, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ position: "absolute", bottom: 32, right: 28, zIndex: 20, background: "white", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px 14px", boxShadow: "var(--shadow-elegant)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "var(--primary)", borderRadius: 6, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                <ShieldCheck size={18} strokeWidth={2} aria-hidden />
              </span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary-deep)" }}>סטנדרט קליני</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 1 }}>איכילוב · NHS · IWGDF</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* MOBILE hero */}
      <div className="lg:hidden">
        <div style={{ background: "white", display: "flex", justifyContent: "center", padding: "0 20px" }}>
          <img src={inbarPortrait} alt="ענבר פרחי" width={480} height={600} loading="eager" style={{ maxHeight: 340, width: "auto", objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(15,43,46,0.12))" }} />
        </div>
        <div style={{ background: "var(--ink)", padding: "48px 20px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ width: 20, height: 2, background: "var(--primary)", display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--primary)" }}>קליניקה רפואית · בית אל</span>
          </div>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(2.6rem, 10vw, 3.8rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: "white" }}>
            פדיקור טיפולי<br />
            <span style={{ color: "var(--primary)" }}>ברמה אחרת.</span>
          </h1>
          <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", maxWidth: 320 }}>
            קליניקה בוטיקית בבית אל לטיפול קליני בכף הרגל. שירות לכל אזור בנימין וירושלים.
          </p>
          <a
            href="/contact"
            style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "white", fontWeight: 700, fontSize: 14, padding: "12px 22px", borderRadius: "var(--radius-md)" }}
          >
            <CalendarCheck size={15} aria-hidden />
            קביעת תור
          </a>
        </div>
      </div>

    </section>
  );
}
