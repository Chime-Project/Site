/* Chime Health intake engine — screening → great fit → medical profile on one page, like the reference.
   A vanilla port of the reference's React intake: same markup and classes (their css/intake.css), same show/hide
   rules, DQ check, validation + scroll-to-error, auto-scroll to the next unanswered question, progress bar,
   step transition phases and phone mask. Differences, on purpose:
   - nothing is sent: their check-email / intake-form / tracking calls are gone; "See my plan options" waits a beat
     and opens ../recommendation/ with the answers in sessionStorage (theirs: localStorage + their backend);
   - the Trustpilot "Read Verified Reviews" buttons do nothing (theirs open their Trustpilot widget). */
(function () {
  "use strict";
  var C = window.CHIME_INTAKE;
  var app = document.getElementById("app");
  var RECOMMENDATION_URL = "recommendation/";

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function P(v) { return v == null ? "" : String(v); }
  var R = window.CHIME_INTAKE_RULES;
  var clampNum = R.clampNum, weightOk = R.weightOk, goalError = R.goalError, phoneDigits = R.phoneDigits, phoneOk = R.phoneOk,
      maskPhone = R.maskPhone, dobString = R.dobString, ageFrom = R.ageFrom, blockError = R.blockError, stepErrors = R.stepErrors;

  // ---------- state ----------
  var S = { answers: {}, index: 0, phase: "idle", attempted: false, focusField: null, dq: false,
            consentError: false, shake: 0, checking: false, oneMoment: false, rolled: false };
  var store = window.sessionStorage;
  try {
    var saved = JSON.parse(store.getItem(C.PROGRESS_KEY) || "null");
    if (saved && typeof saved === "object") {
      if (saved.answers && typeof saved.answers === "object") S.answers = saved.answers;
      var si = C.FLOW.findIndex(function (s) { return s.id === saved.stepId; });
      if (si > 0) S.index = si;
    }
  } catch (e) { /* storage blocked: start fresh */ }
  function save() {
    try { var a = Object.assign({}, S.answers); delete a.sms_optin; store.setItem(C.PROGRESS_KEY, JSON.stringify({ answers: a, stepId: step().id })); } catch (e) {}
  }
  function step() { return C.FLOW[Math.min(S.index, C.FLOW.length - 1)]; }

  // ---------- markup (their components) ----------
  var SVG_CHECK16 = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 5"></path></svg>';
  var CHEVRON = '<svg class="f9-statesel-chevron" viewBox="0 0 512 512" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>';
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var BMI_BANDS = [0, 18.5, 25, 30, 40];
  var BMI_COPY = [
    { title: "Your BMI indicates you are underweight", copy: "Your provider will review your height and weight before recommending any treatment." },
    { title: "Your BMI is in the healthy range", copy: "Your provider will review your answers and your goals before recommending any treatment." },
    { title: "Your BMI indicates you are overweight", copy: "This is not about willpower. Hormones, brain chemistry, and metabolism all play a major role in weight regulation." },
    { title: "Your BMI indicates obesity", copy: "This is a medical condition, not a personal failure. Hormones, brain chemistry, and metabolism all play a major role in weight regulation." }
  ];

  function bmiCard(bmi) {
    var i = BMI_BANDS.slice(1).findIndex(function (x) { return bmi < x; });
    var t = BMI_COPY[i === -1 ? BMI_COPY.length - 1 : i];
    var segs = BMI_BANDS.slice(0, -1).map(function (lo, k) {
      var f = Math.min(1, Math.max(0, (bmi - lo) / (BMI_BANDS[k + 1] - lo)));
      return '<span class="f9-bmi__seg"><span class="f9-bmi__fill" style="width:' + (100 * f) + '%"></span></span>';
    }).join("");
    var body = bmi < 20
      ? '<div class="f9-bmi__block" role="alert"><span class="f9-bmi__block-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></span><p class="f9-bmi__block-title">Your BMI is too low to qualify for GLP-1 treatment</p><p class="f9-bmi__block-copy">If you entered your height or weight incorrectly above, please correct it so we can continue your intake.</p></div>'
      : '<div class="f9-bmi__body"><p class="f9-bmi__title">' + esc(t.title) + '</p><p class="f9-bmi__copy">' + esc(t.copy) + '</p></div>';
    return '<div class="f9-bmi"><div class="f9-bmi__head"><div class="f9-bmi__row"><span>Your BMI</span><span>' + bmi.toFixed(1) + '</span></div><div class="f9-bmi__meter" aria-hidden="true">' + segs + '</div></div>' + body + '</div>';
  }
  function note(html) { return '<div class="f9-note"><span class="f9-note__icon" aria-hidden="true">' + SVG_CHECK16 + '</span><p class="f9-note__copy">' + html + '</p></div>'; }
  function dqAlert() {
    return '<div class="f9-alert" role="alert"><svg class="f9-alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4M12 17h.01"></path></svg><p>This answer might disqualify you from treatment. If you made a mistake, please correct it above to continue with your intake.</p></div>';
  }
  var INFO = {
    contraception: '<div class="f9-info"><span class="f9-info__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-5M12 8h.01"></path></svg></span><p class="f9-info__copy">Please note that we strongly recommend that you use an effective method of contraception during treatment with a GLP-1 medication and for at least <strong>2 months thereafter</strong>. For those taking <strong>Tirzepatide</strong>, we recommend switching to a non-oral contraceptive method or adding a barrier method of contraception for four weeks after initiation and for four weeks after each dose escalation.</p></div>'
  };
  function section(id, q, sub, error, body) {
    return '<section class="f9-q" id="' + id + '"' + (error ? ' data-invalid="true"' : "") + '><h2 class="f9-q__title">' + esc(q) + '</h2>' +
      (sub ? '<p class="f9-q__sub">' + esc(sub) + '</p>' : "") + '<div class="f9-q__body">' + body + '</div>' +
      (error ? '<p class="f9-q__error" role="alert">' + esc(error) + '</p>' : "") + '</section>';
  }
  function field(o) {
    return '<div class="f9-field">' + (o.label ? '<label class="f9-field__label" for="' + o.id + '">' + esc(o.label) + '</label>' : "") +
      '<div class="f9-field__control"><input id="' + o.id + '" class="f9-input" type="' + (o.type || "text") + '" value="' + esc(o.value) + '"' +
      (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : "") + (o.inputMode ? ' inputmode="' + o.inputMode + '"' : "") +
      (o.autoComplete ? ' autocomplete="' + o.autoComplete + '"' : "") + (o.name ? ' name="' + o.name + '"' : "") +
      (o.suppress ? ' data-1p-ignore="true" data-lpignore="true"' : "") + (o.invalid ? ' aria-invalid="true"' : "") +
      ' data-f="' + o.f + '"></div></div>';
  }
  function select(o) {
    var opts = '<option value="">' + esc(o.placeholder || "Select…") + '</option>' + o.options.map(function (x) {
      return '<option value="' + esc(x.value) + '"' + (String(x.value) === o.value ? " selected" : "") + '>' + esc(x.label) + '</option>';
    }).join("");
    return '<div class="f9-field"><label class="f9-field__label" for="' + o.id + '">' + esc(o.label) + '</label><div class="f9-field__control f9-field__control--select"><select id="' + o.id + '" class="f9-input f9-select"' + (o.invalid ? ' aria-invalid="true"' : "") + ' data-f="' + o.f + '">' + opts + '</select><span class="f9-select__chevron" aria-hidden="true"></span></div></div>';
  }
  function optIcon(kind) {
    var svg = kind === "female"
      ? '<svg viewBox="0 0 64 96" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><circle cx="32" cy="26" r="21"></circle><path d="M32 47v41"></path><path d="M17 73h30"></path></svg>'
      : '<svg viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="34" cy="62" r="21"></circle><path d="M50 46 84 12"></path><path d="M60 12h24v24"></path></svg>';
    return '<span class="f9-opt__icon" aria-hidden="true">' + svg + '</span>';
  }
  function radios(name, options, value) {
    var variant = options.some(function (o) { return o.icon; }) ? "cards" : options.length === 2 ? "grid" : "list";
    return '<div class="f9-opts f9-opts--' + variant + '" role="radiogroup" aria-label="' + name + '">' + options.map(function (o) {
      var on = value === o.value;
      return '<label class="f9-opt f9-opt--' + variant + '"' + (on ? ' data-selected="true"' : "") + '><input class="f9-opt__input" type="radio" name="' + name + '" value="' + esc(o.value) + '"' + (on ? " checked" : "") + ' data-f="' + name + '">' +
        (o.icon ? optIcon(o.icon) : "") + '<span class="f9-opt__label">' + esc(o.label) + '</span>' + (variant === "list" ? '<span class="f9-opt__mark" aria-hidden="true"></span>' : "") + '</label>';
    }).join("") + '</div>';
  }
  function checks(name, options, values, none) {
    return '<div class="f9-opts f9-opts--check">' + options.map(function (o) {
      var on = values.indexOf(o.value) > -1;
      return '<label class="f9-opt f9-opt--check"' + (on ? ' data-selected="true"' : "") + '><input class="f9-opt__input" type="checkbox" name="' + name + '[]" value="' + esc(o.value) + '"' + (on ? " checked" : "") + ' data-multi="' + name + '" data-none="' + none + '"><span class="f9-opt__box" aria-hidden="true"></span><span class="f9-opt__label">' + esc(o.label) + '</span></label>';
    }).join("") + '</div>';
  }
  var stateOpen = false, stateQuery = "";
  function statePicker(value) {
    var cur = C.STATES.find(function (s) { return s.code === value; });
    var q = stateQuery.trim().toLowerCase();
    var list = q ? C.STATES.filter(function (s) { return s.name.toLowerCase().indexOf(q) > -1 || s.code.toLowerCase().indexOf(q) === 0; }) : C.STATES;
    var panel = stateOpen ? '<div class="f9-statesel-panel"><input class="f9-statesel-search" type="text" inputmode="search" placeholder="Search states…" value="' + esc(stateQuery) + '"><div class="f9-statesel-list" role="listbox">' +
      (list.length ? list.map(function (s) { var on = s.code === value; return '<button type="button" role="option" aria-selected="' + on + '" class="' + (on ? "f9-statesel-option selected" : "f9-statesel-option") + '" data-state="' + s.code + '">' + esc(s.name) + '</button>'; }).join("")
        : '<div class="f9-statesel-empty">No matches</div>') + '</div></div>' : "";
    return '<div class="f9-statesel"><button type="button" id="f9-state" class="f9-input f9-statesel-trigger"' + (cur ? "" : ' data-empty="true"') + ' aria-haspopup="listbox" aria-expanded="' + stateOpen + '"><span class="f9-statesel-value">' + (cur ? esc(cur.name) : "Select…") + '</span></button>' + CHEVRON + panel + '</div>';
  }

  function screening(st, a, errs) {
    var bmi = C.computeBmi(a);
    var w = Number(a.weight), g = Number(a.goal_weight);
    var lose = w > 0 && g > 0 && goalError(g, w) === null ? Math.round(w - g) : null;
    var stateName = (P(a.state) && (C.STATES.find(function (s) { return s.code === P(a.state); }) || {}).name) || null;
    var years = []; for (var y = new Date().getFullYear() - 18; y >= 1920; y--) years.push({ value: String(y), label: String(y) });
    var days = []; for (var d = 1; d <= 31; d++) days.push({ value: String(d), label: String(d) });
    return '<div class="f9-screening">' + C.visibleBlocks(st.blocks, a).map(function (b) {
      var e = errs[b.field || b.id] || null;
      switch (b.kind) {
        case "measurements":
          return section(b.id, b.q, b.sub, bmi !== null && bmi < 20 ? null : e,
            '<div class="f9-grid f9-grid--2">' +
            select({ id: "f9-feet", f: "feet", label: "Feet", placeholder: "Select feet", value: P(a.feet), invalid: !!e && !a.feet,
              options: [4, 5, 6, 7].map(function (n) { return { value: String(n), label: n + "'" }; }) }) +
            select({ id: "f9-inches", f: "inches", label: "Inches", placeholder: "Select inches", value: P(a.inches), invalid: !!e && (a.inches === undefined || a.inches === ""),
              options: Array.from({ length: 12 }, function (_, n) { return { value: String(n), label: n + '"' }; }) }) +
            '</div><div class="f9-stack">' + field({ id: "f9-weight", f: "weight", label: "Weight (in lbs)", value: P(a.weight), placeholder: "250", inputMode: "numeric", invalid: !!e && !weightOk(a) }) + '</div>' +
            (bmi ? bmiCard(bmi) : ""));
        case "goal-weight": {
          var ge = goalError(a.goal_weight, a.weight);
          return section(b.id, b.q, b.sub, ge || e,
            field({ id: "f9-goal-weight", f: "goal_weight", label: "Goal weight (in lbs)", value: P(a.goal_weight), placeholder: "155", inputMode: "numeric", invalid: !!(ge || e) }) +
            (lose ? note('Losing <strong class="f9-note__value">' + lose + " " + (lose === 1 ? "lb" : "lbs") + '</strong> is a great goal that we can help you achieve.') : ""));
        }
        case "state":
          return section(b.id, b.q, b.sub, e, statePicker(P(a.state)) +
            (stateName ? note('Great News — We have Provider Coverage &amp; Pharmacies Shipping to <strong class="f9-note__value">' + esc(stateName) + '</strong>') : ""));
        case "dob":
          return section(b.id, b.q, b.sub, e, '<div class="f9-grid f9-grid--2">' +
            select({ id: "f9-dob-month", f: "dob_month", label: "Month", placeholder: "Select a month…", value: P(a.dob_month), invalid: !!e && !a.dob_month,
              options: MONTHS.map(function (m, i) { return { value: String(i + 1), label: m }; }) }) +
            select({ id: "f9-dob-day", f: "dob_day", label: "Day", placeholder: "Select a day…", value: P(a.dob_day), invalid: !!e && !a.dob_day, options: days }) +
            '</div><div class="f9-stack">' + select({ id: "f9-dob-year", f: "dob_year", label: "Year", placeholder: "Select a year…", value: P(a.dob_year), invalid: !!e && !a.dob_year, options: years }) + '</div>');
        case "choice":
          return section(b.id, b.q, b.sub, e, radios(b.field, b.options, a[b.field]) + (C.isDisqualifying(b.field, a) ? dqAlert() : ""));
        case "multi":
          return section(b.id, b.q, b.sub, e, checks(b.field, b.options, Array.isArray(a[b.field]) ? a[b.field] : [], b.noneValue) +
            (b.info && b.infoIf && b.infoIf(a) ? INFO[b.info] : "") + (C.isDisqualifying(b.field, a) ? dqAlert() : ""));
        case "details":
          return section(b.id, b.q, null, e, '<textarea id="f9-' + b.id + '" class="f9-textarea" rows="3" placeholder="' + esc(b.placeholder || "Add any detail your provider should know") + '" data-f="' + b.field + '">' + esc(P(a[b.field])) + '</textarea>');
        default: return "";
      }
    }).join("") + '</div>';
  }

  // Great fit showcase
  var RESULTS = "images/";
  var STEPS_NEXT = [
    { title: "Choose Your GLP-1 Plan & Lock In Your Price", body: "Pick the medication and package that fits your goals and budget, and check out in seconds. One flat price, locked at every dose." },
    { title: "Complete Your Quick Medical Assessment", body: "A short online visit reviewed by a US-licensed provider — no appointments, no waiting rooms. Prescribed in as fast as 4 hours. Not approved? You're fully refunded." },
    { title: "Your Meds, Delivered Fast", body: "Shipped overnight in temperature-controlled cold packs from US pharmacies. Provider visits and 24/7 support included — always free." }
  ];
  var BENEFITS = [
    ["💵", "One flat monthly rate — your price never increases as your dose goes up"], ["🇺🇸", "US-licensed providers & US pharmacies"],
    ["⚡", "Prescribed online in as fast as 4 hours"], ["📦", "Free overnight cold-pack shipping"],
    ["🩺", "All provider visits included — no visit fees, no membership fees"], ["💬", "24/7 support for your entire journey"], ["❌", "Cancel anytime — no contracts"]
  ];
  // Their checkout testimonials (names and words theirs; the faces are Chime stand-ins)
  var REVIEWS = [
    { title: "GLP-1 gave me my life back", body: "I have been using GLP-1 for a year and a half and have lost 79 pounds so far. My BMI was 39.9. Now my BMI is 27.3. GLP-1 gave me my life back.", author: "Ariane B.", date: "13 Aug, 2023", image: "images/avatar-ariane.webp" },
    { title: "GLP-1 medication has been my greatest asset", body: "I am down 52lbs and feel a weight has been lifted off my shoulders. It's been an incredible journey, and my only regret is not starting sooner.", author: "Claudia C.", date: "3 Jan, 2024", image: "images/avatar-kat.webp" },
    { title: "Thank you GLP-1!", body: "I could never get rid of the excess weight. I even got lipo, but nothing worked. I then started GLP-1 and lost 28 lbs within the first year.", author: "Kat R.", date: "23 May, 2025", image: "images/avatar-claudia.webp" }
  ];
  var LANES = {
    left: [{ review: 0 }, { shot: "member-1" }, { review: 1 }, { shot: "member-5" }, { review: 2 }, { shot: "member-3" }],
    right: [{ review: 0 }, { shot: "member-4" }, { review: 1 }, { shot: "member-2" }, { review: 2 }, { shot: "member-6" }]
  };
  var STAR = '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m10 1.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8Z"></path></svg>';
  var TP_BTN = '<button type="button" class="f9-sc-tp__btn"><span>Read <strong>Verified</strong> Reviews</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg></button>';
  function review(r) {
    // §4c: the title leads the card; their header (avatar, name, badge, star rating) moves below it.
    return '<article class="f9-sc-rev"><h3 class="f9-sc-rev__title">' + esc(r.title) + '</h3><header class="f9-sc-rev__head"><img class="f9-sc-rev__avatar" alt="" width="42" height="42" src="' + r.image + '"><span class="f9-sc-rev__who"><span class="f9-sc-rev__name">' + esc(r.author) + '</span><span class="f9-sc-rev__badge">Verified GLP-1 user</span></span><span class="f9-sc-rev__stars" aria-label="5 out of 5">' + STAR + STAR + STAR + STAR + STAR + '</span></header><p class="f9-sc-rev__body">' + esc(r.body) + '</p>' + (r.date ? '<p class="f9-sc-rev__date">' + esc(r.date) + '</p>' : "") + '</article>';
  }
  function lane(dir) {
    var items = LANES[dir].map(function (x) { return "review" in x ? review(REVIEWS[x.review]) : '<span class="f9-sc-shot"><img src="' + RESULTS + x.shot + '.webp" alt=""></span>'; }).join("");
    return '<div class="f9-sc-lane"><div class="f9-sc-lane__track f9-sc-lane__track--' + dir + '">' + items + '<span aria-hidden="true" class="f9-sc-lane__dupe">' + items + '</span></div></div>';
  }
  var ba = 50;
  function beforeAfter() {
    return '<div class="f9-sc-ba"><img class="f9-sc-ba__img" src="' + RESULTS + 'after.webp" alt=""><div class="f9-sc-ba__clip" style="clip-path:inset(0 0 0 ' + ba + '%)"><span class="f9-sc-ba__tag f9-sc-ba__tag--after">After</span></div><div class="f9-sc-ba__clip" style="clip-path:inset(0 ' + (100 - ba) + '% 0 0)"><img class="f9-sc-ba__img" src="' + RESULTS + 'before.webp" alt=""><span class="f9-sc-ba__tag f9-sc-ba__tag--before">Before</span></div><span class="f9-sc-ba__handle" style="left:' + ba + '%" aria-hidden="true"><span class="f9-sc-ba__grip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8l-4 4 4 4M14 8l4 4-4 4"></path></svg></span></span><input class="f9-sc-ba__range" type="range" min="0" max="100" value="' + Math.round(ba) + '" aria-label="Reveal the before and after photo"></div>';
  }
  function showcase() {
    return '<div class="f9-showcase">' +
      '<section class="f9-sc"><p class="f9-sc__fine f9-sc__fine--footnote">*Individual results vary. GLP-1 medication is prescribed only when a provider judges it appropriate, and is intended for use alongside a reduced-calorie diet and increased physical activity.</p><h2 class="f9-sc__title">What Happens Next:</h2><ol class="f9-sc__steps">' +
      STEPS_NEXT.map(function (s, i) { return '<li class="f9-sc__step"><span class="f9-sc__num" aria-hidden="true">' + (i + 1) + '</span><span class="f9-sc__step-text"><span class="f9-sc__step-title">' + esc(s.title) + '</span><span class="f9-sc__step-body">' + esc(s.body) + '</span></span></li>'; }).join("") + '</ol></section>' +
      '<section class="f9-sc"><h2 class="f9-sc__title">See Real Results with Chime Health:</h2>' + beforeAfter() +
      '<figure class="f9-sc-quote"><blockquote class="f9-sc-quote__text">“Chime Health made this the easiest part of my journey.”</blockquote><figcaption class="f9-sc-quote__who">— Jessica M.</figcaption></figure><p class="f9-sc__fine">Individual results vary. Testimonials reflect individual experiences.</p></section>' +
      '<section class="f9-sc"><h2 class="f9-sc__title">How Our Plans Work:</h2><ul class="f9-sc-benefits">' +
      BENEFITS.map(function (b) { return '<li class="f9-sc-benefit"><span class="f9-sc-benefit__icon" aria-hidden="true">' + b[0] + '</span><span class="f9-sc-benefit__text">' + esc(b[1]) + '</span></li>'; }).join("") + '</ul></section>' +
      '<section class="f9-sc f9-sc--center"><h2 class="f9-sc__title">18,000+ Reviews. And Counting.</h2><span class="f9-sc-tp__wrap">' + TP_BTN + '</span><div class="f9-sc--bleed">' + lane("left") + lane("right") + '</div><p class="f9-sc__fine">A selection of 5-star reviews. Reviews are from verified Chime Health GLP-1 members, shown as submitted. Individual results vary.</p></section>' +
      '</div>';
  }

  // Medical profile
  var ODDS = "94.6";
  function roll(v) {
    return '<span class="f9-roll"><span class="f9-sr-only">' + v + '%</span><span class="f9-roll__reels" aria-hidden="true">' + v.split("").map(function (ch, i) {
      return /\d/.test(ch) ? '<span class="f9-roll__slot"><span class="f9-roll__reel" style="transform:translateY(-' + (S.rolled ? Number(ch) * 10 : 0) + '%);transition-delay:' + (90 * i) + 'ms">' + "0123456789".split("").map(function (d) { return '<span class="f9-roll__digit">' + d + '</span>'; }).join("") + '</span></span>'
        : '<span class="f9-roll__sep">' + ch + '</span>';
    }).join("") + '<span class="f9-roll__sep f9-roll__sep--pct">%</span></span></span>';
  }
  function stat(l, v) { return '<div class="f9-prof-stat"><span class="f9-prof-stat__label">' + l + '</span><span class="f9-prof-stat__value">' + v + '</span></div>'; }
  function profile(st, a, errs) {
    var p = C.computeProjections(a), graph = p.startWeight > 0 && p.goalWeight > 0 && p.weeksToGoal > 0;
    var ph = String(a.phone || "");
    return '<div class="f9-prof"><h1 class="f9-prof__title">' + esc(st.q) + '</h1><div class="f9-prof-stats">' +
      (p.bmi !== null ? stat("BMI", String(p.bmi)) : "") + (p.startWeight > 0 ? stat("Current weight", p.startWeight + "lbs") : "") + (p.goalWeight > 0 ? stat("Goal weight", p.goalWeight + "lbs") : "") + '</div>' +
      '<section class="f9-prof-odds"><div class="f9-prof-odds__row"><img class="f9-prof-odds__vial" src="images/tirzepatide-vial.webp" alt=""><div class="f9-prof-odds__body"><div class="f9-prof-odds__head"><h2 class="f9-prof-odds__title">Very high chance</h2><span class="f9-prof-odds__pct">' + roll(ODDS) + '</span></div><p class="f9-prof-odds__copy">You have a very high chance of success with Chime Health prescribed GLP-1 medication</p></div></div><div class="f9-prof-odds__meter"><span class="f9-prof-odds__fill" style="width:' + ODDS + '%"></span></div></section>' +
      (graph ? '<section class="f9-prof-graph"><img class="f9-prof-graph__img" src="images/graph.webp" alt=""><span class="f9-prof-graph__pill f9-prof-graph__pill--start">' + p.startWeight + ' lbs</span><span class="f9-prof-graph__pill f9-prof-graph__pill--goal">' + p.goalWeight + ' lbs<small>Goal weight</small></span><div class="f9-prof-graph__axis"><span>Today</span><span class="f9-prof-graph__weeks">' + p.weeksToGoal + ' weeks</span></div></section>' : "") +
      '<p class="f9-prof__fine">An estimate from your own height, weight and goal — not a promise. Chime Health members typically lose 1–2 lbs a week alongside a healthy diet and exercise, and individual results vary.</p><h2 class="f9-prof__form-title">' + esc(st.sub || "") + '</h2></div>' +
      '<div class="f9-contact"><div class="f9-grid f9-grid--2">' +
      field({ id: "f9-first-name", f: "first_name", label: "First name", value: String(a.first_name || ""), placeholder: "First name", autoComplete: "given-name", invalid: !!errs.first_name }) +
      field({ id: "f9-last-name", f: "last_name", label: "Last name", value: String(a.last_name || ""), placeholder: "Last name", autoComplete: "family-name", invalid: !!errs.last_name }) + '</div>' +
      field({ id: "f9-email", f: "email", label: "Email", type: "email", value: String(a.email || ""), placeholder: "you@email.com", inputMode: "email", autoComplete: "email", invalid: !!errs.email }) +
      field({ id: "f9-phone", f: "phone", label: "Phone", value: ph, placeholder: "(123) 456-7890", inputMode: "tel", name: "chime-contact-number", autoComplete: "new-password", suppress: true, invalid: !!errs.phone }) +
      (phoneDigits(ph).length !== 10 || phoneOk(ph) ? "" : '<p class="f9-inline-error">Enter a valid phone number</p>') +
      (errs.email ? '<p class="f9-inline-error">' + esc(errs.email) + '</p>' : "") +
      (errs.first_name || errs.last_name ? '<p class="f9-inline-error">Enter your first and last name</p>' : "") +
      '<label class="f9-consent' + (S.consentError ? " rx-consent-shake" : "") + '"' + (S.consentError ? ' data-error="true"' : "") + ' data-shake="' + S.shake + '"><input type="checkbox"' + (a.sms_optin === true ? " checked" : "") + ' data-consent="1"><span>By checking this box, you provide your prior express written consent for Chime Health to contact you at the telephone number provided with marketing and promotional information using an automatic telephone dialing system, AI-generated or artificial voice, prerecorded calls, ringless voicemail messages, and text/SMS messages. Consent is not a condition of purchasing any goods or services. Message and data rates may apply. Message frequency varies. You may revoke your consent at any time. See our <a href="../privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="../terms-conditions.html" target="_blank" rel="noopener noreferrer">Terms</a>.</span></label>' +
      (S.consentError ? '<p class="f9-inline-error" role="alert">Please check the consent box above to continue</p>' : "") + '</div>';
  }

  function stepBody(st, a, errs) {
    if (st.kind === "screening") {
      return '<div class="f9-hero"><img class="f9-hero__img" src="images/hero.webp" alt=""></div><header class="f9-step-head"><h1 class="f9-step-head__title">' + esc(st.q) + ' ' +
        (st.qAccent ? '<span class="f9-step-head__accent">' + esc(st.qAccent) + '</span>' : "") + '</h1>' + (st.sub ? '<p class="f9-step-head__sub">' + esc(st.sub) + '</p>' : "") + '</header>' + screening(st, a, errs);
    }
    if (st.kind === "interstitial") {
      var p = C.computeProjections(a), toLose = p.weightToLose > 0 ? p.weightToLose + " lbs" : "your goal weight";
      var v = (st.branchOn && st.variants && st.variants[String(a[st.branchOn] == null ? "" : a[st.branchOn])]) || st;
      return '<div class="' + (st.showcase ? "f9-interstitial f9-interstitial--brand" : "f9-interstitial") + '"><span class="f9-interstitial__mark" aria-hidden="true"></span><h1 class="f9-interstitial__title">' + esc(v.q) + '</h1>' +
        v.body.map(function (b) { return '<p class="f9-interstitial__body">' + esc(b.replace(/\{toLose\}/g, toLose)) + '</p>'; }).join("") + '</div>' + (st.showcase ? showcase() : "");
    }
    if (st.kind === "results-contact") return profile(st, a, errs);
    return "";
  }

  var LEGAL = [["../privacy-policy.html", "Privacy Policy"], ["../hipaa-notice.html", "HIPAA Notice of Privacy Practices"],
    ["../consumer-health-data-privacy-policy.html", "Consumer Health Data Privacy Policy"], ["../telehealth-consent.html", "Telehealth Consent"],
    ["../shipping-policy.html", "Shipping Policy"], ["../return-refund-policy.html", "Return &amp; Refund Policy"],
    ["../terms-conditions.html", "Terms &amp; Conditions"], ["../faq.html#jurisdictions", "Service Availability"]];
  // Chime's LegitScript seal (Nick's code, 2026-10-02) in their seal slot; their legal links → Chime's 8 footer pages.
  var FOOTER = '<footer class="f9-footer"><span class="f9-footer__reviews">' + TP_BTN + '</span><div class="f9-footer__badges"><a class="f9-footer__seal" href="https://www.legitscript.com/websites/?checker_keywords=chimehealth.com" target="_blank" rel="noopener noreferrer" title="Verify LegitScript Approval for www.chimehealth.com" aria-label="LegitScript Certified"><img src="https://static.legitscript.com/seals/51605690.png" alt="Verify Approval for www.chimehealth.com" width="73" height="79"></a></div><nav class="f9-footer__links" aria-label="Legal">' +
    LEGAL.map(function (l) { return '<a href="' + l[0] + '" target="_blank" rel="noopener noreferrer">' + l[1] + '</a>'; }).join("") + '</nav></footer>';
  var LOGO = '<img class="f9-logo" src="images/chime-logo-color.png" alt="Chime Health">';
  var BACK = '<button type="button" class="f9-back" aria-label="Go back" data-act="back"><span aria-hidden="true">←</span></button>';

  function view() {
    var a = S.answers, st = step();
    if (S.dq) {
      return '<div class="f9-root" data-phase="' + S.phase + '"><header class="f9-header">' + BACK.replace('data-act="back"', 'data-act="undq"') + LOGO + '</header><main class="f9-main"><div class="f9-shell"><section class="f9-dq" role="status"><h1 class="f9-dq__title">Thank You</h1><p class="f9-dq__copy">' + esc(C.disqualifyReason(a)) + '</p><p class="f9-dq__copy">If you believe you made a mistake on your information or health form, please go back and review your answers.</p><p class="f9-dq__copy">Your safety is our number one priority. We’re sorry we couldn’t approve you for a prescription today.</p><button type="button" class="f9-cta f9-dq__cta" data-act="undq"><span aria-hidden="true">←</span> Go Back</button></section></div></main>' + FOOTER + '</div>';
    }
    var z = stepErrors(st, a), ok = Object.keys(z).length === 0;
    var shown = S.attempted ? (st.kind !== "screening" ? z : (S.focusField && z[S.focusField] ? (function () { var o = {}; o[S.focusField] = z[S.focusField]; return o; })() : {})) : {};
    var isContact = st.kind === "results-contact";
    var label = isContact ? (S.checking ? "Checking…" : S.oneMoment ? "One moment…" : "See my plan options") : (st.kind === "screening" || st.kind === "interstitial" ? st.cta : "Continue");
    var disabled = isContact ? (S.checking || S.oneMoment) : (st.kind !== "screening" && !ok);
    var pct = Math.round((S.index + 1) / C.FLOW.length * 100);
    return '<div class="f9-root" data-phase="' + S.phase + '"><div class="f9-promo">Fast, free shipping on every order — no membership fee, ever.</div><header class="f9-header">' + (S.index > 0 ? BACK : "") + LOGO + '</header>' +
      '<div class="f9-progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span class="f9-progress__fill" style="width:' + pct + '%"></span></div>' +
      '<main class="f9-main"><div class="f9-shell">' + stepBody(st, a, shown) + '</div>' +
      '<div class="f9-cta-bar"><button type="button" class="f9-cta" data-act="cta"' + (disabled ? " disabled" : "") + '>' + esc(label) + '</button></div></main>' + FOOTER + '</div>';
  }

  // ---------- render with a keyed DOM morph (keeps focus and caret while typing) ----------
  function morph(from, to) {
    if (from.nodeType !== to.nodeType || from.nodeName !== to.nodeName || (from.nodeType === 1 && from.id !== to.id)) { from.replaceWith(to); return; }
    if (from.nodeType === 3 || from.nodeType === 8) { if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue; return; }
    var i, at;
    for (i = from.attributes.length - 1; i >= 0; i--) { at = from.attributes[i].name; if (!to.hasAttribute(at)) from.removeAttribute(at); }
    for (i = 0; i < to.attributes.length; i++) { at = to.attributes[i]; if (from.getAttribute(at.name) !== at.value) from.setAttribute(at.name, at.value); }
    if (from.nodeName === "INPUT") {
      if (from.type === "checkbox" || from.type === "radio") from.checked = to.hasAttribute("checked");
      else if (from.value !== to.getAttribute("value")) from.value = to.getAttribute("value") || "";
    } else if (from.nodeName === "TEXTAREA") { if (from.value !== to.textContent) from.value = to.textContent; }
    else if (from.nodeName === "SELECT") {
      var sel = to.querySelector("option[selected]"); var v = sel ? sel.value : "";
      morphChildren(from, to); if (from.value !== v) from.value = v; return;
    }
    morphChildren(from, to);
  }
  function morphChildren(from, to) {
    var keyed = {};
    Array.prototype.forEach.call(from.childNodes, function (c) { if (c.nodeType === 1 && c.id) keyed[c.id] = c; });
    var newKids = Array.prototype.slice.call(to.childNodes), i;
    for (i = 0; i < newKids.length; i++) {
      var n = newKids[i], cur = from.childNodes[i];
      if (n.nodeType === 1 && n.id && keyed[n.id]) {
        if (keyed[n.id] !== cur) from.insertBefore(keyed[n.id], cur || null);
        morph(keyed[n.id], n);
      } else if (!cur) from.appendChild(n);
      else if (cur.nodeType === 1 && cur.id && !n.id) from.insertBefore(n, cur);
      else morph(cur, n);
    }
    while (from.childNodes.length > newKids.length) from.removeChild(from.lastChild);
  }
  var lastStepKey = null;
  function render() {
    var tpl = document.createElement("template");
    tpl.innerHTML = view();
    var next = tpl.content.firstElementChild;
    var key = S.dq ? "dq" : step().id;
    if (!app.firstElementChild || key !== lastStepKey) { app.replaceChildren(next); lastStepKey = key; afterStepMount(); }
    else morph(app.firstElementChild, next);
    var sf = app.querySelector(".f9-statesel-search"); if (sf && stateOpen && document.activeElement !== sf) { sf.focus(); sf.setSelectionRange(sf.value.length, sf.value.length); }
  }
  function afterStepMount() {
    // their odometer: reels start at 0 and roll to each digit on the next frame
    S.rolled = false;
    if (app.querySelector(".f9-roll__reel")) requestAnimationFrame(function () { requestAnimationFrame(function () { S.rolled = true; render(); }); });
  }

  // ---------- behaviour ----------
  var validSet = null, scrollTimer = null;
  function setAnswer(f, v) {
    S.answers = C.pruneAnswers(Object.assign({}, S.answers, (function () { var o = {}; o[f] = v; return o; })()));
    save(); render(); autoScroll();
  }
  // When a question becomes answered, glide to the next unanswered one (their effect, 500 ms)
  function autoScroll() {
    var st = step(); if (st.kind !== "screening" || S.dq) return;
    var vis = C.visibleBlocks(st.blocks, S.answers);
    var nowValid = vis.filter(function (b) { return blockError(b, S.answers) === null; }).map(function (b) { return b.id; });
    var prev = validSet; validSet = nowValid;
    if (prev === null || C.hasDisqualifyingAnswer(S.answers)) return;
    var fresh = nowValid.filter(function (id) { return prev.indexOf(id) === -1; });
    if (!fresh.length) return;
    var maxI = Math.max.apply(null, fresh.map(function (id) { return vis.findIndex(function (b) { return b.id === id; }); }));
    var target = vis.find(function (b, i) { return i > maxI && blockError(b, S.answers) !== null; });
    if (!target) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () { var el = document.getElementById(target.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 500);
  }
  var reduced = function () { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; };
  function go(to) {
    if (to === S.index || S.phase !== "idle") return;
    var land = function () { S.index = to; S.rolled = false; validSet = null; save(); render(); window.scrollTo(0, 0); seedValid(); };
    if (reduced()) { land(); return; }
    S.phase = "exit"; render();
    setTimeout(function () { S.phase = "enter"; land(); setTimeout(function () { S.phase = "idle"; render(); }, 200); }, 140);
  }
  function seedValid() {
    var st = step(); if (st.kind !== "screening") return;
    validSet = C.visibleBlocks(st.blocks, S.answers).filter(function (b) { return blockError(b, S.answers) === null; }).map(function (b) { return b.id; });
  }
  function next() {
    var st = step(), a = S.answers;
    if (C.hasDisqualifyingAnswer(a)) { S.attempted = false; S.focusField = null; S.dq = true; render(); return; }   // theirs keeps the scroll position (clamped)
    var z = stepErrors(st, a);
    if (Object.keys(z).length) {
      S.attempted = true;
      if (st.kind === "screening") {
        var first = C.visibleBlocks(st.blocks, a).find(function (b) { return blockError(b, a) !== null; });
        S.focusField = first ? (first.field || first.id) : null;
        render();
        if (first) { var el = document.getElementById(first.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      } else render();
      return;
    }
    S.attempted = false; S.focusField = null;
    go(Math.min(S.index + 1, C.FLOW.length - 1));
  }
  function submitContact() {
    if (S.checking || S.oneMoment) return;
    var a = S.answers;
    if (a.sms_optin !== true) { S.consentError = true; S.shake++; render(); restartShake(); return; }
    if (Object.keys(stepErrors(step(), a)).length) { S.attempted = true; render(); return; }
    S.consentError = false; S.checking = true; render();
    // Theirs: check-email + create user on their backend here. Nothing is sent from this page.
    setTimeout(function () {
      S.checking = false; S.oneMoment = true; S.attempted = false; render();
      try { store.setItem(C.ANSWERS_KEY, JSON.stringify(Object.assign({}, a, { dob: dobString(a) }))); } catch (e) {}
      window.location.href = RECOMMENDATION_URL;
    }, 600);
  }
  function restartShake() {
    var l = app.querySelector(".f9-consent"); if (!l) return;
    l.classList.remove("rx-consent-shake"); void l.offsetWidth; l.classList.add("rx-consent-shake");
  }

  app.addEventListener("click", function (ev) {
    var t = ev.target;
    var act = t.closest("[data-act]");
    if (act) {
      var k = act.getAttribute("data-act");
      if (k === "cta") step().kind === "results-contact" ? submitContact() : next();
      else if (k === "back") { S.attempted = false; S.focusField = null; S.checking = S.oneMoment = false; go(Math.max(S.index - 1, 0)); }
      else if (k === "undq") { S.dq = false; render(); }
      return;
    }
    if (t.closest("#f9-state")) { stateQuery = ""; stateOpen = !stateOpen; render(); return; }
    var opt = t.closest("[data-state]");
    if (opt) { stateOpen = false; setAnswer("state", opt.getAttribute("data-state")); return; }
  });
  document.addEventListener("mousedown", function (ev) { if (stateOpen && !ev.target.closest(".f9-statesel")) { stateOpen = false; render(); } });
  document.addEventListener("keydown", function (ev) { if (stateOpen && ev.key === "Escape") { stateOpen = false; render(); } });
  app.addEventListener("keydown", function (ev) {
    if (ev.target.classList.contains("f9-statesel-search") && ev.key === "Enter") {
      ev.preventDefault();
      var first = app.querySelector("[data-state]"); if (first) { stateOpen = false; setAnswer("state", first.getAttribute("data-state")); }
    }
  });
  app.addEventListener("input", function (ev) {
    var t = ev.target;
    if (t.classList.contains("f9-statesel-search")) { stateQuery = t.value; render(); return; }
    if (t.classList.contains("f9-sc-ba__range")) { ba = Number(t.value); syncBA(); return; }
    var f = t.getAttribute("data-f"); if (!f || t.type === "radio") return;
    var v = t.value;
    if (f === "weight" || f === "goal_weight") v = clampNum(v, 999);
    else if (f === "inches") v = clampNum(v, 11);
    else if (f === "phone") v = maskPhone(v);
    setAnswer(f, v);
  });
  app.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t.tagName === "SELECT") {                               // some browsers / drivers fire only "change"
      var sf = t.getAttribute("data-f");
      if (sf && P(S.answers[sf]) !== t.value) setAnswer(sf, sf === "inches" ? clampNum(t.value, 11) : t.value);
      return;
    }
    if (t.type === "radio" && t.getAttribute("data-f")) { setAnswer(t.getAttribute("data-f"), t.value); return; }
    var m = t.getAttribute("data-multi");
    if (m) { setAnswer(m, C.toggleMulti(S.answers[m], t.value, t.getAttribute("data-none"))); return; }
    if (t.getAttribute("data-consent")) { var on = t.checked; if (on) S.consentError = false; setAnswer("sms_optin", on); }
  });
  // before/after drag (their pointer handlers)
  function syncBA() {
    var box = app.querySelector(".f9-sc-ba"); if (!box) return;
    var clips = box.querySelectorAll(".f9-sc-ba__clip");
    clips[0].style.clipPath = "inset(0 0 0 " + ba + "%)"; clips[1].style.clipPath = "inset(0 " + (100 - ba) + "% 0 0)";
    box.querySelector(".f9-sc-ba__handle").style.left = ba + "%";
    var r = box.querySelector(".f9-sc-ba__range"); if (Number(r.value) !== Math.round(ba)) r.value = Math.round(ba);
  }
  function baAt(box, x) { var r = box.getBoundingClientRect(); if (r.width) { ba = Math.min(100, Math.max(0, (x - r.left) / r.width * 100)); syncBA(); } }
  app.addEventListener("pointerdown", function (ev) {
    var box = ev.target.closest(".f9-sc-ba"); if (!box) return;
    try { box.setPointerCapture(ev.pointerId); } catch (e) {}
    baAt(box, ev.clientX);
  });
  app.addEventListener("pointermove", function (ev) {
    var box = ev.target.closest(".f9-sc-ba"); if (box && box.hasPointerCapture && box.hasPointerCapture(ev.pointerId)) baAt(box, ev.clientX);
  });
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) { S.checking = S.oneMoment = false; render(); } });

  // expose for tests / debugging
  window.__chimeIntake = { blockError: blockError, stepErrors: stepErrors, phoneOk: phoneOk, maskPhone: maskPhone, ageFrom: ageFrom, state: S };
  render(); seedValid();
})();
