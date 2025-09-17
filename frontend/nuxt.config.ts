// https://nuxt.com/docs/api/configuration/nuxt-config
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
  ssr: false,
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3005/api",
        changeOrigin: true,
      },
    },
  },
  pages: true,
  compatibilityDate: "2025-01-17",
});
