import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// When deployed statically (e.g. GitHub Pages), the API lives on a
// different origin. VITE_API_BASE_URL is injected at build time
// (see .github/workflows/gh-pages.yml) and prepended to every
// relative "/api/..." request. On Vercel, frontend and API share
// an origin, so this stays unset and requests remain relative.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
if (apiBaseUrl) {
  setBaseUrl(apiBaseUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
