import { Rule } from "antd/es/form";
import { PatternType, rules } from "./validationRules";

export interface MakeRulesOptions {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: {msg? : string, regex : RegExp};
  patternType?: PatternType;
  custom?: any;
}

export const makeRules = (label: string, opts?: MakeRulesOptions): Rule[] => {
  if (!opts) return [];
  const arr: Rule[] = [];
  if (opts.required) arr.push(rules.required(label));
  if (opts.min) arr.push(rules.minLength(label, opts.min));
  if (opts.max) arr.push(rules.maxLength(label, opts.max));
  if (opts.pattern) arr.push(rules.pattern(label, opts.pattern.regex, opts.pattern.msg));
  if (opts.patternType) arr.push(rules.patternType(label, opts.patternType));
  if (opts.custom) arr.push(rules.custom(opts.custom));
  return arr;
};
