import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const sheetUrl = env.VITE_SHEET_API_URL;
  // Apps Script CORS'dan qochish uchun dev proxy: /sheet-api → real Apps Script URL.
  // Vite (Node) redirect'ni kuzatadi, brauzer esa same-origin so'rov yuboradi.
  const sheet = sheetUrl ? new URL(sheetUrl) : null;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: sheet
      ? {
          proxy: {
            "/sheet-api": {
              target: sheet.origin,
              changeOrigin: true,
              followRedirects: true,
              rewrite: (path) => path.replace(/^\/sheet-api/, sheet.pathname),
            },
          },
        }
      : undefined,
  };
});
