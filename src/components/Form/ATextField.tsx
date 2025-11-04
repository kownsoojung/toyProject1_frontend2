import React from "react";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

interface ATextFieldProps {
  msize?: number | string;
  options?: TextFieldProps;
  type?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  // 독립 사용을 위한 props
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  label?: string;
}

// 기본 TextField 컴포넌트 (순수 UI)
const ATextFieldBase: React.FC<ATextFieldProps> = ({
  msize = 0,
  options,
  type,
  multiline = false,
  rows = 4,
  icon,
  value,
  onChange,
  disabled = false,
  error = false,
  fullWidth,
  label,
}) => {
  const { sx: optionSx, InputProps: optionInputProps, ...restOptions } = options || {};
  const hasFlex = (optionSx as any)?.flex !== undefined;

  return (
    <TextField
      label={label}
      value={value ?? ""}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
      fullWidth={fullWidth ?? (msize === 0 && !hasFlex)}
      error={error}
      disabled={disabled}
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
      InputProps={{
        ...optionInputProps,
        ...(icon ? {
          endAdornment: (
            <InputAdornment position="end">
              {icon}
            </InputAdornment>
          ),
        } : {}),
      }}
      {...restOptions}
    />
  );
};

// Form 래퍼 컴포넌트
interface ATextFieldFormProps extends Omit<ATextFieldProps, 'value' | 'onChange' | 'error' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ATextFieldForm: React.FC<ATextFieldFormProps> = ({
  name,
  base,
  ...textFieldProps
}) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => (
        <ATextFieldBase
          
          {...textFieldProps}
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
export const ATextField = Object.assign(ATextFieldBase, {
  Form: ATextFieldForm,
});

