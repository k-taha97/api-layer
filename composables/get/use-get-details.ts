import type { IGenericObject } from '../../utils'

import { computed, toRef, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetOne } from './use-get-one'

export function useGetDetailsQuery(props: GetDetailsProps) {
  const propsRef = toRef(props)
  const { endpoint, idLabel, customId, enabled, hideLoading } = toRefs(props)

  const { params } = useRoute()
  const router = useRouter()

  const resolvedIdLabel = computed(() => idLabel?.value ?? 'id')
  const resolvedHideLoading = computed(() => hideLoading?.value ?? false)
  const resolvedEnabledProp = computed(() => enabled?.value ?? true)

  const id = computed(() => {
    return customId?.value === null
      ? ''
      : (params as IGenericObject)[resolvedIdLabel.value] as string
  })

  const isEnabled = computed(() => {
    if (resolvedEnabledProp.value === false)
      return false

    return resolvedEnabledProp.value || !!id.value
  })

  const { data, isLoading, error, refetch } = useGetOne({
    url: endpoint.value,
    id: id.value,
    config: {
      enabled: isEnabled.value,
    },
  })

  function goBack() {
    router.back()
  }

  return {
    props: propsRef,
    endpoint,
    idLabel: resolvedIdLabel,
    customId,
    hideLoading: resolvedHideLoading,
    enabled: isEnabled,
    id,
    data,
    isLoading,
    error,
    refetch,
    goBack,
  }
}
