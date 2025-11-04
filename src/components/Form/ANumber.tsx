import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

interface ANumberProps {
  msize?: number | string;
  options?: Omit<TextFieldProps, "type">;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  // 독립 사용을 위한 props
  value?: number;
  onChange?: (value: number | undefined) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

// 기본 Number 컴포넌트 (순수 UI)
const ANumberBase: React.FC<ANumberProps> = ({
  msize = 0,
  options,
  allowDecimal = false,
  min,
  max,
  value,
  onChange,
  disabled = false,
  error = false,
  fullWidth,
}) => {
  const { sx: optionSx, onChange: optionsOnChange, ...restOptions } = options || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 빈 값인 경우 undefined로 설정
    if (inputValue === "" || inputValue === null) {
      if (onChange) {
        onChange(undefined);
      }
      if (optionsOnChange) {
        optionsOnChange(e);
      }
      return;
    }

    // 숫자 변환
    const numValue = allowDecimal ? parseFloat(inputValue) : parseInt(inputValue, 10);
    
    // NaN 체크
    if (isNaN(numValue)) {
      if (onChange) {
        onChange(undefined);
      }
      if (optionsOnChange) {
        optionsOnChange(e);
      }
      return;
    }

    // min/max 체크
    let finalValue = numValue;
    if (min !== undefined && numValue < min) finalValue = min;
    if (max !== undefined && numValue > max) finalValue = max;

    if (onChange) {
      onChange(finalValue);
    }
    
    if (optionsOnChange) {
      optionsOnChange(e);
    }
  };

  return (
    <TextField
      value={value ?? ""}
      onChange={handleChange}
      fullWidth={fullWidth ?? (msize === 0)}
      error={error}
      disabled={disabled}
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
  );
};

// Form 래퍼 컴포넌트
interface ANumberFormProps extends Omit<ANumberProps, 'value' | 'onChange' | 'error' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ANumberForm: React.FC<ANumberFormProps> = ({
  name,
  base,
  ...numberProps
}) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <ANumberBase
          {...numberProps}
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          disabled={field.disabled}
        />
      )}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ANumber = Object.assign(ANumberBase, {
  Form: ANumberForm,
});

