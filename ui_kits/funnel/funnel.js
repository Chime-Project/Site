/* Chime Health — funnel.html: the round Back button.
   Everything else on the page (reservation countdown, live counters, treatment →
   plans reveal, checkout hand-off) is ui_kits/select-plan/select-plan.js.
   Back goes to the previous page when there is one from this site, otherwise
   to the href (index.html). */
(function () {
  "use strict";
  var back = document.getElementById("funnelBack");
  if (!back) return;
  back.addEventListener("click", function (e) {
    var ref = document.referrer;
    if (history.length > 1 && ref && ref.indexOf(location.origin) === 0) {
      e.preventDefault();
      history.back();
    }
  });
})();
