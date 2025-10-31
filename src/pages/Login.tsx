// src/pages/LoginPage.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Box, Typography, TableRow, TableCell } from "@mui/material";
import { useAutoMutation } from "@/hooks/useAutoMutation";
import { useNavigate } from "react-router-dom";
import { AForm, AFormTextField, AFormNumber } from "@/components/Form";
import { useAppDispatch } from "@/store/hooks";
import { showAlert, clearAllDialogs } from "@/store/slices/dialogSlice";
import { showToast } from "@/store/slices/toastSlice";
import { setUser } from "@/store/slices/userSlice";
import type { LoginRequestDto } from "@/api/generated/models/login-request-dto";
import type { ApiResponseLoginResponseDto } from "@/api/generated/models/api-response-login-response-dto";

const loginSchema = z.object({
  id: z.string().min(1, "아이디를 입력하세요"),
  passwd: z.string().min(1, "비밀번호를 입력하세요"),
  dn: z.number().optional(),
});

export default function LoginPage() {
  console.log("🔵 LoginPage 렌더링됨");
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  
  const methods = useForm<LoginRequestDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: "",
      passwd: "",
      dn: undefined,
    },
  });

  const loginMutation = useAutoMutation<ApiResponseLoginResponseDto, LoginRequestDto>("/api/auth/login", "POST", {
    onSuccess: async (resData) => {
      console.log("✅ 로그인 API 전체 응답:", resData);
      
      // success 체크
      if (!resData.success || !resData.data) {
        dispatch(showAlert({ 
          message: resData.message || "로그인 실패", 
          type: "error",
          title: "로그인 오류"
        }));
        return;
      }
      
      const data = resData.data; // 타입 안전하게 접근
      console.log("✅ 로그인 성공 데이터:", data);
      
      // 이전 에러 다이얼로그 닫기
      dispatch(clearAllDialogs());
      
      // 1. localStorage에 토큰과 사용자 정보 저장 (새로고침 대비)
      const token = data.accessToken || "";
      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("⚠️ 토큰이 응답에 없습니다!");
      }
      localStorage.setItem("isLoggedIn", "true");
      
      localStorage.setItem("user", JSON.stringify({
        userId: data.userId,
        username: data.username,
        name: data.name,
        email: data.email,
        role: data.role,
        centerId: data.centerId,
      }));
      
      // 2. Redux store에 사용자 정보 저장 (빠른 접근)
      dispatch(setUser({
        userId: data.userId || null,
        username: data.username || null,
        name: data.name || null,
        email: data.email || null,
        role: data.role || null,
        centerId: data.centerId || null,
        accessToken: data.accessToken || null,
        refreshToken: data.refreshToken || null,
        tokenType: data.tokenType || null,
      }));
      
      dispatch(showToast({ 
        message: resData.message || "로그인 성공!", 
        severity: "success" 
      }));
      
      // mutation 에러 상태 초기화
      loginMutation.reset();
      
      console.log("🔄 메인 화면으로 이동...");
      navigate("/"); // 로그인 성공 후 메인 화면으로
    },
    onError: (err: any) => {
      dispatch(showAlert({ 
        message: err.message || "로그인 실패", 
        type: "error",
        title: "로그인 오류"
      }));
    },
  });

  const onSubmit = (data: LoginRequestDto) => {
    loginMutation.mutate(data);
  };

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
          {/* 아이디 / 비밀번호 */}
          <TableRow>
            <TableCell>
                <AFormTextField name="id" options={{label:"아이디"}} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <AFormTextField name="passwd" type="password" options={{label:"패스워드"}} />
            </TableCell>
          </TableRow>
          {/* 내선번호 */}
          <TableRow>
            <TableCell>
              <AFormNumber name="dn" options={{label:"내선"}} />
            </TableCell>
          </TableRow>
          <TableRow>
          <TableCell>
            <Button type="submit" variant="contained" fullWidth>
              로그인
            </Button>
          </TableCell>
        </TableRow>
        </AForm>
      </Card>
    </Box>
  );
}
