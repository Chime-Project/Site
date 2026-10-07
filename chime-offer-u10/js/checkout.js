/* Chime Health u10 checkout: what the reference checkout does, in plain JS (their copy + offer config read from their
   bundle, behaviour observed on the live page 2026-10-06):
     - gate: only after the quiz is completed on this device (else back to the quiz); name, weight, goal, sex and phone
       come from the quiz answers.
     - "Your Discount is Reserved for 10:00": a 10-minute countdown from page load (both clocks), stops at 00:00.
     - picker: Semaglutide / Tirzepatide (default Tirzepatide, 3-Month); the plan ladder shows the picked medicine's
       prices; prices are flat per plan (their "99FOREVER" offer): sema $79 / $228 / $438 / $588, tirz $129 / $378 /
       $738 / $1,428 for 1 / 3 / 6 / 12 months, "was" $189 / $269 a month; per month = total / months; savings =
       was x months - total.
     - picking a plan below 12 months scrolls to payment and opens the ONE TIME SPECIAL OFFER sheet for the next tier
       (1 -> 3 -> 6 -> 12 months): Yes switches, No thanks / close keep the pick. Monthly hides Buy Now, Pay Later.
     - CONTINUE (enabled by the consent box) goes to ../welcome/. The payment fields are a look-alike: nothing is sent.
   Pure helpers are exported for js/checkout-tests.js. */
