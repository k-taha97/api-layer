import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = dirname(fileURLToPath(import.meta.url))
export default defineNuxtConfig({
  modules: [
    ['@nuxtjs/i18n', {
      lazy: true,
      langDir: 'locales',
      locales: [
        { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
        { code: 'it', iso: 'it-IT', name: 'Italiano', file: 'it.json' },
      ],
      strategy: 'no_prefix',
      defaultLocale: 'en',
    }],
  ],

  alias: {
    '@api': currentDir,
  },

  imports: {
    dirs: [
      join(currentDir, 'types/**'),
      join(currentDir, 'composables/**'),
      join(currentDir, 'utils/**'),
    ],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URI || 'https://api.default.com',
    },
  },
})
