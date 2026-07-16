// Chime Health — Health, Energy & Wellness landing: "Frequently Asked Questions"
// A card holding an expand/collapse accordion, themed to the wellness palette
// (data-theme="energy-wellness", Soft Cadmium gold). Plain React state + the
// grid-template-rows 0fr→1fr trick for a smooth, content-height-agnostic reveal.

const WN_FAQS = [
  {
    q: "How does the Chime Energy & Wellness program work?",
    a: "It starts with your goals. A wellness coach and licensed provider help you explore options — from coaching and health insights to wellness therapies — and build a personalized path designed around your needs.",
  },
  {
    q: "What is NAD+?",
    a: "NAD+ is a coenzyme found naturally in every cell that plays a role in energy production and cellular health. Some members explore it as part of a personalized wellness plan — your provider can help determine whether it may be a fit for you.",
  },
  {
    q: "What is LIPO-C?",
    a: "LIPO-C is a blend of compounds — often including B-vitamins and amino acids — that some people use to support metabolism and everyday energy. Whether it's appropriate for you is determined during your provider consultation.",
  },
  {
    q: "How do I know which option is right for me?",
    a: "You don't have to figure it out alone. After a short assessment, your wellness coach and provider review your goals and health background to recommend the options best suited to you.",
  },
  {
    q: "Will I speak with a provider?",
    a: "Yes. A licensed provider reviews your information and is involved in any recommendations or treatments, so your plan always has clinical oversight.",
  },
  {
    q: "Do I need lab testing first?",
    a: "Sometimes. Depending on your goals and the options you're exploring, your provider may recommend lab work so any plan can be tailored to you and reviewed for safety.",
  },
  {
    q: "How does wellness coaching work?",
    a: "Your coach is a consistent point of support — helping you set goals, stay accountable, and adjust your plan as your life changes, with regular check-ins along the way.",
  },
];

function WNFaqItem({ item, open, onToggle, last }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid var(--accent-border)" }}>
      <button type="button" onClick={onToggle} aria-expanded={open}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          width: "100%", cursor: "pointer", border: "none", background: "transparent",
          fontFamily: "inherit", textAlign: "left",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-4)",
          padding: "var(--spacing-5) var(--spacing-1)",
          color: open || hover ? "var(--accent-strong)" : "var(--fg-default)",
          transition: "color var(--transition-base) var(--ease-in-out)",
        }}>
        <span style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)", lineHeight: 1.35 }}>{item.q}</span>
        <span aria-hidden="true" style={{
          flex: "none", width: 28, height: 28, borderRadius: "var(--radius-4xl)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: open ? "var(--accent-default)" : "var(--color-cadmium-100)",
          color: open ? "var(--color-white)" : "var(--accent-strong)",
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </button>
      {/* grid-rows 0fr→1fr: animates to the answer's natural height */}
      <div style={{
        display: "grid", gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.32s var(--ease-in-out)",
      }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{
            margin: 0, padding: "0 var(--spacing-1) var(--spacing-5)",
            fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--fg-muted)", maxWidth: "60ch",
          }}>{item.a}</p>
        </div>
      </div>
    </div>
  );
}

// FAQ as a self-contained card — the heading lives INSIDE the card, above the
// accordion. `maxWidth` lets a host match it to a neighbouring card's width.
function WNFaqCard({ maxWidth }) {
  const [openIdx, setOpenIdx] = React.useState(0); // first item open by default
  return (
    <div style={{ maxWidth: maxWidth || 880, margin: "0 auto" }}>
      <div className="wn-faq-card" style={{
        background: "var(--color-white)", border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-md)",
        padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4)",
      }}>
        <h2 style={{
          margin: "0 0 var(--spacing-6)", textAlign: "center",
          fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.15,
          color: "var(--fg-default)", textWrap: "balance",
        }}>Frequently Asked Questions</h2>

        {WN_FAQS.map(function (item, i) {
          return (
            <WNFaqItem key={item.q} item={item} last={i === WN_FAQS.length - 1}
              open={openIdx === i}
              onToggle={function () { setOpenIdx(openIdx === i ? -1 : i); }} />
          );
        })}
      </div>
    </div>
  );
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
