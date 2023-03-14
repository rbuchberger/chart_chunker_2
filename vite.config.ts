import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: "robert-buchberger",
      project: "chunker",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      include: ["./dist"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
