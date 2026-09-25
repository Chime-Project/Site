/* chime-deep-belly-burn/product.html — the hero's treatment selector (redesign round 5, 2026-09-21):
   the radio cards of choose-treatment/v2.html's phone selector. A tap marks the card (aria-pressed,
   accent border, filled radio), names that combo in the sticky bar and glides down to its plan
   rows (#plans-<med>, a timed eased scroll); the combo card flashes once on arrival. Picking a plan row further down marks
   the matching card here too. It only points at a combo — plan-select.js still owns the selection. */
(function () {
  var root = document.querySelector("[data-ts-root]"); if (!root) return;
  var NAMES = { tirz: "Tirzepatide + Tesamorelin", sema: "Semaglutide + Tesamorelin" };
  var IMAGES = { tirz: "images/vial-tirzepatide.webp", sema: "images/vial-semaglutide.webp" };
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mark(med) {
    root.querySelectorAll("[data-ts]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.ts === med ? "true" : "false"); });
  }
  function arrive(card) {
    if (!card || calm) return;
    card.classList.remove("ts-arrived"); void card.offsetWidth; card.classList.add("ts-arrived");
    setTimeout(function () { card.classList.remove("ts-arrived"); }, 1600);
  }
  // A timed, eased scroll instead of the browser's own smooth scroll, which covers this distance in
  // well under half a second — too fast to read as "taking you to your pick". 0.7–1.2s by distance;
  // any wheel / touch / key input hands the scroll back to the visitor at once.
  var run = 0;
  function glide(el, done) {
    var margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    var from = window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var to = Math.max(0, Math.min(max, from + el.getBoundingClientRect().top - margin));
    if (calm || Math.abs(to - from) < 4) { window.scrollTo({ top: to, behavior: "instant" }); done(); return; }
    var id = ++run, t0 = null, ms = Math.max(700, Math.min(1200, Math.abs(to - from) * 0.45));
    function stop() { run++; off(); }
    function off() { ["wheel", "touchstart", "keydown"].forEach(function (n) { window.removeEventListener(n, stop); }); }
    ["wheel", "touchstart", "keydown"].forEach(function (n) { window.addEventListener(n, stop, { passive: true }); });
    requestAnimationFrame(function step(t) {
      if (id !== run) return;
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      window.scrollTo({ top: from + (to - from) * e, behavior: "instant" });
      if (k < 1) requestAnimationFrame(step); else { off(); done(); }
    });
  }
  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-ts]"); if (!btn) return;
    var med = btn.dataset.ts, rows = document.getElementById("plans-" + med); if (!rows) return;
    mark(med);
    // the sticky bar names the pick, unless a plan is already chosen (then plan-select.js owns it)
    var picked = window.ChimeFlow && window.ChimeFlow.current().med;
    var img = document.getElementById("sticky-med-img"), name = document.getElementById("sticky-med-name");
    if (!picked && img) img.src = IMAGES[med];
    if (!picked && name) name.textContent = NAMES[med];
    glide(rows, function () { arrive(rows.closest("[data-med]")); });
  });
  // a plan row picked in a combo card marks that combo up here as well
  document.querySelectorAll("[data-mp]").forEach(function (block) {
    block.addEventListener("click", function (e) { if (e.target.closest(".mp-row")) mark(block.dataset.mp); });
  });
  var q = new URLSearchParams(location.search).get("med"); if (NAMES[q]) mark(q);
})();
