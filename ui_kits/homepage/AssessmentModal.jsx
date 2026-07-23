// Chime Health — assessment entry point for site chrome.
// The dummy in-page quiz modal that used to live here is retired: the real
// intake is assessment.html (ui_kits/assessment/AssessmentFlow.jsx). Site CTAs
// still call window.openChimeAssessment() — on marketing/legal pages that now
// navigates to the assessment page; on assessment.html itself, AssessmentFlow
// overrides the same function to scroll to the form instead of reloading.
// The component keeps its name so existing <ChimeAssessmentModal /> mounts work.
function ChimeAssessmentModal() {
  React.useEffect(() => {
    window.openChimeAssessment = () => { window.location.assign("assessment.html"); };
    return () => { delete window.openChimeAssessment; };
  }, []);
  return null;
}

Object.assign(window, { ChimeAssessmentModal });
