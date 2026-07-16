// Chime Health — Weight Loss landing: "Because No Two Bodies Are The Same"
// Layout ref: uploads/pasted-1784134621497-0.png (image left, title + check list right)
// Content ref: uploads/pasted-1784134687917-0.png

function WLBodiesCTA({ label, onClick }) {
  return <Button label={label} onClick={onClick} tone="onLight" variant="primary" size="cta" />;
}

function WLBannerCTA({ label }) {
  return <Button label={label} tone="onLight" variant="primary" size="cta" />;
}

function WLBanner() {
  const [vhover, setVhover] = React.useState(false);
  return (
    <div className="wlb-banner" style={{
      gridColumn: "1 / -1",
      display: "grid", gridTemplateColumns: "300px 1fr auto",
      alignItems: "center", columnGap: "var(--spacing-12)",
      padding: "var(--spacing-10) 0 120px",
    }}>
      {/* Left — product tile */}
      <div className="wlb-banner-tile"
        onMouseEnter={() => setVhover(true)} onMouseLeave={() => setVhover(false)}
        style={{
          position: "relative", width: 300, height: 300, borderRadius: 24,
          background: "linear-gradient(160deg, var(--accent-default), var(--accent-strong))",
          cursor: "pointer",
        }}>
        <img src="uploads/vial-solo.png" alt="Medication vial"
          style={{
            position: "absolute", left: "50%", top: "50%",
            height: "118%", width: "auto",
            transform: vhover
              ? "translate(-50%, -54%) rotate(16deg) scale(1.07)"
              : "translate(-50%, -50%) rotate(12deg)",
            filter: vhover
              ? "drop-shadow(-12px 30px 44px rgba(0,0,0,0.34))"
              : "drop-shadow(-8px 22px 34px rgba(0,0,0,0.22))",
            transition: "transform 0.45s var(--ease-in-out), filter 0.45s var(--ease-in-out)",
          }} />
      </div>

      {/* Center — copy */}
      <div>
        <h3 style={{
          margin: 0, fontSize: 40, fontWeight: 600, lineHeight: 1.18,
          color: "var(--fg-default)", textWrap: "pretty",
        }}>Your Wellness Journey Doesn’t End After Day One</h3>
        <p style={{
          margin: "var(--spacing-4) 0 0", fontSize: 20, color: "var(--accent-strong)",
        }}>Feeling Better Starts With Understanding.</p>
      </div>

      {/* Right — CTA */}
      <WLBannerCTA label="Discover Your Wellness Path"></WLBannerCTA>
    </div>
  );
}

function WLBodiesSection() {
  const items = [
    { label: "Personalized Plans", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect><path d="M9 12h6M9 16h4"></path></svg>
    ) },
    { label: "Wellness Coaches", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    ) },
    { label: "Provider Oversight", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
    ) },
    { label: "Ongoing Support", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>
    ) },
    { label: "Fast & Convenient", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
    ) },
  ];
  return (
    <section data-screen-label="No Two Bodies" data-theme="weight-loss" style={{
      fontFamily: "var(--font-family-base)", background: "var(--bg-default)",
      padding: "calc(var(--spacing-12) * 2) var(--spacing-6)",
    }}>
      <WLReveal className="wlb-grid" style={{
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
            {items.map((item, i) => (
              <li key={item.label} className="wlb-item" style={{
                display: "flex", alignItems: "center", gap: "var(--spacing-3)",
                animationDelay: (i * 0.35) + "s",
              }}>
                <span aria-hidden="true" style={{
                  width: 30, height: 30, flex: "none", borderRadius: "var(--radius-full)",
                  background: "var(--accent-default)", color: "var(--color-white)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: "var(--text-lg)", color: "var(--fg-default)" }}>{item.label}</span>
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

        <WLBanner />
      </WLReveal>
    </section>
  );
}

Object.assign(window, { WLBodiesSection });
