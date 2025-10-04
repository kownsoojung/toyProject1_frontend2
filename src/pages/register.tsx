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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateDateRanges, validateTimeRanges } from "@/validation/Validation";
import { AFormDate } from "@/components/AFormItem/AFormDate";
import { AFormTime } from "@/components/AFormItem/AFormTimeRange";
export default function RegisterTableForm() {
  

const registerSchema = z.object({
  username: z.string().nonempty().min(3),
  password:  z.string().nonempty(),
  email:  z.email(),
  textbox: z.string(),
  start :z.date().optional(),
  endDate : z.date().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
})
.superRefine((data, ctx) => {
  // 날짜 범위 검증
  validateDateRanges([
    { fieldStart: "start", fieldEnd: "endDate", type: "m", max: 2 },
  ])(data, ctx);

  // 시간 범위 검증
  validateTimeRanges([
    { fieldStart: "startTime", fieldEnd: "endTime", type: "m", maxDiff: 120 },
  ])(data, ctx);
});

  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      textbox: "",
      start :undefined,
      endDate: undefined,
      startTime:undefined,
      endTime:undefined

    },
    resolver: zodResolver(registerSchema), 
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
                      name="dd"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} />}
                          label="체크박스"
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell className="form-th">시간</TableCell>
                  <TableCell>
                    <AFormTime label="날짜" name="startTime" formatType="hour" endName="endTime"/>
                  </TableCell>
                </TableRow>

                {/* 날짜 범위 */}
                <TableRow>
                  <TableCell className="form-th">조회일자</TableCell>
                  <TableCell colSpan={3}>
                    <AFormDate label="test" name="start" endName="endDate" formatType="datetime" mStep={5} />
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

