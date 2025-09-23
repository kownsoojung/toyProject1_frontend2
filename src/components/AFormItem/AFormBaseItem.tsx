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
  validateTrigger?: FormItemProps["validateTrigger"];
  validateFirst?: boolean;
  shouldUpdate?: FormItemProps["shouldUpdate"];
  tooltip?: FormItemProps["tooltip"];
  extra?: React.ReactNode;
  hasFeedback?: boolean;
  hidden?:boolean;  
  extraContent?: React.ReactNode;
}

export const AFormBaseItem: React.FC<BaseFormItemProps> = ({
  name,
  label,
  colspan = 1,
  children,
  makeRule = {},
  dependencies,
  noLabel=false,
  validateTrigger="onBlur",
  validateFirst,
  shouldUpdate,
  tooltip,
  extra,
  hasFeedback,
  hidden=false,
  extraContent
}) => {
  if ( noLabel == true ) colspan +=1;
  return (
    <React.Fragment key={name}>
      { !noLabel &&
        <th>
            {hidden == false && 
              <>
                {makeRule.required && <span style={{ color: "red", marginRight: 4 }}>*</span>}
                {label}
              </>
            }
        </th>
      }
      <td colSpan={colspan}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
        {typeof extraContent === "function" ? extraContent : extraContent}
        </div>
      </td>
    </React.Fragment>
  );
};