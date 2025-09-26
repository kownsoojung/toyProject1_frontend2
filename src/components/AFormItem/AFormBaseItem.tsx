import { makeRules, MakeRulesOptions } from "@/validation/makeRules";
import Form, { FormItemProps } from "antd/es/form";
import React from "react";

export interface BaseFormItemProps extends Omit<FormItemProps, "name" | "label" | "children" | "status"> {
  name: string | number | (string | number)[];
  label: string;
  makeRule?: MakeRulesOptions;
  children?: React.ReactNode | ((formValues: any) => React.ReactNode);
  validateTrigger?: FormItemProps["validateTrigger"];
  validateFirst?: boolean;
  shouldUpdate?: FormItemProps["shouldUpdate"];
  tooltip?: FormItemProps["tooltip"];
  extra?: React.ReactNode;
  hasFeedback?: boolean;
}

export const AFormBaseItem: React.FC<BaseFormItemProps> = ({
  name,
  label,
  children,
  makeRule = {},
  dependencies,  
  validateTrigger="onBlur",
  validateFirst,
  shouldUpdate,
  tooltip,
  extra,
  hasFeedback,
  hidden=false,
}) => {
  
  return (
        //<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Form.Item
          name={name}
          label={label}
          rules={makeRules(label,makeRule)}
          help={false}
          noStyle
          dependencies={dependencies}
          validateTrigger={validateTrigger}
          validateFirst={validateFirst}
          shouldUpdate={shouldUpdate}
          tooltip={tooltip}
          extra={extra}
          hasFeedback={hasFeedback}
          hidden={hidden}
        >
          {typeof children === "function" ? children : children}
        </Form.Item>
        //</div>
  );
};