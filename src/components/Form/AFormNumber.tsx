import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

interface AFormNumberProps {
  name: string; // 필수
  msize?: number | string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  options?: Omit<TextFieldProps, "type">;
  allowDecimal?: boolean; // 소수점 허용 여부 (기본: false)
  min?: number;
  max?: number;
}

export const AFormNumber: React.FC<AFormNumberProps> = ({
  name,
  msize = 0,
  base,
  options,
  allowDecimal = false,
  min,
  max,
}) => {
  const { sx: optionSx, onChange: optionsOnChange, ...restOptions } = options || {};

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            
            // 빈 값인 경우 undefined로 설정
            if (value === "" || value === null) {
              field.onChange(undefined);
              return;
            }

            // 숫자 변환
            const numValue = allowDecimal ? parseFloat(value) : parseInt(value, 10);
            
            // NaN 체크
            if (isNaN(numValue)) {
              field.onChange(undefined);
              return;
            }

            // min/max 체크
            let finalValue = numValue;
            if (min !== undefined && numValue < min) finalValue = min;
            if (max !== undefined && numValue > max) finalValue = max;

            field.onChange(finalValue);
            
            // options의 onChange도 호출
            if (optionsOnChange) {
              optionsOnChange(e);
            }
          }}
          fullWidth={msize === 0}
          error={!!error}
          type="number"
          inputProps={{
            min,
            max,
            step: allowDecimal ? "any" : 1,
          }}
          sx={{
            width: typeof msize === "string" ? msize : msize === 0 ? "100%" : `calc(100% - ${msize}px)`,
            ...(optionSx || {}),
          }}
          {...restOptions}
        />
      )}
    </AFormBaseItem>
  );
};

