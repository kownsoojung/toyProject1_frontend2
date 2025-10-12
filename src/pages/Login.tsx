// src/pages/LoginPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Card, Box, Typography, Alert, TableRow, TableCell } from "@mui/material";
import { useAutoMutation } from "@/hooks/useAutoMutation";
import { useNavigate } from "react-router-dom";
import AForm from "@/components/AFormItem/AForm";
import { AFormTextField } from "@/components/AFormItem/AFormTextField";

const loginSchema = z.object({
  username: z.string().min(3, "아이디를 입력하세요"),
  password: z.string().min(3, "비밀번호를 입력하세요"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useAutoMutation<{ token: string }, LoginForm>("/api/login", "POST", {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/"); // 로그인 성공 후 메인 화면으로
    },
    onError: (err: any) => {
      alert(err.message || "로그인 실패");
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
          title="회원 등록"
          onSubmit={onSubmit}
          methods={methods}
          type="form"
          colCnt={1}
          isLabel={false}
        >
          {/* 아이디 / 비밀번호 */}
          <TableRow>
            <TableCell>
                <AFormTextField name="username" msize={80} options={{label:"id"}} />
            </TableCell>
          </TableRow>
          <TableRow>

            <TableCell>
              <AFormTextField name="password" type="password"options={{label:"패스워드"}} />
            </TableCell>
          </TableRow>
          {/* 이메일 */}
          <TableRow>
            <TableCell >
              <AFormTextField name="email" options={{label:"이메일"}} />
            </TableCell>
          </TableRow>

          
        </AForm>
      </Card>
    </Box>
  );
}
