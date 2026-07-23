// Chime Health — Assessment field controls (presentational).
// Every color binds to semantic/--accent-* tokens only, so the page theme owns
// the palette (this page runs the default/homepage blue). State + logic live in
// AssessmentFlow.jsx; these components just render and report changes.

const ASMT_INPUT_STYLE = {
  width: "100%", boxSizing: "border-box", display: "block",
  background: "var(--color-white)", color: "var(--text-default)",
  border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)",
  padding: "var(--spacing-3) var(--spacing-4)",
  fontSize: "var(--text-base)", fontFamily: "var(--font-family-base)",
  outline: "none",
  transition: "border-color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
};

function asmtFocusRing(focused) {
  return focused
    ? { borderColor: "var(--accent-default)", boxShadow: "0 0 0 3px var(--accent-subtle)" }
    : {};
}

// Circular badge for stepper dots and option markers.
//   state: "done" | "current" | "todo"
function AsmtBadge({ size = 26, state = "todo", ariaLabel, children }) {
  const done = state === "done";
  return (
    <span aria-label={ariaLabel} style={{
      width: size, height: size, borderRadius: "50%", flex: "none", boxSizing: "border-box",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: done ? "var(--accent-strong)" : "var(--color-white)",
      border: done ? "1px solid var(--accent-strong)"
        : (state === "current" ? "2px solid var(--accent-strong)" : "1px solid var(--border-strong)"),
      color: done ? "var(--color-white)" : "var(--text-secondary)",
      fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
    }}>{children}</span>
  );
}

function AsmtCheckGlyph({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 7"></path></svg>
  );
}

// Labeled progress bar across the 5 sections.
function AsmtStepper({ steps, current }) {
  return (
    <div className="asmt-stepper" style={{
      display: "flex", alignItems: "flex-start",
      background: "var(--color-white)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)", padding: "var(--spacing-4) var(--spacing-6)",
    }}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : (i === current ? "current" : "todo");
        return (
          <React.Fragment key={s.id}>
            {i > 0 &&
              <span aria-hidden="true" style={{
                flex: 1, height: 2, minWidth: 10, marginTop: 12,
                background: i <= current ? "var(--accent-strong)" : "var(--border-default)",
              }}></span>}
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-1)" }}>
              <AsmtBadge size={26} state={state} ariaLabel={"Step " + (i + 1) + ": " + s.title}>
                {state === "done" ? <AsmtCheckGlyph /> : (i + 1)}
              </AsmtBadge>
              <span className="asmt-step-label" style={{
                fontSize: "var(--text-xs)", whiteSpace: "nowrap",
                color: state === "todo" ? "var(--text-muted)" : "var(--text-default)",
                fontWeight: state === "current" ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
              }}>{s.title}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// White card holding one question. data-qid mirrors the source funnel so the
// engine can scroll to the first unanswered question.
function AsmtCard({ qid, label, hint, children }) {
  return (
    <div data-qid={qid} style={{
      background: "var(--color-white)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
    }}>
      {label &&
        <div>
          <p style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "var(--text-default)" }}>{label}</p>
          {hint && <p style={{ margin: "var(--spacing-1) 0 0", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{hint}</p>}
        </div>}
      {children}
    </div>
  );
}

function AsmtFieldLabel({ text, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: "block", marginBottom: "var(--spacing-1)",
      fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)",
    }}>{text}</label>
  );
}

function AsmtTextField({ id, label, type = "text", value, placeholder, onChange, inputMode }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <AsmtFieldLabel text={label} htmlFor={id} />
      <input id={id} type={type} value={value || ""} placeholder={placeholder} inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...ASMT_INPUT_STYLE, ...asmtFocusRing(focus) }} />
    </div>
  );
}

function AsmtSelectField({ id, label, value, options, onChange, placeholder = "Select an option" }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      {label && <AsmtFieldLabel text={label} htmlFor={id} />}
      <select id={id} value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          ...ASMT_INPUT_STYLE, ...asmtFocusRing(focus),
          appearance: "none", WebkitAppearance: "none",
          color: value ? "var(--text-default)" : "var(--text-muted)",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%23324563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
          paddingRight: "var(--spacing-10)",
        }}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function AsmtTextarea({ id, label, value, onChange }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <AsmtFieldLabel text={label} htmlFor={id} />
      <textarea id={id} value={value || ""} rows={3}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...ASMT_INPUT_STYLE, ...asmtFocusRing(focus), resize: "vertical", minHeight: 84 }} />
    </div>
  );
}

// One selectable row, used for both checkboxes (square) and radios (circle).
function AsmtOptionRow({ kind, label, checked, onToggle }) {
  const [hover, setHover] = React.useState(false);
  const radio = kind === "radio";
  return (
    <button type="button" role={radio ? "radio" : "checkbox"} aria-checked={checked}
      onClick={onToggle}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: "var(--spacing-3)",
        width: "100%", textAlign: "left", cursor: "pointer", font: "inherit",
        background: checked ? "var(--accent-subtle)" : (hover ? "var(--bg-secondary)" : "var(--color-white)"),
        border: "1px solid " + (checked ? "var(--accent-border)" : "var(--border-default)"),
        borderRadius: "var(--radius-md)", padding: "var(--spacing-3) var(--spacing-4)",
        transition: "background var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
      }}>
      <span aria-hidden="true" style={{
        width: 20, height: 20, flex: "none", boxSizing: "border-box", marginTop: 1,
        borderRadius: radio ? "50%" : "var(--radius-xs)",
        border: checked ? "1px solid var(--accent-strong)" : "1px solid var(--border-strong)",
        background: checked ? "var(--accent-strong)" : "var(--color-white)",
        color: "var(--color-white)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>{checked && <AsmtCheckGlyph size={11} />}</span>
      <span style={{
        fontSize: "var(--text-base)", lineHeight: 1.45, color: "var(--text-default)",
        fontWeight: checked ? "var(--font-weight-medium)" : "var(--font-weight-normal)",
      }}>{label}</span>
    </button>
  );
}

