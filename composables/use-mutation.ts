import type { AxiosError, AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'

import type { ApiRequestType } from '../utils/constants'

import { useAuthStore } from '@layers/auth/store'
import { useMutation } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { axiosInstance, commonHeaders, queryClient } from '../utils'
import { useApiManager } from './use-api-manager'

export interface MutationProps {
  url: string
  method?: AxiosRequestConfig['method']
  message?: string | null
  errorMsg?: string
  requestType?: ApiRequestType
  invalidateQueries?: string[]
  headers?: AxiosHeaders | (Partial<RawAxiosRequestHeaders>)
}

export function useAppMutation({
  url,
  method,
  invalidateQueries,
  message = 'Created Successfully!',
  errorMsg = 'Something went wrong!',
  requestType = 'api',
  headers,
}: MutationProps) {
  const baseUrl = useApiManager(requestType)

  const { accessToken } = storeToRefs(useAuthStore())

  const mutation = useMutation?.({
    mutationFn: async (data: unknown) => {
      const response = await axiosInstance({
        method,
        url: `${baseUrl}/api/${API_VERSION}/${url}`,
        data,
        headers: {
          ...commonHeaders,
          Authorization: accessToken.value ? `Bearer ${accessToken.value}` : undefined,
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

      if (message !== null) {
        usePrimeToastSuccess(message || '')
      }
    },

    onError: (error: AxiosError) => {
      console.error(error || errorMsg)

      usePrimeToastError(errorMsg || (error?.response?.data as { title: string })?.title || 'Something went wrong!')
    },
  })

  return mutation
}
