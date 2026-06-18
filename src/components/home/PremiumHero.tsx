import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Award } from "lucide-react";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

const TEAL = "#0F6B6E";
const INK = "#1A2A2C";
const WARM = "#5C4A3A";
const TEAL_SOFT = "#E5F0F0";
const BLOB_RADIUS = "60% 40% 50% 50% / 55% 45% 55% 45%";

export function PremiumHero() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-white"
      style={{ fontFamily: "'Assistant', system-ui, sans-serif" }}
    >
      {/* ============ DESKTOP ============ */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center max-w-7xl mx-auto px-12 py-28">
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
              מרצה ארצית · פדיקור טיפולי
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

          <p style={{ color: WARM, fontSize: 18, lineHeight: 1.65, maxWidth: 480, marginBottom: 36 }}>
            ענבר פרחי — מרצה ארצית ומנחה השתלמויות לפדיקוריסטיות טיפוליות, עם 12+ שנות ניסיון קליני בכף הרגל הסוכרתית, אורטוניקסיה ושיקום ציפורן.
          </p>

          <div className="flex items-center gap-3 mb-14">
            <a
              href="/masterclass"
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
              הזמנת הרצאה
            </a>
            <a
              href="/contact"
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
              קביעת תור בקליניקה
            </a>
          </div>

          {/* Authority badges — visible, not buried */}
          <ul
            className="grid grid-cols-3 gap-3"
            style={{ maxWidth: 520 }}
            aria-label="אישורים והכשרות מקצועיות"
          >
            {[
              { icon: Award, label: "12+ שנות", sub: "ניסיון קליני" },
              { icon: GraduationCap, label: "מרצה", sub: "ארצית" },
              { icon: ShieldCheck, label: "תקני", sub: "IWGDF · NHS" },
            ].map(({ icon: Icon, label, sub }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3"
                style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-ring)" }}
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--primary-soft)", color: TEAL }}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                </span>
                <div className="leading-tight">
                  <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>{label}</div>
                  <div style={{ fontSize: 11, color: WARM, fontWeight: 500 }}>{sub}</div>
                </div>
              </li>
            ))}
          </ul>
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
              background: `${TEAL}1F`,
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
              background: TEAL_SOFT,
            }}
          >
            <img
              src={inbarPortrait}
              alt="ענבר פרחי, פדיקוריסטית טיפולית"
              width={896}
              height={1120}
              loading="eager"
              style={{ width: "108%", height: "108%", marginRight: "-4%", marginTop: "-4%", objectFit: "cover", objectPosition: "50% 28%" }}
            />
          </div>
          {/* Authority sticker */}
          <div
            style={{
              position: "absolute",
              top: -18,
              right: -18,
              width: 112,
              height: 112,
              borderRadius: 999,
              background: TEAL,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.3,
              transform: "rotate(8deg)",
              border: "4px solid white",
              boxShadow: `0 12px 28px ${TEAL}40`,
            }}
          >
            20+<br />פדיקוריסטיות<br />הוכשרו
          </div>
        </motion.div>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="lg:hidden px-5 pt-3 pb-5">
        {/* Visual — large, fills ATF */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto mb-4">
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              transform: "translate(-10px, 10px)",
              background: `${TEAL}1F`,
              borderRadius: BLOB_RADIUS,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: BLOB_RADIUS,
              overflow: "hidden",
              background: TEAL_SOFT,
            }}
          >
            <img
              src={inbarPortrait}
              alt="ענבר פרחי, פדיקוריסטית טיפולית"
              width={720}
              height={720}
              loading="eager"
              style={{ width: "108%", height: "108%", marginRight: "-4%", marginTop: "-4%", objectFit: "cover", objectPosition: "50% 28%" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: -12,
              right: -10,
              width: 86,
              height: 86,
              borderRadius: 999,
              background: TEAL,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 10,
              fontWeight: 800,
              lineHeight: 1.25,
              transform: "rotate(8deg)",
              border: "3px solid white",
              boxShadow: `0 8px 16px ${TEAL}40`,
            }}
          >
            20+<br />פדיקוריסטיות<br />הוכשרו
          </div>
        </div>

        <div
          className="inline-flex items-center px-3 py-1 rounded-full mb-3"
          style={{ background: `${TEAL}14` }}
        >
          <span style={{ color: TEAL, fontSize: 11, fontWeight: 600 }}>
            מרצה ארצית · פדיקור טיפולי
          </span>
        </div>

        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 9.5vw, 2.75rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: INK,
            marginBottom: 8,
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

        <p style={{ color: WARM, fontSize: 13.5, lineHeight: 1.5, marginBottom: 12 }}>
          מרצה ארצית ומנחה השתלמויות לפדיקוריסטיות טיפוליות.
        </p>

        <div className="flex gap-2 mb-3">
          <a
            href="/masterclass"
            style={{
              flex: 1,
              background: TEAL,
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              padding: "11px 16px",
              borderRadius: 999,
              textAlign: "center",
              boxShadow: `0 8px 18px ${TEAL}33`,
            }}
          >
            הזמנת הרצאה
          </a>
          <a
            href="/contact"
            style={{
              flex: 1,
              border: `1.5px solid ${TEAL}`,
              color: TEAL,
              fontWeight: 600,
              fontSize: 14,
              padding: "9.5px 16px",
              borderRadius: 999,
              textAlign: "center",
            }}
          >
            קביעת תור
          </a>
        </div>

        {/* Authority badges — mobile */}
        <ul className="mt-4 grid grid-cols-3 gap-2" aria-label="אישורים והכשרות מקצועיות">
          {[
            { icon: Award, label: "12+ שנות" },
            { icon: GraduationCap, label: "מרצה ארצית" },
            { icon: ShieldCheck, label: "IWGDF · NHS" },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-xl border bg-white px-2 py-2.5 text-center"
              style={{ borderColor: "var(--border)" }}
            >
              <Icon aria-hidden className="h-4 w-4" strokeWidth={1.8} style={{ color: TEAL }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: INK, lineHeight: 1.15 }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
