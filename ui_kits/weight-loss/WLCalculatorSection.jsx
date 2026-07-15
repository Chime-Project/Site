// Chime Health — Weight Loss landing: standalone calculator section
// Reuses WLCalculatorCard from ui_kits/homepage/WeightLossSection.jsx on a tide band.

function WLCalculatorSection() {
  return (
    <section data-screen-label="Calculator" data-theme="weight-loss" style={{
      background: "#5E93D1",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-12) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1104, margin: "0 auto" }}>
        <WLReveal>
          <WLCalculatorCard />
        </WLReveal>
      </div>
    </section>
  );
}

Object.assign(window, { WLCalculatorSection });
