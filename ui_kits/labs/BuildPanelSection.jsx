// Chime Health — Labs UI kit: "Build your own panel" biomarker selector.
// Filter / search / sort a biomarker catalogue, page through it, and assemble a
// custom panel in a sticky cart.
//
// Theme-agnostic per THEME_CONTRACT.md — semantic tokens only, no palette
// primitives and no brand hex. This section deliberately does NOT set its own
// `data-theme`: it inherits the accent from whatever ancestor sets one (the labs
// page sets `lab` on <html>), so dropping it on another page re-skins it for free.
//
// NOTE: prices are PLACEHOLDERS, consistent with LABS_TIERS in
// LabsProductDetailSection — real pricing isn't set yet. Swap BUILD_PANEL_MARKERS
// once it is. "Quick view" intentionally shows only facts we hold (category and
// pricing); it invents no clinical description copy.

// Button / Input / Select come from dsbundle.js, which exports into a namespace
// rather than onto window — `Button` is NOT a global on this page (the shared
// ui/Button.jsx is a different component and labs.html doesn't load it).
const BP_DS = window.ChimeHealthDesignSystem_b350cf || {};
const DSButton = BP_DS.Button;
const DSInput = BP_DS.Input;
const DSSelect = BP_DS.Select;

const BUILD_PANEL_PER_PAGE = 5;

const BUILD_PANEL_CATEGORIES = [
  "All", "Sex Hormones", "Metabolic Health", "Inflammation", "Heart Health",
  "Thyroid Function", "Vitamins & Minerals", "Kidney Health", "Cancer Screening",
  "Genetic Testing", "Adrenal Health",
];

// Array order is the "Featured" sort. `was` present ⇒ discounted.
const BUILD_PANEL_MARKERS = [
  { id: "testosterone-total", name: "Total Testosterone", category: "Sex Hormones", price: 39, was: 59 },
  { id: "estradiol", name: "Estradiol (E2)", category: "Sex Hormones", price: 42 },
  { id: "progesterone", name: "Progesterone", category: "Sex Hormones", price: 38 },
  { id: "shbg", name: "SHBG", category: "Sex Hormones", price: 35, was: 49 },
  { id: "hba1c", name: "Hemoglobin A1c", category: "Metabolic Health", price: 29, was: 45 },
  { id: "fasting-insulin", name: "Fasting Insulin", category: "Metabolic Health", price: 34, was: 49 },
  { id: "fasting-glucose", name: "Fasting Glucose", category: "Metabolic Health", price: 19 },
  { id: "leptin", name: "Leptin", category: "Metabolic Health", price: 55 },
  { id: "hs-crp", name: "hs-CRP", category: "Inflammation", price: 29, was: 42 },
  { id: "homocysteine", name: "Homocysteine", category: "Inflammation", price: 39 },
  { id: "ferritin", name: "Ferritin", category: "Inflammation", price: 32, was: 45 },
  { id: "lipid-panel", name: "Lipid Panel", category: "Heart Health", price: 35, was: 55 },
  { id: "apob", name: "ApoB", category: "Heart Health", price: 44, was: 65 },
  { id: "lp-a", name: "Lipoprotein(a)", category: "Heart Health", price: 49 },
  { id: "nt-probnp", name: "NT-proBNP", category: "Heart Health", price: 59 },
  { id: "tsh", name: "TSH", category: "Thyroid Function", price: 29, was: 39 },
  { id: "free-t4", name: "Free T4", category: "Thyroid Function", price: 32 },
  { id: "free-t3", name: "Free T3", category: "Thyroid Function", price: 34, was: 48 },
  { id: "tpo-antibodies", name: "TPO Antibodies", category: "Thyroid Function", price: 45 },
  { id: "vitamin-d", name: "Vitamin D (25-OH)", category: "Vitamins & Minerals", price: 35, was: 52 },
  { id: "vitamin-b12", name: "Vitamin B12", category: "Vitamins & Minerals", price: 28 },
  { id: "folate", name: "Folate", category: "Vitamins & Minerals", price: 26 },
  { id: "magnesium-rbc", name: "Magnesium (RBC)", category: "Vitamins & Minerals", price: 42, was: 58 },
  { id: "creatinine-egfr", name: "Creatinine & eGFR", category: "Kidney Health", price: 22 },
  { id: "cystatin-c", name: "Cystatin C", category: "Kidney Health", price: 46, was: 62 },
  { id: "uric-acid", name: "Uric Acid", category: "Kidney Health", price: 24 },
  { id: "psa-total", name: "PSA (Total)", category: "Cancer Screening", price: 39, was: 55 },
  { id: "ca-125", name: "CA-125", category: "Cancer Screening", price: 52 },
  { id: "cea", name: "CEA", category: "Cancer Screening", price: 48 },
  { id: "apoe", name: "APOE Genotype", category: "Genetic Testing", price: 99, was: 149 },
  { id: "mthfr", name: "MTHFR Variant", category: "Genetic Testing", price: 79 },
  { id: "factor-v-leiden", name: "Factor V Leiden", category: "Genetic Testing", price: 89, was: 119 },
  { id: "cortisol-am", name: "Cortisol (AM)", category: "Adrenal Health", price: 36, was: 49 },
  { id: "dhea-s", name: "DHEA-S", category: "Adrenal Health", price: 40 },
  { id: "aldosterone", name: "Aldosterone", category: "Adrenal Health", price: 54 },
];

