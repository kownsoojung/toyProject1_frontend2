import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true: 로그인 필요, false: 로그인 상태면 리다이렉트
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const hasToken = !!localStorage.getItem("token");
  const isAuthenticated = isLoggedIn && hasToken;

  if (requireAuth) {
    // 인증이 필요한 페이지: 로그인 안 되어있으면 /login으로
    if (!isAuthenticated) {
      console.log("🔒 인증 필요 - 로그인 페이지로 이동");
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

