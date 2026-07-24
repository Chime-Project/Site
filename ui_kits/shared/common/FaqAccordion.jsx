// Chime Health — shared FAQ accordion. One implementation for every page's FAQ.
// Theme-agnostic: chevron/heading/rule bind to --accent-* + neutrals, so it follows the
// section's data-theme (tide / cadmium). Data comes from window.CHIME_FAQS
// (load ui_kits/shared/data/faqs.js first). Uses the grid-rows 0fr→1fr reveal trick.
// Answers are block-structured (see faqs.js): a string is one paragraph, an array
// mixes paragraphs and { list: [...] } bullets; item.cta renders an assessment link.
// <ChimeFaqBrowser /> (faq.html) renders every CHIME_FAQ_SECTIONS category.

// One answer block: string → paragraph, { list } → bullets.
function FaqBlock({ block }) {
  const textStyle = { fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--fg-muted)", maxWidth: "60ch" };
  if (block && block.list) {
    return (
      <ul style={{ ...textStyle, margin: 0, paddingLeft: "1.4em", display: "grid", rowGap: "var(--spacing-1)" }}>
        {block.list.map(function (li) { return <li key={li}>{li}</li>; })}
      </ul>
    );
  }
  return <p style={{ ...textStyle, margin: 0 }}>{block}</p>;
}

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
          <div style={{
            padding: "0 var(--spacing-1) var(--spacing-5)",
            display: "grid", rowGap: "var(--spacing-3)", justifyItems: "start",
          }}>
            {(Array.isArray(item.a) ? item.a : [item.a]).map(function (block, bi) {
              return <FaqBlock key={bi} block={block} />;
            })}
            {item.cta ? (
              <a href="assessment.html"
                onClick={(e) => { if (window.openChimeAssessment) { e.preventDefault(); window.openChimeAssessment(); } }}
                style={{
                  fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
                  color: "var(--accent-strong)", textDecoration: "underline", textUnderlineOffset: 3,
                }}>{item.cta} →</a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Self-contained card: heading inside, above the accordion. `maxWidth` lets a host
// match it to a neighbouring card. First item open by default; pass
// defaultOpen={-1} to start fully collapsed (the full-FAQ browser does).
function FaqAccordion({ items, maxWidth, title, defaultOpen = 0 }) {
  const list = items || [];
  const [openIdx, setOpenIdx] = React.useState(defaultOpen);
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

// Full FAQ browser (faq.html): page title, category jump pills, one accordion
// card per CHIME_FAQ_SECTIONS category, and the closing band. Everything is
// data-driven from ui_kits/shared/data/faqs.js — edit content there, not here.
function ChimeFaqBrowser({ theme = "default" }) {
  const sections = window.CHIME_FAQ_SECTIONS || [];
  const closing = window.CHIME_FAQ_CLOSING;
  const Btn = window.Button;
  return (
    <section data-screen-label="FAQ Browser" data-theme={theme} style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
    }}>
      <div className="faq-section" style={{
        padding: "var(--spacing-16) var(--spacing-8)",
        maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
      }}>
        <h1 style={{
          margin: "0 0 var(--spacing-4)", textAlign: "center",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
          color: "var(--fg-default)", textWrap: "balance",
        }}>Frequently Asked Questions</h1>

        {/* Category jump pills — anchors to each section card below. */}
        <nav aria-label="FAQ categories" style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "var(--spacing-2)", maxWidth: 880, margin: "0 auto var(--spacing-6)",
        }}>
          {sections.map(function (s) {
            return (
              <a key={s.id} href={"#faq-" + s.id} style={{
                fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
                color: "var(--accent-strong)", background: "var(--accent-subtle)",
                textDecoration: "none", borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-2) var(--spacing-4)",
              }}>{s.title}</a>
            );
          })}
        </nav>

        {sections.map(function (s) {
          return (
            <div key={s.id} id={"faq-" + s.id} style={{ marginTop: "var(--spacing-8)", scrollMarginTop: 96 }}>
              <FaqAccordion items={s.items} title={s.title} defaultOpen={-1} />
            </div>
          );
        })}

        {closing ? (
          <div style={{ maxWidth: 880, margin: "var(--spacing-12) auto 0", textAlign: "center" }}>
            <h2 style={{
              margin: "0 0 var(--spacing-4)",
              fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.15,
              color: "var(--fg-default)", textWrap: "balance",
            }}>{closing.title}</h2>
            <p style={{
              margin: "0 auto var(--spacing-6)", maxWidth: "56ch",
              fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--fg-muted)",
            }}>{closing.body}</p>
            {Btn ? <Btn label={closing.cta} /> : (
              <a href="assessment.html"
                onClick={(e) => { if (window.openChimeAssessment) { e.preventDefault(); window.openChimeAssessment(); } }}
                style={{
                  fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
                  color: "var(--accent-strong)", textDecoration: "underline", textUnderlineOffset: 3,
                }}>{closing.cta} →</a>
            )}
            <p style={{
              margin: "var(--spacing-6) 0 0", fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-medium)", color: "var(--fg-muted)",
            }}>{closing.tagline}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

Object.assign(window, { FaqAccordion, FaqItem, ChimeFaqSection, ChimeFaqBrowser });
