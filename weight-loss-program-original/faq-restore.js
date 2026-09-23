/* The saved page ships its FAQ section in the server-rendered HTML, but the
   app re-renders the page after load and the FAQ module needs a chunk from the
   source's CDN that this copy does not have, so the section disappears about
   3s in. This keeps the original markup: it snapshots the section before the
   app boots, puts it back after the reviews section whenever it goes missing,
   and drives the accordion the way the original CSS expects
   (.accordion__panel[data-expanded=true]). */
(function () {
  var SEL = '[data-testid^="faq-module"]';
  var mod = document.querySelector(SEL);
  if (!mod) return;
  var section = mod.closest('section');
  var saved = section.outerHTML;

  function anchor() {
    var hs = document.querySelectorAll('h2');
    for (var i = 0; i < hs.length; i++) {
      if (/Verified reviews/i.test(hs[i].textContent)) {
        var s = hs[i].closest('section');
        while (s && s.parentElement && s.parentElement.closest('section')) s = s.parentElement.closest('section');
        return s;
      }
    }
    return null;
  }

  function wire(root) {
    var items = root.querySelectorAll('.accordion__item');
    for (var i = 0; i < items.length; i++) (function (item, i) {
      var trig = item.querySelector('.accordion__trigger');
      var panel = item.querySelector('.accordion__panel');
      if (!trig || !panel) return;
      panel.id = 'faq-panel-' + i;
      trig.setAttribute('aria-controls', panel.id);
      function toggle() {
        var open = trig.getAttribute('aria-expanded') !== 'true';
        trig.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.setAttribute('data-expanded', open ? 'true' : 'false');
        var use = trig.querySelector('use');
        if (use) use.setAttribute('xlink:href', open ? '#md--material-remove' : '#md--material-add');
      }
      trig.addEventListener('click', toggle);
      trig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    })(items[i], i);
  }

  function restore() {
    if (document.querySelector(SEL)) return;
    var a = anchor();
    if (!a) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = saved;
    var el = tmp.firstElementChild;
    el.setAttribute('data-faq-restored', '');
    a.parentNode.insertBefore(el, a.nextSibling);
    wire(el);
  }

  // Wire the server-rendered copy too, in case the app leaves it in place.
  wire(section);
  new MutationObserver(restore).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', restore);
  [2000, 4000, 8000].forEach(function (ms) { setTimeout(restore, ms); });
})();
