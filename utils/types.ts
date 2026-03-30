import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'

export interface IGenericObject {
  [key: string]: any
}

export type PaginationType = 'simple' | 'pages'

export interface GetDetailsProps {
  endpoint: string
  idLabel?: string
  customId?: string | null
  hideLoading?: boolean
  enabled?: boolean
}

export interface ListDataProps {
  endpoint: string
  pagination: PaginationType
  dataParamName?: string
  disabled?: boolean
  ignoredParams?: string[]
  noDataImageSrc?: string
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}

export interface IGetProps {
  url: string
  params?: Ref<IGenericObject>
  requestType?: ApiRequestType
  dataParamName?: string
  accessToken?: string
  limit?: number
  config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
}
