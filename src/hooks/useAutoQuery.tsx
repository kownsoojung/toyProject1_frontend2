import { apiInstance } from "@/api/baseApi";
import { useQuery as useReactQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

/**
 * 공통 Query 옵션 타입
 */
export interface QueryOptions<T> {
  queryKey: string | readonly unknown[];
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: any;
  data?: any;
  config?: AxiosRequestConfig;
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;
}

/**
 * 공통 fetcher 함수
 */
const createFetcher = <T,>(url: string, method: string, params?: any, data?: any, config?: AxiosRequestConfig) => {
  return async (): Promise<T> => {
    try {
      const res = await apiInstance.request<T>({
        url,
        method,
        params: method === 'GET' ? params : undefined,
        data: method !== 'GET' ? data : undefined,
        ...config,
      });
      return res.data;
    } catch (error: any) {
      //handleCommonError(error);
      throw error;
    }
  };
};

/**
 * 🔵 useApiQuery - 수동 조회용 (일반 조회)
 * 버튼 클릭이나 특정 조건에서만 조회할 때 사용
 * 
 * @example
 * // 버튼 클릭 시 조회
 * const { data, refetch } = useApiQuery({
 *   queryKey: 'users',
 *   url: '/api/users',
 * });
 * 
 * <Button onClick={() => refetch()}>조회</Button>
 */
export function useApiQuery<T>({
  queryKey,
  url,
  method = 'GET',
  params,
  data,
  config,
  options = { enabled: false, retry: false, refetchOnMount:"always",   staleTime: 0},  // 기본값: 수동 조회
}: QueryOptions<T>): UseQueryResult<T, Error> {
  const fetcher = createFetcher<T>(url, method, params, data, config);
  
  return useReactQuery<T, Error>({ 
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey], 
    queryFn: fetcher, 
    refetchOnWindowFocus: false,
    
    ...options 
  });
}

/**
 * 🟢 useAutoQuery - 자동 조회용
 * 컴포넌트 마운트시 자동으로 데이터를 가져올 때 사용
 * 
 * @example
 * const { data, isLoading } = useAutoQuery({
 *   queryKey: ['codes', codeType],
 *   url: '/api/codes',
 *   params: { codeType }
 * });
 */
export function useAutoQuery<T>({
  queryKey,
  url,
  method = 'GET',
  params,
  data,
  config,
  options = {},
}: QueryOptions<T>): UseQueryResult<T, Error> {
  const fetcher = createFetcher<T>(url, method, params, data, config);
  
  return useReactQuery<T, Error>({ 
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey], 
    queryFn: fetcher,
    // 자동 조회 기본 옵션
    enabled: true,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    retry: false,
    ...options,  // 사용자 옵션으로 오버라이드 가능
  });
}

/**
 * 🔄 하위 호환을 위한 별칭
 * @deprecated useApiQuery 또는 useAutoQuery를 사용하세요
 */
export const UseAutoQuery = useAutoQuery;
export const useQuery = useApiQuery;  // 별칭 (선택적)