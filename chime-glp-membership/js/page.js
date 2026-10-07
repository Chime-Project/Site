/* Chime Health: GLP membership page.
   Five behaviours, no framework:
     1. savings   the month slider and the Chime vs typical-provider totals
                  (formula ported from ../chime-holistic-weight-loss/js/lander.js,
                  the Collective calculator; competitors averaged, not named)
     2. expand    "Learn more" on each price card
     3. rail      the reviews carousel (the V2 rail, same paging maths)
     4. accordion the FAQ
     5. sticky    the price bar that slides up once the hero has scrolled away

   TAP HANDLING: every control is a real <button> or <input type=range>, so a tap
   fires a plain click/input. Nothing branches on a click event's detail, which
   is 0 for touch on WebKit (the 2026-09-21 iPhone bug on the quiz landings).

   The pure helpers are exported for node so js/page-tests.js can check them. */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ChimeGLPMembership = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- prices (every figure on the page comes from here) ---------- */

  // STAND-INS until the client confirms them: the Collective figures, which
  // Luis picked as the "lower prices" this page leads with (D-A1, D-A2).
  var PRICES = {
    sema: 59,               // compounded semaglutide, per month, any dose
    tirz: 69,               // compounded tirzepatide, per month, any dose
    membershipYear: 199,    // billed annually
    trialDays: 21
  };
  // "as low as $17/month": 199 / 12 = 16.58, rounded up to the whole dollar.
  function membershipMonthly(year) { return Math.ceil(year / 12); }

  // Collective's competitor table (tirzepatide row, public pricing as of
  // August 2026, their footnote). This page shows the AVERAGE of the three, not
  // the names (D-A4): a one-line switch if Luis wants them named.
  var COMPETITORS = [
    { name: "Ro", firstMonth: 338, ongoing: 548 },
    { name: "Found", firstMonth: 359, ongoing: 359 },
    { name: "MEDVi", firstMonth: 199, ongoing: 399 }
  ];
  var DEFAULT_MONTH = 6;

  // Their formula: medication every month, membership charged from month 2
  // (month 1 sits inside the free trial).
  function ourCum(month, monthly) {
    var m = monthly == null ? PRICES.tirz : monthly;
    return m * month + (month >= 2 ? PRICES.membershipYear : 0);
  }
  function theirCum(c, month) { return c.firstMonth + c.ongoing * (month - 1); }
  function typicalCum(month) {
    var sum = COMPETITORS.reduce(function (a, c) { return a + theirCum(c, month); }, 0);
    return Math.round(sum / COMPETITORS.length);
  }
  function typicalMonthly() {
    var sum = COMPETITORS.reduce(function (a, c) { return a + c.ongoing; }, 0);
    return Math.round(sum / COMPETITORS.length);
  }
  function savings(month) {
    var ours = ourCum(month), theirs = typicalCum(month);
    var save = Math.max(0, theirs - ours);
    return {
      month: month,
      ours: ours,
      theirs: theirs,
      save: save,
      pct: theirs ? Math.round(save / theirs * 100) : 0,
      paidBack: month >= 2 && save >= PRICES.membershipYear,
      oursBar: theirs ? Math.max(4, Math.round(ours / theirs * 100)) : 0,
      fill: (month - 1) / 11 * 100
    };
  }

  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }

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

  var api = {
    PRICES: PRICES, COMPETITORS: COMPETITORS, DEFAULT_MONTH: DEFAULT_MONTH,
    membershipMonthly: membershipMonthly, ourCum: ourCum, theirCum: theirCum,
    typicalCum: typicalCum, typicalMonthly: typicalMonthly, savings: savings,
    money: money, perViewQuotes: perViewQuotes, pageCount: pageCount, clampPage: clampPage
  };

  if (typeof document === "undefined") return api;

  /* ---------- DOM ---------- */

  function each(sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); }

  function setupSavings() {
    var box = document.querySelector("[data-savings]");
    if (!box) return;
    var range = box.querySelector("input[type=range]");
    var out = function (k) { return box.querySelector("[data-out=" + k + "]"); };
    function draw() {
      var r = savings(+range.value);
      out("month").textContent = r.month;
      out("month2").textContent = r.month;
      out("month3").textContent = r.month;
      out("ours").textContent = money(r.ours);
      out("theirs").textContent = money(r.theirs);
      out("save").textContent = money(r.save);
      out("pct").textContent = r.pct + "%";
      box.querySelector("[data-bar=ours]").style.width = r.oursBar + "%";
      out("paid").hidden = !r.paidBack;
      range.style.setProperty("--fill", r.fill + "%");
      range.setAttribute("aria-valuetext", "Month " + r.month);
    }
    range.addEventListener("input", draw);
    draw();
  }

  function setupExpand() {
    each(".pcard__more", function (btn) {
      btn.addEventListener("click", function () {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (!panel) return;
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        btn.querySelector("span").textContent = open ? "Learn more" : "Show less";
        panel.hidden = open;
      });
    });
  }

  function setupRail(rail) {
    var track = rail.querySelector("[data-track]");
    var ctl = rail.parentElement.querySelector(".rail__ctl");
    var dots = ctl && ctl.querySelector("[data-dots]");
    var prev = ctl && ctl.querySelector("[data-prev]");
    var next = ctl && ctl.querySelector("[data-next]");
    var page = 0;
    function pages() { return pageCount(track.children.length, perViewQuotes(window.innerWidth)); }
    function render() {
      var total = pages();
      page = clampPage(page, total);
      track.style.transform = "translateX(calc(-" + (page * 100) + "% - " + (page * 14) + "px))";
      if (prev) prev.disabled = page === 0;
      if (next) next.disabled = page >= total - 1;
      if (!dots) return;
      while (dots.children.length > total) dots.removeChild(dots.lastChild);
      while (dots.children.length < total) {
        var li = document.createElement("li"), b = document.createElement("button");
        b.type = "button"; li.appendChild(b); dots.appendChild(li);
      }
      Array.prototype.forEach.call(dots.children, function (li, i) {
        var b = li.firstChild;
        b.setAttribute("aria-label", "Go to page " + (i + 1));
        if (i === page) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
        b.onclick = function () { page = i; render(); };
      });
    }
    if (prev) prev.addEventListener("click", function () { page -= 1; render(); });
    if (next) next.addEventListener("click", function () { page += 1; render(); });
    var x0 = null, y0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { page += dx < 0 ? 1 : -1; render(); }
      x0 = y0 = null;
    }, { passive: true });
    window.addEventListener("resize", render);
    render();
  }

  function setupAccordion() {
    each("[data-acc] .acc__q", function (btn) {
      btn.addEventListener("click", function () {
        var panel = btn.nextElementSibling;
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
      });
    });
  }

  // The bar shows once the hero's buttons are off screen and hides again over
  // the closing band, which has its own button.
  function setupSticky() {
    var bar = document.querySelector("[data-sticky]");
    var hero = document.querySelector(".hero__act");
    var close = document.querySelector(".close");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    var heroGone = false, closeIn = false;
    function sync() {
      var on = heroGone && !closeIn;
      bar.classList.toggle("is-on", on);
      bar.setAttribute("aria-hidden", on ? "false" : "true");
      each("a", function (a) { a.tabIndex = on ? 0 : -1; }, bar);
    }
    new IntersectionObserver(function (es) {
      heroGone = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; sync();
    }).observe(hero);
    if (close) new IntersectionObserver(function (es) { closeIn = es[0].isIntersecting; sync(); }).observe(close);
    sync();
  }

  function init() {
    setupSavings();
    setupExpand();
    var rail = document.querySelector(".revs [data-rail]");
    if (rail) setupRail(rail);
    setupAccordion();
    setupSticky();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return api;
});
