// Chime Health — Homepage UI kit: Guide CTA section
// Rounded full-width card with runners background image, email capture on the left.

const GUIDE_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const GUIDE_BG = GUIDE_UPLOADS + "/hf_20260702_042318_5749878e-ec06-4b35-8bef-d1e9b5d0bc05.png";

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function GuideReveal({ children, delay, style }) {
  return <div className="reveal" style={style}>{children}</div>;
}

function ChimeGuideSection() {
  const [email, setEmail] = React.useState("");
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const linkStyle = { color: "var(--color-white)", textDecoration: "underline", textUnderlineOffset: 3 };
  return (
    <section data-screen-label="Guide CTA" className="guide-section" style={{
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-12) var(--spacing-8)",
      maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
    }}>
      <GuideReveal>
      <div style={{
        position: "relative", overflow: "clip",
        borderRadius: "var(--radius-3xl)",
        minHeight: 520,
        display: "flex", alignItems: "center",
      }}>
        <img src={GUIDE_BG} alt="Two people trail running at sunrise" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center bottom", display: "block",
        }} />
        {/* Legibility scrim over the text column */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(43,38,24,0.38) 0%, rgba(43,38,24,0.18) 45%, rgba(43,38,24,0) 70%)",
        }}></div>

        <div className="guide-content" style={{
          position: "relative", zIndex: 1,
          padding: "var(--spacing-12) var(--spacing-10)",
          maxWidth: 460, display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
        }}>
          <GuideReveal delay={150} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
          <h2 style={{
            margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.12,
            color: "var(--color-white)", textWrap: "balance",
            textShadow: "0 1px 16px rgba(43,38,24,0.35)",
          }}>Unlock your free Understanding Your Health guide</h2>
          <p style={{
            margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5,
            color: "var(--color-white)", opacity: 0.92, maxWidth: "24em",
          }}>Written by licensed providers to support your journey.</p>

          <form onSubmit={(e) => e.preventDefault()} style={{
            display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
            marginTop: "var(--spacing-2)",
          }}>
            <input type="email" value={email} placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
              style={{
                appearance: "none", width: "100%", boxSizing: "border-box",
                background: "var(--color-white)",
                border: focus ? "1px solid var(--color-blue-500)" : "1px solid transparent",
                borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-3) var(--spacing-5)",
                fontSize: "var(--text-base)", fontFamily: "var(--font-family-base)",
                color: "var(--color-slate-800)", outline: "none",
                boxShadow: focus ? "0 0 0 3px rgba(101,128,188,0.25)" : "var(--shadow-sm)",
                transition: "box-shadow var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
              }} />
            <button type="submit"
              onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
              style={{
                appearance: "none", cursor: "pointer", width: "100%",
                background: "var(--color-white)", border: "1px solid transparent",
                borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-3) var(--spacing-5)",
                fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
                fontFamily: "var(--font-family-base)",
                color: "var(--color-blue-800)",
                boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
                transform: hover ? "translateY(-2px)" : "none",
                transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
              }}>Get the guide</button>
          </form>

          <p style={{
            margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.55,
            color: "var(--color-white)", opacity: 0.92, maxWidth: "26em",
          }}>By creating an account using email, I agree to the <a href="#" style={linkStyle}>Terms &amp; Conditions</a>, and acknowledge the <a href="#" style={linkStyle}>Privacy Policy</a>.</p>
          </GuideReveal>
        </div>
      </div>
      </GuideReveal>
    </section>
  );
}

Object.assign(window, { ChimeGuideSection });
