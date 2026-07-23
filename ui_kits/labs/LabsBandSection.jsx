// Chime Health — Labs UI kit: Labs band (ChimeLabsBandSection)
// The labs page's iris-themed band: bg scenario at top glued into solid iris;
// title → hero visual → CTA → tier cards.

const LABS_BAND_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const LABS_BAND_SOLID = "#F7F3E4"; // Cream (--color-sand-100) — main section ground
const LABS_BAND_SOLID_RGB = "247,243,228"; // ^ as rgb() channels, for the glue gradient
const LABS_BAND_INK = "#2A283A"; // dark neutral ink for text on light surfaces

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function LabsBandReveal(props) {
  return <Reveal {...props} />;
}

function ChimeLabsBandSection() {
  return (
    <section id="labs-section" data-screen-label="Labs" data-theme="lab" style={{
      position: "relative", overflow: "clip",
      background: LABS_BAND_SOLID,
      fontFamily: "var(--font-family-base)",
    }}>
      {/* Background video treatment, glued to the solid color with a gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 860, pointerEvents: "none" }}>
        <video src={LABS_BAND_UPLOADS + "/_030742_54710cbd-10dc-4c82-9c8a-51ddf76d2616.mp4"} autoPlay muted loop playsInline
          ref={function (el) { if (el) { el.muted = true; el.defaultMuted = true; el.volume = 0; } }}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}></video>
        {/* Dark-indigo scrim for title legibility, same vocabulary as LabsHero's
            (--glass-rgb). Sits UNDER the glue gradient below so that gradient
            still lands on LABS_BAND_SOLID at the bottom; fades out by 62% so it
            never touches the glue or the cards. The glue cannot darken anything
            itself — it is the ground colour.
            Runs stronger than the hero's 0.68/0.50 because the cream glue lightens
            this zone far more than the old iris one did: at 0.68 the white title
            measured 3.16:1 over the footage, at 0.82 it measures 4.11:1. Re-measure
            if LABS_BAND_SOLID or the video changes. */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, " +
            "rgb(var(--glass-rgb) / 0.82) 0%, " +
            "rgb(var(--glass-rgb) / 0.70) 30%, " +
            "rgb(var(--glass-rgb) / 0) 62%)",
        }}></div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, " +
            "rgba(" + LABS_BAND_SOLID_RGB + ",0.42) 0%, " +
            "rgba(" + LABS_BAND_SOLID_RGB + ",0.12) 26%, " +
            "rgba(" + LABS_BAND_SOLID_RGB + ",0.12) 55%, " +
            "rgba(" + LABS_BAND_SOLID_RGB + ",0.6) 78%, " +
            LABS_BAND_SOLID + " 96%)",
        }}></div>
      </div>

      {/* ---- Top: title over the video, subtitle + CTAs at the bottom of the products ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "var(--spacing-20) var(--spacing-8) 0",
        minHeight: 700,
        // No copy in this band (the hero already carries the headline) — just the
        // video visual with the CTA resting at its base, per the 2026-07 copy doc.
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
      }}>
        {/* CTA at the bottom of the products shown in the video */}
        <LabsBandReveal delay={120} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-5)", paddingBottom: "var(--spacing-10)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LabsBandButton hero label="Discover Your Health Path" />
        </div>
        </LabsBandReveal>
      </div>

      {/* ---- Cards ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "0 var(--spacing-8) var(--spacing-20)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      }}>
        {/* Health Insights tiers */}
        <LabsBandReveal>
        <div className="labs-tiers" style={{
          // Light glass panel — the tier cards inside stay dark glass and read
          // as raised against it. Panel-level text uses LABS_BAND_INK.
          background: "rgba(255, 255, 255, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: "var(--radius-3xl)",
          padding: "var(--spacing-12) var(--spacing-10)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-8)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)" }}>
            <h3 style={{
              margin: 0, textAlign: "center", maxWidth: "18em",
              fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.12,
              color: LABS_BAND_INK, textWrap: "balance",
            }}>Discover A Deeper Understanding Of Your Health</h3>
            <p style={{
              margin: 0, textAlign: "center", maxWidth: "42em",
              fontSize: "var(--text-base)", lineHeight: 1.55,
              color: "rgba(42,40,58,0.78)", textWrap: "pretty",
            }}>Whether you are beginning your wellness journey or seeking the most comprehensive picture possible, Chime offers multiple levels of health insights designed to help guide your path.</p>
          </div>
          {/* auto-fit: 3 across at container width, wrapping on its own below. */}
          <div className="labs-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-6)", width: "100%" }}>
            <LabsBandTierCard name="Comprehensive Health Insights" tier="Comprehensive" markers="80+" price="$495"
              image={LABS_BAND_UPLOADS + "/comprehensive.jpeg"} />
            <LabsBandTierCard name="Complete Health Insights" tier="Complete" markers="100+" price="$895" upgraded
              image={LABS_BAND_UPLOADS + "/comprehensive.jpeg"} />
            <LabsBandTierCard name="Executive Health Insights" tier="Executive" markers="130+" price="$1,950" upgraded
              image={LABS_BAND_UPLOADS + "/executive_.jpeg"} />
          </div>
          <p style={{
            margin: 0, textAlign: "center",
            fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)",
            color: "rgba(42,40,58,0.8)",
          }}>Hundreds Of Data Points. One Personalized Path.</p>
        </div>
        </LabsBandReveal>

        <LabsBandReveal delay={100}>
        <p style={{
          margin: "var(--spacing-2) auto 0", maxWidth: "52em", textAlign: "center",
          // Sits directly on the cream ground, not on the panel — hence ink, not white.
          fontSize: "var(--text-xs)", lineHeight: 1.6, color: "rgba(42,40,58,0.78)",
        }}>Not available in all 50 states. Lab tests are ordered and reviewed by licensed providers. Results are informational and not a diagnosis. <a href="#" style={{ color: "var(--accent-strong)" }}>Read more</a></p>
        </LabsBandReveal>
      </div>
    </section>
  );
}

