// Chime Health — Homepage UI kit: Footer
// Deep slate-blue panel: white lockup left · link columns · pill CTA ·
// legal links · hairline · disclaimer · copyright.
// Reference: uploads/pasted-1783918075389-0.png

const FOOTER_ASSETS = window.CHIME_ASSETS_BASE || "../../assets";

function ChimeFooter() {
  return (
    <footer style={{
      background: "var(--color-blue-800)",
      color: "var(--color-white)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-16) var(--spacing-8) var(--spacing-12)",
    }}>
      <div className="footer-grid" style={{
        maxWidth: "var(--container-xl)", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "var(--spacing-12)", alignItems: "start",
      }}>
        <a href="#" aria-label="Chime Health home" style={{ display: "inline-flex", gridColumn: "1" }}>
          <img src={FOOTER_ASSETS + "/logo-white.png"} alt="Chime Health" style={{ height: 72, width: "auto", display: "block" }} />
        </a>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Email</div>
          <a href="mailto:hello@chimehealth.com" style={{
            color: "var(--color-blue-100)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            textDecoration: "none",
            transition: "color var(--transition-fast) var(--ease-in-out)",
          }} onMouseEnter={(e) => e.target.style.color = "var(--color-white)"} onMouseLeave={(e) => e.target.style.color = "var(--color-blue-100)"}>
            hello@chimehealth.com
          </a>

          <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "var(--spacing-6)" }}>Business Hours</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-blue-100)", lineHeight: 1.6 }}>
            <div>Monday-Friday</div>
            <div>8:00 AM – 6:00 PM CST</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {["Weight Loss", "Health, Energy & Wellness", "Labs"].map((l) => <FooterLink key={l} label={l} />)}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {["Privacy Policy", "HIPAA Notice", "Telehealth Consent", "Terms & Conditions"].map((l) => (
            <FooterLink key={l} label={l} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto", marginTop: "var(--spacing-12)" }}>
        <div>
          <FooterCta label="Schedule a call with a wellness expert" />
        </div>

        <hr style={{ border: 0, borderTop: "1px solid rgba(255, 255, 255, 0.35)", margin: "var(--spacing-12) 0", width: "100%" }} />

        <div style={{
          fontSize: "var(--text-xs)", lineHeight: 1.6,
          color: "var(--color-blue-100)", maxWidth: "90ch",
          display: "grid", rowGap: "var(--spacing-1)",
        }}>
          <p style={{ margin: 0 }}>The content on this page is intended for consumers or healthcare professionals who are U.S. residents ages 18 and over.</p>
          <p style={{ margin: 0 }}>ChimeDirect&reg; is a registered trademark owned or licensed by Chime, Inc., its subsidiaries, or affiliates. Third-party trademarks are the property of their respective owners.</p>
        </div>

        <p style={{ margin: "var(--spacing-4) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-blue-100)" }}>
          Copyright &copy; 2026 Chime, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ label, underline = false }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? "var(--color-white)" : "var(--color-blue-100)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-medium)",
        textDecoration: underline || hover ? "underline" : "none",
        textUnderlineOffset: 4,
        width: "max-content",
        transition: "color var(--transition-fast) var(--ease-in-out)",
      }}
    >
      {label}
    </a>
  );
}

function FooterCta({ label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center",
        background: hover ? "var(--color-sand-100)" : "var(--color-white)",
        color: "var(--color-blue-800)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none",
        padding: "var(--spacing-3) var(--spacing-6)",
        borderRadius: "var(--radius-4xl)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "background var(--transition-fast) var(--ease-in-out), box-shadow var(--transition-fast) var(--ease-in-out)",
      }}
    >
      {label}
    </a>
  );
}

Object.assign(window, { ChimeFooter });
