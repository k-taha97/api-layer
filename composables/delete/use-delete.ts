import { useAppMutation, type MutationProps } from '../use-mutation';

const useDelete = ({ method = 'DELETE', ...props }: MutationProps) => {
  return useAppMutation({ method, ...props });
};

export { useDelete };
