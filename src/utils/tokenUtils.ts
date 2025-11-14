/**
 * JWT 토큰의 만료 시간을 확인하는 유틸리티
 */

/**
 * JWT 토큰이 만료되었는지 확인
 * @param token JWT 토큰 문자열
 * @returns 만료되었으면 true, 유효하면 false
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true;
  }

  try {
    // JWT는 base64로 인코딩된 3부분으로 구성: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn("⚠️ 잘못된 토큰 형식");
      return true;
    }

    // payload 디코딩
    const payload = JSON.parse(atob(parts[1]));
    
    // exp (만료 시간) 확인 (초 단위 Unix timestamp)
    if (!payload.exp) {
      console.warn("⚠️ 토큰에 만료 시간이 없습니다");
      return true;
    }

    // 현재 시간과 비교 (초 단위)
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;

    if (isExpired) {
      console.log(`🔴 토큰 만료됨 - 만료 시간: ${new Date(payload.exp * 1000).toISOString()}, 현재 시간: ${new Date().toISOString()}`);
    }

    return isExpired;
  } catch (error) {
    console.error("❌ 토큰 파싱 오류:", error);
    return true; // 파싱 실패 시 만료된 것으로 간주
  }
};

/**
 * 토큰이 유효한지 확인 (존재하고 만료되지 않았는지)
 * @param token JWT 토큰 문자열
 * @returns 유효하면 true
 */
export const isTokenValid = (token: string | null): boolean => {
  return token !== null && !isTokenExpired(token);
};

