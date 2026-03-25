<script setup lang="ts">
import { PrimeButton } from '@layers/primevue/components/buttons'
import { Loader, PrimeIcon } from '@layers/primevue/components/icons'
import { Paragraph } from '@layers/primevue/components/paragraph'

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
  idLabel: {
    type: String,
    default: 'id',
  },
  customId: {
    type: [String, null] as PropType<string | null>,
    default: null,
  },
  hideLoading: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
})

const { value: { endpoint, idLabel = 'id', customId = undefined, enabled } } = toRef(props)

const { params } = useRoute()

const id = customId === null ? '' : (params as IGenericObject)[idLabel] as string

const { data, isLoading, error, refetch } = useGetOne({
  url: endpoint,
  id,
  config: {
    enabled: enabled === false ? false : (enabled || !!id),
  },
})

const router = useRouter()

function goBack() {
  router.back()
}

provide('apiData', data)
provide('refetchApiData', refetch)
</script>

<template>
  <slot v-if="!error?.message && !isLoading || !enabled" :data="data || {}" />

  <div v-if="error?.message" class="mt-5 p-6 text-center border border-red-200 rounded-lg bg-red-50">
    <PrimeIcon name="pi pi-exclamation-triangle" class="text-4xl text-red-500 mb-4" />
    <Paragraph class="text-xl text-red-700 font-semibold mb-2">
      Oops! Something went wrong
    </Paragraph>
    <p class="text-gray-600 mb-6">
      We encountered an error while loading the data. Please try again or go back.
    </p>
    <div class="flex gap-4 justify-center">
      <PrimeButton class="base-btn" @click="refetch">
        Try Again
      </PrimeButton>
      <PrimeButton class="outline-btn" @click="goBack">
        Go Back
      </PrimeButton>
    </div>
  </div>

  <div
    v-if="!hideLoading && isLoading"
    class="mt-5 bg-white flex h-full min-h-[70dvh] w-full items-center justify-center"
  >
    <Loader />
  </div>
</template>
