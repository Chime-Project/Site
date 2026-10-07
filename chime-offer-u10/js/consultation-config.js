/* Chime Health u10 consultation quiz: the reference quiz's own config module (steps, validators, show-if rules,
   progress map, DQ rules, BMI + Louisiana checks), copied verbatim from their bundle and branded (consent copy,
   links). Minified names kept as they ship; the exports at the bottom name them. */
(function (root) {
"use strict";
function nn(i, u) {
    return !Number.isFinite(i) || i <= 0 ? {
        kind: "reject",
        reason: "bmi_too_low"
    } : i < 20 ? {
        kind: "reject",
        reason: "bmi_too_low"
    } : u ? {
        kind: "route",
        account: "whitecoat",
        bmi: i
    } : i < 25 ? {
        kind: "route",
        account: "whitecoat",
        bmi: i
    } : {
        kind: "route",
        account: "portal",
        bmi: i
    }
}
const rn = "/not-eligible?reason=bmi_too_low";

function Jn(i, u) {
    return nn(i, u).kind === "reject" ? rn : null
}

function on(i) {
    const u = String(i ?? "").trim().toUpperCase();
    return u === "LOUISIANA" || u === "LA"
}

function er(i, u) {
    return i === "portal" ? u.portal : u.whitecoat
}
const an = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    sn = new Date().getFullYear(),
    ln = Array.from({
        length: 82
    }, (i, u) => sn - 18 - u);

function ut(i, u, b) {
    if (!i || !u || !b) return !0;
    const s = new Date(i, u - 1, b);
    return s.getFullYear() === i && s.getMonth() === u - 1 && s.getDate() === b
}

function cn(i, u, b) {
    const s = new Date;
    let e = s.getFullYear() - i;
    return s.getMonth() > u - 1 || s.getMonth() === u - 1 && s.getDate() >= b || (e -= 1), e
}
const un = [{
        id: "heightWeight",
        heading: "Let's check your eligibility for GLP-1 treatment.",
        subtext: "We'll use these numbers to calculate your BMI and build your treatment profile.",
        title: "What is your height and weight?",
        questionSubtext: "Your BMI helps our providers determine if GLP-1 medication is appropriate for you.",
        displayValue: {
            condition: i => i.feet != null && i.inches != null && i.weight != null,
            calculate: i => {
                const u = Number(i.feet) * 12 + Number(i.inches),
                    b = Number(i.weight);
                return !u || !b ? "" : (b * 703 / (u * u)).toFixed(1)
            },
            template: "BMI: {{value}}"
        },
        questions: [{
            id: "feet",
            question: "Height (FT)",
            type: "DROPDOWN",
            required: !0,
            options: [4, 5, 6, 7],
            apiType: "TEXT"
        }, {
            id: "inches",
            question: "Height (IN)",
            type: "DROPDOWN",
            required: !0,
            options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            apiType: "TEXT"
        }, {
            id: "weight",
            question: "Weight",
            type: "number",
            required: !0,
            placeholder: "lbs",
            apiType: "TEXT",
            validation: [{
                type: "custom",
                message: "Please enter a valid weight between 100 and 500 lbs.",
                validator: i => {
                    if (i == null || i === "") return !0;
                    const u = Number(i);
                    return Number.isNaN(u) ? !1 : u >= 100 && u <= 500
                }
            }]
        }, {
            id: "goalWeight",
            question: "Goal Weight",
            type: "number",
            required: !0,
            placeholder: "lbs",
            apiType: "TEXT",
            validation: [{
                type: "custom",
                message: "Please enter a valid goal weight between 100 and 400 lbs.",
                validator: i => {
                    if (i == null || i === "") return !0;
                    const u = Number(i);
                    return Number.isNaN(u) ? !1 : u >= 100 && u <= 400
                }
            }, {
                type: "custom",
                message: "Your goal weight must be less than your current weight.",
                validator: (i, u) => {
                    if (!i || !u) return !0;
                    const b = Number(i),
                        s = Number(u.weight);
                    return Number.isNaN(b) || Number.isNaN(s) || !s ? !0 : b < s
                }
            }]
        }]
    }, {
        id: "gender",
        heading: "Tell us about yourself.",
        subtext: "GLP-1 prescriptions require age verification and may involve pregnancy screening.",
        questionSubtext: "Why we ask: GLP-1 medications are only prescribed to adults 18+. Biological sex determines pregnancy-related safety screening.",
        questionsPerRow: 3,
        questions: [{
            id: "dobMonth",
            question: "Date of birth",
            type: "DROPDOWN",
            required: !0,
            options: Array.from({
                length: 12
            }, (i, u) => u + 1),
            optionLabels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            apiType: "TEXT"
        }, {
            id: "dobDay",
            question: "Day",
            type: "DROPDOWN",
            required: !0,
            options: Array.from({
                length: 31
            }, (i, u) => u + 1),
            apiType: "TEXT",
            validation: [{
                type: "custom",
                message: "This date is not valid for the selected month.",
                validator: (i, u) => {
                    if (!i || !u) return !0;
                    const b = Number(u.dobYear),
                        s = Number(u.dobMonth),
                        e = Number(i);
                    return !b || !s ? !0 : ut(b, s, e)
                }
            }]
        }, {
            id: "dobYear",
            question: "Year",
            type: "DROPDOWN",
            required: !0,
            options: ln,
            apiType: "TEXT",
            validation: [{
                type: "custom",
                message: "You must be at least 18 years old to use this service.",
                validator: (i, u) => {
                    if (!i || !u) return !0;
                    const b = Number(i),
                        s = Number(u.dobMonth),
                        e = Number(u.dobDay);
                    return !s || !e || !ut(b, s, e) ? !0 : cn(b, s, e) >= 18
                }
            }]
        }, {
            id: "gender",
            question: "Sex assigned at birth",
            type: "SINGLESELECT",
            options: ["Female", "Male"],
            required: !0,
            apiType: "SINGLESELECT",
            optionRowLayout: [2, 2]
        }]
    }, {
        id: "pregnancyStatus",
        heading: "Safety, screening.",
        renderCondition: i => i.gender === "Female",
        questions: [{
            id: "pregnancyStatus",
            question: "Do any of these apply to you?",
            type: "MULTISELECT",
            options: ["Currently or possibly pregnant", "Breastfeeding or bottle-feeding with breastmilk", "Have given birth to a child within the last 6 months", "None of the above"],
            required: !0,
            apiType: "MULTISELECT",
            displayAsRow: !0,
            casesApiType: "SINGLESELECT"
        }]
    }, {
        id: "menEffects",
        dynamicHeading1: "{{genderGroup}} experience unique effects from weight gain.",
        heading: "Weight gain can have unique effects.",
        questionSubtext: "This helps us tailor your treatment plan. All goals may benefit from GLP-1 therapy.",
        questionsPerRow: 1,
        questions: [{
            id: "menEffects",
            displayAsRow: !0,
            question: "Do you experience any of the following?",
            displayQuestion: "Do you experience any of the following?",
            type: "MULTISELECT",
            options: ["Low Libido", "Hair Loss", "Skin Issues", "Cognition Issues", "None of these"],
            optionImages: ["../images/q-low-libido.svg", "../images/q-hair-loss.svg", "../images/q-skit-issue.webp", "../images/q-cognition-issue.svg", "../images/q-non-of-these.svg"],
            required: !0,
            apiType: "MULTISELECT",
            casesApiType: "TEXT"
        }]
    }, {
        id: "priority",
        heading: "What is your primary goal?",
        questionSubtext: "This helps us tailor your treatment plan. All goals may benefit from GLP-1 therapy.",
        questions: [{
            id: "priority",
            type: "SINGLESELECT",
            options: ["Lose Weight", "Build Muscle", "Maintain My Current Body"],
            required: !0,
            apiType: "SINGLESELECT",
            optionImages: ["../images/q-scale.webp", "../images/q-muscle.webp", "../images/q-ok.webp"],
            optionRowLayout: [1, 3]
        }]
    }, {
        id: "pace",
        heading: "Your projected timeline",
        dynamicSubtext: "Based on your profile, you may lose approximately {{weeklyWeightLossLower}}-{{weeklyWeightLossUpper}} lbs per week, reaching your goal in about {{weeksToGoalWeight}} weeks.",
        questionSubtext: "Patients on GLP-1 therapy typically see 15–20% total body weight reduction over 12 months.",
        legalDisclaimer: "This calculation provides an estimate only and is not a prediction of your individual results. Actual weight loss depends on multiple clinical factors and is determined in consultation with your healthcare provider.",
        questions: [{
            id: "pace",
            question: "Does this pace work for you?",
            type: "SINGLESELECT",
            options: ["Yes, that works", "I'd prefer faster results", "That seems too fast"],
            required: !0,
            apiType: "SINGLESELECT",
            optionRowLayout: [1, 1]
        }]
    }, {
        id: "medicalConditions1",
        heading: "Medical history: cardiovascular and metabolic",
        questionSubtext: "Why we ask: Certain conditions may affect GLP-1 prescribing. Your answers are reviewed by a licensed provider.",
        questions: [{
            id: "medicalConditions1",
            question: "Which of these apply to you?",
            displayQuestion: "Select any conditions you currently have or have been diagnosed with.",
            type: "MULTISELECT",
            options: ["None of these", "Hypertension", "High cholesterol", "Type 2 Diabetes (on insulin or sulfonylureas)", "Type 1 diabetes", "Sleep apnea", "Personal or family history of Medullary Thyroid Carcinoma(MTC), or Multiple Endocrine Neoplasia Syndrome Type 2 (MEN-2)", "Gout", "Metabolic syndrome", "Heart disease, stroke, or peripheral vascular disease", "Heart Failure", "Atrial fibrillation or flutter", "Tachycardia or fast heart rate", "ECG or heart rhythm abnormality"],
            required: !0,
            apiType: "MULTISELECT",
            casesApiType: "TEXT",
            displayAsRow: !0
        }]
    }, {
        id: "medicalConditions2",
        heading: "Medical history: organ and systemic conditions",
        questionSubtext: "Why we ask: Certain conditions may affect GLP-1 prescribing. Your answers are reviewed by a licensed provider.",
        questions: [{
            id: "medicalConditions2",
            question: "Which of these apply to you?",
            displayQuestion: "Select any conditions you currently have or have been diagnosed with.",
            type: "MULTISELECT",
            options: ["None of these", "Gallbladder disease", "Fatty Liver Disease (MASLD or MASH)", "Cirrhosis or end-stage liver disease", "End-stage kidney disease", "Chronic Kidney Disease (Stage 3+)", "Hypothyroidism", "Hyperthyroidism, or Thyroid Issues", "Pancreatitis (history or current)", "History of or current pancreatitis", "Diabetic retinopathy", "On blood thinners/warfarin", "Cancer (active, in treatment, or in remission <5 years)"],
            required: !0,
            apiType: "MULTISELECT",
            casesApiType: "TEXT",
            displayAsRow: !0
        }]
    }, {
        id: "suicidal",
        heading: "One more important question",
        subtext: "We ask this to ensure your safety and connect you with support if needed.",
        questionSubtext: "Your answer is confidential and reviewed only by your care team. If you're in crisis, contact the 988 Suicide and Crisis Lifeline by calling or texting 988.",
        questions: [{
            id: "suicidal",
            question: "Are you currently experiencing suicidal thoughts, or have you had a prior suicide attempt?",
            type: "SINGLESELECT",
            options: ["Yes", "No"],
            required: !0,
            apiType: "SINGLESELECT",
            optionRowLayout: [1, 1]
        }]
    }, {
        id: "currentGlp1",
        heading: "Medication history",
        questionSubtext: "Why we ask: These medications may interact with GLP-1 therapy. Your provider needs this information for safe prescribing.",
        questionsPerRow: 1,
        questions: [{
            id: "currentGlp1",
            question: "Have you taken weight loss medication within the past 4 weeks?",
            type: "SINGLESELECT",
            options: ["Yes, GLP-1 medication", "Yes, a different medication", "No"],
            required: !0,
            apiType: "SINGLESELECT"
        }, {
            id: "currentGlp1Type",
            question: "Please specify your current medication",
            type: "SINGLESELECT",
            options: ["Compounded Semaglutide", "Compounded Tirzepatide", "Mounjaro", "Wegovy", "Zepbound", "Ozempic"],
            required: !0,
            apiType: "SINGLESELECT",
            renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication"
        }, {
            id: "opiates",
            question: "Have you used opiate pain medications or opiate-based substances in the past 3 months?",
            type: "SINGLESELECT",
            options: ["Yes", "No"],
            required: !0,
            apiType: "SINGLESELECT"
        }, {
            id: "opiatesInfo",
            question: "Give more details",
            type: "textarea",
            placeholder: "Please describe your opiate use",
            required: !0,
            apiType: "TEXT",
            renderCondition: i => i.opiates === "Yes"
        }]
    }, {
        id: "lastDoseDate",
        heading: "When was your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication",
        questions: [{
            id: "lastDoseDate",
            question: "Select the timeframe",
            type: "SINGLESELECT",
            options: ["0-7 Days", "8-14 Days", "More than 2 weeks but within the last month", "Over a month ago"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "lastDoseStrengthCompoundedSemaglutide",
        heading: "What was the strength of your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication" && i.currentGlp1Type === "Compounded Semaglutide",
        questions: [{
            id: "lastDoseStrengthCompoundedSemaglutide",
            question: "Last Dose Strength",
            displayQuestion: "Please provide strength in milligrams (mg) if known",
            type: "SINGLESELECT",
            options: ["0.25 mg per week", "0.50 mg per week", "1.00 mg per week", "1.50 mg per week", "2.50 mg per week"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "lastDoseStrengthWegovy",
        heading: "What was the strength of your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication" && i.currentGlp1Type === "Wegovy",
        questions: [{
            id: "lastDoseStrengthWegovy",
            question: "Last Dose Strength",
            displayQuestion: "Please provide strength in milligrams (mg) if known",
            type: "SINGLESELECT",
            options: ["0.25 mg", "0.5 mg", "1.0 mg", "1.7 mg", "2.4 mg"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "lastDoseStrengthOzempic",
        heading: "What was the strength of your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication" && i.currentGlp1Type === "Ozempic",
        questions: [{
            id: "lastDoseStrengthOzempic",
            question: "Last Dose Strength",
            displayQuestion: "Please provide strength in milligrams (mg) if known",
            type: "SINGLESELECT",
            options: ["0.25 mg", "0.5 mg", "1.0 mg", "2.0 mg"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "lastDoseStrengthCompoundedTirzepatide",
        heading: "What was the strength of your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication" && i.currentGlp1Type === "Compounded Tirzepatide",
        questions: [{
            id: "lastDoseStrengthCompoundedTirzepatide",
            question: "Last Dose Strength",
            displayQuestion: "Please provide strength in milligrams (mg) if known",
            type: "SINGLESELECT",
            options: ["2.5 mg", "5.0 mg", "7.5 mg", "10.0 mg", "12.5 mg", "15.0 mg"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "lastDoseStrengthMounjaro",
        heading: "What was the strength of your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication" && i.currentGlp1Type === "Mounjaro",
        questions: [{
            id: "lastDoseStrengthMounjaro",
            question: "Last Dose Strength",
            displayQuestion: "Please provide strength in milligrams (mg) if known",
            type: "SINGLESELECT",
            options: ["2.5 mg", "5.0 mg", "7.5 mg", "10.0 mg", "12.5 mg", "15.0 mg"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "lastDoseStrengthZepbound",
        heading: "What was the strength of your last dose?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication" && i.currentGlp1Type === "Zepbound",
        questions: [{
            id: "lastDoseStrengthZepbound",
            question: "Last Dose Strength",
            displayQuestion: "Please provide strength in milligrams (mg) if known",
            type: "SINGLESELECT",
            options: ["2.5 mg", "5.0 mg", "7.5 mg", "10.0 mg", "12.5 mg", "15.0 mg"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "dosagePreference",
        heading: "What dosage would you like to continue with?",
        renderCondition: i => i.currentGlp1 === "Yes, GLP-1 medication",
        questions: [{
            id: "dosagePreference",
            question: "Select your preferred dosage adjustment",
            type: "SINGLESELECT",
            options: ["Decrease Dose", "Stay the Same", "Increase Dose"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "weightLossSurgery",
        heading: "Your weight loss background",
        questionsPerRow: 1,
        questions: [{
            id: "weightLossSurgery",
            question: "Have you had weight loss surgery?",
            type: "SINGLESELECT",
            options: ["Yes", "No"],
            required: !0,
            apiType: "SINGLESELECT"
        }, {
            id: "weightLossSurgeryInfo",
            question: "Give more details",
            type: "textarea",
            placeholder: "Please describe your weight loss surgery",
            required: !0,
            apiType: "TEXT",
            renderCondition: i => i.weightLossSurgery === "Yes"
        }, {
            id: "weightLossPrograms",
            question: "Have you tried weight loss programs?",
            type: "SINGLESELECT",
            options: ["Yes", "No"],
            required: !0,
            apiType: "SINGLESELECT"
        }, {
            id: "weightLossProgramsInfo",
            question: "Give more details",
            type: "textarea",
            placeholder: "Please describe the weight loss programs you have tried",
            required: !0,
            apiType: "TEXT",
            renderCondition: i => i.weightLossPrograms === "Yes"
        }, {
            id: "weightChangeLastYear",
            question: "How has your weight changed in the past year?",
            type: "SINGLESELECT",
            options: ["Lost significantly", "Lost a little", "About the same", "Gained a little", "Gained significantly"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "clinicallyAppropriate",
        heading: "Lifestyle alongside treatment",
        subtext: "GLP-1 works best combined with healthy habits. If clinically appropriate, are you willing to:",
        questions: [{
            id: "clinicallyAppropriate",
            type: "MULTISELECT",
            options: ["Adjust your caloric intake", "Increase your physical activity", "Neither at this time"],
            required: !0,
            apiType: "MULTISELECT",
            casesApiType: "TEXT"
        }]
    }, {
        id: "avgBloodPressure",
        heading: "Your vitals",
        subtext: "Approximate ranges are fine.",
        questions: [{
            id: "avgBloodPressure",
            question: "Blood pressure range",
            type: "SINGLESELECT",
            options: ["<120/80 (Normal)", "120-129/<80 (Elevated)", "130-139/80-89 (High Stage 1)", "≥140/90 (High Stage 2)"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "avgHeartRate",
        heading: "How about your average resting heart rate?",
        questions: [{
            id: "avgHeartRate",
            question: "Resting heart rate",
            type: "SINGLESELECT",
            options: ["<60 bpm (Slow)", "60-100 bpm (Normal)", "101-110 bpm (Slightly Fast)", ">110 bpm (Fast)"],
            required: !0,
            apiType: "SINGLESELECT"
        }]
    }, {
        id: "currentMedications",
        heading: "Anything else your provider should know",
        questionSubtext: "Your responses are encrypted.",
        questionsPerRow: 1,
        questions: [{
            id: "currentMedications",
            question: "Do you currently take any medications?",
            type: "SINGLESELECT",
            options: ["Yes", "No"],
            required: !0,
            apiType: "SINGLESELECT"
        }, {
            id: "medicationList",
            type: "textarea",
            placeholder: "Please list your current medications",
            required: !0,
            apiType: "TEXT",
            renderCondition: i => i.currentMedications === "Yes"
        }, {
            id: "additionalInfoYesNo",
            question: "Any additional information for your care team?",
            type: "SINGLESELECT",
            options: ["Yes", "No"],
            required: !0,
            apiType: "SINGLESELECT"
        }, {
            id: "additionalInfo",
            type: "textarea",
            placeholder: "Enter details",
            required: !1,
            apiType: "TEXT",
            renderCondition: i => i.additionalInfoYesNo === "Yes"
        }]
    }, {
        id: "personalInfo",
        heading: "Your Medical Review",
        subtext: "Let's proceed to check your eligibility.",
        questionSubtext: "Medication can only be shipped to certain states. Your provider review begins after you complete this form.",
        questions: [{
            id: "firstName",
            question: "First Name",
            type: "text",
            required: !0,
            placeholder: "Enter your first name",
            apiType: "TEXT",
            validation: [{
                type: "required",
                message: "First name is required."
            }, {
                type: "minLength",
                value: 2,
                message: "First name must be at least 2 characters."
            }, {
                type: "maxLength",
                value: 50,
                message: "First name must be at most 50 characters."
            }, {
                type: "pattern",
                value: "^[a-zA-Z\\s\\-']+$",
                message: "Please enter a valid name (letters, spaces, hyphens, or apostrophes)."
            }]
        }, {
            id: "lastName",
            question: "Last Name",
            type: "text",
            required: !0,
            placeholder: "Enter your last name",
            apiType: "TEXT",
            validation: [{
                type: "required",
                message: "Last name is required."
            }, {
                type: "minLength",
                value: 2,
                message: "Last name must be at least 2 characters."
            }, {
                type: "maxLength",
                value: 50,
                message: "Last name must be at most 50 characters."
            }, {
                type: "pattern",
                value: "^[a-zA-Z\\s\\-']+$",
                message: "Please enter a valid name (letters, spaces, hyphens, or apostrophes)."
            }]
        }, {
            id: "shippingState",
            question: "What state will your medication be shipped to?",
            type: "DROPDOWN",
            required: !0,
            options: an,
            apiType: "TEXT"
        }]
    }, {
        id: "contactInfo",
        dynamicHeading1: "{{firstName}}, how should we reach you?",
        heading: "How should we reach you?",
        subtext: "Your care team uses email and text for appointment updates and prescription status.",
        showTrustBadges: !0,
        questionsPerRow: 1,
        questions: [{
            id: "email",
            question: "Email Address",
            type: "email",
            required: !0,
            placeholder: "you@example.com",
            apiType: "TEXT",
            validation: [{
                type: "required",
                message: "Email address is required."
            }, {
                type: "email",
                message: "Please enter a valid email address."
            }]
        }, {
            id: "phone",
            question: "Phone Number",
            type: "tel",
            required: !0,
            placeholder: "(123)-456-7890",
            apiType: "TEXT",
            validation: [{
                type: "required",
                message: "Phone number is required."
            }, {
                type: "phone",
                message: "Please enter a valid US phone number."
            }]
        }, {
            id: "consent",
            type: "CHECKBOX",
            required: !0,
            startValue: !0,
            options: ["I confirm that I am the patient completing this intake form and that my answers are accurate and complete to the best of my knowledge. I understand the importance of providing accurate health information for my care. I agree to the <a href='../../terms-conditions.html' class='text-[#f88c08] font-headingAlt underline' target='_blank'>Terms of Service</a> and <a href='../../privacy-policy.html' class='text-[#f88c08] font-headingAlt underline' target='_blank'>Privacy Policy</a>."],
            apiType: "SINGLESELECT"
        }, {
            id: "smsConsent",
            type: "CHECKBOX",
            required: !1,
            startValue: !0,
            options: ["I consent to receive text message alerts from Chime Health at the phone number provided, including discounts, and product/service updates. Msg frequency varies. Msg & data rates may apply. Reply HELP for help, STOP to opt out. Consent is not a condition of purchase. View our <a href='../../privacy-policy.html' class='text-[#f88c08] font-headingAlt underline' target='_blank'>Privacy Policy</a> and <a href='../../terms-conditions.html' class='text-[#f88c08] font-headingAlt underline' target='_blank'>Terms & Conditions</a>."],
            apiType: "SINGLESELECT"
        }]
    }],
    vt = {
        id: "weight-loss",
        name: "Weight Loss Intake Form",
        description: "Comprehensive medical intake form for GLP-1 weight loss medication",
        version: "1.0.0",
        progressSteps: [{
            id: "start",
            name: "Start",
            description: "Weight loss goals and past initiatives",
            color: "#A75809"
        }, {
            id: "preliminary",
            name: "Preliminary",
            description: "BMI, age, and GLP-1 medication status",
            color: "#A75809"
        }, {
            id: "health",
            name: "Health",
            description: "Health screening and medical history",
            color: "#A75809"
        }, {
            id: "details",
            name: "Details",
            description: "Current medications and surgical history",
            color: "#A75809"
        }, {
            id: "eligibility",
            name: "Eligibility",
            description: "ID upload, consultation type, and consent",
            color: "#A75809"
        }],
        stepProgressMapping: [{
            stepId: "heightWeight",
            progressStepId: "start"
        }, {
            stepId: "gender",
            progressStepId: "start"
        }, {
            stepId: "pregnancyStatus",
            progressStepId: "start"
        }, {
            stepId: "menEffects",
            progressStepId: "preliminary"
        }, {
            stepId: "priority",
            progressStepId: "preliminary"
        }, {
            stepId: "pace",
            progressStepId: "health"
        }, {
            stepId: "medicalConditions1",
            progressStepId: "health"
        }, {
            stepId: "medicalConditions2",
            progressStepId: "health"
        }, {
            stepId: "suicidal",
            progressStepId: "health"
        }, {
            stepId: "currentGlp1",
            progressStepId: "health"
        }, {
            stepId: "lastDoseDate",
            progressStepId: "health"
        }, {
            stepId: "lastDoseStrengthCompoundedSemaglutide",
            progressStepId: "health"
        }, {
            stepId: "lastDoseStrengthWegovy",
            progressStepId: "health"
        }, {
            stepId: "lastDoseStrengthOzempic",
            progressStepId: "health"
        }, {
            stepId: "lastDoseStrengthCompoundedTirzepatide",
            progressStepId: "health"
        }, {
            stepId: "lastDoseStrengthMounjaro",
            progressStepId: "health"
        }, {
            stepId: "lastDoseStrengthZepbound",
            progressStepId: "health"
        }, {
            stepId: "dosagePreference",
            progressStepId: "health"
        }, {
            stepId: "weightLossSurgery",
            progressStepId: "health"
        }, {
            stepId: "clinicallyAppropriate",
            progressStepId: "details"
        }, {
            stepId: "avgBloodPressure",
            progressStepId: "details"
        }, {
            stepId: "avgHeartRate",
            progressStepId: "details"
        }, {
            stepId: "currentMedications",
            progressStepId: "details"
        }, {
            stepId: "personalInfo",
            progressStepId: "eligibility"
        }, {
            stepId: "contactInfo",
            progressStepId: "eligibility"
        }],
        steps: un,
        metadata: {
            category: "medical",
            estimatedTime: "15-20 minutes",
            targetAudience: "Adults seeking weight loss medication",
            compliance: ["HIPAA", "FDA guidelines"]
        }
    };
const St = 1,
    fn = 2,
    pn = .15,
    hn = .2,
    dt = 52;;
const Mn = {
    pregnancyStatus: ["Currently or possibly pregnant", "Breastfeeding or bottle-feeding with breastmilk"],
    medicalConditions1: ["Type 1 diabetes", "Type 2 Diabetes (on insulin or sulfonylureas)"],
    suicidal: ["Yes"],
    medicalConditions2: ["Gallbladder disease", "Cirrhosis or end-stage liver disease", "History of or current pancreatitis", "On blood thinners/warfarin"]
};
var api = { steps: un, quiz: vt, DQ_RULES: Mn, bmiDecision: nn, BMI_REJECT_PATH: rn, bmiRejectPath: Jn,
  isLouisiana: on, STATES: an, DOB_YEARS: ln, isValidDate: ut, ageFrom: cn,
  WEEKLY_LOSS_LOWER: St, WEEKLY_LOSS_UPPER: fn };
root.ChimeU10QuizConfig = api;
if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : this);
