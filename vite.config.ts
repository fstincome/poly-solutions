import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Static browser build only. TanStack Start's server plugin is intentionally
// not loaded here, so Vite never creates a Nitro/SSR environment.
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
    }),
    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
});