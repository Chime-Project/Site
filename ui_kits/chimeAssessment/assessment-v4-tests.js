// Chime Health — Assessment v4 routing/scoring tests.
// Run:  node ui_kits/chimeAssessment/assessment-v4-tests.js
// No framework: data + logic attach to globalThis (they are DOM-free), and a
// tiny check() wrapper counts passes/failures, prints a summary, and exits
// non-zero on any failure.

require("./assessment-v4-data.js");
require("./assessment-v4-logic.js");

var g = globalThis;
var passed = 0, failed = 0;

function check(name, cond) {
  console.assert(cond, name);
  if (cond) passed++;
  else { failed++; console.error("FAIL  " + name); }
}
function eq(name, actual, expected) {
  var a = JSON.stringify(actual), e = JSON.stringify(expected);
  check(name + "  →  " + a + (a === e ? "" : "  (expected " + e + ")"), a === e);
}

// Convenient answer fragments. A2 is the legal team's verbatim Yes/No as of
// v7 — a STRING, not the v4 multi-select array — and it is only ASKED when
// A2G is Female, so both fixtures carry the gender that reaches it.
var A2_CLEAR = { A2G: "Female", A2: "No" };
var A2_DQ = { A2G: "Female", A2: "Yes" };
var A2_MALE = { A2G: "Male" };
function snap(lbs, ft, inch) { return { A6: { weightLbs: lbs, heightFt: ft, heightIn: inch } }; }
function merge() {
  var out = {};
  for (var i = 0; i < arguments.length; i++)
    for (var k in arguments[i]) out[k] = arguments[i][k];
  return out;
}

// ---------------------------------------------------------------------------
// Rule 3 · Block B queue from A1 mapping — canonical order, deduped
// ---------------------------------------------------------------------------
eq("single goal: Lose weight → [B1]",
  g.asmtV4GoalBranches(["Lose weight"]), ["B1"]);
eq("goal mapping: energy → B2, understand → B3, longer → B2, GLP-1 → B1, advanced → B4, not-sure → B2",
  ["Feel more energy", "Understand my health better", "Live longer, age well",
   "I’m already on a GLP-1 and want better support", "Curious about advanced wellness options",
   "Not sure yet, but I want to feel better"].map(function (goal) { return g.asmtV4GoalBranches([goal])[0]; }),
  ["B2", "B3", "B2", "B1", "B4", "B2"]);
eq("multi-goal queues canonically + dedupes (advanced, GLP-1, longer, lose) → [B1,B2,B4]",
  g.asmtV4GoalBranches(["Curious about advanced wellness options", "I’m already on a GLP-1 and want better support",
    "Live longer, age well", "Lose weight"]),
  ["B1", "B2", "B4"]);

// ---------------------------------------------------------------------------
// Rule 1 · Base order
// ---------------------------------------------------------------------------
eq("base order, single B2 goal, no fork, no flag",
  g.asmtV4Queue(merge({ A1: ["Feel more energy"] }, A2_CLEAR)),
  ["A1", "A3", "A2G", "A2", "A4", "A5", "A6", "A7",
   "B2.1", "B2.3", "B2.C",
   "C.PRE", "C.POST", "D"]);

// ---------------------------------------------------------------------------
// Client request (v7) · pregnancy sits DIRECTLY after gender, which sits
// directly after the Info Page it was split out of
// ---------------------------------------------------------------------------
check("A2 (pregnancy) immediately follows A2G (gender), which follows A3",
  (function () {
    var q = g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_CLEAR));
    return q.indexOf("A2G") === q.indexOf("A3") + 1 &&
      q.indexOf("A2") === q.indexOf("A2G") + 1;
  })());

// ---------------------------------------------------------------------------
// A2G gates A2 · nobody who answered Male is asked about pregnancy
// ---------------------------------------------------------------------------
check("A2G 'Male' → the pregnancy question is not in the queue at all",
  g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_MALE)).indexOf("A2") < 0);
eq("A2G 'Male' → gender is followed straight by A4",
  (function () {
    var q = g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_MALE));
    return q.slice(q.indexOf("A2G"), q.indexOf("A2G") + 2);
  })(), ["A2G", "A4"]);
check("A2G unanswered → pregnancy not asked yet either",
  g.asmtV4Queue({ A1: ["Lose weight"] }).indexOf("A2") < 0);
check("A2G 'Female' → it is asked", g.asmtV4AsksPregnancy(A2_CLEAR));
check("A2G 'Male' → it is not asked", !g.asmtV4AsksPregnancy(A2_MALE));
check("a stale 'Yes' can never disqualify someone the question was not put to",
  g.asmtV4MedicationEligible({ A2G: "Male", A2: "Yes" }));
check("switching Female+Yes to Male prunes both the answer and the fork",
  (function () {
    var pruned = g.asmtV4Prune({ A1: ["Lose weight"], A2G: "Male", A2: "Yes", A2F: "labs" });
    return pruned.A2 === undefined && pruned.A2F === undefined;
  })());
check("Male keeps the full branch queue — no accidental fork reroute",
  (function () {
    var q = g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_MALE));
    return q.indexOf("A2F") < 0 && q.indexOf("B1.1") >= 0;
  })());
check("gender is asked once — A3 no longer validates a sex field",
  g.asmtV4ContactProblems({}).sex === undefined);
// Client 2026-10-01 · six fields: First · Last · Date of birth · Email · Phone · State.
function a3(extra) { return merge({ firstName: "A", lastName: "B", dob: "01/15/1980", email: "a@b.co", phone: "5551234567", state: "TX" }, extra || {}); }
check("a complete A3 is satisfied by the six fields",
  g.asmtV4ContactProblems(a3()) === null);
check("A3 no longer asks for age, and never for the address",
  (function () {
    var p = g.asmtV4ContactProblems({}) || {};
    return p.age === undefined && p.address1 === undefined && p.city === undefined && p.zip === undefined;
  })());
check("A3 requires a date of birth and a state",
  (g.asmtV4ContactProblems(a3({ dob: "" })) || {}).dob !== undefined &&
  (g.asmtV4ContactProblems(a3({ state: "" })) || {}).state !== undefined);
