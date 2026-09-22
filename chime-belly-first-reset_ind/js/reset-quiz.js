/* The Belly-First Reset (GLP-1 + tesamorelin): the in-page question carousel, the result slide
   and the sticky bar. Vanilla, no dependencies.

   The RULES (what counts as answered, the exclusive option on question 4, the
   "noted for your clinical review" chip, the saved record) are pure functions,
   exported for node: node chime-belly-first-reset_ind/js/reset-quiz-tests.js

   Answering a single-choice question slides to the next one; the page itself
   never scrolls or navigates. Going forward is only possible by answering;
   Back and a right-swipe return to answered slides. */
(function (root) {
  "use strict";

  var STORE_KEY = "chime:belly-first-reset";
  var ORDER = ["start", "ancestry", "family", "pattern", "tried", "trigger", "result"];
  var MULTI = "tried";
  var EXCLUSIVE = "first-attempt";
  var ADVANCE_MS = 260;

  function blank() {
    return { started: false, ancestry: "", family: "", pattern: "", tried: [], trigger: "" };
  }

  /* question 4: "This is my first serious attempt" clears the rest, and the reverse */
  function toggleMulti(selected, value) {
    var has = selected.indexOf(value) !== -1;
    if (has) return selected.filter(function (v) { return v !== value; });
    if (value === EXCLUSIVE) return [EXCLUSIVE];
    return selected.filter(function (v) { return v !== EXCLUSIVE; }).concat(value);
  }

  function isAnswered(id, a) {
    if (id === "start") return !!a.started;
    if (id === "result") return false;
    if (id === MULTI) return a.tried.length > 0;
    return !!a[id];
  }

  /* index of the first slide still waiting for an answer: the furthest a visitor may be */
  function furthest(a) {
    for (var i = 0; i < ORDER.length; i++) if (!isAnswered(ORDER[i], a)) return i;
    return ORDER.length - 1;
  }

  function chipItems(a) {
    /* belly-first leads on this page (the PDF's order for the Belly-First Reset) */
    var out = [];
    if (a.pattern === "middle") out.push("belly-first weight pattern");
    if (a.family && a.family !== "none-known") out.push("family history of type 2 diabetes");
    if (a.tried.length && a.tried.indexOf(EXCLUSIVE) === -1) out.push("prior weight loss attempts");
    return out;
  }

  function record(a, index, completed) {
    return {
      v: 1,
      page: "chime-belly-first-reset",
      index: index,
      completed: !!completed,
      answers: { ancestry: a.ancestry, family: a.family, pattern: a.pattern, tried: a.tried.slice(), trigger: a.trigger },
      started: !!a.started,
      noted: chipItems(a),
    };
  }

  function restore(raw) {
    var a = blank();
    try {
      var r = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!r || r.v !== 1 || !r.answers) return { answers: a, index: 0 };
      a.started = !!r.started;
      ["ancestry", "family", "pattern", "trigger"].forEach(function (k) {
        if (typeof r.answers[k] === "string") a[k] = r.answers[k];
      });
      if (Array.isArray(r.answers.tried)) a.tried = r.answers.tried.filter(function (v) { return typeof v === "string"; });
      var max = furthest(a);
      var idx = Math.max(0, Math.min(typeof r.index === "number" ? r.index : 0, max));
      return { answers: a, index: idx };
    } catch (e) {
      return { answers: blank(), index: 0 };
    }
  }

  var logic = {
    STORE_KEY: STORE_KEY, ORDER: ORDER, EXCLUSIVE: EXCLUSIVE,
    blank: blank, toggleMulti: toggleMulti, isAnswered: isAnswered,
    furthest: furthest, chipItems: chipItems, record: record, restore: restore,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = logic;
  root.ChimeResetQuiz = logic;
  if (typeof document === "undefined") return;

  /* ---------------------------------------------------------------- DOM */
  var quiz = document.querySelector("[data-quiz]");
  if (!quiz) return;
  var reduced = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var viewport = quiz.querySelector("[data-quiz-viewport]");
  var track = quiz.querySelector("[data-quiz-track]");
  var slides = ORDER.map(function (id) { return quiz.querySelector('[data-slide="' + id + '"]'); });
  var backBtn = quiz.querySelector("[data-quiz-back]");
  var stepper = quiz.querySelector("[data-quiz-stepper]");
  var dots = stepper ? [].slice.call(stepper.children) : [];
  var live = quiz.querySelector("[data-quiz-live]");
  var contBtn = quiz.querySelector("[data-quiz-continue]");
  var chip = quiz.querySelector("[data-quiz-chip]");
  var chipList = quiz.querySelector("[data-quiz-chip-list]");
  var waist = quiz.querySelector("[data-waist]");

  var saved = { answers: blank(), index: 0 };
  try { saved = restore(root.sessionStorage.getItem(STORE_KEY)); } catch (e) {}
  var answers = saved.answers;
  var index = 0;
  var timer = 0;
  var resultShown = false;

  function save(completed) {
    try { root.sessionStorage.setItem(STORE_KEY, JSON.stringify(record(answers, index, completed))); } catch (e) {}
  }

  function fitHeight() {
    viewport.style.height = slides[index].offsetHeight + "px";
  }

  function paintInputs() {
    [].forEach.call(quiz.querySelectorAll(".opt input"), function (el) {
      el.checked = el.type === "checkbox" ? answers.tried.indexOf(el.value) !== -1 : answers[el.name] === el.value;
    });
    if (contBtn) contBtn.disabled = answers.tried.length === 0;
  }

  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    var dec = el.hasAttribute("data-dec") ? parseInt(el.getAttribute("data-dec"), 10) : 1;
    if (reduced) { el.textContent = to.toFixed(dec); return; }
    var t0 = 0;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1300);
      el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) root.requestAnimationFrame(tick);
    }
    el.textContent = (0).toFixed(dec);
    root.requestAnimationFrame(tick);
  }

  function showResult() {
    var items = chipItems(answers);
    chipList.innerHTML = "";
    items.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      chipList.appendChild(li);
    });
    chip.hidden = items.length === 0;
    if (resultShown) return;
    resultShown = true;
    [].forEach.call(quiz.querySelectorAll("[data-count]"), countUp);
    if (reduced) { waist.setAttribute("data-go", ""); return; }
    /* each row's marker slides from the standard chart's number to ours (40 to 35, 35 to 31);
       its label reads the inch value under it on every frame. Scale: 24 to 44 in. */
    var rows = [].slice.call(waist.querySelectorAll(".waist__row"));
    rows.forEach(function (r) { r.querySelector("[data-waist-n]").textContent = r.getAttribute("data-from"); });
    root.setTimeout(function () {
      waist.setAttribute("data-go", "");
      var until = Date.now() + 2600;
      (function follow() {
        rows.forEach(function (r) {
          var mark = r.querySelector(".waist__mark"), rail = mark.parentNode;
          var x = (mark.offsetLeft + mark.offsetWidth / 2) / rail.offsetWidth;
          var n = Math.round(24 + 20 * x);
          var lo = +r.getAttribute("data-to"), hi = +r.getAttribute("data-from");
          r.querySelector("[data-waist-n]").textContent = String(Math.max(lo, Math.min(hi, n)));
        });
        if (Date.now() < until) root.requestAnimationFrame(follow);
        else rows.forEach(function (r) { r.querySelector("[data-waist-n]").textContent = r.getAttribute("data-to"); });
      })();
    }, 500);
  }

  function goTo(i, opts) {
    opts = opts || {};
    i = Math.max(0, Math.min(i, furthest(answers)));
    index = i;
    var id = ORDER[i];
    if (opts.instant) track.style.transition = "none";
    track.style.transform = "translateX(" + -100 * i + "%)";
    if (opts.instant) { void track.offsetWidth; track.style.transition = ""; }

    slides.forEach(function (s, n) {
      var on = n === i;
      s.inert = !on;
      s.setAttribute("aria-hidden", on ? "false" : "true");
    });
    backBtn.hidden = i === 0;
    var step = i >= 1 && i <= 5 ? i : 0;
    if (step) stepper.removeAttribute("data-off"); else stepper.setAttribute("data-off", "");
    dots.forEach(function (d, n) {
      d.setAttribute("data-state", n + 1 < step || id === "result" ? "done" : n + 1 === step ? "now" : "todo");
    });
    if (id === "result") showResult();
    fitHeight();
    save(false);

    if (opts.focus !== false) {
      var head = slides[i].querySelector("h3, .q");
      if (live) live.textContent = step ? "Question " + step + " of 5" : id === "result" ? "Your result" : "";
      if (head) root.setTimeout(function () { head.focus({ preventScroll: true }); }, reduced ? 0 : 380);
    }
  }

  function advanceSoon() {
    root.clearTimeout(timer);
    timer = root.setTimeout(function () { goTo(index + 1); }, reduced ? 0 : ADVANCE_MS);
  }

  /* start */
  quiz.querySelector("[data-quiz-start]").addEventListener("click", function () {
    answers.started = true;
    goTo(1);
    /* the one scroll the quiz makes: Start brings the card to the top of the screen,
       so the longest question keeps its Continue pill in view. Answers never scroll. */
    quiz.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  });

  /* single choice: a tap or click answers and moves on. Arrow keys only move the
     selection (they fire click with detail 0); Enter confirms for keyboard users. */
  quiz.addEventListener("click", function (e) {
    var el = e.target;
    if (!el.matches || !el.matches('.opt input[type="radio"]')) return;
    answers[el.name] = el.value;
    save(false);
    if (e.detail > 0) advanceSoon();
  });
  quiz.addEventListener("keydown", function (e) {
    var el = e.target;
    if (e.key !== "Enter" || !el.matches || !el.matches('.opt input[type="radio"]')) return;
    e.preventDefault();
    if (!el.checked) { el.checked = true; answers[el.name] = el.value; }
    advanceSoon();
  });

  /* question 4: select all that apply */
  quiz.addEventListener("change", function (e) {
    var el = e.target;
    if (!el.matches || !el.matches('.opt input[type="checkbox"]')) return;
    answers.tried = toggleMulti(answers.tried, el.value);
    paintInputs();
    save(false);
  });
  if (contBtn) contBtn.addEventListener("click", function () {
    if (answers.tried.length) goTo(index + 1);
  });

  backBtn.addEventListener("click", function () {
    root.clearTimeout(timer);
    goTo(index - 1);
  });

  /* swipe: right = back, left = forward over slides that are already answered */
  var sx = 0, sy = 0, tracking = false;
  viewport.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;
    tracking = true; sx = e.clientX; sy = e.clientY;
  });
  viewport.addEventListener("pointerup", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    root.clearTimeout(timer);
    goTo(dx > 0 ? index - 1 : index + 1);
  });
  viewport.addEventListener("pointercancel", function () { tracking = false; });

  var finish = quiz.querySelector("[data-quiz-finish]");
  if (finish) finish.addEventListener("click", function () { save(true); });

  if (root.ResizeObserver) {
    var ro = new root.ResizeObserver(fitHeight);
    slides.forEach(function (s) { ro.observe(s); });
  } else {
    root.addEventListener("resize", fitHeight);
  }

  paintInputs();
  goTo(saved.index, { instant: true, focus: false });

  /* ------------------------------------------------ sticky mobile bar */
  var bar = document.querySelector("[data-sticky]");
  var heroCta = document.getElementById("hero-cta");
  if (bar && heroCta && "IntersectionObserver" in root) {
    var seen = { hero: true, quiz: false, closing: false, footer: false };
    var paint = function () { bar.hidden = seen.hero || seen.quiz || seen.closing || seen.footer; };
    var watch = function (el, key) {
      if (!el) return;
      new root.IntersectionObserver(function (es) {
        seen[key] = es[0].isIntersecting;
        paint();
      }, { threshold: 0 }).observe(el);
    };
    watch(heroCta, "hero");
    watch(quiz, "quiz");
    watch(document.getElementById("closing-cta"), "closing");
    watch(document.querySelector(".footer"), "footer");
  }
})(typeof window !== "undefined" ? window : globalThis);
