# MKA sport Events — Project Brief

Permanent brief for this repository. Read and follow it in every session.

## The business

MKA sport Events is a **Cyprus-based** sports company operating out of **Nicosia**. This
repository is its business website — a marketing and enquiry site, not an e-commerce platform.

Three services:

1. **Sports training camps** (`/training-camps/`) — training camps hosted in Cyprus for a
   variety of sports, not only combat sports. The camp that has actually been run and
   photographed is a football camp; combat-sports camps (sambo, judo, wrestling, jiu-jitsu)
   are offered on the strength of the founder's sambo background.
2. **International sports events** (`/events/`) — supporting international competitions in
   Cyprus, mostly **sambo**.
3. **Sports event organisation** (also `/events/`) — organising and delivering sports
   events and tournaments in Cyprus.

**Removed services — do not reintroduce.** The site previously offered combat sports mat
rental and a sports equipment showcase (Mizuno/mkasport.com). Both were removed in August
2026 when the client refocused on the three services above. Do not re-add pages, nav items,
links or copy for them unless the client asks.

## Tone and content rules

- Always position the company as **Cyprus-based**. Never use "worldwide", "global" or similar
  framing.
- Sambo is the specialism for events; camps are broader.
- Contact enquiries go to `mka.sport.cyp@gmail.com`. The contact form has no backend — it
  validates client-side and opens the visitor's own email app via a `mailto:` link, with a
  WhatsApp link carrying the same details. Keep it that way unless the hosting gains a
  server-side handler, and never claim a server-side form exists.
- **No "worldwide", "global" or international-reach claims about the company.** Naming the
  championships hosted in Cyprus (World and European Sambo Championships) is fine — they are
  event titles, not a claim that MKA operates outside Cyprus. Anything describing the company's
  own reach must stay Cyprus-based. **Never claim or imply MKA organised the FIAS/ESF World or
  European championships** — they are cited only as events Cyprus has hosted, always paired
  with the disclaimer (the `HostedEvents` component), on the About page **and** the Events page.
- **Never invent** clients, partners, testimonials, venues, statistics, achievements or
  event-organising credits. If a figure or fact cannot be confirmed, leave it out.
- The only confirmed figures on the site: camp packages **from €80 per athlete per night, full
  board** at the four-star beachfront hotel base in **Agia Napa**, with the inclusions and
  on-request extras listed on the camps page (client-supplied, August 2026). "300+ days of
  sunshine" is a general Cyprus climate figure, not a company statistic.
- **One brand presentation: `MKA sport Events`** (lowercase "sport"). Never "MKA Sport Events",
  "MKA SPORTS" or "Sports Events Cyprus" in copy. The brand name is exported from
  `site.config.mjs`. The logo artwork itself reads "MKA SPORTS" and must not be altered.
- The main call to action everywhere is **"Request an Offer"** linking to the contact page —
  in every page hero, the header, the sticky mobile bar and every `CtaBand`.
- WhatsApp click-to-chat is the secondary action everywhere (header, mobile bar, CTA bands,
  contact page). Telegram has been removed; do not add it back without a real username.

## Tech rules

- **Astro static site.** Source in `src/`, production build in `dist/` (`npm run build`).
  `dist/` is what gets uploaded to ordinary shared hosting; it contains only static HTML,
  CSS, JavaScript, images and fonts plus an `.htaccess`.
- **No client-side framework.** No React or other UI runtime. The only browser JavaScript is
  `src/scripts/main.js` (mobile navigation, reveal-on-scroll, contact form) and
  `src/scripts/track.js` (CTA tracking hook). Behaviour is feature-detected so one bundle
  serves every page. Do not add client JavaScript without a genuine need.
- **Clean directory URLs, no `.html`:** `/`, `/about/`, `/training-camps/`, `/events/`,
  `/facilities/`, `/contact/`, and the Russian mirror under `/ru/`. Trailing slashes always.
  Old `.html` addresses are 301-redirected by `public/.htaccess`.
