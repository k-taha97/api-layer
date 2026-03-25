import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'

import type { IGenericObject } from '../../utils'
import type { ApiRequestType } from '../../utils/constants'

import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/store/auth'
import { queryClient } from '../../utils'
import { useApiManager } from '../use-api-manager'
import { fetcher } from './fetcher'

export interface IGetProps {
  url: string
  params?: globalThis.Ref<object>
  requestType?: ApiRequestType
  dataParamName?: string
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}

export function useGet({ url, config, params, requestType = 'api' }: IGetProps) {
  const baseUrl = useApiManager(requestType)

  const store = useAuthStore()

  const { accessToken } = storeToRefs(store)

  const fullURL = `${baseUrl}/api/${API_VERSION}/${url}`

  const result = useQuery({
    queryKey: [fullURL, { page: 1, params, size: LIMIT }],
    queryFn: async () => {
      const result: { [key: string]: unknown } = await fetcher({
        client: queryClient,
        queryKey: [fullURL, { page: 1, ...(params?.value ?? {}), size: LIMIT }],
        meta: { accessToken: accessToken.value },
      })
      return {
        data: result,
        total: result?.count as number,
      }
    },
    meta: { accessToken },
    enabled: !!accessToken.value,
    ...config,
  }, queryClient)

  watch(result.error, () => {
    if (result.error.value && (result.error.value as IGenericObject).status !== 401) {
      usePrimeToastError((result.error.value as IGenericObject)?.response?.data?.[0]?.description ?? 'Something went wrong!')
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
