import React from "react";
import { SxProps, TextField, TextFieldProps } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

// TextFieldProps 전체 상속, 단 name과 label은 제거
interface AFormTextFieldProps {
  name: string; // 필수로 추가
  msize?: number|string;
  base?: Omit<AFormBaseItemProps, "name" | "children">; 
  options?:TextFieldProps
  type?:string
  multiline?:boolean
  rows?:number
}

export const AFormTextField: React.FC<AFormTextFieldProps> = ({
  name,
  msize = 0,
  base,
  options,
  type,
  multiline=false,
  rows=4
}) => {
  const { sx: optionSx, ...restOptions } = options || {};
  const hasFlex = (optionSx as any)?.flex !== undefined; // ⭐ flex가 있는지 확인
  
  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <TextField
          {...field}
          fullWidth={msize === 0 && !hasFlex} // ⭐ flex가 있으면 fullWidth 비활성화
          error={!!error}
          multiline={multiline}
          minRows={multiline ? rows : undefined}
          maxRows={multiline ? 10 : undefined}
          sx={{
            ...(hasFlex ? {} : {
              width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
            }),
            ...(optionSx || {}),
          }}
          type={type}
          {...restOptions } 
        />
      )}
    </AFormBaseItem>
  );
};
