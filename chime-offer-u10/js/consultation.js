/* Chime Health u10 consultation quiz: the engine. The screens are the reference app's own markup
   (js/consultation-screens.js) and the rules are its own config (js/consultation-config.js); this file does what their
   Vue page does, as read from their bundle (consultation chunk) and observed on the live quiz (2026-10-06):
     - screens = config steps whose renderCondition passes; questions inside a screen show / hide by their own
       renderCondition; answers autosave to localStorage and the quiz resumes at the first unfinished screen.
     - a screen whose only question is single-choice advances by itself ~150 ms after the pick; so does a multi-choice
       screen when a "None..." answer is picked ("None" clears the others, any other pick clears "None").
     - Next is enabled when every shown required question has an answer that passes its validators; a field that has a
       value and fails a validator shows the validator's message under it (red border).
     - dynamic copy: "{Women|Men} experience...", "{First}, how should we reach you?", the timeline (1-2 lb/week, goal in
       weight - goal weeks), the live BMI line, the "Your Medical Review" summary.
     - Finish: medical DQ answers -> "Please Review Your Answers" (answers editable; Continue goes on, Back to Quiz
       returns); then Louisiana -> not-eligible (state_louisiana), BMI < 20 -> not-eligible (bmi_too_low), DQ answers
       -> "Thank You for Your Honesty" + lockout flag (persists across reloads), else -> ../checkout/.
   Nothing is sent anywhere. Pure helpers are exported for js/consultation-tests.js. */