(function () {
  var now = new Date(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var md = pad(now.getMonth() + 1) + "/" + pad(now.getDate()) + "/";
  check("A3 holds the 18+ floor on the date of birth (18 today passes, 17 fails)",
    g.asmtV4ContactProblems(a3({ dob: md + (now.getFullYear() - 18) })) === null &&
    /at least 18/.test((g.asmtV4ContactProblems(a3({ dob: md + (now.getFullYear() - 17) })) || {}).dob || ""));
})();
check("A3 rejects an impossible date (02/30)",
  /valid date/.test((g.asmtV4ContactProblems(a3({ dob: "02/30/1980" })) || {}).dob || ""));
eq("DOB mask: digits become MM/DD/YYYY", g.asmtV4MaskDob("01151980"), "01/15/1980");

// ---------------------------------------------------------------------------
// Client request (v7) · single-select screens advance on the pick itself
// ---------------------------------------------------------------------------
check("every single-select screen carries autoAdvance",
  (function () {
    var single = { list: 1, gate: 1, dynlist: 1, listFree: 1 };
    return g.CHIME_ASSESSMENT_V4.screens
      .filter(function (s) { return single[s.type]; })
      .every(function (s) { return s.autoAdvance === true; });
  })());
check("no MULTI-select screen carries autoAdvance (the second pick must stay reachable)",
  (function () {
    var multi = { cards: 1, checkboxes: 1, chips: 1 };
    return g.CHIME_ASSESSMENT_V4.screens
      .filter(function (s) { return multi[s.type]; })
      .every(function (s) { return !s.autoAdvance; });
  })());
check("B1.1's reveal free-text option is the one pick that must not jump",
  g.CHIME_ASSESSMENT_V4.b11OtherValue === "Others");
check("B1.1 carries no autoAdvance — a pick may open the inline reveal",
  !g.CHIME_ASSESSMENT_V4.screens.filter(function (x) { return x.id === "B1.1"; })[0].autoAdvance);

// ---------------------------------------------------------------------------
// Rule 2 · A2 disqualification fork
// ---------------------------------------------------------------------------
check("A2 'No' → medicationEligible", g.asmtV4MedicationEligible(A2_CLEAR));
check("A2 'Yes' → NOT medicationEligible", !g.asmtV4MedicationEligible(A2_DQ));
check("A2 unanswered stays eligible — the fork must not precede the question",
  g.asmtV4MedicationEligible({ A1: ["Lose weight"] }));
check("fork screen A2F enters the queue directly after A2",
  (function () {
    var q = g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_DQ));
    return q.indexOf("A2F") === q.indexOf("A2") + 1;
  })());
check("no fork screen when A2 is clear",
  g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_CLEAR)).indexOf("A2F") < 0);
eq("fork → Labs forces the branch queue to [B3] only",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight", "Feel more energy"] }, A2_DQ, { A2F: "labs" })), ["B3"]);
eq("fork → Coaching skips Block B entirely",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight"] }, A2_DQ, { A2F: "coaching" })), []);
eq("fork → Coaching: A7 still runs, then straight to Block C",
  g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_DQ, { A2F: "coaching" })),
  ["A1", "A3", "A2G", "A2", "A2F", "A4", "A5", "A6", "A7", "C.PRE", "C.POST", "D"]);

// ---------------------------------------------------------------------------
// Rule 5 · Conditional skips
// ---------------------------------------------------------------------------
// Vf C-WL.1 · B1.2 + B1.3 are merged into B1.1 as an inline reveal, so the
// medication answer no longer adds screens of its own — only the dose ladder.
eq("B1.1 non-reveal answer → straight to B1.5, no medication screens at all",
  g.asmtV4BranchScreens("B1", { "B1.1": "Just starting to explore options" }), ["B1.1", "B1.5", "B1.C"]);
eq("B1.1 reveal answer, medication unanswered → still one screen, dose waits",
  g.asmtV4BranchScreens("B1", { "B1.1": "Currently using Semaglutide or Tirzepatide and want better support" }), ["B1.1", "B1.5", "B1.C"]);
eq("B1.1_med 'Semaglutide' → B1.4 dose screen shows",
  g.asmtV4BranchScreens("B1", { "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Semaglutide" }),
  ["B1.1", "B1.4", "B1.5", "B1.C"]);
eq("B1.1_med 'Another GLP-based medication' → skip B1.4 (the reference has no ladder for it)",
  g.asmtV4BranchScreens("B1", { "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Another GLP-based medication (GLP-Squared, Retatrutide)" }),
  ["B1.1", "B1.5", "B1.C"]);
eq("B1.1_med 'Others' → skip B1.4 (free text, no ladder to show)",
  g.asmtV4BranchScreens("B1", { "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Others" }),
  ["B1.1", "B1.5", "B1.C"]);
check("both reveal-triggering options are real B1.1 options",
  (function () {
    var opts = g.CHIME_ASSESSMENT_V4.screens.filter(function (x) { return x.id === "B1.1"; })[0]
      .options.map(function (o) { return o.value; });
    return g.CHIME_ASSESSMENT_V4.b11RevealValues.every(function (v) { return opts.indexOf(v) >= 0; });
  })());
check("the reveal offers exactly the four medications the doc lists",
  (function () {
    var r = g.CHIME_ASSESSMENT_V4.screens.filter(function (x) { return x.id === "B1.1"; })[0].reveal;
    return r.title === "Which medication?" && r.options.length === 4 &&
      r.options[0].value === "Semaglutide" && r.options[1].value === "Tirzepatide" &&
      r.options[3].value === "Others";
  })());
// Vf · the standalone B3.1 interest screen is gone; its exit option now lives
// inline on B3.2, which is multi-select — so the skip tests membership.
eq("B3.2 exit option → remainder of B3 skipped, closer included in the skip",
  g.asmtV4BranchScreens("B3", { "B3.2": ["Not sure yet / not interested right now"] }), ["B3.2"]);
eq("B3.2 real area → full branch",
  g.asmtV4BranchScreens("B3", { "B3.2": ["Biological Age"] }), ["B3.2", "B3.3", "B3.C"]);
