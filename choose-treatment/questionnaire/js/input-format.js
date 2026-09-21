/*
 * input-format.js
 *
 * Format-as-you-type for the two free-text fields in the funnel: date of birth
 * on step7 and phone on step14. Both were plain text inputs with a placeholder
 * and nothing else, so "12251980" stayed "12251980" and the placeholder was the
 * only hint that a format was expected.
 *
 * The formatting itself is pure (mask(digits) -> string) so it can be tested
 * without a browser. The DOM half only wires input events and keeps the caret
 * where the user left it.
 */
(function (w) {
  "use strict";

  function digits(s) {
    return String(s == null ? "" : s).replace(/\D/g, "");
  }

  /*
   * MM/DD/YYYY. Clamps as it goes so an impossible date cannot be typed:
   * a leading month digit above 1 becomes 0X (typing 5 gives 05/), and the
   * same for the day above 3. Month is held to 01-12 and day to 01-31 once
   * the second digit lands. Year is left alone until it is complete.
   */
  function formatDOB(value) {
    var d = digits(value).slice(0, 8);
    if (!d) return "";

    var mm = d.slice(0, 2);
    if (mm.length === 1 && mm > "1") mm = "0" + mm;
    if (mm.length === 2) {
      var m = parseInt(mm, 10);
      if (m === 0) mm = "01";
      else if (m > 12) mm = "12";
    }

    var rest = d.slice(2);
    if (mm.length < 2) return mm;
    if (!rest.length) return mm + "/";

    var dd = rest.slice(0, 2);
    if (dd.length === 1 && dd > "3") dd = "0" + dd;
    if (dd.length === 2) {
      var day = parseInt(dd, 10);
      if (day === 0) dd = "01";
      else if (day > 31) dd = "31";
    }

    var yy = rest.slice(2, 6);
    if (dd.length < 2) return mm + "/" + dd;
    if (!yy.length) return mm + "/" + dd + "/";
    return mm + "/" + dd + "/" + yy;
  }

  /*
   * (555) 123-4567. A leading US country code is dropped rather than shown,
   * so pasting +1 555 123 4567 lands correctly instead of overflowing.
   */
  function formatPhone(value) {
    var d = digits(value);
    if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
    d = d.slice(0, 10);
    if (!d) return "";
    if (d.length < 4) return "(" + d;
    if (d.length < 7) return "(" + d.slice(0, 3) + ") " + d.slice(3);
    return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
  }

  function isCompleteDOB(value) {
    var v = formatDOB(value);
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return false;
    var parts = v.split("/");
    var m = +parts[0], day = +parts[1], y = +parts[2];
    if (y < 1900 || y > new Date().getFullYear()) return false;
    // Reject a day the month does not have (Feb 30, Apr 31), leap years included.
    var dt = new Date(y, m - 1, day);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === day;
  }

  function isCompletePhone(value) {
    return digits(formatPhone(value)).length === 10;
  }

  /*
   * Age in whole years from an MM/DD/YYYY value, NaN if the date is not a
   * complete, possible one. Counts the birthday properly: someone whose birthday
   * has not happened yet this year is still the younger age, which is what the
   * 65 and 18 boundaries turn on.
   */
  function ageFromDOB(value, today) {
    if (!isCompleteDOB(value)) return NaN;
    var p = formatDOB(value).split("/");
    var m = +p[0], d = +p[1], y = +p[2];
    var now = today || new Date();
    var age = now.getFullYear() - y;
    var beforeBirthday =
      now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
    if (beforeBirthday) age--;
    return age;
  }

  /*
   * Re-masks on every input and restores the caret by counting how many digits
   * sat to its left, so editing the middle of a value does not throw the caret
   * to the end. Deleting a separator deletes the digit before it, which is what
   * a backspace is trying to do anyway.
   */
  function attach(el, mask) {
    if (!el) return;
    var prev = el.value;

    el.addEventListener("input", function () {
      var start = el.selectionStart;
      var before = digits(el.value.slice(0, start)).length;

      var masked = mask(el.value);
      el.value = masked;
      prev = masked;

      var seen = 0, pos = masked.length;
      for (var i = 0; i < masked.length; i++) {
        if (seen >= before) { pos = i; break; }
        if (/\d/.test(masked.charAt(i))) seen++;
      }
      if (seen < before) pos = masked.length;
      try { el.setSelectionRange(pos, pos); } catch (e) {}
    });

    // Paste and autofill do not always fire input in the same shape; normalise.
    el.addEventListener("blur", function () {
      el.value = mask(el.value);
      prev = el.value;
    });

    if (el.value) el.value = mask(el.value);
  }

  w.InputFormat = {
    formatDOB: formatDOB,
    formatPhone: formatPhone,
    isCompleteDOB: isCompleteDOB,
    isCompletePhone: isCompletePhone,
    ageFromDOB: ageFromDOB,
    attachDOB: function (el) { attach(el, formatDOB); },
    attachPhone: function (el) { attach(el, formatPhone); },
  };
})(window);
