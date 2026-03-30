import type { MutationProps } from '../use-mutation'
import { useAppMutation } from '../use-mutation'

function useUpdate({ method = 'PUT', ...props }: MutationProps) {
  return useAppMutation({ method, ...props })
}

export { useUpdate }
