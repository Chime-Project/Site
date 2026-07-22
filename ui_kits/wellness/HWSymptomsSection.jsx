// Chime Health — Health, Energy & Wellness landing: "Does Any of This Sound
// Familiar?" — a scroll-driven sticky-stack (bundui parallax-cards pattern)
// followed by a "What If Feeling Tired Isn't Normal?" content block, all inside
// ONE <section> sharing one cream→gold gradient. Themed data-theme="energy-wellness".
//
// No animation libraries: plain React + position:sticky + one throttled scroll
// listener that scales the pinned cards imperatively (refs, not state) so it
// runs at scroll rate with no re-renders. Reduced-motion users get the static
// stacked layout and no listener is attached.

const HWS_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

const HWS_CARDS = [
  "Afternoon Energy Crashes",
  "Mental Fog",
  "Difficulty Staying Focused",
  "Feeling Drained",
  "Poor Recovery",
  "Lack Of Motivation",
  "Feeling Less Like Yourself",
  "Not Performing At Your Best",
];

// Responsive rules for this section (injected once, so the component is a
// self-contained drop-in and doesn't depend on the host page's <style> block).
const HWS_CSS = `
.hws-section { font-family: var(--font-family-base);
  background: linear-gradient(180deg, var(--color-cadmium-100) 0%, var(--color-cadmium-200) 45%, var(--color-cadmium-500) 100%); }
@media (max-width: 960px) {
  .hws-grid { grid-template-columns: 1fr !important; }
  .hws-copy { text-align: center; }
  .hws-copy-sticky { position: static !important; }
  .hws-cards { justify-self: center !important; }
  .hws-bottom-spacer { display: none !important; }
  .hws-part2 { grid-template-columns: 1fr !important; }
}`;

function HWSSoundFamiliarCTA({ label, onClick }) {
  return <Button label={label} onClick={onClick} variant="ghost" size="cta" />;
}

function ChimeHWSymptomsSection() {
  const containerRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const n = HWS_CARDS.length;

  React.useEffect(function () {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    let raf = 0;

    function update() {
      raf = 0;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0; // 0→1 over the container
      const cards = cardRefs.current;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;
        const targetScale = 1 - (n - 1 - i) * 0.05; // deepest card ends smallest
        const start = i / n;                          // card i animates over [i/n, 1]
        const t = clamp((p - start) / (1 - start), 0, 1);
        card.style.transform = "scale(" + (1 + (targetScale - 1) * t) + ")";
      }
    }

    function onScroll() {
      if (!raf) raf = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [n]);

  const open = () => { window.openChimeAssessment && window.openChimeAssessment(); };

  return (
    <section data-theme="energy-wellness" data-screen-label="Sound Familiar" className="hws-section">
      <style>{HWS_CSS}</style>

      {/* ── Part 1 — sticky-stack parallax ─────────────────────────────── */}
      <div ref={containerRef} className="hws-grid" style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "minmax(320px, 1fr) 1.1fr",
        gap: "var(--spacing-12)", alignItems: "start",
        padding: "var(--spacing-16) var(--spacing-6) 0",
      }}>
        {/* Left — pinned copy (outer stretches so the sticky inner can travel) */}
        <div className="hws-copy" style={{ alignSelf: "stretch" }}>
          <div className="hws-copy-sticky" style={{ position: "sticky", top: "18vh" }}>
            <h2 style={{
              margin: 0, fontSize: "var(--text-5xl)", fontWeight: "var(--font-weight-semibold)",
              lineHeight: 1.14, color: "var(--text-default)", textWrap: "pretty",
            }}>Does Any of This Sound Familiar?</h2>
            <p style={{
              margin: "var(--spacing-4) 0 0", fontSize: "var(--text-xl)", lineHeight: 1.5,
              color: "var(--accent-strong)",
            }}>You may not need to accept feeling this way.</p>
          </div>
        </div>

        {/* Right — 8 stacking cards + in-flow spacers (never margin/padding) */}
        <div className="hws-cards" style={{ width: "100%", maxWidth: 480, justifySelf: "end" }}>
          {HWS_CARDS.map(function (label, i) {
            const even = i % 2 === 0;
            const last = i === n - 1;
            return (
              <React.Fragment key={label}>
                <div
                  ref={function (el) { cardRefs.current[i] = el; }}
                  style={{
                    position: "sticky", top: "calc(18vh + " + i + " * 12px)",
                    width: 300, aspectRatio: "1 / 1",
                    marginLeft: even ? 0 : "auto", marginRight: even ? "auto" : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textAlign: "center", opacity: 0.9,
                    background: even ? "var(--color-white)" : "var(--color-cadmium-100)",
                    border: "1px solid var(--accent-border)", borderRadius: "var(--radius-xl)",
                    padding: "var(--spacing-6)",
                    fontSize: "var(--text-3xl)", lineHeight: 1.25, fontWeight: "var(--font-weight-medium)",
                    color: "var(--text-default)",
                    boxShadow: "var(--shadow-md)",
                    transformOrigin: "center top", willChange: "transform",
                  }}>{label}</div>
                <div aria-hidden="true" style={{ height: last ? "20vh" : "35vh" }}></div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Desktop-only breathing room before Part 2 */}
      <div aria-hidden="true" className="hws-bottom-spacer" style={{ height: 150 }}></div>

      {/* ── Part 2 — "What If Feeling Tired Isn't Normal?" ─────────────── */}
      <div className="hws-part2" style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-12)",
        alignItems: "center",
        padding: "0 var(--spacing-6) calc(var(--spacing-12) * 2)",
      }}>
        {/* Left — circular image */}
        <div style={{
          aspectRatio: "1 / 1", maxWidth: 640, width: "100%",
          borderRadius: "50%", overflow: "hidden", background: "var(--color-cadmium-200)",
          position: "relative", justifySelf: "center",
        }}>
          <image-slot id="hws-tired" shape="circle" fit="cover"
            placeholder="Drop a photo — person in daily life, low energy"
            src={HWS_UPLOADS + "/stressed-couple.webp"}
            style={{ position: "absolute", inset: 0 }}></image-slot>
        </div>

        {/* Right — copy + CTA */}
        <div style={{ maxWidth: 480 }}>
          <h2 style={{
            margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.15,
            color: "var(--fg-default)",
          }}>What If Feeling Tired Isn't Normal?</h2>
          <p style={{
            margin: "var(--spacing-5) 0 0", fontSize: "var(--text-lg)", lineHeight: 1.6,
            color: "var(--fg-muted)",
          }}>Many people adapt to low energy over time. They tell themselves it's just part of life — but sometimes the answer may be more complex.</p>
          <p style={{
            margin: "var(--spacing-5) 0 0", fontSize: "var(--text-xl)",
            fontWeight: "var(--font-weight-semibold)", color: "var(--fg-default)",
          }}>Feeling Better Starts With Understanding.</p>
          <div style={{ marginTop: "var(--spacing-6)" }}>
            <HWSSoundFamiliarCTA label="Discover Your Wellness Path" onClick={open}></HWSSoundFamiliarCTA>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChimeHWSymptomsSection });
