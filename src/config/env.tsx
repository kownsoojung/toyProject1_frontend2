export enum Env {
  LOCAL = "local",
  DEV = "dev",
  PROD = "prod",
}

export const CURRENT_ENV = (import.meta.env.VITE_REACT_APP_ENV as Env)|| Env.LOCAL;

// 환경별 API base URL
export const BASE_URL = {
  [Env.LOCAL]: "http://localhost:8080",
  [Env.DEV]: "https://dev-api.mycompany.com",
  [Env.PROD]: "https://api.mycompany.com",
}[CURRENT_ENV];
