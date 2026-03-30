import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'
import type { ApiRequestType } from '../../utils/constants'

import { useQuery } from '@tanstack/vue-query'
import { API_VERSION } from '../../utils/constants'
import { useApiManager } from '../use-api-manager'
import { fetcher } from './fetcher'

interface Props {
  url: string
  id: string
  requestType?: ApiRequestType
  accessToken?: string
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}

export function useGetOne({ url, id, config, requestType = 'api', accessToken }: Props) {
  const baseUrl = useApiManager(requestType)

  const fullURL = `${baseUrl}/api/${API_VERSION}/${url}${id ? `/${id}` : ''}`

  const context = useQuery<any>({
    queryKey: [fullURL],
    queryFn: fetcher,
    meta: { accessToken },
    enabled: !!accessToken,
    ...config,
  })

  return {
    data: context.data || ({} as any),
    isLoading: context.isLoading || context.isFetching || context.isRefetching,
    error: context.error,
    refetch: context.refetch,
  }
}
