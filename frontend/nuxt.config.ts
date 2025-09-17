export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: false,
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3005/api",
    },
  },
  ssr: false, // SPA mode
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3000/api",
        changeOrigin: true,
      },
    },
  },
  // Явно включите автоматическое создание роутов
  pages: true,
  compatibilityDate: "2025-01-17",
});
