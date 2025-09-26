import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export type ShowTimeType = 'hour' | 'min' | 'sec';
export type PickerMode = 'date' | 'week' | 'month' | 'quarter' | 'year';

// showTimeOption 반환 타입 정의
// showTimeOption 타입을 any로 처리
export const getShowTimeOption = (showTime?: ShowTimeType, step:number= 1): any => {
  switch (showTime) {
    case 'hour':
      return { format: 'HH', hourStep: step as 1 };
    case 'min':
      return { format: 'HH:mm', hourStep: 1 as 1, minuteStep: step as 1 };
    case 'sec':
      return { format: 'HH:mm:ss', hourStep: 1 as 1, minuteStep: 1 as 1, secondStep: step as 1 };
    default:
      return false;
  }
};

export const getFormatByPicker = (
  picker: PickerMode,
  showTimeOption: any,
  timeOnly = false
) => {
  if (timeOnly && showTimeOption) return showTimeOption.format;
  switch (picker) {
    case 'date': return showTimeOption ? `YYYY-MM-DD ${showTimeOption.format}` : 'YYYY-MM-DD';
    case 'week': return 'YYYY-wo';
    case 'month': return 'YYYY-MM';
    case 'quarter': return 'YYYY-[Q]Q';
    case 'year': return 'YYYY';
    default: return 'YYYY-MM-DD';
  }
};

// 문자열 → Dayjs 변환

export const parseDateTimeString = (
  dateStr?: string,
  timeOnly?: boolean
): Dayjs | undefined => {
  if (!dateStr) return undefined;

  // ⬇️ timeOnly일 경우
  if (timeOnly) {
    // HH:mm:ss 또는 HH:mm 지원
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(dateStr)) {
      const today = dayjs().format('YYYY-MM-DD');
      return dayjs(`${today} ${dateStr}`, dateStr.length > 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm');
    }
  }

  // 기존 로직
  if (dateStr.length === 4) return dayjs(dateStr, 'YYYY');
  if (dateStr.length === 6) return dayjs(dateStr, 'YYYYMM');
  if (dateStr.length === 8) return dayjs(dateStr, 'YYYYMMDD');
  if (dateStr.length === 10) return dayjs(dateStr, 'YYYYMMDDHH');
  if (dateStr.length === 12) return dayjs(dateStr, 'YYYYMMDDHHmm');
  if (dateStr.length === 14) return dayjs(dateStr, 'YYYYMMDDHHmmss');
  return undefined;
};
// 시간 제한 처리
export const getTimeLimits = (
  current: Dayjs,
  showTime?: ShowTimeType,
  time?: { min?: string; max?: string }
) => {
  if (!time || !showTime) return {};
  const dateStr = current.format('YYYYMMDD');

  let min: Dayjs | undefined;
  let max: Dayjs | undefined;

  switch (showTime) {
    case 'hour':
      if (time.min) min = parseDateTimeString(`${dateStr}${time.min.padStart(2, '0')}0000`);
      if (time.max) max = parseDateTimeString(`${dateStr}${time.max.padStart(2, '0')}5900`);
      break;
    case 'min':
      if (time.min) min = parseDateTimeString(`${dateStr}${time.min.padStart(4, '0')}00`);
      if (time.max) max = parseDateTimeString(`${dateStr}${time.max.padStart(4, '0')}59`);
      break;
    case 'sec':
      if (time.min) min = parseDateTimeString(`${dateStr}${time.min.padStart(6, '0')}`);
      if (time.max) max = parseDateTimeString(`${dateStr}${time.max.padStart(6, '0')}`);
      break;
  }

  const disabledHours: number[] = [];
  const disabledMinutes: number[] = [];
  const disabledSeconds: number[] = [];

  if (min && current.isSame(min, 'day')) {
    for (let h = 0; h < min.hour(); h++) disabledHours.push(h);
    for (let m = 0; m < min.minute(); m++) disabledMinutes.push(m);
    for (let s = 0; s < min.second(); s++) disabledSeconds.push(s);
  }

  if (max && current.isSame(max, 'day')) {
    for (let h = max.hour() + 1; h < 24; h++) disabledHours.push(h);
    for (let m = max.minute() + 1; m < 60; m++) disabledMinutes.push(m);
    for (let s = max.second() + 1; s < 60; s++) disabledSeconds.push(s);
  }

  return {
    disabledHours: () => disabledHours,
    disabledMinutes: () => disabledMinutes,
    disabledSeconds: () => disabledSeconds,
  };
};
