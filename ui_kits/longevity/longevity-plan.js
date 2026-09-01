// Longevity Lifestyle Plan (longevity-plan.html) — behavior.
// Scroll-reveal comes from ui_kits/amerilean/amerilean.js (loaded alongside);
// this file only owns the product gallery and the plan picker. Zero
// dependencies, ES5 on purpose to match the rest of the landing kit.
(function () {
  "use strict";

  // ---- Gallery: thumbnails swap the stage slide ---------------------------
  var slides = Array.prototype.slice.call(
    document.querySelectorAll("[data-gallery-slide]"),
  );
  var thumbs = Array.prototype.slice.call(
    document.querySelectorAll("[data-gallery-thumb]"),
  );

  var show = function (index) {
    slides.forEach(function (slide, i) {
      slide.hidden = i !== index;
    });
    thumbs.forEach(function (thumb, i) {
      thumb.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  };

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener("click", function () {
      show(i);
    });
  });

  // ---- Plan picker: keep the stage, sticky bar and CTA in step ------------
  // Selecting a plan also flips the gallery to that plan's vial pair
  // (data-slide) and rewrites the mobile sticky bar's price line. The chosen
  // plan is remembered in sessionStorage so a future cart hookup can read it
  // (see the CTA note in longevity-plan.html — checkout is not wired yet).
  var radios = Array.prototype.slice.call(
    document.querySelectorAll('input[name="plan"]'),
  );
  var stickyPrice = document.getElementById("stickyPrice");
  var cta = document.getElementById("planCta");

  var sync = function (radio) {
    if (!radio) return;
    var slide = Number(radio.getAttribute("data-slide"));
    if (!isNaN(slide)) show(slide);
    if (stickyPrice && radio.getAttribute("data-price")) {
      stickyPrice.textContent =
        radio.getAttribute("data-price") + " every 3 months";
    }
    if (cta) cta.setAttribute("data-plan", radio.value);
    try {
      sessionStorage.setItem("chime:longevity-plan", radio.value);
    } catch (e) {
      /* storage unavailable — selection still works on-page */
    }
  };

  radios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      sync(radio);
    });
  });

  var checked = radios.filter(function (r) {
    return r.checked;
  })[0];
  if (checked) {
    sync(checked);
  } else if (slides.length) {
    show(0);
  }
})();