// `tier` is the PDP tier key (LABS_TIERS in LabsProductDetailSection.jsx); the
// Select CTA preselects it there via window.chimeSelectLabsTier.
// `image` overrides the shared test_vials.webp cutout with a tier-specific
// product photo (square photos get a radius so their background reads as a card).
function LabsBandTierCard({ name, tier, markers, price, upgraded, image }) {
  const [hover, setHover] = React.useState(false);
  const [ctaHover, setCtaHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
      // Wellness-card treatment (see HWSymptomsSection): white surface, accent
      // hairline, shadow-md. Tokens are theme-scoped, so `lab` resolves iris.
      position: "relative", background: "var(--color-white)",
      border: "1px solid var(--accent-border)", borderRadius: "var(--radius-xl)",
      padding: "var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      transform: hover ? "translateY(-4px)" : "none",
      boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-md)",
      transition: "transform var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
    }}>
      {/* Biomarkers badge */}
      <div style={{
        // zIndex needed: the vial's drop-shadow filter gives it a stacking context,
        // so it paints in the same step as this badge and wins on tree order. They
        // overlap once the card narrows (badge 115–244 vs vial 71–191 at 390px).
        position: "absolute", zIndex: 1,
        top: "var(--spacing-4)", right: "var(--spacing-4)",
        // Solid ink, not 0.55 glass: the card is white now, so translucent glass
        // composited to a pale mauve and dropped the label to 3.45:1. Matches
        // the PDP badge.
        background: "var(--glass-solid)", border: "1px solid var(--glass-border)",
        color: "var(--color-white)",
        borderRadius: "var(--radius-lg)", padding: "var(--spacing-2) var(--spacing-3)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-1)",
      }}>
        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 300, lineHeight: 1 }}>{markers}</div>
        <div style={{ fontSize: "var(--text-xs)", opacity: 0.85 }}>Biomarkers</div>
        {upgraded ? (
          <div style={{
            background: "var(--color-iris-700)", color: "var(--color-white)",
            borderRadius: "var(--radius-4xl)", padding: "2px 10px", fontSize: 11,
          }}>Upgraded Panel</div>
        ) : null}
      </div>
      <img src={image || LABS_BAND_UPLOADS + "/test_vials.webp"} alt={name + " sample vials"}
        style={{
          width: 120, height: "auto", display: "block", margin: "var(--spacing-12) auto 0",
          borderRadius: image ? "var(--radius-lg)" : 0,
          transform: hover ? "scale(1.12) rotate(-3deg) translateY(-6px)" : "none",
          filter: hover ? "drop-shadow(0 24px 42px rgb(var(--glass-rgb) / 0.6))" : "drop-shadow(0 16px 32px rgb(var(--glass-rgb) / 0.4))",
          transition: "transform var(--transition-base) var(--ease-in-out), filter var(--transition-base) var(--ease-in-out)",
        }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-medium)", color: "var(--text-default)", lineHeight: 1.25 }}>{name}</h4>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-2)" }}>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--fg-muted)" }}>From</span>
          <span style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>{price || "$—"}</span>
        </div>
      </div>
      <button type="button"
        onClick={() => { window.chimeSelectLabsTier && window.chimeSelectLabsTier(tier); }}
        onMouseEnter={() => setCtaHover(true)}
        onMouseLeave={() => setCtaHover(false)}
        style={{
          appearance: "none", cursor: "pointer", width: "100%",
          // marginTop auto: the grid stretches cards equal-height, this pins the
          // CTA to the bottom edge across all three.
          marginTop: "auto",
          background: ctaHover
            ? "color-mix(in srgb, var(--accent-active) 88%, black)"
            : "var(--accent-active)",
          color: "var(--text-on-primary)", border: "none",
          borderRadius: "var(--radius-4xl)",
          // text-sm + spacing-4 sides (not the PDP CTA's base/spacing-6): the
          // longest label must stay one line inside a 240px-min grid card.
          padding: "var(--spacing-4) var(--spacing-4)",
          fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-semibold)",
          boxShadow: ctaHover ? "var(--shadow-md)" : "var(--shadow-sm)",
          transition: "background var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
        }}>{"Select " + tier}</button>
    </div>
  );
}

