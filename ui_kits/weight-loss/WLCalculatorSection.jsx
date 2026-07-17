// Chime Health — Weight Loss landing: standalone calculator section
// Renders the shared WLCalculatorCard (ui_kits/shared/WLCalculator.jsx) on an accent band.
// `theme` selects the accent palette; the band and the card both follow it.

function WLCalculatorSection({ theme = "weight-loss" }) {
  return (
    <section data-screen-label="Calculator" data-theme={theme} style={{
      background: "var(--accent-default)",
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