eq("B3 with no answer yet → full branch",
  g.asmtV4BranchScreens("B3", {}), ["B3.2", "B3.3", "B3.C"]);

// ---------------------------------------------------------------------------
// Rule 4 · Dynamic insertions with dedupe, canonical order, before Block C
// ---------------------------------------------------------------------------
eq("B1.5 low energy adds B2 after B1",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight"], "B1.5": ["Low energy or fatigue"] }, A2_CLEAR)),
  ["B1", "B2"]);
eq("B1.5 'Not seeing progress' also adds B2",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight"], "B1.5": ["Not seeing progress"] }, A2_CLEAR)),
  ["B1", "B2"]);
eq("B1.5 insertion dedupes when B2 already queued from goals",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight", "Feel more energy"], "B1.5": ["Low energy or fatigue"] }, A2_CLEAR)),
  ["B1", "B2"]);
eq("insertion joins REMAINING branches in canonical order: goals [B1,B3], B1.5 adds B2 → walk B1,B2,B3",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight", "Understand my health better"], "B1.5": ["Low energy or fatigue"] }, A2_CLEAR)),
  ["B1", "B2", "B3"]);
eq("B2.3 'Yes' inserts B1 and B4 (canonical among remaining)",
  g.asmtV4BranchWalk(merge({ A1: ["Feel more energy"], "B2.3": "Yes, I’m interested" }, A2_CLEAR)),
  ["B2", "B1", "B4"]);
eq("B2.3 'Maybe' also inserts",
  g.asmtV4BranchWalk(merge({ A1: ["Feel more energy"], "B2.3": "Maybe, tell me more" }, A2_CLEAR)),
  ["B2", "B1", "B4"]);
eq("B2.3 'Not right now' → no change",
  g.asmtV4BranchWalk(merge({ A1: ["Feel more energy"], "B2.3": "Not right now" }, A2_CLEAR)),
  ["B2"]);
eq("B2.3 insertion dedupes a completed branch: goals [B1,B2], B2.3 Yes → only B4 added",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight", "Feel more energy"], "B2.3": "Yes, I’m interested" }, A2_CLEAR)),
  ["B1", "B2", "B4"]);
eq("chained insertions: goals [B2], B2.3 Yes → B1; B1.5 low energy → B2 already walked (dedupe)",
  g.asmtV4BranchWalk(merge({ A1: ["Feel more energy"], "B2.3": "Yes, I’m interested", "B1.5": ["Low energy or fatigue"] }, A2_CLEAR)),
  ["B2", "B1", "B4"]);
check("insertions always resolve before Block C",
  (function () {
    var q = g.asmtV4Queue(merge({ A1: ["Feel more energy"], "B2.3": "Yes, I’m interested" }, A2_CLEAR));
    return q.indexOf("B4.C") < q.indexOf("C.PRE") && q.indexOf("B1.5") < q.indexOf("C.PRE");
  })());

// ---------------------------------------------------------------------------
// Rule 6 · A6 tiers (internal ids only) + provider-flag screen
// ---------------------------------------------------------------------------
// 5'9" = 69 in. BMI = 703·lbs/69². 125 lbs → 18.46 (flag) · 126 → 18.6
// (balanced) · 168 → 24.8 (balanced) · 170 → 25.1 (room) · 202 → 29.8 (room) ·
// 204 → 30.1 (build).
eq("tier: flag below 18.5", g.asmtV4SnapshotTier(snap(125, 5, 9)), "flag");
eq("tier: balanced lower edge", g.asmtV4SnapshotTier(snap(126, 5, 9)), "balanced");
eq("tier: balanced upper edge", g.asmtV4SnapshotTier(snap(168, 5, 9)), "balanced");
eq("tier: room lower edge", g.asmtV4SnapshotTier(snap(170, 5, 9)), "room");
eq("tier: room upper edge", g.asmtV4SnapshotTier(snap(202, 5, 9)), "room");
eq("tier: build at 30+", g.asmtV4SnapshotTier(snap(204, 5, 9)), "build");
eq("tier: null while out of sane range (weight 40)", g.asmtV4SnapshotTier(snap(40, 5, 9)), null);
eq("tier: null while out of sane range (height 2'0\")", g.asmtV4SnapshotTier(snap(150, 2, 0)), null);
check("provider-flag screen A6P queues only for tier flag",
  g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_CLEAR, snap(125, 5, 9))).indexOf("A6P") >= 0 &&
  g.asmtV4Queue(merge({ A1: ["Lose weight"] }, A2_CLEAR, snap(180, 5, 9))).indexOf("A6P") < 0);
check("flag tier renders NO calculator message", g.asmtV4SnapshotContent(snap(125, 5, 9)) === null);
check("balanced tier renders its verbatim headline",
  g.asmtV4SnapshotContent(snap(150, 5, 9)).headline === "You’re Off To A Strong Start.");
check("snapshot content never contains a number or clinical label",
  (function () {
    var c = g.asmtV4SnapshotContent(snap(204, 5, 9));
    var text = c.headline + " " + c.message;
    return !/\d/.test(text) && !/underweight|overweight|obese|BMI/i.test(text);
  })());
check("gentle out-of-range message, no alarm language",
  /mind double-checking/.test(g.asmtV4SnapshotProblem({ weightLbs: 30, heightFt: 5, heightIn: 9 })));

// ---------------------------------------------------------------------------
// Rule 7 · Recompute forward + prune stale answers
// ---------------------------------------------------------------------------
eq("prune: switching B1.1 to a non-reveal answer drops the medication answer",
  g.asmtV4Prune(merge({ A1: ["Lose weight"], "B1.1": "Just starting to explore options", "B1.1_med": "Semaglutide", "B1.4": { dose: "0.25mg" } }, A2_CLEAR))["B1.1_med"],
  undefined);
eq("prune: …and the dose that hung off it",
  g.asmtV4Prune(merge({ A1: ["Lose weight"], "B1.1": "Just starting to explore options", "B1.1_med": "Semaglutide", "B1.4": { dose: "0.25mg" } }, A2_CLEAR))["B1.4"],
  undefined);
