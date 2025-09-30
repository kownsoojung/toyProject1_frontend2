import React, { ReactElement, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Tooltip } from "@mui/material";
import { makeRules, MakeRulesOptions } from "@/validation/makeRules";

export interface AFormBaseItemProps {
  name: string;
  label: string;
  makeRule?: MakeRulesOptions;
  children: (fieldProps: any, error?: string) => ReactElement;
  hidden?: boolean;
  disabled?:boolean;
}

export const AFormBaseItem: React.FC<AFormBaseItemProps> = ({
  name,
  label,
  makeRule = {},
  children,
  hidden = false,
  disabled=false,
}) => {
  const { control, formState } = useFormContext();
  if (hidden) return null;

  return (
    <Controller
      name={name}
      control={control}
      rules={makeRules(label, makeRule)}
      
      render={({ field, fieldState }) => {
        const showError = formState.isSubmitted && fieldState.error;
        const errorMessage = showError ? fieldState.error?.message : undefined;
        const fieldProps = { ...field, disabled };
        return (
          <Tooltip
            title={errorMessage || ""}
            placement="top-end"
            arrow={false}
            open={!!errorMessage}
            disableInteractive
            slotProps={{
              popper: {
                modifiers: [
                  { name: "flip", enabled: false },
                  { name: "offset", options: { offset: [0, -13] } },
                  { name: "preventOverflow", options: { padding: 8 } },
                ],
              },
            }}
          >
            {children(fieldProps, errorMessage)}
          </Tooltip>
        );
      }}
    />
  );
};
