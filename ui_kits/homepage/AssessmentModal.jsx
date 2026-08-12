// Chime Health — assessment entry point for site chrome.
// The dummy in-page quiz modal that used to live here is retired: the real
// intake is chimeAssessment.html (ui_kits/chimeAssessment/AssessmentV4Flow.jsx),
// the v4 build formerly served at assessment2.html. Site CTAs still call
// window.openChimeAssessment() — on marketing/legal pages that navigates to the
// assessment page; on chimeAssessment.html itself, AssessmentV4Flow overrides the
// same function to scroll to the form instead of reloading.
// The older v1 intake (assessment.html + ui_kits/assessment/) is no longer linked
// from anywhere, but its AssessmentControls.jsx primitives are still loaded by
// chimeAssessment.html — do not delete that kit.
// The component keeps its name so existing <ChimeAssessmentModal /> mounts work.
function ChimeAssessmentModal() {
  React.useEffect(() => {
    window.openChimeAssessment = () => { window.location.assign("chimeAssessment.html"); };
    return () => { delete window.openChimeAssessment; };
  }, []);
  return null;
}

Object.assign(window, { ChimeAssessmentModal });
