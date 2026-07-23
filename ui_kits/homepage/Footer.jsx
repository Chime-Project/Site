// Chime Health — Homepage UI kit: Footer
// Deep slate-blue panel: white lockup left · link columns · pill CTA ·
// legal links · hairline · disclaimer · copyright.
// Reference: uploads/pasted-1783918075389-0.png

const FOOTER_ASSETS = window.CHIME_ASSETS_BASE || "../../assets";

// Destination pages for footer nav labels; labels without an entry fall back to "#".
const FOOTER_HREFS = window.CHIME_NAV_HREFS || {
  "Weight Loss": "weight-loss.html",
  "Health, Energy & Wellness": "wellness.html",
  "Labs": "labs.html",
  "Assessment": "assessment.html",
};

// Legal column — kept separate from FOOTER_HREFS so a page overriding
// CHIME_NAV_HREFS for its product nav can't accidentally drop the legal links.
const FOOTER_LEGAL_HREFS = {
  "Privacy Policy": "privacy-policy.html",
  "HIPAA Notice": "hipaa-notice.html",
  "Telehealth Consent": "telehealth-consent.html",
  "Terms & Conditions": "terms-conditions.html",
};

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

          <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "var(--spacing-6)" }}>Address</div>
          <address style={{ fontSize: "var(--text-sm)", color: "var(--color-blue-100)", lineHeight: 1.6, fontStyle: "normal" }}>
            <div>4212 San Felipe St, Suite 576</div>
            <div>Houston, TX 77027</div>
            <div>United States</div>
          </address>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {["Weight Loss", "Health, Energy & Wellness", "Labs", "Assessment"].map((l) => <FooterLink key={l} label={l} href={FOOTER_HREFS[l] || "#"} />)}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {["Privacy Policy", "HIPAA Notice", "Telehealth Consent", "Terms & Conditions"].map((l) => (
            <FooterLink key={l} label={l} href={FOOTER_LEGAL_HREFS[l]} />
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
          color: "var(--color-blue-100)",
          display: "grid", rowGap: "var(--spacing-3)",
        }}>
          <p style={{ margin: 0 }}>Chime Health connects patients with licensed healthcare providers through an online telehealth platform. Chime Health does not practice medicine or provide medical services directly.</p>
          <p style={{ margin: 0 }}>Compounded medications are not FDA-approved drug products and have not been evaluated by the FDA for safety, effectiveness, or quality. They are prepared by licensed 503A compounding pharmacies pursuant to a valid prescription from a licensed healthcare provider.</p>
          <p style={{ margin: 0 }}>Individual results vary. Results are not typical or guaranteed. State availability varies &mdash; not all services are available in all states. Prescription treatments require consultation and approval by a licensed healthcare provider. Treatment is not guaranteed.</p>
          <p style={{ margin: 0 }}>Next-day shipping availability depends on provider approval, pharmacy processing times, patient location, and carrier service.</p>
          <p style={{ margin: 0 }}>This website is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Not for emergencies &mdash; call 911.</p>
        </div>

        <p style={{ margin: "var(--spacing-4) 0 0 0", fontSize: "var(--text-xs)", color: "var(--color-blue-100)" }}>
          Copyright &copy; 2026 Chime, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ label, href = "#", underline = false }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
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
        // Hero-CTA hover vocabulary (see Hero.jsx TreatmentPathCard pill):
        // lift + accent sweep-fill from the left, text flips to on-primary.
        display: "inline-flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: "var(--color-white)",
        color: hover ? "var(--text-on-primary)" : "var(--color-blue-800)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none",
        padding: "var(--spacing-3) var(--spacing-6)",
        borderRadius: "var(--radius-4xl)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}
    >
      <span style={{
        position: "absolute", inset: 0, background: "var(--accent-default)",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}

Object.assign(window, { ChimeFooter });
