// Chime Health — Executive landing · motion layer.
//
// GSAP 3.15 (core + ScrollTrigger + SplitText, all MIT-free since 3.13). Plain
// JS on purpose: it is loaded as a classic <script>, needs no Babel pass, and
// is cached as-is. ExecutiveWLPage.jsx calls window.ExecMotion.mount() from a
// layout effect — i.e. after React has committed the DOM and BEFORE the first
// paint, which is what lets every `gsap.from()` hide its target without a
// flash of the resting state.
//
// What runs where (the research shortlist, kept to the moves that earn their
// place on a conversion page — guide the eye, never decorate):
//
//   Hero       load-in timeline: chrome pills drop, headline lines rise out of
//              clip masks (SplitText mask:"lines"), hairline draws, subhead +
//              CTA fade up, badge spins in, PERFORM rises from behind the value
//              ribbon, ribbon items cascade. Then a scrubbed parallax as the
//              hero scrolls off (wordmark drifts, footage zooms).
//   Problem    the statement reveals word-by-word tied to scroll (scrub) — the
//              dark-band "read it as you arrive" beat; still wipes in with a
//              clip-path + Ken Burns settle.
//   Solutions  masked line reveal on the h2; the "≠" glyph and vial drift on a
//              scrubbed parallax; vial lands with a small rotation.
//   Care path  the five strips wipe in like bars filling, staggered and
//              scrubbed — the widening colour IS the arrow chain.
//   Steps      cards cascade; each kicker hairline draws left → right.
//   Stills     clip-path reveals (Problem + Membership, and any `.exec-still`).
//   Scrubs     any `.exec-scrub` heading gets the Problem band's word-by-word
//              scroll reveal (the labs landing's Why Different band).
//   Curtain    (labs landing) the hero is PINNED while the Recognition
//              triptych scrolls up over it, and inside the strip the three
//              slabs slide into place along their own seams with a trailing
//              stagger (scrubbed) — a translation along the cut keeps the cut
//              one continuous line, so the seams never break mid-motion; the
//              photos carry a light parallax and the captions land last.
//   Iceberg    (labs landing) the tip lands, the waterline draws, the labels
//              fade in, and the submerged mass rises out of the deep on a
//              scrub — "what's underneath" is revealed by the reader's own
//              scrolling, which is the section's whole argument.
//   Final CTA  background parallax, masked headline, CTA pops in.
//   CTAs       magnetic pull + lift on fine pointers only.
//
// Reduced motion: the whole layer sits inside gsap.matchMedia() under
// (prefers-reduced-motion: no-preference). When that does not match nothing is
// set up and nothing is hidden — the page simply renders at rest. If the user
// flips the preference mid-visit, matchMedia reverts every tween, trigger and
// split it created.
//
// No palette primitives in here (theme guard): the layer only moves things.

