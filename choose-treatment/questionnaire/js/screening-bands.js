/*
 * screening-bands.js
 *
 * The age + BMI bands from GLPQuizFR's questionnaire/js/quiz-logic.js, ported so
 * S7 can show the same two consents at the same thresholds. Devin's ask (msg 2193).
 *
 * The bands, straight from the reference (its step3, our S7):
 *
 *   65+        BMI < 22          disqualify
 *   65+        BMI >= 22         continue, after the ELDERLY consent
 *   18 to 64   BMI < 20          disqualify
 *   18 to 64   20 <= BMI < 23    continue, after the METABOLIC consent
 *   18 to 64   BMI >= 23         straight through, no consent
 *
 * Two boundary details carried over deliberately, both of which the reference
 * had to fix the hard way:
 *
 *  - Age exactly 65 belongs to the elderly rules, never the adult ones. The two
 *    bands cannot both fire, so at most one consent is ever shown.
 *  - The metabolic band is `bmi < 23`, NOT `bmi <= 22.9`. BMI is carried to two
 *    decimals, so the reference's original test let 22.91 through 22.99 fall
 *    between the two rules and get neither the consent nor the disqualification.
 *
 * WHAT THIS FILE DOES NOT DO: disqualify. The reference redirects a disqualified
 * visitor to disqualified.html. This build has no disqualification engine and no
 * such page, so `band()` reports "disqualify" and the caller currently only uses
 * the consent half. Reporting it rather than hiding it means wiring the DQ later
 * is a change at the call site, not a re-derivation of the rules.
 */
(function (w) {
  "use strict";

  var ELDERLY_AGE = 65;
  var ELDERLY_MIN_BMI = 22;
  var ADULT_MIN_AGE = 18;
  var ADULT_MIN_BMI = 20;
  var ADULT_CONSENT_MAX_BMI = 23;   // exclusive: 22.99 needs consent, 23.00 does not

  /*
   * Returns one of:
   *   { band: "unknown"    }  age or BMI not yet known, show nothing
   *   { band: "under18"    }  below the program's minimum age
   *   { band: "disqualify", reason: "elderly-low-bmi" | "adult-low-bmi" }
   *   { band: "consent",     consent: "elderly" | "metabolic" }
   *   { band: "clear"      }  no consent needed
   */
  function band(age, bmi) {
    var a = parseFloat(age), b = parseFloat(bmi);
    if (isNaN(a) || isNaN(b) || b <= 0) return { band: "unknown" };

    if (a >= ELDERLY_AGE) {
      if (b < ELDERLY_MIN_BMI) return { band: "disqualify", reason: "elderly-low-bmi" };
      return { band: "consent", consent: "elderly" };
    }

    if (a < ADULT_MIN_AGE) return { band: "under18" };

    if (b < ADULT_MIN_BMI) return { band: "disqualify", reason: "adult-low-bmi" };
    if (b < ADULT_CONSENT_MAX_BMI) return { band: "consent", consent: "metabolic" };
    return { band: "clear" };
  }

  w.ScreeningBands = {
    band: band,
    ELDERLY_AGE: ELDERLY_AGE,
    ELDERLY_MIN_BMI: ELDERLY_MIN_BMI,
    ADULT_MIN_AGE: ADULT_MIN_AGE,
    ADULT_MIN_BMI: ADULT_MIN_BMI,
    ADULT_CONSENT_MAX_BMI: ADULT_CONSENT_MAX_BMI,
  };
})(window);
