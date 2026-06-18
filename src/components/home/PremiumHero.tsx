import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ShieldCheck, GraduationCap, Award } from "lucide-react";
import { useRef } from "react";
import inbarPortrait from "@/assets/inbar-portrait-cutout.png";

const TEAL = "#0F6B6E";
const TEAL_DEEP = "#073E40";
const INK = "#1A2A2C";
const WARM = "#5C4A3A";
const TEAL_SOFT = "#E5F0F0";
const BLOB_RADIUS = "60% 40% 50% 50% / 55% 45% 55% 45%";

function MagneticCTA({ href, children, reduced }: { href: string; children: React.ReactNode; reduced: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.18;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -6,
          borderRadius: 999,
          background: `radial-gradient(closest-side, ${TEAL}55, ${TEAL}00 70%)`,
          filter: "blur(14px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <a
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-block",
          background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DEEP})`,
          color: "white",
          fontWeight: 600,
          fontSize: 16,
          padding: "14px 32px",
          borderRadius: 999,
          boxShadow: `0 14px 36px ${TEAL}55, 0 0 0 1px ${TEAL}22 inset`,
          transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s",
        }}
      >
        {children}
      </a>
    </span>
  );
}

function MeshBackground() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(60% 50% at 85% 10%, ${TEAL}22 0%, transparent 60%),
            radial-gradient(55% 45% at 10% 90%, ${TEAL}1A 0%, transparent 65%),
            radial-gradient(70% 60% at 50% 50%, ${TEAL}0D 0%, transparent 70%),
            linear-gradient(180deg, #FFFFFF 0%, ${TEAL_SOFT}80 100%)
          `,
          pointerEvents: "none",
        }}
      />
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      >
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>
    </>
  );
}

