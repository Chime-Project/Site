// Chime Health — Homepage UI kit: "A Simple Path Forward" section
// Header row + 4-step card grid. Each card carries a giant numeral bleeding off the bottom edge.

// Scroll-reveal wrapper: fades/slides children in when they enter the viewport.
function SimplePathReveal({ children, delay, style }) {
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

const SIMPLE_PATH_STEPS = [
  {
    n: 1, title: "Discover", body: "Tell us about your goals.",
    bg: "var(--color-blue-950)", text: "var(--color-white)",
    numeral: "var(--color-blue-300)", bodyOpacity: 0.78,
  },
  {
    n: 2, title: "Connect", body: "Meet your care team.",
    bg: "var(--color-blue-800)", text: "var(--color-white)",
    numeral: "var(--color-blue-100)", bodyOpacity: 0.78,
  },
  {
    n: 3, title: "Personalize", body: "Receive your personalized plan.",
    bg: "var(--color-blue-500)", text: "var(--color-white)",
    numeral: "var(--color-blue-800)", bodyOpacity: 0.78,
  },
  {
    n: 4, title: "Thrive", body: "Stay supported along the way.",
    bg: "var(--color-sand-100)", text: "var(--color-blue-800)",
    numeral: "var(--color-sand-400)", body_color: "var(--color-sand-800)", bodyOpacity: 1,
  },
];

function SimplePathCard({ step }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", overflow: "hidden",
        minHeight: 400, boxSizing: "border-box",
        padding: "var(--spacing-6)",
        borderRadius: "var(--radius-3xl)",
        background: step.bg,
        boxShadow: hover ? "var(--shadow-md)" : "none",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>
      {/* Giant numeral bleeding off the bottom edge, behind the copy */}
      <span aria-hidden="true" style={{
        position: "absolute", left: 0, right: 0, bottom: "-0.06em",
        textAlign: "center",
        fontSize: "clamp(200px, 17.5vw, 330px)", lineHeight: 1, fontWeight: 300,
        color: step.numeral, pointerEvents: "none", userSelect: "none",
      }}>{step.n}</span>

      <div style={{ position: "relative" }}>
        <div style={{
          fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
          color: step.text, lineHeight: 1.3,
        }}>{step.title}</div>
        <p style={{
          margin: "var(--spacing-2) 0 0",
          fontSize: "var(--text-sm)", lineHeight: 1.5,
          color: step.body_color || step.text, opacity: step.bodyOpacity,
          maxWidth: "18em",
        }}>{step.body}</p>
      </div>
    </div>
  );
}

function ChimeSimplePathSection() {
  const [linkHover, setLinkHover] = React.useState(false);
  return (
    <section data-screen-label="Simple Path Forward" className="simple-path-section" style={{
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-12) var(--spacing-8)",
      maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
      background: "var(--bg-default)",
    }}>
      <SimplePathReveal style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        flexWrap: "wrap", gap: "var(--spacing-4)",
        marginBottom: "var(--spacing-8)",
      }}>
        <h2 className="simple-path-title" style={{
          margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300,
          lineHeight: 1.1, color: "var(--text-default)",
        }}>A Simple Path Forward</h2>
        <a href="#" data-theme="default"
          onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
          onMouseEnter={() => setLinkHover(true)}
          onMouseLeave={() => setLinkHover(false)}
          style={{
            fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
            color: linkHover ? "var(--accent-hover)" : "var(--accent-strong)",
            textDecoration: "underline", textUnderlineOffset: "3px",
            transition: "color var(--transition-base) var(--ease-in-out)",
          }}>Discover your health path</a>
      </SimplePathReveal>

      <div className="simple-path-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--spacing-4)",
      }}>
        {SIMPLE_PATH_STEPS.map((step, i) => (
          <SimplePathReveal key={step.n} delay={i * 100}>
            <SimplePathCard step={step} />
          </SimplePathReveal>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ChimeSimplePathSection });
