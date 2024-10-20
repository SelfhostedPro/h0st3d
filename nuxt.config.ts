import { join } from 'pathe'
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
    clientNodeCompat: true,
    componentIslands: true
  },

  nitro: {
    experimental: {
      openAPI: true,
      websocket: true,
    },
    routeRules: {
      '/data/plugins/**': { static: true },
    },
  },

  vue: {
    runtimeCompiler: true
  },
  vite: {
    optimizeDeps: {
      include: ['unenv/runtime/npm/node-fetch']
    },
    resolve: {
      alias: {
        'node-fetch-native': 'unenv/runtime/npm/node-fetch',
        'node-fetch-native/proxy': 'unenv/runtime/npm/node-fetch'
      }
    },
    server: {
      fs: {
        allow: [
          // Allow serving files from one level up to the project root
          '..',
          // Allow serving files from the data/plugins directory
          join(process.cwd(), 'data/plugins')
        ],
      }
    }
  },

  modules: ['@nuxt/eslint']
})