eq("prune: B1.1_med away from 'Others' drops the free text",
  g.asmtV4Prune(merge({ A1: ["Lose weight"], "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Semaglutide", "B1.1_med_other": "stale" }, A2_CLEAR))["B1.1_med_other"],
  undefined);
check("prune: a reveal answer and its free text survive when the pick still opens the reveal",
  (function () {
    var out = g.asmtV4Prune(merge({ A1: ["Lose weight"], "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Others", "B1.1_med_other": "compounded" }, A2_CLEAR));
    return out["B1.1_med"] === "Others" && out["B1.1_med_other"] === "compounded";
  })());
check("prune: dropping the Energy goal clears B2 answers (fixpoint: B2.3's insertions too)",
  (function () {
    var pruned = g.asmtV4Prune(merge(
      { A1: ["Understand my health better"], "B2.1": ["Mental fog"], "B2.3": "Yes, I’m interested", "B4.2": ["Privacy"] },
      A2_CLEAR));
    return pruned["B2.1"] === undefined && pruned["B2.3"] === undefined && pruned["B4.2"] === undefined;
  })());
check("prune: clearing the A2 disqualifier drops the fork answer",
  g.asmtV4Prune(merge({ A1: ["Lose weight"] }, A2_CLEAR, { A2F: "labs" })).A2F === undefined);
check("prune keeps reachable answers intact",
  (function () {
    var a = merge({ A1: ["Lose weight"], "B1.1": ["Just starting to explore options"], "B1.2": "Yes", "B1.3": "Semaglutide" }, A2_CLEAR);
    var pruned = g.asmtV4Prune(a);
    return pruned["B1.1"][0] === "Just starting to explore options" && pruned["B1.3"] === "Semaglutide";
  })());

// ---------------------------------------------------------------------------
// Rule 8 · Progress derives from blocks only, in order
// ---------------------------------------------------------------------------
eq("block indices: A1→0, B1.1→1, H11→2, D→3",
  ["A1", "B1.1", "H11", "D"].map(g.asmtV4BlockIndex), [0, 1, 2, 3]);
eq("phrase screens belong to their blocks (A7→A, B1.C→B, C.POST→C)",
  ["A7", "B1.C", "C.POST"].map(g.asmtV4BlockIndex), [0, 1, 2]);

// ---------------------------------------------------------------------------
// Block D resolver + composition
// ---------------------------------------------------------------------------
eq("resolver: primary = first selected goal in canonical order",
  g.asmtV4PathId(merge({ A1: ["Understand my health better", "Lose weight"] }, A2_CLEAR)),
  "weightLoss");
eq("resolver: labs fork overrides to labs",
  g.asmtV4PathId(merge({ A1: ["Lose weight"] }, A2_DQ, { A2F: "labs" })), "labs");
eq("resolver: coaching fork overrides to coaching",
  g.asmtV4PathId(merge({ A1: ["Lose weight"] }, A2_DQ, { A2F: "coaching" })), "coaching");
check("headline names the path",
  g.asmtV4Recommendation(merge({ A1: ["Lose weight"] }, A2_CLEAR)).headline === "Chime Weight Loss Journey");

// Bullets: 2–4, from the user's own answers.
check("weight-loss reference bullet appears verbatim",
  g.asmtV4Recommendation(merge({
    A1: ["Lose weight"], A5: "I’ve tried different things and nothing has felt sustainable",
    "B1.1": ["Tried many diets or lifestyle programs before"],
  }, A2_CLEAR)).bullets[0] ===
  "You’ve tried different things before, and nothing has felt sustainable. With Chime, we’ll walk this path with you toward a leaner, healthier, more confident you.");
check("bullets stay within 2–4",
  (function () {
    var r = g.asmtV4Recommendation(merge({
      A1: ["Lose weight", "Feel more energy"], A5: "I want to be proactive about my health",
      "B1.1": ["Just starting to explore options"],
      "B1.5": ["Staying consistent", "Not seeing progress", "Low energy or fatigue"],
    }, A2_CLEAR));
    return r.bullets.length >= 2 && r.bullets.length <= 4;
  })());
check("minimal coaching-fork record still gets ≥2 bullets (persona + goal echo)",
  g.asmtV4Recommendation(merge({ A1: ["Lose weight"], A5: "I don’t feel like myself anymore" }, A2_DQ, { A2F: "coaching" })).bullets.length >= 2);

// B4.3 compliance gate.
check("advanced results may name Sermorelin + PT-141 only; other areas go generic",
  (function () {
    var r = g.asmtV4Recommendation(merge({
      A1: ["Curious about advanced wellness options"], A5: "I want to be proactive about my health",
      "B4.3": ["Hormone optimization", "Sexual wellness", "Performance", "Recovery"],
    }, A2_CLEAR));
    var text = r.bullets.join(" | ");
    return /Sermorelin/.test(text) && /PT-141/.test(text) &&
      !/BPC-157|TB-500|MOTS-c|GHK-Cu/.test(text);
  })());
check("performance-only advanced selection names NO product",
  (function () {
    var r = g.asmtV4Recommendation(merge({
      A1: ["Curious about advanced wellness options"], A5: "I want to be proactive about my health",
      "B4.3": ["Performance", "Skin health"],
    }, A2_CLEAR));
    return !/Sermorelin|PT-141|BPC-157|TB-500|MOTS-c|GHK-Cu/.test(r.bullets.join(" "));
  })());

// A4 scoring + offer add-ons.
eq("A4 score map tallies per product",
  g.asmtV4ProductScores({ A4: ["Energy", "Clarity", "Focus", "Results", "Confidence"] }),
  { "NAD+": 3, "Labs": 1, "Coaching": 1 });
eq("top add-on joins the offer",
  g.asmtV4Recommendation(merge({ A1: ["Lose weight"], A4: ["Energy", "Clarity"], A5: "I want to be proactive about my health" }, A2_CLEAR))
    .offer.addOns.map(function (a) { return a.name; }),
  ["NAD+"]);
eq("path core product never re-offers as add-on (Labs path + Results/Understanding)",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], A4: ["Results", "A better understanding of my body"], A5: "I want to be proactive about my health" }, A2_CLEAR))
    .offer.addOns, []);
