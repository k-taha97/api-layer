import type { AxiosError, AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'

import type { ApiRequestType } from '../utils/constants'
import { useMutation } from '@tanstack/vue-query'

import { axiosInstance, commonHeaders, queryClient } from '../utils'
import { API_VERSION } from '../utils/constants'
import { useApiManager } from './use-api-manager'

export interface MutationProps {
  url: string
  method?: AxiosRequestConfig['method']
  message?: string | null
  errorMsg?: string
  requestType?: ApiRequestType
  invalidateQueries?: string[]
  accessToken?: string
  headers?: AxiosHeaders | (Partial<RawAxiosRequestHeaders>)
}

export function useAppMutation({
  url,
  method,
  invalidateQueries,
  requestType = 'api',
  headers,
  accessToken,
}: MutationProps) {
  const baseUrl = useApiManager(requestType)

  const mutation = useMutation?.({
    mutationFn: async (data: unknown) => {
      const response = await axiosInstance({
        method,
        url: `${baseUrl}/api/${API_VERSION}/${url}`,
        data,
        headers: {
          ...commonHeaders,
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          ...headers,
        },
      })

      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate(query) {
          return invalidateQueries?.some(_query => (query.queryKey[0] as string)?.includes(_query)) || false
        },
      })
    },

    onError: (error: AxiosError) => {
      throw error
    },
  })

  return mutation
}
