// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { siteUrl } from "./site.config.mjs";

export default defineConfig({
  // The production URL is configured ONCE in site.config.mjs.
  site: siteUrl,
  // Clean directory URLs (/about/ -> /about/index.html) so the static build
  // works on ordinary shared hosting without rewrite rules.
  trailingSlash: "always",
  build: {
    format: "directory",
    assets: "assets",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", ru: "ru" },
      },
    }),
  ],
});
