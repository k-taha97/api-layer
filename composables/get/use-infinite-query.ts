import type { IGetProps } from './use-get'

import { useInfiniteQuery as _useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'

import { useAuthStore } from '@/store/auth'
import { fetcher } from './fetcher'

export function useInfiniteQuery({ url, config, params, requestType = 'api', dataParamName = 'data' }: IGetProps) {
  const baseUrl = useApiManager(requestType)

  const store = useAuthStore()

  const { accessToken } = storeToRefs(store)

  const fullURL = `${baseUrl}/api/${url}`

  const queryClient = useQueryClient()

  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage, refetch } = _useInfiniteQuery({
    queryKey: [fullURL, params],
    queryFn: async ({ pageParam }) => {
      const result: { [key: string]: unknown } = await fetcher({ client: queryClient, queryKey: [fullURL, { ...params?.value, page: pageParam + 1, size: LIMIT }], meta: { accessToken: accessToken.value } })
      return {
        data: result?.[dataParamName] as Array<object>,
        total: result?.count as number,
        lastPage: pageParam + 1,
      }
    },
    getNextPageParam: (pageParams) => {
      const totalPages = Math.ceil(pageParams.total / LIMIT)
      if (pageParams.lastPage === totalPages)
        return undefined

      return (pageParams.lastPage) > totalPages ? totalPages : pageParams.lastPage
    },
    initialPageParam: 0,
    meta: { accessToken },
    enabled: !!accessToken.value,
    ...config,
  })

  const result = computed(() => data?.value?.pages.reduce((prevValue: Array<unknown>, currentValue: IGenericObject) => {
    return [...prevValue, ...currentValue?.data || []]
  }, []))

  return {
    hasNextPage,
    result,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  }
}
