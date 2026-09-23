/* Chime Health: online weight loss program, V2.
   Five behaviours, all ported from the reference by hand, no framework:
     1. rail      one carousel used by the treatments and the reviews
     2. filters   the Featured / GLP-1 / Oral chips
     3. priceMode the cash-pay vs in-network select (the reference's own
                  control: it swaps each card between the without-insurance
                  price and the with-insurance price)
     4. expand    the + on each treatment card
     5. accordion the FAQ

   TAP HANDLING: every control is a real <button>, so a tap fires a plain
   click. Nothing here branches on a click event's detail property, which is 0
   for touch on WebKit and was the 2026-09-21 iPhone bug on the quiz landings.

   The pure helpers (pageCount, clampPage, fmt, visibleFor) are exported for
   node so js/v2-tests.js can check them without a browser.

   Same behaviour as ../chime-weight-loss-program/js/wlp.js; the two pages
   share a structure, so the script is the same one with this page's data
   attributes. */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChimeWLPV2 = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- pure helpers ---------- */

  // How many cards sit in the rail at this width. Mirrors the CSS breakpoints.
  function perView(width) {
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  }

  function perViewQuotes(width) {
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  function pageCount(items, per) {
    if (!items || items < 1 || !per || per < 1) return 1;
    return Math.ceil(items / per);
  }

  function clampPage(page, pages) {
    if (!pages || pages < 1) return 0;
    if (page < 0) return 0;
    if (page > pages - 1) return pages - 1;
    return page;
  }

  // "249" -> "$249". Keeps the thousands separator the reference uses.
  function fmt(value) {
    var n = Number(value);
    if (!isFinite(n)) return "";
    return "$" + n.toLocaleString("en-US");
  }

  // Which cards a filter shows. A card lists its categories in data-cat.
  function visibleFor(cats, filter) {
    if (!filter || filter === "all") return true;
    return String(cats || "").split(/\s+/).indexOf(filter) !== -1;
  }

  var api = { perView: perView, perViewQuotes: perViewQuotes, pageCount: pageCount, clampPage: clampPage, fmt: fmt, visibleFor: visibleFor };

  if (typeof document === "undefined") return api;

  /* ---------- DOM ---------- */

  function setupRail(rail, countPerView) {
    var track = rail.querySelector("[data-track]");
    if (!track) return null;
    var ctl = rail.parentElement.querySelector(".rail__ctl");
    var dots = ctl && ctl.querySelector("[data-dots]");
    var prev = ctl && ctl.querySelector("[data-prev]");
    var next = ctl && ctl.querySelector("[data-next]");
    var page = 0;

    function items() {
      return Array.prototype.filter.call(track.children, function (li) { return !li.hidden; });
    }

    function pages() {
      return pageCount(items().length, countPerView(window.innerWidth));
    }

    function render() {
      var total = pages();
      page = clampPage(page, total);
      var shift = page * 100;
      track.style.transform = "translateX(calc(-" + shift + "% - " + (page * 14) + "px))";
      if (prev) prev.disabled = page === 0;
      if (next) next.disabled = page >= total - 1;
      if (dots) {
        while (dots.children.length > total) dots.removeChild(dots.lastChild);
        while (dots.children.length < total) {
          var li = document.createElement("li");
          var b = document.createElement("button");
          b.type = "button";
          li.appendChild(b);
          dots.appendChild(li);
        }
        Array.prototype.forEach.call(dots.children, function (li, i) {
          var b = li.firstChild;
          b.setAttribute("aria-label", "Go to page " + (i + 1));
          if (i === page) b.setAttribute("aria-current", "true");
          else b.removeAttribute("aria-current");
          b.onclick = function () { page = i; render(); };
        });
      }
    }

    if (prev) prev.addEventListener("click", function () { page -= 1; render(); });
    if (next) next.addEventListener("click", function () { page += 1; render(); });

    // Swipe. Touch only, horizontal only, so vertical scrolling is untouched.
    var x0 = null, y0 = null;
    track.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        page += dx < 0 ? 1 : -1;
        render();
      }
      x0 = y0 = null;
    }, { passive: true });

    window.addEventListener("resize", render);
    render();
    return { render: render, reset: function () { page = 0; render(); } };
  }

  function init() {
    // 1 + 2. Treatments rail and its filter chips.
    var medsSection = document.querySelector(".meds");
    var medsRail = medsSection && medsSection.querySelector("[data-rail]");
    var meds = medsRail ? setupRail(medsRail, perView) : null;

    if (medsSection && meds) {
      var chips = medsSection.querySelectorAll(".chip");
      var cards = medsSection.querySelectorAll(".card");
      Array.prototype.forEach.call(chips, function (chip) {
        chip.addEventListener("click", function () {
          var filter = chip.dataset.filter;
          Array.prototype.forEach.call(chips, function (c) {
            var on = c === chip;
            c.classList.toggle("is-on", on);
            c.setAttribute("aria-selected", on ? "true" : "false");
          });
          Array.prototype.forEach.call(cards, function (card) {
            card.hidden = !visibleFor(card.dataset.cat, filter);
          });
          meds.reset();
        });
      });

      // 3. Price mode.
      var mode = medsSection.querySelector("[data-price-mode]");
      if (mode) {
        mode.addEventListener("change", function () {
          var cash = mode.value === "cash";
          Array.prototype.forEach.call(cards, function (card) {
            var el = card.querySelector("[data-price]");
            if (!el) return;
            el.textContent = fmt(cash ? card.dataset.cash : card.dataset.ins);
          });
        });
      }

      // 4. Expand panels.
      Array.prototype.forEach.call(medsSection.querySelectorAll(".more"), function (btn) {
        btn.addEventListener("click", function () {
          var panel = document.getElementById(btn.getAttribute("aria-controls"));
          if (!panel) return;
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", open ? "false" : "true");
          panel.hidden = open;
          meds.render();
        });
      });
    }

    // 1b. Reviews rail.
    var revsRail = document.querySelector(".revs [data-rail]");
    if (revsRail) setupRail(revsRail, perViewQuotes);

    // 5. FAQ accordion.
    Array.prototype.forEach.call(document.querySelectorAll("[data-acc] .acc__q"), function (btn) {
      btn.addEventListener("click", function () {
        var panel = btn.nextElementSibling;
        if (!panel) return;
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return api;
});
