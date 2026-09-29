// Chime Health — Assessment v15 routing tests.
// Run:  node ui_kits/assessmentV15/assessment-v15-tests.js
// Same harness as the v4 suite: data + logic attach to globalThis, check()
// counts, the process exits non-zero on any failure.

require("./assessment-v15-data.js");
require("./assessment-v15-logic.js");

var g = globalThis, C = g.CHIME_ASSESSMENT_V15;
var passed = 0, failed = 0;

function check(name, cond) {
  if (cond) passed++;
  else { failed++; console.error("FAIL  " + name); }
}
function eq(name, actual, expected) {
  var a = JSON.stringify(actual), e = JSON.stringify(expected);
  check(name + "  →  " + a + (a === e ? "" : "  (expected " + e + ")"), a === e);
}
function merge() {
  var out = {};
  for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) out[k] = arguments[i][k];
  return out;
}
function last(q) { return q[q.length - 1]; }
function has(q, id) { return q.indexOf(id) >= 0; }

// A fixed "today" so ages never drift: 28 Sep 2026.
var NOW = new Date(2026, 8, 28);
function Q(a) { return g.asmtV15Queue(a, NOW); }

// Height 5'6" (66 in): lbs = BMI × 4356 / 703.
function body(lbs) { return { "A2.3": { heightFt: "5", heightIn: "6", weightLbs: String(lbs) } }; }
var ADULT = { "P0.0": true, "P0.1": { dob: "01/01/1996", state: "TX" } };           // 30
var PRIVACY = { "P0.2": { npp: true, terms: true, share: true } };
var START = merge(ADULT, PRIVACY, { A1: ["Lose weight"], "A2.1": "Male" });
var PASS_A = merge(START, body(200));                                                    // BMI 32.3
var INTAKE = {
  B1: "I don’t know", B2: "No — I affirm I’m not taking any medications",
  B3: "No — I affirm I have no known drug allergies", B4: "No — I affirm I have no known medical conditions",
  B5: "No", B6a: ["None of the above"], B6b: "No", B7: "Mostly inactive",
  B8: { evaluation: "Never", labs: "Never" },
};
var WL_CLEAR = {
  "C-WL.1": "Just starting to explore options", "C-WL.2": ["Staying consistent"],
  "C-WL.3": ["None of the above"], "C-WL.3.1": ["None of the above"], "C-WL.3.2": ["None of the above"],
  "C-WL.4": "No", "C-WL.5": ["None of the above"], "C-WL.6": ["None of these"],
  "C-WL.7": "None of the above",
};
var FULL = merge(PASS_A, INTAKE, WL_CLEAR);

// ---------------------------------------------------------------------------
// P0 · age, state, privacy
// ---------------------------------------------------------------------------
eq("age from DOB (birthday passed)", g.asmtV15AgeFromDob("01/01/1996", NOW), 30);
eq("age from DOB (birthday today)", g.asmtV15AgeFromDob("09/28/2008", NOW), 18);
eq("age from DOB (birthday tomorrow)", g.asmtV15AgeFromDob("09/29/2008", NOW), 17);
check("invalid calendar date is rejected", g.asmtV15ParseDate("02/30/1990") === null);
eq("DOB mask", g.asmtV15MaskDob("01021990"), "01/02/1990");
eq("17 in TX → minor exit", last(Q({ "P0.1": { dob: "09/29/2008", state: "TX" } })), "EXIT.minor");
eq("18 in TX → continues", last(Q({ "P0.1": { dob: "09/28/2008", state: "TX" } })) === "EXIT.minor", false);
eq("18 in AL → minor exit (19 floor)", last(Q({ "P0.1": { dob: "09/28/2008", state: "AL" } })), "EXIT.minor");
eq("18 in NE → minor exit (19 floor)", last(Q({ "P0.1": { dob: "09/28/2008", state: "NE" } })), "EXIT.minor");
eq("19 in AL → continues", has(Q({ "P0.1": { dob: "09/28/2007", state: "AL" } }), "P0.2"), true);
check("a minor persists nothing", g.asmtV15Persistable({ "P0.1": { dob: "09/29/2008", state: "TX" } }, NOW) === null);
eq("declined privacy → exit", last(Q(merge(ADULT, { "P0.2": { declined: true } }))), "EXIT.privacy");
check("declined privacy persists nothing", g.asmtV15Persistable(merge(ADULT, { "P0.2": { declined: true } }), NOW) === null);
eq("privacy needs all three boxes", g.asmtV15ScreenProblem("P0.2", { "P0.2": { npp: true, terms: true } }, {}, NOW), "Please check all three boxes to continue.");
eq("privacy with all three boxes", g.asmtV15ScreenProblem("P0.2", PRIVACY, {}, NOW), null);
C.unservedStates = ["HI"];
eq("unserved state → waitlist exit", last(Q({ "P0.1": { dob: "01/01/1996", state: "HI" } })), "EXIT.state");
C.unservedStates = [];

