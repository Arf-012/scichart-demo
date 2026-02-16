import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "Logo.png",
      ],
      workbox: {
        sourcemap: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "SciChart Demo PWA",
        short_name: "SciChartPWA",
        description: "SciChart Demo App with PWA capabilities",
        theme_color: "#ffffff",
        icons: [
          {
            src: "Logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "Logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    open: true,
    allowedHosts: true,
  },
});
