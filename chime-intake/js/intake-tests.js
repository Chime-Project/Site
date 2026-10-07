// node chime-intake/js/intake-tests.js — checks for the Chime Health intake (branding-only clone of a competitor's
// GLP-1 intake): their DQ and show/hide rules, BMI and projections, validation, plan totals per ladder row for both
// medications, the funnel's hrefs, the brand switch (their name nowhere in chime-intake/), nothing sent anywhere,
// every local file resolving, and the §4c "nothing above a title" moves. No DOM; the rendered 60px check is run in the
// browser (see README).
"use strict";
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var DIR = path.join(__dirname, "..");
var REPO = path.join(DIR, "..");
var g = {};
["intake-config.js", "intake-rules.js", "plans.js"].forEach(function (f) { new Function("window", fs.readFileSync(path.join(__dirname, f), "utf8"))(g); });
var C = g.CHIME_INTAKE, R = g.CHIME_INTAKE_RULES, PL = g.CHIME_PLANS;
var read = function (p) { return fs.readFileSync(path.join(DIR, p), "utf8"); };
var PAGES = ["index.html", "recommendation/index.html", "checkout/index.html"];
var JS = ["js/intake-config.js", "js/intake-rules.js", "js/intake.js", "js/plans.js", "js/recommendation.js", "js/checkout.js"];
var stripJs = function (s) { return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""); };
var stripHtml = function (s) { return s.replace(/<!--[\s\S]*?-->/g, ""); };

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}
function walk(d) { return fs.readdirSync(d).reduce(function (a, f) { var p = path.join(d, f); return a.concat(fs.statSync(p).isDirectory() ? walk(p) : [p]); }, []); }
var ALL = walk(DIR);

