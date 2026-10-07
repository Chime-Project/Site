/* Chime Health: GLP membership hero versions (client 2026-10-07). Two behaviours; each
   no-ops on pages without its markup, and js/page.js still runs everything below the hero.
     1. estimate  weight-calculator.html: current weight slider -> "you could lose about N lbs"
                  (23% = the real-world tirzepatide average the footnote cites)
     2. lock      price-lock.html: the 15:00 countdown in the top bar, kept per tab in
                  sessionStorage so a reload does not restart it; at 0:00 the bar asks the
                  visitor to lock the price in instead of claiming anything has expired.
   Both controls are a range input and plain text, so nothing depends on click.detail
   (0 for WebKit taps). The pure helpers are exported for node (js/page-tests.js). */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChimeGLPMVersions = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var LOSS_PCT = 0.23;
  var LOCK_SECONDS = 15 * 60;

  function lbsLost(weight) { return Math.round(weight * LOSS_PCT); }
  function clock(seconds) {
    var s = Math.max(0, Math.floor(seconds));
    var m = Math.floor(s / 60), r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  var api = { LOSS_PCT: LOSS_PCT, LOCK_SECONDS: LOCK_SECONDS, lbsLost: lbsLost, clock: clock };
  if (typeof document === "undefined") return api;

  function setupEstimate() {
    var box = document.querySelector("[data-estimate]");
    if (!box) return;
    var range = box.querySelector("input[type=range]");
    var weight = box.querySelector("[data-out=weight]");
    var lose = box.querySelector("[data-out=lose]");
    function draw() {
      var w = +range.value, min = +range.min, max = +range.max;
      weight.textContent = w + " lbs";
      lose.textContent = lbsLost(w) + " lbs";
      range.style.setProperty("--fill", ((w - min) / (max - min) * 100) + "%");
      range.setAttribute("aria-valuetext", w + " pounds");
    }
    range.addEventListener("input", draw);
    draw();
  }

  function setupLock() {
    var bar = document.querySelector("[data-lock]");
    if (!bar) return;
    var time = bar.querySelector("[data-lock-time]");
    var msg = bar.querySelector("[data-lock-msg]");
    var KEY = "chime-glpm-lock-end", end = 0;
    try { end = +sessionStorage.getItem(KEY) || 0; } catch (e) {}
    if (!end || end < Date.now() - 864e5) {
      end = Date.now() + LOCK_SECONDS * 1000;
      try { sessionStorage.setItem(KEY, String(end)); } catch (e) {}
    }
    var timer;
    function tick() {
      var left = (end - Date.now()) / 1000;
      if (left <= 0) {
        clearInterval(timer);
        msg.textContent = "Lock in today’s $49 price before you go";
        return;
      }
      time.textContent = clock(Math.ceil(left));
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  function init() { setupEstimate(); setupLock(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return api;
});
