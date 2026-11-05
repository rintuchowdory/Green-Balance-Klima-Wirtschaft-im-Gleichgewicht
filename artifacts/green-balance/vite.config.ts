import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { mkdirSync, writeFileSync } from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT ?? "5173";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";


/**
 * GitHub Pages kennt kein SPA-Routing: ein direkter Aufruf von /dashboard liefert 404.
 * Dieses Plugin schreibt beim Build eine 404.html, die den Pfad zwischenspeichert und
 * auf den App-Einstieg umleitet; index.html stellt den Pfad danach wieder her.
 */
function githubPagesFallback(basePath: string) {
  return {
    name: "gh-pages-spa-fallback",
    closeBundle() {
      const outDir = path.resolve(import.meta.dirname, "dist/public");
      const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Green Balance</title>
    <script>
      (function () {
        try {
          sessionStorage.setItem(
            "gb:redirect",
            location.pathname + location.search + location.hash
          );
        } catch (e) {}
        location.replace(location.origin + ${JSON.stringify(basePath)});
      })();
    </script>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 2rem">
    <p>Weiterleitung zur Startseite …</p>
  </body>
</html>
`;
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, "404.html"), html, "utf8");
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    githubPagesFallback(basePath),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
