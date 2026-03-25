import type { ApiRequestType } from '../utils/constants'

import { useRuntimeConfig } from 'nuxt/app'

function useApiManager(requestType: ApiRequestType) {
  const _config = useRuntimeConfig()
  const baseUrl = requestType === 'auth' ? _config.public.authUrl as string : _config.public.apiUrl

  return baseUrl
}

export { useApiManager }
