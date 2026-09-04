const MINUS_PATH =
  "M4 12C4 11.4477 4.35817 11 4.8 11H19.2C19.6418 11 20 11.4477 20 12C20 12.5523 19.6418 13 19.2 13H4.8C4.35817 13 4 12.5523 4 12Z";
const PLUS_PATH =
  "M12 3C12.5523 3 13 3.44772 13 4V11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H13V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H11V4C11 3.44772 11.4477 3 12 3Z";

const cards = document.querySelectorAll(".grid > label[data-state]");
const modal = document.querySelector(".dynamicModal");
const modalImg = modal.querySelector("img.rounded-xl");
const modalPriceBadge = modal.querySelector(".absolute.top-4 .rounded-2xl");
const modalH1 = modal.querySelector('h1[data-slot="heading"]');
const modalH2 = modal.querySelector('h2[data-slot="heading"]');
const modalDescP = modal.querySelector("button[aria-controls] p");
const accordionBtns = modal.querySelectorAll("button[aria-controls]");
const footerLinks = modal.querySelectorAll('[data-slot="dialog-footer"] a');

// ── Accordion helper ────────────────────────────────────────────
function setAccordion(btn, open) {
  btn.dataset.state = open ? "open" : "closed";
  btn.setAttribute("aria-expanded", String(open));
  const panel = document.getElementById(btn.getAttribute("aria-controls"));
  if (panel) {
    panel.dataset.state = open ? "open" : "closed";
    panel.hidden = !open;
  }
  const iconPath = btn.querySelector('[data-slot="accordion-icon"] path');
  if (iconPath) iconPath.setAttribute("d", open ? MINUS_PATH : PLUS_PATH);
}

// ── Reset accordions: first open, rest closed ───────────────────
function resetAccordions() {
  accordionBtns.forEach((btn, i) => setAccordion(btn, i === 0));
}

// ── Close modal ─────────────────────────────────────────────────
const closeModal = () => modal.classList.add("hidden");

// ── Card single-select ──────────────────────────────────────────
cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest('[data-slot="product-card-label"]')) return;
    cards.forEach((c) => (c.dataset.state = "unchecked"));
    card.dataset.state = "checked";
  });
});

// ── Learn more → populate + open modal ─────────────────────────
document.querySelectorAll('[data-slot="product-card-label"]').forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const card = btn.closest(".grid > label");
    const imgSrc = card.querySelector("img")?.src ?? "";
    const name =
      card
        .querySelector('[data-slot="showcase-card-title"]')
        ?.textContent.trim() ?? "";
    const desc =
      card
        .querySelector('[data-slot="showcase-card-description"] p')
        ?.textContent.trim() ?? "";
    const price =
      [...card.querySelectorAll(".rounded-2xl")]
        .find((el) => el.textContent.includes("$"))
        ?.textContent.trim() ?? "";

    if (modalImg) modalImg.src = imgSrc;
    if (modalPriceBadge) modalPriceBadge.textContent = price;
    if (modalH1) modalH1.textContent = name;
    if (modalH2) modalH2.textContent = `Product details for ${name}.`;
    if (modalDescP) modalDescP.textContent = desc;

    resetAccordions();
    modal.classList.remove("hidden");
  });
});

// ── Accordion toggle (one open at a time) ───────────────────────
accordionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const isOpen = btn.dataset.state === "open";
    accordionBtns.forEach((b) => setAccordion(b, false));
    if (!isOpen) setAccordion(btn, true);
  });
});

// ── Backdrop click ──────────────────────────────────────────────
modal.querySelector(".fixed.inset-0").addEventListener("click", closeModal);

// ── Footer buttons ──────────────────────────────────────────────
footerLinks[0]?.addEventListener("click", closeModal);
footerLinks[1]?.addEventListener("click", () => {
  window.location.href = "step18.html";
});
