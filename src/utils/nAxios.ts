import axios, { AxiosError } from "axios";
import { BASE_URL } from "../config/env";
import { store } from "../store";
import { clearUser, setUser } from "../store/slices/userSlice";
import { ctiWebSocketService } from "@/services/cti/CtiWebSocketService"; // ⭐ CTI 서비스 import

/**
 * 백엔드 ApiResponse 에러 구조
 */
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
}

/**
 * 정형화된 에러 객체 (일반 Error처럼 사용 가능)
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public errorCode?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// OpenAPI generator에서 생성된 axios instance에 baseURL 적용
const nAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor - 토큰 자동 삽입
nAxios.interceptors.request.use(
  (config: any) => {
    // 예: 인증 토큰 추가
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// response interceptor - 세션 만료 처리 및 에러 정형화
nAxios.interceptors.response.use(
  (response: any) => {
    // 백엔드에서 새로운 토큰을 헤더로 보내준 경우 자동 저장
    const newToken = response.headers['x-new-access-token'];
    if (newToken) {
      console.log("🔄 새로운 Access Token 받음 - 자동 저장");
      localStorage.setItem("token", newToken);
      
      // Redux store가 있을 경우에만 업데이트
      if (store && store.dispatch) {
        store.dispatch(setUser({ accessToken: newToken }));
      }
    }
    
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // 401 에러 처리
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // 로그인/리프레시 API는 제외 (무한 리다이렉트 방지)
      if (!url.includes('/login') && !url.includes('/refresh') && !url.includes('/loginCheck')) {
        console.log("🔴 401 에러 - 토큰 만료 감지, 로그인 페이지로 리다이렉트");
        
        // ⭐ CTI 연결 정리
        try {
          ctiWebSocketService.disconnect();
          console.log("🔌 CTI 연결 정리 완료");
        } catch (ctiError) {
          console.error("❌ CTI 연결 정리 실패:", ctiError);
        }
        
        // localStorage 정리
        localStorage.clear();
        
        // Redux store 정리
        if (store && store.dispatch) {
          store.dispatch(clearUser());
        }
        
        // 무한 리다이렉트 방지
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // 백엔드 ApiResponse에서 message와 errorCode 추출하여 정형화된 에러 생성
    const apiResponse = error.response?.data;
    
    if (apiResponse && apiResponse.success === false && apiResponse.message) {
      // 백엔드에서 정형화된 에러 응답인 경우
      const apiError = new ApiError(
        apiResponse.message,
        apiResponse.errorCode,
        error.response?.status
      );
      return Promise.reject(apiError);
    }
    
    // 백엔드 응답이 없거나 형식이 다른 경우 (네트워크 에러 등)
    const message = error.message || '요청 처리 중 오류가 발생했습니다.';
    const apiError = new ApiError(message, undefined, error.response?.status);
    
    return Promise.reject(apiError);
  }
);

// 둘 다 export (호환성 유지)
export { nAxios };
export default nAxios;
