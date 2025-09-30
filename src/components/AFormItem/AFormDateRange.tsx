// AFormDateUnified.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { TextField, Box } from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import dayjs, { Dayjs } from "dayjs";

export type PickerFormat = "year" | "month" | "date" | "datetime";

interface AFormDateUnifiedProps extends Omit<AFormBaseItemProps, "children"> {
  name: string;              // 단독 날짜일 때
  startName?: string;         // 범위 시작일
  endName?: string;           // 범위 종료일
  formatType?: PickerFormat;
  label: string;
  minDate?: string;           // YYYYMMDD
  maxDate?: string;           // YYYYMMDD
  step?: number;              // 시간 선택일 경우
}

const formatMap: Record<
  PickerFormat,
  { views: any[]; inputFormat: string; component: any; width?: number }
> = {
  year: { views: ["year"], inputFormat: "YYYY", component: DatePicker, width: 100 },
  month: { views: ["year", "month"], inputFormat: "YYYY-MM", component: DatePicker, width: 120 },
  date: { views: ["year", "month", "day"], inputFormat: "YYYY-MM-DD", component: DatePicker, width: 140 },
  datetime: { views: ["year", "month", "day", "hours", "minutes"], inputFormat: "YYYY-MM-DD HH:mm", component: DateTimePicker, width: 200 },
};

const parseMinMax = (dateStr?: string) => (dateStr ? dayjs(dateStr, "YYYYMMDD") : undefined);

export const AFormDateUnified: React.FC<AFormDateUnifiedProps> = ({
  name,
  startName,
  endName,
  label,
  formatType = "date",
  minDate,
  maxDate,
  makeRule = {},
}) => {
  const { control, watch } = useFormContext();
  const startValue = startName ? watch(startName) : null;
  const endValue = endName ? watch(endName) : null;

  const { views, inputFormat, component: PickerComponent, width } = formatMap[formatType];

  const renderPicker = (field: any, fieldState: any, min?: Dayjs, max?: Dayjs) => (
    <PickerComponent
      {...field}
      value={field.value ?? null}
      onChange={(val: Dayjs | null) => field.onChange(val)}
      minDate={min}
      maxDate={max}
      views={views}
      format={inputFormat}
      slotProps={{
        textField: {
          size: "small",
          error: !!fieldState.error,
          helperText: fieldState.error?.message,
          sx: width ? { width } : undefined,
        },
      }}
    />
  );

  // 단독 날짜
  if (name) {
    return (
      <AFormBaseItem name={name} label={label} makeRule={makeRule}>
        {() => (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) =>
              renderPicker(field, fieldState, parseMinMax(minDate), parseMinMax(maxDate))
            }
          />
        )}
      </AFormBaseItem>
    );
  }

  // 범위 날짜
  if (startName && endName) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <AFormBaseItem
          name={startName}
          label={label}
          makeRule={{
            ...makeRule,
            validate: (startVal: Dayjs | null) => {
              if (!startVal || !endValue) return true;
              return startVal.isBefore(endValue) || "시작일은 종료일보다 작거나 같아야 합니다.";
            },
          }}
        >
          {() => (
            <Controller
              name={startName}
              control={control}
              render={({ field, fieldState }) =>
                renderPicker(field, fieldState, parseMinMax(minDate), endValue ?? parseMinMax(maxDate))
              }
            />
          )}
        </AFormBaseItem>

        <Box>~</Box>

        <AFormBaseItem
          name={endName}
          label=""
          makeRule={{
            ...makeRule,
            validate: (endVal: Dayjs | null) => {
              if (!endVal || !startValue) return true;
              return endVal.isAfter(startValue) || "종료일은 시작일보다 커야 합니다.";
            },
          }}
        >
          {() => (
            <Controller
              name={endName}
              control={control}
              render={({ field, fieldState }) =>
                renderPicker(field, fieldState, startValue ?? parseMinMax(minDate), parseMinMax(maxDate))
              }
            />
          )}
        </AFormBaseItem>
      </Box>
    );
  }

  return null;
};
