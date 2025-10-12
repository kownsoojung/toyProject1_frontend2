import { StyledTable } from "@/styles/theme";
import { Box, Paper, Table, TableBody, TableContainer } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { FormProvider, UseFormReturn, SubmitHandler } from "react-hook-form";


interface AFormProps {
  children: ReactNode;
  buttonTop?: ReactNode;
  buttonBottom?: ReactNode;
  title?: string | ReactNode; // 폼 상단 제목
  labelSize?: number;
  colCnt?: number;
  type?: "search" | "register";
  onSubmit: SubmitHandler<any>;
  methods: UseFormReturn<any>;
  minHeight?: number; // 바깥 최소 높이
}


export default function AForm({
  children,
  labelSize = 100,
  colCnt=2,
  type = "search",
  onSubmit,
  methods,
}: AFormProps) {
  const { handleSubmit } = methods; // ✅ methods에서 꺼냄

  const columns = useMemo(() => {
    if (colCnt) return colCnt;
    return type === "search" ? 4 : 2;
  }, [colCnt, type]);

  const cols = useMemo(() => {
    const arr = [];
    for (let i = 0; i < columns; i++) {
      arr.push(<col key={`label-${i}`} style={{ width: labelSize }} />);
      arr.push(<col key={`input-${i}`} style={{ width: "auto" }} />);
    }
    return arr;
  }, [columns, labelSize]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        

        {/* 테이블 폼 영역 */}
        <TableContainer component={Paper} sx={{ boxShadow: "none",}}>
          <StyledTable type={type}>
            <colgroup>{cols}</colgroup>
            <TableBody>{children}</TableBody>
          </StyledTable>
        </TableContainer>

        
      </form>
    </FormProvider>
  );
}
