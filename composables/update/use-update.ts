import { type MutationProps, useAppMutation } from '../use-mutation';

function useUpdate({ method = 'PUT', ...props }: MutationProps) {
  return useAppMutation({ method, ...props });
}

export { useUpdate };
