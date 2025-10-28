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

interface AFormCheckboxProps{
  name:string
  selectCode?: CodeSearchDTO;
  checkList?: CommonCode[] | CommonCode;
  codeType?: "site" | "subCodeZip" | "counselCode" | "counselCategory";
  /** baseProp을 분리해서 별도 전달 가능 */
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CommonCode) => boolean;
  options?:CheckboxProps
}

export const AFormCheckbox: React.FC<AFormCheckboxProps> = ({
  name,
  selectCode,
  checkList={label:"", value:""},
  codeType,
  base,
  row = true,
  label,
  isDisabledItem,
  options
}) => {

  // ✅ 공통 Hook으로 간단하게!
  const codeData = useCommonCode(codeType, selectCode);
  const finalCheckList = codeData ?? checkList;

  const list = Array.isArray(finalCheckList) ? finalCheckList : [finalCheckList]; 

  return (
    <AFormBaseItem name={name} {...base}>
      {(field) => {
        // ✅ 그룹 체크박스
        if (list && list.length > 0) {
          const value: (string | number)[] = field.value || [];

          const handleChange = (codeId: string | number) => {
            const newValue = value.includes(codeId)
              ? value.filter((v) => v !== codeId)
              : [...value, codeId];
            field.onChange(newValue);
          };

          return (
            <FormGroup row={row}>
              {list.map((item) => (
                <FormControlLabel
                  key={item.value}
                  control={
                    <Checkbox
                      checked={value.includes(item.value)}
                      onChange={() => handleChange(item.value)}
                      disabled={isDisabledItem?.(item) || false}
                      {...options}
                    />
                  }
                  label={item.label}
                />
              ))}
            </FormGroup>
          );
        }

        // ✅ 단일 체크박스
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                {...options}
              />
            }
            label={label}
          />
        );
      }}
    </AFormBaseItem>
  );
};

