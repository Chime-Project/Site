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
      // spacing-3, not spacing-2: at 8px the 22px icon gave a 38px target, under
      // the 44px touch recommendation (it cleared WCAG 2.5.8's 24px floor, but
      // this is the only way back on a phone). 12px takes it to 46px.
      background: "none", border: 0, padding: "var(--spacing-3)", margin: "0 0 0 calc(var(--spacing-3) * -1)",
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
// A CHECKBOX, not a radio: a basket can hold more than one treatment. That is
// also why the indicator is a square with a tick rather than the mockup's
// circle — a ring of round dots is the one shape every interface on earth uses
// to mean "pick exactly one", so leaving it round would promise single-select
// and then behave otherwise. The whole card stays the hit target.
//
// Each checkbox is its own tab stop (tabIndex 0), unlike the roving tabindex a
// radiogroup needs — arrow keys no longer move selection, because in a checkbox
// group they do not select anything.
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
    <div role="checkbox" aria-checked={selected} tabIndex={0}
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
        width: 20, height: 20, borderRadius: "var(--radius-md)",
        border: "1.5px solid " + (selected ? "var(--accent-default)" : "var(--border-strong)"),
        background: selected ? "var(--accent-default)" : "var(--bg-elevated)",
        color: "var(--color-white)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background var(--transition-base) var(--ease-in-out)",
      }}>
        {/* Filled box + white tick, so the checked state reads at a glance and
            not only by the 1.5px border changing colour.
            CLAUDE.md §5 — this path ends at (20, 7). Do NOT merge it with the
            similar `M4 12.5l5 5 11-12`, which ends at (20, 5.5). */}
        {selected && <span data-check-tick style={{ display: "flex" }}>
          <Icon size={13} strokeWidth={3}><path d="M4 12.5l5 5L20 7" /></Icon>
        </span>}
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

// ---- Step 2: one configurator per chosen treatment -----------------------
// This replaces the old ladder of large plan cards. That ladder worked for a
// single treatment and fell apart at two: six near-identical cards, 973px
// between the step heading and the button that ends it, and the same chrome
// repeated for every term. Measured before the change, with both treatments in
// the basket.
//
// The research all points the same way (see the plan doc):
//   · Shopify's subscription guidance — show every option when there are four
//     or fewer, stack them, and never hide the option names. Our ladders are 2
//     and 4 terms, so all of them stay visible; what changes is that a term is
//     now an OPTION, not a card.
//   · NN/g on stating differences explicitly — our terms differ on duration and
//     price alone. Everything else the old card repeated (blurb, layout, the
//     includes) is shared, and the shared copy already lives once at the bottom
//     of the step.
//   · Per-unit pricing (Baymard) and per-month framing (RevenueCat) — the rate
//     per month is the only figure that compares two terms honestly, and it was
//     the one figure the old cards never showed.
//
// So: term picker up top carrying the comparable rate, and full detail for the
// SELECTED term only.
function CartTermOption({ plan, selected, badge, onSelect }) {
  return (
    <button type="button" role="radio" aria-checked={selected}
      tabIndex={selected ? 0 : -1} onClick={onSelect}
      className={"cart-term" + (selected ? " is-on" : "")}>
      <span className="cart-term-name">{plan.term}</span>
      {/* The comparable figure, on every option, so the terms can be read
          against each other without selecting each one in turn. */}
      <span className="cart-term-rate">{plan.perMonthLabel}<i>/mo</i></span>
      {badge && <span className="cart-term-badge">{badge}</span>}
    </button>
  );
}

