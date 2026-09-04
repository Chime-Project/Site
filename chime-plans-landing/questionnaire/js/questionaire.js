document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#languageSwitcher .lang-btn");
  const mobileBtn = document.getElementById("mobileLanguageBtn");

  let currentLang = "en";

  function setLanguage(lang) {
    currentLang = lang;

    buttons.forEach((btn) => {
      btn.classList.remove(
        "lang-active",
        "lang-active-left",
        "lang-active-right"
      );

      if (btn.dataset.lang === lang) {
        btn.classList.add("lang-active");

        if (lang === "en") {
          btn.classList.add("lang-active-right");
        } else {
          btn.classList.add("lang-active-left");
        }
      }
    });

    mobileBtn.textContent = lang.toUpperCase();
  }

  // Desktop click
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });

  // Mobile toggle
  mobileBtn.addEventListener("click", () => {
    const nextLang = currentLang === "en" ? "es" : "en";
    setLanguage(nextLang);
  });

  // Initial state
  setLanguage("en");
});