check("medicationEligible=false suppresses medication add-ons in D",
  (function () {
    var r = g.asmtV4Recommendation(merge(
      { A1: ["Lose weight"], A4: ["Energy", "Clarity", "Strength"], A5: "I want to be proactive about my health" },
      A2_DQ, { A2F: "coaching" }));
    return r.offer.addOns.every(function (a) { return a.name !== "NAD+" && a.name !== "Sermorelin"; }) &&
      r.medicationEligible === false;
  })());

// Persona map + analytics exposure.
check("persona stored for the assessment_completed payload",
  g.asmtV4Recommendation(merge({ A1: ["Lose weight"], A5: "I want a more private and personalized experience" }, A2_CLEAR))
    .persona.label === "Persona 2 — The Private Client");

// ?product= deep links: pre-select goals only.
eq("?product=GLP pre-selects the weight-loss goal", g.asmtV4ProductGoals("?product=GLP"), ["Lose weight"]);
eq("?product=GLP,NAD pre-selects two goals",
  g.asmtV4ProductGoals("?product=GLP,NAD"), ["Lose weight", "Feel more energy"]);
eq("unknown product values are dropped, never guessed", g.asmtV4ProductGoals("?product=XYZ"), []);

// Restore fallback.
eq("first incomplete screen after A1 is the Info Page",
  g.asmtV4FirstIncomplete({ A1: ["Feel more energy"] }), "A3");
eq("first incomplete screen after A1+A3 is the gender screen",
  g.asmtV4FirstIncomplete({ A1: ["Feel more energy"], A3: { firstName: "A" } }), "A2G");

// ---------------------------------------------------------------------------
// Vf spec · option lists, verbatim. These lock the counts AND the exact strings
// the routing config keys off — a silent re-word is what breaks the branching.
// ---------------------------------------------------------------------------
function screen(id) {
  return g.CHIME_ASSESSMENT_V4.screens.filter(function (s) { return s.id === id; })[0];
}
function optValues(id) {
  return (screen(id).options || []).map(function (o) { return typeof o === "string" ? o : o.value; });
}

eq("A1 · 6 goals (Vf drops 'Live longer, age well')", optValues("A1").length, 6);
check("A1 no longer offers the longevity goal",
  optValues("A1").indexOf("Live longer, age well") < 0);
check("goalBranchMap still resolves the retired goal for saved sessions",
  g.asmtV4GoalBranches(["Live longer, age well"])[0] === "B2");

eq("A4 · 8 options (Vf drops 'A better understanding of my body')", optValues("A4").length, 8);
check("A4 carries the Vf supporting line",
  screen("A4").supportingLine === "Select all the options that feel right for you.");

eq("A5 · 7 options (Vf restores the 'something feels off' option)", optValues("A5").length, 7);
check("A5's restored option sits at position 3 and resolves to the Labs Seeker persona",
  optValues("A5")[2] === "I know something feels off, but I’m not sure what" &&
  g.CHIME_ASSESSMENT_V4.a5PersonaMap["I know something feels off, but I’m not sure what"].id === "labsSeeker");

eq("B1.1 · 4 options (Vf drops 'Not sure what’s right for me')", optValues("B1.1").length, 4);

eq("B1.5 · still 8 options, but re-composed", optValues("B1.5").length, 8);
check("B1.5 merges progress+energy into one option and adds the side-effects option",
  optValues("B1.5").indexOf("Not seeing progress or feeling low on energy") >= 0 &&
  optValues("B1.5").indexOf("Managing side effects or questions") >= 0 &&
  optValues("B1.5").indexOf("Not seeing progress") < 0 &&
  optValues("B1.5").indexOf("Low energy or fatigue") < 0);
check("the merged B1.5 option still inserts the B2 branch",
  g.asmtV4BranchWalk(merge({ A1: ["Lose weight"], "B1.5": ["Not seeing progress or feeling low on energy"] }, A2_CLEAR)).indexOf("B2") >= 0);

eq("B3.2 · 4 options (merge + drop + inline exit)", optValues("B3.2").length, 4);
check("B3.2 carries the merged and exit options, and drops General health markers",
  optValues("B3.2").indexOf("Hormones & Nutrient Levels") >= 0 &&
  optValues("B3.2").indexOf(g.CHIME_ASSESSMENT_V4.b32SkipValue) >= 0 &&
  optValues("B3.2").indexOf("General health markers") < 0);

eq("B4.2 · 6 options (safety options merged)", optValues("B4.2").length, 6);
check("B4.2 carries the merged safety option",
  optValues("B4.2").indexOf("Safety, legitimacy, and avoiding unregulated sources") >= 0);
eq("B4.3 · 6 options (Vf drops 'General wellness support')", optValues("B4.3").length, 6);
check("B4.3 keeps the compliance-named areas intact",
  optValues("B4.3").indexOf("Hormone optimization") >= 0 && optValues("B4.3").indexOf("Sexual wellness") >= 0);

// B1.1 went from multi-select (array) to single-select (string). The old
// journeyBullet did why.journey[b11[0]] — on a string that reads the first
// CHARACTER, so the bullet would vanish silently rather than error.
check("the journey bullet resolves from the single-select string answer",
  (function () {
    var rec = g.asmtV4Recommendation(merge({
      A1: ["Lose weight"], "B1.1": "Just starting to explore options",
    }, A2_CLEAR));
    return rec.bullets.indexOf(g.CHIME_ASSESSMENT_V4.why.journey["Just starting to explore options"]) >= 0;
  })());
check("every remaining B1.1 option has a why.journey bullet",
  g.CHIME_ASSESSMENT_V4.screens.filter(function (x) { return x.id === "B1.1"; })[0]
    .options.every(function (o) { return !!g.CHIME_ASSESSMENT_V4.why.journey[o.value]; }));

check("screens deleted by Vf are gone: B2.2, B3.1, B4.1",
  !screen("B2.2") && !screen("B3.1") && !screen("B4.1"));

