import axios from "axios";
import { BASE_URL } from "../config/env";
import { store } from "../store";
import { setUser } from "../store/slices/userSlice";
import { clearUser } from "../store/slices/userSlice";
import { ctiWebSocketService } from "@/services/cti/CtiWebSocketService"; // ⭐ CTI 서비스 import

// OpenAPI generator에서 생성된 axios instance에 baseURL 적용
export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor - 토큰 자동 삽입
apiInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor - 세션 만료 처리 및 에러 정형화
apiInstance.interceptors.response.use(
  (response) => {
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
  (error) => {
    console.log("🔴 API 에러 발생:", {
      status: error.response?.status,
      url: error.config?.url,
      currentPath: window.location.pathname
    });
    
    // 로그인 API는 제외 (로그인 실패는 정상적인 비즈니스 로직)
    const isLoginAPI = error.config?.url?.includes('/login') || 
                      error.config?.url?.includes('/loginCheck') ||
                      error.config?.url?.includes('/refresh');
    
    // 401 에러이고 로그인 API가 아닐 때만 세션 만료 처리
    if (error.response?.status === 401 && !isLoginAPI) {
      console.log("🔴 401 에러 - 토큰 만료 감지, 로그인 페이지로 리다이렉트");
      
      // ⭐ CTI 연결 정리
      try {
        ctiWebSocketService.disconnect();
        console.log("🔌 CTI 연결 정리 완료");
      } catch (ctiError) {
        console.error("❌ CTI 연결 정리 실패:", ctiError);
      }
      
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
    
    return Promise.reject(error);
  }
);