export function PremiumHero() {
  const reduced = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: reduced ? 0 : 0.05 } },
  };
  const item: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      };

  const floatAnim = reduced
    ? undefined
    : { y: [0, -10, 0] };
  const floatTransition = reduced
    ? undefined
    : { duration: 6, repeat: Infinity, ease: "easeInOut" as const };

  const underlineInitial = reduced ? { scaleX: 1 } : { scaleX: 0 };
  const underlineAnimate = { scaleX: 1 };
  const underlineTransition = reduced
    ? { duration: 0.3 }
    : { duration: 0.9, delay: 0.6, ease: "easeOut" as const };

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden"
      style={{ fontFamily: "'Assistant', system-ui, sans-serif", background: "#FFFFFF" }}
    >
      <MeshBackground />
      {/* ============ DESKTOP ============ */}
      <div className="relative hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center max-w-7xl mx-auto px-12 py-28">
        {/* Content */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-7"
            style={{ background: `${TEAL}14` }}
          >
            <span style={{ color: TEAL, fontSize: 13, fontWeight: 600, letterSpacing: "0.01em" }}>
              מרצה ארצית · פדיקור טיפולי
            </span>
          </motion.div>

          <motion.h1
            variants={item}
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
              <span
                style={{
                  background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DEEP})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                ברמה
              </span>
              <motion.span
                aria-hidden
                initial={underlineInitial}
                animate={underlineAnimate}
                transition={underlineTransition}
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  right: 0,
                  height: 8,
                  background: `linear-gradient(90deg, ${TEAL}66, ${TEAL_DEEP}66)`,
                  borderRadius: 999,
                  transformOrigin: "right center",
                }}
              />
            </span>{" "}
            אחרת
          </motion.h1>

          <motion.p variants={item} style={{ color: WARM, fontSize: 18, lineHeight: 1.65, maxWidth: 480, marginBottom: 36 }}>
            ענבר פרחי — מרצה ארצית ומנחה השתלמויות לפדיקוריסטיות טיפוליות, עם 12+ שנות ניסיון קליני בכף הרגל הסוכרתית, אורטוניקסיה ושיקום ציפורן.
          </motion.p>

          <motion.div variants={item} className="flex items-center gap-4 mb-14">
            <MagneticCTA href="/masterclass" reduced={reduced}>הזמנת הרצאה</MagneticCTA>
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
          </motion.div>

          {/* Authority badges — visible, not buried */}
          <motion.ul
            variants={item}
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
          </motion.ul>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square w-full max-w-[520px] mx-auto"
          style={{ overflow: "visible" }}
        >
          <motion.div
            animate={floatAnim}
            transition={floatTransition}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
          {/* Soft teal glow / halo */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-8%",
              background: `radial-gradient(closest-side, ${TEAL}40, ${TEAL}00 70%)`,
              filter: "blur(40px)",
              borderRadius: BLOB_RADIUS,
              pointerEvents: "none",
            }}
          />
          {/* Blurred ring */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "4%",
              border: `1px solid ${TEAL}33`,
              borderRadius: BLOB_RADIUS,
              transform: "translate(8px, -8px)",
              pointerEvents: "none",
            }}
          />
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
          {/* Breakout image — hand & cream jar overflow the blob */}
          <img
            src={inbarPortrait}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "108%",
              height: "108%",
              marginRight: "-4%",
              marginTop: "-4%",
              objectFit: "cover",
              objectPosition: "50% 28%",
              clipPath: "inset(55% 0% 0% 55%)",
              pointerEvents: "none",
              filter: `drop-shadow(0 18px 24px ${TEAL_DEEP}33)`,
            }}
          />
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
              zIndex: 2,
            }}
          >
            20+<br />פדיקוריסטיות<br />הוכשרו
          </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="relative lg:hidden px-5 pt-3 pb-5">
        {/* Visual — large, fills ATF */}
        <motion.div
          animate={floatAnim}
          transition={floatTransition}
          className="relative aspect-square w-full max-w-[280px] mx-auto mb-4"
          style={{ overflow: "visible" }}
        >
          {/* Glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-6%",
              background: `radial-gradient(closest-side, ${TEAL}40, ${TEAL}00 70%)`,
              filter: "blur(28px)",
              borderRadius: BLOB_RADIUS,
              pointerEvents: "none",
            }}
          />
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
          {/* Breakout overlay */}
          <img
            src={inbarPortrait}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "108%",
              height: "108%",
              marginRight: "-4%",
              marginTop: "-4%",
              objectFit: "cover",
              objectPosition: "50% 28%",
              clipPath: "inset(55% 0% 0% 55%)",
              pointerEvents: "none",
              filter: `drop-shadow(0 10px 14px ${TEAL_DEEP}33)`,
            }}
          />
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
              zIndex: 2,
            }}
          >
            20+<br />פדיקוריסטיות<br />הוכשרו
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
        <motion.div
          variants={item}
          className="inline-flex items-center px-3 py-1 rounded-full mb-3"
          style={{ background: `${TEAL}14` }}
        >
          <span style={{ color: TEAL, fontSize: 11, fontWeight: 600 }}>
            מרצה ארצית · פדיקור טיפולי
          </span>
        </motion.div>

        <motion.h1
          variants={item}
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
            <span
              style={{
                background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DEEP})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              ברמה
            </span>
            <motion.span
              aria-hidden
              initial={underlineInitial}
              animate={underlineAnimate}
              transition={underlineTransition}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 6,
                background: `linear-gradient(90deg, ${TEAL}66, ${TEAL_DEEP}66)`,
                borderRadius: 999,
                transformOrigin: "right center",
              }}
            />
          </span>{" "}
          אחרת
        </motion.h1>

        <motion.p variants={item} style={{ color: WARM, fontSize: 13.5, lineHeight: 1.5, marginBottom: 12 }}>
          מרצה ארצית ומנחה השתלמויות לפדיקוריסטיות טיפוליות.
        </motion.p>

        <motion.div variants={item} className="flex gap-2 mb-3">
          <a
            href="/masterclass"
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DEEP})`,
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              padding: "11px 16px",
              borderRadius: 999,
              textAlign: "center",
              boxShadow: `0 10px 22px ${TEAL}55`,
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
        </motion.div>

        {/* Authority badges — mobile */}
        <motion.ul variants={item} className="mt-4 grid grid-cols-3 gap-2" aria-label="אישורים והכשרות מקצועיות">
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
        </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
