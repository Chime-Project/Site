// Chime Health — shared membership panel: the light card inside each landing
// page's "timeline to treatment" band. Copy + tagline + benefits checklist + CTA
// on the left, the Rx carousel on a tinted card on the right.
//
// Theme-agnostic: the product card's tint binds to --accent-subtle, which resolves
// to tide-100 on weight-loss and cadmium-100 on wellness — the exact literals the
// two sections used to hardcode. No color props.
//
// Each page must define `.membership-panel` in its own <style> for the mobile
// collapse (same pattern as `.reveal`):
//   @media (max-width: 960px) { .membership-panel { grid-template-columns: 1fr !important;
//     gap: var(--spacing-8) !important; padding: var(--spacing-8) var(--spacing-6) !important; } }
//
// NOTE: each section's media band stays local on purpose — WL uses an <img> plus a
// gradient overlay and a fixed spacer, WN a <video> with a CSS mask and no spacer.
// Same intent, different techniques; merging them would be a false unification.
//
//   panelBg:  panel ground — WL opaque white; WN 0.85 alpha so the gold shows through
//   Button:   the page's button adapter, also forwarded to <RxCarousel>
//   uploads:  uploads base, forwarded to <RxCarousel>
// Requires CheckItem.jsx (CheckBullet) and RxCarousel.jsx to load first.
function MembershipPanel({
  panelBg = "var(--color-white)",
  title, body, tagline, benefits = [], ctaLabel, Button, uploads,
}) {
  return (
    <div className="membership-panel" style={{
      background: panelBg, borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-md)",
      padding: "var(--spacing-16) var(--spacing-12)",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-10)",
      alignItems: "center",
    }}>
      <div>
        <h2 style={{
          margin: 0, fontSize: "var(--text-4xl)", fontWeight: 300,
          lineHeight: 1.15, color: "var(--fg-default)", textWrap: "pretty",
        }}>{title}</h2>
        <p style={{
          margin: "var(--spacing-6) 0 0", fontSize: "var(--text-lg)",
          lineHeight: 1.5, color: "var(--fg-muted)", maxWidth: "24em",
        }}>{body}</p>

        <p style={{
          margin: "var(--spacing-8) 0 0", fontSize: "var(--text-xl)",
          fontWeight: "var(--font-weight-semibold)", lineHeight: 1.3, color: "var(--fg-default)",
        }}>{tagline}</p>

        <ul style={{ listStyle: "none", margin: "var(--spacing-5) 0 0", padding: 0 }}>
          {benefits.map(function (label) {
            return <CheckBullet key={label} label={label} />;
          })}
        </ul>

        <div style={{ marginTop: "var(--spacing-8)" }}>
          <Button primary label={ctaLabel} />
        </div>
      </div>

      {/* Product content — Rx carousel on an accent-tinted card so it reads on the panel. */}
      <div style={{
        maxWidth: 420, margin: "0 auto", width: "100%", boxSizing: "border-box",
        background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
        borderRadius: "var(--radius-3xl)", padding: "var(--spacing-5)", minHeight: 420,
        display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
      }}>
        <RxCarousel variant="light" Button={Button} uploads={uploads} />
      </div>
    </div>
  );
}

Object.assign(window, { MembershipPanel });
