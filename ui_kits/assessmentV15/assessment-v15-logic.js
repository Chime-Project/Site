// Chime Health — Assessment v15 routing engine (pure functions).
// Zero DOM/React references: the same file runs under Node for the test
// runner (assessment-v15-tests.js) and in the browser as a plain <script>.
// Loads AFTER assessment-v15-data.js and reads config through
// CHIME_ASSESSMENT_V15.
//
// Answer state: one object keyed by screen id. Satellite values that belong
// to a screen use "<screen id>__<name>" (e.g. "B2__text", "C-WL.1__med"),
// so they live and die with their screen in asmtV15Prune.
//   P0.1: { dob: "MM/DD/YYYY", state }        P0.2: { npp, terms, share, … } | { declined }
//   A1: [goal]  A2.1: "Female"|"Male"  A2.2: "Yes"|"No"  A2.3: { heightFt, heightIn, weightLbs }
//   A2: { firstName, lastName, email, phone, sms, personalized }
//   multi-selects: [values] · single-selects: value · consents: { agreed, version, ts }
//
// Compliance invariants:
//   - nothing here returns a numeric BMI or a clinical label for rendering;
//     BMI stays inside the gate functions, tiers are internal ids.
//   - SENSITIVE answers (A2.2, B6b) are never persisted client-side: see
//     asmtV15Persistable. An under-age respondent persists nothing at all.

