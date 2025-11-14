import { AForm, ASelect, ASwitch, FlexBox } from "@/components";
import { ctiWebSocketService } from "@/services/cti/CtiWebSocketService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCallStatus } from "@/store/slices/ctiSlice";
import { Mic, MicOff, SupportAgent } from "@mui/icons-material";
import { Box, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * 상단 CallInfo: CTI 연결 상태, 시간, 통화 시간, 콜 대기 스위치
 */
export const CallStatusBar: React.FC = () => {
  const dispatch = useAppDispatch(); 
  const [duration, setDuration] = useState(0);
  const [recTime, setRecTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  const callStatus = useAppSelector((state) => state.cti.callStatus); // ⭐ callStatus로 수정
  const callStatusName = useAppSelector((state) => state.cti.callStatusName); // ⭐ 명칭도 사용 가능
  const currentCall = useAppSelector((state) => state.cti.currentCall); // ⭐ 현재 통화 정보
  const isConnected = useAppSelector((state) => state.cti.isConnected); // ⭐ CTI 연결 상태

  const methods = useForm({
    defaultValues: {
      callWait: callStatus === "204", // 콜 대기 스위치
      afterWorkReason: 0, // 후처리 사유 코드
      restReason: 0, // 휴식 사유 코드
    },
  });

  // 통화 시간 계산
  const [callDuration, setCallDuration] = useState(0);
  
  useEffect(() => {
    if (callStatus != "204") {
      methods.setValue("callWait", false);
    }
  }, [callStatus]);
  // 통화 중일 때 통화 시간 업데이트
  useEffect(() => {
    if (currentCall && currentCall.status === "CONNECTED" && currentCall.startTime) {
      const startTime = new Date(currentCall.startTime).getTime();
      const updateDuration = () => {
        const now = Date.now();
        setCallDuration(Math.floor((now - startTime) / 1000));
      };
      
      updateDuration(); // 즉시 업데이트
      const interval = setInterval(updateDuration, 1000);
      
      return () => clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [currentCall]);

  // 통화 시간 포맷팅 (초를 HH:mm:ss로)
  const formatCallDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // ⭐ CTI 연결 후 대기/휴식 시간 업데이트 (기존 시스템처럼)
  useEffect(() => {
    // 로그오프 상태면 타이머 중지
    if (!isConnected) {
      setDuration(0);
      return;
    }
    setDuration(0);
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus, isConnected]);


  useEffect(() => {
    setRecTime(0);
    if (isRecording) {
      const recordingInterval = setInterval(() => {
        setRecTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(recordingInterval);
    }
  }, [isRecording]);

  // 콜 대기 스위치 핸들러
  const handleCallWaitToggle = async () => {
    const checked = methods.getValues("callWait");
    
    if (callStatus === "202") {
      console.warn("⚠️ CTI 연결되지 않음 - 상태 변경 불가");
      return;
    }

    const newStatus = checked ? "204" : "203"; // ⭐ 체크되면 대기중("204"), 아니면 휴식중("203")
    const fname = checked ? "ready" : "notready"; // ⭐ CTI 명령어

    try {
      if (checked) {
        await ctiWebSocketService.setFeatureAgentStatus(fname);
      } else {
        const restReason = methods.getValues("restReason");
        await ctiWebSocketService.setFeatureAgentStatus(fname, restReason);
      }
      
      console.log(`✅ 상담원 상태 변경: ${fname} (${newStatus})`);
    } catch (error) {
      console.error(`❌ 상담원 상태 변경 실패: ${fname}`, error);
    }
  };

  const handleAfterWorkReasonToggle = async () => {
    const afterWorkReason = methods.getValues("afterWorkReason");
    await ctiWebSocketService.setFeatureAgentStatus("afterwork", afterWorkReason);
  };
  return (
    <FlexBox id="callInfo" sxProps={{ gap: 0.4, alignItems: "center" }}>
      <SupportAgent sx={{ backgroundColor: "#fff", borderRadius: "50%", color: "#6A6A6A", padding: 0.2 }}/> 
      
      {/* 콜 상태 표시 */}
      <Box component="span" sx={{ marginLeft: 0.5, color: "#fff" }}>
        {callStatusName}
      </Box>
      <Box component="span" sx={{ marginLeft: 0.5 }}>{formatCallDuration(duration)}</Box>
      
      {/* 녹음 시간 표시 */}
      <Box component="span" sx={{ marginLeft: 0.4, alignItems: "center", display: "flex" }}> 
        {isRecording ? (
          <MicOff sx={{ color: "#f00", marginRight: 0.5, cursor: "pointer"}} onClick={() => 
            setIsRecording(false)} />
        ) : (
          <Mic sx={{ color: "#f00", marginRight: 0.5, cursor: "pointer"}} onClick={() => {
              setIsRecording(true);
            }}
          />
        )}
        {formatCallDuration(recTime)}
      </Box>
      
      <AForm methods={methods} isTable={false} marginB={0} formStyle={{ display: 'flex',alignItems: 'center',gap: 4,}} >
        <ASwitch.Form
          name="callWait"
          label="콜 대기"
          base={{
            disabled: callStatus !== "203" && callStatus !== "204", // ⭐ base.disabled 사용
          }}
          changeCallback={(value: any) => {
            // form 값이 이미 업데이트된 후 실행됨
            handleCallWaitToggle();
          }}
        />
        <ASelect.Form name="afterWorkReason" codeType="site" msize={"100px"} selectCode={{codeName:"206"}} isPlaceholder={false} 
          base={{
            disabled: callStatus !== "206",
          }}
          changeCallback={(value: any) => {
            handleAfterWorkReasonToggle();
          }}
        />
        <ASelect.Form name="restReason" codeType="site" msize={"100px"} selectCode={{codeName:"203"}} isPlaceholder={false} 
          base={{
            disabled: callStatus !== "203",
          }}
          changeCallback={(value: any) => {
            handleCallWaitToggle();
          }}
          />
      </AForm>
    </FlexBox>
  );
};

