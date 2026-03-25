import type { MutationProps } from '../use-mutation'
import { useAppMutation } from '../use-mutation'

function usePost({ ...props }: Omit<MutationProps, 'method'>) {
  return useAppMutation({ method: 'POST', ...props })
}

export { usePost }
