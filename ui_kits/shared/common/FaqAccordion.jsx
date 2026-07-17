// Chime Health — shared FAQ accordion. One implementation for every page's FAQ.
// Theme-agnostic: chevron/heading/rule bind to --accent-* + neutrals, so it follows the
// section's data-theme (tide / cadmium). Data comes from window.CHIME_FAQS
// (load ui_kits/shared/data/faqs.js first). Uses the grid-rows 0fr→1fr reveal trick.

function FaqItem({ item, open, onToggle, last }) {
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
          background: open ? "var(--accent-default)" : "var(--accent-subtle)",
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

// Self-contained card: heading inside, above the accordion. `maxWidth` lets a host
// match it to a neighbouring card. First item open by default.
function FaqAccordion({ items, maxWidth, title }) {
  const list = items || [];
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <div style={{ maxWidth: maxWidth || 880, margin: "0 auto" }}>
      <div className="faq-card" style={{
        background: "var(--color-white)", border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-md)",
        padding: "var(--spacing-8) var(--spacing-8) var(--spacing-4)",
      }}>
        <h2 style={{
          margin: "0 0 var(--spacing-6)", textAlign: "center",
          fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.15,
          color: "var(--fg-default)", textWrap: "balance",
        }}>{title || "Frequently Asked Questions"}</h2>

        {list.map(function (item, i) {
          return (
            <FaqItem key={item.q} item={item} last={i === list.length - 1}
              open={openIdx === i}
              onToggle={function () { setOpenIdx(openIdx === i ? -1 : i); }} />
          );
        })}
      </div>
    </div>
  );
}

// Standalone FAQ section — the one implementation every page uses, so the card
// stays the same width across pages. Theme-aware via `theme` (tide / cadmium /
// iris), mirroring ChimeGuideSection. The container matches GuideSection and
// SimplePathSection, so the card's edges line up with the neighbouring sections.
// The ≤960px gutter lives in styles.css as `.faq-section`.
function ChimeFaqSection({ theme = "default", items, title }) {
  return (
    <section data-screen-label="FAQ" data-theme={theme} style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
    }}>
      <div className="reveal faq-section" style={{
        padding: "var(--spacing-16) var(--spacing-8)",
        maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
      }}>
        <FaqAccordion items={items} title={title} maxWidth="100%" />
      </div>
    </section>
  );
}

Object.assign(window, { FaqAccordion, FaqItem, ChimeFaqSection });
