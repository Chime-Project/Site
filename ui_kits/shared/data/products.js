// Chime Health — shared product data (single source of truth).
// The Rx product carousel is used by the homepage Weight Loss section, the
// Weight Loss timeline, and the Wellness timeline. Load this plain script
// before those components so window.CHIME_RX_PRODUCTS is defined.
// Pricing: "Product Flows for Design.xlsx" (uploads/), Chime Flows sheet,
// TR flow — GLP Squared M2M $299 ($399 compare-at, not shown), 3M $996,
// 6M $1,914, 12M $3,588; `permo` is the sheet's effective monthly rate.
window.CHIME_RX_PRODUCTS = [
  { name: "GLP Squared", start: "$299.00", plans: [
    { term: "3 Months", price: "$996.00", permo: "$332" },
    { term: "6 Months", price: "$1,914.00", permo: "$319" },
    { term: "1 Year", price: "$3,588.00", permo: "$299" },
  ] },
];