function LabsBandButton({ label, primary, small, tiny, large, hero }) {
  const [hover, setHover] = React.useState(false);
  if (hero) {
    // Fixed spec: 52px-tall pill, content-hugging — no stretch.
    return (
      <a href="#"
        onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "fit-content", height: 52, padding: "0 28px", boxSizing: "border-box",
          background: "var(--color-white)", color: LABS_BAND_INK,
          borderRadius: 26, border: "1px solid transparent",
          fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
          lineHeight: 1, textDecoration: "none", whiteSpace: "nowrap",
          boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
          transform: hover ? "translateY(-3px) scale(1.04)" : "none",
          transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
        }}>{label}</a>
    );
  }
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden",
        background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
        color: primary
          ? (hover ? "var(--text-on-primary)" : LABS_BAND_INK)
          : "var(--color-white)",
        backdropFilter: primary ? "none" : "blur(8px)",
        border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
        borderRadius: "var(--radius-4xl)",
        padding: tiny ? "var(--spacing-1) var(--spacing-3)" : (small ? "var(--spacing-2) var(--spacing-5)" : (large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)")),
        fontSize: tiny ? "var(--text-sm)" : (large ? "var(--text-lg)" : "var(--text-base)"), fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none", whiteSpace: "nowrap",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
      <span style={{
        position: "absolute", inset: 0,
        background: "var(--accent-default)",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}

Object.assign(window, { ChimeLabsBandSection });
