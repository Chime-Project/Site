# Chime Health — 1 / 3 / 6-month plan landing (Version A)

Chime-brand sibling of `amerilean-plans-landing/`, the same way
`glp1-plan-landing/` is the sibling of `amerilean-landing/`. Same structure,
same plan selector and CRO changes; `css/chime-theme.css` loads after the kit
CSS and restates the palette tokens with the Chime ramps (blue / sand / peach on
cream, Quicksand). Every button is a blank stub.

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then open http://localhost:8791/chime-plans-landing/

## What is Chime-specific here

- Logos (`logo-slate.png`, `logo-white.png`), Chime vials
  (`semaglutide.webp`, `tirzepatide.webp`), and the hero order of the existing
  Chime landing (h1 first, pill and kicker below).
- Hero: restyled in the Chime site's bento language (`css/chime-hero.css`):
  cream canvas and masthead, blue tile for the message with a white offer
  card and white pill CTA, trust chips, photo tile on a soft blue gradient.
  The before/after photos are the same as the AmeriLean landing
  (`model-before.jpg`, `model-after.jpg`).
- Rating and volume figures are the ones the existing Chime landing uses
  ("4.9 • 2,000+ reviews", "1000's of patients treated every month"). They are
  stand-ins there too; replace before launch.
- Testimonials: Sarah M., David S. and Nicole B. from the existing Chime
  landing, quotes cut to two sentences.
- Copy says Chime Health throughout, including the fine print and the
  comparison table.

## Prices

Identical to the AmeriLean version (semaglutide $112/mo and tirzepatide
$139/mo effective on the 3-month plan; every 4th month free on 3- and 6-month
plans). `ui_kits/shared/data/products.js` notes that Chime's own GLP-1 numbers
have not landed yet, so these are borrowed until they do.

## Everything else

See `../amerilean-plans-landing/README.md` for the selector, the CRO pass and
what is out of scope.
