// Chime Health — Weight Loss page: shared building blocks.
// Loaded by weight-loss.html solely to supply <WLReveal> to the WL sections
// (hero · bodies · timeline · calculator).
//
// Phase 7: this file used to also carry ChimeWeightLossSection, WLProductCarousel,
// WLButton and WL_UPLOADS/WL_SOLID — a stale fork of homepage/WeightLossSection.jsx
// that no page ever rendered (weight-loss.html never mounts <ChimeWeightLossSection>,
// and homepage.html loads its own copy, which defines all four symbols itself).
// The fork had drifted independently — green-black glass rgba(38,52,34,α) where the
// theme contract maps to navy, and a WLButton missing the `wrap` prop — and its
// duplicate ChimeWeightLossSection global shadowed the live homepage one by name.
// Removed as dead code; the live section is homepage/WeightLossSection.jsx.

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function WLReveal(props) {
  return <Reveal {...props} />;
}
