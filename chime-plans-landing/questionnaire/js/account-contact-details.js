document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.querySelector(
    'input[name="isBillingSameAsShipping"]'
  );
  const billingSection = document.getElementById(
    "isBillingSameAsShipping"
  );

  billingSection.style.transition = "opacity .3s ease";

  const toggleBillingSection = () => {
    if (checkbox.checked) {
      billingSection.style.opacity = "0";
      setTimeout(() => {
        billingSection.style.display = "none";
      }, 300);
    } else {
      billingSection.style.display = "";
      requestAnimationFrame(() => {
        billingSection.style.opacity = "1";
      });
    }
  };

  toggleBillingSection();
  checkbox.addEventListener("change", toggleBillingSection);
});