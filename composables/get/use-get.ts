import type { IGenericObject, IGetProps } from '../../utils'

import { useQuery } from '@tanstack/vue-query'
import { watch } from 'vue'
import { queryClient } from '../../utils'
import { API_VERSION } from '../../utils/constants'
import { useApiManager } from '../use-api-manager'
import { fetcher } from './fetcher'

export function useGet({ url, config, params, requestType = 'api', accessToken, limit = 10 }: IGetProps) {
  const baseUrl = useApiManager(requestType)

  const fullURL = baseUrl ? `${baseUrl}/api/${API_VERSION}/${url}` : url

  const result = useQuery({
    queryKey: [fullURL, { page: 1, params, size: limit }],
    queryFn: async () => {
      const result: { [key: string]: unknown } = await fetcher({
        client: queryClient,
        queryKey: [fullURL, { page: 1, ...(params?.value ?? {}), size: limit }],
        meta: { accessToken },
      })
      return {
        data: result,
        total: result?.count as number,
      }
    },
    meta: { accessToken },
    enabled: !!accessToken,
    ...config,
  }, queryClient)

  watch(result.error, () => {
    if (result.error.value && (result.error.value as IGenericObject).status !== 401) {
      throw result.error.value
    }
  })

  const { data, isLoading, isRefetching, refetch } = result

  return {
    data: data || ({} as any),
    isLoading: isLoading || isRefetching,
    error: result.error,
    refetch,
  }
}
