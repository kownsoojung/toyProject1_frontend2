import { RuleObject } from "antd/es/form";
import { StoreValue } from "rc-field-form/lib/interface";

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
    type: 'email',
    message: `${label} 유효한 이메일 형식이 아닙니다.`,
  }),
  pattern: (label: string, regex: RegExp, msg?: string): RuleObject => ({
    pattern: regex,
    message: msg || `${label} 형식이 올바르지 않습니다`,
  }),
  custom: (validator: (rule: RuleObject, value: StoreValue) => Promise<void>): RuleObject => ({
    validator,
  }),
};
