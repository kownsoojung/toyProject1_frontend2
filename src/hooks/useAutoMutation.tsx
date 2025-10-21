import { apiInstance } from '@/api/baseApi';
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { useLoading } from './useLoading';
import { MessageType } from '@/store/slices/loadingSlice';

type HTTPMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface AutoMutationOptions<TData, TVariables> extends UseMutationOptions<TData, Error, TVariables> {
  invalidateQueries?: string[];  // 캐시 무효화할 쿼리 키
  withLoading?: boolean | string | MessageType;  // 로딩 오버레이 표시 (true: 기본 메시지, string: 커스텀 메시지)
}

export function useAutoMutation<TData = unknown, TVariables = any>(
  url: string,
  method: HTTPMethod = 'POST',
  options?: AutoMutationOptions<TData, TVariables>
): UseMutationResult<TData, Error, TVariables> {
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useLoading();

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
    onMutate: (variables) => {
      // 로딩 시작
      if (options?.withLoading) {
        const message = typeof options.withLoading === 'string' 
          ? options.withLoading 
          : 'save';  // 기본 메시지 타입
        startLoading(message);
      }
      // 사용자 정의 onMutate 실행
      return options?.onMutate?.(variables);
    },
    onSuccess: (data, variables, context) => {
      // 로딩 종료
      if (options?.withLoading) {
        stopLoading();
      }
      // 캐시 무효화
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      // 사용자 정의 onSuccess 실행
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      // 로딩 종료
      if (options?.withLoading) {
        stopLoading();
      }
      // 사용자 정의 onError 실행
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}