// src/pages/Login.tsx
import { AForm, ATextField } from "@/components/Form";
import { useAutoMutation, useDialog } from "@/hooks";
import { useAppDispatch } from "@/store/hooks";
import { clearAllDialogs, showAlert } from "@/store/slices/dialogSlice";
import { setUser } from "@/store/slices/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, TableCell, TableRow, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState, useCallback } from "react";

const loginSchema = z.object({
  id: z.string().min(1, "아이디를 입력하세요"),
  passwd: z.string().min(1, "비밀번호를 입력하세요"),
  dn: z.string().min(1, "내선번호를 입력하세요").refine((value) => !/\s/.test(value), {
    message: "내선번호에 공백이 포함될 수 없습니다.",
  }),
});

// loginCheck 응답 타입 (AS-IS와 동일한 구조 - 백엔드 ApiResponse<Map<String, Object>>)
interface LoginCheckResponse {
  success?: boolean;
  message?: string;
  data?: {
    result?: string | number; // "1"이면 성공
    message?: string;
    result_obj?: {
      code?: number;
      message?: string;
    };
    rssid?: string; // 중복 로그인 세션 ID (있으면 중복 로그인 상태)
    id?: string;
    name?: string;
    center_id?: number;
    centerId?: number;
    tenant_id?: number;
    tenantId?: number;
    first_Login?: boolean;
    firstLogin?: boolean;
    login_diff?: number;
    loginDiff?: number;
    login_last_time_diff?: number;
    loginLastTimeDiff?: number;
    unconnected_day?: number;
    unconnectedDay?: number;
    vdi_check?: number;
    vdiCheck?: number;
    isTwoFactor?: boolean;
    twoFactorChannel?: string;
    dn?: string;
    [key: string]: any;
  };
  // 백엔드가 Map을 직접 반환하는 경우
  result?: string | number;
  rssid?: string;
  id?: string;
  name?: string;
  center_id?: number;
  tenant_id?: number;
  first_Login?: boolean;
  login_diff?: number;
  login_last_time_diff?: number;
  unconnected_day?: number;
  vdi_check?: number;
  dn?: string;
  [key: string]: any;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  
  // 로그인 정보 임시 저장 (loginCheck 후 login 호출 시 사용)
  const [pendingLoginData, setPendingLoginData] = useState< null>(null);
  
