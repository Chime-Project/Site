// Chime Health — Assessment content + eligibility keys.
// Ported from uploads/PortalIntake1-main (registry-built GLP-1 intake funnel):
// same questions, same answer options, same disqualifier keys. That folder is an
// untracked reference capture — this file, not it, is what the page reads.
//
// Shape mirrors the source engine's quiz-config.js:
//   categories — STD is the baseline everyone walks; the rest are orderable
//               programs. The picker opens the assessment: the visitor chooses
//               one or more programs, and that choice decides which steps they
//               walk and which disqualifier keys open. A program they did not
//               order can never fail them.
//   steps     — the grouped pages, in walk order (consent last)
//   coverage  — fail-closed map: every option is safe, safeAll, or named by a key
//   dqKeys    — one named rule list per category; the baseline key + every
//               ordered program's key run ONCE on submit, against the whole
//               record. No question rejects on its own step. NAD and PEP have
//               no key authored yet (keyAuthored: false) — they route, walk the
//               baseline, and their verdict is tagged unauthored so "passed our
//               screen" and "we have no screen" can never be confused.
// Values must match option strings byte-for-byte — a typo'd value is a rule
// that can never fire.

window.CHIME_ASSESSMENT = {
  categories: [
    { id: "STD", label: "Standard Intake", baseline: true, keyAuthored: true },
    { id: "GLP", label: "GLP-1 Program", baseline: false, keyAuthored: true, description: "Weight management with GLP-1 medication." },
    { id: "NAD", label: "NAD+ Program", baseline: false, keyAuthored: false, description: "NAD+ restoration program." },
    { id: "PEP", label: "Peptides Program", baseline: false, keyAuthored: false, description: "Targeted peptide therapy." },
  ],
  baseline: ["STD"],

  picker: {
    title: "Programs",
    heading: "Which program are you here for?",
    sub: "Select the program you want. You can choose more than one — we’ll combine them into a single intake.",
    flash: "Please choose at least one program to continue.",
  },

  steps: [
    {
      id: "STDP1",
      category: "STD",
      title: "About you",
      heading: "A few details about you",
      questions: [
        {
          qid: "STDP1Q1",
          control: "identity",
          fields: [
            { name: "form[first_name]", label: "First name", type: "text", span: 1 },
            { name: "form[last_name]", label: "Last name", type: "text", span: 1 },
            { name: "form[email]", label: "Email", type: "email", span: 1 },
            { name: "form[phone]", label: "Phone", type: "tel", span: 1 },
            { name: "form[address_line1]", label: "Street address", type: "text", span: 2 },
            { name: "form[address_line2]", label: "Apartment, suite, unit (optional)", type: "text", span: 2, optional: true },
            { name: "form[city]", label: "City", type: "text", span: 1 },
            { name: "form[zip]", label: "ZIP code", type: "text", span: 1 },
            {
              name: "form[shipping_state]", label: "What state will your medication be shipped to?",
              type: "select", span: 2,
              options: ["AL","AZ","AR","CA","CO","CT","DE","FL","GA","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
            },
            {
              name: "form[gender]", label: "Sex assigned at birth", type: "segment", span: 1,
              hint: "Helps your clinician personalize your dosing",
              options: [{ value: "female", label: "Female" }, { value: "male", label: "Male" }],
            },
            { name: "form[dob]", label: "Date of Birth", type: "dob", span: 1, placeholder: "MM/DD/YYYY" },
          ],
        },
        {
          qid: "STDP1Q2",
          control: "heightweight",
          label: "What is your height and weight?",
        },
        {
          qid: "STDP1Q3",
          control: "checkbox",
          label: "Do any of these apply to you?",
          name: "form[female_health_status][]",
          showWhen: { name: "form[gender]", value: "female" },
          exclusive: "None of the above",
          options: [
            "Currently or possibly pregnant, or actively trying to become pregnant",
            "Breastfeeding or bottle feeding with breastmilk",
            "Have given birth to a child within the last 6 months",
            "None of the above",
          ],
        },
        // STDP1Q4, the two age-and-BMI consent boxes, is rendered by the engine:
        // its visibility is computed from age + BMI, not from an answer.
      ],
    },

    {
      id: "STDP2",
      category: "STD",
      title: "Health history",
      heading: "Your health history",
      questions: [
        {
          qid: "STDP2Q1",
          control: "checkbox",
          label: "Do any of these apply to you?",
          name: "form[health_conditions][]",
          exclusive: "None of these",
          hipaa: true,
          options: [
            "None of these",
            "End-stage kidney disease (on or about to be on dialysis)",
            "End-stage liver disease (cirrhosis)",
            "Current suicidal thoughts and/or prior suicidal attempt",
            "Cancer (active diagnosis, active treatment, or in remission or cancer-free for less than 5 continuous years - does not apply to non-melanoma skin cancer that was considered cured via simple excision)",
            "History of organ transplant on anti-rejection medication",
            "Severe gastrointestinal condition (gastroparesis, blockage, inflammatory bowel disease)",
            "Current diagnosis of or treatment for alcohol, opioid, or substance use disorder/dependence",
            "Have or had an eating disorder (like anorexia or bulimia)",
          ],
        },
        {
          qid: "STDP2Q2",
          control: "checkbox",
          label: "Have you experienced or been diagnosed with any of the following?",
          name: "form[health_conditions_additional][]",
          exclusive: "None of the below",
          options: [
            "None of the below",
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
        },
        {
          qid: "STDP2Q3",
          control: "checkbox",
          label: "Do any of these apply to you?",
          name: "form[more_health_conditions][]",
          exclusive: "None of these",
          options: [
            "None of these",
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
        },
      ],
    },

    {
      id: "STDP3",
      category: "STD",
      title: "Full picture",
      heading: "Let’s make sure our providers have the full picture.",
      questions: [
        {
          qid: "STDP3Q1",
          control: "select",
          label: "Within the last 3 months, have you taken opiate pain medications and/or opiate-based street drugs?",
          name: "form[taken_pain_medications_or_street_drugs]",
          options: ["Yes", "No"],
          reveal: { value: "Yes", name: "form[taken_pain_medications_or_street_drugs_info]", label: "Please tell us more." },
        },
        {
          qid: "STDP3Q2",
          control: "select",
          label: "What is your average blood pressure range?",
          name: "form[blood_pressure]",
          options: ["<120/80 (Normal)", "120-129/<80 (Elevated)", "130-139/80-89 (High Stage 1)", "≥140/90 (High Stage 2)"],
        },
        {
          qid: "STDP3Q3",
          control: "select",
          label: "How about your average resting heart rate?",
          name: "form[resting_heart_rate]",
          options: ["<60 beats per minute (Slow)", "60-100 beats per minute (Normal)", "101-110 beats per minute (Slightly Fast)", ">110 beats per minute (Fast)"],
        },
        {
          qid: "STDP3Q4",
          control: "select",
          label: "When was the last time you had an in-person Medical Evaluation?",
          name: "form[last_medical_evaluation]",
          options: ["Less than a year ago", "1 to 2 years ago", "More than 2 years ago"],
        },
        {
          qid: "STDP3Q5",
          control: "select",
          label: "When was the last time you had Lab Tests done?",
          name: "form[last_lab_tests]",
          options: ["Less than a year ago", "1 to 2 years ago", "More than 2 years ago"],
        },
        {
          qid: "STDP3Q6",
          control: "select",
          label: "Are you currently taking any Prescription Medications?",
          name: "form[prescription_medications]",
          options: ["Yes - Please list the names and dosages", "No - I affirm I'm not taking any medications"],
          reveal: { value: "Yes - Please list the names and dosages", name: "form[prescription_medications_info]", label: "Please list your medications, strengths, and how often you take them." },
        },
        {
          qid: "STDP3Q7",
          control: "select",
          label: "Do you have any medication allergies?",
          name: "form[medication_allergies]",
          options: ["Yes - Please list your allergies and any known reactions", "No - I affirm I have no known drug allergies"],
          reveal: { value: "Yes - Please list your allergies and any known reactions", name: "form[medication_allergies_info]", label: "Please list your allergies and any known reactions." },
        },
        {
          qid: "STDP3Q8",
          control: "select",
          label: "Do you have any further information which you would like our medical team to know?",
          name: "form[additional_doc_information]",
          options: ["Yes", "No"],
          reveal: { value: "Yes", name: "form[additional_doc_information_info]", label: "Please tell our medical team what they should know." },
        },
      ],
    },

    {
      id: "GLPP1",
      category: "GLP",
      title: "GLP-1 medications",
      heading: "About GLP-1 medications",
      questions: [
        {
          qid: "GLPP1Q1",
          control: "checkbox",
          label: "Are you allergic to any of the following medications?",
          name: "form[glp1_allergies][]",
          exclusive: "I am NOT allergic to any of these medications",
          options: [
            "Semaglutide",
            "Tirzepatide",
            "Liraglutide",
            "Dulaglutide",
            "I am NOT allergic to any of these medications",
          ],
        },
        {
          qid: "GLPP1Q2",
          control: "checkbox",
          label: "Please affirm you are not currently on any of the following medications",
          name: "form[current_glucose_medications][]",
          exclusive: "I am NOT on any of these medications",
          options: [
            "Insulin",
            "Glimepiride (Amaryl)",
            "Glipizide (Glucotrol and Glucotrol XL)",
            "Glyburide (Micronase, Glynase, and Diabeta)",
            "Sitagliptin",
            "Saxagliptin",
            "Linagliptin",
            "Alogliptin",
            "I am NOT on any of these medications",
          ],
        },
        {
          qid: "GLPP1Q3",
          control: "radio",
          label: "Have you taken medication for weight loss within the past month?",
          name: "form[weight_loss_medications]",
          options: ["Semaglutide", "Tirzepatide", "None"],
          // Prior-use arms: each reveals in place under its answer and clears
          // when the answer changes. The two arms carry distinct field names on
          // purpose — hiding one clears its fields by name, and a shared name
          // would delete the answer the visible arm just stored.
          arms: {
            Semaglutide: {
              heading: "Your semaglutide history",
              questions: [
                {
                  name: "form[previous_semaglutide_medication_last_dose]", label: "What was your last dose?",
                  options: ["Semaglutide 0.25 mg", "Semaglutide 0.50 mg", "Semaglutide 1 mg", "Semaglutide 1.5 mg", "Semaglutide 2 mg", "Semaglutide 2.5 mg", "Semaglutide - Unknown"],
                },
                {
                  name: "form[previous_semaglutide_medication_last_dose_at]", label: "When did you take that last dose?",
                  options: ["0-7 days", "8-14 days", "15-30 days", "30+ days"],
                },
                {
                  name: "form[previous_semaglutide_continuation_preference]", label: "How would you like to continue?",
                  options: ["Stay on the same dose or equivalent dose", "I want to change medications", "Increase my dosage", "Decrease my dosage", "Let the provider decide what dose is best for me"],
                },
              ],
            },
            Tirzepatide: {
              heading: "Your tirzepatide history",
              questions: [
                {
                  name: "form[previous_tirzepatide_medication_last_dose]", label: "What was your last dose?",
                  options: ["Tirzepatide 2.5 mg", "Tirzepatide 5 mg", "Tirzepatide 7.5 mg", "Tirzepatide 10 mg", "Tirzepatide 12.5 mg", "Tirzepatide 15 mg", "Tirzepatide - Unknown"],
                },
                {
                  name: "form[previous_tirzepatide_medication_last_dose_at]", label: "When did you take that last dose?",
                  options: ["0-7 days", "8-14 days", "15-30 days", "30+ days"],
                },
                {
                  name: "form[previous_tirzepatide_continuation_preference]", label: "How would you like to continue?",
                  options: ["Stay on the same dose or equivalent dose", "I want to change medications", "Increase my dosage", "Decrease my dosage", "Let the provider decide what dose is best for me"],
                },
              ],
            },
          },
        },
        {
          qid: "GLPP1Q4",
          control: "select",
          label: "Have you had gastric bypass surgery in the past 6 months?",
          name: "form[gastric_bypass_6_months]",
          options: ["Yes", "No"],
        },
        {
          qid: "GLPP1Q5",
          control: "consent",
          label: "Please read and acknowledge before continuing",
          name: "form[glp_consent]",
          placeholder: true,
          body: "GLP-1 medications support weight loss by regulating appetite and blood sugar. Like all prescription medications they carry considerations your provider will review with you, including common gastrointestinal side effects (nausea, vomiting, diarrhea), the importance of staying hydrated, and telling your provider about any new symptoms. Your Chime provider reviews every intake before any medication is prescribed.",
          ack: "I have read and understand the considerations above.",
        },
      ],
    },

    {
      id: "STDP4",
      category: "STD",
      title: "Consent",
      heading: "Before we send this to a provider",
      questions: [
        {
          qid: "STDP4Q1",
          control: "consent",
          name: "form[contact_agree]",
          body: "I confirm that I am the patient completing this intake form and that my answers are accurate and complete to the best of my knowledge. I understand the importance of providing accurate health information for my care.",
          ack: "I agree to the Truthfulness Consent, Telehealth Consent & Informed Treatment Consent.",
        },
        // TCPA: stays optional and unchecked, and the sentence "Consent is not a
        // condition of purchase." is a required element — see 47 CFR 64.1200(f)(9).
        {
          qid: "STDP4Q2",
          control: "consent",
          name: "form[sms_consent]",
          optional: true,
          ack: "I consent to receive marketing text messages from Chime Health and its medical providers at the phone number provided, including promotions, discounts, and product/service updates. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. Consent is not a condition of purchase.",
        },
      ],
    },
  ],

  // Age-and-BMI acknowledgements (STDP1Q4). The engine shows at most one:
  //   65+ with BMI >= 22        -> elderly consent (BMI < 22 disqualifies on submit)
  //   18-64 with 20 <= BMI < 23 -> metabolic consent (BMI < 20 disqualifies on submit)
  ageBmiConsents: {
    elderly: {
      name: "form[elderly_consent]",
      title: "Please read and acknowledge before continuing",
      body: "We would like to make sure you are fully aware of some important considerations regarding GLP-1 medications, especially for older adults. These medications, while effective for weight loss and metabolic health, can sometimes cause gastrointestinal side effects like nausea, vomiting, and diarrhea. In older patients, these symptoms can lead to dehydration and may have an impact on kidney function, particularly if you have known kidney issues. Additionally, GLP-1 medications can occasionally cause dizziness or balance problems, which could raise the risk of falls. Appetite suppression and rapid weight loss may increase the risk of frailty, weakness, or malnutrition. Muscle wasting and bone demineralization is also a concern with rapid or aggressive weight loss. This is compounded in the elderly. It’s important that your doctor is aware you are starting this medication so they can help monitor your health during treatment. If you haven’t spoken with your primary care provider yet, we recommend sharing your plan with them before starting therapy.",
      ack: "I have read and understand the considerations above.",
    },
    metabolic: {
      name: "form[metabolic_consent]",
      title: "Please read and acknowledge before continuing",
      body: "I acknowledge that with this BMI I am using these medications for metabolic health, anti-inflammatory, and better eating habits, but not for weight loss primarily.",
      ack: "I acknowledge the statement above.",
    },
  },

  // Fail closed: an answered option that is neither safe here nor named by any
  // key fails every open key rather than quietly passing.
  coverage: {
    "form[female_health_status][]": { safe: ["None of the above"] },
    "form[health_conditions][]": { safe: ["None of these"] },
    "form[health_conditions_additional][]": { safe: ["None of the below", "Type 2 diabetes (not on insulin)"] },
    "form[more_health_conditions][]": { safeAll: true },
    "form[taken_pain_medications_or_street_drugs]": { safe: ["No"] },
    "form[blood_pressure]": { safeAll: true },
    "form[resting_heart_rate]": { safeAll: true },
    "form[last_medical_evaluation]": { safeAll: true },
    "form[last_lab_tests]": { safeAll: true },
    "form[prescription_medications]": { safeAll: true },
    "form[medication_allergies]": { safeAll: true },
    "form[additional_doc_information]": { safeAll: true },
    "form[glp1_allergies][]": { safe: ["I am NOT allergic to any of these medications"] },
    "form[current_glucose_medications][]": { safe: ["I am NOT on any of these medications"] },
    "form[weight_loss_medications]": { safeAll: true },
    "form[gastric_bypass_6_months]": { safe: ["No"] },
  },

  // Disqualifier keys. STD (baseline) applies to everyone; GLP applies because
  // this assessment is a GLP-1 order. Both run once, on submit. A single answer
  // may be named by both keys (e.g. "Pancreatitis or Pancreatic Cancer" names a
  // cancer AND a GLP-1 contraindication) — one reason per key is correct.
  dqKeys: {
    STD: [
      {
        id: "female-health", qid: "STDP1Q3", kind: "options",
        field: "form[female_health_status][]",
        values: [
          "Currently or possibly pregnant, or actively trying to become pregnant",
          "Breastfeeding or bottle feeding with breastmilk",
          "Have given birth to a child within the last 6 months",
        ],
      },
      {
        id: "health-conditions", qid: "STDP2Q1", kind: "options",
        field: "form[health_conditions][]",
        values: [
          "Cancer (active diagnosis, active treatment, or in remission or cancer-free for less than 5 continuous years - does not apply to non-melanoma skin cancer that was considered cured via simple excision)",
        ],
      },
    ],
    GLP: [
      {
        id: "age-bmi", qid: "STDP1Q1", kind: "test", test: "ageBmi",
        label: "Age 65+ with BMI under 22, or age 18 to 64 with BMI under 20",
      },
      {
        id: "glp-health-conditions", qid: "STDP2Q1", kind: "options",
        field: "form[health_conditions][]",
        values: [
          "Severe gastrointestinal condition (gastroparesis, blockage, inflammatory bowel disease)",
          "Have or had an eating disorder (like anorexia or bulimia)",
          "End-stage kidney disease (on or about to be on dialysis)",
          "End-stage liver disease (cirrhosis)",
          "Current suicidal thoughts and/or prior suicidal attempt",
          "History of organ transplant on anti-rejection medication",
          "Current diagnosis of or treatment for alcohol, opioid, or substance use disorder/dependence",
        ],
      },
      {
        id: "glp-health-conditions-additional", qid: "STDP2Q2", kind: "options",
        field: "form[health_conditions_additional][]",
        values: [
          "Current symptomatic gallstones",
          "Diabetic Retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, or blindness",
          "Hypoglycemia (low blood sugar)",
          "History of glucose-6-phosphate dehydrogenase (G6PD) deficiency",
          "QT prolongation or other heart rhythm disorder (including Heart Arrhythmia)",
          "Pancreatitis or Pancreatic Cancer",
          "Personal or family history of thyroid cyst/nodule, thyroid cancer, medullary thyroid carcinoma, or multiple endocrine neoplasia syndrome type 2",
          "Type 1 diabetes",
          "Type 2 diabetes (on insulin)",
        ],
      },
      {
        id: "opiates", qid: "STDP3Q1", kind: "single",
        field: "form[taken_pain_medications_or_street_drugs]",
        values: ["Yes"],
        label: "Opiate pain medication or opiate-based street drugs in the last 3 months",
      },
      {
        id: "glp-allergies", qid: "GLPP1Q1", kind: "options",
        field: "form[glp1_allergies][]",
        values: ["Semaglutide", "Tirzepatide", "Liraglutide", "Dulaglutide"],
      },
      {
        id: "glp-glucose-medications", qid: "GLPP1Q2", kind: "options",
        field: "form[current_glucose_medications][]",
        values: [
          "Insulin",
          "Glimepiride (Amaryl)",
          "Glipizide (Glucotrol and Glucotrol XL)",
          "Glyburide (Micronase, Glynase, and Diabeta)",
          "Sitagliptin",
          "Saxagliptin",
          "Linagliptin",
          "Alogliptin",
        ],
      },
      {
        id: "glp-gastric-bypass", qid: "GLPP1Q4", kind: "single",
        field: "form[gastric_bypass_6_months]",
        values: ["Yes"],
        label: "Gastric bypass surgery in the past 6 months",
      },
    ],
  },
};
