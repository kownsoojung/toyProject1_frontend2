// AFormBaseItem.tsx
import React, { forwardRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Tooltip } from "@mui/material";

export interface AFormBaseItemProps {
  name: string;
  label: string;
  children: (fieldProps: any, error?: string) => React.ReactElement;
  hidden?: boolean;
  disabled?: boolean;
}

export const AFormBaseItem = forwardRef<HTMLElement, AFormBaseItemProps>(
  ({ name, label, children, hidden = false, disabled = false }, ref) => {
    const { control } = useFormContext();
    if (hidden) return null;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const fieldProps = { ...field, disabled, ref }; // ref 전달
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
              <span>{children(fieldProps, errorMessage)}</span>
            </Tooltip>
          );
        }}
      />
    );
  }
);

AFormBaseItem.displayName = "AFormBaseItem";
