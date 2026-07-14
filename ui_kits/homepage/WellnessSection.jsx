// Chime Health — Homepage UI kit: Health, Energy & Wellness section
// Full-bleed band themed with the warm peach palette.
// wellness.jpg at top, gradient glued into solid warm ground; title → hero image → CTAs → 3 cards.

const HW_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const HW_SOLID = "#D7AA52"; // Soft Cadmium (Accent)

// Scroll-reveal wrapper (same behavior as WLReveal)
function HWReveal({ children, delay, style }) {
  const ref = React.useRef(null);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return function () { io.disconnect(); };
  }, [reduced]);
  return (
    <div ref={ref} style={Object.assign({
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(28px)",
      transition: "opacity 0.8s var(--ease-out, ease-out), transform 0.8s var(--ease-out, ease-out)",
      transitionDelay: (delay || 0) + "ms",
      willChange: "opacity, transform",
    }, style || {})}>{children}</div>
  );
}

function ChimeWellnessSection() {
  return (
    <section id="wellness-section" data-screen-label="Health, Energy and Wellness" data-theme="wellness" style={{
      position: "relative", overflow: "hidden",
      background: HW_SOLID,
      fontFamily: "var(--font-family-base)",
      marginTop: "var(--spacing-12)",
    }}>
      {/* Background video, glued to the solid color with a gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 860, pointerEvents: "none" }}>
        <video src={HW_UPLOADS + "/hf_20260713_173242_23f715b1-50ef-45c4-addf-d7f2be7692c0.mp4"}
          autoPlay muted loop playsInline
          ref={function (el) { if (el) el.playbackRate = 0.5; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}></video>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(76,57,14,0.42) 0%, rgba(76,57,14,0.14) 30%, rgba(76,57,14,0.55) 62%, " + HW_SOLID + " 96%)",
        }}></div>
      </div>

      {/* ---- Top: title, hero, CTAs ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "var(--spacing-12) var(--spacing-8) 0",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <HWReveal style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          color: "rgba(255,255,255,0.9)", fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.12em",
          textTransform: "uppercase", opacity: 0.9, marginBottom: "var(--spacing-3)",
        }}>Health, Energy &amp; Wellness by Chime</div>
        <h2 className="hw-title" style={{
          margin: 0, textAlign: "center", maxWidth: "13em",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.08,
          color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 1px 18px rgba(56,42,10,0.45)",
        }}>Feel More Like Yourself Again</h2>
        </HWReveal>

        <HWReveal delay={120} style={{ width: "100%" }}>
        <div className="hw-intro-row" style={{
          marginTop: "clamp(160px, 24vw, 320px)", marginBottom: "var(--spacing-10)",
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "var(--spacing-8)", flexWrap: "wrap", width: "100%",
        }}>
          <p style={{
            margin: 0, maxWidth: "34em",
            fontSize: "var(--text-lg)", lineHeight: 1.55, color: "var(--color-white)", opacity: 0.92,
            textShadow: "0 1px 14px rgba(56,42,10,0.4)",
          }}>Energy, wellness, and vitality are deeply personal. Whether you’re looking to improve your daily energy, stay focused, support recovery, or simply feel your best, Chime helps you explore a more personalized path forward.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
            <HWButton primary large label="Discover Your Wellness Path" />
          </div>
        </div>
        </HWReveal>
      </div>

      {/* ---- Cards ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "0 var(--spacing-8) var(--spacing-10)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      }}>
        {/* Card 1 — wide: "Does any of this sound familiar?" tappable chips */}
        <HWReveal>
        <HWFamiliarCard />
        </HWReveal>

        {/* Product carousel card (centered) */}
        <HWReveal delay={140}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            position: "relative", overflow: "hidden", boxSizing: "border-box",
            background: "rgba(56,42,10,0.78)", border: "1px solid rgba(56,42,10,0.5)",
            borderRadius: "var(--radius-3xl)", padding: "var(--spacing-5)", minHeight: 420,
            width: "100%", maxWidth: 360,
            display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
          }}>
            <ChimeRxCarousel Button={HWButton} accentColor="#E6C465" uploads={HW_UPLOADS} />
          </div>
        </div>
        </HWReveal>

        <HWReveal delay={100}>
        <p style={{
          margin: "var(--spacing-2) auto 0", maxWidth: "52em", textAlign: "center",
          fontSize: "var(--text-xs)", lineHeight: 1.6, color: "rgba(255,255,255,0.8)",
        }}>Not available in all 50 states. Eligibility determination and prescription required for all treatments. Individual results vary. <a href="#" style={{ color: "var(--color-white)" }}>Read more</a></p>
        </HWReveal>
      </div>
    </section>
  );
}