// The old ladder (1 / 2–3 / 4+) made Executive unreachable once B3.2 dropped to
// 4 options with one of them an exit. Rescaled to 1 / 2 / 3.
var LT = g.CHIME_ASSESSMENT_V4.labsTiers;
eq("labs tier · 1 area → Essential",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], "B3.2": ["Biological Age"] }, A2_CLEAR)).offer.labsTier, LT.essential);
eq("labs tier · 2 areas → Complete",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], "B3.2": ["Biological Age", "Inflammation"] }, A2_CLEAR)).offer.labsTier, LT.complete);
eq("labs tier · all 3 real areas → Executive is reachable again",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], "B3.2": ["Biological Age", "Inflammation", "Hormones & Nutrient Levels"] }, A2_CLEAR)).offer.labsTier, LT.executive);
check("the exit option never scores a labs tier on its own",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], "B3.2": [g.CHIME_ASSESSMENT_V4.b32SkipValue] }, A2_CLEAR)).offer.labsTier === null);

// ---------------------------------------------------------------------------
// Result → cart hand-off (readiness pass, 2026-09-25). The result CTA used to
// end on a placeholder; it now opens the cart with the recommendation selected,
// and the cart must be able to read what it is handed.
// ---------------------------------------------------------------------------
// Since 2026-10-01 the weight-loss result opens the GLP-1 product page instead.
var WL = merge({ A1: ["Lose weight"] }, A2_CLEAR);
eq("weight loss opens the GLP-1 product page on Semaglutide", g.asmtV4CartHref(WL), "chime-glp/product.html?med=sema");
eq("weight loss on Tirzepatide opens it on Tirzepatide",
  g.asmtV4CartHref(merge(WL, { "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Tirzepatide" })),
  "chime-glp/product.html?med=tirz");
eq("weight-loss result CTA reads Choose My Treatment", g.asmtV4Recommendation(WL).cta, "Choose My Treatment");
eq("other paths keep Create My Account", g.asmtV4Recommendation(merge({ A1: ["Feel more energy"] }, A2_CLEAR)).cta, "Create My Account");
eq("cart · energy opens NAD+", g.asmtV4CartHref(merge({ A1: ["Feel more energy"] }, A2_CLEAR)), "cart.html?treatment=nad");
eq("cart · labs goes to the labs page",
  g.asmtV4CartHref(merge({ A1: ["Understand my health better"] }, A2_CLEAR)), "labs.html");
(function () {
  var a = merge({ A1: ["Lose weight"] }, A2_DQ, { A2F: "coaching" });
  eq("cart · ineligible answers never pre-select a medication", g.asmtV4CartHref(a), "cart.html");
})();
check("cart · no placeholder price is left in the offer config",
  JSON.stringify(g.CHIME_ASSESSMENT_V4.pricing).indexOf("PLACEHOLDER") < 0);

// The cart reads exactly what the assessment writes.
g.window = g;
require("../shared/data/products.js");
require("../cart/cart-data.js");
[["cart.html?treatment=semaglutide", ["prod-semaglutide"]],
 ["cart.html?treatment=tirzepatide", ["prod-tirzepatide"]],
 ["cart.html?treatment=semaglutide,nad", ["prod-semaglutide", "prod-nad"]],
 ["cart.html?treatment=nad", ["prod-nad"]]].forEach(function (c) {
  eq("cart · " + c[0] + " → " + c[1].join(" + "),
    g.chimeCartEntry(c[0].slice(c[0].indexOf("?"))).ids, c[1]);
});

// ---------------------------------------------------------------------------
// Medical intake (client, 2026-10-01) — the qualify funnel's steps 6, 7, 11,
// 12, 13, 14, 17, 18 on the weight-loss path, with their disqualify rules.
// ---------------------------------------------------------------------------
var CFG4 = g.CHIME_ASSESSMENT_V4;
function scr(id) { return g.asmtV4ScreenById(id); }
var MED = ["H11", "H12", "H13", "H14", "H17", "H18"];
// 45 years old, 6'1" 230 lbs (BMI 30.3) → band "clear"
var WLM = merge({ A1: ["Lose weight"], A3: { dob: "01/15/1980" } }, A2_MALE, snap(230, 6, 1));
eq("weight loss: the medical screens sit between C.PRE and C.POST",
  g.asmtV4Queue(WLM).slice(-9), ["C.PRE"].concat(MED, ["C.POST", "D"]));
check("no placeholder screens remain (C1 / C2 / C3 gone)",
  ["C1", "C2", "C3"].every(function (id) { return !scr(id) && g.asmtV4Queue(WLM).indexOf(id) < 0; }));
eq("energy-only path: no medical screens", g.asmtV4MedicalScreens(merge({ A1: ["Feel more energy"] }, A2_CLEAR)), []);
eq("labs-only path: no medical screens, B3.3 still asked",
  g.asmtV4BranchScreens("B3", merge({ A1: ["Understand my health better"], "B3.2": ["Inflammation"] }, A2_CLEAR)), ["B3.2", "B3.3", "B3.C"]);
eq("labs + weight loss: B3.3 drops (H17 asks it)",
  g.asmtV4BranchScreens("B3", merge({ A1: ["Lose weight", "Understand my health better"], "B3.2": ["Inflammation"] }, A2_CLEAR)), ["B3.2", "B3.C"]);
check("pregnant / breastfeeding → no B1, so no medical screens",
  g.asmtV4MedicalScreens(merge({ A1: ["Lose weight"] }, A2_DQ, { A2F: "labs" })).length === 0);
check("B2.3 cross-sell adding B1 also adds the medical screens",
  g.asmtV4MedicalScreens(merge({ A1: ["Feel more energy"], "B2.3": "Yes, I’m interested" }, A2_CLEAR)).indexOf("H11") === 0);

// Labs panel note reads H17 when B3.3 is not asked
eq("labs note from H17: less than a year → comparison",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], "B3.2": ["Inflammation"], H17: { lastLabTests: "Less than a year ago" } }, A2_CLEAR)).offer.labsPanelNote,
  CFG4.labsPanelNotes.comparison);
eq("labs note from H17: older → fresh",
  g.asmtV4Recommendation(merge({ A1: ["Understand my health better"], "B3.2": ["Inflammation"], H17: { lastLabTests: "More than 2 years ago" } }, A2_CLEAR)).offer.labsPanelNote,
  CFG4.labsPanelNotes.fresh);

