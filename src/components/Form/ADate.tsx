import React from "react";
import { useFormContext } from "react-hook-form";
import { DatePicker, DatePickerProps, DateTimePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { parseMinMax, roundToStep } from "@/utils/dateUtils";

export type PickerFormat = "year" | "month" | "date" | "datehour" | "dateminute" | "datetime";

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

interface ADateProps {
  formatType?: PickerFormat;
  minDate?: string | Dayjs;
  maxDate?: string | Dayjs;
  hStep?: number;
  mStep?: number;
  sStep?: number;
  options?: DatePickerProps;
  isString?: boolean;
  isEndDate?: boolean;
  // 독립 사용을 위한 props
  value?: string | null;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  error?: boolean;
}

// 기본 Date 컴포넌트 (순수 UI)
const ADateBase: React.FC<ADateProps> = ({
  formatType = "date",
  minDate,
  maxDate,
  hStep = 1,
  mStep = 1,
  sStep = 1,
  options,
  isString = false,
  isEndDate = false,
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  const { views, inputFormat, component: PickerComponent, width } = formatMap[formatType];

  const pickerValue = value ? roundToStep(dayjs(value), hStep, mStep, sStep) : null;
  const min = typeof minDate === "string" ? parseMinMax(minDate) : minDate;
  const max = typeof maxDate === "string" ? parseMinMax(maxDate) : maxDate;

  const handleChange = (val: Dayjs | null) => {
    if (!onChange) return;

    if (val) {
      let rounded = roundToStep(val, hStep, mStep, sStep);

      if (isEndDate && isString === false && ["year", "month", "date"].includes(formatType)) {
        rounded = rounded.hour(23).minute(59).second(59);
        const formatted = rounded.format("YYYY-MM-DDT23:59:59");
        onChange(formatted);
        return;
      }

      const formatted = rounded.format(
        isString
          ? inputFormat.replace(/[-:\s]/g, "")
          : inputFormat === "YYYY-MM-DD"
            ? "YYYY-MM-DD"
            : "YYYY-MM-DDTHH:mm:ss"
      );
      onChange(formatted);
    } else {
      onChange(null);
    }
  };

  const isTimePicker = formatType.includes('hour') || formatType.includes('minute') || formatType === 'datetime';
  const pickerProps: any = {
    value: pickerValue,
    onChange: handleChange,
    minDate: min,
    maxDate: max,
    views,
    format: inputFormat,
    timeSteps: { hours: hStep, minutes: mStep, seconds: sStep },
    disabled,
    slotProps: {
      textField: {
        size: "small",
        error,
        sx: width ? { width } : undefined,
      },
    },
    ...options,
  };

  if (isTimePicker) {
    pickerProps.ampm = false;
  }

  return <PickerComponent {...pickerProps} />;
};

// Form 래퍼 컴포넌트
interface ADateFormProps extends Omit<ADateProps, 'value' | 'onChange' | 'error' | 'disabled'> {
  name: string;
  endName?: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">; // ⭐ name과 children 제외
  endOptions?: DatePickerProps;
}

const ADateForm: React.FC<ADateFormProps> = ({
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
  endOptions,
  isString = false,
}) => {
  const { watch } = useFormContext();
  const startValue = name ? watch(name) : null;
  const endValue = endName ? watch(endName) : null;

  if (!endName) {
    return (
      <AFormBaseItem name={name} {...base}>
        {(field, error) => (
          <ADateBase
            formatType={formatType}
            minDate={minDate}
            maxDate={maxDate}
            hStep={hStep}
            mStep={mStep}
            sStep={sStep}
            options={options}
            isString={isString}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            disabled={field.disabled}
          />
        )}
      </AFormBaseItem>
    );
  }

  if (endName) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <AFormBaseItem name={name} {...base}>
          {(field, error) => (
            <ADateBase
              formatType={formatType}
              minDate={minDate}
              maxDate={endValue ? roundToStep(dayjs(endValue), hStep, mStep, sStep) : parseMinMax(maxDate as string)}
              hStep={hStep}
              mStep={mStep}
              sStep={sStep}
              options={options}
              isString={isString}
              value={field.value}
              onChange={field.onChange}
              error={!!error}
              disabled={field.disabled}
            />
          )}
        </AFormBaseItem>

        {base?.isShow !== false && <Box>~</Box>}

        <AFormBaseItem name={endName} {...base}>
          {(field, error) => (
            <ADateBase
              formatType={formatType}
              minDate={startValue ? roundToStep(dayjs(startValue), hStep, mStep, sStep) : parseMinMax(minDate as string)}
              maxDate={maxDate}
              hStep={hStep}
              mStep={mStep}
              sStep={sStep}
              options={endOptions}
              isString={isString}
              isEndDate={true}
              value={field.value}
              onChange={field.onChange}
              error={!!error}
              disabled={field.disabled}
            />
          )}
        </AFormBaseItem>
      </Box>
    );
  }

  return null;
};

// 컴포넌트 합성
export const ADate = Object.assign(ADateBase, {
  Form: ADateForm,
});

