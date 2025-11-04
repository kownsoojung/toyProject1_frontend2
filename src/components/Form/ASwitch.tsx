import React from "react";
import {
  Switch,
  SwitchProps,
  FormControlLabel,
  FormGroup,
  FormControlLabelProps,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
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
  onChange?: (value: boolean | (string | number)[]) => void;
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
  onChange,
  disabled = false,
}) => {
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;
  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];

  // 그룹 스위치 (여러 개)
  if (list && list.length > 1) {
    const switchValue: (string | number)[] = (Array.isArray(value) ? value : []) || [];

    const handleChange = (codeId: string | number) => {
      if (onChange) {
        const newValue = switchValue.includes(codeId)
          ? switchValue.filter((v) => v !== codeId)
          : [...switchValue, codeId];
        onChange(newValue);
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
                onChange={() => handleChange(item.value)}
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
            if (onChange) {
              onChange(e.target.checked);
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
interface ASwitchFormProps extends Omit<ASwitchProps, 'value' | 'onChange' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ASwitchForm: React.FC<ASwitchFormProps> = ({
  name,
  base,
  checkList = { label: "", value: "" },
  ...switchProps
}) => {
  const codeData = useCommonCode(switchProps.codeType, switchProps.selectCode);
  const finalCheckList = codeData ?? checkList;
  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];
  const isGroup = list && list.length > 1;

  return (
    <AFormBaseItem name={name} {...base}>
      {(field) => {
        if (isGroup) {
          return (
            <ASwitchBase
              {...switchProps}
              checkList={finalCheckList}
              value={field.value}
              onChange={field.onChange}
            />
          );
        }
        return (
          <ASwitchBase
            {...switchProps}
            value={field.value}
            onChange={field.onChange}
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