(function (g) {

  var CFG = function () { return g.CHIME_ASSESSMENT_V15; };

  function v15ScreenById(id) {
    var s = CFG().screens;
    for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i];
    return null;
  }

  function screenKeyOf(k) { return String(k).split("__")[0]; }

  function picked(answers, id) {
    var v = answers[id];
    return Array.isArray(v) ? v : [];
  }

  // Any real pick on a multi-select, i.e. something other than its exclusive
  // "None" option.
  function anyReal(answers, id) {
    var s = v15ScreenById(id), list = picked(answers, id);
    for (var i = 0; i < list.length; i++) if (!s || list[i] !== s.exclusive) return true;
    return false;
  }

  // -------------------------------------------------------------------------
  // P0.1 · date of birth, age, state
  // -------------------------------------------------------------------------
  function v15MaskDob(raw) {
    var d = String(raw || "").replace(/\D/g, "").slice(0, 8);
    if (d.length > 4) return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
    if (d.length > 2) return d.slice(0, 2) + "/" + d.slice(2);
    return d;
  }

  function v15ParseDate(str) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(str || "").trim());
    if (!m) return null;
    var mo = +m[1], da = +m[2], yr = +m[3];
    var dt = new Date(yr, mo - 1, da);
    if (dt.getFullYear() !== yr || dt.getMonth() !== mo - 1 || dt.getDate() !== da) return null;
    return dt;
  }

  // `now` is injectable so the tests do not depend on today's date.
  function v15AgeFromDob(str, now) {
    var dob = v15ParseDate(str);
    if (!dob) return NaN;
    now = now || new Date();
    var age = now.getFullYear() - dob.getFullYear();
    if (now.getMonth() < dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) age--;
    return age;
  }

  function v15Age(answers, now) {
    return v15AgeFromDob((answers["P0.1"] || {}).dob, now);
  }

  function v15MinAge(state) {
    var c = CFG();
    return c.minAgeByState[state] || c.minAge;
  }

  // True only once DOB + state are both in and the person is under the floor.
  function v15IsMinor(answers, now) {
    var b = answers["P0.1"] || {};
    var age = v15Age(answers, now);
    if (isNaN(age) || !b.state) return false;
    return age < v15MinAge(b.state);
  }

  function v15Modality(state) {
    var c = CFG();
    return c.stateModality[state] || c.defaultModality;
  }

  // -------------------------------------------------------------------------
  // A2.3 · body inputs, GREEN LIGHT, tiers (BMI is internal — never rendered)
  // -------------------------------------------------------------------------
  function v15Bmi(answers) {
    var b = answers["A2.3"], r = CFG().bodyRanges;
    if (!b) return NaN;
    var lbs = parseFloat(b.weightLbs), ft = parseFloat(b.heightFt), inch = parseFloat(b.heightIn);
    if (!(ft > 0) || isNaN(lbs)) return NaN;
    var totalIn = ft * 12 + (isNaN(inch) ? 0 : inch);
    if (lbs < r.weightMin || lbs > r.weightMax) return NaN;
    if (totalIn < r.heightInMin || totalIn > r.heightInMax) return NaN;
    return (703 * lbs) / (totalIn * totalIn);
  }

  // "pass" | "fail" | null (inputs incomplete).
  function v15GreenLight(answers, now) {
    var bmi = v15Bmi(answers), age = v15Age(answers, now), gl = CFG().greenLight;
    if (isNaN(bmi) || isNaN(age)) return null;
    var floor = age >= gl.elderlyAge ? gl.minBmiElderly : gl.minBmi;
    return bmi > floor ? "pass" : "fail";
  }

  function v15IsElderly(answers, now) {
    var age = v15Age(answers, now);
    return !isNaN(age) && age >= CFG().greenLight.elderlyAge;
  }

  function v15SnapshotContent(answers) {
    var bmi = v15Bmi(answers);
    if (isNaN(bmi)) return null;
    var tiers = CFG().bmiTiers;
    for (var i = 0; i < tiers.length; i++)
      if (bmi >= tiers[i].min && bmi < tiers[i].max)
        return { headline: tiers[i].headline, message: tiers[i].message };
    return null;
  }

  function v15BodyProblem(body) {
    var r = CFG().bodyRanges;
    if (!body) return null;
    var lbs = parseFloat(body.weightLbs), ft = parseFloat(body.heightFt), inch = parseFloat(body.heightIn);
    if (!isNaN(lbs) && (lbs < r.weightMin || lbs > r.weightMax))
      return "That weight looks outside the range we can work with (" + r.weightMin + "–" + r.weightMax + " lbs) — mind double-checking it?";
    if (ft > 0) {
      var totalIn = ft * 12 + (isNaN(inch) ? 0 : inch);
      if (totalIn < r.heightInMin || totalIn > r.heightInMax)
        return "That height looks outside the range we can work with (3'0\"–8'0\") — mind double-checking it?";
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // C-WL.0 · weight-medication indication gate (no screen; evaluated after
  // C-WL.7). "pass" | "fail" | null (not evaluable yet).
  // -------------------------------------------------------------------------
  function v15Indication(answers) {
    var c7 = answers["C-WL.7"];
    if (!c7) return null;
    if (c7 !== "None of the above") return "pass"; // current GLP-1 patients continuing care
    var bmi = v15Bmi(answers), t = CFG().indication;
    if (isNaN(bmi)) return null;
    if (bmi >= t.bmi) return "pass";
    if (bmi >= t.bmiWithCondition && anyReal(answers, "C-WL.3.2")) return "pass";
    return "fail";
  }

  // -------------------------------------------------------------------------
  // Consents triggered by C-WL.3.1, de-duplicated, in the doc's order.
  // -------------------------------------------------------------------------
  function v15RelativeConsents(answers) {
    var map = CFG().relativeConsents, out = [];
    var order = v15ScreenById("C-WL.3.1").options;
    var list = picked(answers, "C-WL.3.1");
    order.forEach(function (opt) {
      if (list.indexOf(opt) < 0) return;
      (map[opt] || []).forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); });
    });
    return out;
  }

  function v15HasWeightGoal(answers) {
    var goals = picked(answers, "A1"), wl = CFG().wlGoals;
    for (var i = 0; i < goals.length; i++) if (wl.indexOf(goals[i]) >= 0) return true;
    return false;
  }

  // -------------------------------------------------------------------------
  // The ordered screen queue. Gates are evaluated only once answered; a
  // failing gate ends the queue on its exit screen (exits are terminal).
  // -------------------------------------------------------------------------
  function v15Queue(answers, now) {
    var c = CFG(), q = ["P0.0", "P0.1"];
    var basics = answers["P0.1"] || {};
    if (v15IsMinor(answers, now)) return q.concat("EXIT.minor");
    if (basics.state && c.unservedStates.indexOf(basics.state) >= 0) return q.concat("EXIT.state");
    q.push("P0.2");
    if ((answers["P0.2"] || {}).declined) return q.concat("EXIT.privacy");

    q.push("A1");
    if (picked(answers, "A1").length && !v15HasWeightGoal(answers)) {
      q.push("A.SCOPE");
      if (answers["A.SCOPE"] !== "continue") return q;
    }
    q.push("A2.1");
    if (answers["A2.1"] === c.asksPregnancy) {
      q.push("A2.2");
      if (answers["A2.2"] === "Yes") return q.concat("DQ.A");
    }
    q.push("A2.3");
    var gl = v15GreenLight(answers, now);
    if (gl === "fail") return q.concat("DQ.BMI");
    if (gl === "pass" && v15IsElderly(answers, now)) q.push("A2.3E");
    q = q.concat(["A2", "A2.4", "A2.5", "A3", "A4", "A5"]);

    q = q.concat(["B1", "B2", "B3", "B4", "B5", "B6a"]);
    if (anyReal(answers, "B6a")) return q.concat("DQ.D");
    q.push("B6b");
    if (answers.B6b === "Yes") return q.concat("DQ.B");
    q = q.concat(["B7", "B8", "B9"]);

    q = q.concat(["C-WL.1", "C-WL.2", "C-WL.3"]);
    if (anyReal(answers, "C-WL.3")) return q.concat("DQ.D");
    q.push("C-WL.3.1");
    // Each relative contraindication shows its consent right away, while the
    // condition is still on the person's mind (doc: "Each selection shows its
    // consent AND flags the case").
    v15RelativeConsents(answers).forEach(function (id) { q.push("CONSENT." + id); });
    q = q.concat(["C-WL.3.2", "C-WL.4"]);
    if (answers["C-WL.4"] === "Yes") return q.concat("DQ.BASE");
    q.push("C-WL.5");
    if (anyReal(answers, "C-WL.5")) return q.concat("DQ.C");
    q = q.concat(["C-WL.6", "C-WL.7"]);
    if (v15Indication(answers) === "fail") return q.concat("DQ.BMI");
    if (answers["C-WL.7"] && answers["C-WL.7"] !== "None of the above")
      q = q.concat(["C-WL.8", "C-WL.9", "C-WL.10", "C-WL.11"]);
    // The doc lists Truthfulness + the GLP-1 consent both here and again at
    // D2; each is shown once, here, where the C-WL row places them.
    q = q.concat(["CONSENT.truthfulness", "CONSENT.glp1", "C-WL.END"]);

    q = q.concat(["D.PRE", "D1", "D1.5"]);
    if (basics.state && v15Modality(basics.state) === "video") q.push("D1.6");
    return q.concat(["D2.telehealth", "D.POST", "E"]);
  }

  // Consent screens are generated per trigger, so their config is resolved
  // from the id rather than listed one by one.
  function v15Screen(id) {
    var s = v15ScreenById(id);
    if (s) return s;
    var m = /^CONSENT\.(.+)$/.exec(id);
    if (m && CFG().consents[m[1]])
      return { id: id, block: "C", type: "consent", label: "c-wl-consent-" + m[1], consent: m[1] };
    return null;
  }

  // Drop answers whose screens are no longer reachable, so a stale answer can
  // never reach the result or the payload. Runs to a fixpoint: pruning one
  // answer can shrink the queue again.
  function v15Prune(answers, now) {
    var out = {}, k;
    for (k in answers) out[k] = answers[k];
    for (var pass = 0; pass < 10; pass++) {
      var queue = v15Queue(out, now), changed = false;
      for (k in out) {
        var sk = screenKeyOf(k);
        if (!v15Screen(sk)) continue;
        if (queue.indexOf(sk) < 0) { delete out[k]; changed = true; }
      }
      // Reveal texts survive only while their trigger option is still picked.
      for (k in out) {
        var parts = String(k).split("__");
        if (parts.length < 2) continue;
        var scr = v15Screen(parts[0]);
        if (!scr) continue;
        if (parts[1] === "text" && scr.reveal && scr.type !== "journey" &&
            scr.reveal.when.indexOf(out[parts[0]]) < 0) { delete out[k]; changed = true; }
        if (scr.type === "journey") {
          var open = scr.reveal.when.indexOf(out[parts[0]]) >= 0;
          if (parts[1] === "med" && !open) { delete out[k]; changed = true; }
          if (parts[1] === "medText" && scr.reveal.freeText.indexOf(out[parts[0] + "__med"]) < 0) { delete out[k]; changed = true; }
        }
        if (parts[1] === "share" && scr.shareConsent && out[parts[0]] !== scr.shareConsent.when) { delete out[k]; changed = true; }
        if (parts[1] === "file" && out[parts[0]] !== "Yes") { delete out[k]; changed = true; }
      }
      if (!changed) break;
    }
    return out;
  }

  function v15FirstIncomplete(answers, now) {
    var q = v15Queue(answers, now);
    for (var i = 0; i < q.length; i++) if (answers[q[i]] === undefined) return q[i];
    return q[q.length - 1];
  }

  function v15BlockIndex(id) {
    var s = v15Screen(id), blocks = CFG().blocks;
    if (!s) return 0;
    for (var i = 0; i < blocks.length; i++) if (blocks[i].id === s.block) return i;
    return 0;
  }

  // What may be written to localStorage. Sensitive answers stay in memory
  // only; an under-age respondent, or one who declined P0.2, stores nothing.
  function v15Persistable(answers, now) {
    if (v15IsMinor(answers, now) || (answers["P0.2"] || {}).declined) return null;
    var out = {}, k;
    for (k in answers) {
      var s = v15Screen(screenKeyOf(k));
      if (s && s.sensitive) continue;
      out[k] = answers[k];
    }
    return out;
  }

  // -------------------------------------------------------------------------
  // Validation: the message Continue shows, or null when the screen is done.
  // -------------------------------------------------------------------------
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function v15ContactProblems(a2) {
    var d = a2 || {}, out = {}, any = false;
    function need(f, label) {
      var v = String(d[f] || "").trim();
      var msg = "";
      if (!v) msg = "Please add your " + label + ".";
      else if (f === "email" && !isEmail(v)) msg = "That email doesn’t look complete — mind double-checking it?";
      else if (f === "phone" && v.replace(/\D/g, "").length < 10) msg = "That phone number looks short — mind double-checking it?";
      if (msg) { out[f] = msg; any = true; }
    }
    need("firstName", "first name"); need("lastName", "last name");
    need("email", "email"); need("phone", "phone number");
    return any ? out : null;
  }

  function v15AddressProblems(d1, residenceState) {
    var d = d1 || {}, out = {}, any = false;
    [["address1", "street address"], ["city", "city"], ["state", "state"], ["zip", "ZIP code"]].forEach(function (p) {
      if (!String(d[p[0]] || "").trim()) { out[p[0]] = "Please add your " + p[1] + "."; any = true; }
    });
    if (d.zip && !/^\d{5}$/.test(String(d.zip).trim())) { out.zip = "Please enter a 5-digit ZIP code."; any = true; }
    // "Address state ≠ P0.1 state → reroute or stop per modality matrix."
    // The matrix does not exist yet, so this stops and explains (draft copy).
    if (d.state && residenceState && d.state !== residenceState) {
      out.state = "Your address needs to be in " + residenceState + ", the state you told us you live in. If you’ve moved, go back to the start and update your state.";
      any = true;
    }
    return any ? out : null;
  }

  function v15PasswordProblem(pw, confirm) {
    if (!pw) return "Please create a password.";
    if (pw.length < 8) return "Please use at least 8 characters.";
    if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Please include at least one letter and one number.";
    if (pw !== confirm) return "Those passwords don’t match yet.";
    return null;
  }

  // `ctx` carries in-memory values the answers never hold: the password
  // pair and whether a prescription file is attached.
  function v15ScreenProblem(id, answers, ctx, now) {
    var s = v15Screen(id), a = answers[id];
    ctx = ctx || {};
    if (!s) return null;
    switch (s.type) {
      case "basics": {
        var b = a || {};
        if (!v15ParseDate(b.dob)) return "Please enter your date of birth as MM/DD/YYYY.";
        var age = v15AgeFromDob(b.dob, now);
        if (age > 120 || age < 0) return "That date of birth looks off — mind double-checking it?";
        if (!b.state) return "Please choose the state you live in.";
        return null;
      }
      case "privacy": {
        var p = a || {}, missing = s.boxes.filter(function (bx) { return !p[bx.key]; });
        return missing.length ? "Please check all three boxes to continue." : null;
      }
      case "cards":
      case "multi":
        return picked(answers, id).length ? null : "Please choose at least one option to continue.";
      case "single":
        if (!a) return s.optionalAnswer ? null : "Please choose an option to continue.";
        if (s.reveal && s.reveal.when.indexOf(a) >= 0 && !String(answers[id + "__text"] || "").trim())
          return "Please add a few details to continue.";
        return null;
      case "journey":
        if (!a) return "Please choose an option to continue.";
        if (s.reveal.when.indexOf(a) >= 0) {
          var med = answers[id + "__med"];
          if (!med) return "Please tell us which medication to continue.";
          if (s.reveal.freeText.indexOf(med) >= 0 && !String(answers[id + "__medText"] || "").trim())
            return "Please tell us which medication — or choose another option.";
        }
        return null;
      case "body": {
        var prob = v15BodyProblem(a);
        if (prob) return prob;
        return isNaN(v15Bmi(answers)) ? "Please add your height and weight to continue." : null;
      }
      case "contact": return v15ContactProblems(a) ? "A few details above still need a look." : null;
      case "password": return v15PasswordProblem(ctx.password, ctx.confirm);
      case "selects": {
        var sel = a || {};
        for (var i = 0; i < s.selects.length; i++) if (!sel[s.selects[i].key]) return "Please choose an answer for both questions.";
        return null;
      }
      case "dose": {
        if (!a) return "Please choose the dose that matches most closely.";
        if (!v15ParseDate(answers[id + "__last"])) return "Please enter the date of your last dose as MM/DD/YYYY.";
        if (!String(answers[id + "__duration"] || "").trim()) return "Please tell us how long you’ve been on this dose.";
        return null;
      }
      case "upload":
        if (!a) return "Please choose an option to continue.";
        if (a === "Yes" && !ctx.hasFile && !answers[id + "__file"]) return "Please add a photo of your prescription or bottle.";
        return null;
      case "consent": return a && a.agreed ? null : "Please check the box to continue.";
      case "address":
        return v15AddressProblems(a, (answers["P0.1"] || {}).state) ? "A few details above still need a look." : null;
      case "idverify": {
        var v = a || {};
        if (v.method === "other") return null;
        return v.method === "selfie" && v.biometricConsent ? null
          : "Please agree to the selfie check, or choose to verify another way.";
      }
      default: return null;
    }
  }

  // -------------------------------------------------------------------------
  // Clinical + compliance outputs for the backend (Devin's team)
  // -------------------------------------------------------------------------
  // Everything that must put the case in front of a provider before any
  // prescription. Plain strings, clinical record only.
  function v15ProviderFlags(answers, now) {
    var out = [];
    picked(answers, "C-WL.3.1").forEach(function (v) { if (v !== "None of the above") out.push("Relative contraindication: " + v); });
    picked(answers, "C-WL.6").forEach(function (v) { if (v !== "None of these") out.push("Diabetes medication (hypoglycemia / duplicate therapy): " + v); });
    if (answers["C-WL.8"] === "Yes") out.push("Side effects on current medication");
    if (answers["C-WL.11"] === "No") out.push("No prescription photo — follow-up or restart titration");
    if (anyReal(answers, "C-WL.3")) out.push("Absolute exclusion reported at C-WL.3");
    if (v15IsElderly(answers, now)) out.push("Age 65+");
    return out;
  }

  // Who must be kept out of path-specific nurture (build requirement 6).
  function v15Suppression(answers, now) {
    var q = v15Queue(answers, now), last = q[q.length - 1], reasons = [];
    if (/^(DQ|EXIT)\./.test(last) && last !== "EXIT.state") reasons.push(last);
    if (answers["A2.2"] === "Yes") reasons.push("pregnancy (A2.2)");
    if (answers.B6b === "Yes") reasons.push("B6b");
    if (!(answers.A2 || {}).personalized) reasons.push("no health-personalized marketing consent");
    return { suppress: reasons.length > 0, reasons: reasons };
  }

  function v15Consents(answers) {
    var out = {}, k;
    for (k in answers) {
      var s = v15Screen(k);
      if (s && s.type === "consent" && answers[k] && answers[k].agreed) out[s.consent] = answers[k];
    }
    if (answers["P0.2"] && !answers["P0.2"].declined) out.privacy = answers["P0.2"];
    if (answers.A2) {
      if (answers.A2.sms) out.smsMarketing = { agreed: true, version: CFG().consentVersion };
      if (answers.A2.personalized) out.healthPersonalizedMarketing = { agreed: true, version: CFG().consentVersion };
    }
    if (answers["D1.5"] && answers["D1.5"].biometricConsent) out.biometric = answers["D1.5"];
    return out;
  }

  // The object "Go To My Account" hands to window.chimeAssessmentSubmit.
  // `clinical` goes to the clinical record ONLY; `contact` is the part a CRM
  // may hold, and holds no health data.
  function v15Payload(answers, now) {
    var a2 = answers.A2 || {};
    return {
      version: CFG().consentVersion,
      residence: answers["P0.1"] || null,
      modality: v15Modality((answers["P0.1"] || {}).state),
      contact: { firstName: a2.firstName, lastName: a2.lastName, email: a2.email, phone: a2.phone },
      shipping: answers.D1 || null,
      clinical: answers,
      consents: v15Consents(answers),
      providerFlags: v15ProviderFlags(answers, now),
      suppression: v15Suppression(answers, now),
      idVerification: answers["D1.5"] || null,
    };
  }

  // -------------------------------------------------------------------------
  // Block E composition. No BMI, no tier, no drug name in the headline.
  // -------------------------------------------------------------------------
  function joinList(items) {
    var list = items.map(function (s) { return s.charAt(0).toLowerCase() + s.slice(1); });
    if (list.length <= 1) return list.join("");
    return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
  }

  function v15WhyBullets(answers) {
    var why = CFG().result.why, out = [];
    var j = answers["C-WL.1"];
    if (j && why.journey[j]) out.push(why.journey[j]);
    var hard = picked(answers, "C-WL.2");
    if (hard.length) out.push(why.struggles.lead + joinList(hard) + why.struggles.tail);
    var feel = picked(answers, "A3");
    if (feel.length) out.push(why.feelMore.lead + joinList(feel) + why.feelMore.tail);
    return out.slice(0, 4);
  }

  function v15Result(answers) {
    var r = CFG().result;
    return {
      headline: r.headline, underHeadline: r.underHeadline,
      bullets: v15WhyBullets(answers), nextSteps: r.nextSteps,
      offerItems: r.offerItems, recurringAck: r.recurringAck,
      disclosures: r.disclosures, cta: r.cta,
    };
  }

  // Structured console events; ids only, never answers (Zone 2: nothing
  // health-related leaves the page through analytics).
  function v15Track(event, payload) {
    var record = { event: event, ts: new Date().toISOString() };
    for (var k in (payload || {})) record[k] = payload[k];
    if (typeof console !== "undefined" && console.info) console.info("[assessment-v15]", record);
    return record;
  }

  g.asmtV15Screen = v15Screen;
  g.asmtV15MaskDob = v15MaskDob;
  g.asmtV15ParseDate = v15ParseDate;
  g.asmtV15AgeFromDob = v15AgeFromDob;
  g.asmtV15IsMinor = v15IsMinor;
  g.asmtV15Modality = v15Modality;
  g.asmtV15Bmi = v15Bmi;
  g.asmtV15GreenLight = v15GreenLight;
  g.asmtV15IsElderly = v15IsElderly;
  g.asmtV15SnapshotContent = v15SnapshotContent;
  g.asmtV15BodyProblem = v15BodyProblem;
  g.asmtV15Indication = v15Indication;
  g.asmtV15RelativeConsents = v15RelativeConsents;
  g.asmtV15HasWeightGoal = v15HasWeightGoal;
  g.asmtV15Queue = v15Queue;
  g.asmtV15Prune = v15Prune;
  g.asmtV15FirstIncomplete = v15FirstIncomplete;
  g.asmtV15BlockIndex = v15BlockIndex;
  g.asmtV15Persistable = v15Persistable;
  g.asmtV15ContactProblems = v15ContactProblems;
  g.asmtV15AddressProblems = v15AddressProblems;
  g.asmtV15PasswordProblem = v15PasswordProblem;
  g.asmtV15ScreenProblem = v15ScreenProblem;
  g.asmtV15ProviderFlags = v15ProviderFlags;
  g.asmtV15Suppression = v15Suppression;
  g.asmtV15Consents = v15Consents;
  g.asmtV15Payload = v15Payload;
  g.asmtV15Result = v15Result;
  g.asmtV15Track = v15Track;

})(typeof window !== "undefined" ? window : globalThis);
