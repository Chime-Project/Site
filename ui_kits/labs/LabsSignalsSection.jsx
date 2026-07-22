// Chime Health — Labs UI kit: signals explorer (ChimeLabsSignalsSection)
// A rotating rail of body-signal categories beside a detail panel. Sits on the
// page ground with no band color of its own; surfaces are the light page
// palette (elevated card, accent-subtle panel) and the accent tokens follow the
// enclosing data-theme, so "lab" tints it iris.

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function LabsSignalsReveal(props) {
  return <Reveal {...props} />;
}

const LABS_SIG_ITEMS = [
  { tag: "Hormones", title: "Hormonal Health & Vitality",
    body: "Hormones influence far more than body composition. They may also play a role in energy, recovery, motivation, and overall vitality.",
    markers: "Testosterone · Free Testosterone · Estradiol" },
  { tag: "Metabolism", title: "Metabolism & Weight Management",
    body: "Metabolic markers may reflect how your body processes energy, manages blood sugar, and stores fuel over time.",
    markers: "HbA1c · Fasting Insulin · Glucose" },
  { tag: "Energy", title: "Energy & Recovery",
    body: "Day-to-day energy and recovery can connect to nutrient status, iron levels, and how your body handles stress.",
    markers: "Ferritin · Vitamin D · Cortisol" },
  { tag: "Heart Health", title: "Advanced Heart Health Insights",
    body: "A closer look at cardiovascular markers that go beyond a standard cholesterol test.",
    markers: "ApoB · Lp(a) · hs-CRP" },
  { tag: "Healthy Aging", title: "Healthy Aging",
    body: "Markers associated with long-term wellness that may support conversations around healthy aging.",
    markers: "HbA1c · hs-CRP · DHEA-S" },
  { tag: "And More", title: "And Much More…",
    body: "Thyroid, liver, kidney, nutrients, and beyond — a fuller picture across your body's systems.",
    markers: "TSH · ALT · eGFR" },
];

function ChimeLabsSignalsSection({ theme = "lab" }) {
  return (
    <section id="labs-signals-section" data-screen-label="Labs Signals" data-theme={theme}
      className="labs-signals-section" style={{
        fontFamily: "var(--font-family-base)",
        padding: "var(--spacing-12) var(--spacing-8)",
        maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
      }}>
      <LabsSignalsReveal>
      <div style={{
        position: "relative",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-3xl)",
        padding: "var(--spacing-10)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-8)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)" }}>
          <h3 style={{
            margin: 0, textAlign: "center", maxWidth: "18em",
            fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.12,
            color: "var(--text-default)", textWrap: "balance",
          }}>Discover Some Of The Signals Your Body May Be Sending</h3>
          <p style={{
            margin: 0, textAlign: "center", maxWidth: "38em",
            fontSize: "var(--text-base)", lineHeight: 1.55,
            color: "var(--fg-muted)", textWrap: "pretty",
          }}>What your biomarkers may be telling you.</p>
        </div>
        <LabsSignalsExplorer />
      </div>
      </LabsSignalsReveal>
    </section>
  );
}

function LabsSignalsExplorer() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [fade, setFade] = React.useState(true);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const go = React.useCallback(function (i) {
    setFade(false);
    setTimeout(function () { setActive(i); setFade(true); }, 450);
  }, []);
  React.useEffect(function () {
    if (reduced || paused) return;
    const t = setInterval(function () {
      setFade(false);
      setTimeout(function () {
        setActive(function (a) { return (a + 1) % LABS_SIG_ITEMS.length; });
        setFade(true);
      }, 450);
    }, 5000);
    return function () { clearInterval(t); };
  }, [reduced, paused]);
  const item = LABS_SIG_ITEMS[active];
  const num = function (i) { return (i + 1 < 10 ? "0" : "") + (i + 1); };
  return (
    <div className="labs-signals-grid"
      onMouseEnter={function () { setPaused(true); }}
      onMouseLeave={function () { setPaused(false); }}
      style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "var(--spacing-6)", alignItems: "stretch" }}>
      {/* Rail */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        {LABS_SIG_ITEMS.map(function (s, i) {
          const isActive = i === active;
          return (
            <button key={s.tag} onClick={function () { go(i); }} style={{
              textAlign: "left", cursor: "pointer", font: "inherit",
              background: isActive ? "var(--accent-subtle)" : "var(--bg-elevated)",
              color: isActive ? "var(--accent-onSubtle)" : "var(--text-default)",
              border: "1px solid " + (isActive ? "var(--accent-border)" : "var(--border-default)"),
              borderRadius: "var(--radius-xl)", padding: "var(--spacing-3) var(--spacing-4)",
              display: "flex", flexDirection: "column", gap: "var(--spacing-1)",
              transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
            }}>
              <span style={{
                fontSize: "var(--text-xs)", letterSpacing: "0.08em",
                color: isActive ? "var(--accent-strong)" : "var(--text-muted)",
              }}>{num(i)} — {s.tag}</span>
              <span style={{ fontSize: "var(--text-base)", lineHeight: 1.3 }}>{s.title}</span>
            </button>
          );
        })}
      </div>
      {/* Detail panel */}
      <div style={{
        background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-2xl)", padding: "var(--spacing-8)", minHeight: 420,
        display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--spacing-8)",
        opacity: fade ? 1 : 0, transform: fade ? "none" : "translateY(10px)",
        transition: "opacity 0.9s var(--ease-out, ease-out), transform 0.9s var(--ease-out, ease-out)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            background: "var(--bg-elevated)", color: "var(--accent-onSubtle)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-4)",
            fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
          }}>{item.tag}</span>
          <span style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)" }}>{num(active)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {/* --text-secondary, not --text-muted: muted (slate-500) is 4.31:1 on
              --accent-subtle, under the AA floor. */}
          <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)" }}>Did you know?</div>
          <h4 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 300, lineHeight: 1.15, color: "var(--text-default)" }}>{item.title}</h4>
          <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--fg-muted)", maxWidth: "34em" }}>{item.body}</p>
          <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--fg-muted)" }}>Featured biomarkers: {item.markers}.</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ChimeLabsSignalsSection });
