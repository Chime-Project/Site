// Chime Health — Weight Loss landing: "Because No Two Bodies Are The Same"
// Layout ref: uploads/pasted-1784134621497-0.png (image left, title + check list right)
// Content ref: uploads/pasted-1784134687917-0.png

function WLBodiesCTA({ label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", overflow: "hidden", cursor: "pointer",
        whiteSpace: "nowrap",
        border: "none",
        background: "var(--accent-default)",
        color: "var(--color-white)",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-3) var(--spacing-5)",
        fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
        fontFamily: "var(--font-family-base)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: "var(--color-blue-800)",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </button>
  );
}

function WLBodiesSection() {
  const items = [
    "Lifestyle Strategies",
    "Laboratory Testing",
    "Wellness Support",
    "Coaching",
    "Treatment Options",
  ];
  return (
    <section data-screen-label="No Two Bodies" style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
      padding: "calc(var(--spacing-12) * 2) var(--spacing-6)",
    }}>
      <div className="wlb-grid" style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-12)",
        alignItems: "center",
      }}>
        <div style={{
          position: "relative", aspectRatio: "1 / 1", maxWidth: 640, margin: "0 auto", width: "100%",
          background: "var(--color-tide-200)", borderRadius: "50%", overflow: "hidden",
        }}>
          <img src="assets/wl-bodies-gym.png" alt="Two smiling women in workout clothes standing in a gym"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", opacity: 0.9 }} />
        </div>

        <div style={{ maxWidth: 480 }}>
          <h2 style={{
            margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300,
            lineHeight: 1.15, color: "var(--fg-default)", textWrap: "pretty",
          }}>Because No Two Bodies Are The Same</h2>
          <p style={{
            margin: "var(--spacing-6) 0 var(--spacing-4)",
            fontSize: "var(--text-base)", color: "var(--fg-muted)",
          }}>Depending on your needs, your care team may recommend:</p>
          <ul style={{
            listStyle: "none", margin: 0, padding: 0,
            display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
          }}>
            {items.map((label, i) => (
              <li key={label} className="wlb-item" style={{
                display: "flex", alignItems: "center", gap: "var(--spacing-3)",
                animationDelay: (i * 0.35) + "s",
              }}>
                <span aria-hidden="true" style={{
                  width: 26, height: 26, flex: "none", borderRadius: "var(--radius-full)",
                  background: "var(--accent-default)", color: "var(--color-white)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-10"></path></svg>
                </span>
                <span style={{ fontSize: "var(--text-lg)", color: "var(--fg-default)" }}>{label}</span>
              </li>
            ))}
          </ul>
          <p style={{
            margin: "var(--spacing-8) 0 var(--spacing-4)",
            fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)",
            color: "var(--fg-default)",
          }}>You’re Not Doing This Alone™</p>
          <WLBodiesCTA label="Explore The Chime Membership"></WLBodiesCTA>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WLBodiesSection });
