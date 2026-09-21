/*
 * funnel-state.js
 *
 * The funnel had no persistence of any kind, so every screen after an answer
 * was written as static markup: a fixed BMI, a fixed plan, a fixed delivery
 * state. This is the shared layer those screens read from.
 *
 * One localStorage key holds the whole record. Every helper fails soft and
 * returns a fallback rather than throwing, because a screen that cannot read
 * an answer must still render.
 */
(function (w) {
  "use strict";

  var KEY = "chime_funnel";

  function all() {
    try {
      return JSON.parse(w.localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(patch) {
    var data = all();
    for (var k in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) data[k] = patch[k];
    }
    try {
      w.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* private mode / quota: the funnel still works, it just cannot personalise */
    }
    return data;
  }

  function get(k, fallback) {
    var v = all()[k];
    return v === undefined || v === null || v === "" ? fallback : v;
  }

  function num(k, fallback) {
    var n = parseFloat(get(k, NaN));
    return isFinite(n) ? n : fallback;
  }

  w.FunnelState = {
    all: all,
    save: save,
    get: get,
    num: num,
    clear: function () {
      try {
        w.localStorage.removeItem(KEY);
      } catch (e) {}
    },
  };

  /* ---------------------------------------------------------------- */

  // Clinical guard rail from Devin: nobody is shown a plan that implies
  // losing more than this in a month, whatever pace they picked.
  var MAX_LBS_PER_MONTH = 15;

  // Used only for "Help me choose". A steady, defensible rate.
  var DEFAULT_LBS_PER_MONTH = 6;

  var PACE_MONTHS = {
    "3-months": 3,
    "6-months": 6,
    "12-months": 12,
    "help-me-choose": null,
  };

  function bmi(feet, inches, lbs) {
    var f = parseFloat(feet),
      i = parseFloat(inches),
      w2 = parseFloat(lbs);
    if (!isFinite(f) || !isFinite(i) || !isFinite(w2)) return null;
    var totalInches = f * 12 + i;
    if (totalInches <= 0 || w2 <= 0) return null;
    var value = (703 * w2) / (totalInches * totalInches);
    if (!isFinite(value) || value <= 0) return null;
    return Math.round(value * 10) / 10;
  }

  function bmiCategory(value) {
    if (value === null) return "";
    if (value < 18.5) return "underweight range";
    if (value < 25) return "healthy range";
    if (value < 30) return "overweight range";
    return "obese range";
  }

  /*
   * Turns the answers into a plan the visitor was actually promised.
   * Returns null when there is not enough stored to say anything, so the
   * caller can leave the original markup alone rather than print "NaN lbs".
   */
  function plan(currentLbs, goalLbs, pace) {
    var cur = parseFloat(currentLbs),
      goal = parseFloat(goalLbs);
    if (!isFinite(cur) || !isFinite(goal)) return null;

    var toLose = Math.round(cur - goal);
    if (toLose <= 0) {
      return { lbs: 0, months: 0, maintenance: true, capped: false };
    }

    var requested = Object.prototype.hasOwnProperty.call(PACE_MONTHS, pace)
      ? PACE_MONTHS[pace]
      : null;

    // The floor: no plan may imply more than MAX_LBS_PER_MONTH.
    var minMonths = Math.ceil(toLose / MAX_LBS_PER_MONTH);

    var months;
    if (requested === null) {
      // "Help me choose", or no pace stored. Aim for the default rate, but
      // stay inside the three options the funnel actually offers.
      months = Math.min(12, Math.max(3, Math.ceil(toLose / DEFAULT_LBS_PER_MONTH)));
    } else {
      months = requested;
    }

    var capped = months < minMonths;
    if (capped) months = minMonths;

    return {
      lbs: toLose,
      months: months,
      maintenance: false,
      capped: capped,
      requestedMonths: requested,
      perMonth: Math.round((toLose / months) * 10) / 10,
    };
  }

  function addMonths(date, months) {
    var d = new Date(date.getTime());
    var targetDay = d.getDate();
    d.setMonth(d.getMonth() + months);
    // Rolling Jan 31 forward one month must not land in March.
    if (d.getDate() < targetDay) d.setDate(0);
    return d;
  }

  var MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function shortDate(d) {
    return MONTHS_SHORT[d.getMonth()] + " " + d.getDate();
  }

  w.FunnelCalc = {
    MAX_LBS_PER_MONTH: MAX_LBS_PER_MONTH,
    bmi: bmi,
    bmiCategory: bmiCategory,
    plan: plan,
    addMonths: addMonths,
    shortDate: shortDate,
  };
})(window);
