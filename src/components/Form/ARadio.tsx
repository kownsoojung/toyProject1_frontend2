import React from "react";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioProps,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CommonCode, useCommonCode } from "@/hooks/useCode";
import { CodeSearchDTO } from "@/api/generated";

interface ARadioProps {
  selectCode?: CodeSearchDTO;
  checkList?: CommonCode[] | CommonCode;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  row?: boolean;
  isDisabledItem?: (item: CommonCode) => boolean;
  options?: RadioProps;
  // 독립 사용을 위한 props
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
}

// 기본 Radio 컴포넌트 (순수 UI)
const ARadioBase: React.FC<ARadioProps> = ({
  selectCode,
  checkList,
  codeType,
  row = true,
  isDisabledItem,
  options,
  value,
  onChange,
  disabled = false,
}) => {
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;
  const list: CommonCode[] = finalCheckList ? Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList] : [];

  return (
    <RadioGroup
      row={row}
      value={value ?? ""}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
    >
      {list.map((item) => (
        <FormControlLabel
          key={item.value}
          value={item.value}
          control={
            <Radio
              disabled={disabled || isDisabledItem?.(item) || item.disabled}
              {...options}
            />
          }
          label={item.label}
        />
      ))}
    </RadioGroup>
  );
};

// Form 래퍼 컴포넌트
interface ARadioFormProps extends Omit<ARadioProps, 'value' | 'onChange' | 'disabled'> {
  name: string;
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

const ARadioForm: React.FC<ARadioFormProps> = ({
  name,
  base,
  ...radioProps
}) => {
  return (
    <AFormBaseItem name={name} {...base}>
      {(field) => (
        <ARadioBase
          {...radioProps}
          value={field.value ?? ""}
          onChange={field.onChange}
        />
      )}
    </AFormBaseItem>
  );
};

// 컴포넌트 합성
export const ARadio = Object.assign(ARadioBase, {
  Form: ARadioForm,
});

