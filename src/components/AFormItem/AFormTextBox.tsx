import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import TextArea from "antd/es/input/TextArea";
import { MakeRulesOptions } from "@/validation/makeRules";

interface TextBoxItemProps extends BaseFormItemProps {
  name:string,
  makeRule?: MakeRulesOptions;
  rows?:number;
  placeholder?: string;
  maxLength?:number;
  props?: React.ComponentProps<typeof TextArea>;
  showCount?:boolean
}

export const AFormTextBox: React.FC<TextBoxItemProps> = ({
  name,
  label,
  makeRule,
  rows=3,
  placeholder,
  maxLength,
  props,
  showCount=false,
  ...rest
}) => {  

  return (
    <AFormBaseItem
      name={name}
      label={label}
      makeRule={makeRule}
      
      {...rest}
    >
    <TextArea rows={rows} 
      placeholder={placeholder} 
      maxLength={maxLength} 
      {...props} 
      showCount={showCount}
    />
      
    </AFormBaseItem>
  );
};