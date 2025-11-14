import React from "react";
import {
  Switch,
  SwitchProps,
  FormControlLabel,
  FormGroup,
  FormControlLabelProps,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks";
import { CodeSearchDTO } from "@/api/generated";

interface ASwitchProps {
  selectCode?: CodeSearchDTO;
  checkList?: CommonCode[] | CommonCode;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CommonCode) => boolean;
  options?: SwitchProps;
  labelOptions?: Omit<FormControlLabelProps, "control" | "label">;
  // 독립 사용을 위한 props
  value?: boolean | (string | number)[];
  changeCallback?: (value: any, event?: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

// 기본 Switch 컴포넌트 (순수 UI)
const ASwitchBase: React.FC<ASwitchProps> = ({
  selectCode,
  checkList = { label: "", value: "" },
  codeType,
  row = true,
  label,
  isDisabledItem,
  options,
  labelOptions,
  value,
  changeCallback,
  disabled = false,
}) => {
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;
  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];

  // 그룹 스위치 (여러 개)
  if (list && list.length > 1) {
    const switchValue: (string | number)[] = (Array.isArray(value) ? value : []) || [];

    const handleChange = (codeId: string | number, e?: React.ChangeEvent<HTMLInputElement>) => {
      if (changeCallback) {
        const newValue = switchValue.includes(codeId)
          ? switchValue.filter((v) => v !== codeId)
          : [...switchValue, codeId];
        changeCallback(newValue, e);
      }
    };

    return (
      <FormGroup row={row}>
        {list.map((item) => (
          <FormControlLabel
            key={item.value}
            control={
              <Switch
                checked={switchValue.includes(item.value)}
                onChange={(e) => handleChange(item.value, e)}
                disabled={disabled || isDisabledItem?.(item) || false}
                {...options}
              />
            }
            label={item.label}
            labelPlacement="start"
            sx={{ marginRight: 0, gap: 0 }}
            {...labelOptions}
          />
        ))}
      </FormGroup>
    );
  }

  // 단일 스위치
  return (
    <FormControlLabel
      control={
        <Switch
          checked={!!value}
          onChange={(e) => {
            if (changeCallback) {
              changeCallback(e.target.checked, e);
            }
          }}
          disabled={disabled}
          {...options}
        />
      }
      label={label || list[0]?.label || ""}
      labelPlacement="start"
      sx={{ marginRight: 0, gap: 0 }}
      {...labelOptions}
    />
  );
};

// Form 래퍼 컴포넌트
interface ASwitchFormProps extends Omit<ASwitchProps, 'value' | 'changeCallback' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  changeCallback?: (value: any, event?: React.ChangeEvent<HTMLInputElement>) => void;
}

const ASwitchForm: React.FC<ASwitchFormProps> = ({
  name,
  base,
  checkList = { label: "", value: "" },
  changeCallback,
  ...switchProps
}) => {
  const codeData = useCommonCode(switchProps.codeType, switchProps.selectCode);
  const finalCheckList = codeData ?? checkList;
  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];
  const isGroup = list && list.length > 1;

  return (
    <AFormBaseItem name={name} {...base}>
      {(field) => {
        const handleChange = (val: any, e?: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(val);              // form 값 반영
          changeCallback?.(val, e);         // 외부 전달
        };
        if (isGroup) {
          return (
            <ASwitchBase
              {...switchProps}
              checkList={finalCheckList}
              value={field.value}
              changeCallback={handleChange}
              disabled={base?.disabled || field.disabled} // ⭐ disabled 전달
            />
          );
        }
        return (
          <ASwitchBase
            {...switchProps}
            value={field.value}
            changeCallback={handleChange}
            disabled={base?.disabled || field.disabled} // ⭐ disabled 전달
          />
        );
      }}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ASwitch = Object.assign(ASwitchBase, {
  Form: ASwitchForm,
});

