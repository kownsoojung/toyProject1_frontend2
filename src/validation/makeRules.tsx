import { rules, PatternType } from "./validationRules";

export interface MakeRulesOptions {
  required?: boolean;
  min?: number;
  max?: number;
  patternType?: PatternType;
  minDate?: string; // YYYYMMDD
  maxDate?: string; // YYYYMMDD
  custom?: (value: any) => string | boolean;
}

export const makeRules = (label: string, opts?: MakeRulesOptions) => {
  if (!opts) return {};

  const rulesObj: any = {};
  if (opts.required) rulesObj.required = rules.required(label).message;
  if (opts.min) rulesObj.minLength = rules.minLength(label, opts.min).message; 
  if (opts.max) rulesObj.maxLength =  rules.maxLength(label, opts.max).message; 
  if (opts.patternType) rulesObj.pattern = rules.patternType(label, opts.patternType);
  if (opts.minDate) rulesObj.minDate =  { value: opts.minDate, message: `${label}은(는) 최대 ${opts.max}자 이하이어야 합니다` };
  if (opts.maxDate) rulesObj.maxDate =  { value: opts.maxDate, message: `${label}은(는) 최대 ${opts.max}자 이하이어야 합니다` };
  if (opts.custom) rulesObj.validate = opts.custom;

  
  return rulesObj;
};