(function () {
  "use strict";

  function mount(root) {
    root = root || document;
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var SplitText = window.SplitText || null;
    if (!gsap || !ScrollTrigger) return function () {};

    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);
    // The mobile address bar collapsing/expanding fires resize; recalculating
    // every trigger for that is wasted work and can make pins jump.
    ScrollTrigger.config({ ignoreMobileResize: true });

    var q = function (sel, scope) { return (scope || root).querySelector(sel); };
    var qa = function (sel, scope) { return Array.prototype.slice.call((scope || root).querySelectorAll(sel)); };

    var mm = gsap.matchMedia();

    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      fine: "(hover: hover) and (pointer: fine)",
      desktop: "(min-width: 701px)",
    }, function (ctx) {
      var c = ctx.conditions;
      if (!c.motion) return undefined;

      var cleanups = [];

      // ── helpers ───────────────────────────────────────────────────────────
      // Masked line reveal. SplitText wraps each line in a clip box and the
      // line rises out of it. autoSplit re-splits when Quicksand lands (it is
      // a Google Font with display=swap) or the width changes, and because the
      // tween is RETURNED from onSplit, SplitText carries its progress across
      // the re-split instead of replaying it. Falls back to a plain fade-up if
      // SplitText failed to load.
      function revealLines(el, opts) {
        if (!el) return;
        opts = opts || {};
        var trig = opts.scroll === false ? null : { trigger: opts.trigger || el, start: opts.start || "top 85%", once: true };
        if (!SplitText) {
          return gsap.from(el, {
            y: 28, autoAlpha: 0, duration: 1, ease: "power3.out",
            delay: opts.delay || 0, scrollTrigger: trig || undefined,
          });
        }
        return SplitText.create(el, {
          type: "lines", mask: "lines", linesClass: "exec-line", autoSplit: true,
          onSplit: function (self) {
            return gsap.from(self.lines, {
              yPercent: 120, duration: opts.duration || 1.1, ease: "power4.out",
              stagger: opts.stagger || 0.1, delay: opts.delay || 0,
              scrollTrigger: trig || undefined,
            });
          },
        });
      }

      // Still reveal: the figure wipes open bottom→top while the picture
      // settles from oversized to its natural frame.
      function revealStill(fig) {
        if (!fig) return;
        var img = fig.querySelector("img");
        var tl = gsap.timeline({
          scrollTrigger: { trigger: fig, start: "top 82%", once: true },
          defaults: { ease: "power3.out", duration: 1.4 },
        });
        tl.fromTo(fig, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0);
        if (img) tl.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 1.8 }, 0);
        return tl;
      }

      // ── Hero load-in ──────────────────────────────────────────────────────
      var hero = q('[data-screen-label="Exec Hero"]');
      var chrome = q('[data-screen-label="Exec Chrome"]');
      var intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (chrome) {
        intro.from(chrome.children, { y: -18, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0);
      }
      if (hero) {
        var h1 = q("h1", hero);
        var rule = q(".exec-hero-rule", hero);
        var subBits = qa(".exec-hero-sub > p, .exec-hero-sub > .exec-cta", hero);
        var badge = q(".exec-badge", hero);
        var word = q(".exec-hero-word", hero);
        var valueBits = qa(".exec-value-item, .exec-value-dot", hero);
        var video = q(".exec-hero-video", hero);
        var copy = q(".exec-hero-copy", hero);

        revealLines(h1, { scroll: false, delay: 0.2, duration: 1.2, stagger: 0.09 });
        if (rule) intro.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power4.out" }, 0.55);
        if (subBits.length) intro.from(subBits, { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.14 }, 0.7);
        if (badge) intro.from(badge, { scale: 0.5, rotation: -50, autoAlpha: 0, duration: 1.1, ease: "back.out(1.6)" }, 0.4);
        // The ribbon is opaque and sits above the copy layer, so a wordmark
        // rising from below its top edge is masked by it for free.
        if (word) intro.from(word, { y: "0.6em", autoAlpha: 0, duration: 1.5, ease: "power4.out" }, 0.5);
        if (valueBits.length) intro.from(valueBits, { y: 10, autoAlpha: 0, duration: 0.6, stagger: 0.04 }, 1.0);

        // Scrubbed exit parallax: as the dark band slides up over the hero,
        // the wordmark and copy lag behind and the footage eases in a touch.
        var exit = gsap.timeline({
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          defaults: { ease: "none" },
        });
        if (word) exit.to(word, { yPercent: 30 }, 0);
        if (copy) exit.to(copy, { y: 80 }, 0);
        if (video) exit.to(video, { scale: 1.08 }, 0);
      }

      // Word-by-word scroll reveal, scrubbed: the dark-band "read it as you
      // arrive" beat. Plain fade-up if SplitText failed to load.
      function scrubWords(el) {
        if (!el) return;
        if (SplitText) {
          return SplitText.create(el, {
            type: "words", wordsClass: "exec-word", autoSplit: true,
            onSplit: function (self) {
              return gsap.from(self.words, {
                opacity: 0.16, ease: "none", stagger: 0.05,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
              });
            },
          });
        }
        return gsap.from(el, { autoAlpha: 0, y: 30, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      }

      // ── Problem band ──────────────────────────────────────────────────────
      var problem = q('[data-screen-label="Problem ID"]');
      if (problem) {
        scrubWords(q("h2", problem));
        revealStill(q(".exec-problem-figure", problem));
      }
      // The same two treatments by hook, for pages whose dark band is not the
      // Problem band (labs: Why Different).
      qa(".exec-scrub").forEach(function (el) { scrubWords(el); });
      qa(".exec-still").forEach(function (fig) { revealStill(fig); });

      // ── Solutions: ≠ glyph + vial ─────────────────────────────────────────
      var sol = q('[data-screen-label="No Two Bodies"]');
      if (sol) {
        var visual = q(".exec-glyph-visual", sol);
        var glyph = visual && q("span", visual);
        var vial = visual && q("img", visual);
        if (visual) {
          var land = gsap.timeline({
            scrollTrigger: { trigger: visual, start: "top 78%", once: true },
            defaults: { ease: "power3.out" },
          });
          if (glyph) land.from(glyph, { scale: 0.7, autoAlpha: 0, duration: 1.3, ease: "power4.out" }, 0);
          if (vial) land.from(vial, { y: 90, rotation: -7, autoAlpha: 0, duration: 1.3 }, 0.2);
          var drift = gsap.timeline({
            scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: true },
            defaults: { ease: "none" },
          });
          if (glyph) drift.fromTo(glyph, { yPercent: -8, rotation: -4 }, { yPercent: 8, rotation: 4 }, 0);
          if (vial) drift.fromTo(vial, { yPercent: 10 }, { yPercent: -14 }, 0);
        }
      }

      // ── Care path strips ──────────────────────────────────────────────────
      var strips = qa(".exec-strip");
      if (strips.length) {
        var labels = qa(".exec-strip-label");
        // Columns wipe upward on desktop; the stacked rows on phones wipe
        // left → right instead so the motion still reads as "filling".
        var closed = c.desktop ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
        var path = gsap.timeline({
          scrollTrigger: { trigger: ".exec-strips", start: "top 85%", end: c.desktop ? "top 25%" : "bottom 75%", scrub: 0.6 },
          defaults: { ease: "none" },
        });
        path.fromTo(strips, { clipPath: closed }, { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.12, duration: 0.6 }, 0)
            .from(labels, { autoAlpha: 0, y: c.desktop ? 0 : 12, stagger: 0.12, duration: 0.4 }, 0.25);
      }

      // ── Section headings (masked line reveals) ────────────────────────────
      qa(".exec-heading").forEach(function (h) { revealLines(h); });

      // ── Generic fade-ups, batched so neighbours cascade together ──────────
      var fades = qa(".exec-fade");
      if (fades.length) {
        gsap.set(fades, { autoAlpha: 0, y: 32 });
        ScrollTrigger.batch(fades, {
          start: "top 88%", once: true,
          onEnter: function (batch) {
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true });
          },
        });
      }

      // ── Kicker hairlines draw ─────────────────────────────────────────────
      // One trigger PER grid: the labs landing carries three kicker grids a long
      // way apart (Recognition, Tiers, 3-Step Close) and a single document-wide
      // tween would draw the later grids' rules while they were still
      // off-screen. The WL page has one grid, so this is what it always did.
      qa(".exec-steps-grid, .exec-kicker-grid").forEach(function (grid) {
        var rules = qa(".exec-kicker-rule", grid);
        if (!rules.length) return;
        gsap.from(rules, {
          scaleX: 0, duration: 1.1, ease: "power4.out", stagger: 0.12,
          scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        });
      });

      // ── Membership still ──────────────────────────────────────────────────
      revealStill(q(".exec-membership-figure"));

      // ── Final CTA ─────────────────────────────────────────────────────────
      var fin = q('[data-screen-label="Final CTA"]');
      if (fin) {
        var bg = q(".exec-final-bg", fin);
        var cta = q(".exec-cta", fin);
        if (bg) {
          gsap.fromTo(bg, { yPercent: -10, scale: 1.14 }, {
            yPercent: 10, scale: 1.14, ease: "none",
            scrollTrigger: { trigger: fin, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
        if (cta) {
          gsap.from(cta, {
            scale: 0.8, autoAlpha: 0, duration: 0.9, ease: "back.out(1.7)", delay: 0.35,
            scrollTrigger: { trigger: fin, start: "top 70%", once: true },
          });
        }
      }

      // ── Hero → Recognition curtain (labs landing) ─────────────────────────
      var strip = q(".exec-recognition-strip");
      if (hero && strip) {
        // 1. The hero holds still for exactly its own height of scroll while
        //    the next section slides up over it (pinSpacing:false = no extra
        //    scroll distance, the strip simply rises over the fixed hero).
        //    The hero's existing exit parallax (wordmark drift, footage zoom)
        //    keeps running underneath, which is what gives the cover depth.
        //    z-order (strip above the fixed hero) is the page CSS's job.
        ScrollTrigger.create({
          trigger: hero, start: "top top", end: "bottom top",
          pin: true, pinSpacing: false, anticipatePin: 1,
        });

        // 2. Slabs. Geometry is read from layout offsets (offset* ignore the
        //    transforms this very tween applies), inside functions so
        //    invalidateOnRefresh re-measures after a resize or font swap.
        var panels = qa(".exec-recognition-panel", strip);
        var stripH = function () { return strip.offsetHeight; };
        var stripW = function () { return strip.offsetWidth; };
        // Desktop row: panels overlap horizontally by the seam run.
        var seamX = function () {
          return panels.length > 1 ? Math.max(0, (panels[0].offsetLeft + panels[0].offsetWidth) - panels[1].offsetLeft) : 0;
        };
        // Stacked column: they overlap vertically by it instead.
        var seamY = function () {
          return panels.length > 1 ? Math.max(0, (panels[0].offsetTop + panels[0].offsetHeight) - panels[1].offsetTop) : 0;
        };
        if (c.desktop) {
          // Along the seam = down-left; each slab starts further down than the
          // one before it and they all arrive together as the strip lands.
          panels.forEach(function (p, i) {
            var k = 0.3 + i * 0.3;
            gsap.fromTo(p,
              { y: function () { return stripH() * k; }, x: function () { return -seamX() * k; } },
              { y: 0, x: 0, ease: "none",
                scrollTrigger: { trigger: strip, start: "top bottom", end: "top 12%", scrub: 0.6, invalidateOnRefresh: true } });
          });
        } else {
          // Stacked: the seam runs left-low → right-high, so "along the seam"
          // is sideways (with the small matching vertical component). Slabs
          // alternate sides, each on its own trigger.
          panels.forEach(function (p, i) {
            var dir = i % 2 ? -1 : 1;
            gsap.fromTo(p,
              { x: function () { return -dir * stripW() * 0.35; }, y: function () { return dir * seamY() * 0.35; } },
              { x: 0, y: 0, ease: "none",
                scrollTrigger: { trigger: p, start: "top bottom", end: "top 45%", scrub: 0.6, invalidateOnRefresh: true } });
          });
        }

        // 3. Photos drift slower than the strip (the img is cut 16% taller
        //    than its figure for this); captions land once the strip is in.
        var photos = qa(".exec-recognition-media img", strip);
        if (photos.length) {
          gsap.fromTo(photos, { yPercent: -5 }, { yPercent: 5, ease: "none",
            scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: true } });
        }
        var caps = qa(".exec-recognition-caption", strip);
        if (caps.length) {
          gsap.from(caps, { autoAlpha: 0, y: 22, duration: 0.9, ease: "power3.out", stagger: 0.12,
            scrollTrigger: { trigger: strip, start: c.desktop ? "top 45%" : "top 70%", once: true } });
        }
      }

      // ── Iceberg (labs landing) ────────────────────────────────────────────
      // The SVG is geometry in a 520×560 viewBox: a tip above the waterline, a
      // mass below it inside a clip at the waterline. The tip lands and the
      // line draws once; the mass is SCRUBBED up from fully submerged (y 360 in
      // viewBox units, i.e. below the clip) to its resting place, so the reader
      // scrolls it into existence.
      var ice = q(".exec-iceberg");
      if (ice) {
        var iceSvg = q(".exec-iceberg-svg", ice);
        var iceDeep = q(".exec-iceberg-deep", ice);
        var iceTip = q(".exec-iceberg-tip", ice);
        var iceLine = q(".exec-iceberg-line", ice);
        var iceLabels = qa(".exec-iceberg-label", ice);
        if (iceSvg) {
          var settle = gsap.timeline({
            scrollTrigger: { trigger: iceSvg, start: "top 80%", once: true },
            defaults: { ease: "power3.out" },
          });
          if (iceTip) settle.from(iceTip, { y: 48, autoAlpha: 0, duration: 1.1 }, 0);
          if (iceLine) settle.fromTo(iceLine, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 1.3, ease: "power4.out" }, 0.1);
          if (iceLabels.length) settle.from(iceLabels, { autoAlpha: 0, y: 8, duration: 0.7, stagger: 0.18 }, 0.7);
          if (iceDeep) {
            gsap.fromTo(iceDeep, { y: 360 }, {
              y: 0, ease: "none",
              scrollTrigger: { trigger: iceSvg, start: "top 85%", end: "center 40%", scrub: 0.6 },
            });
          }
        }
      }

      // ── Magnetic CTAs (fine pointers only) ────────────────────────────────
      // Percent-based offsets so this never shares a property with an
      // entrance tween (those use px y / autoAlpha). Subtle on purpose: a pill
      // that leans toward the cursor, not one that chases it.
      if (c.fine) {
        qa(".exec-cta").forEach(function (el) {
          var xTo = gsap.quickTo(el, "xPercent", { duration: 0.45, ease: "power3" });
          var yTo = gsap.quickTo(el, "yPercent", { duration: 0.45, ease: "power3" });
          var onMove = function (e) {
            var r = el.getBoundingClientRect();
            xTo(((e.clientX - (r.left + r.width / 2)) / r.width) * 100 * 0.18);
            yTo(((e.clientY - (r.top + r.height / 2)) / r.height) * 100 * 0.28);
          };
          var onEnter = function () { gsap.to(el, { scale: 1.04, duration: 0.4, ease: "power3.out", overwrite: "auto" }); };
          var onLeave = function () {
            xTo(0); yTo(0);
            gsap.to(el, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerenter", onEnter);
          el.addEventListener("pointerleave", onLeave);
          cleanups.push(function () {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
          });
        });
      }

      // Positions depend on the webfont's metrics and on lazy media; re-measure
      // once both have settled.
      var refresh = function () { ScrollTrigger.refresh(); };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
      cleanups.push(function () { window.removeEventListener("load", refresh); });

      return function () { cleanups.forEach(function (fn) { fn(); }); };
    });

    return function () { mm.revert(); };
  }

  window.ExecMotion = { mount: mount };
})();
