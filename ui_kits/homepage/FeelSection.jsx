// Chime Health — Homepage UI kit: "Feel More Like Yourself Again" section
// Full-bleed video background band with headline + sub + CTA.

const FEEL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

function ChimeFeelSection() {
  return (
    <section data-screen-label="Feel More Like Yourself Again" className="hero-section feel-section" style={{
      maxWidth: "var(--container-xl)", margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-12)",
      fontFamily: "var(--font-family-base)",
    }}>
      <div style={{
        position: "relative", borderRadius: "var(--radius-3xl)", overflow: "hidden",
        background: "var(--glass-solid)",
        minHeight: 520,
        display: "flex", alignItems: "stretch",
        boxShadow: "var(--shadow-xs)",
      }}>
        <video className="feel-video"
          src={FEEL_UPLOADS + "/hf_20260713_031732_36a942a7-16dc-4fae-bee0-0fa1978826cf.mp4"}
          autoPlay muted loop playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}></video>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(100deg, rgb(var(--glass-rgb) / 0.62) 0%, rgb(var(--glass-rgb) / 0.32) 48%, rgb(var(--glass-rgb) / 0.08) 100%)",
        }}></div>
        <div className="feel-content" style={{
          position: "relative", zIndex: 1, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "var(--spacing-10) var(--spacing-10) var(--spacing-10)",
          gap: "var(--spacing-4)",
        }}>
          <Eyebrow tone="onDark" opacity={0.85} label="Feel More Like Yourself Again" />
          <h2 className="feel-title" style={{
            margin: 0, maxWidth: "14em",
            fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
            color: "var(--color-white)", textWrap: "balance",
            textShadow: "0 1px 16px rgb(var(--glass-rgb) / 0.35)",
          }}>Because no two bodies are the same</h2>
          <div className="feel-row" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "var(--spacing-6)", flexWrap: "wrap", marginTop: "var(--spacing-2)",
          }}>
            <FeelCTA label="Explore The Chime Membership" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeelCTA({ label }) {
  return <Button label={label} tone="onDark" variant="primary" size="cta" />;
}

Object.assign(window, { ChimeFeelSection });
