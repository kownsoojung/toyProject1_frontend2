import { makeRules, MakeRulesOptions } from "@/validation/makeRules";
import Form, { FormItemProps } from "antd/es/form";
import React from "react";

export interface BaseFormItemProps extends Omit<FormItemProps, "name" | "label" | "children" | "status"> {
  name: string;
  label: string;
  makeRule?: MakeRulesOptions;
  colspan?: number;
  children?: React.ReactNode | ((formValues: any) => React.ReactNode);
  noLabel?:boolean;
}

export const AFormBaseItem: React.FC<BaseFormItemProps> = ({
  name,
  label,
  colspan = 1,
  children,
  makeRule,
  dependencies,
  noLabel=false,
}) => {
  if ( noLabel == true ) colspan +=1;
  return (
    <>
      { !noLabel &&
        <th>
            {makeRule?.required && <span style={{ color: "red", marginRight: 4 }}>*</span>}
            {label}
        </th>
      }
      <td colSpan={colspan}>
        <Form.Item
          name={name}
          label={label}
          rules={makeRules(label,makeRule)}
          help={false}
          noStyle
          dependencies={dependencies}
        >
          {typeof children === "function" ? children : children}
        </Form.Item>
      </td>
    </>
  );
};