(function (root) {
  'use strict';
  var CFG = root.ChimeU10QuizConfig || (typeof require !== 'undefined' ? require('./consultation-config.js') : null);
  var KEY = { data: 'chime_u10_quiz_data', step: 'chime_u10_quiz_step', done: 'chime_u10_quiz_completed', dq: 'chime_u10_disqualified' };

  function isEmpty(v) { return v == null || v === '' || (Array.isArray(v) && v.length === 0); }
  function defaults() {
    var a = {};
    CFG.steps.forEach(function (s) {
      s.questions.forEach(function (q) {
        if (q.type === 'CHECKBOX' && q.startValue === true && q.options && q.options.length) a[q.id] = q.options[0];
        else a[q.id] = q.type === 'MULTISELECT' ? [] : null;
      });
    });
    return a;
  }
  function visibleSteps(a) { return CFG.steps.filter(function (s) { return s.renderCondition ? s.renderCondition(a) : true; }); }
  function visibleQuestions(step, a) { return step.questions.filter(function (q) { return q.renderCondition ? q.renderCondition(a) : true; }); }
  function bmi(a) {
    var h = Number(a.feet) * 12 + Number(a.inches), w = Number(a.weight);
    if (!h || !w) return NaN;
    return w * 703 / (h * h);
  }
  function bmiText(a) {
    if (a.feet == null || a.inches == null || a.weight == null || a.weight === '') return '';
    var b = bmi(a); return isFinite(b) ? b.toFixed(1) : '';
  }
  function weeksToGoal(a) {
    var w = Number(a.weight), g = Number(a.goalWeight);
    if (!w || !g || w <= 0 || g <= 0) return 0;
    var d = w - g; return d <= 0 ? 0 : Math.round(d / CFG.WEEKLY_LOSS_LOWER);
  }
  function interp(t, a) {
    if (!t) return t;
    var g = a.gender === 'Female' ? 'Women' : a.gender === 'Male' ? 'Men' : '';
    return t.replace(/\{\{weeklyWeightLossLower\}\}/g, a.weight ? String(CFG.WEEKLY_LOSS_LOWER) : '0')
      .replace(/\{\{weeklyWeightLossUpper\}\}/g, a.weight ? String(CFG.WEEKLY_LOSS_UPPER) : '0')
      .replace(/\{\{weeksToGoalWeight\}\}/g, String(weeksToGoal(a)))
      .replace(/\{\{firstName\}\}/g, a.firstName || '').replace(/\{\{genderGroup\}\}/g, g);
  }
  function heading(step, a) {
    var d = step.dynamicHeading1;
    if (d) {
      var keys = (d.match(/\{\{(\w+)\}\}/g) || []);
      if (keys.every(function (k) { return interp(k, a).trim() !== ''; })) return interp(d, a);
    }
    return interp(step.heading, a);
  }
  function subtext(step, a) { return step.dynamicSubtext ? interp(step.dynamicSubtext, a) : step.subtext; }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  function maskPhone(v) {
    var d = digits(v); if (d.length === 11 && d[0] === '1') d = d.slice(1); d = d.slice(0, 10);
    if (d.length === 0) return '';
    if (d.length < 4) return '(' + d;
    if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }
  /* their validator runner: the first failing rule's message, or '' */
  function validate(q, v, a) {
    var rules = q.validation || [];
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i], ok = true;
      if (r.type === 'custom') ok = r.validator(v, a);
      else if (r.type === 'required') ok = !isEmpty(v);
      else if (isEmpty(v)) ok = true;
      else if (r.type === 'minLength') ok = String(v).length >= r.value;
      else if (r.type === 'maxLength') ok = String(v).length <= r.value;
      else if (r.type === 'pattern') ok = new RegExp(r.value).test(String(v));
      else if (r.type === 'email') ok = EMAIL_RE.test(String(v));
      else if (r.type === 'phone') ok = digits(v).length === 10 || (digits(v).length === 11 && digits(v)[0] === '1');
      if (!ok) return r.message || 'Invalid value';
    }
    return '';
  }
  function questionOk(q, a) {
    if (!q.required) return true;
    var v = a[q.id];
    if (isEmpty(v)) return false;
    return validate(q, v, a) === '';
  }
  function stepComplete(step, a) { return visibleQuestions(step, a).every(function (q) { return questionOk(q, a); }); }
  function startIndex(a) {
    var vs = visibleSteps(a);
    for (var i = 0; i < vs.length; i++) if (!stepComplete(vs[i], a)) return i;
    return vs.length - 1;
  }
  function autoAdvances(step, a) {
    if (step.questions.length !== 1) return false;
    var q = step.questions[0], v = a[q.id];
    if (q.type === 'SINGLESELECT') return !isEmpty(v);
    if (q.type === 'MULTISELECT') return Array.isArray(v) && v.some(function (o) { return /^None/.test(o); });
    return false;
  }
  function toggleMulti(cur, opt, on) {
    cur = (cur || []).slice();
    var none = /^None/.test(opt);
    if (on) {
      if (none) cur = [opt];
      else { cur = cur.filter(function (o) { return !/^None/.test(o); }); if (cur.indexOf(opt) < 0) cur.push(opt); }
    } else cur = cur.filter(function (o) { return o !== opt; });
    return cur;
  }
  /* their It(): the DQ answers per field */
  function concerns(a) {
    var out = [];
    Object.keys(CFG.DQ_RULES).forEach(function (f) {
      var v = a[f], bad = CFG.DQ_RULES[f];
      if (!v) return;
      var sel = (Array.isArray(v) ? v : [v]).filter(function (o) { return typeof o === 'string' && bad.indexOf(o) >= 0; });
      if (sel.length) out.push({ fieldName: f, disqualifyingSelections: sel });
    });
    return out;
  }
  /* where Finish goes (after the review screen, when there was one) */
  function finishRoute(a) {
    if (CFG.isLouisiana(a.shippingState)) return { go: '../not-eligible/?reason=state_louisiana' };
    var h = Number(a.feet || 0) * 12 + Number(a.inches || 0), w = Number(a.weight || 0);
    if (h > 0 && w > 0) { var b = w * 703 / (h * h); if (isFinite(b) && b < 20) return { go: '../not-eligible/?reason=bmi_too_low' }; }
    if (concerns(a).length) return { lockout: true };
    return { go: '../checkout/' };
  }
  function progressIndex(stepId) {
    var m = CFG.quiz.stepProgressMapping.filter(function (x) { return x.stepId === stepId; })[0];
    if (!m) return 0;
    for (var i = 0; i < CFG.quiz.progressSteps.length; i++) if (CFG.quiz.progressSteps[i].id === m.progressStepId) return i;
    return 0;
  }

  var api = { KEY: KEY, defaults: defaults, visibleSteps: visibleSteps, visibleQuestions: visibleQuestions, bmi: bmi, bmiText: bmiText,
              weeksToGoal: weeksToGoal, interp: interp, heading: heading, subtext: subtext, validate: validate, questionOk: questionOk,
              stepComplete: stepComplete, startIndex: startIndex, autoAdvances: autoAdvances, toggleMulti: toggleMulti, concerns: concerns,
              finishRoute: finishRoute, maskPhone: maskPhone, progressIndex: progressIndex };
  root.ChimeU10Quiz = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  /* ------------------------------------------------------------------ page ------------------------------------------ */
  var S = root.ChimeU10Screens;
  var main, answers, index = 0, mode = 'step', timer = 0;
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save() { store(KEY.data, JSON.stringify(answers)); store(KEY.step, String(index)); }
  function load() {
    var a = defaults(), raw = read(KEY.data);
    if (raw) { try { var o = JSON.parse(raw); Object.keys(o).forEach(function (k) { if (k in a) a[k] = o[k]; }); } catch (e) {} }
    return a;
  }
  function frag(htmlStr) { var t = document.createElement('template'); t.innerHTML = htmlStr; return t.content; }
  function stepDef(id) { return CFG.steps.filter(function (s) { return s.id === id; })[0]; }
  function qDef(id) { var r = null; CFG.steps.forEach(function (s) { s.questions.forEach(function (q) { if (q.id === id) r = { q: q, step: s }; }); }); return r; }
  function scrollTop(behavior) { try { window.scrollTo({ top: 0, behavior: behavior || 'smooth' }); } catch (e) { window.scrollTo(0, 0); } }
  var backM;

  function renderProgress(ol, cur) {
    var P = S._progress, out = '';
    CFG.quiz.progressSteps.forEach(function (p, i) {
      var li = i < cur ? P.done : i === cur ? P.current : P.todo;
      li = li.replace(/(<span class="whitespace-nowrap[^"]*">)[^<]*(<\/span>)/, '$1' + p.name + '$2');
      if (i === CFG.quiz.progressSteps.length - 1) {
        li = li.replace('<li class="grow flex', '<li class="flex').replace(/<span class="ml-1 h-px grow[^"]*" aria-hidden="true"><\/span>/, '');
      }
      out += li;
    });
    ol.innerHTML = out;
  }

  function nextButton(btn, enabled) {
    var base = btn.getAttribute('data-base');
    if (!base) {
      base = btn.className.replace(/\s*(bg-gray-300|text-gray-500|cursor-not-allowed|bg-quiz-gold|hover:bg-quiz-gold-hover|active:bg-quiz-gold-hover|text-white)\b/g, '').trim();
      btn.setAttribute('data-base', base);
      btn.setAttribute('data-finish', /Finish/.test(btn.textContent) ? '1' : '0');
    }
    var finish = btn.getAttribute('data-finish') === '1';
    btn.disabled = !enabled;
    if (enabled) btn.className = base + ' bg-quiz-gold hover:bg-quiz-gold-hover active:bg-quiz-gold-hover text-white';
    else btn.className = finish ? base + ' bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed ' + base;
  }

  function applyValues(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('input[type=radio]'), function (el) {
      el.checked = answers[el.name] === el.value;
      var lab = el.closest('.yes-no-button'); if (lab) lab.classList.toggle('selected', el.checked);
    });
    Array.prototype.forEach.call(scope.querySelectorAll('input[type=checkbox]'), function (el) {
      var v = answers[el.name];
      el.checked = Array.isArray(v) ? v.indexOf(el.value) >= 0 : !!v;
    });
    Array.prototype.forEach.call(scope.querySelectorAll('select[id], input[id]:not([type=radio]):not([type=checkbox]), textarea[id]'), function (el) {
      var v = answers[el.id]; var s = v == null ? '' : String(v);
      if (el.value !== s) el.value = s;
    });
  }

  function errorsAndState() {
    var vs = visibleSteps(answers), step = vs[index];
    if (!step || mode !== 'step') return;
    // conditional questions
    step.questions.forEach(function (q) {
      var w = main.querySelector('[data-q="' + q.id + '"]');
      if (w) w.style.display = (q.renderCondition && !q.renderCondition(answers)) ? 'none' : '';
    });
    // errors
    visibleQuestions(step, answers).forEach(function (q) {
      var el = document.getElementById(q.id);
      if (!el || el.tagName === 'LABEL') return;
      var v = answers[q.id], msg = isEmpty(v) ? '' : validate(q, v, answers);
      var errId = q.id + '-error', old = document.getElementById(errId);
      if (msg) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.classList.add('border-red-500', 'focus:ring-red-500'); el.setAttribute('aria-invalid', 'true'); }
        var holder = el.parentNode;                       // <div class="relative">
        if (!old) {
          old = document.createElement('div'); old.id = errId; old.className = 'font-quizSans text-red-500 text-sm mt-1';
          var dv = holder.attributes[0] && /^data-v-/.test(holder.attributes[0].name) ? holder.attributes[0].name : null;
          Array.prototype.forEach.call(holder.attributes, function (at) { if (/^data-v-/.test(at.name)) dv = at.name; });
          if (dv) old.setAttribute(dv, '');
          holder.parentNode.insertBefore(old, holder.nextSibling);
        }
        old.textContent = msg;
      } else {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.classList.remove('border-red-500', 'focus:ring-red-500'); el.setAttribute('aria-invalid', 'false'); }
        if (old) old.parentNode.removeChild(old);
      }
    });
    // dynamic copy
    var h = main.querySelector('[data-heading]'); if (h) h.textContent = heading(step, answers);
    var st = main.querySelector('[data-subtext]'); var sub = subtext(step, answers); if (st && sub) st.textContent = sub;
    var bm = main.querySelector('[data-bmi]');
    if (bm) { var t = bmiText(answers); bm.style.display = t ? '' : 'none'; bm.firstElementChild.textContent = 'BMI: ' + t; }
    var sm = main.querySelector('[data-summary] .flex.flex-col');
    if (sm) {
      var rows = sm.children;
      rows[0].lastChild.textContent = ' ' + bmiText(answers);
      rows[1].lastChild.textContent = ' ' + (answers.weight == null ? '' : answers.weight) + ' lbs ';
      rows[2].lastChild.textContent = ' ' + (answers.goalWeight == null ? '' : answers.goalWeight) + ' lbs within ' + weeksToGoal(answers) + ' weeks';
    }
    var btn = main.querySelector('[data-next]'); if (btn) nextButton(btn, stepComplete(step, answers));
  }

  function render(behavior) {
    clearTimeout(timer);
    mode = 'step';
    var vs = visibleSteps(answers);
    if (index >= vs.length) index = Math.max(0, vs.length - 1);
    var step = vs[index];
    main.innerHTML = S[step.id];
    if (backM) backM.style.display = '';
    renderProgress(main.querySelector('[data-progress]'), progressIndex(step.id));
    var db = main.querySelector('[data-back]'); if (db) db.disabled = index === 0;
    applyValues(main);
    errorsAndState();
    save();
    if (behavior !== false) scrollTop(behavior);
  }

  function onChange(e) {
    var el = e.target;
    if (!el.matches('input, select, textarea')) return;
    var name = el.name || el.id, def = qDef(name);
    if (!def) return;
    var q = def.q, prevType = answers.currentGlp1Type;
    if (el.type === 'radio') answers[name] = el.value;
    else if (el.type === 'checkbox') {
      if (q.type === 'MULTISELECT') answers[name] = toggleMulti(answers[name], el.value, el.checked);
      else answers[name] = el.checked ? q.options[0] : null;
    } else if (el.tagName === 'SELECT') {
      var v = el.value; answers[name] = v === '' ? null : (/^\d+$/.test(v) ? Number(v) : v);
    } else if (q.type === 'number') answers[name] = el.value === '' ? null : Number(el.value);
    else if (q.type === 'tel') { var m = maskPhone(el.value); if (el.value !== m) el.value = m; answers[name] = m || null; }
    else answers[name] = el.value === '' ? null : el.value;
    if (name === 'currentGlp1Type' && prevType != null && prevType !== answers.currentGlp1Type) {
      CFG.steps.forEach(function (s) { if (/^lastDoseStrength/.test(s.id) && s.questions[0].id !== 'lastDoseStrength' + String(answers.currentGlp1Type).replace(/\s/g, '')) answers[s.questions[0].id] = null; });
    }
    if (mode === 'review') { applyValues(main); paintConcerns(); save(); return; }
    if (el.type === 'radio' || el.type === 'checkbox') applyValues(main);
    errorsAndState(); save();
    var vs = visibleSteps(answers), step = vs[index];
    if ((el.type === 'radio' || el.type === 'checkbox') && autoAdvances(step, answers) && stepComplete(step, answers)) {
      clearTimeout(timer); timer = setTimeout(next, 150);
    }
  }

  function next() {
    var vs = visibleSteps(answers), step = vs[index];
    if (!stepComplete(step, answers)) return;
    if (index === vs.length - 1) { finish(false); return; }
    index++; render();
  }
  function back() { if (index > 0) { index--; render(); } }

  function finish(fromReview) {
    if (!fromReview) {
      var c = concerns(answers);
      if (c.length) { showReview(c); return; }
    }
    store(KEY.done, 'true'); save();
    var r = finishRoute(answers);
    if (r.lockout) { store(KEY.dq, 'true'); showLockout(); return; }
    location.href = r.go;
  }

  var reviewFields = [];
  function showReview(c) {
    mode = 'review'; reviewFields = c.map(function (x) { return x.fieldName; });
    main.innerHTML = S._review;
    if (backM) backM.style.display = 'none';
    var list = main.querySelector('[data-review-list]'), out = '';
    reviewFields.forEach(function (f) {
      var d = qDef(f), tpl = frag(S[d.step.id]), w = tpl.querySelector('[data-q="' + f + '"]');
      out += S._reviewBlock.replace('{{title}}', escapeHtml(interp(d.step.heading, answers))).replace('{{question}}', w ? w.innerHTML : '')
        .replace('data-concerns', 'data-concerns="' + f + '"');
    });
    list.innerHTML = out;
    applyValues(main); paintConcerns();
    scrollTop();
  }
  function paintConcerns() {
    var now = concerns(answers);
    Array.prototype.forEach.call(main.querySelectorAll('[data-concerns]'), function (ul) {
      var f = ul.getAttribute('data-concerns'), hit = now.filter(function (x) { return x.fieldName === f; })[0];
      var sel = hit ? hit.disqualifyingSelections : [];
      var dv = ''; Array.prototype.forEach.call(ul.attributes, function (at) { if (/^data-v-/.test(at.name)) dv = at.name; });
      ul.innerHTML = sel.map(function (s) { return '<li ' + dv + '="">' + escapeHtml(s) + '</li>'; }).join('');
      ul.parentNode.style.display = sel.length ? '' : 'none';
    });
  }
  function showLockout() {
    mode = 'lockout';
    main.innerHTML = S._lockout;
    if (backM) backM.style.display = 'none';
    scrollTop('auto');
  }
  function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function mount() {
    main = document.querySelector('[data-quiz]');
    backM = document.querySelector('[data-back-m]');
    answers = load();
    main.addEventListener('change', onChange);
    main.addEventListener('input', function (e) { if (e.target.matches('input:not([type=radio]):not([type=checkbox]), textarea')) onChange(e); });
    main.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-next')) { e.preventDefault(); next(); }
      else if (b.hasAttribute('data-back')) { e.preventDefault(); back(); }
      else if (b.hasAttribute('data-review-back')) { e.preventDefault(); render(); }
      else if (b.hasAttribute('data-review-continue')) { e.preventDefault(); finish(true); }
      else if (b.hasAttribute('data-home')) { e.preventDefault(); location.href = '../'; }
    });
    if (backM) backM.addEventListener('click', function () { if (index > 0) back(); else location.href = '../'; });
    if (read(KEY.dq) === 'true') { showLockout(); return; }
    var vs = visibleSteps(answers);
    index = startIndex(answers);                      // theirs: a reload opens the first unfinished screen
    if (/[?&]step=last\b/.test(location.search) && read(KEY.done) === 'true') index = vs.length - 1;
    render(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})(typeof window !== 'undefined' ? window : this);
