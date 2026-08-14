// Chime Health — shared button. One hover-sweep pill for the whole site.
//   variant: "primary" | "secondary" | "ghost"
//   tone:    "onLight" (default) | "onDark"  — the surface the button sits on
//   size:    "micro" | "tiny" | "compact" | "small" | "cta" | "default" | "large"
//   full:    fill the parent's width instead of shrink-wrapping. The button never
//            positions itself — a caller that needs it placed (the cart's plan pill
//            straddles its card's bottom edge) wraps it in its own positioned box
//            and sets this, so placement stays the caller's business and skin,
//            size and sweep stay this component's.
//   disabled: dead button — sets the disabled attribute and drops the hover
//            lift, sweep and colour change. Ignored on the anchor form (no
//            onClick), since a link cannot be disabled; pass onClick to get a
//            real <button> that can be.
//   type:    forwarded to <button>. Left unset by default ON PURPOSE: an unset
//            type is "submit", which is what makes Enter-to-submit work for the
//            cart's checkout <form>. Pass "button" for any button outside a form
//            context, or inside one where it must not submit.
//   onClick: handler → renders <button>; omit → <a href="chimeAssessment.html"> (the assessment;
//   via window.openChimeAssessment() so chimeAssessment.html can scroll instead of reload)
// Colors bind to --accent-* + --text-*/neutral only, so buttons follow the page theme.
//
// ⚠️ `size` falls back to "cta" when unrecognised, so a typo is silent. There are
// live callers passing "md" and "sm", which are NOT in this table — they render
// at cta size. Fix those at the call site, not by adding aliases here.

const BTN_SIZE = {
  micro:   ["var(--spacing-2) var(--spacing-4)", "var(--text-xs)"],
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

function Button({ label, variant = "primary", tone = "onLight", size = "cta", onClick, wrap, full, type, disabled }) {
  const [hover, setHover] = React.useState(false);
  const s = btnSkin(variant, tone);
  const sz = BTN_SIZE[size] || BTN_SIZE.cta;
  const Tag = onClick ? "button" : "a";
  const tagProps = onClick
    ? { onClick }
    : { href: "chimeAssessment.html", onClick: (e) => { if (window.openChimeAssessment) { e.preventDefault(); window.openChimeAssessment(); } } };
  if (type && Tag === "button") tagProps.type = type;
  // Only a real <button> can be disabled. Guarding on Tag keeps the anchor form
  // from silently ignoring the prop and shipping a "disabled" link that still
  // navigates — a caller wanting a dead CTA must pass onClick so it renders a
  // button. `off` gates every interactive affordance below, so a disabled
  // button also stops lifting, sweeping and changing colour under the cursor.
  const off = !!disabled && Tag === "button";
  if (off) { tagProps.disabled = true; tagProps["aria-disabled"] = "true"; }
  const lit = hover && !off;
  return (
    <Tag {...tagProps}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: full ? "block" : "inline-block",
        width: full ? "100%" : undefined,
        boxSizing: full ? "border-box" : undefined,
        position: "relative", overflow: "hidden",
        cursor: off ? "not-allowed" : "pointer",
        // undefined, not 1: emitting the default would put an opacity on every
        // button on the site and make this change show up in a DOM diff that
        // should be empty.
        opacity: off ? 0.55 : undefined,
        background: s.bg, color: lit ? s.hoverText : s.text,
        border: s.border, backdropFilter: s.blur ? "blur(8px)" : "none",
        borderRadius: "var(--radius-4xl)", padding: sz[0],
        fontSize: sz[1], fontWeight: "var(--font-weight-semibold)", fontFamily: "var(--font-family-base)",
        textDecoration: "none", whiteSpace: wrap ? "normal" : "nowrap", textAlign: "center",
        boxShadow: lit ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: lit ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
      <span aria-hidden="true" style={{
        position: "absolute", inset: 0, background: s.sweep,
        transform: lit ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      {/* Block only when full-width, so a multi-line label (the plan pill stacks
          "Select Plan" over its price) gets a real block formatting context
          rather than block boxes splitting an inline span. */}
      <span style={{ position: "relative", display: full ? "block" : undefined }}>{label}</span>
    </Tag>
  );
}

Object.assign(window, { Button });
