# chime-price-lock-offer

A one-screen GLP-1 "price lock" offer page. It is a clone of `trimrx.com/glp1/offer-v50` (as opened from the
client's `?catalog=price-lock` link) with the branding switched to Chime Health (client, 2026-09-23). Luis's
rule for this clone: change only what the client asked for (logo and branding), keep everything else the
same, and ask before any other change. The navy, red and flag are the reference's own, on purpose.

| File | What it is |
|---|---|
| `index.html` | The reference's server-rendered Framer markup, with the classes untouched. It holds both breakpoints (≥1200px and phone/tablet), and CSS picks one |
| `css/offer.css` | The reference's own CSS, pruned with PurgeCSS, plus its button hover colours (Framer switched those by script). It holds no Chime styling |
| `js/offer-tests.js` | `node chime-price-lock-offer/js/offer-tests.js` |
| `images/`, `fonts/` | The reference's images as webp, plus Roboto Condensed and Inter (both OFL) |

The page runs no JavaScript. The phone-only pinned "Lock My Price Now" button is plain CSS.

**What changed (branding only):**
- the tab title and favicon
- every "Lock the Price" / "Lock My Price Now", now `../choose-treatment/v3.html`, the Gold product page (client, 2026-09-25; it was the assessment). It opens in a new tab, as theirs does
- "Safety Information", now `#`, since Chime has no such page yet
- their trackers are removed: FigPii, Everflow affiliate clicks, Framer events, Bing, GTM and the Trustpilot bootstrap

Their page has no logo, so none was added (Luis's pick).

**Kept exactly as the reference has it:**
- the copy, colours, flag and "State Licensed Pharmacy" seal
- the 0–250 "limited time" bar
- the unbranded vials
- GLP-1 + GIP at **$279 a month**, what the price-lock link shows (their page's built-in default is $249)

**Price (client, 2026-09-25, "price lock to Gold product and checkout.docx"):** GLP-1 is **$179 a month** (the link showed
$174). Both prices now match the monthly plans on the Gold product page the buttons open.

The page is rebuilt by `build.py`, kept untracked in `uploads/price-lock-offer-ref/`, from the saved reference
`raw.html` in that same folder. The folder also holds the screenshots and image originals. It must never be committed.
