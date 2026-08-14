// Chime Health — shopping cart flow.
// Two screens in one page, so state survives moving between them:
//   1. Select Treatment + Select Your Membership   (uploads/Shopping01.png)
//   2. Treatment summary + payment + checkout form (uploads/Shopping02.png)
// Requires: products.js → cart-data.js → Icon.jsx → Button.jsx → CartControls.jsx

// ---- Countdown -----------------------------------------------------------
// The mockup shows "Yours is reserved for 3:54 minutes". A hold that restarts
// on every reload would be theatre, so the deadline is stamped once per tab and
// kept in sessionStorage; reloading resumes the same countdown and it is allowed
// to reach 0:00. See the SCARCITY warning in cart-data.js.
const CART_HOLD_KEY = "chime.cart.holdUntil";

function useCartHold(seconds, enabled) {
  const [left, setLeft] = React.useState(seconds);
  React.useEffect(() => {
    if (!enabled) return undefined;
    let until = Number(sessionStorage.getItem(CART_HOLD_KEY));
    if (!until || !isFinite(until) || until - Date.now() > seconds * 1000) {
      until = Date.now() + seconds * 1000;
      sessionStorage.setItem(CART_HOLD_KEY, String(until));
    }
    const tick = () => setLeft(Math.max(0, Math.round((until - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [seconds, enabled]);
  return left;
}

const cartClock = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

// ---- Screen transition ---------------------------------------------------
// A real two-part transition, unlike the assessment's enter-only slide: the
// outgoing screen leaves before the incoming one is mounted, so the two never
// overlap and the scroll reset happens under cover of the blank frame instead
// of visibly jumping the page.
//
// Total ≈ 1.28s. The exit is the shorter half deliberately — the user has
// already committed by clicking, so waiting on the screen they are leaving is
// dead time, while the arrival is what should feel unhurried.
// power1.out on the way in, NOT a steeper ease: the assessment learned that a
// hard ease-out front-loads the travel, so a longer duration only stretches an
// invisible sub-pixel tail rather than reading as slower.
const CART_OUT = 0.38;
const CART_IN = 0.9;
const CART_SHIFT = 64; // px of horizontal travel each way

// ---- Screen 1 ------------------------------------------------------------
function CartSelectScreen({ treatments, product, meta, plans, planKey, onProduct, onPlan }) {
  const copy = window.CHIME_CART_COPY;
  const pay = window.CHIME_CART_PAYMENT;
  const uploads = window.CHIME_UPLOADS_BASE || "uploads";

  // Left/right arrows move between the two treatment cards, per the WAI-ARIA
  // radiogroup pattern — a radio group is one tab stop, not two.
  const cardRefs = React.useRef([]);
  const onCardKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); onProduct(treatments[i].id); return; }
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (i + step + treatments.length) % treatments.length;
    onProduct(treatments[next].id);
    // Focus moves WITH selection. Roving tabindex means the card just left
    // becomes tabindex="-1"; leaving the ring parked on it strands the user,
    // and a second arrow press would fire from the wrong index.
    if (cardRefs.current[next]) cardRefs.current[next].focus();
  };

  // The ladder is rebuilt when the treatment changes — four cards for GLP-1,
  // two for NAD+ — so it re-enters on a stagger rather than snapping. This is
  // the animation that carries the CONSEQUENCE of choosing a treatment; the pop
  // on the card itself only acknowledges the click.
  const plansRef = React.useRef(null);
  const plansMounted = React.useRef(false);
  React.useLayoutEffect(() => {
    const box = plansRef.current;
    if (!box) return undefined;
    // Skip the first pass: on load these cards are already arriving as part of
    // the screen's own enter tween, and stacking the two double-fades them.
    if (!plansMounted.current) { plansMounted.current = true; return undefined; }
    if (!window.gsap || window.cartReduced()) return undefined;
    const tween = window.gsap.fromTo(box.querySelectorAll(".cart-plan"),
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out", stagger: 0.08,
        clearProps: "transform,opacity,visibility" });
    return () => tween.kill();
  }, [product.id]);

  return (
    <React.Fragment>
      {/* Hero — the site's bento pattern (see ChimeWeightLossHero /
          ChimeWellnessHero): an accent text tile spanning 8 of 12 columns beside
          a 3:4 portrait media tile, same 1280 max-width, gap and 2xl radius.
          ONE deliberate difference from those two: the ground is --accent-strong
          rather than --accent-default. White on accent-default measures 3.91:1,
          which carries the 48px headline (large text, needs 3.0) but fails AA for
          the 20px and 14px lines under it. accent-strong takes white to 6.49:1
          and the tint to 5.12:1, so all three pass — and it is the same ground the
          assessment already paints for its accent screens.
          No CTA, unlike WL/Wellness: every way forward from here is a plan card
          further down, so a button in the tile would only compete with them.
          That is also why the media tile is 5:4 rather than their 3:4 — their
          tile height is set by a headline + sub + CTA + fine print, and against
          this page's three lines a 3:4 tile left the text standing in a third of
          its own panel. The tile is sized to the copy it actually has. */}
      <section className="cart-hero-section" data-screen-label="Cart Hero"
        aria-labelledby="cart-hero-title" style={{ background: "var(--bg-default)" }}>
        <div className="cart-hero-back">
          <CartBack label="Back to home" href="index.html" />
        </div>
        <div className="cart-bento">
          <div className="cart-tile-text">
            <div>
              <h1 id="cart-hero-title" tabIndex={-1}>{copy.heroTitle[0]}<br />{copy.heroTitle[1]}</h1>
              <p className="cart-hero-sub">{copy.heroSub}</p>
            </div>
            <p className="cart-hero-note">{copy.heroNote}</p>
          </div>
          <div className="cart-tile-media">
            {/* Same cut-out, srcset and alt the homepage Weight Loss section
                already ships — one asset, one description, two placements. */}
            <img className="cart-hero-model" src={uploads + "/wl01.webp"}
              srcSet={uploads + "/wl01-mobile.webp 590w, " + uploads + "/wl01.webp 960w"}
              sizes="(max-width: 960px) 74vw, 320px"
              alt="Smiling woman in a blue dress" />
          </div>
        </div>
      </section>

      <section className="cart-section" id="cart-step-1" data-screen-label="Cart Step 1"
        aria-labelledby="cart-step1-title">
        <div className="cart-wrap">
          <CartStep n={1} title="Select Treatment" id="cart-step1-title" />
          <div className="cart-treatments" role="radiogroup" aria-labelledby="cart-step1-title">
            {treatments.map((t, i) => (
              <CartTreatmentCard key={t.id} product={t.product} meta={t}
                selected={t.id === product.id}
                innerRef={(el) => { cardRefs.current[i] = el; }}
                onSelect={() => onProduct(t.id)}
                onKeyDown={(e) => onCardKey(e, i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="cart-section" aria-labelledby="cart-step2-title">
        <div className="cart-wrap">
          <CartStep n={2} title="Select Your Membership" id="cart-step2-title"
            sub={"Lock in your savings without a big upfront payment — use free financing or pay in full with your card."} />
          {/* Data-driven, so the ladder is however many terms the catalog quotes
              for this product: four for GLP-1, two for NAD+. The grid is
              auto-fit, not a hardcoded 2×2, precisely so a short ladder still
              centres instead of leaving a hole. */}
          <div className="cart-plans" ref={plansRef}>
            {plans.map((p) => (
              <CartPlanCard key={p.key} plan={p} selected={p.key === planKey}
                onSelect={() => onPlan(p.key)} />
            ))}
          </div>

          <div className="cart-includes">
            <h3>All Plans Include:</h3>
            <ul>{copy.includes.map((c) => <CartCheckLine key={c} label={c} />)}</ul>
          </div>

          <div className="cart-how">
            <h3>How It Works</h3>
            <p>{copy.howItWorks}</p>
          </div>

          <div className="cart-trust">
            <p className="cart-trust-label">All major credit cards accepted</p>
            <PayRow brands={pay.cards.concat(pay.wallets)} />
            <p className="cart-hsa">
              <span aria-hidden="true" style={{ color: "var(--accent-strong)", display: "flex" }}>
                <Icon size={18} strokeWidth={2.2}>
                  <circle cx="12" cy="12" r="10" /><path d="M8 12.5l2.5 2.5L16 9.5" />
                </Icon>
              </span>
              HSA/FSA Eligible
            </p>
            <p className="cart-trust-label" style={{ marginTop: "var(--spacing-6)" }}>Buy Now, Pay Later</p>
            <PayRow brands={pay.bnpl} />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

// ---- Screen 2 ------------------------------------------------------------
// `ladderPlan` is the plan as screen 1 quoted it; everything shown here is the
// post-code version, because this is the screen that announces the code.
function CartCheckoutScreen({ product, plan: ladderPlan, onBack }) {
  const copy = window.CHIME_CART_COPY;
  const promo = window.CHIME_CART_PROMO;
  const pay = window.CHIME_CART_PAYMENT;
  const uploads = window.CHIME_UPLOADS_BASE || "uploads";
  const plan = React.useMemo(() => window.chimeCartApplyPromo(ladderPlan), [ladderPlan]);

  const [method, setMethod] = React.useState("card");
  const [sameBilling, setSameBilling] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const [placed, setPlaced] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "", line1: "", line2: "", city: "", state: "", zip: "", phone: "",
    card: "", exp: "", cvc: "",
  });
  const set = (k) => (v) => setForm((f) => Object.assign({}, f, { [k]: v }));

  const hold = useCartHold(promo.holdSeconds, promo.enabled);
  // Float math on parsed currency: compare against half a cent, never === 0.
  // totalSavings, not savings — it is ladder + code, i.e. exactly the gap
  // between the struck figures and the live ones, so the two strikethroughs and
  // the "Total Savings" row can never disagree.
  const saves = plan.totalSavings > 0.005;

  // Card fields are only required when paying by card — a BNPL handoff collects
  // them on the provider's side, so demanding them here would block that path.
  const REQUIRED = ["name", "line1", "city", "state", "zip", "phone"];
  const CARD_REQUIRED = ["card", "exp", "cvc"];

  function onSubmit(e) {
    e.preventDefault();
    const need = REQUIRED.concat(method === "card" ? CARD_REQUIRED : []);
    const bad = {};
    need.forEach((k) => { if (!String(form[k]).trim()) bad[k] = true; });
    setErrors(bad);
    if (Object.keys(bad).length) {
      const first = document.getElementById("cart-" + need.filter((k) => bad[k])[0]);
      if (first) { first.focus(); first.scrollIntoView({ block: "center", behavior: "smooth" }); }
      return;
    }
    // TODO(checkout): POST to the real order endpoint. There is no backend in
    // this repo, so the payload is logged and the page shows the $0-due
    // confirmation. Card fields are intentionally NOT logged — never send raw
    // PAN through anything but the payment processor's own SDK/iframe.
    console.log("[cart] submit", {
      product: product.id, plan: plan.key, method: method,
      listTotal: plan.total, code: plan.promoApplied ? plan.promoCode : null,
      discount: plan.promoDiscount, total: plan.finalTotal,
      ship: { city: form.city, state: form.state, zip: form.zip },
    });
    setPlaced(true);
  }

  return (
    <React.Fragment>
      <section className="cart-band cart-band-checkout">
        <div className="cart-band-inner">
          <CartBack label="Back to plan selection" onClick={onBack} />
          <div className="cart-summary">
            {/* The badge travels with the choice. Whatever ribbon was on the card
                the user clicked reappears here, in the same colours and the same
                position, so screen 2 confirms the plan they picked rather than
                describing an unlabelled one.
                The card's GROUND deliberately does not follow the featured plan
                card's --accent-strong: that colour earned its keep on screen 1 by
                contrasting with three sibling cards, and there are no siblings
                here — against this screen's light blue band a lighter card would
                only lose separation. The ribbon is the part that carries
                recognition, so the ribbon is the part that travels. */}
            {plan.badge && <div className={"cart-summary-ribbon"
              + (plan.badge === "Most Popular" ? " is-featured" : "")}>{plan.badge}</div>}
            <h1 className="cart-summary-title" tabIndex={-1}>Your Treatment Details</h1>

            <div className="cart-summary-panel">
              <img src={uploads + "/" + product.img} alt="" width="440" height="800" aria-hidden="true" />
              <div>
                <CartSummaryRow label="Medication" value={product.name} />
                <CartSummaryRow label="Delivery Plan" value={plan.title.replace("Membership", "Plan")} />
                {saves && <CartSummaryRow label="Total Savings" value={plan.totalSavingsLabel} />}
                <CartSummaryRow label="Shipping" value="FREE" />
                <CartSummaryRow label="Monthly Price" value={plan.finalPerMonthLabel}
                  was={saves ? plan.listRateLabel : null} />
                <CartSummaryRow label="Total if prescribed" value={plan.finalTotalLabel}
                  was={saves ? plan.listTotalLabel : null} />
              </div>
            </div>

            {saves && <p className="cart-saving-line">
              You are saving <strong>{plan.totalSavingsLabel}</strong> vs monthly with your exclusive plan
            </p>}

            {/* The chip is gated on the code actually having been applied, not
                on the promo merely being switched on — announcing "CODE APPLIED"
                over a total the code did not touch (the 1-month plan, which the
                offer excludes) is exactly the claim this page must not make. */}
            {plan.promoApplied && <React.Fragment>
              <p className="cart-code">CODE APPLIED: {plan.promoCode}</p>
              <p className="cart-hold">
                Only {promo.discountsLeft} discounts left.{" "}
                {hold > 0
                  ? <React.Fragment>Yours is reserved for <span aria-live="off">{cartClock(hold)}</span> minutes</React.Fragment>
                  : "Your hold has expired — pricing may change."}
              </p>
            </React.Fragment>}

            <ul className="cart-assurances">
              {copy.assurances.map((a) => <li key={a}>{a}</li>)}
            </ul>

            <div className="cart-due">
              <p className="cart-due-title">{copy.dueToday}</p>
              <p className="cart-due-note">{copy.dueTodayNote}</p>
            </div>
          </div>
          <p className="cart-hipaa">{copy.hipaaNote}</p>
        </div>
      </section>

      {placed ? (
        <section className="cart-section">
          <div className="cart-wrap cart-placed" role="status">
            <span aria-hidden="true" style={{ color: "var(--success-default)", display: "flex", justifyContent: "center" }}>
              <Icon size={44} strokeWidth={1.8}>
                <circle cx="12" cy="12" r="10" /><path d="M8 12.5l2.5 2.5L16 9.5" />
              </Icon>
            </span>
            <h2>Your request is in</h2>
            <p>
              A licensed provider will review your intake. Nothing has been charged
              — your card is only charged if your prescription is approved.
            </p>
            <p className="cart-placed-sum">
              {product.name} · {plan.title} · {plan.finalTotalLabel}
            </p>
            <Button label="Back to home" onClick={() => { window.location.href = "index.html"; }} />
          </div>
        </section>
      ) : (
        <form className="cart-section" onSubmit={onSubmit} noValidate>
          <div className="cart-wrap">
            <h2 className="cart-h2" id="cart-pay-title">Choose Payment Method</h2>
            {/* Two exclusive options, so radios again — and the wrapping <label>
                means the whole tile is the hit target without any extra JS. */}
            <div className="cart-methods" role="radiogroup" aria-labelledby="cart-pay-title">
              <label className={"cart-method" + (method === "card" ? " is-on" : "")}>
                <input type="radio" name="cart-method" value="card" className="visually-hidden"
                  checked={method === "card"} onChange={() => setMethod("card")} />
                <span className="cart-method-title">Cards &amp; Wallets</span>
                <PayRow brands={pay.cards} />
              </label>
              <label className={"cart-method" + (method === "bnpl" ? " is-on" : "")}>
                <input type="radio" name="cart-method" value="bnpl" className="visually-hidden"
                  checked={method === "bnpl"} onChange={() => setMethod("bnpl")} />
                <span className="cart-method-title">Buy Now, Pay Later</span>
                <PayRow brands={pay.bnpl} />
              </label>
            </div>

            <h2 className="cart-h2">Enter Your Shipping Address</h2>
            <p className="cart-h2-sub">Your privacy guaranteed</p>
            <div className={"cart-form" + (Object.keys(errors).length ? " has-error" : "")}>
              <CartField required id="cart-name" label="Full name" placeholder="Full name"
                value={form.name} onChange={set("name")} autoComplete="name" />
              <CartField required id="cart-line1" label="Address line 1" placeholder="Address line 1"
                value={form.line1} onChange={set("line1")} autoComplete="address-line1" />
              <CartField id="cart-line2" label="Address line 2 (optional)" placeholder="Address line 2"
                value={form.line2} onChange={set("line2")} autoComplete="address-line2" />
              <CartField required id="cart-city" label="City" placeholder="City"
                value={form.city} onChange={set("city")} autoComplete="address-level2" />
              <div className="cart-row-2">
                <CartField required id="cart-state" label="State" placeholder="State"
                  value={form.state} onChange={set("state")} autoComplete="address-level1" />
                <CartField required id="cart-zip" label="ZIP" placeholder="ZIP"
                  value={form.zip} onChange={set("zip")} autoComplete="postal-code" inputMode="numeric" />
              </div>
              <CartField required id="cart-phone" label="Phone number" placeholder="Phone number"
                value={form.phone} onChange={set("phone")} autoComplete="tel" type="tel" inputMode="tel" />
            </div>

            {method === "card" ? (
              <React.Fragment>
                <h2 className="cart-h2">Enter Your Card Details</h2>
                <div className={"cart-form cart-form-card" + (Object.keys(errors).length ? " has-error" : "")}>
                  <CartField required id="cart-card" label="Card number" showLabel placeholder="1234 1234 1234 1234"
                    value={form.card} onChange={set("card")} autoComplete="cc-number" inputMode="numeric"
                    trailing={pay.cards.map((b) => <PayMark key={b} brand={b} />)} />
                  <div className="cart-row-2">
                    <CartField required id="cart-exp" label="Expiration Date" showLabel placeholder="MM / YY"
                      value={form.exp} onChange={set("exp")} autoComplete="cc-exp" inputMode="numeric" />
                    <CartField required id="cart-cvc" label="Security Code" showLabel placeholder="CVC"
                      value={form.cvc} onChange={set("cvc")} autoComplete="cc-csc" inputMode="numeric" />
                  </div>
                  <label className="cart-check">
                    <input type="checkbox" checked={sameBilling} onChange={(e) => setSameBilling(e.target.checked)} />
                    Billing is same as shipping information
                  </label>
                  <p className="cart-fine">
                    By providing your card information, you allow Chime Health to charge
                    your card for future payments in accordance with their terms.
                  </p>
                </div>
              </React.Fragment>
            ) : (
              <p className="cart-bnpl-note">
                You&rsquo;ll be handed off to your chosen provider to complete payment
                after your prescription is approved. Nothing is charged today.
              </p>
            )}

            {!!Object.keys(errors).length && <p className="cart-error" role="alert">
              Please complete the highlighted fields.
            </p>}

            <div className="cart-submit">
              <Button label="Continue" onClick={onSubmit} />
              <p className="cart-secure">Your payment information is secure and encrypted.</p>
            </div>

            <p className="cart-legal">{window.CHIME_CART_LEGAL}</p>
          </div>
        </form>
      )}
    </React.Fragment>
  );
}

// ---- Flow ----------------------------------------------------------------
function ChimeCartFlow() {
  // Treatments are resolved from the catalog at mount; an id with no catalog
  // row is dropped rather than rendered as a blank card.
  const treatments = React.useMemo(() => (
    (window.CHIME_CART_TREATMENTS || [])
      .map((t) => Object.assign({}, t, { product: window.chimeCartProduct(t.id) }))
      .filter((t) => t.product)
  ), []);

  const [step, setStep] = React.useState(1);
  const [productId, setProductId] = React.useState(treatments.length ? treatments[0].id : null);
  const [planKey, setPlanKey] = React.useState(null);

  const entry = treatments.filter((t) => t.id === productId)[0] || treatments[0];
  const product = entry && entry.product;
  const plans = React.useMemo(() => (product ? window.chimeCartPlans(product) : []), [product]);
  const plan = plans.filter((p) => p.key === planKey)[0] || null;

  const screenRef = React.useRef(null);
  const dirRef = React.useRef(1);      // 1 = forward, -1 = back
  const busyRef = React.useRef(false); // one transition at a time
  const stepRef = React.useRef(1);     // read inside listeners without re-binding
  const navigatedRef = React.useRef(false);
  const [announce, setAnnounce] = React.useState("");
  stepRef.current = step;

  // Switching treatment clears the plan: NAD+ has no 6-month or 1-year term, so
  // a key carried over from GLP-1 would silently resolve to nothing.
  const onProduct = (id) => { setProductId(id); setPlanKey(null); };

  // Animate the current screen out, swap, then let the layout effect below
  // bring the next one in. `apply` runs at the hinge, while nothing is visible.
  function animateTo(next, dir, apply) {
    if (busyRef.current) return;
    dirRef.current = dir;
    navigatedRef.current = true;
    const el = screenRef.current;
    const swap = () => {
      apply && apply();
      setStep(next);
      window.scrollTo({ top: 0, behavior: "auto" });
      // Screen changes are invisible to a screen reader otherwise — nothing
      // navigates, so nothing is announced. The heading also takes focus (see
      // the layout effect); this covers the gap before that lands.
      setAnnounce(next === 2
        ? "Step 2 of 2. Your treatment details and checkout."
        : "Step 1 of 2. Choose your treatment and membership.");
    };
    if (!window.gsap || !el || window.cartReduced()) { swap(); return; }
    busyRef.current = true;
    window.gsap.to(el, {
      x: -dir * CART_SHIFT, autoAlpha: 0,
      duration: CART_OUT, ease: "power2.in",
      onComplete: () => { busyRef.current = false; swap(); },
    });
  }

  // Same transition, plus a history entry — so the browser Back button returns
  // to plan selection instead of leaving the site. Without this, Back from
  // checkout unloads the page and takes every field the user has typed with it.
  function goTo(next, dir, apply) {
    if (busyRef.current) return;
    if (window.history && window.history.pushState) {
      window.history.pushState({ cartStep: next }, "",
        next === 2 ? "#checkout" : window.location.pathname);
    }
    animateTo(next, dir, apply);
  }

  const onPlan = (key) => goTo(2, 1, () => setPlanKey(key));
  const onBack = () => goTo(1, -1);

  // Back/Forward. popstate must NOT push again — it is reporting a move the
  // browser has already made.
  React.useEffect(() => {
    // Seed the entry so the first Back has somewhere to land rather than
    // popping straight out of the page.
    if (window.history && window.history.replaceState) {
      window.history.replaceState({ cartStep: 1 }, "", window.location.pathname);
    }
    const onPop = (e) => {
      const next = (e.state && e.state.cartStep) || 1;
      if (next === stepRef.current) return;
      animateTo(next, next > stepRef.current ? 1 : -1);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Enter tween. useLayoutEffect so the first painted frame is already offset —
  // a useEffect here shows one unanimated frame at rest first, which reads as a
  // flash. clearProps hands the node back with no inline transform/opacity, so
  // the rendered-DOM diffs CLAUDE.md §4 relies on stay clean.
  React.useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return undefined;
    if (!window.gsap || window.cartReduced()) {
      // GSAP absent or motion suppressed: make sure a killed tween never leaves
      // the screen stuck at autoAlpha 0.
      el.style.removeProperty("opacity");
      el.style.removeProperty("visibility");
      el.style.removeProperty("transform");
      return undefined;
    }
    const tween = window.gsap.fromTo(el,
      { x: dirRef.current * CART_SHIFT, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: CART_IN, ease: "power1.out",
        clearProps: "transform,opacity,visibility" });
    return () => tween.kill();
  }, [step]);

  // Focus follows the screen. Without this the browser drops focus on <body>
  // after the swap, so a keyboard user's next Tab restarts from the top of the
  // document and a screen-reader user is left reading the old screen's context.
  // Only after a real navigation — stealing focus on first paint would yank a
  // visitor past the hero they have not read yet.
  React.useEffect(() => {
    if (!navigatedRef.current || !screenRef.current) return;
    const h = screenRef.current.querySelector("h1");
    // preventScroll: the swap has already put the page at the top, and letting
    // focus scroll again fights that.
    if (h) h.focus({ preventScroll: true });
  }, [step]);

  if (!product) {
    return <p style={{ padding: "var(--spacing-16)", textAlign: "center" }}>
      No treatments are available right now.
    </p>;
  }

  return (
    <main className="cart-viewport">
      {/* Announces the screen change. Outside the sliding element on purpose:
          a live region that is itself moved and faded by GSAP can be missed. */}
      <p className="visually-hidden" role="status" aria-live="polite">{announce}</p>
      <div ref={screenRef} className={window.gsap ? "cart-screen" : "cart-screen cart-anim"}>
        {step === 2 && plan
          ? <CartCheckoutScreen product={product} plan={plan} onBack={onBack} />
          : <CartSelectScreen treatments={treatments} product={product} meta={entry}
              plans={plans} planKey={planKey} onProduct={onProduct} onPlan={onPlan} />}
      </div>
    </main>
  );
}

Object.assign(window, { ChimeCartFlow, CartSelectScreen, CartCheckoutScreen });
