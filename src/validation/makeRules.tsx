import { rules, PatternType } from "./validationRules";

export interface MakeRulesOptions {
  required?: boolean;
  min?: number;
  max?: number;
  patternType?: PatternType;
  custom?: (value: any) => string | boolean;
}

export const makeRules = (label: string, opts?: MakeRulesOptions) => {
  if (!opts) return {};

  const rulesObj: any = {};
  if (opts.required) rulesObj.required = rules.required(label).message;
  if (opts.min) rulesObj.minLength = { value: opts.min, message: `${label}은(는) 최소 ${opts.min}자 이상이어야 합니다` };
  if (opts.max) rulesObj.maxLength = { value: opts.max, message: `${label}은(는) 최대 ${opts.max}자 이하이어야 합니다` };
  if (opts.patternType) rulesObj.pattern = rules.patternType(label, opts.patternType);
  if (opts.custom) rulesObj.validate = opts.custom;

  return rulesObj;
};
