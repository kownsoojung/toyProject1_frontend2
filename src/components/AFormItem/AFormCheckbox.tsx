import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import TextArea from "antd/es/input/TextArea";
import { MakeRulesOptions } from "@/validation/Validation";
import { Checkbox, CheckboxOptionType, Row } from "antd";
import { useCode } from "@/hooks/useCode";

interface ItemProps extends BaseFormItemProps {
  name:string,
  makeRule?: MakeRulesOptions;
  props?: React.ComponentProps<typeof Checkbox>;
  value:(string | number | boolean)
  disabled?:boolean;
}

export const AFormCheckbox: React.FC<ItemProps> = ({
  name,
  label,
  makeRule,
  props,
  disabled=false,
  value,
  ...rest
}) => {  

  
  return (
    <AFormBaseItem
      name={name}
      label={label}
      makeRule={makeRule}
      {...rest}
    >
    <Checkbox 
        disabled={disabled}
        value={value}
    >
        {label}
    </Checkbox>
    </AFormBaseItem>
  );
};