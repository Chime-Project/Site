// Chime Health — Assessment v15 (Weight Loss launch edition) flow config.
//
// Source of truth: "Chime_Health_Weight_Loss_Assessment_Proposal_v15.pdf"
// (Isela, 2026-09-28, Asana 1218871561721263; the full edition is
// "…Redesign_Proposal_v15.pdf"). Both are untracked in uploads/.
// Every title, option and consent text below is VERBATIM from that document.
// Do not rewrite it here. Copy the doc does not supply is marked
// `draft: true` (rendered with a visible "Draft" tag) and listed in the
// header of assessment-v15.html.
//
// ⚠️ The document itself says none of its legal findings or consent texts
// are approved ("must be reviewed and approved by Chime's healthcare
// regulatory counsel and Medical Director before anything is built or
// published"). That is why this build lives on its own unlinked, noindex
// page (assessment-v15.html) and the live assessment (chimeAssessment.html,
// ui_kits/chimeAssessment/) is untouched.
//
// Loaded as a plain <script> before the logic + component files, and required
// by the Node test runner, hence the globalThis-safe wrapper (zero DOM refs).
//
// Blocks: P0 Welcome & Consent → A Discovery → B Standard Intake →
//         C Weight Loss → D Info, ID & Consent → E Result.

(function (g) {

  // Residence (P0.1) and shipping (D1) states: the 50 states + DC.
  var US_STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN",
    "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
    "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
    "VT","VA","WA","WV","WI","WY",
  ];

  // Consent texts, Section 6 of the doc. `draft` = the doc's own "DRAFT —
  // pending Legal/Medical Director review"; FINAL texts carry no flag.
  var CONSENTS = {
    truthfulness: {
      title: "Truthfulness Attestation", draft: true,
      body: [
        "By continuing, I confirm that the information I have provided in this assessment is true, complete, and accurate to the best of my knowledge. I understand that my care team relies on this information to determine whether treatment is safe and appropriate for me, and that leaving out information — or providing inaccurate information — could create a risk to my health.",
        "I agree to update my care team promptly if anything I’ve shared changes, including new diagnoses, new medications, new allergies, or a change in pregnancy status.",
      ],
      ack: "I confirm the information above is true and complete.",
    },
    telehealth: {
      title: "Telehealth Informed Consent", draft: true,
      body: [
        "Chime Health provides care through telehealth — meaning your provider evaluates you remotely, using the information you provide and, in some cases, a live video visit. Telehealth has real benefits, and a few limits: your provider cannot physically examine you, technology can occasionally fail or disconnect, and not every condition can be safely evaluated at a distance.",
        "You always have the right to request in-person or live-video care instead of asynchronous review, and your provider will tell you if your situation requires it. Your provider is a licensed healthcare professional in the state where you are located at the time of your visit. You can reach your care team anytime through your Chime portal.",
        "If you are experiencing a medical emergency, call 911. If you are in crisis, call or text 988.",
        "Your information is handled according to our Notice of Privacy Practices and Privacy Policy, which explain what we collect, how it’s used, and your rights.",
      ],
      ack: "I have read and agree to this Telehealth Informed Consent.",
    },
    glp1: {
      title: "GLP-1 / GLP-1-GIP Consent", draft: true,
      body: [
        "The GLP-1 or GLP-1/GIP medication your provider may prescribe is compounded specifically for you by a licensed U.S. pharmacy. Compounded medications are not FDA-approved. The FDA does not review compounded drugs for safety, effectiveness, or quality the way it reviews approved drugs. Your provider will also discuss FDA-approved options with you.",
        "Boxed Warning: GLP-1 and GLP-1/GIP medications carry a boxed warning for thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), based on findings in animal studies. Do not use this medication if you or a family member have a personal or family history of MTC, or if you have Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
        "Other risks include: pancreatitis; gallbladder disease; low blood sugar (hypoglycemia), especially with insulin or sulfonylurea medications; kidney injury, often related to dehydration from nausea, vomiting or diarrhea; gastrointestinal side effects; possible worsening of diabetic eye disease; risk of slowed digestion affecting anesthesia or sedation; and reduced effectiveness of oral birth control with some medications in this class (ask your provider about backup contraception).",
        "Correct dosing matters. Your provider determines your starting dose and any changes — never adjust your dose on your own. Store your medication as instructed and use the correct syringe or pen device to avoid dosing errors.",
        "If you become pregnant or are planning to become pregnant, tell your provider right away. Report any side effects to your care team, and you can also report them to the FDA through MedWatch.",
      ],
      ack: "I have read and understand the risks of this medication and agree to this Consent.",
    },
    gallbladder: {
      title: "Gallbladder Consent", draft: true,
      body: [
        "You’ve told us about a history of gallbladder disease or gallstones. GLP-1 and GLP-1/GIP medications can increase the risk of gallbladder problems, including gallstones and inflammation of the gallbladder. Your provider may ask for recent labs or medical records before prescribing, and agreeing to this consent does not guarantee that a prescription will be approved.",
        "Seek urgent care if you experience severe abdominal pain, fever, yellowing of the skin or eyes, or persistent vomiting.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    cholecystectomy: {
      title: "Cholecystectomy Consent", draft: true,
      body: [
        "You’ve told us you’ve had your gallbladder removed. This does not disqualify you from treatment, but it’s important for your provider to know, since digestive side effects can sometimes feel different after gallbladder removal. Your provider may ask for related medical records before prescribing.",
        "Seek urgent care if you experience severe abdominal pain, fever, or persistent vomiting.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    thyroid: {
      title: "Thyroid Consent", draft: true,
      body: [
        "You’ve told us about a thyroid condition (such as hypothyroidism, hyperthyroidism, or another thyroid issue). This is different from a personal or family history of medullary thyroid carcinoma (MTC) or MEN 2, which would disqualify you from this medication entirely. Your provider will review your history and may request recent labs before prescribing. Consent here does not guarantee a prescription.",
        "Seek urgent care for a rapidly growing neck lump, difficulty swallowing or breathing, or a hoarse voice that doesn’t go away.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    triglyceride: {
      title: "Triglyceride / Pancreatitis-Risk Consent", draft: true,
      body: [
        "You’ve told us about triglycerides over 600 at some point, which is associated with a higher risk of pancreatitis. GLP-1/GIP medications themselves carry a risk of pancreatitis, so this combination requires closer review. Your provider may require recent lab work before prescribing, and consent here does not guarantee a prescription.",
        "Seek emergency care for severe abdominal pain that spreads to your back, especially with nausea or vomiting.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    hypoglycemia: {
      title: "Hypoglycemia-Risk Consent", draft: true,
      body: [
        "You’ve told us about a history of hypoglycemia (low blood sugar). GLP-1/GIP medications can increase this risk further, especially combined with insulin or certain diabetes medications. Your provider will review your current medications and may adjust your treatment plan or require closer monitoring. Consent here does not guarantee a prescription.",
        "Seek urgent care for confusion, fainting, seizures, or an inability to keep food down during a low-blood-sugar episode.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    renal: {
      title: "Renal Function Consent", draft: true,
      body: [
        "You’ve told us about Chronic Kidney Disease Stage 3 or higher. GLP-1/GIP medications can occasionally cause kidney injury, often related to dehydration from side effects like vomiting or diarrhea. Your provider may require recent kidney function labs before prescribing and will monitor you more closely during treatment. Consent here does not guarantee a prescription.",
        "Seek urgent care for a significant decrease in urination, swelling, or confusion.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    siadh: {
      title: "SIADH / Hyponatremia Consent", draft: true,
      body: [
        "You’ve told us about a history of Syndrome of Inappropriate Antidiuretic Hormone (SIADH) or low sodium levels (hyponatremia). Your provider will review this history carefully, as it may affect which treatments are appropriate and how closely you’re monitored. Consent here does not guarantee a prescription.",
        "Seek urgent care for confusion, severe headache, nausea, or seizures.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    hepatic: {
      title: "Hepatic Function Consent", draft: true,
      body: [
        "You’ve told us about liver disease, including non-alcoholic fatty liver disease (NAFLD). Your provider will review your liver health as part of deciding whether treatment is appropriate and may request recent liver function labs. Consent here does not guarantee a prescription.",
        "Seek urgent care for yellowing of the skin or eyes, severe abdominal pain, or confusion.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    cardiovascular: {
      title: "Cardiovascular Consent", draft: true,
      body: [
        "You’ve told us about a heart condition. Your provider will review your cardiovascular history as part of your overall evaluation, since some medications and dosing decisions may need to be adjusted based on heart health. Consent here does not guarantee a prescription.",
        "Seek emergency care for chest pain, shortness of breath, or fainting.",
      ],
      ack: "I have read and agree to this Consent.",
    },
    elderly: {
      title: "65+ (Elderly) Consent", draft: true,
      body: [
        "Because you are 65 or older, there are a few additional things to know before continuing. Older adults may have a higher risk of dehydration, low blood sugar (hypoglycemia), falls, and interactions with other medications you may be taking. Your provider will take extra care reviewing your full health history and current medications.",
        "We recommend keeping your primary care provider informed about any new treatment you start through Chime.",
      ],
      ack: "I have read and agree to this Consent, and understand the additional considerations that apply to my age group.",
    },
  };

  // C-WL.3.1 → the consent(s) each selection shows (doc's routing column).
  // Gallbladder is triggered twice (disease/removal AND current gallstones);
  // the logic de-duplicates, so it is shown once.
  var RELATIVE_CONSENTS = {
    "Triglycerides over 600 at any point": ["triglyceride"],
    "Current symptomatic gallstones": ["gallbladder"],
    "Gallbladder disease or past removal of gallbladder": ["gallbladder", "cholecystectomy"],
    "Hypoglycemia": ["hypoglycemia"],
    "Chronic Kidney Disease Stage 3+": ["renal"],
    "Syndrome of Inappropriate Antidiuretic hormone": ["siadh"],
    "Hypothyroidism, Hyperthyroidism, or Thyroid Issues": ["thyroid"],
    "Liver disease (incl. NAFLD)": ["hepatic"],
    "Heart disease": ["cardiovascular"],
  };

  g.CHIME_ASSESSMENT_V15 = {

    // Stored with every consent record. The server adds IP + user agent to
    // complete the doc's consent ledger (version, timestamp, IP).
    consentVersion: "v15-draft-2026-09-28",

    blocks: [
      { id: "P0", title: "Welcome" },
      { id: "A", title: "Discovery" },
      { id: "B", title: "Standard Intake" },
      { id: "C", title: "Your Path" },
      { id: "D", title: "Info, ID & Consent" },
      { id: "E", title: "Result" },
    ],

    states: US_STATES,

    // P0.1: "Under 18 (19 in AL/NE — counsel to confirm) → exit, nothing
    // stored." Built as written.
    minAge: 18,
    minAgeByState: { AL: 19, NE: 19 },

    // P0.1: "State not served → waitlist." The doc names no unserved state
    // (DS-6 is still to be written), so the list is empty and the waitlist
    // exit is reachable only by adding one here.
    unservedStates: [],

    // P0.1: "State sets modality: Async · Async+records · Live video."
    // Open Item 10: "Build before launch; treat unverified states as
    // video-required." No state is verified yet, so every state defaults to
    // video, which is what puts D1.6 in the queue. Add verified states here
    // as "async" or "asyncRecords" to take it out.
    stateModality: {},
    defaultModality: "video",

    // A1 goals that open the Weight Loss path (doc: "Lose weight" or
    // "Already on a GLP-1" → Block C shows the Weight Loss path).
    wlGoals: ["Lose weight", "I’m already on a GLP-1 and want better support"],

    // A2.1 → A2.2 is asked only of this answer ("Female → A2.2. Male → A2.3").
    asksPregnancy: "Female",

    // A2.3 GREEN LIGHT (verbatim): "Age & BMI 18–64 with BMI > 19.5 · Age 65+
    // with BMI > 22 & Elderly Consent". Strictly greater than.
    greenLight: { elderlyAge: 65, minBmi: 19.5, minBmiElderly: 22 },

    // C-WL.0 (NEW, BLOCKS BUILD — threshold set by the Medical Director, Open
    // Item 11). The doc's recommendation, built as the default: BMI ≥ 30, or
    // BMI ≥ 27 with at least one weight-related condition (C-WL.3.2).
    // Exception: current GLP-1 patients (C-WL.7 ≠ None) continuing care.
    indication: { bmi: 30, bmiWithCondition: 27 },

    // Sane-range validation for A2.3 (kind tone, never alarm language).
    bodyRanges: { weightMin: 50, weightMax: 700, heightInMin: 36, heightInMax: 96 },

    // A2.4 · revised tiers. INTERNAL ids/ranges — never rendered. Only users
    // who passed A2.3 see this, so the floor is 19.5 (22 at 65+).
    bmiTiers: [
      {
        id: "balanced", min: 0, max: 25,
        headline: "You’re Off To A Strong Start.",
        message: "Your numbers sit in a balanced range — a solid foundation. If you’d like a deeper look, lab work can give you a clearer picture of key health markers like inflammation, hormones and nutrients.",
      },
      {
        id: "room", min: 25, max: 30,
        headline: "There’s Room To Feel Even Better.",
        message: "Your answers suggest there may be an opportunity to focus on your health goals. A licensed provider will look at your full health history to help you decide what’s right for you.",
      },
      {
        id: "build", min: 30, max: Infinity,
        headline: "Let’s Build A Plan Around This.",
        message: "You don’t have to figure this out on your own. A licensed provider will review your answers and help you choose next steps — which may or may not include medication.",
      },
    ],

    consents: CONSENTS,
    relativeConsents: RELATIVE_CONSENTS,

    // DS-1, persistent on every assessment screen.
    footerNotice: "Not for emergencies. If you’re having a medical emergency, call 911. If you’re in crisis, call or text 988.",
    footerLinks: [
      { label: "Privacy", href: "privacy-policy.html" },
      { label: "Terms", href: "terms-conditions.html" },
      // No language-assistance page exists yet (DS-11) — stand-in target.
      { label: "Language assistance", href: "faq.html", standIn: true },
    ],

    // ---------------------------------------------------------------------
    // Screens. `block` feeds the progress bar; `label` = data-screen-label.
    // autoAdvance only on A2.1 and A4 (doc: "never on consent, disqualifying,
    // dosing, multi-select, free-text or upload screens").
    // `reveal`: picking one of `when` opens a free-text field on the same
    // screen, stored under "<id>__text".
    // `exclusive`: the option that clears every other pick, and vice versa.
    // ---------------------------------------------------------------------
    screens: [

      // ---- P0 · Welcome & Consent ----
      {
        id: "P0.0", block: "P0", type: "phrase", label: "p0-0-welcome",
        title: "Let’s Find Your Starting Point",
        supportingLine: "A few minutes of questions. A licensed provider reviews every assessment — treatment is prescribed only if it’s medically appropriate for you.",
        cta: "Start My Assessment.",
      },
      {
        id: "P0.1", block: "P0", type: "basics", label: "p0-1-basics",
        title: "First, A Couple Of Basics",
        dobLabel: "What’s your date of birth?",
        stateLabel: "Which state do you live in?",
        helper: "Care depends on the state you’re in when you receive it.",
      },
      {
        id: "P0.2", block: "P0", type: "privacy", label: "p0-2-privacy",
        title: "Your Privacy, Before We Begin",
        supportingLine: "Your answers help a licensed provider decide whether treatment may be right for you. Your health information is protected, and we never sell it.",
        // FINAL (per V2 research) — final wording still depends on Open Item 9.
        // `links` turn the named documents into links to the site's own pages.
        boxes: [
          { key: "npp", text: "I have read the Notice of Privacy Practices and the Consumer Health Data Privacy Policy.",
            links: [{ text: "Notice of Privacy Practices", href: "hipaa-notice.html" },
                    { text: "Consumer Health Data Privacy Policy", href: "consumer-health-data-privacy-policy.html" }] },
          { key: "terms", text: "I agree to the Terms of Use.",
            links: [{ text: "Terms of Use", href: "terms-conditions.html" }] },
          { key: "share", text: "I consent to Chime Health sharing my health information with its service providers, affiliated providers and partner pharmacies only as needed to deliver my care. I can withdraw this consent anytime." },
        ],
        declineLabel: "I don’t agree",
      },

      // ---- A · Discovery ----
      {
        id: "A1", block: "A", type: "cards", label: "a1-goal",
        hero: true,
        title: "Your Goal Is Our Goal",
        supportingLine: "Let’s set up a goal for this journey.",
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
        // STAND-IN, not in v15-WL: the edition defines only the Weight Loss
        // route, so someone who picks no weight goal needs somewhere to go.
        id: "A.SCOPE", block: "A", type: "exit", label: "a-scope",
        draft: true,
        title: "This Assessment Covers Weight Care",
        message: "Right now this assessment is for weight care. Assessments for our other paths are on their way.",
        ctas: [
          { label: "Continue With Weight Care", action: "continue" },
          { label: "Back To Home", href: "index.html", variant: "secondary" },
        ],
      },
      {
        id: "A2.1", block: "A", type: "single", label: "a2-1-sex",
        cards: true, autoAdvance: true,
        title: "Sex Assigned At Birth",
        supportingLine: "We ask because it affects medication safety, dosing and lab ranges.",
        options: ["Female", "Male"],
        // Optional; never used for marketing. Stored as "A2.1__identity".
        identityLink: "Add how you identify",
      },
      {
        id: "A2.2", block: "A", type: "single", label: "a2-2-eligibility",
        cards: true, sensitive: true,
        title: "Are you currently pregnant or breastfeeding?",
        options: ["Yes", "No"],
      },
      {
        // The doc names this screen "BMI Eligibility Check"; the heading
        // shown is the plain ask, because the compliance rule keeps clinical
        // labels (BMI included) off the screen.
        id: "A2.3", block: "A", type: "body", label: "a2-3-bmi-check",
        title: "What’s Your Height And Weight?",
      },
      {
        id: "A2.3E", block: "A", type: "consent", label: "a2-3-elderly-consent",
        consent: "elderly",
      },
      {
        id: "A2", block: "A", type: "contact", label: "a2-contact",
        title: "A Few Details About You",
        // Optional, unchecked, not required to continue. FINAL text.
        optional: [
          { key: "sms", title: "SMS Marketing Consent",
            text: "Yes, text me. I agree to receive recurring automated marketing and reminder text messages from Chime Health at the number provided. Consent is not a condition of purchase. Message frequency varies. Msg & data rates may apply. Reply STOP to cancel, HELP for help. See SMS Terms and Privacy Policy." },
          { key: "personalized", title: "Health-Personalized Marketing",
            text: "Use my assessment answers to personalize the messages Chime Health sends me about my care options. I can turn this off anytime in Settings." },
        ],
      },
      {
        id: "A2.4", block: "A", type: "snapshot", label: "a2-4-quick-snapshot",
        title: "Let’s See Where You’re Starting From",
      },
      {
        id: "A2.5", block: "A", type: "password", label: "a2-5-password",
        title: "Create Your Password",
        // "Password field + email verification. MFA offered." The helper
        // lines are drafts; the account itself is created server-side.
        draft: true,
        emailNote: "We’ll send a code to your email to confirm it’s you.",
        mfaLabel: "Turn on two-step verification for extra security",
      },
      {
        id: "A3", block: "A", type: "multi", label: "a3-feel-more-of",
        bubbles: true,
        title: "What would you like to feel more of?",
        supportingLine: "Select all the options that feel right for you.",
        options: ["Energy", "Confidence", "Control", "Clarity", "Motivation", "Strength", "Focus", "Progress"],
      },
      {
        id: "A4", block: "A", type: "single", label: "a4-starting-point",
        cards: true, autoAdvance: true,
        title: "Which of these feels closest to where you are right now?",
        options: [
          { value: "I don’t feel like myself anymore", icon: "user" },
          { value: "I’ve tried different things and nothing has felt sustainable", icon: "refresh" },
          { value: "I know something feels off, but I’m not sure what", icon: "help" },
          { value: "I want to be proactive about my health", icon: "shield" },
          { value: "I want a more private and personalized experience", icon: "lock" },
          { value: "I want guidance from people who understand this journey", icon: "users" },
          { value: "I already know what I want, but I want a safer, more structured path", icon: "compass" },
        ],
      },
      {
        id: "A5", block: "A", type: "phrase", label: "a5-transition",
        pageAccent: true,
        image: "assess01.png",
        imageAlt: "A woman resting on her sofa in the evening, wrapped in a knit blanket, reading on her phone with a mug beside her.",
        title: "We’re In This Together",
        supportingLine: "A few more questions, tailored to exactly what you told us — nothing extra, nothing generic.",
        cta: "Continue.",
      },

      // ---- B · Standard Intake (legal verbatim) ----
      {
        id: "B1", block: "B", type: "single", label: "b1-blood-pressure",
        // New intro microcopy (creative-owned) before B1.
        intro: "These questions help your provider keep you safe. Your answers are never shared with advertising platforms, and we use them to personalize messages only if you choose to allow it.",
        title: "What is your Blood Pressure range?",
        options: ["Normal (<120/80)", "Elevated (120-129/<80)", "High stage 1 (130-139/80-89)", "High stage 2 (140+/90)", "I don’t know"],
      },
      {
        id: "B2", block: "B", type: "single", label: "b2-prescriptions",
        title: "Are you currently taking any prescription medications?",
        options: ["Yes — Please list the names and dosages", "No — I affirm I’m not taking any medications"],
        reveal: { when: ["Yes — Please list the names and dosages"], label: "Medication names and dosages" },
      },
      {
        id: "B3", block: "B", type: "single", label: "b3-allergies",
        title: "Do you have any medication allergies?",
        options: ["Yes — Please list your allergies and any known reaction", "No — I affirm I have no known drug allergies"],
        reveal: { when: ["Yes — Please list your allergies and any known reaction"], label: "Allergies and known reactions" },
      },
      {
        id: "B4", block: "B", type: "single", label: "b4-further-info",
        title: "Do you have any further information which you would like our medical team to know?",
        options: ["Yes — Please list your medical conditions", "No — I affirm I have no known medical conditions"],
        reveal: { when: ["Yes — Please list your medical conditions"], label: "Your medical conditions" },
      },
      {
        id: "B5", block: "B", type: "single", label: "b5-injuries-surgeries",
        title: "Have you had any injuries or surgeries within the last 6 months?",
        options: ["Yes", "No"],
        reveal: { when: ["Yes"], label: "Please provide details of the injuries or surgeries." },
      },
      {
        // REC. TO LEGAL: B6 split into B6a (medical) + B6b (mental health).
        id: "B6a", block: "B", type: "multi", label: "b6a-disqualifiers",
        title: "Have you ever had any of the following?",
        options: ["An organ transplant", "Type 2 diabetes requiring you to use insulin", "None of the above"],
        exclusive: "None of the above",
      },
      {
        id: "B6b", block: "B", type: "single", label: "b6b-mental-health",
        cards: true, sensitive: true,
        title: "Have you ever had thoughts of suicide or attempted suicide?",
        // The doc asks for "a short 'why we ask' line" and does not write it.
        supportingLine: "We ask everyone this so your provider can care for you safely. Your answer goes to your clinical record only and is never used for marketing.",
        supportingDraft: true,
        options: ["Yes", "No"],
      },
      {
        id: "B7", block: "B", type: "single", label: "b7-activity",
        // Proposed scale, for Legal approval (Open Item 2).
        proposed: true,
        title: "How Physically Active are you",
        options: ["Mostly inactive", "Lightly active (1–2 days/week)", "Moderately active (3–4 days/week)", "Very active (5+ days/week)"],
      },
      {
        id: "B8", block: "B", type: "selects", label: "b8-last-evaluation",
        // Proposed values, for Legal approval (Open Item 3).
        proposed: true,
        title: "When was the last time you had an in person medical evaluation including lab tests?",
        selects: [
          { key: "evaluation", label: "Medical Evaluation" },
          { key: "labs", label: "Lab Tests" },
        ],
        options: ["Within the last 6 months", "6–12 months ago", "1–2 years ago", "More than 2 years ago", "Never", "Not sure"],
      },
      {
        // NEW, REC. TO LEGAL. Optional — Continue works without an answer.
        id: "B9", block: "B", type: "single", label: "b9-primary-care",
        optionalAnswer: true,
        title: "Do you have a primary care provider?",
        options: ["Yes", "No", "Prefer not to say"],
        // "If Yes: optional consent to share a care summary with them." The
        // doc gives no wording for it.
        shareConsent: { when: "Yes", text: "Share a summary of my care with my primary care provider.", draft: true },
      },

      // ---- C · Weight Loss path ----
      {
        id: "C-WL.1", block: "C", type: "journey", label: "c-wl-1-journey",
        cards: true,
        title: "What best describes your weight loss journey so far?",
        options: [
          { value: "Just starting to explore options", icon: "compass" },
          { value: "Tried many diets or lifestyle programs before", icon: "refresh" },
          { value: "Currently using Semaglutide or Tirzepatide and want better support", icon: "syringe" },
          { value: "Used Semaglutide or Tirzepatide before and stopped", icon: "pill" },
        ],
        reveal: {
          when: [
            "Currently using Semaglutide or Tirzepatide and want better support",
            "Used Semaglutide or Tirzepatide before and stopped",
          ],
          title: "Which medication?",
          // Retatrutide / GLP-Squared removed (investigational, cannot be
          // compounded — never name it anywhere).
          options: ["Semaglutide", "Tirzepatide", "Another weight-loss medication (please specify)", "Other"],
          freeText: ["Another weight-loss medication (please specify)", "Other"],
        },
      },
      {
        id: "C-WL.2", block: "C", type: "multi", label: "c-wl-2-difficult",
        cards: true, maxSelections: 3,
        title: "What has felt most difficult about weight loss for you?",
        options: [
          { value: "Staying consistent", icon: "calendar" },
          { value: "Feeling hungry or craving food", icon: "utensils" },
          { value: "Not seeing progress or feeling low on energy", icon: "trendingDown" },
          { value: "Not having enough support", icon: "users" },
          { value: "Not knowing what’s right for my body", icon: "help" },
          { value: "Feeling judged or dismissed", icon: "heart" },
          { value: "Managing side effects or questions", icon: "pill" },
          { value: "Losing weight but gaining it back", icon: "refresh" },
        ],
      },
      {
        // Absolute exclusions → Variant D. REC. TO LEGAL: the MTC option.
        id: "C-WL.3", block: "C", type: "multi", label: "c-wl-3-exclusions",
        title: "Do any of these apply to you?",
        options: [
          "Gastroparesis", "Pancreatitis", "Pancreatic cancer", "Type 1 Diabetes",
          "Insulin-dependent diabetes", "Thyroid cancer", "Family history of thyroid cancer",
          "Personal or family history of MEN-2 syndrome", "Anorexia or bulimia",
          "Personal or family history of medullary thyroid carcinoma (MTC)",
          "None of the above",
        ],
        exclusive: "None of the above",
      },
      {
        // Relative contraindications → consent + provider review flag.
        id: "C-WL.3.1", block: "C", type: "multi", label: "c-wl-3-1-relative",
        title: "Have you experienced or been diagnosed with any of the following?",
        options: [
          "Triglycerides over 600 at any point", "Current symptomatic gallstones",
          "Gallbladder disease or past removal of gallbladder", "Hypoglycemia",
          "Chronic Kidney Disease Stage 3+", "Syndrome of Inappropriate Antidiuretic hormone",
          "Hypothyroidism, Hyperthyroidism, or Thyroid Issues", "Liver disease (incl. NAFLD)",
          "Heart disease", "None of the above",
        ],
        exclusive: "None of the above",
      },
      {
        // Qualifying comorbidities → no consent; feeds C-WL.0.
        id: "C-WL.3.2", block: "C", type: "multi", label: "c-wl-3-2-comorbidities",
        title: "Do any of these apply to you?",
        options: [
          "Hypertension", "Dyslipidemia", "Sleep apnea", "Osteoarthritis",
          "Mobility issues impacted by body weight", "GERD related to body weight",
          "PCOS with insulin resistance", "Metabolic Syndrome", "Prediabetes", "Type 2 Diabetes",
          "None of the above",
        ],
        exclusive: "None of the above",
      },
      {
        id: "C-WL.4", block: "C", type: "single", label: "c-wl-4-gastric-bypass",
        cards: true,
        title: "Have you had a gastric bypass in the past 6 months?",
        options: ["Yes", "No"],
      },
      {
        id: "C-WL.5", block: "C", type: "multi", label: "c-wl-5-allergies",
        title: "Are you allergic to any of the following?",
        options: ["Ozempic", "Mounjaro", "Wegovy", "Zepbound", "Saxenda", "Trulicity", "None of the above"],
        exclusive: "None of the above",
      },
      {
        // Recommended checklist (Open Item 4): any selection → provider review
        // flag, not auto-disqualify.
        id: "C-WL.6", block: "C", type: "multi", label: "c-wl-6-diabetes-meds",
        proposed: true,
        title: "Do you take any of the following medications?",
        options: [
          "Glimepiride (Amaryl)", "Glipizide (Glucotrol/XL)", "Glyburide (Micronase, Glynase, Diabeta)",
          "Sitagliptin", "Saxagliptin", "Linagliptin", "Alogliptin", "None of these",
        ],
        exclusive: "None of these",
      },
      {
        id: "C-WL.7", block: "C", type: "single", label: "c-wl-7-current-glp1",
        title: "Are you currently, or have you in the past two months, taken any of the following medications?",
        options: ["Semaglutide (Ozempic, Wegovy)", "Tirzepatide (Zepbound, Mounjaro)", "None of the above"],
      },
      {
        id: "C-WL.8", block: "C", type: "single", label: "c-wl-8-side-effects",
        cards: true,
        title: "Have you experienced side effects from your current medication?",
        options: ["Yes", "No"],
        reveal: { when: ["Yes"], label: "Please describe" },
      },
      {
        // History only — does not set the prescription. The 11-option ladder
        // is verbatim; do not merge or reorder.
        id: "C-WL.9", block: "C", type: "dose", label: "c-wl-9-dose",
        title: "Which medication and dose most closely matches your most recent dose?",
        options: [
          "Semaglutide 0.25mg", "Semaglutide 0.5mg", "Semaglutide 1mg", "Semaglutide 2.5mg",
          "Semaglutide 2mg", "Tirzepatide 10mg", "Tirzepatide 12.5mg", "Tirzepatide 15mg",
          "Tirzepatide 2.5mg", "Tirzepatide 5mg", "Tirzepatide 7.5mg", "Other / not sure",
        ],
        lastDoseLabel: "When was your last dose?",
        durationLabel: "How long have you been on this dose?",
      },
      {
        id: "C-WL.10", block: "C", type: "single", label: "c-wl-10-preference",
        title: "What would you like to discuss with your provider about your treatment?",
        supportingLine: "Your provider will determine your dose based on your health history and how you’re responding.",
        options: ["I’m comfortable with my current dose", "I’d like to talk about adjusting my dose", "I’m not sure yet"],
      },
      {
        id: "C-WL.11", block: "C", type: "upload", label: "c-wl-11-prescription",
        cards: true,
        title: "Do you have a picture of your current prescription? We need this photograph in order to validate your current dosage.",
        options: ["Yes", "No"],
        uploadLabel: "Please upload a picture of the prescription or bottle of your current GLP-1/GIP medication.",
      },
      { id: "CONSENT.truthfulness", block: "C", type: "consent", label: "c-wl-consent-truthfulness", consent: "truthfulness" },
      { id: "CONSENT.glp1", block: "C", type: "consent", label: "c-wl-consent-glp1", consent: "glp1" },
      {
        id: "C-WL.END", block: "C", type: "phrase", label: "c-wl-closer",
        pageAccent: true,
        image: "stressed-couple.webp",
        imageAlt: "Two people sitting cross-legged on mats side by side, eyes closed, breathing through a calm moment together.",
        title: "You’re Not Doing This Alone",
        supportingLine: "A path built with you, not around a guess.",
        cta: "Continue.",
      },

      // ---- D · Additional Info, Identity & Consent ----
      {
        // "Publish only if true (see Section 6)" — true only once the tracking
        // audit confirms zero ad-platform sharing (build requirement 9).
        id: "D.PRE", block: "D", type: "phrase", label: "d-pre-protected",
        pageAccent: true,
        image: "wieght_loss_md.webp", // filename typo is upstream
        imageCutout: true,
        imageAlt: "A hand holding a phone showing a video call with a clinician in a white coat.",
        title: "Your Answers Are Protected",
        supportingLine: "Your health information is used to provide your care. We never sell it, and we don’t share it with advertising platforms.",
        cta: "Continue.",
      },
      {
        id: "D1", block: "D", type: "address", label: "d1-full-picture",
        title: "Full Picture",
        supportingLine: "Where should we ship your care? Your address also confirms the state you’ll receive care in.",
        supportingDraft: true,
      },
      {
        id: "D1.5", block: "D", type: "idverify", label: "d1-5-verify",
        title: "Let’s Verify It’s You",
        // FINAL (per V2 research). [X] = retention days, still to be set.
        body: "To protect you and meet telehealth rules, we verify your identity. Our partner compares a photo of your government ID with a live selfie. This creates biometric data used only to verify your identity. It is never sold and is deleted within [X] days, as described in our Biometric Privacy Policy.",
        consent: "I consent to the collection and use of my biometric information for identity verification.",
        otherWay: "Verify another way.",
      },
      {
        id: "D1.6", block: "D", type: "scheduler", label: "d1-6-video-visit",
        title: "Schedule Your Video Visit",
        supportingLine: "In your state, your first visit happens by live video with a licensed provider.",
      },
      { id: "D2.telehealth", block: "D", type: "consent", label: "d2-consent-telehealth", consent: "telehealth" },
      {
        id: "D.POST", block: "D", type: "phrase", label: "d-post-bring-together",
        title: "Let’s Bring It All Together",
        supportingLine: "Because No Two Bodies Are The Same — here’s the path built around yours.",
        cta: "See My Health Path.",
      },

      // ---- E · Result ----
      { id: "E", block: "E", type: "result", label: "e-your-care-path" },

      // ---- Exits. Terminal: the queue ends on them. ----
      // Headlines are v14's; v15 revised the bodies (FINAL) without restating
      // them. Variant D is new in v15 and has none, so its headline is a draft.
      {
        id: "DQ.BMI", block: "A", type: "exit", label: "dq-bmi-fail",
        title: "This Isn’t Quite The Right Starting Point",
        message: "Based on what you shared, this specific path isn’t available to you right now — that’s not a judgment, it just means a different starting point will serve you better. Labs & Health Insights may be a better place to begin, and your primary care provider is always a great partner too.",
        ctas: [
          { label: "Explore Another Path", href: "labs.html" },
          { label: "Back To Home", href: "index.html", variant: "secondary" },
        ],
      },
      {
        id: "DQ.BASE", block: "C", type: "exit", label: "dq-base",
        title: "This Path Isn’t The Right Fit Right Now",
        message: "Based on what you shared, this specific care plan isn’t available to you today — and that’s not a reflection of you. It’s about making sure any plan is safe for your body. We recommend talking with your primary care provider, and you’re welcome to explore a different Chime path.",
        ctas: [{ label: "Explore Another Path", href: "index.html" }],
      },
      {
        id: "DQ.A", block: "A", type: "exit", label: "dq-a-pregnancy",
        title: "Let’s Pick This Back Up When The Time Is Right",
        message: "Because you’re currently pregnant or breastfeeding, this treatment path isn’t available right now — for your safety and your baby’s. Your OB-GYN or primary care provider is the best person to talk with about your health during this time. You’re always welcome to come back later.",
        ctas: [{ label: "Back To Home", href: "index.html" }],
      },
      {
        // Pending licensed mental-health advisor + Medical Director sign-off.
        id: "DQ.B", block: "B", type: "exit", label: "dq-b-safety",
        title: "Your Safety Comes First",
        message: "Thank you for trusting us with something this personal. Based on what you shared, this treatment path isn’t the right one for you through Chime right now. If you’re struggling, you can call, text or chat with the 988 Suicide & Crisis Lifeline any time — call or text 988, or chat at 988lifeline.org. If you are in immediate danger, call 911. You deserve real support, and it’s out there.",
        signOff: "Pending sign-off from a licensed mental-health advisor and the Medical Director.",
        ctas: [
          { label: "Call 988", href: "tel:988" },
          { label: "Text 988", href: "sms:988", variant: "secondary" },
          { label: "Call 911", href: "tel:911", variant: "secondary" },
        ],
      },
      {
        // "Talk To A Provider About Alternatives" has no destination yet.
        id: "DQ.C", block: "C", type: "exit", label: "dq-c-allergy",
        title: "This Medication Isn’t Safe For You — But Others Might Be",
        message: "You’ve let us know you have an allergy to one of the medications used in this treatment path, so we won’t move forward with it here — your safety comes first. A licensed provider can help you understand safer alternatives, or you can explore a different path with Chime.",
        ctas: [{ label: "Talk To A Provider About Alternatives", href: "index.html", standIn: true }],
      },
      {
        id: "DQ.D", block: "C", type: "exit", label: "dq-d-serious",
        title: "Let’s Get You The Right Care", titleDraft: true,
        message: "Based on what you shared, this treatment isn’t the right fit for you online — your situation deserves care from a provider who can see the full picture. Please talk with your doctor or specialist before starting any new medication.",
        ctas: [{ label: "Back To Home", href: "index.html" }],
      },
      // Exits the doc routes to but does not write: drafts.
      {
        id: "EXIT.minor", block: "P0", type: "exit", label: "exit-under-age",
        draft: true,
        title: "Thanks For Stopping By",
        message: "Chime Health care is for adults, so we can’t continue this assessment. Nothing you entered has been saved.",
        ctas: [{ label: "Back To Home", href: "index.html" }],
      },
      {
        id: "EXIT.state", block: "P0", type: "exit", label: "exit-state-waitlist",
        draft: true,
        title: "We’re Not In Your State Yet",
        message: "Chime Health isn’t available where you live yet. We’re working on it, and we’d love to let you know when we are.",
        ctas: [{ label: "Back To Home", href: "index.html" }],
      },
      {
        id: "EXIT.privacy", block: "P0", type: "exit", label: "exit-privacy-declined",
        draft: true,
        title: "No Problem",
        message: "We can’t continue without these agreements, because your provider needs them to care for you. Nothing you entered has been saved.",
        ctas: [{ label: "Back To Home", href: "index.html" }],
      },
    ],

    // ---------------------------------------------------------------------
    // Block E — Your Weight Loss Care Path
    // ---------------------------------------------------------------------
    result: {
      headline: "Your Chime Weight Care Path.",
      underHeadline: "Based on your answers. Your licensed provider makes the final decision.",
      nextSteps: [
        "Provider review of your assessment",
        "Follow-up questions or video visit, depending on your state",
        "Prescription only if medically appropriate",
        "Prepared and shipped by [Pharmacy legal name], a state-licensed U.S. pharmacy",
        "Track your care in your Chime portal",
        "Ongoing support through Chime Membership",
      ],
      // Offer module — BLOCKS BUILD (Open Item 15): no price, billing,
      // commitment or refund terms exist yet. Rendered as its required
      // elements with the doc's own [X] placeholders.
      offerItems: [
        "All-in monthly price and what it includes",
        "Billing frequency",
        "When the first charge happens",
        "Any minimum commitment",
        "“Cancel online anytime in your portal” (only if true)",
        "Refund if not prescribed",
      ],
      recurringAck: "I agree to recurring charges of $[X] every [period] until I cancel.",
      // DS-2 verbatim; DS-3 has no verbatim text in the doc, so the module
      // restates the GLP-1 consent's own compounded-medication sentences.
      disclosures: [
        "A prescription is issued only if a licensed provider determines it is medically appropriate after reviewing your information.",
        "Compounded medications are not FDA-approved. The FDA does not review compounded drugs for safety, effectiveness, or quality the way it reviews approved drugs. Prepared by [Pharmacy legal name], a state-licensed U.S. pharmacy.",
      ],
      cta: "Go To My Account",
      // "Why This Path May Fit" — 2–4 bullets from the user's own answers,
      // "You told us…", no outcome predictions. The doc supplies one example
      // (the "tried different things" line); the rest are drafts.
      why: {
        journey: {
          "Just starting to explore options": "You’ve told us you’re just starting to explore your options. A licensed provider will walk through them with you.",
          "Tried many diets or lifestyle programs before": "You’ve told us you’ve tried different things before and nothing has felt sustainable. With Chime, a licensed provider reviews your health history and — if it’s right for you — builds a plan with you, with ongoing support along the way.",
          "Currently using Semaglutide or Tirzepatide and want better support": "You’ve told us you’re already on a weight-loss medication and want better support. Your provider will review your current treatment with you.",
          "Used Semaglutide or Tirzepatide before and stopped": "You’ve told us you’ve used a weight-loss medication before. Your provider will look at that history with you.",
        },
        struggles: { lead: "You’ve told us what has felt hardest: ", tail: ". Your care team will keep that in mind." },
        feelMore: { lead: "You’ve told us you’d like to feel more ", tail: "." },
        exampleKey: "Tried many diets or lifestyle programs before",
      },
    },
  };

})(typeof window !== "undefined" ? window : globalThis);
