// node ui_kits/pdp/pdp-tests.js — pure checks for the PDP template (price
// math, coupon, CTA params, templating, product registry). No DOM.
"use strict";
var path = require("path");
var PRODUCTS = require(path.join(__dirname, "pdp-data.js"));
var pdp = require(path.join(__dirname, "pdp.js"));

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}

var P = PRODUCTS.tirzepatide;

// Registry
eq(!!P, true, "tirzepatide entry exists");
eq(P.doses.length, 6, "six doses");
eq(P.faq.length, 7, "seven FAQ rows");
eq(P.coupon.code, "FOUNDERS78", "coupon code carried");
eq(P.cta.href, "", "primary CTA href is blank on purpose");

// Money + templating
eq(pdp.money(78), "$78", "money 78");
eq(pdp.money(1794), "$1,794", "money thousands");
eq(pdp.fill("From %{amount}", { amount: "$78" }), "From $78", "fill one var");
eq(pdp.fill("Starts at %{start}, renewing at %{amount}/month", { start: "$78", amount: "$117" }), "Starts at $78, renewing at $117/month", "fill two vars");

// Percent off per dose (the reference's pills: 67/67/62/62/59/56)
eq(P.doses.map(function (_, i) { return pdp.quote(P, i, true).pctOff; }), [67, 67, 62, 62, 59, 56], "pct off ladder");

// Applied quotes: due today = promo, ongoing = promo + $39
eq(P.doses.map(function (_, i) { return pdp.quote(P, i, true).due; }), [78, 88, 108, 128, 148, 168], "applied due today");
eq(P.doses.map(function (_, i) { return pdp.quote(P, i, true).ongoing; }), [117, 127, 147, 167, 187, 207], "applied ongoing");
eq(pdp.quote(P, 0, true).medicine, 78, "applied medicine line");
eq(pdp.quote(P, 0, true).listTotal, 234, "applied strike total");

// Unapplied quotes: due = list + $39, ongoing = same
eq(P.doses.map(function (_, i) { return pdp.quote(P, i, false).due; }), [234, 264, 284, 334, 364, 384], "unapplied due");
eq(pdp.quote(P, 0, false).ongoing, 234, "unapplied ongoing");
eq(pdp.quote(P, 0, false).medicine, 195, "unapplied medicine line");
eq(pdp.quote(P, 99, true), null, "out-of-range dose is null");

// Coupon
eq(pdp.applyCode(P, "FOUNDERS78"), true, "code exact");
eq(pdp.applyCode(P, "  founders78 "), true, "code case/space insensitive");
eq(pdp.applyCode(P, ""), false, "empty code");
eq(pdp.applyCode(P, "NOPE"), false, "wrong code");
eq(pdp.applyCode({ coupon: null }, "X"), false, "product without coupon");

// CTA href params
eq(pdp.ctaHref("", false, null), "", "blank base stays blank");
eq(pdp.ctaHref("", true, "5 mg/week"), "", "blank base stays blank when open");
eq(pdp.ctaHref("chimeAssessment.html", false, null), "chimeAssessment.html?treatment=new", "new patient");
eq(pdp.ctaHref("chimeAssessment.html", true, "5 mg/week"), "chimeAssessment.html?treatment=current&switch_dose=5+mg%2Fweek", "current + dose");
eq(pdp.ctaHref("chimeAssessment.html", true, null), "chimeAssessment.html?treatment=current", "current + unknown dose");
eq(pdp.ctaHref("x.html?a=1&treatment=current&switch_dose=7.5+mg%2Fweek#form", false, null), "x.html?a=1&treatment=new#form", "rewrites existing params, keeps others + hash");

// A second product entry quotes independently of tirzepatide
var second = { doses: [{ label: "0.25 mg/week", list: 149, promo: 99 }], membership: 39, coupon: { code: "CHIME" } };
eq(pdp.quote(second, 0, true), { label: "0.25 mg/week", list: 149, promo: 99, membership: 39, listTotal: 188, medicine: 99, due: 99, ongoing: 138, pctOff: 47 }, "second product quote");
eq(pdp.quote(P, 0, true).due, 78, "tirzepatide untouched by second product");
eq(pdp.applyCode(second, "chime"), true, "second product code");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
