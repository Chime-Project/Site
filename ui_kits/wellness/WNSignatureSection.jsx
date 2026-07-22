// Chime Health — Health, Energy & Wellness landing: "Signature Moment"
// Split out of the timeline band per the 2026-07 copy revisions
// (uploads/Chime_Health_EnergyWellness_.pdf): the membership panel keeps the
// pitch + checklist + Rx card, and this closing band carries "Imagine Showing
// Up As Your Best Self" alone — an animated gold-gradient ground, minimal
// copy, no pricing card.
//
// The drift animation lives in wellness.html (`.wn-signature-bg`, reduced-motion
// gated, same pattern as `.reveal`); without it the band rests on the static
// mid-blend of the gradient, so the section never depends on the animation.

function WNSignatureSection() {
  return (
    <section data-screen-label="Signature Moment" data-theme="energy-wellness" style={{
      position: "relative", fontFamily: "var(--font-family-base)", overflow: "hidden",
      background: "var(--accent-default)",
    }}>
      {/* Animated ground — the accent ramp panned slowly edge to edge */}
      <div className="wn-signature-bg" aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(115deg, var(--accent-hover), var(--accent-default) 34%, var(--accent-border) 52%, var(--accent-default) 68%, var(--accent-strong))",
        backgroundSize: "320% 320%", backgroundPosition: "50% 50%",
      }}></div>
      {/* Focal glow behind the headline */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,254,251,0.16), transparent 70%)",
      }}></div>

      <div style={{
        position: "relative", maxWidth: 1152, margin: "0 auto",
        minHeight: 440, padding: "var(--spacing-20) var(--spacing-6)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Reveal>
        <h2 style={{
          margin: 0, textAlign: "center", maxWidth: "12em",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
          color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 1px 18px rgba(56,42,10,0.45)",
        }}>Imagine Showing Up As Your Best Self</h2>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { WNSignatureSection });
