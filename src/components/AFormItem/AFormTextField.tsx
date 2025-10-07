import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

// TextFieldProps 전체 상속, 단 name과 label은 제거
interface AFormTextFieldProps extends Omit<TextFieldProps, "name"> {
  name: string; // 필수로 추가
  msize?: number;
  base?: Omit<AFormBaseItemProps, "name" | "children">; 
}

export const AFormTextField: React.FC<AFormTextFieldProps> = ({
  name,
  msize = 0,
  base,
  ...rest
}) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <TextField
          {...field}
          fullWidth={msize === 0}
          error={!!error}
          sx={{
            width: msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
          }}
          {...rest} // 여기서 select, multiline, rows 등 모두 전달 가능
        />
      )}
    </AFormBaseItem>
  );
};
