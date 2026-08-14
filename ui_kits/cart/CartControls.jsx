// Chime Health — shopping cart: presentational primitives.
// Layout source: uploads/Shopping01.png + uploads/Shopping02.png.
//
// Theme-agnostic by contract (ui_kits/shared/THEME_CONTRACT.md): every color
// here is a semantic/accent/glass token. The one unavoidable exception —
// third-party payment-brand colors — lives in cart.html as --pay-* custom
// properties and .pay-chip classes, so no brand hex enters this file.
// Requires Icon.jsx to load first.

// ---- Motion --------------------------------------------------------------
// Same idiom as the assessment (ui_kits/chimeAssessment/AssessmentV4Controls.jsx):
// GSAP drives TRANSFORMS ONLY. Shadow and border stay on CSS transitions,
// because --shadow-xs and --shadow-md have different structures (one shadow vs
// two) and GSAP cannot interpolate between them.
function cartReduced() {
  return typeof matchMedia === "function"
    && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function cartCanHover() {
  return typeof matchMedia === "function" && matchMedia("(hover: hover)").matches;
}

// Hover lift. Skipped on touch, where mouseenter fires on tap and would leave a
// card stuck in its lifted state after the finger goes.
function cartCardHover(el, entering, lift) {
  if (!window.gsap || !el || !cartCanHover() || cartReduced()) return;
  window.gsap.to(el, {
    y: entering ? (lift || -4) : 0,
    duration: entering ? 0.18 : 0.24,
    ease: entering ? "power2.out" : "power2.inOut",
    overwrite: "auto",
  });
}

// Confirmation pop when an option becomes the selected one: the card settles
// and its radio dot springs in. Deliberately small — this fires on a choice the
// user just made, so it should read as an acknowledgement, not an entrance.
function cartSelectPop(el) {
  const g = window.gsap;
  if (!g || !el || cartReduced()) return;
  g.fromTo(el, { scale: 0.985 },
    { scale: 1, duration: 0.5, ease: "back.out(2.4)", overwrite: "auto", clearProps: "transform" });
  const dot = el.querySelector("[data-radio-dot]");
  if (dot) g.fromTo(dot, { scale: 0 },
    { scale: 1, duration: 0.4, ease: "back.out(3)", clearProps: "transform" });
}

// ---- Chrome --------------------------------------------------------------
// Checkout chrome is deliberately bare: a centered lockup, no nav, no footer.
// Both mockups draw it that way, and it is the standard reason — every link is
// an exit from a funnel the user is already inside. The logo stays a link home
// so the page is not a dead end.
function CartHeader() {
  const assets = window.CHIME_ASSETS_BASE || "assets";
  return (
    <header style={{
      background: "var(--bg-elevated)", padding: "var(--spacing-5) var(--spacing-5)",
      display: "flex", justifyContent: "center",
    }}>
      <a href="index.html" aria-label="Chime Health — home" style={{ display: "block" }}>
        <img src={assets + "/logo-main.svg"} alt="Chime Health" width="1095" height="138"
          style={{ display: "block", height: 34, width: "auto" }} />
      </a>
    </header>
  );
}

// Back affordance, top-left of the tinted band on both screens.
function CartBack({ label, onClick, href }) {
  const Tag = onClick ? "button" : "a";
  const props = onClick ? { onClick, type: "button" } : { href };
  return (
    <Tag {...props} className="cart-back" aria-label={label} style={{
      display: "inline-flex", alignItems: "center", gap: "var(--spacing-2)",
      background: "none", border: 0, padding: "var(--spacing-2)", margin: "0 0 0 calc(var(--spacing-2) * -1)",
      cursor: "pointer", color: "var(--text-secondary)", font: "inherit", textDecoration: "none",
    }}>
      <Icon size={22} strokeWidth={1.8}>
        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
      </Icon>
      <span className="visually-hidden">{label}</span>
    </Tag>
  );
}

// Numbered step marker: accent pill over a centered title.
function CartStep({ n, title, sub, id }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "var(--spacing-8)" }}>
      <span style={{
        display: "inline-block", background: "var(--accent-default)", color: "var(--color-white)",
        borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-5)",
        fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
      }}>Step {n}</span>
      <h2 id={id} style={{
        margin: "var(--spacing-3) 0 0", fontSize: "var(--text-2xl)",
        fontWeight: "var(--font-weight-medium)", color: "var(--text-default)", letterSpacing: "-0.01em",
      }}>{title}</h2>
      {sub && <p style={{
        margin: "var(--spacing-3) auto 0", maxWidth: "34em", fontSize: "var(--text-sm)",
        lineHeight: 1.6, color: "var(--text-muted)",
      }}>{sub}</p>}
    </div>
  );
}

