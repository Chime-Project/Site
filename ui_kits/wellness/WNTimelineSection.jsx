// Chime Health — Health, Energy & Wellness landing: "Your timeline to treatment"
// Recreation of the Weight Loss timeline band (ui_kits/weight-loss/WLTimelineSection.jsx),
// re-themed to the wellness palette (data-theme="energy-wellness", Soft Cadmium gold).
// Full-bleed media band gluing into the solid gold ground, with an overlapping white
// panel: title/copy left · dark-gold product card (Rx carousel) right.
//
// Self-contained: ports the Rx carousel + reveal + button locally so the wellness page
// doesn't need to load any weight-loss files.

const WNT_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WNT_SOLID = "#D7AA52"; // Soft Cadmium (Accent) — main section ground

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function WNTReveal(props) {
  return <Reveal {...props} />;
}

// Rx carousel arrow.
// 2-product Rx carousel — same shape the homepage Health, Energy & Wellness section uses,
// on a dark-gold card so it reads on the white panel.
function WNTButton({ label, primary }) {
  return <Button label={label} tone="onLight" variant={primary ? "primary" : "secondary"} size="compact" />;
}

// Gold checkmark bullet for the membership benefits list.
function WNTCheckItem({ label }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", padding: "var(--spacing-2) 0" }}>
      <span aria-hidden="true" style={{
        flex: "none", width: 24, height: 24, borderRadius: "var(--radius-4xl)",
        background: "var(--accent-default)", color: "var(--color-white)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5 11-12" /></svg>
      </span>
      <span style={{ fontSize: "var(--text-base)", color: "var(--fg-default)", fontWeight: "var(--font-weight-medium)" }}>{label}</span>
    </li>
  );
}

const WNT_BENEFITS = [
  "Wellness Coach Support",
  "Personalized Wellness Guidance",
  "Educational Resources",
  "Progress Tracking",
  "Ongoing Support",
];

function WNTimelineSection() {
  return (
    <section data-screen-label="Timeline to treatment" data-theme="energy-wellness" style={{
      position: "relative", fontFamily: "var(--font-family-base)", background: WNT_SOLID, overflow: "hidden",
    }}>
      {/* Video band at the top — same clip as the homepage Health, Energy &
          Wellness section, played at half speed. Sits at its natural height and
          fades into the solid gold ground via a gradient mask (no overlay div). */}
      <video src={WNT_UPLOADS + "/hf_20260713_173242_23f715b1-50ef-45c4-addf-d7f2be7692c0.mp4"}
        autoPlay muted loop playsInline aria-hidden="true"
        ref={function (el) { if (el) el.playbackRate = 0.5; }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          width: "100%", height: "auto", display: "block",
          filter: "brightness(0.82)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 55%, transparent 92%)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 55%, transparent 92%)",
        }}></video>

      {/* Title over the video band */}
      <div style={{
        position: "relative", zIndex: 1, maxWidth: 1152, margin: "0 auto",
        minHeight: 380, padding: "var(--spacing-20) var(--spacing-6) var(--spacing-16)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <WNTReveal>
        <h2 style={{
          margin: 0, textAlign: "center", maxWidth: "14em",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
          color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 1px 18px rgba(56,42,10,0.45)",
        }}>Your Wellness Journey Doesn’t End After Day One</h2>
        </WNTReveal>
      </div>

      {/* Panel */}
      <div style={{ position: "relative", maxWidth: 1152, margin: "0 auto", padding: "0 var(--spacing-6) var(--spacing-12)" }}>
        <WNTReveal>
        <div className="wnt-panel" style={{
          background: "rgba(255,255,255,0.85)", borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-md)",
          padding: "var(--spacing-16) var(--spacing-12)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-10)",
          alignItems: "center",
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300,
              lineHeight: 1.15, color: "var(--fg-default)", textWrap: "pretty",
            }}>Imagine Showing Up As Your Best Self</h2>
            <p style={{
              margin: "var(--spacing-6) 0 0", fontSize: "var(--text-lg)",
              lineHeight: 1.5, color: "var(--fg-muted)", maxWidth: "24em",
            }}>The goal of Chime Membership is to help you continue moving forward with confidence and support. Because feeling your best its built over time.</p>

            <p style={{
              margin: "var(--spacing-8) 0 0", fontSize: "var(--text-xl)",
              fontWeight: "var(--font-weight-semibold)", lineHeight: 1.3, color: "var(--fg-default)",
            }}>You’re Not Doing This Alone™</p>

            <ul style={{ listStyle: "none", margin: "var(--spacing-5) 0 0", padding: 0 }}>
              {WNT_BENEFITS.map(function (label) {
                return <WNTCheckItem key={label} label={label} />;
              })}
            </ul>

            <div style={{ marginTop: "var(--spacing-8)" }}>
              <WNTButton primary label="Explore The Chime Membership" />
            </div>
          </div>

          {/* Product content — Rx carousel on a dark-gold card so it reads on the white panel. */}
          <div style={{
            maxWidth: 420, margin: "0 auto", width: "100%", boxSizing: "border-box",
            background: "var(--color-cadmium-100)", border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-3xl)", padding: "var(--spacing-5)", minHeight: 420,
            display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
          }}>
            <RxCarousel variant="light" Button={WNTButton} uploads={WNT_UPLOADS} />
          </div>
        </div>
        </WNTReveal>
      </div>

      {/* FAQ card — sits on the gold ground below the membership panel,
          matched to the panel's width */}
      <div className="reveal" style={{
        position: "relative", maxWidth: 1152, margin: "0 auto",
        padding: "0 var(--spacing-6) calc(var(--spacing-16) + var(--spacing-6))",
      }}>
        <WNFaqCard maxWidth="100%" />
      </div>
    </section>
  );
}

Object.assign(window, { WNTimelineSection, WNTButton });
