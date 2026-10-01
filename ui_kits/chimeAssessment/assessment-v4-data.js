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

  // A3's State select (client, 2026-10-01): the qualify funnel's step 7 list —
  // the 48 states it serves (no AK / HI / DC), stored as the two-letter code,
  // shown by name. Same codes the old shipping list carried.
  var SHIPPING_STATES = [
    ["AL","Alabama"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],
    ["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["ID","Idaho"],
    ["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],
    ["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],
    ["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],
    ["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],
    ["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],
    ["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],
    ["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],
    ["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
  ].map(function (s) { return { value: s[0], label: s[1] }; });

  // The qualify funnel's "None"-style answers. Each is exclusive both ways on
  // its own question, and is (with the noted extra) the only safe answer.
  var NONE_THESE = "None of these";
  var NONE_BELOW = "None of the below";

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
      // Option removed from the A1 screen (Vf spec, 6 goals). The entry stays
      // so a saved session from before the removal still routes. ⚠️ "Longevity"
      // no longer appears anywhere on the goal screen even though the branch it
      // fed is still called Energy & Longevity — raised with the client.
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
      // Option removed from the A4 screen (Vf spec, 8 options). Entry kept so a
      // saved answer still scores; "Results" keeps Labs reachable.
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

    // A6 · tier ids and these ranges are INTERNAL — never rendered, never in
    // analytics. The live region shows the tier's headline + message, plus
    // (since 2026-10-01) the BMI line from bmiDisplay below. Tier "flag"
    // (below 18.5) shows NO tier message and routes to the A6P screen.
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

    // A6 shows the BMI (client, 2026-10-01: "height, weight, and it'll
    // calculate your BMI"), as the qualify funnel's step 1 does: same formula
    // (703 × lbs / in², one decimal), same categories, same copy. This
    // replaces the v4 spec's "never the number, never a label" rule on this
    // screen only; the tier ids above still never render.
    bmiDisplay: {
      line: "Your BMI is {value} ({category}).",
      note: "Even modest weight loss can improve health. Your plan is personalized beyond BMI.",
      whyTitle: "Why BMI?",
      why: "Your height & weight calculate BMI — one of several factors your clinician uses to personalize your plan.",
      categories: [
        { below: 18.5, label: "underweight range" },
        { below: 25, label: "healthy range" },
        { below: 30, label: "overweight range" },
        { below: Infinity, label: "obese range" },
      ],
    },

    // Sane-range validation bounds (kind tone, never alarm language).
    snapshotRanges: { weightMin: 50, weightMax: 700, heightInMin: 36, heightInMax: 96 },

    // B1.5 → routing insertion (adds B2 if not already present or completed).
    // Vf merged the former "Not seeing progress" + "Low energy or fatigue" into
    // ONE option, so this list is now single-valued. Both legacy strings stay
    // listed so a saved session from before the merge still inserts B2.
    b15InsertValues: [
      "Not seeing progress or feeling low on energy",
      "Not seeing progress", "Low energy or fatigue", // legacy — saved sessions
    ],
    b15InsertBranch: "B2",

    // B2.3 cross-sell → "Yes" or "Maybe" inserts B1 and/or B4 (deduped,
    // canonical order among remaining branches, always before Block C).
    // ASSUMPTION — doc says "B1 and/or B4"; we insert both and dedupe.
    b23InsertValues: ["Yes, I’m interested", "Maybe, tell me more"],
    b23InsertBranches: ["B1", "B4"],

    // B3.2 → this answer skips the remainder of B3 (B3.3) INCLUDING the ✦
    // closer (default; flagged in DECISIONS for team confirmation).
    // Vf deleted the standalone B3.1 interest screen and moved its exit option
    // inline into B3.2, so the skip is now keyed to a B3.2 selection. B3.2 is
    // multi-select, so the check tests for membership, not equality.
    b32SkipValue: "Not sure yet / not interested right now",

    // A2G → the pregnancy/breastfeeding gate (A2) is asked ONLY of this
    // answer. Keeping the trigger in config, beside the other routing values,
    // means a change to the A2G option list can't silently strand the rule.
    a2gAsksPregnancy: "Female",

    // B1.1's inline medication reveal (Vf C-WL.1). Picking either of these two
    // journey answers opens the "Which medication?" sub-question ON THE SAME
    // SCREEN — they are the two options that already state the person has used
    // Semaglutide/Tirzepatide, which is why the old B1.2 Yes/No gate is gone.
    // These strings must stay identical to the B1.1 options they name.
    b11RevealValues: [
      "Currently using Semaglutide or Tirzepatide and want better support",
      "Used Semaglutide or Tirzepatide before and stopped",
    ],
    // The sub-question's free-text option. Selecting it must NOT auto-advance,
    // or the text field it opens would leave with the screen.
    b11OtherValue: "Others",

    // A3's State options (see SHIPPING_STATES above).
    states: SHIPPING_STATES,

    // ---------------------------------------------------------------------
    // Medical intake (client, 2026-10-01). The weight-loss path now carries the
    // qualify funnel's medical screens (qualify.chimehealth.com/rnad/v1 steps
    // 6, 7, 11, 12, 13, 14, 17, 18) with their copy, answers and disqualify
    // rules unchanged. Answer VALUES are the reference's own input values, so
    // the backend team can map each one 1:1 (see asmtV4Payload).
    // ---------------------------------------------------------------------

    // Age + BMI bands — the reference's step 7 (screening-bands.js), verbatim:
    //   65+        BMI < 22          disqualify
    //   65+        BMI >= 22         continue, after the ELDERLY consent
    //   18 to 64   BMI < 20          disqualify
    //   18 to 64   20 <= BMI < 23    continue, after the METABOLIC consent
    //   18 to 64   BMI >= 23         straight through, no consent
    // Applied only where the medical screens apply (the weight-loss path).
    screeningBands: { elderlyAge: 65, elderlyMinBmi: 22, adultMinAge: 18, adultMinBmi: 20, adultConsentMaxBmi: 23 },

    // The "closer look" screen any disqualifying answer leads to — copy
    // verbatim from qualify.chimehealth.com/mainglp/disqualified.php. "Go back"
    // returns to the screen that triggered it with the answers kept; "Keep my
    // answer" leaves the assessment (the reference exits to its start page).
    disqualified: {
      label: "dq-closer-look",
      title: "Your answer tells us your care deserves a closer look",
      body: "Based on what you shared, we think you'd be better served by a provider who can evaluate you in person. It's not a no, it's a redirect to the kind of care that fits you best right now.",
      back: "Go back and change my answer",
      keep: "Keep my answer",
      keepHref: "index.html",
    },

    // Every screen's fixed step number, for the per-step URL
    // (chimeAssessment.html?step=N) the backend team integrates against.
    // Numbers never move: a screen a visitor's path skips simply leaves a gap,
    // like the reference's stepN.php files. The "closer look" screen is
    // ?step=disqualified. Add new screens at the END so no number shifts.
    stepOrder: [
      "A1", "A3", "A2G", "A2", "A2F", "A4", "A5", "A6", "A6P", "A7",
      "B1.1", "B1.4", "B1.5", "B1.C",
      "B2.1", "B2.3", "B2.C",
      "B3.2", "B3.3", "B3.C",
      "B4.2", "B4.3", "B4.C",
      "C.PRE", "H7", "H11", "H12", "H13", "H14", "H17", "H18", "C.POST",
      "D",
    ],

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
    //
    // autoAdvance: true — the screen moves on by itself once an option is
    // picked, instead of waiting for Continue (client request, v7 "Cambios
    // solicitados por el cliente" (2)). It belongs on SINGLE-select screens
    // only: a multi-select that jumped on the first tap would make the second
    // selection unreachable. listFree screens keep it, because the flow
    // suppresses the jump for the free-text option (see setSingle).
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
          { value: "I’m already on a GLP-1 and want better support", icon: "refresh" },
          { value: "Curious about advanced wellness options", icon: "sparkle" },
          { value: "Not sure yet, but I want to feel better", icon: "compass" },
        ],
      },

      {
        // Six fields (client, 2026-10-01):
        //   First Name · Last Name · Date of Birth · E-mail · Phone · State
        // "This age thing has to be a date of birth" — the age is calculated
        // from it. State is the qualify funnel's step 7 field. The two helper
        // lines under them are the reference's, verbatim. The street address
        // is still collected by the checkout.
        id: "A3", block: "A", type: "contact", label: "a3-about-you",
        title: "A Few Details About You",
        dobHint: "Ages 18-75 are eligible for treatment",
        stateHint: "Ensures your clinician is licensed in your state",
      },

      {
        // Split out of the Info Page (A3), where this was the "Sex assigned at
        // birth" segmented control, so the pregnancy/breastfeeding screen can
        // sit DIRECTLY after it — client request, v7 "Cambios solicitados por
        // el cliente" (3). Deliberately icon-less: the icon set carries no
        // gender artwork, and two identical `user` glyphs read as a bug.
        id: "A2G", block: "A", type: "list", label: "a2g-gender",
        cards: true,
        autoAdvance: true,
        title: "Gender at Birth",
        options: ["Female", "Male"],
      },

      {
        // ▣ Legal / compliance content — VERBATIM from v7. Do not reword, do
        // not add options. Replaces the v4 four-option checkbox screen; "Yes"
        // ends the medication-based path and hands over to the A2F fork.
        // Asked only when A2G answered `a2gAsksPregnancy` — putting this
        // question to someone who just answered "Male" is the reason gender
        // was split out to sit immediately before it.
        // Icon-less on purpose: this is the one gate where the affirm/negate
        // glyph pair used on B1.2 would read as a verdict on the answer.
        id: "A2", block: "A", type: "gate", label: "a2-eligibility",
        cards: true,
        autoAdvance: true,
        title: "Are you currently pregnant or breast feeding?",
        options: ["Yes", "No"],
      },

      {
        // Shown only when A2 disqualifies: the medication-based path stops
        // here; the flow continues via Labs or Coaching.
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
        id: "A4", block: "A", type: "chips", label: "a4-feel-more-of",
        // presentation only: circular options with soda-bubble motion. A4-only
        // on purpose — the other chips screens carry options far too long to
        // fit inside a circle (B1.1's longest is 66 characters).
        bubbles: true,
        title: "What would you like to feel more of?",
        // Supporting line is verbatim from the Vf spec's A3 row.
        supportingLine: "Select all the options that feel right for you.",
        options: [
          "Energy", "Confidence", "Control", "Clarity", "Motivation",
          "Strength", "Focus", "Results",
        ],
      },

      {
        id: "A5", block: "A", type: "list", label: "a5-starting-point",
        autoAdvance: true,
        title: "Which of these feels closest to where you are right now?",
        // presentation only: A1-style cards, single-select. Copy verbatim —
        // `value` is the exact string a5PersonaMap is keyed by, so every
        // persona lookup keeps resolving.
        cards: true,
        options: [
          { value: "I don’t feel like myself anymore", icon: "user" },
          { value: "I’ve tried different things and nothing has felt sustainable", icon: "refresh" },
          // Restored at position 3 per the Vf spec (7 options). It was removed
          // on 2026-08-06; a5PersonaMap kept its `labsSeeker` entry throughout,
          // so the persona lookup already resolves.
          { value: "I know something feels off, but I’m not sure what", icon: "help" },
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
        // Vf C-WL.1 — "Single-select, with an inline conditional reveal".
        // SINGLE-select now (it was multi-select chips), so the answer is a
        // STRING, not an array — see journeyBullet() in the logic, which reads
        // it directly rather than by index.
        //
        // The former B1.2 ("Have you tried any weight-loss medication before?")
        // and B1.3 ("What medications have you taken in the past?") are DELETED
        // and merged in here: the last two options already state that the person
        // has used medication, so the Yes/No gate asked nothing new.
        //
        // autoAdvance is deliberately ABSENT. A single-select screen normally
        // jumps on the pick (client request 2), but here a pick can OPEN the
        // reveal — jumping would take the sub-question away before it could be
        // answered. The flow advances only on the non-revealing options; see
        // setSingle's b11RevealValues check.
        id: "B1.1", block: "B", branch: "B1", type: "journey", label: "b1-1-journey",
        cards: true, // presentation only: A1-style option cards
        title: "What best describes your weight loss journey so far?",
        // Brand-name clarifiers (Ozempic/Wegovy/Zepbound/Mounjaro) pending legal approval — leave out.
        options: [
          { value: "Just starting to explore options", icon: "compass" },
          { value: "Tried many diets or lifestyle programs before", icon: "refresh" },
          { value: "Currently using Semaglutide or Tirzepatide and want better support", icon: "syringe" },
          { value: "Used Semaglutide or Tirzepatide before and stopped", icon: "pill" },
        ],
        // The inline reveal. Rendered on this same screen, below the options,
        // whenever the selected value is in b11RevealValues.
        reveal: {
          title: "Which medication?",
          options: [
            { value: "Semaglutide", icon: "syringe" },
            { value: "Tirzepatide", icon: "syringe" },
            { value: "Another GLP-based medication (GLP-Squared, Retatrutide)", icon: "pill" }, // verify product name against source doc
            { value: "Others", icon: "help" },
          ],
        },
      },
      {
        // The qualify funnel's step 6 (client, 2026-10-01: "it shouldn't say
        // placeholder … same logic … with your styling"). One screen, three
        // questions that open in turn — dose, then when it was last taken, then
        // how to continue — plus the optional details box. Copy and values are
        // the reference's. Shown only for the two medications the reference
        // has ladders for; "Another GLP-based medication" and "Others" skip it.
        // The answer is an object: { dose, lastTaken, continuePlan, details }.
        id: "B1.4", block: "B", branch: "B1", type: "meds", label: "b1-4-dose",
        title: "Which dose most closely matches your most recent weekly dose?",
        titleByMed: {
          "Semaglutide": "Which dose most closely matches your most recent weekly dose of semaglutide?",
          "Tirzepatide": "Which dose most closely matches your most recent weekly dose of tirzepatide?",
        },
        doses: {
          "Semaglutide": [
            { value: "0.25mg", label: "Semaglutide 0.25 mg" },
            { value: "0.5mg", label: "Semaglutide 0.50 mg" },
            { value: "1mg", label: "Semaglutide 1 mg" },
            { value: "1.5mg", label: "Semaglutide 1.5 mg" },
            { value: "2mg", label: "Semaglutide 2 mg" },
            { value: "2.5mg", label: "Semaglutide 2.5 mg" },
            { value: "not_sure", label: "Semaglutide - Unknown" },
          ],
          "Tirzepatide": [
            { value: "2.5mg", label: "Tirzepatide 2.5 mg" },
            { value: "5mg", label: "Tirzepatide 5 mg" },
            { value: "7.5mg", label: "Tirzepatide 7.5 mg" },
            { value: "10mg", label: "Tirzepatide 10 mg" },
            { value: "12.5mg", label: "Tirzepatide 12.5 mg" },
            { value: "15mg", label: "Tirzepatide 15 mg" },
            { value: "not_sure", label: "Tirzepatide - Unknown" },
          ],
        },
        lastTaken: {
          title: "How long has it been since you last took this medication?",
          options: ["Less than 1 week ago", "1-2 weeks ago", "2-4 weeks ago", "1-3 months ago", "More than 3 months ago"],
        },
        continuePlan: {
          title: "How would you like to continue your treatment?",
          options: ["Continue at the same dose", "Continue at a different dose", "Switch to a different medication", "Not sure yet - ask my clinician"],
        },
        details: {
          label: "If you've tried any medications, you can share details below (optional).",
          placeholder: "e.g., Phentermine 15 mg daily",
        },
        // The reference's step-6 field values per medication, for the payload.
        payloadMedication: {
          "Semaglutide": { medication: "Yes, I've taken Semaglutide (Ozempic or Wegovy)", prefix: "semaglutide" },
          "Tirzepatide": { medication: "Yes, I've taken Tirzepatide (Mounjaro or Zepbound)", prefix: "tirzepatide" },
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
          // Vf merges the former "Not seeing progress" + "Low energy or
          // fatigue" into this one option — see b15InsertValues, which still
          // lists both legacy strings so saved sessions keep routing.
          { value: "Not seeing progress or feeling low on energy", icon: "trendingDown" },
          { value: "Not having enough support", icon: "users" },
          { value: "Not knowing what’s right for my body", icon: "help" },
          { value: "Feeling judged or dismissed", icon: "heart" },
          // New in Vf — no equivalent existed in the v4 build.
          { value: "Managing side effects or questions", icon: "pill" },
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
      // B2.2 ("What would better energy help you do?") is DELETED per the Vf
      // spec — its intent is covered by A4 (Feel More Of), which already feeds
      // the Result. ⚠️ The spec wants the energy path's "Why This Path May Fit"
      // bullet re-sourced from A4 + B2.1; that needs copy-team wording, so for
      // now the bullet is simply dropped and the remaining bullets + the
      // <2-bullet fallback cover the screen. See ASSESSMENT-VF-PLAN.md §2.2.
      {
        id: "B2.3", block: "B", branch: "B2", type: "list", label: "b2-3-cross-sell",
        autoAdvance: true,
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
      // The standalone B3.1 interest screen is DELETED per the Vf spec: its
      // only load-bearing answer was the exit option, which now lives inline
      // as the last option on B3.2 (see b32SkipValue).
      {
        id: "B3.2", block: "B", branch: "B3", type: "chips", label: "b3-2-insight-areas",
        cards: true, // presentation only: A1-style option cards
        title: "Which areas would you most like more insight into?",
        // Vf: 4 options. Hormones + Nutrient levels merge into one; "General
        // health markers" is dropped; the exit option arrives from B3.1.
        options: [
          { value: "Biological Age", icon: "clock" },
          { value: "Inflammation", icon: "flame" },
          { value: "Hormones & Nutrient Levels", icon: "waves" },
          { value: "Not sure yet / not interested right now", icon: "ban" },
        ],
      },
      {
        // Asked only when the medical screens are NOT on the path (client,
        // 2026-10-01: "get rid of that … one pager like this one"): with them,
        // H17's "When was the last time you had Lab Tests done?" asks it, and
        // the Labs panel note reads that answer instead (asmtV4LabsPanelNote).
        id: "B3.3", block: "B", branch: "B3", type: "list", label: "b3-3-recent-labs",
        autoAdvance: true,
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
      // The B4.1 familiarity screen is DELETED per the Vf spec — it fed no
      // routing, so nothing downstream referenced its answer.
      {
        id: "B4.2", block: "B", branch: "B4", type: "chips", label: "b4-2-matters-most",
        cards: true, // presentation only: A1-style option cards
        title: "What matters most to you when exploring advanced wellness options?",
        // Vf: 6 options — "Safety and legitimacy" and "Avoiding unregulated
        // sources" merge into one.
        options: [
          { value: "Product transparency", icon: "search" },
          { value: "Safety, legitimacy, and avoiding unregulated sources", icon: "shield" },
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
        // not a scene, so it is contained and floats free of any card — it is
        // the one image in the set that actually depicts "you and your care
        // team".
        pageAccent: true,
        image: "wieght_loss_md.webp", // filename typo is upstream; the file is named this on disk
        imageCutout: true,
        imageAlt: "A hand holding a phone showing a video call with a clinician in a white coat.",
        title: "This Stays Between You And Your Care Team",
        supportingLine: "Provider-guided care. Personalized recommendations. Ongoing support.",
        cta: "Continue.",
      },
      // ---- Medical intake (client, 2026-10-01) ----
      // Replaces the Health History / Full Picture / Consent placeholders.
      // Weight-loss path only (asmtV4MedicalApplies). type "form": a screen of
      // `items`, each stored under its reference field name inside the screen's
      // answer object, e.g. answers.H11 = { healthConditions: [...] }.
      //   kind "multi"    checkbox rows; `none` is exclusive both ways
      //   kind "single"   radio rows; `followUp` opens a required text box
      //   kind "text"     optional free text
      //   kind "consents" every box required; `also` = hidden twin values the
      //                   reference records with the same tick
      //   kind "consent"  one required box, shown only for its screening `band`
      // `dq` = the reference's disqualify rule: `safe` (anything else picked
      // disqualifies) or `values` (picking one of these disqualifies).
      {
        // The reference's step 7 consents. Only on the path when the age + BMI
        // band asks for one, and then only that band's box shows.
        id: "H7", block: "C", type: "form", label: "h7-acknowledge",
        title: "Please read and acknowledge before continuing",
        items: [
          {
            key: "elderly_consent", kind: "consent", band: "elderly",
            body: "We would like to make sure you are fully aware of some important considerations regarding GLP-1 medications, especially for older adults. These medications, while effective for weight loss and metabolic health, can sometimes cause gastrointestinal side effects like nausea, vomiting, and diarrhea. In older patients, these symptoms can lead to dehydration and may have an impact on kidney function, particularly if you have known kidney issues. Additionally, GLP-1 medications can occasionally cause dizziness or balance problems, which could raise the risk of falls. Appetite suppression and rapid weight loss may increase the risk of frailty, weakness, or malnutrition. Muscle wasting and bone demineralization is also a concern with rapid or aggressive weight loss. This is compounded in the elderly. It's important that your doctor is aware you are starting this medication so they can help monitor your health during treatment. If you haven't spoken with your primary care provider yet, I recommend sharing your plan with them before starting therapy.",
            label: "I have read and understand the considerations above.",
          },
          {
            key: "metabolic_consent", kind: "consent", band: "metabolic",
            label: "I acknowledge that with this BMI I am using these medications for metabolic health, anti-inflammatory, and better eating habits, but not for weight loss primarily.",
          },
        ],
      },
      {
        id: "H11", block: "C", type: "form", label: "h11-health-screening",
        title: "Do any of these apply to you?",
        tag: "Final health check",
        supportingLine: "*Select all that apply & click \"Continue\" below",
        items: [{
          key: "healthConditions", kind: "multi", none: NONE_THESE, dq: { safe: [NONE_THESE] },
          options: [
            NONE_THESE,
            "End-stage kidney disease (on or about to be on dialysis)",
            "End-stage liver disease (cirrhosis)",
            "Current suicidal thoughts and/or prior suicidal attempt",
            "Cancer (active diagnosis, active treatment, or in remission or cancer-free for less than 5 continuous years - does not apply to non-melanoma skin cancer that was considered cured via simple excision)",
            "History of organ transplant on anti-rejection medication",
            "Severe gastrointestinal condition (gastroparesis, blockage, inflammatory bowel disease)",
            "Current diagnosis of or treatment for alcohol, opioid, or substance use disorder/dependence",
            "Have or had an eating disorder (like anorexia or bulimia)",
          ],
        }],
      },
      {
        id: "H12", block: "C", type: "form", label: "h12-medical-history",
        title: "Have you experienced or been diagnosed with any of the following?",
        tag: "Final health check",
        supportingLine: "*Select all that apply & click \"Continue\" below",
        footnote: "HIPAA-protected. Only visible to your clinician.",
        items: [{
          // The reference's one exception: type 2 diabetes NOT on insulin is safe.
          key: "healthConditionsAdditional", kind: "multi", none: NONE_BELOW,
          dq: { safe: [NONE_BELOW, "Type 2 diabetes (not on insulin)"] },
          options: [
            NONE_BELOW,
            "Current symptomatic gallstones",
            "Diabetic Retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, or blindness",
            "History of glucose-6-phosphate dehydrogenase (G6PD) deficiency",
            "Hypoglycemia (low blood sugar)",
            "Pancreatitis or Pancreatic Cancer",
            "Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2",
            "QT prolongation or other heart rhythm disorder (including Heart Arrhythmia)",
            "Type 1 diabetes",
            "Type 2 diabetes (not on insulin)",
            "Type 2 diabetes (on insulin)",
          ],
        }],
      },
      {
        // The live reference records step 13 without disqualifying; Chime
        // disqualifies here like steps 11 and 12 (Luis, 2026-10-01).
        id: "H13", block: "C", type: "form", label: "h13-more-conditions",
        title: "Do any of these apply to you?",
        tag: "Final health check",
        supportingLine: "*Select all that apply & click \"Continue\" below",
        items: [{
          key: "moreHealthConditions", kind: "multi", none: NONE_THESE, dq: { safe: [NONE_THESE] },
          options: [
            NONE_THESE,
            "Active Gall Bladder Disease",
            "Hypertension (high blood pressure)",
            "Sleep apnea",
            "High cholesterol or triglycerides",
            "Severe Depression",
            "Liver disease, including fatty liver",
            "Congestive heart failure",
            "Urinary stress incontinence",
            "Polycystic ovarian syndrome (PCOS)",
            "Clinically proven low testosterone",
            "Osteoarthritis",
            "Acid reflux",
            "Asthma/reactive airway disease",
            "Constipation",
            "Coronary artery disease or heart attack/stroke in last 2 years",
            "Hospitalization within the last 1 year",
            "Tumor/infection in brain/spinal cord",
          ],
        }],
      },
      {
        id: "H14", block: "C", type: "form", label: "h14-last-questions",
        title: "Three last questions before your review",
        tag: "Final health check",
        supportingLine: "*Select one answer for each",
        items: [
          { key: "takenPainMedicationsOrStreetDrugs", kind: "single", options: ["Yes", "No"], dq: { values: ["Yes"] },
            title: "Within the last 3 months, have you taken opiate pain medications and/or opiate-based street drugs?" },
          { key: "gastricBypass6Months", kind: "single", options: ["Yes", "No"], dq: { values: ["Yes"] },
            title: "Have you had gastric bypass surgery in the past 6 months?" },
          { key: "heart_arrhythmia", kind: "single", options: ["Yes", "No"], dq: { values: ["Yes"] },
            title: "Do you now, or have you ever had, any heart arrhythmia or irregular heartbeat?" },
        ],
      },
      {
        // The one-page "full picture" (reference step 17). Every question is
        // required, and so is the text box behind each "Yes" follow-up.
        id: "H17", block: "C", type: "form", label: "h17-full-picture",
        title: "Let's make sure our providers have the full picture",
        supportingLine: "*Please answer each question below",
        items: [
          { key: "bloodPressure", kind: "single", title: "What is your average blood pressure range?",
            options: ["Less than 120/80 (Normal)", "120-129/less than 80 (Elevated)", "130-139/80-89 (High Stage 1)", "140/90 or higher (High Stage 2)"] },
          { key: "restingHeartRate", kind: "single", title: "How about your average resting heart rate?",
            options: ["Less than 60 beats per minute (Slow)", "60-100 beats per minute (Normal)", "101-110 beats per minute (Slightly Fast)", "More than 110 beats per minute (Fast)"] },
          { key: "lastMedicalEvaluation", kind: "single", title: "When was the last time you had an in-person Medical Evaluation?",
            options: ["Less than a year ago", "1 to 2 years ago", "More than 2 years ago"] },
          { key: "lastLabTests", kind: "single", title: "When was the last time you had Lab Tests done?",
            options: ["Less than a year ago", "1 to 2 years ago", "More than 2 years ago"] },
          { key: "prescriptionMedications", kind: "single", title: "Are you currently taking any Prescription Medications?",
            options: ["Yes - Please list the names and dosages", "No - I affirm I'm not taking any medications"],
            followUp: { when: "Yes - Please list the names and dosages", key: "prescriptionMedications_info",
              label: "Please list your medications, strengths, and how often you take them." } },
          { key: "medicationAllergies", kind: "single", title: "Do you have any medication allergies?",
            options: ["Yes - Please list your allergies and any known reactions", "No - I affirm I have no known drug allergies"],
            followUp: { when: "Yes - Please list your allergies and any known reactions", key: "medicationAllergies_info",
              label: "Please list your allergies and any known reactions." } },
          { key: "additionalDocInformation", kind: "single", title: "Do you have any further information which you would like our medical team to know?",
            options: ["Yes", "No"],
            followUp: { when: "Yes", key: "additionalDocInformation_info",
              label: "What would you like our medical team to know?" } },
        ],
      },
      {
        // Reference step 18, with the consents at the bottom (client: "put these
        // same check boxes at the bottom of that page, that'll be our consents").
        id: "H18", block: "C", type: "form", label: "h18-medication-check",
        title: "Are you allergic to any of the following medications?",
        tag: "Medication check",
        supportingLine: "*Select all that apply & click \"Continue\" below",
        items: [
          { key: "glp1_allergies", kind: "multi", none: "I am NOT allergic to any of these medications",
            dq: { safe: ["I am NOT allergic to any of these medications"] },
            options: [
              "I am NOT allergic to any of these medications",
              { value: "semaglutide", label: "Semaglutide" },
              { value: "tirzepatide", label: "Tirzepatide" },
              { value: "liraglutide", label: "Liraglutide" },
              { value: "dulaglutide", label: "Dulaglutide" },
            ] },
          { key: "current_glucose_medications", kind: "multi", none: "I am NOT on any of these medications",
            dq: { safe: ["I am NOT on any of these medications"] },
            title: "Please affirm you are not currently on any of the following medications",
            help: "*Select all that apply & click \"Continue\" below",
            options: [
              "I am NOT on any of these medications",
              { value: "insulin", label: "Insulin" },
              { value: "glimepiride_amaryl", label: "Glimepiride (Amaryl)" },
              { value: "glipizide", label: "Glipizide (Glucotrol and Glucotrol XL)" },
              { value: "glyburide", label: "Glyburide (Micronase, Glynase, and DiaBeta)" },
              { value: "sitagliptin", label: "Sitagliptin" },
              { value: "saxagliptin", label: "Saxagliptin" },
              { value: "linagliptin", label: "Linagliptin" },
              { value: "alogliptin", label: "Alogliptin" },
            ] },
          { key: "doctor_note", kind: "text", title: "Is there anything you want your doctor to know?",
            help: "Optional — share any additional context for your clinician" },
          { key: "consents", kind: "consents", title: "A few things we need you to confirm",
            help: "*All boxes must be checked to continue",
            options: [
              { value: "truthfulness_consent", also: ["age_consent"],
                label: "I confirm that I am at least 18 years of age and that all information I have provided in this questionnaire is accurate and complete to the best of my knowledge." },
              { value: "glp1_glp1_gip_consent",
                label: "I understand the potential benefits, risks, and side effects of GLP-1 and GLP-1/GIP medications and consent to treatment if deemed appropriate by my clinician." },
              { value: "informed_consent",
                label: "I have read and understood the terms of telehealth treatment and voluntarily consent to a clinical evaluation based on the information I have provided." },
            ] },
        ],
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
    // The weight-loss result opens the GLP-1 product page (chime-glp/, the
    // mainglp price points) instead of account creation (client, 2026-10-01:
    // "I don't know why this says create account … create … a checkout page").
    resultCtaByPath: { weightLoss: "Choose My Treatment" },

    // Offer prices. Readiness pass (2026-09-25): the placeholders are gone
    // from production. Where the cart sells the product, the figure is the
    // cart's own lowest per-month rate, so the price on this screen is one the
    // next screen shows too (ui_kits/cart/cart-data.js):
    //   weight loss — since 2026-10-01 the result opens chime-glp/, whose lowest
    //                 rate is Semaglutide 6 months, $1,194 / 6 = $199
    //   NAD+        — 3 months + 1 free, $420 / 4 = $105
    // Everything else has no approved price anywhere on the site yet, so it
    // shows NONE (null) rather than a made-up one; the result screen renders
    // the row without a figure. Update both files together.
    // Key order is still the stable add-on display order — do not reorder.
    pricing: {
      plans: {
        weightLoss: { price: "From $199/mo" },
        energy: { price: "From $105/mo" },
        labs: { price: null },
        advanced: { price: null },
        coaching: { price: null },
      },
      addOns: {
        "NAD+": { price: "From $105/mo", medication: true },
        "Coaching": { price: null, medication: false },
        "App": { price: null, medication: false },
        "Labs": { price: null, medication: false },
        "Sermorelin": { price: null, medication: true },
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
