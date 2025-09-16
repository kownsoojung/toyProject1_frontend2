import { Form, Input, notification } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { Rule, RuleObject } from "antd/es/form";
import { StoreValue } from "antd/es/form/interface";
import { rules as validationRules, PatternType } from "@/validation/validationRules";
import styles from "./AFormItem.module.css";

interface PatternConfig {
  type: PatternType;
  message?: string;
}

interface AFormItemProps {
  name: string;
  label: string;
  type?: "text" | "password";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: PatternType;
  customValidator?: (rule: RuleObject, value: StoreValue) => Promise<void>;
  placeholder?: string;
  maxLengthInput?: number;
  colspan?:number ;
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
  colspan=1

}: AFormItemProps) {
  const appliedRules: Rule[] = [];

  if (required) appliedRules.push(validationRules.required(label));
  if (minLength) appliedRules.push(validationRules.minLength(label, minLength));
  if (maxLength) appliedRules.push(validationRules.maxLength(label, maxLength));
  if (pattern) appliedRules.push(validationRules.patternType(label, pattern));

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
    <>
    <td style={{ backgroundColor: "#f5f5f5", border: "1px solid #d9d9d9", padding: 8}}>
         {required && <span style={{ color: "red", marginRight: 4 }}>*</span>}
        {label}
      </td>
      <td style={{ border: "1px solid #d9d9d9", padding: 8 }} colSpan={colspan}>
        <Form.Item
      name={name}
      label={label}
      rules={appliedRules}
      help={false} // 아래 help 영역 숨김
      style={{ marginBottom: 0 }} 
      noStyle
    >
        {inputElement}
        </Form.Item>
      </td>
       
    </> 
 

  );
}
