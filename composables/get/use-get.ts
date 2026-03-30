import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'
import type { Ref } from 'vue'

import type { IGenericObject } from '../../utils'
import type { ApiRequestType } from '../../utils/constants'

import { useQuery } from '@tanstack/vue-query'
import { watch } from 'vue'
import { queryClient } from '../../utils'
import { API_VERSION } from '../../utils/constants'
import { useApiManager } from '../use-api-manager'
import { fetcher } from './fetcher'

export interface IGetProps {
  url: string
  params?: Ref<IGenericObject>
  requestType?: ApiRequestType
  dataParamName?: string
  accessToken?: string
  limit?: number
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}

export function useGet({ url, config, params, requestType = 'api', accessToken, limit = 10 }: IGetProps) {
  const baseUrl = useApiManager(requestType)

  const fullURL = `${baseUrl}/api/${API_VERSION}/${url}`

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
