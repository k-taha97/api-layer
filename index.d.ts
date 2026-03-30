import type { QueryKey, UseQueryOptions } from '@tanstack/vue-query'

declare global {
  export type PaginationType = 'simple' | 'pages'

  export interface ListDataProps {
    endpoint: string
    pagination: PaginationType
    dataParamName?: string
    disabled?: boolean
    ignoredParams?: string[]
    config?: Omit<UseQueryOptions<unknown, Error, unknown, QueryKey>, 'queryKey'>
  }

  export interface GetDetailsProps {
    endpoint: string
    idLabel?: string
    customId?: string | null
    hideLoading?: boolean
    enabled?: boolean
  }
}

export { }
