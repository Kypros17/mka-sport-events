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
- Contact enquiries go to `info@mkasportevents.com`. The contact form has no backend — it
  validates client-side and opens the visitor's own email app via a `mailto:` link. Keep it
  that way unless the hosting gains a server-side handler.

## Tech rules

- **Plain HTML, CSS and vanilla JavaScript only.** No frameworks, no build step, no npm, no
  bundler, no external JS dependencies.
- **Static files for shared hosting.** Every page is a standalone `.html` file at the repo
  root; all paths are relative so the site works from any directory.
- **One shared stylesheet: `css/style.css`.** Do not create additional CSS files and do not add
  `<style>` blocks or inline `style=` attributes to pages. New styling goes into the shared
  sheet, reusing the design tokens defined in `:root` at the top of the file (`--navy`,
  `--red`, `--teal`, `--radius`, `--font-heading`, etc.).
- **One shared script: `js/main.js`**, an IIFE in `"use strict"` mode. All behaviour is
  feature-detected (`if (element)`) so the single file can be loaded on every page safely.
- **Fully mobile-responsive.** Mobile-first; verify layouts hold at narrow widths. The header
  collapses into the `#nav-toggle` hamburger menu.
- **Consistent header and footer on every page.** There is no templating, so the markup is
  duplicated by hand — when the header or footer changes, apply the identical change to
  **all** pages: `index.html`, `camps.html`, `events.html`, `mat-rental.html`, `shop.html`,
  `contact.html`.
- Keep the existing accessibility work: skip link, `aria-label`/`aria-expanded`/`aria-current`
  on navigation, `aria-pressed` on filter buttons, meaningful alt text.
- Images are hand-written **SVG** files in `images/`. Prefer adding SVGs over binary assets.

## Repository layout

```
index.html        Home — hero, stats strip, services overview
camps.html        Training camps
events.html       International events / championships
mat-rental.html   Judo, sambo & jiu-jitsu mat rental
shop.html         Sports equipment showcase (filterable product grid)
contact.html      Contact details + validated enquiry form
css/style.css     The single shared stylesheet (design tokens in :root)
js/main.js        The single shared script
images/*.svg      All artwork, including favicon.svg
```

`js/main.js` provides: mobile nav toggle, footer year injection (`#year`), reveal-on-scroll via
`IntersectionObserver`, the shop category filter, and contact form validation + `mailto:` submit.

## Known gaps / placeholders

Treat these as unfinished, not as facts to preserve:

- Contact details in the footers and on `contact.html` (12 Stadiou Street, 2571 Nisou; phone
  +357 99 123 456) are **placeholders** awaiting the real address and number.
- `shop.html` does **not yet** mention Mizuno or link out to **mkasport.com** — product cards
  currently point at `contact.html`. Wiring that up is expected work.
- The homepage stats (15+ years, 4,000+ athletes, 25+ events, 1,200 m² of mats) are
  placeholders pending confirmed figures.

## Workflow

After completing any task, **commit to git with a clear message and push to `origin main`**
(`https://github.com/Kypros17/mka-sport-events.git`). Do this as part of finishing the task,
without waiting to be asked again.
