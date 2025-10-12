import { apiInstance } from '@/api/baseApi';
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';

type HTTPMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function useAutoMutation<TData = unknown, TVariables = any>(
  url: string,
  method: HTTPMethod = 'POST',
  options?: UseMutationOptions<TData, Error, TVariables>
  
): UseMutationResult<TData, Error, TVariables> {

  const mutationFn = async (variables: TVariables): Promise<TData> => {
    try {
      const res = await apiInstance.request<TData>({ url, method, data: variables });
      return res.data;
    } catch (error: any) {
      
      //handleCommonError(error);
      throw error;
    }
  }

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    ...options,
  });
}