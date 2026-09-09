# MKA sport Events — website

Static marketing and enquiry site for MKA sport Events, a Cyprus-based sports
company in Nicosia: sports training camps, international sports events (sambo
speciality) and sports event organisation. Built with [Astro](https://astro.build)
and deployed as plain static files to ordinary shared hosting.

Business and content rules live in `CLAUDE.md`. Read it before changing copy.

## Requirements

- Node.js 20 or newer (the site was built with Node 24 LTS)
- npm

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server with hot reload at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run icons` | Regenerate the trimmed logo mark and favicon set from `images/logo.png` |

## Deploying to shared hosting

1. Set the real domain **once** in `site.config.mjs` (`siteUrl`). Every canonical
   URL, hreflang alternate, Open Graph URL, JSON-LD id, sitemap entry and
   robots.txt reference is generated from it.
2. `npm run build`
3. Upload the **contents** of `dist/` to the web root (`public_html` or similar).
   `dist/.htaccess` is included: it redirects the retired `.html` addresses to
   the new directory URLs, sets cache headers and enables compression.

URLs are directory-style (`/about/`, `/ru/about/`). Apache serves the
`index.html` in each directory without extra configuration.

## Project layout

```
site.config.mjs          Site URL, brand name, contact details, analytics switch
astro.config.mjs         Astro configuration (i18n routing, sitemap, clean URLs)
src/
  i18n/en.json, ru.json  ALL page copy, keyed by page and section
  i18n/index.ts          Locale helpers, route table, localePath()
  layouts/BaseLayout.astro   <head> metadata, hreflang, JSON-LD, header, footer
  components/            Reusable UI (Header, Footer, HomeHero, PageHero,
                         SectionHead, ServiceCards, FeatureGrid, FeatureSplit,
                         Steps, PhotoGallery, Faq, HostedEvents, CtaBand,
                         ContactChannels, ContactForm, MobileBar, Button, Icon)
  components/pages/      One template per page; rendered for both locales
  pages/                 Thin route files: /, /about/, /training-camps/, ...
  pages/ru/              The same routes under /ru/
  pages/robots.txt.ts    robots.txt generated from site.config.mjs
  data/venues.ts         Venue list for the Cyprus page (empty until confirmed)
  assets/images/         Source photographs, optimised at build time
  styles/global.css      Design tokens and shared primitives
  scripts/main.js        Mobile navigation, reveal-on-scroll, contact form
  scripts/track.js       CTA tracking hook (no provider configured)
public/                  Files copied verbatim: favicons, manifest, .htaccess
scripts/make-icons.mjs   Favicon / logo-mark generator
images/, css/, js/, *.html at the root: the RETIRED static site, kept until the
                         new build is approved (see "Old site" below)
```

## Editing copy

All visible text is in `src/i18n/en.json` and `src/i18n/ru.json`, using the same
keys in both files. Change the text there, not in the components. Both files
must keep identical structure; the build fails if a key used by a template is
missing.

## Adding real venues

Edit `src/data/venues.ts`. While the list is empty the Cyprus page shows a note
that venue details are supplied on request; once entries exist a venue grid is
rendered automatically.

## Analytics

No tracking script is loaded. Conversion elements carry `data-track` attributes
(`offer`, `whatsapp`, `phone`, `email`, `form`). When a provider is chosen, load
its snippet from `BaseLayout.astro`, define `window.mkaTrack(eventName, detail)`
and every click and form submission is forwarded automatically.

## Contact form

There is no backend. The form validates in the browser and opens the visitor's
email app with a prepared message (`mailto:`). A WhatsApp link next to the
button carries the same details. If the hosting gains a server-side handler,
replace the submit logic in `src/scripts/main.js`.

## Images and rights

See `ASSETS.md` for the list of photographs, their origin, and which ones still
need usage rights confirmed before launch.

## Old site

The original hand-written site (`*.html` at the repo root, `css/`, `js/`,
`images/*.svg`, `sitemap.xml`, `robots.txt`) is retired but still in the
repository. It is not part of the build. The git tag `baseline-pre-astro`
marks the last commit of the old site.
