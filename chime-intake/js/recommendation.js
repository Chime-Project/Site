/* Chime Health intake — recommendation page ("Congrats {name}!"), a vanilla port of the reference's page: same markup,
   projection maths, chart, medication cards (Tirzepatide preselected) and copy. Prices come from their plan ladder
   (js/plans.js). "PROCEED TO CHECKOUT" stores the pick in sessionStorage and opens ../checkout/ — nothing is sent
   (theirs saves a cart on their backend first). Without intake answers it sends you back to the intake, as theirs. */
(function () {
  "use strict";
  var C = window.CHIME_INTAKE, PL = window.CHIME_PLANS;
  var root = document.getElementById("app");
  var answers = null;
  try { answers = JSON.parse(sessionStorage.getItem(C.ANSWERS_KEY) || "null"); } catch (e) { answers = null; }
  if (!answers || !Object.keys(answers).length) { location.replace("../"); return; }
  var med = "tirzepatide", handingOff = false;

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var RR = window.CHIME_INTAKE_RULES, estMonths = RR.estMonths, medMonths = RR.medMonths, points = RR.points;
  var ARROW_R = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8l4 4-4 4"></path><path d="M2 12h20"></path></svg>';
  function chart(pts) {
    if (!pts.length) return '<div class="rx-panel rx-panel--soft"><div class="rx-copy">Enter current and goal weight to generate the projected graph.</div></div>';
    var slots = pts.length <= 7 ? pts.map(function (p, k) { return { month: p.month, weight: p.weight, kind: "point", oi: k, si: k }; })
      : pts.slice(0, 3).map(function (p, k) { return { month: p.month, weight: p.weight, kind: "point", oi: k, si: k }; })
          .concat([{ kind: "gap", month: "...", si: 3 }])
          .concat(pts.slice(pts.length - 3).map(function (p, k) { return { month: p.month, weight: p.weight, kind: "point", oi: pts.length - 3 + k, si: k + 4 }; }));
    var mx = Math.max.apply(null, pts.map(function (p) { return p.weight; }));
    var span = Math.max(mx + 4 - (Math.min.apply(null, pts.map(function (p) { return p.weight; })) - 4), 1);
    var cols = Math.min(slots.length, 7);
    var xy = slots.map(function (p) {
      var x = 36 + 456 * p.si / Math.max(cols - 1, 1);
      return Object.assign({}, p, { x: x, y: p.kind === "gap" ? 131 : 34 + (mx - p.weight) / span * 194 });
    });
    var line = xy.filter(function (p) { return p.kind === "point"; }), d = "";
    if (line.length) {
      d = "M " + line[0].x + " " + line[0].y;
      for (var k = 0; k < line.length - 1; k++) {
        var a = line[k], b = line[k + 1], dx = b.x - a.x;
        d += " C " + (a.x + dx / 3) + " " + a.y + ", " + (a.x + 2 * dx / 3) + " " + b.y + ", " + b.x + " " + b.y;
      }
    }
    var COL = ["#f6532d", "#f48a00", "#e1a015", "#c8b30f", "#9ab61b", "#65b52a", "#2faa2f"];
    var colour = function (oi, n) { return n <= 1 ? COL[COL.length - 1] : COL[Math.min(COL.length - 1, Math.round(oi / (n - 1) * (COL.length - 1)))]; };
    var grid = ""; for (var g = 0; g < 6; g++) { var yy = 34 + 194 * g / 5; grid += '<line x1="36" x2="492" y1="' + yy + '" y2="' + yy + '" stroke="#e3e3e3" stroke-width="1"></line>'; }
    var dots = xy.map(function (p) {
      if (p.kind === "gap") return "";
      if (p.oi === pts.length - 1) return '<g><circle cx="' + p.x + '" cy="' + p.y + '" r="25" fill="#1da329"></circle><text x="' + p.x + '" y="' + (p.y + 8) + '" text-anchor="middle" font-size="22" font-weight="900" fill="#ffffff">' + Math.round(p.weight) + '</text></g>';
      var c = colour(p.oi, pts.length);
      return '<g><circle cx="' + p.x + '" cy="' + p.y + '" r="10" fill="#ffffff" stroke="' + c + '" stroke-width="5"></circle><text x="' + p.x + '" y="' + (p.y - 20) + '" text-anchor="middle" font-size="18" font-weight="800" fill="' + c + '">' + Math.round(p.weight) + '</text></g>';
    }).join("");
    var labels = xy.map(function (p) {
      var n = p.kind === "gap" ? 0 : p.oi + 1;
      var t = p.kind === "gap" ? "..." : n === 1 ? "1ST MONTH" : n === 2 ? "2ND" : n === 3 ? "3RD" : n + "TH";
      return '<text x="' + p.x + '" y="284" text-anchor="middle" font-size="13" font-weight="900" fill="#2f3f91">' + t + '</text>';
    }).join("");
    return '<div><h3 class="rx-chart-heading">Weight Projection: ' + Math.round(pts[0].weight) + '&nbsp;' + ARROW_R + '&nbsp;' + Math.round(pts[pts.length - 1].weight) + ' lbs</h3>' +
      '<svg viewBox="0 0 520 300" class="rx-chart-svg" aria-hidden="true"><defs><linearGradient id="f9-weight-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f6532d"></stop><stop offset="25%" stop-color="#f4b000"></stop><stop offset="80%" stop-color="#72c766"></stop><stop offset="100%" stop-color="#1da329"></stop></linearGradient></defs>' +
      grid + '<path d="' + d + '" fill="none" stroke="url(#f9-weight-gradient)" stroke-width="5" stroke-linecap="round"></path>' + dots + labels + '</svg></div>';
  }
  var ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  var BADGE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
  var CALC = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"></rect><line x1="8" x2="16" y1="6" y2="6"></line><line x1="16" x2="16" y1="14" y2="18"></line><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path></svg>';
  var LOCK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
  var STAR = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M11.4847 10.1132L12.9447 14.6079L8.00267 11.0159L11.4847 10.1132ZM16 5.20658H9.89L8.00333 -0.607422L6.11 5.20791L0 5.19991L4.948 8.79791L3.05467 14.6072L8.00267 11.0159L11.058 8.79791L16 5.20658Z" fill="#00b67a"></path></svg>';
  var PROMO_CARDS = [["Doctor-led treatment", "Licensed providers review your intake, confirm eligibility, and guide treatment safely."],
    ["One transparent price", "Medication, cold-chain shipping, and ongoing clinical support are built into your plan."]];
  var QUOTES = [["Verified patient", "The process felt fast, clear, and medically legitimate from the start."],
    ["Semaglutide member", "Appetite control improved quickly, and I liked that pricing stayed predictable."],
    ["Tirzepatide member", "This felt like a real treatment plan, not another temporary weight-loss gimmick."],
    ["Chime Health member", "The intake was simple, provider communication was clear, and shipping moved faster than I expected."]];
  var PERKS = ["UNLIMITED doctor messaging 7 days a week", "Prescribed & shipped within 72 HOURS", "Cost of medicine INCLUDED in price", "Price remains THE SAME at all doses", "No contracts, cancel ANYTIME"];

  function card(o) {
    return '<button type="button" class="rx-med-card ' + (o.active ? "rx-med-card--active" : "") + '" aria-pressed="' + o.active + '" data-med="' + o.key + '"><span class="rx-med-card--input-wrapper" aria-hidden="true"><span></span></span><span class="rx-med-card--inner-content"><span class="rx-med-card__hero"><span class="rx-med-card__image"><img src="' + o.vial + '" alt="' + o.name + '"></span><span class="rx-med-card__head"><span class="rx-med-card__badge">' + o.badge + '</span><span class="rx-med-card__title">' + o.name + '</span><span class="rx-med-card__compound">' + esc(o.compound) + '</span><span class="rx-med-card__sub">' + o.price + '</span></span></span>' +
      '<span class="rx-med-card__hero-bottom"><ul class="rx-list"><li class="rx-list__item">' + CALC + '<span>Estimated average weight reduction ' + o.reduction + '</span></li><li class="rx-list__item">' + CHECK + '<span>Projected time to goal: ' + (o.months ? o.months + " months" : "—") + '</span></li><li class="rx-list__item">' + LOCK + '<span>All dosages same price</span></li></ul></span><img class="rx-med-card__klarna" src="../images/klarna-badge.webp" alt="Klarna" width="55" height="31"></span></button>';
  }
  function view() {
    var P = C.computeProjections(answers), name = String(answers.first_name == null ? "" : answers.first_name).trim() || "You";
    var w = P.startWeight, g = P.goalWeight, bmi = P.bmi;
    var est = estMonths(w, g, bmi);
    var pts = points(w, g, est == null ? 0 : est);
    var U = Math.max(1, Math.ceil(est == null ? 0 : est)) || 6;
    var dt = new Date(); dt.setMonth(dt.getMonth() + U);
    var by = dt.toLocaleDateString("en-US", U >= 12 ? { month: "long", day: "numeric", year: "numeric" } : { month: "long", day: "numeric" });
    var sema = PL.minMonthly("semaglutide"), tirz = PL.minMonthly("tirzepatide");
    var priceLine = function (x) { return "Starting at $" + x.toFixed(2) + "/mo"; };
    return '<div class="nsi"><div class="rec-promo" role="note"><div class="rec-promo__inner"><span class="rec-promo__badge">New low price</span><span>Semaglutide $' + sema.toFixed(2) + '/mo &amp; Tirzepatide $' + tirz.toFixed(2) + '/mo</span></div></div>' +
      '<div class="rec-page"><header class="rec-header"><img class="rec-logo" src="../images/chime-logo-black.png" alt="Chime Health"><div class="rec-progress-row"><button type="button" class="rec-back-btn" aria-label="Go back" data-act="back"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><div class="rec-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="2" aria-valuenow="1"><div class="rec-progress-fill" style="width:62%"></div></div><div class="rec-progress-count"><b>1</b> / 2</div></div></header>' +
      '<div class="rec-body"><div class="rxc-package"><section><div class="rx-hero__content"><h1 class="rx-hero__title"><span class="rx-recommendation__title-line rx-recommendation__title-line--top">Congrats ' + esc(name) + '!</span><span class="rx-recommendation__title-line rx-recommendation__title-line--main">We can help you lose up to&nbsp;<span class="rx-recommendation__title-accent">' + (P.weightToLose ? P.weightToLose + " " : "your goal ") + 'lbs</span>&nbsp;by <span style="white-space:nowrap">' + by + '</span>!</span></h1></div></section>' +
      '<div class="rx-stack">' + chart(pts) + '</div>' +
      '<div class="rx-results-promo-grid">' + PROMO_CARDS.map(function (c) { return '<div class="rx-results-promo-card"><div class="rx-results-promo-card__icon">' + BADGE + '</div><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>'; }).join("") + '</div>' +
      '<div class="rx-step-action"><button type="button" class="rx-btn rx-btn--secondary rx-btn--wide one-row__stack" data-act="choose"><span class="rx-btn__stack"><span>Choose my medication</span>' + ARROW + '</span></button></div>' +
      '<div class="rx-results-review-grid">' + QUOTES.map(function (q) { return '<article class="rx-results-review-card"><div class="rx-results-review-card__rating" aria-hidden="true"><div class="review-stars">' + STAR + STAR + STAR + STAR + STAR + '</div></div><div class="rx-results-review-card__name">' + q[0] + '</div><div class="rx-results-review-card__meta">Patient feedback</div><p>“' + q[1] + '”</p></article>'; }).join("") + '</div>' +
      '<div id="f9-rec-medications" class="rx-results-medication-copy">Choose your medication to get started <span class="rx-gradient-accent-text-other">TODAY</span></div>' +
      '<ul class="rx-list">' + PERKS.map(function (p) { return '<li class="rx-list__item">' + CHECK + '<span>' + esc(p) + '</span></li>'; }).join("") + '</ul>' +
      '<div class="rx-med-grid">' +
      card({ key: "semaglutide", active: med === "semaglutide", vial: "../images/semaglutide-vial-card.webp", badge: "Most Popular", name: "Semaglutide", compound: "Compounded w/ B12", price: priceLine(sema), reduction: "~16%", months: medMonths(w, g, bmi, "semaglutide") }) +
      card({ key: "tirzepatide", active: med === "tirzepatide", vial: "../images/tirzepatide-vial-card.webp", badge: "Most Effective", name: "Tirzepatide", compound: "Compounded w/ B6 (Pyridoxine)", price: priceLine(tirz), reduction: "~22%", months: medMonths(w, g, bmi, "tirzepatide") }) +
      '</div><div class="rx-step-action"><button type="button" class="rx-btn rx-btn--primary rx-btn--wide one-row__stack" data-act="checkout"' + (handingOff ? " disabled" : "") + '><span class="rx-btn__stack"><span>PROCEED TO CHECKOUT</span>' + ARROW + '</span></button></div>' +
      '</div></div></div></div>';
  }
  function render() { root.innerHTML = view(); }
  root.addEventListener("click", function (ev) {
    var c = ev.target.closest("[data-med]");
    if (c) { med = c.getAttribute("data-med"); render(); return; }
    var a = ev.target.closest("[data-act]"); if (!a) return;
    var k = a.getAttribute("data-act");
    if (k === "back") history.length > 1 ? history.back() : location.assign("../");
    else if (k === "choose") { var t = document.getElementById("f9-rec-medications"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else if (k === "checkout" && !handingOff) {
      handingOff = true; render();
      try { sessionStorage.setItem(PL.HANDOFF_KEY, JSON.stringify({ med: med, term: PL.DEFAULT_TERM })); } catch (e) {}
      location.href = "../checkout/";
    }
  });
  window.addEventListener("pageshow", function (ev) { if (ev.persisted && handingOff) { handingOff = false; render(); } });
  window.__chimeRec = { estMonths: estMonths, medMonths: medMonths, points: points };
  render();
})();
