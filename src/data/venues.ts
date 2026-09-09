/**
 * Venues used for camps and events.
 *
 * This list is intentionally EMPTY. The previous site carried six placeholder
 * venues with invented names, which must never be published as real. When the
 * client confirms real venues, add them here and the Facilities page will
 * render a venue grid automatically (it stays hidden while the list is empty).
 *
 * Each entry needs a real name, city, a short factual description and, ideally,
 * a photo placed in src/assets/images/venues/. Keep the text in both languages.
 */
import type { ImageMetadata } from "astro";

export type VenueCity = "Nicosia" | "Limassol" | "Larnaca" | "Paphos" | "Agia Napa" | "Famagusta area";

export interface Venue {
  /** Stable id, used as the DOM key. */
  id: string;
  name: string;
  city: VenueCity;
  /** Short factual description per locale. */
  description: { en: string; ru: string };
  /** What the venue is used for, per locale, e.g. ["Football", "Sambo"]. */
  sports: { en: string[]; ru: string[] };
  /** Optional photo imported from src/assets/images/venues/. */
  image?: ImageMetadata;
  /** Optional alt text per locale, required when `image` is set. */
  imageAlt?: { en: string; ru: string };
}

export const venues: Venue[] = [];
