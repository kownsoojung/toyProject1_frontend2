import { PatternType } from "@/validation/validationRules";
import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import TextArea from "antd/es/input/TextArea";
import { MakeRulesOptions } from "@/validation/makeRules";

interface TextBoxItemProps extends BaseFormItemProps {
  makeRule?: MakeRulesOptions;
  colspan?: number;
  children: React.ReactNode | ((formValues: any) => React.ReactNode);
  rows?:number
}

export const AFormTextBox: React.FC<TextBoxItemProps> = ({
  name,
  label,
  makeRule,
  colspan,
  children,
  rows=3,
  
}) => {  
  const inputElement = <TextArea rows={rows}/>
  return (
    <AFormBaseItem
      name={name}
      label={label}
      makeRule={makeRule}
      colspan={colspan}
    >
      {inputElement}
      
    </AFormBaseItem>
  );
};