// ---- Step 1: treatment ---------------------------------------------------
// A radio, not a button: two mutually exclusive choices where the whole card is
// the hit target. role="radio" + the arrow-key handling in the flow keep that
// honest for keyboard and screen-reader users, which a div-with-onClick would
// not — the selected state has to be announced, and it has to be reachable
// without a mouse.
function CartTreatmentCard({ product, meta, selected, onSelect, onKeyDown, innerRef }) {
  const uploads = window.CHIME_UPLOADS_BASE || "uploads";
  const rootRef = React.useRef(null);
  const mounted = React.useRef(false);
  // Pop only on a real change of selection — skipping the first pass keeps the
  // default card from popping at itself the moment the page loads.
  React.useLayoutEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (selected) cartSelectPop(rootRef.current);
  }, [selected]);
  return (
    <div role="radio" aria-checked={selected} tabIndex={selected ? 0 : -1}
      ref={(el) => { rootRef.current = el; if (innerRef) innerRef(el); }}
      onMouseEnter={() => cartCardHover(rootRef.current, true, -3)}
      onMouseLeave={() => cartCardHover(rootRef.current, false)}
      onClick={onSelect} onKeyDown={onKeyDown} className="cart-treatment"
      style={{
        position: "relative", cursor: "pointer", borderRadius: "var(--radius-xl)",
        // The selected card fills with sand and the unselected one stays on the
        // page ground — the mockup's contrast. The transparent border on the
        // resting card reserves the same box so selecting never nudges layout.
        background: selected ? "var(--bg-secondary)" : "transparent",
        border: "1px solid " + (selected ? "var(--border-default)" : "transparent"),
        padding: "var(--spacing-6) var(--spacing-6) var(--spacing-5)",
        display: "grid", gridTemplateColumns: "1fr 96px", gap: "var(--spacing-4)",
        alignItems: "center", transition: "background var(--transition-base) var(--ease-in-out)",
      }}>
      <span aria-hidden="true" style={{
        position: "absolute", top: "var(--spacing-4)", right: "var(--spacing-4)",
        width: 20, height: 20, borderRadius: "var(--radius-4xl)",
        border: "1.5px solid " + (selected ? "var(--accent-default)" : "var(--border-strong)"),
        background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <span data-radio-dot style={{
          width: 10, height: 10, borderRadius: "var(--radius-4xl)", background: "var(--accent-default)",
        }} />}
      </span>

      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: "var(--text-3xl)", fontWeight: "var(--font-weight-medium)",
          color: "var(--text-default)", letterSpacing: "-0.01em", marginBottom: "var(--spacing-4)",
        }}>{product.name}</div>
        <p style={{
          margin: 0, paddingBottom: "var(--spacing-2)", borderBottom: "1px solid var(--border-default)",
          fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)",
        }}>{meta.claim}</p>
        <p style={{
          margin: "var(--spacing-2) 0 0", paddingBottom: "var(--spacing-2)",
          borderBottom: "1px solid var(--border-default)",
          fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--accent-strong)",
        }}>{meta.highlight}</p>
        <p style={{
          margin: "var(--spacing-2) 0 0", fontSize: "var(--text-xs)",
          lineHeight: 1.5, color: "var(--text-muted)",
        }}>{meta.proof}</p>
      </div>

      <img src={uploads + "/" + product.img} alt="" width="440" height="800" aria-hidden="true"
        style={{ display: "block", width: "100%", height: "auto", alignSelf: "center" }} />
    </div>
  );
}

