// Chime Health — shared product data (single source of truth).
// The Rx product carousel (GLP-1 + GLP1/GIP) is used by the homepage Weight Loss
// section, the Weight Loss timeline, and the Wellness timeline. Load this plain
// script before those components so window.CHIME_RX_PRODUCTS is defined.
window.CHIME_RX_PRODUCTS = [
  { name: "GLP-1", start: "$249.00", plans: [
    { term: "3 Months", price: "$596.00", promo: true },
    { term: "6 Months", price: "$1,050.00" },
    { term: "1 Year", price: "$1,800.00" },
  ] },
  { name: "GLP1/GIP", start: "$359.00", plans: [
    { term: "3 Months", price: "$896.00", promo: true },
    { term: "6 Months", price: "$1,650.00" },
    { term: "1 Year", price: "$2,880.00" },
  ] },
];
