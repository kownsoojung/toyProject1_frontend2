import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
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
  rows=0
}) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <TextField
          {...field}
          fullWidth={msize === 0}
          error={!!error}
          multiline={multiline}
          rows={rows}
          sx={{
            width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
          }}
          type={type}
          {...options} // 여기서 select, multiline, rows 등 모두 전달 가능
        />
      )}
    </AFormBaseItem>
  );
};
