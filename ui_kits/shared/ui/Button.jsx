// Chime Health — shared button. One hover-sweep pill for the whole site.
//   variant: "primary" | "secondary" | "ghost"
//   tone:    "onLight" (default) | "onDark"  — the surface the button sits on
//   size:    "tiny" | "compact" | "small" | "cta" | "default" | "large"
//   onClick: handler → renders <button>; omit → <a href="#"> opens the assessment
// Colors bind to --accent-* + --text-*/neutral only, so buttons follow the page theme.

const BTN_SIZE = {
  tiny:    ["var(--spacing-1) var(--spacing-3)", "var(--text-sm)"],
  compact: ["var(--spacing-2) var(--spacing-5)", "var(--text-sm)"],
  small:   ["var(--spacing-2) var(--spacing-5)", "var(--text-base)"],
  cta:     ["var(--spacing-3) var(--spacing-5)", "var(--text-base)"],
  default: ["var(--spacing-3) var(--spacing-7)", "var(--text-base)"],
  large:   ["var(--spacing-4) var(--spacing-10)", "var(--text-lg)"],
};

function btnSkin(variant, tone) {
  if (tone === "onDark") {
    if (variant === "secondary")
      return { bg: "rgba(255,255,255,0.18)", text: "var(--color-white)", hoverText: "var(--color-white)",
               border: "1px solid rgba(255,255,255,0.25)", sweep: "var(--accent-default)", blur: true };
    return { bg: "var(--color-white)", text: "var(--text-default)", hoverText: "var(--text-on-primary)",
             border: "1px solid transparent", sweep: "var(--accent-default)" };
  }
  if (variant === "secondary")
    return { bg: "var(--color-white)", text: "var(--text-default)", hoverText: "var(--text-on-primary)",
             border: "1px solid var(--border-strong)", sweep: "var(--accent-default)" };
  if (variant === "ghost")
    return { bg: "var(--accent-subtle)", text: "var(--accent-strong)", hoverText: "var(--accent-strong)",
             border: "1px solid transparent", sweep: "var(--accent-subtleHover)" };
  return { bg: "var(--accent-default)", text: "var(--color-white)", hoverText: "var(--color-white)",
           border: "1px solid transparent", sweep: "var(--accent-active)" };
}

function Button({ label, variant = "primary", tone = "onLight", size = "cta", onClick, wrap }) {
  const [hover, setHover] = React.useState(false);
  const s = btnSkin(variant, tone);
  const sz = BTN_SIZE[size] || BTN_SIZE.cta;
  const Tag = onClick ? "button" : "a";
  const tagProps = onClick
    ? { onClick }
    : { href: "#", onClick: (e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); } };
  return (
    <Tag {...tagProps}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden", cursor: "pointer",
        background: s.bg, color: hover ? s.hoverText : s.text,
        border: s.border, backdropFilter: s.blur ? "blur(8px)" : "none",
        borderRadius: "var(--radius-4xl)", padding: sz[0],
        fontSize: sz[1], fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-family-base)",
        textDecoration: "none", whiteSpace: wrap ? "normal" : "nowrap", textAlign: "center",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0, background: s.sweep,
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </Tag>
  );
}

Object.assign(window, { Button });
