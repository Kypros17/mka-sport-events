/**
 * Generates the brand mark and favicon set from the client's logo artwork.
 * Run with `npm run icons`. The original images/logo.png is never modified.
 *
 * Outputs:
 *   src/assets/images/logo-mark.png   logo with its black export frame trimmed
 *   public/favicon-16.png, favicon-32.png, apple-touch-icon.png (180),
 *   public/icon-192.png, icon-512.png
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "images/logo.png";
await mkdir("public", { recursive: true });
await mkdir("src/assets/images", { recursive: true });

// Trim the near-black border. `trim` uses the top-left pixel as the reference
// colour; the threshold keeps the turquoise square with its rounded corners.
const trimmed = sharp(SRC).trim({ threshold: 40 });
const meta = await trimmed.clone().toBuffer({ resolveWithObject: true });
console.log(`trimmed logo: ${meta.info.width}×${meta.info.height}`);

// Square it on a transparent canvas so it sits cleanly as an icon.
const side = Math.max(meta.info.width, meta.info.height);
const squared = await sharp(meta.data)
  .extend({
    top: Math.floor((side - meta.info.height) / 2),
    bottom: Math.ceil((side - meta.info.height) / 2),
    left: Math.floor((side - meta.info.width) / 2),
    right: Math.ceil((side - meta.info.width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await sharp(squared).resize(256, 256).png().toFile("src/assets/images/logo-mark.png");

const sizes = [
  ["public/favicon-16.png", 16],
  ["public/favicon-32.png", 32],
  ["public/apple-touch-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
];
for (const [file, size] of sizes) {
  await sharp(squared).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}
