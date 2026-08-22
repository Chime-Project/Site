// Chime Health — Executive landings · shared primitives.
//
// The pieces every Persona 1 landing renders the same way: the assessment
// opener, the numbered kicker, the spinning "provider reviewed" badge, the
// pill CTA, the fixed pill chrome and the footer. They were written for
// executive-weight-loss.html (ExecutiveWLPage.jsx) and moved here verbatim when
// the second landing (executive-labs.html) needed them — the WL page renders
// byte-for-byte what it did before the move. Load this BEFORE a page kit.
//
// Palette lives in each page's <style> as --exec-* vars, so this file stays
// free of palette primitives (theme guard). Motion hooks (`exec-cta`,
// `exec-kicker-rule`, `exec-badge`) are read by ui_kits/executive/ExecutiveMotion.js.

// The one correct way to open the assessment (see CLAUDE.md §5). The href is a
// real URL so middle-click and new-tab work; the handler keeps a same-page
// click from reloading.
function execOpenAssessment(e) {
  if (window.openChimeAssessment) {
    e.preventDefault();
    window.openChimeAssessment();
  }
}

// The hairline is a 1px block rather than a border-bottom so the motion layer
// can draw it (scaleX 0 → 1). Same height, same colour, same position.
function ExecKicker({ label, num, color, border }) {
  return (
    <div className="exec-kicker">
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        paddingBottom: "var(--spacing-3)",
        color, fontSize: "var(--text-sm)", letterSpacing: "0.08em",
        textTransform: "uppercase", fontWeight: "var(--font-weight-semibold)",
      }}>
        <span>{label}</span><span>{num}</span>
      </div>
      <i className="exec-kicker-rule" aria-hidden="true" style={{
        display: "block", height: 1, background: border, transformOrigin: "0 50%",
      }} />
    </div>
  );
}

function ExecSpinBadge() {
  return (
    <svg className="exec-spin exec-badge" width="150" height="150" viewBox="0 0 150 150"
      aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
      <defs>
        <path id="exec-badge-circle" fill="none"
          d="M75,75 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
      </defs>
      {/* textLength pins one full phrase to the arc's circumference (2π·56 ≈
          352) so the loop closes cleanly instead of overrunning and drawing a
          second lap over the first. The phrase was cut from 40 characters to 27
          to fit at this size — at 40 it wrapped over itself. */}
      <text style={{
        fill: "var(--exec-ink-dark)", fontFamily: "var(--font-family-base)",
        fontWeight: 700, fontSize: 13, letterSpacing: "0.2em",
      }}>
        <textPath href="#exec-badge-circle" textLength="350" lengthAdjust="spacingAndGlyphs">CHIME · PROVIDER REVIEWED ·</textPath>
      </text>
    </svg>
  );
}

function ExecCta({ label, style, className }) {
  return (
    <a href="chimeAssessment.html" onClick={execOpenAssessment}
      className={"exec-cta" + (className ? " " + className : "")} style={{
      display: "inline-block", background: "var(--primary-default)",
      color: "var(--text-on-primary)", textDecoration: "none",
      borderRadius: "var(--radius-4xl)", padding: "16px 30px",
      fontWeight: "var(--font-weight-bold)", fontSize: "var(--text-lg)",
      letterSpacing: "0.01em", ...style,
    }}>{label}</a>
  );
}

function ExecChrome() {
  return (
    <header data-screen-label="Exec Chrome" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "var(--spacing-4) var(--spacing-6)", pointerEvents: "none",
      fontFamily: "var(--font-family-base)",
    }}>
      <a href="index.html" aria-label="Chime Health home" className="exec-chrome-logo" style={{
        pointerEvents: "auto", display: "inline-flex", alignItems: "center",
        background: "var(--bg-elevated)", borderRadius: "var(--radius-4xl)",
        padding: "10px 18px", boxShadow: "0 1px 4px rgb(0 0 0 / 0.12)",
      }}>
        <img src="assets/logo-main.svg" alt="Chime" style={{ height: 18, display: "block" }} />
      </a>
      <a href="chimeAssessment.html" onClick={execOpenAssessment} className="exec-chrome-cta exec-cta" style={{
        pointerEvents: "auto", background: "var(--primary-default)",
        color: "var(--text-on-primary)", borderRadius: "var(--radius-4xl)",
        border: "1px solid rgb(255 255 255 / 0.4)",
        padding: "12px 22px", textDecoration: "none", letterSpacing: "0.02em",
        fontWeight: "var(--font-weight-semibold)", fontSize: "var(--text-sm)",
      }}>
        {/* Two labels, CSS picks one: the long one wrapped to two lines under
            400px and sat over the headline's first line. */}
        <span className="exec-chrome-cta-long">Discover Your Path</span>
        <span className="exec-chrome-cta-short">Get Started</span>
      </a>
    </header>
  );
}

// `ground` lets a page that does not pin --accent-default (the labs landing
// keeps the theme's iris-500 for its embedded modules) hand the footer its own
// ground; the default is exactly what the WL page always rendered.
function ExecFooter({ ground = "var(--accent-default)" } = {}) {
  // inline-block + vertical padding: the bare 18px-tall text links were the
  // smallest tap targets on the page; this lifts them to 44px without moving
  // the baseline.
  const footLink = {
    color: "var(--exec-ink-dark)", textDecoration: "none",
    display: "inline-block", padding: "var(--spacing-3) 0",
  };
  return (
    <footer data-screen-label="Exec Footer" style={{
      background: ground, fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-16) 0", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--spacing-6)" }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "var(--spacing-6)",
          justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid var(--exec-hairline-dark)",
          paddingBottom: "var(--spacing-4)", color: "var(--exec-ink-dark)",
          fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
        }}>
          <span>© 2026 Chime Health</span>
          <nav style={{ display: "flex", gap: "var(--spacing-6)", flexWrap: "wrap" }}>
            <a href="faq.html" style={footLink}>FAQ</a>
            <a href="privacy-policy.html" style={footLink}>Privacy Policy</a>
            <a href="terms-conditions.html" style={footLink}>Terms &amp; Conditions</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  execOpenAssessment, ExecKicker, ExecSpinBadge, ExecCta, ExecChrome, ExecFooter,
});
