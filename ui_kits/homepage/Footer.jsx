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
  "Assessment": "chimeAssessment.html",
};
// FAQs lives outside FOOTER_HREFS: pages override CHIME_NAV_HREFS for the
// product nav, and that override must not be able to drop the FAQ link.
const FOOTER_FAQ_HREF = "faq.html";

// Legal column — kept separate from FOOTER_HREFS so a page overriding
// CHIME_NAV_HREFS for its product nav can't accidentally drop the legal links.
const FOOTER_LEGAL_HREFS = {
  "Privacy Policy": "privacy-policy.html",
  "HIPAA Notice": "hipaa-notice.html",
  "Telehealth Consent": "telehealth-consent.html",
  "Terms & Conditions": "terms-conditions.html",
  "Return & Refund Policy": "return-refund-policy.html",
  "Shipping Policy": "shipping-policy.html",
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
        {/* minHeight 44: the wordmark is ~24px tall, and the anchor is a tap
            target (WCAG 2.5.5) — the box grows, the mark stays put. */}
        <a href="index.html" aria-label="Chime Health home" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, gridColumn: "1" }}>
          {/* Navy wordmark flattened to white for the deep slate panel. */}
          <img src={FOOTER_ASSETS + "/logo-main.svg"} alt="Chime Health" style={{ width: "min(190px, 100%)", height: "auto", display: "block", filter: "brightness(0) invert(1)" }} />
        </a>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Email</div>
          {/* 44px tap target: the box grows around the 18px text row; the
              negative margins keep the column's visual rhythm (the neighbours
              are plain labels, so the enlarged hit area overlaps nothing
              interactive) and the negative left margin cancels the horizontal
              padding so the text keeps its left alignment. */}
          <a href="mailto:hello@chimehealth.com" style={{
            color: "var(--color-blue-100)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-medium)",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center",
            minHeight: 44, width: "max-content",
            padding: "0 var(--spacing-3)",
            margin: "calc(-1 * var(--spacing-2)) 0 calc(-1 * var(--spacing-2)) calc(-1 * var(--spacing-3))",
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

        {/* gap 0, not spacing-3: each FooterLink now carries a 44px tap box
            (13px of it above and below the text), which IS the row spacing —
            keeping the old gap on top of it doubled the air between rows. */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {["Weight Loss", "Health, Energy & Wellness", "Labs"].map((l) => <FooterLink key={l} label={l} href={FOOTER_HREFS[l] || "#"} />)}
          <FooterLink label="FAQs" href={FOOTER_FAQ_HREF} />
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {["Privacy Policy", "HIPAA Notice", "Telehealth Consent", "Terms & Conditions",
            "Return & Refund Policy", "Shipping Policy"].map((l) => (
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
        // 44px touch target (WCAG 2.5.5): the bare 18px text row was the
        // smallest tap target on every page (2026-08-23 audit). The box grows
        // around the text — inline-flex centres it, the columns above drop
        // their gap to compensate, and the negative left margin cancels the
        // horizontal padding so the label keeps its column alignment.
        display: "inline-flex", alignItems: "center",
        minHeight: 44, width: "max-content",
        padding: "0 var(--spacing-3)",
        marginLeft: "calc(-1 * var(--spacing-3))",
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
      href="chimeAssessment.html"
      onClick={(e) => { if (window.openChimeAssessment) { e.preventDefault(); window.openChimeAssessment(); } }}
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
        // The padding alone measured 42px tall — 2px shy of the 44px target.
        minHeight: 44, boxSizing: "border-box",
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
