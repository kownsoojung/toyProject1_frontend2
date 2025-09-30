// AFormDate.tsx
import React from "react";
import { DatePicker, TimePicker, DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";

export type PickerFormat =
  | "year"
  | "month"
  | "year-month"
  | "date"
  | "time"
  | "hour"
  | "time-minute"
  | "datetime-hour"
  | "datetime-minute"
  | "datetime-second";

interface AFormDateProps extends Omit<AFormBaseItemProps, "children"> {
  formatType?: PickerFormat;
  msize?: number;
  disabled?: boolean;
  hidden?: boolean;
  min?: string; // YYYYMMDDHHmmss 또는 HHmm / HHmmss
  max?: string;
  step?: number;
}

const formatMap: Record<
  PickerFormat,
  { views: any[]; inputFormat: string; component: any; width?: number }
> = {
  year: { views: ["year"], inputFormat: "YYYY", component: DatePicker, width: 80 },
  month: { views: ["month"], inputFormat: "MM", component: DatePicker, width: 60 },
  "year-month": { views: ["year", "month"], inputFormat: "YYYY-MM", component: DatePicker, width: 140 },
  date: { views: ["year", "month", "day"], inputFormat: "YYYY-MM-DD", component: DatePicker, width: 140 },
  time: { views: ["hours", "minutes", "seconds"], inputFormat: "HH:mm:ss", component: TimePicker, width: 120 },
  hour: { views: ["hours"], inputFormat: "HH", component: TimePicker, width: 80 },
  "time-minute": { views: ["hours", "minutes"], inputFormat: "HH:mm", component: TimePicker, width: 100 },
  "datetime-hour": { views: ["year", "month", "day", "hours"], inputFormat: "YYYY-MM-DD HH", component: DateTimePicker, width: 160 },
  "datetime-minute": { views: ["year", "month", "day", "hours", "minutes"], inputFormat: "YYYY-MM-DD HH:mm", component: DateTimePicker, width: 200 },
  "datetime-second": { views: ["year", "month", "day", "hours", "minutes", "seconds"], inputFormat: "YYYY-MM-DD HH:mm:ss", component: DateTimePicker, width: 220 },
};

// 문자열 → Dayjs 변환
const parseDateTimeString = (dateStr: string): Dayjs | undefined => {
  if (!dateStr) return undefined;
  const today = dayjs().format("YYYYMMDD");
  if (dateStr.length <= 2) return dayjs(`${today}${dateStr.padStart(2, "0")}`, "YYYYMMDDHH");
  if (dateStr.length <= 4) return dayjs(`${today}${dateStr.padStart(4, "0")}`, "YYYYMMDDHHmm");
  if (dateStr.length <= 6) return dayjs(`${today}${dateStr.padStart(6, "0")}`, "YYYYMMDDHHmmss");
  if (dateStr.length === 4) return dayjs(dateStr, "YYYY");
  if (dateStr.length === 6) return dayjs(dateStr, "YYYYMM");
  if (dateStr.length === 8) return dayjs(dateStr, "YYYYMMDD");
  if (dateStr.length === 10) return dayjs(dateStr, "YYYYMMDDHH");
  if (dateStr.length === 12) return dayjs(dateStr, "YYYYMMDDHHmm");
  if (dateStr.length === 14) return dayjs(dateStr, "YYYYMMDDHHmmss");
  return undefined;
};

// 시간 제한 처리
const getTimeLimits = (min?: string, max?: string) => {
  const minDate = min ? parseDateTimeString(min) : undefined;
  const maxDate = max ? parseDateTimeString(max) : undefined;

  return (value: number, view: "hours" | "minutes" | "seconds") => {
    if (!value) return false;
    switch (view) {
      case "hours":
        if (minDate && value < minDate.hour()) return true;
        if (maxDate && value > maxDate.hour()) return true;
        break;
      case "minutes":
        if (minDate && value < minDate.minute()) return true;
        if (maxDate && value > maxDate.minute()) return true;
        break;
      case "seconds":
        if (minDate && value < minDate.second()) return true;
        if (maxDate && value > maxDate.second()) return true;
        break;
    }
    return false;
  };
};
const getTimeLimitsWithStep = (min?: string, max?: string, step: number = 1) => {
  const minDate = min ? parseDateTimeString(min) : undefined;
  const maxDate = max ? parseDateTimeString(max) : undefined;

  return (value: number, view: "hours" | "minutes" | "seconds") => {
    if (value === undefined) return false;

    switch (view) {
      case "hours":
        if (minDate && value < minDate.hour()) return true;
        if (maxDate && value > maxDate.hour()) return true;
        break;
      case "minutes":
        if (minDate && value < minDate.minute()) return true;
        if (maxDate && value > maxDate.minute()) return true;
        if (value % step !== 0) return true; // step 체크
        break;
      case "seconds":
        if (minDate && value < minDate.second()) return true;
        if (maxDate && value > maxDate.second()) return true;
        if (value % step !== 0) return true; // step 체크
        break;
    }
    return false;
  };
};
export const AFormDate: React.FC<AFormDateProps> = ({
  name,
  label,
  makeRule = {},
  msize = 0,
  disabled = false,
  hidden = false,
  formatType = "date",
  min,
  max,
  step = 1,
  ...rest
}) => {
  if (hidden) return null;

  const { views, inputFormat, component: PickerComponent, width } = formatMap[formatType];
    const shouldDisableTime =
    PickerComponent === TimePicker || PickerComponent === DateTimePicker
      ? getTimeLimitsWithStep(min, max, step)
      : undefined;
  return (
    <AFormBaseItem name={name} label={label} makeRule={makeRule} hidden={hidden}>
      {(field, error) => (
        <PickerComponent
          {...field}
          {...rest}
          views={views}
          format={inputFormat}
          disabled={disabled}
          ampm={false}
          timeSteps={{ minutes: step }}
          shouldDisableTime={shouldDisableTime}    
          slotProps={{
            textField: {
              error: !!error,
              helperText: error,
              size: "small",
              sx: width ? { width } : undefined,
            },
            actionBar: { actions: [] }, // Cancel/OK 버튼 제거
          }}
        />
      )}
    </AFormBaseItem>
  );
};
