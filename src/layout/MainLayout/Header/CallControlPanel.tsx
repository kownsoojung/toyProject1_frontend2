import { AForm, ASelect, ASlider, ATextField, FlexBox } from "@/components";
import { useDialog } from "@/hooks";
import { ctiWebSocketService } from "@/services/cti/CtiWebSocketService";
import { useAppSelector } from "@/store/hooks";
import { Call, CallEnd, GroupAdd, Keyboard, Pause, PhoneForwarded, PhoneInTalk, VolumeUp } from "@mui/icons-material";
import { Box, Popover, SelectChangeEvent, useForkRef } from "@mui/material";
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";

// ⭐ 노출할 함수들의 타입 정의
export interface CallControlPanelRef {
  setCallNumber: (callNumber?: string | null) => void;
}

interface CallControlPanelProps {
  callNumber?: string;
  customerId?: string;
}
/**
 * 하단 CallInfo: 전화번호 입력, 콜 컨트롤 버튼
 */
export const CallControlPanel = forwardRef<CallControlPanelRef, CallControlPanelProps>((props, ref) => {  
  useImperativeHandle(ref, () => ({
    setCallNumber: (callNumber?: string) => {
      methods.setValue("callNumber", callNumber);
    },
  }));

  const [openVolumePopover, setOpenVolumePopover] = useState(false);
  const [volume, setVolume] = useState(0);
  const [volumeAnchorEl, setVolumeAnchorEl] = useState<HTMLDivElement | null>(null);
  const callStatus = useAppSelector((state) => state.cti.callStatus);
  const currentCall = useAppSelector((state) => state.cti.currentCall);
  const isCallActive = callStatus === "205";
  const dialog = useDialog();
  const methods = useForm();
  const handleVolumeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isCallActive) return;
    setVolumeAnchorEl(event.currentTarget);
    setOpenVolumePopover(true);
  };

  const handleVolumeClose = () => {
    setOpenVolumePopover(false);
    setVolumeAnchorEl(null);
  };

  const getIconClassName = (color?: string, isNotActive?: boolean) => {
    const baseClass = "call-control-icon";
    const disabledClass = !isCallActive || isNotActive ? "disabled" : "";
    
    const colorClass = color && isCallActive ? `icon-${color}` : "";
    
    return [baseClass, disabledClass, colorClass].filter(Boolean).join(" ");
  };

  // ⭐ Call 버튼용 className (CSS에서 상태에 따라 활성화/비활성화 제어)
  const getCallIconClassName = () => {
    const baseClass = "call-control-icon icon-green";
    const disabledClass = callStatus !== "204" && callStatus !== "203" ? "disabled" : "";
    return [baseClass, disabledClass].filter(Boolean).join(" ");
  };

  // ⭐ Call 버튼 활성화 여부 (onClick 가드용)
  const isCallButtonEnabled = callStatus === "204" || callStatus === "203";

  return (
    <FlexBox id="callInfo" sxProps={{ marginLeft: 3, gap: 3 }} className={`call-status-${callStatus}`}>
      <AForm methods={methods} isTable={false} formStyle={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 0 }}  >
        <ATextField.Form
          name="callNumber"
          msize={"130px"}
          base={{
            disabled: !isCallButtonEnabled,
          }}
          regEx={/[^0-9#*]/g}
          icon={
            <Keyboard 
              className={getCallIconClassName()}
              onClick={() => {
                if (!isCallButtonEnabled) return;
              }}
            />
          }
        />
        <ASelect.Form
          codeType="sendCall" 
          name="autoCall"
          msize={"100px"}
          base={{
            disabled: !isCallButtonEnabled,
          }}
        />
        {/* CTI 상태에 따라 아이콘 색상 변경 */}
        <Call 
          className={getCallIconClassName()}
          sx={{ 
            borderRadius: "50%", 
            backgroundColor: "#fff", 
            padding: 0.4
          }}
          onClick={() => {
            
            const callNumber = methods.getValues("callNumber");
            const autoCall = methods.getValues("autoCall");

            if (!callNumber) {
              dialog.error("전화번호를 입력해주세요.");
              return;
            }

            if (autoCall) {
              dialog.confirm("자동 전화 번호를 선택하였습니다. 전화를 발신하시겠습니까?", "전화 발신")
                .then((isOk: boolean) => {
                  if (!isOk) return;
                  ctiWebSocketService.makeCall(callNumber, autoCall);
                })
                .catch(() => {
                  return;
                });
              return;
            }

            ctiWebSocketService.makeCall(callNumber, autoCall);
            
          }}
        />
        <Box component="div" onClick={handleVolumeClick}
          sx={{ 
            display: 'inline-flex',
          }}
        >
          <VolumeUp 
            className={getIconClassName("green")}
            sx={{ 
              borderRadius: "50%", 
              backgroundColor: "#fff", 
              padding: 0.4, 
              cursor: "pointer" 
            }} 
          />
        </Box>
        <Popover
          id="volume-popover"
          open={openVolumePopover}
          anchorEl={volumeAnchorEl}
          onClose={handleVolumeClose}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{margin : 1}}
          className={getIconClassName("green")}
        >
          <div style={{ padding: '0 15px', minWidth: '200px' }}>
            <ASlider
              value={volume}
              onChange={(value) => {
                if (!isCallActive) return;
                setVolume(value as number);
              }}
              disabled={!isCallActive}
              options={{ min: 0, max: 100, step: 1, orientation: 'horizontal', sx: { margin: '0 0px' } }}
            />
          </div>
        </Popover>
        {false ? (
          <Pause 
            className={getIconClassName("orange")}
            onClick={() => {
              if (!isCallActive) return;
              // 보류 로직
            }}
          />
        ) : (
          <Pause 
            className={getIconClassName("red")}
            onClick={() => {
              if (!isCallActive) return;
            }}
          />
        )}
        {false ? (
          <PhoneInTalk className={getIconClassName("green")}/>
        ) : (
          <PhoneInTalk className={getIconClassName()} />
        )}
        <CallEnd 
          className={getIconClassName("red")}
          onClick={() => {
            if (!isCallActive) return;
            ctiWebSocketService.clearCall();
          }}
        />
        <PhoneForwarded 
          className={getIconClassName()}
          sx={{ color: "#6A6A6A", borderRadius: "50%", backgroundColor: "#fff", padding: 0.4 }} 
          onClick={() => {
            if (!isCallActive) return;
            // 전환 로직
          }}
        />
        <GroupAdd 
          className={getIconClassName()}
          sx={{ color: "#6A6A6A", borderRadius: "50%", backgroundColor: "#fff", padding: 0.4 }} 
          onClick={() => {
            if (!isCallActive) return;
            // 회의 로직
          }}
        />
      </AForm>
    </FlexBox>
  );
});

