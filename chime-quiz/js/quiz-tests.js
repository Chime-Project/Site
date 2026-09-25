// node chime-quiz/js/quiz-tests.js — checks for the RemedyMeds quiz clone (Chime branding): the brand switch is
// complete, nothing of theirs ships (trackers, Next.js, their links), the answers go nowhere, every step of their
// config is there, and every local file resolves. No DOM.
"use strict";
var fs = require("fs");
var path = require("path");

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var page = html.replace(/<!--[\s\S]*?-->/g, "");
var css = fs.readFileSync(path.join(DIR, "css", "quiz.css"), "utf8");
var engine = fs.readFileSync(path.join(__dirname, "quiz.js"), "utf8");
var comps = fs.readFileSync(path.join(__dirname, "quiz-components.js"), "utf8");
var cfgSrc = fs.readFileSync(path.join(__dirname, "quiz-config.js"), "utf8");
var window = {};
new Function("window", cfgSrc)(window);
var CFG = window.CHIME_QUIZ;

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}
function strip(s) { return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""); }

// Brand switch
var shipped = page + strip(css) + strip(engine) + strip(comps) + cfgSrc.replace(/^\/\*[\s\S]*?\*\//, "");
eq(/remedy/i.test(shipped), false, "no Remedy / RemedyMeds anywhere that ships");
eq(/rmsplit/.test(shipped), false, "no paths of theirs");
eq(fs.readdirSync(path.join(DIR, "images")).filter(function (f) { return /remedy/i.test(f); }), [], "no image named after them");
eq(/<title>Chime Health<\/title>/.test(page), true, "title");
eq((CFG.header.source.match(/<title>Chime Health<\/title>/g) || []).length, 2, "both header logos are Chime's");
eq(cfgSrc.indexOf("images/logo-chime-white.svg") > -1, true, "Chime logo in the projection chart");
eq(cfgSrc.indexOf("images/warranty-chime.webp") > -1, true, "the warranty seal with the Chime wordmark");
eq(cfgSrc.indexOf("Chime Health members") > -1 && comps.indexOf("Chime Health members") > -1, true, "members line renamed");
eq(comps.indexOf("Chime Health Weight Loss Warranty") > -1, true, "warranty line renamed");
eq(/href="\.\.\/terms-conditions\.html"/.test(comps) && fs.existsSync(path.join(DIR, "..", "terms-conditions.html")), true, "Terms → Chime's terms page");
eq(/data-theme="chime"/.test(page) && /\[data-theme=chime\]/.test(css), true, "theme attribute renamed in page and CSS");
eq(/noindex/.test(page), true, "noindex");

// Nothing of theirs runs; nothing is sent or stored
["posthog", "segment", "customer.io", "cioanalytics", "googletagmanager", "gtag(", "osano", "attn.tv", "clarity.ms",
 "bat.bing", "facebook.com/tr", "_next/", "_vercel", "fonts.googleapis"].forEach(function (w) {
  eq(shipped.toLowerCase().indexOf(w), -1, "no '" + w + "'");
});
eq(/(src|href)="https?:/.test(page), false, "no external src/href in the page");
eq(/localStorage|sessionStorage|sendBeacon|XMLHttpRequest|document\.cookie/.test(strip(engine) + strip(comps)), false, "nothing stored or beaconed");
eq((strip(engine).match(/fetch\(/g) || []).length, 0, "the engine fetches nothing");
eq((strip(comps).match(/fetch\("([^"]+)"/g) || []), ['fetch("data/usa-topo.json"'], "the only request: the map's own topology file");
eq(/<form\b[^>]*\saction=/.test(page + cfgSrc), false, "no form action");
eq(/ev\.preventDefault\(\);[\s\S]{0,400}next\(\);/.test(engine), true, "submit is handled in the page");
eq(/HAND_OFF = "\.\.\/choose-treatment\/v2\.html"/.test(engine) && fs.existsSync(path.join(DIR, "..", "choose-treatment", "v2.html")), true, "contact form → Choose Your Treatment V2");
eq(CFG.triggers.some(function (t) { return (t.functions || []).some(function (f) { return (f.name || f) === "emitTelemetry"; }); }), false, "their telemetry triggers are gone");

// Their quiz, whole
var names = CFG.steps.map(function (s) { return s.name; });
eq(names.length, 25, "25 steps, as theirs (progress counts the same)");
["select_primary_goal", "personalized_plan", "body_info", "goal_weight", "timeline", "projected_plan", "outcomes_education",
 "weight_loss_history", "whoami_anon", "location_confirm", "stats_page", "conditions", "conditions_male", "comorbidities",
 "opoids", "has_disorders", "has_disorders_male", "medication_adherence_concerns", "medication_adherence_concerns_male",
 "medical_review", "finalizing_plan", "pii"].forEach(function (n) { eq(names.indexOf(n) > -1, true, "step " + n); });
eq(CFG.steps.filter(function (s) { return ["goal_intro", "value_highlights", "final_step"].indexOf(s.name) > -1; })
  .every(function (s) { return !s.sections.length; }), true, "the three after-contact screens are empty placeholders");
var keys = [];
CFG.steps.forEach(function (s) { s.sections.forEach(function (x) { if (x.question_key) keys.push(x.question_key); }); });
["primary_goal", "height_feet", "height_inches", "weight", "goal_weight", "timeline_for_weight_loss", "on_weight_loss_meds",
 "gender", "dob", "location", "what_conditions_apply_to_you", "comorbidities", "is_taking_opiates", "has_disorders",
 "medication_adherence_concerns", "first_name", "last_name", "email", "phone", "phone_opt_in"].forEach(function (k) {
  eq(keys.indexOf(k) > -1, true, "question " + k);
});
eq(cfgSrc.indexOf("Your dose depends on your body.") > -1 && cfgSrc.indexOf("What matters most to you right now?") > -1, true, "their copy");
eq(Object.keys(CFG.styles).length > 30, true, "their template styles");
["showWhenLocationIsServed"].forEach(function (f) { eq(engine.indexOf(f) > -1, true, "when-rule " + f); });
["validateBmi", "validateAdultAge", "validateDate", "validateYear", "validateGoalWeightLessThanCurrentWeight",
 "validateGoalWeightHealthyBmi", "validateFastingGlucose", "validateHbA1c"].forEach(function (f) {
  eq(engine.indexOf(f + ":") > -1, true, "validator " + f);
});
eq(/UNSUPPORTED_STATES = \["LA"\]/.test(engine) && /MICRO_DOSE_FLOOR = 20/.test(engine), true, "their served-state and BMI floor constants");

// Every local asset resolves; one ?v=
var refs = [];
page.replace(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g, function (_, u) { refs.push(u); });
css.replace(/url\(["']?([^"')]+)["']?\)/g, function (_, u) { if (!/^data:/.test(u)) refs.push(path.join("css", u)); });
(cfgSrc + comps).replace(/images\/[\w.-]+\.(?:webp|svg|png)/g, function (u) { refs.push(u); });
refs.push("data/usa-topo.json");
refs.forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, "asset exists: " + u); });
var vs = {};
page.replace(/\?v=(\d+)/g, function (_, v) { vs[v] = 1; });
eq(Object.keys(vs), ["20260965"], "single ?v= value");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
