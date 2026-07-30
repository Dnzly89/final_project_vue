export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap"
        }
      ]
    }
  },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      apiBase: "https://cinemaguide.skillbox.cc"
    }
  },
   nitro: {
    preset: "netlify"
  }
})