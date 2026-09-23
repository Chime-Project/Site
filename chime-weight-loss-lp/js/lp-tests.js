// node chime-weight-loss-lp/js/lp-tests.js — checks for the weight-loss pre-quiz clone:
// the quiz rules (ported from the reference), the branding swap, and that nothing of
// Aspen's (name, tracking, certificate, links) ships on the page. No DOM.
"use strict";
var fs = require("fs");
var path = require("path");
var lp = require(path.join(__dirname, "lp.js"));

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var css = fs.readFileSync(path.join(DIR, "css", "lp.css"), "utf8");
var js = fs.readFileSync(path.join(__dirname, "lp.js"), "utf8");
var page = html.replace(/<!--[\s\S]*?-->/g, ""); // what ships to the browser, minus build notes
var cssBody = css.replace(/\/\*[\s\S]*?\*\//g, "");
var jsBody = js.replace(/\/\*[\s\S]*?\*\//g, "");

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}

// Quiz: the reference's four questions, verbatim, in order
eq(lp.STEPS.map(function (s) { return s.q; }), [
  "How do you want to lose weight?",
  "Are you looking to skip waiting rooms and pharmacy lines?",
  "Open to medication if a provider recommends it?",
  "Are you excited about finally losing weight?"
], "four questions verbatim");
eq(lp.STEPS.map(function (s) { return s.options; }), [
  ["Easy, weekly medication", "Reduce my Appetite", "All of the above"],
  ["All online, Please!", "Doesn't matter"],
  ["Yes", "Tell me more"],
  ["Excited!", "Maybe"]
], "answers verbatim");
eq(lp.answer(0), { step: 1, complete: false }, "step 1 advances");
eq(lp.answer(2), { step: 3, complete: false }, "step 3 advances");
eq(lp.answer(3), { step: 3, complete: true }, "last step completes and stays");
// Step 1 in the static HTML matches the data (the page is readable before JS runs)
lp.STEPS[0].options.forEach(function (o) { eq(page.indexOf(">" + o + "</button>") > -1, true, "step 1 option in HTML: " + o); });

// Phone sticky: only while never seen and off screen
eq(lp.stickyVisible(false, false), true, "sticky: unseen + off screen");
eq(lp.stickyVisible(false, true), false, "sticky: on screen");
eq(lp.stickyVisible(true, false), false, "sticky: already seen");

// CTAs: every button is wired, the target exists with its exact case
eq(lp.INTAKE_URL, "../chimeAssessment.html", "intake target");
eq(fs.existsSync(path.join(DIR, lp.INTAKE_URL)), true, "intake target exists");
eq((page.match(/data-cta="intake"/g) || []).length, 2, "two intake CTAs (header + result)");
eq((page.match(/data-cta="quiz"/g) || []).length, 2, "two scroll-to-quiz CTAs (hero + phone sticky)");

// Nothing of Aspen's ships
["aspen", "Aspen"].forEach(function (w) { eq(page.indexOf(w), -1, "no '" + w + "' in page markup"); });
["startaspen", "googletagmanager", "gtag(", "G-P7VNMMCSSH", "clarity", "facebook-domain-verification",
 "legitscript.com", "fonts.googleapis", "fonts.gstatic", "/intake/"].forEach(function (w) {
  eq(page.indexOf(w) + jsBody.indexOf(w) + cssBody.indexOf(w), -3, "no '" + w + "' anywhere");
});
eq(/(src|href)="https?:/.test(page), false, "no external src/href");
eq(/@import/.test(cssBody), false, "no @import in the sheet");

// Branding: Chime logo and name, no Aspen green left in the brand slots
eq(page.indexOf('alt="Chime Health"') > -1, true, "Chime logo alt");
eq(/<title>[^<]*\| Chime Health<\/title>/.test(page), true, "title ends with Chime Health");
eq(/--lp-brand:#324563/.test(cssBody), true, "brand = Chime blue-800");
eq(/--primary:217 33% 29%/.test(cssBody), true, "Tailwind --primary retinted");
eq(/rgb\(27, 85, 56\)|150 52% 22%|#005632|#143c28/i.test(page + css.split("---- CHIME BRAND LAYER")[1].replace(/\/\*[\s\S]*?\*\//g, "")), false, "no Aspen green in markup or brand layer");
eq(/noindex/.test(page), true, "noindex");

// Every local asset resolves
var refs = [];
page.replace(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g, function (_, u) { refs.push(u); });
css.replace(/url\(([^)]+)\)/g, function (_, u) { refs.push(path.join("css", u)); });
refs.forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, "asset exists: " + u); });

// One ?v= across the page
var vs = {};
page.replace(/\?v=(\d+)/g, function (_, v) { vs[v] = 1; });
eq(Object.keys(vs).length, 1, "single ?v= value");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
