import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import generatePicker from 'antd/es/date-picker/generatePicker';
import type { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'; 
import { MakeRulesOptions } from "@/validation/makeRules";
import {
  getFormatByPicker,
  parseDateTimeString,
  getTimeLimits,
  PickerMode,
  ShowTimeType,
  getShowTimeOption
} from "@/utils/dateDayjs";
import { Form } from "antd";

const RangePicker = generatePicker<Dayjs>(dayjsGenerateConfig).RangePicker;

interface RangeItemProps extends BaseFormItemProps {
  makeRule?: MakeRulesOptions;
  picker?: PickerMode;
  showTime?: ShowTimeType;
  step?: number;
  inputReadOnly?: boolean;
  minDate?: string;
  maxDate?: string;
  time?: { min?: string; max?: string };
  timeOnly?: boolean;
  props?: React.ComponentProps<typeof RangePicker>;
}

export const AFormDateRange: React.FC<RangeItemProps> = ({
  name,
  label,
  makeRule,
  picker = 'date',
  showTime,
  step,
  inputReadOnly = false,
  minDate,
  maxDate,
  time,
  timeOnly = false,
  props,
  ...rest
}) => {
  const form = Form.useFormInstance();
  const showTimeOption = getShowTimeOption(showTime, step);
  const format = getFormatByPicker(picker, showTimeOption, timeOnly);
  const pickerType: any = timeOnly ? 'time' : picker;

  return (
    <AFormBaseItem name={name} label={label} makeRule={makeRule} {...rest}>
      <RangePicker
        picker={pickerType}
        format={format}
        showTime={showTimeOption}
        inputReadOnly={inputReadOnly}
        disabledDate={(current: Dayjs) => {
          if (!current || timeOnly) return false;
          const min = minDate ? parseDateTimeString(minDate) : undefined;
          const max = maxDate ? parseDateTimeString(maxDate) : undefined;
          if (min && current.isBefore(min, 'day')) return true;
          if (max && current.isAfter(max, 'day')) return true;
          return false;
        }}
        disabledTime={(current, type) => getTimeLimits(current, showTime, time)}
        onBlur={(e) => {
            const raw = (e.currentTarget as HTMLInputElement).value?.trim();
            if (!raw) return;

            const [startStr, endStr] = raw.split(/\s*~\s*/);
            // oldValue 타입 고정
            const oldValue: [Dayjs | undefined, Dayjs | undefined] = form.getFieldValue(name) || [undefined, undefined];

            // 새 값 배열 타입 명시
            const newValue: [Dayjs | undefined, Dayjs | undefined] = [...oldValue];

            if (startStr) {
                const start = parseDateTimeString(startStr, timeOnly);
                if (start && (!oldValue[0] || !oldValue[0].isSame(start))) {
                newValue[0] = start;
                }
            }

            if (endStr) {
                const end = parseDateTimeString(endStr, timeOnly);
                if (end && (!oldValue[1] || !oldValue[1].isSame(end))) {
                newValue[1] = end;
                }
            }

            form.setFieldValue(name, newValue)

        }}
        {...props}
      />
    </AFormBaseItem>
  );
};