const HW_FEELINGS = [
  "Afternoon energy crashes", "Mental fog", "Difficulty staying focused", "Feeling drained",
  "Poor recovery", "Lack of motivation", "Feeling less like yourself", "Not performing at your best",
];

function HWFamiliarCard() {
  const [picked, setPicked] = React.useState({});
  const count = Object.values(picked).filter(Boolean).length;
  const anyPicked = count > 0;
  return (
    <div className="hw-card-wide" style={{
      position: "relative",
      background: "rgba(56,42,10,0.78)",
      border: "1px solid rgba(56,42,10,0.5)",
      borderRadius: "var(--radius-3xl)",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "var(--spacing-6)", padding: "var(--spacing-10)",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)", textAlign: "center" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.12, color: "var(--color-white)", textWrap: "balance" }}>Does any of this sound familiar?</h3>
        <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.55, color: "rgba(255,255,255,0.85)", maxWidth: "36em" }}>Many people assume these feelings are simply part of getting older or having a busy life. Sometimes there may be more to the story.</p>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>Tap what sounds familiar</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--spacing-3)", maxWidth: "44em" }}>
        {HW_FEELINGS.map(function (label) {
          const on = !!picked[label];
          return (
            <button key={label} type="button"
              onClick={function () { setPicked(function (p) { const n = Object.assign({}, p); n[label] = !n[label]; return n; }); }}
              aria-pressed={on}
              style={{
                cursor: "pointer", fontFamily: "inherit",
                fontSize: "var(--text-base)", fontWeight: on ? "var(--font-weight-semibold)" : "var(--font-weight-regular)",
                color: on ? "#4C390E" : "var(--color-white)",
                background: on ? "#F5E3A8" : "rgba(255,255,255,0.14)",
                border: on ? "1px solid #F5E3A8" : "1px solid rgba(255,255,255,0.35)",
                borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-3) var(--spacing-5)",
                boxShadow: on ? "0 6px 20px rgba(217,166,46,0.35)" : "none",
                transition: "background 0.25s var(--ease-in-out), color 0.25s var(--ease-in-out), border-color 0.25s var(--ease-in-out), box-shadow 0.25s var(--ease-in-out), transform 0.25s var(--ease-in-out)",
                transform: on ? "scale(1.04)" : "none",
              }}>{label}</button>
          );
        })}
      </div>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-4)",
      }}>
        <p style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 300, color: "var(--color-white)", textAlign: "center" }}>
          You may not need to accept feeling this way.
        </p>
        <HWButton primary small label="Discover Your Wellness Path" />
      </div>
    </div>
  );
}

function HWButton({ label, primary, small, tiny, large }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden",
        background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
        color: primary
          ? (hover ? "var(--text-on-primary)" : HW_SOLID)
          : "var(--color-white)",
        backdropFilter: primary ? "none" : "blur(8px)",
        border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
        borderRadius: "var(--radius-4xl)",
        padding: tiny ? "var(--spacing-1) var(--spacing-3)" : (small ? "var(--spacing-2) var(--spacing-5)" : (large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)")),
        fontSize: tiny ? "var(--text-sm)" : (large ? "var(--text-lg)" : "var(--text-base)"), fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none", whiteSpace: "nowrap",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
      <span style={{
        position: "absolute", inset: 0,
        background: "#D9A62E",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}

Object.assign(window, { ChimeWellnessSection });
