import React, { useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { Phone, PhoneDisabled } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { showIncomingCallPopup, setCurrentCall, updateCurrentCall } from "@/store/slices/ctiSlice";
import { ctiWebSocketService } from "@/services/cti/CtiWebSocketService";
import { AFormGridColumn, AGrid } from "../Grid";
import { BasicButton } from "../Common";
import { store } from "@/store";

/**
 * 콜 인입 팝업 컴포넌트
 * CTI_DELIVERED 이벤트 시 표시됨
 */
export const CallIncomingPopup: React.FC = () => {
  const dispatch = useAppDispatch();
  const showPopup = useAppSelector((state) => state.cti.showIncomingCallPopup);
  const currentCall = useAppSelector((state) => state.cti.currentCall);

  const handleAnswer = async () => {
    // 통화 받기
    // 일반적으로 CTI_ESTABLISHED가 자동으로 발생하므로 별도 처리 불필요할 수 있음
    // 필요시 CTI 명령 전송 가능
    ctiWebSocketService.answerCall();
    dispatch(showIncomingCallPopup(false));
  };

  
  // 팝업 표시 조건: showPopup이 true이고 currentCall이 있고 상태가 RINGING일 때
  /*if (!showPopup || !currentCall || currentCall.status !== "RINGING") {
    return null;
  }*/
  
  return (
    <Dialog 
      open={showPopup} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        backgroundColor: '#1976d2',
        color: 'white',
        pb: 1
      }}>
        <Phone sx={{ fontSize: 28 }} />
        <Typography variant="h6">{currentCall?.ctype == 11 ? "수신 전화" : "발신 전화"}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            
            {currentCall?.phoneNumber}
          </Typography>
          {currentCall?.callerName && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {currentCall?.callerName}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {currentCall?.ctype == 11 ? "통화를 받으시겠습니까?" : "발신대상을 선택하세요."}
          </Typography>
        </Box>
      </DialogContent>
      {currentCall?.customerInfoList?.length >= 2 && (
        <DialogContent sx={{ pt: 3, pb: 2, height: 300 }}>
          <AGrid 
            gridOptions={{rowData: currentCall?.customerInfoList}}
            isPage={false}
            showToolbar={false}
            params={{
              callNumber: currentCall?.phoneNumber,
            }}
          >
            <AFormGridColumn name="name" headerName="고객명" width={100} />
            <AFormGridColumn name="callNumber" headerName="전화번호" width={100} />
            <AFormGridColumn name="mobile" headerName="핸드폰번호" width={100} />
            <AFormGridColumn name="joinTime" headerName="가입일자" width={100} />
            <AFormGridColumn name="_button" headerName="" suppressColumnsToolPanel={true} 
              width={80}
              cellRenderer={(params:any) => {
                
                const butonText = currentCall?.ctype == 11 ? "전화받기" : "전화걸기";
                return (
                  <BasicButton onClick={() => {
                    store.dispatch(updateCurrentCall({...currentCall, customerInfo: params.data, customerInfoList: []}));
                    handleAnswer()
                  }} text={butonText}/>
                );
              }}
          />
          </AGrid>
        </DialogContent>
      )}
      {currentCall?.customerInfoList?.length == 0 && currentCall?.ctype == 11 && (
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={handleAnswer} 
          color="primary" 
          variant="contained"
          startIcon={<Phone />}
          sx={{ flex: 1 }}
        >
          받기
        </Button>
      </DialogActions>
      )}
      
    </Dialog>
  );
};
