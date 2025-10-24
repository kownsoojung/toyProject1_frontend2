import axios from "axios";
import { BASE_URL } from "../config/env"

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

// response interceptor - 세션 만료 처리
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("🔴 API 에러 발생:", {
      status: error.response?.status,
      url: error.config?.url,
      currentPath: window.location.pathname
    });
    
    // 로그인 API는 제외 (로그인 실패는 정상적인 비즈니스 로직)
    const isLoginAPI = error.config?.url?.includes('/login');
    
    // 401 에러이고 로그인 API가 아닐 때만 세션 만료 처리
    if (error.response?.status === 401 && !isLoginAPI) {
      console.log("🔴 401 에러 - 로그인 페이지로 리다이렉트");
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);