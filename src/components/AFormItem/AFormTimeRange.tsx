// AFormTimeUnified.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { TimePicker } from "@mui/x-date-pickers";
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
}) => {
  const { watch } = useFormContext();
  const startValue = watch(name);
  const endValue = endName ? watch(endName) : null;

  const { views, inputFormat, width } = formatMap[formatType];

  const renderPicker = (field: any, error?: string) => {
    const value = field.value ? roundToStep(dayjs(field.value), hStep, mStep, sStep) : null;

    const handleChange = (val: Dayjs | null) => {
      if (val) field.onChange(roundToStep(val, hStep, mStep, sStep).toDate());
      else field.onChange(null);
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
      />
    );
  };

  if (!endName) {
    return (
      <AFormBaseItem name={name} >
        {(field, error) => renderPicker(field, error)}
      </AFormBaseItem>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <AFormBaseItem name={name} >
        {(field, error) => renderPicker(field, error)}
      </AFormBaseItem>

      <Box>~</Box>

      <AFormBaseItem name={endName} >
        {(field, error) => renderPicker(field, error)}
      </AFormBaseItem>
    </Box>
  );
};
