/* CTA tracking hook.
 *
 * No analytics provider is configured (see site.config.mjs). Elements that
 * matter for conversion carry `data-track` values:
 *   offer     Request an Offer buttons
 *   whatsapp  WhatsApp click-to-chat links
 *   phone     tel: links
 *   email     mailto: links
 * plus the contact form fires "form_submit" from main.js.
 *
 * When a provider is chosen, define `window.mkaTrack(eventName, detail)` in
 * the provider's snippet (loaded from BaseLayout) and every click below is
 * forwarded to it. Nothing is collected until then.
 */
export function initTracking() {
  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-track]");
    if (!el || typeof window.mkaTrack !== "function") return;
    window.mkaTrack(el.dataset.track + "_click", {
      href: el.getAttribute("href") || null,
      text: (el.textContent || "").trim().slice(0, 60),
      path: window.location.pathname,
    });
  });
}