const BUILD_PANEL_SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
];

function buildPanelDiscount(m) {
  if (!m.was || m.was <= m.price) return 0;
  return Math.round(((m.was - m.price) / m.was) * 100);
}

// Initials for the swatch — derived from the name, so no icon asset is needed and
// nothing has to be kept in sync with the data.
function buildPanelInitials(name) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean);
  return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]).toUpperCase();
}

// ---- Pieces -----------------------------------------------------------------

function BuildPanelPill({ label, active, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onSelect} aria-pressed={active}
      onMouseEnter={function () { setHover(true); }}
      onMouseLeave={function () { setHover(false); }}
      style={{
        appearance: "none", cursor: "pointer",
        fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)",
        fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
        color: active ? "var(--color-white)" : "var(--text-default)",
        background: active ? "var(--accent-default)" : "var(--bg-elevated)",
        border: "1px solid " + (active ? "var(--accent-default)" : "var(--border-default)"),
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-2) var(--spacing-4)",
        transform: hover && !active ? "translateY(-1px)" : "none",
        transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>{label}</button>
  );
}

function BuildPanelPrice({ marker, align }) {
  const off = buildPanelDiscount(marker);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: align === "right" ? "flex-end" : "flex-start",
      gap: "var(--spacing-1)",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-2)" }}>
        <span style={{
          fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
          color: "var(--text-default)", fontVariantNumeric: "lining-nums",
        }}>${marker.price}</span>
        {marker.was ? (
          <span style={{
            fontSize: "var(--text-sm)", color: "var(--text-muted)",
            textDecoration: "line-through", fontVariantNumeric: "lining-nums",
          }}>${marker.was}</span>
        ) : null}
      </div>
      {off > 0 ? (
        <span style={{
          fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
          color: "var(--color-white)", background: "var(--success-default)",
          borderRadius: "var(--radius-4xl)", padding: "1px var(--spacing-2)",
          fontVariantNumeric: "lining-nums",
        }}>-{off}%</span>
      ) : null}
    </div>
  );
}

