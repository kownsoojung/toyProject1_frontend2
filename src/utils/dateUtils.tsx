// dateUtils.ts
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export type ShowTimeType = 'hour' | 'min' | 'sec';

//////////////////////////
// 1. 문자열 → Dayjs 변환
//////////////////////////
export const parseDateTimeString = (dateStr?: string): Dayjs | undefined => {
  if (!dateStr) return undefined;
  const len = dateStr.length;

  if (len === 4) return dayjs(dateStr, 'YYYY');
  if (len === 6) return dayjs(dateStr, 'YYYYMM');
  if (len === 8) return dayjs(dateStr, 'YYYYMMDD');
  if (len === 10) return dayjs(`${dateStr}00`, 'YYYYMMDDHHmm');
  if (len === 12) return dayjs(dateStr, 'YYYYMMDDHHmm');
  if (len === 14) return dayjs(dateStr, 'YYYYMMDDHHmmss');
  return undefined;
};

//////////////////////////
// 2. showTime 옵션 생성
//////////////////////////
export const getShowTimeOption = (showTime?: ShowTimeType, step: number = 1) => {
  switch (showTime) {
    case 'hour': return { format: 'HH', hourStep: step };
    case 'min': return { format: 'HH:mm', hourStep: 1, minuteStep: step };
    case 'sec': return { format: 'HH:mm:ss', hourStep: 1, minuteStep: 1, secondStep: step };
    default: return false;
  }
};

//////////////////////////
// 3. min/max → disabled 계산
//////////////////////////
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
      if (time.min) min = parseDateTimeString(`${dateStr}${time.min.padStart(2,'0')}`);
      if (time.max) max = parseDateTimeString(`${dateStr}${time.max.padStart(2,'0')}`);
      break;
    case 'min':
      if (time.min) min = parseDateTimeString(`${dateStr}${time.min.padStart(4,'0')}`);
      if (time.max) max = parseDateTimeString(`${dateStr}${time.max.padStart(4,'0')}`);
      break;
    case 'sec':
      if (time.min) min = parseDateTimeString(`${dateStr}${time.min.padStart(6,'0')}`);
      if (time.max) max = parseDateTimeString(`${dateStr}${time.max.padStart(6,'0')}`);
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
