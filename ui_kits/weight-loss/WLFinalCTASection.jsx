// Chime Health — Weight Loss landing: "Final CTA" closing band
// Per the page blueprint (uploads/Weight Loss-Chime-Web.pdf, row 9): "The Next
// Chapter Starts Here" + assessment CTA. Reuses the vial-banner layout that used
// to sit inside WLBodiesSection (same .wlb-banner classes, so the responsive
// collapse in weight-loss.html keeps applying).

function WLFinalCTAButton({ label }) {
  return <Button label={label} tone="onLight" variant="primary" size="cta" />;
}

function WLFinalCTASection() {
  const [vhover, setVhover] = React.useState(false);
  return (
    <section data-screen-label="Final CTA" data-theme="weight-loss" style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
      padding: "var(--spacing-12) var(--spacing-6) var(--spacing-20)",
    }}>
      <WLReveal className="wlb-banner" style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "300px 1fr auto",
        alignItems: "center", columnGap: "var(--spacing-12)",
      }}>
        {/* Left — product tile */}
        <div className="wlb-banner-tile"
          onMouseEnter={() => setVhover(true)} onMouseLeave={() => setVhover(false)}
          style={{
            position: "relative", width: 300, height: 300, borderRadius: 24,
            background: "linear-gradient(160deg, var(--accent-default), var(--accent-strong))",
            cursor: "pointer",
          }}>
          <img src="uploads/vial-solo.webp" alt="Medication vial"
            style={{
              position: "absolute", left: "50%", top: "50%",
              height: "118%", width: "auto",
              transform: vhover
                ? "translate(-50%, -54%) rotate(16deg) scale(1.07)"
                : "translate(-50%, -50%) rotate(12deg)",
              filter: vhover
                ? "drop-shadow(-12px 30px 44px rgba(0,0,0,0.34))"
                : "drop-shadow(-8px 22px 34px rgba(0,0,0,0.22))",
              transition: "transform 0.45s var(--ease-in-out), filter 0.45s var(--ease-in-out)",
            }} />
        </div>

        {/* Center — copy */}
        <h2 style={{
          margin: 0, fontSize: 40, fontWeight: 600, lineHeight: 1.18,
          color: "var(--fg-default)", textWrap: "pretty",
        }}>The Next Chapter Starts Here</h2>

        {/* Right — CTA (no onClick: shared Button defaults to opening the assessment) */}
        <WLFinalCTAButton label="Discover Your Weight Loss Path"></WLFinalCTAButton>
      </WLReveal>
    </section>
  );
}

Object.assign(window, { WLFinalCTASection });