function BuildPanelRow({ marker, added, onToggle }) {
  const [open, setOpen] = React.useState(false);
  const off = buildPanelDiscount(marker);
  return (
    <div className="bp-row" style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--spacing-4)",
    }}>
      <div className="bp-row-main" style={{
        display: "flex", alignItems: "center", gap: "var(--spacing-4)",
      }}>
        {/* Swatch */}
        <div aria-hidden="true" style={{
          flexShrink: 0, width: 44, height: 44,
          borderRadius: "var(--radius-lg)",
          background: "var(--accent-subtle)", color: "var(--accent-strong)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "0.02em",
        }}>{buildPanelInitials(marker.name)}</div>

        {/* Name + category */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div style={{
            fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
            color: "var(--text-default)", lineHeight: 1.3,
          }}>{marker.name}</div>
          <div style={{
            marginTop: 2, fontSize: "var(--text-xs)", color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.08em",
            fontWeight: "var(--font-weight-medium)",
          }}>{marker.category}</div>
        </div>

        {/* Price */}
        <div className="bp-row-price" style={{ flexShrink: 0 }}>
          <BuildPanelPrice marker={marker} align="right" />
        </div>

        {/* Actions */}
        <div className="bp-row-actions" style={{
          flexShrink: 0, display: "flex", alignItems: "center", gap: "var(--spacing-2)",
        }}>
          <DSButton variant="outline" size="sm" aria-expanded={open}
            onClick={function () { setOpen(function (v) { return !v; }); }}>Quick view</DSButton>
          <DSButton variant={added ? "secondary" : "primary"} size="sm"
            onClick={function () { onToggle(marker.id); }}>{added ? "Added" : "Add"}</DSButton>
        </div>
      </div>

      {/* Quick view — facts we actually hold; no invented clinical copy. */}
      {open ? (
        <dl style={{
          margin: "var(--spacing-4) 0 0", paddingTop: "var(--spacing-4)",
          borderTop: "1px solid var(--border-default)",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--spacing-3)", fontSize: "var(--text-sm)",
        }}>
          <div>
            <dt style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</dt>
            <dd style={{ margin: "2px 0 0", color: "var(--text-default)" }}>{marker.category}</dd>
          </div>
          <div>
            <dt style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Price</dt>
            <dd style={{ margin: "2px 0 0", color: "var(--text-default)", fontVariantNumeric: "lining-nums" }}>${marker.price}</dd>
          </div>
          {off > 0 ? (
            <div>
              <dt style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>You save</dt>
              <dd style={{ margin: "2px 0 0", color: "var(--text-default)", fontVariantNumeric: "lining-nums" }}>${marker.was - marker.price} ({off}%)</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </div>
  );
}

function BuildPanelPageButton({ label, active, disabled, onSelect, ariaLabel }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onSelect} disabled={disabled} aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      onMouseEnter={function () { setHover(true); }}
      onMouseLeave={function () { setHover(false); }}
      style={{
        appearance: "none", cursor: disabled ? "not-allowed" : "pointer",
        minWidth: 36, height: 36, padding: "0 var(--spacing-2)",
        fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)",
        fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
        color: disabled ? "var(--text-muted)" : (active ? "var(--color-white)" : "var(--text-default)"),
        background: active ? "var(--accent-default)" : "var(--bg-elevated)",
        border: "1px solid " + (active ? "var(--accent-default)" : "var(--border-default)"),
        borderRadius: "var(--radius-lg)",
        opacity: disabled ? 0.5 : 1,
        transform: hover && !active && !disabled ? "translateY(-1px)" : "none",
        transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>{label}</button>
  );
}

function BuildPanelCart({ items, total, onRemove }) {
  return (
    <aside className="bp-cart" style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-md)",
      padding: "var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-3)" }}>
        <h3 style={{
          margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)",
          color: "var(--text-default)",
        }}>Your custom panel</h3>
        <span style={{
          flexShrink: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
          color: items.length ? "var(--color-white)" : "var(--text-muted)",
          background: items.length ? "var(--accent-default)" : "var(--bg-secondary)",
          borderRadius: "var(--radius-4xl)", padding: "2px var(--spacing-3)",
          fontVariantNumeric: "lining-nums",
        }}>{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p style={{
          margin: 0, padding: "var(--spacing-6) 0", textAlign: "center",
          fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-muted)",
        }}>Click “Add” on any biomarker to start building your custom panel.</p>
      ) : (
        <ul style={{
          listStyle: "none", margin: 0, padding: 0,
          display: "flex", flexDirection: "column", gap: "var(--spacing-2)",
          maxHeight: 320, overflowY: "auto",
        }}>
          {items.map(function (m) {
            return (
              <li key={m.id} style={{
                display: "flex", alignItems: "center", gap: "var(--spacing-3)",
                padding: "var(--spacing-2) 0",
                borderBottom: "1px solid var(--border-default)",
              }}>
                <span style={{
                  flex: "1 1 auto", minWidth: 0, fontSize: "var(--text-sm)",
                  color: "var(--text-default)", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{m.name}</span>
                <span style={{
                  flexShrink: 0, fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)",
                  fontVariantNumeric: "lining-nums",
                }}>${m.price}</span>
                <button type="button" onClick={function () { onRemove(m.id); }}
                  aria-label={"Remove " + m.name}
                  style={{
                    flexShrink: 0, appearance: "none", cursor: "pointer",
                    width: 22, height: 22, lineHeight: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-family-base)", fontSize: "var(--text-sm)",
                    color: "var(--text-muted)", background: "transparent",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-4xl)",
                  }}>×</button>
              </li>
            );
          })}
        </ul>
      )}

      <div style={{ borderTop: "1px solid var(--border-strong)", paddingTop: "var(--spacing-4)" }}>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
          marginBottom: "var(--spacing-4)",
        }}>
          <span style={{ fontSize: "var(--text-base)", color: "var(--text-muted)" }}>Total</span>
          <span style={{
            fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)",
            color: "var(--text-default)", fontVariantNumeric: "lining-nums",
          }}>${total}</span>
        </div>
        <DSButton variant="primary" size="md" fullWidth
          disabled={items.length === 0}
          onClick={function () { window.openChimeAssessment && window.openChimeAssessment(); }}>Add to cart</DSButton>
      </div>
    </aside>
  );
}

