const stateSelect = document.getElementById("state");
const stateText = document.getElementById("stateText");

stateSelect.addEventListener("change", function () {
  stateText.textContent = this.options[this.selectedIndex].text;

  stateText.classList.remove("text-neutral-500");
  stateText.classList.add("text-neutral-950");
});
const genderSelect = document.getElementById("gender");
const genderText = document.getElementById("genderText");

genderSelect.addEventListener("change", function () {
  genderText.textContent = this.options[this.selectedIndex].text;

  genderText.classList.remove("text-neutral-500");
  genderText.classList.add("text-neutral-950");
});
