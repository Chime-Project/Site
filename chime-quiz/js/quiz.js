/* Chime Health quiz (chime-quiz/): the engine that runs the RemedyMeds quiz config (js/quiz-config.js) the way their
   page does, ported from their quiz runtime to vanilla JS:
   · steps shown or skipped by their when-rules, the back arrow (skipping loader screens), the progress bar and the
     header, all from their templates (Eta, rendered with the same options as theirs)
   · answers, their triggers (auto-advance, height sync, field resets), their validation rules and messages, the
     BMI / goal-weight / age checks, the loaders that move on by themselves
   · their input protocol (data-quiz-option / -input / -mask / -composite / searchable state list / checkbox toggle)
   THE ANSWERS STAY IN THIS PAGE: nothing is sent, stored or tracked, and the contact form's fields go nowhere.
   Its Continue opens Choose Your Treatment V2 (../choose-treatment/v2.html) where their quiz would go on. */
(function () {
  "use strict";

  var CFG = window.CHIME_QUIZ;
  var HAND_OFF = "../choose-treatment/v2.html";
  var root = document.getElementById("quiz-root");
  if (!CFG || !root) return;

  // ------------------------------------------------------------------ templates (Eta, their options)
  var eta = new window.eta.Eta({ cache: false, useWith: true, autoEscape: true, autoTrim: [false, "nl"] });
  function tpl(src, data) { return eta.renderString(String(src || ""), data); }

  function clsx() {
    var out = [];
    (function add(v) {
      if (!v) return;
      if (typeof v === "string" || typeof v === "number") out.push(String(v));
      else if (Array.isArray(v)) v.forEach(add);
      else if (typeof v === "object") Object.keys(v).forEach(function (k) { if (v[k]) out.push(k); });
    })(Array.prototype.slice.call(arguments));
    return out.join(" ");
  }
  function cn() { return window.twMerge(clsx.apply(null, arguments)); }
  function esc(s) {
    return s == null ? "" : String(s).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var STATE_NAMES = { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
    CT: "Connecticut", DC: "District of Columbia", DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii",
    ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
    ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
    MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
    OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
    TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin",
    WY: "Wyoming" };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
  function stateFromAddress(a) {
    if (typeof a !== "string") return null;
    try { var o = JSON.parse(a), s = o && typeof o === "object" ? o.state : undefined;
      return typeof s === "string" ? (s.trim().toUpperCase() || null) : null; } catch (e) { return null; }
  }
  function stateFromLocation(l) { return typeof l !== "string" ? null : (l.trim().toUpperCase() || null); }
  function timelineMonths(t) { return { "3_months": 3, "6_months": 6, "12_months": 12 }[t] || null; }

  // their template helpers, one for one
  var helpers = Object.freeze({
    classes: function () { return cn.apply(null, arguments); },
    equals: function (a, b) { return a === b; },
    parseBmi: function (w, h) {
      if (w == null || h == null) return null;
      var r = Number(w); if (!isFinite(r) || r <= 0) return null;
      var n = String(h).trim().replace(/[^0-9.]/g, ""); if (!n) return null;
      var p = n.split("."), ft = parseInt(p[0] || "0", 10), inch = parseInt(p[1] || "0", 10);
      if (!isFinite(ft) || !isFinite(inch) || ft <= 0 || inch < 0 || inch > 11) return null;
      var s = 12 * ft + inch; return 703 * r / (s * s);
    },
    parseGoalPercent: function (w, g) {
      if (w == null || g == null) return null;
      var r = Number(w), n = Number(g);
      if (!isFinite(r) || r <= 0 || !isFinite(n) || n <= 0) return null;
      var a = (r - n) / r * 100; return !isFinite(a) || a <= 0 ? null : Math.round(a);
    },
    calculateWeightLoss: function (w, g) {
      if (w == null || g == null) return "--";
      var r = Number(w), n = Number(g);
      return !isFinite(r) || r <= 0 || !isFinite(n) || n <= 0 ? "--" : (r - n).toFixed(0);
    },
    getRawWeight: function (a) { return a.weight != null ? a.weight : a.weight_in_lbs != null ? a.weight_in_lbs : a.weight_pounds != null ? a.weight_pounds : null; },
    getRawHeight: function (a) { return a.height != null ? a.height : a.height_feet != null ? a.height_feet : null; },
    getStateDisplay: function (addr, loc) { var r = stateFromAddress(addr) || stateFromLocation(loc); return (r && STATE_NAMES[r]) || "your area"; },
    getStateCodeFromAddress: stateFromAddress,
    getStateCodeFromLocation: stateFromLocation,
    stateNames: STATE_NAMES,
    getMonthsFromTimeline: timelineMonths,
    resolveTimelineMonths: function (t) { return timelineMonths(t) || 12; },
    formatTargetDate: function (m) { var t = new Date(), r = new Date(t.getFullYear(), t.getMonth() + m, t.getDate()); return MONTHS[r.getMonth()] + " " + r.getDate(); },
    mdBold: function (s) { return s == null ? "" : String(s).replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>'); }
  });

  // ------------------------------------------------------------------ rules (their evaluateCondition, verbatim logic)
  var UNSUPPORTED_STATES = ["LA"];
  var WHEN_FUNCTIONS = {
    showWhenLocationIsServed: function (a) {
      var t = typeof a.location === "string" ? a.location : null;
      if (t && t.trim().length > 0) return UNSUPPORTED_STATES.indexOf(t.trim().toUpperCase()) === -1;
      var s = stateFromAddress(a.address);
      return typeof s !== "string" || s.trim().length === 0 || UNSUPPORTED_STATES.indexOf(s.trim().toUpperCase()) === -1;
    }
  };
  function evalCondition(c, answers, meta) {
    if (c.field && c.operator) {
      var r = answers[c.field], op = c.operator, empty = r == null || r === "";
      if (op === "not_exists") return empty;
      if (op === "exists") return !empty;
      if (r == null) return false;
      var o = c.value, i = Number(r), l = Number(o), num = !isNaN(i) && !isNaN(l);
      switch (op) {
        case "eq": return num ? i === l : String(r) === String(o);
        case "neq": return num ? i !== l : String(r) !== String(o);
        case "gte": return num ? i >= l : String(r) >= String(o);
        case "gt": return num ? i > l : String(r) > String(o);
        case "lte": return num ? i <= l : String(r) <= String(o);
        case "lt": return num ? i < l : String(r) < String(o);
        case "contains": return String(r).indexOf(String(o)) > -1;
        case "not_contains": return String(r).indexOf(String(o)) === -1;
        default: return false;
      }
    }
    if (c.function) { var f = WHEN_FUNCTIONS[c.function]; return f ? f(answers, meta) : false; }
    return false;
  }
  function conditionsHold(conds, answers, meta) {
    var all = conds.all || [], any = conds.any || [];
    return (!all.length || all.every(function (c) { return evalCondition(c, answers, meta); })) &&
           (!any.length || any.some(function (c) { return evalCondition(c, answers, meta); }));
  }
  function rulesHold(rules, answers, meta) {
    if (!rules || !rules.length) return true;
    return rules.some(function (r) { return conditionsHold(r.conditions || {}, answers, meta); });
  }

  // ------------------------------------------------------------------ validation (their validators and messages)
  var MICRO_DOSE_FLOOR = 20, BMI_FLOOR = 22;
  function num(v) { if (v === "" || v == null) return undefined; var n = Number(v); return isNaN(n) ? undefined : n; }
  function heightInches(a) {
    var f = num(a.height_feet), i = num(a.height_inches);
    if (f !== undefined && i !== undefined) { var t = 12 * f + i; return t > 0 ? t : undefined; }
    var s = String(a.height == null ? "" : a.height); if (!s || s === "0") return undefined;
    var p = s.split("."), n = Number(p[0]), m = Number(p[1] || 0);
    if (isNaN(n) || isNaN(m)) return undefined; var x = 12 * n + m; return x > 0 ? x : undefined;
  }
  function bmiFromInches(w, h) { return Math.round(703 * w / (h * h) * 10) / 10; }
  function parseDob(v) {
    if (typeof v !== "string" || !v) return undefined;
    var d = new Date(v); return isNaN(d.getTime()) ? undefined : d;
  }
  function yearsSince(d) { // dayjs().diff(d, "year")
    var now = new Date(), y = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) y--;
    return y;
  }
  function rangeCheck(min, max, unit, field) {
    return function (v) {
      var l = typeof v === "string" ? v : String(v == null ? "" : v), s = parseFloat(l);
      if (isNaN(s)) return l === "unknown" ? undefined : 'Please enter a valid numeric value or select "I\'m not sure".';
      if (s < min) return field + " must be at least " + min + unit + ".";
      if (s > max) return field + " cannot exceed " + max + unit + ".";
    };
  }
  var CUSTOM = {
    validateBmi: function (v, ctx) {
      var a = ctx.answers, h = heightInches(a), w = num(a[(ctx.args && ctx.args.weightKey) || "weight"]);
      if (h && w !== undefined && !(bmiFromInches(w, h) >= (ctx.metadata && ctx.metadata.isMicrodoseEnabled ? MICRO_DOSE_FLOOR : BMI_FLOOR)))
        return (ctx.args && ctx.args.message) || "Your BMI is too low.";
    },
    validateAdultAge: function (v) { var d = parseDob(v); if (!(d !== undefined && yearsSince(d) >= 18)) return "Must be 18 years or older to continue."; },
    validateDate: function (v) {
      if (!(typeof v === "string" && /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2} \d{4}$/.test(v) && parseDob(v)))
        return "Please enter a valid date.";
    },
    validateYear: function (v) { var d = parseDob(v); if (!((d !== undefined ? yearsSince(d) : Infinity) < 78)) return "You must be under 78 years old."; },
    validateFastingGlucose: rangeCheck(70, 400, "mg/dL", "Fasting glucose"),
    validateHbA1c: rangeCheck(4, 20, "%", "HbA1c"),
    validateGoalWeightLessThanCurrentWeight: function (v, ctx) {
      var a = num(ctx.answers[(ctx.args && ctx.args.compareKey) || "weight"]), o = num(v);
      if (o !== undefined && a !== undefined && !(o < a)) return "Goal weight must be less than your current weight.";
    },
    validateGoalWeightHealthyBmi: function (v, ctx) {
      var h = heightInches(ctx.answers), w = num(v) !== undefined ? num(v) : num(ctx.answers.goal_weight);
      if (h !== undefined && w !== undefined && !(bmiFromInches(w, h) >= 18.5)) return "Goal weight must result in a healthy BMI of at least 18.5";
    }
  };
  var EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  var US_MOBILE = /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/;
  function runRule(rule, v) {
    var p = rule.params || {};
    switch (rule.type) {
      case "required": if (v === false || v == null || v === "" || (Array.isArray(v) && !v.length)) return rule.message; break;
      case "email": if (typeof v !== "string" || !EMAIL.test(v)) return rule.message; break;
      case "phone": if (typeof v !== "string" || !US_MOBILE.test(v)) return rule.message; break;
      case "regex": if (typeof v !== "string" || !new RegExp(p.pattern).test(v)) return rule.message; break;
      case "min_value": if (isNaN(Number(v)) || Number(v) < p.value) return rule.message; break;
      case "max_value": if (isNaN(Number(v)) || Number(v) > p.value) return rule.message; break;
      case "is_in": if (!Array.isArray(p.values) || p.values.indexOf(String(v)) === -1) return rule.message; break;
      case "date": if (typeof v !== "string" || isNaN(Date.parse(v))) return rule.message; break;
      case "custom": {
        var f = CUSTOM[p.function];
        if (!f) return "Validation error";
        var r = f(v, { locale: "en", answers: S.answers, metadata: S.metadata, args: p.args });
        if (r) return r;
      }
    }
  }
  function validateValue(val, v) {
    if (!val) return;
    var i, e;
    if (val.all) for (i = 0; i < val.all.length; i++) { e = runRule(val.all[i], v); if (e) return e; }
    if (val.any && val.any.length) {
      var first;
      for (i = 0; i < val.any.length; i++) { e = runRule(val.any[i], v); if (!e) return; first = first || e; }
      return first;
    }
  }

  // ------------------------------------------------------------------ the steps
  var STEPS = CFG.steps.map(function (s) {
    var rules = (CFG.when_rules || []).filter(function (r) { return r.step_name === s.name; });
    var m = s.metadata || {};
    return {
      name: s.name, text: s.text || "", description: s.description || "", raw: s,
      when: rules.length ? function (a, meta) { return rules.some(function (r) { return conditionsHold(r.conditions || {}, a, meta); }); } : null,
      sections: (s.sections || []).map(mapSection),
      template: s.sections_template && s.sections_template.type === "template" ? s.sections_template : null,
      backdrop: s.backdrop || null,
      autoNextStep: !!m.auto_next_step, delay: typeof m.delay === "number" ? m.delay : undefined,
      skipOnBack: !!m.skip_on_back, final: !!m.final, label: m.next_step_label,
      nextClass: m.next_step_class, nextScope: m.next_step_class_scope_id,
      showProgressBar: m.show_progress_bar == null ? true : m.show_progress_bar,
      showBackButton: m.show_back_button == null ? true : m.show_back_button,
      bodyClass: m.body_class || "", theme: m.quiz_theme || "quiz-blank"
    };
  });
  function mapSection(sec) {
    var id = sec.id || sec.question_key;
    var when = sec.when_rules && sec.when_rules.length ? sec.when_rules : null;
    if (sec.children) return { kind: "content", id: id, when: when, children: sec.children };
    var meta = sec.metadata || {}, opts = sec.options && sec.options.length ? sec.options : undefined;
    return {
      kind: "question", id: id, when: when, key: sec.question_key || "", type: sec.question_type || "text",
      options: opts, label: sec.label, placeholder: sec.placeholder, required: sec.required,
      description: (sec.description || "").trim() || undefined, validation: sec.validation,
      renderer: meta.input_renderer || null,
      lookup: (function () { var m = {}; (opts || []).forEach(function (o) { m[String(o.value)] = o.value; }); return m; })()
    };
  }
  function sectionVisible(sec) { return !sec.when || rulesHold(sec.when, S.answers, S.metadata); }

  // ------------------------------------------------------------------ state
  // their default answers: every question key starts as "" ([] for multi-checkbox); resets go back to these
  var DEFAULTS = {};
  STEPS.forEach(function (st) { st.sections.forEach(function (sec) {
    if (sec.kind === "question") DEFAULTS[sec.key] = sec.type === "multi-checkbox" ? [] : "";
  }); });
  function defaults() { var o = {}; Object.keys(DEFAULTS).forEach(function (k) { o[k] = Array.isArray(DEFAULTS[k]) ? [] : DEFAULTS[k]; }); return o; }
  var S = { answers: defaults(), errors: {}, metadata: CFG.metadata || {}, step: 0, visible: [], visited: [], timer: null };
  function calcVisible() {
    var cur = S.visible[S.step] && S.visible[S.step].name;
    S.visible = STEPS.filter(function (s) { return !s.when || s.when(S.answers, S.metadata); });
    if (cur) { var i = S.visible.map(function (s) { return s.name; }).indexOf(cur); if (i > -1) S.step = i; }
  }
  function current() { return S.visible[S.step]; }
  function eq(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every(function (x, i) { return eq(x, b[i]); });
    return false;
  }

  // their triggers: SET / RESET field actions, height sync, auto-advance on a field value
  var pendingNext = false;
  function runTriggers(event, changedKeys) {
    var step = current(), patch = {};
    (CFG.triggers || []).forEach(function (t) {
      if (t.event !== event) return;
      var steps = t.options && t.options.steps;
      if (steps && steps.length && steps.indexOf(step.name) === -1) return;
      if (t.conditions && !conditionsHold(t.conditions, S.answers, S.metadata)) return;
      (t.actions || []).forEach(function (a) {
        if (a.type === "SET_FIELD_VALUE") S.answers[a.field] = a.value;
        if (a.type === "RESET_FIELD_VALUE") {
          S.answers[a.field] = Array.isArray(DEFAULTS[a.field]) ? [] : DEFAULTS[a.field];
          delete S.errors[a.field];
        }
      });
      (t.functions || []).forEach(function (f) {
        var name = typeof f === "string" ? f : f.name, p = (f && f.params) || {};
        if (name === "syncHeightFromParts") syncHeight(p, changedKeys);
        if (name === "autoNextWhenField") autoNextWhen(p, changedKeys);
      });
    });
    return patch;
  }
  function syncHeight(p, changed) {
    var fk = p.feetKey || "height_feet", ik = p.inchesKey || "height_inches", hk = p.heightKey || "height";
    if (changed && changed.length && !changed.some(function (k) { return k === fk || k === ik; })) return;
    var f = S.answers[fk], i = S.answers[ik];
    var s = f === "" || f == null ? undefined : Number(f), u = i === "" || i == null ? undefined : Number(i);
    delete S.errors[hk];
    if (s === undefined || u === undefined || isNaN(s) || isNaN(u)) {
      if (S.answers[hk] !== undefined && S.answers[hk] !== "") S.answers[hk] = "";
      return;
    }
    S.answers[hk] = s + "." + u; S.answers.height_inch = 12 * s + u;
  }
  function autoNextWhen(p, changed) {
    if (!p.fieldKey || (changed || []).indexOf(p.fieldKey) === -1) return;
    var r = S.answers[p.fieldKey], n = p.operand;
    var same = (function () {
      if (Array.isArray(r) || Array.isArray(n)) {
        if (!Array.isArray(r) || !Array.isArray(n) || r.length !== n.length) return false;
        var a = r.slice().sort(), b = n.slice().sort(); return a.every(function (x, i) { return x === b[i]; });
      }
      return r === n;
    })();
    if (p.operator === "eq" && !same) return;
    if (p.operator === "neq" && same) return;
    pendingNext = true;
  }

  function setAnswer(key, value) {
    if (eq(S.answers[key], value)) return;
    S.answers[key] = value;
    delete S.errors[key];
    runTriggers("VALUES_CHANGED", [key]);
    calcVisible();
    var step = current();
    var auto = step.autoNextStep && step.sections.some(function (s) { return s.kind === "question" && String(s.key) === String(key); });
    render();
    if (pendingNext || auto) { pendingNext = false; setTimeout(next, 0); }
  }
  function validateKeys(keys) {
    var step = current();
    step.sections.forEach(function (sec) {
      if (sec.kind !== "question" || keys.indexOf(sec.key) === -1 || !sectionVisible(sec)) return;
      var e = validateValue(sec.validation, S.answers[sec.key]);
      if (e) S.errors[sec.key] = e; else delete S.errors[sec.key];
    });
    render();
  }

  // ------------------------------------------------------------------ navigation
  function goTo(i) {
    clearTimeout(S.timer);
    S.step = i;
    runTriggers("STEP_ENTRY", []);
    calcVisible();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    var step = current();
    if (step.delay !== undefined) S.timer = setTimeout(next, step.delay);
  }
  function next() {
    var step = current(), keys = [];
    step.sections.forEach(function (sec) {
      if (sec.kind !== "question" || !sectionVisible(sec)) return;
      keys.push(sec.key);
      var e = validateValue(sec.validation, S.answers[sec.key]);
      if (e) S.errors[sec.key] = e; else delete S.errors[sec.key];
    });
    if (keys.some(function (k) { return S.errors[k]; })) { render(); return; }
    runTriggers("STEP_EXIT", []);
    if (S.visited.indexOf(step.name) === -1) S.visited.push(step.name);
    // Their quiz sends the contact details here and goes on to its plan screens: the clone sends nothing and opens
    // Choose Your Treatment V2 instead.
    if (step.name === "pii") { window.location.href = HAND_OFF; return; }
    if (S.step >= S.visible.length - 1) return;
    goTo(S.step + 1);
  }
  function previous() {
    var t = S.step - 1;
    while (t > 0 && S.visible[t] && S.visible[t].skipOnBack) t--;
    clearTimeout(S.timer);
    S.step = Math.max(0, t);
    calcVisible();
    render();
  }

  // ------------------------------------------------------------------ rendering
  // Islands: the parts their page renders with innerHTML (header, backdrop, content and input templates). They are
  // replaced only when their markup changes; everything around them is patched node by node, as React would.
  var islands = {}, islandSeq = 0;
  function island(tag, attrs, html) {
    var k = "i" + (islandSeq++);
    islands[k] = html;
    return "<" + tag + attrs + ' data-chime-island="' + k + '"></' + tag + ">";
  }
  function styleTag(attr, scope, css) {
    return css ? "<style " + attr + '="' + esc(scope) + '">' + css + "</style>" : "";
  }
  function stylesFor(obj, fallbackScope) {
    var scope = obj && (obj.scope_id || obj.scopeId) || fallbackScope;
    return (obj && obj.styles) || (scope && CFG.styles[scope]) || "";
  }

  var BUTTON_BASE = "whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 data-[disabled=true]:pointer-events-none inline-flex items-center justify-center gap-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled=true]:opacity-50 hover:bg-ds-action-primary-background-hover active:bg-ds-action-primary-background-active w-full";
  var ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-5 w-5" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';

  function nextButton(step, tplAttrs) {
    // their match: final (not auto, no delay) -> "complete"; not auto and no delay -> "next"; else no button
    if (step.autoNextStep || step.delay !== undefined) return null;
    var label = step.label && String(step.label).trim() ? step.label : (step.final ? "Complete" : "Next");
    tplAttrs = tplAttrs || {};
    var cls = cn("font-medium text-lg", step.nextClass);
    cls = cn(BUTTON_BASE, cls, tplAttrs["class"]);
    var disabled = tplAttrs.disabled !== undefined && tplAttrs.disabled !== "false";
    var extra = "";
    Object.keys(tplAttrs).forEach(function (k) {
      if (k === "class" || k === "disabled" || k === "style" || k === "data-quiz-next-button") return;
      extra += " " + k + '="' + esc(tplAttrs[k]) + '"';
    });
    return '<button class="' + esc(cls) + '"' + extra + (disabled ? ' disabled=""' : "") +
      ' type="submit" aria-busy="false" data-testid="quiz-step-button-' + (step.final ? "complete" : "next") + '">' +
      '<span class="relative z-10 inline-flex w-full items-center justify-center gap-2 font-medium"><span>' +
      esc(label) + "</span>" + ARROW + "</span></button>";
  }

  function inputData(sec) {
    var l = S.answers[sec.key], t = sec.type;
    var T = !sec.options && ["checkbox", "date", "height", "weight", "address", "rating", "hidden"].indexOf(t) === -1;
    var value = t === "multi-checkbox" ? (Array.isArray(l) ? l : []) : t === "date" ? (typeof l === "string" ? l : "")
      : t === "checkbox" ? !!l : T ? "" : (l == null ? null : l);
    return {
      id: sec.key, type: t, label: typeof sec.label === "string" ? sec.label : undefined,
      placeholder: typeof sec.placeholder === "string" ? sec.placeholder : undefined,
      description: sec.description, error: typeof S.errors[sec.key] === "string" ? S.errors[sec.key] : undefined,
      resetVariant: undefined, resetLabel: undefined, value: value,
      options: (sec.options || []).map(function (o, i) {
        return { index: i, value: String(o.value), rawValue: o.value, label: o.label == null ? undefined : String(o.label),
          isSelected: t === "multi-checkbox" ? Array.isArray(l) && l.some(function (x) { return x === o.value; }) : l === o.value,
          metadata: o.metadata || {} };
      }),
      templateOptions: sec.renderer.options || {}, templateMeta: sec.renderer.meta || {}, helpers: helpers,
      answers: S.answers, disabled: false
    };
  }
  function isTextLike(sec) {
    return sec.renderer && sec.renderer.engine === "template" && !sec.options &&
      ["checkbox", "date", "height", "weight", "address", "rating", "hidden"].indexOf(sec.type) === -1;
  }

  function contentData(children) {
    return { answers: S.answers, values: S.answers, metadata: S.metadata, stepIndex: S.step,
      totalSteps: S.visible.length, templateOptions: children.options || {}, templateMeta: children.meta || {},
      helpers: helpers, escapeFn: esc };
  }

  function renderSection(sec, i) {
    if (!sectionVisible(sec)) return null;
    if (sec.kind === "content") {
      var ch = sec.children, inner;
      if (ch.type === "registered") {
        inner = window.ChimeQuizComponents && window.ChimeQuizComponents.render(ch.id, ch.props || {}, S);
        if (!inner) return null;
        // their registered (React) screens render straight into the content-section wrapper
        return island("div", ' class="flex flex-col flex-1" data-chime-component="' + esc(ch.id) + '"', inner);
      } else if (ch.type === "template") {
        var markup = tpl(ch.source, contentData(ch));
        if (!markup) return null;
        var scope = ch.scope_id || sec.id;
        inner = styleTag("data-quiz-template-style", scope, stylesFor(ch, scope)) +
          island("div", ' id="' + esc(scope) + '" data-quiz-section-template="' + esc(sec.id) + '"', markup);
      } else {
        inner = island("span", "", ch.html || "");
      }
      return '<div class="flex flex-col flex-1">' + inner + "</div>";
    }
    var r = sec.renderer;
    if (r && r.engine === "template") {
      var html = tpl(r.source, inputData(sec));
      var sc = r.scope_id || sec.key;
      return styleTag("data-quiz-template-style", sc, stylesFor(r, sc)) +
        island("div", ' id="' + esc(sc) + '" data-quiz-input-template="' + esc(sec.key) + '" style=""', html);
    }
    // builtin: their hidden input inside the field wrapper (and its error line)
    var err = S.errors[sec.key], v = S.answers[sec.key];
    var input = '<span><input id="' + esc(sec.key) + '" readonly="" aria-hidden="true" type="hidden" value="' +
      esc(v == null ? "" : v) + '" name="' + esc(sec.key) + '"></span>';
    if (!err) return input;
    return "<fieldset>" + input + '<p class="text-destructive text-xs w-full text-center p-2 border rounded border-red-100/60 bg-red-50/80 mt-2' +
      (sec.type === "hidden" ? " mb-4" : "") + '">' + esc(err) + "</p></fieldset>";
  }

  function renderStepBody(step) {
    var rendered = step.sections.map(renderSection);
    var button = null, out = "";
    var nextStyle = step.nextScope ? CFG.styles[step.nextScope] : "";
    var hasButton = !step.autoNextStep && step.delay === undefined;
    if (hasButton && step.nextScope && nextStyle) out += styleTag("data-quiz-step-next-style", step.nextScope, nextStyle);
    var t = step.template, usedSlot = false;
    if (step.sections.length && t) {
      var src = String(t.source);
      var placeholders = rendered.map(function (_, i) { return '<quiz-section data-section-index="' + i + '"></quiz-section>'; });
      var byKey = {}, byId = {};
      step.sections.forEach(function (s, i) { if (s.kind === "question") byKey[s.key] = placeholders[i]; if (s.id) byId[s.id] = placeholders[i]; });
      var list = step.sections.map(function (s, i) {
        var q = s.kind === "question";
        return { id: s.id || String(i), index: i, kind: q ? "question" : "content", placeholder: placeholders[i],
          questionKey: q ? String(s.key) : undefined, questionType: q ? s.type : undefined, required: q ? s.required : undefined,
          label: q ? s.label : undefined, isVisible: rendered[i] != null && rendered[i] !== false };
      });
      var h = Object.assign({}, helpers, { section: function (k) {
        if (typeof k === "number") return placeholders[k] || "";
        return byKey[k] !== undefined ? byKey[k] : byId[k] !== undefined ? byId[k] : "";
      } });
      var uses = /\b(?:answers|values)\b/.test(src);
      var html = tpl(src, { answers: uses ? S.answers : undefined, values: uses ? S.answers : undefined,
        metadata: S.metadata, stepIndex: S.step, totalSteps: S.visible.length, sections: placeholders,
        sectionsByKey: byKey, sectionsList: list, templateOptions: t.options || {}, templateMeta: t.meta || {},
        helpers: h, escapeFn: esc, isRevisit: S.visited.indexOf(step.name) > -1 });
      // the slots: next button, its backdrop, the sections
      var box = document.createElement("div");
      box.innerHTML = html;
      Array.prototype.forEach.call(box.querySelectorAll("[data-quiz-next-backdrop]"), function (el) {
        if (!hasButton) el.parentNode.removeChild(el);
      });
      Array.prototype.forEach.call(box.querySelectorAll("[data-quiz-next-button]"), function (el) {
        if (usedSlot || !hasButton) { el.parentNode.removeChild(el); return; }
        usedSlot = true;
        var attrs = {};
        Array.prototype.forEach.call(el.attributes, function (a) { attrs[a.name] = a.value; });
        var tmp = document.createElement("div"); tmp.innerHTML = nextButton(step, attrs);
        el.parentNode.replaceChild(tmp.firstChild, el);
      });
      Array.prototype.forEach.call(box.querySelectorAll("quiz-section"), function (el) {
        var i = parseInt(el.getAttribute("data-section-index"), 10), r = rendered[i];
        if (r == null || r === false) { el.parentNode.removeChild(el); return; }
        var tmp = document.createElement("template"); tmp.innerHTML = r;
        el.parentNode.replaceChild(tmp.content, el);
      });
      var scope = t.scope_id || "step-template-" + step.name;
      out += styleTag("data-quiz-template-style", scope, stylesFor(t, scope)) +
        '<div class="flex-grow h-full flex flex-col" id="' + esc(scope) + '" data-quiz-step-template="' + esc(step.name) + '">' +
        box.innerHTML + "</div>";
    } else if (step.sections.length) {
      out += '<div class="flex-grow space-y-4">' + rendered.filter(Boolean).join("") + "</div>";
    }
    if (hasButton && !usedSlot) {
      out += '<div class="py-4 pt-8 lg:pb-8 lg:pt-16 space-y-1 md:space-y-4 sticky bottom-0"' +
        (step.nextScope ? ' id="' + esc(step.nextScope) + '"' : "") + ">" + nextButton(step, {}) + "</div>";
    }
    out += '<div class="mt-0 text-neutral-gray"></div>';
    return out;
  }

  function renderHeader(step) {
    var L = S.visible.length - 1, F = L ? Math.round(S.step / L * 100) : 0;
    var H = S.step !== 0 && step.showBackButton, q = step.showProgressBar;
    var h = CFG.header;
    var html = tpl(h.source, { answers: S.answers, values: S.answers, metadata: S.metadata, stepIndex: S.step,
      totalSteps: L, currentStepName: step.name, visibleStepNames: S.visible.map(function (s) { return s.name; }),
      completionFraction: F, showBackButton: H,
      header: { showBackButton: H, showLogo: true, showProgressBar: q, showProgressValue: false, currentStepNumber: S.step + 1,
        totalVisibleSteps: L + 1, progressPercent: F, isMetaPrimehealthUITraffic: false },
      templateOptions: h.options || {}, templateMeta: h.meta || {}, helpers: helpers, escapeFn: esc });
    var scope = h.scope_id || "header-template";
    return styleTag("data-quiz-template-style", scope, stylesFor(h, scope)) +
      island("div", ' id="' + esc(scope) + '" data-quiz-header-template="header-template"', html);
  }

  function renderBackdrop(step) {
    var b = step.backdrop;
    if (!b) return "";
    var inner = "";
    if (b.type === "rendered" && b.html) inner = island("div", "", b.html);
    if (b.type === "template" && b.source) {
      var m = tpl(b.source, { answers: S.answers, values: S.answers, metadata: S.metadata, stepIndex: S.step,
        totalSteps: S.visible.length, templateOptions: b.options || {}, templateMeta: b.meta || {}, helpers: helpers, escapeFn: esc });
      if (!m) return "";
      var scope = b.scope_id || "backdrop-" + step.name;
      inner = styleTag("data-quiz-template-style", scope, stylesFor(b, scope)) +
        island("div", ' id="' + esc(scope) + '" data-quiz-step-backdrop-template="' + esc(step.name) + '"', m);
    }
    return inner ? '<div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-50 overflow-hidden" data-testid="quiz-step-backdrop">' + inner + "</div>" : "";
  }

  function renderAll() {
    var step = current();
    islands = {}; islandSeq = 0;
    return '<div class="relative isolate">' + renderBackdrop(step) +
      '<div class="' + esc(cn("relative flex-1", step.bodyClass)) + '">' + renderHeader(step) +
      '<div class="relative h-full flex-1 min-h-0 flex flex-col"><div class="space-y-3 flex flex-col flex-1">' +
      '<h2 class="tracking-[-0.01em] font-medium text-balance font-title text-2xl"><span>' + step.text + "</span></h2>" +
      (step.description ? '<p class="text-balance">' + esc(step.description) + "</p>" : "") +
      '<form class="flex-1 flex flex-col" data-testid="quiz-step-form" novalidate="">' + renderStepBody(step) +
      "</form></div></div></div></div>";
  }

  // --- patching (a small DOM morph; islands keep their own content)
  function syncAttrs(from, to) {
    var i, a;
    for (i = from.attributes.length - 1; i >= 0; i--) {
      a = from.attributes[i];
      if (!to.hasAttribute(a.name) && a.name !== "open") from.removeAttribute(a.name);
    }
    for (i = 0; i < to.attributes.length; i++) {
      a = to.attributes[i];
      if (a.name === "data-chime-island") continue;
      if (from.getAttribute(a.name) !== a.value) from.setAttribute(a.name, a.value);
    }
  }
  function morph(from, to) {
    if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName) {
      from.parentNode.replaceChild(adopt(to), from);
      return;
    }
    if (from.nodeType === 3 || from.nodeType === 8) {
      if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
      return;
    }
    syncAttrs(from, to);
    var k = to.getAttribute && to.getAttribute("data-chime-island");
    if (k) { fillIsland(from, islands[k]); return; }
    if (from.nodeName === "STYLE") { if (from.textContent !== to.textContent) from.textContent = to.textContent; return; }
    var fc = Array.prototype.slice.call(from.childNodes), tc = Array.prototype.slice.call(to.childNodes);
    for (var i = 0; i < tc.length; i++) {
      if (i < fc.length) morph(fc[i], tc[i]);
      else from.appendChild(adopt(tc[i]));
    }
    for (var j = fc.length - 1; j >= tc.length; j--) from.removeChild(fc[j]);
  }
  function adopt(node) {
    // a new subtree: fill its islands
    if (node.nodeType === 1) {
      var list = [];
      if (node.hasAttribute("data-chime-island")) list.push(node);
      Array.prototype.push.apply(list, node.querySelectorAll("[data-chime-island]"));
      list.forEach(function (el) {
        var k = el.getAttribute("data-chime-island"); el.removeAttribute("data-chime-island");
        fillIsland(el, islands[k]);
      });
    }
    return node;
  }
  var ISLAND_HTML = typeof WeakMap === "function" ? new WeakMap() : null;
  function fillIsland(el, html) {
    if (ISLAND_HTML.get(el) === html) return;
    var focus = savedFocus(el);
    el.innerHTML = html;
    ISLAND_HTML.set(el, html);
    if (window.ChimeQuizComponents) window.ChimeQuizComponents.mount(el, S);
    restoreFocus(el, focus);
    Array.prototype.forEach.call(el.querySelectorAll('[data-quiz-scroll-into-view="true"]'), function (n) {
      requestAnimationFrame(function () { try { n.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {} });
    });
  }
  function savedFocus(el) {
    var t = document.activeElement;
    if (!t || !el.contains(t)) return null;
    var r = { id: t.id, name: t.getAttribute("name"), part: t.getAttribute("data-quiz-part") };
    try { r.start = t.selectionStart; r.end = t.selectionEnd; } catch (e) {}
    return r;
  }
  function restoreFocus(el, f) {
    if (!f) return;
    var sels = [];
    if (f.id) sels.push("#" + CSS.escape(f.id));
    if (f.name) sels.push('[name="' + CSS.escape(f.name) + '"]');
    if (f.part) sels.push('[data-quiz-part="' + CSS.escape(f.part) + '"]');
    for (var i = 0; i < sels.length; i++) {
      var n = el.querySelector(sels[i]);
      if (n && n.focus) {
        n.focus({ preventScroll: true });
        if (typeof f.start === "number") try { n.setSelectionRange(f.start, f.end == null ? f.start : f.end); } catch (e) {}
        return;
      }
    }
  }

  var lastSynced = {};
  function syncInputs() {
    Array.prototype.forEach.call(root.querySelectorAll("[data-quiz-input-template]"), function (box) {
      var key = box.getAttribute("data-quiz-input-template"), sec = sectionByKey(key);
      if (!sec) return;
      var v = S.answers[key];
      Array.prototype.forEach.call(box.querySelectorAll("[data-quiz-input]"), function (el) {
        var fresh = !el.__chimeSynced;
        if (!fresh && eq(lastSynced[key], v)) return;
        el.__chimeSynced = true;
        if (el === document.activeElement && !fresh) return;
        syncElement(el, v, sec);
      });
      lastSynced[key] = Array.isArray(v) ? v.slice() : v;
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-quiz-checkbox-toggle]"), function (t) {
      var box = t.closest("[data-quiz-input-template]"), key = box && box.getAttribute("data-quiz-input-template");
      var id = t.getAttribute("data-quiz-checkbox-id"), cb = id ? box.querySelector("#" + CSS.escape(id)) : null;
      var on = cb ? cb.checked : truthy(S.answers[key]);
      t.setAttribute("aria-checked", String(on));
      var w = t.querySelector("[data-quiz-checkbox-wrapper]"), vis = t.querySelector("[data-quiz-checkbox-visual]");
      if (w) w.setAttribute("data-checked", String(on));
      if (vis) vis.setAttribute("data-checked", String(on));
    });
  }
  function syncElement(el, v, sec) {
    var mask = MASKS[el.getAttribute("data-quiz-mask")];
    if (el.tagName === "SELECT") {
      var s = v == null ? "" : (typeof v === "string" || typeof v === "number") ? String(v) : "";
      var opts = Array.prototype.slice.call(el.options);
      if (s === "") { var blank = opts.filter(function (o) { return o.value === ""; })[0]; if (blank) blank.selected = true; else el.selectedIndex = -1; return; }
      if (el.value !== s) { if (opts.some(function (o) { return o.value === s; })) el.value = s; else el.selectedIndex = -1; }
      return;
    }
    if (el.type === "checkbox") { var on = truthy(v); if (el.checked !== on) el.checked = on; return; }
    if (el.type === "number") { var n = v === "" || v == null ? "" : String(v); if (el.value !== n) el.value = n; return; }
    var str = v == null ? "" : Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v);
    if (mask) str = mask.format(str);
    if (el.value !== str) el.value = str;
  }
  function truthy(e) {
    if (typeof e === "boolean") return e;
    if (typeof e === "number") return e !== 0 && !isNaN(e);
    if (typeof e === "string") { var t = e.trim().toLowerCase();
      if (!t || ["false", "0", "off", "no", "n", "null", "undefined"].indexOf(t) > -1) return false;
      if (["true", "1", "on", "yes", "y"].indexOf(t) > -1) return true; }
    return !!e;
  }

  function render() {
    var step = current();
    document.body.setAttribute("data-quiz-theme", step.theme);
    var box = document.createElement("div");
    box.innerHTML = renderAll();
    var to = box.firstChild, from = root.firstElementChild;
    if (!from) root.appendChild(adopt(to)); else morph(from, to);
    // islands found inside freshly adopted subtrees during morph were filled by adopt(); clear leftovers
    Array.prototype.forEach.call(root.querySelectorAll("[data-chime-island]"), function (el) { el.removeAttribute("data-chime-island"); });
    syncInputs();
  }

  function sectionByKey(key) {
    var step = current();
    for (var i = 0; i < step.sections.length; i++) if (step.sections[i].kind === "question" && step.sections[i].key === key) return step.sections[i];
    return null;
  }

  // ------------------------------------------------------------------ their input masks
  function caretEnd(e) { if (document.activeElement === e) try { var n = e.value.length; e.setSelectionRange(n, n); } catch (x) {} }
  function backspaceOverSeparators(ev, t, mask, slash) {
    if (ev.key !== "Backspace") return;
    var r = t.selectionStart || 0; if (r !== (t.selectionEnd || 0) || r <= 0) return;
    var n = t.value, a = n[r - 1];
    if (slash && a === "/") {
      ev.preventDefault(); t.value = n.slice(0, r - 1) + n.slice(r);
      try { t.setSelectionRange(r - 1, r - 1); } catch (x) {}
      t.dispatchEvent(new Event("input", { bubbles: true })); return;
    }
    if (!a || /\d/.test(a)) return;
    var o = r - 1; while (o >= 0 && /\D/.test(n.charAt(o))) o--;
    if (o < 0) { ev.preventDefault(); return; }
    ev.preventDefault(); t.value = n.slice(0, o) + n.slice(o + 1);
    try { t.setSelectionRange(o, o); } catch (x) {}
    mask.apply(t); t.dispatchEvent(new Event("input", { bubbles: true }));
  }
  var MASKS = {
    "us-phone": {
      apply: function (e) { var t = this.format(e.value); if (t !== e.value) e.value = t; caretEnd(e); },
      format: function (e) {
        var t = e.trim(), r = t.replace(/\D/g, ""), n = t.indexOf("+1") === 0 || t.indexOf("1 ") === 0, a = r;
        if (n && a.charAt(0) === "1") a = a.slice(1);
        var o = a.charAt(0) === "1" && a.length > 10 ? a.slice(1, 11) : a.slice(0, 10);
        if (!o.length) return "";
        var i = o.slice(0, 3), l = o.slice(3, 6), s = o.slice(6, 10), u = "+1 ";
        if (o.length <= 3) return u + "(" + i;
        u += "(" + i + ")"; if (l.length) { u += " " + l; if (l.length === 3) u += "-"; } if (s.length) u += s;
        return u;
      },
      handleKeydown: function (ev, t) { backspaceOverSeparators(ev, t, this, false); }
    },
    "us-date": {
      apply: function (e) { var t = this.format(e.value); if (t !== e.value) e.value = t; caretEnd(e); },
      format: function (e) {
        var t = e.replace(/[^\d/]/g, ""); if (!t.length) return "";
        function clampPad(v, max, force) { return v.length ? (v.length === 2 || force ? String(Math.min(max, Math.max(1, parseInt(v, 10)))).padStart(2, "0") : v) : ""; }
        if (t.indexOf("/") > -1) {
          var p = t.split("/"), many = p.length > 2, o = (p[0] || "").replace(/\D/g, "").slice(0, 2);
          if (!o.length) return "";
          var i = (p[1] || "").replace(/\D/g, "").slice(0, 6), l = i.slice(0, 2), s = i.slice(2, 6),
            u = (p[2] || "").replace(/\D/g, "").slice(0, 4), d = many ? u : s;
          var c = clampPad(o, 12, p.length > 1), f = clampPad(l, 31, p.length > 2), out = c + "/";
          if (!l.length) return out;
          out += f;
          if (many) return d.length ? out + "/" + d : out + "/";
          return d.length ? out + "/" + d : out;
        }
        var a = e.replace(/\D/g, "").slice(0, 8); if (!a.length) return "";
        var mo = a.slice(0, 2), da = a.slice(2, 4), yr = a.slice(4, 8);
        if (mo.length === 2) mo = String(Math.min(12, Math.max(1, parseInt(mo, 10)))).padStart(2, "0");
        if (da.length === 2) da = String(Math.min(31, Math.max(1, parseInt(da, 10)))).padStart(2, "0");
        return a.length <= 2 ? mo : a.length <= 4 ? mo + "/" + da : mo + "/" + da + "/" + yr;
      },
      handleKeydown: function (ev, t) { backspaceOverSeparators(ev, t, this, true); }
    }
  };

  // ------------------------------------------------------------------ their input protocol, delegated
  function valueOf(el) {
    if (el.tagName === "INPUT" && el.type === "checkbox") return el.checked;
    if (el.tagName === "INPUT" && el.type === "number") return el.value === "" ? "" : Number(el.value);
    return el.value;
  }
  function validateOn(el, def) {
    var r = el.getAttribute("data-quiz-validate");
    return r ? r.split(/[\s,]+/).filter(Boolean) : def;
  }
  function ctxOf(el) {
    var box = el.closest("[data-quiz-input-template]");
    if (!box || !root.contains(box)) return null;
    var sec = sectionByKey(box.getAttribute("data-quiz-input-template"));
    return sec ? { box: box, sec: sec } : null;
  }
  var debounce = {};
  function change(sec, value) {
    if (isTextLike(sec)) {
      clearTimeout(debounce[sec.key]);
      debounce[sec.key] = setTimeout(function () { delete debounce[sec.key]; setAnswer(sec.key, value); }, 120);
    } else setAnswer(sec.key, value);
  }
  function flush(sec, value) { clearTimeout(debounce[sec.key]); delete debounce[sec.key]; setAnswer(sec.key, value); }

  function toggleMulti(list, key, raw, lookup) {
    if (key === "none") return list.some(function (e) { return String(e) === "none"; }) ? [] : [lookup.none !== undefined ? lookup.none : "none"];
    var out = [], had = false;
    list.forEach(function (r) { var e = String(r); if (e === "none") return; if (e === key) { had = true; return; } out.push(r); });
    if (!had) out.push(raw);
    return out;
  }

  root.addEventListener("click", function (ev) {
    var t = ev.target;
    var back = t.closest('[data-quiz-action="previous"]');
    if (back && root.contains(back)) { ev.preventDefault(); previous(); return; }
    var opt = t.closest("[data-quiz-option]");
    if (opt) {
      var c = ctxOf(opt); if (!c) return;
      if (opt.getAttribute("data-quiz-disabled") === "true" || opt.getAttribute("aria-disabled") === "true") return;
      if (opt.tagName !== "SELECT" && opt.tagName !== "OPTION") ev.preventDefault();
      var key = opt.getAttribute("data-quiz-option"), sec = c.sec;
      var p = sec.lookup[key] !== undefined ? sec.lookup[key] : key, raw = opt.getAttribute("data-quiz-option-value"), m = p;
      if (raw !== null) { try { m = JSON.parse(raw); } catch (x) { m = raw; } }
      var mode = opt.getAttribute("data-quiz-option-mode") || (sec.type === "multi-checkbox" ? "toggle" : "set");
      var g = m;
      if (mode === "toggle" || sec.type === "multi-checkbox") g = toggleMulti(Array.isArray(S.answers[sec.key]) ? S.answers[sec.key].slice() : [], key, m, sec.lookup);
      var details = opt.closest("details[data-quiz-select-dropdown]");
      if (details && details.open) details.open = false;
      var v = validateOn(opt, []);
      setAnswer(sec.key, g);
      if (v.indexOf("change") > -1) { if (details) queueMicrotask(function () { validateKeys([sec.key]); }); else validateKeys([sec.key]); }
      return;
    }
    var tog = t.closest("[data-quiz-checkbox-toggle]");
    if (tog) {
      var c2 = ctxOf(tog); if (!c2) return;
      ev.preventDefault();
      var id = tog.getAttribute("data-quiz-checkbox-id"), cb = id ? c2.box.querySelector("#" + CSS.escape(id)) : null;
      var on = !(cb ? cb.checked : truthy(S.answers[c2.sec.key]));
      if (cb) cb.checked = on;
      setAnswer(c2.sec.key, on);
      if (validateOn(tog, []).indexOf("change") > -1) validateKeys([c2.sec.key]);
    }
  });
  // close open dropdowns on an outside click
  document.addEventListener("click", function (ev) {
    Array.prototype.forEach.call(root.querySelectorAll("details[data-quiz-select-dropdown][open]"), function (d) {
      if (!d.contains(ev.target)) d.open = false;
    });
  }, true);
  root.addEventListener("toggle", function (ev) {
    var d = ev.target;
    if (!d.matches || !d.matches("details[data-quiz-select-dropdown]")) return;
    if (d.open) {
      Array.prototype.forEach.call(root.querySelectorAll("details[data-quiz-select-dropdown][open]"), function (o) { if (o !== d) o.open = false; });
    } else if (!d.closest("[data-quiz-composite]")) {
      var inp = d.closest("[data-quiz-template]") && d.closest("[data-quiz-template]").querySelector("[data-quiz-input]");
      if (inp) inp.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    }
    if (d.matches("[data-quiz-searchable-select]")) searchToggle(d);
  }, true);

  // searchable state list
  function norm(s) { s = String(s == null ? "" : s).toLowerCase(); try { return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); } catch (e) { return s.replace(/\s+/g, " ").trim(); } }
  function searchParts(d) {
    var input = d.querySelector('[data-quiz-search-input], input[type="text"]');
    var empty = d.querySelector("[data-quiz-search-empty]");
    var opts = Array.prototype.filter.call(d.querySelectorAll("[data-quiz-search-option], [data-quiz-option]"), function (e) { return e instanceof HTMLElement; });
    return { input: input, empty: empty, opts: opts };
  }
  function searchFilter(d) {
    var p = searchParts(d); if (!p.input) return;
    var q = norm(p.input.value), shown = 0;
    p.opts.forEach(function (o) {
      var hay = norm((o.getAttribute("data-quiz-option-label") || "") + " " + (o.innerText || o.textContent || "") + " " +
        (o.getAttribute("data-quiz-option") || "") + " " + (o.getAttribute("data-quiz-option-value") || ""));
      var ok = !q.length || hay.indexOf(q) > -1;
      if (ok) { o.style.removeProperty("display"); shown++; } else o.style.setProperty("display", "none", "important");
    });
    if (p.empty) p.empty.classList.toggle("hidden", shown > 0);
  }
  function searchToggle(d) {
    var p = searchParts(d); if (!p.input) return;
    if (d.open) { searchFilter(d); requestAnimationFrame(function () { p.input.focus(); }); return; }
    p.input.value = "";
    p.opts.forEach(function (o) { o.style.removeProperty("display"); });
    if (p.empty) p.empty.classList.add("hidden");
  }

  function compositeCompute(comp) {
    var mode = comp.getAttribute("data-quiz-composite-mode") || "template";
    var parts = Array.prototype.map.call(comp.querySelectorAll("[data-quiz-part]"), function (e) {
      return { part: e, name: e.getAttribute("data-quiz-part") || "", fallback: e.getAttribute("data-quiz-part-fallback") || "" };
    });
    var emptyVal = comp.getAttribute("data-quiz-composite-empty") || "";
    if (mode === "date") {
      var full = parts.filter(function (p) { return p.name === "full"; })[0];
      var t = full ? String(full.part.value || full.fallback || "").trim() : "", d = null;
      var m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) {
        var mo = +m[1], da = +m[2], yr = +m[3];
        if (mo && da && yr && mo >= 1 && mo <= 12 && da >= 1 && da <= new Date(yr, mo, 0).getDate()) d = new Date(yr, mo - 1, da);
      } else if (t) { var x = new Date(t); if (!isNaN(x.getTime())) d = x; }
      if (!d) return emptyVal;
      return (comp.getAttribute("data-quiz-date-format") || "date-string") === "iso" ? d.toISOString() : d.toDateString();
    }
    return emptyVal;
  }
  function compositeOf(el) { var c = el.closest("[data-quiz-composite]"); return c && el.hasAttribute("data-quiz-part") ? c : null; }
  function compositeTarget(comp) {
    var sel = comp.getAttribute("data-quiz-composite-target");
    return sel ? comp.querySelector(sel) : comp.querySelector("[data-quiz-input]");
  }

  function onInput(ev) {
    var el = ev.target;
    if (el.matches && el.matches("[data-quiz-search-input], details[data-quiz-searchable-select] input[type=text]")) {
      var d = el.closest("details[data-quiz-searchable-select]"); if (d) searchFilter(d); return;
    }
    var comp = compositeOf(el);
    if (comp) {
      var on = validateOn(comp, ["input", "change"]);
      if (on.indexOf(ev.type) === -1) return;
      var mask = MASKS[el.getAttribute("data-quiz-mask")]; if (mask) mask.apply(el);
      var target = compositeTarget(comp); if (!target) return;
      var v = compositeCompute(comp), emptyVal = comp.getAttribute("data-quiz-composite-empty") || "";
      if ((target.value || "") !== (v || "")) { target.value = v || ""; target.dispatchEvent(new Event("input", { bubbles: true })); }
      var c0 = ctxOf(target);
      if (c0 && c0.sec.type === "date" && comp.getAttribute("data-quiz-composite-mode") === "date" &&
          (comp.getAttribute("data-quiz-date-mode") || "split") === "single" && (target.value || "") !== emptyVal) {
        var full = comp.querySelector('[data-quiz-part="full"]');
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(String(full && full.value || "").trim()) && target.value !== S.answers[c0.sec.key]) setAnswer(c0.sec.key, target.value);
      }
      if (ev.type === "change" && (target.value || "") !== emptyVal) target.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      return;
    }
    var inp = el.closest && el.closest("[data-quiz-input]");
    if (!inp) return;
    var c = ctxOf(inp); if (!c || c.sec.type === "date") return;
    var mk = MASKS[inp.getAttribute("data-quiz-mask")]; if (mk && inp.tagName === "INPUT") mk.apply(inp);
    var val = valueOf(inp);
    change(c.sec, val);
    if (ev.type === "change" && validateOn(inp, ["blur"]).indexOf("change") > -1) validateKeys([c.sec.key]);
  }
  root.addEventListener("input", onInput);
  root.addEventListener("change", onInput);
  root.addEventListener("keydown", function (ev) {
    var el = ev.target;
    var d = el.closest && el.closest("details[data-quiz-searchable-select]");
    if (d && el.matches("[data-quiz-search-input], input[type=text]")) {
      var p = searchParts(d), vis = p.opts.filter(function (o) { return o.style.display !== "none"; });
      if (ev.key === "ArrowDown") { if (vis[0]) { ev.preventDefault(); vis[0].focus(); } return; }
      if (ev.key === "Enter") { if (vis.length === 1) { ev.preventDefault(); vis[0].click(); } return; }
      if (ev.key === "Escape") { ev.preventDefault(); d.open = false; }
      return;
    }
    if (d && (el.hasAttribute("data-quiz-option") || el.hasAttribute("data-quiz-search-option"))) {
      var q = searchParts(d), shown = q.opts.filter(function (o) { return o.style.display !== "none"; }), i = shown.indexOf(el);
      if ((ev.key === "ArrowDown" || ev.key === "ArrowUp") && i > -1) {
        ev.preventDefault(); var n = shown[ev.key === "ArrowDown" ? Math.min(shown.length - 1, i + 1) : Math.max(0, i - 1)]; if (n) n.focus();
      }
      if (ev.key === "Escape") { ev.preventDefault(); d.open = false; if (q.input) q.input.focus(); }
      return;
    }
    var mask = el.getAttribute && MASKS[el.getAttribute("data-quiz-mask")];
    if (mask && el.tagName === "INPUT") mask.handleKeydown(ev, el);
  });
  root.addEventListener("focusout", function (ev) {
    var el = ev.target;
    var comp = compositeOf(el);
    if (comp) { var tg = compositeTarget(comp); if (tg) tg.dispatchEvent(new FocusEvent("focusout", { bubbles: true })); return; }
    var inp = el.closest && el.closest("[data-quiz-input]");
    if (!inp) return;
    var c = ctxOf(inp); if (!c) return;
    var mk = MASKS[inp.getAttribute("data-quiz-mask")]; if (mk && inp.tagName === "INPUT") mk.apply(inp);
    var val = valueOf(inp), sec = c.sec;
    if (sec.type === "date") setAnswer(sec.key, val);
    if (isTextLike(sec)) flush(sec, val);
    // their onBlur validates the field; a blur-validated field validates again (same result)
    setTimeout(function () { if (current() && sectionByKey(sec.key) === sec) validateKeys([sec.key]); }, 0);
  });
  root.addEventListener("submit", function (ev) {
    ev.preventDefault();
    // flush any typed value still waiting on its 120 ms debounce, then go on
    Object.keys(debounce).forEach(function (k) {
      var sec = sectionByKey(k), box = root.querySelector('[data-quiz-input-template="' + CSS.escape(k) + '"] [data-quiz-input]');
      if (sec && box) flush(sec, valueOf(box));
    });
    next();
  });

  // ------------------------------------------------------------------ start
  calcVisible();
  S.step = 0;
  runTriggers("STEP_ENTRY", []);
  calcVisible();
  render();
  if (current().delay !== undefined) S.timer = setTimeout(next, current().delay);

  window.ChimeQuiz = { state: S, next: next, previous: previous, setAnswer: setAnswer, helpers: helpers };
})();
