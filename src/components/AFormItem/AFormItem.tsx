import { Form, Input, Tooltip } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Rule, RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
import { rules as validationRules } from "@/validation/validationRules";
import styles from "./AFormItem.module.css";

type PatternType = "numalpha" | "email" | "phone";

const predefinedPatterns: Record<PatternType, { regex: RegExp; message: string }> = {
  numalpha: { regex: /^[A-Za-z0-9]+$/, message: "{label}은(는) 숫자/영문 조합만 가능합니다" },
  email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "{label} 형식이 올바르지 않습니다" },
  phone: { regex: /^\d{2,3}-\d{3,4}-\d{4}$/, message: "{label} 형식이 올바르지 않습니다" },
};

interface AFormItemProps {
  name: string;
  label: string;
  type?: "text" | "password"; 
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: PatternType;           // 변경: 이제 string 타입
  customValidator?: (rule: RuleObject, value: StoreValue) => Promise<void>;
  placeholder?: string;
  maxLengthInput?: number;
}

export default function AFormItem({
  name,
  label,
  type = "text",
  required,
  minLength,
  maxLength,
  pattern,
  customValidator,
  placeholder,
  maxLengthInput,
}: AFormItemProps) {

  
  const appliedRules: Rule[] = [];
  if (required) appliedRules.push(validationRules.required(label));
  if (minLength) appliedRules.push(validationRules.minLength(label, minLength));
  if (maxLength) appliedRules.push(validationRules.maxLength(label, maxLength));

  // pattern 타입에 따라 자동 메시지 적용
  if (pattern) {
    const { regex, message } = predefinedPatterns[pattern];
    appliedRules.push(validationRules.pattern(label, regex, message.replace("{label}", label)));
  }

  if (customValidator) appliedRules.push(validationRules.custom(customValidator));

  const inputElement =
    type === "password" ? (
      <Input.Password
        placeholder={placeholder}
        maxLength={maxLengthInput}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
    ) : (
      <Input
        placeholder={placeholder}
        maxLength={maxLengthInput}
      />
    );

  return (
    <Form.Item name={name} rules={appliedRules} label={label} help={false} style={{ marginBottom: 8 }} validateTrigger="onBlur">
      {inputElement}
    </Form.Item>
  );
}
