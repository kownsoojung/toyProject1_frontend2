import React from "react";
import { TextField } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormContext } from "react-hook-form";
import { Dayjs } from "dayjs";

// DatePickerProps 전체 상속, 단 name과 label 제거
interface AFormDateProps extends Omit<DatePickerProps, "name" | "label">, Omit<AFormBaseItemProps, "children"> {
  name: string;
  label: string;
  msize?: number;
}

export const AFormDate: React.FC<AFormDateProps> = ({
  name,
  label,
  makeRule = {},
  msize = 0,
  ...rest
}) => {
  
  return (
    <AFormBaseItem name={name} label={label} makeRule={makeRule}>
      {(field, error) => (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            {...field}
            {...rest}
            value={field.value || null}
            onChange={(newValue) => field.onChange(newValue)}
            format="YYYY-MM-DD"
            slotProps={{
              textField: {
                error: !!error,
                helperText: error,
                fullWidth: msize === 0,
              },
            }}
          />
        </LocalizationProvider>
      )}
    </AFormBaseItem>
  );
};
