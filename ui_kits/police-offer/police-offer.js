// Chime Health — Police appreciation offer — behavior for BOTH steps:
// step 1 police-offer.html (the offer box: medication → free product → plan →
// code → price, the sticky mobile bar) and step 2 police-offer-checkout.html
// (the order summary, the code form, the checkout form). Only what
// ui_kits/amerilean/amerilean.js lacks. amerilean.js still runs the .reveal
// observer; its slider and carousel branches are skipped (no #weight, no
// #quotes-track on this page).
//
// The price math (quote) is pure and exported on window.PoliceOffer / module
// so police-offer-tests.js can run it under node with no DOM.
(function (root) {
  "use strict";

  // ---- Data ---------------------------------------------------------------
  // The client's 2026-09-06 ladder, the same numbers chime-checkout reads
  // (chime-checkout/js/plan-select.js). `due` is what is charged today,
  // `months` how many months of supply that covers (3-month plans ship a
  // free 4th month), `retail` the struck comparison total on the checkouts.
  var PLANS = {
    sema: {
      name: "Semaglutide",
      1: { rate: 299, due: 299, months: 1, retail: 349 },
      3: { rate: 249, due: 747, months: 4, retail: 1396 },
    },
    tirz: {
      name: "Tirzepatide",
      1: { rate: 359, due: 359, months: 1, retail: 399 },
      3: { rate: 299, due: 897, months: 4, retail: 1596 },
    },
  };
  var TERMS = { 1: "Monthly plan", 3: "3 month plan" };
  // Free product: $0 on the order; "$299 value" is the bonus checkouts'
  // stand-in figure (chime-checkout-bonus), flagged in the page head comment.
  var GIFTS = {
    tesa: { name: "Tesamorelin", value: 299 },
    nad: { name: "NAD+", value: 299 },
  };
  // ⚠ PLACEHOLDER CODE. Nobody has sent the real code or amount yet.
  // `percent` takes value% off the plan's due-today figure; `flat` takes
  // $value off (never below $0). The free product is never discounted.
  var CODES = {
    SERVE20: { type: "percent", value: 20, label: "Officer pricing" },
  };

  // ---- Pure helpers -------------------------------------------------------
  function normalizeCode(s) {
    return String(s || "").replace(/\s+/g, "").toUpperCase();
  }
  function round2(n) {
    return Math.round(n * 100) / 100;
  }
  function money(n) {
    var neg = n < 0;
    n = Math.abs(n);
    var whole = Math.floor(n + 1e-9);
    var cents = Math.round((n - whole) * 100);
    if (cents === 100) { whole += 1; cents = 0; }
    var s = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (cents) s += "." + (cents < 10 ? "0" : "") + cents;
    return (neg ? "-$" : "$") + s;
  }
  // quote({med, term, gift, code}) → null until med + term are known.
  function quote(sel) {
    sel = sel || {};
    var plan = PLANS[sel.med] && PLANS[sel.med][sel.term];
    if (!plan) return null;
    var key = normalizeCode(sel.code);
    var code = CODES[key] || null;
    var regular = plan.due;
    var discount = 0;
    if (code) {
      discount = code.type === "percent"
        ? round2((regular * code.value) / 100)
        : Math.min(regular, round2(code.value));
    }
    var total = round2(regular - discount);
    return {
      med: sel.med,
      medName: PLANS[sel.med].name,
      term: Number(sel.term),
      termName: TERMS[sel.term],
      gift: GIFTS[sel.gift] ? sel.gift : null,
      giftName: GIFTS[sel.gift] ? GIFTS[sel.gift].name : null,
      giftValue: GIFTS[sel.gift] ? GIFTS[sel.gift].value : 0,
      code: code ? key : null,
      codeLabel: code ? code.label : null,
      rate: plan.rate,
      months: plan.months,
      retail: plan.retail,
      regular: regular,
      discount: discount,
      total: total,
      perMonth: round2(total / plan.months),
      savings: round2(plan.retail - total),
    };
  }

  var api = {
    PLANS: PLANS,
    GIFTS: GIFTS,
    CODES: CODES,
    quote: quote,
    money: money,
    normalizeCode: normalizeCode,
  };
  root.PoliceOffer = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  // ---- Tickers: clone the item list once so translateX(-50%) loops cleanly
  document.querySelectorAll(".ticker__track").forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });

  // ---- Shared state — step 1 (police-offer.html, the offer box) and step 2
  // (police-offer-checkout.html, the form) run this same file. The selection
  // travels as ?med&gift&term&code on the checkout link and, as a fallback,
  // in sessionStorage.
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CHECKOUT_URL = "police-offer-checkout.html";
  var OFFER_URL = "police-offer.html#offer";
  var state = { med: null, gift: null, term: null, code: "" };

  var box = $("offer");
  var form = $("poForm");
  if (!box && !form) return;

  var el = {
    tiles: box ? box.querySelectorAll("[data-med], [data-gift], [data-term]") : [],
    codeForm: $("poCodeForm"),
    codeInput: $("poCode"),
    codeMsg: $("poCodeMsg"),
    strip: $("poStripPrice"),
    stripReg: $("poStripReg"),
    stripNow: $("poStripNow"),
    pick: $("poPick"),
    price: $("poPrice"),
    reg: $("poReg"),
    now: $("poNow"),
    per: $("poPer"),
    save: $("poSave"),
    hint: $("poHint"),
    cta: $("poCta"),
    bar: $("poBar"),
    barLabel: $("poBarLabel"),
    barPrice: $("poBarPrice"),
    barLink: $("poBarLink"),
    sum: {
      med: $("poSumMed"), gift: $("poSumGift"), term: $("poSumTerm"),
      codeRow: $("poSumCodeRow"), code: $("poSumCode"),
      reg: $("poSumReg"), discRow: $("poSumDiscRow"), disc: $("poSumDisc"),
      total: $("poSumTotal"), per: $("poSumPer"), empty: $("poSumEmpty"), body: $("poSumBody"),
    },
  };

  function setText(node, text) { if (node) node.textContent = text; }
  function show(node, on) { if (node) node.hidden = !on; }

  function checkoutHref() {
    var p = new URLSearchParams();
    if (state.med) p.set("med", state.med);
    if (state.gift) p.set("gift", state.gift);
    if (state.term) p.set("term", state.term);
    if (state.code) p.set("code", state.code);
    var qs = p.toString();
    return CHECKOUT_URL + (qs ? "?" + qs : "");
  }

  function stepOf(tile) {
    return tile.hasAttribute("data-med") ? "med" : tile.hasAttribute("data-gift") ? "gift" : "term";
  }
  function markChecked() {
    if (!box) return;
    Array.prototype.forEach.call(el.tiles, function (t) {
      var step = stepOf(t);
      var on = String(t.getAttribute("data-" + step)) === String(state[step]);
      t.setAttribute("aria-checked", on ? "true" : "false");
    });
    box.querySelectorAll("[data-po-step]").forEach(function (s) {
      s.classList.toggle("is-done", !!state[s.getAttribute("data-po-step")]);
    });
  }

  // Term tiles carry the rate for the chosen medication ("from" until one is picked).
  function renderTerms() {
    if (!box) return;
    box.querySelectorAll("[data-term]").forEach(function (t) {
      var term = t.getAttribute("data-term");
      var plan = state.med ? PLANS[state.med][term] : null;
      var rate = t.querySelector("[data-po-rate]"), due = t.querySelector("[data-po-due]");
      if (plan) {
        setText(rate, money(plan.rate) + "/mo");
        setText(due, term === "3" ? money(plan.due) + " today · includes 4 months" : "Billed monthly · 4-week supply");
      } else {
        var lo = Math.min(PLANS.sema[term].rate, PLANS.tirz[term].rate);
        setText(rate, "from " + money(lo) + "/mo");
        setText(due, term === "3" ? "Includes a free 4th month" : "4-week supply");
      }
    });
  }

  function missing() {
    var m = [];
    if (!state.med) m.push("your medication");
    if (!state.gift) m.push("your free product");
    if (!state.term) m.push("a plan");
    return m;
  }

  function persist(q) {
    try {
      sessionStorage.setItem("chime:police-offer", JSON.stringify(state));
      if (q) {
        var sel = { med: state.med, term: state.term };
        if (state.gift) sel.addon = state.gift;
        if (q.code) sel.code = q.code;
        sessionStorage.setItem("chime:checkout-selection", JSON.stringify(sel));
      }
    } catch (e) { /* storage unavailable — the page still works */ }
  }

  function render() {
    markChecked();
    renderTerms();
    var q = quote(state);
    var complete = q && state.gift;
    var miss = missing();

    // offer-box summary
    show(el.price, !!q);
    show(el.pick, !q);
    if (!q) {
      var list = miss.length === 3 ? "your medication, your free product and a plan"
        : miss.slice(0, -1).join(", ") + (miss.length > 1 ? " and " : "") + miss[miss.length - 1];
      setText(el.pick, "Pick " + list + " to see your price.");
    } else {
      setText(el.reg, money(q.regular));
      if (el.reg) el.reg.classList.toggle("is-struck", q.discount > 0);
      show(el.now, q.discount > 0);
      setText(el.now, money(q.total));
      setText(el.per, (q.term === 3 ? "due today · " + money(q.perMonth) + "/mo · includes 4 months" : "billed monthly · 4-week supply")
        + (q.giftName ? " · free " + q.giftName : ""));
      show(el.save, q.discount > 0);
      setText(el.save, (q.codeLabel || "Code") + " applied — you save " + money(q.discount));
      show(el.hint, q.discount === 0);
    }

    // top strip mirror
    show(el.strip, !!q);
    if (q) {
      setText(el.stripReg, money(q.regular));
      if (el.stripReg) el.stripReg.classList.toggle("is-struck", q.discount > 0);
      show(el.stripNow, q.discount > 0);
      setText(el.stripNow, money(q.total));
    }

    // step-2 link, CTA + mobile bar
    var href = checkoutHref();
    if (el.cta) {
      el.cta.setAttribute("href", href);
      el.cta.setAttribute("aria-disabled", complete ? "false" : "true");
      el.cta.classList.toggle("is-disabled", !complete);
    }
    if (el.barLink) el.barLink.setAttribute("href", href);
    show(el.bar, !!complete);
    document.body.classList.toggle("has-po-bar", !!complete);
    if (complete) {
      setText(el.barLabel, q.medName + " · " + (q.term === 3 ? "3 month" : "Monthly") + " · + " + q.giftName);
      setText(el.barPrice, money(q.total));
    }

    // order summary (step 2, and the lander's preview if present)
    show(el.sum.empty, !complete);
    show(el.sum.body, !!complete);
    if (complete) {
      setText(el.sum.med, q.medName + " — " + q.termName);
      setText(el.sum.gift, q.giftName + " · $" + q.giftValue + " value");
      setText(el.sum.term, q.term === 3 ? "4 months of supply (3 + 1 free)" : "1 month of supply");
      show(el.sum.codeRow, q.discount > 0);
      setText(el.sum.code, q.code + " · " + q.codeLabel);
      setText(el.sum.reg, money(q.regular));
      show(el.sum.discRow, q.discount > 0);
      setText(el.sum.disc, "-" + money(q.discount));
      setText(el.sum.total, money(q.total));
      setText(el.sum.per, money(q.perMonth) + " per month of supply");
    }

    persist(q);
  }

  // ---- Step 1: tiles ------------------------------------------------------
  Array.prototype.forEach.call(el.tiles, function (t) {
    t.addEventListener("click", function () {
      var step = stepOf(t);
      state[step] = step === "term" ? Number(t.getAttribute("data-term")) : t.getAttribute("data-" + step);
      render();
      // walk the visitor to the next step on phones, where the box is a column
      var next = box.querySelector('[data-po-step]:not(.is-done)') || $("poSummary");
      if (next && window.innerWidth < 810) {
        next.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    });
  });

  // ---- Code form (the offer box's strip on step 1, the summary card on step 2)
  function codeMessage(text, kind) {
    if (!el.codeMsg) return;
    el.codeMsg.textContent = text;
    el.codeMsg.className = "po-code__msg" + (kind ? " po-code__msg--" + kind : "");
    if (el.codeForm) el.codeForm.classList.toggle("is-invalid", kind === "error");
    if (el.codeForm) el.codeForm.classList.toggle("is-valid", kind === "ok");
  }
  function applyCode(raw, quiet) {
    var key = normalizeCode(raw);
    if (!key) {
      if (state.code) {
        state.code = "";
        codeMessage("Code removed. Regular pricing shown.", "");
      } else if (!quiet) {
        codeMessage("Enter your officer code to see your price.", "error");
      }
      render();
      return false;
    }
    if (!CODES[key]) {
      state.code = "";
      codeMessage("That code isn't valid. Check it and try again.", "error");
      render();
      return false;
    }
    state.code = key;
    if (el.codeInput) el.codeInput.value = key;
    var c = CODES[key];
    codeMessage(c.label + " applied: " + (c.type === "percent" ? c.value + "% off" : money(c.value) + " off") + " your plan.", "ok");
    render();
    return true;
  }
  if (el.codeForm) {
    el.codeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      applyCode(el.codeInput ? el.codeInput.value : "");
    });
    if (el.codeInput) {
      el.codeInput.addEventListener("input", function () {
        if (el.codeForm.classList.contains("is-invalid")) codeMessage("", "");
      });
    }
  }

  // disabled CTA: point at the first missing step instead of navigating
  if (el.cta && box) {
    el.cta.addEventListener("click", function (e) {
      if (el.cta.getAttribute("aria-disabled") !== "true") return;
      e.preventDefault();
      var next = box.querySelector('[data-po-step]:not(.is-done)');
      if (next) {
        next.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        next.classList.remove("is-nudge");
        void next.offsetWidth;
        next.classList.add("is-nudge");
      }
    });
  }

  // ---- Step 2: checkout form ----------------------------------------------
  // Prototype: formats and validates like chime-checkout, no backend. A valid
  // submit stores the order in sessionStorage and swaps to the success state.
  if (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, select"));
    var formError = $("poFormError");
    var success = $("poSuccess");
    var submitTotal = $("poSubmitTotal");

    var digits = function (v) { return String(v || "").replace(/\D/g, ""); };
    var luhn = function (num) {
      var sum = 0, dbl = false;
      for (var i = num.length - 1; i >= 0; i--) {
        var d = +num[i];
        if (dbl) { d *= 2; if (d > 9) d -= 9; }
        sum += d; dbl = !dbl;
      }
      return num.length >= 13 && num.length <= 19 && sum % 10 === 0;
    };
    var expiryOk = function (v) {
      var d = digits(v);
      if (d.length !== 4) return false;
      var m = +d.slice(0, 2), y = +d.slice(2);
      if (m < 1 || m > 12) return false;
      var now = new Date(), cy = now.getFullYear() % 100, cm = now.getMonth() + 1;
      return y > cy || (y === cy && m >= cm);
    };
    var checks = {
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      phone: function (v) { var d = digits(v); return d.length === 10 || (d.length === 11 && d[0] === "1"); },
      zip: function (v) { return /^\d{5}(-\d{4})?$/.test(v.trim()); },
      card: function (v) { return luhn(digits(v)); },
      expiry: expiryOk,
      cvc: function (v) { return /^\d{3,4}$/.test(digits(v)); },
    };

    // live formatting
    var fmt = {
      card: function (v) { return digits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 "); },
      expiry: function (v) { var d = digits(v).slice(0, 4); return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d; },
      cvc: function (v) { return digits(v).slice(0, 4); },
      zip: function (v) { var d = digits(v).slice(0, 9); return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d; },
      phone: function (v) {
        var d = digits(v); if (d.length === 11 && d[0] === "1") d = d.slice(1); d = d.slice(0, 10);
        if (d.length > 6) return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
        if (d.length > 3) return "(" + d.slice(0, 3) + ") " + d.slice(3);
        return d;
      },
    };
    var fieldWrap = function (f) { return f.closest(".po-field") || f.closest(".po-check"); };
    var setFieldError = function (f, msg) {
      var wrap = fieldWrap(f);
      if (!wrap) return;
      wrap.classList.toggle("is-invalid", !!msg);
      var out = wrap.querySelector(".po-field__msg");
      if (f.type === "checkbox") out = $("poConsentMsg");
      if (out && (msg || f.type !== "checkbox")) out.textContent = msg || "";
      if (msg) f.setAttribute("aria-invalid", "true"); else f.removeAttribute("aria-invalid");
      if (out && msg) { out.id = out.id || f.id + "Msg"; f.setAttribute("aria-describedby", out.id); }
    };
    var validateField = function (f) {
      var v = f.type === "checkbox" ? f.checked : f.value;
      var kind = f.getAttribute("data-kind");
      var bad = false;
      if (f.required && (f.type === "checkbox" ? !v : !String(v).trim())) bad = true;
      else if (kind && checks[kind] && !checks[kind](v)) bad = true;
      setFieldError(f, bad ? f.getAttribute("data-msg") || "Please check this field." : "");
      return !bad;
    };

    fields.forEach(function (f) {
      var kind = f.getAttribute("data-kind");
      if (kind && fmt[kind]) {
        f.addEventListener("input", function () {
          var pos = f.selectionEnd, atEnd = pos === f.value.length;
          f.value = fmt[kind](f.value);
          if (atEnd) { try { f.setSelectionRange(f.value.length, f.value.length); } catch (e) {} }
        });
      }
      f.addEventListener("blur", function () { if (f.value || f.type === "checkbox") validateField(f); });
      f.addEventListener("input", function () { if (fieldWrap(f) && fieldWrap(f).classList.contains("is-invalid")) validateField(f); });
      if (f.type === "checkbox") f.addEventListener("change", function () {
        validateField(f);
        var open = fields.filter(function (c) { return c.type === "checkbox" && c.required && !c.checked; });
        if ($("poConsentMsg") && open.length === 0) $("poConsentMsg").textContent = "";
      });
    });

    var showFormError = function (html) {
      if (!formError) return;
      formError.innerHTML = html;
      formError.hidden = false;
      formError.focus();
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (formError) formError.hidden = true;
      var q = quote(state);
      if (!q || !state.gift) {
        showFormError('Build your plan first — pick your medication, your free product and a plan <a href="' + OFFER_URL + '">on the offer page</a>.');
        return;
      }
      var firstBad = null;
      fields.forEach(function (f) { if (!validateField(f) && !firstBad) firstBad = f; });
      if (firstBad) {
        showFormError("Please check the highlighted fields below.");
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        return;
      }
      var ref = "PO-" + Date.now().toString(36).toUpperCase().slice(-6);
      var order = {
        ref: ref, placed: new Date().toISOString(), quote: q,
        customer: { firstName: $("poFirst").value.trim(), lastName: $("poLast").value.trim(), email: $("poEmail").value.trim(), phone: $("poPhone").value.trim() },
        shipping: { address1: $("poAddr1").value.trim(), address2: $("poAddr2").value.trim(), city: $("poCity").value.trim(), state: $("poState").value, zip: $("poZip").value.trim() },
        payment: { last4: digits($("poCard").value).slice(-4), expiry: $("poExpiry").value }, // never the full card number
        consent: { telehealth: true, terms: true },
      };
      try { sessionStorage.setItem("chime:police-offer-order", JSON.stringify(order)); } catch (err) {}
      setText($("poSuccessEmail"), order.customer.email);
      setText($("poSuccessRef"), ref);
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        success.focus();
      }
      show(el.bar, false);
      document.body.classList.remove("has-po-bar");
    });

    // keep the submit button's total in step with the selection
    var _render = render;
    render = function () {
      _render();
      var q = quote(state);
      setText(submitTotal, q && state.gift ? money(q.total) : "");
      if (formError && !formError.hidden && q && state.gift && /Build your plan/.test(formError.textContent)) formError.hidden = true;
    };
  }

  // ---- Restore (back from step 2) and deep links: ?med=sema|tirz&gift=tesa|nad&term=1|3&code=…
  try {
    var saved = JSON.parse(sessionStorage.getItem("chime:police-offer") || "null");
    if (saved && typeof saved === "object") {
      if (PLANS[saved.med]) state.med = saved.med;
      if (GIFTS[saved.gift]) state.gift = saved.gift;
      if (TERMS[saved.term]) state.term = Number(saved.term);
      if (saved.code && CODES[normalizeCode(saved.code)]) state.code = normalizeCode(saved.code);
    }
  } catch (e) { /* ignore */ }
  var qs = new URLSearchParams(location.search);
  if (PLANS[qs.get("med")]) state.med = qs.get("med");
  if (GIFTS[qs.get("gift")]) state.gift = qs.get("gift");
  if (TERMS[qs.get("term")]) state.term = Number(qs.get("term"));
  var urlCode = qs.get("code");
  if (urlCode || state.code) {
    var initial = urlCode || state.code;
    if (el.codeForm) {
      if (el.codeInput) el.codeInput.value = initial;
      applyCode(initial, true);
    } else {
      state.code = CODES[normalizeCode(initial)] ? normalizeCode(initial) : "";
    }
  }
  render();
})(typeof window !== "undefined" ? window : this);
