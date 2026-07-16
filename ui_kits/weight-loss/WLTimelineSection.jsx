// Chime Health — Weight Loss landing: "Your timeline to treatment"
// Layout ref: uploads/pasted-1784136878883-0.png — full-bleed media band with an
// overlapping panel: title left · product content right (from homepage WL product card).

const WLT_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

// Rx carousel arrow — ported from the Health, Energy & Wellness section (homepage).
function RxArrow({ dir, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" onClick={onClick} aria-label={dir < 0 ? "Previous product" : "Next product"}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        flex: "none", width: 32, height: 32, borderRadius: "var(--radius-4xl)", cursor: "pointer",
        border: "1px solid var(--accent-border)",
        background: h ? "var(--color-tide-300)" : "var(--color-tide-200)",
        color: "var(--accent-strong)", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "var(--text-lg)", lineHeight: 1, paddingBottom: 3,
        transition: "background var(--transition-base) var(--ease-in-out)",
      }}>{dir < 0 ? "‹" : "›"}</button>
  );
}

// Shared 2-product Rx carousel (Semaglutide + Tirzepatide) — same component the
// Health, Energy & Wellness section uses on the homepage, incl. the vial-solo.png image.
function ChimeRxCarousel({ Button, accentColor, uploads }) {
  const PRODUCTS = [
    { name: "Semaglutide", start: "$249.00", plans: [
      { term: "3 Months", price: "$596.00", promo: true },
      { term: "6 Months", price: "$1,050.00" },
      { term: "1 Year", price: "$1,800.00" },
    ] },
    { name: "Tirzepatide", start: "$359.00", plans: [
      { term: "3 Months", price: "$896.00", promo: true },
      { term: "6 Months", price: "$1,650.00" },
      { term: "1 Year", price: "$2,880.00" },
    ] },
  ];
  const [idx, setIdx] = React.useState(0);
  const [vhover, setVhover] = React.useState(false);
  const p = PRODUCTS[idx];
  const go = (d) => setIdx((idx + d + PRODUCTS.length) % PRODUCTS.length);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-2)" }}>
        <RxArrow dir={-1} onClick={() => go(-1)} />
        <div style={{ textAlign: "center", minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)", lineHeight: 1.2 }}>{p.name}</h3>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--fg-muted)", marginTop: 2 }}>
            Starting from <span style={{ color: "var(--text-default)", fontWeight: "var(--font-weight-semibold)" }}>{p.start}/mo</span>
          </div>
        </div>
        <RxArrow dir={1} onClick={() => go(1)} />
      </div>

      <div onMouseEnter={() => setVhover(true)} onMouseLeave={() => setVhover(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 116 }}>
        <img src={uploads + "/vial-solo.png"} alt={p.name + " vial"} style={{
          width: 92, height: "auto", display: "block",
          transform: vhover ? "scale(1.08) rotate(-3deg) translateY(-4px)" : "none",
          filter: vhover ? "drop-shadow(0 22px 34px rgba(0,0,0,0.5))" : "drop-shadow(0 14px 26px rgba(0,0,0,0.38))",
          transition: "transform var(--transition-base) var(--ease-in-out), filter var(--transition-base) var(--ease-in-out)",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        {p.plans.map((pl) => (
          <div key={pl.term} style={{
            display: "flex", flexDirection: "column", gap: 3,
            background: pl.promo ? "var(--color-tide-200)" : "var(--color-white)",
            border: "1px solid " + (pl.promo ? "var(--accent-default)" : "var(--accent-border)"),
            borderRadius: "var(--radius-lg)", padding: "var(--spacing-2) var(--spacing-3)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--spacing-2)" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-default)" }}>{pl.term}</span>
              <span style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>{pl.price}</span>
            </div>
            {pl.promo ? (
              <span style={{ fontSize: 11, fontWeight: "var(--font-weight-semibold)", color: accentColor }}>{"★ Includes 4th month for free"}</span>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
        <Button primary small label="Get started" />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
        {PRODUCTS.map((_, i) => (
          <button key={i} type="button" aria-label={"Show " + PRODUCTS[i].name} onClick={() => setIdx(i)} style={{
            width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: "none", padding: 0, cursor: "pointer",
            background: i === idx ? "var(--accent-default)" : "var(--accent-border)",
            transition: "all var(--transition-base) var(--ease-in-out)",
          }}></button>
        ))}
      </div>

      <a href="#" style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--accent-strong)", textDecoration: "underline", textUnderlineOffset: 2 }}>Important safety information</a>
    </div>
  );
}

function WLTimelineSection() {
  return (
    <section data-screen-label="Timeline to treatment" data-theme="weight-loss" style={{
      position: "relative", fontFamily: "var(--font-family-base)", background: "#5E93D1", overflow: "hidden",
    }}>
      {/* Image as background for the WHOLE section */}
      <img src={WLT_UPLOADS + "/hf_20260715_175520_37b982f3-c380-43c9-bc9c-8d50b3441ae1.png"} alt="" aria-hidden="true"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "50% 18%",
        }} />
      {/* Gradient mask over the lower (panel) half, gluing image into the tide ground */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(94,147,209,0) 0%, rgba(94,147,209,0) 38%, rgba(94,147,209,0.45) 58%, rgba(94,147,209,0.85) 74%, #5E93D1 88%)",
      }}></div>

      {/* Main title, overlaid on the photo band */}
      <div style={{
        position: "relative", maxWidth: 1152, margin: "0 auto",
        padding: "var(--spacing-16) var(--spacing-6) 0", textAlign: "center",
      }}>
        <WLReveal>
        <h2 style={{
          margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
          color: "var(--color-white)", textWrap: "balance", maxWidth: "16em",
          marginInline: "auto",
          textShadow: "0 2px 24px rgba(0,0,0,0.35)",
        }}>If Weight Loss Were Easy, You Wouldn't Still Be Searching</h2>
        </WLReveal>
      </div>

      {/* Spacer where the photo shows through */}
      <div style={{ height: 300 }}></div>

      {/* Panel */}
      <div style={{ position: "relative", maxWidth: 1152, margin: "0 auto", padding: "0 var(--spacing-6) var(--spacing-12)" }}>
        <WLReveal>
        <div className="wlt-panel" style={{
          background: "var(--color-white)", borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-md)",
          padding: "var(--spacing-16) var(--spacing-12)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-10)",
          alignItems: "center",
        }}>
          <div>
            <h2 style={{
              margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300,
              lineHeight: 1.15, color: "var(--fg-default)", textWrap: "pretty",
            }}>Chime was built to change that.</h2>
            <p style={{
              margin: "var(--spacing-6) 0 0", fontSize: "var(--text-lg)",
              lineHeight: 1.5, color: "var(--fg-muted)", maxWidth: "24em",
            }}>The Chime Membership is a care team that stays with you and adjusts as your life does — because lasting progress means having the right people in your corner.</p>

            <p style={{
              margin: "var(--spacing-8) 0 0", fontSize: "var(--text-xl)",
              fontWeight: "var(--font-weight-semibold)", lineHeight: 1.3, color: "var(--fg-default)",
            }}>You're Not Doing This Alone™</p>

            <ul style={{
              listStyle: "none", margin: "var(--spacing-5) 0 0", padding: 0,
            }}>
              {["Lifestyle Strategies", "Laboratory Testing", "Wellness Support", "Coaching", "Treatment Options"].map((item) => (
                <li key={item} style={{
                  display: "flex", alignItems: "center", gap: "var(--spacing-3)",
                  padding: "var(--spacing-2) 0",
                }}>
                  <span aria-hidden="true" style={{
                    flex: "none", width: 24, height: 24, borderRadius: "var(--radius-4xl)",
                    background: "var(--accent-default)", color: "var(--color-white)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5 11-12" /></svg>
                  </span>
                  <span style={{ fontSize: "var(--text-base)", color: "var(--fg-default)", fontWeight: "var(--font-weight-medium)" }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "var(--spacing-8)" }}>
              <WLTButton primary label="Explore The Chime Membership" />
            </div>
          </div>

          {/* Product content — Rx carousel from the Health, Energy & Wellness section,
              tide-themed on a light card (mirrors the wellness timeline card). */}
          <div style={{
            maxWidth: 420, margin: "0 auto", width: "100%", boxSizing: "border-box",
            background: "var(--color-tide-100)", border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-3xl)", padding: "var(--spacing-5)", minHeight: 420,
            display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
          }}>
            <ChimeRxCarousel Button={WLTButton} accentColor="var(--accent-strong)" uploads={WLT_UPLOADS} />
          </div>
        </div>
        </WLReveal>
      </div>
    </section>
  );
}

function WLTButton({ label, primary }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden",
        background: primary ? "var(--accent-default)" : "var(--color-white)",
        color: primary ? "var(--color-white)" : (hover ? "var(--text-on-primary)" : "var(--text-default)"),
        border: primary ? "1px solid transparent" : "1px solid var(--border-strong)",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-2) var(--spacing-5)",
        fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none", whiteSpace: "nowrap",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
      <span style={{
        position: "absolute", inset: 0,
        background: primary ? "var(--color-blue-800)" : "var(--accent-default)",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}

Object.assign(window, { WLTimelineSection, WLTButton });
