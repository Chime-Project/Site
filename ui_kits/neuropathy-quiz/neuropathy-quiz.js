// Chime Health — Neuropathy quiz (neuropathy-quiz.html): the 20-step state
// machine ripped from standardmeds.com/quiz/neuropathy (2026-09-11), kept as
// close to the original as possible: same steps, branches, auto-advance
// delays, five disqualifier paths, the 3-month soft block, autocomplete
// pickers and the lead form. Vanilla JS, no React — the reference re-renders
// its card per step and so does this (`render()` off one `state`).
//
// Everything that can be tested without a DOM (routing, the multi-select
// rules, recap phrases, lead validation, the answer payload) is a pure
// function exported on window.NeuropathyQuiz / module.exports for
// neuropathy-quiz-tests.js (node). Data (copy, lists, messages) lives in
// neuropathy-quiz-data.js.
(function (root) {
  "use strict";

  var D = root.NQ_DATA || (typeof require === "function" ? require("./neuropathy-quiz-data.js") : null);

  // ---- Pure helpers -------------------------------------------------------
  function progressLabel(pct) {
    var L = D.PROGRESS_LABELS;
    for (var i = 0; i < L.length; i++) if (pct <= L[i][0]) return L[i][1];
    return L[L.length - 1][1];
  }
  function progress(step) {
    return D.PROGRESS[step] || 0;
  }
  // Multi-select toggle: picking any real option drops "None"; the exclusive
  // "None" option is set by the caller (setNone) and auto-advances.
  function toggleMulti(list, value) {
    var a = (list || []).filter(function (x) { return x !== "None"; });
    return a.indexOf(value) >= 0 ? a.filter(function (x) { return x !== value; }) : a.concat([value]);
  }
  function hasIn(list, value) {
    return (list || []).indexOf(value) >= 0;
  }
  // Chips toggle into a comma list ("+ Cramping" → "Cramping"), the eA rule.
  function chipName(chip) {
    return String(chip).replace(/^\+\s*/, "");
  }
  function csvToggle(csv, chip) {
    var n = chipName(chip);
    var a = csv ? csv.split(", ").filter(Boolean) : [];
    return (a.indexOf(n) >= 0 ? a.filter(function (x) { return x !== n; }) : a.concat([n])).join(", ");
  }
  function csvHas(csv, chip) {
    return String(csv || "").split(", ").indexOf(chipName(chip)) >= 0;
  }
  // Autocomplete: ≥2 chars, substring match, skip what's already picked.
  function suggest(list, query, exclude, max) {
    var q = String(query || "").trim().toLowerCase();
    if (q.length < 2) return [];
    exclude = exclude || [];
    return list.filter(function (t) {
      return t.toLowerCase().indexOf(q) >= 0 && exclude.indexOf(t) < 0;
    }).slice(0, max || 6);
  }
  function joinAnd(arr) {
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  }
  // s6 recap: "You mentioned: numbness or tingling, burning or stinging and …"
  function recapSymptoms(a) {
    var t = (a.symptoms || []).slice();
    var i = t.indexOf("Other");
    if (i !== -1 && a.symptomOther) t[i] = a.symptomOther;
    else if (i !== -1) t.splice(i, 1);
    if (!t.length) return "";
    return "You mentioned: " + joinAnd(t).toLowerCase();
  }
  // s13 recap: "Including anything for your diabetes, thyroid disease and …"
  function recapConditions(a) {
    var t = (a.conditions || []).filter(function (x) { return x !== "None"; });
    if (!t.length) return "";
    var s = t.map(function (x) {
      return x.replace(/^I have /i, "").replace(/^I drink /i, "").replace(/^History of /i, "").toLowerCase();
    });
    return "Including anything for your " + joinAnd(s);
  }
  // s9 lead card: "Your {x} could respond very well to NeuroCalmRX."
  function leadPhrase(a) {
    var t = (a.symptoms || []).map(function (x) { return x.toLowerCase(); });
    if (!t.length) return "your symptoms";
    if (t.length === 1) return t[0];
    if (t.length === 2) return t[0] + " and " + t[1];
    return t.slice(0, 2).join(", ") + " and more";
  }
  function normalizePhone(s) {
    var d = String(s || "").replace(/\D/g, "");
    if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
    return d;
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateLead(f) {
    var name = String(f.name || "").trim(), email = String(f.email || "").trim(), phone = String(f.phone || "").trim();
    var fields = {};
    if (!name) fields.name = true;
    if (!email) fields.email = true;
    if (!phone) fields.phone = true;
    if (fields.name || fields.email || fields.phone) return { ok: false, fields: fields, message: D.COPY.s9.errAll };
    if (!EMAIL_RE.test(email)) return { ok: false, fields: { email: true }, message: D.COPY.s9.errEmail };
    var digits = normalizePhone(phone);
    if (digits.length !== 10) return { ok: false, fields: { phone: true }, message: D.COPY.s9.errPhone };
    return { ok: true, fields: {}, name: name, email: email, phone: digits };
  }
  // First ticked screening item wins (the reference loops the list in order).
  function screeningHit(list) {
    list = list || [];
    for (var i = 0; i < D.SCREENING.length; i++) if (list.indexOf(D.SCREENING[i]) >= 0) return D.SCREENING[i];
    return null;
  }
  // Where "Continue" (or the auto-advance) goes from a step, given the answers.
  function next(step, a) {
    a = a || {};
    switch (step) {
      case "s1": return { step: a.sex === "Female" ? "s28" : "s4" };
      case "s28": return a.pregnant === "Yes" ? { modal: "pregnant" } : { step: "s4" };
      case "s4": return { step: "s5" };
      case "s5": return { step: "s14" };
      case "s14": return a.duration === D.ACUTE ? { modal: "duration" } : { step: "s6" };
      case "s6": return { step: a.priorTreatment === "Yes" ? "s25" : "s11" };
      case "s25": return { step: "s26" };
      case "s26": return { step: a.hasSideEffects === "Yes" ? "s27" : "s11" };
      case "s27": return { step: "s11" };
      case "s11": return a.currentOpioids === "Yes" ? { modal: "opioid" } : { step: "s12" };
      case "s12": return hasIn(a.conditions, D.ALCOHOL) ? { modal: "alcohol" } : { step: "s13" };
      case "s13": return { step: "s15" };
      case "s15": { var hit = screeningHit(a.screening); return hit ? { modal: "screening", item: hit } : { step: "s16" }; }
      case "s16": return { step: "s17" };
      case "s17": return { step: "s18" };
      case "s18": return { step: "s19" };
      case "s19": return { step: "s20" };
      case "s20": return { step: "s22" };
      case "s22": return { step: "s9" };
      case "s9": return { step: "done" };
    }
    return { step: step };
  }
  function autonomicOptions(a) {
    return a.sex === "Male" ? D.AUTONOMIC.concat([D.AUTONOMIC_MALE]) : D.AUTONOMIC.slice();
  }
  // The reference's answer batch (question ids are its API's; kept so a
  // backend can map 1:1 later). Empty answers are skipped.
  function buildPayload(a, weight) {
    var out = [];
    function o(id, q, v) {
      if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) return;
      out.push({ question_id: id, question: q, answer: v });
    }
    o(3704, "Sex assigned at birth", a.sex);
    o(3705, "Pregnancy / breastfeeding status", a.pregnant);
    o(3706, "Pregnancy consent", a.pregConsent);
    o(3710, "Neuropathy symptoms", a.symptoms);
    o(3711, "Other symptoms details", a.symptomOther);
    o(3713, "Suspected cause of neuropathy", a.cause);
    o(3714, "Other suspected cause details", a.causeOther);
    o(3709, "Time since neuropathy diagnosis", a.duration);
    if (a.duration) o(3700, "Chronic vs acute pain screening", a.duration === D.ACUTE ? "acute" : "chronic");
    o(3715, "Prior treatment for neuropathy", a.priorTreatment);
    o(3716, "Treatments tried", a.treatments);
    o(3717, "Other treatment details", a.treatmentOther);
    o(3718, "Side effects from treatments", a.hasSideEffects);
    o(3719, "Side effects details", a.sideEffects);
    o(3721, "Current opioid use", a.currentOpioids);
    o(3720, "Medical conditions", a.conditions);
    o(3701, "Current medical conditions", a.conditions);
    o(3702, "Current medications", a.medications);
    var l = a.screening || [];
    if (l.indexOf(D.SCREENING[0]) >= 0) o(3722, "History of opioid use disorder", "Yes");
    if (l.indexOf(D.SCREENING[1]) >= 0 || l.indexOf(D.SCREENING[2]) >= 0) o(3723, "Liver or kidney disease", "Yes");
    if (l.indexOf(D.SCREENING[3]) >= 0) o(3724, "Severe depression or bipolar", "Yes");
    o(3703, "Allergies", a.allergies);
    if (a.heightFt) o(3707, "Height (feet)", a.heightFt + "ft " + (a.heightIn || "0") + "in");
    if (weight) o(3708, "Weight (lbs)", weight);
    o(3712, "Nerve conduction / EMG testing", a.emg);
    o(3725, "Autonomic symptoms", a.autonomic);
    o(3726, "Additional info for doctor", a.doctorQuestions || "no questions");
    o(3727, "Truthfulness consent", a.consentTruth || D.COPY.consentTruthDefault);
    o(3728, "Neuropathy treatment consent", a.consentTreat || D.COPY.consentTreatDefault);
    return out;
  }
  function years() {
    var out = [];
    for (var i = 0; i < D.YEAR_COUNT; i++) out.push(String(D.YEAR_MAX - i));
    return out;
  }
  function days() {
    var out = [];
    for (var i = 1; i <= 31; i++) out.push((i < 10 ? "0" : "") + i);
    return out;
  }

  var api = {
    progress: progress, progressLabel: progressLabel, toggleMulti: toggleMulti, csvToggle: csvToggle,
    csvHas: csvHas, suggest: suggest, recapSymptoms: recapSymptoms, recapConditions: recapConditions,
    leadPhrase: leadPhrase, normalizePhone: normalizePhone, validateLead: validateLead,
    screeningHit: screeningHit, next: next, autonomicOptions: autonomicOptions,
    buildPayload: buildPayload, years: years, days: days,
  };
  root.NeuropathyQuiz = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  // ---- DOM ----------------------------------------------------------------
  var card = document.getElementById("nqCard");
  if (!card || !D) return;
  var fill = document.getElementById("nqFill"), label = document.getElementById("nqLabel");
  var modalHost = document.getElementById("nqModal"), progressWrap = document.getElementById("nqProgress");

  var state = {
    step: "s1", history: [], answers: {}, modal: null, modalItem: null, dq: null, errors: {}, busy: false,
    ui: {
      symptomOther: "", causeOther: "", causeOtherOpen: false, treatOther: "", treatOtherOpen: false,
      sideFx: "", notes: "", medYes: false, medQ: "", meds: [], allergyQ: "", allergies: [], noAllergy: false,
      weight: "", dobM: "", dobD: "", dobY: "", name: "", email: "", phone: "", consentOpen: false,
      pregNoticeOpen: false, fieldErr: {},
    },
  };
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  // Analytics: the reference's events, as dataLayer pushes a GTM container can pick up.
  function track(event, data) {
    var w = root;
    w.dataLayer = w.dataLayer || [];
    var o = { event: "nq_" + event, quiz: "neuropathy" };
    for (var k in data || {}) o[k] = data[k];
    w.dataLayer.push(o);
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function set(key, value) { state.answers[key] = value; }
  function ans(key) { return state.answers[key]; }

  function go(step) {
    if (state.step !== step) {
      state.history.push(state.step);
      var m = D.META[step];
      if (m) track("quiz_progress", { step_index: m.idx, step_name: m.name });
      if (!state._q1) { state._q1 = true; track("q1_success"); }
    }
    state.step = step;
    state.errors = {};
    render();
    later(function () { window.scrollTo(0, 0); }, 0);
  }
  // Continue / auto-advance: route through next(), open a modal if the rules say so.
  function advance(delay) {
    var r = next(state.step, state.answers);
    var run = function () {
      if (r.modal) { openModal(r.modal, r.item); return; }
      if (r.step === "done") return;
      go(r.step);
    };
    if (delay) later(run, delay); else run();
  }
  function openModal(name, item) {
    state.modal = name; state.modalItem = item || null; renderModal();
  }
  function closeModal() { state.modal = null; state.modalItem = null; renderModal(); }
  function disqualify(title, message) {
    state.modal = null; state.dq = { title: title, message: message }; renderModal(); render();
  }
  function setError(msg) { state.errors[state.step] = msg; render(); }

  // ---- Fragments ----------------------------------------------------------
  var ICON = {
    male: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="6" r="4"/><path d="M18 2l-3 3m3-3h-3m3 0v3"/><path d="M3 22v-2a6 6 0 0112 0v2"/></svg>',
    female: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M12 11v5m-3 0h6"/><path d="M5 22v-2a7 7 0 0114 0v2"/></svg>',
    "Numbness or tingling": '<path d="M18 4l-4 4M14 4l4 4"/><path d="M6 8c4 0 6 2 6 6s2 6 6 6"/><path d="M6 14c4 0 6 2 6 6"/>',
    "Burning or stinging": '<path d="M12 22c-4 0-7-3-7-7 0-5 7-13 7-13s7 8 7 13c0 4-3 7-7 7z"/><path d="M12 18v-4M10 16h4"/>',
    "Sharp electric shocks": '<polyline points="13 2 10 10 15 10 11 22"/>',
    "Muscle weakness": '<path d="M6 18.5a3.5 3.5 0 117 0c0-1.57.92-2.85 2.37-3.47L18 14V4l-4 2-4-2-4 2v6"/><path d="M12 14v-2"/>',
    "Loss of balance": '<circle cx="12" cy="5" r="3"/><path d="M12 8v4l-3 6M12 12l3 6"/><path d="M7 22h10"/><path d="M9 18l-3 4M15 18l3 4"/>',
    "Difficulty walking": '<circle cx="12" cy="5" r="3"/><path d="M12 8v3"/><path d="M9 20l3-9 3 9"/><path d="M7 22h4M13 22h4"/>',
    "Sensitivity to touch": '<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M12 2v1"/><circle cx="5" cy="11" r="1" fill="currentColor"/><circle cx="19" cy="11" r="1" fill="currentColor"/><circle cx="7" cy="15" r="1" fill="currentColor"/><circle cx="17" cy="15" r="1" fill="currentColor"/>',
    Other: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  };
  function symptomIcon(name) {
    return ICON[name] ? '<svg class="nq-symptomIcon" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + "</svg>" : "";
  }
  var CHECK = '<span class="nq-check" aria-hidden="true">✓</span>';
  function qText(t, center) { return '<h2 class="nq-qText' + (center ? " nq-qTextCenter" : "") + '">' + esc(t) + "</h2>"; }
  function qSub(t, cls) { return t ? '<p class="nq-qSub ' + (cls || "") + '">' + esc(t) + "</p>" : ""; }
  function err() { var e = state.errors[state.step]; return e ? '<div class="nq-err" role="alert">' + esc(e) + "</div>" : ""; }
  function cta(label, act, extra) {
    return '<button type="button" class="nq-btnCta" data-act="' + act + '"' + (extra || "") + ">" + esc(label) + "</button>";
  }
  function opt(value, key, act, extra) {
    var on = hasIn(ans(key), value) || ans(key) === value;
    return '<button type="button" class="nq-opt' + (on ? " nq-optSelected" : "") + '" data-act="' + act + '" data-v="' + esc(value) + '" aria-pressed="' + on + '">' + CHECK + (extra || "") + esc(value) + "</button>";
  }
  function yn(noAct, yesAct, noFirst) {
    var no = '<button type="button" class="nq-btnYn" data-act="' + noAct + '">NO</button>';
    var yes = '<button type="button" class="nq-btnYn" data-act="' + yesAct + '">YES</button>';
    return '<div class="nq-btnRow">' + (noFirst ? no + yes : yes + no) + "</div>";
  }
  function chips(list, csv, act) {
    return '<div class="nq-chipRow">' + list.map(function (c) {
      return '<button type="button" class="nq-chip' + (csvHas(csv, c) ? " nq-chipSelected" : "") + '" data-act="' + act + '" data-v="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("") + "</div>";
  }
  function acList(items, act) {
    if (!items.length) return "";
    return '<div class="nq-acList" role="listbox">' + items.map(function (t) {
      return '<div class="nq-acItem" role="option" data-act="' + act + '" data-v="' + esc(t) + '">' + esc(t) + "</div>";
    }).join("") + "</div>";
  }
  function tags(list, act) {
    return list.map(function (t) {
      return '<span class="nq-tag">' + esc(t) + '<span class="nq-tagX" role="button" aria-label="Remove ' + esc(t) + '" data-act="' + act + '" data-v="' + esc(t) + '">×</span></span>';
    }).join("");
  }
  function field(attrs) { return '<input class="nq-field" ' + attrs + " />"; }

  // ---- Steps --------------------------------------------------------------
  var U = state.ui, C = D.COPY;
  var STEPS = {
    s1: function () {
      return '<div class="nq-freeBadgeWrap"><span class="nq-freeBadge">' + esc(C.badge) + "</span></div>" +
        qText(C.s1.q, true) + qSub(C.s1.sub, "nq-qSubCenter") +
        '<div class="nq-genderCards">' +
        '<button type="button" class="nq-genderCard' + (ans("sex") === "Male" ? " nq-genderCardSelected" : "") + '" data-act="sex" data-v="Male">' + ICON.male + '<span class="nq-genderCardLabel">Male</span></button>' +
        '<button type="button" class="nq-genderCard' + (ans("sex") === "Female" ? " nq-genderCardSelected" : "") + '" data-act="sex" data-v="Female">' + ICON.female + '<span class="nq-genderCardLabel">Female</span></button>' +
        "</div>";
    },
    s28: function () {
      return qText(C.s28.q) + yn("preg-no", "preg-yes") +
        '<div class="nq-consentLine">' + esc(C.s28.footnote) +
        '<div><button type="button" class="nq-consentLink" data-act="preg-notice">' + esc(C.s28.link) + "</button></div>" +
        (U.pregNoticeOpen ? '<div class="nq-consentReveal">' + esc(C.s28.notice) + "</div>" : "") +
        "</div>";
    },
    s4: function () {
      var other = hasIn(ans("symptoms"), "Other");
      return qText(C.s4.q) + qSub(C.s4.sub) +
        '<div class="nq-optList">' + D.SYMPTOMS.map(function (s) { return opt(s, "symptoms", "sym", symptomIcon(s)); }).join("") + "</div>" +
        (other ? '<div class="nq-inlineReveal">' + chips(D.SYMPTOM_CHIPS, U.symptomOther, "sym-chip") +
          field('type="text" data-field="symptomOther" placeholder="' + esc(C.s4.placeholder) + '" value="' + esc(U.symptomOther) + '"') + "</div>" : "") +
        err() + cta(C.continueLabel, "s4-continue");
    },
    s5: function () {
      var otherOpen = U.causeOtherOpen;
      var sug = suggest(D.CAUSE_SUGGEST, U.causeOther, [], 5);
      return qText(C.s5.q) +
        '<div class="nq-optList">' + D.CAUSES.map(function (c) { return opt(c, "cause", "cause"); }).join("") +
        '<button type="button" class="nq-opt' + (otherOpen ? " nq-optSelected" : "") + '" data-act="cause-other">' + CHECK + esc(D.CAUSE_OTHER) + "</button></div>" +
        (otherOpen ? '<div class="nq-inlineReveal">' + chips(D.CAUSE_CHIPS, U.causeOther, "cause-chip") +
          '<div class="nq-acWrap">' + field('type="text" data-field="causeOther" data-ac="cause" placeholder="' + esc(C.s5.placeholder) + '" value="' + esc(U.causeOther) + '" autocomplete="off"') +
          '<div id="nqAc">' + acList(sug, "cause-pick") + "</div></div>" +
          cta(C.continueLabel, "s5-continue", ' style="margin-top:14px"') + "</div>" : "");
    },
    s14: function () {
      return qText(C.s14.q) + '<div class="nq-optList">' + D.DURATIONS.map(function (d) { return opt(d, "duration", "duration"); }).join("") + "</div>";
    },
    s6: function () {
      var r = recapSymptoms(state.answers);
      return qText(C.s6.q) + (r ? qSub(r, "nq-qSubMuted") : "") + yn("prior-no", "prior-yes", true);
    },
    s25: function () {
      var otherOn = hasIn(ans("treatments"), D.TREATMENT_OTHER);
      var sug = suggest(D.TREATMENT_SUGGEST, U.treatOther, [], 5);
      return qText(C.s25.q) + qSub(C.s25.sub) +
        '<div class="nq-optList">' + D.TREATMENTS.map(function (t) { return opt(t, "treatments", "treat"); }).join("") +
        '<button type="button" class="nq-opt' + (otherOn ? " nq-optSelected" : "") + '" data-act="treat-other">' + CHECK + esc(D.TREATMENT_OTHER) + "</button></div>" +
        (U.treatOtherOpen ? '<div class="nq-inlineReveal">' + chips(D.TREATMENT_CHIPS, U.treatOther, "treat-chip") +
          '<div class="nq-acWrap">' + field('type="text" data-field="treatOther" data-ac="treat" placeholder="' + esc(C.s25.placeholder) + '" value="' + esc(U.treatOther) + '" autocomplete="off"') +
          '<div id="nqAc">' + acList(sug, "treat-pick") + "</div></div></div>" : "") +
        err() + cta(C.continueLabel, "s25-continue");
    },
    s26: function () { return qText(C.s26.q) + yn("sfx-no", "sfx-yes"); },
    s27: function () {
      return qText(C.s27.q) + qSub(C.s27.sub) + chips(D.SIDE_EFFECT_CHIPS, U.sideFx, "sfx-chip") +
        '<textarea class="nq-field" data-field="sideFx" placeholder="' + esc(C.s27.placeholder) + '">' + esc(U.sideFx) + "</textarea>" +
        cta(C.continueLabel, "s27-continue", ' style="margin-top:14px"');
    },
    s11: function () { return qText(C.s11.q) + yn("op-no", "op-yes", true); },
    s12: function () {
      var none = hasIn(ans("conditions"), "None");
      return qText(C.s12.q) + '<div class="nq-optList">' +
        '<button type="button" class="nq-opt' + (none ? " nq-optSelected" : "") + '" data-act="cond-none">' + CHECK + esc(C.s12.none) + "</button>" +
        D.CONDITIONS.map(function (c) { return opt(c, "conditions", "cond"); }).join("") + "</div>" +
        cta(C.continueLabel, "s12-continue");
    },
    s13: function () {
      var r = recapConditions(state.answers);
      var head = qText(C.s13.q) + (r ? qSub(r, "nq-qSubMuted") : "");
      if (!U.medYes) return head + yn("med-no", "med-yes", true);
      var sug = suggest(D.MEDS, U.medQ, U.meds, 6);
      return head + qSub(C.s13.sub) +
        '<div class="nq-chipRow">' + D.MED_CHIPS.map(function (c) {
          var n = chipName(c), on = U.meds.indexOf(n) >= 0;
          return '<button type="button" class="nq-chip' + (on ? " nq-chipSelected" : "") + '" data-act="med-chip" data-v="' + esc(n) + '">' + esc(c) + "</button>";
        }).join("") + "</div>" +
        '<div class="nq-acWrap">' + field('type="text" data-field="medQ" data-ac="med" placeholder="' + esc(C.s13.placeholder) + '" value="' + esc(U.medQ) + '" autocomplete="off"') +
        '<div id="nqAc">' + acList(sug, "med-pick") + "</div></div>" +
        '<div class="nq-medTags" id="nqTags">' + tags(U.meds, "med-remove") + "</div>" +
        err() + cta(C.continueLabel, "s13-continue");
    },
    s15: function () {
      var none = hasIn(ans("screening"), "None");
      return qText(C.s15.q) + '<div class="nq-optList">' +
        '<button type="button" class="nq-opt' + (none ? " nq-optSelected" : "") + '" data-act="scr-none">' + CHECK + esc(C.s15.none) + "</button>" +
        D.SCREENING.map(function (s) { return opt(s, "screening", "scr"); }).join("") + "</div>" +
        cta(C.continueLabel, "s15-continue");
    },
    s16: function () {
      var sug = suggest(D.ALLERGIES, U.allergyQ, U.allergies, 6);
      return qText(C.s16.q) +
        '<div class="nq-acWrap">' + field('type="text" data-field="allergyQ" data-ac="allergy" placeholder="' + esc(C.s16.placeholder) + '" value="' + esc(U.allergyQ) + '" autocomplete="off"') +
        '<div id="nqAc">' + acList(sug, "allergy-pick") + "</div></div>" +
        '<div class="nq-medTags" id="nqTags">' + tags(U.allergies, "allergy-remove") + "</div>" +
        '<button type="button" class="nq-opt' + (U.noAllergy ? " nq-optSelected" : "") + '" style="margin-bottom:12px" data-act="allergy-none">' + CHECK + esc(D.NO_ALLERGIES) + "</button>" +
        err() + cta(C.continueLabel, "s16-continue");
    },
    s17: function () {
      return qText(C.s17.q) + qSub(C.s17.sub) +
        '<label class="nq-fieldLabel">' + esc(C.s17.ft) + "</label>" +
        '<div class="nq-htGrid">' + D.HEIGHT_FT.map(function (f) {
          return '<button type="button" class="nq-htBtn' + (ans("heightFt") === f ? " nq-htBtnSelected" : "") + '" data-act="ft" data-v="' + f + '">' + f + "'</button>";
        }).join("") + "</div>" +
        '<label class="nq-fieldLabel">' + esc(C.s17.inch) + "</label>" +
        '<div class="nq-htGrid">' + D.HEIGHT_IN.map(function (i) {
          return '<button type="button" class="nq-htBtn' + (ans("heightIn") === i ? " nq-htBtnSelected" : "") + '" data-act="in" data-v="' + i + '">' + i + '"</button>';
        }).join("") + "</div>" +
        '<div class="nq-fieldGroup"><label class="nq-fieldLabel" for="nqWeight">' + esc(C.s17.weight) + "</label>" +
        field('type="number" inputmode="numeric" id="nqWeight" data-field="weight" placeholder="' + esc(C.s17.placeholder) + '" value="' + esc(U.weight) + '"') + "</div>" +
        err() + cta(C.continueLabel, "s17-continue");
    },
    s18: function () {
      return qText(C.s18.q) + '<div class="nq-optList">' + D.EMG.map(function (e) { return opt(e, "emg", "emg"); }).join("") + "</div>";
    },
    s19: function () {
      var none = hasIn(ans("autonomic"), "None");
      return qText(C.s19.q) + '<div class="nq-optList">' +
        '<button type="button" class="nq-opt' + (none ? " nq-optSelected" : "") + '" data-act="auto-none">' + CHECK + esc(C.s19.none) + "</button>" +
        autonomicOptions(state.answers).map(function (o) { return opt(o, "autonomic", "auto"); }).join("") + "</div>" +
        cta(C.continueLabel, "s19-continue");
    },
    s20: function () {
      var on = U.notes.trim() === C.s20.noQuestions;
      return qText(C.s20.q) + qSub(C.s20.sub) +
        '<div class="nq-chipRow"><button type="button" class="nq-chip' + (on ? " nq-chipSelected" : "") + '" data-act="notes-none">' + esc(C.s20.chip) + "</button></div>" +
        '<textarea class="nq-field" data-field="notes" placeholder="' + esc(C.s20.placeholder) + '">' + esc(U.notes) + "</textarea>" +
        cta(C.continueLabel, "s20-continue", ' style="margin-top:14px"') +
        '<div class="nq-skipLink"><button type="button" data-act="s20-skip">' + esc(C.s20.skip) + "</button></div>";
    },
    s22: function () {
      function sel(name, labelTxt, items, val) {
        return '<div class="nq-dobCol"><label class="nq-fieldLabel" for="nqDob' + name + '">' + labelTxt + "</label>" +
          '<select class="nq-field" id="nqDob' + name + '" data-field="dob' + name + '"><option value="">--</option>' +
          items.map(function (v) { return '<option value="' + v + '"' + (val === v ? " selected" : "") + ">" + v + "</option>"; }).join("") + "</select></div>";
      }
      return qText(C.s22.q) + qSub(C.s22.sub) +
        '<div class="nq-dobRow">' + sel("M", "Month", D.MONTHS, U.dobM) + sel("D", "Day", days(), U.dobD) + sel("Y", "Year", years(), U.dobY) + "</div>" +
        err() + cta(C.continueLabel, "s22-continue");
    },
    s9: function () {
      var fe = U.fieldErr;
      function inp(key, labelTxt, type, ph) {
        return '<div class="nq-fieldGroup"><label class="nq-fieldLabel" for="nq-' + key + '">' + esc(labelTxt) + "</label>" +
          field('type="' + type + '" id="nq-' + key + '" data-field="' + key + '" placeholder="' + esc(ph) + '" value="' + esc(U[key]) + '"' + (fe[key] ? ' aria-invalid="true"' : "") + (key === "phone" ? ' inputmode="tel" autocomplete="tel"' : key === "email" ? ' autocomplete="email"' : ' autocomplete="name"')) +
          "</div>";
      }
      return '<div class="nq-leadCard"><h3>' + esc(C.s9.lead) + "</h3><p>Your " + esc(leadPhrase(state.answers)) + " could respond very well to " + esc(D.PRODUCT) + '.</p><p class="nq-leadCardAttr">' + esc(D.ATTRIBUTION) + "</p></div>" +
        qSub(C.s9.sub) +
        inp("name", C.s9.name, "text", C.s9.namePh) + inp("email", C.s9.email, "email", C.s9.emailPh) + inp("phone", C.s9.phone, "tel", C.s9.phonePh) +
        err() +
        cta(state.busy ? C.s9.busy : C.s9.cta, "s9-submit", state.busy ? " disabled" : "") +
        '<div class="nq-consentLine">By continuing you agree to the <button type="button" class="nq-consentLink" data-act="consent-toggle" aria-expanded="' + U.consentOpen + '">' + esc(C.s9.truthTitle) + " and " + esc(C.s9.treatTitle) + "</button>." +
        (U.consentOpen ? '<div class="nq-consentReveal"><strong>' + esc(C.s9.truthTitle) + "</strong><br>" + esc(C.s9.truth) + "<br><br><strong>" + esc(C.s9.treatTitle) + "</strong><br>" + esc(C.s9.treat) + "</div>" : "") +
        "</div>" +
        '<div class="nq-trustLine">' + esc(C.s9.trust) + "</div>";
    },
  };

  function render() {
    if (state.dq) {
      card.className = "nq-dqPage";
      card.innerHTML = '<div class="nq-dqPageIcon" aria-hidden="true">⚠️</div><h2>' + esc(state.dq.title) + "</h2><p>" + esc(state.dq.message) + "</p>" +
        '<button type="button" class="nq-btnCta nq-btnCta--grey" data-act="start-over">' + esc(C.dq.startOver) + "</button>";
      if (progressWrap) progressWrap.hidden = true;
      return;
    }
    card.className = "nq-step";
    card.setAttribute("data-step", state.step);
    var pct = progress(state.step);
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = progressLabel(pct);
    if (progressWrap) progressWrap.hidden = false;
    card.innerHTML = (STEPS[state.step] || function () { return ""; })();
  }
  // Keystrokes only refresh the autocomplete list / tags, so the input keeps focus.
  function renderAc() {
    var host = document.getElementById("nqAc");
    if (!host) return;
    var f = card.querySelector("[data-ac]");
    var kind = f && f.getAttribute("data-ac");
    if (kind === "cause") host.innerHTML = acList(suggest(D.CAUSE_SUGGEST, U.causeOther, [], 5), "cause-pick");
    if (kind === "treat") host.innerHTML = acList(suggest(D.TREATMENT_SUGGEST, U.treatOther, [], 5), "treat-pick");
    if (kind === "med") host.innerHTML = acList(suggest(D.MEDS, U.medQ, U.meds, 6), "med-pick");
    if (kind === "allergy") host.innerHTML = acList(suggest(D.ALLERGIES, U.allergyQ, U.allergies, 6), "allergy-pick");
  }
  function renderModal() {
    if (!modalHost) return;
    if (!state.modal) { modalHost.hidden = true; modalHost.innerHTML = ""; document.body.classList.remove("nq-modal-open"); return; }
    var m = D.MODALS[state.modal];
    var body = state.modal === "screening" ? D.SCREENING_MSG[state.modalItem] : m.body;
    modalHost.hidden = false;
    document.body.classList.add("nq-modal-open");
    modalHost.innerHTML = '<div class="nq-dqOverlay" role="dialog" aria-modal="true" aria-labelledby="nqModalTitle"><div class="nq-dqCard">' +
      '<h3 id="nqModalTitle">' + esc(m.title) + "</h3><p>" + esc(body) + "</p>" +
      '<div class="nq-btnRow">' +
      '<button type="button" class="nq-btnYn nq-btnYnPrimary" data-act="modal-back">' + esc(m.back) + "</button>" +
      (m.confirm ? '<button type="button" class="nq-btnYn" data-act="modal-confirm">' + esc(m.confirm) + "</button>" : "") +
      "</div></div></div>";
    var first = modalHost.querySelector("button");
    if (first) first.focus();
  }

  // ---- Actions ------------------------------------------------------------
  function setNoneAndGo(key) {
    // Exclusive "None": clears the rest and auto-advances (300 ms); a second tap clears it.
    if (hasIn(ans(key), "None")) { set(key, []); render(); return; }
    set(key, ["None"]); render(); advance(300);
  }
  function multi(key, v) { set(key, toggleMulti(ans(key), v)); render(); }

  var ACTIONS = {
    sex: function (v) { set("sex", v); render(); advance(250); },
    "preg-yes": function () { set("pregnant", "Yes"); openModal("pregnant"); },
    "preg-no": function () { set("pregnant", "No"); set("pregConsent", "Agreed"); go("s4"); },
    "preg-notice": function () { U.pregNoticeOpen = !U.pregNoticeOpen; render(); },
    sym: function (v) { multi("symptoms", v); },
    "sym-chip": function (v) { U.symptomOther = csvToggle(U.symptomOther, v); render(); },
    "s4-continue": function () {
      if (!(ans("symptoms") || []).length) { setError(C.s4.err); return; }
      if (hasIn(ans("symptoms"), "Other") && U.symptomOther.trim()) set("symptomOther", U.symptomOther.trim());
      advance();
    },
    cause: function (v) { set("cause", v); U.causeOtherOpen = false; render(); advance(250); },
    "cause-other": function () { set("cause", "Other"); U.causeOtherOpen = true; render(); },
    "cause-chip": function (v) { U.causeOther = csvToggle(U.causeOther, v); render(); },
    "cause-pick": function (v) { U.causeOther = v; render(); },
    "s5-continue": function () { set("causeOther", U.causeOther.trim()); advance(); },
    duration: function (v) { set("duration", v); render(); advance(250); },
    "prior-no": function () { set("priorTreatment", "No"); advance(); },
    "prior-yes": function () { set("priorTreatment", "Yes"); advance(); },
    treat: function (v) { multi("treatments", v); },
    "treat-other": function () { multi("treatments", D.TREATMENT_OTHER); U.treatOtherOpen = !U.treatOtherOpen; render(); },
    "treat-chip": function (v) { U.treatOther = csvToggle(U.treatOther, v); render(); },
    "treat-pick": function (v) { U.treatOther = v; render(); },
    "s25-continue": function () {
      if (!(ans("treatments") || []).length) { setError(C.s25.err); return; }
      if (hasIn(ans("treatments"), D.TREATMENT_OTHER) && U.treatOther.trim()) set("treatmentOther", U.treatOther.trim());
      advance();
    },
    "sfx-yes": function () { set("hasSideEffects", "Yes"); advance(); },
    "sfx-no": function () { set("hasSideEffects", "No"); set("sideEffects", "None"); advance(); },
    "sfx-chip": function (v) { U.sideFx = csvToggle(U.sideFx, v); render(); },
    "s27-continue": function () { set("sideEffects", U.sideFx.trim()); advance(); },
    "op-no": function () { set("currentOpioids", "No"); advance(); },
    "op-yes": function () { set("currentOpioids", "Yes"); openModal("opioid"); },
    cond: function (v) { multi("conditions", v); },
    "cond-none": function () { setNoneAndGo("conditions"); },
    "s12-continue": function () { if (!(ans("conditions") || []).length) set("conditions", ["None"]); advance(); },
    "med-no": function () { set("medications", "None"); advance(); },
    "med-yes": function () { U.medYes = true; render(); },
    "med-chip": function (v) { U.meds = U.meds.indexOf(v) >= 0 ? U.meds.filter(function (m) { return m !== v; }) : U.meds.concat([v]); render(); },
    "med-pick": function (v) { if (U.meds.indexOf(v) < 0) U.meds.push(v); U.medQ = ""; render(); focusField("medQ"); },
    "med-remove": function (v) { U.meds = U.meds.filter(function (m) { return m !== v; }); render(); },
    "s13-continue": function () {
      var list = U.meds.slice();
      if (!list.length) { var t = U.medQ.trim(); if (t) { list = [t]; U.meds = list; U.medQ = ""; } else { setError(C.s13.err); return; } }
      set("medications", list.join(", ")); advance();
    },
    scr: function (v) { multi("screening", v); },
    "scr-none": function () { setNoneAndGo("screening"); },
    "s15-continue": function () { if (!(ans("screening") || []).length) set("screening", ["None"]); advance(); },
    "allergy-pick": function (v) { if (U.allergies.indexOf(v) < 0) U.allergies.push(v); U.allergyQ = ""; U.noAllergy = false; render(); focusField("allergyQ"); },
    "allergy-remove": function (v) { U.allergies = U.allergies.filter(function (a) { return a !== v; }); render(); },
    "allergy-none": function () {
      U.noAllergy = true; U.allergies = []; U.allergyQ = ""; render();
      later(function () { set("allergies", D.NO_ALLERGIES); advance(); }, 250);
    },
    "s16-continue": function () {
      if (U.noAllergy) { set("allergies", D.NO_ALLERGIES); advance(); return; }
      var list = U.allergies.slice();
      if (!list.length) { var t = U.allergyQ.trim(); if (t) { list = [t]; U.allergies = list; U.allergyQ = ""; } else { setError(C.s16.err); return; } }
      set("allergies", list.join(", ")); advance();
    },
    ft: function (v) { set("heightFt", v); render(); },
    "in": function (v) { set("heightIn", v); render(); },
    "s17-continue": function () {
      if (!ans("heightFt") || !ans("heightIn") || !U.weight.trim()) { setError(C.s17.err); return; }
      set("weight", U.weight.trim()); advance();
    },
    emg: function (v) { set("emg", v); render(); advance(250); },
    auto: function (v) { multi("autonomic", v); },
    "auto-none": function () { setNoneAndGo("autonomic"); },
    "s19-continue": function () { if (!(ans("autonomic") || []).length) set("autonomic", ["None"]); advance(); },
    "notes-none": function () { U.notes = U.notes.trim() === C.s20.noQuestions ? "" : C.s20.noQuestions; render(); },
    "s20-continue": function () { set("doctorQuestions", U.notes.trim() || C.s20.noQuestions); advance(); },
    "s20-skip": function () { set("doctorQuestions", C.s20.noQuestions); advance(); },
    "s22-continue": function () {
      if (!U.dobM || !U.dobD || !U.dobY) { setError(C.s22.err); return; }
      set("dob", U.dobM + "/" + U.dobD + "/" + U.dobY); advance();
    },
    "consent-toggle": function () { U.consentOpen = !U.consentOpen; render(); },
    "s9-submit": submitLead,
    "modal-back": function () {
      var m = state.modal; closeModal();
      if (m === "pregnant") { state.answers.pregnant = undefined; }
      if (m === "opioid") { state.answers.currentOpioids = undefined; }
      if (m === "duration") { state.answers.duration = undefined; }
      if (m === "screening") { set("screening", []); }
      if (m === "alcohol") { set("conditions", []); }
      render();
    },
    "modal-confirm": function () {
      var m = D.MODALS[state.modal];
      if (!m || !m.confirm) return;
      var title = m.dq.title, msg = state.modal === "screening" ? D.SCREENING_MSG[state.modalItem] : m.dq.message;
      track("disqualified", { reason: state.modal });
      disqualify(title, msg);
    },
    "start-over": function () { window.location.reload(); },
  };
  function focusField(name) {
    var f = card.querySelector('[data-field="' + name + '"]');
    if (f) f.focus();
  }

  function submitLead() {
    if (state.busy) return;
    var v = validateLead({ name: U.name, email: U.email, phone: U.phone });
    U.fieldErr = v.fields;
    if (!v.ok) { setError(v.message); return; }
    set("name", v.name); set("email", v.email); set("phone", v.phone);
    set("consentTruth", "Agreed"); set("consentTreat", "Agreed");
    state.busy = true; state.errors = {}; render();
    var payload = buildPayload(state.answers, ans("weight"));
    var lead = { email: v.email, phone: v.phone, first_name: v.name.split(" ")[0], last_name: v.name.split(" ").slice(1).join(" ") };
    try {
      sessionStorage.setItem("chime:neuropathy-quiz", JSON.stringify({
        quiz: "neuropathy_assessment", submitted: new Date().toISOString(), lead: lead, answers: state.answers, questions: payload,
      }));
    } catch (e) { /* private mode */ }
    track("lead", lead);
    track("complete_quiz");
    // No backend here (like every other Chime prototype): hand off to the offer
    // page with the reference's own query keys (ue = email, up = phone).
    var qs = new URLSearchParams();
    qs.set("ue", v.email); qs.set("up", v.phone);
    later(function () { window.location.href = "neuropathy-offer.html?" + qs.toString(); }, 500);
  }

  // ---- Events -------------------------------------------------------------
  function onClick(e) {
    var t = e.target.closest("[data-act]");
    if (!t) return;
    var act = t.getAttribute("data-act"), v = t.getAttribute("data-v");
    if (ACTIONS[act]) { e.preventDefault(); ACTIONS[act](v); }
  }
  card.addEventListener("click", onClick);
  if (modalHost) modalHost.addEventListener("click", onClick);
  card.addEventListener("input", function (e) {
    var f = e.target.closest("[data-field]");
    if (!f) return;
    var name = f.getAttribute("data-field");
    U[name] = f.value;
    if (f.hasAttribute("data-ac")) renderAc();
    if (name === "notes" || name === "sideFx") {
      var chip = card.querySelector('[data-act="notes-none"]');
      if (chip) chip.classList.toggle("nq-chipSelected", U.notes.trim() === C.s20.noQuestions);
    }
  });
  card.addEventListener("change", function (e) {
    var f = e.target.closest("select[data-field]");
    if (f) U[f.getAttribute("data-field")] = f.value;
  });
  card.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.target.tagName === "TEXTAREA") return;
    var f = e.target.closest("[data-ac]");
    if (!f) return;
    e.preventDefault();
    var first = card.querySelector(".nq-acItem");
    if (first) { ACTIONS[first.getAttribute("data-act")](first.getAttribute("data-v")); return; }
    var btn = card.querySelector(".nq-btnCta");
    if (btn) btn.click();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.modal && D.MODALS[state.modal].back) ACTIONS["modal-back"]();
  });

  track("start_quiz");
  track("quiz_progress", { step_index: 1, step_name: "sex" });
  render();
})(typeof window !== "undefined" ? window : this);
