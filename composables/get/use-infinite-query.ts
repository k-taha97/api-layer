import type { IGenericObject } from '../../utils'
import type { IGetProps } from './use-get'

import { useInfiniteQuery as _useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'

import { computed } from 'vue'
import { useApiManager } from '../use-api-manager'
import { fetcher } from './fetcher'

export function useInfiniteQuery({ url, config, params, requestType = 'api', dataParamName = 'data', accessToken, limit = 10 }: IGetProps) {
  const baseUrl = useApiManager(requestType)

  const fullURL = `${baseUrl}/api/${url}`

  const queryClient = useQueryClient()

  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage, refetch } = _useInfiniteQuery({
    queryKey: [fullURL, params],
    queryFn: async ({ pageParam }) => {
      const result: { [key: string]: unknown } = await fetcher({ client: queryClient, queryKey: [fullURL, { ...params?.value, page: pageParam + 1, size: limit }], meta: { accessToken } })
      return {
        data: result?.[dataParamName] as Array<object>,
        total: result?.count as number,
        lastPage: pageParam + 1,
      }
    },
    getNextPageParam: (pageParams) => {
      const totalPages = Math.ceil(pageParams.total / limit)
      if (pageParams.lastPage === totalPages)
        return undefined

      return (pageParams.lastPage) > totalPages ? totalPages : pageParams.lastPage
    },
    initialPageParam: 0,
    meta: { accessToken },
    enabled: !!accessToken,
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
