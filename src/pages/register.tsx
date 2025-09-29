// src/components/RegisterTableForm.tsx
import React from "react";
import {
  useForm,
  FormProvider,
  Controller,
} from "react-hook-form";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { AFormTextField } from "@/components/AFormItem/AFormTextField";

export default function RegisterTableForm() {
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      textbox: "",
      checkbox: false,
      date: "",
      searchDate: "",
    },
  });

  const { handleSubmit, reset } = methods;
  const onSubmit = (data: any) => console.log("제출 데이터:", data);

  return (
    <FormProvider {...methods}>
      <Card sx={{ p: 2, width: 800, borderRadius: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <colgroup>
                <col style={{ width: 100 }} /> {/* 아이디 */}
                <col style={{ width: "auto" }} /> {/* 입력 필드 */}
                <col style={{ width: 100 }} /> {/* 비밀번호 */}
                <col style={{ width: "auto" }} /> {/* 입력 필드 */}
              </colgroup>
              <TableBody>
                {/* 아이디 / 비밀번호 */}
                <TableRow>
                  <TableCell className="form-th required">아이디</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <AFormTextField
                        name="username"
                        label="아이디"
                        makeRule={{ required: true }}
                        msize={80}
                      />
                      <Button variant="outlined" size="small">
                        중복확인
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell className="form-th required">비밀번호</TableCell>
                  <TableCell>
                    <AFormTextField
                      name="password"
                      label="비밀번호"
                      makeRule={{ required: true }}
                      type="password"
                    />
                  </TableCell>
                </TableRow>

                {/* 이메일 */}
                <TableRow>
                  <TableCell className="form-th required">이메일</TableCell>
                  <TableCell colSpan={3}>
                    <AFormTextField
                      name="email"
                      label="이메일"
                      makeRule={{ required: true }}
                    />
                  </TableCell>
                </TableRow>

                {/* 내용 */}
                <TableRow>
                  <TableCell className="form-th">내용</TableCell>
                  <TableCell colSpan={3}>
                    <AFormTextField
                      name="textbox"
                      label="내용"
                      multiline
                      rows={4}
                    />
                  </TableCell>
                </TableRow>

                {/* 체크박스 / 날짜 */}
                <TableRow>
                  <TableCell className="form-th">체크박스</TableCell>
                  <TableCell>
                    <Controller
                      name="checkbox"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} />}
                          label="체크박스"
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell className="form-th">날짜</TableCell>
                  <TableCell>
                    <AFormTextField
                      name="date"
                      label="날짜"
                      type="datetime-local"
                      size="small"
                      slotProps={{
                        input: {
                          min: "2025-01-01T00:00",
                          max: "2025-12-31T23:59",
                        } as any, // <-- 타입 단언
                      }}
                    />
                  </TableCell>
                </TableRow>

                {/* 날짜 범위 */}
                <TableRow>
                  <TableCell className="form-th">조회일자</TableCell>
                  <TableCell colSpan={3}>
                    <AFormTextField
                      name="searchDate"
                      label="조회일자"
                      type="date"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* 버튼 */}
          <Box display="flex" mt={2} gap={1}>
            <Button type="submit" variant="contained">
              제출
            </Button>
            <Button variant="outlined" color="error" onClick={() => reset()}>
              초기화
            </Button>
          </Box>
        </form>
      </Card>
    </FormProvider>
  );
}
