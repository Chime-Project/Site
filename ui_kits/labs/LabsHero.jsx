// Chime Health — Labs UI kit: full-bleed video hero (ChimeLabsHero)
// A standalone health-labs landing hero: ambient footage under a dark-indigo
// scrim, with an emotive second-person headline, program blurb, and a pill CTA
// that opens the assessment/quiz modal. Everything is token-driven and
// inline-styled so it drops into the design system with no external CSS.
// Themeable accent: the enclosing data-theme (e.g. "lab") drives --accent-*
// and --glass-rgb, so the base ground + scrim + hover fill all follow the hue.

const LABS_HERO_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

// Scoped keyframes for the on-load entrance — kept inside the component so the
// hero stays a self-contained drop-in (no reliance on page-level CSS).
const LABS_HERO_KEYFRAMES =
  "@keyframes chimeLabsHeroIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }";

function openChimeAssessmentModal() {
  // Working path: the modal exposes window.openChimeAssessment().
  if (typeof window.openChimeAssessment === "function") {
    window.openChimeAssessment();
  }
  // Also emit a custom event so any future listener can hook the same intent.
  window.dispatchEvent(new CustomEvent("chime:open-assessment"));
}

function ChimeLabsHeroButton({ label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); openChimeAssessmentModal(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden",
        background: "var(--color-white)",
        color: hover ? "var(--color-white)" : "var(--glass-solid)",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-5) var(--spacing-10)",
        fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-bold)",
        lineHeight: 1, textDecoration: "none", whiteSpace: "nowrap",
        boxShadow: hover ? "var(--shadow-xl)" : "var(--shadow-md)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition:
          "box-shadow var(--transition-base) var(--ease-in-out), " +
          "transform var(--transition-base) var(--ease-in-out), " +
          "color 0.35s var(--ease-in-out)",
      }}>
      {/* Inset accent layer wipes in from the left on hover. */}
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "var(--accent-strong)",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}

function ChimeLabsHero() {
  return (
    <section id="labs-hero" data-screen-label="Labs Hero" data-theme="lab" style={{
      position: "relative", overflow: "clip",
      minHeight: "92vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--glass-solid)", // deep indigo/navy fallback under the video
      fontFamily: "var(--font-family-base)",
    }}>
      <style>{LABS_HERO_KEYFRAMES}</style>

      {/* Full-bleed ambient footage, defensively muted via ref so autoplay isn't blocked. */}
      <video
        src={LABS_HERO_UPLOADS + "/hf_20260716_174227_ee70e8d7-cabd-41af-af45-725212a5db75.mp4"}
        autoPlay muted loop playsInline
        ref={function (el) { if (el) { el.muted = true; el.defaultMuted = true; el.volume = 0; } }}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          display: "block", pointerEvents: "none",
        }}></video>

      {/* Dark-indigo vertical scrim: ~68% top → ~50% mid → ~75% bottom for legibility
          at any point in the loop. Built from --glass-rgb so it follows the theme. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "linear-gradient(180deg, " +
          "rgb(var(--glass-rgb) / 0.68) 0%, " +
          "rgb(var(--glass-rgb) / 0.50) 50%, " +
          "rgb(var(--glass-rgb) / 0.75) 100%)",
      }}></div>

      {/* Foreground content — centered column, above the scrim, entrance on load. */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 860, width: "100%",
        margin: "0 auto",
        padding: "var(--spacing-20) var(--spacing-6)",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "var(--spacing-6)", textAlign: "center",
        animation: "chimeLabsHeroIn 0.9s var(--ease-out, cubic-bezier(0.2,0,0,1)) both",
      }}>
        <h1 style={{
          margin: 0, maxWidth: "16em",
          fontSize: "clamp(var(--text-5xl), 5.5vw, 56px)", fontWeight: 300,
          lineHeight: 1.12, color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 2px 22px rgb(var(--glass-rgb) / 0.55)",
        }}>Your Body Has Been Whispering.<br />It’s Time To Listen.</h1>

        <p style={{
          margin: 0, maxWidth: "34em",
          fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-normal)",
          lineHeight: 1.55, color: "rgba(255,255,255,0.92)", textWrap: "pretty",
          textShadow: "0 1px 14px rgb(var(--glass-rgb) / 0.4)",
        }}>Chime Labs reads hundreds of biomarkers to surface what’s happening beneath
        the surface — across your energy, metabolism, recovery, and long-term health —
        and turns those signals into a path you can actually follow.</p>

        <ChimeLabsHeroButton label="Discover Your Health Path" />
      </div>
    </section>
  );
}

Object.assign(window, { ChimeLabsHero });
