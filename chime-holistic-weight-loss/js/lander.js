/* Chime Health holistic weight-loss lander: the reference page's behaviour (www.collective.org /holistic-weight-loss),
   re-implemented without React from their page chunk (uploads/collective-ref/page-logic.js): scroll reveal, the header
   menus, the "Learn more" panels, the savings calculator, the treatment calculator, the FAQ and Lenis smooth scrolling.
   The maths is exported for node (js/lander-tests.js). Nothing is sent or stored. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else api.init(root.document);
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- savings calculator (their lib: COMPETITOR_PRICING, collectiveCum, competitorCum, membershipIsPaidBack) ----------
  var COMPETITORS = [  // tirzepatide row: the page renders <SavingsCalculator medication="tirzepatide">
    { name: 'Ro', firstMonth: 338, ongoing: 548 },
    { name: 'Found', firstMonth: 359, ongoing: 359 },
    { name: 'MEDVi', firstMonth: 199, ongoing: 399 }
  ];
  var MEMBERSHIP = 199, MONTHLY = 69, DEFAULT_MONTH = 6;
  function ourCum(month) { return MONTHLY * month + (month >= 2 ? MEMBERSHIP : 0); }
  function theirCum(c, month) { return c.firstMonth + c.ongoing * (month - 1); }
  function savings(month) {
    var them = COMPETITORS.map(function (c) { return { name: c.name, cost: theirCum(c, month) }; });
    var cheapest = them.reduce(function (a, c) { return c.cost < a.cost ? c : a; });
    var ours = ourCum(month);
    var max = Math.max.apply(null, them.map(function (c) { return c.cost; }));
    var paidBack = month >= 2 && Math.min.apply(null, COMPETITORS.map(function (c) { return theirCum(c, month) - MONTHLY * month; })) >= MEMBERSHIP;
    return { ours: ours, them: them, hideOnNarrow: cheapest.name, save: Math.max(0, max - ours), paidBack: paidBack,
             fill: (month - 1) / 11 * 100 };
  }
  function money(n) { return '$' + n.toLocaleString('en-US'); }

  // ---------- treatment calculator (their TreatmentCalculator) ----------
  var TREAT = {
    tirz: { pct: 0.23, study: 'https://doi.org/10.1016/j.obpill.2025.100236',
            blurb: 'A dual-action GLP-1 medication, typically associated with greater average weight loss.',
            tail: ', where most patients used compounded tirzepatide, people averaged about 23% of body weight over 12 months. These are averages, not a prediction of your results. Individual outcomes vary with health, lifestyle, and adherence. A doctor decides what\'s right for you.' },
    sema: { pct: 0.18, study: 'https://doi.org/10.46889/JCMR.2025.6310',
            blurb: 'Works more gradually, which some people find easier to ease into.',
            tail: ' of patients using compounded semaglutide, people averaged about 18% of body weight over roughly a year. These are averages, not a prediction of your results. Individual outcomes vary with health, lifestyle, and adherence. A doctor decides what\'s right for you.' }
  };
  function treatment(weight, med) {
    var p = TREAT[med].pct, loss = Math.round(weight * p);
    return { loss: loss, after: weight - loss, pct: Math.round(100 * p) };
  }

  function init(doc) {
    var win = doc.defaultView;
    var reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // reveal: IntersectionObserver, threshold .12, rootMargin bottom -60px; their 80 ms stagger on the 2nd product card
    var reveals = doc.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in win)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new win.IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target, d = +(el.getAttribute('data-reveal-delay') || 0);
          win.setTimeout(function () { el.classList.add('is-visible'); }, d);
          io.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }

    // header: "All Protocols" dropdown (desktop)
    var protoBtn = doc.querySelector('button[aria-haspopup="menu"]');
    if (protoBtn) {
      var protoWrap = protoBtn.parentNode, menu = null;
      var setMenu = function (open) {
        protoBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var chev = protoBtn.querySelector('svg');
        if (chev) chev.classList.toggle('rotate-180', open);
        if (open && !menu) {
          menu = doc.getElementById('tpl-menu').content.firstElementChild.cloneNode(true);
          menu.id = protoBtn.getAttribute('aria-controls');
          protoWrap.appendChild(menu);
          menu.querySelector('a').addEventListener('click', function () { setMenu(false); });
        } else if (!open && menu) { menu.remove(); menu = null; }
      };
      protoBtn.addEventListener('click', function () { setMenu(!menu); });
      doc.addEventListener('mousedown', function (e) { if (menu && !protoWrap.contains(e.target)) setMenu(false); });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu) setMenu(false); });
    }

    // header: phone menu (the "Brought to you by…" pill hides while it is open, as theirs)
    var menuBtn = doc.querySelector('button[aria-controls][aria-label="Open menu"]');
    if (menuBtn) {
      var bar = menuBtn.closest('header > div');
      var pill = bar.querySelector('.pointer-events-none.absolute');
      var burger = menuBtn.innerHTML, panel = null;
      var setPanel = function (open) {
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menuBtn.innerHTML = open ? doc.getElementById('tpl-x').innerHTML : burger;
        if (pill) pill.style.display = open ? 'none' : '';
        if (open && !panel) {
          panel = doc.getElementById('tpl-mobile').content.firstElementChild.cloneNode(true);
          panel.id = menuBtn.getAttribute('aria-controls');
          bar.parentNode.appendChild(panel);
          panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setPanel(false); }); });
        } else if (!open && panel) { panel.remove(); panel = null; }
      };
      menuBtn.addEventListener('click', function () { setPanel(!panel); });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel) setPanel(false); });
      var lg = win.matchMedia('(min-width: 1024px)');
      var onLg = function () { if (lg.matches && panel) setPanel(false); };
      if (lg.addEventListener) lg.addEventListener('change', onLg); else lg.addListener(onLg);
    }

    // product cards: "Learn more" (grid-rows 0fr <-> 1fr, chevron flips)
    doc.querySelectorAll('article button[aria-controls]').forEach(function (btn) {
      var body = doc.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('svg').classList.toggle('rotate-180', open);
        body.classList.toggle('grid-rows-[1fr]', open);
        body.classList.toggle('grid-rows-[0fr]', !open);
      });
    });

    // FAQ: one open at a time
    var faqBtns = Array.prototype.slice.call(doc.querySelectorAll('#faq button[aria-controls]'));
    faqBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var opening = btn.getAttribute('aria-expanded') !== 'true';
        faqBtns.forEach(function (b) {
          var open = b === btn && opening, panel = doc.getElementById(b.getAttribute('aria-controls'));
          b.setAttribute('aria-expanded', open ? 'true' : 'false');
          b.querySelector('svg').classList.toggle('rotate-180', open);
          panel.style.gridTemplateRows = open ? '1fr' : '0fr';
          panel.style.opacity = open ? '1' : '0';
        });
      });
    });

    // savings calculator
    var sv = doc.querySelector('[data-sv-range]');
    if (sv) {
      var cols = doc.querySelectorAll('[data-sv-col]'), costs = doc.querySelectorAll('[data-sv-cost]');
      var drawSavings = function () {
        var m = +sv.value, r = savings(m);
        doc.querySelector('[data-sv-title]').textContent = 'Total spent by month ' + m;
        doc.querySelector('[data-sv-month]').textContent = 'Month ' + m;
        doc.querySelector('[data-sv-by]').textContent = 'By month ' + m + ', you could save up to';
        doc.querySelector('[data-sv-save]').textContent = money(r.save);
        doc.querySelector('[data-sv-payback]').style.display = r.paidBack ? '' : 'none';   // theirs unmounts it; their CSS has no [hidden] rule
        costs[0].textContent = money(r.ours);
        r.them.forEach(function (c, i) {
          costs[i + 1].textContent = money(c.cost);
          cols[i + 1].classList.toggle('max-[359px]:hidden', c.name === r.hideOnNarrow);
        });
        sv.setAttribute('aria-valuetext', 'Month ' + m);
        sv.style.background = 'linear-gradient(to right, #B4ADAB 0%, #B4ADAB ' + r.fill + '%, #E8E7E7 ' + r.fill + '%, #E8E7E7 100%)';
      };
      sv.addEventListener('input', drawSavings);
      sv.value = DEFAULT_MONTH;
      drawSavings();
    }

    // treatment calculator
    var tc = doc.querySelector('[data-tc-range]');
    if (tc) {
      var med = 'tirz', tabs = doc.querySelectorAll('[data-tc-tabs] button');
      var ON = ['bg-[#423531]', 'text-white'], OFF = ['bg-transparent', 'text-[#FF6044]', 'hover:bg-[#FFF0EB]'];
      var drawTreatment = function () {
        var w = +tc.value, r = treatment(w, med), t = TREAT[med];
        doc.querySelector('[data-tc-weight]').textContent = w + ' lbs';
        doc.querySelector('[data-tc-loss]').textContent = r.loss + ' lbs';
        doc.querySelector('[data-tc-after]').textContent = r.after + ' lbs';
        doc.querySelector('[data-tc-pct]').textContent = '( Based on real-world results of ' + r.pct + '% body weight )';
        doc.querySelector('[data-tc-blurb]').textContent = t.blurb;
        doc.querySelector('[data-tc-study]').href = t.study;
        doc.querySelector('[data-tc-tail]').textContent = t.tail;
        tc.setAttribute('aria-valuetext', w + ' pounds');
      };
      tabs.forEach(function (b, i) {
        b.addEventListener('click', function () {
          med = i === 0 ? 'tirz' : 'sema';
          tabs.forEach(function (x, j) {
            var on = j === i;
            x.setAttribute('aria-checked', on ? 'true' : 'false');
            ON.forEach(function (c) { x.classList.toggle(c, on); });
            OFF.forEach(function (c) { x.classList.toggle(c, !on); });
          });
          drawTreatment();
        });
      });
      tc.addEventListener('input', drawTreatment);
      tc.value = 200;
      drawTreatment();
    }

    // Lenis smooth wheel scrolling, their options (lerp .1, wheel only, touch native)
    if (win.Lenis) {
      var lenis = new win.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, syncTouch: false, autoRaf: true });
      win.__lenis = lenis;
    }
  }

  return { init: init, savings: savings, treatment: treatment, money: money, ourCum: ourCum, theirCum: theirCum,
           COMPETITORS: COMPETITORS, TREAT: TREAT };
}));