// ---- Step 2: plan --------------------------------------------------------
// Dark glass card whose CTA pill straddles the bottom edge. The pill is
// position:absolute and the card carries matching bottom padding to reserve its
// room — laying it out in flow instead would let a long price string change the
// card's height and break the 2×2 grid's alignment.
function CartPlanCard({ plan, selected, onSelect }) {
  const [hover, setHover] = React.useState(false);
  const rootRef = React.useRef(null);
  // "Most Popular" gets the standard recommended-plan treatment, which every
  // pricing-page guide describes as STACKED cues rather than one — badge plus a
  // distinct ground plus a taller card plus elevation (UX Planet, Smashing,
  // htmlburger). Measured here, one cue alone would not have carried it: the
  // featured ground against its siblings is only 2.34:1, well under the 3.0 a
  // non-text UI distinction needs, so colour by itself is invisible to anyone
  // with reduced colour vision. Four cues together are unmissable:
  //   1. a full-width ribbon header, not a pill floating on the card's edge —
  //      the pill version measured 1.26:1 against the cream page behind it,
  //      i.e. it disappeared exactly where it overhung the card
  //   2. --accent-strong ground where the others are near-black glass
  //   3. the card sits 14px proud of the row and is 14px taller for it
  //   4. shadow-lg against the siblings' flat ground, and an inverted white CTA
  // The guides also warn against making this feel like pressure, so the ribbon
  // stays a plain label — no flame, no countdown, no colour outside the palette.
  const featured = plan.badge === "Most Popular";
  return (
    <div className={"cart-plan" + (featured ? " is-featured" : "")} ref={rootRef}
      onMouseEnter={() => cartCardHover(rootRef.current, true, -6)}
      onMouseLeave={() => cartCardHover(rootRef.current, false)}
      style={{ position: "relative", paddingBottom: 22, marginTop: featured ? -14 : 0 }}>
      <div style={{
        background: featured ? "var(--accent-strong)" : "var(--glass-solid)",
        borderRadius: "var(--radius-xl)", overflow: "hidden",
        // White, not accent: this ring has to read on BOTH grounds, and an
        // accent ring on the accent-strong featured card would vanish into it.
        outline: selected ? "2px solid var(--color-white)" : "2px solid transparent",
        outlineOffset: 2,
        boxShadow: featured ? "var(--shadow-lg)" : "none",
        minHeight: 178, display: "flex", flexDirection: "column",
        color: "var(--color-white)",
        transition: "outline-color var(--transition-base) var(--ease-in-out)",
      }}>
        {plan.badge && <div style={{
          background: featured ? "var(--accent-subtle)" : "var(--bg-secondary)",
          color: featured ? "var(--accent-onSubtle)" : "var(--text-default)",
          padding: "var(--spacing-2) var(--spacing-3)", textAlign: "center",
          fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-bold)",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>{plan.badge}</div>}

        <div style={{
          flex: 1, padding: "var(--spacing-6) var(--spacing-5) 46px",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        }}>
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
            opacity: 0.8, marginBottom: "var(--spacing-3)",
          }}>{plan.supplyWeeks} Week Supply</div>
          <div style={{
            fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-bold)",
            lineHeight: 1.2, marginBottom: "var(--spacing-3)",
          }}>{plan.title}</div>
          <p style={{
            margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, opacity: 0.85, maxWidth: "18em",
          }}>{plan.blurb}</p>
        </div>
      </div>

      <button type="button" onClick={onSelect}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)",
          width: "min(88%, 260px)", cursor: "pointer", border: 0,
          // Inverted on the featured card: a blue pill on the blue ground would
          // be the one element that got LESS prominent by being featured.
          background: featured
            ? "var(--color-white)"
            : (hover ? "var(--accent-hover)" : "var(--accent-default)"),
          color: featured ? "var(--accent-strong)" : "var(--color-white)",
          borderRadius: "var(--radius-4xl)",
          padding: "var(--spacing-2) var(--spacing-4)",
          font: "var(--font-weight-semibold) var(--text-xs)/1.35 var(--font-family-base)",
          boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
          transition: "background var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
        }}>
        <span style={{ display: "block" }}>Select Plan</span>
        <span style={{ display: "block" }}>{plan.ctaPrice}</span>
      </button>
    </div>
  );
}

