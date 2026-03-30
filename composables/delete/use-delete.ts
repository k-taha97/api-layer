import type { MutationProps } from '../use-mutation'
import { useAppMutation } from '../use-mutation'

function useDelete({ method = 'DELETE', ...props }: MutationProps) {
  return useAppMutation({ method, ...props })
}

export { useDelete }
