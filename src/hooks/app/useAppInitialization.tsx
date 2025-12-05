import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { ctiWebSocketService } from "@/services/cti/CtiWebSocketService";
import { useWebRTC } from "@/store/slices/userSlice";
import nAxios from "@/utils/nAxios";
import { useDialog } from "../ui/useDialog";
import { useConfig } from "../api/useConfig";

/**
 * 앱 초기화 Hook
 * 로그인 후 설정 조회 및 CTI 연결 등을 처리
 */
export function useAppInitialization() {
  const user = useAppSelector((state) => state.user);
  const dialog = useDialog();
  const { config, isLoading: configLoading } = useConfig();
  const useWebRTCFlag = user.useWebRTC;

  useEffect(() => {
    // 설정이 아직 로드되지 않았으면 대기
    if (configLoading || !config) {
      return;
    }

    // 사용자 정보가 없으면 대기
    if (!user.userId || !user.dn) {
      console.log("⚠️ 사용자 정보가 없어 초기화를 건너뜁니다.");
      return;
    }

    const getPassword = async () => {
      try {
        let dn = user.dn;
        let password: string | undefined;

        // WebRTC 사용 시 SIP 비밀번호 조회
        if (useWebRTCFlag) {
          
          const result: any = await nAxios.post("/sip/userPasswd");
          
          if (result) {
            password = result.data;
            if (!password) {
              
              dialog.error("DN 비밀번호를 확인할 수 없습니다.");
              return;
            }
          } else {
            console.error("❌ SIP 비밀번호 조회 결과가 없습니다.");
            alert("DN 비밀번호를 확인할 수 없습니다.");
            return;
          }
          
          await ctiWebSocketService.webRTCLogin(
            user.userId,
            user.dn,
            password,
            'call'
          );

          // HTML에서 오디오 요소 가져오기 (AS-IS: $("#rt")[0])
          const ringTone = document.getElementById('rt') as HTMLAudioElement;
          const ringBackTone = document.getElementById('rbt') as HTMLAudioElement;
          const callendBeef = document.getElementById('ceb') as HTMLAudioElement;
          
          
          ctiWebSocketService.setWebRTCRingTone(ringTone, ringBackTone, callendBeef);
          
        }

        await ctiWebSocketService.connect();
        console.log("✅ CTI 연결 성공");
      } catch (error) {
        console.error("❌ CTI 연결 실패:", error);
      }
    };

    getPassword();
    // 컴포넌트 언마운트 시 CTI 연결 해제
    return () => {
      console.log("🔌 CTI 연결 해제");
      ctiWebSocketService.disconnect();
    };
  }, [config, configLoading, user.userId, user.dn, useWebRTCFlag]);
}

