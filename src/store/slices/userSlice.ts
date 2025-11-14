import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponseDto } from "@/api/generated/models/login-response-dto";

// LoginResponseDto 구조를 기준으로 UserState 정의 (모든 필드 optional로 유지)
interface UserState {
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenType?: string | null;
  id?: string | null; // ⭐ userId 대신 id 사용
  username?: string | null;
  name?: string | null;
  email?: string | null;
  roleId?: number | null; // ⭐ role 대신 roleId 사용
  centerId?: number | null;
  tenantId?: number | null;
  groupId?: number | null;
  partId?: number | null;
  uid?: number | null;
  level?: number | null;
  dn: string | null;
  customInfo?: object | null;
  rssid?: string | null;
  optionInfo?: string | null; // AS-IS: option_info - WebRTC 사용 여부 확인용 ("WEBRTC" 문자열 포함 여부)
  useWebRTC?: boolean; // ⭐ WebRTC 사용 여부 전역 플래그 추가
  // 하위 호환성을 위한 필드 (기존 코드에서 사용 중)
  userId?: string | null; // ⭐ id와 동일한 값으로 매핑
  role?: string | null; // ⭐ roleId와 동일한 값으로 매핑 (필요시)
}

/**
 * WebRTC 사용 여부 확인 (AS-IS setWebrtc 함수 개선)
 * @param optionInfo 사용자 option_info 문자열 (예: "WEBRTC: \"1\", only_work: \"call\"" 또는 "WEBRTC=1;only_work=call;")
 * @returns WebRTC 사용 여부 (true/false)
 * 
 * optionInfo 형식:
 * - "WEBRTC: \"1\", only_work: \"call\"" (AS-IS 형식)
 * - "WEBRTC=1;only_work=call;" (TO-BE 형식)
 * WEBRTC=1인 경우에만 WebRTC 사용으로 판단
 */
export function useWebRTC(optionInfo?: string | null): boolean {
  if (!optionInfo) return false;
  
  const upperOptionInfo = optionInfo.toUpperCase();
  
  // WEBRTC=1 패턴 찾기 (세미콜론 또는 문자열 끝으로 구분)
  const webRTCRegex = /WEBRTC\s*=\s*(\d+)/i;
  const match = upperOptionInfo.match(webRTCRegex);
  
  if (match && match[1]) {
    // WEBRTC=1이면 true, 그 외(0 등)는 false
    return match[1] === '1';
  }
  
  // AS-IS 호환성: "WEBRTC: \"1\"" 형식도 지원
  if (upperOptionInfo.includes('WEBRTC') && upperOptionInfo.includes('"1"')) {
    return true;
  }
  
  return false;
}

const initialState: UserState = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  id: null,
  username: null,
  name: null,
  email: null,
  roleId: null,
  centerId: null,
  tenantId: null,
  groupId: null,
  partId: null,
  uid: null,
  level: null,
  dn: null,
  customInfo: null,
  rssid: null,
  optionInfo: null,
  useWebRTC: false, // ⭐ 초기값 false
  userId: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<LoginResponseDto> | Partial<UserState>>) => {
      const payload = action.payload as any;
      // LoginResponseDto를 UserState로 매핑
      const mappedPayload: Partial<UserState> = {
        ...payload,
        // 하위 호환성: id를 userId로도 매핑
        userId: payload.id ?? payload.userId ?? null,
        // roleId는 그대로 유지 (role은 필요시 별도 매핑)
        role: payload.role ?? null,
        // ⭐ optionInfo가 명시적으로 전달된 경우에만 useWebRTC 재계산
        // optionInfo가 없으면 기존 useWebRTC 값 유지 (토큰 갱신 시 보존)
        useWebRTC: payload.optionInfo !== undefined 
          ? useWebRTC(payload.optionInfo)
          : (payload.useWebRTC !== undefined ? payload.useWebRTC : state.useWebRTC),
      };
      return { ...state, ...mappedPayload };
    },
    clearUser: () => {
      // localStorage도 함께 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      return initialState;
    },
    loadUserFromStorage: (state) => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          // 하위 호환성: userId나 id가 있으면 둘 다 설정
          const mappedData = {
            ...userData,
            accessToken: savedToken,
            userId: userData.id ?? userData.userId ?? null,
            // ⭐ optionInfo가 있으면 useWebRTC 자동 계산
            useWebRTC: useWebRTC(userData.optionInfo),
          };
          return { ...state, ...mappedData };
        } catch (e) {
          console.error("Failed to parse user data from localStorage:", e);
          return state;
        }
      }
      return state;
    },
  },
});

export const { setUser, clearUser, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;

