// Amerilean landing (amerilean.html) — behavior.
// Ported from the NativeMed reference's slider.js; the AOS library is replaced
// by the same IntersectionObserver .reveal pattern nad.html/nad2.html use, so
// the page keeps zero external JS dependencies.
(function () {
  "use strict";

  // ---- Transformation projector: range input + live weight readouts --------
  var input = document.getElementById("weight");
  if (input) {
    var fill = document.getElementById("projFill");
    var knob = document.getElementById("projKnob");
    var weightVal = document.getElementById("weightVal");
    var month3Val = document.getElementById("month3Val");
    var yearVal = document.getElementById("yearVal");

    var render = function () {
      var value = Number(input.value);
      var min = Number(input.min);
      var max = Number(input.max);
      var pct = ((value - min) / (max - min)) * 100;

      fill.style.width = pct + "%";
      knob.style.left = pct + "%";
      weightVal.textContent = value + " lbs";
      // Same clinical-average factors as the reference: ~8% at month 3,
      // ~10% at one year.
      month3Val.textContent = Math.round(value * 0.92) + " lbs";
      yearVal.textContent = Math.round(value * 0.9) + " lbs";
    };

    input.addEventListener("input", render);
    render();
  }

  // ---- Testimonial carousel: center-snapped, seamless infinite loop --------
  // Ported from the reference's testimonials.js; cards are cloned as DOM nodes
  // instead of re-rendered from strings, so the markup stays the only source.
  var track = document.getElementById("quotes-track");
  if (track) {
    var sourceCards = Array.prototype.slice.call(track.children);
    var count = sourceCards.length;

    // Pad a full loop of clones on each side so the track always has room to
    // scroll either direction and never reaches a hard end.
    sourceCards.forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
    sourceCards
      .slice()
      .reverse()
      .forEach(function (li) {
        var clone = li.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.insertBefore(clone, track.firstChild);
      });

    var originals = Array.prototype.slice.call(
      track.children,
      count,
      count * 2,
    );

    var step = function () {
      var card = track.querySelector(".quote");
      return card ? card.offsetWidth + 34 : track.clientWidth;
    };

    // Scroll only the track itself (not scrollIntoView, which would also
    // scroll the whole page to drag this off-screen section into view).
    var centerOn = function (card, instant) {
      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
        behavior: instant ? "instant" : "smooth",
      });
    };

    // Start centered on the first real card, not the lead-in clones.
    centerOn(originals[0], true);

    // Once a scroll settles inside either clone loop, silently re-anchor to
    // the matching real card so dragging or arrowing never runs out of track.
    var settleTimer;
    track.addEventListener("scroll", function () {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () {
        var cards = track.querySelectorAll(".quote");
        var center = track.scrollLeft + track.clientWidth / 2;
        var index = -1;
        var closestDist = Infinity;
        cards.forEach(function (card, i) {
          var dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
          if (dist < closestDist) {
            closestDist = dist;
            index = i;
          }
        });
        if (index > -1 && (index < count || index >= count * 2)) {
          centerOn(originals[((index % count) + count) % count], true);
        }
      }, 120);
    });

    document.querySelectorAll("[data-scroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        track.scrollBy({
          left: step() * Number(btn.dataset.scroll),
          behavior: "smooth",
        });
      });
    });
  }

  // ---- Scroll reveal -------------------------------------------------------
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach(function (el) {
      revealIO.observe(el);
    });
  }
})();
