import { Input, Select } from "antd";
import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import { MakeRulesOptions } from "@/validation/Validation";
import { CodeItem, useCode } from "@/hooks/useCode";
import { SiteCodeSearchDTO } from "@/api/generated";

interface SelectItemProps extends BaseFormItemProps{
  name:string,
  makeRule?: MakeRulesOptions;
  props?: React.ComponentProps<typeof Select>;
  options?:CodeItem[];
  selectCode?: SiteCodeSearchDTO;     
  disabled?:boolean         
}

export const AFormSelect: React.FC<SelectItemProps> = ({
  name,
  label,
  makeRule,
  options,
  selectCode,
  disabled=false,
  props,
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
      <Select options={selectOptions} disabled={disabled} {...props}/>
    </AFormBaseItem>
  );
};