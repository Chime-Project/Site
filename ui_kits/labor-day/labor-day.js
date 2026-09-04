// Chime Health — Labor Day offer landing (labor-day.html) — behavior.
// Only what ui_kits/amerilean/amerilean.js lacks: the marquee tickers, the
// offer countdown, the spots bar, the estimate slider and the CTA promo
// hand-off. amerilean.js still runs the .reveal observer; its own slider and
// carousel branches are skipped because this page has no #weight and no
// #quotes-track.
(function () {
  "use strict";

  // ---- Tickers: clone the item list once so translateX(-50%) loops cleanly
  document.querySelectorAll(".ticker__track").forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });

  // ---- Countdown: data-ends is a local-time ISO string ("…T00:00:00" with
  // no zone = the viewer's midnight, which is how the reference reads too).
  var cd = document.querySelector("[data-ends]");
  if (cd) {
    var ends = new Date(cd.getAttribute("data-ends")).getTime();
    var unit = {
      d: cd.querySelector('[data-cd="d"]'),
      h: cd.querySelector('[data-cd="h"]'),
      m: cd.querySelector('[data-cd="m"]'),
      s: cd.querySelector('[data-cd="s"]'),
    };
    var pad = function (n) {
      return (n < 10 ? "0" : "") + n;
    };
    var timer;
    var tick = function () {
      var left = ends - Date.now();
      if (isNaN(left) || left <= 0) {
        clearInterval(timer);
        cd.innerHTML = '<p class="countdown__ended">This offer has ended.</p>';
        document.querySelectorAll(".offer-bar").forEach(function (bar) {
          bar.hidden = true;
        });
        return;
      }
      var s = Math.floor(left / 1000);
      unit.d.textContent = pad(Math.floor(s / 86400));
      unit.h.textContent = pad(Math.floor((s % 86400) / 3600));
      unit.m.textContent = pad(Math.floor((s % 3600) / 60));
      unit.s.textContent = pad(s % 60);
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  // ---- Spots bar: width from the static data attributes (stand-in numbers)
  document.querySelectorAll(".spots").forEach(function (el) {
    var claimed = Number(el.getAttribute("data-claimed"));
    var total = Number(el.getAttribute("data-total"));
    var fill = el.querySelector(".spots__fill");
    if (fill && total > 0) {
      fill.style.setProperty(
        "--pct",
        Math.min(100, Math.round((claimed / total) * 100)) + "%",
      );
    }
  });

  // ---- Estimate slider: current weight → "you could lose" figure. The ratio
  // is the reference's (305 lbs → 46 lbs ≈ 15%); it is an estimate, not a
  // clinical claim — the disclaimer under the slider says so.
  var input = document.getElementById("lbdWeight");
  if (input) {
    var fill = document.getElementById("lbdFill");
    var knob = document.getElementById("lbdKnob");
    var cur = document.getElementById("lbdWeightVal");
    var out = document.getElementById("lbdLoss");
    var LOSS = 0.15;
    var render = function () {
      var v = Number(input.value);
      var min = Number(input.min);
      var max = Number(input.max);
      var pct = ((v - min) / (max - min)) * 100;
      fill.style.width = pct + "%";
      knob.style.left = pct + "%";
      cur.textContent = v;
      out.textContent = Math.round(v * LOSS);
    };
    input.addEventListener("input", render);
    render();
  }

  // ---- CTA hand-off: remember the promo for a future checkout hookup, then
  // follow the real href (no preventDefault, so middle-click / new tab work).
  document
    .querySelectorAll('a[href="chimeAssessment.html"]')
    .forEach(function (a) {
      a.addEventListener("click", function () {
        try {
          sessionStorage.setItem(
            "chime:labor-day-offer",
            JSON.stringify({ offer: "free-nad-6mo", ends: "2026-09-07" }),
          );
        } catch (e) {
          /* storage unavailable — the CTA still navigates */
        }
      });
    });
})();
