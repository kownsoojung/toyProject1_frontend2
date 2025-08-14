import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';

type HTTPMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function useAutoMutation<TData = unknown, TVariables = any>(
  url: string,
  method: HTTPMethod = 'POST',
  options?: UseMutationOptions<TData, Error, TVariables>
): UseMutationResult<TData, Error, TVariables> {
  const queryClient = useQueryClient();

  const mutationFn = async (variables: TVariables): Promise<TData> => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variables),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return res.json();
  };

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    ...options,
  });
}