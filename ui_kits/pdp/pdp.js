// Chime Health — product page (PDP) template behaviour. Vanilla port of the
// nine Stimulus controllers on ronanrx.com/tirzepatide (plan §3 in
// TIRZEPATIDE-PDP-RIP-PLAN.md): product-gallery, product-film, dose-price
// (switch door + dose pick + CTA param sync), product-offer (coupon, receipt
// roll + confetti, sticky bar), product-navigation (menu), helix-reveal,
// stmt-parallax, portal-reveal. The coupon check is client-side (the reference
// PATCHes its server); nothing is persisted — a reload resets, like the
// reference. Everything with motion is gated on prefers-reduced-motion.
//
// The price math and the CTA href builder are pure and exported on
// window.ChimePdp / module.exports so pdp-tests.js can run them under node.
(function (root) {
  "use strict";

  // ---- Pure helpers -------------------------------------------------------
  function money(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }
  function fill(template, vars) {
    return String(template).replace(/%\{(\w+)\}/g, function (_, k) {
      return vars[k] == null ? "" : vars[k];
    });
  }
  // One dose, one coupon state → every number the receipts and ladder show.
  function quote(product, index, applied) {
    var d = product.doses[index];
    if (!d) return null;
    var m = product.membership || 0;
    var listTotal = d.list + m;
    return {
      label: d.label,
      list: d.list,
      promo: d.promo,
      membership: m,
      listTotal: listTotal,
      medicine: applied ? d.promo : d.list,
      due: applied ? d.promo : listTotal, // due today (first month)
      ongoing: applied ? d.promo + m : listTotal, // renews monthly
      pctOff: pctOff(d.promo, listTotal)
    };
  }
  function pctOff(promo, listTotal) {
    return Math.round((1 - promo / listTotal) * 100);
  }
  function applyCode(product, code) {
    if (!product.coupon || !code) return false;
    return String(code).trim().toUpperCase() === String(product.coupon.code).toUpperCase();
  }
  // Blank base stays blank (the CTA is intentionally unwired); otherwise the
  // reference's ?treatment=new|current&switch_dose=… params are set/cleared.
  function ctaHref(base, open, doseLabel) {
    if (!base) return "";
    var hash = "", path = base, query = "";
    var h = path.indexOf("#");
    if (h >= 0) { hash = path.slice(h); path = path.slice(0, h); }
    var q = path.indexOf("?");
    if (q >= 0) { query = path.slice(q + 1); path = path.slice(0, q); }
    var params = query ? query.split("&").filter(Boolean) : [];
    params = params.filter(function (p) { return !/^(treatment|switch_dose)=/.test(p); });
    params.push("treatment=" + (open ? "current" : "new"));
    if (open && doseLabel) params.push("switch_dose=" + encodeURIComponent(doseLabel).replace(/%20/g, "+"));
    return path + "?" + params.join("&") + hash;
  }

  var api = { money: money, fill: fill, quote: quote, pctOff: pctOff, applyCode: applyCode, ctaHref: ctaHref };
  root.ChimePdp = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  // ---- DOM ----------------------------------------------------------------
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduced = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var TICK = '<svg viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';

  function init() {
    var key = document.body.getAttribute("data-product");
    var P = root.CHIME_PDP && root.CHIME_PDP[key];
    if (!P) return;

    var state = { applied: !!(P.coupon && P.coupon.appliedByDefault), open: false, dose: 0, unknown: false, due: null };

    // Static substitutions
    $$("[data-pdp]").forEach(function (el) {
      var k = el.getAttribute("data-pdp");
      if (P[k] != null) el.textContent = P[k];
    });
    $$("[data-pdp-html]").forEach(function (el) {
      var path = el.getAttribute("data-pdp-html").split("."), v = P;
      path.forEach(function (p) { v = v && v[p]; });
      if (v != null) el.innerHTML = v;
    });

    // Select options
    var select = $("#swp-dose");
    if (select) {
      select.innerHTML = P.doses.map(function (d, i) { return '<option value="' + i + '">' + esc(d.label) + "</option>"; }).join("") +
        '<option value="unknown">' + esc(P.unknownDoseLabel) + "</option>";
      select.addEventListener("change", function () {
        state.unknown = select.value === "unknown";
        state.dose = state.unknown ? state.dose : Number(select.value);
        render(false);
      });
    }

    // FAQ + explore + ladder shells
    var faq = $('[data-pdp-slot="faq"]');
    if (faq) faq.innerHTML = P.faq.map(function (f) {
      return '<details class="faq"><summary>' + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>";
    }).join("");
    var explore = $('[data-pdp-slot="explore"]');
    if (explore) explore.innerHTML = P.explore.map(function (l) {
      var cur = l.href === P.page ? ' aria-current="page"' : "";
      return "<li><a" + cur + ' href="' + esc(l.href) + '">' + esc(l.label) + "</a></li>";
    }).join("");

    // ---- Renderers --------------------------------------------------------
    function rcptRow(lb, amt, cls) {
      return '<div class="rcpt-row' + (cls ? " " + cls : "") + '"><span class="lb">' + lb + '</span><span class="amt">' + amt + "</span></div>";
    }
    function renderIntro() {
      var el = $('[data-pdp-slot="rcpt-intro"]');
      if (!el) return;
      var q = quote(P, 0, state.applied), a = state.applied;
      el.innerHTML =
        rcptRow(esc(P.introMedicineLabel), (a ? "<del>" + money(q.list) + "</del>" : "") + "<span>" + money(q.medicine) + "</span>") +
        rcptRow(esc(P.membershipLabel), a ? "<del>" + money(q.membership) + '</del><span class="free">' + esc(P.freeLabel) + "</span>" : money(q.membership)) +
        rcptRow(esc(P.introTotalLabel) + (a ? '<span class="offpill">' + q.pctOff + "% OFF</span>" : ""),
          (a ? '<span class="strike done">' + money(q.listTotal) + "</span>" : "") + '<span class="n" data-roll>' + money(q.due) + "</span>", "total") +
        '<p class="rcpt-then">' + esc(fill(P.thenTemplate, { amount: money(q.ongoing) })) + "</p>";
    }
    function renderPanel() {
      var el = $('[data-pdp-slot="rcpt-panel"]');
      if (!el) return;
      var note = $('[data-pdp-slot="unknown-dose"]');
      if (note) note.hidden = !state.unknown;
      el.hidden = state.unknown;
      if (state.unknown) return;
      var q = quote(P, state.dose, state.applied), a = state.applied;
      el.setAttribute("aria-label", q.label + " switch pricing");
      el.innerHTML =
        rcptRow(esc(P.medicineLabel), (a ? "<del>" + money(q.list) + "</del>" : "") + "<span>" + money(q.medicine) + "</span>") +
        rcptRow(esc(P.membershipLabel), a ? "<del>" + money(q.membership) + '</del><span class="free">' + esc(P.freeLabel) + "</span>" : money(q.membership)) +
        rcptRow(esc(a ? P.panelDueLabel : P.panelMonthlyLabel) + (a ? '<span class="offpill">' + q.pctOff + "% OFF</span>" : ""),
          (a ? '<span class="strike done">' + money(q.listTotal) + "</span>" : "") + '<span class="n" data-roll>' + money(q.due) + "</span>", "total") +
        (a ? '<p class="rcpt-then">' + esc(fill(P.panelThenTemplate, { start: money(q.due), amount: money(q.ongoing) })) + "</p>" : "");
    }
    function renderLadder() {
      var el = $('[data-pdp-slot="ladder"]');
      if (!el) return;
      var L = P.ladder, a = state.applied;
      var rows = P.doses.map(function (_, i) {
        var q = quote(P, i, true);
        return a
          ? "<tr><td>" + esc(q.label) + "</td><td><del>" + money(q.list) + "</del>" + money(q.promo) + '</td><td class="hl"><del>' + money(q.listTotal) + "</del>" + money(q.ongoing) + "/mo</td></tr>"
          : "<tr><td>" + esc(q.label) + '</td><td class="hl">' + money(q.listTotal) + "/mo</td></tr>";
      }).join("");
      el.innerHTML = '<table class="lad"><thead><tr><th>' + esc(L.thDose) + "</th>" +
        (a ? "<th>" + esc(L.thMedicine) + '</th><th class="hl">' + esc(L.thWithDoctor) + "</th>" : '<th class="hl">' + esc(L.thMonthly) + "</th>") +
        "</tr></thead><tbody>" + rows + "</tbody></table>";
    }
    function syncCta() {
      var dose = state.open && !state.unknown ? P.doses[state.dose].label : null;
      $$("[data-pdp-cta]").forEach(function (a) {
        var href = ctaHref(P.cta.href, state.open, dose);
        if (href) a.setAttribute("href", href); else a.setAttribute("href", "#");
        var get = $("[data-cta-get]", a), sw = $("[data-cta-switch]", a);
        if (get) get.hidden = state.open;
        if (sw) sw.hidden = !state.open;
      });
    }
    function render(animate) {
      var prev = state.due;
      var a = state.applied;
      $$("[data-applied]").forEach(function (el) { el.hidden = !a; });
      $$("[data-unapplied]").forEach(function (el) { el.hidden = a; });
      renderIntro();
      renderPanel();
      renderLadder();
      syncCta();
      var intro = $('[data-pdp-slot="rcpt-intro"]');
      var q0 = quote(P, 0, a);
      var sticky = $("[data-sticky-price]");
      if (sticky) sticky.textContent = fill(P.stickyTemplate, { amount: money(q0.due) });
      var due = state.open && !state.unknown ? quote(P, state.dose, a).due : q0.due;
      var target = $(state.open && !state.unknown ? '[data-pdp-slot="rcpt-panel"] [data-roll]' : '[data-pdp-slot="rcpt-intro"] [data-roll]');
      if (animate && prev != null && prev !== due && !reduced && target) {
        rollTo(target, prev, due);
        if (due < prev) burst(target);
      }
      state.due = due;
      if (intro) intro.hidden = state.open;
    }
    function rollTo(el, from, to) {
      var started = performance.now(), duration = 600;
      (function step(now) {
        var p = Math.min(1, (now - started) / duration), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = money(Math.round(from + (to - from) * eased));
        if (p < 1) requestAnimationFrame(step);
      })(started);
    }
    function burst(anchor) {
      var rect = anchor.getBoundingClientRect();
      var canvas = document.createElement("canvas"), ratio = root.devicePixelRatio || 1;
      canvas.id = "burst";
      canvas.width = root.innerWidth * ratio; canvas.height = root.innerHeight * ratio;
      canvas.style.width = root.innerWidth + "px"; canvas.style.height = root.innerHeight + "px";
      document.body.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      if (!ctx) return canvas.remove();
      ctx.scale(ratio, ratio);
      var colors = ["#485e89", "#6580bc", "#bdd2f6", "#d98a6f", "#26354d"];
      var bits = [];
      for (var i = 0; i < 28; i++) {
        var angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.1, v = 4.5 + Math.random() * 5.5;
        bits.push({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
          w: 4 + Math.random() * 4, h: 6 + Math.random() * 5, r: Math.random() * Math.PI, s: (Math.random() - 0.5) * 0.35, c: colors[i % colors.length] });
      }
      var started = performance.now();
      (function frame(now) {
        var p = (now - started) / 900;
        ctx.clearRect(0, 0, root.innerWidth, root.innerHeight);
        if (p >= 1) return canvas.remove();
        ctx.globalAlpha = p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3;
        bits.forEach(function (b) {
          b.x += b.vx; b.y += b.vy; b.vy += 0.28; b.vx *= 0.99; b.r += b.s;
          ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
        });
        requestAnimationFrame(frame);
      })(started);
    }

    // ---- Switch door (dose-price) -----------------------------------------
    var door = $("#switch-door"), panel = $("#product-current-treatment");
    function setOpen(open) {
      state.open = open;
      if (panel) panel.hidden = !open;
      if (door) {
        door.setAttribute("aria-expanded", String(open));
        var l = $("[data-door-open]", door), b = $("[data-door-back]", door);
        if (l) l.hidden = open;
        if (b) b.hidden = !open;
      }
      render(false);
    }
    if (door) door.addEventListener("click", function () { setOpen(!state.open); });
    $$("[data-open-door]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (!state.open) setOpen(true);
        if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      });
    });

    // ---- Coupon (product-offer) -------------------------------------------
    var form = $("[data-coupon-form]"), toggle = $("[data-coupon-toggle]"), codeInput = $("[data-coupon-code]"), err = $("[data-coupon-error]");
    function closeCoupon() {
      if (form) form.hidden = true;
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      if (err) err.hidden = true;
    }
    if (toggle) toggle.addEventListener("click", function () {
      var open = form.hidden;
      form.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (err) err.hidden = true;
      if (open && codeInput) codeInput.focus();
    });
    function apply() {
      if (applyCode(P, codeInput && codeInput.value)) {
        state.applied = true;
        closeCoupon();
        render(true);
      } else if (err) {
        err.textContent = P.couponError;
        err.hidden = false;
      }
    }
    $$("[data-coupon-apply]").forEach(function (b) { b.addEventListener("click", apply); });
    if (codeInput) codeInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); apply(); } });
    $$("[data-coupon-remove]").forEach(function (b) {
      b.addEventListener("click", function () { state.applied = false; if (codeInput) codeInput.value = ""; closeCoupon(); render(true); });
    });

    // Blank CTA: no navigation, no jump to top
    $$("[data-pdp-cta]").forEach(function (a) {
      a.addEventListener("click", function (e) { if (a.getAttribute("href") === "#") e.preventDefault(); });
    });

    // ---- Sticky bar -------------------------------------------------------
    var sticky = $(".sticky-cta"), primary = $("#pdp-cta");
    if (sticky && primary && "IntersectionObserver" in root) {
      new IntersectionObserver(function (entries) {
        sticky.setAttribute("data-show", entries[0].isIntersecting ? "0" : "1");
      }, { rootMargin: "-70px 0px 0px 0px", threshold: 0.9 }).observe(primary);
    }

    // ---- Gallery ----------------------------------------------------------
    var frame = $(".frame"), video = frame && $("video", frame), image = frame && $("img", frame), thumbs = $$(".thumb");
    function show(i) {
      var t = thumbs[i];
      if (!t) return;
      thumbs.forEach(function (th, j) { th.setAttribute("data-on", j === i ? "1" : "0"); th.setAttribute("aria-pressed", String(j === i)); });
      var d = t.dataset;
      if (d.type === "video") {
        image.hidden = true;
        video.hidden = false;
        if (video.getAttribute("src") !== d.source) video.src = d.source;
        video.poster = d.poster || "";
        video.style.objectPosition = d.position || "center";
        video.dataset.fit = d.fit || "cover";
        if (!reduced) video.play().catch(function () {});
      } else {
        video.pause();
        video.hidden = true;
        image.src = d.source;
        image.alt = d.alt || "";
        image.style.objectPosition = d.position || "center";
        image.dataset.fit = d.fit || "cover";
        image.hidden = false;
      }
    }
    thumbs.forEach(function (t, i) { t.addEventListener("click", function () { show(i); }); });
    if (video && !video.hidden && !reduced) video.play().catch(function () {});

    // ---- Film -------------------------------------------------------------
    var film = $(".film"), fv = film && $("video", film), ft = film && $(".film-toggle", film), userPaused = false;
    if (film && fv && ft) {
      var setToggle = function (playing) {
        ft.setAttribute("aria-pressed", String(playing));
        ft.setAttribute("aria-label", playing ? ft.dataset.pauseLabel : ft.dataset.playLabel);
        var svgs = $$("svg", ft);
        svgs[0].hidden = !playing; svgs[1].hidden = playing;
      };
      var ensureSrc = function () { if (!fv.getAttribute("src")) fv.src = film.dataset.src; };
      fv.addEventListener("play", function () { setToggle(true); });
      fv.addEventListener("pause", function () { setToggle(false); });
      setToggle(false);
      ft.addEventListener("click", function () {
        if (fv.paused) { userPaused = false; ensureSrc(); fv.play().catch(function () {}); }
        else { userPaused = true; fv.pause(); }
      });
      if (!reduced && "IntersectionObserver" in root) {
        new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { ensureSrc(); if (!userPaused) fv.play().catch(function () {}); }
          else fv.pause();
        }, { threshold: 0.25 }).observe(film);
      }
    }

    // ---- Header menu ------------------------------------------------------
    var navToggle = $(".nav-toggle"), menu = $(".nav-primary");
    if (navToggle && menu) {
      var setMenu = function (open) {
        menu.setAttribute("data-collapsed", String(!open));
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      navToggle.addEventListener("click", function () { setMenu(menu.getAttribute("data-collapsed") === "true"); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.getAttribute("data-collapsed") !== "true") { setMenu(false); navToggle.focus(); }
      });
    }

    // ---- Helix draw-in ----------------------------------------------------
    var helix = $(".solo-ico");
    if (helix) {
      if (reduced || !("IntersectionObserver" in root)) helix.classList.add("hx-static");
      else {
        $$(".hx-draw", helix).forEach(function (p) {
          var len = 100;
          try { len = p.getTotalLength(); } catch (e) {}
          p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        });
        helix.classList.add("hx-armed");
        var ho = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { helix.classList.add("hx-play"); ho.disconnect(); }
        }, { threshold: 0.4 });
        ho.observe(helix);
      }
    }

    // ---- Statement parallax (pointer: fine only) --------------------------
    var stmt = $(".stmt");
    if (stmt && !reduced && root.matchMedia && root.matchMedia("(pointer: fine)").matches) {
      stmt.addEventListener("pointermove", function (e) {
        var r = stmt.getBoundingClientRect();
        stmt.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        stmt.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
      stmt.addEventListener("pointerleave", function () { stmt.style.setProperty("--px", "0"); stmt.style.setProperty("--py", "0"); });
    }

    // ---- Reveal (stagger 90 ms, threshold .12) ----------------------------
    var reveals = $$(".reveal");
    if (reveals.length) {
      if (reduced || !("IntersectionObserver" in root)) reveals.forEach(function (el) { el.classList.add("is-in"); });
      else {
        var ro = new IntersectionObserver(function (entries) {
          // Already scrolled past (deep link, restored scroll): show at once.
          entries.filter(function (e) { return !e.isIntersecting && e.boundingClientRect.bottom < 0; })
            .forEach(function (e) { ro.unobserve(e.target); e.target.classList.add("is-in"); });
          entries.filter(function (e) { return e.isIntersecting; }).forEach(function (e, i) {
            ro.unobserve(e.target);
            setTimeout(function () { e.target.classList.add("is-in"); }, i * 90);
          });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { ro.observe(el); });
      }
    }

    // ---- First paint ------------------------------------------------------
    render(false);
    if (location.hash === "#switch-door") setOpen(true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(typeof window !== "undefined" ? window : this);
