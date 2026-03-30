import type { Ref } from 'vue'

import type { IGenericObject, ListDataProps } from '../../utils'
import { computed, ref, toRef, toRefs, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useGet } from './use-get'

import { useInfiniteQuery } from './use-infinite-query'

export function useListDataQuery(props: ListDataProps) {
  const propsRef = toRef(props)
  const { endpoint, pagination, dataParamName, disabled, config, ignoredParams } = toRefs(props)

  const router = useRoute()
  const queries = ref(router.query) as Ref<IGenericObject>

  watchEffect(() => {
    const ignored = ignoredParams?.value
    if (ignored && ignored.length > 0) {
      const _queries: IGenericObject = {}

      for (const key in queries.value) {
        if (!ignored.includes(key)) {
          _queries[key] = queries.value[key]
        }
      }

      queries.value = _queries
      return
    }

    queries.value = router.query
  })

  const resolvedDataParamName = computed(() => dataParamName?.value ?? 'data')

  const {
    result,
    fetchNextPage,
    isLoading: isSimplePaginationLoading,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    url: endpoint.value,
    dataParamName: resolvedDataParamName.value,
    params: queries,
    config: {
      enabled: pagination.value === 'simple' && !disabled?.value,
      ...(config?.value ?? {}),
    },
  })

  const { data, isLoading, error, refetch } = useGet({
    url: endpoint.value,
    dataParamName: resolvedDataParamName.value,
    params: queries,
    config: {
      enabled: pagination.value === 'pages' && !disabled?.value,
      ...(config?.value ?? {}),
    },
  })

  const isFetching = computed(() => {
    return isSimplePaginationLoading.value || isLoading.value
  })

  const listData = computed(() => pagination.value === 'simple' ? result : data)

  const isRenderData = computed(() => {
    if (pagination.value === 'simple')
      return !isFetching.value && result?.value && result.value.length > 0

    return !isFetching.value && !error.value?.message
  })

  return {
    props: propsRef,
    endpoint,
    pagination,
    dataParamName: resolvedDataParamName,
    disabled,
    ignoredParams,
    config,
    queries,
    data: listData,
    error,
    isFetching,
    isRenderData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  }
}
