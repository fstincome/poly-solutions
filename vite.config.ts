// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The build is fully static: `npm run build` emits dist/client, deployable as a
// plain folder on Vercel (Output Directory = dist/client) or any static host.



export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Public pages are rendered to static HTML at build time so the site can be
    // deployed as a plain folder of files (no server runtime required).
    pages: [
      { path: "/" },
      { path: "/a-propos" },
      { path: "/services" },
      { path: "/realisations" },
      { path: "/partenaires" },
      { path: "/equipe" },
      { path: "/actualites" },
      { path: "/contact" },
      { path: "/auth" },
    ],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
  // Nitro auto-detects CI providers (Vercel) and would emit .vercel/output.
  // Pin the static preset so every environment emits the same dist/client folder.
  nitro: { preset: "static" },
});

