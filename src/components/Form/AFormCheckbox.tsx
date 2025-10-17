import React from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { AFormBaseItem, AFormBaseItemProps } from "./AFormBaseItem";
import { CodeItem, useCode } from "@/hooks/useCode";

interface AFormCheckboxProps{
  name:string
  selectCode?: SiteCodeSearchDTO;
  checkList?: CodeItem[] | CodeItem;
  /** baseProp을 분리해서 별도 전달 가능 */
  base?: Omit<AFormBaseItemProps, "name" | "children">;
  row?: boolean;
  label?: string;
  isDisabledItem?: (item: CodeItem) => boolean;
  options?:CheckboxProps
}

export const AFormCheckbox: React.FC<AFormCheckboxProps> = ({
  name,
  selectCode,
  checkList={label:"", value:""},
  base,
  row = true,
  label,
  isDisabledItem,
  options
}) => {

  
  // ✅ 선택 코드 훅으로 자동 checkList 가져오기 (있으면)
  if (selectCode) {
    const { data: codeData } = useCode(selectCode);
    // codeData가 배열이면 map으로 변환
    checkList = codeData?.map(item => ({
      label: item.label ?? "",   // undefined일 경우 빈 문자열
      value: item.value ?? "", // undefined일 경우 빈 문자열
      parent: item.parent?? "",
      disabled:false
    })) ?? [];
  } 

  const list = Array.isArray(checkList) ? checkList : [checkList]; 

  return (
    <AFormBaseItem name={name} {...base}>
      {(field, error) => {
        // ✅ 그룹 체크박스
        if (list && list.length > 0) {
          const value: string[] = field.value || [];

          const handleChange = (codeId: string) => {
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
                {...rest}
              />
            }
            label={label}
          />
        );
      }}
    </AFormBaseItem>
  );
};

