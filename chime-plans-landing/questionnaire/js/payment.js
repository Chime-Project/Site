(function () {
  function init() {
    var group = document.querySelector('[data-slot="radio-group"]');
    if (!group) return;

    var radios = group.querySelectorAll('label[data-slot="radio-group-item"]');
    var cardSection = document
      .querySelector(".__PrivateStripeElement")
      ?.closest("div.flex.flex-col.gap-1\\.5");
    var payBtn = document.querySelectorAll(".payBtn");

    var klarnaLabel =
      'Pay with&nbsp;<svg viewBox="0 0 225 55" fill="#ffa8cd" xmlns="http://www.w3.org/2000/svg" class="size-full w-12 shrink-0 text-klarna" aria-hidden="true"><path d="M204.147 44.8948C198.914 44.8948 194.836 40.575 194.836 35.3296C194.836 30.0841 198.914 25.7644 204.147 25.7644C209.379 25.7644 213.458 30.0841 213.458 35.3296C213.458 40.575 209.379 44.8948 204.147 44.8948ZM201.53 55C205.994 55 211.688 53.3029 214.843 46.669L215.151 46.8233C213.765 50.4488 213.765 52.6087 213.765 53.1487V53.9972H225V16.662H213.765V17.5105C213.765 18.0505 213.765 20.2104 215.151 23.8359L214.843 23.9902C211.688 17.3562 205.994 15.6592 201.53 15.6592C190.834 15.6592 183.293 24.1445 183.293 35.3296C183.293 46.5147 190.834 55 201.53 55ZM163.748 15.6592C158.67 15.6592 154.668 17.4334 151.436 23.9902L151.129 23.8359C152.514 20.2104 152.514 18.0505 152.514 17.5105V16.662H141.279V53.9972H152.821V34.3268C152.821 29.1585 155.823 25.9187 160.67 25.9187C165.518 25.9187 167.904 28.6957 167.904 34.2497V53.9972H179.446V30.2384C179.446 21.7532 172.828 15.6592 163.748 15.6592ZM124.581 23.9902L124.273 23.8359C125.658 20.2104 125.658 18.0505 125.658 17.5105V16.662H114.424V53.9972H125.966L126.043 36.0238C126.043 30.7784 128.813 27.6157 133.353 27.6157C134.584 27.6157 135.585 27.77 136.739 28.0785V16.662C131.66 15.582 127.12 17.5105 124.581 23.9902ZM87.8762 44.8948C82.6436 44.8948 78.5653 40.575 78.5653 35.3296C78.5653 30.0841 82.6436 25.7644 87.8762 25.7644C93.1088 25.7644 97.1871 30.0841 97.1871 35.3296C97.1871 40.575 93.1088 44.8948 87.8762 44.8948ZM85.2599 55C89.723 55 95.4173 53.3029 98.5722 46.669L98.88 46.8233C97.4949 50.4488 97.4949 52.6087 97.4949 53.1487V53.9972H108.729V16.662H97.4949V17.5105C97.4949 18.0505 97.4949 20.2104 98.88 23.8359L98.5722 23.9902C95.4173 17.3562 89.723 15.6592 85.2599 15.6592C74.564 15.6592 67.0229 24.1445 67.0229 35.3296C67.0229 46.5147 74.564 55 85.2599 55ZM50.9405 53.9972H62.4829V0H50.9405V53.9972ZM42.4761 0H30.7028C30.7028 9.6424 24.7777 18.2819 15.7746 24.453L12.235 26.9215V0H0V53.9972H12.235V27.23L32.4726 53.9972H47.4008L27.9326 28.3871C36.7818 21.9846 42.553 12.0337 42.4761 0Z"></path></svg>';

    function selectRadio(selectedLabel) {
      radios.forEach(function (label) {
        var btn = label.querySelector(
          'button[data-slot="radio-group-indicator"]',
        );
        if (!btn) return;
        btn.setAttribute("data-state", "unchecked");
        btn.setAttribute("aria-checked", "false");
        btn.innerHTML = "";
      });

      var selectedBtn = selectedLabel.querySelector(
        'button[data-slot="radio-group-indicator"]',
      );
      if (selectedBtn) {
        selectedBtn.setAttribute("data-state", "checked");
        selectedBtn.setAttribute("aria-checked", "true");
        selectedBtn.innerHTML =
          '<span style="width:8px;height:8px;border-radius:9999px;background:#589fac;display:block;"></span>';
      }

      var isKlarna = selectedBtn?.value === "klarna";

      if (cardSection) cardSection.style.display = isKlarna ? "none" : "";

      payBtn.forEach(function (btn) {
        if (isKlarna) {
          btn.innerHTML = klarnaLabel;
          btn.style.backgroundColor = "#000000";
          btn.style.color = "#ffffff";
        } else {
          btn.textContent = "Pay";
          btn.style.backgroundColor = "#4E7C84";
          btn.style.color = "#ffffff";
        }
      });
    }

    radios.forEach(function (label) {
      label.addEventListener("click", function () {
        selectRadio(label);
      });
    });

    function showCouponInput() {
      var da = document.querySelector(".discountApplied");
      var oc = document.querySelector(".optionalCouponCode");
      if (da) da.style.display = "none";
      if (oc) oc.style.display = "";
    }

    function showDiscountApplied(amount) {
      var da = document.querySelector(".discountApplied");
      var oc = document.querySelector(".optionalCouponCode");
      if (oc) oc.style.display = "none";
      if (da) {
        var amountEl = da.querySelector(".discountAmount");
        if (amountEl) amountEl.textContent = "-$" + amount;
        da.style.display = "";
      }
    }

    (function setDefaults() {
      var da = document.querySelector(".discountApplied");
      var oc = document.querySelector(".optionalCouponCode");
      if (da) da.style.display = "";
      if (oc) oc.style.display = "none";

      var mobileSticky = document.querySelector(".sm\\:hidden.bg-white.sticky.bottom-0");
      if (mobileSticky) {
        mobileSticky.querySelectorAll("button[aria-controls]").forEach(function (btn) {
          var panelId = btn.getAttribute("aria-controls");
          var panel = document.getElementById(panelId);
          if (!panel) return;
          btn.setAttribute("data-state", "closed");
          btn.setAttribute("aria-expanded", "false");
          panel.setAttribute("data-state", "closed");
          panel.style.display = "none";
        });
      }
    })();

    document.addEventListener("click", function (e) {
      // Remove discount code
      var removeBtn = e.target.closest('[aria-label="Remove discount code"]');
      if (removeBtn) {
        showCouponInput();
        return;
      }

      // Apply coupon code
      var couponSection = document.querySelector(".optionalCouponCode");
      if (couponSection && couponSection.style.display !== "none") {
        var applyBtn = e.target.closest("button");
        if (applyBtn && couponSection.contains(applyBtn)) {
          var input = couponSection.querySelector("input");
          if (input && input.value.trim() !== "") {
            showDiscountApplied(100);
          }
        }
      }

      // Accordion toggle — only within mobile sticky bottom section
      var accordionBtn = e.target.closest("button[aria-controls]");
      if (accordionBtn) {
        var mobileSticky = document.querySelector(".sm\\:hidden.bg-white.sticky.bottom-0");
        if (mobileSticky && mobileSticky.contains(accordionBtn)) {
          var controlsId = accordionBtn.getAttribute("aria-controls");
          var panel = document.getElementById(controlsId);
          if (panel) {
            var isOpen = accordionBtn.getAttribute("data-state") === "open";
            if (isOpen) {
              accordionBtn.setAttribute("data-state", "closed");
              accordionBtn.setAttribute("aria-expanded", "false");
              panel.setAttribute("data-state", "closed");
              panel.style.display = "none";
            } else {
              accordionBtn.setAttribute("data-state", "open");
              accordionBtn.setAttribute("aria-expanded", "true");
              panel.setAttribute("data-state", "open");
              panel.style.display = "";
            }
          }
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
