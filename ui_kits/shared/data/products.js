// Chime Health — shared product catalog (single source of truth).
// Consumed by:
//   - ui_kits/homepage/ProductsSection.jsx  (Treatments card carousel — all products)
//   - ui_kits/shared/common/RxCarousel.jsx  (per-category Rx slider — filters by
//     `theme` and skips "Coming soon"; used on the homepage WL/Wellness sections
//     and inside MembershipPanel on the WL/Wellness landing pages)
// Load this plain script before those components.
//
// Catalog: uploads/vials/ (10 distinct products; GLP-1 has two label colorways,
// the blue one is used). Images are the resized .webp copies next to the PNGs.
//
// Fields per product:
//   start  — "Starting from $X/mo" figure for the Rx slider (M2M unless noted)
//   price  — card fallback label when the selected term has no plan entry
//   plans  — keyed by term; "1mo" feeds the card's 1-Month tab, the Rx slider
//            shows the multi-month rows only
//
// ── Pricing provenance ("Product Flows for Design.xlsx", uploads/) ──
//   GLP Squared            Chime Flows, TR flow (real).
//   Semaglutide            AmeriLean Flows, TR flow — ⚠️ borrowed from the
//   Tirzepatide            AmeriLean brand until Chime numbers land.
//   NAD+                   Chime Flows upsell (1M $209 / 3M $149·mo).
//   GLP-1                  ⚠️ NO sheet row — mirrors Semaglutide as placeholder.
//   GHK-Cu, Glow Stack,    ⚠️ NO sheet row — round placeholder rates (multi-month
//   PT-141, TB-500           ladder ≈10/15/20% off the monthly rate), flagged
//                            for review before launch.
//   Sermorelin             Pre-existing site value (From $190/mo), Coming soon.
window.CHIME_PRODUCTS = [
  // ---- Weight Loss ----
  { id: "prod-glp-squared", name: "GLP Squared", category: "Weight Loss", theme: "weight-loss",
    img: "vials/glp-squared.webp", status: "In stock", badge: null,
    start: "$299.00", price: "From $299/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "From $299.00" },
      { key: "3mo", term: "3 Months", price: "$996.00", permo: "$332" },
      { key: "6mo", term: "6 Months", price: "$1,914.00", permo: "$319" },
      { key: "1yr", term: "1 Year", price: "$3,588.00", permo: "$299" },
    ] },
  { id: "prod-glp-1", name: "GLP-1", category: "Weight Loss", theme: "weight-loss",
    img: "vials/glp-1.webp", status: "In stock", badge: null,
    start: "$179.00", price: "From $179/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "From $179.00" },
      { key: "3mo", term: "3 Months", price: "$627.00", permo: "$209" },
      { key: "6mo", term: "6 Months", price: "$1,194.00", permo: "$199" },
      { key: "1yr", term: "1 Year", price: "$2,148.00", permo: "$179" },
    ] },
  { id: "prod-semaglutide", name: "Semaglutide", category: "Weight Loss", theme: "weight-loss",
    img: "vials/semaglutide.webp", status: "In stock", badge: null,
    start: "$179.00", price: "From $179/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "From $179.00" },
      { key: "3mo", term: "3 Months", price: "$627.00", permo: "$209" },
      { key: "6mo", term: "6 Months", price: "$1,194.00", permo: "$199" },
      { key: "1yr", term: "1 Year", price: "$2,148.00", permo: "$179" },
    ] },
  { id: "prod-tirzepatide", name: "Tirzepatide", category: "Weight Loss", theme: "weight-loss",
    img: "vials/tirzepatide.webp", status: "In stock", badge: null,
    start: "$279.00", price: "From $279/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "From $279.00" },
      { key: "3mo", term: "3 Months", price: "$948.00", permo: "$316" },
      { key: "6mo", term: "6 Months", price: "$1,794.00", permo: "$299" },
      { key: "1yr", term: "1 Year", price: "$2,988.00", permo: "$249" },
    ] },

  // ---- Energy & Wellness ----
  { id: "prod-nad", name: "NAD+", category: "Energy & Wellness", theme: "energy-wellness",
    img: "vials/nad-plus.webp", status: "In stock", badge: null,
    start: "$149.00", price: "From $149/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "$209.00" },
      { key: "3mo", term: "3 Months", price: "$447.00", permo: "$149" },
    ] },
  { id: "prod-glow-stack", name: "Glow Stack", category: "Energy & Wellness", theme: "energy-wellness",
    img: "vials/glow-stack.webp", status: "In stock", badge: null,
    start: "$199.00", price: "From $199/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "$199.00" },
      { key: "3mo", term: "3 Months", price: "$537.00", permo: "$179" },
      { key: "6mo", term: "6 Months", price: "$1,014.00", permo: "$169" },
      { key: "1yr", term: "1 Year", price: "$1,908.00", permo: "$159" },
    ] },
  { id: "prod-ghk-cu", name: "GHK-Cu", category: "Energy & Wellness", theme: "energy-wellness",
    img: "vials/ghk-cu.webp", status: "In stock", badge: null,
    start: "$119.00", price: "From $119/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "$119.00" },
      { key: "3mo", term: "3 Months", price: "$327.00", permo: "$109" },
      { key: "6mo", term: "6 Months", price: "$594.00", permo: "$99" },
      { key: "1yr", term: "1 Year", price: "$1,068.00", permo: "$89" },
    ] },
  { id: "prod-pt-141", name: "PT-141", category: "Energy & Wellness", theme: "energy-wellness",
    img: "vials/pt-141.webp", status: "In stock", badge: null,
    start: "$99.00", price: "From $99/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "$99.00" },
      { key: "3mo", term: "3 Months", price: "$267.00", permo: "$89" },
      { key: "6mo", term: "6 Months", price: "$474.00", permo: "$79" },
      { key: "1yr", term: "1 Year", price: "$828.00", permo: "$69" },
    ] },
  { id: "prod-tb-500", name: "TB-500", category: "Energy & Wellness", theme: "energy-wellness",
    img: "vials/tb-500.webp", status: "In stock", badge: null,
    start: "$159.00", price: "From $159/mo",
    plans: [
      { key: "1mo", term: "1 Month", price: "$159.00" },
      { key: "3mo", term: "3 Months", price: "$447.00", permo: "$149" },
      { key: "6mo", term: "6 Months", price: "$834.00", permo: "$139" },
      { key: "1yr", term: "1 Year", price: "$1,548.00", permo: "$129" },
    ] },
  { id: "prod-sermorelin", name: "Sermorelin", category: "Energy & Wellness", theme: "energy-wellness",
    img: "vials/sermorelin.webp", status: "Coming soon", badge: "Coming soon",
    start: "$190.00", price: "From $190/mo",
    plans: [] },
];