// ---------------------------------------------------------------------------
// Block A · scope, sex, pregnancy, GREEN LIGHT
// ---------------------------------------------------------------------------
eq("queue opens P0.0 → P0.1 → P0.2 → A1", Q(START).slice(0, 4), ["P0.0", "P0.1", "P0.2", "A1"]);
eq("no weight goal → scope stand-in ends the queue", last(Q(merge(START, { A1: ["Feel more energy"] }))), "A.SCOPE");
eq("scope 'continue' carries on", has(Q(merge(START, { A1: ["Feel more energy"], "A.SCOPE": "continue" })), "A2.1"), true);
eq("already-on-GLP-1 goal counts as weight care", has(Q(merge(START, { A1: ["I’m already on a GLP-1 and want better support"] })), "A.SCOPE"), false);
eq("Male skips A2.2", has(Q(START), "A2.2"), false);
eq("Female asks A2.2", has(Q(merge(START, { "A2.1": "Female" })), "A2.2"), true);
eq("pregnant → Variant A", last(Q(merge(START, { "A2.1": "Female", "A2.2": "Yes" }))), "DQ.A");
eq("not pregnant → A2.3", has(Q(merge(START, { "A2.1": "Female", "A2.2": "No" })), "A2.3"), true);
eq("A2.2 is sensitive (never persisted)", g.asmtV15Persistable(merge(START, { "A2.1": "Female", "A2.2": "No" }), NOW)["A2.2"], undefined);
eq("B6b is sensitive (never persisted)", g.asmtV15Persistable(merge(FULL, { B6b: "No" }), NOW).B6b, undefined);
eq("A2.1 auto-advances", !!g.asmtV15Screen("A2.1").autoAdvance, true);
eq("A4 auto-advances", !!g.asmtV15Screen("A4").autoAdvance, true);
eq("only A2.1 and A4 auto-advance",
  C.screens.filter(function (s) { return s.autoAdvance; }).map(function (s) { return s.id; }), ["A2.1", "A4"]);

// 5'6": 120 lbs = 19.37 · 121 = 19.53 · 136 = 21.95 · 137 = 22.11
eq("age 30, BMI 19.37 → fail", g.asmtV15GreenLight(merge(ADULT, body(120)), NOW), "fail");
eq("age 30, BMI 19.53 → pass", g.asmtV15GreenLight(merge(ADULT, body(121)), NOW), "pass");
var AGE65 = { "P0.1": { dob: "01/01/1961", state: "TX" } };
var AGE64 = { "P0.1": { dob: "12/31/1961", state: "TX" } };
eq("age 65, BMI 21.95 → fail", g.asmtV15GreenLight(merge(AGE65, body(136)), NOW), "fail");
eq("age 65, BMI 22.11 → pass", g.asmtV15GreenLight(merge(AGE65, body(137)), NOW), "pass");
eq("age 64, BMI 21.95 → pass (18–64 floor)", g.asmtV15GreenLight(merge(AGE64, body(136)), NOW), "pass");
eq("BMI fail → BMI-Fail exit", last(Q(merge(START, body(120)))), "DQ.BMI");
var Q65 = Q(merge(START, AGE65, body(200)));
eq("65+ pass → Elderly consent right after A2.3",
  Q65.slice(Q65.indexOf("A2.1"), Q65.indexOf("A2.1") + 4), ["A2.1", "A2.3", "A2.3E", "A2"]);
eq("64 → no Elderly consent", has(Q(merge(START, AGE64, body(200))), "A2.3E"), false);
var QA = Q(PASS_A);
eq("Block A order after the gate (contact after eligibility)",
  QA.slice(QA.indexOf("A2.3"), QA.indexOf("A2.3") + 8), ["A2.3", "A2", "A2.4", "A2.5", "A3", "A4", "A5", "B1"]);
