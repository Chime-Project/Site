/*
 * quiz-dq.js
 *
 * The disqualification engine, ported from GLPQuizFR's questionnaire/js/quiz-logic.js.
 * Devin msgs 2196/2197/2203.
 *
 * Semantics kept from the reference, on purpose:
 *
 *  - The DQ table is keyed by PAGE, and a rule fires on the submit of the page
 *    that asked its question.
 *  - Multi-selects are expressed as a SAFE list, never as a list of disqualifying
 *    answers. "Everything except these" is what the clinical rule actually says,
 *    so a condition added to a page tomorrow disqualifies by default instead of
 *    silently passing. Fail closed.
 *  - The DQ check runs BEFORE validation. A disqualifying answer is by definition
 *    an answered question.
 *  - A disqualified visitor goes to disqualified.html?back=<this page>&next=<exit>,
 *    which offers them "go back and change my answer" or "keep my answer" (exit).
 *
 * THE SWITCH: set ENABLED to false and nothing disqualifies anyone. The rules
 * still evaluate and the outcome is still written to the funnel record, so the
 * funnel can be run in report-only mode to see who WOULD be turned away before
 * it turns anyone away.
 */
(function (w) {
  "use strict";

  // Flip to false for report-only. Everything still evaluates and records; no
  // visitor is ever redirected.
  var ENABLED = true;

  var DQ_PAGE = "disqualified.html";
  var EXIT_URL = "index.html";

  // The eight disqualifiers, matching GLPQuizFR one for one.
  // step3's age/BMI rule lives on our S7 and is computed by screening-bands.js
  // rather than read off an answer, so it is handled separately below.
  var DQ = {
    "step9b.html": {
      // FR step4: female health status. That page stores ONLY the selected
      // conditions, so "none of the above" is an empty list and the empty safe
      // list below is correct: any entry at all disqualifies.
      field: "femaleHealthStatus", multi: true, safe: []
    },
    "step10.html": {
      field: "healthConditions", multi: true,
      safe: ["None of these"]
    },
    "step11.html": {
      field: "healthConditionsAdditional", multi: true,
      // Type 2 diabetes NOT on insulin is allowed through; on insulin is not.
      safe: ["None of the below", "Type 2 diabetes (not on insulin)"]
    },
    "step12b.html": {
      // FR step12 + step13 on one page: opiates in the last 3 months, and
      // gastric bypass in the last 6. Either "Yes" disqualifies.
      fields: [
        { field: "takenPainMedicationsOrStreetDrugs", dqValues: ["Yes"] },
        { field: "gastricBypass6Months", dqValues: ["Yes"] }
      ]
    },
    "step16.html": {
      // FR step9 + step10, which this funnel asks together on its last screen.
      // These two groups keep this build's own short values rather than FR's
      // sentence-long ones, because their markup predates this work and the
      // options are unambiguous drug names. The SAFE list is the "none" option
      // in each, which is the same rule expressed against this page's values.
      fields: [
        { field: "medication_allergies", multi: true, safe: ["none"] },
        { field: "current_medications", multi: true, safe: ["none"] }
      ]
    }
  };

  function asArray(v) {
    if (v == null) return [];
    return Object.prototype.toString.call(v) === "[object Array]" ? v : [v];
  }

  // A single field's rule. Returns true when the answer disqualifies.
  function ruleFires(rule, answer) {
    if (rule.dqValues) {
      var vals = asArray(answer);
      for (var i = 0; i < vals.length; i++) {
        if (rule.dqValues.indexOf(vals[i]) !== -1) return true;
      }
      return false;
    }
    var picked = asArray(answer);
    // An unanswered question cannot disqualify. Validation, not this, is what
    // stops someone submitting an empty page.
    if (!picked.length) return false;
    var safe = rule.safe || [];
    for (var j = 0; j < picked.length; j++) {
      if (safe.indexOf(picked[j]) === -1) return true;   // fail closed
    }
    return false;
  }

  /*
   * Does the answer recorded for `file` disqualify? Reads the shared funnel
   * record, so it does not care how the page collected the answer.
   */
  function disqualifies(file, record) {
    var entry = DQ[file];
    if (!entry) return false;
    var data = record || (w.FunnelState ? FunnelState.all() : {});

    if (entry.fields) {
      for (var i = 0; i < entry.fields.length; i++) {
        var f = entry.fields[i];
        if (ruleFires(f, data[f.field])) return true;
      }
      return false;
    }
    return ruleFires(entry, data[entry.field]);
  }

  // The age/BMI rule from FR step3, which our S7 owns. screening-bands.js
  // reports the band; this turns it into the same yes/no the table produces.
  function bandDisqualifies(record) {
    var data = record || (w.FunnelState ? FunnelState.all() : {});
    return data.screening_band === "disqualify";
  }

  /*
   * Call on submit, BEFORE validation. Returns true when the visitor was sent
   * away, so the caller can stop. Records the outcome either way.
   */
  function check(file, record) {
    var hit = disqualifies(file, record) || (file === "step7.html" && bandDisqualifies(record));
    if (w.FunnelState) {
      try {
        FunnelState.save({ dq_page: hit ? file : "", dq_enforced: hit && ENABLED });
      } catch (e) {}
    }
    if (!hit || !ENABLED) return false;
    w.location.assign(
      DQ_PAGE + "?back=" + encodeURIComponent(file) + "&next=" + encodeURIComponent(EXIT_URL)
    );
    return true;
  }

  w.QuizDQ = {
    check: check,
    disqualifies: disqualifies,
    bandDisqualifies: bandDisqualifies,
    isEnabled: function () { return ENABLED; },
    DQ: DQ,
    DQ_PAGE: DQ_PAGE,
    EXIT_URL: EXIT_URL
  };
})(window);
