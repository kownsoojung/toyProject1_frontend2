import axios from "axios";
import { BASE_URL } from "../config/env"

// OpenAPI generator에서 생성된 axios instance에 baseURL 적용
export const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request / response interceptor 가능
apiInstance.interceptors.request.use(config => {
  // JWT 토큰 자동 삽입 등
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});