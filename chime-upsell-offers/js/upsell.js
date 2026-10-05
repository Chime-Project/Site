/* Chime Health — post-purchase upsell offers: the engine (chime-upsell-offers/).
   What the reference does, on its timings (UPSELL-OFFERS-PLAN.md §1, stepped through at 10 fps):
   - "This offer expires in 10:00", ticking every second, restarted on every new ask; it stops at 0:00.
   - "No thanks…" -> the link reads "Declining..." for ~1.1 s -> the page jumps to the top (no smooth scroll) and the
     after-decline ask replaces the first one in one frame: new banner, 30% -> 50% off on the card, the plan picker and
     the button, the timer back at 10:00 -> a confetti burst 0.5 s later, ~4.5 s long.
   - A second "No thanks…" -> "Declining..." -> the next offer (confetti again). After offer 3 -> done.html.
   - "Yes! Add to my plan!" records the offer and plan and goes to the next offer. Nothing is charged: there is no
     payment backend (as the checkouts).
   Confetti: GSAP 3.13 + Physics2DPlugin (the site's GSAP, from unpkg like the other pages): ~150 pieces (squares,
   dots, ribbons) thrown up from the top of the screen, falling under gravity and fluttering, fading out by ~4.5 s.
   Skipped under prefers-reduced-motion (the price change still happens).
   Session data (sessionStorage "chime:upsell"): { name, med, term, items: [...], declined: [...] }, written by the
   checkout (../choose-treatment-original/js/to-upsells.js) and by these pages. The pure helpers are exported for node
   (js/upsell-tests.js). */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ChimeUpsell = api;
}(typeof self !== 'undefined' ? self : this, function (root) {
  'use strict';

  var KEY = 'chime:upsell';
  var PLAN_WORD = { 1: '1 month', 3: '3 month', 6: '6 month', 12: '12 month' };

  // ---------- pure helpers (tested in node) ----------
  function money(n) { return '$' + Number(n).toLocaleString('en-US'); }
  function clock(s) { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function cleanName(n) { return String(n || '').trim().split(/\s+/)[0].slice(0, 40); }
  function banner(ask, name) {   // the headline, with the first name or without it
    name = cleanName(name);
    return name ? ask.head.replace('{name}', name) : ask.noName;
  }
  function orderLabel(D, med, term) {
    var m = D.medNames[med] ? med : D.orderFallback.med;
    var t = PLAN_WORD[term] ? +term : D.orderFallback.term;
    return D.medNames[m] + ' - ' + PLAN_WORD[t] + ' plan';
  }
  function offerIndex(D, key) {
    for (var i = 0; i < D.offers.length; i++) if (D.offers[i].key === key) return i;
    return -1;
  }
  function nextHref(D, key) {
    var i = offerIndex(D, key);
    return i > -1 && i < D.offers.length - 1 ? D.offers[i + 1].href : D.doneHref;
  }
  function ctaPrice(plan) {      // the button shows the per-month figure, like the plan card (plan §4.5)
    return { was: money(plan.was), now: money(plan.now) + (plan.months > 1 ? '/mo' : '') };
  }

  // ---------- session ----------
  function load() {
    try { return JSON.parse(root.sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(s) { try { root.sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } }

  // ---------- confetti (GSAP + Physics2DPlugin) ----------
  var COLORS = ['#FF5E7E', '#FFB13D', '#FFE14D', '#5CE0A0', '#3DB6FF', '#8B6CFF', '#FF7BEB', '#7CF5FF', '#B8922E', '#26AF59'];
  function confetti(doc) {
    var win = doc.defaultView, gsap = win.gsap;
    if (!gsap || !win.Physics2DPlugin) return;
    if (win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(win.Physics2DPlugin);
    var layer = doc.createElement('div');
    layer.className = 'uo-confetti';
    layer.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(layer);
    var W = win.innerWidth, H = win.innerHeight, N = W < 600 ? 130 : 170, done = 0;
    for (var i = 0; i < N; i++) {
      var p = doc.createElement('i'), kind = i % 3;
      var size = gsap.utils.random(6, 10);
      p.style.width = (kind === 2 ? size * 0.45 : size) + 'px';
      p.style.height = (kind === 2 ? size * 2.2 : size * (kind === 0 ? 0.7 : 1)) + 'px';
      p.style.background = COLORS[i % COLORS.length];
      if (kind === 1) p.style.borderRadius = '50%';
      layer.appendChild(p);
      // thrown from a band across the top of the screen, up and out, then down under gravity
      gsap.set(p, { x: gsap.utils.random(W * 0.15, W * 0.85), y: gsap.utils.random(H * 0.05, H * 0.2), rotation: gsap.utils.random(0, 360) });
      var life = gsap.utils.random(3.2, 4.6);
      gsap.to(p, {
        duration: life, ease: 'none',
        physics2D: { velocity: gsap.utils.random(220, 620), angle: gsap.utils.random(200, 340), gravity: gsap.utils.random(380, 520), friction: 0.02 },
        rotation: '+=' + gsap.utils.random(-540, 540), rotationX: gsap.utils.random(360, 1080),
        onComplete: function () { if (++done === N) layer.remove(); }
      });
      gsap.to(p, { opacity: 0, duration: 0.8, delay: life - 0.8, ease: 'power1.in' });
    }
  }

  // ---------- page ----------
  var ICONS = {
    check: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
    warn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 21h20L12 3z" fill="#F59E0B"/><path d="M12 10v5M12 17.5v.5" stroke="#41362A" stroke-width="2" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z" fill="#F59E0B"/><circle cx="12" cy="19" r="2" fill="#B45309"/></svg>',
    no: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M4.8 15.2 15.2 4.8"/></svg>',
    box: '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>'
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function initOffer(doc, D) {
    var win = doc.defaultView, app = doc.getElementById('uo-app');
    var key = app.getAttribute('data-offer'), idx = offerIndex(D, key), offer = D.offers[idx];
    var S = load(), q = new win.URLSearchParams(win.location.search);
    if (q.get('med')) S.med = q.get('med');
    if (q.get('term')) S.term = +q.get('term');
    save(S);
    var stage = 'first', sel = 0, left = D.timerSeconds, timer = null, busy = false;

    function render() {
      var ask = offer[stage], plan = ask.plans[sel], monthly = ask.plans[0], cta = ctaPrice(plan);
      var bars = D.offers.map(function (o, i) { return '<span class="uo-bar' + (i <= idx ? ' is-on' : '') + '"></span>'; }).join('');
      var plansHtml = ask.plans.map(function (p, i) {
        return '<label class="uo-plan' + (i === sel ? ' is-selected' : '') + '">' +
          '<input type="radio" name="uo-plan" value="' + i + '"' + (i === sel ? ' checked' : '') + ' />' +
          '<span class="uo-plan__body"><span class="uo-plan__name">' + esc(p.label) + '</span>' +
          '<span class="uo-plan__price"><s>' + money(p.was) + '/mo</s> ' + money(p.now) + '/mo</span>' +
          '<span class="uo-plan__save">You are saving <b>' + money(p.save) + '</b></span></span></label>';
      }).join('');
      app.innerHTML =
        '<section class="uo-order" data-screen-label="UO Order">' + ICONS.check +
          '<div><p>Thank you for your order!</p><p class="uo-order__plan">' + esc(orderLabel(D, S.med, S.term)) + '</p></div></section>' +
        '<section class="uo-banner uo-tone-' + ask.tone + '" data-screen-label="UO Banner">' +
          '<h1>' + (ask.icon ? '<span class="uo-banner__icon">' + ICONS[ask.icon] + '</span>' : '') + esc(banner(ask, S.name)) +
            (ask.tail ? ' ' + ask.tail : '') + '</h1><p>' + esc(ask.sub) + '</p></section>' +
        '<p class="uo-timer" data-screen-label="UO Timer">This offer expires in <b data-uo-clock>' + clock(left) + '</b></p>' +
        '<article class="uo-card uo-accent-' + offer.accent + '" data-screen-label="UO Offer">' +
          '<div class="uo-progress"><span>Offer • ' + (idx + 1) + ' of ' + D.offers.length + '</span><span class="uo-bars">' + bars + '</span></div>' +
          '<div class="uo-media uo-media--' + offer.key + '"><img src="' + offer.image + '" alt="' + esc(offer.imageAlt) + '" width="' + offer.imageW + '" height="' + offer.imageH + '" /></div>' +
          '<div class="uo-body">' +
            '<h2 class="uo-name">' + esc(offer.name) + '</h2><p class="uo-pitch">' + esc(offer.pitch) + '</p>' +
            '<p class="uo-price"><b>' + money(monthly.now) + '</b><span>/every 1 month</span></p><p class="uo-was"><s>' + money(offer.full) + '</s></p>' +
            '<p class="uo-saving">You are saving <b>' + money(monthly.save) + '</b></p>' +
            '<p class="uo-lifetime">Lifetime ' + ask.pct + '% Off Applied.</p>' +
            '<ul class="uo-benefits">' + offer.benefits.map(function (b) { return '<li>' + ICONS.check + esc(b) + '</li>'; }).join('') + '</ul>' +
            '<h3 class="uo-choose">Choose your plan</h3><p class="uo-choose__sub">Longer plans = lower monthly costs!</p>' +
            '<div class="uo-plans" role="radiogroup" aria-label="Choose your plan">' + plansHtml + '</div>' +
            '<button type="button" class="uo-cta" data-uo-yes><span class="uo-cta__label">' + ICONS.box + 'Yes! Add to my plan!</span>' +
              '<span class="uo-cta__price"><s>' + cta.was + '</s> ' + cta.now + '</span></button>' +
            '<button type="button" class="uo-no" data-uo-no>' + ICONS.no + '<span>' + esc(ask.decline) + '</span></button>' +
          '</div></article>';
    }

    function tick() {
      left = Math.max(0, left - 1);
      var c = app.querySelector('[data-uo-clock]');
      if (c) c.textContent = clock(left);
      if (!left) win.clearInterval(timer);
    }
    function startTimer() { win.clearInterval(timer); left = D.timerSeconds; timer = win.setInterval(tick, 1000); }

    function celebrate() { win.setTimeout(function () { confetti(doc); }, D.confettiDelayMs); }

    app.addEventListener('change', function (e) {
      if (e.target.name !== 'uo-plan') return;
      sel = +e.target.value;
      var y = win.scrollY;
      render();
      win.scrollTo(0, y);
      var r = app.querySelector('input[name="uo-plan"][value="' + sel + '"]');
      if (r) r.focus({ preventScroll: true });
    });
    app.addEventListener('click', function (e) {
      var yes = e.target.closest('[data-uo-yes]'), no = e.target.closest('[data-uo-no]');
      if (busy || (!yes && !no)) return;
      if (yes) {
        var p = offer[stage].plans[sel];
        S.items = (S.items || []).filter(function (it) { return it.key !== offer.key; });
        S.items.push({ key: offer.key, name: offer.name, plan: p.label, months: p.months, perMonth: p.now, pct: offer[stage].pct });
        S.celebrate = 1;
        save(S);
        win.location.href = nextHref(D, offer.key);
        return;
      }
      busy = true;
      no.querySelector('span').textContent = 'Declining...';
      win.setTimeout(function () {
        if (stage === 'first') {
          stage = 'second'; sel = 0;
          startTimer();          // before render(), so the new ask shows 10:00, not the old count
          render();
          win.scrollTo(0, 0);
          celebrate();
          busy = false;
        } else {
          S.declined = (S.declined || []).filter(function (k) { return k !== offer.key; }).concat(offer.key);
          S.celebrate = 1;
          save(S);
          win.location.href = nextHref(D, offer.key);
        }
      }, D.decliningMs);
    });

    render();
    startTimer();
    if (S.celebrate) { S.celebrate = 0; save(S); celebrate(); }
  }

  function initDone(doc, D) {
    var app = doc.getElementById('uo-app'), S = load();
    var date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var rows = [{ name: orderLabel(D, S.med, S.term), note: 'Your GLP-1 plan' }].concat((S.items || []).map(function (it) {
      return { name: it.name + ' - ' + it.plan, note: money(it.perMonth) + (it.months > 1 ? '/mo' : '/month') + ' · Lifetime ' + it.pct + '% Off' };
    }));
    app.querySelector('[data-uo-date]').textContent = 'Order from ' + date;
    app.querySelector('[data-uo-items]').innerHTML = rows.map(function (r) {
      return '<li><span class="uo-item__name">' + esc(r.name) + '</span><span class="uo-item__note">' + esc(r.note) + '</span></li>';
    }).join('');
    if (S.celebrate) { S.celebrate = 0; save(S); doc.defaultView.setTimeout(function () { confetti(doc); }, D.confettiDelayMs); }
  }

  function init(doc) {
    var D = root.CHIME_UPSELL_OFFERS, app = doc.getElementById('uo-app');
    if (!D || !app) return;
    if (app.hasAttribute('data-offer')) initOffer(doc, D); else initDone(doc, D);
  }
  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', function () { init(root.document); });
    else init(root.document);
  }

  return { money: money, clock: clock, banner: banner, cleanName: cleanName, orderLabel: orderLabel, offerIndex: offerIndex,
           nextHref: nextHref, ctaPrice: ctaPrice, KEY: KEY };
}));
