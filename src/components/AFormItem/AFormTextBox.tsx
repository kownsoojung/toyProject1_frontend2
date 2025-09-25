import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import TextArea from "antd/es/input/TextArea";
import { MakeRulesOptions } from "@/validation/makeRules";

interface TextBoxItemProps extends BaseFormItemProps {
  makeRule?: MakeRulesOptions;
  children: React.ReactNode | ((formValues: any) => React.ReactNode);
  rows?:number;
  placeholder?: string;
  props?: React.ComponentProps<typeof TextArea>;
}

export const AFormTextBox: React.FC<TextBoxItemProps> = ({
  name,
  label,
  makeRule,
  children,
  rows=3,
  placeholder,
  props,
  ...rest
}) => {  
  const inputElement = <TextArea rows={rows} placeholder={placeholder}  {...props} />
  return (
    <AFormBaseItem
      name={name}
      label={label}
      makeRule={makeRule}
      {...rest}
    >
      {inputElement}
      
    </AFormBaseItem>
  );
};