// Two-way segmented control (sex assigned at birth).
function AsmtSegment({ options, value, onChange, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{
      display: "flex", background: "var(--bg-secondary)",
      border: "1px solid var(--border-default)", borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-1)", gap: "var(--spacing-1)",
    }}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1, cursor: "pointer", font: "inherit",
              background: on ? "var(--accent-strong)" : "transparent",
              color: on ? "var(--color-white)" : "var(--text-secondary)",
              border: "none", borderRadius: "var(--radius-4xl)",
              padding: "var(--spacing-2) var(--spacing-4)",
              fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
              transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out)",
            }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// Live BMI readout under the height/weight inputs.
function AsmtBmiReadout({ bmi, rating }) {
  if (!bmi) return null;
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: "var(--spacing-3)",
      background: "var(--accent-subtle)", borderRadius: "var(--radius-md)",
      padding: "var(--spacing-3) var(--spacing-4)",
    }}>
      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--accent-onSubtle)" }}>Your BMI</span>
      <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--accent-strong)" }}>{bmi}</span>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--accent-onSubtle)" }}>{rating}</span>
    </div>
  );
}

// Soft confirmation under a question whose selected answer is named by an
// active disqualifier key. An acknowledgement, not an override: submit still
// screens the record.
function AsmtConfirmBox({ qid, checked, onToggle }) {
  return (
    <div data-confirm-for={qid} style={{
      background: "var(--warning-subtle)", borderLeft: "4px solid var(--warning-default)",
      borderRadius: "var(--radius-md)", padding: "var(--spacing-3) var(--spacing-4)",
    }}>
      <label style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-3)", cursor: "pointer" }}>
        <input type="checkbox" checked={!!checked} onChange={onToggle}
          style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--warning-default)", flex: "none" }} />
        <span style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-default)" }}>
          Please review your answer and confirm it’s correct. Some answers may make you
          ineligible for specific prescriptions so we want to ensure we’re sending your
          doctor the correct information.
        </span>
      </label>
    </div>
  );
}

// Acknowledgement card: body copy + a required checkbox. `placeholderNote`
// bands copy that is still pending medical/legal review.
function AsmtConsentCard({ title, body, ack, checked, onToggle, optional, placeholderNote }) {
  return (
    <div style={{
      border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
      background: "var(--bg-secondary)", padding: "var(--spacing-4) var(--spacing-5)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
    }}>
      {title &&
        <p style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>{title}</p>}
      {placeholderNote &&
        <p style={{
          margin: 0, fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--warning-default)",
        }}>Placeholder — consent copy pending medical review</p>}
      {body &&
        <p style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.6, color: "var(--text-secondary)" }}>{body}</p>}
      <label style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-3)", cursor: "pointer" }}>
        <input type="checkbox" checked={!!checked} onChange={onToggle}
          style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--accent-strong)", flex: "none" }} />
        <span style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-default)", fontWeight: "var(--font-weight-medium)" }}>
          {ack}{optional && <span style={{ color: "var(--text-muted)", fontWeight: "var(--font-weight-normal)" }}> (optional)</span>}
        </span>
      </label>
    </div>
  );
}

// Pill buttons for the flow chrome (Next/Back/Submit). Deliberately plainer
// than shared/ui Button: needs a disabled state and no assessment-modal default.
function AsmtButton({ label, variant = "primary", disabled, onClick }) {
  const [hover, setHover] = React.useState(false);
  const primary = variant === "primary";
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        cursor: disabled ? "default" : "pointer", font: "inherit",
        background: primary
          ? (hover && !disabled ? "var(--primary-hover)" : "var(--primary-default)")
          : (hover && !disabled ? "var(--bg-secondary)" : "var(--color-white)"),
        color: primary ? "var(--text-on-primary)" : "var(--text-default)",
        border: primary ? "1px solid transparent" : "1px solid var(--border-default)",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-3) var(--spacing-8)",
        fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
        opacity: disabled ? "var(--opacity-disabled, 0.5)" : 1,
        boxShadow: primary && !disabled ? "var(--shadow-sm)" : "none",
        transition: "background var(--transition-base) var(--ease-in-out)",
      }}>{label}</button>
  );
}

// Top-center toast for validation messages (just below the fixed 72px navbar).
function AsmtFlash({ message }) {
  if (!message) return null;
  return (
    <div role="alert" style={{
      position: "fixed", left: "50%", top: 96, transform: "translateX(-50%)",
      zIndex: "var(--z-toast)", maxWidth: "90vw", textAlign: "center",
      background: "var(--error-default)", color: "var(--color-white)",
      padding: "var(--spacing-3) var(--spacing-5)", borderRadius: "var(--radius-4xl)",
      fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
      boxShadow: "var(--shadow-lg)",
    }}>{message}</div>
  );
}

Object.assign(window, {
  AsmtBadge, AsmtCheckGlyph, AsmtStepper, AsmtCard, AsmtFieldLabel, AsmtTextField,
  AsmtSelectField, AsmtTextarea, AsmtOptionRow, AsmtSegment, AsmtBmiReadout,
  AsmtConfirmBox, AsmtConsentCard, AsmtButton, AsmtFlash,
});