// ---------- brand switch ----------
var TEXT = ALL.filter(function (p) { return /\.(html|js|css|md|json|svg|txt)$/.test(p); });
var BRAND = new RegExp("r" + "x\\s*" + "p" + "ros", "i");
eq(TEXT.filter(function (p) { return BRAND.test(fs.readFileSync(p, "utf8")); }).map(function (p) { return path.relative(DIR, p); }), [], "their name appears in no text file of chime-intake/");
eq(ALL.filter(function (p) { return BRAND.test(path.relative(DIR, p)); }), [], "no file named after them");
eq(ALL.filter(function (p) { return /\.(png|webp|jpe?g|woff2)$/.test(p) && BRAND.test(fs.readFileSync(p).toString("latin1")); }).map(function (p) { return path.relative(DIR, p); }), [], "their name in no binary either");
PAGES.forEach(function (p) {
  var h = read(p);
  eq(/<meta name="robots" content="noindex">/.test(h), true, p + " is noindex");
  eq(/<title>[^<]*Chime Health<\/title>/.test(h), true, p + " title names Chime Health");
});
eq((read("js/intake.js").match(/Chime Health/g) || []).length >= 8, true, "brand name in the intake copy (great fit, results, quote, reviews, profile, consent)");
eq(/You're a Great Fit for Chime Health\./.test(read("js/intake-config.js")), true, "great-fit title");
eq(/consent for Chime Health to contact you/.test(read("js/intake.js")), true, "SMS consent names Chime Health");
eq(/authorize Chime Health to charge/.test(read("js/checkout.js")) && /Chime Health is committed/.test(read("js/checkout.js")), true, "checkout legal copy names Chime Health");
// their people photos never ship: no image byte-identical to a captured asset of theirs, except their non-brand art
var REF = path.join(REPO, "uploads", ["r", "x", "p", "r", "o", "s"].join("") + "-intake-ref", "assets");   // their capture (untracked); name spelled out of band
if (fs.existsSync(REF)) {
  var md5 = function (p) { return crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex"); };
  var theirs = {}; fs.readdirSync(REF).forEach(function (f) { theirs[md5(path.join(REF, f))] = f; });
  var same = ALL.filter(function (p) { return /images\//.test(p) && theirs[md5(p)]; }).map(function (p) { return path.basename(p); }).sort();
  eq(same, ["graph.webp", "klarna.png", "payments-amex.png", "payments-mastercard.png", "payments-visa.png"], "only their non-brand art is reused (graph, Klarna, card-network icons)");
}

// ---------- nothing sent, nothing remote ----------
var shippedJs = JS.map(function (f) { return stripJs(read(f)); }).join("\n");
["fetch(", "XMLHttpRequest", "sendBeacon", "localStorage", "document.cookie", "navigator.geolocation", "maps.googleapis", "stripe.com", "trustpilot.com", "capi.", "ipify", "googletagmanager", "facebook"].forEach(function (w) {
  eq(shippedJs.indexOf(w), -1, "shipped JS has no '" + w + "'");
});
eq(/sessionStorage/.test(shippedJs), true, "answers ride in sessionStorage");
var urls = []; JS.concat(PAGES).concat(["css/base.css", "css/intake.css", "css/recommendation.css", "css/checkout.css", "css/chime-checkout.css"]).forEach(function (f) {
  var s = /\.html$/.test(f) ? stripHtml(read(f)) : /\.js$/.test(f) ? stripJs(read(f)) : read(f);
  (s.match(/https?:\/\/[^\s"'<>)]+/g) || []).forEach(function (u) { urls.push(u); });
});
eq(Array.from(new Set(urls)).sort(), ["http://www.w3.org/2000/svg", "https://static.legitscript.com/seals/51605690.png", "https://www.legitscript.com/websites/?checker_keywords=chimehealth.com"],
  "the only absolute URLs: SVG namespace + Chime's LegitScript seal and checker (Nick's code)");
eq(/<form\b/.test(PAGES.map(read).join("")), false, "no form elements that could post anywhere");
eq(/fonts\.googleapis|fonts\.gstatic/.test(PAGES.map(read).join("") + read("css/base.css")), false, "fonts self-hosted");

// ---------- local files resolve, cache bust ----------
PAGES.forEach(function (p) {
  var h = stripHtml(read(p)), base = path.dirname(path.join(DIR, p));
  (h.match(/(?:src|href)="([^"#]+)"/g) || []).map(function (m) { return m.replace(/^(src|href)="/, "").replace(/"$/, ""); })
    .filter(function (u) { return !/^https?:/.test(u); }).forEach(function (u) {
      eq(fs.existsSync(path.join(base, u.split("?")[0])), true, p + " → " + u + " exists");
      if (/\.(css|js)(\?|$)/.test(u)) eq(/\?v=20260992$/.test(u), true, p + " → " + u + " carries ?v=20260992");
    });
});
var cssUrls = (read("css/base.css").match(/url\(([^)]+)\)/g) || []).map(function (m) { return m.slice(4, -1).replace(/["']/g, ""); }).filter(function (u) { return !/^data:/.test(u); });
eq(cssUrls.every(function (u) { return fs.existsSync(path.join(DIR, "css", u)); }) && cssUrls.length > 0, true, "every font file the CSS names exists");
var imgRefs = []; JS.forEach(function (f) { (read(f).match(/(?:\.\.\/)?images\/[a-z0-9-]+\.(?:webp|png)/g) || []).forEach(function (u) { imgRefs.push(u.replace(/^\.\.\//, "")); }); });
eq(Array.from(new Set(imgRefs)).filter(function (u) { return !fs.existsSync(path.join(DIR, u)); }), [], "every image the scripts name exists");
["member-1", "member-2", "member-3", "member-4", "member-5", "member-6"].forEach(function (m) { eq(fs.existsSync(path.join(DIR, "images", m + ".webp")), true, m + " stand-in exists"); });

// ---------- config: their flow, whole ----------
eq(C.FLOW.map(function (s) { return s.id; }), ["screening", "qualified", "results"], "live flow = screening → great fit → medical profile");
eq(C.DORMANT, ["pace", "pace-confirmed", "formulation", "preference", "further-info"], "five dormant steps kept, not built");
eq(C.DORMANT.every(function (id) { return C.ALL_STEPS.some(function (s) { return s.id === id; }); }), true, "dormant steps still in the config");
eq(C.SCREENING.length, 21, "21 screening blocks");
eq(C.SCREENING.filter(function (b) { return b.showIf; }).length, 11, "11 conditional blocks (+ the contraception note)");
eq(C.SCREENING.find(function (b) { return b.id === "health-1"; }).options.length, 23, "conditions list 1 has 23 options");
eq(C.SCREENING.find(function (b) { return b.id === "health-2"; }).options.length, 11, "conditions list 2 has 11 options");
eq(C.SCREENING.find(function (b) { return b.id === "glp-dose"; }).options.length, 13, "13 dose options");

// ---------- show / hide ----------
var vis = function (a) { return C.visibleBlocks(C.SCREENING, a).map(function (b) { return b.id; }); };
var has = function (a, id) { return vis(a).indexOf(id) > -1; };
eq(vis({}).length, 10, "10 blocks before any branch opens");
eq(has({ sex: "female" }, "pregnancy"), true, "female → pregnancy question");
eq(has({ sex: "male" }, "pregnancy"), false, "male → no pregnancy question");
eq(has({ health_conditions_1: ["gall_bladder_disease"] }, "gallbladder-removed"), true, "gallbladder disease → removed?");
eq(has({ health_conditions_1: ["none"] }, "gallbladder-removed"), false, "no gallbladder follow-up otherwise");
eq(has({ health_conditions_2: ["chronic_opiate_use"] }, "chronic-opiate-details"), true, "chronic opiates → details");
eq(has({ health_conditions_2: ["routine_opiate_use"] }, "chronic-opiate-details"), true, "routine opiates → details");
eq(has({ health_conditions_2: ["prior_bariatric_surgery"] }, "bariatric-details"), true, "prior bariatric → details");
eq(has({ health_conditions_2: ["bariatric_surgery_past_year"] }, "bariatric-details"), true, "recent bariatric → details");
eq(has({ taking_meds: "yes" }, "taking-meds-details") && !has({ taking_meds: "no" }, "taking-meds-details"), true, "meds yes → details");
eq(has({ medication_allergies: "yes" }, "allergies-details") && !has({ medication_allergies: "no" }, "allergies-details"), true, "allergies yes → details");
eq(vis({ glp_history: "yes_currently_glp_1" }).filter(function (id) { return /^glp-/.test(id); }), ["glp-history", "glp-med-type", "glp-last-dose-date", "glp-next-preference"], "GLP-1 yes → med, when, next");
eq(has({ glp_history: "yes_currently_glp_1", glp1_medication_type: "tirzepatide" }, "glp-dose"), true, "tirzepatide → last dose");
eq(has({ glp_history: "yes_currently_glp_1", glp1_medication_type: "other" }, "glp-dose"), false, "something else → no dose list");
eq(has({ glp_history: "yes_currently_glp_1", glp1_medication_type: "other" }, "glp-other-details"), true, "something else → which medication");
eq(C.pruneAnswers({ sex: "male", pregnancy_conditions: ["pregnant"] }).pregnancy_conditions, [], "switching to male clears the pregnancy answer");
eq(C.pruneAnswers({ taking_meds: "no", taking_meds_details: "x" }).taking_meds_details, "", "hidden details are cleared");
eq(C.toggleMulti(["ibd"], "none", "none"), ["none"], "'None of the below' clears the others");
eq(C.toggleMulti(["none"], "ibd", "none"), ["ibd"], "picking a condition clears 'None'");
eq(C.toggleMulti(["ibd", "binge_drinking"], "ibd", "none"), ["binge_drinking"], "toggle off");

// ---------- DQ ----------
var dq = function (a) { return C.hasDisqualifyingAnswer(a); };
eq(dq({ pregnancy_conditions: ["pregnant"] }), true, "pregnant → DQ");
eq(dq({ pregnancy_conditions: ["breastfeeding"] }), true, "breastfeeding → DQ");
eq(dq({ pregnancy_conditions: ["recent_birth"] }), false, "gave birth recently → not DQ");
["history_mtc_men2", "eating_disorder", "severe_kidney_disease", "severe_liver_disease", "current_suicidal_thoughts", "cancer", "severe_gi_condition",
 "untreated_substance_use_disorder", "untreated_hypothyroidism", "type_2_diabetes_insulin_or_high_a1c", "type_1_diabetes", "diabetic_retinopathy",
 "warfarin", "pancreatitis", "high_blood_pressure_160_100", "resting_heart_rate_over_110"].forEach(function (v) { eq(dq({ health_conditions_1: [v] }), true, v + " → DQ"); });
["history_organ_transplant", "street_drugs_or_unprescribed_meds", "recent_heart_attack_or_stroke", "coronary_artery_disease", "congestive_heart_failure"].forEach(function (v) { eq(dq({ health_conditions_1: [v] }), false, v + " → not DQ (theirs)"); });
eq(dq({ health_conditions_1: ["gall_bladder_disease"] }), true, "gallbladder disease, unanswered → DQ");
eq(dq({ health_conditions_1: ["gall_bladder_disease"], gallbladder_removed: "no" }), true, "gallbladder not removed → DQ");
eq(dq({ health_conditions_1: ["gall_bladder_disease"], gallbladder_removed: "yes" }), false, "gallbladder removed → OK");
eq(C.SCREENING.find(function (b) { return b.id === "health-2"; }).options.some(function (o) { return dq({ health_conditions_2: [o.value] }); }), false, "list 2 never disqualifies");
eq(C.disqualifyReason({ pregnancy_conditions: ["pregnant"] }), "Based on your answer — “Pregnant, or possibly pregnant” — we are unable to prescribe weight loss medication at this time.", "DQ page quotes the answer");
eq(/^Active gallbladder disease without surgical removal/.test(C.disqualifyReason({ health_conditions_1: ["gall_bladder_disease"], gallbladder_removed: "no" })), true, "gallbladder has its own message");

// ---------- BMI + projections ----------
eq(C.computeBmi({ feet: "5", inches: "6", weight: "220" }), 35.5, "BMI 5'6\" 220 lb = 35.5");
eq(C.computeBmi({ feet: "5", inches: "6", weight: "110" }), 17.8, "BMI 5'6\" 110 lb = 17.8");
eq(C.computeBmi({ feet: "", inches: "", weight: "220" }), null, "no BMI without height");
var pj = C.computeProjections({ weight: "220", goal_weight: "160" });
eq([pj.weightToLose, pj.weeklyLossLow, pj.weeklyLossHigh, pj.weeksToGoal], [60, 3.3, 4.4, 18], "220 → 160: 60 lbs, 3.3–4.4 lbs/week, 18 weeks");

// ---------- validation ----------
var B = function (id) { return C.SCREENING.find(function (b) { return b.id === id; }); };
var ok = { feet: "5", inches: "6", weight: "220", goal_weight: "160", state: "NY", dob_month: "1", dob_day: "1", dob_year: "1985" };
eq(R.blockError(B("measurements"), {}), "Enter your height and weight", "height/weight required");
eq(R.blockError(B("measurements"), { feet: "5", inches: "0", weight: "220" }), null, "0 inches is a valid answer");
eq(R.blockError(B("measurements"), { feet: "5", inches: "6", weight: "99" }), "Enter your height and weight", "weight under 100 rejected");
eq(R.blockError(B("measurements"), { feet: "5", inches: "6", weight: "120" }), "Your BMI is too low to qualify for GLP-1 treatment", "BMI < 20 blocks (19.4)");
eq(R.blockError(B("measurements"), { feet: "5", inches: "6", weight: "125" }), null, "BMI 20.2 passes");
eq(R.blockError(B("goal-weight"), { weight: "220", goal_weight: "230" }), "Enter a goal weight below your current weight", "goal must be below current");
eq(R.goalError("230", "220"), "Goal weight must be lower than your current weight.", "inline goal error copy");
eq(R.blockError(B("goal-weight"), { weight: "220", goal_weight: "85" }), "Enter a goal weight below your current weight", "goal under 90 rejected");
eq(R.blockError(B("state"), {}), "Choose the state your medication would ship to", "state required");
eq(R.blockError(B("state"), { state: "LA" }), "Service is not available in this state", "Louisiana blocked");
eq(R.blockError(B("state"), { state: "MS" }), "Service is not available in this state", "Mississippi blocked");
eq(R.blockError(B("state"), { state: "NY" }), null, "New York served");
eq(C.STATES.some(function (s) { return s.code === "LA" || s.code === "MS"; }), false, "LA / MS left out of the picker, as theirs");
eq(C.STATES.length, 55, "50 states − LA − MS + DC + 6 territories");
var now = new Date(), y18 = String(now.getFullYear() - 17);
eq(R.blockError(B("dob"), { dob_month: "1", dob_day: "1", dob_year: y18 }) !== null || now.getMonth() === 0 && now.getDate() === 1, true, "under 18 rejected");
eq(R.blockError(B("dob"), { dob_month: "2", dob_day: "30", dob_year: "1985" }), "Enter your date of birth", "Feb 30 rejected");
eq(R.blockError(B("dob"), { dob_month: "1", dob_day: "1", dob_year: "1985" }), null, "valid DOB");
eq(R.ageFrom("01/15/2000", new Date(2026, 0, 14)), 25, "age the day before the birthday");
eq(R.ageFrom("01/15/2000", new Date(2026, 0, 15)), 26, "age on the birthday");
eq(R.blockError(B("sex"), {}), "Choose an option", "choice required");
eq(R.blockError(B("health-1"), { health_conditions_1: [] }), "Choose at least one, or “None of the below”", "multi required");
eq(R.blockError(B("bariatric-details"), { bariatric_surgery_details: "  " }), "Add a little detail for your provider", "details required");
var screening = C.FLOW[0];
var full = Object.assign({}, ok, { sex: "male", health_conditions_1: ["none"], health_conditions_2: ["none"], taking_meds: "no", medication_allergies: "no", glp_history: "no" });
eq(R.stepErrors(screening, full), {}, "a complete male screening has no errors");
eq(Object.keys(R.stepErrors(screening, Object.assign({}, full, { sex: "female" }))), ["pregnancy_conditions"], "female adds the pregnancy question");
var contact = C.FLOW[2];
eq(Object.keys(R.stepErrors(contact, {})).sort(), ["email", "first_name", "last_name", "phone"], "contact form: all four required");
eq(R.stepErrors(contact, { first_name: "A", last_name: "B", email: "a@b.co", phone: "(212) 555-0100" }), {}, "valid contact");
eq(R.phoneOk("(112) 555-0100"), false, "area code can't start with 1");
eq(R.phoneOk("(911) 555-0100"), false, "N11 area code rejected");
eq(R.phoneOk("(212) 155-0100"), false, "exchange can't start with 1");
eq(R.phoneOk("+1 (212) 555-0100"), true, "leading 1 accepted");
eq(R.maskPhone("2125550100"), "(212) 555-0100", "phone mask");
eq(R.maskPhone("12125550100"), "+1 (212) 555-0100", "phone mask with country code");
eq(R.maskPhone("2125"), "(212) 5", "partial mask");
eq(R.clampNum("2a5x0", 999), "250", "weight keeps digits");
eq(R.clampNum("1234", 999), "123", "weight keeps 3 digits (theirs)");
eq(R.EMAIL_RE.test("a@b"), false, "email needs a TLD");

// ---------- plan ladder (both medications, every row) ----------
var LADDER = {
  tirzepatide: [[1, 249.97, 249.97, 0, ""], [3, 199.97, 599.91, 150, ""], [6, 174.97, 1049.82, 450, "Popular"], [12, 119.97, 1439.64, 1560, "Recommended"]],
  semaglutide: [[1, 174.97, 174.97, 0, ""], [3, 149.97, 449.91, 75, ""], [6, 124.97, 749.82, 300, "Popular"], [12, 89.97, 1079.64, 1020, "Recommended"]]
};
Object.keys(LADDER).forEach(function (med) {
  LADDER[med].forEach(function (row) {
    var p = PL.plan(med, row[0]);
    eq([p.monthly, p.total, p.savings, p.pill], row.slice(1), med + " " + row[0] + "-month: monthly, due today, savings, badge");
    eq(p.renewal, "By clicking \"Complete Purchase\" you agree to enroll in a " + row[0] + "-month program billed every " + row[0] + " months, with automatic renewal and charges until canceled.", med + " " + row[0] + "-month auto-renew copy");
  });
  eq(PL.plan(med, 12).huge && !PL.plan(med, 6).huge, true, med + ": HUGE SAVINGS only on 12 months");
});
eq(PL.plan("tirzepatide", 1).title + " / " + PL.plan("semaglutide", 3).title, "Tirzepatide Monthly Plan / Semaglutide 3-Month Plan", "plan titles");
eq([PL.minMonthly("semaglutide"), PL.minMonthly("tirzepatide")], [89.97, 119.97], "'starting at' prices");
eq(PL.DEFAULT_TERM, 6, "6-month plan preselected");
eq(PL.money(1049.82) + " " + PL.money(1560), "$1,049.82 $1,560.00", "money format");
eq([PL.plan("tirzepatide", 6).supply, PL.plan("semaglutide", 12).supply], ["3 month supply now, 3 more in 90 days.", "3 vials every 90 days for a year."], "supply copy per plan");
eq(/S\.term !== 1 \? '<button type="button" class="klarna-btn"/.test(read("js/checkout.js")), true, "Klarna hidden on the monthly plan, as theirs");

// ---------- recommendation maths ----------
eq([R.medMonths(220, 160, 35.5, "semaglutide"), R.medMonths(220, 160, 35.5, "tirzepatide")], [13, 10], "220 → 160: sema 13 months, tirz 10 months (as theirs)");
var pts = R.points(220, 160, R.estMonths(220, 160, 35.5));
eq([pts.length, pts[0].weight, pts[pts.length - 1].weight], [9, 220, 160], "projection points: 9 months, 220 → 160");
eq(pts.every(function (p, i) { return i === 0 || p.weight < pts[i - 1].weight; }), true, "projection always going down");

// ---------- checkout address ----------
var addr = { addressLine1: "350 5th Avenue", addressLine2: "", city: "New York", state: "NY", zip: "10118" };
eq(R.addressError(addr), "", "complete address passes");
eq(R.addressError(Object.assign({}, addr, { zip: "1011" })), "Complete the shipping address.", "ZIP needs 5 digits");
eq(R.addressError(Object.assign({}, addr, { addressLine1: "P.O. Box 12" })), "We do not ship to PO boxes", "PO box rejected");
eq(R.addressError(Object.assign({}, addr, { state: "LA" })), "Service is not available in this state", "LA rejected at checkout");
eq([R.resolveState("louisiana"), R.resolveState("Missi"), R.resolveState("ny")], ["LA", "MS", "NY"], "state input resolves names");

// ---------- funnel hrefs ----------
eq(/RECOMMENDATION_URL = "recommendation\/"/.test(read("js/intake.js")) && fs.existsSync(path.join(DIR, "recommendation/index.html")), true, "See my plan options → recommendation/");
eq(/location\.href = "\.\.\/checkout\/"/.test(read("js/recommendation.js")) && fs.existsSync(path.join(DIR, "checkout/index.html")), true, "PROCEED TO CHECKOUT → ../checkout/");
eq(/location\.replace\("\.\.\/"\)/.test(read("js/recommendation.js")), true, "recommendation without answers → back to the intake");
eq(/location\.replace\("\.\.\/recommendation\/"\)/.test(read("js/checkout.js")), true, "checkout without a pick → recommendation");
eq(/HANDOFF_KEY/.test(read("js/recommendation.js")) && /HANDOFF_KEY/.test(read("js/checkout.js")) && /ANSWERS_KEY/.test(read("js/intake.js")), true, "sessionStorage keys shared, not retyped");
var legalLinks = []; ["js/intake.js", "js/checkout.js"].forEach(function (f) { (read(f).match(/"\.\.\/[a-z-]+\.html(#[a-z]+)?"/g) || []).forEach(function (u) { legalLinks.push(u.slice(1, -1)); }); });
legalLinks = Array.from(new Set(legalLinks)).sort();
eq(legalLinks, ["../consumer-health-data-privacy-policy.html", "../faq.html#jurisdictions", "../hipaa-notice.html", "../privacy-policy.html", "../return-refund-policy.html", "../shipping-policy.html", "../telehealth-consent.html", "../terms-conditions.html"], "legal links are Chime's footer pages");
legalLinks.forEach(function (u) { eq(fs.existsSync(path.join(REPO, u.slice(3).split("#")[0])), true, u + " exists in the repo"); });
eq(/Complete purchase|data-act="demo"/i.test(read("js/checkout.js")) && /Demo checkout — no payment is taken/.test(read("js/checkout.js")), true, "Pay buttons are inert with a demo notice");

// ---------- §4c: nothing sits above a title ----------
eq(/<article class="f9-sc-rev"><h3 class="f9-sc-rev__title">/.test(read("js/intake.js")), true, "review cards: title first, then avatar / name / badge / stars");
eq(/<div class="rx-checkout-testimonial"><h3>' \+ esc\(r\.title\) \+ '<\/h3><div class="rx-checkout-testimonial__stars/.test(read("js/checkout.js")), true, "checkout testimonial: title first, stars below");
// headings rendered by the scripts: each opens its own block, except the two disclaimers that close the block above
// them (the "*" footnote of the great-fit copy, the estimate caption of the weight graph) — see README
var heads = (read("js/intake.js") + read("js/recommendation.js") + read("js/checkout.js")).match(/<h[123][^>]*>/g) || [];
eq(heads.length >= 15, true, "headings found in the templates (" + heads.length + ")");
var before = function (src, h) { var i = src.indexOf(h); return src.slice(Math.max(0, i - 420), i); };
var I = read("js/intake.js");
eq(/f9-sc__fine--footnote/.test(before(I, '<h2 class="f9-sc__title">What Happens Next:')), true, "known exception 1: great-fit footnote (theirs) sits above 'What Happens Next:'");
eq(/f9-prof__fine/.test(before(I, '<h2 class="f9-prof__form-title">')), true, "known exception 2: graph estimate caption (theirs) sits above the form title");

// ---------- seal ----------
eq(/href="https:\/\/www\.legitscript\.com\/websites\/\?checker_keywords=chimehealth\.com" target="_blank"[^>]*><img src="https:\/\/static\.legitscript\.com\/seals\/51605690\.png" alt="Verify Approval for www\.chimehealth\.com" width="73" height="79">/.test(read("js/intake.js")), true, "Chime's LegitScript seal, Nick's code");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