// Age + BMI bands (reference screening-bands.js)
eq("band 70 y/o BMI 21 → disqualify", g.asmtV4ScreeningBandFor(70, 21).band, "disqualify");
eq("band 70 y/o BMI 22 → elderly consent", g.asmtV4ScreeningBandFor(70, 22), { band: "consent", consent: "elderly" });
eq("band 40 y/o BMI 19.9 → disqualify", g.asmtV4ScreeningBandFor(40, 19.9).band, "disqualify");
eq("band 40 y/o BMI 22.99 → metabolic consent", g.asmtV4ScreeningBandFor(40, 22.99), { band: "consent", consent: "metabolic" });
eq("band 40 y/o BMI 23 → clear", g.asmtV4ScreeningBandFor(40, 23).band, "clear");
eq("band without a DOB → unknown", g.asmtV4ScreeningBand(merge({ A1: ["Lose weight"] }, snap(230, 6, 1))).band, "unknown");
(function () {
  var old = merge(WLM, { A3: { dob: "01/15/1950" } });             // 76, BMI 30.3 → elderly consent
  eq("elderly band adds H7 before H11", g.asmtV4MedicalScreens(old)[0], "H7");
  eq("H7 shows only the elderly box", g.asmtV4FormItems(scr("H7"), old).map(function (i) { return i.key; }), ["elderly_consent"]);
  check("H7 holds until ticked", !!g.asmtV4FormProblem(scr("H7"), {}, old) && !g.asmtV4FormProblem(scr("H7"), { elderly_consent: true }, old));
  var thin = merge(WLM, { A3: { dob: "01/15/1950" } }, snap(150, 6, 1)); // BMI 19.8 at 76 → disqualify
  check("elderly with low BMI disqualifies on the weight-loss path", g.asmtV4BandDisqualifies(thin));
  check("…but never off it", !g.asmtV4BandDisqualifies(merge(thin, { A1: ["Feel more energy"] })));
  var meta = merge(WLM, snap(180, 6, 1));                          // 45, BMI 23.7 → clear
  check("clear band: no H7", g.asmtV4MedicalScreens(meta)[0] === "H11");
  var met = merge(WLM, snap(170, 6, 1));                           // 45, BMI 22.4 → metabolic
  eq("metabolic band shows only the metabolic box", g.asmtV4FormItems(scr("H7"), met).map(function (i) { return i.key; }), ["metabolic_consent"]);
})();

// Disqualify rules, both ways (reference quiz-dq.js; step 13 per Luis)
function dq(id, ans) { return g.asmtV4FormDisqualifies(scr(id), ans, WLM); }
check("H11 · None of these is safe", !dq("H11", { healthConditions: ["None of these"] }));
check("H11 · any condition disqualifies", dq("H11", { healthConditions: ["End-stage liver disease (cirrhosis)"] }));
check("H12 · None of the below is safe", !dq("H12", { healthConditionsAdditional: ["None of the below"] }));
check("H12 · Type 2 diabetes (not on insulin) is the one safe condition", !dq("H12", { healthConditionsAdditional: ["Type 2 diabetes (not on insulin)"] }));
check("H12 · on insulin disqualifies", dq("H12", { healthConditionsAdditional: ["Type 2 diabetes (on insulin)"] }));
check("H12 · safe + unsafe together still disqualifies", dq("H12", { healthConditionsAdditional: ["Type 2 diabetes (not on insulin)", "Type 1 diabetes"] }));
check("H13 · None of these is safe", !dq("H13", { moreHealthConditions: ["None of these"] }));
check("H13 · any condition disqualifies (Luis: 13 disqualifies)", dq("H13", { moreHealthConditions: ["Acid reflux"] }));
check("H14 · three No is safe", !dq("H14", { takenPainMedicationsOrStreetDrugs: "No", gastricBypass6Months: "No", heart_arrhythmia: "No" }));
["takenPainMedicationsOrStreetDrugs", "gastricBypass6Months", "heart_arrhythmia"].forEach(function (k) {
  var a = { takenPainMedicationsOrStreetDrugs: "No", gastricBypass6Months: "No", heart_arrhythmia: "No" }; a[k] = "Yes";
  check("H14 · Yes on " + k + " disqualifies", dq("H14", a));
});
check("H17 never disqualifies", !scr("H17").items.some(function (i) { return i.dq; }));
var H18_OK = { glp1_allergies: ["I am NOT allergic to any of these medications"], current_glucose_medications: ["I am NOT on any of these medications"],
  consents: ["truthfulness_consent", "glp1_glp1_gip_consent", "informed_consent"] };
check("H18 · both NOT answers are safe", !dq("H18", H18_OK));
check("H18 · a GLP-1 allergy disqualifies", dq("H18", merge(H18_OK, { glp1_allergies: ["semaglutide"] })));
check("H18 · a glucose medication disqualifies", dq("H18", merge(H18_OK, { current_glucose_medications: ["insulin"] })));

// Validation
check("H11 · an empty answer is a problem", !!g.asmtV4FormProblem(scr("H11"), {}, WLM));
check("H14 · two of three answered is a problem", !!g.asmtV4FormProblem(scr("H14"), { takenPainMedicationsOrStreetDrugs: "No", gastricBypass6Months: "No" }, WLM));
var H17_OK = { bloodPressure: "Less than 120/80 (Normal)", restingHeartRate: "60-100 beats per minute (Normal)", lastMedicalEvaluation: "Less than a year ago",
  lastLabTests: "Less than a year ago", prescriptionMedications: "No - I affirm I'm not taking any medications",
  medicationAllergies: "No - I affirm I have no known drug allergies", additionalDocInformation: "No" };
check("H17 · all seven answered passes", g.asmtV4FormProblem(scr("H17"), H17_OK, WLM) === null);
check("H17 · a Yes follow-up needs its details",
  !!g.asmtV4FormProblem(scr("H17"), merge(H17_OK, { additionalDocInformation: "Yes" }), WLM) &&
  g.asmtV4FormProblem(scr("H17"), merge(H17_OK, { additionalDocInformation: "Yes", additionalDocInformation_info: "x" }), WLM) === null);
