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

function SimplePathCard({ step, isActive, isLit }) {
  const [hover, setHover] = React.useState(false);
  // The sweep "lands" on a card (isActive) then leaves it settled-but-lit (isLit).
  const raised = hover || isActive;
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
        boxShadow: isActive ? "var(--shadow-lg)" : (hover ? "var(--shadow-md)" : "none"),
        transform: isActive ? "translateY(-14px) scale(1.03)" : (hover ? "translateY(-6px)" : "none"),
        transition: isActive
          ? "box-shadow 0.28s var(--ease-out, ease-out), transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "box-shadow 0.45s var(--ease-in-out), transform 0.45s var(--ease-in-out)",
      }}>
      {/* Giant numeral bleeding off the bottom edge, behind the copy.
          Dim until the sweep reaches it; punches up + glows on landing, then settles lit. */}
      <span aria-hidden="true" style={{
        position: "absolute", left: 0, right: 0, bottom: "-0.06em",
        transformOrigin: "50% 100%",
        textAlign: "center",
        fontSize: "clamp(200px, 17.5vw, 330px)", lineHeight: 1, fontWeight: 300,
        color: step.numeral, pointerEvents: "none", userSelect: "none",
        opacity: isLit ? 1 : 0.18,
        transform: isActive ? "scale(1.22)" : "scale(1)",
        textShadow: isActive ? "0 0 46px " + step.numeral : "0 0 0 transparent",
        transition: isActive
          ? "opacity 0.28s var(--ease-out, ease-out), transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.28s var(--ease-out, ease-out)"
          : "opacity 0.55s var(--ease-out, ease-out), transform 0.55s var(--ease-out, ease-out), text-shadow 0.55s var(--ease-out, ease-out)",
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

// Sequential highlight: once the section enters view, sweep the emphasis
// across the steps 1 -> 2 -> 3 -> 4 to trace "the path to go".
function useSimplePathSweep(ref, count) {
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  // activeStep: which step the sweep is currently landing on (0 = none, count = done).
  const [activeStep, setActiveStep] = React.useState(reduced ? count : 0);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setActiveStep(count); return; }
    let timers = [];
    const io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const STEP_MS = 360;
      for (let i = 1; i <= count; i++) {
        timers.push(setTimeout(function (n) { setActiveStep(n); }, STEP_MS * i, i));
      }
    }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return function () {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [reduced, count]);
  return activeStep;
}

function ChimeSimplePathSection() {
  const [linkHover, setLinkHover] = React.useState(false);
  const gridRef = React.useRef(null);
  const activeStep = useSimplePathSweep(gridRef, SIMPLE_PATH_STEPS.length);
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

      <div ref={gridRef} className="simple-path-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--spacing-4)",
      }}>
        {SIMPLE_PATH_STEPS.map((step, i) => (
          <SimplePathReveal key={step.n} delay={i * 100}>
            <SimplePathCard
              step={step}
              isActive={activeStep === step.n}
              isLit={activeStep >= step.n}
            />
          </SimplePathReveal>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ChimeSimplePathSection });
