import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from 'nuxt/kit'

const currentDir = dirname(fileURLToPath(import.meta.url))
const { resolve } = createResolver(import.meta.url)

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
      join(currentDir, 'composables/**'),
      join(currentDir, 'utils/**'),
    ],
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '#api-types': [resolve('./utils/types.ts')],
        },
      },
    },
  },

  hooks: {
    'vite:extendConfig': (viteConfig) => {
      viteConfig.resolve = viteConfig.resolve || {}
      viteConfig.resolve.alias = {
        ...viteConfig.resolve.alias,
        '#api-types': resolve('./utils/types.ts'),
      }
    },
  },

  // exports: {
  //   meta: true,
  // },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URI || 'https://api.default.com',
    },
  },
})
