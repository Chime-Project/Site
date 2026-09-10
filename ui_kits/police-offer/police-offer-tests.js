// node ui_kits/police-offer/police-offer-tests.js — price math for police-offer.html.
// Runs quote()/money() from police-offer.js with no DOM (the script exports
// before touching document).
"use strict";
var assert = require("assert");
var P = require("./police-offer.js");
var pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log("  ok  " + name); }
  catch (e) { fail++; console.error("  FAIL " + name + "\n       " + e.message); }
}

t("incomplete selection → null", function () {
  assert.strictEqual(P.quote({}), null);
  assert.strictEqual(P.quote({ med: "sema" }), null);
  assert.strictEqual(P.quote({ term: 3 }), null);
  assert.strictEqual(P.quote({ med: "nope", term: 3 }), null);
});
t("ladder: regular prices match chime-checkout", function () {
  assert.strictEqual(P.quote({ med: "sema", term: 1 }).regular, 299);
  assert.strictEqual(P.quote({ med: "sema", term: 3 }).regular, 747);
  assert.strictEqual(P.quote({ med: "tirz", term: 1 }).regular, 359);
  assert.strictEqual(P.quote({ med: "tirz", term: 3 }).regular, 897);
});
t("no code → no discount, total = regular", function () {
  var q = P.quote({ med: "tirz", term: 3 });
  assert.strictEqual(q.discount, 0);
  assert.strictEqual(q.total, 897);
  assert.strictEqual(q.code, null);
});
t("SERVE20 on Tirzepatide 3 month → $179.40 off, $717.60", function () {
  var q = P.quote({ med: "tirz", term: 3, code: "SERVE20" });
  assert.strictEqual(q.discount, 179.4);
  assert.strictEqual(q.total, 717.6);
  assert.strictEqual(q.perMonth, 179.4);
  assert.strictEqual(q.months, 4);
});
t("SERVE20 on Semaglutide 3 month → $597.60", function () {
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "SERVE20" }).total, 597.6);
});
t("code is case/space-insensitive", function () {
  assert.strictEqual(P.normalizeCode("  serve 20 "), "SERVE20");
  assert.strictEqual(P.quote({ med: "sema", term: 1, code: "serve20" }).total, 239.2);
});
t("unknown code → ignored", function () {
  var q = P.quote({ med: "sema", term: 1, code: "FREESTUFF" });
  assert.strictEqual(q.discount, 0);
  assert.strictEqual(q.code, null);
});
t("free product never changes the total", function () {
  var a = P.quote({ med: "sema", term: 3, code: "SERVE20" });
  var b = P.quote({ med: "sema", term: 3, code: "SERVE20", gift: "nad" });
  assert.strictEqual(a.total, b.total);
  assert.strictEqual(b.giftName, "NAD+");
  assert.strictEqual(b.giftValue, 299);
  assert.strictEqual(a.gift, null);
});
t("flat codes cap at the plan price", function () {
  P.CODES.TESTFLAT = { type: "flat", value: 500, label: "Test" };
  assert.strictEqual(P.quote({ med: "sema", term: 1, code: "TESTFLAT" }).total, 0);
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "TESTFLAT" }).total, 247);
  delete P.CODES.TESTFLAT;
});
t("savings = retail − total", function () {
  var q = P.quote({ med: "tirz", term: 3, code: "SERVE20" });
  assert.strictEqual(q.savings, 1596 - 717.6);
});
t("money(): whole dollars have no cents, cents are padded, thousands grouped", function () {
  assert.strictEqual(P.money(747), "$747");
  assert.strictEqual(P.money(597.6), "$597.60");
  assert.strictEqual(P.money(1396), "$1,396");
  assert.strictEqual(P.money(179.4), "$179.40");
  assert.strictEqual(P.money(0), "$0");
  assert.strictEqual(P.money(1234.05), "$1,234.05");
});

console.log("\n" + pass + " passed, " + fail + " failed");
if (fail) process.exit(1);