- **One site URL, configured once** in `site.config.mjs` (`siteUrl`). Canonical links,
  hreflang alternates, Open Graph URLs, JSON-LD ids, `sitemap-index.xml` and `robots.txt` are
  all generated from it. The production domain is still unconfirmed, so it is set to a
  reserved `.invalid` host. **Never hard-code a domain anywhere else and never invent one.**
- **Reusable components, no duplicated markup.** Header, footer, heroes, section heads,
  service panels, feature grids, steps, galleries, FAQ, CTA band, contact channels and form
  are components in `src/components/`. Each page is a template in `src/components/pages/`
  rendered by thin route files in `src/pages/` (EN) and `src/pages/ru/` (RU).
- **Styling:** design tokens and shared primitives live in `src/styles/global.css`
  (`--c-navy-*`, `--c-turq*`, `--c-red`, spacing, type scale, radii, shadows, motion).
  Component layout lives in each component's scoped `<style>`. Reuse the tokens; do not add
  new colours ad hoc. When a scoped style must reach an element rendered by a child component
  (for example an `<Icon>` SVG), use `:global(...)`.
- **Visual direction:** premium, athletic, editorial, image-led. Restrained radii (3–6px),
  thin rules instead of card boxes, asymmetric splits, full-bleed sections, subtle motion.
  Avoid rounded-card grids, heavy gradients, glassmorphism and repeated centred sections.
- **Fonts are self-hosted** via `@fontsource-variable/sofia-sans-condensed` (display) and
  `@fontsource-variable/manrope` (body), both with Cyrillic subsets. Do not load Google Fonts
  or any other third-party origin.
- **Images** go through `astro:assets` (`<Picture>`): AVIF/WebP with JPEG fallback,
  `srcset`/`sizes`, explicit width and height, `loading="lazy"` below the fold and
  `loading="eager" fetchpriority="high"` only for the hero image. Never upscale: cap `widths`
  at the source width. Source photographs live in `src/assets/images/`; see `ASSETS.md` for
  origin and rights status.
- **Mobile-first and accessible:** skip link, landmark labels, `aria-current`,
  `aria-expanded`/`aria-controls` on the menu toggle, Escape closes the menu and focus returns
  to the toggle, visible `:focus-visible` styles, 44px minimum touch targets,
  `prefers-reduced-motion` respected, descriptive alt text, native `<details>` FAQ, form
  errors tied to fields with `aria-describedby`/`aria-invalid`. Colour pairs in
  `global.css` meet WCAG AA; check any new pair.
- **Analytics:** none loaded. Conversion elements carry `data-track` (`offer`, `whatsapp`,
  `phone`, `email`, `form`); `track.js` forwards to `window.mkaTrack` if a provider defines
  it. Do not add tracking scripts or invent credentials.

## Repository layout

```
site.config.mjs            Site URL, brand name, contact details, analytics switch (single source)
astro.config.mjs           i18n routing (en default, ru prefixed), sitemap, directory URLs
src/i18n/en.json, ru.json  ALL page copy, structured by page and section (same keys in both)
src/i18n/index.ts          Locale helpers, route table, localePath()
src/layouts/BaseLayout.astro   <head> metadata, hreflang, JSON-LD, header, footer, mobile bar
src/components/            Reusable UI; src/components/pages/ holds one template per page
src/pages/, src/pages/ru/  Thin route files; src/pages/robots.txt.ts generates robots.txt
src/data/venues.ts         Venue list for the Cyprus page — EMPTY until real venues are confirmed
src/assets/images/         Source photographs and the trimmed logo mark
src/styles/global.css      Design tokens and shared primitives
src/scripts/               main.js (behaviour), track.js (analytics hook)
public/                    Favicons, site.webmanifest, .htaccess (copied verbatim)
scripts/make-icons.mjs     Generates logo-mark.png and the favicon set from images/logo.png
images/logo.png            The client's original logo artwork (never modified)
README.md, ASSETS.md       Build/deploy guide; image origin and rights register
```

