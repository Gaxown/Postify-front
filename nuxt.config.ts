// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-06-28",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@vueuse/motion/nuxt",
    "@unocss/nuxt",
  ],

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    viewer: true,
  },

  unocss: {
    icons: true,
    presets: [
      // Import presets using dynamic imports instead of require
    ],
  },

  app: {
    head: {
      title: "Postify - Smart Social Media Scheduler",
      meta: [
        {
          name: "description",
          content:
            "Buffer-inspired social media scheduler with zero-click efficiency",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api",
    },
  },
});
