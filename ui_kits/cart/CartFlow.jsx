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
function CartSelectScreen({ treatments, basket, ready, order, onToggle, onPlan, onCheckout,
  codeError, onApplyCode, onClearCode }) {
  const copy = window.CHIME_CART_COPY;
  const pay = window.CHIME_CART_PAYMENT;
  const uploads = window.CHIME_UPLOADS_BASE || "uploads";
  // Resolved once per basket change, never during a panel's render.
  const badges = React.useMemo(() => window.chimeCartBadges(basket), [basket]);
  // Does anything actually come off this order? Both flags, because the two
  // discounts are independent: the 1-month plan qualifies for neither, a
  // 3-month plan gets the automatic one with no code typed, and a typed code
  // can land on an order the automatic promo skipped.
  const hasDiscount = order.promoApplied || order.codeApplied;

  // Space/Enter toggle, per the WAI-ARIA checkbox pattern. Arrow keys are gone
  // on purpose — they move selection in a RADIO group, and doing that here
  // would tick and untick boxes as someone merely navigated past them.
  const cardRefs = React.useRef([]);
  const onCardKey = (e, i) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle(treatments[i].id); }
  };

  // Each treatment's ladder animates in when that treatment is added — four
  // cards for GLP-1, two for NAD+. Keyed by the basket's shape rather than one
  // product id, so adding a second treatment staggers only the ladder that
  // actually appeared instead of replaying every ladder on screen.
  const plansRef = React.useRef(null);
  const plansMounted = React.useRef(false);
  const basketKey = basket.map((b) => b.id).join(",");
  React.useLayoutEffect(() => {
    const box = plansRef.current;
    if (!box) return undefined;
    // Skip the first pass: on load these cards are already arriving as part of
    // the screen's own enter tween, and stacking the two double-fades them.
    if (!plansMounted.current) { plansMounted.current = true; return undefined; }
    if (!window.gsap || window.cartReduced()) return undefined;
    const tween = window.gsap.fromTo(box.querySelectorAll(".cart-config"),
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out", stagger: 0.08,
        clearProps: "transform,opacity,visibility" });
    return () => tween.kill();
  }, [basketKey]);

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
          <CartStep n={1} title="Select Treatments" id="cart-step1-title"
            sub="Add as many as you want — each one gets its own membership term." />
          {/* A group, not a radiogroup: more than one may be checked. */}
          <div className="cart-treatments" role="group" aria-labelledby="cart-step1-title">
            {treatments.map((t, i) => (
              <CartTreatmentCard key={t.id} product={t.product} meta={t}
                selected={basket.some((b) => b.id === t.id)}
                innerRef={(el) => { cardRefs.current[i] = el; }}
                onSelect={() => onToggle(t.id)}
                onKeyDown={(e) => onCardKey(e, i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="cart-section" aria-labelledby="cart-step2-title">
        <div className="cart-wrap">
          <CartStep n={2} title="Select Your Membership" id="cart-step2-title"
            sub={"Lock in your savings without a big upfront payment — use free financing or pay in full with your card."} />
          {/* One configurator per chosen treatment. Badges are resolved across
              the WHOLE step first (see chimeCartBadges), which is what makes
              "one superlative per screen" a rule rather than a per-ladder
              accident — and keeps the resolution out of render. */}
          <div className="cart-configs" ref={plansRef}>
            {basket.length === 0 && <p className="cart-empty">
              Pick at least one treatment above to see its membership options.
            </p>}
            {basket.map((b) => (
              <CartTreatmentConfig key={b.id} entry={b} badges={badges[b.id]}
                onPlan={(k) => onPlan(b.id, k)} onRemove={() => onToggle(b.id)} />
            ))}
          </div>

          {/* Running order, so the basket reads as one order before checkout and
              the button that ends the step is not a screen away from the prices
              it commits to.
              NO promo code here on purpose: the code is revealed on screen 2
              where "CODE APPLIED" explains it. Discounting the subtotal here
              would advertise a price this screen never accounts for — the same
              reason chimeCartPlans() keeps the ladder undiscounted. */}
          <div className="cart-checkout-bar">
            {order.count > 0 && <React.Fragment>
              <h3 className="cart-running-title">Your order</h3>
              <ul className="cart-running-lines">
                {order.lines.map((l) => (
                  <li key={l.product.id}>
                    <span>{l.product.name} · {l.plan.title.replace("Membership", "Plan")}</span>
                    <b>{l.plan.totalLabel}</b>
                  </li>
                ))}
              </ul>
            </React.Fragment>}
            {/* Sits between the lines and the total, where the figure it moves
                is — and below the lines, so it never competes with choosing a
                treatment. Only offered once there is an order to discount. */}
            {order.count > 0 && <div className="cart-code-slot">
              {/* Still no dollar figure here, but for a different reason than
                  it once was: the reduction now has its own row a few lines
                  below, stating the same percentage AND the amount. Repeating
                  the amount in the control that removes it would print the same
                  number twice within 60px. This is the control; that is the
                  arithmetic. */}
              <CartCodeField applied={order.codeApplied ? order.code : null}
                percent={order.codePercent} error={codeError}
                onApply={onApplyCode} onClear={onClearCode} />
            </div>}

            {/* Every reduction, itemised, so the figure in the foot is one the
                customer can check: subtotal, less each row, equals total. This
                screen used to quote the ladder subtotal and defer both discounts
                to checkout — so someone who had just typed a valid code watched
                the price not move, which reads as the code having failed.

                It forces the automatic JOIN120 into the open here, and that is
                not optional: the entered code's percentage is taken off the
                POST-JOIN120 price, so a lone "−$72" row would not reconcile
                against the subtotal directly above it. Only the arithmetic moves
                forward — the countdown and the "discounts left" framing stay on
                checkout, where they were signed off. */}
            {order.count > 0 && hasDiscount && <ul className="cart-running-adjust">
              <li>
                <span>{order.count === 1 ? "Subtotal" : order.count + " treatments"}</span>
                <b>{order.subtotalLabel}</b>
              </li>
              {order.promoApplied && <li className="cart-adjust-off">
                <span>Code {order.promoCode}</span>
                <b>&minus;{order.promoDiscountLabel}</b>
              </li>}
              {/* Named with its percentage, matching the checkout row: a bare
                  dollar figure gives whoever typed the code no way to check it
                  against what they were promised. */}
              {order.codeApplied && <li className="cart-adjust-off">
                <span>Code {order.code} &middot; {order.codePercent}% off</span>
                <b>&minus;{order.codeDiscountLabel}</b>
              </li>}
            </ul>}

            {/* Total and button share one row. Stacking them put the figure a
                further 100px from the action it authorises, which was the
                opposite of the point. */}
            <div className="cart-bar-foot">
              {/* "Subtotal" only while it IS one. Once the rows above have taken
                  the discounts off, this is the figure the customer pays, and
                  calling that a subtotal understates nothing but explains
                  nothing either. */}
              {order.count > 0 && <p className={"cart-running-total" + (hasDiscount ? " cart-running-total-final" : "")}>
                <span>{hasDiscount ? "Total" : (order.count === 1 ? "Subtotal" : order.count + " treatments")}</span>
                <b>{hasDiscount ? order.totalLabel : order.subtotalLabel}</b>
              </p>}
              {/* onClick is passed even when disabled: omitting it makes Button
                  render its anchor form, which links to the assessment. */}
              <Button label="Continue to checkout"
                size="cta" type="button" onClick={onCheckout} disabled={!ready} />
            </div>
            {/* The old note said the discounts were "applied at checkout" —
                true then, wrong now that they are applied here. What is left to
                say is the one thing this total does NOT mean: that money moves
                today. */}
            {order.count > 0 && hasDiscount && <p className="cart-running-note">
              Discounts included. {copy.dueTodayNote}
            </p>}
            {!ready && <p className="cart-continue-note">
              {basket.length === 0
                ? "Select a treatment to continue."
                : "Choose a membership for "
                  + basket.filter((b) => !b.plan).map((b) => b.product.name).join(" and ")
                  + " to continue."}
            </p>}
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
// `entry` holds every field the user has typed. It lives in ChimeCartFlow, NOT
// here: this component unmounts whenever the flow returns to screen 1, so local
// state would drop the whole address the moment someone went back to compare a
// plan. Errors stay local on purpose — stale validation from a previous visit is
// noise, and it re-derives on the next submit.
function CartCheckoutScreen({ order, onBack, entry }) {
  const copy = window.CHIME_CART_COPY;
  const promo = window.CHIME_CART_PROMO;
  const pay = window.CHIME_CART_PAYMENT;
  const uploads = window.CHIME_UPLOADS_BASE || "uploads";

  const { form, setForm, method, setMethod, sameBilling, setSameBilling, placed, setPlaced } = entry;
  const [errors, setErrors] = React.useState({});
  const set = (k) => (v) => setForm((f) => Object.assign({}, f, { [k]: v }));

  const hold = useCartHold(promo.holdSeconds, promo.enabled);
  // Float math on parsed currency: compare against half a cent, never === 0.
  // totalSavings, not ladder savings — it is ladder + code, i.e. exactly the gap
  // between the struck figures and the live ones, so the strikethroughs and the
  // "Total Savings" row can never disagree.
  const saves = order.totalSavings > 0.005;
  const multi = order.count > 1;

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
      lines: order.lines.map((l) => ({
        product: l.product.id, plan: l.plan.key, total: l.plan.total,
      })),
      method: method, subtotal: order.subtotal,
      code: order.promoApplied ? order.promoCode : null,
      discount: order.promoDiscount, total: order.total,
      ship: { city: form.city, state: form.state, zip: form.zip },
    });
    setPlaced(true);
  }

  return (
    <React.Fragment>
      <section className="cart-band cart-band-checkout">
        <div className="cart-band-inner">
          <CartBack label="Back to plan selection" onClick={onBack} />
          {/* Two rows. Row 1 sets the summary beside the form so the plan being
              bought stays on screen while the card is typed — stacked, the pay
              button sat about 1,200px below the price it charges. Row 2 is the
              disclaimer, spanning both columns because it is the one block that
              belongs to the whole transaction rather than to either side. */}
          <div className="cart-checkout-grid">
          <div className="cart-summary">
            {/* The badge travels with the choice. Whatever ribbon was on the card
                the user clicked reappears here, in the same colours and the same
                position, so screen 2 confirms the plan they picked rather than
                describing an unlabelled one.
                Only on a single-line order: with two treatments the ribbon would
                have to speak for both, and one plan's "Most Popular" is not a
                claim the other line earned.
                The card's GROUND deliberately does not follow the featured plan
                card's --accent-strong: that colour earned its keep on screen 1 by
                contrasting with three sibling cards, and there are no siblings
                here — against this screen's light blue band a lighter card would
                only lose separation. The ribbon is the part that carries
                recognition, so the ribbon is the part that travels. */}
            {!multi && order.lines[0] && order.lines[0].plan.badge && <div className={"cart-summary-ribbon"
              + (order.lines[0].plan.badge === "Most Popular" ? " is-featured" : "")}>
              {order.lines[0].plan.badge}</div>}
            <h1 className="cart-summary-title" tabIndex={-1}>Your Treatment Details</h1>

            {/* One panel per line. Per-line figures stay at the LADDER price the
                line was chosen at — the code is an order-level discount, so
                spreading it across the lines would print per-treatment totals
                that no plan card ever quoted and that do not sum to the order. */}
            {order.lines.map((l) => (
              <div className="cart-summary-panel" key={l.product.id}>
                <img src={uploads + "/" + l.product.img} alt="" width="440" height="800" aria-hidden="true" />
                <div>
                  <CartSummaryRow label="Medication" value={l.product.name} />
                  <CartSummaryRow label="Delivery Plan" value={l.plan.title.replace("Membership", "Plan")} />
                  <CartSummaryRow label="Monthly Price" value={l.plan.perMonthLabel}
                    was={l.plan.savings > 0.005 ? l.plan.listRateLabel : null} />
                  {/* Always "Treatment total", never "Total if prescribed".
                      This label used to switch to the order's wording on a
                      single-line basket, which put two rows reading "Total if
                      prescribed" on one card with DIFFERENT figures — the line
                      at its ladder price, the order after the code. Read
                      straight down, the card contradicted itself. */}
                  <CartSummaryRow label="Treatment total"
                    value={l.plan.totalLabel}
                    was={l.plan.savings > 0.005 ? l.plan.listTotalLabel : null} />
                </div>
              </div>
            ))}

            {/* The order block only earns its place once the lines no longer add
                up on their own — with one treatment its subtotal IS that line. */}
            <div className="cart-order">
              {multi && <CartSummaryRow label="Subtotal" value={order.subtotalLabel} />}
              {/* "vs paying monthly" carries the baseline the saving is measured
                  against, which the bare row never said and the deleted prose
                  line did. */}
              {saves && <CartSummaryRow label="Total Savings vs paying monthly"
                value={order.totalSavingsLabel} />}
              <CartSummaryRow label="Shipping" value="FREE" />
              {order.promoApplied && <CartSummaryRow
                label={"Code " + order.promoCode} value={"−" + order.promoDiscountLabel} />}
              {/* The entered code is its own row, never folded into the
                  automatic one: they are different offers, and a customer who
                  typed a code needs to see it took effect. The percentage is
                  named because a bare dollar figure gives them no way to check
                  it against what they were promised. */}
              {order.codeApplied && <div className="cart-order-coderow">
                <CartSummaryRow
                  label={"Code " + order.code + " (" + order.codePercent + "%)"}
                  value={"−" + order.codeDiscountLabel} />
              </div>}
              {/* The figure the customer is actually charged, given the weight
                  that deserves. Every number on this card used to be 14px, so
                  the order total was set at exactly the size of "Shipping:
                  FREE" — NN/g's point about highlighting what matters, failed
                  in the plainest way. It is a label, a struck list price, the
                  live figure at display size, and the per-month equivalent
                  underneath (RevenueCat: the rate, with the sum charged beside
                  it — a per-month figure alone is the dishonest half). */}
              <div className="cart-order-total">
                <p className="cart-order-label">Total if prescribed</p>
                <p className="cart-order-figure">
                  {saves && <span className="cart-order-was">{order.listTotalLabel}</span>}
                  <b>{order.totalLabel}</b>
                </p>
                {order.perMonthLabel && <p className="cart-order-permo">
                  {order.perMonthLabel} per month over {order.supplyMonths} months
                </p>}
              </div>
            </div>

            {/* The "You are saving $X vs monthly" sentence used to sit here and
                is gone. With the total block above it, that figure was stated
                three times within about forty pixels — as the Total Savings
                row, as the struck list price beside the live one, and again in
                prose. NN/g's rule is to merge what is shared and show the
                difference once; the row scans and the strikethrough shows it,
                so the sentence was the third telling. It also split the total
                from the code chip that explains it.
                The one thing it said that the rows do not is what the saving is
                measured AGAINST — that now rides on the row itself. */}

            {/* The chip is gated on the code actually having been applied, not
                on the promo merely being switched on — announcing "CODE APPLIED"
                over a total the code did not touch (the 1-month plan, which the
                offer excludes) is exactly the claim this page must not make. */}
            {/* The code the CUSTOMER entered, acknowledged on its own terms.
                It arrived here as one more 14px row while the automatic promo
                below got a chip — the code someone had to know and type was the
                quieter of the two, which is backwards. Success tone rather than
                accent, so it reads as "this worked" and stays distinct from the
                automatic chip beneath it; it states the percentage promised and
                the money that came off, which is what makes the claim checkable. */}
            {order.codeApplied && <p className="cart-code-win">
              <span className="cart-code-win-tick" aria-hidden="true">
                <Icon size={15} strokeWidth={3}><path d="M4 12.5l5 5L20 7" /></Icon>
              </span>
              <span>
                <b>{order.code}</b> applied · {order.codePercent}% off
                <span className="cart-code-win-amt">−{order.codeDiscountLabel}</span>
              </span>
            </p>}

            {order.promoApplied && <React.Fragment>
              <p className="cart-code">CODE APPLIED: {order.promoCode}</p>
              {/* The clock was a run of bold text inside the sentence below,
                  which put the one figure on this card that changes at the same
                  weight as the ones that do not. It reads as a seal instead —
                  the digits carry the emphasis, and the sentence keeps the
                  claims (stock count, what expiry actually costs the user). */}
              <CartHoldSticker time={cartClock(hold)} expired={hold === 0} />
              <p className="cart-hold">
                Only {promo.discountsLeft} discounts left.{" "}
                {hold > 0
                  ? "Yours is held until the timer runs out."
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
      {placed ? (
        <div className="cart-placed" role="status">
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
            {/* One line per treatment, then the order total — a single joined
                string would run to three products' worth of text and bury the
                figure that matters. */}
            <div className="cart-placed-sum">
              {order.lines.map((l) => (
                <p key={l.product.id}>{l.product.name} · {l.plan.title}</p>
              ))}
              <p><strong>{order.totalLabel}</strong></p>
            </div>
            <Button label="Back to home" onClick={() => { window.location.href = "index.html"; }} />
        </div>
      ) : (
        <form className="cart-formcol" onSubmit={onSubmit} noValidate>
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
              <CartField required id="cart-name" invalid={!!errors.name} errorId="cart-form-error" label="Full name" placeholder="Full name"
                value={form.name} onChange={set("name")} autoComplete="name" />
              <CartField required id="cart-line1" invalid={!!errors.line1} errorId="cart-form-error" label="Address line 1" placeholder="Address line 1"
                value={form.line1} onChange={set("line1")} autoComplete="address-line1" />
              <CartField id="cart-line2" label="Address line 2 (optional)" placeholder="Address line 2"
                value={form.line2} onChange={set("line2")} autoComplete="address-line2" />
              <CartField required id="cart-city" invalid={!!errors.city} errorId="cart-form-error" label="City" placeholder="City"
                value={form.city} onChange={set("city")} autoComplete="address-level2" />
              <div className="cart-row-2">
                <CartField required id="cart-state" invalid={!!errors.state} errorId="cart-form-error" label="State" placeholder="State"
                  value={form.state} onChange={set("state")} autoComplete="address-level1" />
                <CartField required id="cart-zip" invalid={!!errors.zip} errorId="cart-form-error" label="ZIP" placeholder="ZIP"
                  value={form.zip} onChange={set("zip")} autoComplete="postal-code" inputMode="numeric" />
              </div>
              <CartField required id="cart-phone" invalid={!!errors.phone} errorId="cart-form-error" label="Phone number" placeholder="Phone number"
                value={form.phone} onChange={set("phone")} autoComplete="tel" type="tel" inputMode="tel" />
            </div>

            {method === "card" ? (
              <React.Fragment>
                <h2 className="cart-h2">Enter Your Card Details</h2>
                <div className={"cart-form cart-form-card" + (Object.keys(errors).length ? " has-error" : "")}>
                  <CartField required id="cart-card" invalid={!!errors.card} errorId="cart-form-error" label="Card number" showLabel placeholder="1234 1234 1234 1234"
                    value={form.card} onChange={set("card")} autoComplete="cc-number" inputMode="numeric"
                    trailing={pay.cards.map((b) => <PayMark key={b} brand={b} />)} />
                  <div className="cart-row-2">
                    <CartField required id="cart-exp" invalid={!!errors.exp} errorId="cart-form-error" label="Expiration Date" showLabel placeholder="MM / YY"
                      value={form.exp} onChange={set("exp")} autoComplete="cc-exp" inputMode="numeric" />
                    <CartField required id="cart-cvc" invalid={!!errors.cvc} errorId="cart-form-error" label="Security Code" showLabel placeholder="CVC"
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

            {!!Object.keys(errors).length && <p className="cart-error" id="cart-form-error" role="alert">
              Please complete the highlighted fields.
            </p>}

            <div className="cart-submit">
              <Button label="Continue" onClick={onSubmit} />
              <p className="cart-secure">Your payment information is secure and encrypted.</p>
            </div>
        </form>
      )}
          </div>

          {/* Row 2. The legal block is what the Continue button binds the user
              to, so it stays out while the order is already placed. The HIPAA
              line covers the page either way and always shows. */}
          <div className="cart-disclaimer">
            {!placed && <p className="cart-legal">{window.CHIME_CART_LEGAL}</p>}
            <p className="cart-hipaa">{copy.hipaaNote}</p>
          </div>
        </div>
      </section>
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
  // A basket, not a single choice. `selectedIds` keeps picker order so the
  // summary lists treatments the way they were chosen; `planKeys` maps each
  // chosen treatment to ITS OWN term, because the ladders differ per product
  // (see chimeCartOrder in cart-data.js).
  const [selectedIds, setSelectedIds] = React.useState(treatments.length ? [treatments[0].id] : []);
  const [planKeys, setPlanKeys] = React.useState({});
  // The entered discount code lives here, not in the field, so it survives the
  // trip to checkout and back — the same reason the address does.
  const [codeObj, setCodeObj] = React.useState(null);
  const [codeError, setCodeError] = React.useState("");
  const onApplyCode = (raw) => {
    const found = window.chimeCartResolveCode(raw);
    if (!found) {
      setCodeObj(null);
      // Names what was typed, so someone who fat-fingered a character can see
      // it rather than being told "invalid" about an input they cannot see.
      setCodeError(String(raw || "").trim()
        ? "“" + String(raw).trim() + "” is not a valid code."
        : "Enter a discount code.");
      return;
    }
    setCodeObj(found);
    setCodeError("");
  };
  const onClearCode = () => { setCodeObj(null); setCodeError(""); };

  // Checkout entry state lives here so it outlives CartCheckoutScreen, which
  // unmounts on every return to screen 1. See the note on that component.
  const [form, setForm] = React.useState({
    name: "", line1: "", line2: "", city: "", state: "", zip: "", phone: "",
    card: "", exp: "", cvc: "",
  });
  const [method, setMethod] = React.useState("card");
  const [sameBilling, setSameBilling] = React.useState(true);
  const [placed, setPlaced] = React.useState(false);
  const checkoutEntry = {
    form, setForm, method, setMethod, sameBilling, setSameBilling, placed, setPlaced,
  };

  // One entry per chosen treatment: the treatment, its OWN ladder, and the term
  // picked from that ladder (null until the user picks one).
  const basket = React.useMemo(() => selectedIds.map((id) => {
    const t = treatments.filter((x) => x.id === id)[0];
    if (!t) return null;
    const plans = window.chimeCartPlans(t.product);
    return {
      id: id, meta: t, product: t.product, plans: plans,
      plan: plans.filter((p) => p.key === planKeys[id])[0] || null,
    };
  }).filter(Boolean), [treatments, selectedIds, planKeys]);

  // Nothing to check out until every chosen treatment has a term. Half-filled
  // baskets are the failure mode multi-select introduces — the user picks two
  // treatments, sets one plan, and would otherwise be sent to a checkout quoting
  // an order that is missing a line.
  const ready = basket.length > 0 && basket.every((b) => b.plan);
  const order = React.useMemo(
    () => window.chimeCartOrder(basket.filter((b) => b.plan), null, codeObj), [basket, codeObj]);

  const screenRef = React.useRef(null);
  const dirRef = React.useRef(1);      // 1 = forward, -1 = back
  const busyRef = React.useRef(false); // one transition at a time
  const stepRef = React.useRef(1);     // read inside listeners without re-binding
  const navigatedRef = React.useRef(false);
  const [announce, setAnnounce] = React.useState("");
  stepRef.current = step;

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

  // Picking a plan no longer advances. With several treatments in the basket a
  // plan click is one line item settled, not the end of the step — the user has
  // to be able to choose NAD+'s term and then GLP-1's. Screen 1 carries its own
  // Continue button instead, which is what moves the flow on.
  const onPlan = (id, key) => setPlanKeys((m) => Object.assign({}, m, { [id]: key }));
  const onCheckout = () => goTo(2, 1, () => setPlaced(false));
  const onBack = () => goTo(1, -1);

  // Deselecting drops that treatment's term too — leaving it behind would let a
  // stale key resurface if the same treatment were re-added later, quietly
  // re-selecting a plan the user never picked this time round.
  const onToggle = (id) => {
    setSelectedIds((ids) => (ids.indexOf(id) >= 0
      ? ids.filter((x) => x !== id)
      : ids.concat([id])));
    setPlanKeys((m) => {
      if (!(id in m)) return m;
      const next = Object.assign({}, m);
      delete next[id];
      return next;
    });
  };

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
    if (!navigatedRef.current || !screenRef.current) return undefined;
    // The delay is load-bearing, not a guess. The enter tween starts at
    // autoAlpha 0, and GSAP implements that as visibility: hidden — focus() on
    // anything inside a hidden subtree is silently dropped, which is exactly how
    // this failed the first time. One tick in, opacity is above 0, GSAP has
    // restored visibility, and the heading can take focus. 60ms matches the
    // assessment's own post-transition focus delay.
    const t = setTimeout(() => {
      const el = screenRef.current;
      const h = el && el.querySelector("h1");
      // preventScroll: the swap already put the page at the top; letting focus
      // scroll again fights that.
      if (h) h.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, [step]);

  if (!treatments.length) {
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
        {/* `ready`, not a single plan: screen 2 quotes the whole order, so it
            may only mount once EVERY chosen treatment has a term. */}
        {step === 2 && ready
          ? <CartCheckoutScreen order={order} onBack={onBack} entry={checkoutEntry} />
          : <CartSelectScreen treatments={treatments} basket={basket} ready={ready}
              order={order} onToggle={onToggle} onPlan={onPlan} onCheckout={onCheckout}
              codeError={codeError} onApplyCode={onApplyCode} onClearCode={onClearCode} />}
      </div>
    </main>
  );
}

Object.assign(window, { ChimeCartFlow, CartSelectScreen, CartCheckoutScreen });
