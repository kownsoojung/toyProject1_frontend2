import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import TextArea from "antd/es/input/TextArea";
import { MakeRulesOptions } from "@/validation/Validation";
import { Checkbox, CheckboxOptionType, Row } from "antd";
import { useCode } from "@/hooks/useCode";

interface ItemProps extends BaseFormItemProps {
  name:string,
  makeRule?: MakeRulesOptions;
  props?: React.ComponentProps<typeof Checkbox>;
  options?:CheckboxOptionType<string>[];
  codeData?: SiteCodeSearchDTO;  
  defaultValue?:[];
  disabled?:boolean;
}

export const AFormCheckboxGroup: React.FC<ItemProps> = ({
  name,
  label,
  makeRule,
  props,
  options,
  codeData,
  disabled=false,
  defaultValue=[],
  ...rest
}) => {  

  let selectOptions;

  if (selectCode) {
      const { data: codeData } = useCode(selectCode);
      // codeData가 배열이면 map으로 변환
      selectOptions = codeData?.map(item => ({
        label: item.label ?? "",   // undefined일 경우 빈 문자열
        value: item.value ?? "", // undefined일 경우 빈 문자열
      })) ?? [];
    } else {
      selectOptions = options; // 기존 옵션 사용
    }

  return (
    <AFormBaseItem
      name={name}
      label={label}
      makeRule={makeRule}
      
      {...rest}
    >
    <Checkbox.Group
      defaultValue={defaultValue}
      options={selectOptions}
      disabled={disabled}
    >   
    </Checkbox.Group>
    </AFormBaseItem>
  );
};