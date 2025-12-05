import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

interface ATextFieldProps {
  msize?: number | string;
  options?: TextFieldProps;
  type?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  maxLength?: number;

  /** 독립 사용 */
  value?: string | null;
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

/* ===========================
   1) Base Component
   =========================== */
export const ATextFieldBase: React.FC<ATextFieldProps> = ({
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

  /** null-safe 처리 */
  const safeValue = value ?? "";

  /** 정규식 처리(숫자 + 사용자 regex 모두 지원) */
  const finalPattern = isNumeric ? /[^0-9]/g : regEx;

  /** input slotProps */
  const inputSlotProps: React.InputHTMLAttributes<HTMLInputElement> = {
    maxLength,
    inputMode: isNumeric ? "numeric" : undefined,
    readOnly,
  };

  const hasFlex = (optionSx as any)?.flex !== undefined;

  return (
    <TextField
      label={label}
      value={safeValue}
      onChange={(e) => {
        let v = e.target.value;

        if (finalPattern) {
          v = v.replace(finalPattern, "");
        }

        changeCallback?.(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter?.();
        }
      }}
      fullWidth={fullWidth ?? (msize === 0 && !hasFlex)}
      error={error}
      disabled={disabled}
      multiline={multiline}
      minRows={multiline ? rows : undefined}
      maxRows={multiline ? rows : undefined}
      type={type}
      sx={{
        ...(hasFlex
          ? {}
          : {
              width:
                typeof msize === "string"
                  ? msize
                  : msize === 0
                  ? "100%"
                  : `calc(100% - ${msize}px)`,
            }),
        ...(optionSx || {}),
      }}
      slotProps={{
        input: {
          ...(optionSlotProps?.input || {}),
          readOnly,
          endAdornment: icon ? (
            <InputAdornment position="end">{icon}</InputAdornment>
          ) : undefined,
        },
        htmlInput: {
          ...(optionSlotProps?.htmlInput || {}),
          ...inputSlotProps,
        },
      }}
      {...restOptions}
    />
  );
};

/* ===========================
   2) Form Component
   =========================== */
interface ATextFieldFormProps
  extends Omit<ATextFieldProps, "value" | "onChange" | "error" | "disabled"> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

export const ATextFieldForm: React.FC<ATextFieldFormProps> = ({
  name,
  base,
  ...props
}) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => {
        /** form value null-safe */
        const safeValue =
          field.value === null || field.value === undefined ? "" : field.value;

        const handleChange = (v: string) => {
          field.onChange(v);
          props.changeCallback?.(v);
        };

        return (
          <ATextFieldBase
            {...props}
            value={safeValue}
            changeCallback={handleChange}
            error={!!error}
            disabled={field.disabled}
          />
        );
      }}
    </AFormBaseItem>
  );
};

/* ===========================
   export
   =========================== */
export const ATextField = Object.assign(ATextFieldBase, {
  Form: ATextFieldForm,
});