Retired files from the original hand-written site (`*.html` at the root, `css/`, `js/`,
`images/*.svg`, `images/*.jpg`, `images/*.jpeg`, `images/favicon.png`, `sitemap.xml`,
`robots.txt`) may still be present until the client approves their removal. They are not
part of the build. The git tag `baseline-pre-astro` marks the last commit of the old site.

## Bilingual site (English / Russian)

English is the primary language and lives under the root; Russian is a full set of static
pages under `/ru/`, generated from the same templates. Every page links its counterpart with
`<link rel="alternate" hreflang>` (plus `x-default` → English) and the sitemap carries the
same pairs.

- **All copy lives in `src/i18n/en.json` and `src/i18n/ru.json`** with identical structure.
  Whenever you add or change visible text, change both files. Templates read the dictionary
  through `getDictionary(locale)`; nothing user-visible is hard-coded in components except
  brand names, phone numbers, the email address and the address, which are deliberately not
  translated.
- The language switch is a plain link to the same page in the other locale (header `RU`/`EN`
  button, the mobile menu and the footer). There is no JavaScript translation layer and no
  `localStorage` language preference.
- `<html lang>`, `og:locale` and hreflang codes come from `localeTags` in `src/i18n/index.ts`.

## Real contact details

These are confirmed — use them everywhere, never invent alternatives. They are defined once in
`site.config.mjs` and imported wherever needed:

- **Email:** mka.sport.cyp@gmail.com (also the `mailto:` target of the form)
- **Phones:** +357 96 940622 and +357 99 513619 (both shown, both linked as `tel:`)
- **Address:** Chilis 28, Nicosia, Cyprus
- **Instagram:** https://instagram.com/mizunocyprus
- **TikTok:** https://tiktok.com/@mizunocyprus
  (both handles are named after the client's Mizuno retail business, but they are the
  company's real social accounts — keep them despite the shop's removal from this site)
- **WhatsApp:** https://wa.me/35796940622 with a prepared message per language
  (`common.whatsappMessage` in the dictionaries) — header, mobile bar, CTA bands, contact page
- **Official KOA sport map:** https://cso.org.cy/sport-map/ — the Cyprus Sports Organisation's
  public register of sports venues, linked from the Cyprus page in a new tab

## Known gaps / open items

Treat these as unfinished, not as facts to preserve:

- **The production domain is unconfirmed.** `siteUrl` in `site.config.mjs` is a reserved
  `.invalid` host. Set the real domain there once and rebuild; nothing else needs to change.
- **Telegram has been removed** (the old link was a placeholder). Add it back only with a real
  username, in the header tools, mobile menu and footer.
- **No coach profiles and no named team members.** The About page uses an "Our approach"
  section instead. Do not add names or photos of staff until the client supplies them.
- **No venues.** `src/data/venues.ts` is empty; the Cyprus page explains that venue details
  are supplied on request and renders a venue grid automatically once entries exist. Never
  add placeholder venues.
- **No office hours** are shown (unconfirmed). The old "event handbook emergency number"
  line was removed as unverified.
- **No statistics** anywhere. The old stats strip (15+ years, 4,000+ athletes, 25+
  championships, 1,200 m² of mats) was invented; do not reintroduce any of those numbers.
- **Eight championship photographs carry the FIAS / sambo.sport watermark.** They are shown
  only with a visible credit and never as the home hero or default share image. Usage rights
  must be confirmed or the images replaced before launch — see `ASSETS.md`.
- **The banner in the camp photographs** reads "Sports events Cyprus training camp" with an
  older phone number and a mail.ru address. The copy does not repeat that branding; new
  photographs with current branding would resolve it.
- **The "reply within one working day" promise** appears on several pages and in the FAQ. It
  was on the client-approved site; confirm the client can honour it.
- **Analytics provider not chosen.** The tracking hook is in place; nothing is collected.

## Workflow

After completing any task, run `npm run build` to confirm the site still builds, then
**commit to git with a clear message and push to `origin main`**
(`https://github.com/Kypros17/mka-sport-events.git`). Do this as part of finishing the task,
without waiting to be asked again.
