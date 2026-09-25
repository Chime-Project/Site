// Chime Health — shopping cart: configuration, copy, and price derivation.
// Plain script (no JSX) so it can load before the components and be unit-tested
// with `node ui_kits/cart/cart-tests.js`.
//
// Layout + copy source: uploads/Shopping01.png (plan select) and
// uploads/Shopping02.png (checkout). Where the mockups and the real catalog
// disagree on a NUMBER, the catalog wins — see chimeCartPlans() below.
//
// Requires ui_kits/shared/data/products.js to load first (window.CHIME_PRODUCTS).

(function () {
  "use strict";

  // ---- Step 1: which treatments the picker offers --------------------------
  // The mockup draws exactly two cards. Ids point into CHIME_PRODUCTS so the
  // vial art and the whole price ladder stay in sync with the rest of the site;
  // only the marketing lines that exist nowhere else live here.
  // ⚠️ `proof` counts are from the mockup and are UNVERIFIED marketing claims.
  // They need real numbers or removal before launch — see CART_REVIEW below.
  //
  // Readiness pass (Asana 1218871555785842, 2026-09-25): generic "GLP-1" is
  // split into Semaglutide + Tirzepatide on the CLIENT price ladder — the same
  // figures chime-checkout, select-plan and choose-treatment quote (source:
  // chime-checkout/js/checkout-selection.js). `plans` here overrides the shared
  // catalog row for THIS PAGE ONLY: products.js still feeds the shop pages and
  // was left alone. The ladder has no 12-month plan. Tirzepatide's 6 months
  // covers 6 months, as the live product page states it ("includes 6 months").
  // NAD+ keeps its catalog ladder. The mockup's two cards' copy moved with the
  // comparison it actually makes (Sema = proven + affordable, Tirz = dual-action
  // + faster); NAD+ has no mockup copy, so its lines restate the catalog
  // category and carry no count.
  // `slug` is the public URL name: cart.html?treatment=semaglutide,nad&term=3mo
  window.CHIME_CART_TREATMENTS = [
    { id: "prod-semaglutide", slug: "semaglutide", claim: "Proven, effective.",
      highlight: "More Affordable", proof: "10,909 patients chose this today",
      plans: [
        { key: "1mo", term: "1 Month", price: "$299.00" },
        { key: "3mo", term: "3 Months", price: "$747.00", permo: "$249" },
        { key: "6mo", term: "6 Months", price: "$1,194.00", permo: "$199" },
      ] },
    { id: "prod-tirzepatide", slug: "tirzepatide", claim: "Dual-action, but more expensive.",
      highlight: "Fastest Results", proof: "19,528 patients chose this today",
      plans: [
        { key: "1mo", term: "1 Month", price: "$359.00" },
        { key: "3mo", term: "3 Months", price: "$897.00", permo: "$299" },
        { key: "6mo", term: "6 Months", price: "$1,794.00", permo: "$299" },
      ] },
    { id: "prod-nad", slug: "nad", claim: "Energy & wellness support.",
      highlight: "Pairs with any plan", proof: null },
  ];

  // ---- Step 2: plan ladder presentation ------------------------------------
  // Keyed by the catalog's plan.key. `supplyMonths` is months of PRODUCT
  // delivered; `billedMonths` is what the customer PAYS for. They differ on one
  // row — the 3-month membership ships a free 4th month — which is why the
  // mockup labels it "16 Week Supply" and prices the button "/ 4 Month
  // Membership". That gap is the offer's whole hook, and holding it as two
  // fields is what makes the hero promise, the savings math and the UI's
  // "1 month free" all derive from the same numbers instead of drifting apart
  // in copy. Change one and check the other.
  window.CHIME_CART_PLAN_META = {
    "1mo": { title: "1 Month Membership", supplyMonths: 1, billedMonths: 1, badge: null,
      blurb: "A one-time plan delivered to your door" },
    "3mo": { title: "3 Month Membership", supplyMonths: 4, billedMonths: 3, badge: "Most Popular",
      blurb: "Buy a 3-month supply and get the 4th month for free" },
    "6mo": { title: "6 Month Membership", supplyMonths: 6, billedMonths: 6, badge: null,
      blurb: "Your ultimate membership to guarantee success and consistency" },
    "1yr": { title: "12 Month Membership", supplyMonths: 12, billedMonths: 12, badge: "Best Deal",
      blurb: "Commit to a year of progress and get the best deal" },
  };

  // ---- Static copy ---------------------------------------------------------
  window.CHIME_CART_COPY = {
    heroTitle: ["Buy a 3-month package and get", "4th month for free"],
    heroSub: "Same Price. All Dosage Levels.",
    heroNote: "No Hidden Fees. Everything Included.",
    includes: [
      "App for nutrition and custom training", "Free dosage increases",
      "Next-day shipping", "Treatment changes",
      "24/7 customer support", "Doctor Consults",
    ],
    howItWorks: "Each month includes one shot per week, for a total of four shots. " +
      "Your provider will start you on a low dose and gradually increase it to your " +
      "ideal level, helping you lose weight safely and effectively.",
    // Checkout reassurance rows, in mockup order.
    // "Prescibed" is a typo in the mockup — corrected here, flagged to the client.
    assurances: [
      "Same Price. All Dosage Levels.",
      "Prescribed & shipped within 48 hours",
      "UNLIMITED doctor calls 7 days a week",
    ],
    dueToday: "$0 Due Today!",
    dueTodayNote: "Only charged if your prescription is approved.",
    hipaaNote: "Your data is protected by HIPAA. All transactions are secured and encrypted.",
    // Confirmation screen, "What happens next". Every line restates a claim
    // this page already makes (the $0-due note, checkoutNotes, "Shipping:
    // FREE") — the confirmation adds no new promise, timing or SLA.
    nextSteps: [
      { title: "Provider review", body: "A licensed provider reviews your information and decides whether treatment is right for you." },
      { title: "Approval", body: "Your card is only charged if your prescription is approved." },
      { title: "Delivery", body: "A licensed pharmacy partner ships your treatment to the address you gave, free of charge." },
    ],
    // Pre-payment disclosures (merchant-account requirement, Asana
    // 1218018600323416): provider review, no guarantee of medication,
    // pharmacy-partner fulfilment, delivery variability, and renewal terms,
    // stated before the customer submits payment. The renewal line restates
    // CHIME_CART_LEGAL's auto-renew authorization in plain language — it
    // adds no claim that paragraph does not already make.
    checkoutNotes: [
      "Prescription treatment is subject to review and approval by a licensed healthcare provider. Medication is not guaranteed.",
      "Eligible prescriptions are fulfilled and shipped by licensed pharmacy partners. Shipping and delivery timing may vary.",
      "Memberships renew automatically at the end of each term at that term’s price, until cancelled as described in the Terms & Conditions.",
    ],
  };

  // ---- Promotion -----------------------------------------------------------
  // ⚠️ SCARCITY MECHANICS — the mockup shows a live countdown and a dwindling
  // stock count ("Only 11 discounts left. Yours is reserved for 3:54 minutes").
  // Built as drawn, but a countdown that resets on reload, or a "discounts left"
  // number that is not backed by real inventory, is a deceptive-practice risk on
  // a healthcare checkout. The timer here is genuine (it persists per session and
  // does not restart), and `discountsLeft` is config, NOT a live figure.
  // Get sign-off, or set `enabled: false`, before launch.
  window.CHIME_CART_PROMO = {
    enabled: true,
    code: "JOIN120",
    // Flat dollars off the plan total, stacked on top of the ladder savings.
    // ⚠️ The amount and the code NAME must be changed together — "JOIN120"
    // reads as $120 to a customer, so a silent change to one is a false claim.
    discount: 120,
    // The 1-month plan is excluded: $120 off a $200 month-to-month order is a
    // 57% discount, which is not what a join incentive is for. Expressed as a
    // supply threshold rather than a key list so it survives catalog changes —
    // the 3-month plan clears it on its 4 months of supply.
    minSupplyMonths: 3,
    discountsLeft: 11,
    holdSeconds: 234, // 3:54, as drawn
  };

  // ---- Customer-entered discount codes -------------------------------------
  // Distinct from CHIME_CART_PROMO above, which is AUTOMATIC — the customer
  // never types it and it is simply revealed at checkout. These are codes
  // someone has to know and enter, so they need matching, validation and an
  // error path the automatic promo never needed.
  //
  // ⚠️ Client-side only, and that is a placeholder, not a design. Anyone can
  // read this file and find every code, and nothing here stops a code being
  // reused or applied to an order it was not meant for. Real codes have to be
  // validated server-side against the order before this page takes money.
  //
  // `percent` is taken off the FINAL price — after the automatic promo — so the
  // two stack. See chimeCartOrder for what that costs on a real basket.
  window.CHIME_CART_CODES = {
    DISCOUNT01: { code: "DISCOUNT01", percent: 24 },
  };

  // Normalises what the customer typed: trims, upper-cases, and tolerates the
  // spaces people paste in from an email. Returns null for anything unknown, so
  // the caller has one thing to test rather than a string to re-parse.
  function chimeCartResolveCode(input) {
    var key = String(input == null ? "" : input).trim().toUpperCase().replace(/\s+/g, "");
    if (!key) return null;
    return (window.CHIME_CART_CODES || {})[key] || null;
  }

  // ---- Payment methods -----------------------------------------------------
  // `brand` keys map to the --pay-* custom properties declared in cart.html;
  // third-party brand colors are page config, not component color decisions, so
  // they stay out of the JSX and the theme guard stays at zero warnings.
  window.CHIME_CART_PAYMENT = {
    cards: ["mastercard", "visa", "discover", "amex"],
    wallets: ["applepay", "gpay"],
    bnpl: ["afterpay", "klarna", "affirm"],
  };

  // ---- Legal ---------------------------------------------------------------
  // ⚠️ REWRITTEN, NOT APPROVED. The mockup's fine print was lifted from another
  // service — it names "TrimRx.com" and "Betterly" and binds the reader to
  // *their* refund policy. Reproducing that would have made Chime's checkout
  // cite a third party's terms. The structure below is the same (consent,
  // auto-renew authorization, financing, refunds, medical attestation) with
  // Chime Health and this site's own policy pages substituted.
  // Counsel must approve the wording before this page takes a real payment.
  window.CHIME_CART_LEGAL =
    "By continuing I confirm I have read and agree to the Chime Health Telehealth " +
    "Visit Policy, Privacy Policy, Shipping Policy, and all Terms and Conditions; " +
    "consent to the collection, use, processing, and disclosure of my PHI; and " +
    "authorize healthcare services via telehealth. I authorize Chime Health to " +
    "enroll me in an auto-renewing subscription and to charge my saved payment " +
    "method at the specified recurring intervals until I cancel in accordance with " +
    "the Terms and Conditions. I understand failed payments may be retried, I am " +
    "responsible for all resulting amounts and fees, and cancellation only stops " +
    "future charges, with any refunds governed solely by the Chime Health Refund " +
    "Policy. If I use third-party financing (such as Klarna, Afterpay, or Affirm), " +
    "I understand that financing is solely between me and that provider under its " +
    "own terms and privacy policy, that Chime Health is not a party to those " +
    "agreements, that such payments are generally not refundable by Chime Health " +
    "except as allowed by its Refund Policy, and that financing typically covers " +
    "only the specific treatment period, requiring a new purchase or valid payment " +
    "method to continue services or my account may be paused or suspended. I agree " +
    "that my order is a binding, final transaction, that refunds are only available " +
    "as stated in the Chime Health Refund Policy, that cancellation fees may apply, " +
    "and that multi-month packages will not be refunded for unused medication or " +
    "remaining months. I attest that all medical information I provide is complete " +
    "and accurate, release the provider and affiliated entities from liability " +
    "arising from errors or omissions in my submissions, and confirm I understand " +
    "the potential risks and serious adverse effects of treatment and am proceeding " +
    "voluntarily.";

  // ---- Money helpers -------------------------------------------------------
  // Catalog prices are display strings ("$1,194.00", "From $179.00"), so every
  // figure on this page has to be parsed out before it can be added up.
  function cartMoney(str) {
    var n = Number(String(str == null ? "" : str).replace(/[^0-9.]/g, ""));
    return isFinite(n) ? n : 0;
  }

  // Whole dollars render bare ($627), part-dollars keep cents ($156.75) — the
  // per-month figure of a 4-month supply rarely divides evenly.
  function cartUSD(n) {
    var whole = Math.abs(n % 1) < 0.005;
    return "$" + n.toLocaleString("en-US", {
      minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2,
    });
  }

  // ---- Price derivation ----------------------------------------------------
  // Returns the plan ladder for a product, with the totals, per-month rates and
  // savings the two screens display.
  //
  // ⚠️ Why the list rate is DERIVED rather than read from the "1 Month" row.
  // Most Weight Loss products carry a 1-month price of the "From $X" shape —
  // a marketing floor equal to their 1-YEAR per-month rate, not a real
  // month-to-month price. Taken literally it makes the 1-month plan the
  // cheapest per month and every longer plan a markup, which inverts the whole
  // page. The Energy & Wellness products don't have this problem: their 1-month
  // row is a real price and is already the highest rate in the ladder.
  // So: the list rate is the HIGHEST per-month rate the ladder actually quotes.
  // That is the true shortest-commitment rate under both shapes, it invents no
  // number, and savings measured against it are honest.
  function chimeCartPlans(product) {
    var meta = window.CHIME_CART_PLAN_META;
    var rows = (product && product.plans) || [];
    if (!rows.length) return [];

    // A row only contributes a rate if it quotes one outright: `permo` for the
    // multi-month rows, or a 1-month price that isn't a "From $" floor.
    var rates = rows.map(function (p) {
      if (p.permo) return cartMoney(p.permo);
      if (/from/i.test(p.price)) return null;
      return cartMoney(p.price);
    }).filter(function (r) { return r != null && r > 0; });
    if (!rates.length) return [];
    var listRate = Math.max.apply(null, rates);

    var built = rows.map(function (p) {
      var m = meta[p.key];
      if (!m) return null;
      // A "From $" 1-month row is a marketing floor, so its total is the list
      // rate — the real month-to-month rate. A 1-month row that quotes an
      // outright price (NAD+, the client ladder) is charged at that price.
      var total = p.key === "1mo" && /from/i.test(p.price) ? listRate : cartMoney(p.price);
      var perMonth = total / m.supplyMonths;
      var billed = m.billedMonths || m.supplyMonths;
      return {
        key: p.key, term: p.term, title: m.title, blurb: m.blurb, badge: m.badge,
        metaBadge: m.badge,
        supplyMonths: m.supplyMonths, supplyWeeks: m.supplyMonths * 4,
        billedMonths: billed, freeMonths: m.supplyMonths - billed,
        total: total, totalLabel: cartUSD(total),
        perMonth: perMonth, perMonthLabel: cartUSD(perMonth),
        listRate: listRate, listRateLabel: cartUSD(listRate),
        listTotal: listRate * m.supplyMonths,
        listTotalLabel: cartUSD(listRate * m.supplyMonths),
        savings: listRate * m.supplyMonths - total,
        savingsLabel: cartUSD(listRate * m.supplyMonths - total),
        // The button reads "$627 / 4 Month Membership" — supply months, not
        // billed months, so the free 4th month is visible in the price itself.
        ctaPrice: cartUSD(total) + (p.key === "1mo"
          ? "/month Membership"
          : "/ " + m.supplyMonths + " Month Membership"),
      };
    }).filter(Boolean);

    // "Best Deal" is EARNED, not assigned: it goes to the lowest per-month plan,
    // and only if that card is not already badged. Labelling a dearer card
    // "Best Deal" would be a false price claim on a checkout.
    //
    // This rule looked redundant for a long time and was not. Under the pre-2026-08-14
    // catalog the free 4th month made the 3-month plan the cheapest per month
    // on EVERY product, so the badge the mockup pins to the 12-month card was
    // never once rendered — the rule was silently suppressing a false claim on
    // every page load. The reprice made the ladder descend properly, the year
    // became genuinely cheapest, and the badge now appears for the first time.
    // ("Most Popular" is an editorial claim about uptake, not price, so it is
    // left where the mockup puts it — but see CART_REVIEW: it needs backing.)
    var cheapest = built.reduce(function (a, b) { return b.perMonth < a.perMonth ? b : a; }, built[0]);
    built.forEach(function (p) {
      if (p.metaBadge === "Best Deal") p.badge = p === cheapest ? "Best Deal" : null;
      else if (p === cheapest && !p.metaBadge) p.badge = "Best Deal";
    });
    return built;
  }

  // ---- Promotion ----------------------------------------------------------
  // Applies the join code to a plan and returns it with the checkout figures.
  //
  // Deliberately NOT folded into chimeCartPlans(): the code is revealed on the
  // checkout screen, so the plan cards on screen 1 quote the undiscounted
  // ladder and the reduction appears where "CODE APPLIED" does. Fold it into
  // the ladder instead and screen 1 starts advertising a price whose discount
  // it never explains.
  //
  // Savings are reported against the SAME baseline the ladder uses (the list
  // rate × supply), so ladder savings and code savings add up to one figure the
  // customer can check: listTotal − finalTotal.
  function chimeCartApplyPromo(plan, promo) {
    promo = promo || window.CHIME_CART_PROMO || {};
    if (!plan) return plan;
    var off = Number(promo.discount) || 0;
    var applied = !!promo.enabled
      && off > 0
      && plan.supplyMonths >= (promo.minSupplyMonths || 0)
      // Never let a flat discount reach or exceed the total — a $0 order is a
      // bug, not an offer, and a negative one is worse.
      && off < plan.total;
    var discount = applied ? off : 0;
    var finalTotal = plan.total - discount;
    var finalPerMonth = finalTotal / plan.supplyMonths;
    return Object.assign({}, plan, {
      promoApplied: applied,
      promoCode: promo.code,
      promoDiscount: discount, promoDiscountLabel: cartUSD(discount),
      finalTotal: finalTotal, finalTotalLabel: cartUSD(finalTotal),
      finalPerMonth: finalPerMonth, finalPerMonthLabel: cartUSD(finalPerMonth),
      totalSavings: plan.listTotal - finalTotal,
      totalSavingsLabel: cartUSD(plan.listTotal - finalTotal),
    });
  }

  // ---- Order: more than one treatment -------------------------------------
  // A basket holds several treatments, each on its OWN membership term. Terms
  // are not shared, because the ladders genuinely differ: NAD+ quotes 1 and 3
  // months where GLP-1 quotes 1, 3, 6 and 12. One shared term could only ever
  // offer what EVERY chosen treatment offers, so adding NAD+ would silently
  // delete GLP-1's two best deals — the customer would watch the 6- and
  // 12-month cards disappear with no explanation.
  //
  // The code is an ORDER-level discount, taken once no matter how many
  // treatments are in the basket. "JOIN120" reads to a customer as $120 off
  // joining; charging it per line would quietly make it $240 on a two-treatment
  // order, which is a different offer than the name states.
  //
  // Qualification sums supply across the basket rather than asking any one line
  // to clear the bar. That keeps the rule it replaces intact — don't hand $120
  // off a $200 month-to-month order — while letting a genuinely large basket
  // qualify. With every 1-month plan worth 1 supply month, unlocking it still
  // takes a real multi-month commitment.
  //
  // Lines take UNDISCOUNTED plans (straight from chimeCartPlans). The reduction
  // belongs to the order, so it is reported once here rather than smeared across
  // the lines, and every line still shows the ladder price it was chosen at.
  // `entered` is a resolved code object from chimeCartResolveCode, or null. It
  // is applied AFTER the automatic promo — a percentage off the price the
  // customer would otherwise pay — because that is what "% off your order"
  // means to the person typing it.
  //
  // ⚠️ THE TWO STACK, and the combined figure is much larger than either looks.
  // On NAD+'s 3-month plan: $420 ladder, less $120 automatic, less 24% of the
  // $300 remainder = $228 paid against a $640 list price — a 64% total
  // reduction. On a two-treatment basket it is 59%. That is a pricing decision,
  // not a technical one; if the two should be exclusive rather than cumulative,
  // this is the line to change.
  function chimeCartOrder(lines, promo, entered) {
    promo = promo || window.CHIME_CART_PROMO || {};
    var rows = (lines || []).filter(function (l) { return l && l.product && l.plan; });
    var subtotal = 0, listTotal = 0, supplyMonths = 0;
    rows.forEach(function (l) {
      subtotal += l.plan.total;
      listTotal += l.plan.listTotal;
      supplyMonths += l.plan.supplyMonths;
    });
    var off = Number(promo.discount) || 0;
    var applied = !!promo.enabled
      && off > 0
      && rows.length > 0
      && supplyMonths >= (promo.minSupplyMonths || 0)
      // Same guard as the single-plan path: a flat discount must never reach the
      // subtotal. A $0 order is a bug, not an offer, and a negative one is worse.
      && off < subtotal;
    var discount = applied ? off : 0;
    var total = subtotal - discount;

    // Percentage off what is left, rounded to the cent so the figure shown and
    // the figure charged cannot drift apart by a fraction.
    var pct = entered && Number(entered.percent) > 0 ? Number(entered.percent) : 0;
    var codeOk = pct > 0 && pct < 100 && rows.length > 0 && total > 0;
    var codeOff = codeOk ? Math.round(total * pct) / 100 : 0;
    total = total - codeOff;
    // A per-month equivalent for the ORDER is only honest on a single-line
    // basket. With two treatments on different terms the customer buys 4 months
    // of one and 12 of the other, so dividing the order total by the summed
    // supply months would quote a monthly cost for a duration that does not
    // exist — and understate the early months, when both are being paid for.
    // Null on multi-line baskets; every line still states its own rate.
    var perMonth = rows.length === 1 ? total / rows[0].plan.supplyMonths : null;
    return {
      lines: rows, count: rows.length, supplyMonths: supplyMonths,
      perMonth: perMonth, perMonthLabel: perMonth == null ? null : cartUSD(perMonth),
      subtotal: subtotal, subtotalLabel: cartUSD(subtotal),
      listTotal: listTotal, listTotalLabel: cartUSD(listTotal),
      ladderSavings: listTotal - subtotal, ladderSavingsLabel: cartUSD(listTotal - subtotal),
      promoApplied: applied, promoCode: promo.code,
      promoDiscount: discount, promoDiscountLabel: cartUSD(discount),
      codeApplied: codeOk, code: codeOk ? entered.code : null,
      codePercent: codeOk ? pct : 0,
      codeDiscount: codeOff, codeDiscountLabel: cartUSD(codeOff),
      total: total, totalLabel: cartUSD(total),
      // One figure the customer can check: list price minus what they pay,
      // ladder savings and code savings folded together.
      totalSavings: listTotal - total, totalSavingsLabel: cartUSD(listTotal - total),
    };
  }

  // ---- Badges: one superlative per SCREEN, not per ladder -------------------
  // Each treatment carries its own ladder, and both ladders badge their 3-month
  // tier "Most Popular" — so a two-treatment basket used to claim it twice. A
  // superlative that appears twice is not one.
  //
  // Takes the basket in display order and returns { treatmentId: { planKey:
  // badge } }, spending each distinct badge on the FIRST tier that wants it. A
  // different superlative ("Best Deal" on the year) is unaffected.
  //
  // Lives here, as a pure function over the basket, precisely so the UI does not
  // have to resolve it while rendering: doing that meant mutating shared state
  // mid-render, and React re-rendering a panel then consumed the badge a second
  // time and displayed nothing.
  function chimeCartBadges(basket) {
    var claimed = {};
    var out = {};
    (basket || []).forEach(function (b) {
      if (!b || !b.id) return;
      out[b.id] = {};
      (b.plans || []).forEach(function (p) {
        if (!p.badge || claimed[p.badge]) return;
        claimed[p.badge] = true;
        out[b.id][p.key] = p.badge;
      });
    });
    return out;
  }

  function chimeCartProduct(id) {
    return (window.CHIME_PRODUCTS || []).filter(function (p) { return p.id === id; })[0] || null;
  }

  // The catalog product as THIS page sells it: the treatment's own `plans`
  // (the client ladder) replace the catalog rows; name and vial art stay the
  // catalog's. Null when the id has no catalog row.
  function chimeCartTreatmentProduct(t) {
    var base = t && chimeCartProduct(t.id);
    if (!base) return null;
    return t.plans ? Object.assign({}, base, { plans: t.plans }) : base;
  }

  // ---- Entry: what the page was opened with --------------------------------
  // Funnels hand the cart a selection in the URL:
  //   cart.html?treatment=semaglutide,nad&term=3mo
  //   cart.html?treatment=tirzepatide&term=6mo#checkout
  // `treatment` is a comma list of slugs (or catalog ids); `term` applies to
  // each listed treatment whose ladder has it, and a per-treatment
  // `term_<slug>=` wins over it. The chime-checkout shape (?med=sema|tirz&
  // term=1|3|6) is accepted too, so a link written for one checkout does not
  // silently land empty on the other.
  // Returns { ids: [...], terms: { id: key } } — unknown slugs and terms are
  // dropped, never guessed; an empty `ids` means "no selection passed".
  var CART_TERM_ALIASES = { "1": "1mo", "3": "3mo", "6": "6mo", "12": "1yr" };
  var CART_MED_ALIASES = { sema: "semaglutide", tirz: "tirzepatide" };
  function chimeCartEntry(search) {
    var q = {};
    String(search || "").replace(/^\?/, "").split("&").forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf("="), k = i < 0 ? pair : pair.slice(0, i), v = i < 0 ? "" : pair.slice(i + 1);
      try { v = decodeURIComponent(v.replace(/\+/g, " ")); } catch (e) {}
      q[k.toLowerCase()] = v;
    });
    var list = window.CHIME_CART_TREATMENTS || [];
    var find = function (s) {
      s = String(s || "").trim().toLowerCase();
      s = CART_MED_ALIASES[s] || s;
      return list.filter(function (t) { return t.slug === s || t.id === s; })[0] || null;
    };
    var term = function (s) {
      s = String(s || "").trim().toLowerCase();
      return CART_TERM_ALIASES[s] || s;
    };
    var ids = [], terms = {};
    String(q.treatment || q.med || "").split(",").forEach(function (s) {
      var t = find(s);
      if (!t || ids.indexOf(t.id) >= 0) return;
      ids.push(t.id);
      var want = term(q["term_" + t.slug] || q.term);
      var product = chimeCartTreatmentProduct(t);
      var ok = product && product.plans.some(function (p) { return p.key === want; });
      if (ok) terms[t.id] = want;
    });
    return { ids: ids, terms: terms };
  }

  // The URL the funnel pages should link to. Kept here so the assessment and
  // any future funnel build the same shape the parser above reads.
  function chimeCartHref(slugs, termKey) {
    var s = (slugs || []).filter(Boolean);
    if (!s.length) return "cart.html";
    return "cart.html?treatment=" + s.join(",") + (termKey ? "&term=" + termKey : "");
  }

  // ---- Prefill from the assessment -----------------------------------------
  // chimeAssessment.html already asked for first/last name, email and phone
  // (screen A3) and keeps its answers in localStorage under its versioned key
  // (ASMT_V4_STORE_KEY in AssessmentV4Flow.jsx — change both together). Asking
  // the same patient for the same four things twice in one journey is the
  // clearest "information not transferred" failure there is, so the checkout
  // starts with them filled in; the customer can still edit every one.
  // Returns only the fields it could read — never an empty key — and nothing at
  // all when there is no assessment on this device.
  var ASMT_STORE_KEY = "chime_assessment_v4_4";
  function chimeCartPrefill(storage) {
    var saved = null;
    try { saved = JSON.parse((storage || window.localStorage).getItem(ASMT_STORE_KEY) || "null"); } catch (e) {}
    var a = saved && saved.answers && saved.answers.A3;
    if (!a || typeof a !== "object") return {};
    var out = {};
    var name = [a.firstName, a.lastName].map(function (x) { return String(x || "").trim(); })
      .filter(Boolean).join(" ");
    if (name) out.name = name;
    if (String(a.email || "").trim()) out.email = String(a.email).trim();
    var phone = CART_FORMAT.phone(a.phone);
    if (phone) out.phone = phone;
    return out;
  }

  // ---- Checkout fields ------------------------------------------------------
  // 50 states + DC, the list the choose-treatment checkout's State select uses.
  window.CHIME_US_STATES = [
    ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
    ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
    ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
    ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
    ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
    ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
    ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
    ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
    ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
    ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
    ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
    ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
    ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
  ];

  // As-you-type formatting. Each takes what is in the box and returns what
  // should be; digits are the only thing kept, so pasting "555.321.2343" or
  // "4242-4242-…" lands in the same shape as typing it.
  function digits(v, max) { return String(v == null ? "" : v).replace(/\D/g, "").slice(0, max); }
  var CART_FORMAT = {
    phone: function (v) {
      var d = digits(v, 11);
      if (d.length === 11 && d[0] === "1") d = d.slice(1);
      d = d.slice(0, 10);
      if (d.length < 4) return d;
      if (d.length < 7) return "(" + d.slice(0, 3) + ") " + d.slice(3);
      return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
    },
    zip: function (v) {
      var d = digits(v, 9);
      return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
    },
    dob: function (v) {
      var d = digits(v, 8);
      if (d.length < 3) return d;
      if (d.length < 5) return d.slice(0, 2) + "/" + d.slice(2);
      return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
    },
    card: function (v) { return digits(v, 19).replace(/(\d{4})(?=\d)/g, "$1 "); },
    exp: function (v) {
      var d = digits(v, 4);
      return d.length < 3 ? d : d.slice(0, 2) + " / " + d.slice(2);
    },
    cvc: function (v) { return digits(v, 4); },
  };

  function luhn(num) {
    var sum = 0, dbl = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var n = +num[i];
      if (dbl) { n *= 2; if (n > 9) n -= 9; }
      sum += n; dbl = !dbl;
    }
    return num.length > 0 && sum % 10 === 0;
  }

  // One message per field, or "" when it is fine. Messages say what to fix,
  // not that something is "invalid" — the customer can act on the first kind.
  // `now` is injectable so the date rules are testable.
  var CART_LABELS = {
    email: "your email", name: "your full name", dob: "your date of birth",
    line1: "your street address", city: "your city", state: "your state",
    zip: "your ZIP code", phone: "your phone number",
    card: "your card number", exp: "the expiration date", cvc: "the security code",
  };
  function chimeCartFieldError(key, value, now) {
    var v = String(value == null ? "" : value).trim();
    if (key === "state") return v ? "" : "Choose your state.";
    if (!v) return "Enter " + CART_LABELS[key] + ".";
    now = now || new Date();
    if (key === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter an email like name@example.com.";
    }
    if (key === "name") return /\S+\s+\S+/.test(v) ? "" : "Enter your first and last name.";
    if (key === "zip") return /^\d{5}(-\d{4})?$/.test(v) ? "" : "Enter a 5-digit ZIP code.";
    if (key === "phone") return digits(v, 20).length === 10 ? "" : "Enter a 10-digit US phone number.";
    if (key === "dob") {
      var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
      if (!m) return "Enter your date of birth as MM/DD/YYYY.";
      var mo = +m[1], d = +m[2], y = +m[3];
      var dt = new Date(y, mo - 1, d);
      if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d || y < 1900) {
        return "Enter a real date as MM/DD/YYYY.";
      }
      var age = now.getFullYear() - y - ((now.getMonth() < mo - 1
        || (now.getMonth() === mo - 1 && now.getDate() < d)) ? 1 : 0);
      if (age < 0) return "Enter a real date as MM/DD/YYYY.";
      return age >= 18 ? "" : "You must be 18 or older to order treatment.";
    }
    if (key === "card") {
      var n = digits(v, 30);
      return n.length >= 13 && n.length <= 19 && luhn(n) ? "" : "Check your card number.";
    }
    if (key === "exp") {
      var e = /^(\d{2}) \/ (\d{2})$/.exec(v);
      if (!e || +e[1] < 1 || +e[1] > 12) return "Enter the expiration date as MM / YY.";
      // A card is good through the LAST day of its expiry month.
      var end = new Date(2000 + +e[2], +e[1], 1);
      return end > now ? "" : "This card has expired.";
    }
    if (key === "cvc") return /^\d{3,4}$/.test(v) ? "" : "Enter the 3 or 4 digits on your card.";
    return "";
  }

  // ---- Order hand-off -------------------------------------------------------
  // The ONE record the checkout produces, shaped for whatever backend takes the
  // order (the platform is not this repo's to build). Everything a fulfilment
  // system needs is here — the treatments and terms, every figure as charged,
  // both codes, the patient and shipping details — and NOTHING from the card:
  // raw card data must only ever reach the payment processor's own fields.
  function chimeCartOrderRecord(order, form, method, now) {
    now = now || new Date();
    var f = form || {};
    return {
      version: 1,
      source: "cart.html",
      createdAt: now.toISOString(),
      lines: (order.lines || []).map(function (l) {
        return {
          productId: l.product.id, product: l.product.name,
          planKey: l.plan.key, plan: l.plan.title,
          supplyMonths: l.plan.supplyMonths, billedMonths: l.plan.billedMonths,
          total: l.plan.total, perMonth: Math.round(l.plan.perMonth * 100) / 100,
        };
      }),
      subtotal: order.subtotal,
      promo: order.promoApplied ? { code: order.promoCode, amount: order.promoDiscount } : null,
      code: order.codeApplied ? { code: order.code, percent: order.codePercent, amount: order.codeDiscount } : null,
      total: Math.round(order.total * 100) / 100,
      dueToday: 0,
      paymentMethod: method,
      patient: {
        name: String(f.name || "").trim(), email: String(f.email || "").trim(),
        dob: f.dob || "", phone: f.phone || "",
      },
      shipping: {
        line1: String(f.line1 || "").trim(), line2: String(f.line2 || "").trim(),
        city: String(f.city || "").trim(), state: f.state || "", zip: f.zip || "",
      },
      billingSameAsShipping: method === "card" ? !!f.sameBilling : null,
    };
  }

  // The integration point. The checkout awaits this with the record above; a
  // backend replaces it with its own function (POST, then resolve — or reject
  // with an Error whose message the customer should read). The default keeps
  // the record in this tab so the confirmation, QA and analytics can read it:
  //   JSON.parse(sessionStorage.getItem("chime:cart-order"))
  window.chimeCartSubmitOrder = window.chimeCartSubmitOrder || function (record) {
    try { sessionStorage.setItem("chime:cart-order", JSON.stringify(record)); } catch (e) {}
    return Promise.resolve({ ok: true });
  };

  Object.assign(window, {
    chimeCartPlans: chimeCartPlans,
    chimeCartApplyPromo: chimeCartApplyPromo,
    chimeCartOrder: chimeCartOrder,
    chimeCartBadges: chimeCartBadges,
    chimeCartResolveCode: chimeCartResolveCode,
    chimeCartProduct: chimeCartProduct,
    chimeCartTreatmentProduct: chimeCartTreatmentProduct,
    chimeCartEntry: chimeCartEntry,
    chimeCartHref: chimeCartHref,
    chimeCartFormat: CART_FORMAT,
    chimeCartPrefill: chimeCartPrefill,
    chimeCartFieldError: chimeCartFieldError,
    chimeCartOrderRecord: chimeCartOrderRecord,
    chimeCartMoney: cartMoney,
    chimeCartUSD: cartUSD,
  });
})();