eq("incomplete body inputs never fail the gate", g.asmtV15GreenLight(merge(ADULT, { "A2.3": { heightFt: "5" } }), NOW), null);
eq("snapshot tier message for BMI 32", g.asmtV15SnapshotContent(PASS_A).headline, "Let’s Build A Plan Around This.");
eq("snapshot tier message for BMI 21.95", g.asmtV15SnapshotContent(merge(ADULT, body(136))).headline, "You’re Off To A Strong Start.");
check("snapshot copy never carries a number",
  C.bmiTiers.every(function (t) { return !/\d/.test(t.headline + t.message); }));
eq("weight out of range is caught", /outside the range/.test(g.asmtV15BodyProblem({ weightLbs: "20", heightFt: "5" })), true);

// ---------------------------------------------------------------------------
// Block B
// ---------------------------------------------------------------------------
eq("B6a organ transplant → Variant D", last(Q(merge(PASS_A, INTAKE, { B6a: ["An organ transplant"] }))), "DQ.D");
eq("B6a T2D on insulin → Variant D", last(Q(merge(PASS_A, INTAKE, { B6a: ["Type 2 diabetes requiring you to use insulin"] }))), "DQ.D");
eq("B6a None → B6b", has(Q(merge(PASS_A, INTAKE)), "B6b"), true);
eq("B6b Yes → Variant B", last(Q(merge(PASS_A, INTAKE, { B6b: "Yes" }))), "DQ.B");
eq("B2 Yes needs its free text", g.asmtV15ScreenProblem("B2", { B2: "Yes — Please list the names and dosages" }, {}, NOW), "Please add a few details to continue.");
eq("B2 Yes with free text passes", g.asmtV15ScreenProblem("B2", { B2: "Yes — Please list the names and dosages", "B2__text": "metformin 500mg" }, {}, NOW), null);
eq("B5 No needs no text", g.asmtV15ScreenProblem("B5", { B5: "No" }, {}, NOW), null);
eq("B8 needs both dropdowns", g.asmtV15ScreenProblem("B8", { B8: { evaluation: "Never" } }, {}, NOW), "Please choose an answer for both questions.");
eq("B9 is optional", g.asmtV15ScreenProblem("B9", {}, {}, NOW), null);
eq("B4 carries the V8/v15 wording", g.asmtV15Screen("B4").title, "Do you have any further information which you would like our medical team to know?");

// ---------------------------------------------------------------------------
// C-WL
// ---------------------------------------------------------------------------
check("Retatrutide / GLP-Squared are named nowhere in the config",
  !/retatrutide|glp-squared/i.test(JSON.stringify(C)));
eq("C-WL.3 any exclusion → Variant D", last(Q(merge(FULL, { "C-WL.3": ["Pancreatitis"] }))), "DQ.D");
eq("C-WL.3 MTC → Variant D", last(Q(merge(FULL, { "C-WL.3": ["Personal or family history of medullary thyroid carcinoma (MTC)"] }))), "DQ.D");
eq("C-WL.3.1 gallstones + gallbladder → consents de-duplicated",
  g.asmtV15RelativeConsents({ "C-WL.3.1": ["Gallbladder disease or past removal of gallbladder", "Current symptomatic gallstones"] }),
  ["gallbladder", "cholecystectomy"]);
eq("C-WL.3.1 all nine → nine consents",
  g.asmtV15RelativeConsents({ "C-WL.3.1": g.asmtV15Screen("C-WL.3.1").options.slice(0, 9) }).length, 9);
var withThyroid = Q(merge(FULL, { "C-WL.3.1": ["Hypothyroidism, Hyperthyroidism, or Thyroid Issues"] }));
eq("C-WL.3.1 consent sits right after the question",
  withThyroid.slice(withThyroid.indexOf("C-WL.3.1"), withThyroid.indexOf("C-WL.3.1") + 3), ["C-WL.3.1", "CONSENT.thyroid", "C-WL.3.2"]);
eq("generated consent screen resolves", g.asmtV15Screen("CONSENT.thyroid").consent, "thyroid");
eq("C-WL.3.1 flags provider review",
  g.asmtV15ProviderFlags(merge(FULL, { "C-WL.3.1": ["Heart disease"] }), NOW), ["Relative contraindication: Heart disease"]);