// ---- Section ----------------------------------------------------------------

function ChimeBuildPanelSection() {
  const [category, setCategory] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState("featured");
  const [page, setPage] = React.useState(1);
  const [cart, setCart] = React.useState([]);

  // Category / search / sort all reset paging — otherwise a narrowed result set
  // can leave you stranded on a page that no longer exists.
  function pick(setter) {
    return function (v) { setter(v); setPage(1); };
  }

  const visible = React.useMemo(function () {
    const q = query.trim().toLowerCase();
    const rows = BUILD_PANEL_MARKERS.filter(function (m) {
      if (category !== "All" && m.category !== category) return false;
      if (q && m.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    const sorted = rows.slice();
    if (sort === "price-asc") sorted.sort(function (a, b) { return a.price - b.price; });
    else if (sort === "price-desc") sorted.sort(function (a, b) { return b.price - a.price; });
    else if (sort === "name-asc") sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return sorted;
  }, [category, query, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / BUILD_PANEL_PER_PAGE));
  // Guard: a stale page (e.g. results shrank) would render an empty list.
  const current = Math.min(page, pageCount);
  const start = (current - 1) * BUILD_PANEL_PER_PAGE;
  const rows = visible.slice(start, start + BUILD_PANEL_PER_PAGE);

  const cartItems = cart.map(function (id) {
    return BUILD_PANEL_MARKERS.find(function (m) { return m.id === id; });
  }).filter(Boolean);
  const total = cartItems.reduce(function (sum, m) { return sum + m.price; }, 0);

  function toggle(id) {
    setCart(function (prev) {
      return prev.indexOf(id) === -1
        ? prev.concat([id])
        : prev.filter(function (x) { return x !== id; });
    });
  }
  function remove(id) {
    setCart(function (prev) { return prev.filter(function (x) { return x !== id; }); });
  }

  const first = visible.length === 0 ? 0 : start + 1;
  const last = Math.min(start + BUILD_PANEL_PER_PAGE, visible.length);

  return (
    <section id="build-your-panel" data-screen-label="Build Your Own Panel"
      className="bp-section" style={{
        fontFamily: "var(--font-family-base)",
        background: "var(--bg-default)",
        padding: "var(--spacing-16) var(--spacing-8)",
        // The navbar is fixed at 80px; without this the tier card's #anchor jump
        // parks the heading underneath it.
        scrollMarginTop: 96,
      }}>
      <div style={{ maxWidth: "var(--container-xl)", margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
          <header style={{ marginBottom: "var(--spacing-10)" }}>
            <h2 style={{
              margin: 0, fontSize: "var(--text-5xl)",
              fontWeight: "var(--font-weight-bold)", lineHeight: 1.1,
              color: "var(--text-default)", textWrap: "balance",
            }}>Build your own panel</h2>
            <p style={{
              margin: "var(--spacing-3) 0 0", fontSize: "var(--text-lg)",
              color: "var(--text-muted)", lineHeight: 1.5,
            }}>Choose from 100+ biomarkers to create a custom panel.</p>
          </header>
        </Reveal>

        <div className="bp-grid" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px",
          gap: "var(--spacing-8)", alignItems: "start",
        }}>
          {/* ---- Main ---- */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)", minWidth: 0 }}>
            {/* Category pills */}
            <div role="group" aria-label="Filter by category" style={{
              display: "flex", flexWrap: "wrap", gap: "var(--spacing-2)",
            }}>
              {BUILD_PANEL_CATEGORIES.map(function (c) {
                return <BuildPanelPill key={c} label={c} active={c === category}
                  onSelect={function () { pick(setCategory)(c); }} />;
              })}
            </div>

            {/* Search — DS Input spreads ...rest onto the <input>. */}
            <DSInput type="search" value={query} placeholder="Search biomarkers..."
              aria-label="Search biomarkers"
              onChange={function (e) { pick(setQuery)(e.target.value); }} />

            {/* Count + sort */}
            <div className="bp-toolbar" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "var(--spacing-4)", flexWrap: "wrap",
            }}>
              <p aria-live="polite" style={{
                margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)",
              }}>
                Showing <strong style={{ color: "var(--text-default)", fontVariantNumeric: "lining-nums" }}>{first}–{last}</strong>
                {" "}of <strong style={{ color: "var(--text-default)", fontVariantNumeric: "lining-nums" }}>{visible.length}</strong> biomarkers
              </p>
              <DSSelect value={sort} options={BUILD_PANEL_SORTS}
                aria-label="Sort biomarkers"
                onChange={function (e) { pick(setSort)(e.target.value); }} />
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
              <p style={{
                margin: 0, padding: "var(--spacing-12) var(--spacing-4)", textAlign: "center",
                fontSize: "var(--text-base)", color: "var(--text-muted)",
                background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-xl)",
              }}>No biomarkers match that search.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                {rows.map(function (m) {
                  return <BuildPanelRow key={m.id} marker={m}
                    added={cart.indexOf(m.id) !== -1} onToggle={toggle} />;
                })}
              </div>
            )}

            {/* Pagination */}
            {pageCount > 1 ? (
              <nav aria-label="Biomarker pages" style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                gap: "var(--spacing-2)", flexWrap: "wrap", marginTop: "var(--spacing-2)",
              }}>
                <BuildPanelPageButton label="‹" ariaLabel="Previous page" disabled={current === 1}
                  onSelect={function () { setPage(Math.max(1, current - 1)); }} />
                {Array.from({ length: pageCount }).map(function (_, i) {
                  return <BuildPanelPageButton key={i} label={String(i + 1)}
                    ariaLabel={"Page " + (i + 1)} active={current === i + 1}
                    onSelect={function () { setPage(i + 1); }} />;
                })}
                <BuildPanelPageButton label="›" ariaLabel="Next page" disabled={current === pageCount}
                  onSelect={function () { setPage(Math.min(pageCount, current + 1)); }} />
              </nav>
            ) : null}
          </div>

          {/* ---- Sticky cart ---- */}
          <div className="bp-cart-col" style={{ position: "sticky", top: "var(--spacing-20)" }}>
            <BuildPanelCart items={cartItems} total={total} onRemove={remove} />
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ChimeBuildPanelSection });
