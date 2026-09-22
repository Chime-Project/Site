/* node chime-belly-first-reset_ind/js/reset-quiz-tests.js
   Rules of the question carousel + the page's house rules (no em dash, every
   referenced file exists, the markup and the rules name the same questions). */
"use strict";
var fs = require("fs");
var path = require("path");
var q = require("./reset-quiz.js");

var dir = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
var css = fs.readFileSync(path.join(dir, "css", "reset-lp.css"), "utf8");
var js = fs.readFileSync(path.join(__dirname, "reset-quiz.js"), "utf8");

var pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) pass++;
  else { fail++; console.log("FAIL  " + name); }
}
function eq(name, a, b) { ok(name + "  got " + JSON.stringify(a), JSON.stringify(a) === JSON.stringify(b)); }

/* --- question 4: the exclusive option --- */
var X = q.EXCLUSIVE;
eq("multi: add one", q.toggleMulti([], "gym"), ["gym"]);
eq("multi: add two", q.toggleMulti(["gym"], "apps"), ["gym", "apps"]);
eq("multi: remove", q.toggleMulti(["gym", "apps"], "gym"), ["apps"]);
eq("multi: exclusive clears the rest", q.toggleMulti(["gym", "apps", "glp1"], X), [X]);
eq("multi: another answer clears exclusive", q.toggleMulti([X], "fasting"), ["fasting"]);
eq("multi: exclusive toggles off", q.toggleMulti([X], X), []);
eq("multi: input is not mutated", (function () { var a = ["gym"]; q.toggleMulti(a, X); return a; })(), ["gym"]);

/* --- what counts as answered, how far a visitor may go --- */
var a = q.blank();
eq("furthest: fresh = start", q.furthest(a), 0);
a.started = true;
eq("furthest: started = q1", q.furthest(a), 1);
a.ancestry = "south-asian";
eq("furthest: q1 done = q2", q.furthest(a), 2);
a.family = "parent"; a.pattern = "middle";
eq("furthest: q3 done = q4", q.furthest(a), 4);
ok("answered: q4 empty is not answered", !q.isAnswered("tried", a));
a.tried = ["gym"];
eq("furthest: q4 done = q5", q.furthest(a), 5);
a.trigger = "energy";
eq("furthest: all done = result", q.furthest(a), 6);
eq("order has 7 slides", q.ORDER.length, 7);
ok("a gap stops progress", q.furthest({ started: true, ancestry: "x", family: "", pattern: "y", tried: ["gym"], trigger: "z" }) === 2);

/* --- the chip --- */
function ans(family, pattern, tried) {
  var b = q.blank(); b.family = family; b.pattern = pattern; b.tried = tried; return b;
}
eq("chip: all three, belly-first leads", q.chipItems(ans("parent", "middle", ["gym"])), ["belly-first weight pattern", "family history of type 2 diabetes", "prior weight loss attempts"]);
eq("chip: none", q.chipItems(ans("none-known", "all-over", [X])), []);
eq("chip: family only", q.chipItems(ans("multiple", "hips-thighs", [X])), ["family history of type 2 diabetes"]);
eq("chip: grandparents count as family history", q.chipItems(ans("grandparents-aunts-uncles", "all-over", [X])).length, 1);
eq("chip: belly only", q.chipItems(ans("none-known", "middle", [X])), ["belly-first weight pattern"]);
eq("chip: labs-disagree is not belly-first", q.chipItems(ans("none-known", "labs-disagree", [X])), []);
eq("chip: attempts only", q.chipItems(ans("none-known", "all-over", ["glp1", "apps"])), ["prior weight loss attempts"]);
eq("chip: unanswered = nothing", q.chipItems(q.blank()), []);

/* --- the saved record --- */
var rec = q.record(a, 6, true);
ok("record: version + page", rec.v === 1 && rec.page === "chime-belly-first-reset");
ok("storage key is this page's own", q.STORE_KEY === "chime:belly-first-reset");
ok("record: completed", rec.completed === true);
eq("record: answers", rec.answers, { ancestry: "south-asian", family: "parent", pattern: "middle", tried: ["gym"], trigger: "energy" });
eq("record: noted", rec.noted.length, 3);
var back = q.restore(JSON.stringify(rec));
eq("restore: round trip", back.answers.tried, ["gym"]);
eq("restore: index kept", back.index, 6);
eq("restore: index clamped to the first gap", q.restore(JSON.stringify({ v: 1, started: true, index: 6, answers: { ancestry: "another" } })).index, 2);
eq("restore: garbage = fresh", q.restore("{nope").index, 0);
eq("restore: wrong version = fresh", q.restore(JSON.stringify({ v: 9, answers: {} })).answers, q.blank());
eq("restore: null = fresh", q.restore(null).index, 0);

/* --- markup and rules agree --- */
q.ORDER.forEach(function (id) { ok("slide exists: " + id, html.indexOf('data-slide="' + id + '"') !== -1); });
["ancestry", "family", "pattern", "trigger"].forEach(function (n) {
  ok("radios: " + n, (html.match(new RegExp('type="radio" name="' + n + '"', "g")) || []).length >= 4);
});
eq("q1 has 4 answers", (html.match(/type="radio" name="ancestry"/g) || []).length, 4);
eq("q5 has 5 answers", (html.match(/type="radio" name="trigger"/g) || []).length, 5);
eq("q4 has 7 answers", (html.match(/type="checkbox" name="tried"/g) || []).length, 7);
ok("q4 exclusive value in the markup", html.indexOf('value="' + X + '" data-exclusive') !== -1);
["none-known", "middle"].forEach(function (v) { ok("chip value in the markup: " + v, html.indexOf('value="' + v + '"') !== -1); });
eq("one h1", (html.match(/<h1[\s>]/g) || []).length, 1);
eq("15 screen labels or more", (html.match(/data-screen-label=/g) || []).length >= 15, true);

/* --- house rules --- */
[["index.html", html], ["reset-lp.css", css], ["reset-quiz.js", js]].forEach(function (f) {
  ok("no em dash in " + f[0], f[1].indexOf("—") === -1);
});
ok("no en dash in the page copy", html.indexOf("–") === -1);
var visible = html.replace(/<!--[\s\S]*?-->/g, "");
ok("brand: no AmeriLean in visible copy", visible.indexOf("AmeriLean") === -1);
ok("no sister-page copy left: NAD+ / Metabolic Reset / Restore Vial", !/NAD\+|Metabolic Reset|Restore Vial/.test(visible));
ok("tesamorelin copy present", /Target Vial/.test(visible) && /tesamorelin/i.test(visible));
ok("price is a visible placeholder", visible.indexOf('<span class="ph">[TBD]</span>') !== -1);
ok("waist rows carry from/to", (html.match(/data-from="\d+" data-to="\d+"/g) || []).length === 2);
ok("noindex", html.indexOf('name="robots" content="noindex"') !== -1);
ok("assessment link keeps its camelCase", html.indexOf('href="../chimeAssessment.html"') !== -1);
ok("no label above a headline", !/<p class="label">[^<]*<\/p>\s*<h[123]/.test(html));

/* --- every local file the page points at exists --- */
var refs = [];
html.replace(/(?:src|href)="([^"#:]+)"/g, function (m, u) { refs.push(u); return m; });
html.replace(/srcset="([^"]+)"/g, function (m, set) {
  set.split(",").forEach(function (p) { refs.push(p.trim().split(" ")[0]); });
  return m;
});
refs.filter(function (u) { return u.indexOf("//") === -1; }).forEach(function (u) {
  ok("file exists: " + u, fs.existsSync(path.join(dir, u.split("?")[0])));
});

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
