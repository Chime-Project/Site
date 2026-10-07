/* Chime Health intake — the reference's pure rules, ported unchanged and kept apart so node can test them
   (js/intake-tests.js): field sanitizers, phone mask and checks, date-of-birth age, per-question validation,
   the contact-form checks, the checkout address checks and the recommendation page's months-to-goal and
   projection points. No DOM, nothing sent. */
(function (root) {
  "use strict";
  var C = root.CHIME_INTAKE;
  function P(v) { return v == null ? "" : String(v); }
  function clampNum(v, max) { var d = String(v).replace(/\D/g, "").slice(0, String(max).length); return d === "" ? "" : String(Math.min(max, Number(d))); }
  function weightOk(a) { var w = Number(a.weight); return w >= 100 && w <= 999; }
  function goalError(g, w) { var a = Number(g), b = Number(w); return a > 0 && b > 0 && a >= b ? "Goal weight must be lower than your current weight." : null; }
  function phoneDigits(v) { var s = v.replace(/\D/g, ""); return (s.charAt(0) === "1" ? s.slice(1) : s).slice(0, 10); }
  function areaOk(x) { return /^[2-9]\d\d$/.test(x) && !/^.11$/.test(x); }
  function phoneOk(v) { var s = phoneDigits(v || ""); return s.length === 10 && areaOk(s.slice(0, 3)) && areaOk(s.slice(3, 6)); }
  function maskPhone(v) {
    var s = v.replace(/\D/g, ""), one = s.charAt(0) === "1"; if (one) s = s.slice(1);
    var r = s.slice(0, 10), pre = one ? "+1 " : "";
    if (!r) return one ? "+1" : "";
    if (r.length < 4) return pre + r;
    if (r.length < 7) return pre + "(" + r.slice(0, 3) + ") " + r.slice(3);
    return pre + "(" + r.slice(0, 3) + ") " + r.slice(3, 6) + "-" + r.slice(6, 10);
  }
  function dobString(a) {
    var m = P(a.dob_month), d = P(a.dob_day), y = P(a.dob_year);
    return m && d && y ? (m.length < 2 ? "0" + m : m) + "/" + (d.length < 2 ? "0" + d : d) + "/" + y : "";
  }
  function ageFrom(s, now) {
    now = now || new Date();
    var m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); if (!m) return null;
    var mo = +m[1], d = +m[2], y = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1920) return null;
    var dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    var age = now.getFullYear() - y;
    if (now.getMonth() < mo - 1 || (now.getMonth() === mo - 1 && now.getDate() < d)) age -= 1;
    return age;
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  // Their per-block validation (ex)
  function blockError(b, a) {
    switch (b.kind) {
      case "measurements": {
        if (!a.feet || a.inches === undefined || a.inches === "" || !weightOk(a)) return "Enter your height and weight";
        var bmi = C.computeBmi(a);
        if (bmi !== null && bmi < 20) return "Your BMI is too low to qualify for GLP-1 treatment";
        return null;
      }
      case "goal-weight": {
        var g = Number(a.goal_weight);
        if (!(g >= 90) || !(g <= 999) || goalError(a.goal_weight, a.weight) !== null) return "Enter a goal weight below your current weight";
        return null;
      }
      case "state": {
        if (!a.state) return "Choose the state your medication would ship to";
        var bl = C.blockedStateMessage(a.state); if (bl) return bl;
        if (!C.isServiceableState(a.state)) return "Service is not available in this state";
        return null;
      }
      case "dob": { var age = ageFrom(dobString(a)); if (age == null || !(age >= 18) || !(age <= 100)) return "Enter your date of birth"; return null; }
      case "choice": return a[b.field] ? null : "Choose an option";
      case "multi": return Array.isArray(a[b.field]) && a[b.field].length ? null : "Choose at least one, or “None of the below”";
      case "details": return String(a[b.field] || "").trim() ? null : "Add a little detail for your provider";
      default: return null;
    }
  }
  function stepErrors(step, a) {
    var e = {};
    if (step.kind === "screening") {
      C.visibleBlocks(step.blocks, a).forEach(function (b) { var m = blockError(b, a); if (m) e[b.field || b.id] = m; });
      return e;
    }
    if (step.kind === "results-contact") {
      if (!String(a.first_name || "").trim()) e.first_name = "Enter your first name";
      if (!String(a.last_name || "").trim()) e.last_name = "Enter your last name";
      if (!EMAIL_RE.test(String(a.email || "").trim())) e.email = "Enter a valid email address";
      if (!phoneOk(String(a.phone || ""))) e.phone = "Enter a valid phone number";
    }
    return e;
  }


  // months to goal (their d / c)
  function estMonths(w, g, bmi) {
    if (!w || !g || g >= w) return null;
    var r = bmi ? (bmi >= 40 ? { low: 6, high: 9 } : bmi >= 35 ? { low: 5, high: 8 } : bmi >= 30 ? { low: 4.5, high: 7 } : { low: 4, high: 6 }) : { low: 4.5, high: 7 };
    return Number(((w - g) / ((r.low + r.high) / 2)).toFixed(1));
  }
  function medMonths(w, g, bmi, m) {
    var n = estMonths(w, g, bmi), s = Math.max(1, Math.ceil(Number(n == null ? 0 : n)));
    if (w && g && !(g >= w)) return m === "tirzepatide" ? s : Math.max(s + 2, Math.ceil(1.25 * s));
    return n ? s : 0;
  }
  function points(w0, g0, months) {
    var t = Math.round(Number(w0 || 0)), gi = Math.round(Number(g0 || 0));
    var i = !Number.isFinite(t) || !Number.isFinite(gi) ? 0 : gi >= t ? Math.max(90, t - 5) : Math.max(90, gi);
    if (!t || !i) return [];
    var r = Math.max(Math.round(Number(months || 0)), 2);
    if (r === 2) return [{ month: "M1", weight: t }, { month: "M2", weight: i }];
    var n = t - i, s = r - 1;
    var a = Array.from({ length: s }, function (_, k) { var x = s === 1 ? 1 : k / (s - 1); return 3 + x * x * (3 - 2 * x) * 5; });
    var l = a.reduce(function (p, q) { return p + q; }, 0), o = a.map(function (x) { return n * x / l; });
    var d = [{ month: "M1", weight: t }], c = 0;
    for (var e = 0; e < s; e++) { c += o[e]; d.push({ month: "M" + (e + 2), weight: e === s - 1 ? i : Math.round(t - c) }); }
    var h = d.map(function (p, k) {
      if (k === 0) return { month: p.month, weight: t };
      if (k === d.length - 1) return { month: p.month, weight: i };
      return { month: p.month, weight: Math.max(Math.min(d[k - 1].weight - 1, p.weight), i) };
    });
    for (var k = 1; k < h.length - 1; k++) h[k].weight = Math.max(i, Math.min(h[k].weight, h[k - 1].weight - 1));
    h[0].weight = t; h[h.length - 1].weight = i;
    return h;
  }

  // their address helpers
  function sanitizeText(e, n) { return String(e || "").replace(/[<>]/g, "").replace(/\s{2,}/g, " ").slice(0, n); }
  function sanitizeZip(e) { return String(e || "").replace(/\D/g, "").slice(0, 5); }
  function isComplete(a) { return !!a.addressLine1 && !!a.city && !!a.state && sanitizeZip(a.zip).length === 5; }
  function isPoBox(v) {
    var t = String(v || "").toUpperCase().replace(/[.,#/-]/g, " ").replace(/\s+/g, " ").trim(), r = t.replace(/\s+/g, "");
    return /\bP\s*O\s*BOX\b/.test(t) || /\bPOST\s+OFFICE\s+BOX\b/.test(t) || r.indexOf("POBOX") > -1 || r.indexOf("POSTOFFICEBOX") > -1;
  }
  function poBoxMessage(a) { return isPoBox(a.addressLine1) || isPoBox(a.addressLine2) ? "We do not ship to PO boxes" : ""; }
  var STATE_NAMES = { LOUISIANA: "LA", MISSISSIPPI: "MS" };
  function blockedState(a) {
    var t = String(a.state || "").toUpperCase().replace(/[^A-Z ]/g, "").trim();
    return t && ["LA", "MS"].indexOf(STATE_NAMES[t] || t) > -1 ? "Service is not available in this state" : "";
  }
  function resolveState(e) {
    var t = String(e || "").toUpperCase().replace(/[^A-Z ]/g, "").replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (STATE_NAMES[t]) return STATE_NAMES[t];
    if (t.length >= 3) { var k = Object.keys(STATE_NAMES).find(function (n) { return n.indexOf(t) === 0; }); if (k) return STATE_NAMES[k]; }
    return t.slice(0, 2);
  }
  function addressError(a) {
    if (!isComplete(a)) return "Complete the shipping address.";
    return poBoxMessage(a) || blockedState(a) || "";
  }


  root.CHIME_INTAKE_RULES = { clampNum: clampNum, weightOk: weightOk, goalError: goalError, phoneDigits: phoneDigits, phoneOk: phoneOk,
    maskPhone: maskPhone, dobString: dobString, ageFrom: ageFrom, blockError: blockError, stepErrors: stepErrors, EMAIL_RE: EMAIL_RE,
    estMonths: estMonths, medMonths: medMonths, points: points,
    sanitizeText: sanitizeText, sanitizeZip: sanitizeZip, isComplete: isComplete, poBoxMessage: poBoxMessage, blockedState: blockedState,
    resolveState: resolveState, addressError: addressError };
})(typeof window !== "undefined" ? window : globalThis);
