<script setup lang="ts">
import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'

import { PrimeImage } from '@layers/primevue/components/image'
import { Paragraph } from '@layers/primevue/components/paragraph'
import { useRoute } from 'vue-router'

import noData from '/images/no-data.png'

const props = defineProps<Props>()

type PaginationType = 'simple' | 'pages'

interface Props {
  endpoint: string
  pagination: PaginationType
  dataParamName?: string
  disabled?: boolean
  ignoredParams?: string[]
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}

const { value: { endpoint, pagination, dataParamName = 'data', disabled, config, ignoredParams } } = toRef(props)

const router = useRoute()
const queries = ref(router.query)

watchEffect(() => {
  if (ignoredParams) {
    const _queries: IGenericObject = {}

    for (const key in queries.value) {
      if (!ignoredParams.includes(key)) {
        _queries[key] = queries.value[key]
      }
    }

    queries.value = _queries

    return
  }
  queries.value = router.query
})

const { result, fetchNextPage, isLoading: isSimplePaginationLoading, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
  url: endpoint,
  dataParamName,
  params: queries,
  config: {
    enabled: pagination === 'simple' && !disabled,
    ...config,
  },
})

const { data, isLoading, error, refetch } = useGet({
  url: endpoint,
  dataParamName,
  params: queries,
  config: {
    enabled: pagination === 'pages' && !disabled,
    ...config,
  },
})

const isFetching = computed(() => {
  return isSimplePaginationLoading.value || isLoading.value
})

const _data: Ref<IGenericObject> = computed(() => pagination === 'simple' ? result : data)

const isRenderData = computed(() => {
  if (pagination === 'simple')
    return !isFetching.value && result?.value && result.value.length > 0

  return !isFetching.value && !error.value?.message
})
</script>

<template>
  <div
    v-if="error"
    class="mt-12 p-10 text-center border border-gray-200 rounded-md flex flex-col gap-4 h-fit items-center justify-center"
  >
    <PrimeImage :src="noData" alt="Error" image-class="rounded-md h-52 w-52" class="rounded-md h-52 w-52 object-contain drop-shadow-md" />
    <Paragraph class="text-xl text-red-500 font-bold">
      {{ (error as IGenericObject)?.response?.data?.[0]?.description || 'Something went wrong!' }}
    </Paragraph>
  </div>

  <template v-if="isFetching && !(error as IGenericObject)?.response">
    <slot name="loader" />
  </template>

  <slot
    v-if="isRenderData" :data="_data.value" :actions="{
      fetchNextPage, isLoading: isFetching || isFetchingNextPage, hasNextPage, refetch,
    }"
  />
</template>
