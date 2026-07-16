// Chime Health — Labs landing: "Frequently Asked Questions"
// Thin wrapper around the shared FaqAccordion, themed to the Labs palette
// (data-theme="lab", iris). All behaviour/styling lives in the shared atom;
// this only supplies the content key and the section shell.
// Requires ui_kits/shared/data/faqs.js + ui_kits/shared/common/FaqAccordion.jsx.

// FAQ as a self-contained card — the heading lives INSIDE the card, above the
// accordion. `maxWidth` lets a host match it to a neighbouring card's width.
function LabsFaqCard({ maxWidth }) {
  return <FaqAccordion items={window.CHIME_FAQS.lab} maxWidth={maxWidth} />;
}

// Standalone section wrapper (light background).
function LabsFaqSection() {
  return (
    <section data-theme="lab" data-screen-label="FAQ" style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
    }}>
      <div className="reveal" style={{ padding: "var(--spacing-16) var(--spacing-6)" }}>
        <LabsFaqCard />
      </div>
    </section>
  );
}

Object.assign(window, { LabsFaqSection, LabsFaqCard });
