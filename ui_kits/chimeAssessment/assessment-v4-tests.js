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
   "C.PRE", "C1", "C2", "C3", "C.POST", "D"]);

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
// Vf · A2 is exactly five fields: First · Last · Age · Email · Phone.
check("a complete A3 is satisfied by the five Vf fields alone",
  g.asmtV4ContactProblems({
    firstName: "A", lastName: "B", age: "42", email: "a@b.co", phone: "5551234567",
  }) === null);
check("A3 no longer validates the deferred address/DOB fields",
  (function () {
    var p = g.asmtV4ContactProblems({}) || {};
    return p.address1 === undefined && p.city === undefined && p.zip === undefined &&
           p.state === undefined && p.dob === undefined;
  })());
check("A3 requires age, and holds the 18+ floor",
  (g.asmtV4ContactProblems({ firstName: "A", lastName: "B", email: "a@b.co", phone: "5551234567" }) || {}).age !== undefined &&
  (g.asmtV4ContactProblems({ firstName: "A", lastName: "B", age: "17", email: "a@b.co", phone: "5551234567" }) || {}).age !== undefined &&
  g.asmtV4ContactProblems({ firstName: "A", lastName: "B", age: "18", email: "a@b.co", phone: "5551234567" }) === null);
check("A3 rejects a non-numeric age",
  (g.asmtV4ContactProblems({ firstName: "A", lastName: "B", age: "forty", email: "a@b.co", phone: "5551234567" }) || {}).age !== undefined);

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
check("B1.3's free-text option is the one pick that must not jump",
  g.CHIME_ASSESSMENT_V4.b13OtherValue === "Others");

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
  ["A1", "A3", "A2G", "A2", "A2F", "A4", "A5", "A6", "A7", "C.PRE", "C1", "C2", "C3", "C.POST", "D"]);

// ---------------------------------------------------------------------------
// Rule 5 · Conditional skips
// ---------------------------------------------------------------------------
eq("B1.2 'No' → skip directly to B1.5",
  g.asmtV4BranchScreens("B1", { "B1.2": "No" }), ["B1.1", "B1.2", "B1.5", "B1.C"]);
eq("B1.2 'Yes', B1.3 unanswered → B1.3 shows, dose waits",
  g.asmtV4BranchScreens("B1", { "B1.2": "Yes" }), ["B1.1", "B1.2", "B1.3", "B1.5", "B1.C"]);
eq("B1.3 'Semaglutide' → B1.4 dose screen shows",
  g.asmtV4BranchScreens("B1", { "B1.2": "Yes", "B1.3": "Semaglutide" }),
  ["B1.1", "B1.2", "B1.3", "B1.4", "B1.5", "B1.C"]);
eq("B1.3 'Others' → skip B1.4",
  g.asmtV4BranchScreens("B1", { "B1.2": "Yes", "B1.3": "Others" }),
  ["B1.1", "B1.2", "B1.3", "B1.5", "B1.C"]);
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
eq("prune: flipping B1.2 to 'No' drops B1.3/B1.4 answers",
  g.asmtV4Prune(merge({ A1: ["Lose weight"], "B1.2": "No", "B1.3": "Semaglutide", "B1.4": "PLACEHOLDER 0.25 mg" }, A2_CLEAR))["B1.3"],
  undefined);
eq("prune: B1.3 away from 'Others' drops the free text",
  g.asmtV4Prune(merge({ A1: ["Lose weight"], "B1.2": "Yes", "B1.3": "Semaglutide", "B1.3_other": "stale" }, A2_CLEAR))["B1.3_other"],
  undefined);
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
eq("block indices: A1→0, B1.1→1, C1→2, D→3",
  ["A1", "B1.1", "C1", "D"].map(g.asmtV4BlockIndex), [0, 1, 2, 3]);
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
console.log("");
if (failed) {
  console.error("assessment-v4 tests: " + failed + " FAILED, " + passed + " passed");
  process.exit(1);
}
console.log("assessment-v4 tests: all " + passed + " passed ✓");
