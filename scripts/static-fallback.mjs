// After the build, dist/client is a plain static folder ready to deploy.
// We copy the home page HTML to 404.html so hosts that serve a fallback file
// (Netlify, GitHub Pages, Cloudflare Pages, S3...) can still handle routes
// that were not prerendered, such as individual news articles.
import { copyFile, access } from "node:fs/promises";

const dir = "dist/client";

try {
  await access(`${dir}/index.html`);
  await copyFile(`${dir}/index.html`, `${dir}/404.html`);
  console.log("[static] dist/client/404.html written (SPA fallback)");
} catch {
  console.log("[static] no dist/client/index.html, skipping fallback");
}
