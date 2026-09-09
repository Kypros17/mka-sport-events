import { contact } from "../../site.config.mjs";
import { getDictionary, type Locale } from "@/i18n";

/** WhatsApp click-to-chat with a prepared message in the visitor's language. */
export function whatsappLink(locale: Locale, message?: string): string {
  const text = message ?? getDictionary(locale).common.whatsappMessage;
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telLink(e164: string): string {
  return `tel:${e164}`;
}

export function mailLink(subject?: string): string {
  const base = `mailto:${contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** A Google Maps search for the office address: a link, not an embed. */
export function mapsLink(): string {
  const q = `${contact.address.street}, ${contact.address.city}, ${contact.address.country}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