  const methods = useForm<any>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: "",
      passwd: "",
      dn: "",
    },
  });

  // 1단계: loginCheck (중복 로그인 및 검증) - AS-IS와 동일한 플로우
  const loginCheckMutation = useAutoMutation<any>("/api/auth/loginCheck", "POST", {
    onSuccess: async (resData) => {
      console.log("✅ 로그인 체크 결과:", resData);
      
      // AS-IS: result가 "1"이 아니면 에러
      const result = resData.data?.result ?? resData.result;
      if (result !== "1" && result !== 1) {
        let errorMessage = "로그인 검증 실패";
        if (resData.data?.message) {
          errorMessage = resData.data.message;
        } else if (resData.message) {
          errorMessage = resData.message;
        } else if (resData.data?.result_obj?.message) {
          errorMessage = resData.data.result_obj.message;
        }
        dispatch(showAlert({ 
          message: errorMessage, 
          type: "error",
          title: "로그인 오류"
        }));
        setPendingLoginData(null);
        return;
      }
      
      const checkData = resData.data || resData;
      
      // AS-IS: VDI 체크 (백엔드에서 처리하도록 변경되었으므로 여기서는 체크 안 함)
      if (checkData?.vdi_check === 0) {
        dispatch(showAlert({ 
          message: "허용되지 않은 IP입니다. VDI 접속 후 다시 시도해 주세요.", 
          type: "error",
          title: "로그인 오류"
        }));
        setPendingLoginData(null);
        return;
      }
      
      // AS-IS: 첫 로그인 체크
      if (checkData?.first_Login) {
        // 비밀번호 변경 페이지로 이동하거나 처리
        dispatch(showAlert({ 
          message: "최초 로그인입니다. 비밀번호를 변경해주세요.", 
          type: "warning",
          title: "비밀번호 변경 필요"
        }));
        setPendingLoginData(null);
        return;
      }
      
      // AS-IS: 비밀번호 변경 필요 체크 (login_diff가 0이면 최초 로그인)
      /*if (checkData?.login_diff === 0) {
        dispatch(showAlert({ 
          message: "비밀번호를 변경해주세요.", 
          type: "warning",
          title: "비밀번호 변경 필요"
        }));
        setPendingLoginData(null);
        return;
      }*/
      
      // AS-IS: 중복 로그인 확인 (rssid가 있으면 중복 로그인 상태)
      if (checkData?.rssid && checkData.rssid !== "") {
        // 재접속 확인 다이얼로그
        const confirmed = window.confirm(
          "이미 로그인된 사용자입니다.\n재접속하시겠습니까?"
        );
        
        if (!confirmed) {
          // 취소하면 로그인 중단
          setPendingLoginData(null);
          return;
        }
        
        // 확인을 누른 경우 → loginPass 호출 (AS-IS와 동일)
        if (pendingLoginData) {
          loginPassMutation.mutate(pendingLoginData);
        }
      } else {
        // 중복 로그인이 없는 경우 → login 호출 (AS-IS와 동일)
        if (pendingLoginData) {
          loginMutation.mutate(pendingLoginData);
        }
      }
    },
    onError: (err: any) => {
      console.error("🔴 로그인 체크 에러:", err);
      
      if (err.status === "E2104") {
        
        dialog.error("패스워드를 변경해주세요.");
        return;
      } else {

        let errorMessage = "로그인 검증 실패";
        if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      dialog.error(errorMessage);
    }
      
      setPendingLoginData(null);
    },
  });

  // 2단계: 중복 로그인 시 기존 세션 삭제 후 로그인 (AS-IS loginPass)
  const loginPassMutation = useAutoMutation<any>("/api/auth/loginPass", "POST", {
    onSuccess: async (resData) => {
      // loginPass 성공 시 login과 동일한 처리
      handleLoginSuccess(resData);
    },
    onError: (err: any) => {
      console.error("🔴 로그인 Pass 에러:", err);
      
      let errorMessage = "로그인 실패";
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      dialog.error(errorMessage);
      setPendingLoginData(null);
    },
  });

  // 3단계: 일반 로그인 (AS-IS login)
  const loginMutation = useAutoMutation<any>("/api/auth/login", "POST", {
    onSuccess: async (resData) => {
      handleLoginSuccess(resData);
    },
    onError: (err: any) => {
      console.error("🔴 로그인 에러:", err);
      
      let errorMessage = "로그인 실패";
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      dialog.error(errorMessage);
      setPendingLoginData(null);
    },
  });

  // 로그인 성공 처리 공통 함수 (AS-IS와 동일)
  const handleLoginSuccess = useCallback((resData) => {
    console.log("✅ 로그인 API 전체 응답:", resData);
    
    
    const resultData = resData.data;
    const result = resData.success;
    
    // AS-IS: result가 "1"이 아니면 에러
    if (result !== true) {
      let errorMessage = "로그인 실패";
      if (resData?.message) {
        errorMessage = resData.message;
      } else if (resData.message) {
        errorMessage = resData.message;
      } else if ((resultData as any)?.result_obj?.message) {
        errorMessage = (resultData as any).result_obj.message;
      }
      dispatch(showAlert({ 
        message: errorMessage, 
        type: "error",
        title: "로그인 오류"
      }));
      setPendingLoginData(null);
      return;
    }
    
    const data = resData.data;
    console.log("✅ 로그인 성공 데이터:", data);
    
    // 이전 에러 다이얼로그 닫기
    dispatch(clearAllDialogs());
    
    // AS-IS: emailAuthToken 사용
    const token =  data?.accessToken || "";
    if (token) {
      localStorage.setItem("token", token);
    } else {
      console.warn("⚠️ 토큰이 응답에 없습니다!");
    }
    localStorage.setItem("isLoggedIn", "true");
    
    // localStorage에 토큰과 사용자 정보 저장 (AS-IS와 동일한 필드)
    localStorage.setItem("user", JSON.stringify({
      id: data?.id,
      name: data?.name,
      email: data?.email,
      roleId: data?.roleId,
      centerId: data?.centerId,
      tenantId: data?.tenantId,
      groupId: data?.groupId,
      partId: data?.partId ,
      uid: data?.uid,
      level: data?.level,
      dn: data?.dn,
      customInfo: data?.customInfo,
      rssid: data?.rssid,
      optionInfo: data?.optionInfo,
    }));
    
    // Redux store에 사용자 정보 저장
    dispatch(setUser({
      ...data,
      userId: data?.id ?? null,
    }));
    
    dispatch(showAlert({ 
      message: resData.message || "로그인 성공!", 
      type: "success",
      autoClose: 2000
    }));
    
    // mutation 에러 상태 초기화
    loginMutation.reset();
    loginCheckMutation.reset();
    loginPassMutation.reset();
    setPendingLoginData(null);
    
    console.log("🔄 메인 화면으로 이동...");
    navigate("/");
  }, [dispatch, navigate, loginMutation, loginCheckMutation, loginPassMutation]);

  const onSubmit = useCallback((data) => {
    // 로그인 정보 임시 저장
    setPendingLoginData(data);
    
    // AS-IS와 동일: 1단계: loginCheck 먼저 호출
    loginCheckMutation.mutate(data);
  }, [loginCheckMutation]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ p: 4, width: 400, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          로그인
        </Typography>

        <AForm
          onSubmit={onSubmit}
          methods={methods}
          type="form"
          colCnt={1}
          isLabel={false}
        >
          <TableRow>
            <TableCell>
              <ATextField.Form name="id" label="아이디" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ATextField.Form name="passwd" type="password" label="패스워드" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <ATextField.Form name="dn" label="내선" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={loginCheckMutation.isPending || loginMutation.isPending || loginPassMutation.isPending}
              >
                {loginCheckMutation.isPending || loginMutation.isPending || loginPassMutation.isPending
                  ? "로그인 중..." 
                  : "로그인"}
              </Button>
            </TableCell>
          </TableRow>
        </AForm>
      </Card>
    </Box>
  );
}