// ---- Shared bits ---------------------------------------------------------
function CartCheckLine({ label }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-2)" }}>
      <span aria-hidden="true" style={{ color: "var(--accent-strong)", flex: "none", marginTop: 2 }}>
        {/* Note: this path ends at (20, 7). CLAUDE.md §5 — do NOT merge it with
            the visually similar `M4 12.5l5 5 11-12`, which ends at (20, 5.5). */}
        <Icon size={14} strokeWidth={2.4}><path d="M4 12.5l5 5L20 7" /></Icon>
      </span>
      <span style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>{label}</span>
    </li>
  );
}

// Payment-brand chip. The brand's own colors come from .pay-* rules in
// cart.html. TODO(brand): these are typographic stand-ins — swap in the
// official Visa/Mastercard/Amex/etc. artwork before launch, each network's
// brand guidelines require their real mark.
function PayMark({ brand }) {
  if (brand === "mastercard") {
    return (
      <span className="pay-chip pay-mastercard" role="img" aria-label="Mastercard">
        <span className="pay-mc" aria-hidden="true"><i /><i /></span>
      </span>
    );
  }
  const LABEL = {
    visa: "VISA", amex: "AMEX", discover: "DISCOVER", applepay: " Pay",
    gpay: "G Pay", afterpay: "afterpay", klarna: "Klarna", affirm: "affirm",
  };
  const NAME = {
    visa: "Visa", amex: "American Express", discover: "Discover", applepay: "Apple Pay",
    gpay: "Google Pay", afterpay: "Afterpay", klarna: "Klarna", affirm: "Affirm",
  };
  return (
    <span className={"pay-chip pay-" + brand} role="img" aria-label={NAME[brand] || brand}>
      <span aria-hidden="true">{LABEL[brand] || brand}</span>
    </span>
  );
}

function PayRow({ brands, style }) {
  return (
    <div style={Object.assign({
      display: "flex", flexWrap: "wrap", gap: "var(--spacing-2)",
      alignItems: "center", justifyContent: "center",
    }, style)}>
      {brands.map((b) => <PayMark key={b} brand={b} />)}
    </div>
  );
}

// Text input. The label is always rendered — visually hidden when the design
// shows only a placeholder, because a placeholder is not a label: it vanishes
// on the first keystroke and is skipped by some screen readers.
function CartField({ id, label, placeholder, type = "text", value, onChange,
  autoComplete, inputMode, showLabel, trailing, required, style }) {
  return (
    <div style={Object.assign({ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }, style)}>
      <label htmlFor={id} className={showLabel ? undefined : "visually-hidden"} style={{
        fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-secondary)",
      }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* The real `required` attribute, not just a JS check: it is what the
            error styling keys off (so the optional address line never reddens)
            and what assistive tech announces. The form carries noValidate, so
            it does not also trigger the browser's own bubble. */}
        <input id={id} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} required={!!required}
          autoComplete={autoComplete} inputMode={inputMode} className="cart-input"
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "var(--spacing-3) var(--spacing-4)",
            paddingRight: trailing ? 132 : undefined,
            borderRadius: "var(--radius-lg)", border: "1px solid var(--border-default)",
            background: "var(--bg-elevated)", color: "var(--text-default)",
            font: "var(--font-weight-medium) var(--text-sm)/1.4 var(--font-family-base)",
          }} />
        {trailing && <span style={{
          position: "absolute", right: "var(--spacing-2)", display: "flex", gap: 4, pointerEvents: "none",
        }}>{trailing}</span>}
      </div>
    </div>
  );
}

// One "Label: value" line in the checkout summary panel. `was` renders the
// struck list figure ahead of the live one.
function CartSummaryRow({ label, value, was }) {
  return (
    <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.7, color: "var(--color-white)" }}>
      <span style={{ opacity: 0.85 }}>{label}: </span>
      {was && <span style={{ textDecoration: "line-through", opacity: 0.6, marginRight: 6 }}>{was}</span>}
      <span style={{ fontWeight: "var(--font-weight-bold)" }}>{value}</span>
    </div>
  );
}

Object.assign(window, {
  CartHeader, CartBack, CartStep, CartTreatmentCard, CartPlanCard,
  CartCheckLine, PayMark, PayRow, CartField, CartSummaryRow,
  cartReduced, cartCanHover, cartCardHover, cartSelectPop,
});
