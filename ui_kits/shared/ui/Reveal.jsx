// Chime Health — shared scroll-reveal wrapper.
// Pure-CSS scroll-driven animation via the `.reveal` class (each page's <style>
// defines it with animation-timeline: view()). `delay` is accepted for API
// compatibility with older call-sites; `className` merges extra classes.
function Reveal({ children, delay, style, className }) {
  const cls = className ? "reveal " + className : "reveal";
  return <div className={cls} style={style}>{children}</div>;
}

Object.assign(window, { Reveal });
