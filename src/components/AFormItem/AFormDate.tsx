// AFormDateUnified.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AFormBaseItem } from "./AFormBaseItem";
import { parseMinMax, roundToStep } from "@/utils/dateUtils";

export type PickerFormat = "year" | "month" | "date" | "datehour" | "dateminute" | "datetime";

interface AFormDateUnifiedProps {
  name: string;
  endName?: string;
  label: string;
  formatType?: PickerFormat;
  minDate?: string;
  maxDate?: string;
  hStep?: number;
  mStep?: number;
  sStep?: number;
}

const formatMap: Record<
  PickerFormat,
  { views: any[]; inputFormat: string; component: any; width?: number }
> = {
  year: { views: ["year"], inputFormat: "YYYY", component: DatePicker, width: 100 },
  month: { views: ["year", "month"], inputFormat: "YYYY-MM", component: DatePicker, width: 120 },
  date: { views: ["year", "month", "day"], inputFormat: "YYYY-MM-DD", component: DatePicker, width: 140 },
  datehour: { views: ["year", "month", "day", "hours"], inputFormat: "YYYY-MM-DD HH:mm", component: DateTimePicker, width: 200 },
  dateminute: { views: ["year", "month", "day", "hours", "minutes"], inputFormat: "YYYY-MM-DD HH:mm", component: DateTimePicker, width: 200 },
  datetime: { views: ["year", "month", "day", "hours", "minutes", "seconds"], inputFormat: "YYYY-MM-DD HH:mm:ss", component: DateTimePicker, width: 200 },
};


export const AFormDate: React.FC<AFormDateUnifiedProps> = ({
  name,
  endName,
  label,
  formatType = "date",
  minDate,
  maxDate,
  hStep = 1,
  mStep = 1,
  sStep = 1,
}) => {
  const { watch } = useFormContext();
  const startValue = name ? watch(name) : null;
  const endValue = endName ? watch(endName) : null;
  const { views, inputFormat, component: PickerComponent, width } = formatMap[formatType];

  const renderPicker = (field: any, error?: string, min?: Dayjs, max?: Dayjs) => {
    const value = field.value
      ? roundToStep(dayjs(field.value), hStep, mStep, sStep)
      : null; // 값 없으면 null로

    const handleChange = (val: Dayjs | null) => {
      if (val) field.onChange(roundToStep(val, hStep, mStep, sStep).toDate());
      else field.onChange(null);
    };

    return (
      <PickerComponent
        {...field}
        value={value} // null이면 빈값
        onChange={handleChange}
        minDate={min}
        maxDate={max}
        views={views}
        ampm={false}
        format={inputFormat}
        timeSteps={{ hours: hStep, minutes: mStep, seconds: sStep }}
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
      <AFormBaseItem name={name} label={label}>
        {(field, error) => renderPicker(field, error, parseMinMax(minDate), parseMinMax(maxDate))}
      </AFormBaseItem>
    );
  }

  if (endName) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <AFormBaseItem name={name} label={label}>
          {(field, error) =>
            renderPicker(
              field,
              error,
              parseMinMax(minDate),
              endValue ? roundToStep(dayjs(endValue), hStep, mStep, sStep) : parseMinMax(maxDate)
            )
          }
        </AFormBaseItem>

        <Box>~</Box>

        <AFormBaseItem name={endName} label="">
          {(field, error) =>
            renderPicker(
              field,
              error,
              startValue ? roundToStep(dayjs(startValue), hStep, mStep, sStep) : parseMinMax(minDate),
              parseMinMax(maxDate)
            )
          }
        </AFormBaseItem>
      </Box>
    );
  }

  return null;
};