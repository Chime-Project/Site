document.addEventListener("DOMContentLoaded", () => {
  const labels = document.querySelectorAll("label");

  const toast = document.querySelector("[data-sonner-toast]");
  const toaster = document.querySelector("[data-sonner-toaster]");
  const toastMessage = toast?.querySelector("p");

  // Force toaster visibility
  if (toaster) {
    toaster.style.display = "block";
    toaster.style.position = "fixed";
    toaster.style.top = "24px";
    toaster.style.right = "24px";
    toaster.style.zIndex = "99999";
    toaster.style.width = "356px";
    toaster.style.maxWidth = "calc(100vw - 32px)";
    toaster.style.pointerEvents = "none";
  }

  // Hide toast initially
  if (toast) {
    toast.style.display = "none";
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s ease";
    toast.style.pointerEvents = "auto";
  }

  function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.style.display = "block";

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      toast.style.opacity = "0";

      setTimeout(() => {
        toast.style.display = "none";
      }, 300);
    }, 3000);
  }

  labels.forEach((label, index) => {
    const checkbox = label.querySelector('input[type="checkbox"]');

    if (!checkbox) return;

    const selectedClass = `card-selected-${index + 1}`;

    label.addEventListener("click", (e) => {
      e.preventDefault();

      const cardNumber = index + 1;

      const card1Label = labels[0];
      const card3Label = labels[2];

      const card1Checkbox =
        card1Label?.querySelector('input[type="checkbox"]');
      const card3Checkbox =
        card3Label?.querySelector('input[type="checkbox"]');

      // Card 3 selected while Card 1 already selected
      if (
        cardNumber === 3 &&
        card1Checkbox?.checked &&
        !checkbox.checked
      ) {
        card1Checkbox.checked = false;

        card1Checkbox.dispatchEvent(
          new Event("change", {
            bubbles: true,
          }),
        );

        card1Label.classList.remove("card-selected-1");

        showToast(
          "You can't select both GLP-1 Weight Loss and GLP-1 Microdosing. We've switched your selection to GLP-1 Microdosing."
        );
      }

      // Card 1 selected while Card 3 already selected
      if (
        cardNumber === 1 &&
        card3Checkbox?.checked &&
        !checkbox.checked
      ) {
        card3Checkbox.checked = false;

        card3Checkbox.dispatchEvent(
          new Event("change", {
            bubbles: true,
          }),
        );

        card3Label.classList.remove("card-selected-3");

        showToast(
          "You can't select both GLP-1 Weight Loss and GLP-1 Microdosing. We've switched your selection to GLP-1 Weight Loss."
        );
      }

      // Toggle checkbox
      checkbox.checked = !checkbox.checked;

      checkbox.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );

      label.classList.toggle(selectedClass, checkbox.checked);
    });

    // Keep UI synced
    checkbox.addEventListener("change", () => {
      label.classList.toggle(selectedClass, checkbox.checked);

      console.log(
        label.querySelector("h2, h3, p")?.textContent?.trim() ||
          `Card ${index + 1}`,
        checkbox.checked,
      );
    });
  });
});