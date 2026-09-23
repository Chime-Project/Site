/* Chime weight-loss pre-quiz landing: behaviour, ported from the reference's React source
   (startaspen.com/lp/weight-loss2). Same four questions, same rules:
   · every answer advances; the last one reveals #good-news and smooth-scrolls to it 60ms later
   · dots 1..current are filled with the brand colour, the rest are a 12% tint
   · a step leaves to the left (opacity 0, x -16px) then the next enters from the right
     (x 16px → 0), 0.28s each, like framer-motion's AnimatePresence mode="wait"
   · "Get approved now" (hero + phone sticky) scrolls to #quiz; every other CTA goes to INTAKE_URL
   · phone only: the sticky button sits 8px under the hero image while the hero button is off
     screen, and never again once the hero button has been on screen
   The pure pieces are exported for node (js/lp-tests.js). */
(function (root) {
  "use strict";

  var INTAKE_URL = "../chimeAssessment.html";
  var STEPS = [
    { q: "How do you want to lose weight?", options: ["Easy, weekly medication", "Reduce my Appetite", "All of the above"] },
    { q: "Are you looking to skip waiting rooms and pharmacy lines?", options: ["All online, Please!", "Doesn't matter"] },
    { q: "Open to medication if a provider recommends it?", options: ["Yes", "Tell me more"] },
    { q: "Are you excited about finally losing weight?", options: ["Excited!", "Maybe"] }
  ];
  var STEP_MS = 280;

  /* Next state after any answer: advance, or stay on the last step and complete. */
  function answer(step) {
    return step < STEPS.length - 1 ? { step: step + 1, complete: false } : { step: step, complete: true };
  }
  /* Sticky shows only while the hero button has never been seen and is not on screen. */
  function stickyVisible(seen, heroVisible) {
    return !seen && !heroVisible;
  }

  var api = { INTAKE_URL: INTAKE_URL, STEPS: STEPS, answer: answer, stickyVisible: stickyVisible };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  var doc = root.document;
  var reduce = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var quiz = doc.getElementById("quiz");
  var dots = quiz.querySelectorAll("[data-quiz-dots] > span");
  var stepEl = quiz.querySelector("[data-quiz-step]");
  var qEl = quiz.querySelector("[data-quiz-q]");
  var optsEl = quiz.querySelector("[data-quiz-options]");
  var optTemplate = optsEl.querySelector("button").cloneNode(false);
  var goodNews = doc.getElementById("good-news");
  var step = 0;
  var busy = false;

  function scrollToId(id) {
    var el = doc.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function paintDots() {
    for (var i = 0; i < dots.length; i++) {
      var on = i <= step;
      dots[i].style.backgroundColor = on ? "var(--lp-brand)" : "var(--lp-brand-a12)";
      dots[i].style.color = on ? "#fff" : "var(--lp-muted)";
    }
  }

  function renderStep() {
    var s = STEPS[step];
    qEl.textContent = s.q;
    optsEl.textContent = "";
    s.options.forEach(function (label) {
      var b = optTemplate.cloneNode(false);
      b.textContent = label;
      optsEl.appendChild(b);
    });
  }

  function reveal() {
    goodNews.className = "mt-10 md:mt-14";
    var inner = goodNews.querySelector(".lp-reveal");
    root.requestAnimationFrame(function () { root.requestAnimationFrame(function () { inner.classList.add("is-in"); }); });
    root.setTimeout(function () { scrollToId("good-news"); }, 60);
  }

  optsEl.addEventListener("click", function (e) {
    if (!e.target.closest("button") || busy) return;
    var next = answer(step);
    if (next.complete) { reveal(); return; }
    step = next.step;
    paintDots();
    if (reduce) { renderStep(); return; }
    busy = true;
    stepEl.classList.add("is-out");
    root.setTimeout(function () {
      renderStep();
      stepEl.classList.remove("is-out");
      stepEl.classList.add("is-pre");
      void stepEl.offsetWidth;
      stepEl.classList.remove("is-pre");
      root.setTimeout(function () { busy = false; }, STEP_MS);
    }, STEP_MS);
  });

  doc.addEventListener("click", function (e) {
    var cta = e.target.closest("[data-cta]");
    if (!cta) return;
    if (cta.getAttribute("data-cta") === "quiz") scrollToId("quiz");
    else root.location.href = INTAKE_URL;
  });

  /* Phone sticky button */
  var sticky = doc.querySelector("[data-sticky-cta]");
  var heroImg = doc.getElementById("lp-hero-img");
  var heroCta = doc.getElementById("lp-hero-cta");
  var seen = false;
  var heroVisible = true;
  var raf = 0;

  function place() {
    raf = 0;
    if (!stickyVisible(seen, heroVisible)) { sticky.hidden = true; return; }
    var top = heroImg.getBoundingClientRect().bottom + 8;
    sticky.hidden = !(top > 0);
    sticky.style.top = top + "px";
  }
  function queue() { if (!raf) raf = root.requestAnimationFrame(place); }

  if ("IntersectionObserver" in root) {
    var io = new root.IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) seen = true;
      if (seen) {
        io.disconnect();
        root.removeEventListener("scroll", queue);
        root.removeEventListener("resize", queue);
      }
      place();
    }, { threshold: 0 });
    io.observe(heroCta);
    root.addEventListener("scroll", queue, { passive: true });
    root.addEventListener("resize", queue);
  }

  paintDots();
})(typeof window !== "undefined" ? window : this);
