// Chime Health — Health, Energy & Wellness landing: "Frequently Asked Questions"
// A card holding an expand/collapse accordion, themed to the wellness palette
// (data-theme="energy-wellness", Soft Cadmium gold). Plain React state + the
// grid-template-rows 0fr→1fr trick for a smooth, content-height-agnostic reveal.

// FAQ as a self-contained card — the heading lives INSIDE the card, above the
// accordion. `maxWidth` lets a host match it to a neighbouring card's width.
function WNFaqCard({ maxWidth }) {
  return <FaqAccordion items={window.CHIME_FAQS.wellness} maxWidth={maxWidth} />;
}

// Standalone section wrapper (kept for reuse on a light background).
function WNFaqSection() {
  return (
    <section data-theme="energy-wellness" data-screen-label="FAQ" style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
    }}>
      <div className="reveal" style={{ padding: "var(--spacing-16) var(--spacing-6)" }}>
        <WNFaqCard />
      </div>
    </section>
  );
}

Object.assign(window, { WNFaqSection, WNFaqCard });
