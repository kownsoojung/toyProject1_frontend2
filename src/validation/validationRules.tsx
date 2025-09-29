export type PatternType =
  | "numalpha"
  | "email"
  | "phone"
  | "korean"
  | "url"
  | "onlyNumber";

export const patterns: Record<PatternType, { regex: RegExp; message: string }> = {
  numalpha: { regex: /^[A-Za-z0-9]+$/, message: "{label}은(는) 숫자/영문 조합만 가능합니다" },
  email:    { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "{label} 형식이 올바르지 않습니다" },
  phone:    { regex: /^\d{2,3}-\d{3,4}-\d{4}$/, message: "{label} 형식이 올바르지 않습니다" },
  korean:   { regex: /^[가-힣\s]+$/, message: "{label}은(는) 한글만 입력 가능합니다" },
  url:      { regex: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/?].*)?$/, message: "{label} URL 형식이 올바르지 않습니다" },
  onlyNumber: { regex: /^\d+$/, message: "{label}은(는) 숫자만 입력 가능합니다" },
};

export const rules = {
  required: (label: string) => ({ required: true, message: `${label}을(를) 입력해주세요` }),
  minLength: (label: string, length: number) => ({ min: length, message: `${label}은(는) 최소 ${length}자 이상이어야 합니다` }),
  maxLength: (label: string, length: number) => ({ max: length, message: `${label}은(는) 최대 ${length}자 이하이어야 합니다` }),
  patternType: (label: string, type: PatternType) => {
    const patternInfo = patterns[type];
    if (!patternInfo) throw new Error(`Pattern type "${type}"이(가) 정의되어 있지 않습니다.`);
    return { value: patternInfo.regex, message: patternInfo.message.replace("{label}", label) };
  },
};
