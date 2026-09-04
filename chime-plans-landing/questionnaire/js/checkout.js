(function () {
  function initRadioGroups() {
    document.querySelectorAll('[role="radiogroup"]').forEach(function (group) {
      // Set default checked — button with value="221" (3 Month Supply / Starter Bundle)
      var defaultBtn = group.querySelector(
        'button[data-slot="radio-group-indicator"][value="221"]',
      );
      if (defaultBtn) {
        group
          .querySelectorAll('button[data-slot="radio-group-indicator"]')
          .forEach(function (btn) {
            btn.setAttribute("data-state", "unchecked");
            btn.setAttribute("aria-checked", "false");
            btn.innerHTML = "";
          });
        defaultBtn.setAttribute("data-state", "checked");
        defaultBtn.setAttribute("aria-checked", "true");
        defaultBtn.innerHTML =
          '<span style="width:8px;height:8px;border-radius:9999px;background:#c1c9cd;display:block;"></span>';
      }

      // Click handler
      group.addEventListener("click", function (e) {
        var label = e.target.closest('label[data-slot="radio-group-item"]');
        if (!label) return;

        group
          .querySelectorAll('button[data-slot="radio-group-indicator"]')
          .forEach(function (btn) {
            btn.setAttribute("data-state", "unchecked");
            btn.setAttribute("aria-checked", "false");
            btn.innerHTML = "";
          });

        var btn = label.querySelector(
          'button[data-slot="radio-group-indicator"]',
        );
        btn.setAttribute("data-state", "checked");
        btn.setAttribute("aria-checked", "true");
        btn.innerHTML =
          '<span style="width:8px;height:8px;border-radius:9999px;background:#c1c9cd;display:block;"></span>';
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRadioGroups);
  } else {
    initRadioGroups();
  }
})();
