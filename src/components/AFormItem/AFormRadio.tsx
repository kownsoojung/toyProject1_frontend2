import { Radio } from "antd";
import { AFormBaseItem, BaseFormItemProps } from "./AFormBaseItem";
import { MakeRulesOptions } from "@/validation/makeRules";
import { CodeItem, useCode } from "@/hooks/useCode";
import { SiteCodeSearchDTO } from "@/api/generated";

interface RadioItemProps extends BaseFormItemProps {
  name: string;
  makeRule?: MakeRulesOptions;
  options?: CodeItem[];
  selectCode?: SiteCodeSearchDTO;
  props?: React.ComponentProps<typeof Radio.Group>;
}

export const AFormRadio: React.FC<RadioItemProps> = ({
  name,
  label,
  makeRule,
  options,
  selectCode,
  props,
  ...rest
}) => {
  let radioOptions;

  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    radioOptions = codeData?.map(item => ({
      label: item.label ?? "",
      value: item.value ?? "",
    })) ?? [];
  } else {
    radioOptions = options;
  }

  return (
    <AFormBaseItem name={name} label={label} makeRule={makeRule} {...rest}>
      <Radio.Group options={radioOptions} {...props} />
    </AFormBaseItem>
  );
};
