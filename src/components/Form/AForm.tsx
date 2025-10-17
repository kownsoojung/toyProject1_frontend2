import { StyledTable } from "@/styles/theme";
import { Box, Paper, Table, TableBody, TableContainer, TableContainerProps } from "@mui/material";
import React, { ReactNode, useMemo } from "react";
import { FormProvider, UseFormReturn, SubmitHandler } from "react-hook-form";


interface AFormProps {
  children: ReactNode;
  labelSize?: number;
  colCnt?: number;
  type?: "search" | "register" | "form";
  onSubmit: SubmitHandler<any>;
  methods: UseFormReturn<any>;
  minHeight?: number; // 바깥 최소 높이
  isLabel?:boolean
  options?:TableContainerProps
  marginB?:string|number
}


export default function AForm({
  children,
  labelSize = 100,
  colCnt=2,
  type = "search",
  onSubmit,
  methods,
  isLabel=true,
  options,
  marginB=2
}: AFormProps) {
  const { handleSubmit } = methods; // ✅ methods에서 꺼냄

  const columns = useMemo(() => {
    if (colCnt) return colCnt;
    return type === "search" ? 4 : 2;
  }, [colCnt, type]);

  const cols = useMemo(() => {
    const arr = [];
    for (let i = 0; i < columns; i++) {
      if (isLabel) arr.push(<col key={`label-${i}`} style={{ width: labelSize }} />);
      arr.push(<col key={`input-${i}`} style={{ width: "auto" }} />);
    }
    return arr;
  }, [columns, labelSize]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 테이블 폼 영역 */}
        <TableContainer component={Paper} sx={{ boxShadow: "none", mb: marginB}} {...options} >
          <StyledTable type={type}>
            <colgroup>{cols}</colgroup>
            <TableBody>{children}</TableBody>
          </StyledTable>
        </TableContainer>
      </form>
    </FormProvider>
  );
}

