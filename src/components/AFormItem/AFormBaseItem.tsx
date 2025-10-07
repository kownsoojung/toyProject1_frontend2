// AFormBaseItem.tsx
import React, { forwardRef } from "react";
import { Controller, ControllerProps, useFormContext } from "react-hook-form";
import { Tooltip } from "@mui/material";

export interface AFormBaseItemProps {
  name: string;
  children: (fieldProps: any, error?: string) => React.ReactElement;
  isShow?: boolean;
  baseProp?: ControllerProps;
}

export const AFormBaseItem = forwardRef<HTMLElement, AFormBaseItemProps>(
  ({ name, children, isShow = true, baseProp }, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        {...baseProp} // baseProp 전체 적용
        render={({ field, fieldState }) => {
          const errorMessage = fieldState.error?.message;
          const fieldProps = { ...field, disabled: baseProp?.disabled, ref }; // disabled는 baseProp에서만
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
              <span style={{ display: isShow ? "block" : "none" }}>{children(fieldProps, errorMessage)}</span>
            </Tooltip>
          );
        }}
      />
    );
  }
);

AFormBaseItem.displayName = "AFormBaseItem";
