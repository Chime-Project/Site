/* @ds-bundle: {"format":4,"namespace":"ChimeHealthDesignSystem_b350cf","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tabs","sourcePath":"components/display/Tabs.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"8fb35a3a1de7","components/display/Card.jsx":"74f000a766c6","components/display/Tabs.jsx":"a46205ef298f","components/display/Tag.jsx":"ce8ca6f48078","components/feedback/Dialog.jsx":"6062c71b1aeb","components/feedback/Toast.jsx":"736c7585b870","components/feedback/Tooltip.jsx":"635da5e13b48","components/forms/Button.jsx":"63af15d839c3","components/forms/Checkbox.jsx":"a47917fbea52","components/forms/IconButton.jsx":"c278f35ca6a3","components/forms/Input.jsx":"3290fa7435ce","components/forms/Radio.jsx":"366f56361b4e","components/forms/Select.jsx":"b5aa5e8789a7","components/forms/Switch.jsx":"834b66f8daa4","tailwind.setup.js":"928d27270834","ui_kits/homepage/AssessmentModal.jsx":"a6128540e805","ui_kits/homepage/FeelSection.jsx":"e4825c01e2a8","ui_kits/homepage/Footer.jsx":"4f5bdc7dce54","ui_kits/homepage/GuideSection.jsx":"505bcb566b8b","ui_kits/homepage/Hero.jsx":"1db7deb9f52b","ui_kits/homepage/LabsSection.jsx":"85583f926ba0","ui_kits/homepage/Navbar.jsx":"3956a84c92d7","ui_kits/homepage/ProductsSection.jsx":"bc11d7a8a1b7","ui_kits/homepage/WeightLossSection.jsx":"341bef61096d","ui_kits/homepage/WellnessSection.jsx":"e7141fea81c3","ui_kits/homepage/image-slot.js":"a0ac8036e00a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ChimeHealthDesignSystem_b350cf = window.ChimeHealthDesignSystem_b350cf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: {
    background: "var(--bg-tertiary)",
    color: "var(--text-secondary)"
  },
  primary: {
    background: "var(--primary-subtle)",
    color: "var(--primary-onSubtle)"
  },
  accent: {
    background: "var(--accent-subtle)",
    color: "var(--accent-onSubtle)"
  },
  success: {
    background: "var(--success-subtle)",
    color: "var(--color-green-800)"
  },
  warning: {
    background: "var(--warning-subtle)",
    color: "var(--color-amber-800)"
  },
  error: {
    background: "var(--error-subtle)",
    color: "var(--color-red-800)"
  },
  info: {
    background: "var(--info-subtle)",
    color: "var(--color-sky-700)"
  }
};
function Badge({
  tone = "neutral",
  children,
  style,
  ...rest
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-1)",
      fontFamily: "var(--font-family-base)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)",
      padding: "3px var(--spacing-2)",
      borderRadius: "var(--radius-4xl)",
      ...t,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  padding = "md",
  interactive = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: "var(--spacing-4)",
    md: "var(--spacing-6)",
    lg: "var(--spacing-8)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: interactive && hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      padding: pads[padding] ?? pads.md,
      fontFamily: "var(--font-family-base)",
      color: "var(--text-default)",
      cursor: interactive ? "pointer" : undefined,
      transition: "box-shadow var(--transition-base) var(--ease-in-out)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: "inline-flex",
      gap: "var(--spacing-1)",
      background: "var(--bg-secondary)",
      padding: "var(--spacing-1)",
      borderRadius: "var(--radius-xl)",
      fontFamily: "var(--font-family-base)",
      ...style
    }
  }, rest), tabs.map(t => {
    const tab = typeof t === "string" ? {
      value: t,
      label: t
    } : t;
    const isActive = tab.value === active;
    return /*#__PURE__*/React.createElement(TabButton, {
      key: tab.value,
      isActive: isActive,
      onClick: () => select(tab.value)
    }, tab.label);
  }));
}
function TabButton({
  isActive,
  onClick,
  children
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": isActive,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-family-base)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      padding: "var(--spacing-2) var(--spacing-4)",
      borderRadius: "var(--radius-lg)",
      background: isActive ? "var(--bg-elevated)" : hover ? "var(--bg-tertiary)" : "transparent",
      color: isActive ? "var(--text-default)" : "var(--text-muted)",
      boxShadow: isActive ? "var(--shadow-xs)" : "none",
      transition: "background var(--transition-fast) var(--ease-in-out), color var(--transition-fast) var(--ease-in-out)"
    }
  }, children);
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  selected = false,
  onRemove,
  children,
  style,
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-2)",
      fontFamily: "var(--font-family-base)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      padding: "5px var(--spacing-3)",
      borderRadius: "var(--radius-4xl)",
      cursor: clickable ? "pointer" : undefined,
      background: selected ? "var(--accent-subtle)" : hover && clickable ? "var(--bg-secondary)" : "var(--bg-elevated)",
      color: selected ? "var(--accent-onSubtle)" : "var(--text-secondary)",
      border: "1px solid " + (selected ? "var(--accent-border)" : "var(--border-default)"),
      transition: "background var(--transition-fast) var(--ease-in-out), border-color var(--transition-fast) var(--ease-in-out)",
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: "inline-flex",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  width = 440
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") onClose && onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget) onClose && onClose();
    },
    style: {
      position: "fixed",
      inset: 0,
      zIndex: "var(--z-modal)",
      background: "rgba(27, 38, 58, 0.4)",
      backdropFilter: "blur(var(--blur-sm))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--spacing-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === "string" ? title : undefined,
    style: {
      background: "var(--bg-elevated)",
      borderRadius: "var(--radius-3xl)",
      boxShadow: "var(--shadow-xl)",
      width,
      maxWidth: "100%",
      padding: "var(--spacing-8)",
      fontFamily: "var(--font-family-base)",
      color: "var(--text-default)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)",
      boxSizing: "border-box"
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--font-weight-bold)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.6,
      color: "var(--text-secondary)"
    }
  }, description), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "var(--spacing-3)",
      marginTop: "var(--spacing-2)"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const toastTones = {
  neutral: {
    icon: null,
    color: "var(--text-default)"
  },
  success: {
    color: "var(--success-default)"
  },
  warning: {
    color: "var(--warning-default)"
  },
  error: {
    color: "var(--error-default)"
  },
  info: {
    color: "var(--info-default)"
  }
};
const icons = {
  success: /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3"
  }),
  warning: /*#__PURE__*/React.createElement("path", {
    d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01"
  }),
  error: /*#__PURE__*/React.createElement("path", {
    d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6"
  }),
  info: /*#__PURE__*/React.createElement("path", {
    d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01"
  })
};
function Toast({
  tone = "neutral",
  title,
  description,
  onDismiss,
  style,
  ...rest
}) {
  const t = toastTones[tone] || toastTones.neutral;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--spacing-3)",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-lg)",
      padding: "var(--spacing-4) var(--spacing-5)",
      maxWidth: 380,
      fontFamily: "var(--font-family-base)",
      color: "var(--text-default)",
      ...style
    }
  }, rest), icons[tone] && /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: t.color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      marginTop: 2
    }
  }, icons[tone]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-bold)"
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      lineHeight: 1.5
    }
  }, description)), onDismiss && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Dismiss",
    onClick: onDismiss,
    style: {
      background: "none",
      border: "none",
      padding: 2,
      cursor: "pointer",
      color: "var(--text-muted)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  side = "top",
  children
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translate(-50%, -6px)"
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translate(-50%, 6px)"
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translate(-6px, -50%)"
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translate(6px, -50%)"
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      zIndex: "var(--z-tooltip)",
      whiteSpace: "nowrap",
      background: "var(--color-blue-950)",
      color: "var(--color-white)",
      fontFamily: "var(--font-family-base)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-medium)",
      padding: "var(--spacing-1) var(--spacing-2)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-md)",
      pointerEvents: "none",
      ...pos
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    padding: "0 var(--spacing-3)",
    height: 32,
    fontSize: "var(--text-sm)"
  },
  md: {
    padding: "0 var(--spacing-5)",
    height: 40,
    fontSize: "var(--text-sm)"
  },
  lg: {
    padding: "0 var(--spacing-6)",
    height: 48,
    fontSize: "var(--text-base)"
  }
};
const variants = {
  primary: {
    base: {
      background: "var(--primary-default)",
      color: "var(--text-on-primary)",
      border: "1px solid transparent"
    },
    hover: {
      background: "var(--primary-hover)"
    },
    active: {
      background: "var(--primary-active)"
    }
  },
  secondary: {
    base: {
      background: "var(--secondary-default)",
      color: "var(--text-default)",
      border: "1px solid transparent"
    },
    hover: {
      background: "var(--secondary-hover)"
    },
    active: {
      background: "var(--color-sand-400)"
    }
  },
  accent: {
    base: {
      background: "var(--accent-default)",
      color: "var(--color-white)",
      border: "1px solid transparent"
    },
    hover: {
      background: "var(--accent-hover)"
    },
    active: {
      background: "var(--accent-active)"
    }
  },
  outline: {
    base: {
      background: "transparent",
      color: "var(--text-default)",
      border: "1px solid var(--border-strong)"
    },
    hover: {
      background: "var(--bg-secondary)"
    },
    active: {
      background: "var(--bg-tertiary)"
    }
  },
  ghost: {
    base: {
      background: "transparent",
      color: "var(--text-secondary)",
      border: "1px solid transparent"
    },
    hover: {
      background: "var(--bg-secondary)"
    },
    active: {
      background: "var(--bg-tertiary)"
    }
  },
  destructive: {
    base: {
      background: "var(--destructive-default)",
      color: "var(--color-white)",
      border: "1px solid transparent"
    },
    hover: {
      background: "var(--destructive-hover)"
    },
    active: {
      background: "var(--color-red-800)"
    }
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  children,
  style,
  ...rest
}) {
  const [state, setState] = React.useState("base");
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setState("hover"),
    onMouseLeave: () => setState("base"),
    onMouseDown: () => setState("active"),
    onMouseUp: () => setState("hover"),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--spacing-2)",
      whiteSpace: "nowrap",
      flex: "none",
      fontFamily: "var(--font-family-base)",
      fontWeight: "var(--font-weight-semibold)",
      borderRadius: "var(--radius-xl)",
      cursor: disabled ? "default" : "pointer",
      transition: "background var(--transition-base) var(--ease-in-out)",
      opacity: disabled ? "var(--opacity-disabled)" : 1,
      width: fullWidth ? "100%" : undefined,
      ...s,
      ...v.base,
      ...(disabled ? {} : state === "hover" ? v.hover : state === "active" ? {
        ...v.hover,
        ...v.active
      } : {}),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internal;
  const toggle = e => {
    if (checked === undefined) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      cursor: disabled ? "default" : "pointer",
      fontFamily: "var(--font-family-base)",
      opacity: disabled ? "var(--opacity-disabled)" : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: isChecked,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: "inherit"
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "var(--radius-md)",
      background: isChecked ? "var(--primary-default)" : "var(--bg-elevated)",
      border: "1px solid " + (isChecked ? "var(--primary-default)" : "var(--border-strong)"),
      transition: "background var(--transition-fast) var(--ease-in-out)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, isChecked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-default)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  size = "md",
  variant = "ghost",
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const px = {
    sm: 32,
    md: 40,
    lg: 48
  }[size] || 40;
  const looks = {
    ghost: {
      base: {
        background: "transparent",
        color: "var(--text-secondary)"
      },
      hover: {
        background: "var(--bg-secondary)"
      }
    },
    secondary: {
      base: {
        background: "var(--secondary-default)",
        color: "var(--text-default)"
      },
      hover: {
        background: "var(--secondary-hover)"
      }
    },
    primary: {
      base: {
        background: "var(--primary-default)",
        color: "var(--text-on-primary)"
      },
      hover: {
        background: "var(--primary-hover)"
      }
    }
  };
  const v = looks[variant] || looks.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: px,
      height: px,
      border: "1px solid transparent",
      borderRadius: "var(--radius-xl)",
      cursor: disabled ? "default" : "pointer",
      transition: "background var(--transition-base) var(--ease-in-out)",
      opacity: disabled ? "var(--opacity-disabled)" : 1,
      ...v.base,
      ...(hover && !disabled ? v.hover : {}),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fieldBase = {
  fontFamily: "var(--font-family-base)",
  fontSize: "var(--text-base)",
  fontWeight: "var(--font-weight-medium)",
  color: "var(--text-default)",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-xl)",
  height: 44,
  padding: "0 var(--spacing-4)",
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
  transition: "border-color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)"
};
function Input({
  label,
  hint,
  error,
  disabled = false,
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const inputId = id || autoId;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)",
      fontFamily: "var(--font-family-base)",
      opacity: disabled ? "var(--opacity-disabled)" : 1
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--text-default)"
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...fieldBase,
      borderColor: error ? "var(--error-default)" : focus ? "var(--accent-border)" : "var(--border-default)",
      boxShadow: focus ? "0 0 0 3px " + (error ? "var(--error-subtle)" : "var(--accent-subtle)") : "none",
      ...style
    }
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--error-default)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  name,
  value,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internal;
  const toggle = e => {
    if (checked === undefined) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      cursor: disabled ? "default" : "pointer",
      fontFamily: "var(--font-family-base)",
      opacity: disabled ? "var(--opacity-disabled)" : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: isChecked,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: "inherit"
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "var(--bg-elevated)",
      border: isChecked ? "6px solid var(--primary-default)" : "1px solid var(--border-strong)",
      boxSizing: "border-box",
      transition: "border var(--transition-fast) var(--ease-in-out)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-default)"
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  options = [],
  disabled = false,
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const selectId = id || autoId;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)",
      fontFamily: "var(--font-family-base)",
      opacity: disabled ? "var(--opacity-disabled)" : 1
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--text-default)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      fontFamily: "var(--font-family-base)",
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-default)",
      background: "var(--bg-elevated)",
      border: "1px solid " + (focus ? "var(--accent-border)" : "var(--border-default)"),
      boxShadow: focus ? "0 0 0 3px var(--accent-subtle)" : "none",
      borderRadius: "var(--radius-xl)",
      height: 44,
      padding: "0 var(--spacing-10) 0 var(--spacing-4)",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      cursor: disabled ? "default" : "pointer",
      transition: "border-color var(--transition-base) var(--ease-in-out)",
      ...style
    }
  }, rest), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)"
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const toggle = e => {
    if (checked === undefined) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      cursor: disabled ? "default" : "pointer",
      fontFamily: "var(--font-family-base)",
      opacity: disabled ? "var(--opacity-disabled)" : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 40,
      height: 24,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: isOn,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      margin: 0,
      cursor: "inherit"
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "var(--radius-4xl)",
      background: isOn ? "var(--primary-default)" : "var(--color-sand-400)",
      transition: "background var(--transition-base) var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      top: 2,
      left: isOn ? 18 : 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "var(--color-white)",
      boxShadow: "var(--shadow-sm)",
      transition: "left var(--transition-base) var(--ease-in-out)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-default)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// tailwind.setup.js
try { (() => {
/* ==========================================================================
   Chime Health — Tailwind setup (Play CDN, no build step)

   Usage in any HTML page (after styles.css, which defines the CSS variables):

     <link rel="stylesheet" href="styles.css">
     <script src="tailwind.setup.js"></script>

   Then use Tailwind utilities that resolve to Chime tokens:
     bg-bg / bg-bg-secondary / bg-bg-elevated     (semantic surfaces)
     text-fg / text-fg-secondary / text-fg-muted  (semantic text)
     bg-primary hover:bg-primary-hover text-on-primary
     bg-accent-subtle text-accent-onSubtle        (theme-aware; swaps with data-theme)
     bg-blue-500, bg-sand-100, bg-sage-500 …      (primitive scales)
     rounded-2xl  shadow-sm  duration-fast  z-modal  blur-md

   Notes:
   - Spacing is NOT overridden: the Chime 4px scale (--spacing-1 = 4px …)
     matches Tailwind's default spacing scale exactly.
   - Colors are bound to CSS variables so `data-theme` accent switching works.
     Trade-off: opacity modifiers (e.g. bg-blue-500/50) do NOT work on
     var()-based colors — use the --opacity-* tokens or explicit rgba instead.
   ========================================================================== */
(() => {
  const steps11 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const scale = (name, steps) => Object.fromEntries(steps.map(s => [s, `var(--color-${name}-${s})`]));
  const config = {
    theme: {
      extend: {
        colors: {
          /* Primitive scales (1:1 with tokens/colors.css) */
          blue: scale('blue', steps11),
          sand: scale('sand', steps11),
          slate: scale('slate', steps11),
          green: scale('green', steps11),
          amber: scale('amber', steps11),
          red: scale('red', steps11),
          sky: scale('sky', [50, 100, 500, 600, 700]),
          sage: scale('sage', [100, 200, 300, 500, 600, 700, 800]),
          iris: scale('iris', [100, 200, 300, 500, 600, 700, 800]),
          peach: scale('peach', [100, 200, 300, 500, 600, 700, 800]),
          /* Semantic — bind components to these, never to primitives */
          bg: {
            DEFAULT: 'var(--bg-default)',
            secondary: 'var(--bg-secondary)',
            tertiary: 'var(--bg-tertiary)',
            elevated: 'var(--bg-elevated)'
          },
          fg: {
            DEFAULT: 'var(--text-default)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)'
          },
          'on-primary': 'var(--text-on-primary)',
          border: {
            DEFAULT: 'var(--border-default)',
            strong: 'var(--border-strong)'
          },
          primary: {
            DEFAULT: 'var(--primary-default)',
            hover: 'var(--primary-hover)',
            active: 'var(--primary-active)',
            subtle: 'var(--primary-subtle)',
            onSubtle: 'var(--primary-onSubtle)'
          },
          secondary: {
            DEFAULT: 'var(--secondary-default)',
            hover: 'var(--secondary-hover)',
            subtle: 'var(--secondary-subtle)'
          },
          destructive: {
            DEFAULT: 'var(--destructive-default)',
            hover: 'var(--destructive-hover)',
            subtle: 'var(--destructive-subtle)'
          },
          success: {
            DEFAULT: 'var(--success-default)',
            subtle: 'var(--success-subtle)'
          },
          warning: {
            DEFAULT: 'var(--warning-default)',
            subtle: 'var(--warning-subtle)'
          },
          error: {
            DEFAULT: 'var(--error-default)',
            subtle: 'var(--error-subtle)'
          },
          info: {
            DEFAULT: 'var(--info-default)',
            subtle: 'var(--info-subtle)'
          },
          /* Theme accent — swaps with data-theme="default|weight-loss|lab|energy-wellness" */
          accent: {
            DEFAULT: 'var(--accent-default)',
            strong: 'var(--accent-strong)',
            hover: 'var(--accent-hover)',
            active: 'var(--accent-active)',
            subtle: 'var(--accent-subtle)',
            subtleHover: 'var(--accent-subtleHover)',
            onSubtle: 'var(--accent-onSubtle)',
            border: 'var(--accent-border)'
          },
          'focus-ring': 'var(--focus-ring)'
        },
        fontFamily: {
          sans: 'var(--font-family-base)'
        },
        /* NOTE: --text-base is 18px (not Tailwind's 16px) */
        fontSize: {
          xs: ['var(--text-xs)', {
            lineHeight: '1.5'
          }],
          sm: ['var(--text-sm)', {
            lineHeight: '1.5'
          }],
          base: ['var(--text-base)', {
            lineHeight: '1.55'
          }],
          lg: ['var(--text-lg)', {
            lineHeight: '1.55'
          }],
          xl: ['var(--text-xl)', {
            lineHeight: '1.45'
          }],
          '2xl': ['var(--text-2xl)', {
            lineHeight: '1.35'
          }],
          '3xl': ['var(--text-3xl)', {
            lineHeight: '1.25'
          }],
          '4xl': ['var(--text-4xl)', {
            lineHeight: '1.15'
          }],
          '5xl': ['var(--text-5xl)', {
            lineHeight: '1.1'
          }],
          '6xl': ['var(--text-6xl)', {
            lineHeight: '1.05'
          }]
        },
        borderRadius: {
          xs: 'var(--radius-xs)',
          sm: 'var(--radius-sm)',
          md: 'var(--radius-md)',
          lg: 'var(--radius-lg)',
          xl: 'var(--radius-xl)',
          '2xl': 'var(--radius-2xl)',
          '3xl': 'var(--radius-3xl)',
          full: 'var(--radius-4xl)'
        },
        boxShadow: {
          xs: 'var(--shadow-xs)',
          sm: 'var(--shadow-sm)',
          md: 'var(--shadow-md)',
          lg: 'var(--shadow-lg)',
          xl: 'var(--shadow-xl)'
        },
        transitionDuration: {
          fast: 'var(--transition-fast)',
          base: 'var(--transition-base)',
          slow: 'var(--transition-slow)'
        },
        transitionTimingFunction: {
          'in-out': 'var(--ease-in-out)',
          in: 'var(--ease-in)'
        },
        zIndex: {
          dropdown: 'var(--z-dropdown)',
          sticky: 'var(--z-sticky)',
          overlay: 'var(--z-overlay)',
          modal: 'var(--z-modal)',
          popover: 'var(--z-popover)',
          toast: 'var(--z-toast)',
          tooltip: 'var(--z-tooltip)'
        },
        blur: {
          sm: 'var(--blur-sm)',
          md: 'var(--blur-md)',
          lg: 'var(--blur-lg)',
          xl: 'var(--blur-xl)'
        },
        opacity: {
          disabled: '0.45'
        }
      }
    }
  };
  const s = document.createElement('script');
  s.src = 'https://cdn.tailwindcss.com';
  s.onload = () => {
    window.tailwind.config = config;
  };
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "tailwind.setup.js", error: String((e && e.message) || e) }); }

// ui_kits/homepage/AssessmentModal.jsx
try { (() => {
// Chime Health — Assessment modal (dummy)
// Layout guide: uploads/pasted-1783961485984-0.png (breadcrumb, check stepper,
// one question at a time with lettered answers). Chime tokens throughout.
// Opened via window.openChimeAssessment(). No nav links inside the modal.

const ASSESSMENT_SECTIONS = [{
  name: "About you",
  questions: [{
    id: "age",
    label: "What's your age range?",
    options: ["18–29", "30–44", "45–59", "60+"]
  }, {
    id: "health",
    label: "How would you describe your overall health?",
    options: ["Excellent", "Good", "Fair", "Not sure"]
  }, {
    id: "meds",
    label: "Do you take any medications regularly?",
    options: ["Yes", "No", "Prefer not to say"]
  }, {
    id: "activity",
    label: "How active are you in a typical week?",
    options: ["Very active", "Somewhat active", "Mostly sedentary"]
  }]
}, {
  name: "Your goals",
  questions: [{
    id: "goal",
    label: "What's your primary goal?",
    options: ["Weight loss", "Energy & wellness", "Lab insights", "Not sure yet"]
  }, {
    id: "timeline",
    label: "When would you like to see progress?",
    options: ["1–3 months", "3–6 months", "No rush"]
  }, {
    id: "tried",
    label: "What have you tried before?",
    options: ["Diet & exercise", "Medication", "Coaching", "Nothing yet"]
  }, {
    id: "support",
    label: "What kind of support sounds right?",
    options: ["Coaching", "Medication", "Both", "Unsure"]
  }]
}, {
  name: "Your lifestyle",
  questions: [{
    id: "sleep",
    label: "How many hours do you sleep most nights?",
    options: ["Less than 6", "6–7", "7–9", "9+"]
  }, {
    id: "stress",
    label: "How would you rate your stress lately?",
    options: ["Low", "Moderate", "High"]
  }, {
    id: "eating",
    label: "How would you describe your eating habits?",
    options: ["Consistent", "Up and down", "Could use help"]
  }, {
    id: "ready",
    label: "How ready are you to start?",
    options: ["Ready now", "Within a month", "Just exploring"]
  }]
}];
const ASSESSMENT_FLAT = ASSESSMENT_SECTIONS.flatMap((s, si) => s.questions.map((q, qi) => ({
  ...q,
  section: s.name,
  sectionIndex: si,
  indexInSection: qi
})));
function ChimeAssessmentModal() {
  const [open, setOpen] = React.useState(false);
  const [qIndex, setQIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    window.openChimeAssessment = () => {
      setOpen(true);
      setQIndex(0);
      setDone(false);
    };
    const onKey = e => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      delete window.openChimeAssessment;
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  const total = ASSESSMENT_FLAT.length;
  const q = ASSESSMENT_FLAT[Math.min(qIndex, total - 1)];
  const pick = opt => setAnswers(a => ({
    ...a,
    [q.id]: opt
  }));
  const next = () => {
    if (qIndex < total - 1) setQIndex(qIndex + 1);else setDone(true);
  };
  const back = () => {
    if (qIndex > 0) setQIndex(qIndex - 1);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Health assessment",
    onClick: e => {
      if (e.target === e.currentTarget) setOpen(false);
    },
    style: {
      position: "fixed",
      inset: 0,
      zIndex: "var(--z-modal)",
      background: "rgba(27,38,58,0.45)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-white)",
      borderRadius: "var(--radius-3xl)",
      width: "min(920px, 100%)",
      height: "min(820px, calc(100vh - 64px))",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "var(--shadow-xl, 0 24px 64px rgba(27,38,58,0.35))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--spacing-4)",
      padding: "var(--spacing-5) var(--spacing-10)",
      borderBottom: "1px solid var(--border-default)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: (window.CHIME_ASSETS_BASE || "../../assets") + "/logo-slate.png",
    alt: "Chime Health",
    style: {
      height: 36,
      width: "auto",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(false),
    "aria-label": "Close assessment",
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      cursor: "pointer",
      border: "1px solid var(--border-default)",
      background: "var(--color-white)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-default)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), done ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: "var(--spacing-4)",
      padding: "var(--spacing-10)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "var(--accent-strong)",
      color: "var(--color-white)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5l5 5L20 7"
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-3xl)",
      fontWeight: 400,
      color: "var(--text-default)"
    }
  }, "You're all set"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "28em",
      fontSize: "var(--text-base)",
      lineHeight: 1.6,
      color: "var(--text-secondary)"
    }
  }, "Thanks \u2014 a licensed provider will review your answers and recommend the right path for you. This is a demo assessment; no data was submitted."), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(false),
    style: {
      marginTop: "var(--spacing-2)",
      background: "var(--primary-default)",
      color: "var(--text-on-primary)",
      border: "1px solid transparent",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-8)",
      cursor: "pointer",
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)"
    }
  }, "Close")) : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "var(--spacing-6) var(--spacing-10) var(--spacing-8)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-5)",
      background: "var(--bg-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-2)",
      fontSize: "var(--text-sm)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--accent-strong)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 12H5m6-6-6 6 6 6"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent-strong)",
      fontWeight: "var(--font-weight-semibold)"
    }
  }, "Health Assessment"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-default)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, "Section " + (q.sectionIndex + 1) + ": " + q.section)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      background: "var(--color-white)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--spacing-4) var(--spacing-6)"
    }
  }, ASSESSMENT_FLAT.map((fq, i) => {
    const complete = i < qIndex || i === qIndex && !!answers[fq.id];
    const current = i === qIndex;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: fq.id
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 2,
        minWidth: 10,
        background: i <= qIndex ? "var(--accent-strong)" : "var(--border-default)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      "aria-label": "Question " + (i + 1),
      style: {
        width: 26,
        height: 26,
        borderRadius: "50%",
        flex: "none",
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: complete ? "var(--accent-strong)" : "var(--color-white)",
        border: complete ? "1px solid var(--accent-strong)" : current ? "2px solid var(--accent-strong)" : "1px solid var(--border-strong)",
        color: complete ? "var(--color-white)" : "var(--text-secondary)",
        fontSize: 11,
        fontWeight: "var(--font-weight-semibold)"
      }
    }, complete ? /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "3.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12.5l5 5L20 7"
    })) : i + 1));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--spacing-4)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--text-default)"
    }
  }, q.section + " : Assessment"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: back,
    disabled: qIndex === 0,
    style: {
      background: qIndex === 0 ? "var(--bg-secondary)" : "var(--color-white)",
      color: qIndex === 0 ? "var(--text-muted, var(--text-secondary))" : "var(--text-default)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-2) var(--spacing-6)",
      cursor: qIndex === 0 ? "default" : "pointer",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      opacity: qIndex === 0 ? 0.6 : 1
    }
  }, "Back")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-white)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--spacing-6) var(--spacing-8)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--spacing-4)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)"
    }
  }, "Question " + (qIndex + 1) + " of " + total), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-default)",
      maxWidth: "34em"
    }
  }, q.label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: next,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-2)",
      flex: "none",
      background: "var(--primary-default)",
      color: "var(--text-on-primary)",
      border: "1px solid transparent",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-6)",
      cursor: "pointer",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      boxShadow: "var(--shadow-sm)"
    }
  }, qIndex === total - 1 ? "Finish" : "Next Question", /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14m-6-6 6 6-6 6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--accent-muted, var(--color-iris-200))",
      color: "var(--accent-strong)",
      borderRadius: "var(--radius-md)",
      padding: "var(--spacing-2) var(--spacing-4)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, "Choose one answer that most applies to you"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, q.options.map((opt, oi) => {
    const selected = answers[q.id] === opt;
    return /*#__PURE__*/React.createElement(AssessmentAnswerRow, {
      key: opt,
      letter: String.fromCharCode(97 + oi),
      label: opt,
      selected: selected,
      last: oi === q.options.length - 1,
      onSelect: () => pick(opt)
    });
  }))))));
}
function AssessmentAnswerRow({
  letter,
  label,
  selected,
  last,
  onSelect
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onSelect,
    "aria-pressed": selected,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-4)",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      font: "inherit",
      background: hover ? "var(--bg-secondary)" : "transparent",
      border: "none",
      borderBottom: last ? "none" : "1px solid var(--border-default)",
      padding: "var(--spacing-4) var(--spacing-2)",
      transition: "background var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      flex: "none",
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: selected ? "var(--accent-strong)" : "var(--color-white)",
      border: selected ? "1px solid var(--accent-strong)" : "1px solid var(--border-strong)",
      color: selected ? "var(--color-white)" : "var(--text-secondary)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)",
      boxShadow: selected ? "var(--shadow-sm)" : "none"
    }
  }, letter), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--text-default)",
      fontWeight: selected ? "var(--font-weight-semibold)" : "var(--font-weight-normal)"
    }
  }, label));
}
Object.assign(window, {
  ChimeAssessmentModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/AssessmentModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/FeelSection.jsx
try { (() => {
// Chime Health — Homepage UI kit: "Feel More Like Yourself Again" section
// Full-bleed video background band with headline + sub + CTA.

const FEEL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
function ChimeFeelSection() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Feel More Like Yourself Again",
    className: "hero-section feel-section",
    style: {
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-12)",
      fontFamily: "var(--font-family-base)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-3xl)",
      overflow: "hidden",
      background: "var(--color-navy-900, #1B263A)",
      minHeight: 520,
      display: "flex",
      alignItems: "stretch",
      boxShadow: "var(--shadow-xs)"
    }
  }, /*#__PURE__*/React.createElement("video", {
    className: "feel-video",
    src: FEEL_UPLOADS + "/hf_20260713_031732_36a942a7-16dc-4fae-bee0-0fa1978826cf.mp4",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "linear-gradient(100deg, rgba(27,38,58,0.62) 0%, rgba(27,38,58,0.32) 48%, rgba(27,38,58,0.08) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "feel-content",
    style: {
      position: "relative",
      zIndex: 1,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "var(--spacing-10) var(--spacing-10) var(--spacing-10)",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--color-white)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      opacity: 0.85
    }
  }, "Feel More Like Yourself Again"), /*#__PURE__*/React.createElement("h2", {
    className: "feel-title",
    style: {
      margin: 0,
      maxWidth: "14em",
      fontSize: "var(--text-5xl)",
      fontWeight: 300,
      lineHeight: 1.1,
      color: "var(--color-white)",
      textWrap: "balance",
      textShadow: "0 1px 16px rgba(27,38,58,0.35)"
    }
  }, "Because no two bodies are the same"), /*#__PURE__*/React.createElement("div", {
    className: "feel-row",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--spacing-6)",
      flexWrap: "wrap",
      marginTop: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "34em",
      fontSize: "var(--text-lg)",
      fontWeight: "var(--font-weight-normal)",
      color: "var(--color-white)",
      opacity: 0.92,
      lineHeight: 1.5,
      textShadow: "0 1px 12px rgba(27,38,58,0.35)"
    }
  }, "Most telehealth companies begin with a prescription. Our approach combines wellness coaching, licensed provider oversight, and convenient pharmacy fulfillment to create a more personalized healthcare experience."), /*#__PURE__*/React.createElement(FeelCTA, {
    label: "Explore The Chime Membership"
  })))));
}
function FeelCTA({
  label
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-block",
      position: "relative",
      overflow: "hidden",
      background: "var(--color-white)",
      color: hover ? "var(--text-on-primary)" : "var(--text-default)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-5)",
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      textDecoration: "none",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-3px) scale(1.04)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--accent-default)",
      transform: hover ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform 0.35s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, label));
}
Object.assign(window, {
  ChimeFeelSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/FeelSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/Footer.jsx
try { (() => {
// Chime Health — Homepage UI kit: Footer
// Deep slate-blue panel: white lockup left · link columns · pill CTA ·
// legal links · hairline · disclaimer · copyright.
// Reference: uploads/pasted-1783918075389-0.png

const FOOTER_ASSETS = window.CHIME_ASSETS_BASE || "../../assets";
function ChimeFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--color-blue-800)",
      color: "var(--color-white)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-16) var(--spacing-8) var(--spacing-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-grid",
    style: {
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: "var(--spacing-12)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Chime Health home",
    style: {
      display: "inline-flex",
      gridColumn: "1"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: FOOTER_ASSETS + "/logo-white.png",
    alt: "Chime Health",
    style: {
      height: 72,
      width: "auto",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)",
      textTransform: "uppercase",
      letterSpacing: "0.5px"
    }
  }, "Contact Email"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@chimehealth.com",
    style: {
      color: "var(--color-blue-100)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      textDecoration: "none",
      transition: "color var(--transition-fast) var(--ease-in-out)"
    },
    onMouseEnter: e => e.target.style.color = "var(--color-white)",
    onMouseLeave: e => e.target.style.color = "var(--color-blue-100)"
  }, "hello@chimehealth.com"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginTop: "var(--spacing-6)"
    }
  }, "Business Hours"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--color-blue-100)",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, "Monday-Friday"), /*#__PURE__*/React.createElement("div", null, "8:00 AM \u2013 6:00 PM CST"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-3)"
    }
  }, ["Weight Loss", "Health, Energy & Wellness", "Labs"].map(l => /*#__PURE__*/React.createElement(FooterLink, {
    key: l,
    label: l
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-3)"
    }
  }, ["Privacy Policy", "HIPAA Notice", "Telehealth Consent", "Terms & Conditions"].map(l => /*#__PURE__*/React.createElement(FooterLink, {
    key: l,
    label: l
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      marginTop: "var(--spacing-12)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FooterCta, {
    label: "Schedule a call with a wellness expert"
  })), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      borderTop: "1px solid rgba(255, 255, 255, 0.35)",
      margin: "var(--spacing-12) 0",
      width: "100%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      lineHeight: 1.6,
      color: "var(--color-blue-100)",
      maxWidth: "90ch",
      display: "grid",
      rowGap: "var(--spacing-1)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "The content on this page is intended for consumers or healthcare professionals who are U.S. residents ages 18 and over."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "ChimeDirect\xAE is a registered trademark owned or licensed by Chime, Inc., its subsidiaries, or affiliates. Third-party trademarks are the property of their respective owners.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--spacing-4) 0 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--color-blue-100)"
    }
  }, "Copyright \xA9 2026 Chime, Inc. All rights reserved.")));
}
function FooterLink({
  label,
  underline = false
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      color: hover ? "var(--color-white)" : "var(--color-blue-100)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      textDecoration: underline || hover ? "underline" : "none",
      textUnderlineOffset: 4,
      width: "max-content",
      transition: "color var(--transition-fast) var(--ease-in-out)"
    }
  }, label);
}
function FooterCta({
  label
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      background: hover ? "var(--color-sand-100)" : "var(--color-white)",
      color: "var(--color-blue-800)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      textDecoration: "none",
      padding: "var(--spacing-3) var(--spacing-6)",
      borderRadius: "var(--radius-4xl)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transition: "background var(--transition-fast) var(--ease-in-out), box-shadow var(--transition-fast) var(--ease-in-out)"
    }
  }, label);
}
Object.assign(window, {
  ChimeFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/GuideSection.jsx
try { (() => {
// Chime Health — Homepage UI kit: Guide CTA section
// Rounded full-width card with runners background image, email capture on the left.

const GUIDE_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const GUIDE_BG = GUIDE_UPLOADS + "/hf_20260702_042318_5749878e-ec06-4b35-8bef-d1e9b5d0bc05.png";

// Scroll-reveal wrapper: fades/slides children in when they enter the viewport.
function GuideReveal({
  children,
  delay,
  style
}) {
  const ref = React.useRef(null);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });
    io.observe(el);
    return function () {
      io.disconnect();
    };
  }, [reduced]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: Object.assign({
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(28px)",
      transition: "opacity 0.8s var(--ease-out, ease-out), transform 0.8s var(--ease-out, ease-out)",
      transitionDelay: (delay || 0) + "ms",
      willChange: "opacity, transform"
    }, style || {})
  }, children);
}
function ChimeGuideSection() {
  const [email, setEmail] = React.useState("");
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const linkStyle = {
    color: "var(--color-white)",
    textDecoration: "underline",
    textUnderlineOffset: 3
  };
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Guide CTA",
    className: "guide-section",
    style: {
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-12) var(--spacing-8)",
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(GuideReveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "var(--radius-3xl)",
      minHeight: 520,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: GUIDE_BG,
    alt: "Two people trail running at sunrise",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center bottom",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(43,38,24,0.38) 0%, rgba(43,38,24,0.18) 45%, rgba(43,38,24,0) 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "guide-content",
    style: {
      position: "relative",
      zIndex: 1,
      padding: "var(--spacing-12) var(--spacing-10)",
      maxWidth: 460,
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement(GuideReveal, {
    delay: 150,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-4xl)",
      fontWeight: 300,
      lineHeight: 1.12,
      color: "var(--color-white)",
      textWrap: "balance",
      textShadow: "0 1px 16px rgba(43,38,24,0.35)"
    }
  }, "Unlock your free Understanding Your Health guide"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.5,
      color: "var(--color-white)",
      opacity: 0.92,
      maxWidth: "24em"
    }
  }, "Written by licensed providers to support your journey."), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => e.preventDefault(),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-3)",
      marginTop: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: email,
    placeholder: "Email",
    onChange: e => setEmail(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      width: "100%",
      boxSizing: "border-box",
      background: "var(--color-white)",
      border: focus ? "1px solid var(--color-blue-500)" : "1px solid transparent",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-5)",
      fontSize: "var(--text-base)",
      fontFamily: "var(--font-family-base)",
      color: "var(--color-slate-800)",
      outline: "none",
      boxShadow: focus ? "0 0 0 3px rgba(101,128,188,0.25)" : "var(--shadow-sm)",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      appearance: "none",
      cursor: "pointer",
      width: "100%",
      background: "var(--color-white)",
      border: "1px solid transparent",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-5)",
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      fontFamily: "var(--font-family-base)",
      color: "var(--color-blue-800)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)"
    }
  }, "Get the guide")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      lineHeight: 1.55,
      color: "var(--color-white)",
      opacity: 0.92,
      maxWidth: "26em"
    }
  }, "By creating an account using email, I agree to the ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: linkStyle
  }, "Terms & Conditions"), ", and acknowledge the ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: linkStyle
  }, "Privacy Policy"), "."))))));
}
Object.assign(window, {
  ChimeGuideSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/GuideSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/Hero.jsx
try { (() => {
// Chime Health — Homepage UI kit: Hero bento
// Headline + 2 media cards (drag your photos onto the slots) + 4 category cards.

const HERO_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
function ChimeHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero-section",
    style: {
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "var(--spacing-6) var(--spacing-8) var(--spacing-12)",
      fontFamily: "var(--font-family-base)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-enter hero-main-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--spacing-4)",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "hero-title",
    style: {
      margin: "var(--spacing-4) 0 var(--spacing-8)",
      fontSize: "var(--text-6xl)",
      fontWeight: 300,
      lineHeight: 1.08,
      color: "var(--text-default)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, "Health That\u2019s"), /*#__PURE__*/React.createElement("br", null), "Tuned To You"), /*#__PURE__*/React.createElement(ProductHeroCard, {
    slotId: "hero-weight-loss",
    brand: "SEMAGLUTIDE",
    product: "Boost",
    price: "Start from $179.00",
    src: HERO_UPLOADS + "/pen.png"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(TreatmentPathCard, {
    slotId: "hero-results",
    src: HERO_UPLOADS + "/hf_20260709_235042_d5fcb10f-0daf-4a3f-a324-6c1333d8210d.png"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-chips-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--spacing-3)"
    }
  }, /*#__PURE__*/React.createElement(TrustChip, {
    label: "Dedicated Wellness Coaches",
    icon: "coach"
  }), /*#__PURE__*/React.createElement(TrustChip, {
    label: "Licensed US Providers",
    icon: "shield"
  }), /*#__PURE__*/React.createElement(TrustChip, {
    label: "HIPAA Protected",
    icon: "zap"
  }), /*#__PURE__*/React.createElement(TrustChip, {
    label: "Next-Day Shipping Available",
    icon: "clock"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "hero-enter hero-cat-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--spacing-4)",
      marginTop: "var(--spacing-4)",
      animationDelay: "240ms"
    }
  }, /*#__PURE__*/React.createElement(CategoryCard, {
    slotId: "cat-weight",
    theme: "weight-loss",
    pre: "Lose",
    accent: "weight",
    src: HERO_UPLOADS + "/weight-c31b5849.jpg",
    targetId: "weight-loss-section"
  }), /*#__PURE__*/React.createElement(CategoryCard, {
    slotId: "cat-energy",
    theme: "energy-wellness",
    pre: "Boost",
    accent: "energy & wellness",
    accentColor: "#B08A28",
    hoverBg: "linear-gradient(135deg, #FBF3DC, #F5E7BE)",
    hoverBorder: "#E6C465",
    src: HERO_UPLOADS + "/wellness-aa5b5325.jpg",
    targetId: "wellness-section"
  }), /*#__PURE__*/React.createElement(CategoryCard, {
    slotId: "cat-labs",
    theme: "lab",
    pre: "Get",
    accent: "a lab check",
    src: HERO_UPLOADS + "/labs-74591640.jpg",
    targetId: "labs-section"
  }), /*#__PURE__*/React.createElement(StartHereCard, {
    slotId: "cat-start",
    src: HERO_UPLOADS + "/start-07599cc8.jpg"
  })));
}
function ProductHeroCard({
  slotId,
  brand,
  product,
  price,
  src
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    "data-theme": "default",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      display: "block",
      height: 340,
      borderRadius: "var(--radius-3xl)",
      overflow: "hidden",
      textDecoration: "none",
      background: "#A6C4DF",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
      transition: "box-shadow var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: slotId,
    shape: "rect",
    fit: "cover",
    placeholder: "Drop product photo",
    class: "hero-float",
    src: src,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      willChange: "transform"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "var(--spacing-5)",
      right: "var(--spacing-6)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--font-weight-bold)",
      letterSpacing: "0.02em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent-default)"
    }
  }, brand), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-default)"
    }
  }, product))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "var(--spacing-5)",
      bottom: "var(--spacing-5)",
      background: "var(--color-white)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-5)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      color: hover ? "var(--text-on-primary)" : "var(--text-default)",
      pointerEvents: "none",
      overflow: "hidden",
      transform: hover ? "translateY(-3px) scale(1.04)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--accent-default)",
      transform: hover ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform 0.35s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, price)));
}
function TreatmentPathCard({
  slotId,
  src
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    "data-theme": "default",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      display: "block",
      flex: 1,
      minHeight: 340,
      borderRadius: "var(--radius-3xl)",
      overflow: "hidden",
      textDecoration: "none",
      background: "var(--color-navy-900, #1B263A)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
      transition: "box-shadow var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("video", {
    className: "hero-card-video",
    src: HERO_UPLOADS + "/hf_20260712_215808_12876c8b-1eda-48be-9200-1414fa5686e7.mp4",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-card-content",
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "var(--spacing-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-card-title",
    style: {
      color: "var(--color-white)",
      fontSize: "var(--text-xl)",
      fontWeight: "var(--font-weight-semibold)",
      lineHeight: 1.3,
      textWrap: "balance",
      maxWidth: "55%",
      textShadow: "0 1px 12px rgba(27,38,58,0.4)"
    }
  }, "Explore treatments designed around you"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      position: "relative",
      overflow: "hidden",
      background: "var(--color-white)",
      color: hover ? "var(--text-on-primary)" : "var(--text-default)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-3) var(--spacing-5)",
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-3px) scale(1.04)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--accent-default)",
      transform: hover ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform 0.35s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, "Discover Your Health Path"))));
}
function CategoryCard({
  slotId,
  theme,
  pre,
  accent,
  accentColor,
  hoverBg,
  hoverBorder,
  src,
  targetId
}) {
  const [hover, setHover] = React.useState(false);
  const handleClick = e => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({
      top: top,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("a", {
    href: targetId ? "#" + targetId : "#",
    "data-theme": theme,
    onClick: handleClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      background: hover ? hoverBg || "linear-gradient(135deg, var(--accent-subtle), var(--accent-subtleHover))" : "var(--bg-elevated)",
      border: "1px solid " + (hover ? hoverBorder || "var(--accent-default)" : "var(--border-default)"),
      borderRadius: "var(--radius-2xl)",
      padding: "var(--spacing-4) var(--spacing-5)",
      textDecoration: "none",
      minHeight: 88,
      boxSizing: "border-box",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
      transform: hover ? "translateY(-4px)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--text-default)",
      lineHeight: 1.35
    }
  }, pre, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: accentColor || "var(--accent-strong)"
    }
  }, accent)), /*#__PURE__*/React.createElement("image-slot", {
    id: slotId,
    shape: "circle",
    placeholder: "",
    src: src,
    style: {
      width: 52,
      height: 52,
      flex: "none",
      transform: hover ? "scale(1.12)" : "scale(1)",
      transition: "transform var(--transition-base) var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement(Chevron, {
    dark: true,
    raised: hover
  }));
}
function StartHereCard({
  slotId,
  src
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-2xl)",
      padding: "var(--spacing-4) var(--spacing-5)",
      textDecoration: "none",
      minHeight: 88,
      boxSizing: "border-box",
      boxShadow: hover ? "var(--shadow-md)" : "none",
      transform: hover ? "translateY(-4px)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-secondary)",
      lineHeight: 1.4
    }
  }, "Unsure where to begin?", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-bold)",
      color: "var(--text-default)"
    }
  }, "Start here")), /*#__PURE__*/React.createElement("image-slot", {
    id: slotId,
    shape: "circle",
    placeholder: "",
    src: src,
    style: {
      width: 52,
      height: 52,
      flex: "none",
      transform: hover ? "scale(1.12)" : "scale(1)",
      transition: "transform var(--transition-base) var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      flex: "none",
      background: "var(--primary-default)",
      color: "var(--text-on-primary)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  }))));
}
function TrustChip({
  label,
  icon
}) {
  const [hover, setHover] = React.useState(false);
  const paths = {
    coach: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    shield: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 12 2 2 4-4"
    })),
    zap: /*#__PURE__*/React.createElement("path", {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
    }),
    clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 6 12 12 16 14"
    }))
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "trust-chip",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-2)",
      background: "var(--color-white)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-2) var(--spacing-4)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-default)",
      boxShadow: hover ? "var(--shadow-sm)" : "var(--shadow-xs)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--accent-strong)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, paths[icon]), label);
}
function Chevron({
  dark,
  raised
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      flex: "none",
      background: dark ? "var(--bg-secondary)" : "rgba(255,255,255,0.9)",
      color: "var(--text-default)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transform: raised ? "translateX(2px)" : "none",
      transition: "transform var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  })));
}
Object.assign(window, {
  ChimeHero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/LabsSection.jsx
try { (() => {
// Chime Health — Homepage UI kit: Labs section
// Full-bleed band themed with the Lab (iris) palette.
// Mirrors WeightLossSection structure: bg scenario at top glued into solid iris;
// title → hero visual → CTAs → 3 cards. Assets are image-slot placeholders
// until the Labs uploads arrive.

const LABS_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const LABS_SOLID = "#A59FD6"; // Iris Signal (Accent) — main section ground
const LABS_INK = "#2A283A"; // dark neutral ink for text on light surfaces

// Scroll-reveal wrapper (same behavior as WLReveal).
function LabsReveal({
  children,
  delay,
  style
}) {
  const ref = React.useRef(null);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });
    io.observe(el);
    return function () {
      io.disconnect();
    };
  }, [reduced]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: Object.assign({
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(28px)",
      transition: "opacity 0.8s var(--ease-out, ease-out), transform 0.8s var(--ease-out, ease-out)",
      transitionDelay: (delay || 0) + "ms",
      willChange: "opacity, transform"
    }, style || {})
  }, children);
}
function ChimeLabsSection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "labs-section",
    "data-screen-label": "Labs",
    "data-theme": "lab",
    style: {
      position: "relative",
      overflow: "hidden",
      background: LABS_SOLID,
      fontFamily: "var(--font-family-base)",
      marginTop: "var(--spacing-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 860,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("video", {
    src: LABS_UPLOADS + "/weight_loss_bg.mp4",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    ref: function (el) {
      if (el) {
        el.muted = true;
        el.defaultMuted = true;
        el.volume = 0;
      }
    },
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 30%",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(165,159,214,0.42) 0%, rgba(165,159,214,0.12) 26%, rgba(165,159,214,0.12) 55%, rgba(165,159,214,0.6) 78%, " + LABS_SOLID + " 96%)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "var(--spacing-12) var(--spacing-8) 0",
      minHeight: 700,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(LabsReveal, {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "labs-title",
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "15em",
      fontSize: "var(--text-5xl)",
      fontWeight: 300,
      lineHeight: 1.12,
      color: "var(--color-white)",
      textWrap: "balance",
      textShadow: "0 1px 18px rgba(42,40,58,0.45)"
    }
  }, "Your Body Has Been Trying", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2A283A"
    }
  }, "To Tell You Something"))), /*#__PURE__*/React.createElement(LabsReveal, {
    delay: 120,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-5)",
      paddingBottom: "var(--spacing-10)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "30em",
      fontSize: "var(--text-xl)",
      lineHeight: 1.45,
      fontWeight: 300,
      color: "var(--color-white)",
      textWrap: "balance",
      textShadow: "0 1px 14px rgba(42,40,58,0.5)"
    }
  }, "Our ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#2A283A"
    }
  }, "Labs & Health Insights"), " programs help uncover information that may support conversations around energy, metabolism, recovery, wellness, healthy aging, and overall health."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(LabsButton, {
    hero: true,
    label: "Discover Your Health Path"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-10)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement(LabsReveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "rgba(42,40,58,0.45)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-10)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-3)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "18em",
      fontSize: "var(--text-4xl)",
      fontWeight: 300,
      lineHeight: 1.12,
      color: "var(--color-white)",
      textWrap: "balance"
    }
  }, "Discover Some Of The Signals Your Body May Be Sending"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "38em",
      fontSize: "var(--text-base)",
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.85)",
      textWrap: "pretty"
    }
  }, "Health insights help uncover biomarkers that may support conversations around wellness, energy, recovery, metabolism, healthy aging, and overall health.")), /*#__PURE__*/React.createElement(LabsSignals, null))), /*#__PURE__*/React.createElement(LabsReveal, null, /*#__PURE__*/React.createElement("div", {
    className: "labs-tiers",
    style: {
      background: "rgba(42,40,58,0.45)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-12) var(--spacing-10)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-3)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "18em",
      fontSize: "var(--text-4xl)",
      fontWeight: 300,
      lineHeight: 1.12,
      color: "var(--color-white)",
      textWrap: "balance"
    }
  }, "Discover A Deeper Understanding Of Your Health"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "42em",
      fontSize: "var(--text-base)",
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.85)",
      textWrap: "pretty"
    }
  }, "Whether you are beginning your wellness journey or seeking the most comprehensive picture possible, Chime offers multiple levels of health insights designed to help guide your path.")), /*#__PURE__*/React.createElement("div", {
    className: "labs-tier-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--spacing-6)",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(LabsTierCard, {
    name: "Essential Health Insights",
    markers: "80+"
  }), /*#__PURE__*/React.createElement(LabsTierCard, {
    name: "Complete Health Insights",
    markers: "100+",
    upgraded: true
  }), /*#__PURE__*/React.createElement(LabsTierCard, {
    name: "Executive Health Insights",
    markers: "130+",
    upgraded: true
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      textAlign: "center",
      fontSize: "var(--text-lg)",
      fontWeight: "var(--font-weight-medium)",
      color: "rgba(255,255,255,0.8)"
    }
  }, "Hundreds Of Data Points. One Personalized Path."))), /*#__PURE__*/React.createElement(LabsReveal, {
    delay: 100
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--spacing-2) auto 0",
      maxWidth: "52em",
      textAlign: "center",
      fontSize: "var(--text-xs)",
      lineHeight: 1.6,
      color: "rgba(255,255,255,0.8)"
    }
  }, "Not available in all 50 states. Lab tests are ordered and reviewed by licensed providers. Results are informational and not a diagnosis. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--color-white)"
    }
  }, "Read more")))));
}
const LABS_SIGNALS = [{
  tag: "Hormones",
  title: "Hormonal Health & Vitality",
  body: "Hormones influence far more than body composition. They may also play a role in energy, recovery, motivation, and overall vitality.",
  markers: "Testosterone · Free Testosterone · Estradiol"
}, {
  tag: "Metabolism",
  title: "Metabolism & Weight Management",
  body: "Metabolic markers may reflect how your body processes energy, manages blood sugar, and stores fuel over time.",
  markers: "HbA1c · Fasting Insulin · Glucose"
}, {
  tag: "Energy",
  title: "Energy & Recovery",
  body: "Day-to-day energy and recovery can connect to nutrient status, iron levels, and how your body handles stress.",
  markers: "Ferritin · Vitamin D · Cortisol"
}, {
  tag: "Heart Health",
  title: "Advanced Heart Health Insights",
  body: "A closer look at cardiovascular markers that go beyond a standard cholesterol test.",
  markers: "ApoB · Lp(a) · hs-CRP"
}, {
  tag: "Healthy Aging",
  title: "Healthy Aging",
  body: "Markers associated with long-term wellness that may support conversations around healthy aging.",
  markers: "HbA1c · hs-CRP · DHEA-S"
}, {
  tag: "And More",
  title: "And Much More…",
  body: "Thyroid, liver, kidney, nutrients, and beyond — a fuller picture across your body's systems.",
  markers: "TSH · ALT · eGFR"
}];
function LabsSignals() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [fade, setFade] = React.useState(true);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const go = React.useCallback(function (i) {
    setFade(false);
    setTimeout(function () {
      setActive(i);
      setFade(true);
    }, 450);
  }, []);
  React.useEffect(function () {
    if (reduced || paused) return;
    const t = setInterval(function () {
      setFade(false);
      setTimeout(function () {
        setActive(function (a) {
          return (a + 1) % LABS_SIGNALS.length;
        });
        setFade(true);
      }, 450);
    }, 5000);
    return function () {
      clearInterval(t);
    };
  }, [reduced, paused]);
  const item = LABS_SIGNALS[active];
  const num = function (i) {
    return (i + 1 < 10 ? "0" : "") + (i + 1);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "labs-signals-grid",
    onMouseEnter: function () {
      setPaused(true);
    },
    onMouseLeave: function () {
      setPaused(false);
    },
    style: {
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: "var(--spacing-6)",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-3)"
    }
  }, LABS_SIGNALS.map(function (s, i) {
    const isActive = i === active;
    return /*#__PURE__*/React.createElement("button", {
      key: s.tag,
      onClick: function () {
        go(i);
      },
      style: {
        textAlign: "left",
        cursor: "pointer",
        font: "inherit",
        background: isActive ? "var(--color-iris-200)" : "rgba(255,255,255,0.05)",
        color: isActive ? LABS_INK : "var(--color-white)",
        border: isActive ? "1px solid var(--color-iris-300)" : "1px solid rgba(255,255,255,0.12)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--spacing-3) var(--spacing-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-1)",
        transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-xs)",
        letterSpacing: "0.08em",
        color: isActive ? "rgba(42,40,58,0.7)" : "rgba(255,255,255,0.7)"
      }
    }, num(i), " \u2014 ", s.tag), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-base)",
        lineHeight: 1.3
      }
    }, s.title));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(42,40,58,0.55)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-2xl)",
      padding: "var(--spacing-8)",
      minHeight: 420,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "var(--spacing-8)",
      opacity: fade ? 1 : 0,
      transform: fade ? "none" : "translateY(10px)",
      transition: "opacity 0.9s var(--ease-out, ease-out), transform 0.9s var(--ease-out, ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--color-white)",
      color: LABS_INK,
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-1) var(--spacing-4)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, item.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-lg)",
      color: "rgba(255,255,255,0.7)"
    }
  }, num(active))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.7)"
    }
  }, "Did you know?"), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: "var(--text-3xl)",
      fontWeight: 300,
      lineHeight: 1.15,
      color: "var(--color-white)"
    }
  }, item.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.85)",
      maxWidth: "34em"
    }
  }, item.body), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.75)"
    }
  }, "Featured biomarkers: ", item.markers, "."))));
}
function LabsTierCard({
  name,
  markers,
  upgraded
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "rgba(42,40,58,0.45)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-2xl)",
      padding: "var(--spacing-6)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "var(--spacing-4)",
      right: "var(--spacing-4)",
      background: "rgba(42,40,58,0.55)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "var(--color-white)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--spacing-2) var(--spacing-3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-2xl)",
      fontWeight: 300,
      lineHeight: 1
    }
  }, markers), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      opacity: 0.85
    }
  }, "Biomarkers"), upgraded ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-iris-700)",
      color: "var(--color-white)",
      borderRadius: "var(--radius-4xl)",
      padding: "2px 10px",
      fontSize: 11
    }
  }, "Upgraded Panel") : null), /*#__PURE__*/React.createElement("img", {
    src: LABS_UPLOADS + "/tier-img-b82013dc.png",
    alt: name + " sample vial",
    style: {
      width: 180,
      height: "auto",
      display: "block",
      margin: "var(--spacing-4) auto 0",
      filter: "drop-shadow(0 16px 32px rgba(42,40,58,0.4))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: "var(--text-xl)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--color-white)",
      lineHeight: 1.25
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "rgba(255,255,255,0.8)"
    }
  }, "From"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-lg)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)"
    }
  }, "$\u2014"))));
}
function LabsButton({
  label,
  primary,
  small,
  tiny,
  large,
  hero
}) {
  const [hover, setHover] = React.useState(false);
  if (hero) {
    // Fixed spec: 52px-tall pill, content-hugging — no stretch.
    return /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        window.openChimeAssessment && window.openChimeAssessment();
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        height: 52,
        padding: "0 28px",
        boxSizing: "border-box",
        background: "var(--color-white)",
        color: LABS_INK,
        borderRadius: 26,
        border: "1px solid transparent",
        fontSize: "var(--text-base)",
        fontWeight: "var(--font-weight-semibold)",
        lineHeight: 1,
        textDecoration: "none",
        whiteSpace: "nowrap",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)"
      }
    }, label);
  }
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-block",
      position: "relative",
      overflow: "hidden",
      background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
      color: primary ? hover ? "var(--text-on-primary)" : LABS_INK : "var(--color-white)",
      backdropFilter: primary ? "none" : "blur(8px)",
      border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
      borderRadius: "var(--radius-4xl)",
      padding: tiny ? "var(--spacing-1) var(--spacing-3)" : small ? "var(--spacing-2) var(--spacing-5)" : large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)",
      fontSize: tiny ? "var(--text-sm)" : large ? "var(--text-lg)" : "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      textDecoration: "none",
      whiteSpace: "nowrap",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-3px) scale(1.04)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--accent-default)",
      transform: hover ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform 0.35s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, label));
}
Object.assign(window, {
  ChimeLabsSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/LabsSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/Navbar.jsx
try { (() => {
// Chime Health — Homepage UI kit: Navbar
// Logo left · links center · Log in right. Sticky, cream, hairline on scroll.

const NAV_ASSETS = window.CHIME_ASSETS_BASE || "../../assets";
function ChimeNavbar({
  links = ["Weight Loss", "Health, Energy & Wellness", "Labs"]
}) {
  const {
    Button
  } = window.ChimeHealthDesignSystem_b350cf;
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "fixed",
      zIndex: "var(--z-sticky)",
      top: scrolled ? "var(--spacing-3)" : 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: scrolled ? "min(calc(var(--container-xl) - var(--spacing-16)), calc(100% - var(--spacing-8)))" : "100%",
      background: scrolled ? "rgba(50, 69, 99, 0.92)" : "rgba(255, 254, 251, 0.88)",
      backdropFilter: "blur(var(--blur-md))",
      WebkitBackdropFilter: "blur(var(--blur-md))",
      border: "1px solid " + (scrolled ? "rgba(255,255,255,0.14)" : "transparent"),
      borderRadius: scrolled ? "var(--radius-4xl)" : 0,
      boxShadow: scrolled ? "var(--shadow-md)" : "none",
      transition: "top var(--transition-base) var(--ease-in-out), width var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out), border-radius var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    className: "nav-bar",
    style: {
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      gap: "var(--spacing-6)",
      padding: scrolled ? "0 var(--spacing-5)" : "0 var(--spacing-8)",
      height: scrolled ? 80 : 72,
      transition: "height var(--transition-base) var(--ease-in-out), padding var(--transition-base) var(--ease-in-out)",
      fontFamily: "var(--font-family-base)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Chime Health home",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifySelf: "start",
      position: "relative",
      marginLeft: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: NAV_ASSETS + "/logo-slate.png",
    alt: "Chime Health",
    style: {
      height: 44,
      width: "auto",
      display: "block",
      opacity: scrolled ? 0 : 1,
      transition: "opacity var(--transition-base) var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: NAV_ASSETS + "/logo-white.png",
    alt: "",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      height: 44,
      width: "auto",
      display: "block",
      opacity: scrolled ? 1 : 0,
      transition: "opacity var(--transition-base) var(--ease-in-out)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "nav-links",
    style: {
      display: "flex",
      gap: "var(--spacing-2)",
      justifySelf: "center"
    }
  }, links.map(label => /*#__PURE__*/React.createElement(NavLink, {
    key: label,
    label: label,
    onDark: scrolled
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: "end"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    style: {
      borderRadius: "var(--radius-4xl)",
      padding: "0 var(--spacing-4)",
      color: scrolled ? "var(--color-white)" : undefined,
      borderColor: scrolled ? "rgba(255,255,255,0.4)" : undefined,
      background: scrolled ? "transparent" : undefined,
      transition: "color var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out)"
    }
  }, "Log in"))));
}
function NavLink({
  label,
  onDark
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      textDecoration: "none",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      color: onDark ? "var(--color-white)" : hover ? "var(--accent-strong)" : "var(--text-secondary)",
      background: hover ? onDark ? "rgba(255,255,255,0.14)" : "var(--accent-subtle)" : "transparent",
      padding: "var(--spacing-2) var(--spacing-4)",
      borderRadius: "var(--radius-4xl)",
      transition: "background var(--transition-fast) var(--ease-in-out), color var(--transition-fast) var(--ease-in-out)",
      whiteSpace: "nowrap"
    }
  }, label);
}
Object.assign(window, {
  ChimeNavbar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/ProductsSection.jsx
try { (() => {
// Chime Health — Homepage UI kit: Products carousel section
// Horizontal right-to-left carousel of treatment cards (scroll-snap + arrows + progress).

const PRODUCTS_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const CHIME_PRODUCTS = [{
  id: "prod-semaglutide",
  name: "Semaglutide",
  category: "Weight Loss",
  theme: "weight-loss",
  price: "From $249/mo",
  status: "In stock",
  badge: null,
  plans: [{
    key: "1mo",
    price: "From $249.00",
    note: null
  }, {
    key: "3mo",
    price: "$596.00*",
    note: "*Includes ",
    noteBold: "4th month for free"
  }, {
    key: "6mo",
    price: "$1,050.00",
    note: null
  }, {
    key: "1yr",
    price: "$1,800.00",
    note: null
  }]
}, {
  id: "prod-tirzepatide",
  name: "Tirzepatide",
  category: "Weight Loss",
  theme: "weight-loss",
  price: "From $359/mo",
  status: "In stock",
  badge: "Popular",
  plans: [{
    key: "1mo",
    price: "From $359.00",
    note: null
  }, {
    key: "3mo",
    price: "$896.00*",
    note: "*Includes ",
    noteBold: "4th month for free"
  }, {
    key: "6mo",
    price: "$1,650.00",
    note: null
  }, {
    key: "1yr",
    price: "$2,880.00",
    note: null
  }]
}, {
  id: "prod-nad",
  name: "NAD+",
  category: "Energy & Wellness",
  theme: "energy-wellness",
  price: "From $145/mo",
  status: "In stock",
  badge: null
}, {
  id: "prod-lipoc",
  name: "Lipo-C",
  category: "Energy & Wellness",
  theme: "energy-wellness",
  price: "From $135/mo",
  status: "In stock",
  badge: null
}, {
  id: "prod-sermorelin",
  name: "Sermorelin",
  category: "Energy & Wellness",
  theme: "energy-wellness",
  price: "From $190/mo",
  status: "Coming soon",
  badge: "Coming soon"
}];
const CHIME_PLAN_KEYS = [{
  key: "1mo",
  label: "1 Month"
}, {
  key: "3mo",
  label: "3 Months"
}, {
  key: "6mo",
  label: "6 Months"
}, {
  key: "1yr",
  label: "1 Year"
}];
function ChimeProductsSection() {
  const trackRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [planIdx, setPlanIdx] = React.useState(0);

  // Auto-advance treatment length every 25s; manual click resets the timer.
  const planTimer = React.useRef(null);
  const startPlanTimer = React.useCallback(() => {
    if (planTimer.current) clearInterval(planTimer.current);
    planTimer.current = setInterval(() => {
      setPlanIdx(i => (i + 1) % CHIME_PLAN_KEYS.length);
    }, 25000);
  }, []);
  React.useEffect(() => {
    startPlanTimer();
    return () => clearInterval(planTimer.current);
  }, [startPlanTimer]);
  const pickPlan = i => {
    setPlanIdx(i);
    startPlanTimer();
  };
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);
  const update = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);
  React.useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);
  const step = dir => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-product-card]");
    const w = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({
      left: dir * w,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Products carousel",
    className: "hero-section products-section",
    style: {
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-12)",
      fontFamily: "var(--font-family-base)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "products-head",
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--spacing-6)",
      flexWrap: "wrap",
      marginBottom: "var(--spacing-8)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--accent-strong)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: "var(--spacing-3)"
    }
  }, "Treatments"), /*#__PURE__*/React.createElement("h2", {
    className: "products-title",
    style: {
      margin: 0,
      fontSize: "var(--text-5xl)",
      fontWeight: 300,
      lineHeight: 1.1,
      color: "var(--text-default)",
      textWrap: "balance"
    }
  }, "Care that works, delivered")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "26em",
      fontSize: "var(--text-base)",
      color: "var(--text-secondary)",
      lineHeight: 1.55
    }
  }, "Provider-prescribed treatments, shipped from licensed US pharmacies to your door.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      flexWrap: "wrap",
      marginBottom: "var(--spacing-6)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, "Treatment length"), /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": "Treatment length",
    style: {
      display: "flex",
      gap: 2,
      background: "var(--bg-secondary)",
      borderRadius: "var(--radius-4xl)",
      padding: 3
    }
  }, CHIME_PLAN_KEYS.map((pl, i) => /*#__PURE__*/React.createElement("button", {
    key: pl.key,
    type: "button",
    role: "tab",
    "aria-selected": i === planIdx,
    onClick: () => pickPlan(i),
    style: {
      border: "none",
      cursor: "pointer",
      background: i === planIdx ? "var(--primary-default)" : "transparent",
      color: i === planIdx ? "var(--text-on-primary)" : "var(--text-secondary)",
      boxShadow: i === planIdx ? "var(--shadow-sm)" : "none",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-2) var(--spacing-4)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      fontFamily: "inherit",
      whiteSpace: "nowrap",
      transition: "all var(--transition-base) var(--ease-in-out)"
    }
  }, pl.label)))), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onScroll: update,
    className: "products-track",
    style: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "calc((100% - 3 * 16px) / 4)",
      gap: 16,
      overflowX: "auto",
      scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      paddingBottom: "var(--spacing-2)"
    }
  }, CHIME_PRODUCTS.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    p: p,
    planIdx: planIdx
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "var(--spacing-3)",
      marginTop: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 72,
      height: 10,
      background: "var(--bg-tertiary)",
      borderRadius: "var(--radius-4xl)",
      overflow: "hidden",
      marginRight: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      bottom: 2,
      left: 2 + progress * (72 - 4 - 28) + "px",
      width: 28,
      background: "var(--primary-default)",
      borderRadius: "var(--radius-4xl)",
      transition: "left 80ms linear"
    }
  })), /*#__PURE__*/React.createElement(CarouselArrow, {
    dir: -1,
    enabled: canPrev,
    onClick: () => step(-1)
  }), /*#__PURE__*/React.createElement(CarouselArrow, {
    dir: 1,
    enabled: canNext,
    onClick: () => step(1)
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--spacing-8) 0 0",
      maxWidth: "72em",
      fontSize: "var(--text-xs)",
      lineHeight: 1.6,
      color: "var(--text-muted)"
    }
  }, "Compounded medications are prescribed at a licensed provider\u2019s discretion and are not FDA-approved.", " ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-secondary)"
    }
  }, "Safety info:"), " GLP-1 medications may have serious side effects, including possible thyroid tumors. Do not use if you or your family have a history of a type of thyroid cancer called MTC or MEN 2. See full safety information on each treatment page."));
}
function ProductCard({
  p,
  planIdx
}) {
  const [hover, setHover] = React.useState(false);
  const future = p.status === "Coming soon";
  const plan = p.plans ? p.plans[planIdx] : null;
  return /*#__PURE__*/React.createElement("article", {
    "data-product-card": true,
    "data-theme": p.theme,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      scrollSnapAlign: "start",
      display: "flex",
      flexDirection: "column",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-3xl)",
      overflow: "hidden",
      background: "linear-gradient(160deg, #FFFFFF 0%, #D6ECFF 60%, #BDD2F6 100%)",
      aspectRatio: "1 / 1.05",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
      transition: "box-shadow var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: p.id,
    shape: "rect",
    fit: "contain",
    placeholder: "Drop product photo",
    src: PRODUCTS_UPLOADS + "/ozempic-pen-aa505b46.png",
    style: {
      position: "absolute",
      inset: "10%",
      transform: hover ? "scale(1.06) rotate(-2deg)" : "none",
      transition: "transform var(--transition-base) var(--ease-in-out)",
      filter: future ? "grayscale(0.35) opacity(0.75)" : "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "var(--spacing-4)",
      left: "var(--spacing-4)",
      right: "var(--spacing-4)",
      display: "flex",
      gap: "var(--spacing-2)",
      flexWrap: "wrap"
    }
  }, p.badge && !(plan && plan.noteBold) && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--accent-subtle)",
      color: "var(--accent-onSubtle)",
      border: "1px solid var(--accent-border)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-1) var(--spacing-3)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)"
    }
  }, p.badge), plan && plan.noteBold && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--primary-default)",
      color: "var(--text-on-primary)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-1) var(--spacing-3)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)"
    }
  }, "*Includes 4th month for free"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)",
      padding: "var(--spacing-4) var(--spacing-1) 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--spacing-2)",
      alignSelf: "flex-start",
      background: future ? "var(--bg-secondary)" : "var(--success-subtle)",
      color: future ? "var(--text-secondary)" : "var(--color-green-800)",
      borderRadius: "var(--radius-4xl)",
      padding: "2px var(--spacing-3)",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: future ? "var(--color-slate-400)" : "var(--success-default)"
    }
  }), p.status), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--text-default)",
      lineHeight: 1.2
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-secondary)",
      display: "flex",
      alignItems: "baseline",
      gap: "var(--spacing-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: p.theme === "energy-wellness" ? "#B08A28" : "var(--accent-strong)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, p.category), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--text-default)",
      marginLeft: "auto"
    }
  }, plan ? plan.price : p.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--spacing-2)",
      marginTop: "var(--spacing-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(ProductBtn, {
    primary: true,
    disabled: future,
    label: future ? "Join waitlist" : "Get started"
  }), /*#__PURE__*/React.createElement(ProductBtn, {
    primary: false,
    label: "Learn more"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      marginTop: "var(--spacing-1)",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)",
      textDecoration: "underline",
      textUnderlineOffset: 2
    }
  }, "Important safety information")));
}
function ProductBtn({
  primary,
  label,
  disabled
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      if (!disabled) window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-block",
      background: primary ? hover ? "var(--primary-hover)" : "var(--primary-default)" : "var(--color-white)",
      color: primary ? "var(--text-on-primary)" : "var(--text-default)",
      border: primary ? "1px solid transparent" : "1px solid " + (hover ? "var(--border-strong)" : "var(--border-default)"),
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-2) var(--spacing-4)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      textDecoration: "none",
      boxShadow: hover ? "var(--shadow-sm)" : "none",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "all var(--transition-base) var(--ease-in-out)"
    }
  }, label);
}
function CarouselArrow({
  dir,
  enabled,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    disabled: !enabled,
    "aria-label": dir < 0 ? "Previous products" : "Next products",
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      border: "1px solid " + (enabled ? "var(--border-strong)" : "var(--border-default)"),
      background: enabled && hover ? "var(--primary-default)" : "var(--color-white)",
      color: enabled ? hover ? "var(--text-on-primary)" : "var(--text-default)" : "var(--color-slate-300)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: enabled ? "pointer" : "default",
      transition: "all var(--transition-base) var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, dir < 0 ? /*#__PURE__*/React.createElement("path", {
    d: "M19 12H5m6-6-6 6 6 6"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14m-6-6 6 6-6 6"
  })));
}
Object.assign(window, {
  ChimeProductsSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/ProductsSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/WeightLossSection.jsx
try { (() => {
// Chime Health — Homepage UI kit: Weight Loss section
// Full-bleed band themed with the Weight Loss (sage) palette.
// bg_scenario.png at top, gradient glued into solid sage; title → model → CTAs → 3 cards.

const WL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WL_SOLID = "#7A9472"; // Muted Sage Green (Accent) — main section ground

// Scroll-reveal wrapper: fades/slides children in when they enter the viewport.
function WLReveal({
  children,
  delay,
  style
}) {
  const ref = React.useRef(null);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });
    io.observe(el);
    return function () {
      io.disconnect();
    };
  }, [reduced]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: Object.assign({
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(28px)",
      transition: "opacity 0.8s var(--ease-out, ease-out), transform 0.8s var(--ease-out, ease-out)",
      transitionDelay: (delay || 0) + "ms",
      willChange: "opacity, transform"
    }, style || {})
  }, children);
}
function ChimeWeightLossSection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "weight-loss-section",
    "data-screen-label": "Weight Loss",
    "data-theme": "weight-loss",
    style: {
      position: "relative",
      overflow: "hidden",
      background: WL_SOLID,
      fontFamily: "var(--font-family-base)",
      marginTop: "var(--spacing-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 860,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: WL_UPLOADS + "/bg_scenario.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 30%",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(122,148,114,0.42) 0%, rgba(122,148,114,0.18) 30%, rgba(122,148,114,0.55) 62%, " + WL_SOLID + " 96%)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "var(--spacing-12) var(--spacing-8) 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(WLReveal, {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--color-white)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      opacity: 0.9,
      marginBottom: "var(--spacing-3)"
    }
  }, "Weight loss by Chime"), /*#__PURE__*/React.createElement("h2", {
    className: "wl-title",
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "13em",
      fontSize: "var(--text-5xl)",
      fontWeight: 300,
      lineHeight: 1.08,
      color: "var(--color-white)",
      textWrap: "balance",
      textShadow: "0 1px 18px rgba(24,38,31,0.45)"
    }
  }, "Lasting weight loss, built around your body")), /*#__PURE__*/React.createElement(WLReveal, {
    delay: 120,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: "var(--spacing-6)",
      display: "flex",
      justifyContent: "center",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "wl-model",
    src: WL_UPLOADS + "/model_weight.png",
    alt: "Woman carrying a yoga mat",
    style: {
      width: "min(480px, 74vw)",
      height: "auto",
      display: "block",
      filter: "drop-shadow(0 24px 48px rgba(24,38,31,0.45))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "var(--spacing-8)",
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: "var(--spacing-3)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(WLButton, {
    primary: true,
    large: true,
    label: "Start my visit"
  }), /*#__PURE__*/React.createElement(WLButton, {
    large: true,
    label: "Learn more"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-10)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wl-card-pair",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr calc((100% - 3 * 16px) / 4)",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement(WLReveal, null, /*#__PURE__*/React.createElement("div", {
    className: "wl-card-wide",
    style: {
      position: "relative",
      height: "100%",
      boxSizing: "border-box",
      background: "rgba(38,52,34,0.35)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: "var(--spacing-8)",
      padding: "var(--spacing-10) var(--spacing-10) 0",
      minHeight: 520,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-3)",
      alignItems: "flex-start",
      textAlign: "left",
      paddingBottom: "var(--spacing-10)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-3xl)",
      fontWeight: 300,
      lineHeight: 1.15,
      color: "var(--color-white)",
      maxWidth: "12em"
    }
  }, "Because No Two Bodies Are The Same"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.5,
      color: "rgba(255,255,255,0.9)",
      maxWidth: "26em"
    }
  }, "Your goals, lifestyle, and health history all play a role in determining the right path forward.")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 420,
      justifySelf: "center",
      alignSelf: "end"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: WL_UPLOADS + "/wieght_loss_md.png",
    alt: "Video visit with a provider on a phone",
    style: {
      width: "100%",
      height: "auto",
      display: "block",
      filter: "drop-shadow(0 20px 40px rgba(24,38,31,0.4))"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--spacing-10)",
      bottom: "var(--spacing-8)"
    }
  }, /*#__PURE__*/React.createElement(WLButton, {
    small: true,
    label: "Discover Your Weight Loss Path"
  })))), /*#__PURE__*/React.createElement(WLReveal, {
    delay: 140
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      height: "100%",
      boxSizing: "border-box",
      background: "rgba(38,52,34,0.35)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-8)",
      minHeight: 420,
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-2xl)",
      overflow: "hidden",
      flex: 1,
      minHeight: 200
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "wl-product-semaglutide",
    shape: "rect",
    fit: "contain",
    placeholder: "Drop product photo",
    src: WL_UPLOADS + "/ozempic-pen-aa505b46.png",
    style: {
      position: "absolute",
      inset: "6%",
      transform: "rotate(-15deg)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)",
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)",
      lineHeight: 1.2
    }
  }, "Semaglutide"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: "var(--spacing-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,0.85)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, "Weight Loss"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "rgba(255,255,255,0.35)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)"
    }
  }, "From $249/mo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--spacing-2)",
      marginTop: "var(--spacing-2)",
      justifyContent: "center",
      flexWrap: "nowrap"
    }
  }, /*#__PURE__*/React.createElement(WLButton, {
    primary: true,
    tiny: true,
    label: "Get started"
  }), /*#__PURE__*/React.createElement(WLButton, {
    tiny: true,
    label: "Learn more"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      marginTop: "var(--spacing-1)",
      fontSize: "var(--text-xs)",
      color: "rgba(255,255,255,0.85)",
      textDecoration: "underline",
      textUnderlineOffset: 2
    }
  }, "Important safety information"))))), /*#__PURE__*/React.createElement(WLReveal, null, /*#__PURE__*/React.createElement(WLCalculatorCard, null)), /*#__PURE__*/React.createElement(WLReveal, {
    delay: 100
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--spacing-2) auto 0",
      maxWidth: "52em",
      textAlign: "center",
      fontSize: "var(--text-xs)",
      lineHeight: 1.6,
      color: "rgba(255,255,255,0.8)"
    }
  }, "Not available in all 50 states. Eligibility determination and prescription required for all treatments. Individual results vary. Weight loss estimates reflect an average and are not a guarantee. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--color-sage-200)"
    }
  }, "Read more")))));
}
function WLSlider({
  label,
  value,
  min,
  max,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "rgba(255,255,255,0.85)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xl)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--color-white)",
      fontVariantNumeric: "tabular-nums"
    }
  }, value, " lb")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    value: value,
    onChange: e => onChange(Number(e.target.value)),
    style: {
      width: "100%",
      accentColor: "var(--color-sage-300)",
      cursor: "pointer"
    }
  }));
}
function WLCalculatorCard() {
  const [start, setStart] = React.useState(190);
  const [goal, setGoal] = React.useState(165);
  const [pace, setPace] = React.useState("standard");
  const paces = [{
    id: "steady",
    label: "Steady",
    rate: 1.0
  }, {
    id: "standard",
    label: "Standard",
    rate: 1.4
  }, {
    id: "ambitious",
    label: "Ambitious",
    rate: 1.8
  }];
  const rate = paces.find(p => p.id === pace).rate;
  const change = Math.max(0, start - goal);
  const weeks = change > 0 ? Math.ceil(change / rate) : 0;
  const months = (weeks / 4.345).toFixed(1);

  // Curve scales with pace: x-axis is fixed at the slowest (Steady) timeline, so a
  // faster pace reaches goal sooner — the line ends earlier and stays flat after.
  const W = 560,
    H = 190,
    padX = 34,
    padY = 22;
  const slowestWeeks = change > 0 ? Math.ceil(change / paces[0].rate) : 0;
  const frac = slowestWeeks > 0 ? weeks / slowestWeeks : 1; // 1 for Steady, smaller when faster
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    pts.push([padX + t * frac * (W - 2 * padX), padY + ease * (H - 2 * padY)]);
  }
  const goalX = pts[24][0];
  let path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  if (frac < 0.999) path += " L" + (W - padX).toFixed(1) + " " + (H - padY).toFixed(1); // maintenance tail
  const milestones = [{
    wk: "Week 4",
    title: "First check-in",
    body: "Review progress & adjust plan"
  }, {
    wk: "Week " + Math.max(8, Math.round(weeks / 2)),
    title: "Building momentum",
    body: "Dose optimization phase"
  }, {
    wk: "Week " + Math.max(12, weeks),
    title: "Sustain & thrive",
    body: "Long-term strategy set"
  }];
  const panel = {
    background: "rgba(24,38,31,0.55)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "var(--radius-2xl)",
    padding: "var(--spacing-6)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(38,52,34,0.35)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-8)",
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-3xl)",
      fontWeight: 300,
      lineHeight: 1.15,
      color: "var(--color-white)"
    }
  }, "See it before you start"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.5,
      color: "rgba(255,255,255,0.9)",
      maxWidth: "30em"
    }
  }, "Adjust targets and preview a timeline. Your clinician personalizes the final plan.")), /*#__PURE__*/React.createElement("div", {
    className: "wl-calc-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(260px, 340px) 1fr",
      gap: "var(--spacing-5)",
      alignItems: "stretch",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: Object.assign({}, panel, {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-5)"
    })
  }, /*#__PURE__*/React.createElement(WLSlider, {
    label: "Starting weight",
    value: start,
    min: 120,
    max: 350,
    onChange: v => {
      setStart(v);
      if (goal > v - 5) setGoal(v - 5);
    }
  }), /*#__PURE__*/React.createElement(WLSlider, {
    label: "Goal weight",
    value: goal,
    min: 100,
    max: start - 5,
    onChange: setGoal
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "rgba(255,255,255,0.85)"
    }
  }, "Pace preference"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 4,
      background: "rgba(38,52,34,0.30)",
      borderRadius: "var(--radius-lg)",
      padding: 4
    }
  }, paces.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => setPace(p.id),
    style: {
      border: "none",
      cursor: "pointer",
      borderRadius: "var(--radius-md)",
      padding: "var(--spacing-2) var(--spacing-1)",
      textAlign: "center",
      background: pace === p.id ? "var(--color-sage-300)" : "transparent",
      color: pace === p.id ? "#26341F" : "rgba(255,255,255,0.85)",
      fontFamily: "inherit",
      transition: "background 0.25s var(--ease-in-out), color 0.25s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)"
    }
  }, p.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      opacity: 0.75
    }
  }, p.rate.toFixed(1), " lb/week"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-sage-300)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--spacing-4) var(--spacing-5)",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "var(--spacing-4)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#26341F",
      opacity: 0.7
    }
  }, "Estimated timeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-lg)",
      fontWeight: "var(--font-weight-medium)",
      color: "#26341F",
      fontVariantNumeric: "tabular-nums"
    }
  }, weeks, " wk (~", months, " mo)")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#26341F",
      opacity: 0.7
    }
  }, "Total change"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-lg)",
      fontWeight: "var(--font-weight-medium)",
      color: "#26341F",
      fontVariantNumeric: "tabular-nums"
    }
  }, "\u2212", change, " lb"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      lineHeight: 1.5,
      color: "rgba(255,255,255,0.8)"
    }
  }, "Projections are not guarantees. Your clinician determines eligibility, dosing, and timelines based on your individual profile.")), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({}, panel, {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.85)"
    }
  }, "Estimated timeline"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: "var(--radius-4xl)",
      padding: "2px var(--spacing-3)",
      background: "rgba(255,255,255,0.08)"
    }
  }, paces.find(p => p.id === pace).label, " Pace")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 " + W + " " + H,
    style: {
      width: "100%",
      height: "auto",
      flex: 1
    },
    "aria-label": "Projected weight from " + start + " to " + goal + " pounds"
  }, /*#__PURE__*/React.createElement("line", {
    x1: padX,
    y1: padY,
    x2: W - padX,
    y2: padY,
    stroke: "rgba(255,255,255,0.12)",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: padX,
    y1: H - padY,
    x2: W - padX,
    y2: H - padY,
    stroke: "rgba(255,255,255,0.12)",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: padX - 6,
    y: padY + 4,
    textAnchor: "end",
    fontSize: "11",
    fill: "rgba(255,255,255,0.8)"
  }, start), /*#__PURE__*/React.createElement("text", {
    x: padX - 6,
    y: H - padY + 4,
    textAnchor: "end",
    fontSize: "11",
    fill: "rgba(255,255,255,0.8)"
  }, goal), /*#__PURE__*/React.createElement("path", {
    d: path,
    fill: "none",
    stroke: "var(--color-sage-300)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    style: {
      transition: "d 0.4s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: pts[0][0],
    cy: pts[0][1],
    r: "5",
    fill: "var(--color-sage-300)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: goalX,
    cy: pts[24][1],
    r: "5",
    fill: "var(--color-sage-300)",
    style: {
      transition: "cx 0.4s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: goalX,
    y: H - padY + 16,
    textAnchor: "middle",
    fontSize: "11",
    fill: "rgba(255,255,255,0.85)",
    style: {
      transition: "x 0.4s var(--ease-in-out)"
    }
  }, "Wk ", weeks), /*#__PURE__*/React.createElement("text", {
    x: padX,
    y: H - padY + 16,
    textAnchor: "middle",
    fontSize: "11",
    fill: "rgba(255,255,255,0.8)"
  }, "Wk 0")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "var(--spacing-3)"
    }
  }, milestones.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.title,
    style: {
      background: "rgba(38,52,34,0.30)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-xl)",
      padding: "var(--spacing-4)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.75)"
    }
  }, m.wk), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)"
    }
  }, m.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      lineHeight: 1.4,
      color: "rgba(255,255,255,0.85)"
    }
  }, m.body)))))));
}
function WLButton({
  label,
  primary,
  small,
  tiny,
  large
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-block",
      position: "relative",
      overflow: "hidden",
      background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
      color: primary ? hover ? "var(--text-on-primary)" : "#26341F" : "var(--color-white)",
      backdropFilter: primary ? "none" : "blur(8px)",
      border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
      borderRadius: "var(--radius-4xl)",
      padding: tiny ? "var(--spacing-1) var(--spacing-3)" : small ? "var(--spacing-2) var(--spacing-5)" : large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)",
      fontSize: tiny ? "var(--text-sm)" : large ? "var(--text-lg)" : "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      textDecoration: "none",
      whiteSpace: "nowrap",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-3px) scale(1.04)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--accent-default)",
      transform: hover ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform 0.35s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, label));
}
Object.assign(window, {
  ChimeWeightLossSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/WeightLossSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/WellnessSection.jsx
try { (() => {
// Chime Health — Homepage UI kit: Health, Energy & Wellness section
// Full-bleed band themed with the warm peach palette.
// wellness.jpg at top, gradient glued into solid warm ground; title → hero image → CTAs → 3 cards.

const HW_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const HW_SOLID = "#D7AA52"; // Soft Cadmium (Accent)

// Scroll-reveal wrapper (same behavior as WLReveal)
function HWReveal({
  children,
  delay,
  style
}) {
  const ref = React.useRef(null);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });
    io.observe(el);
    return function () {
      io.disconnect();
    };
  }, [reduced]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: Object.assign({
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(28px)",
      transition: "opacity 0.8s var(--ease-out, ease-out), transform 0.8s var(--ease-out, ease-out)",
      transitionDelay: (delay || 0) + "ms",
      willChange: "opacity, transform"
    }, style || {})
  }, children);
}
function ChimeWellnessSection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "wellness-section",
    "data-screen-label": "Health, Energy and Wellness",
    "data-theme": "wellness",
    style: {
      position: "relative",
      overflow: "hidden",
      background: HW_SOLID,
      fontFamily: "var(--font-family-base)",
      marginTop: "var(--spacing-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 860,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("video", {
    src: HW_UPLOADS + "/hf_20260713_173242_23f715b1-50ef-45c4-addf-d7f2be7692c0.mp4",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    ref: function (el) {
      if (el) el.playbackRate = 0.5;
    },
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 40%",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(76,57,14,0.42) 0%, rgba(76,57,14,0.14) 30%, rgba(76,57,14,0.55) 62%, " + HW_SOLID + " 96%)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "var(--spacing-12) var(--spacing-8) 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(HWReveal, {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      opacity: 0.9,
      marginBottom: "var(--spacing-3)"
    }
  }, "Health, Energy & Wellness by Chime"), /*#__PURE__*/React.createElement("h2", {
    className: "hw-title",
    style: {
      margin: 0,
      textAlign: "center",
      maxWidth: "13em",
      fontSize: "var(--text-5xl)",
      fontWeight: 300,
      lineHeight: 1.08,
      color: "var(--color-white)",
      textWrap: "balance",
      textShadow: "0 1px 18px rgba(56,42,10,0.45)"
    }
  }, "Feel More Like Yourself Again")), /*#__PURE__*/React.createElement(HWReveal, {
    delay: 120,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hw-intro-row",
    style: {
      marginTop: "clamp(160px, 24vw, 320px)",
      marginBottom: "var(--spacing-10)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "var(--spacing-8)",
      flexWrap: "wrap",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: "34em",
      fontSize: "var(--text-lg)",
      lineHeight: 1.55,
      color: "var(--color-white)",
      opacity: 0.92,
      textShadow: "0 1px 14px rgba(56,42,10,0.4)"
    }
  }, "Energy, wellness, and vitality are deeply personal. Whether you\u2019re looking to improve your daily energy, stay focused, support recovery, or simply feel your best, Chime helps you explore a more personalized path forward."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement(HWButton, {
    primary: true,
    large: true,
    label: "Discover Your Wellness Path"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-4)",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "var(--radius-full)",
      padding: "var(--spacing-3) var(--spacing-6)",
      textDecoration: "none",
      transition: "all 0.25s ease-out"
    },
    onMouseEnter: e => {
      e.target.style.background = "rgba(255,255,255,0.15)";
      e.target.style.borderColor = "rgba(255,255,255,0.3)";
    },
    onMouseLeave: e => {
      e.target.style.background = "rgba(255,255,255,0.1)";
      e.target.style.borderColor = "rgba(255,255,255,0.2)";
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)"
    }
  }, "Boost ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-white)"
    }
  }, "energy & wellness")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-base)",
      color: "var(--color-white)"
    }
  }, "\u203A")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: "var(--container-xl)",
      margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-10)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement(HWReveal, null, /*#__PURE__*/React.createElement(HWFamiliarCard, null)), /*#__PURE__*/React.createElement("div", {
    className: "hw-card-pair",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr calc((100% - 3 * 16px) / 4)",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement(HWReveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(56,42,10,0.78)",
      border: "1px solid rgba(56,42,10,0.5)",
      borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-8)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-5)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-3xl)",
      fontWeight: 300,
      lineHeight: 1.15,
      color: "var(--color-white)",
      textAlign: "center",
      maxWidth: "11em"
    }
  }, "Feel the difference"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "var(--radius-2xl)",
      padding: "var(--spacing-6) var(--spacing-8)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-2)",
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.8)"
    }
  }, "This week"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 72,
      fontWeight: 300,
      lineHeight: 1,
      color: "var(--color-white)"
    }
  }, "+2.4 h"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "rgba(255,255,255,0.85)"
    }
  }, "of restful sleep, on average"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      height: 90,
      marginTop: "var(--spacing-3)"
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "hw-progress",
    shape: "rounded",
    radius: "16",
    placeholder: "progress photo",
    style: {
      width: "100%",
      height: "100%"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--spacing-4)",
      width: "100%",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      lineHeight: 1.5,
      color: "rgba(255,255,255,0.85)",
      maxWidth: "18em"
    }
  }, "Track your sleep, energy, and mood \u2014 and watch small changes add up."), /*#__PURE__*/React.createElement(HWButton, {
    small: true,
    label: "See the science"
  })))), /*#__PURE__*/React.createElement(HWReveal, {
    delay: 140
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      height: "100%",
      boxSizing: "border-box",
      background: "rgba(56,42,10,0.78)",
      border: "1px solid rgba(56,42,10,0.5)",
      borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-8)",
      minHeight: 420,
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-2xl)",
      overflow: "hidden",
      flex: 1,
      minHeight: 200
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "hw-product-b12",
    shape: "rect",
    fit: "contain",
    placeholder: "Drop product photo",
    style: {
      position: "absolute",
      inset: "6%",
      transform: "rotate(-15deg)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--spacing-2)",
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)",
      lineHeight: 1.2
    }
  }, "Vitamin B12 Injection"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: "var(--spacing-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,0.85)",
      fontWeight: "var(--font-weight-medium)"
    }
  }, "Energy & Wellness"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "rgba(255,255,255,0.35)"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--color-white)"
    }
  }, "From $49/mo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--spacing-2)",
      marginTop: "var(--spacing-2)",
      justifyContent: "center",
      flexWrap: "nowrap"
    }
  }, /*#__PURE__*/React.createElement(HWButton, {
    primary: true,
    tiny: true,
    label: "Get started"
  }), /*#__PURE__*/React.createElement(HWButton, {
    tiny: true,
    label: "Learn more"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      marginTop: "var(--spacing-1)",
      fontSize: "var(--text-xs)",
      color: "rgba(255,255,255,0.85)",
      textDecoration: "underline",
      textUnderlineOffset: 2
    }
  }, "Important safety information"))))), /*#__PURE__*/React.createElement(HWReveal, {
    delay: 100
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--spacing-2) auto 0",
      maxWidth: "52em",
      textAlign: "center",
      fontSize: "var(--text-xs)",
      lineHeight: 1.6,
      color: "rgba(255,255,255,0.8)"
    }
  }, "Not available in all 50 states. Eligibility determination and prescription required for all treatments. Individual results vary. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--color-white)"
    }
  }, "Read more")))));
}
const HW_FEELINGS = ["Afternoon energy crashes", "Mental fog", "Difficulty staying focused", "Feeling drained", "Poor recovery", "Lack of motivation", "Feeling less like yourself", "Not performing at your best"];
function HWFamiliarCard() {
  const [picked, setPicked] = React.useState({});
  const count = Object.values(picked).filter(Boolean).length;
  const anyPicked = count > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "hw-card-wide",
    style: {
      position: "relative",
      background: "rgba(56,42,10,0.78)",
      border: "1px solid rgba(56,42,10,0.5)",
      borderRadius: "var(--radius-3xl)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-6)",
      padding: "var(--spacing-10)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-3)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-4xl)",
      fontWeight: 300,
      lineHeight: 1.12,
      color: "var(--color-white)",
      textWrap: "balance"
    }
  }, "Does any of this sound familiar?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.85)",
      maxWidth: "36em"
    }
  }, "Many people assume these feelings are simply part of getting older or having a busy life. Sometimes there may be more to the story."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "rgba(255,255,255,0.75)",
      letterSpacing: "0.04em"
    }
  }, "Tap what sounds familiar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "var(--spacing-3)",
      maxWidth: "44em"
    }
  }, HW_FEELINGS.map(function (label) {
    const on = !!picked[label];
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      type: "button",
      onClick: function () {
        setPicked(function (p) {
          const n = Object.assign({}, p);
          n[label] = !n[label];
          return n;
        });
      },
      "aria-pressed": on,
      style: {
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "var(--text-base)",
        fontWeight: on ? "var(--font-weight-semibold)" : "var(--font-weight-regular)",
        color: on ? "#4C390E" : "var(--color-white)",
        background: on ? "#F5E3A8" : "rgba(255,255,255,0.14)",
        border: on ? "1px solid #F5E3A8" : "1px solid rgba(255,255,255,0.35)",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-3) var(--spacing-5)",
        boxShadow: on ? "0 6px 20px rgba(217,166,46,0.35)" : "none",
        transition: "background 0.25s var(--ease-in-out), color 0.25s var(--ease-in-out), border-color 0.25s var(--ease-in-out), box-shadow 0.25s var(--ease-in-out), transform 0.25s var(--ease-in-out)",
        transform: on ? "scale(1.04)" : "none"
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--spacing-4)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      fontWeight: 300,
      color: "var(--color-white)",
      textAlign: "center"
    }
  }, "You may not need to accept feeling this way."), /*#__PURE__*/React.createElement(HWButton, {
    primary: true,
    small: true,
    label: "Discover Your Wellness Path"
  })));
}
function HWButton({
  label,
  primary,
  small,
  tiny,
  large
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.openChimeAssessment && window.openChimeAssessment();
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-block",
      position: "relative",
      overflow: "hidden",
      background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
      color: primary ? hover ? "var(--text-on-primary)" : HW_SOLID : "var(--color-white)",
      backdropFilter: primary ? "none" : "blur(8px)",
      border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
      borderRadius: "var(--radius-4xl)",
      padding: tiny ? "var(--spacing-1) var(--spacing-3)" : small ? "var(--spacing-2) var(--spacing-5)" : large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)",
      fontSize: tiny ? "var(--text-sm)" : large ? "var(--text-lg)" : "var(--text-base)",
      fontWeight: "var(--font-weight-semibold)",
      textDecoration: "none",
      whiteSpace: "nowrap",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-3px) scale(1.04)" : "none",
      transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "#D9A62E",
      transform: hover ? "scaleX(1)" : "scaleX(0)",
      transformOrigin: "left center",
      transition: "transform 0.35s var(--ease-in-out)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, label));
}
Object.assign(window, {
  ChimeWellnessSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/WellnessSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/homepage/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.frame{position:absolute;inset:0;overflow:hidden}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(0,0,0,.12);border-top-color:rgba(0,0,0,.45);' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/homepage/image-slot.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
