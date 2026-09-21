/* Chime Health — Choose Your Treatment: vanilla port of the reference's React page
   (intake.wellmedr.com/approval-confirmation, ripped 2026-09-16). Renders both medication cards and the
   mobile selector from js/plans-data.js with the reference's exact class strings, then runs its three
   bits of client logic with the reference's timings:
     1. urgency countdown (mobile strip): mm:ss from 6:57 to 00:00, 1 s tick; the "discounts left" count
        drops by 1 at random 8–15 s intervals (first after 10–15 s), floor 1;
     2. "chose this today" counters: every 8–15 s (first after 10–15 s) each treatment gains +1 with
        p = .8; if none moved, one at random does;
     3. treatment selector (mobile): aria-pressed + accent border + radio dot, then a smooth scroll to
        the matching card.
   Plan buttons are intentionally BLANK (Luis, 2026-09-16): they are real <button>s like the reference's
   but onPlanSelect() only records the choice in sessionStorage; no navigation (the payment step that
   the reference goes to is not built — "next step open").
   Pure parts are exported on window.ChimeChooseTreatment and module.exports for js/checkout-tests.js. */
(function (root) {
  'use strict';

  var ACCENT = {
    green: { border: 'border-brand-green', radioBorder: 'border-brand-green', radioBg: 'bg-brand-green', badge: 'bg-brand-green/10 text-brand-green border border-brand-green/20' },
    gold:  { border: 'border-brand-gold',  radioBorder: 'border-brand-gold',  radioBg: 'bg-brand-gold',  badge: 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30' }
  };
  var PLAN_ORDER = ['sixMonth', 'threeMonth', 'monthly'];
  var PLAN_TERM = { twelveMonth: 12, sixMonth: 6, threeMonth: 3, monthly: 1 };
  var PRICE_GOLD = 'color: rgb(184, 146, 46);';

  /* ---------- pure helpers ---------- */
  function fmtMoney(n) { return '$' + Number(n).toLocaleString('en-US'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function clock(ms) { var s = Math.floor(Math.max(0, ms) / 1000); return pad2(Math.floor(s / 60)) + ':' + pad2(s % 60); }
  function savingsLine(plan) { return fmtMoney(plan.totalPrice) + ' due today - save'; }
  function billedLine(plan) { return fmtMoney(plan.totalPrice) + ' billed today for a full ' + (plan.months || 12) + ' month supply — no monthly billing'; }
  function youSaveLine(plan) { return 'You save ' + fmtMoney(plan.savingsToday) + ' over month to month pricing.'; }
  function monthlyLine(plan) { return fmtMoney(plan.price) + ' due today and forever, your price never goes up, no surprises or changes.'; }
  function bigButtonLabel(plan) { return 'GET ' + (plan.months || 12) + ' MONTHS + SAVE ' + fmtMoney(plan.savingsToday); }

  // Reference: discount count s → s<=1 ? s : s-1
  function decrementDiscount(n) { return n <= 1 ? n : n - 1; }
  // Reference: each id +1 with p=.8; if nothing moved, bump one at random. `rand` injectable for tests.
  function bumpCounters(counts, rand) {
    rand = rand || Math.random;
    var next = {}, ids = Object.keys(counts), moved = false;
    ids.forEach(function (id) { next[id] = counts[id]; if (rand() < 0.8) { next[id] += 1; moved = true; } });
    if (!moved && ids.length) { var pick = ids[Math.floor(rand() * ids.length)]; next[pick] += 1; }
    return next;
  }
  function firstDelay(rand) { return 10000 + 5000 * (rand || Math.random)(); }
  function nextDelay(rand) { return 8000 + 7000 * (rand || Math.random)(); }

  /* ---------- SVG bits (verbatim from the reference DOM) ---------- */
  var SVG_STAR = function (cls) { return '<svg class="w-4 h-4 ' + cls + '" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>'; };
  var SVG_ARROW = function (cls) { return '<svg class="' + cls + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>'; };
  var SVG_CHEVRON = '<svg class="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
  var SVG_BOLT = '<svg class="w-[1.1rem] h-[1.1rem]" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"></path></svg>';
  var SVG_CLOCK = '<svg class="w-[1.1rem] h-[1.1rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><circle cx="12" cy="12" r="9"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2"></path></svg>';

  /* ---------- renderers (class strings = the reference DOM, 2026-09-16) ---------- */
  function tick(text, wrap) {
    return '<div class="' + wrap + '"><span class="flex-shrink-0 font-bold">✓</span><span>' + esc(text) + '</span></div>';
  }
  function renderStars(rating) {
    var s = '';
    for (var i = 0; i < rating.full; i++) s += SVG_STAR('text-yellow-400');
    for (var j = 0; j < rating.half; j++) s += SVG_STAR('text-yellow-200');
    return '<div class="flex items-center gap-1 mb-3">' + s + '<span class="text-sm text-gray-600 ml-1">' + esc(rating.value) + '</span></div>';
  }
  // heroKey = the highlighted plan (V1: twelveMonth, V2: sixMonth); rowKeys = the plans listed under it
  function renderBestValue(t, plan, heroKey, rowKeys) {
    heroKey = heroKey || 'twelveMonth'; rowKeys = rowKeys || PLAN_ORDER;
    var h = '<div class="mb-4"><div class="relative rounded-2xl border-2 border-brand-green bg-gradient-to-b from-brand-green/[0.06] via-white to-white px-5 pt-6 pb-5 shadow-md">';
    if (plan.bestValue) h += '<div class="absolute -top-3 left-5"><span class="rounded-full bg-brand-green px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">⭐ Best value</span></div>';
    h += '<div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="text-sm font-black uppercase tracking-wide text-secondary-500">' + esc(plan.label) + '</p></div>';
    h += '<span class="shrink-0 whitespace-nowrap rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold text-brand-green">Save ' + fmtMoney(plan.savingsToday) + '</span></div>';
    h += '<div class="mt-3 flex items-baseline gap-1"><span class="text-5xl font-black leading-none tracking-tight" style="' + PRICE_GOLD + '">' + fmtMoney(plan.price) + '</span><span class="text-base font-bold text-gray-500">/ month</span></div>';
    h += '<p class="mt-3 text-lg font-black leading-snug text-secondary-500">' + esc(billedLine(plan)) + '</p>';
    h += '<p class="mt-2 text-lg font-black leading-snug text-brand-green">' + esc(youSaveLine(plan)) + '</p>';
    h += '<div class="mt-4 space-y-1.5 border-t border-brand-green/15 pt-4">' + plan.features.map(function (f) { return tick(f, 'flex items-start gap-2 text-sm font-semibold text-brand-green'); }).join('') + '</div>';
    if (plan.footerNote) h += '<p class="mt-2 text-xs italic text-gray-500">' + esc(plan.footerNote) + '</p>';
    if (plan.popularBadge) h += '<div class="mt-3 inline-block rounded-full bg-amber-100 px-2.5 py-1.5"><span class="whitespace-nowrap text-[10px] font-bold text-amber-600 md:text-sm">⭐ Most patients choose this plan</span></div>';
    h += '<button type="button" class="btn-lilac mt-4 w-full " data-plan="' + heroKey + '" data-treatment="' + esc(t.key) + '">' + esc(bigButtonLabel(plan)) + SVG_ARROW('h-4 w-4') + '</button>';
    h += '</div>';
    // the rows under the hero card (V1: 6 / 3 / monthly; V2: 3 / monthly)
    h += '<div class="bg-gray-50 rounded-xl p-4 mt-4"><div class="space-y-0">';
    rowKeys.forEach(function (key, i) {
      var p = t.plans[key]; if (!p) return;
      h += '<div class="py-4 px-3 rounded-lg transition-all ' + (i ? 'border-t border-gray-200' : '') + '">';
      h += '<div class="mb-1"><span class="font-black text-lg text-gray-900">' + esc(p.label) + '</span></div>';
      if (p.sublabel) h += '<p class="text-xs text-secondary-500 italic font-bold mb-1">' + esc(p.sublabel) + '</p>';
      h += '<div class="mb-1 flex items-baseline"><span class="text-3xl font-bold" style="' + PRICE_GOLD + '">' + fmtMoney(p.price) + '</span><span class="text-sm text-gray-500">/month</span></div>';
      if (key === 'monthly') h += '<p class="text-base font-bold italic mb-2 text-secondary-500">' + esc(monthlyLine(p)) + '</p>';
      else h += '<p class="text-base font-bold italic mb-2"><span class="text-secondary-500">' + esc(savingsLine(p)) + '</span> <span class="text-brand-green">' + fmtMoney(p.savingsToday) + '</span></p>';
      h += '<div class="space-y-1">' + p.features.map(function (f) { return tick(f, 'flex items-start gap-2 text-sm text-brand-green font-semibold'); }).join('') + '</div>';
      if (p.footerNote) h += '<p class="text-xs text-gray-500 italic mt-2">' + esc(p.footerNote) + '</p>';
      h += '<button type="button" class="w-full mt-3 btn-lilac " data-plan="' + key + '" data-treatment="' + esc(t.key) + '">Select' + SVG_ARROW('w-4 h-4') + '</button>';
      h += '</div>';
    });
    h += '</div></div></div>';
    return h;
  }
  function renderNextSteps(steps) {
    var h = '<div class="border-t border-gray-100 my-4"></div><div class="bg-brand-green/5 border border-brand-green/20 rounded-xl p-4"><h4 class="text-center font-bold text-secondary-500 text-sm tracking-wide mb-4">WHAT HAPPENS NEXT?</h4><div class="flex items-start justify-between gap-2">';
    steps.forEach(function (s, i) {
      if (i) h += '<div class="flex items-center pt-3">' + SVG_CHEVRON + '</div>';
      h += '<div class="flex-1 text-center"><div class="text-2xl mb-1">' + s.icon + '</div>' + s.lines.map(function (l) { return '<p class="text-xs font-bold text-secondary-500">' + esc(l) + '</p>'; }).join('') + '<p class="text-[10px] text-gray-500 italic mt-0.5">' + esc(s.note) + '</p></div>';
    });
    return h + '</div></div>';
  }
  function renderTreatmentCard(t, data) {
    var h = '<div id="treatment-' + esc(t.id) + '" data-screen-label="CT ' + esc(t.name) + '" class="w-full bg-white rounded-2xl overflow-hidden transition-all cursor-pointer scroll-mt-20 shadow-md hover:shadow-lg">';
    h += '<div class="relative bg-gradient-to-b from-blue-100 via-blue-50 to-white px-6 pt-4 pb-2"><div class="h-36 flex items-center justify-center"><img alt="' + esc(t.cardTitle) + '" class="h-full w-auto object-contain" src="' + esc(t.image) + '"></div></div>';
    h += '<div class="flex items-center justify-center gap-6 py-2 border-b border-gray-100"><span class="text-base font-serif text-gray-400">' + esc(data.press[0]) + '</span><span class="text-sm font-bold text-gray-400 tracking-wide">' + esc(data.press[1]) + '</span></div>';
    h += '<div class="px-5 py-4"><h3 class="text-xl font-bold text-secondary-500 mb-1">' + esc(t.cardTitle) + '</h3>' + renderStars(data.rating);
    h += '<div class="bg-brand-green/10 border border-brand-green/20 rounded-lg px-4 py-3 mb-3"><p class="text-sm text-brand-green font-medium">' + esc(t.tagline) + '</p></div>';
    h += '<div class="bg-brand-green/10 border-2 border-brand-green rounded-lg px-4 py-2 mb-3 inline-flex items-center gap-2"><span class="text-yellow-500">⭐</span><span class="text-sm font-semibold text-secondary-500">Recommended for most patients</span></div>';
    h += '<div class="space-y-1 mb-3">' + t.highlights.map(function (x) { return '<div class="flex items-center gap-2"><span class="text-secondary-500 font-bold">•</span><span class="text-sm text-secondary-500">' + esc(x) + '</span></div>'; }).join('') + '</div>';
    var heroKey = data.heroPlan || 'twelveMonth';
    h += renderBestValue(t, t.plans[heroKey], heroKey, data.rowPlans || PLAN_ORDER) + renderNextSteps(data.nextSteps);
    return h + '</div></div>';
  }
  function renderSelectorCard(t, selected, count) {
    var a = ACCENT[t.accent];
    var h = '<button type="button" aria-pressed="' + (selected ? 'true' : 'false') + '" data-select-treatment="' + esc(t.id) + '" class="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 transition-all text-left active:scale-[0.99] ' + (selected ? a.border + ' shadow-sm' : 'border-gray-200') + '">';
    h += '<div class="w-[5.5rem] h-[5.5rem] flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-b from-blue-100 via-blue-50 to-white flex items-center justify-center"><img alt="' + esc(t.name) + '" class="w-full h-full object-contain" src="' + esc(t.image) + '"></div>';
    h += '<div class="flex-1 min-w-0"><h3 class="text-xl font-bold text-secondary-500 leading-tight truncate">' + esc(t.name) + '</h3><p class="text-base text-gray-600 mt-1 leading-snug line-clamp-2">' + esc(t.tagline) + '</p>';
    h += '<div class="inline-flex items-center gap-1 text-sm font-semibold px-3 py-0.5 rounded-full mt-2 ' + a.badge + '">' + (t.badgeIcon === 'clock' ? SVG_CLOCK : SVG_BOLT) + '<span>' + esc(t.badgeLabel) + '</span></div>';
    h += '<div class="flex items-center gap-1.5 mt-2"><span class="w-2 h-2 rounded-full bg-brand-green flex-shrink-0"></span><span class="text-sm text-gray-700 font-medium tabular-nums" data-count="' + esc(t.id) + '">' + Number(count).toLocaleString('en-US') + ' chose this today</span></div></div>';
    h += '<div class="flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ' + (selected ? a.radioBorder + ' ' + a.radioBg : 'border-gray-300 bg-white') + '">' + (selected ? '<span class="w-[0.9rem] h-[0.9rem] rounded-full bg-white"></span>' : '') + '</div>';
    return h + '</button>';
  }
  function renderUrgency(u, remainingMs) {
    // Same node shape as the reference: "Only <b>5</b> discounts left. Yours is reserved for: <b>06:57</b>"
    return 'Only <span class="font-bold">' + u.discountsLeft + '</span> ' + (u.discountsLeft === 1 ? 'discount' : 'discounts') + ' left. Yours is reserved for: <span class="font-bold tabular-nums ml-0.5" data-clock>' + clock(remainingMs) + '</span>';
  }

  /* ---------- page wiring ---------- */
  var state = { selected: null, counts: {}, discounts: 0 };

  function onPlanSelect(treatmentKey, planKey) {
    // BLANK on purpose (Luis, 2026-09-16): the payment step is not built. Selection is recorded only.
    try { sessionStorage.setItem('chime.chooseTreatment', JSON.stringify({ med: treatmentKey, term: PLAN_TERM[planKey], plan: planKey, at: Date.now() })); } catch (e) { /* private mode */ }
  }

  function mount(data, doc) {
    var grid = doc.getElementById('ct-grid');
    var sel = doc.getElementById('ct-selector');
    var urg = doc.getElementById('ct-urgency');
    data.treatments.forEach(function (t) { state.counts[t.id] = t.patientsToday; });
    state.discounts = data.urgency.discountsLeft;
    // quiz-handoff.js (v2 only) may name the treatment the visitor has already taken; unknown ids are ignored
    if (root.CHIME_CT_PRESELECT && data.treatments.some(function (t) { return t.id === root.CHIME_CT_PRESELECT; })) state.selected = root.CHIME_CT_PRESELECT;
    grid.innerHTML = data.treatments.map(function (t) { return renderTreatmentCard(t, data); }).join('');
    function paintSelector() {
      sel.innerHTML = data.treatments.map(function (t) { return renderSelectorCard(t, state.selected === t.id, state.counts[t.id]); }).join('');
    }
    paintSelector();

    // selector: select + scroll to the card (reference: requestAnimationFrame → scrollIntoView smooth/start)
    sel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-select-treatment]'); if (!b) return;
      state.selected = b.getAttribute('data-select-treatment');
      paintSelector();
      var id = state.selected;
      requestAnimationFrame(function () { var el = doc.getElementById('treatment-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    });
    // plan buttons: blank
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-plan]'); if (!b) return;
      e.preventDefault();
      onPlanSelect(b.getAttribute('data-treatment'), b.getAttribute('data-plan'));
    });

    // 1. countdown + discounts
    var total = (60 * data.urgency.minutes + data.urgency.seconds) * 1000;
    var deadline = Date.now() + total;
    function paintUrgency() { urg.innerHTML = renderUrgency({ discountsLeft: state.discounts }, deadline - Date.now()); }
    paintUrgency();
    var iv = setInterval(function () { var left = deadline - Date.now(); urg.querySelector('[data-clock]').textContent = clock(left); if (left <= 0) clearInterval(iv); }, 1000);
    var alive = true, dTimer;
    function discountTick() {
      if (!alive) return;
      if (state.discounts > 1) { state.discounts = decrementDiscount(state.discounts); paintUrgency(); dTimer = setTimeout(discountTick, nextDelay()); }
    }
    dTimer = setTimeout(discountTick, firstDelay());

    // 2. patient counters
    var cTimer;
    function counterTick() {
      if (!alive) return;
      state.counts = bumpCounters(state.counts);
      Object.keys(state.counts).forEach(function (id) { var el = sel.querySelector('[data-count="' + id + '"]'); if (el) el.textContent = state.counts[id].toLocaleString('en-US') + ' chose this today'; });
      cTimer = setTimeout(counterTick, nextDelay());
    }
    cTimer = setTimeout(counterTick, firstDelay());

    root.addEventListener('pagehide', function () { alive = false; clearInterval(iv); clearTimeout(dTimer); clearTimeout(cTimer); });
    return state;
  }

  var api = { fmtMoney: fmtMoney, clock: clock, savingsLine: savingsLine, billedLine: billedLine, youSaveLine: youSaveLine, monthlyLine: monthlyLine, bigButtonLabel: bigButtonLabel, decrementDiscount: decrementDiscount, bumpCounters: bumpCounters, firstDelay: firstDelay, nextDelay: nextDelay, renderTreatmentCard: renderTreatmentCard, renderSelectorCard: renderSelectorCard, renderUrgency: renderUrgency, renderNextSteps: renderNextSteps, ACCENT: ACCENT, PLAN_TERM: PLAN_TERM, mount: mount, onPlanSelect: onPlanSelect };
  root.ChimeChooseTreatment = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  if (typeof document !== 'undefined' && root.CHIME_CHOOSE_TREATMENT) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { mount(root.CHIME_CHOOSE_TREATMENT, document); });
    else mount(root.CHIME_CHOOSE_TREATMENT, document);
  }
})(typeof window !== 'undefined' ? window : globalThis);
