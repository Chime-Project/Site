// node ui_kits/neuropathy-quiz/neuropathy-quiz-tests.js
// Checks the neuropathy quiz's pure logic against the reference's rules
// (standardmeds.com/quiz/neuropathy, ripped 2026-09-11): routing for every
// branch, the five disqualifier paths + the 3-month soft block, the
// multi-select rules, the recap phrases, lead validation and the payload.
"use strict";
var D = require("./neuropathy-quiz-data.js");
var Q = require("./neuropathy-quiz.js");

var pass = 0, fail = 0;
function eq(name, got, want) {
  var g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; return; }
  fail++;
  console.log("FAIL " + name + "\n  got  " + g + "\n  want " + w);
}

// Routing — the Next column of the plan's flow map
eq("s1 Male → s4", Q.next("s1", { sex: "Male" }), { step: "s4" });
eq("s1 Female → s28", Q.next("s1", { sex: "Female" }), { step: "s28" });
eq("s28 No → s4", Q.next("s28", { pregnant: "No" }), { step: "s4" });
eq("s28 Yes → pregnancy modal", Q.next("s28", { pregnant: "Yes" }), { modal: "pregnant" });
eq("s4 → s5", Q.next("s4", {}), { step: "s5" });
eq("s5 → s14", Q.next("s5", {}), { step: "s14" });
eq("s14 3+ years → s6", Q.next("s14", { duration: "3+ years" }), { step: "s6" });
eq("s14 <3 months → soft block", Q.next("s14", { duration: "Less than 3 months" }), { modal: "duration" });
eq("s6 No skips to s11", Q.next("s6", { priorTreatment: "No" }), { step: "s11" });
eq("s6 Yes → s25", Q.next("s6", { priorTreatment: "Yes" }), { step: "s25" });
eq("s25 → s26", Q.next("s25", {}), { step: "s26" });
eq("s26 Yes → s27", Q.next("s26", { hasSideEffects: "Yes" }), { step: "s27" });
eq("s26 No skips to s11", Q.next("s26", { hasSideEffects: "No" }), { step: "s11" });
eq("s27 → s11", Q.next("s27", {}), { step: "s11" });
eq("s11 No → s12", Q.next("s11", { currentOpioids: "No" }), { step: "s12" });
eq("s11 Yes → opioid modal", Q.next("s11", { currentOpioids: "Yes" }), { modal: "opioid" });
eq("s12 plain → s13", Q.next("s12", { conditions: ["I have diabetes"] }), { step: "s13" });
eq("s12 4+ drinks → alcohol modal", Q.next("s12", { conditions: ["I have diabetes", D.ALCOHOL] }), { modal: "alcohol" });
eq("s13 → s15", Q.next("s13", {}), { step: "s15" });
eq("s15 none → s16", Q.next("s15", { screening: ["None"] }), { step: "s16" });
eq("s15 liver → screening modal (that item)", Q.next("s15", { screening: [D.SCREENING[1]] }), { modal: "screening", item: D.SCREENING[1] });
eq("s15 first ticked item wins", Q.next("s15", { screening: [D.SCREENING[3], D.SCREENING[0]] }), { modal: "screening", item: D.SCREENING[0] });
eq("s16 → s17 → s18 → s19 → s20 → s22 → s9", ["s16", "s17", "s18", "s19", "s20", "s22"].map(function (s) { return Q.next(s, {}).step; }), ["s17", "s18", "s19", "s20", "s22", "s9"]);
eq("s9 → done", Q.next("s9", {}), { step: "done" });

// Every step has a progress value and analytics meta
eq("progress table covers 20 steps", Object.keys(D.PROGRESS).length, 20);
eq("meta covers the same steps", Object.keys(D.META).sort(), Object.keys(D.PROGRESS).sort());
eq("progress s1 = 5, s9 = 96", [Q.progress("s1"), Q.progress("s9")], [5, 96]);
eq("progress labels", [5, 15, 30, 50, 60, 80, 90, 96, 100].map(Q.progressLabel),
  ["", "Getting started...", "Making progress...", "Halfway there...", "Over halfway done!", "Almost there...", "Just a few more details!", "Finishing up...", "Complete!"]);

// Multi-select rules
eq("toggle adds", Q.toggleMulti([], "A"), ["A"]);
eq("toggle removes", Q.toggleMulti(["A", "B"], "A"), ["B"]);
eq("toggling a real option drops None", Q.toggleMulti(["None"], "A"), ["A"]);
eq("chip csv toggle strips the + prefix", Q.csvToggle("", "+ Cramping"), "Cramping");
eq("chip csv toggle appends and removes", [Q.csvToggle("Cramping", "+ Itching"), Q.csvToggle("Cramping, Itching", "+ Cramping")], ["Cramping, Itching", "Itching"]);
eq("csvHas", [Q.csvHas("Cramping, Itching", "+ Itching"), Q.csvHas("Cramping", "+ Itching")], [true, false]);