// `badges` maps a plan key to the superlative this panel may show, and it is
// RESOLVED BY THE CALLER before render (see chimeCartBadges). An earlier pass
// threaded a shared Set through the panels and mutated it while rendering,
// which is a side effect in render: React is free to render a component more
// than once, and the second pass found the badge already claimed and printed
// nothing at all. The component tests caught it — the live page hid it, because
// the parent rebuilt the Set on every render.
function CartTreatmentConfig({ entry, badges, onPlan, onRemove }) {
  const uploads = window.CHIME_UPLOADS_BASE || "uploads";
  const { product, meta, plans, plan } = entry;
  const rootRef = React.useRef(null);
  const listRef = React.useRef(null);

  // Arrow keys move between terms — these ARE mutually exclusive, so unlike the
  // treatment checkboxes above, the radiogroup pattern is the correct one here.
  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step || !plans.length) return;
    e.preventDefault();
    const at = plans.findIndex((p) => plan && p.key === plan.key);
    const next = plans[((at < 0 ? 0 : at) + step + plans.length) % plans.length];
    onPlan(next.key);
    const btns = listRef.current ? listRef.current.querySelectorAll(".cart-term") : [];
    const idx = plans.indexOf(next);
    if (btns[idx]) btns[idx].focus();
  };

  return (
    <div className="cart-config" ref={rootRef}>
      <div className="cart-config-head">
        <img className="cart-config-vial" src={uploads + "/" + product.img}
          alt="" width="440" height="800" aria-hidden="true" />
        <div className="cart-config-id">
          <h3 className="cart-config-name">{product.name}</h3>
          <p className="cart-config-claim">{meta.claim}</p>
        </div>
        <button type="button" className="cart-config-remove" onClick={onRemove}>
          Remove<span className="visually-hidden"> {product.name} from your order</span>
        </button>
      </div>

      <div className="cart-terms" role="radiogroup" ref={listRef} onKeyDown={onKey}
        aria-label={"Membership term for " + product.name}>
        {plans.map((p) => (
          <CartTermOption key={p.key} plan={p} badge={(badges || {})[p.key] || null}
            selected={!!plan && p.key === plan.key} onSelect={() => onPlan(p.key)} />
        ))}
      </div>

      {plan ? (
        // Detail for the chosen term only — and ONLY what the option above does
        // not already say. An earlier pass repeated the per-month rate here at
        // display size, which is the exact duplication this rework exists to
        // remove: the selected option already carries that figure, in accent, on
        // a highlighted ground. What is left is the commitment itself — the sum
        // actually charged (a per-month figure without it is the dishonest half
        // of that framing), the free month, and the saving in dollars rather
        // than a percentage, checkable against the rate on the option.
        <p className="cart-config-detail">
          Billed as <b>{plan.totalLabel}</b>
          {plan.freeMonths > 0 && <React.Fragment>
            {" · "}<b className="is-free">{plan.freeMonths} month{plan.freeMonths > 1 ? "s" : ""} free</b>
          </React.Fragment>}
          {plan.savings > 0.005 && <React.Fragment>
            {" · "}<b className="is-save">Save {plan.savingsLabel}</b>
            <span className="cart-config-vs"> vs {plan.listRateLabel}/mo month to month</span>
          </React.Fragment>}
        </p>
      ) : (
        <p className="cart-config-prompt">Choose a term for {product.name}.</p>
      )}
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
  autoComplete, inputMode, showLabel, trailing, required, invalid, errorId, style }) {
  return (
    <div style={Object.assign({ display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }, style)}>
      <label htmlFor={id} className={showLabel ? undefined : "visually-hidden"} style={{
        fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-secondary)",
      }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* The real `required` attribute, not just a JS check: it is what the
            error styling keys off (so the optional address line never reddens)
            and what assistive tech announces. The form carries noValidate, so
            it does not also trigger the browser's own bubble.
            aria-invalid is what makes the failure perceivable without sight: the
            red border is the ONLY other signal, and "complete the highlighted
            fields" is useless to someone who cannot see the highlight. */}
        <input id={id} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} required={!!required}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={invalid && errorId ? errorId : undefined}
          autoComplete={autoComplete} inputMode={inputMode}
          className={"cart-input" + (trailing ? " has-marks" : "")}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "var(--spacing-3) var(--spacing-4)",
            // Inline, so cart.html's phone rule has to override it with
            // !important — same pattern MembershipPanel documents for its
            // mobile collapse. The marks are dropped below 620px; see there.
            paddingRight: trailing ? 132 : undefined,
            borderRadius: "var(--radius-lg)", border: "1px solid var(--border-default)",
            background: "var(--bg-elevated)", color: "var(--text-default)",
            font: "var(--font-weight-medium) var(--text-sm)/1.4 var(--font-family-base)",
          }} />
        {trailing && <span className="cart-input-marks" style={{
          position: "absolute", right: "var(--spacing-2)", display: "flex", gap: 4, pointerEvents: "none",
        }}>{trailing}</span>}
      </div>
    </div>
  );
}

