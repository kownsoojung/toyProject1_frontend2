import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import React, { useState } from "react";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

interface ATextFieldProps {
  msize?: number | string;
  options?: TextFieldProps;
  type?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  maxLength?: number;
  // 독립 사용을 위한 props
  value?: string;
  changeCallback?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  label?: string;
  onEnter?: () => void;
  isNumeric?: boolean;
  regEx?: RegExp;
  readOnly?: boolean;
}

// 기본 TextField 컴포넌트 (순수 UI)
const ATextFieldBase: React.FC<ATextFieldProps> = ({
  msize = 0,
  options,
  type,
  multiline = false,
  rows = 4,
  icon,
  maxLength,
  value,
  changeCallback,
  disabled = false,
  error = false,
  fullWidth,
  label,
  onEnter,
  isNumeric = false,
  regEx,
  readOnly = false,
}) => {
  const { sx: optionSx, slotProps: optionSlotProps, ...restOptions } = options || {};
  const hasFlex = (optionSx as any)?.flex !== undefined;
  const finalPattern = isNumeric ?  /[^0-9]/g : regEx;
  
  const inputSlotProps: React.InputHTMLAttributes<HTMLInputElement> = {
    maxLength: maxLength,
    inputMode: isNumeric ? 'numeric' : undefined,
  };
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => {
        if (finalPattern) {
          e.target.value = e.target.value.replace(finalPattern, '');
       }

        if (changeCallback) {  
          changeCallback(e.target.value);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          onEnter();
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
      slotProps={{
        input: {
          readOnly: readOnly,
        },
        htmlInput: inputSlotProps ,
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
      {(field, error) => {
        const handleChange = (val: any) => {
          field.onChange(val);              // form 값 반영
          textFieldProps.changeCallback?.(val);         // 외부 전달
        };
        return (
        <ATextFieldBase
          
          {...textFieldProps}
          value={field.value}
          changeCallback={handleChange}
          error={!!error}
          disabled={field.disabled}
        />
      );
      }}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ATextField = Object.assign(ATextFieldBase, {
  Form: ATextFieldForm,
});

