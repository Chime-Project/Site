/* Browser check (CLAUDE.md 4c "no text over titles"): run in a page, returns every text node that ends within 60 px
   above a visible h1-h3 and overlaps it horizontally, inside the same section. The header bar and the ticker are not
   labels and are skipped. Also returns the page width check (no sideways scroll). Used by the verification walk:
   agent-browser eval "$(cat js/layout-check.js); u10LayoutCheck()". */
function u10LayoutCheck() {
  var out = [], hs = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3'));
  function vis(el) { var r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; }
  function block(el) { return el.closest('section, article, li, header, nav, footer, main > div, [role=dialog]') || document.body; }
  hs.filter(vis).forEach(function (h) {
    var hr = h.getBoundingClientRect(), hb = block(h);
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue.trim() || h.contains(n)) continue;
      var p = n.parentElement; if (!p || !vis(p) || p.closest('nav, .u10-ticker, template, script, style')) continue;
      if (block(p) !== hb && !hb.contains(p)) continue;
      var rg = document.createRange(); rg.selectNodeContents(n); var rr = rg.getBoundingClientRect();
      if (!rr.width) continue;
      var gap = hr.top - rr.bottom;
      if (gap >= -1 && gap < 60 && rr.right > hr.left && rr.left < hr.right) out.push({ heading: h.textContent.trim().slice(0, 50), label: n.nodeValue.trim().slice(0, 50), gap: Math.round(gap) });
    }
  });
  return JSON.stringify({ violations: out, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth });
}
if (typeof module !== 'undefined' && module.exports) module.exports = u10LayoutCheck;
