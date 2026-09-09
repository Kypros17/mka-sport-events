/**
 * MKA sport Events — single source of truth for site-wide values.
 *
 * SITE URL
 * --------
 * The production domain has not been confirmed yet. `siteUrl` below is the ONE
 * place it lives: change it here and every canonical link, Open Graph URL,
 * hreflang alternate, JSON-LD @id, sitemap entry and robots.txt reference is
 * regenerated on the next build.
 *
 * Until the real domain is supplied it is set to a `.invalid` host, which is a
 * reserved top-level domain that can never resolve. That keeps the placeholder
 * unmistakable without inventing a domain.
 */
export const siteUrl = "https://mka-sport-events.invalid";

/** Official brand presentation. Use this string everywhere; never vary the casing. */
export const brandName = "MKA sport Events";

/** Confirmed contact details (see CLAUDE.md). */
export const contact = {
  email: "mka.sport.cyp@gmail.com",
  phones: [
    { display: "+357 96 940622", e164: "+35796940622" },
    { display: "+357 99 513619", e164: "+35799513619" },
  ],
  /** WhatsApp number in international format without "+", as wa.me expects. */
  whatsapp: "35796940622",
  address: {
    street: "Chilis 28",
    city: "Nicosia",
    country: "Cyprus",
    countryCode: "CY",
  },
  social: {
    instagram: "https://instagram.com/mizunocyprus",
    tiktok: "https://tiktok.com/@mizunocyprus",
  },
  /** Cyprus Sports Organisation (KOA) public register of sports venues. */
  koaSportMap: "https://cso.org.cy/sport-map/",
};

/**
 * Analytics: no provider is configured. When one is chosen, set `provider`
 * and load its script from BaseLayout. CTA elements already carry
 * `data-track` attributes and `src/scripts/track.js` forwards clicks to
 * `window.mkaTrack(eventName, detail)` if that function exists.
 */
export const analytics = {
  provider: null,
};
