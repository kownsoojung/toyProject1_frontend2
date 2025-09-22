import { Rule } from "antd/es/form";
import { PatternType, rules } from "./validationRules";

export interface MakeRulesOptions {
  required?: boolean;
  min?: number;
  max?: number;
  patterns?: PatternType;
  custom?: any;
}

export const makeRules = (label: string, opts?: MakeRulesOptions): Rule[] => {
  if (!opts) return [];
  const arr: Rule[] = [];
  if (opts.required) arr.push(rules.required(label));
  if (opts.min) arr.push(rules.minLength(label, opts.min));
  if (opts.max) arr.push(rules.maxLength(label, opts.max));
  if (opts.patterns) arr.push(rules.patternType(label, opts.patterns));
  if (opts.custom) arr.push(rules.custom(opts.custom));
  return arr;
};
