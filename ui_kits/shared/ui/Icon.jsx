// Chime Health — shared icon primitive.
// Standardizes the <svg> wrapper only (viewBox / fill / stroke / caps); the
// geometry is passed in as children.
//   size:        px, sets width + height (default 24)
//   strokeWidth: default 2
//
// Deliberately LINEAGE-NEUTRAL: this bundle mixes two icon sets — lucide (Hero)
// and feather (WLBodiesSection) — which draw the same concepts (zap,
// shield-check, users) with different geometry. This atom does NOT pick a
// winner; it only removes the duplicated <svg> boilerplate. Unifying the
// artwork is a visual decision, not a refactor — see REFACTOR_PLAN Phase 7.
function Icon({ size = 24, strokeWidth = 2, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

Object.assign(window, { Icon });
