// Chime Health — Assessment v4 flow config (Redesign Proposal v4).
// The proposal document is the source of truth: every title, supporting line,
// and option below is VERBATIM from it — do not rewrite, shorten, or "improve"
// copy here. Routing/scoring metadata lives beside the screens so nothing that
// belongs in config is hard-coded in JSX.
//
// Loaded as a plain <script> before the logic + component files, and required
// by the Node test runner — hence the globalThis-safe wrapper (zero DOM refs).
//
// Blocks: A · Discovery → B · Path-Specific → C · Health & Consent → D · Result.
// ✦ rows are type "phrase": statement + single CTA, sand background, no inputs.

(function (g) {

  var SHIPPING_STATES = [
    "AL","AZ","AR","CA","CO","CT","DE","FL","GA","ID","IL","IN","IA","KS","KY",
    "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
    "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
    "WV","WI","WY",
  ];

  g.CHIME_ASSESSMENT_V4 = {

    // Block-level progress: the ONLY progress indicator (no screen counts,
    // no percentages — Block B length is dynamic and may only ever advance).
    blocks: [
      { id: "A", title: "Discovery" },
      { id: "B", title: "Your Path" },
      { id: "C", title: "Health & History" },
      { id: "D", title: "Your Health Path" },
    ],

    canonicalBranches: ["B1", "B2", "B3", "B4"],

    // A1 goal → Block B path. Multi-goal: matching paths queue in canonical
    // order B1 → B2 → B3 → B4, deduplicated.
    goalBranchMap: {
      "Lose weight": "B1",
      "Feel more energy": "B2",
      "Understand my health better": "B3",
      "Live longer, age well": "B2",
      "I’m already on a GLP-1 and want better support": "B1",
      "Curious about advanced wellness options": "B4",
      "Not sure yet, but I want to feel better": "B2", // ASSUMPTION — doc does not specify; confirm with team
    },

    // ?product= deep links pre-select A1 goal cards only — they never skip the
    // goal screen. // ASSUMPTION — confirm the param→goal map with the team.
    productParamGoals: {
      GLP: "Lose weight",
      NAD: "Feel more energy",
      PEP: "Curious about advanced wellness options",
    },

    // A4 · internal scoring only — never shown as a product picker.
    a4ScoreMap: {
      "Energy": "NAD+",
      "Confidence": "Coaching",
      "Control": "App",
      "Clarity": "NAD+",
      "Motivation": "Coaching",
      "Strength": "Sermorelin", // source deck listed Tesamorelin — not on confirmed-available list; Sermorelin substitute pending confirmation
      "Focus": "NAD+",
      "Results": "Labs",
      "A better understanding of my body": "Labs",
    },

    // A5 · persona/tone mapping. Stored in state, used for the Block D
    // narrative and exposed in the assessment_completed analytics payload.
    a5PersonaMap: {
      "I don’t feel like myself anymore": { id: "base", label: "General Wellness / base tone" },
      "I’ve tried different things and nothing has felt sustainable": { id: "p3", label: "Persona 3 — Starting With Support" },
      // Option removed from the A5 screen (2026-08-06); the entry stays so a
      // saved answer from before the removal still resolves to its persona.
      "I know something feels off, but I’m not sure what": { id: "labsSeeker", label: "Labs & Health Insights Seeker" },
      "I want to be proactive about my health": { id: "p1", label: "Persona 1 — The Executive" },
      "I want a more private and personalized experience": { id: "p2", label: "Persona 2 — The Private Client" },
      "I want guidance from people who understand this journey": { id: "p5", label: "Persona 5 — The Explorer (GLP switcher)" },
      "I already know what I want, but I want a safer, more structured path": { id: "p4", label: "Persona 4 — The Optimizer" },
    },

    // A6 · tier names and BMI ranges are INTERNAL — never rendered, never in
    // analytics. The live region shows headline + message only: never the
    // number, never a label. Tier "flag" (below 18.5) shows NO calculator
    // message and routes to the A6P provider-flag screen instead.
    bmiTiers: [
      {
        id: "balanced", min: 18.5, max: 25,
        headline: "You’re Off To A Strong Start.",
        message: "Your numbers sit in a balanced range — a solid foundation to build on. Understanding your biological age through Labs can show you what’s happening beneath the surface, so you can keep performing at your best.",
      },
      {
        id: "room", min: 25, max: 30,
        headline: "There’s Room To Feel Even Better.",
        message: "Your numbers suggest there’s real opportunity to feel stronger and more energized. A personalized plan — starting with understanding your biological age — can show you exactly where to focus.",
      },
      {
        id: "build", min: 30, max: Infinity,
        headline: "Let’s Build A Plan Around This.",
        message: "Your numbers point to a meaningful opportunity for change — and you don’t have to figure out where to start on your own. Labs can reveal your biological age and what your body needs, so your plan is built around you, not a generic number.",
      },
    ],

    // Sane-range validation bounds (kind tone, never alarm language).
    snapshotRanges: { weightMin: 50, weightMax: 700, heightInMin: 36, heightInMax: 96 },

    // B1.5 → routing insertions ("Not seeing progress" / "Low energy or
    // fatigue" add B2 if not already present or completed).
    b15InsertValues: ["Not seeing progress", "Low energy or fatigue"],
    b15InsertBranch: "B2",

    // B2.3 cross-sell → "Yes" or "Maybe" inserts B1 and/or B4 (deduped,
    // canonical order among remaining branches, always before Block C).
    // ASSUMPTION — doc says "B1 and/or B4"; we insert both and dedupe.
    b23InsertValues: ["Yes, I’m interested", "Maybe, tell me more"],
    b23InsertBranches: ["B1", "B4"],

    // B3.1 → this answer skips the remainder of B3 (B3.2/B3.3) INCLUDING the
    // ✦ closer (default; flagged in DECISIONS for team confirmation).
    b31SkipValue: "Not interested right now",

    // B1.2 gate / B1.3 free-text + dose-skip values.
    b12ShowValue: "Yes",
    b13OtherValue: "Others",

    // B4.3 compliance gate: ONLY these two may be named in results. Every
    // other area gets the generic message until compliance clears BPC-157,
    // TB-500, MOTS-c, GHK-Cu.
    b43Named: {
      "Hormone optimization": "Sermorelin",
      "Sexual wellness": "PT-141",
    },

    // ---------------------------------------------------------------------
    // Screens, in base order. Branch screens carry branch: "B1".."B4".
    // label = data-screen-label (the DOM-diff verification hook).
    // ---------------------------------------------------------------------
    screens: [

      {
        id: "A1", block: "A", type: "cards", label: "a1-goal",
        hero: true, // presentation only: feel-section-style band, copy below unchanged
        title: "Your Goal Is Our Goal",
        supportingLine: "Let’s set up a goal for this journey.",
        /* ADDITIVE COPY — pending copy team approval */
        timeNote: "Takes about 3 minutes.",
        options: [
          { value: "Lose weight", icon: "scale" },
          { value: "Feel more energy", icon: "zap" },
          { value: "Understand my health better", icon: "search" },
          { value: "Live longer, age well", icon: "heart" },
          { value: "I’m already on a GLP-1 and want better support", icon: "refresh" },
          { value: "Curious about advanced wellness options", icon: "sparkle" },
          { value: "Not sure yet, but I want to feel better", icon: "compass" },
        ],
      },

      {
        id: "A2", block: "A", type: "checkboxes", label: "a2-eligibility",
        // presentation only: render as A1-style goal cards. Copy verbatim —
        // `value` carries the exact option string the logic matches on
        // (v4MedicationEligible compares against "None of the above").
        cards: true,
        title: "Do any of these apply to you?",
        exclusive: "None of the above",
        options: [
          { value: "Currently or possibly pregnant, or actively trying to become pregnant", icon: "baby" },
          { value: "Breastfeeding or bottle feeding with breastmilk", icon: "bottle" },
          { value: "Have given birth to a child within the last 6 months", icon: "calendar" },
          { value: "None of the above", icon: "ban" },
        ],
      },

      {
        // Shown only when A2 has a disqualifying selection: the medication-
        // based path stops here; the flow continues via Labs or Coaching.
        id: "A2F", block: "A", type: "fork", label: "a2-fork",
        // COPY NEEDED from copy team — placeholder: neutral, warm, no alarm.
        copyNeeded: true,
        title: "Thanks for sharing that with us.",
        supportingLine: "Based on what you told us, a medication-based plan isn’t the right fit right now — and that’s okay. There’s more than one way forward, and we’ll walk it with you.",
        choices: [
          { value: "labs", label: "Continue toward Labs" },
          { value: "coaching", label: "Continue toward Coaching" },
        ],
      },

      {
        id: "A3", block: "A", type: "contact", label: "a3-about-you",
        title: "A Few Details About You",
        shippingStates: SHIPPING_STATES,
      },

      {
        id: "A4", block: "A", type: "chips", label: "a4-feel-more-of",
        // presentation only: circular options with soda-bubble motion. A4-only
        // on purpose — the other chips screens carry options far too long to
        // fit inside a circle (B1.1's longest is 66 characters).
        bubbles: true,
        title: "What would you like to feel more of?",
        options: [
          "Energy", "Confidence", "Control", "Clarity", "Motivation",
          "Strength", "Focus", "Results", "A better understanding of my body",
        ],
      },

      {
        id: "A5", block: "A", type: "list", label: "a5-starting-point",
        title: "Which of these feels closest to where you are right now?",
        // presentation only: A1-style cards, single-select. Copy verbatim —
        // `value` is the exact string a5PersonaMap is keyed by, so every
        // persona lookup keeps resolving.
        cards: true,
        options: [
          { value: "I don’t feel like myself anymore", icon: "user" },
          { value: "I’ve tried different things and nothing has felt sustainable", icon: "refresh" },
          { value: "I want to be proactive about my health", icon: "shield" },
          { value: "I want a more private and personalized experience", icon: "lock" },
          { value: "I want guidance from people who understand this journey", icon: "users" },
          { value: "I already know what I want, but I want a safer, more structured path", icon: "compass" },
        ],
      },

      {
        id: "A6", block: "A", type: "snapshot", label: "a6-quick-snapshot",
        title: "Let’s See Where You’re Starting From",
      },

      {
        // Provider-flag screen (tier below 18.5): neutral, then the flow
        // continues normally.
        id: "A6P", block: "A", type: "phrase", label: "a6-provider-flag",
        title: "Let’s have your provider take a closer look",
        // COPY NEEDED — supporting line intentionally absent; the doc's
        // rationale ("low BMI needs clinical context…") is internal and must
        // not render (no clinical labels anywhere in the UI).
        cta: "Continue.",
      },

      {
        id: "A7", block: "A", type: "phrase", label: "a7-transition",
        // presentation only: this screen paints the whole page in the theme's
        // main blue. The flow re-colours the chrome that sits on it.
        pageAccent: true,
        image: "assess01.png",
        // Descriptive, not decorative: this photo carries the screen's meaning,
        // so a screen-reader user should get the same reassurance from it.
        imageAlt: "A woman resting on her sofa in the evening, wrapped in a knit blanket, reading on her phone with a mug beside her.",
        title: "We’re In This Together",
        supportingLine: "A few more questions, tailored to exactly what you told us — nothing extra, nothing generic.",
        cta: "Continue.",
      },

      // ---- B1 · Weight Loss Path ----
      {
        id: "B1.1", block: "B", branch: "B1", type: "chips", label: "b1-1-journey",
        // presentation only: circular options with soda-bubble motion, as A4.
        bubbles: true,
        title: "What best describes your weight loss journey so far?",
        // Brand-name clarifiers (Ozempic/Wegovy/Zepbound/Mounjaro) pending legal approval — leave out.
        options: [
          "Just starting to explore options",
          "Tried many diets or lifestyle programs before",
          "Currently using Semaglutide or Tirzepatide and want better support",
          "Used Semaglutide or Tirzepatide before and stopped",
          "Not sure what’s right for me",
        ],
      },
      {
        id: "B1.2", block: "B", branch: "B1", type: "gate", label: "b1-2-med-gate",
        // presentation only: A1-style icon cards. `value` stays the bare string
        // the routing compares against (b12ShowValue === "Yes").
        cards: true,
        title: "Have you tried any weight-loss medication before?",
        options: [
          { value: "Yes", icon: "checkCircle" },
          { value: "No", icon: "ban" },
        ],
      },
      {
        id: "B1.3", block: "B", branch: "B1", type: "listFree", label: "b1-3-past-meds",
        cards: true, // presentation only: A1-style option cards
        title: "What medications have you taken in the past?",
        options: [
          { value: "Semaglutide", icon: "syringe" },
          { value: "Tirzepatide", icon: "syringe" },
          { value: "Another GLP-based medication (GLP-Squared, Retatrutide)", icon: "pill" }, // verify product name against source doc
          { value: "Others", icon: "help" },
        ],
      },
      {
        id: "B1.4", block: "B", branch: "B1", type: "dynlist", label: "b1-4-dose",
        cards: true, // presentation only: A1-style option cards
        title: "Which dose most closely matches your most recent weekly dose?",
        // Ladder values not in the doc — clearly-labeled placeholders, trivial
        // to swap. Keyed by the B1.3 answer.
        // ASSUMPTION — the doc names a Semaglutide ladder and a GLP-Squared/
        // Retatrutide ladder only; Tirzepatide gets its own placeholder ladder.
        ladders: {
          "Semaglutide": [
            { value: "PLACEHOLDER 0.25 mg", icon: "droplet" },
            { value: "PLACEHOLDER 0.5 mg", icon: "droplet" },
            { value: "PLACEHOLDER 1 mg", icon: "droplet" },
            { value: "PLACEHOLDER 1.7 mg", icon: "droplet" },
            { value: "PLACEHOLDER 2.4 mg", icon: "droplet" },
            { value: "PLACEHOLDER — I’m not sure", icon: "help" },
          ],
          "Tirzepatide": [
            { value: "PLACEHOLDER 2.5 mg", icon: "droplet" },
            { value: "PLACEHOLDER 5 mg", icon: "droplet" },
            { value: "PLACEHOLDER 7.5 mg", icon: "droplet" },
            { value: "PLACEHOLDER 10 mg", icon: "droplet" },
            { value: "PLACEHOLDER 12.5 mg", icon: "droplet" },
            { value: "PLACEHOLDER 15 mg", icon: "droplet" },
            { value: "PLACEHOLDER — I’m not sure", icon: "help" },
          ],
          "Another GLP-based medication (GLP-Squared, Retatrutide)": [
            { value: "PLACEHOLDER dose 1", icon: "droplet" },
            { value: "PLACEHOLDER dose 2", icon: "droplet" },
            { value: "PLACEHOLDER dose 3", icon: "droplet" },
            { value: "PLACEHOLDER — I’m not sure", icon: "help" },
          ],
        },
      },
      {
        id: "B1.5", block: "B", branch: "B1", type: "chips", label: "b1-5-difficult",
        cards: true, // presentation only: A1-style option cards
        title: "What has felt most difficult about weight loss for you?",
        maxSelections: 3,
        options: [
          { value: "Staying consistent", icon: "calendar" },
          { value: "Feeling hungry or craving food", icon: "utensils" },
          { value: "Not seeing progress", icon: "trendingDown" },
          { value: "Low energy or fatigue", icon: "batteryLow" },
          { value: "Not having enough support", icon: "users" },
          { value: "Not knowing what’s right for my body", icon: "help" },
          { value: "Feeling judged or dismissed", icon: "heart" },
          { value: "Losing weight but gaining it back", icon: "refresh" },
        ],
      },
      {
        id: "B1.C", block: "B", branch: "B1", type: "phrase", label: "b1-closer",
        // Same treatment as A7: the page takes the theme blue and the panel
        // dissolves into it. Two people rather than one is the whole point of
        // the pairing here — the line is "not doing this alone".
        pageAccent: true,
        image: "stressed-couple.webp",
        imageAlt: "Two people sitting cross-legged on mats side by side, eyes closed, breathing through a calm moment together.",
        title: "You’re Not Doing This Alone",
        supportingLine: "A path built with you, not around a guess.",
        cta: "Continue.",
      },

      // ---- B2 · Energy & Longevity Path ----
      {
        id: "B2.1", block: "B", branch: "B2", type: "chips", label: "b2-1-experiencing",
        cards: true, // presentation only: A1-style option cards
        title: "Which of these are you experiencing most often?",
        options: [
          { value: "Afternoon energy crashes", icon: "trendingDown" },
          { value: "Mental fog", icon: "cloud" },
          { value: "Difficulty staying focused", icon: "target" },
          { value: "Feeling drained", icon: "batteryLow" },
          { value: "Not performing at my best", icon: "gauge" },
          { value: "Poor recovery after working out", icon: "refresh" },
          { value: "Trouble keeping up with my lifestyle", icon: "clock" },
          { value: "General wellness concerns", icon: "heart" },
        ],
      },
      {
        id: "B2.2", block: "B", branch: "B2", type: "chips", label: "b2-2-better-energy",
        cards: true, // presentation only: A1-style option cards
        title: "What would better energy help you do?",
        options: [
          { value: "Feel more productive", icon: "briefcase" },
          { value: "Keep up with work and life", icon: "clock" },
          { value: "Feel more present with my family", icon: "users" },
          { value: "Stay consistent with my health goals", icon: "calendar" },
          { value: "Feel more confident", icon: "sparkle" },
          { value: "Exercise or recover better", icon: "dumbbell" },
          { value: "Feel younger or more vital", icon: "sun" },
          { value: "Improve my overall quality of life", icon: "heart" },
        ],
      },
      {
        id: "B2.3", block: "B", branch: "B2", type: "list", label: "b2-3-cross-sell",
        cards: true, // presentation only: A1-style option cards
        title: "Would you be open to exploring weight loss or advanced wellness support if it fits your path?",
        options: [
          { value: "Yes, I’m interested", icon: "checkCircle" },
          { value: "Maybe, tell me more", icon: "help" },
          { value: "Not right now", icon: "ban" },
          { value: "I’m not sure", icon: "compass" },
        ],
      },
      {
        id: "B2.C", block: "B", branch: "B2", type: "phrase", label: "b2-closer",
        // Same treatment as A7 and B1.C. This photo is also the homepage hero
        // (Hero.jsx) — deliberate: the face that opened the site closes the
        // energy path, which is the one place a repeat earns its keep.
        pageAccent: true,
        image: "hf_20260709_235042_d5fcb10f-0daf-4a3f-a324-6c1333d8210d.webp",
        imageAlt: "A woman standing in warm window light, holding a cup of tea and smiling easily.",
        title: "Feel Like Yourself Again",
        supportingLine: "A few more questions, and we’ll show you what’s possible.",
        cta: "Continue.",
      },

      // ---- B3 · Labs & Health Insights Path ----
      {
        id: "B3.1", block: "B", branch: "B3", type: "list", label: "b3-1-interest",
        cards: true, // presentation only: A1-style option cards
        title: "How interested are you in understanding what’s happening beneath the surface?",
        options: [
          { value: "Very interested", icon: "signalHigh" },
          { value: "Somewhat interested", icon: "signalMid" },
          { value: "Curious but not sure", icon: "search" },
          { value: "Not interested right now", icon: "ban" },
        ],
      },
      {
        id: "B3.2", block: "B", branch: "B3", type: "chips", label: "b3-2-insight-areas",
        cards: true, // presentation only: A1-style option cards
        title: "Which areas would you most like more insight into?",
        options: [
          { value: "Biological Age", icon: "clock" },
          { value: "Inflammation", icon: "flame" },
          { value: "Hormones", icon: "waves" },
          { value: "Nutrient levels", icon: "droplet" },
          { value: "General health markers", icon: "barChart" },
        ],
      },
      {
        id: "B3.3", block: "B", branch: "B3", type: "list", label: "b3-3-recent-labs",
        cards: true, // presentation only: A1-style option cards
        title: "Have you had lab work done recently?",
        options: [
          { value: "Within the last 3 months", icon: "calendarCheck" },
          { value: "Within the last 6 months", icon: "calendar" },
          { value: "Within the last year", icon: "clock" },
          { value: "Not recently", icon: "ban" },
          { value: "I’m not sure", icon: "help" },
        ],
      },
      {
        id: "B3.C", block: "B", branch: "B3", type: "phrase", label: "b3-closer",
        title: "Your Body Has Been Trying To Tell You Something",
        supportingLine: "Let’s turn that into answers.",
        cta: "Continue.",
      },

      // ---- B4 · Advanced Wellness Path ----
      {
        id: "B4.1", block: "B", branch: "B4", type: "list", label: "b4-1-familiarity",
        cards: true, // presentation only: A1-style option cards
        title: "How familiar are you with wellness therapies such as peptides or hormone-related support?",
        options: [
          { value: "Very familiar", icon: "signalHigh" },
          { value: "Somewhat familiar", icon: "signalMid" },
          { value: "I’ve heard of them but haven’t tried them", icon: "help" },
          { value: "I’m new to this", icon: "sparkle" },
        ],
      },
      {
        id: "B4.2", block: "B", branch: "B4", type: "chips", label: "b4-2-matters-most",
        cards: true, // presentation only: A1-style option cards
        title: "What matters most to you when exploring advanced wellness options?",
        options: [
          { value: "Product transparency", icon: "search" },
          { value: "Safety and legitimacy", icon: "shield" },
          { value: "Avoiding unregulated sources", icon: "ban" },
          { value: "Personalized recommendations", icon: "user" },
          { value: "Privacy", icon: "lock" },
          { value: "Convenience", icon: "clock" },
          { value: "Long-term support", icon: "users" },
        ],
      },
      {
        id: "B4.3", block: "B", branch: "B4", type: "chips", label: "b4-3-interest-areas",
        cards: true, // presentation only: A1-style option cards
        title: "Which areas are you most interested in?",
        options: [
          { value: "Skin health", icon: "sparkle" },
          { value: "Performance", icon: "gauge" },
          { value: "Recovery", icon: "refresh" },
          { value: "Hormone optimization", icon: "waves" },
          { value: "Sexual wellness", icon: "heart" },
          { value: "Healthy aging", icon: "sun" },
          { value: "General wellness support", icon: "compass" },
        ],
      },
      {
        id: "B4.C", block: "B", branch: "B4", type: "phrase", label: "b4-closer",
        // Same treatment as A7 / B1.C / B2.C. The only landscape source in the
        // set (1600x1067): the 3:4 card crops it to the middle 50% of its
        // width, which still contains both runners — checked, not assumed.
        // Also the homepage GuideSection background.
        pageAccent: true,
        image: "hf_20260702_042318_5749878e-ec06-4b35-8bef-d1e9b5d0bc05.webp",
        imageAlt: "Two people running together along a frost-covered ridge at first light.",
        title: "Advanced Wellness Options With Provider-Guided Confidence",
        supportingLine: "Almost there.",
        cta: "Continue.",
      },

      // ---- Block C — Health History, Full Picture & Consent ----
      {
        id: "C.PRE", block: "C", type: "phrase", label: "c-pre-trust",
        // Same treatment as the other closers. This source is an RGBA cutout,
        // not a scene, so it takes the contain-on-white variant — it is the one
        // image in the set that actually depicts "you and your care team".
        pageAccent: true,
        image: "wieght_loss_md.webp", // filename typo is upstream; the file is named this on disk
        imageCutout: true,
        imageAlt: "A hand holding a phone showing a video call with a clinician in a white coat.",
        title: "This Stays Between You And Your Care Team",
        supportingLine: "Provider-guided care. Personalized recommendations. Ongoing support.",
        cta: "Continue.",
      },
      {
        id: "C1", block: "C", type: "placeholder", label: "c1-health-history",
        title: "Health History",
        note: "Health History — fields per current live build, no content changes.",
      },
      {
        id: "C2", block: "C", type: "placeholder", label: "c2-full-picture",
        title: "Full Picture",
        note: "Full Picture — fields per current live build, no content changes.",
      },
      {
        id: "C3", block: "C", type: "placeholder", label: "c3-consent",
        title: "Consent",
        note: "Consent — current consent copy per live build, no content changes.",
      },
      {
        id: "C.POST", block: "C", type: "phrase", label: "c-post-bring-together",
        title: "Let’s Bring It All Together",
        supportingLine: "Because No Two Bodies Are The Same — here’s the path built around yours.",
        cta: "See My Health Path.",
      },

      // ---- Block D — Your Health Path ----
      { id: "D", block: "D", type: "result", label: "d-your-health-path" },
    ],

    // ---------------------------------------------------------------------
    // Block D composition (scoring module reads all of this).
    // ---------------------------------------------------------------------
    branchPathMap: { B1: "weightLoss", B2: "energy", B3: "labs", B4: "advanced" },

    pathHeadlines: {
      weightLoss: "Chime Weight Loss Journey",
      energy: "Chime Energy & Wellness",
      labs: "Chime Labs & Health Insights",
      advanced: "Chime Advanced Wellness", // COPY NEEDED — headline not in the doc's named list
      coaching: "Chime Coaching",          // COPY NEEDED — headline not in the doc's named list
    },

    nextSteps: [
      "Create or access your account",
      "Review your recommended path",
      "Continue to medical intake",
      "Provider review",
      "Prescription treatment, if medically appropriate",
      "Licensed pharmacy fulfillment",
      "Track your journey through your Chime portal",
      "Stay supported through Chime Membership",
    ],

    resultCta: "Create My Account",
    resultCtaSupport: "You’re Not Doing This Alone™",

    // Pricing data not in doc — placeholder pricing config keyed by
    // path + add-on, trivial to swap for real numbers.
    pricing: {
      plans: {
        weightLoss: { price: "PLACEHOLDER — $—/mo" },
        energy: { price: "PLACEHOLDER — $—/mo" },
        labs: { price: "PLACEHOLDER — $—" },
        advanced: { price: "PLACEHOLDER — $—/mo" },
        coaching: { price: "PLACEHOLDER — $—/mo" },
      },
      addOns: {
        "NAD+": { price: "PLACEHOLDER — $—/mo", medication: true },
        "Coaching": { price: "PLACEHOLDER — $—/mo", medication: false },
        "App": { price: "PLACEHOLDER — $—/mo", medication: false },
        "Labs": { price: "PLACEHOLDER — $—", medication: false },
        "Sermorelin": { price: "PLACEHOLDER — $—/mo", medication: true },
      },
    },

    // Offer-row thumbnails. Keyed by pathId for the plan and by add-on name
    // for the add-ons. `product` looks the art up in the shared catalog
    // (ui_kits/shared/data/products.js) by name rather than copying a path, so
    // the vial images keep one owner. Coaching and App are services with no
    // vial — they take an icon in the same tile.
    offerThumbs: {
      weightLoss: { product: "GLP-1" },
      energy: { product: "NAD+" },
      labs: { image: "test_vials.webp" },
      advanced: { product: "Sermorelin" },
      coaching: { icon: "users" },
      "NAD+": { product: "NAD+" },
      "Sermorelin": { product: "Sermorelin" },
      "Labs": { image: "test_vials.webp" },
      "Coaching": { icon: "users" },
      "App": { icon: "smartphone" },
    },

    // The product a path already includes never re-offers as its own add-on.
    // ASSUMPTION — mapping not in doc; confirm with team.
    pathCoreProduct: {
      weightLoss: null, energy: "NAD+", labs: "Labs",
      advanced: "Sermorelin", coaching: "Coaching",
    },

    // "Why This Path May Fit" copy — bullets are pulled from the user's OWN
    // answers, never generic filler. All strings below are drafted, use
    // "may help support" phrasing, and are COPY NEEDED (pending copy team).
    why: {
      journey: {
        "Just starting to explore options": "You’re just starting to explore — your plan starts gently, with guidance at every step.",
        "Tried many diets or lifestyle programs before": "You’ve tried different things before, and nothing has felt sustainable. With Chime, we’ll walk this path with you toward a leaner, healthier, more confident you.",
        "Currently using Semaglutide or Tirzepatide and want better support": "You’re already on this journey — better support may help you get more from it.",
        "Used Semaglutide or Tirzepatide before and stopped": "You’ve been here before — this time, a more structured path may help support results that last.",
        "Not sure what’s right for me": "You’re not sure what’s right yet — a provider-guided path is built to figure that out with you.",
      },
      struggles: { lead: "What’s felt hardest — ", tail: " — is exactly what your plan is built to support." },
      energyHelps: { lead: "You told us better energy would help you ", tail: " — your plan is built around that." },
      labAreas: { lead: "You asked for more insight into ", tail: " — your panel may help support exactly that." },
      advancedNamed: {
        "Hormone optimization": "Hormone optimization support like Sermorelin may help support your goals — always provider-guided.",
        "Sexual wellness": "Sexual wellness support like PT-141 may help support your goals — always provider-guided.",
      },
      advancedGeneric: "Provider-guided options in the areas you selected — your provider will confirm what may help support you.",
      persona: {
        base: "You want to feel like yourself again — that’s a goal worth building a path around.",
        p3: "Sustainable beats fast — your path is structured for support that lasts.",
        labsSeeker: "Something feels off — your path starts with answers, not guesses.",
        p1: "You’re being proactive about your health — your path is built to keep you ahead.",
        p2: "You asked for a private, personalized experience — your path is built around exactly that.",
        p5: "Guidance from people who understand this journey — that’s the core of your path.",
        p4: "You know what you want — your path adds the structure and safety around it.",
      },
      goalEcho: { lead: "You told us your goal: ", tail: ". That’s where your path begins." },
    },

    // Labs tier + panel-freshness notes for the Results screen.
    // ASSUMPTION — area-count → tier mapping not in doc; confirm with team.
    labsTiers: { essential: "Essential", complete: "Complete", executive: "Executive" },
    labsFreshValues: ["Within the last 3 months", "Within the last 6 months"],
    labsPanelNotes: {
      // COPY NEEDED — drafted.
      fresh: "We’ll recommend a fresh panel so your plan starts from today’s numbers.",
      comparison: "You’ve had recent lab work — a comparison panel may help show what’s changed.",
    },
  };

})(typeof window !== "undefined" ? window : globalThis);
