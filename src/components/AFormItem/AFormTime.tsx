// AFormTimeUnified.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { TimePicker, TimePickerProps } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { roundToStep } from "@/utils/dateUtils";

export type TimeFormat = "hour" | "minute" | "second";

interface AFormTimeUnifiedProps{
  name: string;
  endName?: string; // 범위일 때
  formatType?: TimeFormat;
  hStep?: number;
  mStep?: number;
  sStep?: number;
  base?:AFormBaseItemProps;
  options?:TimePickerProps
  endOptions?:TimePickerProps
}

const formatMap: Record<
  TimeFormat,
  { views: any[]; inputFormat: string; width?: number }
> = {
  hour: { views: ["hours"], inputFormat: "HH", width: 80 },
  minute: { views: ["hours", "minutes"], inputFormat: "HH:mm", width: 120 },
  second: { views: ["hours", "minutes", "seconds"], inputFormat: "HH:mm:ss", width: 160 },
};


export const AFormTime: React.FC<AFormTimeUnifiedProps> = ({
  name,
  endName,
  formatType = "minute",
  hStep = 1,
  mStep = 1,
  sStep = 1,
  base,
  options,endOptions
}) => {
  const { watch } = useFormContext();
  const startValue = watch(name);
  const endValue = endName ? watch(endName) : null;

  const { views, inputFormat, width } = formatMap[formatType];

  const renderPicker = (field: any, error?: string, option?:TimePickerProps) => {
    const value = field.value ? roundToStep(dayjs(field.value), hStep, mStep, sStep) : null;

    const handleChange = (val: Dayjs | null) => {
      if (val) {
        const rounded = roundToStep(val, hStep, mStep, sStep);
        const formatted = rounded.format("YYYYMMDDHHmmss");
        field.onChange(formatted);
      } else {
        field.onChange(null);
      }
    };

    return (
      <TimePicker
        {...field}
        value={value} // null이면 빈값
        onChange={handleChange}
        views={views}
        ampm={false}
        format={inputFormat}
        ampmInClock={false}
        slotProps={{
          textField: {
            size: "small",
            error: !!error,
            sx: width ? { width } : undefined,
          },
        }}
        {...option}
      />
    );
  };

  if (!endName) {
    return (
      <AFormBaseItem name={name} {...base}>
        {(field, error) => renderPicker(field, error, options)}
      </AFormBaseItem>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AFormBaseItem name={name} {...base}>
        {(field, error) => renderPicker(field, error, options)}
      </AFormBaseItem>

      <Box>~</Box>

      <AFormBaseItem name={endName} {...base}>
        {(field, error) => renderPicker(field, error, endOptions)}
      </AFormBaseItem>
    </Box>
  );
};
