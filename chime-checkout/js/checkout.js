(function () {
  function initRadioGroups() {
    document.querySelectorAll('[role="radiogroup"]').forEach(function (group) {
      // Set default checked: button with value="221" (3 Month Supply / Starter Bundle)
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
          '<span style="width:8px;height:8px;border-radius:9999px;background:#324563;display:block;"></span>';
      }

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

        if (!btn) return;

        btn.setAttribute("data-state", "checked");
        btn.setAttribute("aria-checked", "true");
        btn.innerHTML =
          '<span style="width:8px;height:8px;border-radius:9999px;background:#324563;display:block;"></span>';
      });
    });
  }

  function setButtonDisabled(button, disabled) {
    if (!button) return;

    if (disabled) {
      button.setAttribute("disabled", "");
      button.setAttribute("aria-disabled", "true");
    } else {
      button.removeAttribute("disabled");
      button.setAttribute("aria-disabled", "false");
    }
  }

  function initCheckoutCarousels() {
    document
      .querySelectorAll('[aria-roledescription="carousel"]')
      .forEach(function (carousel) {
        if (carousel.dataset.checkoutCarouselReady === "true") return;

        var viewport = carousel.querySelector(".overflow-hidden");
        var track = viewport ? viewport.firstElementChild : null;
        var slides = track
          ? Array.prototype.slice.call(
              track.querySelectorAll('[aria-roledescription="slide"]'),
            )
          : [];
        var buttons = Array.prototype.filter.call(
          carousel.querySelectorAll('button[type="button"]'),
          function (button) {
            return button.parentElement === carousel;
          },
        );

        if (!track || slides.length < 2 || buttons.length < 2) return;

        var previousButton = buttons[0];
        var nextButton = buttons[1];
        var currentIndex = 0;

        carousel.dataset.checkoutCarouselReady = "true";
        viewport.style.overflow = "hidden";
        track.style.transition = "transform 300ms ease";
        track.style.willChange = "transform";

        function updateCarousel() {
          track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

          slides.forEach(function (slide, index) {
            slide.setAttribute(
              "aria-hidden",
              index === currentIndex ? "false" : "true",
            );
          });

          setButtonDisabled(previousButton, currentIndex === 0);
          setButtonDisabled(nextButton, currentIndex === slides.length - 1);
        }

        previousButton.addEventListener("click", function () {
          if (currentIndex > 0) {
            currentIndex -= 1;
            updateCarousel();
          }
        });

        nextButton.addEventListener("click", function () {
          if (currentIndex < slides.length - 1) {
            currentIndex += 1;
            updateCarousel();
          }
        });

        updateCarousel();
      });
  }

  function initCheckoutInteractions() {
    initRadioGroups();
    initCheckoutCarousels();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCheckoutInteractions);
  } else {
    initCheckoutInteractions();
  }
})();
