/* Chime Health intake — checkout (HIPAA sheet → shipping → choose your plan + payment), a vanilla port of the
   reference's checkout: same markup and classes (css/checkout.css), plan ladder and totals (js/plans.js), auto-renew copy
   per plan, address checks (complete, no PO boxes, LA / MS blocked), toasts, rotating testimonial (5 s).
   Differences, on purpose — this page takes no payment and sends nothing:
   - address: plain fields (theirs: Google Places autocomplete, then the same fields); not saved anywhere;
   - Link / Klarna / card: inert look-alikes of the Stripe elements; "COMPLETE PURCHASE", Link and Klarna show a demo
     notice instead of charging; coupons can't be checked against their backend, so every code reads "Invalid coupon code";
   - the HIPAA consent is remembered in sessionStorage only (theirs: localStorage + a call to their backend);
   - Trustpilot buttons do nothing. */
(function () {
  "use strict";
  var C = window.CHIME_INTAKE, PL = window.CHIME_PLANS;
  var page = document.getElementById("checkout");
  var answers = null, pick = null;
  try { answers = JSON.parse(sessionStorage.getItem(C.ANSWERS_KEY) || "null"); pick = JSON.parse(sessionStorage.getItem(PL.HANDOFF_KEY) || "null"); } catch (e) {}
  if (!answers || !pick || !PL.MEDS[pick.med]) { location.replace("../recommendation/"); return; }
  var HIPAA_KEY = "chime-intake:hipaa-consent-accepted";

  var S = {
    step: "shipping", submitting: false, term: PL.TERMS.indexOf(Number(pick.term)) > -1 ? Number(pick.term) : PL.DEFAULT_TERM,
    address: { addressLine1: "", addressLine2: "", city: "", state: C.isServiceableState(answers.state) ? String(answers.state).toUpperCase() : "", zip: "" },
    stateText: null, coupon: "", couponBusy: false, couponError: "", review: 0
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

  var AR = window.CHIME_INTAKE_RULES, sanitizeText = AR.sanitizeText, sanitizeZip = AR.sanitizeZip, resolveState = AR.resolveState, addressError = AR.addressError;

  // ---------- icons (lucide, as theirs) ----------
  var LUCIDE = function (w, cls, body, extra) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + w + '" viewBox="0 0 24 24" fill="none" stroke="' + (extra || "currentColor") + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide ' + cls + '" aria-hidden="true">' + body + '</svg>'; };
  var I = {
    back: LUCIDE(16, "lucide-chevron-left", '<path d="m15 18-6-6 6-6"></path>', "#000"),
    lock20: LUCIDE(20, "lucide-lock", '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'),
    lock16: LUCIDE(16, "lucide-lock", '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'),
    check18: LUCIDE(18, "lucide-check", '<path d="M20 6 9 17l-5-5"></path>'),
    check24: LUCIDE(24, "lucide-check", '<path d="M20 6 9 17l-5-5"></path>'),
    check14: LUCIDE(14, "lucide-check", '<path d="M20 6 9 17l-5-5"></path>'),
    badge: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-check rx-icon-badge" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg>',
    badge24: LUCIDE(24, "lucide-badge-check", '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path>'),
    chevron24: LUCIDE(24, "lucide-chevron-left", '<path d="m15 18-6-6 6-6"></path>'),
    circleX: LUCIDE(24, "lucide-circle-x", '<circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path>'),
    info: LUCIDE(24, "lucide-info", '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>')
  };
  var TSTAR = function (id, fill) { return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clip-path="url(#' + id + ')"><path d="M11.4847 10.1132L12.9447 14.6079L8.00267 11.0159L11.4847 10.1132ZM16 5.20658H9.89L8.00333 -0.607422L6.11 5.20791L0 5.19991L4.948 8.79791L3.05467 14.6072L8.00267 11.0159L11.058 8.79791L16 5.20658Z" fill="' + fill + '"></path></g><defs><clipPath id="' + id + '"><rect width="16" height="16" fill="' + (fill === "#242424" ? "#242424" : "white") + '"></rect></clipPath></defs></svg>'; };
  var LOGO = function (lazy) { return '<img alt="Chime Health"' + (lazy ? ' loading="lazy"' : "") + ' width="120" height="40" decoding="async" src="../images/chime-logo-black.png">'; };

  // Their checkout testimonials (names and words theirs; the faces are Chime stand-ins)
  var REVIEWS = [
    { title: "GLP-1 gave me my life back", body: "I have been using GLP-1 for a year and a half and have lost 79 pounds so far. My BMI was 39.9. Now my BMI is 27.3. GLP-1 gave me my life back.", author: "Ariane B.", date: "13 Aug, 2023", image: "../images/avatar-ariane.webp" },
    { title: "GLP-1 medication has been my greatest asset", body: "I am down 52lbs and feel a weight has been lifted off my shoulders. It's been an incredible journey, and my only regret is not starting sooner.", author: "Claudia C.", date: "3 Jan, 2024", image: "../images/avatar-kat.webp" },
    { title: "Thank you GLP-1!", body: "I could never get rid of the excess weight. I even got lipo, but nothing worked. I then started GLP-1 and lost 28 lbs within the first year.", author: "Kat R.", date: "23 May, 2025", image: "../images/avatar-claudia.webp" }
  ];

  // ---------- markup ----------
  function topbar() { return '<div class="rx-checkout-topbar">' + LOGO(true) + '<div class="rx-checkout-topbar__secure">' + I.lock20 + '<span>Secure' + (S.step === "shipping" ? " " : "") + '<br>Checkout</span></div></div>'; }
  function stepper() {
    var pay = S.step === "payment";
    return '<div class="rx-checkout-step-indicator"><button type="button" class="step-box purchase-back-btn" data-act="quiz"><div class="step-circle completed">' + I.check18 + '</div><div class="step-label completed">Quiz</div></button>' +
      '<div class="step-line ' + (pay ? "completed" : "current") + '"></div>' +
      (pay ? '<button type="button" class="step-box shipping-back-btn" data-act="to-shipping"><div class="step-circle completed">' + I.check18 + '</div><div class="step-label completed">Shipping</div></button>'
           : '<div class="step-box"><div class="step-circle current">' + I.check18 + '</div><div class="step-label current">Shipping</div></div>') +
      '<div class="step-line ' + (pay ? "current" : "pending") + '"></div><div class="step-box"><div class="step-circle ' + (pay ? "current" : "pending") + '">' + (pay ? I.check18 : "<span>3</span>") + '</div><div class="step-label ' + (pay ? "current" : "pending") + '">Payment</div></div></div>';
  }
  function testimonial() {
    var r = REVIEWS[S.review], stars = "";
    for (var k = 0; k < 5; k++) stars += TSTAR("checkout-star-" + k, "#FBBF24");
    // §4c: the title leads the card; their star rating moves below it.
    return '<div class="rx-checkout-side-card rx-checkout-testimonials"><span class="rx-checkout-review-trigger"><div class="rx-checkout-testimonial"><h3>' + esc(r.title) + '</h3><div class="rx-checkout-testimonial__stars review-stars">' + stars + '</div><p>' + esc(r.body) + '</p>' +
      '<div class="rx-checkout-testimonial__author"><img alt="' + esc(r.author) + '" loading="lazy" width="42" height="42" decoding="async" src="' + r.image + '"><div><strong>' + esc(r.author) + '</strong><div>' + I.badge24 + 'Verified GLP-1 User</div></div></div>' +
      '<div class="rx-checkout-testimonial__date"><strong>Date of Experience:</strong> ' + esc(r.date) + '</div></div></span>' +
      '<div class="rx-checkout-testimonials__actions"><button type="button" class="rx-checkout-nav-btn" data-act="rev-prev">' + I.chevron24 + '</button><button type="button" class="rx-checkout-nav-btn rx-checkout-nav-btn-next" data-act="rev-next">' + I.chevron24 + '</button></div></div>';
  }
  function asideCommon() {
    return '<div class="rx-divider-text"></div><p class="rx-checkout-side__join">Join 100,000+ weight loss patients</p><div class="rx-checkout-side__expect"><h3>What to expect next?</h3><div>' + I.check24 + 'Instant access to patient portal.</div><div>' + I.check24 + 'Doctor approval within ~4 hours.</div><div>' + I.check24 + 'Meds ship within 48-72 hours.</div></div>' +
      '<div data-slot="testimonial">' + testimonial() + '</div>' +
      '<div class="rx-checkout-side-card rx-checkout-help"><span><button type="button" class="rx-btn rx-btn--secondary rx-btn--wide rx-trustpilot-btn"><span>Read <b>Trustpilot</b> Reviews</span>' + TSTAR("clip0_1035_3104", "#242424") + '</button></span></div>';
  }
  function field(label, key, value, placeholder, extra) {
    return '<label class="rx-field"><span class="rx-field__label">' + label + '</span><input autocomplete="off" placeholder="' + placeholder + '" class="rx-input" type="text" value="' + esc(value) + '" data-addr="' + key + '"' + (extra || "") + '></label>';
  }
  function shipping() {
    var a = S.address, st = S.stateText == null ? a.state : S.stateText;
    var codes = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","ME","MD","MA","MI","MN","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC","AS","GU","MP","PR","UM","VI"];
    return '<div class="rx-checkout-shell rx-checkout-shell--vcenter"><section class="rx-checkout-main">' + topbar() + stepper() +
      '<div class="rx-checkout-intro"><h1>Shipping Address</h1><p>Where should we send your order?</p></div><div class="rx-shipping-page"><div><div class="rx-grid rx-grid--2" style="margin-top:16px">' +
      '<div style="grid-column:1 / -1">' + field("Address line 1", "addressLine1", a.addressLine1, "Street address") + '</div>' +
      '<div style="grid-column:1 / -1">' + field("Address line 2", "addressLine2", a.addressLine2, "Apt, suite, etc. (optional)") + '</div>' +
      field("City", "city", a.city, "City") +
      '<label class="rx-field"><span class="rx-field__label">State</span><input placeholder="Type state" class="rx-input" list="ch-states" autocomplete="off" type="text" value="' + esc(st) + '" data-addr="state"><datalist id="ch-states">' + codes.map(function (c) { return '<option value="' + c + '"></option>'; }).join("") + '</datalist></label>' +
      field("ZIP code", "zip", a.zip, "ZIP", ' inputmode="numeric"') +
      '</div></div><div class="rx-step-action"><button type="button" class="rx-btn rx-btn--primary rx-btn--wide" data-act="ship-next"' + (S.submitting ? " disabled" : "") + '><span class="rx-btn__stack"><span>Continue</span></span></button></div></div></section>' +
      '<aside class="rx-checkout-side">' + asideCommon() + '</aside></div>';
  }
  function planRow(p) {
    return '<button type="button" class="rx-plan ' + (p.term === S.term ? "rx-plan--active" : "") + '" data-term="' + p.term + '"><div class="rx-plan__head"><div><div class="rx-plan__title-row"><h3 class="rx-plan__title">' + p.title + '</h3>' + (p.pill ? '<span class="rx-pill">' + p.pill + '</span>' : "") + '</div>' +
      (p.savings > 0 ? '<div class="rx-copy rx-copy--strong">' + PL.money(p.savings) + ' Total Savings</div>' : "") + '</div><div class="rx-plan__pricing"><div class="rx-plan__price">' + PL.money(p.monthly) + '/mo</div>' + (p.huge ? '<span class="rx-huge-savings">HUGE SAVINGS</span>' : "") + '</div></div></button>';
  }
  // Stripe look-alikes (inert; no names, nothing typed is read or sent)
  var LINK_MARK = '<svg class="ch-link__mark" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11" fill="#011e0f"></circle><path d="M9 6.6 13.4 11 9 15.4" fill="none" stroke="#00d66f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg><span class="ch-link__word">link</span>';
  var DISCOVER = '<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#fff" stroke="#d9d9d9"></rect><path d="M24 9.5V14a2 2 0 0 1-2 2H9.5C15 15 20.5 12.6 24 9.5Z" fill="#f48120"></path><text x="3" y="9.6" font-size="4.6" font-family="Arial" font-weight="700" fill="#231f20">DISCOVER</text></svg>';
  function cardLookalike() {
    var brand = function (src, alt) { return '<img src="../images/' + src + '" alt="" width="24" height="16" aria-hidden="true" title="' + alt + '">'; };
    return '<div class="StripeElement ch-stripe" aria-label="Card details (demo only, inert)"><div class="ch-stripe__field"><span class="ch-stripe__label">Card number</span><span class="ch-stripe__input"><span class="ch-stripe__ph">1234 1234 1234 1234</span><span class="ch-stripe__brands">' +
      brand("payments-visa.png", "Visa") + brand("payments-mastercard.png", "Mastercard") + brand("payments-amex.png", "American Express") + DISCOVER + '</span><span class="ch-stripe__brand-one">' + brand("payments-mastercard.png", "Mastercard") + '</span></span></div>' +
      '<div class="ch-stripe__field"><span class="ch-stripe__label">Expiration date</span><span class="ch-stripe__input"><span class="ch-stripe__ph">MM / YY</span></span></div></div>';
  }
  function legal(p) {
    return '<div class="rx-copy rx-small-text-copy rx-subscription-agreement"><p>By enrolling, I acknowledge that I am signing up for a recurring subscription and authorize Chime Health to charge my selected payment method at the applicable renewal rate until I cancel.</p><p>I may cancel my subscription at any time through my patient portal. To avoid future charges, I must cancel before my next scheduled renewal date.</p><p>More than 80% of our members continue GLP-1 therapy for longer than six months. Chime Health is committed to supporting members throughout their treatment journey while offering some of the most competitive pricing available online.</p></div>' +
      '<div class="rx-copy rx-small-text-copy">' + esc(p.renewal) + ' You confirm that you have read and agree to the <a href="../return-refund-policy.html" target="_blank">Refund Policy</a>, <a href="../hipaa-notice.html" target="_blank">HIPAA Notice</a>,&nbsp;<a href="../terms-conditions.html" target="_blank">Terms of Use</a>, <a href="../privacy-policy.html" target="_blank">Privacy Policy</a>, and <a href="../telehealth-consent.html" target="_blank">Telehealth Consent</a>, and are at least 18 years of age.</div>';
  }
  function summary(p) {
    return '<div class="rx-stack"><div class="rx-info-card"><div class="rx-product-review-top"><h3 class="rx-info-card__title" style="margin:0">Order Summary</h3><div class="rx-product-review-top__content"><div class="rx-plan__title-row"><h3 class="rx-info-card__title" style="margin:0">' + p.medName + '</h3><div class="rx-copy rx-copy--strong">' + esc(p.compound) + '</div><div class="rx-copy">' + esc(p.supply) + '</div></div><div class="rx-product-review-top__price">' + PL.money(p.monthly) + '/mo</div></div></div>' +
      '<div class="rx-order-meta"><div class="rx-order-meta__row"><span>Savings</span><strong>' + PL.money(p.savings) + '</strong></div></div>' +
      '<div class="rx-stack" style="gap:12px;margin-top:18px"><div class="rx-feature-row"><div class="rx-feature-row__left">' + I.badge + '<span>Online Clinician Visit</span></div><strong><span>$49</span> FREE</strong></div><div class="rx-feature-row"><div class="rx-feature-row__left">' + I.badge + '<span>Expedited Shipping</span></div><strong><span>$19.99</span> FREE</strong></div><div class="rx-feature-row"><div class="rx-feature-row__left">' + I.badge + '<span>Weight Loss Warranty</span></div><strong>Activated</strong></div></div>' +
      '<div class="rx-order-total"><div class="rx-order-total__copy">Due today</div><div class="rx-order-total__value">' + PL.money(p.total) + '</div></div>' +
      '<div class="rx-coupon-section"><span class="rx-coupon-section__label">Have a coupon code?</span><div class="rx-coupon-grid"><input placeholder="Enter code" autocomplete="off" spellcheck="false" type="text" value="' + esc(S.coupon) + '" data-coupon="1"' + (S.couponBusy ? " disabled" : "") + '><button type="button" data-act="coupon"' + (!S.coupon.trim() || S.couponBusy ? " disabled" : "") + '>' + (S.couponBusy ? "..." : "Apply") + '</button></div>' +
      (S.couponError ? '<div class="rx-coupon-error">' + esc(S.couponError) + '</div>' : "") + '</div></div></div>';
  }
  function payment() {
    var p = PL.plan(pick.med, S.term);
    return '<div class="rx-checkout-shell"><section class="rx-checkout-main">' + topbar() + stepper() + '<div class="rx-checkout-intro"><h1>Choose Your Plan</h1></div><div class="rx-payment-page">' +
      '<div class="rx-stack">' + PL.TERMS.map(function (t) { return planRow(PL.plan(pick.med, t)); }).join("") + '</div>' +
      '<div class="rx-stack"><div class="rx-question-card__head"><h2 class="rx-question-card__title">Payment Method</h2><p class="rx-question-card__subtitle">Lock in industry low pricing.</p></div>' +
      '<div class="express-checkout-section"><div class="express-checkout-box"><div><div class="StripeElement"><button type="button" class="ch-link" data-act="demo" aria-label="Pay securely with Link (demo only)"><span>Pay securely with</span>' + LINK_MARK + '</button></div></div>' +
      (S.term !== 1 ? '<button type="button" class="klarna-btn" data-act="demo"><span class="klarna-btn-text">Buy now, pay later with</span><img alt="Klarna" loading="lazy" width="84" height="24" decoding="async" class="klarna-logo" src="../images/klarna.png"></button>' : "") +
      '</div><div class="divider"><div class="divider-line"></div><span>OR</span><div class="divider-line"></div></div></div>' +
      '<div class="rx-info-card"><div class="rx-payment-header"><h3 class="rx-info-card__title" style="margin:0">Pay with</h3><div class="rx-payment-icons"><img alt="American Express" loading="lazy" width="39" height="24" decoding="async" src="../images/payments-amex.png"><img alt="MasterCard" loading="lazy" width="39" height="24" decoding="async" src="../images/payments-mastercard.png"><img alt="Visa" loading="lazy" width="39" height="24" decoding="async" src="../images/payments-visa.png"></div></div>' + cardLookalike() + '</div></div>' +
      '<div class="rx-step-action"><button type="button" class="rx-btn rx-btn--primary rx-btn--wide" data-act="demo">' + I.lock16 + '<span class="rx-btn__stack"><span>COMPLETE PURCHASE</span><small>Instant Refund if not approved</small></span></button></div>' +
      legal(p) + '</div></section><aside class="rx-checkout-side">' + summary(p) + asideCommon() + '</aside></div>';
  }
  function render() {
    page.className = "rx-page rx-page--checkout rx-page-step-" + S.step;
    page.querySelector(".rx-back-icon-btn").disabled = S.step === "shipping" || S.submitting;
    var scene = page.querySelector(".rx-step-scene");
    scene.className = "rx-step-scene " + S.step;
    scene.firstElementChild.innerHTML = S.step === "shipping" ? shipping() : payment();
  }
  // re-render one region without touching focused inputs
  function patch(sel, html) { var el = page.querySelector(sel); if (el) el.outerHTML = html; }

  // ---------- toasts (their rx-toast stack) ----------
  var stack = page.querySelector(".rx-toast-stack");
  function toast(message, tone, ms) {
    var t = document.createElement("div");
    t.className = "rx-toast rx-toast--" + (tone || "info");
    t.innerHTML = (tone === "error" ? I.circleX : "") + "<span>" + esc(message) + "</span>";
    t.style.cssText = "opacity:0;transform:translateY(-25px);transition:opacity .2s,transform .2s";
    stack.insertBefore(t, stack.firstChild);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "none"; });
    setTimeout(function () { t.style.opacity = "0"; t.style.transform = "translateX(25px)"; setTimeout(function () { t.remove(); }, 200); }, ms || 500);
  }
  function top() { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }

  // ---------- behaviour ----------
  function shipNext() {
    if (S.submitting) return;
    S.submitting = true; render();
    setTimeout(function () {
      S.submitting = false;
      var a = { addressLine1: sanitizeText(S.address.addressLine1, 120), addressLine2: sanitizeText(S.address.addressLine2, 120), city: sanitizeText(S.address.city, 80),
                state: sanitizeText(String(S.address.state || "").toUpperCase(), 20), zip: sanitizeZip(S.address.zip) };
      var err = addressError(a);
      if (err) { render(); toast(err, "error", 5200); return; }
      S.address = a; S.stateText = null; S.step = "payment"; render(); top();   // theirs saves the address here; nothing is sent
    }, 500);
  }
  page.addEventListener("click", function (ev) {
    var t = ev.target;
    var term = t.closest("[data-term]");
    if (term) { S.term = Number(term.getAttribute("data-term")); S.couponError = ""; render(); return; }
    var a = t.closest("[data-act]"); if (!a) { if (t.closest(".rx-back-icon-btn")) goBack(); return; }
    var k = a.getAttribute("data-act");
    if (k === "ship-next") shipNext();
    else if (k === "to-shipping") { S.step = "shipping"; render(); top(); }
    else if (k === "rev-prev") { S.review = (S.review - 1 + REVIEWS.length) % REVIEWS.length; restartRotation(); patchReview(); }
    else if (k === "rev-next") { S.review = (S.review + 1) % REVIEWS.length; restartRotation(); patchReview(); }
    else if (k === "coupon") applyCoupon();
    else if (k === "demo") toast("Demo checkout — no payment is taken on this page.", "info", 3200);
    else if (k === "hipaa") acceptHipaa();
    // "quiz": their Quiz step button does nothing either
  });
  function goBack() { if (S.step === "payment" && !S.submitting) { S.step = "shipping"; render(); top(); } }
  page.addEventListener("input", function (ev) {
    var t = ev.target, k = t.getAttribute("data-addr");
    if (k === "state") {
      var v = t.value.toUpperCase().replace(/[^A-Z ]/g, "").slice(0, 24);
      S.stateText = v; S.address.state = resolveState(v); if (t.value !== v) t.value = v; return;
    }
    if (k) {
      var val = k === "zip" ? sanitizeZip(t.value) : sanitizeText(t.value, k === "city" ? 80 : 120);
      S.address[k] = val; if (t.value !== val) t.value = val; return;
    }
    if (t.getAttribute("data-coupon")) {
      S.coupon = t.value.toUpperCase(); if (t.value !== S.coupon) t.value = S.coupon;
      var had = !!S.couponError; S.couponError = "";
      var btn = t.parentNode.querySelector("button"); btn.disabled = !S.coupon.trim();
      if (had) { var e = page.querySelector(".rx-coupon-error"); if (e) e.remove(); }
    }
  });
  page.addEventListener("focusout", function (ev) {
    if (ev.target.getAttribute("data-addr") === "state") { S.stateText = resolveState(S.stateText == null ? S.address.state : S.stateText); ev.target.value = S.stateText; }
  });
  page.addEventListener("keydown", function (ev) { if (ev.target.getAttribute("data-coupon") && ev.key === "Enter") { ev.preventDefault(); applyCoupon(); } });
  function applyCoupon() {
    var code = S.coupon.trim().toUpperCase(); if (!code || S.couponBusy) return;
    S.couponBusy = true; S.couponError = ""; patch(".rx-checkout-side > .rx-stack", summary(PL.plan(pick.med, S.term)));
    setTimeout(function () {   // theirs validates against their backend; nothing to check against here
      S.couponBusy = false; S.couponError = "Invalid coupon code"; patch(".rx-checkout-side > .rx-stack", summary(PL.plan(pick.med, S.term)));
    }, 500);
  }
  // testimonial: next every 5 s, as theirs
  var rot = null;
  function patchReview() { var slot = page.querySelector('[data-slot="testimonial"]'); if (slot) slot.innerHTML = testimonial(); }
  function restartRotation() { clearInterval(rot); rot = setInterval(function () { S.review = (S.review + 1) % REVIEWS.length; patchReview(); }, 5000); }

  // HIPAA "Before You Continue" sheet (portal at the end of body, as theirs)
  function acceptHipaa() {
    try { sessionStorage.setItem(HIPAA_KEY, "1"); } catch (e) {}
    var o = document.querySelector('[role="dialog"][aria-labelledby="hic-title"]'); if (o) o.remove();
    document.body.style.overflow = "";
  }
  function showHipaa() {
    var seen = false; try { seen = sessionStorage.getItem(HIPAA_KEY) === "1"; } catch (e) {}
    if (seen) return;
    var M = "HealthInfoConsentModal-module-scss-module__iHs1aa__hic-";
    var d = document.createElement("div");
    d.innerHTML = '<div class="' + M + 'overlay" role="dialog" aria-modal="true" aria-labelledby="hic-title" aria-describedby="hic-body"><div class="' + M + 'card"><h2 id="hic-title" class="' + M + 'title">Before You Continue</h2><p id="hic-body" class="' + M + 'body">By continuing, you agree that we may securely use your health information to coordinate your treatment with licensed providers and pharmacies, in accordance with our <a href="../privacy-policy.html" target="_blank" class="' + M + 'link">Privacy Policy</a>.</p><button type="button" class="' + M + 'btn">I Agree &amp; Continue</button></div></div>';
    var o = d.firstElementChild;
    o.querySelector("button").addEventListener("click", acceptHipaa);
    document.body.appendChild(o);
    document.body.style.overflow = "hidden";
  }
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) { S.submitting = false; render(); } });

  window.__chimeCheckout = { addressError: addressError, resolveState: resolveState, state: S };
  render(); restartRotation(); showHipaa();
})();
