// Chime Health — Labs UI kit: 4-up trust-badge strip that sits directly above
// the footer. Icon → title → one-line reassurance, with hairline rules between
// the columns and above the strip.
//
// Deliberately NEUTRAL, not accent-themed: this is quiet closing chrome, so it
// binds only to semantic tokens (--fg-*, --border-default, --bg-default) and the
// icons ride currentColor. That keeps it contract-clean and identical on every
// page. `theme` is still accepted/forwarded so a future accent tweak is a
// one-token change rather than a refactor.
//
// Icon geometry is hand-built and handed to the shared Icon atom, which already
// supplies the stroke-only / round-cap / currentColor wrapper.

const LABS_TRUST_ICONS = {
  // Headset: headband arc + two ear cups + mic boom.
  headset: (
    <React.Fragment>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2" y="13" width="4.5" height="7" rx="2.25" />
      <rect x="17.5" y="13" width="4.5" height="7" rx="2.25" />
      <path d="M19.75 20v0.5a2.5 2.5 0 0 1-2.5 2.5H13.5" />
    </React.Fragment>
  ),
  // Payment card: rounded card + magnetic stripe.
  card: (
    <React.Fragment>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="14.5" x2="10" y2="14.5" />
    </React.Fragment>
  ),
  // Padlock: body + shackle.
  lock: (
    <React.Fragment>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </React.Fragment>
  ),
  // Map pin with dot.
  pin: (
    <React.Fragment>
      <path d="M20 10.5c0 5.8-8 11.5-8 11.5s-8-5.7-8-11.5a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10.5" r="2.75" />
    </React.Fragment>
  ),
};

const LABS_TRUST_ITEMS = [
  { icon: "headset", title: "Customer Support",
    body: "Our team is here to help, every step of the way." },
  { icon: "card", title: "HSA/FSA Eligible",
    body: "Use your health savings funds for lab testing via TrueMed." },
  { icon: "lock", title: "Secure Payment",
    body: "Your payment information and personal details are processed securely." },
  { icon: "pin", title: "Local Lab Locations",
    body: "Over 2000 partnered US laboratory locations." },
];

function LabsTrustItem({ item, first }) {
  return (
    <div className="labs-trust-item" style={{
      // Divider sits on every column but the first → 3 rules between 4 items.
      // The page's <960px rule drops these with !important.
      borderLeft: first ? "none" : "1px solid var(--border-default)",
      padding: "0 var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
    }}>
      <span aria-hidden="true" style={{ color: "var(--fg-default)", display: "flex" }}>
        <Icon size={22} strokeWidth={1.6}>{LABS_TRUST_ICONS[item.icon]}</Icon>
      </span>
      <div style={{
        fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
        lineHeight: 1.35, color: "var(--fg-default)",
      }}>{item.title}</div>
      <p style={{
        margin: 0, fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-normal)", lineHeight: 1.5,
        color: "var(--fg-muted)",
      }}>{item.body}</p>
    </div>
  );
}

function LabsTrustSection({ theme = "lab", items = LABS_TRUST_ITEMS }) {
  return (
    <section data-screen-label="Trust" data-theme={theme}
      className="labs-trust-section" style={{
        background: "var(--bg-default)",
        borderTop: "1px solid var(--border-default)",
        fontFamily: "var(--font-family-base)",
      }}>
      <div className="labs-trust-grid" style={{
        maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
        padding: "var(--spacing-10) var(--spacing-6)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      }}>
        {items.map(function (item, i) {
          return <LabsTrustItem key={item.title} item={item} first={i === 0} />;
        })}
      </div>
    </section>
  );
}

Object.assign(window, { LabsTrustSection });
