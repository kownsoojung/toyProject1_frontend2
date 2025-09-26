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
import { Form } from 'antd';

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

interface ItemProps extends BaseFormItemProps {
  makeRule?: MakeRulesOptions;
  props?: React.ComponentProps<typeof DatePicker>;
  picker?: PickerMode;
  disabled?: boolean;
  placeholder?: string;
  showTime?: ShowTimeType; 
  step?:number,
  inputReadOnly?: boolean;
  minDate?: string;
  maxDate?: string;
  time?: { min?: string; max?: string };
  timeOnly?: boolean;
}

export const AFormDate: React.FC<ItemProps> = ({
  name,
  label,
  makeRule,
  props,
  disabled = false,
  picker = 'date',
  placeholder,
  showTime,
  step,
  inputReadOnly = false,
  minDate,
  maxDate,
  time,
  timeOnly = false,
  ...rest
}) => {
  const form = Form.useFormInstance();
  const showTimeOption = getShowTimeOption(showTime, step);
  const format = getFormatByPicker(picker, showTimeOption, timeOnly);
  const pickerType: any = timeOnly ? 'time' : picker;

  return (
    <AFormBaseItem name={name} label={label} makeRule={makeRule} {...rest}>
      <DatePicker
        picker={pickerType}
        format={format}
        showTime={showTimeOption}
        inputReadOnly={inputReadOnly}
        disabled={disabled}
        disabledDate={(current: Dayjs) => {
          if (!current || timeOnly) return false;
          const min = minDate ? parseDateTimeString(minDate) : undefined;
          const max = maxDate ? parseDateTimeString(maxDate) : undefined;
          if (min && current.isBefore(min, 'day')) return true;
          if (max && current.isAfter(max, 'day')) return true;
          return false;
        }}
        disabledTime={(current) => getTimeLimits(current, showTime, time)}
        onBlur={(e) => {
          const raw = (e.currentTarget as HTMLInputElement).value?.trim();
          if (!raw) return;
          // ✅ timeOnly 정보를 넘겨서 변환
          const parsed = parseDateTimeString(raw, timeOnly);
          if (parsed && form) {
            form.setFieldValue(name, parsed); // form 값 갱신
          }
        }}
        {...props}
      />
    </AFormBaseItem>
  );
};
