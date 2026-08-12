# MKA sport Events — Project Brief

Permanent brief for this repository. Read and follow it in every session.

## The business

MKA sport Events is a **Cyprus-based** sports company operating out of **Nicosia**. This
repository is its business website — a marketing and enquiry site, not an e-commerce platform.

Four services, each with its own page:

1. **Sports training camps** (`camps.html`) — training camps hosted in Cyprus for a variety of
   sports, not only combat sports.
2. **International sports events** (`events.html`) — organising major international
   competitions, mostly **sambo**, including World and European Championships.
3. **Combat sports mat rental** (`mat-rental.html`) — renting competition-grade mats for
   **judo, sambo and jiu-jitsu**.
4. **Sports equipment** (`shop.html`) — official **Mizuno** retailer. The real online store
   already exists at **mkasport.com**. This site only showcases products and links out to that
   store; **there is no checkout, cart or payment flow here, and none should be added.**

## Tone and content rules

- Always position the company as **Cyprus-based**. Never use "worldwide", "global" or similar
  framing.
- Sambo is the specialism for events; camps and equipment are broader.
- Contact enquiries go to `mkasport.cyp@gmail.com`. The contact form has no backend — it
  validates client-side and opens the visitor's own email app via a `mailto:` link. Keep it
  that way unless the hosting gains a server-side handler.
- **No "worldwide", "global" or international-reach claims about the company.** Naming the
  championships actually organised (World and European Sambo Championships) is fine — they are
  event titles, not a claim that MKA operates outside Cyprus. Anything describing the company's
  own reach must stay Cyprus-based.
- The main call to action everywhere is **"Request an Offer"** (`.btn--primary.btn--offer`)
  linking to `contact.html` — in every page hero and every `.cta-band`.

## Tech rules

- **Plain HTML, CSS and vanilla JavaScript only.** No frameworks, no build step, no npm, no
  bundler, no external JS dependencies.
- **Static files for shared hosting.** Every page is a standalone `.html` file at the repo
  root; all paths are relative so the site works from any directory.
- **One shared stylesheet: `css/style.css`.** Do not create additional CSS files and do not add
  `<style>` blocks or inline `style=` attributes to pages. New styling goes into the shared
  sheet, reusing the design tokens defined in `:root` at the top of the file (`--navy`,
  `--red`, `--teal`, `--radius`, `--font-heading`, etc.).
- **Two shared scripts, both loaded on every page in this order:** `js/i18n.js` (data only —
  the Russian dictionary) then `js/main.js` (all behaviour, an IIFE in `"use strict"` mode).
  Behaviour is feature-detected (`if (element)`) so one file can serve every page.
- **Fully mobile-responsive.** Mobile-first; verify layouts hold at narrow widths. The header
  collapses into the `#nav-toggle` hamburger menu at ≤1100px (earlier than usual — seven nav
  items plus the chat buttons need the room), and the logo wordmark hides at ≤480px.
- **Consistent header and footer on every page.** There is no templating, so the markup is
  duplicated by hand — when the header or footer changes, apply the identical change to
  **all seven** pages: `index.html`, `camps.html`, `events.html`, `coaches.html`,
  `mat-rental.html`, `shop.html`, `contact.html`.
- Keep the existing accessibility work: skip link, `aria-label`/`aria-expanded`/`aria-current`
  on navigation, `aria-pressed` on filter buttons, meaningful alt text.
- Images are hand-written **SVG** files in `images/`. Prefer adding SVGs over binary assets.

## Repository layout

```
index.html        Home — hero, stats strip, services overview
camps.html        Training camps
events.html       Sports event / championship organisation
coaches.html      Coaching team (placeholder profiles)
mat-rental.html   Judo, sambo & jiu-jitsu mat rental
shop.html         Sports equipment showcase (filterable product grid)
contact.html      Contact details + validated enquiry form
css/style.css     The single shared stylesheet (design tokens in :root)
js/i18n.js        English → Russian dictionary (data only)
js/main.js        The shared behaviour script
images/*.svg      All artwork, including favicon.svg
```

`js/main.js` provides: the language switch, mobile nav toggle, footer year injection (`#year`),
reveal-on-scroll via `IntersectionObserver`, the shop category filter, and contact form
validation + `mailto:` submit.

## Bilingual site (English / Russian)

The header carries an EN/RU switch. English is the source language and lives in the HTML;
Russian lives only in `js/i18n.js`.

- Keys in `js/i18n.js` are the **exact English strings**, whitespace-collapsed and trimmed.
  `main.js` normalises the same way, so a key matches a text node, a translatable attribute
  (`alt`, `title`, `placeholder`, `aria-label`) or the page `<title>`, regardless of line wraps.
- **Whenever you add or change any visible English text, add or update its key in
  `js/i18n.js`.** Anything without a key silently stays English.
- Text split by inline markup arrives as separate text nodes, so each fragment needs its own
  key (e.g. `"Where champions"`, `"train, compete"`, `"and gear up"`) and the Russian
  fragments must read correctly when joined.
- Deliberately untranslated: brand names, the address, phone numbers, the email address, size
  codes, and text baked into the SVG artwork.
- The choice is stored in `localStorage` under `mka-lang` and re-applied on every page. It also
  sets `<html lang>`. Note `localStorage` is blocked on `file://` — test over http.

## Real contact details

These are confirmed — use them everywhere, never invent alternatives:

- **Email:** mkasport.cyp@gmail.com (also the `mailto:` target in `js/main.js`)
- **Phones:** +357 96 940622 and +357 99 513619 (both shown, both linked as `tel:`)
- **Address:** Chilis 28, Nicosia, Cyprus
- **Instagram:** https://instagram.com/mizunocyprus
- **TikTok:** https://tiktok.com/@mizunocyprus
- **Online store:** https://mkasport.com/ — always `target="_blank" rel="noopener"`
- **WhatsApp:** https://wa.me/35796940622 — the one-touch chat button in every header

## Known gaps / placeholders

Treat these as unfinished, not as facts to preserve:

- **Telegram is a placeholder:** every header links to `https://t.me/PLACEHOLDER`, marked in the
  markup by an HTML comment and in the UI by its `title`/`aria-label`. Replace the username in
  all seven headers once the real one is supplied, and drop the "(placeholder…)" wording from
  the labels and from `js/i18n.js`.
- **The four coach profiles on `coaches.html` are placeholders** — names, photos (all use
  `images/coach-placeholder.svg`), disciplines and biographies. Each card carries a
  "Placeholder profile" badge and the page carries a placeholder notice.
- The homepage stats (15+ years, 4,000+ athletes, 25+ events, 1,200 m² of mats) are
  placeholders pending confirmed figures.
- Product descriptions on `shop.html` are illustrative. **Never invent prices** — the page is a
  showcase; every card says "Contact us to order" and real prices live at mkasport.com.
- Office hours on `contact.html` (Mon–Fri 09:00–18:00 EET) are unconfirmed.

## Workflow

After completing any task, **commit to git with a clear message and push to `origin main`**
(`https://github.com/Kypros17/mka-sport-events.git`). Do this as part of finishing the task,
without waiting to be asked again.
