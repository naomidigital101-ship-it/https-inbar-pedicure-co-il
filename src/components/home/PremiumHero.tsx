import { motion } from "framer-motion";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

const TEAL = "#0F6B6E";
const INK = "#1A2A2C";
const WARM = "#5C4A3A";
const STAMP = "#E89C82";
const BLOB_RADIUS = "60% 40% 50% 50% / 55% 45% 55% 45%";

export function PremiumHero() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-white"
      style={{ fontFamily: "'Assistant', system-ui, sans-serif" }}
    >
      {/* ============ DESKTOP ============ */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center max-w-7xl mx-auto px-12 py-20">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-7"
            style={{ background: `${TEAL}14` }}
          >
            <span style={{ color: TEAL, fontSize: 13, fontWeight: 600, letterSpacing: "0.01em" }}>
              קליניקה רפואית בבית אל
            </span>
          </div>

          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(3rem, 4.6vw, 4.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: INK,
              marginBottom: 24,
            }}
          >
            פדיקור טיפולי<br />
            <span style={{ position: "relative", display: "inline-block" }}>
              ברמה
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  right: 0,
                  height: 8,
                  background: `${TEAL}33`,
                  borderRadius: 999,
                }}
              />
            </span>{" "}
            אחרת
          </h1>

          <p style={{ color: WARM, fontSize: 18, lineHeight: 1.65, maxWidth: 460, marginBottom: 36 }}>
            טיפול רפואי מקצועי לכפות הרגליים באווירה נינוחה ואישית, המשלב בריאות עם אסתטיקה גבוהה.
          </p>

          <div className="flex items-center gap-3 mb-12">
            <a
              href="/contact"
              style={{
                background: TEAL,
                color: "white",
                fontWeight: 600,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 999,
                boxShadow: `0 12px 28px ${TEAL}33`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              קביעת תור
            </a>
            <a
              href="#treatments"
              style={{
                border: `2px solid ${TEAL}`,
                color: TEAL,
                fontWeight: 600,
                fontSize: 16,
                padding: "12px 28px",
                borderRadius: 999,
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEAL; }}
            >
              צפי בטיפולים
            </a>
          </div>

          <div className="flex items-center gap-3" style={{ fontSize: 12, color: `${WARM}99`, fontWeight: 500 }}>
            <span>איכילוב</span>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: `${WARM}40` }} />
            <span>NHS</span>
            <span style={{ width: 4, height: 4, borderRadius: 999, background: `${WARM}40` }} />
            <span>IWGDF</span>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square w-full max-w-[520px] mx-auto"
        >
          {/* Offset teal blob behind */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              transform: "translate(-16px, 16px)",
              background: `${TEAL}26`,
              borderRadius: BLOB_RADIUS,
            }}
          />
          {/* Portrait clipped to blob */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: BLOB_RADIUS,
              overflow: "hidden",
              background: "#F4EFE7",
            }}
          >
            <img
              src={inbarPortrait}
              alt="ענבר פרחי, פדיקוריסטית טיפולית"
              width={896}
              height={1120}
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
          {/* Trust sticker */}
          <div
            style={{
              position: "absolute",
              top: -18,
              right: -18,
              width: 112,
              height: 112,
              borderRadius: 999,
              background: STAMP,
              color: "#FFF8F4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.3,
              transform: "rotate(8deg)",
              border: "4px solid white",
              boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
            }}
          >
            5★<br />200+<br />מטופלות
          </div>
        </motion.div>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="lg:hidden px-6 pt-10 pb-12">
        <div
          className="inline-flex items-center px-4 py-1.5 rounded-full mb-6"
          style={{ background: `${TEAL}14` }}
        >
          <span style={{ color: TEAL, fontSize: 12, fontWeight: 600 }}>
            קליניקה רפואית בבית אל
          </span>
        </div>

        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(2.6rem, 11vw, 3.4rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: INK,
            marginBottom: 16,
          }}
        >
          פדיקור טיפולי<br />
          <span style={{ position: "relative", display: "inline-block" }}>
            ברמה
            <span
              aria-hidden
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: `${TEAL}33`, borderRadius: 999 }}
            />
          </span>{" "}
          אחרת
        </h1>

        <p style={{ color: WARM, fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
          טיפול רפואי מקצועי לכפות הרגליים באווירה נינוחה ואישית, המשלב בריאות עם אסתטיקה גבוהה.
        </p>

        <div className="flex flex-col gap-3 mb-10">
          <a
            href="/contact"
            style={{
              background: TEAL,
              color: "white",
              fontWeight: 600,
              fontSize: 16,
              padding: "14px 24px",
              borderRadius: 999,
              textAlign: "center",
              boxShadow: `0 10px 24px ${TEAL}33`,
            }}
          >
            קביעת תור
          </a>
          <a
            href="#treatments"
            style={{
              border: `2px solid ${TEAL}`,
              color: TEAL,
              fontWeight: 600,
              fontSize: 16,
              padding: "12px 24px",
              borderRadius: 999,
              textAlign: "center",
            }}
          >
            צפי בטיפולים
          </a>
        </div>

        {/* Visual */}
        <div className="relative aspect-square w-full max-w-[360px] mx-auto mb-6">
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              transform: "translate(-12px, 12px)",
              background: `${TEAL}26`,
              borderRadius: BLOB_RADIUS,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: BLOB_RADIUS,
              overflow: "hidden",
              background: "#F4EFE7",
            }}
          >
            <img
              src={inbarPortrait}
              alt="ענבר פרחי, פדיקוריסטית טיפולית"
              width={720}
              height={720}
              loading="eager"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: -14,
              right: -10,
              width: 92,
              height: 92,
              borderRadius: 999,
              background: STAMP,
              color: "#FFF8F4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 11,
              fontWeight: 800,
              lineHeight: 1.3,
              transform: "rotate(8deg)",
              border: "4px solid white",
              boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
            }}
          >
            5★<br />200+<br />מטופלות
          </div>
        </div>

        <div className="flex items-center justify-center gap-3" style={{ fontSize: 11, color: `${WARM}99`, fontWeight: 500 }}>
          <span>איכילוב</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: `${WARM}40` }} />
          <span>NHS</span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: `${WARM}40` }} />
          <span>IWGDF</span>
        </div>
      </div>
    </section>
  );
}

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