// ---- Discount code -------------------------------------------------------
// Collapsed behind a plain text toggle, deliberately. Baymard's repeated
// finding on coupon fields is that a prominent one sends customers OFF the
// page to hunt for a code they do not have, and a good share never come back —
// so the field is available to anyone who has one and invisible to everyone
// else. It sits with the order total rather than at the top of the step,
// because that is where the figure it changes lives.
//
// The applied state replaces the form outright: leaving an editable field
// beside an applied code invites a second submission and raises the question
// of whether codes stack, which they do not (one entered code at a time).
function CartCodeField({ applied, percent, error, onApply, onClear }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (applied) {
    return (
      <p className="cart-code-on">
        <span>
          <b>{applied}</b> applied — {percent}% off
        </span>
        <button type="button" className="cart-code-clear" onClick={() => { setValue(""); onClear(); }}>
          Remove<span className="visually-hidden"> discount code {applied}</span>
        </button>
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className="cart-code-toggle" onClick={() => setOpen(true)}>
        Have a discount code?
      </button>
    );
  }

  return (
    // A real <form>, so Enter submits — typing a code and pressing return is
    // the whole interaction, and a div would swallow it.
    <form className="cart-code-form" onSubmit={(e) => { e.preventDefault(); onApply(value); }}>
      <label className="visually-hidden" htmlFor="cart-code">Discount code</label>
      <input id="cart-code" ref={inputRef} className="cart-input cart-code-input"
        value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="Enter code" autoComplete="off" autoCapitalize="characters"
        spellCheck="false"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "cart-code-error" : undefined} />
      <Button label="Apply" size="compact" variant="secondary" type="submit"
        onClick={() => onApply(value)} />
      {/* role=alert, because a failed code is only otherwise signalled by the
          field's red border — useless to anyone not looking at it. */}
      {error && <p className="cart-code-error" id="cart-code-error" role="alert">{error}</p>}
    </form>
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

// ---- Hold sticker --------------------------------------------------------
// The reserved-hold countdown, drawn as a die-cut discount seal. Built as a
// polygon rather than a stack of rotated squares or a conic-gradient: one
// <polygon> is a single paint at any size, and the spikes stay crisp when the
// sticker scales, where a gradient's edges alias.
//
// 24 spikes, outer 50 / inner 41.5 on a 100-unit box. Fewer spikes read as a
// star (a rating, not a price tag); a shallower inner radius reads as a gear.
const CART_STICKER_POINTS = (() => {
  const spikes = 24;
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 ? 41.5 : 50;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push((50 + r * Math.cos(a)).toFixed(2) + "," + (50 + r * Math.sin(a)).toFixed(2));
  }
  return pts.join(" ");
})();

// `time` arrives preformatted — the clock lives in CartFlow with the state that
// drives it, so this stays presentational like everything else in this file.
//
// The whole sticker is one role="timer", whose implicit live setting is off:
// the accessible name is rebuilt every second, but silently. Announcing each
// tick would make the card unusable with a screen reader on, and the inner
// text is aria-hidden so the digits are never read twice.
function CartHoldSticker({ time, expired }) {
  return (
    <div className={"cart-sticker" + (expired ? " is-expired" : "")}
      role="timer" aria-live="off"
      aria-label={expired
        ? "Your hold has expired"
        : "Your discount is reserved for " + time + " minutes"}>
      <svg className="cart-sticker-burst" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <polygon points={CART_STICKER_POINTS} />
      </svg>
      <span className="cart-sticker-text" aria-hidden="true">
        {expired ? (
          <React.Fragment>
            <b className="cart-sticker-lead">HOLD</b>
            <b className="cart-sticker-time is-word">EXPIRED</b>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <b className="cart-sticker-lead">RESERVED</b>
            <b className="cart-sticker-time">{time}</b>
            <b className="cart-sticker-foot">MIN LEFT</b>
          </React.Fragment>
        )}
      </span>
    </div>
  );
}

Object.assign(window, {
  CartHeader, CartBack, CartStep, CartTreatmentCard,
  CartTermOption, CartTreatmentConfig, CartCodeField,
  CartCheckLine, PayMark, PayRow, CartField, CartSummaryRow, CartHoldSticker,
  cartReduced, cartCanHover, cartCardHover, cartSelectPop,
});
