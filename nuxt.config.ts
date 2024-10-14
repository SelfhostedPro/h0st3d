// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  experimental: {
    clientNodeCompat: true
  },
  nitro: {
    experimental: {
      openAPI: true,
      websocket: true,
    }
  },
  vue: {
    runtimeCompiler: true
  }
})