eq("C-WL.4 gastric bypass → Base", last(Q(merge(FULL, { "C-WL.4": "Yes" }))), "DQ.BASE");
eq("C-WL.5 allergy → Variant C", last(Q(merge(FULL, { "C-WL.5": ["Wegovy"] }))), "DQ.C");
eq("C-WL.6 selection flags, never disqualifies",
  [has(Q(merge(FULL, { "C-WL.6": ["Sitagliptin"] })), "E"), g.asmtV15ProviderFlags(merge(FULL, { "C-WL.6": ["Sitagliptin"] }), NOW).length], [true, 1]);
// C-WL.0 · 5'6": 167 lbs = 26.95 · 168 = 27.11 · 185 = 29.86 · 186 = 30.02
function wl0(lbs, extra) { return merge(START, body(lbs), INTAKE, WL_CLEAR, extra || {}); }
eq("C-WL.0 BMI 30.02 → pass", g.asmtV15Indication(wl0(186)), "pass");
eq("C-WL.0 BMI 29.86, no condition → fail", g.asmtV15Indication(wl0(185)), "fail");
eq("C-WL.0 BMI 27.11 + condition → pass", g.asmtV15Indication(wl0(168, { "C-WL.3.2": ["Sleep apnea"] })), "pass");
eq("C-WL.0 BMI 26.95 + condition → fail", g.asmtV15Indication(wl0(167, { "C-WL.3.2": ["Sleep apnea"] })), "fail");
eq("C-WL.0 BMI 25 on a current GLP-1 → pass (continuing care)", g.asmtV15Indication(wl0(155, { "C-WL.7": "Tirzepatide (Zepbound, Mounjaro)" })), "pass");
eq("C-WL.0 fail → BMI-Fail exit after C-WL.7", Q(wl0(185)).slice(-2), ["C-WL.7", "DQ.BMI"]);
eq("C-WL.0 not evaluated before C-WL.7", g.asmtV15Indication(merge(START, body(150))), null);
eq("C-WL.7 None skips C-WL.8–11", has(Q(FULL), "C-WL.8"), false);
var ONMED = merge(FULL, { "C-WL.7": "Semaglutide (Ozempic, Wegovy)" });
eq("C-WL.7 on medication → C-WL.8–11 in order",
  Q(ONMED).slice(Q(ONMED).indexOf("C-WL.7"), Q(ONMED).indexOf("C-WL.7") + 5), ["C-WL.7", "C-WL.8", "C-WL.9", "C-WL.10", "C-WL.11"]);
eq("C-WL.9 ladder: 11 verbatim + Other / not sure", g.asmtV15Screen("C-WL.9").options.length, 12);
eq("C-WL.9 ladder order is the doc's, not sorted", g.asmtV15Screen("C-WL.9").options.slice(4, 6), ["Semaglutide 2mg", "Tirzepatide 10mg"]);
eq("C-WL.9 needs last-dose date", g.asmtV15ScreenProblem("C-WL.9", { "C-WL.9": "Semaglutide 1mg" }, {}, NOW), "Please enter the date of your last dose as MM/DD/YYYY.");
eq("C-WL.11 Yes needs a file", g.asmtV15ScreenProblem("C-WL.11", { "C-WL.11": "Yes" }, {}, NOW), "Please add a photo of your prescription or bottle.");
eq("C-WL.11 Yes with a file passes", g.asmtV15ScreenProblem("C-WL.11", { "C-WL.11": "Yes" }, { hasFile: true }, NOW), null);
eq("C-WL.11 No flags a provider follow-up",
  g.asmtV15ProviderFlags(merge(ONMED, { "C-WL.11": "No" }), NOW).indexOf("No prescription photo — follow-up or restart titration") >= 0, true);
eq("C-WL.1 reveal needs a medication", g.asmtV15ScreenProblem("C-WL.1", { "C-WL.1": "Used Semaglutide or Tirzepatide before and stopped" }, {}, NOW), "Please tell us which medication to continue.");
eq("C-WL.1 'please specify' needs its text",
  g.asmtV15ScreenProblem("C-WL.1", { "C-WL.1": "Used Semaglutide or Tirzepatide before and stopped", "C-WL.1__med": "Another weight-loss medication (please specify)" }, {}, NOW),
  "Please tell us which medication — or choose another option.");
eq("C-WL.1 closes with Truthfulness → GLP-1 → closer",
  Q(FULL).slice(Q(FULL).indexOf("CONSENT.truthfulness"), Q(FULL).indexOf("CONSENT.truthfulness") + 3), ["CONSENT.truthfulness", "CONSENT.glp1", "C-WL.END"]);

