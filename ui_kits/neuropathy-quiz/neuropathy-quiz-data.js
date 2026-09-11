// Chime Health — Neuropathy quiz: every question, option, list, rule message
// and consent text, ripped verbatim from standardmeds.com/quiz/neuropathy on
// 2026-09-11 (one Next.js client chunk held the whole flow; a prettified copy
// sits in uploads/neuropathy-quiz-ref/, untracked). Ids are the reference's
// own state keys (s1 … s9), `PROGRESS` is its progress table and `META` its
// analytics labels, so a future GTM container can reuse the same names.
// Shared by neuropathy-quiz.js (browser) and neuropathy-quiz-tests.js (node).
(function (root) {
  "use strict";

  var D = {};

  // Product + attribution. The reference sells "NeuroCalmRX" (compounded
  // Low-Dose Naltrexone + B12) and signs the lead card "Dr. Kirten Parekh"
  // — both are Standard Meds facts. The product name stays as the client's
  // placeholder (2026-09-11: "just put a placeholder bottle"); the doctor's
  // name does not belong on a Chime page, so the attribution is generic.
  D.PRODUCT = "NeuroCalmRX";
  D.ATTRIBUTION = "— Chime Medical Team";

  D.PROGRESS = {
    s1: 5, s28: 8, s4: 15, s5: 22, s14: 24, s6: 28, s25: 32, s26: 35, s27: 37,
    s11: 46, s12: 52, s13: 58, s15: 70, s16: 74, s17: 78, s18: 82, s19: 86,
    s20: 90, s22: 92, s9: 96,
  };
  D.META = {
    s1: { idx: 1, name: "sex" },
    s28: { idx: 2, name: "pregnancy" },
    s4: { idx: 3, name: "symptoms" },
    s5: { idx: 4, name: "cause" },
    s14: { idx: 5, name: "duration" },
    s6: { idx: 6, name: "prior_treatment" },
    s25: { idx: 7, name: "treatments_tried" },
    s26: { idx: 8, name: "side_effects" },
    s27: { idx: 9, name: "side_effects_detail" },
    s11: { idx: 10, name: "conditions" },
    s12: { idx: 11, name: "medications" },
    s13: { idx: 12, name: "allergies" },
    s15: { idx: 13, name: "opioid_use" },
    s16: { idx: 14, name: "screening" },
    s17: { idx: 15, name: "autonomic" },
    s18: { idx: 16, name: "emg_testing" },
    s19: { idx: 17, name: "additional_info" },
    s20: { idx: 18, name: "dob_height_weight" },
    s22: { idx: 19, name: "consent" },
    s9: { idx: 20, name: "contact_info" },
  };
  // Label under the progress bar, by percent (the reference's thresholds).
  D.PROGRESS_LABELS = [
    [10, ""], [25, "Getting started..."], [40, "Making progress..."],
    [55, "Halfway there..."], [70, "Over halfway done!"], [85, "Almost there..."],
    [95, "Just a few more details!"], [99.999, "Finishing up..."], [100, "Complete!"],
  ];

  // s4
  D.SYMPTOMS = [
    "Numbness or tingling", "Burning or stinging", "Sharp electric shocks",
    "Muscle weakness", "Loss of balance", "Difficulty walking",
    "Sensitivity to touch", "Other",
  ];
  D.SYMPTOM_CHIPS = ["+ Cramping", "+ Throbbing pain", "+ Cold sensation", "+ Itching", "+ Joint stiffness", "+ Swelling"];

  // s5
  D.CAUSES = ["I'm not sure", "Diabetes", "Vitamin deficiency (like B12)", "Genetic condition"];
  D.CAUSE_OTHER = "Something else";
  D.CAUSE_CHIPS = ["+ Chemo / medications", "+ Alcohol use", "+ Autoimmune", "+ Injury / surgery", "+ Shingles", "+ Spinal stenosis", "+ Fibromyalgia"];
  D.CAUSE_SUGGEST = [
    "Injury or surgery", "Spinal stenosis", "Shingles (postherpetic)", "Idiopathic (unknown)",
    "Fibromyalgia", "Carpal tunnel", "Herniated disc", "Lupus", "Multiple sclerosis",
    "Celiac disease", "Lyme disease", "Hypothyroidism", "Chronic inflammation",
    "Radiation therapy", "Kidney disease",
  ];

  // s14
  D.DURATIONS = ["3+ years", "1 to 3 years", "6 months to 1 year", "3 to 6 months", "Less than 3 months"];
  D.ACUTE = "Less than 3 months";

  // s25
  D.TREATMENTS = ["Gabapentin (Neurontin)", "Pregabalin (Lyrica)", "Duloxetine (Cymbalta)"];
  D.TREATMENT_OTHER = "Something else";
  D.TREATMENT_CHIPS = ["+ Tricyclic antidepressants", "+ Physical therapy", "+ Topical creams", "+ Acupuncture", "+ CBD / THC", "+ TENS unit", "+ Supplements"];
  D.TREATMENT_SUGGEST = [
    "Acupuncture", "CBD oil", "THC / Medical marijuana", "TENS unit",
    "Supplements (B12, Alpha-lipoic acid)", "Chiropractor", "Massage therapy",
    "Nerve blocks", "Capsaicin cream", "Epsom salt soaks", "Essential oils",
    "Infrared therapy", "Yoga / Tai chi", "Compression socks", "Over-the-counter painkillers",
  ];

  // s27
  D.SIDE_EFFECT_CHIPS = ["+ Dizziness", "+ Drowsiness", "+ Brain fog", "+ Weight gain", "+ Nausea", "+ Didn't work"];

  // s12
  D.CONDITIONS = [
    "I have diabetes", "I have thyroid disease", "I have kidney disease",
    "Vitamin deficiency (like B12)", "I have HIV/AIDS", "History of chemotherapy",
    "History of heavy alcohol use", "I drink 4+ alcoholic drinks per day",
  ];
  D.ALCOHOL = "I drink 4+ alcoholic drinks per day";

  // s13
  D.MED_CHIPS = ["+ Metformin", "+ Gabapentin", "+ Lyrica", "+ Ibuprofen", "+ Lisinopril"];
  D.MEDS = [
    "Metformin", "Gabapentin", "Pregabalin (Lyrica)", "Duloxetine (Cymbalta)", "Amitriptyline",
    "Lisinopril", "Atorvastatin", "Amlodipine", "Metoprolol", "Omeprazole", "Levothyroxine",
    "Losartan", "Hydrochlorothiazide", "Simvastatin", "Aspirin", "Ibuprofen", "Acetaminophen",
    "Insulin", "Glipizide", "Sitagliptin", "Empagliflozin", "Warfarin", "Clopidogrel", "Tramadol",
    "Naproxen", "Prednisone", "Furosemide", "Pantoprazole", "Sertraline", "Escitalopram",
    "Fluoxetine", "Trazodone", "Alprazolam", "Diazepam", "Zolpidem", "Cyclobenzaprine",
    "Meloxicam", "Celecoxib", "Rosuvastatin", "Pravastatin", "Carvedilol", "Valsartan",
    "Spironolactone", "Tamsulosin", "Finasteride", "Allopurinol", "Colchicine", "Doxycycline",
    "Ciprofloxacin", "Amoxicillin",
  ];

  // s15 — order matters: the first ticked item's message is the one shown.
  D.SCREENING = [
    "History of opioid dependence or treatment",
    "Liver disease or elevated liver enzymes",
    "Chronic kidney disease (stage 4+)",
    "History of severe depression or bipolar",
  ];
  D.SCREENING_MSG = {
    "History of opioid dependence or treatment":
      "Opioid dependence history is a safety concern. Naltrexone can cause dangerous withdrawal in patients with opioid dependence.",
    "Liver disease or elevated liver enzymes":
      "Liver disease requires in-person treatment supervision. This treatment may not be safe for you on a telehealth platform.",
    "Chronic kidney disease (stage 4+)":
      "Advanced kidney disease requires in-person treatment. This treatment may not be safe for you on a telehealth platform.",
    "History of severe depression or bipolar":
      "This medication may affect mood. Patients with severe depression or bipolar need closer monitoring than telehealth can provide.",
  };

  // s16
  D.ALLERGIES = [
    "Penicillin", "Sulfa drugs", "Aspirin", "Ibuprofen", "NSAIDs", "Latex", "Codeine", "Morphine",
    "Shellfish", "Peanuts", "Tree nuts", "Eggs", "Milk/Dairy", "Soy", "Wheat/Gluten", "Bee stings",
    "Contrast dye", "Lidocaine", "Tetracycline", "Erythromycin",
  ];
  D.NO_ALLERGIES = "No known allergies";

  // s17
  D.HEIGHT_FT = ["4", "5", "6", "7"];
  D.HEIGHT_IN = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

  // s18
  D.EMG = ["Yes", "No", "Not sure"];

  // s19
  D.AUTONOMIC = ["Dizziness when standing", "Constipation or diarrhea", "Difficulty with bladder control"];
  D.AUTONOMIC_MALE = "Erectile dysfunction";

  // s22 — 2008 down to 1920 (18+ at the time the reference was built).
  D.MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  D.YEAR_MAX = 2008;
  D.YEAR_COUNT = 89;

  // Modals (overlay on the current step) and the disqualified page they lead to.
  D.MODALS = {
    pregnant: {
      title: "For your safety",
      body: "This treatment isn't recommended during pregnancy or breastfeeding. Please talk to your doctor about safe options for you.",
      back: "Go Back",
      confirm: "I am pregnant",
      dq: { title: "This treatment is not safe during pregnancy.", message: "Please consult your doctor about pregnancy-safe options." },
    },
    opioid: {
      title: "Are you sure?",
      body: "NeuroCalmRX cannot be taken with opioid painkillers. This includes morphine, hydrocodone, oxycodone, and similar medications.",
      back: "No, let me correct that",
      confirm: "Yes, I take opioids",
      dq: { title: "NeuroCalmRX cannot be taken with opioid painkillers.", message: "Taking both could cause dangerous withdrawal symptoms. Please talk to your doctor." },
    },
    duration: {
      title: "This program is for ongoing symptoms",
      body: "NeuroCalmRX is for symptoms lasting 3 months or more. If yours are new, please see your doctor to find the cause first.",
      back: "Let me correct that",
      confirm: null,
    },
    alcohol: {
      title: "Important safety information",
      body: "Heavy alcohol use (4+ drinks per day) may make this treatment unsafe. Naltrexone should be used under close supervision with heavy alcohol use.",
      back: "Let me correct that",
      confirm: "This is correct",
      dq: { title: "Heavy alcohol use detected", message: "For your safety, in-person treatment is recommended. Please consult your doctor." },
    },
    screening: {
      title: "Important safety information",
      body: null, // SCREENING_MSG[item]
      back: "Let me correct my answer",
      confirm: "This is correct",
      dq: { title: "Important safety information", message: null },
    },
  };

  D.COPY = {
    badge: "FREE 3-Minute Assessment",
    rating: { label: "Excellent", score: "4.7 / 5" }, // reference's Trustpilot-style row — stand-in, flagged
    s1: { q: "What is your sex assigned at birth?", sub: "Required for safe prescribing" },
    s28: {
      q: "Are you currently pregnant, breastfeeding, or planning to become pregnant?",
      footnote: "By selecting No, you consent to the pregnancy safety notice.",
      link: "View pregnancy safety notice",
      notice: "This medication may not be safe during pregnancy. By proceeding, I understand and agree to use birth control while on this treatment and to stop taking it before trying to become pregnant. If I become pregnant during treatment, I will notify my doctor immediately.",
    },
    s4: { q: "Which of these do you experience?", sub: "Pick all that apply", placeholder: "Or type your symptoms...", err: "Please select at least one symptom" },
    s5: { q: "What do you think caused your symptoms?", placeholder: "Or type your own..." },
    s14: { q: "How long have you had these symptoms?" },
    s6: { q: "Have you tried anything for your neuropathy symptoms before?" },
    s25: { q: "What have you tried?", sub: "Pick all that apply", placeholder: "Or type your own...", err: "Please select at least one treatment you've tried" },
    s26: { q: "Did any of those cause side effects?" },
    s27: { q: "Tell us what happened", sub: "What did you experience?", placeholder: "Tap above or type your own..." },
    s11: { q: "Are you currently taking any opioid painkillers?" },
    s12: { q: "Check any conditions that apply:", none: "None of these" },
    s13: { q: "Are you currently taking any other medications?", sub: "List your medications below", placeholder: "Type to search medications...", err: "Please add at least one medication" },
    s15: { q: "Please check any that apply:", none: "None of these apply to me" },
    s16: { q: "Do you have any allergies?", placeholder: "Type to search allergies...", err: 'Please add your allergies or select "No known allergies"' },
    s17: { q: "Your height and weight", sub: "Used to calculate safe dosing", ft: "Height — Feet", inch: "Height — Inches", weight: "Weight (lbs)", placeholder: "e.g. 180", err: "Please enter your height and weight" },
    s18: { q: "Have you had nerve conduction studies or EMG testing?" },
    s19: { q: "Do you experience any of these?", none: "None of these" },
    s20: { q: "Anything else you want your doctor to know?", sub: "Questions, concerns, or other health details", chip: "+ no questions", placeholder: "Tap above or type your own...", skip: "Skip this step", noQuestions: "no questions" },
    s22: { q: "Date of birth", sub: "Required for your prescription", err: "Please enter your date of birth" },
    s9: {
      lead: "Great News!",
      sub: "Enter your contact info below for next steps.",
      name: "Full Name", namePh: "Your full name",
      email: "Email", emailPh: "you@email.com",
      phone: "Phone", phonePh: "(555) 555-5555",
      cta: "See My Results", busy: "Sending…",
      consentToggle: "View consent details",
      truthTitle: "Truthfulness Agreement",
      truth: "I confirm my answers are true and complete. I understand sharing accurate health info is critical to my care. I will not hold my doctor responsible for oversights in info I provided.",
      treatTitle: "Treatment Evaluation Consent",
      treat: "I understand I'm being evaluated for neuropathy treatment including Low-Dose Naltrexone and Vitamin B12. Potential benefits include reduced pain and better sleep. Possible side effects include vivid dreams, mild headache, or gastrointestinal upset. LDN is an off-label therapy used at very low doses. It should not be used with opioids. I may stop treatment at any time.",
      trust: "🔒 HIPAA Secure • 256-bit Encrypted",
      errAll: "Please fill in all fields",
      errEmail: "Please enter a valid email address",
      errPhone: "Please enter a 10-digit US phone number",
      errSend: "Something went wrong sending your answers. Please try again.",
    },
    dq: { startOver: "Start Over" },
    continueLabel: "Continue",
    consentTruthDefault: "I have read the above information and I do consent and wish to move forward",
    consentTreatDefault: "I have read and understand the information and I wish to proceed",
  };

  root.NQ_DATA = D;
  if (typeof module !== "undefined" && module.exports) module.exports = D;
})(typeof window !== "undefined" ? window : this);
