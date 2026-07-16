// Chime Health — shared FAQ content. Load before FaqAccordion.jsx.
// Keyed by page theme; render with <FaqAccordion items={window.CHIME_FAQS[key]} />.
window.CHIME_FAQS = {
  "weight-loss": [
    { q: "How does the Chime weight loss program work?",
      a: "It starts with a short assessment. A licensed provider reviews your goals and health history, and — if it's a fit — builds a personalized plan that may include GLP-1 medication, coaching, and ongoing support that adjusts as you progress." },
    { q: "What is the difference between GLP-1 and GLP1/GIP medications?",
      a: "GLP-1 medications help regulate appetite and blood sugar. GLP1/GIP medications act on an additional hormone pathway (GIP) and are often prescribed for greater results. Your provider recommends the option best suited to your body and goals." },
    { q: "Is a GLP-1 medication right for me?",
      a: "You don't have to figure it out alone. After your assessment, a licensed provider reviews your information to determine whether medication is appropriate and, if so, which one — always with clinical oversight." },
    { q: "Will I speak with a provider?",
      a: "Yes. A licensed provider reviews your information and is involved in any recommendations or treatments, so your plan always has clinical oversight from day one." },
    { q: "How much does it cost?",
      a: "Plans start from $249/mo. You can choose 3-month, 6-month, or 1-year terms, and some promotional plans include a 4th month free. Everything is transparent before you commit — no surprise fees." },
    { q: "Do I need lab testing first?",
      a: "Sometimes. Depending on your goals and health history, your provider may recommend lab work so your plan can be tailored to you and reviewed for safety before you start." },
    { q: "What kind of support will I have?",
      a: "Your care team stays with you the whole way — with a wellness coach for accountability, a provider for clinical oversight, and regular check-ins that adjust your plan as your life changes. You're Not Doing This Alone™." },
  ],
  // NOTE: placeholder marketing copy pending review. Deliberately avoids prices
  // and turnaround times — panel pricing isn't set (ChimeLabsSection still shows
  // "From $—"), so no figures are stated here. Claims are kept in line with the
  // Labs disclaimer: provider-ordered, informational, not a diagnosis, and not
  // available in all 50 states.
  lab: [
    { q: "How do Chime health insights work?",
      a: "It starts with a short assessment. A licensed provider orders your panel, your sample is collected at a nearby lab, and your results are reviewed by a provider — then turned into a personalized path built around what your biomarkers show." },
    { q: "What is the difference between the panels?",
      a: "Each panel goes a level deeper: Comprehensive covers 80+ biomarkers, Complete 100+, and Executive 130+. If you're not sure which fits, your provider can help you choose based on your goals and health history." },
    { q: "Where is my sample collected?",
      a: "At a partner lab near you. It's a standard blood draw that usually takes just a few minutes — you'll get your location options and any preparation instructions when you book." },
    { q: "Will a provider review my results?",
      a: "Yes. Lab tests are ordered and reviewed by licensed providers, so your results always have clinical oversight. You can also add a 45-minute lab review to walk through what your results mean and what to consider next." },
    { q: "Are my results a diagnosis?",
      a: "No. Results are informational and are not a diagnosis. They're designed to help uncover biomarkers that may support conversations about your wellness, energy, metabolism, recovery, and long-term health with your provider." },
    { q: "Do I need to fast before my test?",
      a: "Sometimes. Certain biomarkers — like glucose and cholesterol — can be affected by recent meals, so your provider may ask you to fast beforehand. Any instructions are shared with you before your appointment." },
    { q: "Is testing available where I live?",
      a: "Lab testing is not available in all 50 states, and the panels offered can vary by location. You'll see what's available to you once you start your assessment." },
  ],
  wellness: [
    { q: "How does the Chime Energy & Wellness program work?",
      a: "It starts with your goals. A wellness coach and licensed provider help you explore options — from coaching and health insights to wellness therapies — and build a personalized path designed around your needs." },
    { q: "What is NAD+?",
      a: "NAD+ is a coenzyme found naturally in every cell that plays a role in energy production and cellular health. Some members explore it as part of a personalized wellness plan — your provider can help determine whether it may be a fit for you." },
    { q: "What is LIPO-C?",
      a: "LIPO-C is a blend of compounds — often including B-vitamins and amino acids — that some people use to support metabolism and everyday energy. Whether it's appropriate for you is determined during your provider consultation." },
    { q: "How do I know which option is right for me?",
      a: "You don't have to figure it out alone. After a short assessment, your wellness coach and provider review your goals and health background to recommend the options best suited to you." },
    { q: "Will I speak with a provider?",
      a: "Yes. A licensed provider reviews your information and is involved in any recommendations or treatments, so your plan always has clinical oversight." },
    { q: "Do I need lab testing first?",
      a: "Sometimes. Depending on your goals and the options you're exploring, your provider may recommend lab work so any plan can be tailored to you and reviewed for safety." },
    { q: "How does wellness coaching work?",
      a: "Your coach is a consistent point of support — helping you set goals, stay accountable, and adjust your plan as your life changes, with regular check-ins along the way." },
  ],
};
