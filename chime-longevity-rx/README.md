# chime-longevity-rx

A microdose GLP-1 longevity landing page. It is a rip of `aureliushealthgroup.com/longevity-rx`, rebranded
to Chime Health (client, 2026-09-28: "rip just the landing page from here and rebrand for chime health").
Asana 1218949313169262. Rebranding follows the clone rule: change the brand, keep everything else, so the
team can study the page as it runs; the copy team rewrites it later.

| File | What it is |
|---|---|
| `index.html` | Their page: markup, inline CSS and the three inline scripts (scroll reveal, sticky offer bar, price count-up), verbatim apart from the swaps below |
| `images/` | Their photos, hero video and poster as served; `logo-nav.png` / `logo-footer.png` (Chime's logo in their 520x145 canvas); `microdose-vial.jpg` / `sb-vial.jpg` (their vial photo with the Chime logo on the label); the LegitScript seal; the Chime favicon |

**Changed (branding only):**
- the logos, header and footer
- the brand name in copy, alt text, the disclaimers and the copyright line
- the logo on the vial label (the pricing photo, and the sticky-bar thumbnail, which is a 200px copy of it)
- the LegitScript seal, now self-hosted and unlinked (their certificate is for their domain)
- the phone number, now a `1-XXX-XXX-XXXX` placeholder, and the support email, now support@chimehealth.com
- every CTA, now `../chimeAssessment.html`; "Home" → `../index.html`; the legal links → Chime's pages; "Articles" and "Read the full science" → `#` (no Chime page yet)
- title, favicon, `noindex`; their Blotout EdgeTag tracking removed

**Kept exactly as the reference has it:** colours, fonts, copy, the $89 first month / $199 a month pricing and
"Save 50%", the testimonials and avatars, the trial citations and disclaimers, the photos, the hero video, the USPS truck.

The page is rebuilt by scripts kept untracked in `uploads/longevity-rx-ref/`: `brand_art.py` (logos and the
vial repaint) then `build.py` (the page; every replacement is asserted). That folder also holds the captured
reference (`raw.html`, `assets/`). It must never be committed.