(function (root) {
  'use strict';
  var TOTAL = { sema: { 1: 79, 3: 228, 6: 438, 12: 588 }, tirz: { 1: 129, 3: 378, 6: 738, 12: 1428 } };
  var STRIKE = { sema: 189, tirz: 269 };
  var NAME = { sema: 'Semaglutide', tirz: 'Tirzepatide' };
  var PILL = { sema: 'Most Popular', tirz: 'Most Weight Loss Potential' };
  var NEXT = { 1: 3, 3: 6, 6: 12 };
  var RESERVE = 600;
  var KEY = { data: 'chime_u10_quiz_data', done: 'chime_u10_quiz_completed' };

  function perMonth(med, m) { return Math.round(TOTAL[med][m] / m); }
  function savings(med, m) { return STRIKE[med] * m - TOTAL[med][m]; }
  function monthSave(med, m) { return STRIKE[med] - perMonth(med, m); }
  function every(m) { return m === 1 ? 'every month' : 'every ' + m + ' months'; }
  function offer(med, m) {
    var n = NEXT[m]; if (!n) return null;
    return { next: n, dmo: perMonth(med, m) - perMonth(med, n), curpm: perMonth(med, m), nextpm: perMonth(med, n), nextMonths: n, nextLabel: n + '-month plan' };
  }
  function clock(sec) { sec = Math.max(0, sec); return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); }
  function money(n) { return String(n); }
  function tokens(med, m, a) {
    a = a || {};
    var w = Number(a.weight) || 0, g = Number(a.goalWeight) || 0;
    return {
      first: a.firstName || '', weight: a.weight == null ? '' : String(a.weight), gender: a.gender || '', goal: a.goalWeight == null ? '' : String(a.goalWeight),
      lose: String(Math.max(0, w - g)), strike: money(STRIKE[med]),
      save1: money(savings(med, 1)), save3: money(savings(med, 3)), save6: money(savings(med, 6)), save12: money(savings(med, 12)),
      pm1: money(perMonth(med, 1)), pm3: money(perMonth(med, 3)), pm6: money(perMonth(med, 6)), pm12: money(perMonth(med, 12)),
      monthSave: money(monthSave(med, m)), pill: PILL[med], med: NAME[med], pm: money(perMonth(med, m)), save: money(savings(med, m)),
      every: every(m), planName: m + ' Month Plan', total: money(TOTAL[med][m]), subtotal: money(STRIKE[med] * m),
      planLower: m === 1 ? 'Monthly plan' : m + '-Month plan', payLine: m === 1 ? 'Pay month to month.' : 'Pay ' + m + ' months at a time.'
    };
  }
  function fill(t, map) { return t.replace(/\{\{(\w+)\}\}/g, function (_, k) { return k in map ? map[k] : ''; }); }

  var api = { TOTAL: TOTAL, STRIKE: STRIKE, NEXT: NEXT, RESERVE: RESERVE, perMonth: perMonth, savings: savings, monthSave: monthSave, every: every, offer: offer, clock: clock, tokens: tokens, fill: fill };
  root.ChimeU10Checkout = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  if (read(KEY.done) !== 'true') { location.replace('../consultation/'); return; }
  var answers = {}; try { answers = JSON.parse(read(KEY.data) || '{}') || {}; } catch (e) {}
  var med = 'tirz', plan = 3, slots = [], timerSlots = [], sheet = null;
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); }

  function collect() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      if (n.nodeValue.indexOf('{{') < 0 || n.parentNode.closest('template')) continue;
      if (n.nodeValue.indexOf('{{timer}}') >= 0) timerSlots.push([n, n.nodeValue]); else slots.push([n, n.nodeValue]);
    }
  }
  function render() {
    var map = tokens(med, plan, answers);
    slots.forEach(function (s) { s[0].nodeValue = fill(s[1], map); });
    $$('article[data-med]').forEach(function (a) {
      var on = a.getAttribute('data-med') === med;
      a.classList.toggle('border-[#94620E]/20', !on); a.classList.toggle('border-[#94620E]', on);
      a.classList.toggle('ring-1', on); a.classList.toggle('ring-[#94620E]', on);
    });
    $$('li[data-plan]').forEach(function (li) {
      var on = Number(li.getAttribute('data-plan')) === plan;
      li.classList.toggle('border-[#94620E]', on); li.classList.toggle('border-[#E5E7EB]', !on);
    });
    $$('img[data-vial]').forEach(function (img) {
      img.src = '../images/vial-' + med + '.webp';
      if (img.alt) img.alt = med === 'tirz' ? 'Compounded GLP-1/GIP tirzepatide vial' : 'Compounded GLP-1 semaglutide vial';
    });
    var tabs = $('[data-bnpl-tabs]'); if (tabs) { tabs.style.display = plan === 1 ? 'none' : ''; if (plan === 1) setTab('card'); }
  }
  function setTab(t) {
    $$('button[data-tab]').forEach(function (b) { var on = b.getAttribute('data-tab') === t; b.classList.toggle('bg-white', on); b.classList.toggle('bg-transparent', !on); });
    var c = $('[data-pe-card]'), p = $('[data-pe-bnpl]'), addr = $('[data-pe="address"]');
    if (c) c.hidden = t !== 'card'; if (p) p.hidden = t !== 'bnpl';
  }
  function tick(end) {
    var t = clock(Math.ceil((end - Date.now()) / 1000));
    timerSlots.forEach(function (s) { var v = s[1].replace('{{timer}}', t); if (s[0].nodeValue !== v) s[0].nodeValue = v; });
  }
  function closeSheet() { if (sheet && sheet.parentNode) sheet.parentNode.removeChild(sheet); sheet = null; document.documentElement.style.overflow = ''; }
  function openSheet() {
    var o = offer(med, plan); if (!o) return;
    var tpl = document.getElementById('tpl-offer');
    var holder = document.createElement('div'); holder.innerHTML = fill(tpl.innerHTML, { dmo: o.dmo, curpm: o.curpm, nextpm: o.nextpm, nextMonths: o.nextMonths, nextLabel: o.nextLabel });
    sheet = holder.firstElementChild; document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b && b.getAttribute('data-testid') === 'plan-ladder-confirm') { plan = o.next; render(); closeSheet(); }
      else if (b && /plan-ladder-(decline|close)/.test(b.getAttribute('data-testid') || '')) closeSheet();
      else if (e.target === sheet) closeSheet();
    });
    var dlg = sheet.querySelector('[role="dialog"]'); if (dlg) dlg.focus({ preventScroll: true });
  }
  function pickPlan(p) {
    plan = p; render();
    scrollToEl(document.getElementById('payment'));
    if (NEXT[p]) setTimeout(openSheet, reduced() ? 0 : 650);
  }

  function mount() {
    collect(); render(); setTab('card');
    var end = Date.now() + RESERVE * 1000; tick(end); setInterval(function () { tick(end); }, 1000);
    var nm = $('[data-pe-name]'); if (nm) nm.value = [answers.firstName, answers.lastName].filter(Boolean).join(' ');
    var ph = $('[data-pe-phone]'); if (ph && answers.phone) ph.value = answers.phone;
    // Stripe's address element starts collapsed (name, address, phone) and opens the other fields on first input
    var a1 = $('#pe-a1'); if (a1) a1.addEventListener('input', function () { $$('[data-pe-more]').forEach(function (f) { f.hidden = false; }); });
    var st = $('[data-pe-state]'); if (st && answers.shippingState) { st.value = answers.shippingState; st.classList.toggle('has', !!st.value); }
    if (st) st.addEventListener('change', function () { st.classList.toggle('has', !!st.value); });
    document.addEventListener('click', function (e) {
      var art = e.target.closest('article[data-med]');
      if (art) { med = art.getAttribute('data-med'); render(); if (e.target.closest('button')) scrollToEl(document.getElementById('plan-ladder')); return; }
      var li = e.target.closest('li[data-plan]');
      if (li) { pickPlan(Number(li.getAttribute('data-plan'))); return; }
      var tb = e.target.closest('button[data-tab]'); if (tb) { setTab(tb.getAttribute('data-tab')); return; }
      var cont = e.target.closest('button[data-continue]'); if (cont && !cont.disabled) { location.href = '../welcome/'; return; }
      var back = e.target.closest('button[data-goback]'); if (back) { location.href = '../consultation/'; return; }
      var b = e.target.closest('button');
      if (b && /^\s*CHECKOUT/.test(b.textContent)) scrollToEl(document.getElementById('payment'));
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet) closeSheet(); });
    var consent = $('[data-consent]'), cont = $('[data-continue]');
    if (consent && cont) consent.addEventListener('change', function () { cont.disabled = !consent.checked; });
    // card fields: digits only + Stripe-like spacing (look-alike only)
    var cc = $('[data-pe-cc]'); if (cc) cc.addEventListener('input', function () { cc.value = cc.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); });
    var ex = $('[data-pe-exp]'); if (ex) ex.addEventListener('input', function () { var d = ex.value.replace(/\D/g, '').slice(0, 4); ex.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})(typeof window !== 'undefined' ? window : this);
