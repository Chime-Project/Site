// Chime Health — Assessment v4 routing engine + scoring (pure functions).
// Zero DOM/React references: the same file runs under Node for the test
// runner (assessment-v4-tests.js) and in the browser as a plain <script>.
// Loads AFTER assessment-v4-data.js — reads config through CHIME_ASSESSMENT_V4.
//
// Answer state shape (single object, persisted by the flow component):
//   A1: [goal, …]            A2: [option, …]        A2F: "labs" | "coaching"
//   A3: { firstName, lastName, email, phone, address1, address2, city, zip,
//         state, sex, dob }
//   A4: [feeling, …]         A5: option             A6: { weightLbs, heightFt, heightIn }
//   "B1.1": [..] · "B1.2": "Yes"/"No" · "B1.3": option · "B1.3_other": text ·
//   "B1.4": dose · "B1.5": [..] · "B2.1".. etc. per screen id.
//   Phrase/placeholder screens store `true` when their CTA is pressed, so
//   restore can land on the first incomplete screen.
//
// Compliance invariant: nothing here ever returns a numeric BMI or clinical
// label for rendering or analytics — only internal tier ids.

(function (g) {

  var CFG = function () { return g.CHIME_ASSESSMENT_V4; };

  function v4ScreenById(id) {
    var s = CFG().screens;
    for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i];
    return null;
  }

  // -------------------------------------------------------------------------
  // Block B branch queue
  // -------------------------------------------------------------------------

  // A1 goals → deduped branch list in canonical order B1 → B2 → B3 → B4.
  function v4GoalBranches(goals) {
    var map = CFG().goalBranchMap, want = {};
    (goals || []).forEach(function (goal) {
      var b = map[goal];
      if (b) want[b] = true;
    });
    return CFG().canonicalBranches.filter(function (b) { return want[b]; });
  }

  // medicationEligible=false the moment A2 carries any disqualifying option.
  function v4MedicationEligible(answers) {
    var a2 = answers.A2 || [];
    for (var i = 0; i < a2.length; i++) if (a2[i] !== "None of the above") return false;
    return true;
  }

  // Insertions triggered by a completed branch's answers.
  function v4BranchInsertions(branch, answers) {
    var cfg = CFG(), out = [];
    if (branch === "B1") {
      var b15 = answers["B1.5"] || [];
      for (var i = 0; i < b15.length; i++)
        if (cfg.b15InsertValues.indexOf(b15[i]) >= 0) { out.push(cfg.b15InsertBranch); break; }
    }
    if (branch === "B2" && cfg.b23InsertValues.indexOf(answers["B2.3"]) >= 0)
      out = out.concat(cfg.b23InsertBranches);
    return out;
  }

  // The ordered branch walk: base queue from A1 (canonical, deduped), then a
  // simulation that applies each walked branch's insertions. Inserted branches
  // join the REMAINING queue in canonical order and can never duplicate a
  // completed or pending branch. The A2 fork overrides everything:
  //   labs     → queue forced to [B3] only        // ASSUMPTION — confirm
  //   coaching → Block B skipped entirely         // ASSUMPTION — confirm
  function v4BranchWalk(answers) {
    var cfg = CFG();
    if (!v4MedicationEligible(answers)) {
      if (answers.A2F === "labs") return ["B3"];
      if (answers.A2F === "coaching") return [];
      // Fork not yet chosen: nothing beyond it is promised.
      return [];
    }
    var pending = v4GoalBranches(answers.A1);
    var walked = [];
    while (pending.length) {
      var b = pending.shift();
      walked.push(b);
      v4BranchInsertions(b, answers).forEach(function (ins) {
        if (walked.indexOf(ins) < 0 && pending.indexOf(ins) < 0) pending.push(ins);
      });
      pending = cfg.canonicalBranches.filter(function (c) { return pending.indexOf(c) >= 0; });
    }
    return walked;
  }

  // Screens of one branch given the current answers (conditional skips live
  // here: B1.2 "No" → B1.5 · B1.3 "Others" → skip B1.4 · B3.1 skip value →
  // remainder of B3 including the ✦ closer).
  function v4BranchScreens(branch, answers) {
    var cfg = CFG();
    if (branch === "B1") {
      var ids = ["B1.1", "B1.2"];
      if (answers["B1.2"] === cfg.b12ShowValue) {
        ids.push("B1.3");
        if (answers["B1.3"] && answers["B1.3"] !== cfg.b13OtherValue) ids.push("B1.4");
      }
      return ids.concat(["B1.5", "B1.C"]);
    }
    if (branch === "B2") return ["B2.1", "B2.2", "B2.3", "B2.C"];
    if (branch === "B3") {
      if (answers["B3.1"] === cfg.b31SkipValue) return ["B3.1"];
      return ["B3.1", "B3.2", "B3.3", "B3.C"];
    }
    if (branch === "B4") return ["B4.1", "B4.2", "B4.3", "B4.C"];
    return [];
  }

  // -------------------------------------------------------------------------
  // The full ordered screen queue for an answer state
  // -------------------------------------------------------------------------
  function v4Queue(answers) {
    var ids = ["A1", "A2"];
    if (!v4MedicationEligible(answers)) ids.push("A2F");
    ids = ids.concat(["A3", "A4", "A5", "A6"]);
    if (v4SnapshotTier(answers) === "flag") ids.push("A6P");
    ids.push("A7");
    v4BranchWalk(answers).forEach(function (b) {
      ids = ids.concat(v4BranchScreens(b, answers));
    });
    return ids.concat(["C.PRE", "C1", "C2", "C3", "C.POST", "D"]);
  }

  // Drop answers whose screens are no longer reachable, so a stale answer can
  // never ride into Block D scoring (same invariant as the v1 engine). Runs to
  // a fixpoint: pruning one answer can shrink the queue again.
  function v4Prune(answers) {
    var out = {}, k;
    for (k in answers) out[k] = answers[k];
    for (var pass = 0; pass < 8; pass++) {
      var queue = v4Queue(out), changed = false;
      for (k in out) {
        var screenKey = k === "B1.3_other" ? "B1.3" : k;
        if (!v4ScreenById(screenKey)) continue; // not a screen-keyed answer
        if (queue.indexOf(screenKey) < 0) { delete out[k]; changed = true; }
      }
      if (out["B1.3_other"] !== undefined && out["B1.3"] !== CFG().b13OtherValue) {
        delete out["B1.3_other"]; changed = true;
      }
      if (!changed) break;
    }
    return out;
  }

  // First screen in the queue with no stored answer — the restore fallback.
  function v4FirstIncomplete(answers) {
    var queue = v4Queue(answers);
    for (var i = 0; i < queue.length; i++)
      if (answers[queue[i]] === undefined) return queue[i];
    return queue[queue.length - 1];
  }

  function v4BlockIndex(screenId) {
    var s = v4ScreenById(screenId);
    if (!s) return 0;
    for (var i = 0; i < CFG().blocks.length; i++)
      if (CFG().blocks[i].id === s.block) return i;
    return 0;
  }

  // -------------------------------------------------------------------------
  // A6 · Quick Snapshot (BMI is INTERNAL — tier ids only, never rendered)
  // -------------------------------------------------------------------------
  function v4TotalInches(a6) {
    if (!a6) return NaN;
    var ft = parseFloat(a6.heightFt), inch = parseFloat(a6.heightIn);
    if (!(ft > 0)) return NaN;
    return ft * 12 + (isNaN(inch) ? 0 : inch);
  }

  // "balanced" | "room" | "build" | "flag", or null while inputs are missing
  // or outside the sane ranges (weight 50–700 lbs, height 3'0"–8'0").
  function v4SnapshotTier(answers) {
    var a6 = answers.A6, r = CFG().snapshotRanges;
    if (!a6) return null;
    var lbs = parseFloat(a6.weightLbs), totalIn = v4TotalInches(a6);
    if (isNaN(lbs) || isNaN(totalIn)) return null;
    if (lbs < r.weightMin || lbs > r.weightMax) return null;
    if (totalIn < r.heightInMin || totalIn > r.heightInMax) return null;
    var bmi = (703 * lbs) / (totalIn * totalIn);
    if (bmi < 18.5) return "flag";
    var tiers = CFG().bmiTiers;
    for (var i = 0; i < tiers.length; i++)
      if (bmi >= tiers[i].min && bmi < tiers[i].max) return tiers[i].id;
    return "build";
  }

  // Headline + message for the live result region, or null (tier "flag" shows
  // no calculator message — it routes to the A6P screen instead).
  function v4SnapshotContent(answers) {
    var tier = v4SnapshotTier(answers);
    if (!tier || tier === "flag") return null;
    var tiers = CFG().bmiTiers;
    for (var i = 0; i < tiers.length; i++)
      if (tiers[i].id === tier) return { headline: tiers[i].headline, message: tiers[i].message };
    return null;
  }

  // Gentle range validation for A6 (kind tone, no alarm language).
  function v4SnapshotProblem(a6) {
    var r = CFG().snapshotRanges;
    if (!a6 || a6.weightLbs === undefined && a6.heightFt === undefined) return null;
    var lbs = parseFloat(a6.weightLbs), totalIn = v4TotalInches(a6);
    if (!isNaN(lbs) && (lbs < r.weightMin || lbs > r.weightMax))
      return "That weight looks outside the range we can work with (" + r.weightMin + "–" + r.weightMax + " lbs) — mind double-checking it?";
    if (!isNaN(totalIn) && (totalIn < r.heightInMin || totalIn > r.heightInMax))
      return "That height looks outside the range we can work with (3'0\"–8'0\") — mind double-checking it?";
    return null;
  }

  // -------------------------------------------------------------------------
  // A3 · contact + identity validation (inline, kind tone)
  // -------------------------------------------------------------------------
  function v4MaskDob(raw) {
    var digits = String(raw || "").replace(/\D/g, "").slice(0, 8);
    if (digits.length > 4) return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  function v4ParseDob(str) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(str || "").trim());
    if (!m) return null;
    var mo = +m[1], da = +m[2], yr = +m[3];
    var dt = new Date(yr, mo - 1, da);
    if (dt.getFullYear() !== yr || dt.getMonth() !== mo - 1 || dt.getDate() !== da) return null;
    return { m: mo, d: da, y: yr };
  }

  function v4AgeFromDob(str) {
    var p = v4ParseDob(str);
    if (!p) return NaN;
    var now = new Date();
    var age = now.getFullYear() - p.y;
    var thisMonth = now.getMonth() + 1;
    if (thisMonth < p.m || (thisMonth === p.m && now.getDate() < p.d)) age--;
    return age;
  }

  // field id → gentle message, or "" when fine.
  function v4ContactFieldError(field, value, a3) {
    var v = String(value === undefined || value === null ? "" : value).trim();
    if (field === "address2") return ""; // apartment is optional
    if (field === "dob") {
      if (!v) return "Please add your date of birth.";
      var p = v4ParseDob(v);
      if (!p) return "Please enter your date of birth as MM/DD/YYYY.";
      if (p.y < 1900) return "Please double-check the birth year.";
      var age = v4AgeFromDob(v);
      if (age < 0) return "That date is in the future — mind double-checking it?";
      if (age < 18) return "You need to be at least 18 for this assessment."; // ASSUMPTION — matches live build; confirm
      return "";
    }
    if (!v) {
      var names = {
        firstName: "first name", lastName: "last name", email: "email", phone: "phone number",
        address1: "street address", city: "city", zip: "ZIP code",
        state: "the state your medication ships to", sex: "sex assigned at birth",
      };
      return "Please add your " + (names[field] || field) + ".";
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "That email doesn’t look complete — mind double-checking it?";
    if (field === "phone" && v.replace(/\D/g, "").length < 10)
      return "That phone number looks short — mind double-checking it?";
    if (field === "zip" && !/^\d{5}(-\d{4})?$/.test(v))
      return "ZIP codes are 5 digits — mind double-checking it?";
    return "";
  }

  var V4_CONTACT_FIELDS = ["firstName", "lastName", "email", "phone", "address1", "address2", "city", "zip", "state", "sex", "dob"];

  // { field: message } for every field that still needs attention.
  function v4ContactProblems(a3) {
    var d = a3 || {}, out = {}, any = false;
    V4_CONTACT_FIELDS.forEach(function (f) {
      var msg = v4ContactFieldError(f, d[f], d);
      if (msg) { out[f] = msg; any = true; }
    });
    return any ? out : null;
  }

  // -------------------------------------------------------------------------
  // Scoring — persona, product scores, Block D composition
  // -------------------------------------------------------------------------
  function v4Persona(answers) {
    return CFG().a5PersonaMap[answers.A5] || null;
  }

  function v4ProductScores(answers) {
    var map = CFG().a4ScoreMap, scores = {};
    (answers.A4 || []).forEach(function (feel) {
      var product = map[feel];
      if (product) scores[product] = (scores[product] || 0) + 1;
    });
    return scores;
  }

  // Add-ons that "scored highly" in A4: the top-scoring product(s), minus the
  // path's core product, minus medication products when ineligible. Max 2.
  function v4TopAddOns(answers, pathId) {
    var scores = v4ProductScores(answers), cfg = CFG();
    var eligible = v4MedicationEligible(answers);
    var core = cfg.pathCoreProduct[pathId];
    var best = 0, name;
    for (name in scores) if (scores[name] > best) best = scores[name];
    if (!best) return [];
    var out = [];
    for (name in cfg.pricing.addOns) { // pricing key order = stable display order
      if (scores[name] !== best) continue;
      if (name === core) continue;
      if (!eligible && cfg.pricing.addOns[name].medication) continue;
      out.push(name);
    }
    return out.slice(0, 2);
  }

  // Primary path resolver. Default: first A1 goal in canonical branch order,
  // overridden to labs/coaching when medicationEligible=false (the fork
  // choice decides which). // Resolver priority not fully specified in doc —
  // flagged for confirmation in DECISIONS.
  function v4PathId(answers) {
    if (!v4MedicationEligible(answers))
      return answers.A2F === "labs" ? "labs" : "coaching";
    var branches = v4GoalBranches(answers.A1);
    if (!branches.length) return "energy";
    return CFG().branchPathMap[branches[0]];
  }

  function v4JoinList(items, lowerFirst) {
    var list = items.map(function (s) {
      return lowerFirst ? s.charAt(0).toLowerCase() + s.slice(1) : s;
    });
    if (list.length <= 1) return list.join("");
    return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
  }

  // 2–4 bullets pulled from the user's own answers (B1.1/B1.5/B2.2/B3.2/B4.3
  // + A5 persona tone) — never generic filler.
  function v4WhyBullets(answers, pathId) {
    var why = CFG().why, out = [];

    var b11 = answers["B1.1"] || [];
    var b15 = answers["B1.5"] || [];
    var b22 = answers["B2.2"] || [];
    var b32 = answers["B3.2"] || [];
    var b43 = answers["B4.3"] || [];

    function journeyBullet() { return b11.length ? why.journey[b11[0]] : null; }
    function strugglesBullet() { return b15.length ? why.struggles.lead + v4JoinList(b15, true) + why.struggles.tail : null; }
    function energyBullet() { return b22.length ? why.energyHelps.lead + v4JoinList(b22, true) + why.energyHelps.tail : null; }
    function labsBullet() { return b32.length ? why.labAreas.lead + v4JoinList(b32, false) + why.labAreas.tail : null; }
    function advancedBullets() {
      var bullets = [], generic = false;
      b43.forEach(function (area) {
        if (why.advancedNamed[area]) bullets.push(why.advancedNamed[area]);
        else generic = true; // Skin health / Performance / Recovery / Healthy aging / General → generic only
      });
      if (generic) bullets.push(why.advancedGeneric);
      return bullets;
    }
    function personaBullet() {
      var p = v4Persona(answers);
      return p ? why.persona[p.id] : null;
    }
    function goalEchoBullet() {
      var goals = answers.A1 || [];
      return goals.length ? why.goalEcho.lead + v4JoinList(goals, true) + why.goalEcho.tail : null;
    }

    var order;
    if (pathId === "weightLoss") order = [journeyBullet(), strugglesBullet(), personaBullet(), energyBullet()];
    else if (pathId === "energy") order = [energyBullet(), personaBullet(), strugglesBullet(), labsBullet()];
    else if (pathId === "labs") order = [labsBullet(), personaBullet(), goalEchoBullet()];
    else if (pathId === "advanced") order = advancedBullets().concat([personaBullet(), goalEchoBullet()]);
    else order = [personaBullet(), goalEchoBullet()];

    order.forEach(function (b) { if (b && out.indexOf(b) < 0) out.push(b); });
    if (out.length < 2) {
      var echo = goalEchoBullet(), p = personaBullet();
      [p, echo].forEach(function (b) { if (b && out.indexOf(b) < 0) out.push(b); });
    }
    return out.slice(0, 4);
  }

  // Labs tier from the number of B3.2 areas. ASSUMPTION — mapping not in doc.
  function v4LabsTier(answers) {
    var n = (answers["B3.2"] || []).length, t = CFG().labsTiers;
    if (!n) return null;
    if (n <= 1) return t.essential;
    if (n <= 3) return t.complete;
    return t.executive;
  }

  function v4LabsPanelNote(answers) {
    var b33 = answers["B3.3"];
    if (!b33) return null;
    var fresh = CFG().labsFreshValues.indexOf(b33) >= 0;
    return fresh ? CFG().labsPanelNotes.comparison : CFG().labsPanelNotes.fresh;
  }

  // Everything Block D renders, composed from the answer state. No BMI, no
  // tier names, no clinical labels anywhere in the return value.
  function v4Recommendation(answers) {
    var cfg = CFG();
    var pathId = v4PathId(answers);
    var addOnNames = v4TopAddOns(answers, pathId);
    return {
      pathId: pathId,
      headline: cfg.pathHeadlines[pathId],
      bullets: v4WhyBullets(answers, pathId),
      nextSteps: cfg.nextSteps,
      offer: {
        plan: { name: cfg.pathHeadlines[pathId], price: cfg.pricing.plans[pathId].price },
        addOns: addOnNames.map(function (n) { return { name: n, price: cfg.pricing.addOns[n].price }; }),
        labsTier: pathId === "labs" ? v4LabsTier(answers) : null,
        labsPanelNote: pathId === "labs" ? v4LabsPanelNote(answers) : null,
      },
      persona: v4Persona(answers),
      medicationEligible: v4MedicationEligible(answers),
      cta: cfg.resultCta,
      ctaSupport: cfg.resultCtaSupport,
    };
  }

  // -------------------------------------------------------------------------
  // ?product= entry routing — pre-selects A1 goals, never skips the screen.
  // -------------------------------------------------------------------------
  function v4ProductGoals(search) {
    var m = /[?&]product=([^&]*)/.exec(String(search || ""));
    if (!m) return [];
    var raw, map = CFG().productParamGoals, out = [];
    try { raw = decodeURIComponent(m[1]); } catch (e) { raw = m[1]; }
    raw.split(",").forEach(function (p) {
      var goal = map[String(p).trim().toUpperCase()];
      if (goal && out.indexOf(goal) < 0) out.push(goal);
    });
    return out;
  }

  // -------------------------------------------------------------------------
  // Analytics stub — structured console events; a real provider drops in by
  // replacing the emit function. Payloads NEVER carry BMI values or tier ids.
  // -------------------------------------------------------------------------
  function v4Track(event, payload) {
    var record = { event: event, ts: new Date().toISOString() };
    for (var k in (payload || {})) record[k] = payload[k];
    if (typeof console !== "undefined" && console.info) console.info("[assessment-v4]", record);
    return record;
  }

  g.asmtV4ScreenById = v4ScreenById;
  g.asmtV4GoalBranches = v4GoalBranches;
  g.asmtV4MedicationEligible = v4MedicationEligible;
  g.asmtV4BranchWalk = v4BranchWalk;
  g.asmtV4BranchScreens = v4BranchScreens;
  g.asmtV4Queue = v4Queue;
  g.asmtV4Prune = v4Prune;
  g.asmtV4FirstIncomplete = v4FirstIncomplete;
  g.asmtV4BlockIndex = v4BlockIndex;
  g.asmtV4SnapshotTier = v4SnapshotTier;
  g.asmtV4SnapshotContent = v4SnapshotContent;
  g.asmtV4SnapshotProblem = v4SnapshotProblem;
  g.asmtV4MaskDob = v4MaskDob;
  g.asmtV4ParseDob = v4ParseDob;
  g.asmtV4AgeFromDob = v4AgeFromDob;
  g.asmtV4ContactFieldError = v4ContactFieldError;
  g.asmtV4ContactProblems = v4ContactProblems;
  g.asmtV4Persona = v4Persona;
  g.asmtV4ProductScores = v4ProductScores;
  g.asmtV4TopAddOns = v4TopAddOns;
  g.asmtV4PathId = v4PathId;
  g.asmtV4WhyBullets = v4WhyBullets;
  g.asmtV4Recommendation = v4Recommendation;
  g.asmtV4ProductGoals = v4ProductGoals;
  g.asmtV4Track = v4Track;

})(typeof window !== "undefined" ? window : globalThis);
