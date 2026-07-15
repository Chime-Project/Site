// Chime Health — Homepage UI kit: "A Simple Path Forward" section
// Four step cards with oversized numerals set as backgrounds, anchored to the card bottom.

// Scroll-reveal wrapper (same pattern as other homepage sections).
function PathReveal({ children, delay, style }) {
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

const PATH_STEPS = [
  {
    n: "1", title: "Discover", body: "Tell us about your goals.",
    bg: "var(--color-blue-950)", text: "var(--color-white)",
    sub: "rgba(255,255,255,0.78)", num: "var(--color-blue-300)",
  },
  {
    n: "2", title: "Connect", body: "Meet your care team.",
    bg: "var(--color-blue-800)", text: "var(--color-white)",
    sub: "rgba(255,255,255,0.78)", num: "var(--color-blue-100)",
  },
  {
    n: "3", title: "Personalize", body: "Receive your personalized plan.",
    bg: "var(--color-blue-500)", text: "var(--color-white)",
    sub: "rgba(255,255,255,0.82)", num: "var(--color-blue-800)",
  },
  {
    n: "4", title: "Thrive", body: "Stay supported along the way.",
    bg: "var(--color-sand-100)", text: "var(--color-blue-800)",
    sub: "var(--color-sand-800)", num: "var(--color-sand-400)",
  },
];

function PathCard({ step, index }) {
  const [hover, setHover] = React.useState(false);
  return (
    <PathReveal delay={120 + index * 100} style={{ display: "grid" }}>
      <div
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          position: "relative", overflow: "hidden",
          background: step.bg,
          borderRadius: "var(--radius-3xl)",
          minHeight: 400,
          padding: "var(--spacing-6)",
          boxSizing: "border-box",
          display: "flex", flexDirection: "column", gap: "var(--spacing-2)",
          transform: hover ? "translateY(-4px)" : "none",
          boxShadow: hover ? "var(--shadow-md)" : "none",
          transition: "transform var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
        }}>
        {/* Oversized numeral as background, anchored to the bottom edge */}
        <span aria-hidden="true" style={{
          position: "absolute", left: 0, right: 0, bottom: "-0.06em",
          textAlign: "center",
          fontSize: "clamp(200px, 17.5vw, 330px)",
          lineHeight: 1, fontWeight: 300,
          color: step.num,
          pointerEvents: "none", userSelect: "none",
          fontVariantNumeric: "lining-nums",
        }}>{step.n}</span>

        <h3 style={{
          position: "relative", margin: 0,
          fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
          color: step.text, lineHeight: 1.2,
        }}>{step.title}</h3>
        <p style={{
          position: "relative", margin: 0,
          fontSize: "var(--text-sm)", lineHeight: 1.5,
          color: step.sub, maxWidth: "14em",
        }}>{step.body}</p>
      </div>
    </PathReveal>
  );
}

function ChimePathSection() {
  const [linkHover, setLinkHover] = React.useState(false);
  return (
    <section data-screen-label="Simple Path Forward" className="path-section" style={{
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-12) var(--spacing-8)",
      maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
    }}>
      <PathReveal>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          gap: "var(--spacing-4)", flexWrap: "wrap",
          marginBottom: "var(--spacing-6)",
        }}>
          <h2 className="path-title" style={{
            margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300,
            lineHeight: 1.1, color: "var(--text-default)", textWrap: "balance",
          }}>A Simple Path Forward</h2>
          <a href="#"
            onMouseEnter={() => setLinkHover(true)} onMouseLeave={() => setLinkHover(false)}
            style={{
              fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
              color: linkHover ? "var(--accent-hover)" : "var(--accent-strong)",
              textDecoration: "underline", textUnderlineOffset: 3,
              transition: "color var(--transition-base) var(--ease-in-out)",
            }}>Discover your health path</a>
        </div>
      </PathReveal>

      <div className="path-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "var(--spacing-4)",
      }}>
        {PATH_STEPS.map((step, i) => (
          <PathCard key={step.n} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ChimePathSection });
