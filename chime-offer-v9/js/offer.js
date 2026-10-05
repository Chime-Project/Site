/* Chime Health offer lander (clone of trinitymeds.com/m1/offer-v9-tm): what the reference's Nuxt components do,
   in plain JS. Every rule below was read from their bundles (2026-10-04):
     1. rolling offer deadline (C8HvheXc.js + runtime config offerCycleDays "5"): the next 5-day mark after
        2026-09-15T03:00:00Z. It drives the promo bar ("OFFER ENDS <MONTH> <DAY><TH> AT MIDNIGHT!", the date in
        New York time, their ordinal rule) and the hero's "Price increases in" DD:HH:MM:SS (1 s tick, ceil to the
        second). At zero it simply moves on to the next mark; nothing is stored, every visitor sees the same clock.
     2. weight slider (WeightEstimatorV9Tm): 140-500 lb, "you could lose" = max(0, round(w x 0.151)), the thumb at
        (w - 140) / 360; the intro line scrolls to #pricing.
     3. FAQ (FaqV9Tm): one panel open at a time; the + turns into a filled x.
     4. testimonials (UgcV9Tm): the arrows scroll one card (+16 px gap) and show only when there is more to see.
     5. phone menu (HeaderV9Tm): the hamburger adds the nav under the header bar (fade/slide 0.18 s).
     6. phone sticky Get Started (HeroV9Tm): shown once the hero button has scrolled above the viewport, with a spacer
        so it never covers the footer.
     7. marquees (vue-fast-marquee): duration = content width / 40 px per second.
     8. desktop hero fit (HeroV9Tm): --fit-k = hero width / its height to the section bottom, re-measured on resize.
   Pure helpers are exported for js/offer-tests.js. */