// Autocomplete
eq("suggest needs 2 chars", Q.suggest(D.MEDS, "m"), []);
eq("suggest substring, max 6, excludes picked", Q.suggest(D.MEDS, "in", ["Insulin"], 6).length, 6);
eq("suggest excludes picked", Q.suggest(D.MEDS, "insul", ["Insulin"]), []);
eq("cause suggestions max 5", Q.suggest(D.CAUSE_SUGGEST, "i", [], 5).length <= 5, true);
eq("lists are the reference's sizes", [D.MEDS.length, D.ALLERGIES.length, D.CAUSE_SUGGEST.length, D.TREATMENT_SUGGEST.length], [50, 20, 15, 15]);

// Recaps + lead phrase
eq("recap symptoms, Other replaced by typed text", Q.recapSymptoms({ symptoms: ["Numbness or tingling", "Other"], symptomOther: "Cramping" }), "You mentioned: numbness or tingling and cramping");
eq("recap symptoms drops empty Other", Q.recapSymptoms({ symptoms: ["Burning or stinging", "Other"] }), "You mentioned: burning or stinging");
eq("recap symptoms three items", Q.recapSymptoms({ symptoms: ["A", "B", "C"] }), "You mentioned: a, b and c");
eq("recap symptoms empty", Q.recapSymptoms({}), "");
eq("recap conditions strips prefixes", Q.recapConditions({ conditions: ["I have diabetes", "History of chemotherapy", "I drink 4+ alcoholic drinks per day"] }), "Including anything for your diabetes, chemotherapy and 4+ alcoholic drinks per day");
eq("recap conditions ignores None", Q.recapConditions({ conditions: ["None"] }), "");
eq("lead phrase none", Q.leadPhrase({}), "your symptoms");
eq("lead phrase one", Q.leadPhrase({ symptoms: ["Muscle weakness"] }), "muscle weakness");
eq("lead phrase two", Q.leadPhrase({ symptoms: ["A", "B"] }), "a and b");
eq("lead phrase three+", Q.leadPhrase({ symptoms: ["A", "B", "C", "D"] }), "a, b and more");

// Male-only option
eq("ED option only for Male", [Q.autonomicOptions({ sex: "Male" }).length, Q.autonomicOptions({ sex: "Female" }).length], [4, 3]);

// Lead validation
eq("lead all fields required", Q.validateLead({ name: "", email: "a@b.co", phone: "5555555555" }), { ok: false, fields: { name: true }, message: "Please fill in all fields" });
eq("lead bad email", Q.validateLead({ name: "A B", email: "nope", phone: "5555555555" }), { ok: false, fields: { email: true }, message: "Please enter a valid email address" });
eq("lead bad phone", Q.validateLead({ name: "A B", email: "a@b.co", phone: "555" }), { ok: false, fields: { phone: true }, message: "Please enter a 10-digit US phone number" });
eq("lead ok, phone normalised (leading 1 dropped)", Q.validateLead({ name: " Jane Doe ", email: "jane@x.io", phone: "+1 (555) 555-1234" }), { ok: true, fields: {}, name: "Jane Doe", email: "jane@x.io", phone: "5555551234" });
eq("normalizePhone keeps 10 digits", Q.normalizePhone("(555) 555-1234"), "5555551234");

// Payload: question ids + the derived acute/chronic flag
var a = { sex: "Female", pregnant: "No", pregConsent: "Agreed", symptoms: ["Numbness or tingling"], cause: "Diabetes",
  duration: "Less than 3 months", priorTreatment: "No", currentOpioids: "No", conditions: ["None"], medications: "None",
  screening: [D.SCREENING[1], D.SCREENING[3]], allergies: "No known allergies", heightFt: "5", heightIn: "7", emg: "No",
  autonomic: ["None"], doctorQuestions: "", dob: "01/02/1980" };
var p = Q.buildPayload(a, "180");
function find(id) { var r = p.filter(function (x) { return x.question_id === id; })[0]; return r ? r.answer : undefined; }
eq("payload acute flag", find(3700), "acute");
eq("payload chronic flag", Q.buildPayload({ duration: "3+ years" }).filter(function (x) { return x.question_id === 3700; })[0].answer, "chronic");
eq("payload height", find(3707), "5ft 7in");
eq("payload weight", find(3708), "180");
eq("payload liver/kidney + depression flags, no opioid flag", [find(3723), find(3724), find(3722)], ["Yes", "Yes", undefined]);
eq("payload doctor notes default", find(3726), "no questions");
eq("payload consents default", [find(3727), find(3728)], [D.COPY.consentTruthDefault, D.COPY.consentTreatDefault]);
eq("payload skips empty", p.filter(function (x) { return x.question_id === 3711; }).length, 0);
eq("payload conditions twice (3720 + 3701), like the reference", [find(3720), find(3701)], [["None"], ["None"]]);

// DOB lists
eq("years 2008 → 1920", [Q.years()[0], Q.years()[Q.years().length - 1], Q.years().length], ["2008", "1920", 89]);
eq("days 01 → 31", [Q.days()[0], Q.days()[30]], ["01", "31"]);

// Modals carry the reference's copy
eq("screening messages for all 4 items", D.SCREENING.filter(function (s) { return !!D.SCREENING_MSG[s]; }).length, 4);
eq("duration modal has no confirm (soft block)", D.MODALS.duration.confirm, null);
eq("four modals disqualify", ["pregnant", "opioid", "alcohol", "screening"].filter(function (k) { return !!D.MODALS[k].dq; }).length, 4);

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
