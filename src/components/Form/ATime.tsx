// ATime.tsx
import React from "react";
import { TimePicker, TimePickerProps } from "@mui/x-date-pickers";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { roundTime, roundToStep } from "@/utils/dateUtils";

export type TimeFormatType = "hour" | "minute" | "second";

export interface ATimeProps {
  value?: string | Dayjs | null;
  onChange?: (value: string | null) => void;
  formatType: TimeFormatType;
  disabled?: boolean;
  error?: boolean;
  isString?: boolean;
  hStep?: number;
  mStep?: number;
  sStep?: number;
  timeSteps?: { hours?: number; minutes?: number; seconds?: number };
  options?: TimePickerProps;
  endValue?: string | Dayjs | null;
  onEndChange?: (value: string | null) => void;
  endError?: boolean;
  endDisabled?: boolean;
  endOptions?: TimePickerProps;
}

const formatMap: Record<TimeFormatType, { views: any[]; inputFormat: string; width: string }> = {
  hour: { views: ["hours"], inputFormat: "HH", width: "100px" },
  minute: { views: ["hours", "minutes"], inputFormat: "HH:mm", width: "120px" },
  second: { views: ["hours", "minutes", "seconds"], inputFormat: "HH:mm:ss", width: "150px" },
};

// 기본 TimePicker 컴포넌트 (순수 UI)
const ATimeBase: React.FC<ATimeProps> = ({
  value,
  onChange,
  formatType,
  disabled,
  error,
  isString = false,
  hStep = 1,
  mStep = 1,
  sStep = 1,
  timeSteps,
  options,
  endValue,
  onEndChange,
  endError,
  endDisabled,
  endOptions,
}) => {
  const { views, inputFormat, width } = formatMap[formatType];

  const renderPicker = (
    val: string | Dayjs | null | undefined,
    handleChange: (val: Dayjs | null) => void,
    pickerError?: boolean,
    pickerOptions?: TimePickerProps,
    pickerDisabled?: boolean
  ) => {
    const pickerValue = val ? roundToStep(dayjs(val, "HH:mm:ss"), hStep, mStep, sStep) : null;

    return (
      <TimePicker
        value={pickerValue}
        onChange={handleChange}
        views={views}
        format={inputFormat}
        timeSteps={timeSteps}
        disabled={pickerDisabled}
        slotProps={{
          textField: {
            error: pickerError,
            ...pickerOptions?.slotProps?.textField,
          },
        }}
        {...pickerOptions}
      />
    );
  };

  const handleStartChange = (val: Dayjs | null) => {
    if (val) {
      const rounded = roundTime(val, hStep, mStep, sStep);
      const formatted = rounded.format(isString ? inputFormat.replace(/[-:\s]/g, "") : "HH:mm:ss");
      onChange?.(formatted);
    } else {
      onChange?.(null);
    }
  };

  const handleEndChange = (val: Dayjs | null) => {
    if (val) {
      const rounded = roundTime(val, hStep, mStep, sStep);
      const formatted = rounded.format(isString ? inputFormat.replace(/[-:\s]/g, "") : "HH:mm:ss");
      onEndChange?.(formatted);
    } else {
      onEndChange?.(null);
    }
  };

  if (endValue !== undefined && onEndChange !== undefined) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {renderPicker(value, handleStartChange, error, options, disabled)}
        <span>~</span>
        {renderPicker(endValue, handleEndChange, endError, endOptions, endDisabled)}
      </Box>
    );
  }

  return renderPicker(value, handleStartChange, error, options, disabled);
};

// Form 래퍼 컴포넌트
interface ATimeFormProps extends Omit<ATimeProps, "value" | "onChange" | "error"> {
  name: string;
  endName?: string;
  base?: AFormBaseItemProps;
  endOptions?: TimePickerProps;
}

const ATimeForm: React.FC<ATimeFormProps> = ({ name, endName, base, endOptions, ...props }) => {
  if (!endName) {
    return (
      <AFormBaseItem name={name} {...base}>
        {(field, error) => (
          <ATimeBase
            {...props}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            disabled={field.disabled}
          />
        )}
      </AFormBaseItem>
    );
  }

  return (
    <Box>
      <AFormBaseItem name={name} {...base}>
        {(field, error) => (
          <ATimeBase
            {...props}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            disabled={field.disabled}
          />
        )}
      </AFormBaseItem>
      <span>~</span>
      <AFormBaseItem name={endName} {...base}>
        {(field, error) => (
          <ATimeBase
            {...props}
            value={field.value}
            onChange={field.onChange}
            error={!!error}
            disabled={field.disabled}
            endOptions={endOptions}
          />
        )}
      </AFormBaseItem>
    </Box>
  );
};

// 컴포넌트 합성
export const ATime = Object.assign(ATimeBase, {
  Form: ATimeForm,
});
