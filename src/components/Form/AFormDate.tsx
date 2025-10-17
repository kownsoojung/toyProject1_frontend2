// AFormDateUnified.tsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { DatePicker, DatePickerProps, DateTimePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { parseMinMax, roundToStep } from "@/utils/dateUtils";

export type PickerFormat = "year" | "month" | "date" | "datehour" | "dateminute" | "datetime";

interface AFormDateUnifiedProps {
  name: string;
  endName?: string;
  label?: string;
  formatType?: PickerFormat;
  minDate?: string;
  maxDate?: string;
  hStep?: number;
  mStep?: number;
  sStep?: number;
  base?:AFormBaseItemProps;
  options?:DatePickerProps
  endOptions?:DatePickerProps
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
  formatType = "date",
  minDate,
  maxDate,
  hStep = 1,
  mStep = 1,
  sStep = 1,
  base,
  options,
  endOptions
}) => {
  const { watch } = useFormContext();
  const startValue = name ? watch(name) : null;
  const endValue = endName ? watch(endName) : null;
  const { views, inputFormat, component: PickerComponent, width } = formatMap[formatType];

  const renderPicker = (field: any, error?: string, min?: Dayjs, max?: Dayjs, option?:DatePickerProps) => {
    const value = field.value
      ? roundToStep(dayjs(field.value), hStep, mStep, sStep)
      : null; // 값 없으면 null로

    const handleChange = (val: Dayjs | null) => {
      if (val) {
        const rounded = roundToStep(val, hStep, mStep, sStep);
        const formatted = rounded.format("YYYYMMDDHHmmss");
        field.onChange(formatted);
      } else {
        field.onChange(null);
      }
    };

    // DateTimePicker에만 ampm prop 전달
    const isTimePicker = formatType.includes('hour') || formatType.includes('minute') || formatType === 'datetime';
    const pickerProps: any = {
      ...field,
      value,
      onChange: handleChange,
      minDate: min,
      maxDate: max,
      views,
      format: inputFormat,
      timeSteps: { hours: hStep, minutes: mStep, seconds: sStep },
      slotProps: {
        textField: {
          size: "small",
          error: !!error,
          sx: width ? { width } : undefined,
        },
      },
      ...option,
    };

    // 시간 선택기에만 ampm 추가
    if (isTimePicker) {
      pickerProps.ampm = false;
    }

    return <PickerComponent {...pickerProps} />;
  };

  if (!endName) {
    return (
      <AFormBaseItem name={name} {...base}>
        {(field, error) => renderPicker(field, error, parseMinMax(minDate), parseMinMax(maxDate), options)}
      </AFormBaseItem>
    );
  }

  if (endName) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <AFormBaseItem name={name} {...base}>
          {(field, error) =>
            renderPicker(
              field,
              error,
              parseMinMax(minDate),
              endValue ? roundToStep(dayjs(endValue), hStep, mStep, sStep) : parseMinMax(maxDate),
              options
            )
          }
        </AFormBaseItem>

        {base?.isShow !== false && <Box>~</Box>}

        <AFormBaseItem name={endName} {...base}>
          {(field, error) =>
            renderPicker(
              field,
              error,
              startValue ? roundToStep(dayjs(startValue), hStep, mStep, sStep) : parseMinMax(minDate),
              parseMinMax(maxDate),
              endOptions
            )
          }
        </AFormBaseItem>
      </Box>
    );
  }

  return null;
};