check("H18 · all three consents are required",
  !!g.asmtV4FormProblem(scr("H18"), merge(H18_OK, { consents: ["truthfulness_consent", "informed_consent"] }), WLM) &&
  g.asmtV4FormProblem(scr("H18"), H18_OK, WLM) === null);
check("H18 · the doctor note is optional", g.asmtV4FormProblem(scr("H18"), H18_OK, WLM) === null);
(function () {
  var it = scr("H11").items[0];
  eq("None is exclusive: picking it clears the rest", g.asmtV4ToggleMulti(it, ["Sleep apnea", "End-stage liver disease (cirrhosis)"], "None of these"), ["None of these"]);
  eq("None is exclusive: a condition clears None", g.asmtV4ToggleMulti(it, ["None of these"], "End-stage liver disease (cirrhosis)"), ["End-stage liver disease (cirrhosis)"]);
})();

// B1.4 = the reference's step 6
(function () {
  var b14 = scr("B1.4");
  eq("step 6 · Semaglutide ladder values", b14.doses.Semaglutide.map(function (o) { return o.value; }), ["0.25mg", "0.5mg", "1mg", "1.5mg", "2mg", "2.5mg", "not_sure"]);
  eq("step 6 · Tirzepatide ladder values", b14.doses.Tirzepatide.map(function (o) { return o.value; }), ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg", "not_sure"]);
  check("step 6 · no PLACEHOLDER left anywhere in the config", JSON.stringify(CFG4).indexOf("PLACEHOLDER") < 0);
  eq("step 6 · follow-ups open in turn", [g.asmtV4MedsOpen({}), g.asmtV4MedsOpen({ dose: "1mg" }), g.asmtV4MedsOpen({ dose: "1mg", lastTaken: "1-2 weeks ago" })],
    [{ lastTaken: false, continuePlan: false }, { lastTaken: true, continuePlan: false }, { lastTaken: true, continuePlan: true }]);
  check("step 6 · all three required, details optional",
    !!g.asmtV4MedsProblem({ dose: "1mg", lastTaken: "1-2 weeks ago" }) &&
    g.asmtV4MedsProblem({ dose: "1mg", lastTaken: "1-2 weeks ago", continuePlan: "Continue at the same dose" }) === null);
})();

// A6 shows the BMI like the funnel's step 1 (client, 2026-10-01)
eq("BMI line: 6'1\" 230 lbs → 30.3, obese range", g.asmtV4BmiDisplay(snap(230, 6, 1)).line, "Your BMI is 30.3 (obese range).");
eq("BMI categories at the funnel's cut-offs",
  [snap(120, 6, 1), snap(150, 6, 1), snap(200, 6, 1), snap(230, 6, 1)].map(function (a) { return g.asmtV4BmiDisplay(a).category; }),
  ["underweight range", "healthy range", "overweight range", "obese range"]);
eq("no BMI line until the inputs are complete and in range", [g.asmtV4BmiDisplay({}), g.asmtV4BmiDisplay(snap(30, 6, 1))], [null, null]);
check("analytics still never carry the BMI", JSON.stringify(g.asmtV4Track("step_viewed", { screen: "A6" })).indexOf("bmi") < 0);

// Per-step URLs
eq("step numbers: A1 1, A3 2, B1.1 11, B1.4 12, H11 26, H18 31, D 33",
  ["A1", "A3", "B1.1", "B1.4", "H11", "H18", "D"].map(g.asmtV4StepNumber), [1, 2, 11, 12, 26, 31, 33]);
check("every screen has a step number, and every number a screen",
  CFG4.screens.every(function (x) { return g.asmtV4StepNumber(x.id) !== null; }) && CFG4.stepOrder.every(function (id) { return !!scr(id); }));
eq("?step=26 → H11, junk → null", [g.asmtV4ScreenForStep("26"), g.asmtV4ScreenForStep("x"), g.asmtV4ScreenForStep("99")], ["H11", null, null]);

// Payload in the reference's field names
(function () {
  var a = merge(WLM, {
    A3: { firstName: "Devin", lastName: "Test", dob: "01/15/1980", email: "d@t.co", phone: "5551234567", state: "TX" },
    "B1.1": "Currently using Semaglutide or Tirzepatide and want better support", "B1.1_med": "Tirzepatide",
    "B1.4": { dose: "5mg", lastTaken: "1-2 weeks ago", continuePlan: "Continue at the same dose", details: "x" },
    H11: { healthConditions: ["None of these"] }, H17: merge(H17_OK, { prescriptionMedications: "Yes - Please list the names and dosages", prescriptionMedications_info: "Metformin" }),
    H18: merge(H18_OK, { doctor_note: "hi" }),
  });
  var p = g.asmtV4Payload(a);
  eq("payload · identity", [p.first_name, p.dob, p.state, p.sex], ["Devin", "01/15/1980", "TX", "male"]);
  eq("payload · step 6 fields", [p.medication, p.tirzepatide_dose, p.tirzepatide_last_taken, p.tirzepatide_continue_plan, p.on_weight_loss_meds_current_meds],
    ["Yes, I've taken Tirzepatide (Mounjaro or Zepbound)", "5mg", "1-2 weeks ago", "Continue at the same dose", "x"]);
  eq("payload · medical fields + follow-up", [p.healthConditions, p.prescriptionMedications_info, p.doctor_note], [["None of these"], "Metformin", "hi"]);
  eq("payload · the first consent records its hidden age twin", p.consents, ["truthfulness_consent", "age_consent", "glp1_glp1_gip_consent", "informed_consent"]);
  eq("payload · band", [p.screening_band, p.bmi_consent], ["clear", false]);
  eq("payload · no medication answer → medication-no",
    g.asmtV4Payload(merge(WLM, { "B1.1": "Just starting to explore options" })).medication, "medication-no");
})();

// ---------------------------------------------------------------------------
console.log("");
if (failed) {
  console.error("assessment-v4 tests: " + failed + " FAILED, " + passed + " passed");
  process.exit(1);
}
console.log("assessment-v4 tests: all " + passed + " passed ✓");