// ---------------------------------------------------------------------------
// Block D / E
// ---------------------------------------------------------------------------
eq("unverified state defaults to live video → D1.6", has(Q(FULL), "D1.6"), true);
C.stateModality = { TX: "async" };
eq("async state skips D1.6", has(Q(FULL), "D1.6"), false);
C.stateModality = {};
eq("full happy path ends D2 → D.POST → E", Q(FULL).slice(-3), ["D2.telehealth", "D.POST", "E"]);
eq("address state must match residence",
  !!g.asmtV15AddressProblems({ address1: "1 Main", city: "Austin", state: "CA", zip: "73301" }, "TX").state, true);
eq("matching address passes", g.asmtV15AddressProblems({ address1: "1 Main", city: "Austin", state: "TX", zip: "73301" }, "TX"), null);
eq("ID verify: selfie needs biometric consent", !!g.asmtV15ScreenProblem("D1.5", { "D1.5": { method: "selfie" } }, {}, NOW), true);
eq("ID verify: another way passes", g.asmtV15ScreenProblem("D1.5", { "D1.5": { method: "other" } }, {}, NOW), null);
eq("password rules", [g.asmtV15PasswordProblem("short1", "short1"), g.asmtV15PasswordProblem("longenough", "longenough"),
  g.asmtV15PasswordProblem("longenough1", "longenough2"), g.asmtV15PasswordProblem("longenough1", "longenough1")],
  ["Please use at least 8 characters.", "Please include at least one letter and one number.", "Those passwords don’t match yet.", null]);
var rec = g.asmtV15Result(merge(FULL, { "C-WL.1": "Tried many diets or lifestyle programs before", A3: ["Energy", "Focus"] }));
eq("result headline names the program, never a drug", /semaglutide|tirzepatide|glp/i.test(rec.headline), false);
eq("result bullets come from the answers", rec.bullets.length, 3);
eq("the doc's example line is the 'tried' bullet", rec.bullets[0], C.result.why.journey[C.result.why.exampleKey]);
eq("result CTA", rec.cta, "Go To My Account");

// Payload for the backend
var payload = g.asmtV15Payload(merge(FULL, { A2: { firstName: "Ana", lastName: "Ruiz", email: "a@b.co", phone: "5155551234" } }), NOW);
eq("payload contact carries no health data", Object.keys(payload.contact), ["firstName", "lastName", "email", "phone"]);
eq("payload modality", payload.modality, "video");
eq("no health-personalized consent → suppressed from nurture", payload.suppression.suppress, true);
eq("DQ user suppressed", g.asmtV15Suppression(merge(FULL, { "C-WL.4": "Yes", A2: { personalized: true } }), NOW).reasons, ["DQ.BASE"]);

// Prune
var stale = g.asmtV15Prune(merge(FULL, { "C-WL.8": "Yes", "C-WL.8__text": "nausea" }), NOW);
eq("prune drops C-WL.8 once C-WL.7 is None", stale["C-WL.8"], undefined);
var reveal = g.asmtV15Prune(merge(FULL, { B2: "No — I affirm I’m not taking any medications", "B2__text": "old" }), NOW);
eq("prune drops a reveal text whose trigger is gone", reveal["B2__text"], undefined);
var dq = g.asmtV15Prune(merge(FULL, { B6a: ["An organ transplant"] }), NOW);
eq("prune drops everything past a disqualifier", [dq.B6b, dq["C-WL.1"]], [undefined, undefined]);
eq("first incomplete on an empty state", g.asmtV15FirstIncomplete({}, NOW), "P0.0");

// Every screen the queue can produce resolves to a config.
var ids = {};
[START, FULL, ONMED, merge(FULL, { "C-WL.3.1": g.asmtV15Screen("C-WL.3.1").options.slice(0, 9) }),
 merge(START, AGE65, body(200))].forEach(function (a) { Q(a).forEach(function (id) { ids[id] = 1; }); });
check("every queued screen resolves", Object.keys(ids).every(function (id) { return !!g.asmtV15Screen(id); }));
check("every screen has a data-screen-label",
  C.screens.every(function (s) { return !!s.label; }));

console.log("\nassessment-v15 tests: " + (failed ? failed + " failed, " : "all ") + passed + " passed" + (failed ? "" : " ✓"));
if (failed) process.exit(1);
