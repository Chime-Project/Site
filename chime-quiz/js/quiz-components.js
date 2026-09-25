/* Chime Health quiz (chime-quiz/): the three screens their quiz draws with React components, rebuilt in vanilla JS
   with their markup, classes, images and motion (framer-motion values: durations, delays, "easeOut"):
   · StatsContent        "Proven Results": 94.6% / 91% / $0 cards that count up (warranty → Chime Health's)
   · OutcomesContent     "58% better results": the two columns, the Forbes laurel, the counters
   · GeographicHeroMapV2 "We deliver to {state}": the US map zoomed on the chosen state, drawn like react-simple-maps
                         (geoAlbersUsa, scale 1000, 800×600) from their topology, with the clinicians and products
   Branding: "Remedy" → "Chime Health" in the copy; their Terms link → Chime's terms page. Claims kept as theirs. */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // framer-motion "easeOut" = cubic-bezier(0, 0, 0.58, 1)
  var EASE_OUT = "cubic-bezier(0, 0, 0.58, 1)";
  function bezierY(t) { // y(t) for cubic-bezier(0,0,.58,1), solved on x
    var x1 = 0, x2 = 0.58, lo = 0, hi = 1, s = t;
    for (var i = 0; i < 24; i++) {
      s = (lo + hi) / 2;
      var x = 3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s;
      if (x < t) lo = s; else hi = s;
    }
    return 3 * (1 - s) * s * s * 1 + s * s * s; // y1 = 0, y2 = 1
  }
  function countUp(el, from, to, dur, delay, fmt) {
    if (REDUCED) { el.textContent = fmt(to); return; }
    el.textContent = fmt(from);
    var start = null;
    function tick(ts) {
      if (start === null) start = ts + delay * 1000;
      var t = Math.min(1, Math.max(0, (ts - start) / (dur * 1000)));
      el.textContent = fmt(from + (to - from) * bezierY(t));
      if (t < 1 && el.isConnected) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function enter(el, from, dur, delay, ease) {
    if (REDUCED || !el.animate) return;
    el.animate([from, { opacity: 1, transform: "none" }], { duration: dur * 1000, delay: delay * 1000, easing: ease || EASE_OUT, fill: "backwards" });
  }

  var LUCIDE = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  var STATS = [
    { label: "Members See Results", icon: '<svg ' + LUCIDE + ' class="lucide lucide-chart-bar-decreasing size-6 text-gray-400 quiz-factor:text-stone-400" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M7 11h8"></path><path d="M7 16h3"></path><path d="M7 6h12"></path></svg>',
      unit: "%", description: "of members lose at least 5% of their body weight.", from: 0, to: 94.6, decimals: 1, prefix: "" },
    { label: "Members Stay", icon: '<svg ' + LUCIDE + ' class="lucide lucide-users-round size-6 text-gray-400 quiz-factor:text-stone-400" aria-hidden="true"><path d="M18 21a8 8 0 0 0-16 0"></path><circle cx="10" cy="8" r="5"></circle><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path></svg>',
      unit: "%", description: "of members stay past 90 days.", from: 0, to: 91, decimals: 0, prefix: "" },
    { label: "Risk-Free", icon: '<svg ' + LUCIDE + ' class="lucide lucide-badge-dollar-sign size-6 text-gray-400 quiz-factor:text-stone-400" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>',
      unit: "", description: 'if it doesn\'t work for you, you\'re covered by the Chime Health Weight Loss Warranty. <a target="_blank" rel="noopener noreferrer" class="underline" href="../terms-conditions.html">Terms</a> apply.',
      from: 299, to: 0, decimals: 0, prefix: "$" }
  ];
  function statsHtml() {
    return '<div class="flex flex-col gap-4">' + STATS.map(function (s, i) {
      return '<div class="rounded-2xl px-6 py-4 bg-white shadow-box-sm quiz-factor:bg-beige-50 quiz-factor:shadow-none quiz-factor:border quiz-factor:border-stone-200">' +
        '<div class="flex items-center gap-2 justify-between"><span class="text-sm font-medium tracking-wider uppercase text-gray-700 quiz-factor:text-stone-700">' + s.label + "</span>" + s.icon + "</div>" +
        '<div class="flex items-baseline gap-0.5"><span class="text-[40px] font-semibold tracking-tight text-gray-900 quiz-factor:text-stone-900"><span data-chime-count="' + i + '">' + s.prefix + s.to.toFixed(s.decimals) + "</span></span>" +
        (s.unit ? '<span class="text-2xl font-medium text-gray-900 quiz-factor:text-stone-900">' + s.unit + "</span>" : "") + "</div>" +
        '<p class="text-sm leading-5 mt-1 text-gray-600 quiz-factor:text-stone-600">' + s.description + "</p></div>";
    }).join("") + "</div>";
  }
  function statsMount(el) {
    Array.prototype.forEach.call(el.querySelectorAll("[data-chime-count]"), function (n) {
      var s = STATS[+n.getAttribute("data-chime-count")];
      n.removeAttribute("data-chime-count");
      countUp(n, s.from, s.to, 1.2, 0.2 + 0.15 * STATS.indexOf(s), function (v) { return s.prefix + v.toFixed(s.decimals); });
    });
  }

  function outcomesColumn(lbs, color) {
    return '<div class="px-4"><p class="text-sm ' + color + '">up to</p><div class="flex items-baseline gap-0.5 ' + color + '">' +
      '<span class="text-[42px] font-bold tracking-tight leading-none"><span data-chime-lbs="' + lbs + '">' + lbs + "</span></span>" +
      '<span class="text-sm font-semibold">lbs</span></div></div>';
  }
  function outcomesHtml() {
    return '<div class="font-sans space-y-4"><h1 class="text-[28px] text-[#3F3F3F] font-medium tracking-tight mb-5"><span class="font-semibold">58% better results</span> than standard GLP-1 alone — clinically backed.</h1>' +
      '<div class="rounded-3xl bg-gradient-to-b from-brands-rm-primary-400 to-brands-rm-primary-200 p-6 pb-0 overflow-hidden"><div class="grid grid-cols-[124px_100px] gap-6 justify-center">' +
      '<div class="flex flex-col gap-4"><img alt="Forbes #1 Weight Loss Program 2025 | 2026" class="h-16 object-contain" src="images/forbes-laurel.webp" style="opacity: 1; transform: none;" data-chime-enter="laurel">' +
      '<div class="rounded-2xl bg-gradient-to-b from-brands-rm-primary-500 to-brands-rm-primary-400 pt-1.5 pb-4 -mb-1.5" style="opacity: 1; transform: none;" data-chime-enter="card">' +
      '<img alt="Chime Health treatment plan" class="w-full object-contain" src="images/outcomes-collage.webp" style="opacity: 1;" data-chime-enter="img">' +
      outcomesColumn(40, "text-white") + "</div></div>" +
      '<div class="flex flex-col gap-2 justify-end"><p class="text-sm text-gray-700 text-center leading-tight" style="opacity: 1;" data-chime-enter="label">GLP-1 Meds<span class="block">(only)</span></p>' +
      '<div class="rounded-2xl bg-slate-200 pt-0.5 pb-4 w-full -mb-1.5" style="opacity: 1; transform: none;" data-chime-enter="card">' +
      '<img alt="GLP-1 medication" class="w-full object-contain" src="images/glp1-syringe.webp" style="opacity: 1;" data-chime-enter="img">' +
      outcomesColumn(24, "text-gray-700") + "</div></div></div></div>" +
      '<p class="text-[10px] text-gray-500 leading-relaxed">Results are based on self-reported data from ~300,000 Chime Health members on personalized treatment plans, including compounded GLP-1 medications and clinician consultations. Members reported their weight on their initial medical intake questionnaire and every 3-4 weeks thereafter. Individual results may vary. Stats compared to outcomes reported for GLP-1 medications alone in Rodriguez P., et al. (2024). "Semaglutide vs Tirzepatide for Weight Loss in Adults with Overweight or Obesity," JAMA Internal Medicine.</p></div>';
  }
  function outcomesMount(el) {
    var M = {
      laurel: [{ opacity: 0, transform: "scale(0.85)" }, 0.4, 1.2],
      card: [{ opacity: 0, transform: "translateY(100%)" }, 0.8, 0.4],
      img: [{ opacity: 0 }, 0.3, 0.6],
      label: [{ opacity: 0 }, 0.4, 1.2]
    };
    Array.prototype.forEach.call(el.querySelectorAll("[data-chime-enter]"), function (n) {
      var m = M[n.getAttribute("data-chime-enter")]; n.removeAttribute("data-chime-enter");
      enter(n, m[0], m[1], m[2]);
    });
    Array.prototype.forEach.call(el.querySelectorAll("[data-chime-lbs]"), function (n) {
      var to = +n.getAttribute("data-chime-lbs"); n.removeAttribute("data-chime-lbs");
      countUp(n, 0, to, 1, 0.8, function (v) { return String(Math.round(v)); });
    });
  }

  // ---- the map
  var MAP_SKELETON = '<div class="animate-pulse bg-neutral-200 aspect-video w-full h-full"></div>';
  var ZOOM = { "US-RI": 1.5, "US-DE": 1.3, "US-CT": 1.2, "US-NJ": 1.1, "US-NH": 1.1, "US-VT": 1.1, "US-MA": 1.1, "US-MD": 1.1 };
  var topoPromise = null;
  function loadTopo() {
    if (!topoPromise) topoPromise = fetch("data/usa-topo.json").then(function (r) {
      if (!r.ok) throw new Error("Failed to load geography"); return r.json();
    }).then(function (t) {
      var k = Object.keys(t.objects)[0], f = window.topojson.feature(t, t.objects[k]);
      return f.features || [f];
    });
    return topoPromise;
  }
  function stateCode(answers) {
    var s = null;
    if (typeof answers.address === "string") { try { var a = JSON.parse(answers.address); if (a && a.state) s = String(a.state).trim().toUpperCase(); } catch (e) {} }
    if (!s && typeof answers.location === "string") s = answers.location.trim().toUpperCase() || null;
    return s ? "US-" + s : null;
  }
  function mapSvg(features, code) {
    var d3 = window.d3;
    var proj = d3.geoAlbersUsa().scale(1000).translate([400, 300]), path = d3.geoPath().projection(proj);
    var v = d3.geoAlbersUsa().scale(1000);
    function ok(c) { try { return c && c.length === 2 && !c.some(isNaN) && v(c) !== null; } catch (e) { return false; } }
    var feat = features.filter(function (f) { return f.properties && f.properties.ISO_1 === code; })[0];
    if (!feat) return null;
    var mobile = !window.matchMedia("(min-width: 640px)").matches, tablet = !window.matchMedia("(min-width: 1024px)").matches;
    var w = mobile ? 400 : tablet ? 800 : 1200, h = mobile ? 300 : tablet ? 500 : 600;
    var g = d3.geoCentroid(feat);
    if (!ok(g)) return null;
    var b = d3.geoPath().projection(v).bounds(feat), bw = Math.abs(b[1][0] - b[0][0]), bh = Math.abs(b[1][1] - b[0][1]);
    if (bw <= 0 || bh <= 0) return null;
    var scale = Math.max(1, Math.min(Math.min(0.6 * w / bw, 0.6 * h / bh), 5));
    var k = Math.max(1, Math.min(scale * (ZOOM[code] || 1), 4));
    var off = mobile ? { x: 0.15, y: -0.1 } : tablet ? { x: 0.1, y: -0.05 } : { x: 0, y: 0 }, a = 10 / k;
    var center = [g[0] + off.x * a, g[1] + off.y * a];
    if (!ok(center)) center = g;
    var c = proj(center), m = proj(g), sw = Math.max(0.5, 2 / k);
    var geos = features.map(function (f) {
      return '<path tabindex="0" class="rsm-geography " d="' + path(f) + '" fill="' +
        (f.properties.ISO_1 === code ? "url(#selectedStateGradient)" : "#E5E5E5") + '" stroke="#FFFFFF" stroke-width="' + sw + '"></path>';
    }).join("");
    function marker(href, iw, ih, ox, oy) {
      return '<g transform="translate(' + m[0] + ", " + m[1] + ')" class="rsm-marker "><g transform="scale(' + (1 / k) + ") translate(" + ox + ", " + oy + ')">' +
        '<image href="' + href + '" width="' + iw + '" height="' + ih + '"></image></g></g>';
    }
    return '<div class="pointer-events-none overflow-hidden bg-neutral-50 w-full h-full"><svg viewBox="0 0 800 600" class="rsm-svg w-full h-full max-h-[758px] aspect-video">' +
      '<defs><linearGradient id="selectedStateGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="8.5%" stop-color="#B1BFF6"></stop><stop offset="99.91%" stop-color="#647EEB"></stop></linearGradient></defs>' +
      '<g><rect width="800" height="600" fill="transparent"></rect><g transform="translate(' + (400 - c[0] * k) + " " + (300 - c[1] * k) + ") scale(" + k + ')" class="rsm-zoomable-group ">' +
      '<g class="rsm-geographies ">' + geos + "</g>" +
      marker("images/map-doctors.webp", 600, 150, -300, -220) + marker("images/map-products.webp", 870, 244, -435, 50) +
      "</g></g></svg></div>";
  }
  function mapMount(el, S) {
    var code = stateCode(S.answers);
    function draw() {
      loadTopo().then(function (features) {
        if (!el.isConnected) return;
        var html = mapSvg(features, code);
        if (html) el.innerHTML = html;
      }).catch(function () {});
    }
    draw();
    var t;
    window.addEventListener("resize", function onResize() {
      if (!el.isConnected) { window.removeEventListener("resize", onResize); return; }
      clearTimeout(t); t = setTimeout(draw, 150);
    });
  }

  var HTML = { StatsContent: statsHtml, OutcomesContent: outcomesHtml, GeographicHeroMapV2: function () { return MAP_SKELETON; } };
  var MOUNT = { StatsContent: statsMount, OutcomesContent: outcomesMount, GeographicHeroMapV2: mapMount };

  window.ChimeQuizComponents = {
    render: function (id, props, S) {
      if (id === "GeographicHeroMapV2" && !stateCode(S.answers)) return null;
      return HTML[id] ? HTML[id](props, S) : null;
    },
    mount: function (el, S) {
      var id = el.getAttribute("data-chime-component");
      if (id && MOUNT[id]) MOUNT[id](el, S);
    }
  };
})();
