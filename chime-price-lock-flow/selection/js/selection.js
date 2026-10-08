/* Chime Health — price-lock plan selection.
   Ports the reference's Alpine picker (selected: '' → 'sema' | 'tirz') and its Stimulus controllers
   (scroll-to, countdown-timer, discount-counter, live-purchase-count) with their values and timings,
   plus the language dialog. No dependencies. */
(function (root) {
  'use strict';

  function randomInteger(min, max, rnd) {
    var lo = Math.floor(min), hi = Math.floor(max);
    if (hi <= lo) return lo;
    return Math.floor((rnd || Math.random)() * (hi - lo + 1)) + lo;
  }

  // countdown-timer: "M:SS" (or "H:MM:SS"), never below 0.
  function formatTime(total) {
    var s = Math.max(0, total);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    var pad = function (v) { return String(v).padStart(2, '0'); };
    return h > 0 ? h + ':' + pad(m) + ':' + pad(sec) : m + ':' + pad(sec);
  }

  // discount-counter: first drop after startSeconds, then startSeconds + 0..variance; stops at min.
  function discountDelay(initial, startSeconds, varianceSeconds, rnd) {
    var base = Math.max(0, Number(startSeconds || 0) * 1000);
    if (initial) return base;
    var variance = Math.max(0, Number(varianceSeconds || 0) * 1000);
    return base + randomInteger(0, variance, rnd);
  }

  // live-purchase-count: each tick adds 1..maxAdd, every 1 s..interval ms.
  function purchaseStep(maxAdd, interval, rnd) {
    return {
      add: randomInteger(1, Math.max(1, Math.floor(maxAdd || 1)), rnd),
      every: randomInteger(1000, Math.max(1000, Number(interval || 0)), rnd)
    };
  }

  var api = { randomInteger: randomInteger, formatTime: formatTime, discountDelay: discountDelay, purchaseStep: purchaseStep };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }

  var doc = root.document;
  var num = function (el, name, dflt) {
    var v = el.getAttribute(name);
    return v === null || v === '' || !isFinite(Number(v)) ? dflt : Number(v);
  };
  var reduced = function () { return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* scroll-to (offset 20, delay 250, scroll to top on connect) */
  var scroller = doc.querySelector('[data-controller="scroll-to"]');
  var offset = scroller ? num(scroller, 'data-scroll-to-offset-value', 0) : 0;
  var delay = scroller ? num(scroller, 'data-scroll-to-delay-value', 0) : 0;
  var scrollTimer;
  function scrollToId(id) {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var target = doc.getElementById(id);
      if (!target || target.offsetParent === null) return;
      var top = target.getBoundingClientRect().top + root.pageYOffset - offset;
      root.scrollTo({ top: top, behavior: reduced() ? 'auto' : 'smooth' });
    }, Math.max(0, delay));
  }
  function scrollTop() { root.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); }
  if (scroller && scroller.getAttribute('data-scroll-to-scroll-top-on-connect-value') === 'true') {
    scrollTop();
    root.addEventListener('pageshow', scrollTop);
  }

  /* treatment picker */
  var picker = doc.querySelector('[data-picker]');
  function select(med) {
    picker.querySelectorAll('[data-pick]').forEach(function (card) {
      var on = card.getAttribute('data-pick') === med;
      var add = (on ? card.dataset.on : card.dataset.off).split(' ');
      var drop = (on ? card.dataset.off : card.dataset.on).split(' ');
      card.classList.remove.apply(card.classList, drop);
      card.classList.add.apply(card.classList, add);
    });
    picker.querySelectorAll('[data-show]').forEach(function (el) {
      var want = el.getAttribute('data-show');
      el.style.display = (want === 'any' ? med !== '' : want === med) ? '' : 'none';
    });
    picker.querySelectorAll('[data-hide]').forEach(function (el) {
      el.style.display = el.getAttribute('data-hide') === med ? 'none' : '';
    });
  }
  if (picker) {
    picker.addEventListener('click', function (e) {
      var card = e.target.closest('[data-pick]');
      if (!card) return;
      select(card.getAttribute('data-pick'));
      scrollToId('select-price');
    });
  }

  /* countdown-timer */
  doc.querySelectorAll('[data-controller="countdown-timer"]').forEach(function (el) {
    var left = Math.max(0, Math.floor(num(el, 'data-countdown-timer-start-seconds-value', 0)));
    el.textContent = formatTime(left);
    if (left <= 0) return;
    var id = setInterval(function () {
      left = Math.max(0, left - 1);
      el.textContent = formatTime(left);
      if (left <= 0) clearInterval(id);
    }, 1000);
  });

  /* discount-counter */
  doc.querySelectorAll('[data-controller="discount-counter"]').forEach(function (el) {
    var target = el.querySelector('[data-discount-counter-target="count"]');
    var min = num(el, 'data-discount-counter-min-value', 1);
    var startS = num(el, 'data-discount-counter-start-seconds-value', 3);
    var varS = num(el, 'data-discount-counter-variance-seconds-value', 2);
    var count = Math.max(min, Math.floor(num(el, 'data-discount-counter-start-value', parseInt((target.textContent || '').replace(/[^\d]/g, ''), 10) || min)));
    target.textContent = count;
    (function schedule(initial) {
      if (count <= min) return;
      setTimeout(function () {
        if (count > min) { count -= 1; target.textContent = count; }
        schedule(false);
      }, discountDelay(initial, startS, varS));
    })(true);
  });

  /* live-purchase-count */
  var fmt = new Intl.NumberFormat();
  doc.querySelectorAll('[data-controller="live-purchase-count"]').forEach(function (el) {
    var target = el.querySelector('[data-live-purchase-count-target="count"]');
    var min = Math.max(0, Math.floor(num(el, 'data-live-purchase-count-min-value', 0)));
    var max = Math.max(min + 1, Math.floor(num(el, 'data-live-purchase-count-max-value', min + 1000)));
    var interval = num(el, 'data-live-purchase-count-interval-value', 3200);
    var maxAdd = num(el, 'data-live-purchase-count-max-add-value', 150);
    var count = randomInteger(min, max);
    target.textContent = fmt.format(count);
    // The reference re-arms a setInterval with a fresh random period after every tick; same cadence here.
    (function schedule() {
      var step = purchaseStep(maxAdd, interval);
      setTimeout(function () {
        count += step.add;
        target.textContent = fmt.format(count);
        schedule();
      }, step.every);
    })();
  });

  /* language dialog */
  var lang = doc.querySelector('[data-lang]');
  if (lang) {
    var dialog = lang.querySelector('[data-lang-dialog]');
    var panel = lang.querySelector('[data-lang-panel]');
    // The reference teleports the dialog to <body>; keep it there so fixed positioning never inherits a transform.
    doc.body.appendChild(dialog);
    var close = function () { dialog.style.display = 'none'; doc.documentElement.style.overflow = ''; };
    lang.querySelector('[data-lang-open]').addEventListener('click', function () {
      dialog.style.display = '';
      doc.documentElement.style.overflow = 'hidden';
    });
    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-lang-close]')) {
        if (e.target.closest('a[href="#"]')) e.preventDefault();
        close();
      } else if (!panel.contains(e.target)) {
        close();
      }
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dialog.style.display !== 'none') close(); });
  }
})(this);
