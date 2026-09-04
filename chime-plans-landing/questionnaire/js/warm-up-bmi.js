document.addEventListener("DOMContentLoaded", () => {
  const feetInput = document.querySelector('[name="heightFeet"]');
  const inchesInput = document.querySelector('[name="heightInches"]');
  const weightInput = document.querySelector('[name="weightInPounds"]');

  const bmiText = [...document.querySelectorAll("p")].find((p) =>
    p.textContent.includes("Your BMI Score"),
  );

  function calculateBMI() {
    const feet = parseFloat(feetInput?.value) || 0;
    const inches = parseFloat(inchesInput?.value) || 0;
    const weight = parseFloat(weightInput?.value) || 0;

    const totalInches = feet * 12 + inches;

    if (totalInches <= 0 || weight <= 0) {
      bmiText.textContent = "Your BMI Score is 0";
      return;
    }

    const bmi = (weight / (totalInches * totalInches)) * 703;

    bmiText.textContent = `Your BMI Score is ${bmi.toFixed(1)}`;
  }

  [feetInput, inchesInput, weightInput].forEach((input) => {
    input?.addEventListener("input", calculateBMI);
  });

  calculateBMI();
});
