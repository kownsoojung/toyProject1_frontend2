import React from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { CodeSearchDTO } from "@/api/generated";

interface ACheckboxProps {
  selectCode?: CodeSearchDTO;
  checkList?: CommonCode[] | CommonCode;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CommonCode) => boolean;
  options?: CheckboxProps;
  // 독립 사용을 위한 props
  value?: boolean | (string | number)[];
  onChange?: (value: boolean | (string | number)[]) => void;
  disabled?: boolean;
}

// 기본 Checkbox 컴포넌트 (순수 UI)
const ACheckboxBase: React.FC<ACheckboxProps> = ({
  selectCode,
  checkList = { label: "", value: "" },
  codeType,
  row = true,
  label,
  isDisabledItem,
  options,
  value,
  onChange,
  disabled = false,
}) => {
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;
  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];

  // 그룹 체크박스
  if (list && list.length > 0) {
    const checkboxValue: (string | number)[] = (Array.isArray(value) ? value : []) || [];

    const handleChange = (codeId: string | number) => {
      if (onChange) {
        const newValue = checkboxValue.includes(codeId)
          ? checkboxValue.filter((v) => v !== codeId)
          : [...checkboxValue, codeId];
        onChange(newValue);
      }
    };

    return (
      <FormGroup row={row}>
        {list.map((item) => (
          <FormControlLabel
            key={item.value}
            control={
              <Checkbox
                checked={checkboxValue.includes(item.value)}
                onChange={() => handleChange(item.value)}
                disabled={disabled || isDisabledItem?.(item) || false}
                {...options}
              />
            }
            label={item.label}
          />
        ))}
      </FormGroup>
    );
  }

  // 단일 체크박스
  return (
    <FormControlLabel
      control={
        <Checkbox
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
      label={label}
    />
  );
};

// Form 래퍼 컴포넌트
interface ACheckboxFormProps extends Omit<ACheckboxProps, 'value' | 'onChange' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ACheckboxForm: React.FC<ACheckboxFormProps> = ({
  name,
  base,
  checkList = { label: "", value: "" },
  ...checkboxProps
}) => {
  const codeData = useCommonCode(checkboxProps.codeType, checkboxProps.selectCode);
  const finalCheckList = codeData ?? checkList;
  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList];
  const isGroup = list && list.length > 0;

  return (
    <AFormBaseItem name={name} {...base}>
      {(field) => {
        if (isGroup) {
          return (
            <ACheckboxBase
              {...checkboxProps}
              checkList={finalCheckList}
              value={field.value}
              onChange={field.onChange}
            />
          );
        }
        return (
          <ACheckboxBase
            {...checkboxProps}
            value={field.value}
            onChange={field.onChange}
          />
        );
      }}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ACheckbox = Object.assign(ACheckboxBase, {
  Form: ACheckboxForm,
});

