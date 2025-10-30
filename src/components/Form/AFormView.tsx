import { StyledTable } from "@/styles/theme";
import { Paper, TableBody, TableContainer, TableContainerProps } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";

interface AFormViewProps {
  children: ReactNode;
  labelSize?: number;
  colCnt?: number;
  type?: "search" | "register" | "form";
  minHeight?: number;
  isLabel?: boolean;
  options?: TableContainerProps;
  marginB?: string | number;
  methods?: UseFormReturn<any>; // 선택적으로 react-hook-form 지원
  onSubmit?: (data: any) => void;
}

export default function AFormView({
  children,
  labelSize = 100,
  colCnt = 2,
  type = "search",
  isLabel = true,
  options,
  marginB = 2,
  methods,
  onSubmit
}: AFormViewProps) {
  const columns = useMemo(() => colCnt, [colCnt]);

  const cols = useMemo(() => {
    const arr = [];
    for (let i = 0; i < columns; i++) {
      if (isLabel) arr.push(<col key={`label-${i}`} style={{ width: labelSize }} />);
      arr.push(<col key={`input-${i}`} style={{ width: "auto" }} />);
    }
    return arr;
  }, [columns, labelSize, isLabel]);

  const tableContent = (
    <TableContainer component={Paper} sx={{ boxShadow: "none", mb: marginB }} {...options}>
      <StyledTable type={type}>
        <colgroup>{cols}</colgroup>
        <TableBody>{children}</TableBody>
      </StyledTable>
    </TableContainer>
  );

  // methods가 있으면 FormProvider로 감싸고, 없으면 그냥 표출
  if (methods && onSubmit) {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {tableContent}
        </form>
      </FormProvider>
    );
  }

  return tableContent;
}

