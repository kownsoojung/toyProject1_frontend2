import { RuleObject } from "antd/es/form";
import { StoreValue } from "rc-field-form/lib/interface";

// 미리 정의된 패턴 타입
export type PatternType = "numalpha" | "email" | "phone";

export const patterns: Record<PatternType, { regex: RegExp; message: string }> = {
  numalpha: { regex: /^[A-Za-z0-9]+$/, message: "{label}은(는) 숫자/영문 조합만 가능합니다" },
  email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "{label} 형식이 올바르지 않습니다" },
  phone: { regex: /^\d{2,3}-\d{3,4}-\d{4}$/, message: "{label} 형식이 올바르지 않습니다" },
};

export const rules = {
  required: (label: string): RuleObject => ({
    required: true,
    message: `${label}을(를) 입력해주세요`,
  }),

  minLength: (label: string, length: number): RuleObject => ({
    min: length,
    message: `${label}은(는) 최소 ${length}자 이상이어야 합니다`,
  }),

  maxLength: (label: string, length: number): RuleObject => ({
    max: length,
    message: `${label}은(는) 최대 ${length}자 이하이어야 합니다`,
  }),

  email: (label: string): RuleObject => ({
    type: "email",
    message: `${label} 유효한 이메일 형식이 아닙니다.`,
  }),

  pattern: (label: string, regex: RegExp, msg?: string): RuleObject => ({
    pattern: regex,
    message: msg || `${label} 형식이 올바르지 않습니다`,
  }),

  custom: (validator: (rule: RuleObject, value: StoreValue) => Promise<void>): RuleObject => ({
    validator,
  }),

  /** 
   * patternType 사용: 미리 정의된 패턴 가져오기 
   * 예: rules.patternType("이메일", "email")
   */
  patternType: (label: string, type: PatternType): RuleObject => {
    const patternInfo = patterns[type];
    if (!patternInfo) throw new Error(`Pattern type "${type}"이(가) 정의되어 있지 않습니다.`);
    return { pattern: patternInfo.regex, message: patternInfo.message.replace("{label}", label) };
  },
};
