import dayjs, { Dayjs } from "dayjs";

export const roundToStep = (date: Dayjs, hStep: number, mStep: number, sStep: number) => {
  const h = Math.floor(date.hour() / hStep) * hStep;
  const m = Math.floor(date.minute() / mStep) * mStep;
  const s = Math.floor(date.second() / sStep) * sStep;
  return date.hour(h).minute(m).second(s);
};

export const parseMinMax = (dateStr?: string) => (dateStr ? dayjs(dateStr, "YYYYMMDD") : undefined);