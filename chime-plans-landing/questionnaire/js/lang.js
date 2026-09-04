/*
 * lang.js: the EN/ES switcher, for real this time.
 *
 * The markup already existed on every page of this funnel and did nothing.
 * `#languageSwitcher` holds two anchors, both `href="javascript:void(0)"`, and
 * `js/questionaire.js`'s setLanguage() only toggles a CSS class and rewrites the label on
 * `#mobileLanguageBtn`. Nothing ever navigated. Devin msg 1910: wire it in.
 *
 * TWO FACTS, TWO FUNCTIONS. Do not merge them back into one `inSpanish()`.
 *
 *   pageLang()  reads <html lang>, which the build sets. It decides which option renders
 *               as ACTIVE.
 *   inEsDir()   tests the document's BASE DIRECTORY. It decides whether a link to the
 *               other language needs "es/" or "../".
 *
 * They are not the same question and conflating them is a real bug, not a tidiness issue.
 * GLPQuizTRENSP's original counted path segments to answer both, so on the deploy prefix
 * /glpquizfr-preview/es/ it read the prefix and reported English. Worse, a bare "/es" with
 * no trailing slash is a document that IS Spanish while its relative URLs resolve against
 * the PARENT directory, and no amount of segment counting can express that. Hence the
 * split.
 *
 * This file is loaded by both trees. The Spanish pages under questionnaire/es/ reach it at
 * ../js/lang.js, which is the same file.
 */
(function () {
  "use strict";

  function pageLang() {
    var l = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
    return l.indexOf("es") === 0 ? "es" : "en";
  }

  // Everything up to and including the last "/". This is what a relative href resolves
  // against, which is the only thing href construction cares about.
  function baseDir() {
    var p = location.pathname;
    return p.slice(0, p.lastIndexOf("/") + 1);
  }

  function inEsDir() {
    return /\/es\/$/.test(baseDir());
  }

  // A directory URL ("/glpquizfr-preview/es/") serves index.html, exactly as the S3
  // website endpoint does. An empty last segment therefore names index.html, not "".
  function currentFile() {
    var f = location.pathname.split("/").pop().split("?")[0];
    return f === "" ? "index.html" : f;
  }

  // The mirror is always exactly one directory deep, in both trees:
  //   index.html            <->  es/index.html
  //   questionnaire/step6   <->  questionnaire/es/step6.html
  function hrefFor(lang) {
    var f = currentFile();
    if (lang === "es") return inEsDir() ? f : "es/" + f;
    return inEsDir() ? "../" + f : f;
  }

  function paint() {
    var lang = pageLang();
    var links = document.querySelectorAll("#languageSwitcher .lang-btn[data-lang]");

    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var target = a.getAttribute("data-lang");

      // A real href, so the control is a link: middle-clickable, right-clickable, and
      // legible in the status bar. It was href="javascript:void(0)".
      a.setAttribute("href", hrefFor(target));

      // js/questionaire.js runs setLanguage("en") on DOMContentLoaded, unconditionally,
      // so on a Spanish page it marks EN active. It registers first, so this runs after
      // and corrects it. Painting from <html lang> rather than from a module variable is
      // also what makes the state survive a back-button restore.
      a.classList.remove("lang-active", "lang-active-left", "lang-active-right");
      if (target === lang) {
        a.classList.add("lang-active");
        a.classList.add(lang === "en" ? "lang-active-right" : "lang-active-left");
      }
    }

    var mob = document.getElementById("mobileLanguageBtn");
    if (mob) mob.textContent = lang.toUpperCase();
  }

  function bind() {
    paint();

    // The mobile button is a <button>, not a link, so it needs a navigation of its own.
    // Capture phase: questionaire.js binds a bubble-phase handler that only flips the
    // label, and letting it run first would show the visitor the other language's label
    // for the length of a navigation.
    var mob = document.getElementById("mobileLanguageBtn");
    if (mob) {
      mob.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        location.href = hrefFor(pageLang() === "en" ? "es" : "en");
      }, true);
    }

    // A history navigation restores the document without firing DOMContentLoaded, and
    // questionaire.js's setLanguage("en") may have run against a cached page.
    window.addEventListener("pageshow", paint);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
