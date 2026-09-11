// node ui_kits/police-offer/police-offer-tests.js — price math for the police offer pages.
// Runs quote()/money() from police-offer.js with no DOM (the script exports
// before touching document). Numbers are the client's 2026-09-10 sheet.
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
t("regular prices match the client's sheet", function () {
  assert.strictEqual(P.quote({ med: "sema", term: 1 }).regular, 399);
  assert.strictEqual(P.quote({ med: "sema", term: 3 }).regular, 999);
  assert.strictEqual(P.quote({ med: "tirz", term: 1 }).regular, 499);
  assert.strictEqual(P.quote({ med: "tirz", term: 3 }).regular, 1497);
});
t("no code → regular price, no discount", function () {
  var q = P.quote({ med: "tirz", term: 3 });
  assert.strictEqual(q.discount, 0);
  assert.strictEqual(q.total, 1497);
  assert.strictEqual(q.code, null);
  assert.strictEqual(q.perMonth, 499);
});
t("HOUSTONPOLICE → the police rate on every plan", function () {
  assert.strictEqual(P.quote({ med: "sema", term: 1, code: "HOUSTONPOLICE" }).total, 299);
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "HOUSTONPOLICE" }).total, 747);
  assert.strictEqual(P.quote({ med: "tirz", term: 1, code: "HOUSTONPOLICE" }).total, 399);
  assert.strictEqual(P.quote({ med: "tirz", term: 3, code: "HOUSTONPOLICE" }).total, 897);
});
t("discount = regular − police rate", function () {
  assert.strictEqual(P.quote({ med: "sema", term: 1, code: "HOUSTONPOLICE" }).discount, 100);
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "HOUSTONPOLICE" }).discount, 252);
  assert.strictEqual(P.quote({ med: "tirz", term: 1, code: "HOUSTONPOLICE" }).discount, 100);
  assert.strictEqual(P.quote({ med: "tirz", term: 3, code: "HOUSTONPOLICE" }).discount, 600);
});
t("per month: package ÷ 3 ($249 / $299), monthly = the monthly price", function () {
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "HOUSTONPOLICE" }).perMonth, 249);
  assert.strictEqual(P.quote({ med: "tirz", term: 3, code: "HOUSTONPOLICE" }).perMonth, 299);
  assert.strictEqual(P.quote({ med: "sema", term: 1, code: "HOUSTONPOLICE" }).perMonth, 299);
  assert.strictEqual(P.quote({ med: "sema", term: 3 }).perMonth, 333);
  assert.strictEqual(P.quote({ med: "sema", term: 3 }).months, 3);
});
t("code is case/space-insensitive (Houstonpolice, houston police)", function () {
  assert.strictEqual(P.normalizeCode("Houstonpolice"), "HOUSTONPOLICE");
  assert.strictEqual(P.normalizeCode(" houston police "), "HOUSTONPOLICE");
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "Houstonpolice" }).total, 747);
});
t("unknown code → ignored", function () {
  var q = P.quote({ med: "sema", term: 1, code: "SERVE20" });
  assert.strictEqual(q.discount, 0);
  assert.strictEqual(q.total, 399);
  assert.strictEqual(q.code, null);
});
t("free product never changes the total", function () {
  var a = P.quote({ med: "sema", term: 3, code: "HOUSTONPOLICE" });
  var b = P.quote({ med: "sema", term: 3, code: "HOUSTONPOLICE", gift: "nad" });
  assert.strictEqual(a.total, b.total);
  assert.strictEqual(b.giftName, "NAD+");
  assert.strictEqual(a.gift, null);
});
t("percent and flat codes still work through the same table", function () {
  P.CODES.TESTPCT = { type: "percent", value: 10, label: "Test" };
  P.CODES.TESTFLAT = { type: "flat", value: 5000, label: "Test" };
  assert.strictEqual(P.quote({ med: "sema", term: 3, code: "TESTPCT" }).total, 899.1);
  assert.strictEqual(P.quote({ med: "sema", term: 1, code: "TESTFLAT" }).total, 0);
  delete P.CODES.TESTPCT; delete P.CODES.TESTFLAT;
});
t("money(): whole dollars have no cents, cents are padded, thousands grouped", function () {
  assert.strictEqual(P.money(747), "$747");
  assert.strictEqual(P.money(1497), "$1,497");
  assert.strictEqual(P.money(899.1), "$899.10");
  assert.strictEqual(P.money(0), "$0");
});

console.log("\n" + pass + " passed, " + fail + " failed");
if (fail) process.exit(1);
