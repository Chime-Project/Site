/* Chime Health u10 offer lander: what the reference's Nuxt components do, in plain JS (read from their bundles,
   2026-10-06):
     1. header (HeaderOfferU10): the hamburger toggles #u10-nav-drawer; Escape or a tap outside closes it; once the
        hero's top sentinel scrolls away the header becomes fixed on phones and takes the "stuck" background.
     2. phone sticky CTA (HeroOfferU10): shown once the hero price card has scrolled above the viewport.
     3. product carousel (ProductCarouselOfferU10): arrows scroll one card; at either end the arrow is disabled and dims.
     4. phone rails (useAutoScrollRail, max-width 1023px, not with reduced motion): the cards are doubled
        (aria-hidden copies), the rail scrolls itself at one card per N seconds (stats 3.5, stories 6, reviews 3.5,
        steps 3.8), loops at half its width, pauses on touch / wheel / key and resumes 1.5 s after the last scroll.
     5. weight slider (WeightEstimatorOfferU10): 140-500 lb, "could lose" = max(0, round(w x 0.151)), thumb at
        (w - 140) / 360.
     6. FAQ (FaqOfferU10): one item open at a time.
   Pure helpers are exported for js/lander-tests.js. */
(function (root) {
  'use strict';
  var MIN = 140, MAX = 500;
  function couldLose(w) { return Math.max(0, Math.round(w * 0.151)); }
  function thumbLeft(w) { return (w - MIN) / (MAX - MIN) * 100; }
  function wrap(v, add, half) { if (half <= 0) return v; var n = (v + add) % half; return n < 0 ? n + half : n; }
  function pxPerSecond(itemWidth, gap, secondsPerItem) { if (secondsPerItem <= 0) return 0; var n = itemWidth + gap; return n <= 0 ? 0 : n / secondsPerItem; }
  var api = { MIN: MIN, MAX: MAX, couldLose: couldLose, thumbLeft: thumbLeft, wrap: wrap, pxPerSecond: pxPerSecond };
  root.ChimeU10Lander = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  var reduced = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function mount() {
    // 1. header + drawer
    var burger = $('button[aria-controls="u10-nav-drawer"]');
    var drawer = document.getElementById('u10-nav-drawer');
    var header = burger && burger.closest('header');
    var bar = header && header.querySelector('.grid');
    var open = false, stuck = false;
    function paintHeader() {
      if (!bar) return;
      bar.classList.toggle('bg-[var(--offer-u10-nav-stuck)]', stuck); bar.classList.toggle('bg-offer-u10-scrim-15', !stuck);
      drawer.classList.toggle('bg-[var(--offer-u10-nav-stuck)]', stuck); drawer.classList.toggle('bg-offer-u10-scrim-25', !stuck);
      header.classList.toggle('max-lg:fixed', stuck); header.classList.toggle('max-lg:z-50', stuck);
    }
    function setOpen(v) {
      open = v; drawer.style.display = v ? '' : 'none';
      burger.setAttribute('aria-expanded', v ? 'true' : 'false'); burger.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
    }
    if (burger && drawer) {
      burger.addEventListener('click', function () { setOpen(!open); });
      $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { setOpen(false); burger.focus(); } });
      document.addEventListener('pointerdown', function (e) { if (open && !drawer.contains(e.target) && !burger.contains(e.target)) setOpen(false); });
    }
    var sentinel = header && header.parentNode.querySelector('.pointer-events-none.absolute.left-0.top-0.h-px.w-px');
    if (sentinel && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var n = en[0]; stuck = !n.isIntersecting && n.boundingClientRect.top < 0; paintHeader();
      }, { threshold: 0 }).observe(sentinel);
    }

    // 2. phone sticky CTA
    var card = document.getElementById('pricing');
    var tpl = document.getElementById('tpl-sticky');
    var rootEl = $('.offer-u10-root');
    var stickyEl = null;
    function showSticky(v) {
      if (v && !stickyEl) {
        stickyEl = tpl.content.firstElementChild.cloneNode(true); rootEl.appendChild(stickyEl);
        stickyEl.classList.add('u10-sticky-cta-enter-from', 'u10-sticky-cta-enter-active');
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          if (!stickyEl) return; stickyEl.classList.remove('u10-sticky-cta-enter-from'); stickyEl.classList.add('u10-sticky-cta-enter-to');
          setTimeout(function () { if (stickyEl) stickyEl.classList.remove('u10-sticky-cta-enter-active', 'u10-sticky-cta-enter-to'); }, 200);
        }); });
      } else if (!v && stickyEl) {
        var el = stickyEl; stickyEl = null;
        el.classList.add('u10-sticky-cta-leave-active', 'u10-sticky-cta-leave-to');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 190);
      }
    }
    if (card && tpl && rootEl && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var n = en[0]; showSticky(!n.isIntersecting && n.boundingClientRect.top < 0);
      }, { threshold: 0 }).observe(card);
    }

    // 3. product carousel
    var prev = $('button[aria-label="Previous products"]'), next = $('button[aria-label="Next products"]');
    var rail = prev && $('#products ul.u10-rail');
    if (rail) {
      var edges = function () {
        var atStart = rail.scrollLeft <= 1, atEnd = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
        [[prev, atStart], [next, atEnd]].forEach(function (p) {
          p[0].disabled = p[1]; p[0].classList.toggle('opacity-20', p[1]); p[0].classList.toggle('opacity-100', !p[1]);
        });
      };
      var step = function () { var c = rail.children; return c[1] ? c[1].offsetLeft - c[0].offsetLeft : (c[0] ? c[0].offsetWidth : 0); };
      prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduced() ? 'auto' : 'smooth' }); });
      next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduced() ? 'auto' : 'smooth' }); });
      rail.addEventListener('scroll', edges, { passive: true });
      window.addEventListener('resize', edges, { passive: true });
      edges();
    }

    // 4. phone auto-scrolling rails
    [['ul.u10-rail[data-v-7d1af2bd]', 3.5], ['ul.u10-stories-rail', 6], ['ul.u10-rail[data-v-f3c64244]', 3.5], ['ol.u10-rail[data-v-bf9f88e5]', 3.8]]
      .forEach(function (r) { var el = $(r[0]); if (el) autoRail(el, r[1]); });

    // 7. Real Stories loops (Chime stand-in selfie clips, no sound; added by the build's stories_video.py).
    //    Runs after the rails so the phone rail's aria-hidden copies get their clips too. A clip plays only while
    //    its card is on screen; its still fades out once frames are flowing. Reduced motion keeps the stills.
    var storyVids = $$('video.u10-story-video');
    if (storyVids.length && 'IntersectionObserver' in window && !reduced()) {
      var storyIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
        });
      }, { threshold: 0.35 });
      storyVids.forEach(function (v) {
        v.addEventListener('playing', function () {
          var still = v.parentNode.querySelector('.u10-story-still');
          if (still) { still.style.transition = 'opacity .4s ease'; still.style.opacity = '0'; }
        });
        storyIO.observe(v);
      });
    }

    // 5. weight slider
    var range = $('input[type="range"][min="140"]');
    if (range) {
      var box = range.closest('.flex.flex-col.rounded-offer-u10-card');
      var spans = $$('p > span:first-child', box);
      var current = spans[0], lose = spans[spans.length - 1];
      var thumb = range.parentNode.querySelector('.pointer-events-none.absolute');
      var paint = function () {
        var w = Number(range.value);
        current.textContent = w; lose.textContent = couldLose(w);
        range.setAttribute('aria-valuenow', w); thumb.style.left = thumbLeft(w) + '%';
      };
      range.addEventListener('input', paint); paint();
    }

    // 6. FAQ
    var faqs = $$('button[aria-controls^="u10-faq-panel-"]');
    function setFaq(btn, on) {
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      var disc = btn.children[1], svg = disc && disc.querySelector('svg');
      if (disc) { disc.classList.toggle('border-transparent', on); disc.classList.toggle('bg-offer-u10-gold', on); disc.classList.toggle('border-offer-u10-gold-border', !on); disc.classList.toggle('bg-transparent', !on); }
      if (svg) { svg.classList.toggle('rotate-45', on); svg.classList.toggle('text-offer-u10-white', on); svg.classList.toggle('text-offer-u10-gold', !on); }
      var panel = document.getElementById(btn.getAttribute('aria-controls')); if (panel) panel.classList.toggle('is-open', on);
    }
    faqs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-expanded') !== 'true';
        faqs.forEach(function (o) { if (o !== btn && o.getAttribute('aria-expanded') === 'true') setFaq(o, false); });
        setFaq(btn, on);
      });
    });
  }

  function autoRail(el, secondsPerItem) {
    var mq = window.matchMedia('(max-width: 1023px)');
    var originals = Array.prototype.slice.call(el.children);
    var active = false, raf = 0, last = 0, pos = 0, half = 0, speed = 0, paused = false, visible = true, t = 0, io = null;
    function measure() {
      half = el.scrollWidth / 2;
      var gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      speed = pxPerSecond(el.firstElementChild ? el.firstElementChild.offsetWidth : 0, gap, secondsPerItem);
      pos = wrap(el.scrollLeft, 0, half);
    }
    function frame(ts) {
      raf = requestAnimationFrame(frame);
      var dt = last ? ts - last : 0; last = ts;
      if (paused || !visible || speed <= 0 || half <= 0) return;
      pos = wrap(pos, speed * dt / 1000, half); el.scrollLeft = pos;
    }
    function resume() { clearTimeout(t); t = setTimeout(function () { pos = wrap(el.scrollLeft, 0, half); paused = false; last = 0; el.classList.add('u10-autoscrolling'); }, 1500); }
    function pause() { paused = true; el.classList.remove('u10-autoscrolling'); resume(); }
    function onScroll() { if (paused) resume(); }
    var EV = ['pointerdown', 'pointerup', 'pointercancel', 'touchstart', 'touchend', 'touchcancel', 'wheel', 'keydown'];
    function start() {
      if (active) return; active = true;
      originals.forEach(function (c) { var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); el.appendChild(k); });
      measure(); el.classList.add('u10-autoscrolling');
      EV.forEach(function (e) { el.addEventListener(e, pause, { passive: true }); });
      el.addEventListener('scroll', onScroll, { passive: true });
      io = new IntersectionObserver(function (en) { visible = en[0] ? en[0].isIntersecting : false; }, { threshold: 0 }); io.observe(el);
      window.addEventListener('resize', measure);
      last = 0; raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (!active) return; active = false;
      cancelAnimationFrame(raf); raf = 0;
      EV.forEach(function (e) { el.removeEventListener(e, pause); });
      el.removeEventListener('scroll', onScroll); el.classList.remove('u10-autoscrolling');
      if (io) io.disconnect(); window.removeEventListener('resize', measure); clearTimeout(t); paused = false;
      while (el.children.length > originals.length) el.removeChild(el.lastElementChild);
    }
    function check() { if (mq.matches && !reduced()) start(); else stop(); }
    if (mq.addEventListener) mq.addEventListener('change', check); else mq.addListener(check);
    check();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})(typeof window !== 'undefined' ? window : this);
