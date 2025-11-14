import { Navigate } from "react-router-dom";
import { isTokenValid } from "@/utils/tokenUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true: 로그인 필요, false: 로그인 상태면 리다이렉트
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  // ⭐ 토큰 유효성 검증 추가 (존재하고 만료되지 않았는지 확인)
  const isAuthenticated = isLoggedIn && isTokenValid(token);

  if (requireAuth) {
    // 인증이 필요한 페이지: 로그인 안 되어있거나 토큰이 만료되었으면 /login으로
    if (!isAuthenticated) {
      console.log("🔒 인증 필요 또는 토큰 만료 - 로그인 페이지로 이동");
      
      // ⭐ 토큰이 만료되었으면 localStorage 정리
      if (token && !isTokenValid(token)) {
        localStorage.clear();
      }
      
      return <Navigate to="/login" replace />;
    }
  } else {
    // 인증이 필요 없는 페이지(로그인, 회원가입): 이미 로그인되어있으면 /로
    if (isAuthenticated) {
      console.log("✅ 이미 로그인됨 - 메인 페이지로 이동");
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

