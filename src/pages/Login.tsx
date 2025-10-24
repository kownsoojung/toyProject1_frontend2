// src/pages/LoginPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Card, Box, Typography, Alert, TableRow, TableCell } from "@mui/material";
import { useAutoMutation } from "@/hooks/useAutoMutation";
import { useNavigate } from "react-router-dom";
import { AForm, AFormTextField } from "@/components/Form";
import { useAppDispatch } from "@/store/hooks";
import { showAlert } from "@/store/slices/dialogSlice";
import { showToast } from "@/store/slices/toastSlice";

const loginSchema = z.object({
  loginID: z.string().min(1, "아이디를 입력하세요"),
  loginPWD: z.string().min(1, "비밀번호를 입력하세요"),
  dnID: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  console.log("🔵 LoginPage 렌더링됨");
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // 로그인 페이지 진입 시 localStorage 확인
  React.useEffect(() => {
    console.log("📝 localStorage 상태:", {
      isLoggedIn: localStorage.getItem("isLoggedIn"),
      token: localStorage.getItem("token")
    });
  }, []);
  
  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginID: "",
      loginPWD: "",
      dnID: "",
    },
  });

  const loginMutation = useAutoMutation<{ token: string }, LoginForm>("/api/login", "POST", {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      dispatch(showToast({ message: "로그인 성공!", severity: "success" }));
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

  const onSubmit = (data: LoginForm) => {
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

        {loginMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(loginMutation.error as Error)?.message || "로그인 실패"}
          </Alert>
        )}

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
                <AFormTextField name="loginID" msize={80} options={{label:"id"}} />
            </TableCell>
          </TableRow>
          <TableRow>

            <TableCell>
              <AFormTextField name="loginPWD" type="password"options={{label:"패스워드"}} />
            </TableCell>
          </TableRow>
          {/* 이메일 */}
          <TableRow>
            <TableCell >
              <AFormTextField name="dnID"  options={{label:"내선", sx:{input: {maxLength:10}}}}  />
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
