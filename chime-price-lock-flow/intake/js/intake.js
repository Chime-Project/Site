/* Chime Health — price-lock intake (clone of TrimRx's start.trimrx.com/intake/glp1/<step>).
   Replaces their Rails form posts: validates each step the way theirs does, keeps the answers in sessionStorage
   (this browser only — nothing is sent anywhere), fills the personalised lines and routes the branches. */
(function (root) {
  'use strict';

  var MAIN = ['height_weight', 'weight_goal', 'gender_age', 'pregnancy', 'unique_effects', 'priorities', 'magic',
    'testimonial_1', 'how', 'why', 'speed', 'speed_good', 'sleep', 'sleep_hours', 'testimonial_2', 'health_conditions',
    'more_health_conditions', 'weight_loss_medications', 'pain_medications', 'weight_loss_surgeries',
    'weight_loss_programs', 'diet_exercise_willingness', 'recent_weight_changes', 'testimonial_3', 'blood_pressure',
    'resting_heart_rate', 'medication_match', 'current_medications', 'motivated', 'additional_information',
    'interests', 'dob', 'medical_review', 'contact'];
  var DONE = '../selection/';

  // Their routing, as walked 2026-10-08.
  function next(slug, a) {
    switch (slug) {
      case 'gender_age': return a.gender === 'female' ? 'pregnancy' : 'unique_effects';
      case 'speed': return a.speed === 'I want it faster' ? 'speed_faster' : a.speed === "That's too fast" ? 'speed_too_fast' : 'speed_good';
      case 'speed_faster': case 'speed_too_fast': return 'sleep';
      case 'weight_loss_medications':
        return a.weight_loss_medications === 'Semaglutide' ? 'semaglutide' : a.weight_loss_medications === 'Tirzepatide' ? 'tirzepatide' : 'pain_medications';
      case 'semaglutide': case 'tirzepatide': return 'pain_medications';
      case 'contact': return null;
    }
    var i = MAIN.indexOf(slug);
    return i >= 0 && i < MAIN.length - 1 ? MAIN[i + 1] : null;
  }
  function path(a) {
    var p = ['height_weight'], s = 'height_weight', guard = 0;
    while ((s = next(s, a)) && guard++ < 60) p.push(s);
    return p;
  }
  function prev(slug, a) {
    var p = path(a), i = p.indexOf(slug);
    return i > 0 ? p[i - 1] : null;
  }
  function file(slug) { return slug === 'height_weight' ? 'index.html' : slug + '.html'; }

  var r2 = function (x) { return Math.round(x * 100) / 100; };
  var f2 = function (x) { return Math.floor(x * 100) / 100; };
  var num = function (x) { return String(Number(x.toFixed(2))); };
  // their figures are Ruby floats rounded to 2 places: 3.3, 15.15, 35.5, 0.0 (a whole number keeps its ".0")
  var flt = function (x) { var t = num(x); return t.indexOf('.') < 0 ? t + '.0' : t; };

  // Personalised figures. Their formulas, measured against their pages (220 lb, 5'6", goal 170):
  // BMI 35.51 · 3.3–3.67 lb/week = weight × 1.5 % … weight ÷ 60 · 15.15 weeks = loss ÷ low rate ·
  // 12.99 weeks ("faster") = loss ÷ (weight × 1.75 %) · review 13.63 weeks = loss ÷ high rate, truncated ·
  // the "Perfect! With a BMI of …" line shows from BMI 26 (25.98 hid it, 26.14 showed it).
  function figures(a) {
    var w = Number(a.weight), ft = Number(a.height_feet), inch = Number(a.height_inches || 0), g = Number(a.weight_goal);
    var out = {};
    if (a.gender) out.sexPlural = a.gender === 'male' ? 'Men' : 'Women';
    if (a.first_name) out.firstName = a.first_name;
    if (w > 0) out.weight = num(w);
    if (w > 0 && ft > 0) {
      var h = ft * 12 + inch;
      out.bmiValue = r2(703 * w / (h * h));
      out.bmi = flt(out.bmiValue);
    }
    if (g > 0) out.goal = num(g);
    if (w > 0 && g > 0) {
      var diff = Math.max(0, w - g), lo = w * 0.015, hi = w / 60;
      out.diff = num(diff);
      out.lo = flt(lo);
      out.hi = flt(hi);
      out.weeksSlow = flt(r2(diff / lo));
      out.weeksFast = flt(r2(diff / (w * 0.0175)));
      out.weeksReview = flt(f2(diff / hi));
    }
    return out;
  }

  var api = { MAIN: MAIN, next: next, path: path, prev: prev, figures: figures, DONE: DONE };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }

  var doc = root.document;
  var KEY = 'chimePriceLockIntake';
  var NOT_STORED = { email: 1, phone: 1, contact_agree: 1 };   // contact details never leave the form
  function load() { try { return JSON.parse(root.sessionStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(a) { try { root.sessionStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* private mode: still navigates */ } }
  var field = function (name) { var m = /^form\[([^\]]+)\]/.exec(name || ''); return m && m[1]; };

  var answers = load();
  var slug = doc.body.getAttribute('data-intake-step');
  var form = doc.querySelector('form[data-step]');

  // back button: the previous step on this visitor's own path
  var back = doc.querySelector('[data-back]');
  if (back) { var p = prev(slug, answers); if (p) back.setAttribute('href', file(p)); }

  // personalised lines
  var v = figures(answers);
  doc.querySelectorAll('[data-v]').forEach(function (el) {
    var k = el.getAttribute('data-v');
    if (v[k] !== undefined) el.textContent = v[k];
  });
  doc.querySelectorAll('[data-if-bmi-ok]').forEach(function (el) {
    el.style.display = v.bmiValue !== undefined && v.bmiValue >= 26 ? '' : 'none';
  });

  if (form) {
    // restore earlier answers (for Go back)
    Array.prototype.forEach.call(form.elements, function (el) {
      var k = field(el.name); if (!k || NOT_STORED[k] || !(k in answers)) return;
      var val = answers[k];
      if (el.type === 'radio') el.checked = el.value === val;
      else if (el.type === 'checkbox') el.checked = Array.isArray(val) && val.indexOf(el.value) >= 0;
      else el.value = val;
    });

    // phone mask "(999) 999-9999", as theirs
    var phone = form.querySelector('input[type="tel"]');
    if (phone) phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10);
      phone.value = d.length > 6 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6)
        : d.length > 3 ? '(' + d.slice(0, 3) + ') ' + d.slice(3) : d.length ? '(' + d : '';
      phone.setCustomValidity('');
    });
    form.addEventListener('change', function (e) { if (e.target.setCustomValidity) e.target.setCustomValidity(''); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // checkbox lists: at least one option (their choice-list-validity, same message)
      var groups = {};
      form.querySelectorAll('input[type="checkbox"][data-choice-list-validity-target="option"]').forEach(function (c) {
        (groups[c.name] = groups[c.name] || []).push(c);
      });
      Object.keys(groups).forEach(function (n) {
        var g = groups[n], any = g.some(function (c) { return c.checked; });
        var msg = (g[0].closest('[data-choice-list-validity-message-value]') || g[0]).getAttribute('data-choice-list-validity-message-value') || 'Please select at least one option';
        g[0].setCustomValidity(any ? '' : msg);
      });
      if (phone) phone.setCustomValidity(phone.value.replace(/\D/g, '').length === 10 ? '' : (phone.getAttribute('data-phone-validity-message-value') || 'Enter a valid phone number'));
      var email = form.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value)) email.setCustomValidity(email.getAttribute('data-email-validity-message-value') || 'Enter a valid email address');
      var agree = form.querySelector('input[name="form[contact_agree]"]');
      if (agree) agree.setCustomValidity(agree.checked ? '' : (agree.getAttribute('data-acceptance-validity-message-value') || 'Please confirm before continuing'));
      if (!form.reportValidity()) return;

      var seen = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        var k = field(el.name); if (!k || NOT_STORED[k] || el.type === 'submit') return;
        if (el.type === 'checkbox') { if (!seen[k]) { answers[k] = []; seen[k] = 1; } if (el.checked) answers[k].push(el.value); }
        else if (el.type === 'radio') { if (el.checked) answers[k] = el.value; }
        else answers[k] = el.value;
      });
      save(answers);
      var n = next(slug, answers);
      root.location.href = n ? file(n) : DONE;
    });
  }

  /* language dialog (same component as the plan selection page) */
  var lang = doc.querySelector('[data-lang]');
  if (lang) {
    var dialog = lang.querySelector('[data-lang-dialog]');
    var panel = lang.querySelector('[data-lang-panel]');
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
