// src/components/RegisterTableForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Box, TableRow, TableCell } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateDateRanges, validateTimeRanges } from "@/validation/Validation";
import { AFormTextField } from "@/components/AFormItem/AFormTextField";
import { AFormDate } from "@/components/AFormItem/AFormDate";
import { AFormTime } from "@/components/AFormItem/AFormTime";
import AForm from "@/components/AFormItem/AForm";
import { AFormCheckbox } from "@/components/AFormItem/AFormCheckbox";
import { AFormRadio } from "@/components/AFormItem/AFormRadio";
import { AFormGrid } from "@/components/AFormItem/Grid/AGrid";

export default function RegisterTableForm() {
  const registerSchema = z.object({
    username: z.string().nonempty().min(3),
    password: z.string().nonempty(),
    email: z.string().email(),
    textbox: z.string(),
    start: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }).superRefine((data, ctx) => {
    validateDateRanges([{ fieldStart: "start", fieldEnd: "endDate", type: "m", max: 2 }])(data, ctx);
    validateTimeRanges([{ fieldStart: "startTime", fieldEnd: "endTime", type: "m", maxDiff: 120 }])(data, ctx);
  });

  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      textbox: "",
      start: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: any) => console.log("제출 데이터:", data);

  return (
    <>
    <Card sx={{ p: 2, width: 800, borderRadius: 2 }}>
      <AForm
        title="회원 등록"
        buttonBottom={
          <>
            <Button type="submit" variant="contained">제출</Button>
            <Button variant="outlined" color="error" onClick={() => methods.reset()}>초기화</Button>
          </>
        }
        
        onSubmit={onSubmit}
        methods={methods}
      >
        {/* 아이디 / 비밀번호 */}
        <TableRow>
          <TableCell component="th" className="required">아이디</TableCell>
          <TableCell>
              <AFormTextField name="username" msize={80} />
          </TableCell>
          <TableCell component="th" className="required">비밀번호</TableCell>
          <TableCell>
            <AFormTextField name="password" type="password" />
          </TableCell>
        </TableRow>

        {/* 이메일 */}
        <TableRow>
          <TableCell component="th" className="required">이메일</TableCell>
          <TableCell colSpan={3}>
            <AFormTextField name="email"  />
          </TableCell>
        </TableRow>

        {/* 내용 */}
        <TableRow>
          <TableCell component="th">내용</TableCell>
          <TableCell colSpan={3}>
            <AFormTextField name="textbox" multiline rows={4} />
          </TableCell>
        </TableRow>

        {/* 체크박스 / 시간 */}
        <TableRow>
          <TableCell component="th">체크박스</TableCell>
          <TableCell>
            <AFormCheckbox name="dd" checkList={{label:"test10", value:"test"}} />
          </TableCell>
          <TableCell component="th">시간</TableCell>
          <TableCell>
            <AFormTime  name="startTime" formatType="hour" endName="endTime" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell component="th">체크박스</TableCell>
          <TableCell>
            <AFormRadio name="dd" checkList={{label:"test10", value:"test"}} />
          </TableCell>
          <TableCell component="th">시간</TableCell>
          <TableCell>
            <AFormTime  name="startTime" formatType="hour" endName="endTime" />
          </TableCell>
        </TableRow>

        {/* 날짜 범위 */}
        <TableRow>
          <TableCell component="th">조회일자</TableCell>
          <TableCell colSpan={3}>
            <AFormDate label="test" name="start" endName="endDate" formatType="datetime" mStep={5} />
          </TableCell>
        </TableRow>
      </AForm>
    </Card>

    <AFormGrid url="" height={500} columnDefs={[
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    ]}>

    </AFormGrid>
    </>
  );
}
