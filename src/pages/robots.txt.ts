import type { APIRoute } from "astro";
import { siteUrl } from "../../site.config.mjs";

/** robots.txt generated at build time so the sitemap URL follows site.config.mjs. */
export const GET: APIRoute = () => {
  const body = [
    "# MKA sport Events",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap-index.xml", siteUrl).href}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
