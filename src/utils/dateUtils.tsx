import dayjs, { Dayjs } from "dayjs";

export const roundToStep = (date: Dayjs, hStep: number, mStep: number, sStep: number) => {
  const h = Math.floor(date.hour() / hStep) * hStep;
  const m = Math.floor(date.minute() / mStep) * mStep;
  const s = Math.floor(date.second() / sStep) * sStep;
  return date.hour(h).minute(m).second(s);
};

// 시간만 라운드 함수
export const roundTime = (time: Dayjs, hStep = 1, mStep = 1, sStep = 1) => {
  const hours = Math.floor(time.hour() / hStep) * hStep;
  const minutes = Math.floor(time.minute() / mStep) * mStep;
  const seconds = Math.floor(time.second() / sStep) * sStep;
  return time.hour(hours).minute(minutes).second(seconds).millisecond(0);
};


export const parseMinMax = (dateStr?: string) => (dateStr ? dayjs(dateStr, "YYYYMMDD") : undefined);