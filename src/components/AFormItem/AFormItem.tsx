import { Form, Input } from "antd";
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Rule, RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
import { rules as validationRules } from "@/validation/validationRules";
import styles from "./AFormItem.module.css";

interface AFormItemProps {
  name: string;
  label: string;
  type?: "text" | "password";      // 추가
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: { regex: RegExp; message?: string };
  customValidator?: (rule: RuleObject, value: StoreValue) => Promise<void>;
  placeholder?: string;            // 추가
  maxLengthInput?: number;         // 추가
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
  if (pattern) appliedRules.push(validationRules.pattern(label, pattern.regex, pattern.message));
  if (customValidator) appliedRules.push(validationRules.custom(customValidator));

  // Input 요소 선택
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
        prefix={<UserOutlined />}
      />
    );

  return (
     <div className={styles["aform-item-container"]}>
    <label className={styles["aform-item-label"]}>{label}</label>
    <Form.Item name={name} rules={appliedRules} noStyle>
      <div className={styles["aform-item-input"]}>
        {inputElement}
      </div>
    </Form.Item>
  </div>
  );
}
