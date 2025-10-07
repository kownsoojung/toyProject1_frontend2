import dayjs from "dayjs";
import { z } from "zod";


export const initZodConfig = () => {
z.config({
  customError: (issue) => {
    switch (issue.code) {
      case "invalid_element"  : 
        return "배열 요소가 유효하지 않습니다.";
      case "invalid_type":
        return "필수 입력 항목입니다.";
      case "too_small":
        // 빈 문자열이거나 길이 0일 때
        if (issue.origin === "string" && issue.input === "") {
          return "필수 입력 항목입니다.";
        }
        if (issue.origin === "date" && issue.input instanceof Date && issue.minimum) {
          return `날짜는 ${issue.minimum} 이후여야 합니다.`;
        }
        return `최소 ${issue.minimum} 이상이어야 합니다.`;

      case "too_big":
        if (issue.origin === "date" && issue.input instanceof Date && issue.maximum) {
          return `날짜는 ${issue.maximum} 이전이어야 합니다.`;
        }
        return `최대 ${issue.maximum} 이하이어야 합니다.`;
      case "invalid_format":
        switch (issue.format) {
          case "email": return "이메일 형식이 올바르지 않습니다.";
          case "url": return "URL 형식이 올바르지 않습니다.";
          case "uuid": return "UUID 형식이 올바르지 않습니다.";
          case "regex": return "정규식 패턴과 일치하지 않습니다.";
          case "datetime": return "날짜/시간 형식이 올바르지 않습니다.";
          case "json_string": return "JSON 문자열 형식이 올바르지 않습니다.";
          case "e164": return "E.164 전화번호 형식이 올바르지 않습니다.";
          case "ipv4": return "IPv4 형식이 올바르지 않습니다.";
          case "ipv6": return "IPv6 형식이 올바르지 않습니다.";
          default: return "값의 형식이 올바르지 않습니다.";
        }
      case "custom":
        
        return issue.message ?? "잘못된 값입니다.";
      
      default:
        return "잘못된 값입니다.";
    }
  },
});
};

const toDateSafe = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = dayjs(value, ["YYYY-MM-DD", "YYYYMMDDHHmmss", dayjs.ISO_8601], true);
    return parsed.isValid() ? parsed.toDate() : undefined;
  }
  return undefined;
};

type DateType = "d" | "m" | "y";

export const validateDateRanges = (
  ranges: { fieldStart: string; fieldEnd: string; type?: DateType; max?: number }[]
) => {
  return (data: any, ctx: any) => {
    ranges.forEach(({ fieldStart, fieldEnd, type, max }) => {
      const start = toDateSafe(data[fieldStart]);
      const end = toDateSafe(data[fieldEnd]);

      if ((start && !end) || (!start && end)) {
        ctx.addIssue({
          code: "custom",
          path: [end ? fieldStart : fieldEnd],
          message: "둘 다 입력해야 합니다.",
        });
        return;
      }

      if (start && end) {
        if (start > end) {
          ctx.addIssue({
            code: "custom",
            path: [fieldStart],
            message: `${fieldStart}는 ${fieldEnd}보다 클 수 없습니다.`,
          });
        }

        if (type && max !== undefined) {
          let diff = 0;
          let unitLabel = "";

          switch (type) {
            case "d":
              diff = dayjs(end).diff(dayjs(start), "day");
              unitLabel = "일";
              break;
            case "m":
              diff = dayjs(end).diff(dayjs(start), "month");
              unitLabel = "개월";
              break;
            case "y":
              diff = dayjs(end).diff(dayjs(start), "year");
              unitLabel = "년";
              break;
          }

          if (diff > max) {
            ctx.addIssue({
              code: "custom",
              path: [fieldStart],
              message: `최대 ${max}${unitLabel}를 넘었습니다.`,
            });
          }
        }
      }
    });
  };
};


type TimeType = "h" | "m" | "s";

export const validateTimeRanges = (
  ranges: { fieldStart: string; fieldEnd: string; type?: TimeType; maxDiff?: number }[]
) => {
  return (data: any, ctx: any) => {
    ranges.forEach(({ fieldStart, fieldEnd, type, maxDiff }) => {
      const start = toDateSafe(data[fieldStart]);
      const end = toDateSafe(data[fieldEnd]);

      if ((start && !end) || (!start && end)) {
        ctx.addIssue({
          code: "custom",
          path: [end ? fieldStart : fieldEnd],
          message: "둘 다 입력해야 합니다.",
        });
        return;
      }

      if (start && end) {
        if (start > end) {
          ctx.addIssue({
            code: "custom",
            path: [fieldStart],
            message: `${fieldStart}는 ${fieldEnd}보다 클 수 없습니다.`,
          });
        }

        if (type && maxDiff !== undefined) {
          const diffMs = end.getTime() - start.getTime();
          let diff = 0;
          let unitLabel = "";

          switch (type) {
            case "h":
              diff = diffMs / (1000 * 60 * 60);
              unitLabel = "시간";
              break;
            case "m":
              diff = diffMs / (1000 * 60);
              unitLabel = "분";
              break;
            case "s":
              diff = diffMs / 1000;
              unitLabel = "초";
              break;
          }

          if (diff > maxDiff) {
            ctx.addIssue({
              code: "custom",
              path: [fieldStart],
              message: `최대 ${maxDiff}${unitLabel}를 넘었습니다.`,
            });
          }
        }
      }
    });
  };
};