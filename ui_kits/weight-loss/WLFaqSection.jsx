// Chime Health — Weight Loss landing: "Frequently Asked Questions"
// A card holding an expand/collapse accordion, themed to the weight-loss palette
// (data-theme="weight-loss", Tide blue). Mirrors the wellness FAQ (WNFaqSection.jsx):
// plain React state + the grid-template-rows 0fr→1fr trick for a smooth,
// content-height-agnostic reveal.

// FAQ as a self-contained card — the heading lives INSIDE the card, above the
// accordion. `maxWidth` lets a host match it to a neighbouring card's width.
function WLFaqCard({ maxWidth }) {
  return <FaqAccordion items={window.CHIME_FAQS["weight-loss"]} maxWidth={maxWidth} />;
}

// Standalone section wrapper (light background, tide theme).
function WLFaqSection() {
  return (
    <section data-theme="weight-loss" data-screen-label="FAQ" style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
    }}>
      <div className="reveal" style={{ padding: "var(--spacing-16) var(--spacing-6)" }}>
        <WLFaqCard />
      </div>
    </section>
  );
}

Object.assign(window, { WLFaqSection, WLFaqCard });
