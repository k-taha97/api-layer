import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'
import { dehydrate, hydrate, VueQueryPlugin } from '@tanstack/vue-query'
import { defineNuxtPlugin, useState } from 'nuxt/app'
import { queryClient } from '../utils'

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>('vueQuery')

  const options: VueQueryPluginOptions = { queryClient }

  nuxt.vueApp.use(VueQueryPlugin, options)

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
})
