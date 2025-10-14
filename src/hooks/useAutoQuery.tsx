import { apiInstance } from "@/api/baseApi";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

/**
 * 공통 useQuery 훅 타입 정의
 */
export interface OpenApiQueryOptions<T> {
  queryKey: string | readonly unknown[];       // React Query Key
  url: string;                                  // OpenAPI URL
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // HTTP method (기본 GET)
  params?: any;                                 // GET 쿼리 파라미터
  data?: any;                                   // POST/PUT 요청 Body
  config?: AxiosRequestConfig;                  // 추가 Axios 옵션
  isAuto?:boolean;
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>;
  
}

export function UseAutoQuery<T>({
  queryKey,
  url,
  method = 'GET',
  params,
  data,
  config,
  isAuto=false,
  options={enabled:isAuto , gcTime:0, staleTime: 0,refetchOnMount: 'always',retry: false},
  
}: OpenApiQueryOptions<T>): UseQueryResult<T, Error> {

  const fetcher = async (): Promise<T> => {
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

  return useQuery<T, Error>({ queryKey: [queryKey], queryFn: fetcher, ...options });
}