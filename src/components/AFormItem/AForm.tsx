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
  buttonTop,
  buttonBottom,
  title,
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
        {/* 상단 영역 */}
        {(title || buttonTop) && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
            {title && <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>}
            {buttonTop && <Box display="flex" gap={1}>{buttonTop}</Box>}
          </Box>
        )}

        {/* 테이블 폼 영역 */}
        <TableContainer component={Paper} sx={{ boxShadow: "none",}}>
          <StyledTable type={type}>
            <colgroup>{cols}</colgroup>
            <TableBody>{children}</TableBody>
          </StyledTable>
        </TableContainer>

        {/* 하단 버튼 */}
        {buttonBottom && (
          <Box display="flex" mt={2} gap={1}>
            {buttonBottom}
          </Box>
        )}
      </form>
    </FormProvider>
  );
}