(function (root) {
  'use strict';

  var ANCHOR = Date.parse('2026-09-15T03:00:00Z');
  var CYCLE = 5 * 864e5;
  var TZ = 'America/New_York';

  function nextDeadline(now) {
    return ANCHOR + CYCLE * (Math.floor((now - ANCHOR) / CYCLE) + 1);
  }
  function ordinal(n) {
    var t = n % 100;
    if (t >= 11 && t <= 13) return 'th';
    switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
  }
  function endLabel(ts) {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: 'long', day: 'numeric' }).formatToParts(new Date(ts));
    var month = '', day = 0;
    parts.forEach(function (p) { if (p.type === 'month') month = p.value; if (p.type === 'day') day = Number(p.value); });
    return month + ' ' + day + ordinal(day) + ' at Midnight';
  }
  function offerEnds(now) { return 'OFFER ENDS ' + endLabel(nextDeadline(now)).toUpperCase() + '!'; }
  function split(ms) {
    var n = !isFinite(ms) || ms <= 0 ? 0 : Math.ceil(ms / 1000);
    return { days: Math.floor(n / 86400), hours: Math.floor(n % 86400 / 3600), minutes: Math.floor(n % 3600 / 60), seconds: n % 60 };
  }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function couldLose(w) { return Math.max(0, Math.round(w * 0.151)); }
  function thumbLeft(w) { return (w - 140) / 360 * 100; }

  var api = { ANCHOR: ANCHOR, CYCLE: CYCLE, nextDeadline: nextDeadline, ordinal: ordinal, endLabel: endLabel,
              offerEnds: offerEnds, split: split, pad2: pad2, couldLose: couldLose, thumbLeft: thumbLeft };
  root.ChimeOfferV9 = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  /* Vue-style enter / leave for the two inserted blocks: name-enter-from + -active, then -to, then clean */
  function enter(el, name) {
    el.classList.add(name + '-enter-from', name + '-enter-active');
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      el.classList.remove(name + '-enter-from'); el.classList.add(name + '-enter-to');
      el.addEventListener('transitionend', function done() { el.classList.remove(name + '-enter-active', name + '-enter-to'); el.removeEventListener('transitionend', done); });
    }); });
  }
  function leave(els, name) {
    els[0].classList.add(name + '-leave-from', name + '-leave-active');
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      els[0].classList.remove(name + '-leave-from'); els[0].classList.add(name + '-leave-to');
      var gone = false;
      function done() { if (gone) return; gone = true; els.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); }); }
      els[0].addEventListener('transitionend', done); setTimeout(done, 400);
    }); });
  }
  function fromTemplate(id) { var t = document.getElementById(id); return t ? Array.prototype.slice.call(t.content.cloneNode(true).children) : []; }

  function mount() {
    // 1. offer deadline: promo bar + countdown
    var bars = document.querySelectorAll('[data-offer-ends]');
    var clock = document.querySelector('[data-countdown]');
    var digits = clock ? Array.prototype.filter.call(clock.children, function (s, i) { return i % 2 === 0; }) : [];
    function tick() {
      var now = Date.now(), text = offerEnds(now);
      Array.prototype.forEach.call(bars, function (b) { if (b.textContent !== text) b.textContent = text; });
      var p = split(nextDeadline(now) - now), v = [p.days, p.hours, p.minutes, p.seconds];
      digits.forEach(function (d, i) { var s = pad2(v[i]); if (d.textContent !== s) d.textContent = s; });
    }
    tick(); setInterval(tick, 1000);

    // 2. weight slider
    var range = document.querySelector('[data-weight]');
    if (range) {
      var card = range.closest('.flex.flex-col.rounded-v9tm-panel');
      var current = card.querySelector('.text-\\[36px\\].tracking-\\[-2px\\]');
      var lose = card.querySelector('.text-\\[36px\\].tracking-\\[-1\\.5px\\]');
      var thumb = range.parentNode.querySelector('.absolute.top-1\\/2');
      var paint = function () {
        var w = Number(range.value);
        current.textContent = w; lose.textContent = couldLose(w);
        range.setAttribute('aria-valuenow', w); thumb.style.left = thumbLeft(w) + '%';
      };
      range.addEventListener('input', paint); paint();
      var intro = card.querySelector('button.cursor-pointer');
      if (intro) intro.addEventListener('click', function () { var t = document.getElementById('pricing'); if (t) t.scrollIntoView({ behavior: 'smooth' }); });
    }

    // 3. FAQ: one open at a time
    var faqButtons = document.querySelectorAll('button[aria-controls^="faq-panel-"]');
    function setFaq(btn, open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var disc = btn.children[1], svg = disc && disc.querySelector('svg');
      if (disc) { disc.classList.toggle('border-transparent', open); disc.classList.toggle('bg-v9tm-purple', open); disc.classList.toggle('border-v9tm-navy-12', !open); disc.classList.toggle('bg-transparent', !open); }
      if (svg) { svg.classList.toggle('rotate-45', open); svg.classList.toggle('text-v9tm-white', open); svg.classList.toggle('text-v9tm-purple-50', !open); }
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.toggle('is-open', open);
    }
    Array.prototype.forEach.call(faqButtons, function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        Array.prototype.forEach.call(faqButtons, function (o) { if (o !== btn && o.getAttribute('aria-expanded') === 'true') setFaq(o, false); });
        setFaq(btn, open);
      });
    });

    // 4. testimonial arrows
    var scroller = document.querySelector('.ugc-scroller');
    if (scroller) {
      var prev = document.querySelector('button[aria-label="Previous testimonials"]');
      var next = document.querySelector('button[aria-label="More testimonials"]');
      var edges = function () {
        prev.style.display = scroller.scrollLeft > 1 ? '' : 'none';
        next.style.display = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1 ? '' : 'none';
      };
      var step = function (dir) {
        var c = scroller.querySelector('.snap-start');
        scroller.scrollBy({ left: dir * (c ? c.offsetWidth + 16 : scroller.clientWidth), behavior: 'smooth' });
      };
      prev.addEventListener('click', function () { step(-1); });
      next.addEventListener('click', function () { step(1); });
      scroller.addEventListener('scroll', edges, { passive: true });
      window.addEventListener('resize', edges, { passive: true });
      edges();
    }

    // 5. phone menu
    var burger = document.querySelector('button[aria-label="Open menu"]');
    if (burger) {
      var header = burger.closest('header'), menu = null;
      var closeMenu = function () { if (!menu) return; leave([menu], 'v9tm-menu'); menu = null; burger.setAttribute('aria-expanded', 'false'); };
      burger.addEventListener('click', function () {
        if (menu) { closeMenu(); return; }
        menu = fromTemplate('tpl-menu')[0]; header.appendChild(menu); enter(menu, 'v9tm-menu');
        burger.setAttribute('aria-expanded', 'true');
        menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
      });
    }

    // 6. phone sticky Get Started: teleported to the end of .v9tm, shown once the hero button is above the viewport
    var heroBtn = document.querySelector('section a.rounded-v9tm-pill.bg-v9tm-purple');   // their heroCtaRef = the button's wrapper
    var heroCta = heroBtn && heroBtn.parentElement;
    var host = document.querySelector('div.v9tm.min-h-screen');
    if (heroCta && host && 'IntersectionObserver' in root) {
      var sticky = null;
      new IntersectionObserver(function (entries) {
        var e = entries[0], show = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (show && !sticky) { sticky = fromTemplate('tpl-sticky'); sticky.forEach(function (n) { host.appendChild(n); }); enter(sticky[0], 'v9tm-sticky-cta'); }
        else if (!show && sticky) { var s = sticky; sticky = null; leave(s, 'v9tm-sticky-cta'); }
      }, { threshold: 0 }).observe(heroCta);
    }

    // 7. marquees: 40 px per second of content
    var marquees = document.querySelectorAll('.vfm-marquee-container');
    function speed() {
      Array.prototype.forEach.call(marquees, function (c) {
        var first = c.querySelector('.vfm-marquee'), parent = first && first.querySelector('.vfm-parent');
        if (!parent) return;
        var w = parent.getBoundingClientRect().width;
        Array.prototype.forEach.call(c.querySelectorAll('.vfm-marquee'), function (m) { m.style.setProperty('--duration', (w / 40) + 's'); });
      });
    }

    // 8. desktop hero fit: --fit-k = width / height (to the hero section's bottom), re-measured up to 3 times
    var fit = document.querySelector('[class*="lg:[container-type:inline-size]"]');
    var fitK = null, fitTimer;
    function measure(tries) {
      tries = tries || 0;
      var sec = fit && fit.closest('section');
      if (!sec || !root.matchMedia('(min-width: 1024px)').matches) return;
      var r = fit.getBoundingClientRect(), wv = r.width, hv = sec.getBoundingClientRect().bottom - r.top;
      if (!wv || !hv) return;
      var k = Math.floor(wv / hv * 1e4) / 1e4;
      if (fitK && Math.abs(k - fitK) / k < 0.002) return;
      fitK = k; fit.style.setProperty('--fit-k', k);
      if (tries < 3) fitTimer = setTimeout(function () { measure(tries + 1); }, 260);
    }
    function refit() { clearTimeout(fitTimer); fitTimer = setTimeout(function () { measure(0); }, 260); }

    speed(); measure(0);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { speed(); measure(0); });
    window.addEventListener('resize', function () { speed(); refit(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})(typeof window !== 'undefined' ? window : globalThis);
