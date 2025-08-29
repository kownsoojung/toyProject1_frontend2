import { Form } from "antd";
import { Rule, RuleObject } from "antd/es/form";
import { rules as validationRules } from "@/validation/validationRules";
import { StoreValue } from "antd/es/form/interface";


interface AfromItemProps {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message?: string };
  customValidator?: (rule: RuleObject, value: StoreValue) => Promise<void>;
  children: React.ReactNode;
}

export default function AFormItem({
  name,
  label,
  required,
  minLength,
  maxLength,
  pattern,
  customValidator,
  children,
}: AfromItemProps) {
  const appliedRules: Rule[] = [];
  if (required) appliedRules.push(validationRules.required(label));
  if (minLength) appliedRules.push(validationRules.minLength(label, minLength));
  if (maxLength) appliedRules.push(validationRules.maxLength(label, maxLength));
  if (pattern) appliedRules.push(validationRules.pattern(label, pattern.regex, pattern.message));
  if (customValidator) appliedRules.push(validationRules.custom(customValidator));

  return <Form.Item name={name} label={label} rules={appliedRules}>{children}</Form.Item>;
}
  
  