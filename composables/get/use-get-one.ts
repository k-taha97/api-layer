import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'

import { useAuthStore } from '@/store/auth'
import { fetcher } from './fetcher'

interface Props {
  url: string
  id: string
  requestType?: ApiRequestType
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}

export function useGetOne({ url, id, config, requestType = 'api' }: Props) {
  const baseUrl = useApiManager(requestType)

  const store = useAuthStore()

  const { accessToken } = storeToRefs(store)

  const fullURL = `${baseUrl}/api/${API_VERSION}/${url}${id ? `/${id}` : ''}`

  const context = useQuery<any>({
    queryKey: [fullURL],
    queryFn: fetcher,
    meta: { accessToken: accessToken.value },
    enabled: !!accessToken.value,
    ...config,
  })

  return {
    data: context.data || ({} as any),
    isLoading: context.isLoading || context.isFetching || context.isRefetching,
    error: context.error,
    refetch: context.refetch,
  }
}
